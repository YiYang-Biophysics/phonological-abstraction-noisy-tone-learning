# CHECKPOINT_COMPRESSION_PLAN

This document summarizes the first checkpoint audit and a practical release strategy.

## Audit Outputs

Public output:

- `metadata/checkpoint_inventory_summary.md`

Local private outputs:

- `local_private/checkpoint_audit/local_checkpoint_files.csv`
- `local_private/checkpoint_audit/linguistics_checkpoint_files.csv`
- `local_private/checkpoint_audit/scow_checkpoint_files.csv`
- `local_private/checkpoint_audit/combined_checkpoint_files.csv`
- `local_private/checkpoint_audit/run_checkpoint_summary.csv`
- `local_private/checkpoint_audit/combined_checkpoint_inventory.md`
- `local_private/checkpoint_audit/checkpoint_structure_samples.jsonl`

The scan is filesystem-metadata based. No checkpoint tensor payloads were copied or modified. Private-path outputs are ignored by Git.

## Main Findings

Across the scanned local, Linguistics, and SCOW locations:

- apparent checkpoint-like files: 4,961
- apparent total size: 5,658.3 GiB
- local checkpoint-like files: 7 files, 2.7 GiB
- Linguistics checkpoint-like files: 3,113 files, 3,751.0 GiB
- SCOW checkpoint-like files: 1,841 files, 1,904.6 GiB
- checkpoint directories: 332
- best/last files with same-size epoch checkpoint candidates: 369 files, 462.2 GiB apparent size

These totals are apparent storage across scanned locations, not confirmed unique release payload size. Some Linguistics and SCOW files may mirror the same experiment.

## Checkpoint Structure Samples

Three representative SCOW checkpoints were inspected with `torch.load(..., map_location="meta")` under the Fairseq Python path.

Observed top-level keys:

```text
args
cfg
criterion
extra_state
model
optimizer_history
task_state
```

Important observation: sampled checkpoints do **not** contain `last_optimizer_state`. This suggests many checkpoints were already saved without full optimizer state. Therefore optimizer stripping is still useful for a clean release format, but it is unlikely to produce a large additional size reduction for these sampled files.

## Compression and Release Strategy

### Tier 1: Result-first release

Publish in Git:

- result CSVs;
- dashboard code;
- checkpoint manifests;
- scripts for evaluation and download.

Do not publish checkpoint binaries in Git.

### Tier 2: Minimal checkpoint release

Externally host only:

- selected `checkpoint_best.pt` / `checkpoint_last.pt` files needed for representative figures;
- possibly one representative epoch-wise trajectory set.

Before upload:

1. verify whether `checkpoint_best.pt` and `checkpoint_last.pt` are exact duplicates of epoch checkpoints using checksums or `cmp`;
2. keep only one physical copy and record aliases in the manifest;
3. optionally convert to `safetensors` for safer model-only evaluation loading.

### Tier 3: Full epoch-wise release

Externally host full epoch-wise checkpoint collections only if required. This should be optional because the full apparent footprint is multi-terabyte.

Recommended storage:

- HuggingFace Datasets/Models for public download;
- Zenodo/OSF/institutional object storage for archival snapshots;
- split archives by experiment family, not one giant archive.

## Practical Compression Options

### Safe, recommended

- Deduplicate exact best/last aliases.
- Publish model-only checkpoint copies where evaluation code supports them.
- Use external object storage instead of Git/GitHub release assets.
- Keep a manifest mapping logical checkpoint IDs to physical files.

### Useful but must be verified

- Convert fp32 model tensors to fp16 or bf16 for evaluation-only release.
- Convert PyTorch pickle checkpoints to `safetensors`.
- Compress experiment-family archives with `zstd`.

These should be verified by rerunning the relevant evaluation metrics and checking that reported accuracy is unchanged or within an explicitly documented tolerance.

### Not recommended for the first public release

- Delta checkpoints between epochs.
- Custom binary patch chains.
- One monolithic multi-terabyte tarball.

Delta checkpointing may exploit epoch-to-epoch similarity, but it makes download, recovery, and reproducibility much harder for readers.

## Next Script to Add

The next useful utility is:

```text
scripts/prepare_eval_checkpoint.py
```

It should:

1. load a Fairseq checkpoint;
2. keep `model`, `cfg`, and minimal metadata;
3. optionally cast model tensors to fp16/bf16;
4. write a release checkpoint;
5. optionally verify metrics against the original checkpoint.
