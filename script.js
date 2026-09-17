'use strict';

// ============================================================
// Verified study figures. Every number here traces to
// export_dashboard_data.py, run against the real trained models
// (models_raw5/) and real cleaned/engineered data (output_raw5/).
// ============================================================
const ANALYTES = {
    WBC: { name: 'White Blood Cell Count', unit: '×10⁹/L',  decimals: 1 },
    HGB: { name: 'Hemoglobin',             unit: 'g/dL',    decimals: 1 },
    HCT: { name: 'Hematocrit',             unit: 'L/L',     decimals: 2 },
    RBC: { name: 'Red Blood Cell Count',   unit: '×10¹²/L', decimals: 2 },
    NA:  { name: 'Sodium',                 unit: 'mmol/L',  decimals: 0 }
};

const TOTAL_PATIENTS = 9632;
const TOTAL_VECTORS = 123136;

const COHORT = [
    { code: 'WBC', patients: 9382, vectors: 28919, Increasing: 37.1, Decreasing: 36.6, Stable: 26.3, imbalance: '1.4 : 1' },
    { code: 'HGB', patients: 9408, vectors: 29012, Increasing: 18.6, Decreasing: 14.9, Stable: 66.5, imbalance: '4.5 : 1' },
    { code: 'HCT', patients: 9423, vectors: 28980, Increasing: 20.1, Decreasing: 15.1, Stable: 64.8, imbalance: '4.3 : 1' },
    { code: 'RBC', patients: 9381, vectors: 28920, Increasing: 19.7, Decreasing: 15.7, Stable: 64.6, imbalance: '4.1 : 1' },
    { code: 'NA',  patients: 2393, vectors: 7305,  Increasing: 2.9,  Decreasing: 2.2,  Stable: 94.9, imbalance: '43.1 : 1' }
];

const CLASSES = ['Increasing', 'Stable', 'Decreasing'];

// Real evaluation results: metrics, confusion matrices, and per-metric
// Wilcoxon Signed-Rank Test results, per analyte, for both models.
// Rows/columns of confusion_matrix follow CLASSES order (actual rows,
// predicted columns). Source: export_dashboard_data.py output,
// cross-checked against Chapter 4 Table 4.5-4.7.
const EVALUATION = {
    WBC: {
        baseline: { accuracy: 0.512, balanced_accuracy: 0.4787, macro_f1: 0.4622, precision_macro: 0.4758, recall_macro: 0.4787,
            confusion_matrix: [[1660, 389, 872], [984, 403, 935], [747, 295, 2367]], latency_ms: 47.87 },
        twcs: { accuracy: 0.4835, balanced_accuracy: 0.467, macro_f1: 0.4662, precision_macro: 0.4684, recall_macro: 0.467,
            confusion_matrix: [[1241, 872, 808], [673, 823, 826], [566, 724, 2119]], latency_ms: 47.89 },
        wilcoxon: {
            accuracy: { W: 10.0, p: 0.00062, significant: true },
            balanced_accuracy: { W: 80.0, p: 0.36828, significant: false },
            macro_f1: { W: 58.0, p: 0.08255, significant: false },
            precision_macro: { W: 104.0, p: 0.98544, significant: false },
            recall_macro: { W: 80.0, p: 0.36828, significant: false }
        }
    },
    HGB: {
        baseline: { accuracy: 0.6922, balanced_accuracy: 0.476, macro_f1: 0.4701, precision_macro: 0.5597, recall_macro: 0.476,
            confusion_matrix: [[711, 791, 11], [478, 5204, 104], [125, 1157, 80]], latency_ms: 47.9 },
        twcs: { accuracy: 0.6162, balanced_accuracy: 0.5269, macro_f1: 0.506, precision_macro: 0.497, recall_macro: 0.5269,
            confusion_matrix: [[931, 465, 117], [961, 4043, 782], [254, 745, 363]], latency_ms: 47.92 },
        wilcoxon: {
            accuracy: { W: 0.0, p: 0.00009, significant: true },
            balanced_accuracy: { W: 0.0, p: 0.00001, significant: true },
            macro_f1: { W: 0.0, p: 0.00001, significant: true },
            precision_macro: { W: 25.0, p: 0.00169, significant: true },
            recall_macro: { W: 0.0, p: 0.00001, significant: true }
        }
    },
    HCT: {
        baseline: { accuracy: 0.6687, balanced_accuracy: 0.4682, macro_f1: 0.4684, precision_macro: 0.5251, recall_macro: 0.4682,
            confusion_matrix: [[706, 850, 32], [530, 4961, 203], [125, 1128, 122]], latency_ms: 47.89 },
        twcs: { accuracy: 0.5922, balanced_accuracy: 0.5201, macro_f1: 0.4944, precision_macro: 0.4862, recall_macro: 0.5201,
            confusion_matrix: [[1007, 434, 147], [1154, 3753, 787], [252, 756, 367]], latency_ms: 47.81 },
        wilcoxon: {
            accuracy: { W: 0.0, p: 0.00009, significant: true },
            balanced_accuracy: { W: 0.0, p: 0.00001, significant: true },
            macro_f1: { W: 7.0, p: 0.00004, significant: true },
            precision_macro: { W: 35.0, p: 0.0073, significant: true },
            recall_macro: { W: 0.0, p: 0.00001, significant: true }
        }
    },
    RBC: {
        baseline: { accuracy: 0.6654, balanced_accuracy: 0.4558, macro_f1: 0.4536, precision_macro: 0.5264, recall_macro: 0.4558,
            confusion_matrix: [[631, 896, 36], [455, 5021, 155], [123, 1230, 105]], latency_ms: 58.95 },
        twcs: { accuracy: 0.5808, balanced_accuracy: 0.5043, macro_f1: 0.4816, precision_macro: 0.4742, recall_macro: 0.5043,
            confusion_matrix: [[938, 456, 169], [1092, 3719, 820], [308, 782, 368]], latency_ms: 59.23 },
        wilcoxon: {
            accuracy: { W: 0.0, p: 0.00009, significant: true },
            balanced_accuracy: { W: 0.0, p: 0.00001, significant: true },
            macro_f1: { W: 3.0, p: 0.00001, significant: true },
            precision_macro: { W: 19.0, p: 0.00059, significant: true },
            recall_macro: { W: 0.0, p: 0.00001, significant: true }
        }
    },
    NA: {
        baseline: { accuracy: 0.953, balanced_accuracy: 0.4025, macro_f1: 0.4436, precision_macro: 0.727, recall_macro: 0.4025,
            confusion_matrix: [[10, 60, 0], [6, 2197, 2], [0, 41, 3]], latency_ms: 48.43 },
        twcs: { accuracy: 0.9116, balanced_accuracy: 0.5273, macro_f1: 0.4768, precision_macro: 0.4524, recall_macro: 0.5273,
            confusion_matrix: [[37, 33, 0], [93, 2072, 40], [3, 36, 5]], latency_ms: 48.52 },
        wilcoxon: {
            accuracy: { W: 0.0, p: 0.00009, significant: true },
            balanced_accuracy: { W: 26.0, p: 0.00199, significant: true },
            macro_f1: { W: 71.0, p: 0.21617, significant: false },
            precision_macro: { W: 97.0, p: 0.78413, significant: false },
            recall_macro: { W: 47.0, p: 0.02958, significant: false }
        }
    }
};

