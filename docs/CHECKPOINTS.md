# CHECKPOINTS

Large model checkpoints are intentionally excluded from this Git staging repository.

The current release strategy is:

1. keep the code and result CSVs in Git;
2. record checkpoint directories in `metadata/checkpoint_manifest.csv`;
3. stage a small representative checkpoint release before the full checkpoint collection;
4. add stable release URLs and checksums before publishing.

## Representative Release

The first planned checkpoint artifact covers the three phase examples used in the main trajectory analysis:

- `scale_5pct_ratio_10pct`: robust generalization;
- `scale_5pct_ratio_70pct`: abrupt transition;
- `scale_5pct_ratio_90pct`: high-noise collapse.

The public metadata and label manifests are already included:

- `metadata/representative_checkpoint_release_manifest.csv`
- `data/representative_checkpoint_release/`
- `docs/REPRESENTATIVE_CHECKPOINT_RELEASE.md`

The exact source paths for staging those checkpoint binaries are kept only in the ignored local file:

```text
local_private/checkpoint_release/representative_checkpoint_filelist_with_paths.csv
```

Use `scripts/prepare_representative_checkpoint_release.py` to copy the selected binaries into a local upload directory and compute SHA256 checksums.

## Excluded Artifacts

The following file types should not be committed:

```text
*.pt
*.pth
*.ckpt
*.bin
*.safetensors
```

## Manifest Fields

`metadata/checkpoint_manifest.csv` is directory-level for this local staging pass. It records:

- checkpoint collection ID
- paper experiment
- backbone
- scale/noise scope when known
- checkpoint granularity
- current local or remote directory
- planned release URL
- checksum status
- notes

Per-file checksums should be added after deciding which checkpoint subsets will be released.

See `docs/CHECKPOINT_COMPRESSION_PLAN.md` and `metadata/checkpoint_inventory_summary.md` for the current public checkpoint inventory and compression strategy. Detailed private-path audit outputs are kept locally under `local_private/` and are ignored by Git.
