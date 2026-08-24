#!/usr/bin/env bash
set -euo pipefail

# Template only. Requires perturbation manifests and an external checkpoint.
python -m emnlp_tone.cli perturb-eval \
  --checkpoint /path/to/checkpoint_best.pt \
  --manifest-root /path/to/perturbation/manifests \
  --scale-pct 100 \
  --noise-ratio-pct 70 \
  --checkpoint-kind best \
  --output-csv outputs/perturbation_one_setting.csv

