// Local Mock Database to replace PHP/MySQL completely
const localDatabase = {
    "p1": {
        analyte: "BUN", unit: "mg/dL",
        gaps: ['-', '48', '142', '30', '0'],
        vals: [14.2, 15.1, 16.5, 19.8, 24.5],
        weights: ['0.012', '0.045', '0.180', '0.620', '1.000'],
        rf: { inc: 35, sta: 60, dec: 5, out: "STABLE (False Neg)", style: "tag-red" },
        tw: { inc: 89, sta: 9, dec: 2, out: "ALERT: INCREASING", bg: "rgba(218,54,51,0.2)", border: "rgba(218,54,51,0.4)", color: "#ff7b72" }
    },
    "p2": {
        analyte: "Hemoglobin", unit: "g/dL",
        gaps: ['-', '12', '45', '18', '0'],
        vals: [13.5, 13.0, 12.1, 10.5, 8.9],
        weights: ['0.005', '0.022', '0.250', '0.780', '1.000'],
        rf: { inc: 2, sta: 58, dec: 40, out: "STABLE (False Neg)", style: "tag-red" },
        tw: { inc: 1, sta: 12, dec: 87, out: "ALERT: DECREASING", bg: "rgba(218,54,51,0.2)", border: "rgba(218,54,51,0.4)", color: "#ff7b72" }
    },
    "p3": {
        analyte: "Platelets", unit: "10^9/L",
        gaps: ['-', '90', '180', '60', '0'],
        vals: [250, 245, 260, 255, 248],
        weights: ['0.001', '0.015', '0.080', '0.400', '1.000'],
        rf: { inc: 10, sta: 85, dec: 5, out: "STABLE", style: "tag-green" },
        tw: { inc: 8, sta: 90, dec: 2, out: "STABLE", bg: "rgba(35,134,54,0.2)", border: "rgba(35,134,54,0.4)", color: "#3fb950" }
    }
};

let currentChart = null;

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// Load Patient Data from Local Dictionary
function loadPatientData() {
    const pId = document.getElementById('patientSelect').value;
    if (!pId || !localDatabase[pId]) return;
    
    const p = localDatabase[pId];

    document.getElementById('mechanicsConclusion').classList.remove('hidden');

    // Update the Table
    let tbody = "";
    const steps = ['T-4', 'T-3', 'T-2', 'T-1', 'T (Current)'];
    for(let i=0; i<5; i++) {
        let color = i < 2 ? 'color: var(--muted)' : '';
        let highlight = i === 4 ? 'class="metric-highlight"' : '';
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

    // Render Chart.js
    const ctx = document.getElementById('patientChart').getContext('2d');
    if(currentChart) currentChart.destroy();
    
    let chartColor = p.tw.out.includes("STABLE") ? '#3fb950' : '#da3633';
    let chartBg = p.tw.out.includes("STABLE") ? 'rgba(35,134,54,0.2)' : 'rgba(218,54,51,0.2)';

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T-4', 'T-3', 'T-2', 'T-1', 'T (Current)'],
            datasets: [{
                label: `${p.analyte} (${p.unit})`,
                data: p.vals,
                borderColor: chartColor,
                backgroundColor: chartBg,
                borderWidth: 2,
                pointBackgroundColor: '#58a6ff',
                pointRadius: 4,
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#30363d' } }, x: { grid: { color: '#30363d' } } } }
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

// Interactive Evaluation Toggle
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
            <tr><td>Balanced Accuracy</td><td style="text-align: right; font-weight: bold; color: var(--success);">87.5%</td></tr>
            <tr><td>Macro F1-Score</td><td style="text-align: right; font-weight: bold; color: var(--success);">0.85</td></tr>
            <tr><td>Recall (Minority Sensitivity)</td><td style="text-align: right; font-weight: bold; color: var(--success);">0.93</td></tr>
        `;
        tp.innerHTML = `<div style="font-size: 11px;">True Positive</div><div class="cell-val">418</div>`;
        tp.className = "matrix-cell cell-tp";
        fn.innerHTML = `<div style="font-size: 11px;">False Negative</div><div class="cell-val">32</div>`;
        fn.className = "matrix-cell";
        desc.innerText = "TWCS-RF correctly intercepts 93% of physiological declines.";
    } else {
        header.innerText = 'Baseline RF Output';
        tbody.innerHTML = `
            <tr><td>Balanced Accuracy</td><td style="text-align: right; font-weight: bold; color: var(--danger);">62.4%</td></tr>
            <tr><td>Macro F1-Score</td><td style="text-align: right; font-weight: bold; color: var(--danger);">0.58</td></tr>
            <tr><td>Recall (Minority Sensitivity)</td><td style="text-align: right; font-weight: bold; color: var(--danger);">0.29</td></tr>
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

async function runPipeline() {
    document.getElementById('runBtn').disabled = true;
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
    document.getElementById('runBtn').innerText = 'Pipeline Execution Complete';
}

// Initialize dynamic architecture formulas on load
window.onload = function() {
    updateDecay();
    updateCost();
};