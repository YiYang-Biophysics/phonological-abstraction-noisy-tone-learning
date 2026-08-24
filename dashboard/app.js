const SCALES = [1, 2, 3, 5, 10, 50, 100];
const RATIOS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const PERTURB_RATIOS = RATIOS.filter((ratio) => ratio !== 0);
const ACCURACY_COLOR_MIN = 20;
const ACCURACY_COLOR_MAX = 95;
const PERTURB_SNRS = [50, 45, 40, 30, 25, 20, 15, 10, 8, 6, 4, 2, 0];
const PERTURB_METRICS = [
  {
    id: "bRetain",
    label: "Exception Retention",
    shortLabel: "Exception Retention",
    field: "bRetain",
    color: "#c75643",
    description: "changed positions still predicted as the noisy exception label",
  },
  {
    id: "aRecover",
    label: "Exception Correction",
    shortLabel: "Exception Correction",
    field: "aRecover",
    color: "#1f6f9f",
    description: "changed positions recovered to the clean rule label",
  },
  {
    id: "ruleAcc",
    label: "Rule Retention",
    shortLabel: "Rule Retention",
    field: "ruleAcc",
    color: "#3f7f3a",
    description: "unchanged positions retained as the clean rule label",
  },
];
const TRAJECTORY_METRICS = [
  { label: "Test Accuracy", field: "testAcc", color: "#1f6f9f" },
  { label: "Exception Memorization", field: "memorizationAcc", color: "#c75643" },
  { label: "Self-Correctness", field: "selfCorrectionAcc", color: "#7b5bbf" },
];

const PATHS = {
  matrix: "../data/scale_noise_performance_landscape/full_test_accuracy_checkpoint_best_matrix.csv",
  trajectoryDir: "../data/epoch_wise_learning_trajectories/",
  trajectoryManifest: "./trajectory_manifest.json",
  trajectory: (scale, ratio) => `../data/epoch_wise_learning_trajectories/scale_${scale}pct_ratio_${ratio}pct.csv`,
  perturbations: "../data/acoustic_perturbation_probe/all_settings_summary.csv",
};

const FALLBACK_TRAJECTORY_FILES = [
  'scale_1pct_ratio_0pct.csv',
  'scale_1pct_ratio_10pct.csv',
  'scale_1pct_ratio_20pct.csv',
  'scale_1pct_ratio_30pct.csv',
  'scale_1pct_ratio_40pct.csv',
  'scale_1pct_ratio_50pct.csv',
  'scale_1pct_ratio_60pct.csv',
  'scale_1pct_ratio_70pct.csv',
  'scale_1pct_ratio_80pct.csv',
  'scale_1pct_ratio_90pct.csv',
  'scale_2pct_ratio_0pct.csv',
  'scale_2pct_ratio_10pct.csv',
  'scale_2pct_ratio_20pct.csv',
  'scale_2pct_ratio_30pct.csv',
  'scale_2pct_ratio_40pct.csv',
  'scale_2pct_ratio_50pct.csv',
  'scale_2pct_ratio_60pct.csv',
  'scale_2pct_ratio_70pct.csv',
  'scale_2pct_ratio_80pct.csv',
  'scale_2pct_ratio_90pct.csv',
  'scale_3pct_ratio_0pct.csv',
  'scale_3pct_ratio_10pct.csv',
  'scale_3pct_ratio_20pct.csv',
  'scale_3pct_ratio_30pct.csv',
  'scale_3pct_ratio_40pct.csv',
  'scale_3pct_ratio_50pct.csv',
  'scale_3pct_ratio_60pct.csv',
  'scale_3pct_ratio_70pct.csv',
  'scale_3pct_ratio_80pct.csv',
  'scale_3pct_ratio_90pct.csv',
  'scale_5pct_ratio_0pct.csv',
  'scale_5pct_ratio_10pct.csv',
  'scale_5pct_ratio_20pct.csv',
  'scale_5pct_ratio_30pct.csv',
  'scale_5pct_ratio_40pct.csv',
  'scale_5pct_ratio_50pct.csv',
  'scale_5pct_ratio_60pct.csv',
  'scale_5pct_ratio_70pct.csv',
  'scale_5pct_ratio_80pct.csv',
  'scale_5pct_ratio_90pct.csv',
  'scale_10pct_ratio_0pct.csv',
  'scale_10pct_ratio_10pct.csv',
  'scale_10pct_ratio_20pct.csv',
  'scale_10pct_ratio_30pct.csv',
  'scale_10pct_ratio_40pct.csv',
  'scale_10pct_ratio_50pct.csv',
  'scale_10pct_ratio_60pct.csv',
  'scale_10pct_ratio_70pct.csv',
  'scale_10pct_ratio_80pct.csv',
  'scale_10pct_ratio_90pct.csv',
  'scale_50pct_ratio_0pct.csv',
  'scale_50pct_ratio_10pct.csv',
  'scale_50pct_ratio_20pct.csv',
  'scale_50pct_ratio_30pct.csv',
  'scale_50pct_ratio_40pct.csv',
  'scale_50pct_ratio_50pct.csv',
  'scale_50pct_ratio_60pct.csv',
  'scale_50pct_ratio_70pct.csv',
  'scale_50pct_ratio_80pct.csv',
  'scale_50pct_ratio_90pct.csv',
  'scale_100pct_ratio_0pct.csv',
  'scale_100pct_ratio_10pct.csv',
  'scale_100pct_ratio_20pct.csv',
  'scale_100pct_ratio_30pct.csv',
  'scale_100pct_ratio_40pct.csv',
  'scale_100pct_ratio_50pct.csv',
  'scale_100pct_ratio_60pct.csv',
  'scale_100pct_ratio_70pct.csv',
  'scale_100pct_ratio_80pct.csv',
  'scale_100pct_ratio_90pct.csv',
];

const state = {
  matrix: null,
  trajectories: new Map(),
  perturbations: new Map(),
  selectedScale: 5,
  selectedRatio: 10,
  perturbScale: 5,
  perturbRatio: 60,
  perturbSnrIndex: 0,
};

