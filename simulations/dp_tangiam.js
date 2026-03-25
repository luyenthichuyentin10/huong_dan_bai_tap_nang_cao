{
// =============================================
// MÔ PHỎNG BÀI DÃY CON TĂNG GIẢM (dp_tangiam.js)
// =============================================

let tgArr = [];
let tgN = 0;
let tgCurrentStep = -1;
let tgIsSimulating = false;
let tgAlgorithm = 'N2'; // 'N2' hoặc 'NLOGN'

// DP arrays
let tgLIS = [];
let tgLDS = [];
let tgPrevLIS = []; // Truy vết LIS
let tgNextLDS = []; // Truy vết LDS

// Cho thuật toán NlogN
let tgTails = [];

// Kết quả
let tgBestLen = 0;
let tgPeakIdx = -1;
let tgResultSeq = [];

// Chia bước: phase 1 = tính LIS, phase 2 = tính LDS, phase 3 = tìm đỉnh
let tgPhase = 0;
let tgPhaseStep = 0;

// Tổng số bước cho mỗi phase
let tgTotalSteps = 0;

function initDp_tangiamSimulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Dãy con Tăng Giảm</div>
            
            <!-- PHẦN 1: Nhập liệu & Cấu hình -->
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <label><b>Dãy A:</b></label>
                    <input type="text" id="tg-input-arr" placeholder="1 3 5 4 2" 
                        style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; min-width: 250px;">
                    <button onclick="tgUpdateData()" class="toggle-btn" style="background:#0284c7; color:white;">💾 Cập nhật</button>
                    <button onclick="tgRandomData()" class="toggle-btn" style="background:#f59e0b; color:white;">🎲 Ngẫu nhiên</button>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label><b>Thuật toán:</b></label>
                    <select id="tg-algo-select" onchange="tgReset()" style="padding: 8px; border-radius: 4px; font-size: 0.95rem;">
                        <option value="N2">📊 DP cơ bản O(n²)</option>
                        <option value="NLOGN">⚡ DP tối ưu O(n log n)</option>
                    </select>
                </div>
            </div>

            <!-- PHẦN 2: Hiển thị mảng -->
            <div style="margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 8px;">📋 Dãy ban đầu:</div>
                <div id="tg-array-display" style="display: flex; flex-wrap: wrap; gap: 6px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 60px; overflow-x: auto;"></div>
            </div>

            <!-- PHẦN 3: Bảng LIS & LDS -->
            <div id="tg-dp-table-area" style="margin-bottom: 15px; overflow-x: auto;"></div>

            <!-- PHẦN 3b: Mảng tails (cho NlogN) -->
            <div id="tg-tails-area" style="margin-bottom: 15px;"></div>

            <!-- PHẦN 4: Biểu đồ hình núi -->
            <div id="tg-mountain-area" style="margin-bottom: 15px;"></div>

            <!-- PHẦN 5: Kết quả -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #29c702;">
                <div><b>Phase hiện tại:</b> <span id="tg-stat-phase" style="color:#0284c7; font-weight:bold;">—</span></div>
                <div><b>Độ dài max:</b> <span id="tg-stat-best" style="color:#dc2626; font-weight:bold;">—</span></div>
                <div><b>Đỉnh tại:</b> <span id="tg-stat-peak" style="font-weight:bold;">—</span></div>
            </div>

            <!-- PHẦN 6: Điều khiển & Log -->
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="tgStartAuto()" id="tg-btn-play" class="toggle-btn" style="justify-content: center;">▶ Chạy tự động</button>
                    <button onclick="tgNextStep()" class="toggle-btn" style="background:#29c702; color:white; justify-content: center;">⏭ Từng bước</button>
                    <button onclick="tgReset()" class="toggle-btn" style="background:#64748b; color:white; justify-content: center;">🔄 Reset</button>
                </div>
                <div id="tg-log-container" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 0.85rem; height: 200px; overflow-y: auto; border-left: 4px solid #f59e0b;">
                    <div id="tg-log-content"></div>
                </div>
            </div>
        </div>
    `;

    tgRandomData();
}

// =============================================
// NHẬP LIỆU
// =============================================
function tgUpdateData() {
    const val = document.getElementById('tg-input-arr').value;
    tgArr = val.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 20);
    tgN = tgArr.length;
    tgReset();
}

function tgRandomData() {
    tgN = 8 + Math.floor(Math.random() * 5); // 8-12 phần tử
    tgArr = [];
    // Tạo dãy có tính bitonic
    let peak = 2 + Math.floor(Math.random() * (tgN - 3));
    for (let i = 0; i < tgN; i++) {
        if (i <= peak) {
            tgArr.push(Math.floor(Math.random() * 5) + (i * 2) + 1);
        } else {
            tgArr.push(Math.floor(Math.random() * 5) + ((tgN - i) * 2));
        }
    }
    // Thêm chút noise
    for (let i = 0; i < 2; i++) {
        let idx = Math.floor(Math.random() * tgN);
        tgArr[idx] = Math.floor(Math.random() * 15) + 1;
    }
    document.getElementById('tg-input-arr').value = tgArr.join(' ');
    tgReset();
}

// =============================================
// RESET
// =============================================
function tgReset() {
    tgIsSimulating = false;
    tgCurrentStep = -1;
    tgPhase = 0;
    tgPhaseStep = 0;
    tgAlgorithm = document.getElementById('tg-algo-select').value;
    tgN = tgArr.length;

    tgLIS = new Array(tgN).fill(0);
    tgLDS = new Array(tgN).fill(0);
    tgPrevLIS = new Array(tgN).fill(-1);
    tgNextLDS = new Array(tgN).fill(-1);
    tgTails = [];
    tgBestLen = 0;
    tgPeakIdx = -1;
    tgResultSeq = [];

    document.getElementById('tg-stat-phase').innerText = '—';
    document.getElementById('tg-stat-best').innerText = '—';
    document.getElementById('tg-stat-peak').innerText = '—';
    document.getElementById('tg-btn-play').innerText = '▶ Chạy tự động';

    tgRenderArray(-1, -1, []);
    tgRenderDPTable();
    tgRenderTails();
    tgRenderMountain();
    tgClearLog();

    tgAddLog(`<span style="color:#6a9955;">// Thuật toán: ${tgAlgorithm === 'N2' ? 'DP O(n²)' : 'DP O(n log n)'}</span>`);
    tgAddLog(`<span style="color:#6a9955;">// Dãy: [${tgArr.join(', ')}] (n = ${tgN})</span>`);
}