// Illustrative adult reference intervals for the demo only.
// Replace with the SBSI laboratory's own intervals.
const REFERENCE_INTERVALS = {
    WBC: { all: [4.5, 11.0] },
    HGB: { F: [12.0, 15.5], M: [13.5, 17.5] },
    HCT: { F: [0.36, 0.46], M: [0.41, 0.53] },
    RBC: { F: [4.1, 5.1],   M: [4.5, 5.9] },
    NA:  { all: [135, 145] }
};

// ============================================================
// SYNTHETIC demonstration patients. Not real patient data.
// `prediction` stands in for the output file of the trained model:
// the dashboard only displays it, it never computes a forecast.
// Probabilities are sample values. Latency is per-patient, single-
// prediction latency, which has not yet been separately measured
// (the measured figures on the Global Model Evaluation tab are
// batch latency over the full held-out test set, a different
// quantity), so it stays unset here pending that measurement.
// ============================================================
const DEMO_PATIENTS = [
    {
        id: 'DEMO-01', sex: 'F', analyte: 'HGB', context: 'anaemia under treatment',
        start: '2026-03-11', days: [0, 5, 11, 13, 20, 26],
        values: [8.9, 8.6, 8.8, 9.1, 9.6, 10.4],
        prediction: {
            time: '05:12', latencyMs: null,
            twcs: { cls: 'Increasing', proba: { Increasing: 0.71, Stable: 0.27, Decreasing: 0.02 } },
            rf:   { cls: 'Stable',     proba: { Increasing: 0.38, Stable: 0.60, Decreasing: 0.02 } }
        }
    },
    {
        id: 'DEMO-02', sex: 'M', analyte: 'NA', context: 'routine chemistry follow-up',
        start: '2025-12-02', days: [0, 31, 58, 90, 117],
        values: [139, 141, 138, 140, 139],
        prediction: {
            time: '05:04', latencyMs: null,
            twcs: { cls: 'Stable', proba: { Increasing: 0.04, Stable: 0.93, Decreasing: 0.03 } },
            rf:   { cls: 'Stable', proba: { Increasing: 0.02, Stable: 0.96, Decreasing: 0.02 } }
        }
    },
    {
        id: 'DEMO-03', sex: 'M', analyte: 'WBC', context: 'bacterial infection on antibiotics',
        start: '2026-03-01', days: [0, 4, 6, 9, 15, 20, 26],
        values: [8.1, 17.2, 18.6, 16.0, 14.1, 13.0, 11.8],
        prediction: {
            time: '05:31', latencyMs: null,
            twcs: { cls: 'Decreasing', proba: { Increasing: 0.05, Stable: 0.31, Decreasing: 0.64 } },
            rf:   { cls: 'Decreasing', proba: { Increasing: 0.05, Stable: 0.43, Decreasing: 0.52 } }
        }
    },
    {
        id: 'DEMO-04', sex: 'M', analyte: 'HCT', context: 'post-operative monitoring',
        start: '2026-03-09', days: [0, 6, 13, 19, 24, 26],
        values: [0.47, 0.46, 0.47, 0.45, 0.44, 0.42],
        prediction: {
            time: '04:48', latencyMs: null,
            twcs: { cls: 'Decreasing', proba: { Increasing: 0.02, Stable: 0.40, Decreasing: 0.58 } },
            rf:   { cls: 'Stable',     proba: { Increasing: 0.02, Stable: 0.67, Decreasing: 0.31 } }
        }
    },
    {
        id: 'DEMO-05', sex: 'F', analyte: 'RBC', context: 'scheduled haematology monitoring',
        start: '2026-01-05',
        days: [0, 6, 10, 19, 25, 38, 40, 47, 52, 58, 69, 72, 78, 86, 92, 96, 110, 116],
        values: [4.52, 4.47, 4.58, 4.49, 4.41, 4.55, 4.60, 4.51, 4.46, 4.53, 4.62, 4.57, 4.48, 4.44, 4.52, 4.59, 4.50, 4.54],
        prediction: {
            time: '05:20', latencyMs: null,
            twcs: { cls: 'Stable', proba: { Increasing: 0.06, Stable: 0.88, Decreasing: 0.06 } },
            rf:   { cls: 'Stable', proba: { Increasing: 0.04, Stable: 0.92, Decreasing: 0.04 } }
        }
    },
    {
        id: 'DEMO-06', sex: 'F', analyte: 'NA', context: 'elderly, reduced oral intake',
        start: '2026-01-20', days: [0, 26, 33, 38, 41],
        values: [138, 140, 142, 144, 146],
        prediction: {
            time: '05:07', latencyMs: null,
            twcs: { cls: 'Increasing', proba: { Increasing: 0.52, Stable: 0.46, Decreasing: 0.02 } },
            rf:   { cls: 'Stable',     proba: { Increasing: 0.17, Stable: 0.81, Decreasing: 0.02 } }
        }
    }
];