const el = {
  loadedSummary: document.getElementById("loadedSummary"),
  matrixStatus: document.getElementById("matrixStatus"),
  trajectoryStatus: document.getElementById("trajectoryStatus"),
  perturbationStatus: document.getElementById("perturbationStatus"),
  missingStatus: document.getElementById("missingStatus"),
  heatmapView: document.getElementById("heatmapView"),
  heatmapStats: document.getElementById("heatmapStats"),
  heatmapLegend: document.getElementById("heatmapLegend"),
  scaleSelect: document.getElementById("scaleSelect"),
  ratioSelect: document.getElementById("ratioSelect"),
  trajectoryTitle: document.getElementById("trajectoryTitle"),
  trajectoryView: document.getElementById("trajectoryView"),
  trajectoryStats: document.getElementById("trajectoryStats"),
  coverageGrid: document.getElementById("coverageGrid"),
  perturbScaleSelect: document.getElementById("perturbScaleSelect"),
  perturbRatioSelect: document.getElementById("perturbRatioSelect"),
  perturbCurveTitle: document.getElementById("perturbCurveTitle"),
  perturbSnrSlider: document.getElementById("perturbSnrSlider"),
  perturbSnrReadout: document.getElementById("perturbSnrReadout"),
  perturbSnrTicks: document.getElementById("perturbSnrTicks"),
  perturbSnrStats: document.getElementById("perturbSnrStats"),
  perturbBestCurveView: document.getElementById("perturbBestCurveView"),
  perturbLastCurveView: document.getElementById("perturbLastCurveView"),
  perturbLegend: document.getElementById("perturbLegend"),
  perturbCoverageGrid: document.getElementById("perturbCoverageGrid"),
  tooltip: document.getElementById("tooltip"),
};

function key(scale, ratio) {
  return `${scale}:${ratio}`;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h.trim(), (r[i] || "").trim()])));
}

function numeric(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function cacheBust(path) {
  if (window.location.protocol === "file:") return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}t=${Date.now()}`;
}

function requestText(path) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", encodeURI(cacheBust(path)), true);
    request.overrideMimeType?.("text/plain; charset=utf-8");
    request.onload = () => {
      if ((request.status >= 200 && request.status < 300) || (request.status === 0 && request.responseText)) {
        resolve(request.responseText);
      } else {
        reject(new Error(`${request.status} ${path}`));
      }
    };
    request.onerror = () => reject(new Error(`Could not load ${path}`));
    request.send();
  });
}

function embeddedText(path) {
  const embedded = window.REVIEWER_DASHBOARD_EMBEDDED_DATA;
  if (!embedded) return null;
  if (path === PATHS.matrix) return embedded.matrix;
  if (path === PATHS.trajectoryManifest) return embedded.trajectoryManifest;
  if (path === PATHS.perturbations) return embedded.perturbations;
  const trajectoryMatch = path.match(/scale_\d+pct_ratio_\d+pct\.csv$/);
  if (trajectoryMatch) return embedded.trajectories?.[trajectoryMatch[0]] ?? null;
  return null;
}

async function fetchText(path) {
  if (window.location.protocol === "file:") {
    const embedded = embeddedText(path);
    if (embedded !== null) return embedded;
  }
  try {
    const response = await fetch(encodeURI(cacheBust(path)), { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${path}`);
    return await response.text();
  } catch (error) {
    if (window.location.protocol === "file:") {
      return requestText(path);
    }
    throw error;
  }
}

async function fetchCSV(path) {
  return parseCSV(await fetchText(path));
}

async function listTrajectoryFiles() {
  try {
    const manifest = JSON.parse(await fetchText(PATHS.trajectoryManifest));
    const files = Array.isArray(manifest) ? manifest : manifest.files;
    if (Array.isArray(files) && files.length) return files;
  } catch {
    // Fall through to directory listing for local live-edit workflows.
  }

  try {
    const html = await fetchText(PATHS.trajectoryDir);
    const matches = [...html.matchAll(/scale_\d+pct_ratio_\d+pct\.csv/g)]
      .map((match) => decodeURIComponent(match[0]));
    const unique = [...new Set(matches)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (unique.length) return unique;
  } catch {
    // Some static hosts disable directory indexes; use the embedded list below.
  }

  return FALLBACK_TRAJECTORY_FILES;
}

function parseMatrix(rows) {
  const cells = [];
  rows.forEach((row) => {
    const ratio = numeric(row.label_noise_ratio_pct);
    SCALES.forEach((scale) => {
      const value = numeric(row[`scale_${scale}pct`]);
      cells.push({ scale, ratio, value });
    });
  });
  return { rows, cells };
}

function matrixValue(scale, ratio) {
  return state.matrix?.cells.find((cell) => cell.scale === scale && cell.ratio === ratio)?.value ?? null;
}

function trajectoryRegime(value) {
  if (value === null || value === undefined) {
    return {
      title: "Trajectory setting",
      className: "unknown",
      leftFill: "#eef1ee",
      rightFill: "#f1eee8",
      leftText: "#5b635e",
      rightText: "#665f57",
    };
  }
  if (value >= 75) {
    return {
      title: "Robust phonological generalization",
      className: "robust",
      leftFill: "#eaf3ef",
      rightFill: "#f7eee4",
      leftText: "#3f6f5a",
      rightText: "#8a5c3c",
    };
  }
  if (value >= 30) {
    return {
      title: "Abrupt transition",
      className: "transition",
      leftFill: "#edf0fb",
      rightFill: "#f9e8e5",
      leftText: "#59649a",
      rightText: "#9a5a50",
    };
  }
  return {
    title: "High-noise collapse",
    className: "collapse",
    leftFill: "#f9e8e5",
    rightFill: "#f9e8e5",
    leftText: "#9a5a50",
    rightText: "#9a5a50",
  };
}

function renderTrajectoryTitle(scale, ratio) {
  const value = matrixValue(scale, ratio);
  const regime = trajectoryRegime(value);
  el.trajectoryTitle.innerHTML = `
    <div class="trajectory-title-main ${regime.className}">${regime.title}</div>
    <div class="trajectory-title-sub">${scale}% training scale / ${ratio}% label noise</div>
  `;
}

function parseTrajectory(rows) {
  return rows.map((row) => ({
    epoch: numeric(row.epoch),
    testAcc: numeric(row["Test Acc"]),
    memorizationAcc: numeric(row["Memorization Acc"]),
    selfCorrectionAcc: numeric(row["Self-Correction Acc"]),
  })).filter((row) => row.epoch !== null);
}

function parsePerturbations(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const scale = numeric(row.scale);
    const ratio = numeric(row.ratio);
    const snr = numeric(row.snr);
    const checkpoint = row.checkpoint_kind;
    if (scale === null || ratio === null || snr === null || !checkpoint) return;
    const item = {
      scale,
      ratio,
      checkpoint,
      snr,
      bRetain: numeric(row.metric1_changed_pred_B_acc),
      aRecover: numeric(row.metric2_changed_pred_A_acc),
      ruleAcc: numeric(row.metric3_unchanged_pred_A_acc),
    };
    const id = key(scale, ratio);
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(item);
  });

  grouped.forEach((items) => {
    items.sort((a, b) => {
      if (a.checkpoint !== b.checkpoint) return a.checkpoint.localeCompare(b.checkpoint);
      return b.snr - a.snr;
    });
  });

  return grouped;
}

