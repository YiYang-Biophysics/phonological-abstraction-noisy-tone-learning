# Checkpoint Inventory Summary

This public summary records the checkpoint audit at a collection level without exposing local or server paths.

## Audit Totals

- Checkpoint-like files scanned: 4,961
- Apparent total size across scanned local and remote storage: 5,658.3 GiB
- Checkpoint directories: 332
- Best/last files with same-size epoch checkpoint candidates: 369 files
- Apparent size of same-size best/last candidates: 462.2 GiB

These totals are not the planned release size. They include historical experiments, likely mirrors, full epoch-wise checkpoint collections, and checkpoints that are unnecessary for public GitHub release.

## Approximate Collection Sizes

| Collection | Apparent size | Public release recommendation |
| --- | ---: | --- |
| Current wav2vec2.0 scale-noise checkpoints | 658.2 GiB | external storage only, selected subset first |
| HuBERT scale-10 checkpoints | 110.6 GiB | optional external storage |
| Random-init control checkpoints | 597.0 GiB | external storage only if requested |
| Capacity/control checkpoints | 532.4 GiB | external storage only if requested |
| Historical/superseded scale-noise checkpoints | 2,616.9 GiB | do not release by default |

## Release Decision

The GitHub repository should include code, data, dashboard, and manifests only. Checkpoint binaries should be uploaded later to external storage after deciding which collections are necessary.

The detailed audit with private machine paths is kept locally under `local_private/` and is ignored by Git.