// =============================================
// RENDER MẢNG
// =============================================
function tgRenderArray(currentI, scanJ, resultIndices) {
    const container = document.getElementById('tg-array-display');
    if (!container) return;
    container.innerHTML = '';

    tgArr.forEach((val, i) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 4px;";

        const idxBox = document.createElement('div');
        idxBox.innerText = i + 1;
        idxBox.style.cssText = `font-size: 12px; font-weight: 900; color: ${i === currentI ? '#f59e0b' : (i === scanJ ? '#38bdf8' : '#94a3b8')};`;

        const valBox = document.createElement('div');
        valBox.innerText = val;

        let bg = 'white';
        let border = '#cbd5e1';
        if (resultIndices.includes(i)) { bg = '#bbf7d0'; border = '#16a34a'; }
        if (i === currentI) { bg = '#fef08a'; border = '#f59e0b'; }
        if (i === scanJ) { bg = '#bfdbfe'; border = '#3b82f6'; }

        valBox.style.cssText = `
            min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
            background: ${bg}; border: 2px solid ${border}; border-radius: 6px;
            font-weight: bold; font-size: 14px; transition: all 0.2s; padding: 0 4px;
        `;
        if (i === currentI) valBox.style.transform = "scale(1.15)";

        wrapper.append(idxBox, valBox);
        container.appendChild(wrapper);
    });
}

