{
// =============================================
// MÔ PHỎNG BÀI CHUỖI ĐỐI XỨNG - SUBSTRING (dp_spali.js)
// =============================================

let psStr = '';
let psN = 0;
let psCurrentStep = -1;
let psIsSimulating = false;
let psAlgorithm = 'EXPAND'; // 'EXPAND' hoặc 'MANACHER'

// Expand from center
let psBestStart = 0;
let psBestLen = 1;

// Manacher
let psT = '';         // Chuỗi đã chèn #
let psP = [];         // Bán kính palindrome
let psC = 0, psR = 0; // Center, Right boundary

// Bước
let psPhase = 0;
let psPhaseStep = 0;
let psStepList = [];

function initDp_SpaliSimulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Palindromic Substring</div>
            
            <!-- Nhập liệu -->
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <label><b>Chuỗi s:</b></label>
                    <input type="text" id="ps-input-str" placeholder="babad" value="babad"
                        style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; min-width: 200px; font-family: Consolas, monospace; font-size: 1rem;">
                    <button onclick="psUpdateData()" class="toggle-btn" style="background:#0284c7; color:white;">💾 Cập nhật</button>
                    <button onclick="psRandomData()" class="toggle-btn" style="background:#f59e0b; color:white;">🎲 Ngẫu nhiên</button>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label><b>Thuật toán:</b></label>
                    <select id="ps-algo-select" onchange="psReset()" style="padding: 8px; border-radius: 4px; font-size: 0.95rem;">
                        <option value="EXPAND">🔄 Mở rộng từ tâm O(n²)</option>
                        <option value="MANACHER">⚡ Manacher O(n)</option>
                    </select>
                </div>
            </div>

            <!-- Hiển thị chuỗi gốc -->
            <div style="margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 8px;">📋 Chuỗi ban đầu:</div>
                <div id="ps-string-display" style="display: flex; gap: 3px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; flex-wrap: wrap; min-height: 50px;"></div>
            </div>

            <!-- Chuỗi Manacher (t) -->
            <div id="ps-manacher-area" style="margin-bottom: 15px; display: none;">
                <div style="font-weight: bold; margin-bottom: 8px;">🔢 Chuỗi chèn # (Manacher):</div>
                <div id="ps-t-display" style="display: flex; gap: 2px; background: #f0f9ff; padding: 10px; border-radius: 8px; border: 1px solid #0284c7; flex-wrap: wrap; min-height: 50px; font-size: 0.85rem;"></div>
                <div id="ps-p-display" style="display: flex; gap: 2px; padding: 5px 10px; flex-wrap: wrap; font-size: 0.8rem; color: #64748b; margin-top: 4px;"></div>
            </div>

            <!-- Palindrome hiện tại -->
            <div id="ps-current-palin" style="margin-bottom: 15px; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #29c702; text-align: center; font-size: 1.2rem; font-family: Consolas, monospace; display: none;"></div>

            <!-- Thống kê -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b;">
                <div><b>Palindrome tốt nhất:</b> <span id="ps-stat-best" style="color:#dc2626; font-weight:bold; font-family: Consolas, monospace;">—</span></div>
                <div><b>Độ dài:</b> <span id="ps-stat-len" style="color:#0284c7; font-weight:bold;">—</span></div>
                <div><b>Bước:</b> <span id="ps-stat-step" style="font-weight:bold;">—</span></div>
            </div>

            <!-- Điều khiển & Log -->
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="psStartAuto()" id="ps-btn-play" class="toggle-btn" style="justify-content: center;">▶ Chạy tự động</button>
                    <button onclick="psNextStep()" class="toggle-btn" style="background:#29c702; color:white; justify-content: center;">⏭ Từng bước</button>
                    <button onclick="psReset()" class="toggle-btn" style="background:#64748b; color:white; justify-content: center;">🔄 Reset</button>
                </div>
                <div id="ps-log-container" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 0.85rem; height: 200px; overflow-y: auto; border-left: 4px solid #f59e0b;">
                    <div id="ps-log-content"></div>
                </div>
            </div>
        </div>
    `;

    psUpdateData();
}

// =============================================
// NHẬP LIỆU
// =============================================
function psUpdateData() {
    psStr = document.getElementById('ps-input-str').value.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
    if (psStr.length === 0) psStr = 'a';
    document.getElementById('ps-input-str').value = psStr;
    psN = psStr.length;
    psReset();
}

function psRandomData() {
    const samples = ['babad', 'cbbd', 'abba', 'racecar', 'banana', 'abacaba', 'abcba', 'lmevxveyzl', 'aabbcc', 'noon', 'forgeeksskeegfor', 'abcxyzcba'];
    psStr = samples[Math.floor(Math.random() * samples.length)];
    document.getElementById('ps-input-str').value = psStr;
    psN = psStr.length;
    psReset();
}

// =============================================
// RESET
// =============================================
function psReset() {
    psIsSimulating = false;
    psCurrentStep = -1;
    psPhase = 0;
    psPhaseStep = 0;
    psStepList = [];
    psAlgorithm = document.getElementById('ps-algo-select').value;
    psN = psStr.length;
    psBestStart = 0;
    psBestLen = 1;

    // Manacher init
    psT = '^#';
    for (let i = 0; i < psN; i++) psT += psStr[i] + '#';
    psT += '$';
    psP = new Array(psT.length).fill(0);
    psC = 0;
    psR = 0;

    // UI
    document.getElementById('ps-stat-best').innerText = psStr[0] || '—';
    document.getElementById('ps-stat-len').innerText = '1';
    document.getElementById('ps-stat-step').innerText = '—';
    document.getElementById('ps-btn-play').innerText = '▶ Chạy tự động';
    document.getElementById('ps-current-palin').style.display = 'none';

    const mArea = document.getElementById('ps-manacher-area');
    mArea.style.display = psAlgorithm === 'MANACHER' ? 'block' : 'none';

    psRenderString(-1, -1, -1, -1);
    if (psAlgorithm === 'MANACHER') psRenderManacher(-1);
    psClearLog();

    psAddLog(`<span style="color:#6a9955;">// Thuật toán: ${psAlgorithm === 'EXPAND' ? 'Mở rộng từ tâm O(n²)' : 'Manacher O(n)'}</span>`);
    psAddLog(`<span style="color:#6a9955;">// Chuỗi: "${psStr}" (n = ${psN})</span>`);
}

