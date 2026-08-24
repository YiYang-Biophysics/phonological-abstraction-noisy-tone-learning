# CHECKPOINTS

Large model checkpoints are intentionally excluded from this Git staging repository.

The current release strategy is:

1. keep the code and result CSVs in Git;
2. record checkpoint directories in `metadata/checkpoint_manifest.csv`;
3. upload selected checkpoints to external storage later;
4. add stable release URLs and checksums before publishing.

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
