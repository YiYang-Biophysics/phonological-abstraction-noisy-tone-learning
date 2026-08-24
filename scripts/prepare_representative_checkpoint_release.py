#!/usr/bin/env python3
"""Stage representative checkpoint binaries and compute checksums.

This script expects a private file list with real source paths. The public
repository does not include checkpoint binaries or private server paths.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import shutil
from pathlib import Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--filelist",
        type=Path,
        default=Path("local_private/checkpoint_release/representative_checkpoint_filelist_with_paths.csv"),
        help="Private CSV with absolute source paths and planned relative paths.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("local_private/checkpoint_release/staged_representative_checkpoints"),
        help="Directory where checkpoint files will be copied.",
    )
    parser.add_argument(
        "--manifest-out",
        type=Path,
        default=Path("local_private/checkpoint_release/staged_representative_checkpoints_manifest.csv"),
        help="Output CSV with staged paths and SHA256 checksums.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report the planned copy operations without copying files.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.filelist.exists():
        raise FileNotFoundError(args.filelist)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.manifest_out.parent.mkdir(parents=True, exist_ok=True)

    staged_rows = []
    with args.filelist.open(newline="") as handle:
        rows = list(csv.DictReader(handle))

    for row in rows:
        src = Path(row["absolute_path"])
        dst = args.output_dir / row["planned_relative_path"]
        exists = src.exists()
        row_out = dict(row)
        row_out["source_exists"] = str(exists)
        row_out["staged_path"] = str(dst)
        row_out["sha256"] = ""

        if exists and not args.dry_run:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            row_out["sha256"] = sha256_file(dst)

        staged_rows.append(row_out)

    fieldnames = list(staged_rows[0].keys()) if staged_rows else []
    if fieldnames:
        with args.manifest_out.open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(staged_rows)

    total_bytes = sum(int(row["size_bytes"]) for row in staged_rows if row.get("size_bytes"))
    print(f"Rows: {len(staged_rows)}")
    print(f"Planned size: {total_bytes / (1024 ** 3):.3f} GiB")
    print(f"Output: {args.output_dir}")
    print(f"Manifest: {args.manifest_out}")
    if args.dry_run:
        missing = sum(row["source_exists"] != "True" for row in staged_rows)
        print(f"Dry run complete; missing sources: {missing}")


if __name__ == "__main__":
    main()
