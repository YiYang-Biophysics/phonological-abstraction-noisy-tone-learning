# EXPERIMENTS

This file maps paper experiments to released data and known implementation references.

See `docs/ORIGINAL_CODE_INDEX.md` for the release-safe index of original implementation entry points. Public code skeletons are under `code/`.

| Paper component | Experiment | Released result | Implementation reference | Release status |
| --- | --- | --- | --- | --- |
| Main text | Scale-noise landscape | `data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv` | `docs/ORIGINAL_CODE_INDEX.md#main-scale-noise-training` | result staged; cleaned training entry pending |
| Main text | Epoch-wise learning trajectories | `data/epoch_wise_learning_trajectories/*.csv` | `docs/ORIGINAL_CODE_INDEX.md#epoch-wise-trajectories` | result staged; cleaned evaluation entry pending |
| Main text | Acoustic perturbation probe | `data/acoustic_perturbation_probe/all_settings_summary.csv` | `docs/ORIGINAL_CODE_INDEX.md#acoustic-perturbation-probe` | result staged; cleaned perturbation entry pending |
| Appendix | HuBERT scale-10 control | `data/appendix_results/hubert/` | `docs/ORIGINAL_CODE_INDEX.md#hubert-control` | result staged |
| Appendix | Transformer depth control | `data/appendix_results/capacity/depth_truncation_full_test_accuracy.csv` | `docs/ORIGINAL_CODE_INDEX.md#capacity-interventions` | result staged |
| Appendix | Bottleneck/rank intervention | `data/appendix_results/capacity/bottleneck_full_test_checkpoint_best_*.csv` | `docs/ORIGINAL_CODE_INDEX.md#capacity-interventions` | result staged |
| Appendix | Perturbation noise-family ablation | `data/appendix_results/perturbation_ablation/noise_ablation_scale100_ratio10_70_summary.csv` | `docs/ORIGINAL_CODE_INDEX.md#perturbation-noise-ablation` | result staged |
| Appendix | Random initialization control | not staged | `docs/ORIGINAL_CODE_INDEX.md#random-initialization-and-frozen-feature-controls` | manifest only |
| Appendix | Frozen pretrained features | not staged | `docs/ORIGINAL_CODE_INDEX.md#random-initialization-and-frozen-feature-controls` | manifest only |
| Result browser | Static dashboard | `dashboard/` plus `data/` | `dashboard/` | staged |

## Dashboard Coverage

The static dashboard covers the three main result views:

- scale-noise performance landscape;
- epoch-wise trajectories for all 70 grid cells;
- acoustic perturbation probes for nonzero-noise settings.

Appendix CSVs are released for transparency but are not all visualized in the dashboard.

## Missing Or Deferred Release Pieces

- Cleaned training/evaluation implementations are still being separated from original SCOW/Linguistics scripts.
- Checkpoint binaries are not included in Git.
- Random-initialization and frozen-feature result CSVs still need author confirmation before staging.

## Do Not Infer Missing Hyperparameters

If a hyperparameter is only visible in a shell script or log and has not yet been lifted into a cleaned config, keep it as `unknown / not explicitly recorded` until verified from the original source.

