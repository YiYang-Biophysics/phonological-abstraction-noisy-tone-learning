# RELEASE_CHECKLIST

## Ready

- [x] Phase 1 audit written to `docs/RELEASE_AUDIT.md`.
- [x] Dashboard software staged in `dashboard/`.
- [x] Dashboard CSV dependencies staged in `data/`.
- [x] `.gitignore` excludes large model weights, raw audio, caches, and local environment files.
- [x] Checkpoint directories are recorded at directory level in `metadata/checkpoint_manifest.csv`.
- [x] Public checkpoint inventory summary generated under `metadata/checkpoint_inventory_summary.md`.
- [x] Private checkpoint audit details moved under ignored `local_private/`.
- [x] Original implementation entry points are indexed in `docs/ORIGINAL_CODE_INDEX.md`.
- [x] Lightweight validation script added.

## Requires Author Action

- [ ] Select and add the final repository license.
- [ ] Add official citation metadata.
- [ ] Decide whether HuBERT, capacity, perturbation-ablation, random-init, and frozen-feature CSVs should be staged now or later.
- [ ] Confirm which derived labels, manifests, and utterance IDs may be redistributed under AISHELL-1 terms.
- [ ] Replace private paths in training/evaluation scripts before public release.
- [ ] Add cleaned command-line entry points for training and trajectory evaluation.
- [ ] Add plotting scripts for camera-ready figures.

## Requires External Upload

- [ ] Upload selected checkpoints to external storage.
- [ ] Add release URLs to `metadata/checkpoint_manifest.csv`.
- [ ] Add per-file checksums for released checkpoints.
