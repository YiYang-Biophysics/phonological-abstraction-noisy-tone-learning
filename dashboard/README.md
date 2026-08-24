# Static Dashboard

This directory contains a static dashboard for browsing the released scale-noise, trajectory, and acoustic-perturbation CSV data.

Run options:

- Open `index.html` directly in a browser. This works offline because `embedded_data.js` contains a copy of the staged CSV data.
- From the repository root, run `python3 scripts/run_dashboard.py` and open `http://127.0.0.1:8766/dashboard/index.html`.

The dashboard is intentionally dependency-free: no Node.js build step is required.

For GitHub Pages, serve the repository root so `dashboard/` and `data/` remain sibling directories. Do not publish only this folder.
