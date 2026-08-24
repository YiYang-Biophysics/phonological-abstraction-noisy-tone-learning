# Released Data

This directory contains release-safe CSV files for the EMNLP 2026 Findings artifact.

## Main Results

- `scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv`: best-validation checkpoint test accuracy over the full training-scale and label-noise grid.
- `epoch_wise_learning_trajectories/scale_<scale>pct_ratio_<noise>pct.csv`: epoch-wise test accuracy, exception memorization, and self-correction trajectories.
- `acoustic_perturbation_probe/all_settings_summary.csv`: SNR perturbation summaries for nonzero-noise settings.

## Appendix Results

- `appendix_results/capacity/depth_truncation_full_test_accuracy.csv`
- `appendix_results/capacity/bottleneck_full_test_checkpoint_best_long.csv`
- `appendix_results/capacity/bottleneck_full_test_checkpoint_best_matrix.csv`
- `appendix_results/hubert/hubert_scale10_best_by_valid_summary.csv`
- `appendix_results/hubert/hubert_scale10_memorization_trajectory_all.csv`
- `appendix_results/perturbation_ablation/noise_ablation_scale100_ratio10_70_summary.csv`

## NA Rules

- For `0%` label noise, exception memorization and self-correction metrics may be blank because there are no corrupted-label positions.
- Blank cells in appendix matrices indicate not applicable or not staged, not zero accuracy.
- Private path columns from raw experiment exports have been removed from public appendix CSVs.

## No Raw Audio

This directory contains aggregate CSV data only. It does not contain AISHELL-1 audio, derived perturbation audio, or model checkpoint binaries.