// =============================================
// RENDER BẢNG DP
// =============================================
function tgRenderDPTable() {
    const area = document.getElementById('tg-dp-table-area');
    if (!area) return;

    let html = '<div style="font-weight: bold; margin-bottom: 8px;">📊 Bảng LIS & LDS:</div>';
    html += '<table class="garden-table" style="font-size: 0.8rem; width: 100%;">';

    // Header: chỉ mục
    html += '<tr class="idx-row"><td style="min-width:65px;"><b>i</b></td>';
    for (let i = 0; i < tgN; i++) {
        html += `<td style="min-width:45px;">${i + 1}</td>`;
    }
    html += '</tr>';

    // Giá trị
    html += '<tr><td><b>a[i]</b></td>';
    for (let i = 0; i < tgN; i++) {
        let bg = '';
        if (i === tgPeakIdx) bg = 'background:#fef08a;';
        html += `<td style="${bg}">${tgArr[i]}</td>`;
    }
    html += '</tr>';

    // LIS
    html += '<tr><td><b style="color:#16a34a;">LIS[i]</b></td>';
    for (let i = 0; i < tgN; i++) {
        const val = tgLIS[i] > 0 ? tgLIS[i] : '—';
        let bg = '';
        if (i === tgPeakIdx && tgLIS[i] > 0) bg = 'background:#bbf7d0;';
        html += `<td style="${bg}">${val}</td>`;
    }
    html += '</tr>';

    // LDS
    html += '<tr><td><b style="color:#dc2626;">LDS[i]</b></td>';
    for (let i = 0; i < tgN; i++) {
        const val = tgLDS[i] > 0 ? tgLDS[i] : '—';
        let bg = '';
        if (i === tgPeakIdx && tgLDS[i] > 0) bg = 'background:#fecaca;';
        html += `<td style="${bg}">${val}</td>`;
    }
    html += '</tr>';

    // Tổng (2*min - 1)
    html += '<tr><td><b style="color:#7c3aed;">2×min-1</b></td>';
    for (let i = 0; i < tgN; i++) {
        let total = '—';
        if (tgLIS[i] > 0 && tgLDS[i] > 0 && tgLIS[i] >= 2 && tgLDS[i] >= 2) {
            const k1 = Math.min(tgLIS[i], tgLDS[i]);
            total = 2 * k1 - 1;
        } else if (tgLIS[i] > 0 && tgLDS[i] > 0) {
            total = '<small style="color:#94a3b8;">—</small>';
        }
        let bg = '';
        if (i === tgPeakIdx) bg = 'background:#fef08a; font-weight:bold;';
        html += `<td style="${bg}">${total}</td>`;
    }
    html += '</tr>';

    html += '</table>';
    area.innerHTML = html;
}

// =============================================
// RENDER TAILS (cho NlogN)
// =============================================
function tgRenderTails() {
    const area = document.getElementById('tg-tails-area');
    if (!area) return;

    if (tgAlgorithm !== 'NLOGN' || tgTails.length === 0) {
        area.innerHTML = '';
        return;
    }

    let html = '<div style="font-weight: bold; margin-bottom: 8px;">🔢 Mảng tails[] (Patience Sorting):</div>';
    html += '<div style="display: flex; gap: 8px; background: #f0f9ff; padding: 12px; border-radius: 8px; border: 1px solid #0284c7; flex-wrap: wrap;">';

    tgTails.forEach((val, i) => {
        html += `<div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="font-size: 11px; color: #64748b; font-weight: bold;">len=${i + 1}</div>
            <div style="min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
                background: #dbeafe; border: 2px solid #3b82f6; border-radius: 6px; font-weight: bold;">${val}</div>
        </div>`;
    });

    html += '</div>';
    area.innerHTML = html;
}

// =============================================
// RENDER BIỂU ĐỒ NÚI (kết quả)
// =============================================
function tgRenderMountain() {
    const area = document.getElementById('tg-mountain-area');
    if (!area) return;

    if (tgResultSeq.length === 0) {
        area.innerHTML = '';
        return;
    }

    const maxVal = Math.max(...tgResultSeq);
    const chartH = 120;

    let html = '<div style="font-weight: bold; margin-bottom: 8px;">🏔️ Dãy con tăng giảm tìm được:</div>';
    html += '<div style="display: flex; align-items: flex-end; gap: 4px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; min-height: ' + (chartH + 40) + 'px;">';

    const peakPos = Math.floor(tgResultSeq.length / 2);

    tgResultSeq.forEach((val, i) => {
        const h = Math.max(20, (val / maxVal) * chartH);
        let bgColor = i < peakPos ? '#86efac' : (i === peakPos ? '#fde68a' : '#fca5a5');
        let borderColor = i < peakPos ? '#16a34a' : (i === peakPos ? '#f59e0b' : '#dc2626');

        html += `<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
            <div style="font-size: 12px; font-weight: bold;">${val}</div>
            <div style="width: 35px; height: ${h}px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 4px 4px 0 0; transition: all 0.3s;"></div>
            ${i === peakPos ? '<div style="font-size:10px; color:#f59e0b;">⬆ ĐỈNH</div>' : ''}
        </div>`;
    });

    html += '</div>';
    area.innerHTML = html;
}

// =============================================
// LOG
// =============================================
function tgAddLog(msg) {
    const logArea = document.getElementById('tg-log-content');
    if (!logArea) return;
    logArea.innerHTML += `<div><span style="color: #38bdf8;">></span> ${msg}</div>`;
    document.getElementById('tg-log-container').scrollTop = 999999;
}

