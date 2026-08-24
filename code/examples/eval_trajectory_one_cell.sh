#!/usr/bin/env bash
set -euo pipefail

# Template only. Requires an epoch-wise checkpoint directory.
python -m emnlp_tone.cli eval-trajectory \
  --checkpoint-dir /path/to/checkpoints \
  --manifest-dir /path/to/manifest \
  --scale-pct 5 \
  --noise-ratio-pct 70 \
  --output-csv outputs/scale_5pct_ratio_70pct.csv