function formatPct(value, digits = 1) {
  return value === null || value === undefined ? "missing" : `${value.toFixed(digits)}%`;
}

function formatNumber(value, digits = 3) {
  return value === null || value === undefined ? "missing" : value.toFixed(digits);
}

function colorForAccuracy(value) {
  if (value === null || value === undefined) return "#ece8df";
  const stops = [
    { v: 20, c: [210, 97, 72] },
    { v: 55, c: [206, 151, 64] },
    { v: 80, c: [86, 145, 79] },
    { v: 95, c: [39, 105, 168] },
  ];
  const clamped = Math.max(ACCURACY_COLOR_MIN, Math.min(ACCURACY_COLOR_MAX, value));
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (clamped >= stops[i].v && clamped <= stops[i + 1].v) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const t = (clamped - a.v) / (b.v - a.v || 1);
  const mix = a.c.map((start, i) => Math.round(start + (b.c[i] - start) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

function accuracyRegime(value) {
  if (value === null || value === undefined) return -1;
  if (value >= 75) return 2;
  if (value >= 30) return 1;
  return 0;
}

function colorForPerturb(value, metricId) {
  if (value === null || value === undefined) return "#ece8df";
  const metric = PERTURB_METRICS.find((m) => m.id === metricId) || PERTURB_METRICS[0];
  const high = metric.color.match(/\w\w/g).map((h) => parseInt(h, 16));
  const low = [245, 241, 232];
  const clamped = Math.max(0, Math.min(100, value));
  const t = Math.pow(clamped / 100, 0.72);
  const mix = low.map((start, i) => Math.round(start + (high[i] - start) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

function showTooltip(html, event) {
  el.tooltip.innerHTML = html;
  el.tooltip.hidden = false;
  moveTooltip(event);
}

function moveTooltip(event) {
  const pad = 14;
  el.tooltip.style.left = `${Math.min(event.clientX + pad, window.innerWidth - 280)}px`;
  el.tooltip.style.top = `${Math.min(event.clientY + pad, window.innerHeight - 110)}px`;
}

function hideTooltip() {
  el.tooltip.hidden = true;
}

function renderStatus() {
  const presentMatrix = state.matrix?.cells.filter((c) => c.value !== null).length || 0;
  const totalMatrix = SCALES.length * RATIOS.length;
  const presentTraj = state.trajectories.size;
  const totalTraj = SCALES.length * RATIOS.length;
  const presentPerturb = state.perturbations.size;
  const totalPerturb = SCALES.length * PERTURB_RATIOS.length;

  el.loadedSummary.textContent = `${presentMatrix} grid cells, ${presentTraj} trajectories, ${presentPerturb} perturbation settings`;
  el.matrixStatus.textContent = `${presentMatrix}/${totalMatrix} cells`;
  el.trajectoryStatus.textContent = `${presentTraj}/${totalTraj} CSVs`;
  el.perturbationStatus.textContent = `${presentPerturb}/${totalPerturb} settings`;
  el.missingStatus.textContent = `${totalTraj - presentTraj} trajectory slots`;
}

function stat(label, value) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
}

function renderHeatmap() {
  if (!state.matrix) {
    el.heatmapView.innerHTML = '<div class="empty-state">Heatmap CSV could not be loaded.</div>';
    return;
  }

  el.heatmapLegend.innerHTML = `<span>${ACCURACY_COLOR_MIN}</span><span class="legend-swatch"></span><span>${ACCURACY_COLOR_MAX}% test acc</span>`;

  const width = 920;
  const height = 500;
  const margin = { top: 28, right: 16, bottom: 56, left: 72 };
  const cellW = (width - margin.left - margin.right) / SCALES.length;
  const cellH = (height - margin.top - margin.bottom) / RATIOS.length;
  const cellsByKey = new Map(state.matrix.cells.map((c) => [key(c.scale, c.ratio), c]));
  const parts = [];

  parts.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="Best checkpoint test accuracy heatmap">`);
  SCALES.forEach((scale, i) => {
    const x = margin.left + i * cellW;
    parts.push(`<text x="${x + cellW / 2}" y="${height - 34}" text-anchor="middle" fill="#444944" font-size="13">${scale}%</text>`);
  });
  parts.push(`<text x="${margin.left + (width - margin.left - margin.right) / 2}" y="${height - 10}" text-anchor="middle" fill="#666c68" font-size="13">Training scale</text>`);
  RATIOS.forEach((ratio, j) => {
    const y = margin.top + j * cellH;
    parts.push(`<text x="${margin.left - 14}" y="${y + cellH / 2 + 5}" text-anchor="end" fill="#444944" font-size="13">${ratio}%</text>`);
  });
  parts.push(`<text x="14" y="${margin.top + 15}" fill="#666c68" font-size="12">Label noise</text>`);

  RATIOS.forEach((ratio, j) => {
    SCALES.forEach((scale, i) => {
      const x = margin.left + i * cellW;
      const y = margin.top + j * cellH;
      const cell = cellsByKey.get(key(scale, ratio)) || { value: null, scale, ratio };
      const selected = scale === state.selectedScale && ratio === state.selectedRatio;
      const fill = colorForAccuracy(cell.value);
      parts.push(`<g class="heat-cell" data-scale="${scale}" data-ratio="${ratio}" data-value="${cell.value ?? ""}">`);
      parts.push(`<rect x="${x + 2}" y="${y + 2}" width="${cellW - 4}" height="${cellH - 4}" rx="5" fill="${fill}" stroke="${selected ? "#f8f5ee" : "#ffffff"}" stroke-width="${selected ? 2.4 : 1}"/>`);
      if (cell.value !== null) {
        parts.push(`<text class="cell-label" x="${x + cellW / 2}" y="${y + cellH / 2 + 5}" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">${cell.value.toFixed(1)}</text>`);
      } else {
        parts.push(`<text class="cell-label" x="${x + cellW / 2}" y="${y + cellH / 2 + 5}" text-anchor="middle" fill="#9a958b" font-size="13">--</text>`);
      }
      parts.push("</g>");
    });
  });
  const boundaryStroke = "#8d8a82";
  const boundaryWidth = 2.4;
  const boundaryDash = "7 6";
  RATIOS.forEach((ratio, j) => {
    SCALES.slice(0, -1).forEach((scale, i) => {
      const left = cellsByKey.get(key(scale, ratio));
      const right = cellsByKey.get(key(SCALES[i + 1], ratio));
      if (accuracyRegime(left?.value) !== accuracyRegime(right?.value)) {
        const x = margin.left + (i + 1) * cellW;
        const y1 = margin.top + j * cellH;
        const y2 = y1 + cellH;
        parts.push(`<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="${boundaryStroke}" stroke-width="${boundaryWidth}" stroke-dasharray="${boundaryDash}" stroke-linecap="butt"/>`);
      }
    });
  });
  RATIOS.slice(0, -1).forEach((ratio, j) => {
    SCALES.forEach((scale, i) => {
      const top = cellsByKey.get(key(scale, ratio));
      const bottom = cellsByKey.get(key(scale, RATIOS[j + 1]));
      if (accuracyRegime(top?.value) !== accuracyRegime(bottom?.value)) {
        const x1 = margin.left + i * cellW;
        const x2 = x1 + cellW;
        const y = margin.top + (j + 1) * cellH;
        parts.push(`<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="${boundaryStroke}" stroke-width="${boundaryWidth}" stroke-dasharray="${boundaryDash}" stroke-linecap="butt"/>`);
      }
    });
  });
  parts.push("</svg>");
  el.heatmapView.innerHTML = parts.join("");

  el.heatmapView.querySelectorAll(".heat-cell").forEach((node) => {
    node.addEventListener("mouseenter", (event) => {
      const scale = Number(node.dataset.scale);
      const ratio = Number(node.dataset.ratio);
      const value = numeric(node.dataset.value);
      const available = state.trajectories.has(key(scale, ratio));
      showTooltip(
        `<strong>${scale}% scale, ${ratio}% noise</strong><br>Best test accuracy: ${formatPct(value, 1)}<br>Trajectory: ${available ? "available" : "not yet added"}`,
        event,
      );
    });
    node.addEventListener("mousemove", moveTooltip);
    node.addEventListener("mouseleave", hideTooltip);
    node.addEventListener("click", () => {
      state.selectedScale = Number(node.dataset.scale);
      state.selectedRatio = Number(node.dataset.ratio);
      syncControls();
      renderAll();
      document.getElementById("trajectories").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const present = state.matrix.cells.filter((c) => c.value !== null);
  const best = present.reduce((a, c) => (c.value > a.value ? c : a), present[0]);
  const worst = present.reduce((a, c) => (c.value < a.value ? c : a), present[0]);
  const robustCount = present.filter((c) => c.value >= 75).length;
  const transitionCount = present.filter((c) => c.value >= 30 && c.value < 75).length;
  const collapseCount = present.filter((c) => c.value < 30).length;
  const mean = present.reduce((sum, c) => sum + c.value, 0) / present.length;
  el.heatmapStats.innerHTML = [
    stat("Available grid cells", `${present.length}/${SCALES.length * RATIOS.length}`),
    stat("Source", "scale_noise_performance_landscape CSV"),
    stat("Best observed cell", `${best.scale}% scale / ${best.ratio}% noise: ${best.value.toFixed(1)}%`),
    stat("Lowest observed cell", `${worst.scale}% scale / ${worst.ratio}% noise: ${worst.value.toFixed(1)}%`),
    stat("Mean observed accuracy", `${mean.toFixed(1)}%`),
    stat("Robust phonological generalization", `${robustCount} cells (>=75%)`),
    stat("Abrupt transition", `${transitionCount} cells (30%-75%)`),
    stat("High-noise collapse", `${collapseCount} cells (<30%)`),
  ].join("");
}

function populateControls() {
  el.scaleSelect.innerHTML = SCALES.map((scale) => `<option value="${scale}">${scale}%</option>`).join("");
  el.ratioSelect.innerHTML = RATIOS.map((ratio) => `<option value="${ratio}">${ratio}%</option>`).join("");
  el.perturbScaleSelect.innerHTML = SCALES.map((scale) => `<option value="${scale}">${scale}%</option>`).join("");
  el.perturbRatioSelect.innerHTML = PERTURB_RATIOS.map((ratio) => `<option value="${ratio}">${ratio}%</option>`).join("");
  syncControls();
}

function syncControls() {
  el.scaleSelect.value = String(state.selectedScale);
  el.ratioSelect.value = String(state.selectedRatio);
  el.perturbScaleSelect.value = String(state.perturbScale);
  el.perturbRatioSelect.value = String(state.perturbRatio);
}

function linePath(rows, x, y, field) {
  const points = rows
    .filter((row) => row[field] !== null)
    .map((row) => ({ x: x(row.epoch), y: y(row[field]) }));
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  if (points.length === 2) {
    return points.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  }
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

function metricPoints(rows, x, y, field) {
  return rows
    .filter((row) => row[field] !== null)
    .map((row) => ({ x: x(row.epoch), y: y(row[field]), value: row[field], epoch: row.epoch }));
}

function peakRow(rows, field) {
  return rows
    .filter((row) => row[field] !== null)
    .reduce((best, row) => (!best || row[field] > best[field] ? row : best), null);
}

function renderTrajectorySummaryStats(rows, best) {
  const last = rows[rows.length - 1];
  const bestEpoch = best?.epoch ?? "n/a";
  const bestAcc = best?.testAcc ?? null;
  const finalMem = last?.memorizationAcc ?? null;
  const finalSelfCorrection = last?.selfCorrectionAcc ?? null;
  el.trajectoryStats.innerHTML = [
    stat("Epochs loaded", rows.length),
    stat("Best test accuracy", `${formatPct(bestAcc, 1)} at epoch ${bestEpoch}`),
    stat(
      "Final Exception Memorization",
      state.selectedRatio === 0 ? "Undefined at 0% noise" : formatPct(finalMem, 1)
    ),
    stat(
      "Final Self-Correctness",
      state.selectedRatio === 0 ? "Undefined at 0% noise" : formatPct(finalSelfCorrection, 1)
    ),
    stat("Generalization drop after best", last?.testAcc !== null && bestAcc !== null ? `${(bestAcc - last.testAcc).toFixed(1)} pts` : "missing"),
  ].join("");
}

function renderTrajectoryEpochStats(row, metrics) {
  el.trajectoryStats.innerHTML = [
    stat("Epoch", row.epoch),
    ...metrics.map((metric) => stat(metric.label, formatPct(row[metric.field], 1))),
  ].join("");
}

function renderTrajectory() {
  const currentKey = key(state.selectedScale, state.selectedRatio);
  const rows = state.trajectories.get(currentKey);
  renderTrajectoryTitle(state.selectedScale, state.selectedRatio);

  if (!rows) {
    const zeroNoiseNote = state.selectedRatio === 0
      ? "<br>For 0% noise, Exception Memorization and Self-Correctness are undefined."
      : "";
    el.trajectoryView.innerHTML = `<div class="empty-state">No trajectory CSV yet for ${state.selectedScale}% scale and ${state.selectedRatio}% noise.<br>Add scale_${state.selectedScale}pct_ratio_${state.selectedRatio}pct.csv to data/epoch_wise_learning_trajectories and refresh.${zeroNoiseNote}</div>`;
    el.trajectoryStats.innerHTML = [
      stat("Status", "Missing trajectory"),
      stat("Expected filename", `scale_${state.selectedScale}pct_ratio_${state.selectedRatio}pct.csv`),
      ...(state.selectedRatio === 0 ? [stat("Exception Memorization", "Undefined at 0% noise")] : []),
    ].join("");
    return;
  }

  const width = 920;
  const height = 430;
  const margin = { top: 54, right: 28, bottom: 48, left: 68 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const epochs = rows.map((r) => r.epoch);
  const minEpoch = Math.min(...epochs);
  const maxEpoch = Math.max(...epochs);
  const metrics = TRAJECTORY_METRICS.filter((metric) => rows.some((row) => row[metric.field] !== null));
  const yMin = 0;
  const yMax = 100;
  const x = (epoch) => margin.left + ((epoch - minEpoch) / (maxEpoch - minEpoch || 1)) * innerW;
  const y = (value) => margin.top + (1 - (value - yMin) / (yMax - yMin || 1)) * innerH;
  const yTicks = [0, 25, 50, 75, 100];
  const parts = [];

  parts.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="Epoch trajectory chart">`);
  parts.push(`<defs><filter id="curveShadow" x="-4%" y="-4%" width="108%" height="108%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.2" flood-color="#5c554b" flood-opacity="0.16"/></filter></defs>`);
  parts.push(`<rect x="${margin.left}" y="${margin.top}" width="${innerW}" height="${innerH}" rx="10" fill="#fffdf9" stroke="#d8d2c7"/>`);

  const best = peakRow(rows, "testAcc") || rows[0];
  const bestX = best?.epoch !== null ? x(best.epoch) : null;
  const landscapeAcc = matrixValue(state.selectedScale, state.selectedRatio);
  const regime = trajectoryRegime(landscapeAcc);
  const showPeak = state.selectedRatio !== 0 && landscapeAcc !== null && landscapeAcc >= 30 && bestX !== null;
  const showRegimes = showPeak;
  const xTicks = Array.from(new Set([minEpoch, ...(showPeak && best?.epoch !== null ? [best.epoch] : []), maxEpoch]));
  const regimeLabels = [];
  if (state.selectedRatio === 0) {
    parts.push(`<rect x="${margin.left}" y="${margin.top}" width="${innerW}" height="${innerH}" fill="#eaf3ef" opacity="0.76"/>`);
  } else if (landscapeAcc !== null && landscapeAcc < 30) {
    parts.push(`<rect x="${margin.left}" y="${margin.top}" width="${innerW}" height="${innerH}" fill="${regime.leftFill}" opacity="0.80"/>`);
  } else if (showRegimes) {
    const leftW = Math.max(0, bestX - margin.left);
    const rightW = Math.max(0, margin.left + innerW - bestX);
    parts.push(`<rect x="${margin.left}" y="${margin.top}" width="${leftW.toFixed(2)}" height="${innerH}" fill="${regime.leftFill}" opacity="0.76"/>`);
    parts.push(`<rect x="${bestX.toFixed(2)}" y="${margin.top}" width="${rightW.toFixed(2)}" height="${innerH}" fill="${regime.rightFill}" opacity="0.80"/>`);
    const labelY = margin.top + 21;
    if (leftW >= 130) {
      const labelX = Math.max(margin.left + 76, margin.left + leftW / 2).toFixed(2);
      regimeLabels.push(`<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${regime.leftText}" stroke="#fffdf9" stroke-width="4" stroke-linejoin="round" font-size="13" font-weight="740">rule acquisition regime</text>`);
      regimeLabels.push(`<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${regime.leftText}" font-size="13" font-weight="740">rule acquisition regime</text>`);
    }
    if (rightW >= 190) {
      const labelX = Math.min(margin.left + innerW - 112, bestX + rightW / 2).toFixed(2);
      regimeLabels.push(`<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${regime.rightText}" stroke="#fffdf9" stroke-width="4" stroke-linejoin="round" font-size="13" font-weight="740">exception memorization regime</text>`);
      regimeLabels.push(`<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${regime.rightText}" font-size="13" font-weight="740">exception memorization regime</text>`);
    }
  }

  yTicks.forEach((tick) => {
    parts.push(`<line x1="${margin.left}" x2="${margin.left + innerW}" y1="${y(tick)}" y2="${y(tick)}" stroke="#e8e1d6" stroke-width="1"/>`);
    parts.push(`<text x="${margin.left - 12}" y="${y(tick) + 4}" text-anchor="end" fill="#666c68" font-size="12">${tick.toFixed(0)}</text>`);
  });
  xTicks.forEach((tick) => {
    parts.push(`<text x="${x(tick)}" y="${height - 22}" text-anchor="middle" fill="#666c68" font-size="12">${tick}</text>`);
  });
  parts.push(`<text x="${margin.left + innerW / 2}" y="${height - 4}" text-anchor="middle" fill="#666c68" font-size="12">Epoch</text>`);
  parts.push(`<text x="18" y="${margin.top + innerH / 2}" transform="rotate(-90 18 ${margin.top + innerH / 2})" text-anchor="middle" fill="#666c68" font-size="12">Accuracy (%)</text>`);

  if (showPeak && best?.epoch !== null) {
    parts.push(`<line x1="${x(best.epoch)}" x2="${x(best.epoch)}" y1="${margin.top}" y2="${margin.top + innerH}" stroke="#313632" stroke-dasharray="4 6" stroke-width="1.45"/>`);
  }

  metrics.forEach((metric) => {
    const path = linePath(rows, x, y, metric.field);
    parts.push(`<path d="${path}" fill="none" stroke="#fffdf9" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" opacity="0.92"/>`);
    parts.push(`<path d="${path}" fill="none" stroke="${metric.color}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round" filter="url(#curveShadow)"/>`);
    if (best?.epoch !== null && best[metric.field] !== null) {
      parts.push(`<circle cx="${x(best.epoch).toFixed(2)}" cy="${y(best[metric.field]).toFixed(2)}" r="4.7" fill="#fffdf9" stroke="${metric.color}" stroke-width="2.5"/>`);
    }
  });

  if (showPeak && best?.epoch !== null) {
    const peakLabelX = x(best.epoch) + 8;
    const peakLabelY = margin.top + innerH - 10;
    parts.push(`<text x="${peakLabelX.toFixed(2)}" y="${peakLabelY}" fill="#313632" stroke="#fffdf9" stroke-width="4" stroke-linejoin="round" font-size="13" font-weight="760">peak</text>`);
    parts.push(`<text x="${peakLabelX.toFixed(2)}" y="${peakLabelY}" fill="#313632" font-size="13" font-weight="760">peak</text>`);
  }

  parts.push(...regimeLabels);

  metrics.forEach((metric, i) => {
    const lx = margin.left + i * 252;
    parts.push(`<line x1="${lx}" x2="${lx + 24}" y1="24" y2="24" stroke="${metric.color}" stroke-width="3.4" stroke-linecap="round"/>`);
    parts.push(`<circle cx="${lx + 24}" cy="24" r="3.8" fill="#fffdf9" stroke="${metric.color}" stroke-width="2"/>`);
    parts.push(`<text x="${lx + 34}" y="28" fill="#3e443f" font-size="12" font-weight="650">${metric.label}</text>`);
  });
  parts.push(`<g class="trajectory-hover-indicator" id="trajectoryHoverIndicator" aria-hidden="true"></g>`);
  rows.forEach((row, i) => {
    const currentX = x(row.epoch);
    const prevX = i === 0 ? margin.left : (x(rows[i - 1].epoch) + currentX) / 2;
    const nextX = i === rows.length - 1 ? margin.left + innerW : (currentX + x(rows[i + 1].epoch)) / 2;
    parts.push(`<rect class="trajectory-hover-zone" data-index="${i}" x="${prevX.toFixed(2)}" y="${margin.top}" width="${Math.max(6, nextX - prevX).toFixed(2)}" height="${innerH}" fill="transparent"/>`);
  });
  parts.push("</svg>");
  el.trajectoryView.innerHTML = parts.join("");

  renderTrajectorySummaryStats(rows, best);

  const hoverIndicator = el.trajectoryView.querySelector("#trajectoryHoverIndicator");
  const resetTrajectoryReadout = () => {
    hoverIndicator.classList.remove("active");
    hoverIndicator.innerHTML = "";
    renderTrajectorySummaryStats(rows, best);
  };
  el.trajectoryView.onmouseleave = resetTrajectoryReadout;
  el.trajectoryView.querySelectorAll(".trajectory-hover-zone").forEach((zone) => {
    const index = Number(zone.dataset.index);
    const row = rows[index];
    const hoverX = x(row.epoch);
    const metricMarkers = metrics
      .filter((metric) => row[metric.field] !== null)
      .map((metric) => `<circle cx="${hoverX.toFixed(2)}" cy="${y(row[metric.field]).toFixed(2)}" r="5.2" fill="#fffdf9" stroke="${metric.color}" stroke-width="2.5"/>`)
      .join("");
    const hoverMarkup = `<line x1="${hoverX.toFixed(2)}" x2="${hoverX.toFixed(2)}" y1="${margin.top}" y2="${margin.top + innerH}" stroke="#2e332f" stroke-dasharray="3 5" stroke-width="1.25"/>${metricMarkers}`;
    zone.addEventListener("mouseenter", () => {
      renderTrajectoryEpochStats(row, metrics);
      hoverIndicator.innerHTML = hoverMarkup;
      hoverIndicator.classList.add("active");
    });
    zone.addEventListener("mousemove", () => {
      renderTrajectoryEpochStats(row, metrics);
      hoverIndicator.innerHTML = hoverMarkup;
      hoverIndicator.classList.add("active");
    });
    zone.addEventListener("mouseleave", () => {
      resetTrajectoryReadout();
    });
  });
}

function renderCoverage() {
  const parts = [];
  parts.push('<div class="coverage-head"></div>');
  RATIOS.forEach((ratio) => parts.push(`<div class="coverage-head">${ratio}%</div>`));
  SCALES.forEach((scale) => {
    parts.push(`<div class="coverage-row-head">${scale}%</div>`);
    RATIOS.forEach((ratio) => {
      const available = state.trajectories.has(key(scale, ratio));
      const selected = state.selectedScale === scale && state.selectedRatio === ratio;
      parts.push(`<button type="button" class="coverage-cell ${available ? "available" : "missing"} ${selected ? "selected" : ""}" data-scale="${scale}" data-ratio="${ratio}" title="${available ? "Available; arrow keys move from the selected cell" : "Missing"}" aria-label="${scale}% scale, ${ratio}% noise">${available ? "on" : "--"}</button>`);
    });
  });
  el.coverageGrid.innerHTML = parts.join("");
  el.coverageGrid.querySelectorAll(".coverage-cell").forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedTrajectory(Number(button.dataset.scale), Number(button.dataset.ratio), { focusCoverage: true });
    });
  });
}

function focusSelectedCoverageCell() {
  const selector = `.coverage-cell[data-scale="${state.selectedScale}"][data-ratio="${state.selectedRatio}"]`;
  const node = el.coverageGrid.querySelector(selector);
  if (node) node.focus({ preventScroll: true });
}

function setSelectedTrajectory(scale, ratio, options = {}) {
  if (!state.trajectories.has(key(scale, ratio))) return false;
  state.selectedScale = scale;
  state.selectedRatio = ratio;
  syncControls();
  renderAll();
  if (options.focusCoverage) {
    requestAnimationFrame(focusSelectedCoverageCell);
  }
  return true;
}

function moveSelectedTrajectory(dx, dy) {
  let scaleIndex = SCALES.indexOf(state.selectedScale);
  let ratioIndex = RATIOS.indexOf(state.selectedRatio);
  while (scaleIndex + dy >= 0 && scaleIndex + dy < SCALES.length && ratioIndex + dx >= 0 && ratioIndex + dx < RATIOS.length) {
    scaleIndex += dy;
    ratioIndex += dx;
    const scale = SCALES[scaleIndex];
    const ratio = RATIOS[ratioIndex];
    if (setSelectedTrajectory(scale, ratio, { focusCoverage: true })) return true;
  }
  return false;
}

function focusSelectedPerturbCoverageCell() {
  const selector = `.coverage-cell[data-scale="${state.perturbScale}"][data-ratio="${state.perturbRatio}"]`;
  const node = el.perturbCoverageGrid.querySelector(selector);
  if (node) node.focus({ preventScroll: true });
}

function setSelectedPerturbation(scale, ratio, options = {}) {
  if (!state.perturbations.has(key(scale, ratio))) return false;
  state.perturbScale = scale;
  state.perturbRatio = ratio;
  syncControls();
  renderPerturbations();
  if (options.focusCoverage) {
    requestAnimationFrame(focusSelectedPerturbCoverageCell);
  }
  return true;
}

function moveSelectedPerturbation(dx, dy) {
  let scaleIndex = SCALES.indexOf(state.perturbScale);
  let ratioIndex = PERTURB_RATIOS.indexOf(state.perturbRatio);
  while (scaleIndex + dy >= 0 && scaleIndex + dy < SCALES.length && ratioIndex + dx >= 0 && ratioIndex + dx < PERTURB_RATIOS.length) {
    scaleIndex += dy;
    ratioIndex += dx;
    const scale = SCALES[scaleIndex];
    const ratio = PERTURB_RATIOS[ratioIndex];
    if (setSelectedPerturbation(scale, ratio, { focusCoverage: true })) return true;
  }
  return false;
}

function perturbRows(scale, ratio, checkpoint) {
  return (state.perturbations.get(key(scale, ratio)) || [])
    .filter((row) => row.checkpoint === checkpoint)
    .sort((a, b) => b.snr - a.snr);
}

function selectedPerturbSnr() {
  return PERTURB_SNRS[state.perturbSnrIndex] ?? PERTURB_SNRS[0];
}

function setPerturbSnrIndex(index) {
  const nextIndex = Math.max(0, Math.min(PERTURB_SNRS.length - 1, Number(index)));
  if (!Number.isFinite(nextIndex)) return;
  state.perturbSnrIndex = nextIndex;
  renderPerturbCurves();
}

function perturbRowAtSnr(scale, ratio, checkpoint, snr) {
  return perturbRows(scale, ratio, checkpoint).find((row) => row.snr === snr) || null;
}

function perturbCurvePath(rows, x, y, field) {
  return rows
    .filter((row) => row[field] !== null && Number.isFinite(x(row.snr)))
    .map((row, i) => `${i === 0 ? "M" : "L"} ${x(row.snr).toFixed(2)} ${y(row[field]).toFixed(2)}`)
    .join(" ");
}

function renderCheckpointPerturbCurve(checkpoint, target) {
  const rows = perturbRows(state.perturbScale, state.perturbRatio, checkpoint);
  if (!rows.length) {
    target.innerHTML = `<div class="empty-state compact-empty">No ${checkpoint} checkpoint perturbation data yet for ${state.perturbScale}% scale and ${state.perturbRatio}% noise.</div>`;
    return;
  }

  const width = 560;
  const height = 360;
  const margin = { top: 24, right: 20, bottom: 58, left: 58 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const xIndex = new Map(PERTURB_SNRS.map((snr, i) => [snr, i]));
  const x = (snr) => {
    const index = xIndex.get(snr);
    return index === undefined ? NaN : margin.left + (index / (PERTURB_SNRS.length - 1 || 1)) * innerW;
  };
  const y = (value) => margin.top + (1 - value / 100) * innerH;
  const selectedSnr = selectedPerturbSnr();
  const selectedX = x(selectedSnr);
  const parts = [];

  parts.push(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="${checkpoint} checkpoint SNR perturbation curves">`);
  parts.push(`<defs><filter id="perturbShadow-${checkpoint}" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#5c554b" flood-opacity="0.16"/></filter></defs>`);
  parts.push(`<rect x="${margin.left}" y="${margin.top}" width="${innerW}" height="${innerH}" rx="8" fill="#fffdf9" stroke="#d8d2c7"/>`);
  [0, 25, 50, 75, 100].forEach((tick) => {
    parts.push(`<line x1="${margin.left}" x2="${margin.left + innerW}" y1="${y(tick)}" y2="${y(tick)}" stroke="#e8e1d6" stroke-width="1"/>`);
    parts.push(`<text x="${margin.left - 10}" y="${y(tick) + 4}" text-anchor="end" fill="#666c68" font-size="11">${tick}</text>`);
  });
  PERTURB_SNRS.forEach((snr) => {
    const isSelected = snr === selectedSnr;
    parts.push(`<text x="${x(snr)}" y="${height - 27}" text-anchor="middle" fill="${isSelected ? "#202320" : "#666c68"}" font-size="${isSelected ? "12" : "10.5"}" font-weight="${isSelected ? "800" : "500"}">${snr}</text>`);
  });
  parts.push(`<text x="${margin.left + innerW / 2}" y="${height - 7}" text-anchor="middle" fill="#666c68" font-size="11">SNR (dB, lower is stronger perturbation)</text>`);
  parts.push(`<text x="16" y="${margin.top + innerH / 2}" transform="rotate(-90 16 ${margin.top + innerH / 2})" text-anchor="middle" fill="#666c68" font-size="11">Accuracy (%)</text>`);

  if (Number.isFinite(selectedX)) {
    parts.push(`<line x1="${selectedX.toFixed(2)}" x2="${selectedX.toFixed(2)}" y1="${margin.top}" y2="${margin.top + innerH}" stroke="#4f5651" stroke-width="1.4" stroke-dasharray="4 4" opacity="0.72"/>`);
  }

  PERTURB_METRICS.forEach((metric) => {
    const path = perturbCurvePath(rows, x, y, metric.field);
    if (!path) return;
    parts.push(`<path d="${path}" fill="none" stroke="#fffdf9" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" opacity="0.92"/>`);
    parts.push(`<path d="${path}" fill="none" stroke="${metric.color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#perturbShadow-${checkpoint})"/>`);
    rows.forEach((row) => {
      const value = row[metric.field];
      if (value !== null && Number.isFinite(x(row.snr))) {
        parts.push(`<circle cx="${x(row.snr).toFixed(2)}" cy="${y(value).toFixed(2)}" r="3.6" fill="#fffdf9" stroke="${metric.color}" stroke-width="2"/>`);
      }
    });
    const selectedRow = rows.find((row) => row.snr === selectedSnr);
    const selectedValue = selectedRow?.[metric.field];
    if (selectedValue !== null && selectedValue !== undefined && Number.isFinite(selectedX)) {
      parts.push(`<circle cx="${selectedX.toFixed(2)}" cy="${y(selectedValue).toFixed(2)}" r="6.1" fill="#fffdf9" stroke="#202320" stroke-width="2.2"/>`);
      parts.push(`<circle cx="${selectedX.toFixed(2)}" cy="${y(selectedValue).toFixed(2)}" r="3.1" fill="${metric.color}" stroke="#fffdf9" stroke-width="1"/>`);
    }
  });
  parts.push("</svg>");
  target.innerHTML = parts.join("");
}

function renderPerturbSnrInspector() {
  const snr = selectedPerturbSnr();
  el.perturbSnrSlider.value = String(state.perturbSnrIndex);
  el.perturbSnrReadout.textContent = `${snr} dB`;
  el.perturbSnrTicks.querySelectorAll(".snr-tick").forEach((button) => {
    const selected = Number(button.dataset.snrIndex) === state.perturbSnrIndex;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });

  const checkpointLabels = [
    ["best", "Best"],
    ["last", "Last"],
  ];
  el.perturbSnrStats.innerHTML = checkpointLabels.map(([checkpoint, label]) => {
    const row = perturbRowAtSnr(state.perturbScale, state.perturbRatio, checkpoint, snr);
    const metrics = PERTURB_METRICS.map((metric) => `
      <span class="snr-metric">
        <span class="snr-dot" style="background:${metric.color}"></span>
        <span>${metric.shortLabel}</span>
        <strong>${formatPct(row?.[metric.field] ?? null, 1)}</strong>
      </span>
    `).join("");
    return `
      <article class="snr-checkpoint-card">
        <h4>${label} checkpoint</h4>
        <div>${metrics}</div>
      </article>
    `;
  }).join("");
}

function renderPerturbCurves() {
  el.perturbCurveTitle.textContent = `${state.perturbScale}% training scale, ${state.perturbRatio}% label noise`;
  renderPerturbSnrInspector();
  renderCheckpointPerturbCurve("best", el.perturbBestCurveView);
  renderCheckpointPerturbCurve("last", el.perturbLastCurveView);
  el.perturbLegend.innerHTML = PERTURB_METRICS.map((metric) => `
    <span class="legend-item">
      <span class="legend-line" style="background:${metric.color}"></span>
      ${metric.label}
    </span>
  `).join("");
}

function renderPerturbCoverage() {
  const parts = [];
  parts.push('<div class="coverage-head"></div>');
  PERTURB_RATIOS.forEach((ratio) => parts.push(`<div class="coverage-head">${ratio}%</div>`));
  SCALES.forEach((scale) => {
    parts.push(`<div class="coverage-row-head">${scale}%</div>`);
    PERTURB_RATIOS.forEach((ratio) => {
      const available = state.perturbations.has(key(scale, ratio));
      const selected = state.perturbScale === scale && state.perturbRatio === ratio;
      parts.push(`<button type="button" class="coverage-cell ${available ? "available" : "missing"} ${selected ? "selected" : ""}" data-scale="${scale}" data-ratio="${ratio}" title="${available ? "Available; arrow keys move from the selected cell" : "Missing"}" aria-label="${scale}% scale, ${ratio}% noise">${available ? "on" : "--"}</button>`);
    });
  });
  el.perturbCoverageGrid.innerHTML = parts.join("");
  el.perturbCoverageGrid.querySelectorAll(".coverage-cell").forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedPerturbation(Number(button.dataset.scale), Number(button.dataset.ratio), { focusCoverage: true });
    });
  });
}

