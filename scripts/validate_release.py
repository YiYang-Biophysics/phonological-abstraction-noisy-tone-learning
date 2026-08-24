#!/usr/bin/env python3
"""Validate the local EMNLP release staging package."""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

EXPECTED_SCALES = [1, 2, 3, 5, 10, 50, 100]
EXPECTED_NOISE = list(range(0, 100, 10))
FORBIDDEN_SUFFIXES = {".pt", ".pth", ".ckpt", ".wav", ".flac", ".mp3", ".m4a", ".zip"}
PRIVATE_PATTERNS = [
    re.compile(r"/Users/yiyang"),
    re.compile(r"/home/(yangyi|hsss|jiahongyuangroup)"),
    re.compile(r"/mnt/hd/data_yangyi"),
    re.compile(r"SWANLAB_API_KEY\s*="),
    re.compile(r"CUDA_VISIBLE_DEVICES\s*="),
]


def fail(message: str) -> None:
    print(f"[FAIL] {message}")
    sys.exit(1)


def ok(message: str) -> None:
    print(f"[OK] {message}")


def check_required_files() -> None:
    required = [
        "README.md",
        ".gitignore",
        "index.html",
        ".nojekyll",
        "dashboard/index.html",
        "dashboard/app.js",
        "dashboard/styles.css",
        "dashboard/embedded_data.js",
        "dashboard/trajectory_manifest.json",
        "data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv",
        "data/acoustic_perturbation_probe/all_settings_summary.csv",
        "data/appendix_results/capacity/depth_truncation_full_test_accuracy.csv",
        "data/appendix_results/capacity/bottleneck_full_test_checkpoint_best_long.csv",
        "data/appendix_results/capacity/bottleneck_full_test_checkpoint_best_matrix.csv",
        "data/appendix_results/hubert/hubert_scale10_best_by_valid_summary.csv",
        "data/appendix_results/hubert/hubert_scale10_memorization_trajectory_all.csv",
        "data/appendix_results/perturbation_ablation/noise_ablation_scale100_ratio10_70_summary.csv",
        "docs/RELEASE_AUDIT.md",
        "docs/EXPERIMENTS.md",
        "docs/PAPER_RESULTS_MAP.md",
        "docs/DATA.md",
        "docs/CHECKPOINTS.md",
        "metadata/paper_result_map.csv",
        "metadata/checkpoint_manifest.csv",
        "metadata/checkpoint_inventory_summary.md",
        "metadata/code_manifest.csv",
    ]
    missing = [path for path in required if not (ROOT / path).exists()]
    if missing:
        fail("missing required files: " + ", ".join(missing))
    ok("required files present")


def check_heatmap() -> None:
    path = ROOT / "data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv"
    with path.open(newline="") as f:
        rows = list(csv.DictReader(f))
    if len(rows) != 10:
        fail(f"expected 10 heatmap rows, found {len(rows)}")
    expected_columns = ["label_noise_ratio_pct"] + [f"scale_{scale}pct" for scale in EXPECTED_SCALES]
    if rows and list(rows[0].keys()) != expected_columns:
        fail("unexpected heatmap columns")
    ok("scale-noise heatmap shape is 10 x 7")


def check_trajectories() -> None:
    folder = ROOT / "data/epoch_wise_learning_trajectories"
    files = sorted(folder.glob("scale_*pct_ratio_*pct.csv"))
    if len(files) != 70:
        fail(f"expected 70 trajectory CSVs, found {len(files)}")
    expected = {f"scale_{scale}pct_ratio_{noise}pct.csv" for scale in EXPECTED_SCALES for noise in EXPECTED_NOISE}
    found = {path.name for path in files}
    missing = sorted(expected - found)
    extra = sorted(found - expected)
    if missing or extra:
        fail(f"trajectory mismatch; missing={missing}; extra={extra}")
    ok("trajectory grid has all 70 scale/noise CSVs")


def check_perturbation() -> None:
    path = ROOT / "data/acoustic_perturbation_probe/all_settings_summary.csv"
    with path.open(newline="") as f:
        rows = list(csv.DictReader(f))
    settings = {(row["scale"], row["ratio"]) for row in rows}
    if len(settings) != 63:
        fail(f"expected 63 nonzero-noise perturbation settings, found {len(settings)}")
    checkpoint_kinds = {row["checkpoint_kind"] for row in rows}
    if checkpoint_kinds != {"best", "last"}:
        fail(f"unexpected perturbation checkpoint kinds: {checkpoint_kinds}")
    ok("perturbation summary has 63 settings with best/last rows")


def check_large_and_private_files() -> None:
    offenders = []
    for path in ROOT.rglob("*"):
        if "local_private" in path.parts:
            continue
        if path.is_file() and path.suffix.lower() in FORBIDDEN_SUFFIXES:
            offenders.append(str(path.relative_to(ROOT)))
    if offenders:
        fail("forbidden large/private artifacts found: " + ", ".join(offenders[:20]))
    ok("no forbidden weight/audio/archive suffixes found")

    text_offenders = []
    for path in ROOT.rglob("*"):
        if "local_private" in path.parts:
            continue
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".md", ".csv", ".js", ".html", ".css", ".py", ".txt", ".env", ".json"}:
            continue
        try:
            text = path.read_text(errors="ignore")
        except OSError:
            continue
        for pattern in PRIVATE_PATTERNS:
            if pattern.search(text):
                text_offenders.append(str(path.relative_to(ROOT)))
                break
    allowed = {
        "docs/RELEASE_AUDIT.md",
        "metadata/checkpoint_manifest.csv",
        "metadata/code_manifest.csv",
        "scripts/validate_release.py",
    }
    unexpected = []
    for offender in sorted(set(text_offenders) - allowed):
        unexpected.append(offender)
    if unexpected:
        fail("unexpected private path patterns found: " + ", ".join(unexpected))
    ok("private path patterns limited to audit/manifests")


def main() -> None:
    check_required_files()
    check_heatmap()
    check_trajectories()
    check_perturbation()
    check_large_and_private_files()
    ok("release staging validation passed")


if __name__ == "__main__":
    main()