// =============================================
// RENDER CHUỖI GỐC
// =============================================
function psRenderString(hiCenter, hiLeft, hiRight, bestS, bestE) {
    const container = document.getElementById('ps-string-display');
    if (!container) return;
    container.innerHTML = '';

    for (let k = 0; k < psN; k++) {
        const box = document.createElement('div');
        let bg = 'white', border = '#cbd5e1';

        // Highlight palindrome tốt nhất
        if (k >= psBestStart && k < psBestStart + psBestLen) {
            bg = '#dcfce7'; border = '#16a34a';
        }
        // Highlight đang kiểm tra
        if (k >= hiLeft && k <= hiRight && hiLeft >= 0) {
            bg = '#fef08a'; border = '#f59e0b';
        }
        // Highlight tâm
        if (k === hiCenter) {
            bg = '#fecaca'; border = '#dc2626';
        }

        box.style.cssText = `
            min-width: 32px; height: 42px; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: ${bg}; border: 2px solid ${border}; border-radius: 6px;
            font-weight: bold; font-size: 15px; font-family: Consolas, monospace;
            transition: all 0.2s;
        `;
        box.innerHTML = `<span>${psStr[k]}</span><span style="font-size:9px; color:#94a3b8;">${k}</span>`;
        container.appendChild(box);
    }
}

