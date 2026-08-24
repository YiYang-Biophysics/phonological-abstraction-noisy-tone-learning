# RELEASE_AUDIT

This is the public release-audit summary for the EMNLP 2026 Findings artifact.

## Current Release Scope

The GitHub-ready staging repository contains:

- release-safe result CSVs under `data/`;
- a dependency-free static result dashboard under `dashboard/`;
- code organization and cleaned-entry templates under `code/`;
- documentation under `docs/`;
- public manifests under `metadata/`;
- local utility scripts under `scripts/`.

The repository intentionally does not include:

- AISHELL-1 raw audio;
- derived perturbation audio;
- model checkpoint binaries;
- private cluster logs;
- SwanLab caches or credentials;
- local virtual environments or build caches.

## Immediate Reproducibility

The following checks can be performed from this repository alone:

```bash
python3 scripts/validate_release.py
python3 scripts/run_dashboard.py
```

This validates file inventory and launches the dashboard. It does not retrain models or verify checkpoint-based metrics.

## Remaining Public-Release Actions

- Select a final open-source license.
- Add final citation metadata.
- Finish cleaned training and evaluation command-line entry points.
- Decide which, if any, checkpoint subsets should be uploaded externally.
- Add external checkpoint URLs and checksums after upload.
- Add figure-generation scripts if the repository should regenerate final camera-ready PDFs.

## Internal Audit

The detailed local audit and checkpoint scan contain private machine paths and are kept outside the publishable file set under `local_private/`, which is ignored by Git.

