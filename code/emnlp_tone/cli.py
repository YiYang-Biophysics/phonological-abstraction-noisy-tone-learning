#!/usr/bin/env python3
"""Command-line skeleton for the public EMNLP tone-learning artifact.

The original experiments were run with Fairseq and cluster-specific scripts.
This module defines stable public command names while the path-heavy original
entry points are cleaned into reusable implementations.
"""

from __future__ import annotations

import argparse


COMMANDS = [
    "train",
    "eval-full-test",
    "eval-trajectory",
    "perturb-prepare",
    "perturb-eval",
    "perturb-aggregate",
]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    for command in COMMANDS:
        sub = subparsers.add_parser(command)
        sub.add_argument("--config")
        sub.add_argument("--paths")
        sub.add_argument("--manifest-dir")
        sub.add_argument("--manifest-root")
        sub.add_argument("--checkpoint")
        sub.add_argument("--checkpoint-dir")
        sub.add_argument("--scale-pct", type=int)
        sub.add_argument("--noise-ratio-pct", type=int)
        sub.add_argument("--checkpoint-kind")
        sub.add_argument("--output-dir")
        sub.add_argument("--output-csv")

    args = parser.parse_args()
    raise SystemExit(
        f"`{args.command}` is a public command placeholder. "
        "See docs/ORIGINAL_CODE_INDEX.md for the original implementation "
        "references that still need to be cleaned into this CLI."
    )


if __name__ == "__main__":
    main()

