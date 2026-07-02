// Local Mock Database — 5 patients with variable-length histories (Task 4)
const localDatabase = {
    "p1": {
        analyte: "BUN", unit: "mg/dL",
        gaps: ['-', '48', '142'],
        vals: [14.2, 16.5, 24.5],
        weights: ['0.012', '0.180', '1.000'],
        rf: { inc: 35, sta: 60, dec: 5, out: "STABLE (False Neg)", style: "tag-red" },
        tw: { inc: 89, sta: 9, dec: 2, out: "ALERT: INCREASING", bg: "rgba(218,54,51,0.2)", border: "rgba(218,54,51,0.4)", color: "#ff7b72" }
    },
    "p2": {
        analyte: "Hemoglobin", unit: "g/dL",
        gaps: ['-', '12', '45', '18'],
        vals: [13.5, 12.1, 10.5, 8.9],
        weights: ['0.005', '0.250', '0.780', '1.000'],
        rf: { inc: 2, sta: 58, dec: 40, out: "STABLE (False Neg)", style: "tag-red" },
        tw: { inc: 1, sta: 12, dec: 87, out: "ALERT: DECREASING", bg: "rgba(218,54,51,0.2)", border: "rgba(218,54,51,0.4)", color: "#ff7b72" }
    },
    "p3": {
        analyte: "Platelets", unit: "10^9/L",
        gaps: ['-', '90', '180'],
        vals: [250, 260, 248],
        weights: ['0.015', '0.080', '1.000'],
        rf: { inc: 10, sta: 85, dec: 5, out: "STABLE", style: "tag-green" },
        tw: { inc: 8, sta: 90, dec: 2, out: "STABLE", bg: "rgba(35,134,54,0.2)", border: "rgba(35,134,54,0.4)", color: "#3fb950" }
    },
    "p4": {
        analyte: "Fasting Blood Sugar", unit: "mg/dL",
        gaps: ['-', '30', '60', '90', '15'],
        vals: [95, 102, 110, 118, 135],
        weights: ['0.002', '0.040', '0.150', '0.450', '1.000'],
        rf: { inc: 30, sta: 55, dec: 15, out: "STABLE (False Neg)", style: "tag-red" },
        tw: { inc: 92, sta: 6, dec: 2, out: "ALERT: INCREASING", bg: "rgba(218,54,51,0.2)", border: "rgba(218,54,51,0.4)", color: "#ff7b72" }
    }
};

// Generate P5: 20-record White Blood Cell trajectory (Stable Volatility)
(function generateP5() {
    const n = 20;
    const vals = [];
    const gaps = ['-'];
    const rawWeights = [];

    // Generate 20 random WBC values between 6.0 and 9.5
    for (let i = 0; i < n; i++) {
        vals.push(parseFloat((6.0 + Math.random() * 3.5).toFixed(1)));
    }

    // Generate 19 random temporal gaps between 5 and 60 days
    for (let i = 1; i < n; i++) {
        gaps.push(String(Math.floor(5 + Math.random() * 56)));
    }

    // Generate 20 ascending decay weights ending in 1.000
    for (let i = 0; i < n; i++) {
        // Exponential curve from ~0.001 to 1.0
        const t = i / (n - 1);
        const w = Math.pow(t, 2.5) * 0.998 + 0.002;
        rawWeights.push(i === n - 1 ? '1.000' : w.toFixed(3));
    }

    localDatabase["p5"] = {
        analyte: "White Blood Cells", unit: "10^3/µL",
        gaps: gaps,
        vals: vals,
        weights: rawWeights,
        rf: { inc: 18, sta: 72, dec: 10, out: "STABLE", style: "tag-green" },
        tw: { inc: 15, sta: 78, dec: 7, out: "STABLE", bg: "rgba(35,134,54,0.2)", border: "rgba(35,134,54,0.4)", color: "#3fb950" }
    };
})();

