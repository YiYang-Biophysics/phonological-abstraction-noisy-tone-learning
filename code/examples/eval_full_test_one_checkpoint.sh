#!/usr/bin/env bash
set -euo pipefail

# Template only. Requires externally hosted checkpoints and AISHELL-derived manifests.
python -m emnlp_tone.cli eval-full-test \
  --checkpoint /path/to/checkpoint_best.pt \
  --manifest-dir /path/to/manifest \
  --output-csv outputs/full_test_one_checkpoint.csv

