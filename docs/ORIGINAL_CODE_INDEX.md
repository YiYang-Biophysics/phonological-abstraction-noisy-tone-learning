# ORIGINAL_CODE_INDEX

This file records known original implementation entry points without copying path-heavy cluster scripts into the public staging package.

Path placeholders:

- `<LOCAL_WORK_ROOT>`: original local working directory for this project.
- `<LOCAL_SFT_ROOT>`: parent local project directory.
- `<SCOW_CODE_ROOT>`: SCOW code root for EMNLP submission scripts.
- `<SCOW_RESULTS_ROOT>`: SCOW result/checkpoint root.
- `<LINGUISTICS_ROOT>`: Linguistics server working root.

## Main Scale-Noise Training

Known references:

- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/run_large_tone_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/run_ssl_tone_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/large_tone_jobs.tsv`
- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/large_tone_worker_plan.tsv`
- `<SCOW_CODE_ROOT>/large_tone/slurm/08_train_large_tone_wave1.sbatch`
- `<SCOW_CODE_ROOT>/large_tone/slurm/09_train_large_tone_wave2.sbatch`
- `<SCOW_CODE_ROOT>/large_tone/slurm/10_train_large_tone_workers.sbatch`

Release action: parameterize data roots, checkpoint roots, pretrained model path, Slurm partition, and environment activation.

## Full Test Recalculation

Known references:

- `<LOCAL_WORK_ROOT>/ustc_scow/full_recalc_missing/eval_missing_full_test_scow.py`
- `<LOCAL_WORK_ROOT>/emnlp_experiment_inventory/remote_scripts/full_test_eval_checkpoint_best.py`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 311 Full Test Accuracy Recalc/full_test_accuracy_checkpoint_best_matrix.csv`

Release action: expose a clean evaluation entry point that takes checkpoint path, manifest path, and output CSV path.

## Epoch-Wise Trajectories

Known references:

- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/eval_large_trajectory_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/large_tone_trajectory_jobs.tsv`
- `<LOCAL_WORK_ROOT>/ustc_scow/self_correction_trajectory/eval_self_correction_worker_scow.py`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 312 Trajectory/*.csv`

Metrics:

- Test Accuracy
- Self-Correction
- Exception Memorization

Release action: consolidate metric definitions in a single cleaned evaluator without changing numerical behavior.

## Acoustic Perturbation Probe

Known references:

- `<LOCAL_WORK_ROOT>/ustc_scow/perturbation_probe_scow/prepare_heatmap_probe_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/perturbation_probe_scow/eval_heatmap_probe_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/perturbation_probe_scow/aggregate_heatmap_probe_scow.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/perturbation_probe_scow/launch_heatmap_probe_scow.sbatch`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 331 Pertubations/all_settings_summary.csv`

Metrics:

- Exception Retention
- Exception Correction
- Rule Retention

Release action: separate noise generation, perturbation evaluation, and aggregation into command-line tools.

## Perturbation Noise Ablation

Known references:

- `<LOCAL_WORK_ROOT>/emnlp_experiment_inventory/remote_scripts/prepare_noise_ablation_probe.py`
- `<LOCAL_WORK_ROOT>/emnlp_experiment_inventory/remote_scripts/generate_noise_ablation_shard.py`
- `<LOCAL_WORK_ROOT>/emnlp_experiment_inventory/remote_scripts/aggregate_noise_ablation_probe.py`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 332 Perturbation Noise Ablation/`

Release action: sanitize path-bearing CSV columns before staging.

## HuBERT Control

Known references:

- `<LOCAL_WORK_ROOT>/ustc_scow/large_tone_deploy/run_ssl_tone_scow.py`
- `<SCOW_CODE_ROOT>/large_tone/slurm/22_smoke_hubert_scale10_full_eval.sbatch`
- `<SCOW_CODE_ROOT>/large_tone/slurm/23_train_hubert_scale10_noise_full_eval.sbatch`
- `<SCOW_CODE_ROOT>/large_tone/slurm/24_eval_hubert_scale10_memorization_trajectory.sbatch`
- `<SCOW_CODE_ROOT>/large_tone/slurm/25_aggregate_hubert_scale10_memorization_trajectory.sbatch`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp HuBERT Scale10 Memorization Trajectory/`

Release action: stage HuBERT result CSVs only after confirming the final camera-ready subset.

## Capacity Interventions

Known references:

- `<LOCAL_WORK_ROOT>/_current_scripts/run_bottleneck_exp.py`
- `<LOCAL_WORK_ROOT>/_current_scripts/make_bottleneck_checkpoints.py`
- `<LOCAL_WORK_ROOT>/ustc_scow/scow_bottleneck_deploy/run_bottleneck_exp_scow.py`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 313 Depth Truncation Full Test Recalc/`
- `<LOCAL_WORK_ROOT>/Submitted_Raw_Data/Exp 314 Bottleneck Full Test Recalc/`

Release action: verify depth/rank config values from original scripts and logs before centralizing them.

## Random Initialization and Frozen-Feature Controls

Known references:

- `<SCOW_CODE_ROOT>/large_tone/rebuttal_baselines/02_random_init_grid_4gpu_by_scale.sbatch`
- `<SCOW_RESULTS_ROOT>/Noisy_Tone_Different_Scale/rebuttal_baselines`
- local rebuttal frozen-feature references recorded in `docs/RELEASE_AUDIT.md`

Release action: create cleaned camera-ready control configs and commands after author confirmation.