function renderPerturbations() {
  renderPerturbCurves();
  renderPerturbCoverage();
}

function renderAll() {
  renderStatus();
  renderHeatmap();
  renderTrajectory();
  renderCoverage();
  renderPerturbations();
}

async function loadAll() {
  const trajectoryFiles = await listTrajectoryFiles();
  const loadTrajectoryFile = async (file) => {
    const match = file.match(/^scale_(\d+)pct_ratio_(\d+)pct\.csv$/);
    if (!match) return null;
    const scale = Number(match[1]);
    const ratio = Number(match[2]);
    try {
      const rows = await fetchCSV(PATHS.trajectory(scale, ratio));
      const parsed = parseTrajectory(rows);
      if (parsed.length) state.trajectories.set(key(scale, ratio), parsed);
    } catch {
      // Keep the slot empty if an indexed CSV cannot be read.
    }
    return key(scale, ratio);
  };

  try {
    state.matrix = parseMatrix(await fetchCSV(PATHS.matrix));
  } catch (error) {
    console.error(error);
    el.matrixStatus.textContent = "Not loaded";
  }

  try {
    state.perturbations = parsePerturbations(await fetchCSV(PATHS.perturbations));
  } catch (error) {
    console.error(error);
    el.perturbationStatus.textContent = "Not loaded";
  }

  const selectedTrajectoryFile = `scale_${state.selectedScale}pct_ratio_${state.selectedRatio}pct.csv`;
  if (trajectoryFiles.includes(selectedTrajectoryFile)) {
    await loadTrajectoryFile(selectedTrajectoryFile);
  }

  if (!state.trajectories.has(key(state.selectedScale, state.selectedRatio))) {
    const first = trajectoryFiles.find((file) => /^scale_(\d+)pct_ratio_(\d+)pct\.csv$/.test(file));
    if (first) {
      const [, scaleText, ratioText] = first.match(/^scale_(\d+)pct_ratio_(\d+)pct\.csv$/);
      const scale = Number(scaleText);
      const ratio = Number(ratioText);
      state.selectedScale = scale;
      state.selectedRatio = ratio;
      await loadTrajectoryFile(first);
    }
  }

  if (!state.perturbations.has(key(state.perturbScale, state.perturbRatio))) {
    const first = [...state.perturbations.keys()][0];
    if (first) {
      const [scale, ratio] = first.split(":").map(Number);
      state.perturbScale = scale;
      state.perturbRatio = ratio;
    }
  }

  populateControls();
  renderAll();

  Promise.allSettled(
    trajectoryFiles
      .filter((file) => {
        const match = file.match(/^scale_(\d+)pct_ratio_(\d+)pct\.csv$/);
        return match && !state.trajectories.has(key(Number(match[1]), Number(match[2])));
      })
      .map(loadTrajectoryFile),
  ).then(() => {
    renderAll();
  });
}

