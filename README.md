# Phonological Abstraction and Exception Memorization in Noisy Tone Learning

This repository contains the release materials for the EMNLP 2026 Findings paper **Phonological Abstraction and Exception Memorization in Noisy Tone Learning**.

The repository is designed as a research artifact, not a general-purpose software package. It provides the released result CSVs, a static dashboard for browsing the main findings, documentation that maps paper results to data/code, and manifests for large checkpoints. Raw AISHELL-1 audio and model checkpoints are not stored in Git.

## What Is Included

- Main-result CSVs for the scale-noise landscape, epoch-wise learning trajectories, and acoustic perturbation probes.
- Appendix-result CSVs for capacity controls, HuBERT controls, and perturbation noise-family ablations.
- A dependency-free static dashboard in `dashboard/`.
- Release hygiene and validation scripts in `scripts/`.
- Checkpoint manifests and audit summaries in `metadata/`.
- Representative checkpoint-release labels and manifests for three phase examples.
- Documentation for data policy, experiment mapping, checkpoint handling, and reproducibility scope in `docs/`.

## Repository Structure

```text
.
├── dashboard/             # static HTML/CSS/JS result browser
├── data/                  # released CSV results
│   ├── scale_noise_performance_landscape/
│   ├── epoch_wise_learning_trajectories/
│   ├── acoustic_perturbation_probe/
│   ├── appendix_results/
│   └── representative_checkpoint_release/
├── code/                  # public code organization and cleaned-entry templates
├── configs/               # path/config templates
├── docs/                  # paper-result map and release documentation
├── metadata/              # code/checkpoint manifests and checkpoint audit
├── results/               # notes for future derived result tables
└── scripts/               # local validation, dashboard server, checkpoint audit
```

## Quick Start

Open the dashboard directly:

```bash
open dashboard/index.html
```

Or serve the full repository root:

```bash
python3 scripts/run_dashboard.py
```

Then open:

```text
http://127.0.0.1:8766/dashboard/index.html
```

The dashboard has no Node.js or build dependency. It can read CSVs from `data/` over HTTP, and it can also run directly from `file://` using the embedded data copy.

## Result Map

| Paper item | Released data | Dashboard |
| --- | --- | --- |
| Scale-noise performance landscape | `data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv` | Landscape |
| Epoch-wise learning trajectories | `data/epoch_wise_learning_trajectories/*.csv` | Trajectories |
| Acoustic perturbation probes | `data/acoustic_perturbation_probe/all_settings_summary.csv` | Perturbation |
| Capacity controls | `data/appendix_results/capacity/` | CSV only |
| HuBERT controls | `data/appendix_results/hubert/` | CSV only |
| Perturbation noise-family ablation | `data/appendix_results/perturbation_ablation/` | CSV only |
| Representative checkpoint release | `data/representative_checkpoint_release/`, `metadata/representative_checkpoint_release_manifest.csv` | CSV/manifest only |

For the full mapping, see `docs/PAPER_RESULTS_MAP.md`.

## Data Policy

AISHELL-1 raw audio is not redistributed in this repository. Users should obtain AISHELL-1 separately and run the documented preprocessing pipeline against their own local copy. Release-safe result CSVs are included under `data/`.

See `docs/DATA.md` for details.

## Reproducibility Scope

Immediately reproducible from this repository:

- browse the main results in the dashboard;
- inspect all released CSVs;
- validate file counts and release hygiene;
- inspect checkpoint manifests and audit summaries.

Requires external data/checkpoints and additional cleaned scripts:

- end-to-end AISHELL-1 preprocessing;
- full wav2vec2.0/HuBERT training;
- checkpoint-based reevaluation;
- full epoch-wise checkpoint release.

See `docs/REPRODUCIBILITY.md` and `docs/ORIGINAL_CODE_INDEX.md`.

## Checkpoints

Large checkpoints are not included in Git. The current audit found multi-terabyte checkpoint collections across local, Linguistics, and SCOW storage, many of which are historical or unnecessary for public release.

Current checkpoint documentation:

- `docs/CHECKPOINTS.md`
- `docs/CHECKPOINT_COMPRESSION_PLAN.md`
- `docs/REPRESENTATIVE_CHECKPOINT_RELEASE.md`
- `metadata/checkpoint_manifest.csv`
- `metadata/representative_checkpoint_release_manifest.csv`
- `metadata/checkpoint_inventory_summary.md`

The first planned checkpoint artifact contains epoch-wise checkpoints for three representative phase examples: `5%` scale with `10%`, `70%`, and `90%` label noise. The matching sanitized label manifests are included in Git; checkpoint binaries remain external.

## Validation

Run:

```bash
python3 scripts/validate_release.py
```

The validator checks expected CSV counts, dashboard files, appendix CSV presence, large-file exclusions, and obvious private path patterns. It does not verify model accuracy.

## GitHub Pages

If using GitHub Pages, serve the repository root so both `dashboard/` and `data/` remain available at sibling paths. Do not publish only the `dashboard/` directory, because HTTP CSV loading expects `../data/...`.

The root `index.html` redirects to `dashboard/index.html`.

## Citation

Add the final BibTeX/CITATION.cff once the camera-ready metadata is finalized.

## License

No public license has been selected yet. Add an approved license before publishing.