// =============================================
// RENDER MANACHER
// =============================================
function psRenderManacher(hiIdx) {
    const tDisp = document.getElementById('ps-t-display');
    const pDisp = document.getElementById('ps-p-display');
    if (!tDisp || !pDisp) return;

    tDisp.innerHTML = '';
    pDisp.innerHTML = '';

    for (let k = 0; k < psT.length; k++) {
        const box = document.createElement('div');
        let bg = 'white', border = '#e2e8f0';

        if (k === hiIdx) { bg = '#fecaca'; border = '#dc2626'; }
        else if (k > 0 && k < psT.length - 1 && psP[k] > 0) {
            bg = '#dbeafe'; border = '#3b82f6';
        }

        // Highlight C và R
        if (k === psC && psC > 0) { border = '#7c3aed'; }

        box.style.cssText = `
            min-width: 22px; height: 28px; display: flex; align-items: center; justify-content: center;
            background: ${bg}; border: 1.5px solid ${border}; border-radius: 4px;
            font-size: 12px; font-family: Consolas, monospace; font-weight: ${psT[k] === '#' ? 'normal' : 'bold'};
            color: ${psT[k] === '#' ? '#94a3b8' : '#1e293b'};
        `;
        box.innerText = psT[k];
        tDisp.appendChild(box);

        // P values
        const pBox = document.createElement('div');
        pBox.style.cssText = 'min-width: 22px; text-align: center; font-size: 11px;';
        pBox.innerText = (k > 0 && k < psT.length - 1 && psP[k] > 0) ? psP[k] : '';
        pDisp.appendChild(pBox);
    }
}

// =============================================
// LOG
// =============================================
function psAddLog(msg) {
    const logArea = document.getElementById('ps-log-content');
    if (!logArea) return;
    logArea.innerHTML += `<div><span style="color: #38bdf8;">></span> ${msg}</div>`;
    document.getElementById('ps-log-container').scrollTop = 999999;
}

function psClearLog() {
    const logArea = document.getElementById('ps-log-content');
    if (logArea) logArea.innerHTML = '';
}

function psUpdateBest() {
    const bestStr = psStr.substring(psBestStart, psBestStart + psBestLen);
    document.getElementById('ps-stat-best').innerText = bestStr;
    document.getElementById('ps-stat-len').innerText = psBestLen;

    const palinDiv = document.getElementById('ps-current-palin');
    palinDiv.style.display = 'block';
    palinDiv.innerHTML = `🏆 Palindrome tốt nhất: <b style="color:#dc2626; font-size:1.3rem;">"${bestStr}"</b> (dài ${psBestLen})`;
}

// =============================================
// EXPAND FROM CENTER: TỪNG BƯỚC
// =============================================
function psNextStepExpand() {
    if (psPhase >= 2) return false;

    if (psPhase === 0) {
        // Tạo danh sách bước: mỗi bước là (center, type)
        psStepList = [];
        for (let c = 0; c < psN; c++) {
            psStepList.push({ center: c, type: 'odd' });
            if (c < psN - 1) psStepList.push({ center: c, type: 'even' });
        }
        psPhase = 1;
        psPhaseStep = 0;
        psAddLog(`<span style="color:#f59e0b;"><b>═══ Duyệt ${psStepList.length} tâm (${psN} lẻ + ${psN-1} chẵn) ═══</b></span>`);
        return true;
    }

    if (psPhase === 1) {
        if (psPhaseStep >= psStepList.length) {
            const bestStr = psStr.substring(psBestStart, psBestStart + psBestLen);
            psAddLog(`<span style="color:#f59e0b;"><b>═══ KẾT QUẢ: "${bestStr}" (dài ${psBestLen}) ═══</b></span>`);
            psPhase = 2;
            psRenderString(-1, -1, -1);
            return false;
        }

        const { center, type } = psStepList[psPhaseStep];
        let left, right;

        if (type === 'odd') {
            left = center; right = center;
        } else {
            left = center; right = center + 1;
        }

        // Mở rộng
        while (left >= 0 && right < psN && psStr[left] === psStr[right]) {
            left--; right++;
        }
        // Palindrome: s[left+1 .. right-1]
        const pLen = right - left - 1;
        const pStart = left + 1;

        const typeLabel = type === 'odd' ? 'Lẻ' : 'Chẵn';
        const palinStr = pLen > 0 ? psStr.substring(pStart, pStart + pLen) : '—';

        document.getElementById('ps-stat-step').innerText = `Tâm ${center}(${typeLabel})`;

        let updated = false;
        if (pLen > psBestLen) {
            psBestLen = pLen;
            psBestStart = pStart;
            updated = true;
            psUpdateBest();
        }

        if (pLen >= 2) {
            psAddLog(`Tâm ${center}(${typeLabel}): "${palinStr}" dài <b>${pLen}</b>${updated ? ' <span style="color:#dc2626;">★ MỚI</span>' : ''}`);
        }

        psRenderString(type === 'odd' ? center : -1, pStart, pStart + pLen - 1);
        psPhaseStep++;
        return true;
    }

    return false;
}