el.scaleSelect.addEventListener("change", () => {
  setSelectedTrajectory(Number(el.scaleSelect.value), state.selectedRatio);
});

el.ratioSelect.addEventListener("change", () => {
  setSelectedTrajectory(state.selectedScale, Number(el.ratioSelect.value));
});

document.addEventListener("keydown", (event) => {
  const directions = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  };
  const direction = directions[event.key];
  const activeTag = document.activeElement?.tagName;
  if (!direction || ["INPUT", "SELECT", "TEXTAREA"].includes(activeTag)) return;
  const activePerturbCoverage = document.activeElement?.closest?.("#perturbCoverageGrid");
  const moved = activePerturbCoverage
    ? moveSelectedPerturbation(direction[0], direction[1])
    : moveSelectedTrajectory(direction[0], direction[1]);
  if (moved) {
    event.preventDefault();
  }
});

el.perturbScaleSelect.addEventListener("change", () => {
  state.perturbScale = Number(el.perturbScaleSelect.value);
  renderPerturbations();
});

el.perturbRatioSelect.addEventListener("change", () => {
  state.perturbRatio = Number(el.perturbRatioSelect.value);
  renderPerturbations();
});

["input", "change"].forEach((eventName) => {
  el.perturbSnrSlider.addEventListener(eventName, () => {
    setPerturbSnrIndex(el.perturbSnrSlider.value);
  });
});

el.perturbSnrTicks.querySelectorAll(".snr-tick").forEach((button) => {
  button.addEventListener("click", () => {
    setPerturbSnrIndex(button.dataset.snrIndex);
  });
});

loadAll();
