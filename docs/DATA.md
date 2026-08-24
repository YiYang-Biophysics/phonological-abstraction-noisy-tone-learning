# DATA

This release does not redistribute AISHELL-1 raw audio. Users should obtain AISHELL-1 from the official source and then run the documented preprocessing pipeline against their local corpus copy.

## Released CSV Data

The staged release includes the dashboard-ready result tables:

- `data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv`
- `data/epoch_wise_learning_trajectories/*.csv`
- `data/acoustic_perturbation_probe/all_settings_summary.csv`

These files contain aggregate metrics only. They do not contain raw speech audio.

## AISHELL-1 Policy

Do not commit:

- `.wav`, `.flac`, or other raw audio files
- derived perturbation audio
- local manifest files that expose private corpus paths
- private server paths to AISHELL copies

Release-ready manifests should use path placeholders such as:

```text
<AISHELL_ROOT>/wav
```

rather than local or cluster-specific absolute paths.

## Scale and Noise Data

The main grid uses speaker-level training scales:

```text
1%, 2%, 3%, 5%, 10%, 50%, 100%
```

and label replacement ratios:

```text
0%, 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%
```

The release currently includes the resulting metrics. The exact generation scripts remain to be cleaned from the original SCOW/Linguistics working directories before public code release.

## Author Actions Before Public Release

- Add official AISHELL-1 acquisition instructions.
- Add cleaned manifest-generation commands.
- Replace private absolute paths with placeholders or command-line arguments.
- Confirm which derived labels and utterance IDs can be redistributed under the relevant data license.