// =============================================
// MANACHER: TỪNG BƯỚC
// =============================================
function psNextStepManacher() {
    if (psPhase >= 2) return false;

    if (psPhase === 0) {
        psAddLog(`<span style="color:#f59e0b;"><b>═══ Manacher: t = "${psT}" ═══</b></span>`);
        psAddLog(`<span style="color:#6a9955;">  C=center, R=right boundary</span>`);
        psPhase = 1;
        psPhaseStep = 1; // Bắt đầu từ i=1
        psC = 0; psR = 0;
        psRenderManacher(-1);
        return true;
    }

    if (psPhase === 1) {
        const i = psPhaseStep;
        if (i >= psT.length - 1) {
            // Tìm max P[i]
            let maxP = 0, maxI = 0;
            for (let k = 1; k < psT.length - 1; k++) {
                if (psP[k] > maxP) { maxP = psP[k]; maxI = k; }
            }
            psBestLen = maxP;
            psBestStart = (maxI - maxP) / 2;
            psUpdateBest();

            const bestStr = psStr.substring(psBestStart, psBestStart + psBestLen);
            psAddLog(`<span style="color:#f59e0b;"><b>═══ KẾT QUẢ: "${bestStr}" (dài ${psBestLen}) ═══</b></span>`);
            psPhase = 2;
            psRenderString(-1, psBestStart, psBestStart + psBestLen - 1);
            psRenderManacher(-1);
            return false;
        }

        const mirror = 2 * psC - i;
        let initP = 0;

        if (i < psR) {
            initP = Math.min(psR - i, psP[mirror]);
            psP[i] = initP;
        }

        // Mở rộng
        let expanded = 0;
        while (psT[i + psP[i] + 1] === psT[i - psP[i] - 1]) {
            psP[i]++;
            expanded++;
        }

        // Cập nhật C, R
        let updatedCR = false;
        if (i + psP[i] > psR) {
            psC = i; psR = i + psP[i];
            updatedCR = true;
        }

        // Palindrome tương ứng trong s gốc
        const origLen = psP[i];
        const origStart = (i - psP[i]) / 2;

        // Log
        const ch = psT[i];
        if (psP[i] > 0) {
            const mirrorInfo = (i < psR && initP > 0) ? `, mirror P[${mirror}]=${psP[mirror]} → khởi tạo ${initP}` : '';
            const expandInfo = expanded > 0 ? `, mở rộng +${expanded}` : '';
            const crInfo = updatedCR ? ` → C=${psC}, R=${psR}` : '';
            const origStr = origLen > 0 ? `"${psStr.substring(origStart, origStart + origLen)}"` : '';

            psAddLog(`i=${i}('${ch}'): P[${i}]=<b style="color:#0284c7;">${psP[i]}</b>${mirrorInfo}${expandInfo}${crInfo} → ${origStr}`);
        }

        // Cập nhật best hiển thị
        if (origLen > psBestLen) {
            psBestLen = origLen;
            psBestStart = origStart;
            psUpdateBest();
        }

        document.getElementById('ps-stat-step').innerText = `i=${i}, C=${psC}, R=${psR}`;
        psRenderString(-1, origStart, origStart + origLen - 1);
        psRenderManacher(i);

        psPhaseStep++;
        return true;
    }

    return false;
}

// =============================================
// ĐIỀU KHIỂN CHUNG
// =============================================
function psNextStep() {
    if (psAlgorithm === 'EXPAND') return psNextStepExpand();
    else return psNextStepManacher();
}

async function psStartAuto() {
    if (psIsSimulating) { psIsSimulating = false; return; }
    psIsSimulating = true;
    document.getElementById('ps-btn-play').innerText = '⏸ Tạm dừng';

    const delay = psAlgorithm === 'EXPAND' ? 400 : 500;
    while (psIsSimulating && psNextStep()) {
        await new Promise(r => setTimeout(r, delay));
    }
    psIsSimulating = false;
    document.getElementById('ps-btn-play').innerText = '▶ Chạy tự động';
}

}
