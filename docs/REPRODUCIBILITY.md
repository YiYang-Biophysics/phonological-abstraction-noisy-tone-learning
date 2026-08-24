# REPRODUCIBILITY

This staging repository prioritizes transparent result browsing and safe release preparation. It is not yet a fully independent training reproduction package.

## What Can Be Reproduced Immediately

- Open the static dashboard from `dashboard/index.html`.
- Validate the staged data inventory with `python3 scripts/validate_release.py`.
- Inspect the released CSVs used for the dashboard.

## What Still Requires Cleanup

- end-to-end AISHELL-1 preprocessing commands;
- SCOW/Linguistics Slurm scripts with private paths replaced by arguments/configs;
- centralized experiment configs for training hyperparameters;
- external checkpoint URLs and checksums;
- plotting scripts for paper PDF figures.

## Reproducibility Principle

Do not rewrite training or evaluation logic for style. When cleaning scripts, preserve the exact experimental behavior and record any unresolved setting as:

```text
unknown / not explicitly recorded
```

## Minimal Local Check

```bash
python3 scripts/validate_release.py
python3 scripts/run_dashboard.py
```