function tgClearLog() {
    const logArea = document.getElementById('tg-log-content');
    if (logArea) logArea.innerHTML = '';
}

// =============================================
// BINARY SEARCH (lower_bound)
// =============================================
function tgLowerBound(arr, target) {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
        let mid = (lo + hi) >> 1;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// =============================================
// NEXT STEP: O(n²)
// =============================================
function tgNextStepN2() {
    // Phase 0: bắt đầu LIS
    // Phase 1: đang tính LIS, tgPhaseStep = chỉ mục i (0-based)
    // Phase 2: đang tính LDS, tgPhaseStep = chỉ mục i (0-based, duyệt ngược)
    // Phase 3: tìm đỉnh
    // Phase 4: done

    if (tgPhase >= 4) return false;

    if (tgPhase === 0) {
        tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 1: Tính LIS (trái → phải) ═══</b></span>`);
        document.getElementById('tg-stat-phase').innerText = 'Tính LIS →';
        tgPhase = 1;
        tgPhaseStep = 0;
        return true;
    }

    if (tgPhase === 1) {
        const i = tgPhaseStep;
        if (i >= tgN) {
            // Chuyển sang LDS
            tgPhase = 2;
            tgPhaseStep = tgN - 1;
            tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 2: Tính LDS (phải → trái) ═══</b></span>`);
            document.getElementById('tg-stat-phase').innerText = 'Tính LDS ←';
            return true;
        }

        // Tính LIS[i]
        tgLIS[i] = 1;
        tgPrevLIS[i] = -1;
        let bestJ = -1;

        let logParts = [];
        for (let j = 0; j < i; j++) {
            if (tgArr[j] < tgArr[i] && tgLIS[j] + 1 > tgLIS[i]) {
                tgLIS[i] = tgLIS[j] + 1;
                tgPrevLIS[i] = j;
                bestJ = j;
            }
        }

        if (bestJ >= 0) {
            tgAddLog(`LIS[${i+1}]: a[${i+1}]=${tgArr[i]}, tốt nhất từ j=${bestJ+1} (a[${bestJ+1}]=${tgArr[bestJ]}), LIS = <b style="color:#16a34a;">${tgLIS[i]}</b>`);
        } else {
            tgAddLog(`LIS[${i+1}]: a[${i+1}]=${tgArr[i]}, không có j thỏa → LIS = <b>1</b>`);
        }

        tgRenderArray(i, bestJ, []);
        tgRenderDPTable();
        tgPhaseStep++;
        return true;
    }

    if (tgPhase === 2) {
        const i = tgPhaseStep;
        if (i < 0) {
            // Chuyển sang tìm đỉnh
            tgPhase = 3;
            tgPhaseStep = 0;
            tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 3: Tìm đỉnh tối ưu ═══</b></span>`);
            document.getElementById('tg-stat-phase').innerText = 'Tìm đỉnh';
            return true;
        }

        // Tính LDS[i]
        tgLDS[i] = 1;
        tgNextLDS[i] = -1;
        let bestJ = -1;

        for (let j = i + 1; j < tgN; j++) {
            if (tgArr[j] < tgArr[i] && tgLDS[j] + 1 > tgLDS[i]) {
                tgLDS[i] = tgLDS[j] + 1;
                tgNextLDS[i] = j;
                bestJ = j;
            }
        }

        if (bestJ >= 0) {
            tgAddLog(`LDS[${i+1}]: a[${i+1}]=${tgArr[i]}, tốt nhất đến j=${bestJ+1} (a[${bestJ+1}]=${tgArr[bestJ]}), LDS = <b style="color:#dc2626;">${tgLDS[i]}</b>`);
        } else {
            tgAddLog(`LDS[${i+1}]: a[${i+1}]=${tgArr[i]}, không có j thỏa → LDS = <b>1</b>`);
        }

        tgRenderArray(i, bestJ, []);
        tgRenderDPTable();
        tgPhaseStep--;
        return true;
    }

    if (tgPhase === 3) {
        // Tìm đỉnh: len = 2 * min(LIS[i], LDS[i]) - 1
        tgBestLen = 0;
        tgPeakIdx = -1;

        for (let i = 0; i < tgN; i++) {
            if (tgLIS[i] >= 2 && tgLDS[i] >= 2) {
                let k1 = Math.min(tgLIS[i], tgLDS[i]);
                let len = 2 * k1 - 1;
                if (len > tgBestLen) {
                    tgBestLen = len;
                    tgPeakIdx = i;
                }
            }
        }

        if (tgPeakIdx >= 0) {
            const k1 = Math.min(tgLIS[tgPeakIdx], tgLDS[tgPeakIdx]);
            tgAddLog(`Đỉnh tối ưu: vị trí <b>${tgPeakIdx + 1}</b> (a = ${tgArr[tgPeakIdx]})`);
            tgAddLog(`  LIS[${tgPeakIdx+1}] = ${tgLIS[tgPeakIdx]}, LDS[${tgPeakIdx+1}] = ${tgLDS[tgPeakIdx]}, min = ${k1}`);
            tgAddLog(`  Độ dài = 2 × ${k1} - 1 = <b style="color:#dc2626;">${tgBestLen}</b> (lẻ ✓)`);

            // Truy vết
            tgTraceResult();

            document.getElementById('tg-stat-best').innerText = tgBestLen;
            document.getElementById('tg-stat-peak').innerText = `i=${tgPeakIdx + 1} (a=${tgArr[tgPeakIdx]})`;
        } else {
            tgAddLog(`<span style="color:#dc2626;">Không tìm được dãy con tăng giảm → "No"</span>`);
            document.getElementById('tg-stat-best').innerText = 'No';
        }

        tgRenderDPTable();
        tgRenderMountain();

        let resultIndices = [];
        tgRenderArray(-1, -1, resultIndices);

        tgPhase = 4;
        return false;
    }

    return false;
}

// =============================================
// NEXT STEP: O(n log n)
// =============================================
function tgNextStepNlogN() {
    // Phase 0 → 1: LIS
    // Phase 1: tính LIS[i] bằng binary search
    // Phase 2: tính LDS[i] bằng binary search (ngược)
    // Phase 3: tìm đỉnh

    if (tgPhase >= 4) return false;

    if (tgPhase === 0) {
        tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 1: Tính LIS bằng Binary Search ═══</b></span>`);
        document.getElementById('tg-stat-phase').innerText = 'LIS (BinSearch) →';
        tgPhase = 1;
        tgPhaseStep = 0;
        tgTails = [];
        return true;
    }

    if (tgPhase === 1) {
        const i = tgPhaseStep;
        if (i >= tgN) {
            tgPhase = 2;
            tgPhaseStep = tgN - 1;
            tgTails = [];
            tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 2: Tính LDS bằng Binary Search ═══</b></span>`);
            document.getElementById('tg-stat-phase').innerText = 'LDS (BinSearch) ←';
            return true;
        }

        const val = tgArr[i];
        const pos = tgLowerBound(tgTails, val);
        const oldTails = '[' + tgTails.join(', ') + ']';

        if (pos === tgTails.length) {
            tgTails.push(val);
            tgAddLog(`LIS[${i+1}]: a=${val}, tails=${oldTails} → append → <b>LIS=${pos+1}</b>`);
        } else {
            const replaced = tgTails[pos];
            tgTails[pos] = val;
            tgAddLog(`LIS[${i+1}]: a=${val}, tails=${oldTails} → thay tails[${pos}]=${replaced}→${val} → <b>LIS=${pos+1}</b>`);
        }

        tgLIS[i] = pos + 1;
        tgRenderArray(i, -1, []);
        tgRenderDPTable();
        tgRenderTails();
        tgPhaseStep++;
        return true;
    }

    if (tgPhase === 2) {
        const i = tgPhaseStep;
        if (i < 0) {
            tgPhase = 3;
            tgPhaseStep = 0;
            tgTails = [];
            tgRenderTails();
            tgAddLog(`<span style="color:#f59e0b;"><b>═══ PHASE 3: Tìm đỉnh tối ưu ═══</b></span>`);
            document.getElementById('tg-stat-phase').innerText = 'Tìm đỉnh';
            return true;
        }

        const val = tgArr[i];
        const pos = tgLowerBound(tgTails, val);
        const oldTails = '[' + tgTails.join(', ') + ']';

        if (pos === tgTails.length) {
            tgTails.push(val);
            tgAddLog(`LDS[${i+1}]: a=${val}, tails=${oldTails} → append → <b>LDS=${pos+1}</b>`);
        } else {
            const replaced = tgTails[pos];
            tgTails[pos] = val;
            tgAddLog(`LDS[${i+1}]: a=${val}, tails=${oldTails} → thay tails[${pos}]=${replaced}→${val} → <b>LDS=${pos+1}</b>`);
        }

        tgLDS[i] = pos + 1;
        tgRenderArray(i, -1, []);
        tgRenderDPTable();
        tgRenderTails();
        tgPhaseStep--;
        return true;
    }

    if (tgPhase === 3) {
        // Tìm đỉnh: len = 2 * min(LIS[i], LDS[i]) - 1
        tgBestLen = 0;
        tgPeakIdx = -1;

        for (let i = 0; i < tgN; i++) {
            if (tgLIS[i] >= 2 && tgLDS[i] >= 2) {
                let k1 = Math.min(tgLIS[i], tgLDS[i]);
                let len = 2 * k1 - 1;
                if (len > tgBestLen) {
                    tgBestLen = len;
                    tgPeakIdx = i;
                }
            }
        }

        if (tgPeakIdx >= 0) {
            const k1 = Math.min(tgLIS[tgPeakIdx], tgLDS[tgPeakIdx]);
            tgAddLog(`Đỉnh tối ưu: vị trí <b>${tgPeakIdx + 1}</b> (a = ${tgArr[tgPeakIdx]})`);
            tgAddLog(`  LIS=${tgLIS[tgPeakIdx]}, LDS=${tgLDS[tgPeakIdx]}, min=${k1}`);
            tgAddLog(`  Độ dài = 2 × ${k1} - 1 = <b style="color:#dc2626;">${tgBestLen}</b>`);
            tgTraceResult();
            document.getElementById('tg-stat-best').innerText = tgBestLen;
            document.getElementById('tg-stat-peak').innerText = `i=${tgPeakIdx + 1} (a=${tgArr[tgPeakIdx]})`;
        } else {
            tgAddLog(`<span style="color:#dc2626;">Không tìm được → "No"</span>`);
            document.getElementById('tg-stat-best').innerText = 'No';
        }

        tgRenderDPTable();
        tgRenderMountain();
        tgRenderArray(-1, -1, []);
        tgPhase = 4;
        return false;
    }

    return false;
}

// =============================================
// TRUY VẾT
// =============================================
function tgTraceResult() {
    if (tgPeakIdx < 0) return;

    // Phần tăng = phần giảm = k+1 = min(LIS, LDS)
    let k1 = Math.min(tgLIS[tgPeakIdx], tgLDS[tgPeakIdx]);

    // Truy vết phần tăng: cần k1 phần tử kết thúc tại đỉnh
    let incPart = [tgArr[tgPeakIdx]];
    let lastVal = tgArr[tgPeakIdx];
    let need = k1 - 1;
    for (let j = tgPeakIdx - 1; j >= 0 && need > 0; j--) {
        if (tgArr[j] < lastVal && tgLIS[j] >= need) {
            incPart.unshift(tgArr[j]);
            lastVal = tgArr[j];
            need--;
        }
    }

    // Truy vết phần giảm: cần k1-1 phần tử sau đỉnh
    let decPart = [];
    lastVal = tgArr[tgPeakIdx];
    need = k1 - 1;
    for (let j = tgPeakIdx + 1; j < tgN && need > 0; j++) {
        if (tgArr[j] < lastVal && tgLDS[j] >= need) {
            decPart.push(tgArr[j]);
            lastVal = tgArr[j];
            need--;
        }
    }

    tgResultSeq = incPart.concat(decPart);

    tgAddLog(`<span style="color:#29c702;"><b>Dãy kết quả (len=${tgResultSeq.length}):</b> [${tgResultSeq.join(', ')}]</span>`);
    tgAddLog(`  Phần tăng (${incPart.length}): [${incPart.join(', ')}]`);
    tgAddLog(`  Phần giảm (${decPart.length}): [${decPart.join(', ')}]`);
}

// =============================================
// ĐIỀU KHIỂN CHUNG
// =============================================
function tgNextStep() {
    if (tgAlgorithm === 'N2') {
        return tgNextStepN2();
    } else {
        return tgNextStepNlogN();
    }
}

async function tgStartAuto() {
    if (tgIsSimulating) { tgIsSimulating = false; return; }
    tgIsSimulating = true;
    document.getElementById('tg-btn-play').innerText = '⏸ Tạm dừng';

    const delay = tgAlgorithm === 'N2' ? 500 : 600;
    while (tgIsSimulating && tgNextStep()) {
        await new Promise(r => setTimeout(r, delay));
    }
    tgIsSimulating = false;
    document.getElementById('tg-btn-play').innerText = '▶ Chạy tự động';
}

}
