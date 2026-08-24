# Code

This directory is the public-facing code area for the EMNLP 2026 Findings release.

The current repository intentionally separates:

- lightweight scripts that are ready to run locally;
- cleaned command templates for future training/evaluation entry points;
- original SCOW/Linguistics implementation references documented in `../docs/ORIGINAL_CODE_INDEX.md`.

## Ready-to-run utilities

Current runnable utilities live in `../scripts/`:

- `run_dashboard.py`: serves the static dashboard.
- `validate_release.py`: validates data counts and release hygiene.
- `audit_checkpoints.py`: builds checkpoint inventory CSVs without copying tensors.

## Planned public entry points

```text
code/
  data_preparation/   # AISHELL manifest, scale subsets, label noise
  training/           # wav2vec2.0, HuBERT, random-init, frozen-feature commands
  evaluation/         # best checkpoint, trajectory, memorization, perturbation probes
  analysis/           # result-table and paper-figure builders
  cluster/            # Slurm templates with private paths removed
```

Do not copy private SCOW scripts here verbatim. Clean each script by replacing private paths, GPU IDs, and environment assumptions with arguments or config values.

