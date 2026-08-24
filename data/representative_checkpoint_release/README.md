# Representative Checkpoint Release Manifests

This folder contains the small text manifests needed to use the planned representative checkpoint release.

The selected settings correspond to the three trajectory regimes used in the paper:

| Regime | Training scale | Label noise | Training labels |
| --- | ---: | ---: | --- |
| Robust generalization | 5% | 10% | `manifest_labels/scale_noise_train/scale_5pct/ratio_10pct.ltr` |
| Abrupt transition | 5% | 70% | `manifest_labels/scale_noise_train/scale_5pct/ratio_70pct.ltr` |
| High-noise collapse | 5% | 90% | `manifest_labels/scale_noise_train/scale_5pct/ratio_90pct.ltr` |

`manifest_index.csv` records the three `(scale, noise)` settings and the corresponding manifest files.

## Layout

- `manifest_labels/scale_noise_train/scale_5pct/train.tsv`: shared 5% training utterance manifest.
- `manifest_labels/scale_noise_train/scale_5pct/ratio_<R>pct.ltr`: noisy training labels for the three selected noise ratios.
- `manifest_labels/AISHELL_clean_eval/`: clean dev/test manifests and `dict.ltr.txt`.

The first line of each `.tsv` is sanitized as `<AISHELL_WAV_ROOT>`. Replace it with the local AISHELL-1 wav root before running fairseq or another loader.

Checkpoint binaries are not committed to Git. The planned checkpoint artifact layout is:

```text
checkpoints/
  scale_5pct_ratio_10pct/
    checkpoint1.pt
    ...
    checkpoint27.pt
    checkpoint_best.pt
    checkpoint_last.pt
  scale_5pct_ratio_70pct/
    checkpoint1.pt
    ...
    checkpoint15.pt
    checkpoint_best.pt
    checkpoint_last.pt
  scale_5pct_ratio_90pct/
    checkpoint1.pt
    ...
    checkpoint15.pt
    checkpoint_best.pt
    checkpoint_last.pt
```

See `metadata/representative_checkpoint_release_manifest.csv` for checkpoint counts, approximate sizes, and links to the matching trajectory CSVs.