let currentChart = null;
let pipelineState = 'idle'; // Task 2: Track pipeline state

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// Load Patient Data — Dynamic variable-length (Task 4)
function loadPatientData() {
    const pId = document.getElementById('patientSelect').value;
    if (!pId || !localDatabase[pId]) return;
    
    const p = localDatabase[pId];
    const len = p.vals.length;

    document.getElementById('mechanicsConclusion').classList.remove('hidden');

    // Build dynamic step labels: T-{n-1}, T-{n-2}, ... T-1, T (Current)
    const steps = [];
    for (let i = 0; i < len; i++) {
        if (i === len - 1) {
            steps.push('T (Current)');
        } else {
            steps.push('T-' + (len - 1 - i));
        }
    }

    // Update the Table dynamically based on array length
    let tbody = "";
    for (let i = 0; i < len; i++) {
        // Fade older records (first half)
        let color = i < Math.floor(len / 2) ? 'color: var(--muted)' : '';
        let highlight = i === len - 1 ? 'class="metric-highlight"' : '';
        let flag = i === 0 ? '-' : '<span class="tag tag-green">Pass</span>';
        tbody += `<tr><td style="${color}">${steps[i]}</td><td style="${color}">${p.gaps[i]}</td><td style="${color}">${p.vals[i]} ${p.unit}</td><td>${flag}</td><td ${highlight}>${p.weights[i]}</td></tr>`;
    }
    document.getElementById('mechanicsTable').innerHTML = tbody;

    // Update Progress Bars (Control RF)
    document.getElementById('rf-inc-txt').innerText = p.rf.inc + '%'; document.getElementById('rf-inc-bar').style.width = p.rf.inc + '%';
    document.getElementById('rf-sta-txt').innerText = p.rf.sta + '%'; document.getElementById('rf-sta-bar').style.width = p.rf.sta + '%';
    document.getElementById('rf-dec-txt').innerText = p.rf.dec + '%'; document.getElementById('rf-dec-bar').style.width = p.rf.dec + '%';
    document.getElementById('rf-output').innerText = p.rf.out; document.getElementById('rf-output').className = "tag " + p.rf.style;

    // Update Progress Bars (TWCS-RF)
    document.getElementById('tw-inc-txt').innerText = p.tw.inc + '%'; document.getElementById('tw-inc-bar').style.width = p.tw.inc + '%';
    document.getElementById('tw-sta-txt').innerText = p.tw.sta + '%'; document.getElementById('tw-sta-bar').style.width = p.tw.sta + '%';
    document.getElementById('tw-dec-txt').innerText = p.tw.dec + '%'; document.getElementById('tw-dec-bar').style.width = p.tw.dec + '%';
    
    const twOut = document.getElementById('tw-output');
    twOut.innerText = p.tw.out;
    twOut.style.background = p.tw.bg; twOut.style.border = "1px solid " + p.tw.border; twOut.style.color = p.tw.color;

    // Render Chart.js with dynamic X-axis labels
    const ctx = document.getElementById('patientChart').getContext('2d');
    if(currentChart) currentChart.destroy();
    
    let chartColor = p.tw.out.includes("STABLE") ? '#3fb950' : '#da3633';
    let chartBg = p.tw.out.includes("STABLE") ? 'rgba(35,134,54,0.2)' : 'rgba(218,54,51,0.2)';

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: steps,
            datasets: [{
                label: `${p.analyte} (${p.unit})`,
                data: p.vals,
                borderColor: chartColor,
                backgroundColor: chartBg,
                borderWidth: 2,
                pointBackgroundColor: '#58a6ff',
                pointRadius: len > 10 ? 3 : 4,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#30363d' } },
                x: {
                    grid: { color: '#30363d' },
                    ticks: { maxRotation: len > 10 ? 45 : 0, font: { size: len > 10 ? 10 : 12 } }
                }
            }
        }
    });
}

// Interactive Architecture Logic
function updateDecay() {
    let dt = document.getElementById('dt-slider').value;
    let alpha = document.getElementById('alpha-slider').value;
    let w = Math.exp(-alpha * dt);
    document.getElementById('dt-val').innerText = dt;
    document.getElementById('alpha-val').innerText = alpha;
    document.getElementById('decay-result').innerText = w.toFixed(4);
    document.getElementById('decay-bar').style.width = (w * 100) + '%';
}

function updateCost() {
    let n_minority = document.getElementById('minority-slider').value;
    let n_total = 21452; 
    let k = 3;
    let lambda = n_total / (k * n_minority);
    document.getElementById('min-val').innerText = n_minority;
    document.getElementById('cost-result').innerText = lambda.toFixed(2);
}

