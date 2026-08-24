#!/usr/bin/env bash
set -euo pipefail

# Template only. Replace paths and verify hyperparameters before running.
python -m emnlp_tone.cli train \
  --config code/configs/scale_noise_grid.example.yaml \
  --paths code/configs/paths.example.yaml \
  --scale-pct 5 \
  --noise-ratio-pct 70 \
  --output-dir outputs/scale_5pct_ratio_70pct

