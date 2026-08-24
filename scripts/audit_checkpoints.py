#!/usr/bin/env python3
"""Audit checkpoint files without loading tensor payloads by default.

The script is intentionally conservative: it scans checkpoint-like files,
records sizes and naming metadata, and detects obvious best/last/epoch alias
candidates by directory and file size. It does not rewrite or compress files.
"""

from __future__ import annotations

import argparse
import csv
import os
import re
from collections import Counter, defaultdict
from pathlib import Path


CHECKPOINT_SUFFIXES = {".pt", ".pth", ".ckpt", ".bin", ".safetensors"}
EPOCH_RE = re.compile(r"checkpoint(?:_)?(\d+)\.(?:pt|pth|ckpt)$")


def format_gib(num_bytes: int) -> str:
    return f"{num_bytes / (1024 ** 3):.3f}"


def classify_name(name: str) -> tuple[str, str]:
    lower = name.lower()
    if lower in {"checkpoint_best.pt", "checkpoint-best.pt"}:
        return "best", ""
    if lower in {"checkpoint_last.pt", "checkpoint-last.pt"}:
        return "last", ""
    if lower.startswith("checkpoint.best_accuracy"):
        return "best_accuracy", ""
    match = EPOCH_RE.match(lower)
    if match:
        return "epoch", match.group(1)
    if "best" in lower:
        return "best_other", ""
    if "last" in lower:
        return "last_other", ""
    return "other", ""


def iter_files(root: Path):
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in CHECKPOINT_SUFFIXES:
            yield path


def scan_roots(roots: list[Path], label: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for root in roots:
        root = root.expanduser().resolve()
        if not root.exists():
            continue
        for path in iter_files(root):
            stat = path.stat()
            kind, epoch = classify_name(path.name)
            rows.append(
                {
                    "source": label,
                    "scan_root": str(root),
                    "relative_path": str(path.relative_to(root)),
                    "absolute_path": str(path),
                    "parent_dir": str(path.parent),
                    "filename": path.name,
                    "suffix": path.suffix.lower(),
                    "checkpoint_kind": kind,
                    "epoch": epoch,
                    "size_bytes": str(stat.st_size),
                    "size_gib": format_gib(stat.st_size),
                    "mtime_unix": str(int(stat.st_mtime)),
                    "device": str(stat.st_dev),
                    "inode": str(stat.st_ino),
                }
            )
    return rows


def add_alias_candidates(rows: list[dict[str, str]]) -> None:
    by_dir: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        by_dir[row["parent_dir"]].append(row)

    for group in by_dir.values():
        by_size = defaultdict(list)
        by_inode = defaultdict(list)
        for row in group:
            by_size[row["size_bytes"]].append(row)
            by_inode[(row["device"], row["inode"])].append(row)

        for row in group:
            candidates = []
            if row["checkpoint_kind"] in {"best", "last", "best_accuracy", "best_other", "last_other"}:
                for other in by_size[row["size_bytes"]]:
                    if other is row:
                        continue
                    if other["checkpoint_kind"] == "epoch":
                        candidates.append(other["filename"])
            row["same_size_epoch_candidates"] = "|".join(sorted(candidates))

            hardlinks = [
                other["filename"]
                for other in by_inode[(row["device"], row["inode"])]
                if other is not row
            ]
            row["hardlink_aliases"] = "|".join(sorted(hardlinks))


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    fieldnames = [
        "source",
        "scan_root",
        "relative_path",
        "absolute_path",
        "parent_dir",
        "filename",
        "suffix",
        "checkpoint_kind",
        "epoch",
        "size_bytes",
        "size_gib",
        "mtime_unix",
        "device",
        "inode",
        "same_size_epoch_candidates",
        "hardlink_aliases",
    ]
    with path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_summary(path: Path, rows: list[dict[str, str]]) -> None:
    total_size = sum(int(row["size_bytes"]) for row in rows)
    by_kind = Counter(row["checkpoint_kind"] for row in rows)
    by_root = defaultdict(lambda: [0, 0])
    by_suffix = defaultdict(lambda: [0, 0])
    by_source = defaultdict(lambda: [0, 0])
    alias_rows = [row for row in rows if row.get("same_size_epoch_candidates")]
    hardlink_rows = [row for row in rows if row.get("hardlink_aliases")]

    for row in rows:
        size = int(row["size_bytes"])
        by_root[row["scan_root"]][0] += 1
        by_root[row["scan_root"]][1] += size
        by_suffix[row["suffix"]][0] += 1
        by_suffix[row["suffix"]][1] += size
        by_source[row["source"]][0] += 1
        by_source[row["source"]][1] += size

    lines = [
        "# Checkpoint Audit Summary",
        "",
        "This summary was generated from filesystem metadata only. It does not load or modify checkpoint tensors.",
        "",
        f"- Total files: {len(rows)}",
        f"- Total apparent size: {format_gib(total_size)} GiB",
        f"- Best/last files with same-size epoch candidates: {len(alias_rows)}",
        f"- Files with hardlink aliases: {len(hardlink_rows)}",
        "",
        "## By Source",
        "",
        "| Source | Files | Size GiB |",
        "| --- | ---: | ---: |",
    ]
    for source, (count, size) in sorted(by_source.items()):
        lines.append(f"| `{source}` | {count} | {format_gib(size)} |")

    lines += ["", "## By Checkpoint Kind", "", "| Kind | Files |", "| --- | ---: |"]
    for kind, count in sorted(by_kind.items()):
        lines.append(f"| `{kind}` | {count} |")

    lines += ["", "## By Suffix", "", "| Suffix | Files | Size GiB |", "| --- | ---: | ---: |"]
    for suffix, (count, size) in sorted(by_suffix.items()):
        lines.append(f"| `{suffix}` | {count} | {format_gib(size)} |")

    lines += ["", "## By Scan Root", "", "| Root | Files | Size GiB |", "| --- | ---: | ---: |"]
    for root, (count, size) in sorted(by_root.items()):
        lines.append(f"| `{root}` | {count} | {format_gib(size)} |")

    lines += [
        "",
        "## Release Compression Notes",
        "",
        "- Remove optimizer/scheduler states before publishing evaluation checkpoints.",
        "- Deduplicate `checkpoint_best.pt` and `checkpoint_last.pt` when they are aliases of epoch checkpoints.",
        "- Consider optional fp16/bf16 `safetensors` for evaluation-only release after verifying metrics.",
        "- Keep full epoch-wise checkpoint collections in external storage, not Git.",
    ]
    path.write_text("\n".join(lines) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-label", default="local")
    parser.add_argument("--output-csv", required=True)
    parser.add_argument("--summary-md", required=True)
    parser.add_argument("roots", nargs="+")
    args = parser.parse_args()

    roots = [Path(root) for root in args.roots]
    rows = scan_roots(roots, args.source_label)
    add_alias_candidates(rows)
    write_csv(Path(args.output_csv), rows)
    write_summary(Path(args.summary_md), rows)
    print(f"wrote {len(rows)} rows to {args.output_csv}")
    print(f"wrote summary to {args.summary_md}")


if __name__ == "__main__":
    main()