// Interactive Evaluation Toggle — Complete SOP metrics (Task 5)
function toggleEval(mode) {
    document.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + mode).classList.add('active');
    
    const tbody = document.getElementById('interactive-metrics');
    const tp = document.getElementById('mat-tp');
    const fn = document.getElementById('mat-fn');
    const desc = document.getElementById('mat-desc');
    const header = document.getElementById('tbl-header-mod');
    
    if(mode === 'twcs') {
        header.innerText = 'TWCS-RF Output';
        tbody.innerHTML = `
            <tr><td class="sop-label">1.1</td><td><span class="info-tooltip" data-tooltip="Overall proportion of correctly classified instances across all three directional trend classes.">Accuracy</span></td><td style="text-align: right; font-weight: bold; color: var(--success);">91.2%</td></tr>
            <tr><td class="sop-label">1.2</td><td><span class="info-tooltip" data-tooltip="The arithmetic mean of the per-class recall scores across all three directional categories, used to measure classification performance under severe class imbalance.">Balanced Accuracy</span></td><td style="text-align: right; font-weight: bold; color: var(--success);">87.5%</td></tr>
            <tr><td class="sop-label">1.3</td><td><span class="info-tooltip" data-tooltip="The unweighted arithmetic mean of the F1-scores calculated independently for each of the three directional trend classes. Heavily penalizes algorithms that default predictions to the majority class.">Macro F1-Score</span></td><td style="text-align: right; font-weight: bold; color: var(--success);">0.85</td></tr>
            <tr><td class="sop-label">1.4</td><td>Precision (Macro)</td><td style="text-align: right; font-weight: bold; color: var(--success);">0.82</td></tr>
            <tr><td class="sop-label">1.5</td><td>Recall (Minority Sensitivity)</td><td style="text-align: right; font-weight: bold; color: var(--success);">0.93</td></tr>
            <tr><td class="sop-label">2</td><td>Inference Latency</td><td style="text-align: right; font-weight: bold; color: var(--success);">0.42s</td></tr>
        `;
        tp.innerHTML = `<div style="font-size: 11px;">True Positive</div><div class="cell-val">418</div>`;
        tp.className = "matrix-cell cell-tp";
        fn.innerHTML = `<div style="font-size: 11px;">False Negative</div><div class="cell-val">32</div>`;
        fn.className = "matrix-cell";
        desc.innerText = "TWCS-RF correctly intercepts 93% of physiological declines.";
    } else {
        header.innerText = 'Baseline RF Output';
        tbody.innerHTML = `
            <tr><td class="sop-label">1.1</td><td>Accuracy</td><td style="text-align: right; font-weight: bold; color: var(--danger);">78.6%</td></tr>
            <tr><td class="sop-label">1.2</td><td>Balanced Accuracy</td><td style="text-align: right; font-weight: bold; color: var(--danger);">62.4%</td></tr>
            <tr><td class="sop-label">1.3</td><td>Macro F1-Score</td><td style="text-align: right; font-weight: bold; color: var(--danger);">0.58</td></tr>
            <tr><td class="sop-label">1.4</td><td>Precision (Macro)</td><td style="text-align: right; font-weight: bold; color: var(--danger);">0.55</td></tr>
            <tr><td class="sop-label">1.5</td><td>Recall (Minority Sensitivity)</td><td style="text-align: right; font-weight: bold; color: var(--danger);">0.29</td></tr>
            <tr><td class="sop-label">2</td><td>Inference Latency</td><td style="text-align: right; font-weight: bold; color: var(--warning);">0.38s</td></tr>
        `;
        tp.innerHTML = `<div style="font-size: 11px;">True Positive</div><div class="cell-val">130</div>`;
        tp.className = "matrix-cell";
        fn.innerHTML = `<div style="font-size: 11px;">False Negative</div><div class="cell-val">320</div>`;
        fn.className = "matrix-cell cell-fn";
        desc.innerText = "Baseline misses 320 critical cases due to majority-class bias.";
    }
}

// Pipeline Execution Logs
function logMsg(msg, type = '') {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML += `<div class="log-line ${type}">> ${msg}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Task 2: Pipeline with reset toggle
async function runPipeline() {
    const btn = document.getElementById('runBtn');

    // If pipeline already ran, reset everything
    if (pipelineState === 'done') {
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('terminal').innerHTML = '<div class="log-line">System initialized. Awaiting pipeline execution.</div>';
        document.getElementById('resultsPanel').classList.add('hidden');
        document.getElementById('statsPanel').classList.add('hidden');
        btn.innerText = 'Run Global Cohort Evaluation';
        btn.className = 'btn-run';
        btn.disabled = false;
        pipelineState = 'idle';
        return;
    }

    // Run the pipeline
    btn.disabled = true;
    btn.className = 'btn-run';
    document.getElementById('progressContainer').style.display = 'block';
    const progressBar = document.getElementById('progressBar');
    
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '';
    
    logMsg('Initializing TWCS-RF vs Baseline parallel execution...', 'log-warn');
    progressBar.style.width = '20%'; await sleep(800);
    
    logMsg('Extracting Analytical Cohort (N >= 20k) from 355,331 dataset...', '');
    progressBar.style.width = '40%'; await sleep(800);
    
    logMsg('Executing 70/30 Walk-Forward Split to prevent data leakage...', 'log-warn'); await sleep(600);
    
    logMsg('Injecting Exponential Decay (w) & Inverse-Frequency penalty matrices...', 'log-success');
    progressBar.style.width = '70%'; await sleep(700);
    
    logMsg('Calculating Imbalanced Metrics (Macro F1, Balanced Acc) on 30% Unseen Set...', '');
    progressBar.style.width = '90%'; await sleep(1000);
    
    logMsg('Running Wilcoxon Signed-Rank Test + Bonferroni Correction...', 'log-warn'); await sleep(1200);
    
    document.getElementById('resultsPanel').classList.remove('hidden');
    document.getElementById('statsPanel').classList.remove('hidden');
    logMsg('Global Evaluation statistically validated. Execution complete.', 'log-success');
    
    progressBar.style.width = '100%';

    // Task 2: Switch to reset state
    btn.disabled = false;
    btn.innerText = '↻ Reset Pipeline';
    btn.className = 'btn-run btn-reset';
    pipelineState = 'done';
}

// Initialize dynamic architecture formulas on load
window.onload = function() {
    updateDecay();
    updateCost();
};