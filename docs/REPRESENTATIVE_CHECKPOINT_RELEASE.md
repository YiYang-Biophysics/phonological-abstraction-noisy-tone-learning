# Representative Checkpoint Release

The first checkpoint release should stay intentionally small and interpretable: one epoch-wise checkpoint trajectory for each of the three empirical regimes.

## Selected Runs

| Release ID | Regime | Scale | Noise | Epoch checkpoints | Approx. epoch size | Approx. total with best/last |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `scale_5pct_ratio_10pct` | Robust generalization | 5% | 10% | 27 | 89.711 GiB | 96.700 GiB |
| `scale_5pct_ratio_70pct` | Abrupt transition | 5% | 70% | 15 | 17.629 GiB | 19.980 GiB |
| `scale_5pct_ratio_90pct` | High-noise collapse | 5% | 90% | 15 | 17.629 GiB | 19.980 GiB |

Combined, the selected checkpoint binaries are approximately 136.660 GiB before archive compression. They are therefore documented in Git but should be uploaded as external release assets rather than committed to repository history.

## Public Files in This Repository

- `metadata/representative_checkpoint_release_manifest.csv`: public checkpoint release metadata without private filesystem paths.
- `data/representative_checkpoint_release/manifest_index.csv`: selected scale/noise label manifest index.
- `data/representative_checkpoint_release/manifest_labels/`: sanitized training/evaluation manifest files.
- `data/epoch_wise_learning_trajectories/scale_5pct_ratio_{10,70,90}pct.csv`: metric trajectories corresponding to the selected checkpoints.

## Local Private File List

The exact source checkpoint paths are kept out of Git under:

```text
local_private/checkpoint_release/representative_checkpoint_filelist_with_paths.csv
```

That file is intentionally ignored because it contains private local/server paths. It can be used with `scripts/prepare_representative_checkpoint_release.py` to stage checkpoint binaries into an upload directory and compute checksums.

## Intended Use

These representative checkpoints let readers inspect the dynamics behind the main trajectory figure without downloading the full multi-terabyte checkpoint inventory.

For each selected run:

1. Replace `<AISHELL_WAV_ROOT>` in the `.tsv` files with the local AISHELL-1 wav root.
2. Use the corresponding `ratio_<R>pct.ltr` as `train.ltr`.
3. Use `AISHELL_clean_eval/dev.*` and `AISHELL_clean_eval/test.*` for clean validation and test evaluation.
4. Load the matching epoch checkpoint from the external checkpoint artifact.
