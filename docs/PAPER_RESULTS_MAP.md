# PAPER_RESULTS_MAP

This file maps paper-facing results to released data files.

| Paper item | Result | Released data | Dashboard |
| --- | --- | --- | --- |
| Figure 1 | Scale-noise performance landscape | `data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv` | Landscape view |
| Figure 2 | Representative epoch-wise learning trajectories | `data/epoch_wise_learning_trajectories/*.csv` | Trajectories view |
| Figure 3 | Acoustic perturbation probes | `data/acoustic_perturbation_probe/all_settings_summary.csv` | Perturbation view |
| Table 1 | Depth-control results | `data/appendix_results/capacity/depth_truncation_full_test_accuracy.csv` | not currently shown |
| Table 2 / Appendix capacity | Bottleneck intervention results | `data/appendix_results/capacity/bottleneck_full_test_checkpoint_best_long.csv`; `data/appendix_results/capacity/bottleneck_full_test_checkpoint_best_matrix.csv` | not currently shown |
| Appendix HuBERT | HuBERT best-validation and trajectory results | `data/appendix_results/hubert/hubert_scale10_best_by_valid_summary.csv`; `data/appendix_results/hubert/hubert_scale10_memorization_trajectory_all.csv` | not currently shown |
| Appendix perturbation | Noise-family ablation | `data/appendix_results/perturbation_ablation/noise_ablation_scale100_ratio10_70_summary.csv` | not currently shown |
| Checkpoints | Directory-level checkpoint inventory | `metadata/checkpoint_manifest.csv`; `metadata/checkpoint_audit/` | not shown |

The dashboard focuses on the main text result browser. Appendix CSVs are released for transparency and downstream plotting, but are not all visualized in the static dashboard.