// Direction is encoded by glyph angle only: identical colour and weight for all three.
const DIRECTION_ANGLE = { Increasing: -45, Stable: 0, Decreasing: 45 };
const NEUTRAL = '#e6edf3';

let currentChart = null;
let pipelineState = 'idle';
let costAnalyte = 'NA';
let evalAnalyte = 'HGB';
let evalMode = 'twcs';

// ------------------------------------------------------------
// Formatting helpers
// ------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function addDays(iso, n) {
    const d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d;
}
function fmtDate(d) {
    return String(d.getUTCDate()).padStart(2, '0') + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
}
function fmtVal(v, code) { return v.toFixed(ANALYTES[code].decimals); }
function withUnit(v, code) { return fmtVal(v, code) + ' ' + ANALYTES[code].unit; }
function fmtInt(n) { return n.toLocaleString('en-US'); }
function fmtP(p) { return p < 0.0001 ? '< 0.0001' : p.toFixed(5); }

function refInterval(p) {
    const r = REFERENCE_INTERVALS[p.analyte];
    return r[p.sex] || r.all;
}

function median(arr) {
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function glyphSVG(cls, size) {
    return `<svg class="dir-glyph-mini" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29"></circle>
        <g transform="rotate(${DIRECTION_ANGLE[cls]} 32 32)"><line x1="15" y1="32" x2="47" y2="32"></line><polyline points="36,21 47,32 36,43"></polyline></g>
    </svg>`;
}

// ------------------------------------------------------------
// Tab switching
// ------------------------------------------------------------
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`).classList.add('active');
    if (tabId === 'tab-cdss' && currentChart) currentChart.resize();
}

// ------------------------------------------------------------
// Reference-range status: derived from the reference interval and
// the observed results only, never from the model's forecast.
// ------------------------------------------------------------
function rangeStatus(p) {
    const [lo, hi] = refInterval(p);
    const t = p.values[p.values.length - 1];
    const prev = p.values[p.values.length - 2];
    const nearMargin = 0.15 * (hi - lo);
    const code = p.analyte;
    const refText = `reference ${fmtVal(lo, code)}–${fmtVal(hi, code)} ${ANALYTES[code].unit}`;

    let level, label, movement;
    if (t < lo) {
        level = 'outside';
        label = `Below reference range · ${withUnit(t, code)}`;
        movement = t > prev ? 'moving toward the range' : t < prev ? 'moving further below' : 'unchanged';
    } else if (t > hi) {
        level = 'outside';
        label = `Above reference range · ${withUnit(t, code)}`;
        movement = t < prev ? 'moving toward the range' : t > prev ? 'moving further above' : 'unchanged';
    } else if (t - lo <= nearMargin && t < prev) {
        level = 'near';
        label = `Nearing lower limit · ${withUnit(t, code)}`;
        movement = 'moving toward the lower limit';
    } else if (hi - t <= nearMargin && t > prev) {
        level = 'near';
        label = `Nearing upper limit · ${withUnit(t, code)}`;
        movement = 'moving toward the upper limit';
    } else {
        level = 'within';
        label = `Within reference range · ${withUnit(t, code)}`;
        movement = t > prev ? 'rising' : t < prev ? 'falling' : 'unchanged';
    }
    return { level, label, note: `Observed T−1 → T: ${movement} · ${refText}`, lo, hi, t, prev };
}

// ------------------------------------------------------------
// Patient Trajectory Analysis
// ------------------------------------------------------------
function populatePatients() {
    const sel = document.getElementById('patientSelect');
    sel.innerHTML = '';
    DEMO_PATIENTS.forEach(p => {
        const o = document.createElement('option');
        o.value = p.id;
        o.textContent = `${p.id} | ${ANALYTES[p.analyte].name} (${p.analyte}) | ${p.sex}, ${p.context}`;
        sel.appendChild(o);
    });
}

function loadPatientData() {
    const id = document.getElementById('patientSelect').value;
    const p = DEMO_PATIENTS.find(d => d.id === id);
    if (!p) return;
    renderAlert(p);
    renderChart(p);
    renderRecordTable(p);
    renderComparison(p);
}

function renderAlert(p) {
    const code = p.analyte;
    const a = ANALYTES[code];
    const n = p.values.length;
    const t = p.values[n - 1];
    const cls = p.prediction.twcs.cls;
    const tDate = addDays(p.start, p.days[n - 1]);

    document.getElementById('dirArrow').setAttribute('transform', `rotate(${DIRECTION_ANGLE[cls]} 32 32)`);
    document.getElementById('dirWord').textContent = cls;

    const sentence = {
        Increasing: `Next result forecast more than 10% above ${withUnit(t, code)}`,
        Decreasing: `Next result forecast more than 10% below ${withUnit(t, code)}`,
        Stable:     `Next result forecast within ±10% of ${withUnit(t, code)}`
    }[cls];
    document.getElementById('dirSentence').textContent = sentence;

    document.getElementById('metaPatient').textContent = `${p.id} · ${p.sex === 'F' ? 'Female' : 'Male'} · synthetic`;
    document.getElementById('metaAnalyte').textContent = `${a.name} (${code}) · ${a.unit}`;
    document.getElementById('metaTime').textContent = `${fmtDate(tDate)}, ${p.prediction.time}`;
    document.getElementById('metaBasis').textContent = `${n} prior results · last 3 used`;
    document.getElementById('metaLatency').innerHTML = p.prediction.latencyMs == null
        ? '<span class="pending">— ms</span> <span class="meta-sub">single-prediction latency not yet separately measured</span>'
        : `${p.prediction.latencyMs.toFixed(1)} ms`;

    const s = rangeStatus(p);
    const box = document.getElementById('concernBox');
    box.dataset.level = s.level;
    document.getElementById('concernLabel').textContent = s.label;
    document.getElementById('concernNote').textContent = s.note;

    // Gauge: reference band centred, domain padded so T and T−1 always fit
    const w = s.hi - s.lo;
    let dMin = Math.min(s.lo - 0.6 * w, s.t, s.prev);
    let dMax = Math.max(s.hi + 0.6 * w, s.t, s.prev);
    const edge = (dMax - dMin) * 0.05;
    dMin -= edge; dMax += edge;
    const pct = v => ((v - dMin) / (dMax - dMin)) * 100;
    const band = document.getElementById('gaugeBand');
    band.style.left = pct(s.lo) + '%';
    band.style.width = (pct(s.hi) - pct(s.lo)) + '%';
    document.getElementById('gaugeMark').style.left = pct(s.t) + '%';
    document.getElementById('gaugePrev').style.left = pct(s.prev) + '%';
}

function renderChart(p) {
    const code = p.analyte;
    const a = ANALYTES[code];
    const n = p.values.length;
    const tDay = p.days[n - 1];
    const rel = p.days.map(d => d - tDay);
    const t = p.values[n - 1];
    const cls = p.prediction.twcs.cls;
    const [lo, hi] = refInterval(p);
    const gaps = p.days.slice(1).map((d, i) => d - p.days[i]);
    const forecastSpan = Math.max(4, Math.round(median(gaps)), Math.round((tDay - p.days[0]) * 0.14));

    let yMin = Math.min(...p.values, lo, t * 0.9);
    let yMax = Math.max(...p.values, hi, t * 1.1);
    const span = yMax - yMin;
    if (cls === 'Increasing') yMax = Math.max(yMax, t * 1.1 + span * 0.45);
    if (cls === 'Decreasing') yMin = Math.min(yMin, t * 0.9 - span * 0.45);
    const pad = (yMax - yMin) * 0.06;
    yMin -= pad; yMax += pad;

    const xMin = rel[0];
    const xRange = forecastSpan - xMin;
    const xStep = xRange <= 50 ? 7 : xRange <= 120 ? 14 : 28;

    document.getElementById('chartTitle').textContent = `${a.name} (${code}) trajectory · ${p.id} · ${a.unit}`;

    const isInput = i => i >= n - 3;
    const stepLabel = i => (i === n - 1 ? 'T' : 'T−' + (n - 1 - i));

    const overlay = {
        id: 'twcsOverlay',
        beforeDatasetsDraw(chart) {
            const { ctx, chartArea: c, scales: { x, y } } = chart;
            ctx.save();

            const yHi = y.getPixelForValue(hi), yLo = y.getPixelForValue(lo);
            ctx.fillStyle = 'rgba(139, 148, 158, 0.16)';
            ctx.fillRect(c.left, yHi, c.right - c.left, yLo - yHi);
            ctx.strokeStyle = 'rgba(139, 148, 158, 0.6)';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1;
            [yHi, yLo].forEach(py => { ctx.beginPath(); ctx.moveTo(c.left, py); ctx.lineTo(c.right, py); ctx.stroke(); });
            ctx.setLineDash([]);
            ctx.fillStyle = '#9da7b3';
            ctx.font = '12px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`Ref high ${fmtVal(hi, code)}`, c.left + 6, yHi - 5);
            ctx.fillText(`Ref low ${fmtVal(lo, code)}`, c.left + 6, yLo + 15);

            const x0 = x.getPixelForValue(0) + 8;
            const x1 = Math.min(x.getPixelForValue(forecastSpan), c.right);
            const yUp = y.getPixelForValue(t * 1.1), yDn = y.getPixelForValue(t * 0.9);
            const zone = {
                Increasing: [c.top, yUp],
                Stable:     [yUp, yDn],
                Decreasing: [yDn, c.bottom]
            }[cls];
            ctx.fillStyle = 'rgba(230, 237, 243, 0.10)';
            ctx.fillRect(x0, zone[0], x1 - x0, zone[1] - zone[0]);
            ctx.strokeStyle = 'rgba(230, 237, 243, 0.75)';
            ctx.setLineDash([6, 4]);
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x0, zone[0], x1 - x0, zone[1] - zone[0]);

            ctx.strokeStyle = 'rgba(230, 237, 243, 0.35)';
            ctx.lineWidth = 1;
            [yUp, yDn].forEach(py => { ctx.beginPath(); ctx.moveTo(x.getPixelForValue(0), py); ctx.lineTo(x1, py); ctx.stroke(); });
            ctx.setLineDash([]);
            ctx.fillStyle = '#c9d1d9';
            ctx.textAlign = 'left';
            ctx.font = '12px "Segoe UI", Arial, sans-serif';
            ctx.fillText('+10%', x1 + 5, yUp + 4);
            ctx.fillText('−10%', x1 + 5, yDn + 4);

            const cx = (x0 + x1) / 2;
            const cy = (zone[0] + zone[1]) / 2;
            const L = 14;
            const ang = DIRECTION_ANGLE[cls] * Math.PI / 180;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(ang);
            ctx.strokeStyle = NEUTRAL;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(L - 8, -8); ctx.lineTo(L, 0); ctx.lineTo(L - 8, 8); ctx.stroke();
            ctx.restore();

            ctx.fillStyle = NEUTRAL;
            ctx.textAlign = 'center';
            ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
            const labelY = cls === 'Decreasing' ? Math.min(cy + 32, c.bottom - 6) : Math.max(cy - 22, c.top + 14);
            ctx.fillText(`T+1: ${cls}`, cx, labelY);
            ctx.restore();
        },
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            ctx.fillStyle = NEUTRAL;
            ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
            ctx.textAlign = 'center';
            for (let i = n - 3; i < n; i++) {
                const pt = meta.data[i];
                ctx.fillText(stepLabel(i), pt.x, pt.y - 13);
            }
            ctx.restore();
        }
    };

    const ctx = document.getElementById('patientChart').getContext('2d');
    if (currentChart) currentChart.destroy();

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${a.name} (${a.unit})`,
                data: rel.map((x, i) => ({ x, y: p.values[i] })),
                borderColor: '#58a6ff',
                borderWidth: 2,
                tension: 0,
                fill: false,
                pointRadius: rel.map((_, i) => (isInput(i) ? 7 : 4)),
                pointHoverRadius: rel.map((_, i) => (isInput(i) ? 9 : 6)),
                pointBackgroundColor: rel.map((_, i) => (isInput(i) ? NEUTRAL : '#58a6ff')),
                pointBorderColor: rel.map((_, i) => (isInput(i) ? '#58a6ff' : '#0d1117')),
                pointBorderWidth: rel.map((_, i) => (isInput(i) ? 3 : 1))
            }]
        },
        plugins: [overlay],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 250 },
            layout: { padding: { top: 18, right: 40 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: items => {
                            const i = items[0].dataIndex;
                            return `${stepLabel(i)} · ${fmtDate(addDays(p.start, p.days[i]))}`;
                        },
                        label: item => {
                            const i = item.dataIndex;
                            const gap = i === 0 ? 'first result' : `${p.days[i] - p.days[i - 1]} d after previous`;
                            return `${withUnit(p.values[i], code)} · ${gap}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: xMin - Math.max(1, xRange * 0.02),
                    max: forecastSpan + Math.max(1, xRange * 0.02),
                    grid: { color: '#262c34' },
                    ticks: { stepSize: xStep, includeBounds: false, color: '#9da7b3', font: { size: 13 }, callback: v => (v === 0 ? 'T' : v + ' d') },
                    title: { display: true, text: 'Days relative to latest result (T = day 0)', color: '#9da7b3', font: { size: 13 } }
                },
                y: {
                    min: yMin,
                    max: yMax,
                    grid: { color: '#262c34' },
                    ticks: { includeBounds: false, color: '#9da7b3', font: { size: 13 }, callback: v => Number(v).toFixed(a.decimals) },
                    title: { display: true, text: a.unit, color: '#9da7b3', font: { size: 13 } }
                }
            }
        }
    });
}

function renderRecordTable(p) {
    const code = p.analyte;
    const n = p.values.length;
    const [lo, hi] = refInterval(p);
    const inputName = { [n - 1]: 'v<sub>T</sub>', [n - 2]: 'v<sub>T−1</sub>', [n - 3]: 'v<sub>T−2</sub>' };

    let rows = '';
    for (let i = 0; i < n; i++) {
        const v = p.values[i];
        const step = i === n - 1 ? 'T (latest)' : 'T−' + (n - 1 - i);
        const gap = i === 0 ? '—' : String(p.days[i] - p.days[i - 1]);
        const flag = v < lo ? '<span class="tag tag-flag">L</span>'
                   : v > hi ? '<span class="tag tag-flag">H</span>'
                   : '<span class="flag-none">—</span>';
        const used = i >= n - 3;
        rows += `<tr class="${used ? 'row-input' : 'row-older'}">
            <td>${step}</td><td>${fmtDate(addDays(p.start, p.days[i]))}</td><td>${gap}</td>
            <td>${withUnit(v, code)}</td><td>${flag}</td>
            <td>${used ? inputName[i] : '<span class="flag-none">—</span>'}</td></tr>`;
    }
    document.getElementById('mechanicsTable').innerHTML = rows;
    const scroll = document.getElementById('recordScroll');
    scroll.scrollTop = scroll.scrollHeight;

    const dt1 = p.days[n - 1] - p.days[n - 2];
    const dt2 = p.days[n - 2] - p.days[n - 3];
    document.getElementById('featureLine').innerHTML =
        `Feature vector X = [v<sub>T</sub>, v<sub>T−1</sub>, v<sub>T−2</sub>, &mu;, &sigma;, &Delta;t<sub>1</sub>, &Delta;t<sub>2</sub>] with &Delta;t<sub>1</sub> = ${dt1} d, &Delta;t<sub>2</sub> = ${dt2} d. ` +
        `Values are min-max normalised per analyte in the pipeline. Older results (—) are not in the vector. The LIS flag (H / L) compares each result against static limits in isolation.`;
}

function renderComparison(p) {
    const card = (title, out, experimental) => {
        const bars = CLASSES.map(c => {
            const pct = Math.round(out.proba[c] * 100);
            return `<div class="prob-row ${c === out.cls ? 'is-pred' : ''}">
                <div class="prob-row-head"><span>${c}</span><span>${pct}%</span></div>
                <div class="prob-bar-container"><div class="prob-bar" style="width: ${pct}%;"></div></div>
            </div>`;
        }).join('');
        return `<div class="model-card ${experimental ? 'model-exp' : ''}">
            <h4>${title}</h4>
            ${bars}
            <div class="model-output">${glyphSVG(out.cls, 26)}<span>Output: <strong>${out.cls}</strong></span></div>
        </div>`;
    };
    document.getElementById('comparisonBox').innerHTML =
        card('Standard RF (Control)', p.prediction.rf, false) +
        card('TWCS-RF (Experimental)', p.prediction.twcs, true);
}

// ------------------------------------------------------------
// Algorithmic Architecture
// ------------------------------------------------------------
function currentDecay() {
    const dt = Number(document.getElementById('dt-slider').value);
    const alpha = Number(document.getElementById('alpha-slider').value);
    return { dt, alpha, w: Math.exp(-alpha * dt) };
}

function updateDecay() {
    const { dt, alpha, w } = currentDecay();
    document.getElementById('dt-val').innerText = dt;
    document.getElementById('alpha-val').innerText = alpha.toFixed(3);
    document.getElementById('halflife-val').innerText = Math.round(Math.LN2 / alpha);
    document.getElementById('decay-result').innerText = w.toFixed(4);
    document.getElementById('decay-bar').style.width = (w * 100) + '%';
    updateComposite();
}

function lambdaFor(row, cls) { return 100 / (3 * row[cls]); }

function renderCostPicker() {
    document.getElementById('costPicker').innerHTML = COHORT.map(r =>
        `<button class="btn-toggle ${r.code === costAnalyte ? 'active' : ''}" onclick="updateCost('${r.code}')">${r.code === 'NA' ? 'Sodium' : r.code}</button>`
    ).join('');
}

function updateCost(code) {
    if (code) costAnalyte = code;
    renderCostPicker();
    const row = COHORT.find(r => r.code === costAnalyte);
    document.getElementById('costTable').innerHTML = CLASSES.map(c =>
        `<tr><td>${c}</td><td style="text-align: right;">${row[c].toFixed(1)}%</td><td style="text-align: right;">${lambdaFor(row, c).toFixed(2)}</td></tr>`
    ).join('');
    const rarest = CLASSES.reduce((a, b) => (row[a] <= row[b] ? a : b));
    document.getElementById('cost-label').textContent =
        `Largest penalty, ${ANALYTES[costAnalyte].name} (N = ${fmtInt(row.vectors)} vectors), rarest class ${rarest}:`;
    document.getElementById('cost-result').innerText = 'λ = ' + lambdaFor(row, rarest).toFixed(2);
    updateComposite();
}

function updateComposite() {
    const row = COHORT.find(r => r.code === costAnalyte);
    if (!row) return;
    const { w } = currentDecay();
    document.getElementById('compositeTable').innerHTML = CLASSES.map(c => {
        const lam = lambdaFor(row, c);
        return `<tr><td>${c} <span class="flag-none">(${ANALYTES[costAnalyte].name})</span></td>
            <td style="text-align: right;">${lam.toFixed(2)}</td><td style="text-align: right;">${w.toFixed(4)}</td>
            <td style="text-align: right;" class="metric-highlight">${(lam * w).toFixed(4)}</td></tr>`;
    }).join('');
}

// ------------------------------------------------------------
// Global Model Evaluation - now backed by real results (EVALUATION),
// with an analyte picker since the study reports five separate
// comparisons, not one pooled result.
// ------------------------------------------------------------
const METRICS = [
    { key: 'accuracy', sop: '1.1', name: 'Accuracy', tip: 'Overall proportion of correctly classified instances across all three directional trend classes. Reported as a secondary measure.' },
    { key: 'balanced_accuracy', sop: '1.2', name: 'Balanced Accuracy', tip: 'The arithmetic mean of the per-class recall scores across all three directional categories. Primary dependent variable under class imbalance.' },
    { key: 'macro_f1', sop: '1.3', name: 'Macro F1-Score', tip: 'The unweighted arithmetic mean of the F1-scores calculated independently for each of the three directional trend classes. Penalizes algorithms that default predictions to the majority class.' },
    { key: 'precision_macro', sop: '1.4', name: 'Precision (Macro)', tip: '' },
    { key: 'recall_macro', sop: '1.5', name: 'Recall (Macro)', tip: '' }
];

function renderEvalPicker() {
    document.getElementById('evalPicker').innerHTML = COHORT.map(r =>
        `<button class="btn-toggle ${r.code === evalAnalyte ? 'active' : ''}" onclick="updateEvalAnalyte('${r.code}')">${r.code === 'NA' ? 'Sodium' : r.code}</button>`
    ).join('');
}

function updateEvalAnalyte(code) {
    evalAnalyte = code;
    renderEvalPicker();
    renderEvalResults();
}

function toggleEval(mode) {
    evalMode = mode;
    document.querySelectorAll('#resultsPanel .btn-toggle').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + mode).classList.add('active');
    document.getElementById('tbl-header-mod').innerText = mode === 'twcs' ? 'TWCS-RF Output' : 'Baseline RF Output';
    renderEvalResults();
}

function renderEvalResults() {
    const data = EVALUATION[evalAnalyte];
    if (!data) return;
    const modelKey = evalMode === 'base' ? 'baseline' : 'twcs';
    const modelData = data[modelKey];
    const analyteName = ANALYTES[evalAnalyte].name;

    // Metrics table, with each row's own Wilcoxon significance alongside it
    document.getElementById('interactive-metrics').innerHTML = METRICS.map(m => {
        const name = m.tip ? `<span class="info-tooltip" data-tooltip="${m.tip}">${m.name}</span>` : m.name;
        const value = modelData[m.key].toFixed(4);
        const wil = data.wilcoxon[m.key];
        const sigText = wil.significant
            ? `<span class="metric-highlight">p = ${fmtP(wil.p)} · significant</span>`
            : `<span class="flag-none">p = ${fmtP(wil.p)} · n.s.</span>`;
        return `<tr><td class="sop-label">${m.sop}</td><td>${name}</td>
            <td style="text-align: right;">${value}</td>
            <td style="text-align: right;">${sigText}</td></tr>`;
    }).join('') + `<tr><td class="sop-label">2</td><td>Inference Latency (ms, matched hyperparameters)</td>
            <td style="text-align: right;">${modelData.latency_ms.toFixed(2)} ms</td>
            <td style="text-align: right;"><span class="flag-none">not significant, all analytes</span></td></tr>`;

    // Confusion matrix
    let grid = '<div></div>' + CLASSES.map(c => `<div class="matrix-header">Predicted ${c}</div>`).join('');
    CLASSES.forEach((actual, ri) => {
        grid += `<div class="matrix-header matrix-row-head">Actual ${actual}</div>`;
        grid += CLASSES.map((pred, ci) => {
            const v = modelData.confusion_matrix[ri][ci];
            const correct = ri === ci;
            return `<div class="matrix-cell"><div class="cell-val ${correct ? 'metric-highlight' : ''}">${fmtInt(v)}</div></div>`;
        }).join('');
    });
    document.getElementById('confusionMatrix').innerHTML = grid;

    // SOP 3 headline hypothesis box: features Balanced Accuracy, the
    // study's primary dependent variable, for the currently selected analyte.
    const primary = data.wilcoxon.balanced_accuracy;
    const verdict = primary.significant
        ? `REJECT H0: TWCS-RF shows a statistically significant difference in Balanced Accuracy versus the standard RF baseline for ${analyteName}.`
        : `FAIL TO REJECT H0: no statistically significant difference in Balanced Accuracy for ${analyteName} at this sample size.`;
    document.getElementById('sopPvalueLine').innerHTML =
        `<span class="info-tooltip" data-tooltip="A non-parametric statistical hypothesis test utilized to compare paired, repeated performance metrics without assuming normal distribution.">Wilcoxon Signed-Rank Test</span> (${analyteName}, Balanced Accuracy) · W = ${primary.W.toFixed(2)} · p-value = ${fmtP(primary.p)} · α' = 0.0083`;
    document.getElementById('sopVerdict').innerHTML =
        `H<sub>0</sub>: no significant difference between TWCS-RF and the standard RF baseline (<span class="info-tooltip" data-tooltip="A strict statistical adjustment applied during hypothesis testing to counteract the multiple comparisons problem by lowering the alpha threshold.">Bonferroni</span> adjusted). ${verdict}`;

    // Left-column stats panel mirrors the same headline result
    document.getElementById('statsLine').innerHTML =
        `${analyteName}, Balanced Accuracy: p-value = ${fmtP(primary.p)} · reject H<sub>0</sub> if p &lt; &alpha;' (0.0083)`;
    document.getElementById('statsVerdict').innerText = verdict;
}

function renderCohortTable() {
    document.querySelector('#cohortTable tbody').innerHTML = COHORT.map(r => {
        const a = ANALYTES[r.code];
        return `<tr>
            <td><strong>${a.name}</strong> <span class="flag-none">${r.code}</span></td>
            <td>${a.unit}</td>
            <td style="text-align: right;">${fmtInt(r.patients)}</td>
            <td style="text-align: right;">${fmtInt(r.vectors)}</td>
            <td style="text-align: right;">${r.Increasing.toFixed(1)}%</td>
            <td style="text-align: right;">${r.Decreasing.toFixed(1)}%</td>
            <td style="text-align: right;">${r.Stable.toFixed(1)}%</td>
            <td><div class="mix-bar">
                <i class="mix-inc" style="width: ${r.Increasing}%;"></i><i class="mix-dec" style="width: ${r.Decreasing}%;"></i><i class="mix-sta" style="width: ${r.Stable}%;"></i>
            </div></td>
            <td style="text-align: right;">${r.imbalance}</td>
        </tr>`;
    }).join('');
    const totalCell = document.getElementById('cohortTotalVectors');
    if (totalCell) totalCell.textContent = fmtInt(TOTAL_VECTORS);
}

// Pipeline execution logs. This REPLAYS the offline pipeline that was
// already run to produce the results shown; it does not compute
// anything live (this is a static, offline dashboard by design).
function logMsg(msg, type = '') {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML += `<div class="log-line ${type}">&gt; ${msg}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runPipeline() {
    const btn = document.getElementById('runBtn');

    if (pipelineState === 'done') {
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('terminal').innerHTML = '<div class="log-line">System initialized. Awaiting pipeline execution.</div>';
        document.getElementById('resultsPanel').classList.add('hidden');
        document.getElementById('statsPanel').classList.add('hidden');
        btn.innerText = 'Replay Evaluation Workflow';
        btn.className = 'btn-run';
        btn.disabled = false;
        pipelineState = 'idle';
        return;
    }

    btn.disabled = true;
    document.getElementById('progressContainer').style.display = 'block';
    const progressBar = document.getElementById('progressBar');
    document.getElementById('terminal').innerHTML = '';

    logMsg('Replaying the offline pipeline execution already run to produce the results below.', 'log-warn');
    progressBar.style.width = '10%'; await sleep(500);
    logMsg('Source: SBSI LIS extract · 4,040,399 raw records · 2 workbooks / 5 tabs');
    progressBar.style.width = '25%'; await sleep(500);
    logMsg(`Cohort rule: \u2265 4 dated results for the same test \u2192 ${fmtInt(TOTAL_PATIENTS)} distinct patients`);
    progressBar.style.width = '40%'; await sleep(500);
    logMsg(`Feature vectors for WBC, HGB, HCT, RBC, Na (canonical units) \u2192 ${fmtInt(TOTAL_VECTORS)} vectors`);
    progressBar.style.width = '55%'; await sleep(500);
    logMsg('70/30 walk-forward split: earliest 70% train, latest 30% test (no shuffling)', 'log-warn');
    progressBar.style.width = '65%'; await sleep(500);
    logMsg('TWCS-RF: fit(X, y, sample_weight = \u03bb \u00b7 w) \u00b7 Baseline: sample_weight = 1', 'log-success');
    progressBar.style.width = '80%'; await sleep(500);
    logMsg('Metrics computed: Accuracy, Balanced Accuracy, Macro F1, Precision, Recall, inference latency');
    progressBar.style.width = '90%'; await sleep(500);
    logMsg("Wilcoxon signed-rank test + Bonferroni correction (\u03b1' = 0.05 / 6 = 0.0083)", 'log-warn');
    await sleep(500);
    logMsg('Results ready.', 'log-success');
    progressBar.style.width = '100%';

    renderEvalPicker();
    renderEvalResults();
    document.getElementById('resultsPanel').classList.remove('hidden');
    document.getElementById('statsPanel').classList.remove('hidden');

    btn.disabled = false;
    btn.innerText = '\u21bb Reset';
    btn.className = 'btn-run btn-reset';
    pipelineState = 'done';
}

// Deep links for presenting, e.g. index.html#tab-cdss&DEMO-04
function applyHash() {
    const [tab, patient] = location.hash.slice(1).split('&');
    if (patient && DEMO_PATIENTS.some(p => p.id === patient)) {
        document.getElementById('patientSelect').value = patient;
    }
    if (tab && document.getElementById(tab)?.classList.contains('tab-content')) switchTab(tab);
}

window.onload = function () {
    populatePatients();
    applyHash();
    loadPatientData();
    updateDecay();
    updateCost();
    renderEvalPicker();
    toggleEval('twcs');
    renderCohortTable();
};
