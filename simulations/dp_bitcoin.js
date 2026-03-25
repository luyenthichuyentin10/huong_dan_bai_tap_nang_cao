{
// =============================================
// MÔ PHỎNG BÀI BITCOIN (dp_bitcoin.js)
// =============================================

let btcPrices = [];
let btcMoney = 0;
let btcN = 0;
let btcCurrentStep = -1;
let btcIsSimulating = false;
let btcAlgorithm = 'DP'; // 'DP' hoặc 'BRUTE'

// DP arrays
let dpCash = [];
let dpHold = [];
let dpCashFrom = [];
let dpHoldFrom = [];
let dpBuyDays = [];
let dpSellDays = [];

// Brute force
let bfBestMoney = 0;
let bfBestBuyDays = [];
let bfBestSellDays = [];
let bfSteps = []; // Lưu log các bước vét cạn
let bfCurrentStepIdx = -1;

function initDp_bitcoinSimulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Bitcoin Trading</div>
            
            <!-- PHẦN 1: Nhập liệu & Cấu hình -->
            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <label><b>Giá BTC các ngày:</b></label>
                    <input type="text" id="btc-input-prices" placeholder="20000 25000 22000 30000" 
                        style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1; min-width: 200px;">
                </div>
                <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                    <label><b>Vốn ban đầu (x):</b></label>
                    <input type="number" id="btc-input-money" value="123" 
                        style="width: 120px; padding: 8px; border-radius: 4px; border: 1px solid #cbd5e1;">
                    <button onclick="btcUpdateData()" class="toggle-btn" style="background:#0284c7; color:white;">💾 Cập nhật</button>
                    <button onclick="btcRandomData()" class="toggle-btn" style="background:#f59e0b; color:white;">🎲 Ngẫu nhiên</button>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <label><b>Thuật toán:</b></label>
                    <select id="btc-algo-select" onchange="btcReset()" style="padding: 8px; border-radius: 4px; font-size: 0.95rem;">
                        <option value="DP">📊 Quy hoạch động (DP)</option>
                        <option value="BRUTE">🔍 Vét cạn (Brute Force)</option>
                    </select>
                </div>
            </div>

            <!-- PHẦN 2: Biểu đồ giá -->
            <div style="margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 8px;">📈 Biểu đồ giá Bitcoin:</div>
                <div id="btc-chart-area" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 180px; position: relative; overflow-x: auto;"></div>
            </div>

            <!-- PHẦN 3: Bảng DP / Kết quả -->
            <div id="btc-dp-table-area" style="margin-bottom: 20px; overflow-x: auto;"></div>

            <!-- PHẦN 4: Thống kê -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #29c702;">
                <div><b>Vốn ban đầu:</b> <span id="btc-stat-init" style="color:#0284c7; font-weight:bold;">0</span></div>
                <div><b>Tiền tối đa:</b> <span id="btc-stat-result" style="color:#dc2626; font-weight:bold;">—</span></div>
                <div><b>Lợi nhuận:</b> <span id="btc-stat-profit" style="font-weight:bold;">—</span></div>
            </div>

            <!-- PHẦN 5: Kết quả giao dịch -->
            <div id="btc-trade-result" style="display:none; margin-bottom: 20px; background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b;">
            </div>

            <!-- PHẦN 6: Điều khiển & Log -->
            <div style="display: grid; grid-template-columns: 200px 1fr; gap: 20px;">
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="btcStartAuto()" id="btc-btn-play" class="toggle-btn" style="justify-content: center;">▶ Chạy tự động</button>
                    <button onclick="btcNextStep()" class="toggle-btn" style="background:#29c702; color:white; justify-content: center;">⏭ Từng bước</button>
                    <button onclick="btcReset()" class="toggle-btn" style="background:#64748b; color:white; justify-content: center;">🔄 Reset</button>
                </div>
                <div id="btc-log-container" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 0.85rem; height: 180px; overflow-y: auto; border-left: 4px solid #f59e0b;">
                    <div id="btc-log-content"></div>
                </div>
            </div>
        </div>
    `;

    btcRandomData();
}

// =============================================
// NHẬP LIỆU
// =============================================
function btcUpdateData() {
    const val = document.getElementById('btc-input-prices').value;
    btcPrices = val.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 15);
    btcMoney = parseFloat(document.getElementById('btc-input-money').value) || 100;
    btcN = btcPrices.length;
    btcReset();
}

function btcRandomData() {
    btcN = 4 + Math.floor(Math.random() * 4); // 4-7 ngày
    btcPrices = [];
    let basePrice = 15000 + Math.floor(Math.random() * 10000);
    for (let i = 0; i < btcN; i++) {
        let change = Math.floor(Math.random() * 8000) - 3000; // -3000 đến +5000
        btcPrices.push(Math.max(1000, basePrice + change));
        basePrice = btcPrices[i];
    }
    btcMoney = [100, 123, 500, 1000, 5000][Math.floor(Math.random() * 5)];
    document.getElementById('btc-input-prices').value = btcPrices.join(' ');
    document.getElementById('btc-input-money').value = btcMoney;
    btcReset();
}

// =============================================
// RESET
// =============================================
function btcReset() {
    btcIsSimulating = false;
    btcCurrentStep = -1;
    btcAlgorithm = document.getElementById('btc-algo-select').value;

    // Reset DP
    dpCash = new Array(btcN + 1).fill(0);
    dpHold = new Array(btcN + 1).fill(-Infinity);
    dpCashFrom = new Array(btcN + 1).fill('');
    dpHoldFrom = new Array(btcN + 1).fill('');
    dpBuyDays = [];
    dpSellDays = [];

    // Reset Brute force
    bfBestMoney = btcMoney;
    bfBestBuyDays = [];
    bfBestSellDays = [];
    bfSteps = [];
    bfCurrentStepIdx = -1;

    // Nếu vét cạn, precompute tất cả bước
    if (btcAlgorithm === 'BRUTE') {
        btcPrecomputeBrute();
    }

    // Update UI
    document.getElementById('btc-stat-init').innerText = btcMoney;
    document.getElementById('btc-stat-result').innerText = '—';
    document.getElementById('btc-stat-profit').innerText = '—';
    document.getElementById('btc-trade-result').style.display = 'none';
    document.getElementById('btc-btn-play').innerText = '▶ Chạy tự động';

    btcRenderChart([]);
    btcRenderDPTable();
    btcClearLog();

    if (btcAlgorithm === 'DP') {
        btcAddLog(`<span style="color:#6a9955;">// Thuật toán: Quy hoạch động (DP)</span>`);
        btcAddLog(`<span style="color:#6a9955;">// Giá BTC: [${btcPrices.join(', ')}]</span>`);
        btcAddLog(`<span style="color:#6a9955;">// Vốn: ${btcMoney}</span>`);
    } else {
        btcAddLog(`<span style="color:#6a9955;">// Thuật toán: Vét cạn (Brute Force)</span>`);
        btcAddLog(`<span style="color:#6a9955;">// Giá BTC: [${btcPrices.join(', ')}]</span>`);
        btcAddLog(`<span style="color:#6a9955;">// Tổng số nhánh cần duyệt: ${bfSteps.length}</span>`);
    }
}

// =============================================
// VẼ BIỂU ĐỒ GIÁ
// =============================================
function btcRenderChart(highlights) {
    const area = document.getElementById('btc-chart-area');
    if (!area || btcN === 0) { if(area) area.innerHTML = '<p style="text-align:center;color:#94a3b8;">Chưa có dữ liệu</p>'; return; }

    const maxPrice = Math.max(...btcPrices);
    const minPrice = Math.min(...btcPrices);
    const range = maxPrice - minPrice || 1;
    const chartH = 140;
    const barW = Math.min(60, Math.floor(500 / btcN));
    const gap = 8;

    let html = '<div style="display: flex; align-items: flex-end; gap: ' + gap + 'px; height: ' + (chartH + 50) + 'px; padding: 10px;">';

    btcPrices.forEach((price, i) => {
        const h = Math.max(20, ((price - minPrice) / range) * chartH + 20);
        const dayNum = i + 1;

        let bgColor = '#93c5fd'; // Mặc định: xanh nhạt
        let borderColor = '#3b82f6';
        let label = '';

        // Kiểm tra highlights
        if (highlights.includes('buy-' + dayNum)) {
            bgColor = '#86efac'; borderColor = '#16a34a'; label = '🟢 MUA';
        } else if (highlights.includes('sell-' + dayNum)) {
            bgColor = '#fca5a5'; borderColor = '#dc2626'; label = '🔴 BÁN';
        } else if (highlights.includes('current-' + dayNum)) {
            bgColor = '#fde68a'; borderColor = '#f59e0b'; label = '👆';
        }

        html += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <div style="font-size: 11px; color: #64748b; font-weight: bold;">${label}</div>
                <div style="font-size: 11px; font-weight: bold; color: #1e293b;">${price.toLocaleString()}</div>
                <div style="width: ${barW}px; height: ${h}px; background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 4px 4px 0 0; transition: all 0.3s;"></div>
                <div style="font-size: 13px; font-weight: 900; color: #475569;">Ngày ${dayNum}</div>
            </div>
        `;
    });

    html += '</div>';
    area.innerHTML = html;
}

// =============================================
// VẼ BẢNG DP
// =============================================
function btcRenderDPTable() {
    const area = document.getElementById('btc-dp-table-area');
    if (!area) return;

    if (btcAlgorithm !== 'DP') {
        area.innerHTML = '';
        return;
    }

    let html = '<div style="font-weight: bold; margin-bottom: 8px;">📊 Bảng DP:</div>';
    html += '<table class="garden-table" style="font-size: 0.85rem; width: 100%;">';

    // Header
    html += '<tr class="idx-row"><td style="min-width:90px;"><b>Ngày i</b></td>';
    for (let i = 1; i <= btcN; i++) {
        const isActive = (i <= btcCurrentStep);
        html += `<td style="min-width:80px; ${isActive ? 'background:#fef08a;' : ''}">${i}</td>`;
    }
    html += '</tr>';

    // Giá
    html += '<tr><td><b>Giá a[i]</b></td>';
    for (let i = 1; i <= btcN; i++) {
        html += `<td>${btcPrices[i-1].toLocaleString()}</td>`;
    }
    html += '</tr>';

    // cash[i]
    html += '<tr><td><b style="color:#0284c7;">cash[i]</b></td>';
    for (let i = 1; i <= btcN; i++) {
        const filled = (i <= btcCurrentStep);
        const val = filled ? dpCash[i].toFixed(2) : '—';
        const from = filled ? dpCashFrom[i] : '';
        let bgStyle = '';
        if (filled && dpCashFrom[i] === 'BÁN') bgStyle = 'background:#fecaca;';
        html += `<td style="${bgStyle}">${val}<br><small style="color:#64748b;">${from}</small></td>`;
    }
    html += '</tr>';

    // hold[i]
    html += '<tr><td><b style="color:#16a34a;">hold[i]</b></td>';
    for (let i = 1; i <= btcN; i++) {
        const filled = (i <= btcCurrentStep);
        const val = filled ? dpHold[i].toFixed(6) : '—';
        const from = filled ? dpHoldFrom[i] : '';
        let bgStyle = '';
        if (filled && dpHoldFrom[i] === 'MUA') bgStyle = 'background:#bbf7d0;';
        html += `<td style="${bgStyle}">${val}<br><small style="color:#64748b;">${from}</small></td>`;
    }
    html += '</tr>';

    html += '</table>';
    area.innerHTML = html;
}

// =============================================
// LOG
// =============================================
function btcAddLog(msg) {
    const logArea = document.getElementById('btc-log-content');
    if (!logArea) return;
    logArea.innerHTML += `<div><span style="color: #38bdf8;">></span> ${msg}</div>`;
    document.getElementById('btc-log-container').scrollTop = 999999;
}

function btcClearLog() {
    const logArea = document.getElementById('btc-log-content');
    if (logArea) logArea.innerHTML = '';
}

// =============================================
// DP: TỪNG BƯỚC
// =============================================
function btcNextStepDP() {
    if (btcCurrentStep >= btcN) {
        if (btcCurrentStep === btcN) {
            // Truy vết
            btcTraceback();
            btcCurrentStep++;
        }
        return false;
    }

    btcCurrentStep++;
    const i = btcCurrentStep;

    if (i === 1) {
        // Bài toán cơ sở
        dpCash[1] = btcMoney;
        dpCashFrom[1] = 'INIT';
        dpHold[1] = btcMoney * 0.99 / btcPrices[0];
        dpHoldFrom[1] = 'MUA';

        btcAddLog(`<span style="color:#f59e0b;"><b>═══ Ngày 1 (Cơ sở) ═══</b></span>`);
        btcAddLog(`  cash[1] = ${btcMoney} <span style="color:#6a9955;">(giữ tiền, không mua)</span>`);
        btcAddLog(`  hold[1] = ${btcMoney} × 0.99 / ${btcPrices[0]} = <b>${dpHold[1].toFixed(6)}</b> <span style="color:#6a9955;">(mua BTC ngày 1)</span>`);
    } else {
        const price = btcPrices[i - 1];
        btcAddLog(`<span style="color:#f59e0b;"><b>═══ Ngày ${i} (giá = ${price.toLocaleString()}) ═══</b></span>`);

        // Tính cash[i]
        const sellOption = dpHold[i - 1] * price * 0.99;
        const keepCash = dpCash[i - 1];

        btcAddLog(`  <span style="color:#0284c7;">cash[${i}]</span> = max(cash[${i-1}], hold[${i-1}] × ${price} × 0.99)`);
        btcAddLog(`         = max(${keepCash.toFixed(2)}, ${dpHold[i-1].toFixed(6)} × ${price} × 0.99)`);
        btcAddLog(`         = max(${keepCash.toFixed(2)}, ${sellOption.toFixed(2)})`);

        if (sellOption > keepCash) {
            dpCash[i] = sellOption;
            dpCashFrom[i] = 'BÁN';
            btcAddLog(`         = <b style="color:#dc2626;">${sellOption.toFixed(2)}</b> → <span style="color:#dc2626;">BÁN ngày ${i}</span>`);
        } else {
            dpCash[i] = keepCash;
            dpCashFrom[i] = 'SKIP';
            btcAddLog(`         = <b>${keepCash.toFixed(2)}</b> → Giữ tiền (không bán)`);
        }

        // Tính hold[i]
        const buyOption = dpCash[i - 1] * 0.99 / price;
        const keepHold = dpHold[i - 1];

        btcAddLog(`  <span style="color:#16a34a;">hold[${i}]</span> = max(hold[${i-1}], cash[${i-1}] × 0.99 / ${price})`);
        btcAddLog(`         = max(${keepHold.toFixed(6)}, ${dpCash[i-1].toFixed(2)} × 0.99 / ${price})`);
        btcAddLog(`         = max(${keepHold.toFixed(6)}, ${buyOption.toFixed(6)})`);

        if (buyOption > keepHold) {
            dpHold[i] = buyOption;
            dpHoldFrom[i] = 'MUA';
            btcAddLog(`         = <b style="color:#16a34a;">${buyOption.toFixed(6)}</b> → <span style="color:#16a34a;">MUA ngày ${i}</span>`);
        } else {
            dpHold[i] = keepHold;
            dpHoldFrom[i] = 'GIỮ';
            btcAddLog(`         = <b>${keepHold.toFixed(6)}</b> → Giữ BTC (không mua mới)`);
        }
    }

    // Cập nhật chart highlights
    let highlights = ['current-' + i];
    for (let j = 1; j <= i; j++) {
        if (dpHoldFrom[j] === 'MUA') highlights.push('buy-' + j);
        if (dpCashFrom[j] === 'BÁN') highlights.push('sell-' + j);
    }
    btcRenderChart(highlights);
    btcRenderDPTable();

    return true;
}

function btcTraceback() {
    // Truy vết: đi ngược từ cash[n]
    dpBuyDays = [];
    dpSellDays = [];

    // Xác định đường đi tối ưu
    let state = 'cash'; // Kết thúc phải ở trạng thái cash
    for (let i = btcN; i >= 1; i--) {
        if (state === 'cash') {
            if (dpCashFrom[i] === 'BÁN') {
                dpSellDays.push(i);
                state = 'hold';
            }
            // Nếu SKIP hoặc INIT: giữ nguyên state cash
        } else { // state === 'hold'
            if (dpHoldFrom[i] === 'MUA') {
                dpBuyDays.push(i);
                state = 'cash';
            }
            // Nếu GIỮ: giữ nguyên state hold
        }
    }

    dpBuyDays.reverse();
    dpSellDays.reverse();

    const finalMoney = dpCash[btcN];
    const profit = finalMoney - btcMoney;
    const profitPct = ((profit / btcMoney) * 100).toFixed(2);

    btcAddLog(`<span style="color:#f59e0b;"><b>═══ KẾT QUẢ ═══</b></span>`);
    btcAddLog(`  Tiền tối đa: <b style="color:#dc2626;">${finalMoney.toFixed(2)}</b>`);
    btcAddLog(`  Lợi nhuận: <b>${profit >= 0 ? '+' : ''}${profit.toFixed(2)}</b> (${profitPct}%)`);
    btcAddLog(`  Ngày MUA:  <b style="color:#16a34a;">${dpBuyDays.length > 0 ? dpBuyDays.join(' ') : 'Không mua'}</b>`);
    btcAddLog(`  Ngày BÁN:  <b style="color:#dc2626;">${dpSellDays.length > 0 ? dpSellDays.join(' ') : 'Không bán'}</b>`);

    // Cập nhật thống kê
    document.getElementById('btc-stat-result').innerText = finalMoney.toFixed(2);
    document.getElementById('btc-stat-profit').innerHTML = `<span style="color:${profit >= 0 ? '#16a34a' : '#dc2626'}">${profit >= 0 ? '+' : ''}${profit.toFixed(2)} (${profitPct}%)</span>`;

    // Hiển thị kết quả giao dịch
    const tradeArea = document.getElementById('btc-trade-result');
    tradeArea.style.display = 'block';
    let tradeHtml = '<b>📋 Các giao dịch tối ưu:</b><br>';
    for (let k = 0; k < dpBuyDays.length; k++) {
        const bDay = dpBuyDays[k];
        const sDay = dpSellDays[k];
        const ratio = btcPrices[sDay - 1] / btcPrices[bDay - 1];
        tradeHtml += `Lượt ${k + 1}: Mua ngày <b style="color:#16a34a;">${bDay}</b> (giá ${btcPrices[bDay-1].toLocaleString()}) → Bán ngày <b style="color:#dc2626;">${sDay}</b> (giá ${btcPrices[sDay-1].toLocaleString()}) — tỷ lệ ×${ratio.toFixed(4)}<br>`;
    }
    if (dpBuyDays.length === 0) tradeHtml += '<i>Không giao dịch nào (giữ tiền là tối ưu).</i>';
    tradeArea.innerHTML = tradeHtml;

    // Highlight chart
    let highlights = [];
    dpBuyDays.forEach(d => highlights.push('buy-' + d));
    dpSellDays.forEach(d => highlights.push('sell-' + d));
    btcRenderChart(highlights);
}

// =============================================
// VÉT CẠN: PRECOMPUTE
// =============================================
function btcPrecomputeBrute() {
    bfSteps = [];
    bfBestMoney = btcMoney;
    bfBestBuyDays = [];
    bfBestSellDays = [];

    // Sinh tất cả các cách chọn cặp mua-bán hợp lệ
    // Dùng đệ quy để liệt kê
    function generate(dayIdx, money, holdingBTC, buyPrice, currentBuys, currentSells, path) {
        if (dayIdx > btcN) {
            // Nếu đang giữ BTC thì không tính (phải bán hết)
            const finalMoney = holdingBTC ? money : money; 
            // Chỉ tính nếu không giữ BTC
            if (!holdingBTC) {
                const desc = path.length > 0 ? path.join(' → ') : 'Không giao dịch';
                bfSteps.push({
                    money: money,
                    buys: [...currentBuys],
                    sells: [...currentSells],
                    desc: desc,
                    isNew: money > bfBestMoney
                });
                if (money > bfBestMoney) {
                    bfBestMoney = money;
                    bfBestBuyDays = [...currentBuys];
                    bfBestSellDays = [...currentSells];
                }
            }
            return;
        }

        const price = btcPrices[dayIdx - 1];

        // Lựa chọn 1: Không làm gì
        generate(dayIdx + 1, money, holdingBTC, buyPrice, currentBuys, currentSells, 
            [...path, `Ngày ${dayIdx}: SKIP`]);

        if (!holdingBTC) {
            // Lựa chọn 2: MUA
            generate(dayIdx + 1, money, true, price, [...currentBuys, dayIdx], currentSells,
                [...path, `Ngày ${dayIdx}: MUA (giá ${price})`]);
        }

        if (holdingBTC) {
            // Lựa chọn 3: BÁN
            const sellMoney = money * (price / buyPrice) * 0.99 * 0.99;
            generate(dayIdx + 1, sellMoney, false, 0, currentBuys, [...currentSells, dayIdx],
                [...path, `Ngày ${dayIdx}: BÁN (giá ${price}) → tiền = ${sellMoney.toFixed(2)}`]);
        }
    }

    generate(1, btcMoney, false, 0, [], [], []);
}

// =============================================
// VÉT CẠN: TỪNG BƯỚC
// =============================================
function btcNextStepBrute() {
    if (bfCurrentStepIdx >= bfSteps.length - 1) {
        if (bfCurrentStepIdx === bfSteps.length - 1) {
            btcAddLog(`<span style="color:#f59e0b;"><b>═══ KẾT QUẢ VÉT CẠN ═══</b></span>`);
            btcAddLog(`  Đã duyệt <b>${bfSteps.length}</b> nhánh hợp lệ.`);
            btcAddLog(`  Tiền tối đa: <b style="color:#dc2626;">${bfBestMoney.toFixed(2)}</b>`);
            btcAddLog(`  Ngày MUA: <b style="color:#16a34a;">${bfBestBuyDays.length > 0 ? bfBestBuyDays.join(' ') : 'Không'}</b>`);
            btcAddLog(`  Ngày BÁN: <b style="color:#dc2626;">${bfBestSellDays.length > 0 ? bfBestSellDays.join(' ') : 'Không'}</b>`);

            // Cập nhật UI
            document.getElementById('btc-stat-result').innerText = bfBestMoney.toFixed(2);
            const profit = bfBestMoney - btcMoney;
            const profitPct = ((profit / btcMoney) * 100).toFixed(2);
            document.getElementById('btc-stat-profit').innerHTML = `<span style="color:${profit >= 0 ? '#16a34a' : '#dc2626'}">${profit >= 0 ? '+' : ''}${profit.toFixed(2)} (${profitPct}%)</span>`;

            let highlights = [];
            bfBestBuyDays.forEach(d => highlights.push('buy-' + d));
            bfBestSellDays.forEach(d => highlights.push('sell-' + d));
            btcRenderChart(highlights);

            const tradeArea = document.getElementById('btc-trade-result');
            tradeArea.style.display = 'block';
            let tradeHtml = '<b>📋 Chiến lược tối ưu (Vét cạn):</b><br>';
            for (let k = 0; k < bfBestBuyDays.length; k++) {
                const bDay = bfBestBuyDays[k];
                const sDay = bfBestSellDays[k];
                tradeHtml += `Mua ngày <b style="color:#16a34a;">${bDay}</b> → Bán ngày <b style="color:#dc2626;">${sDay}</b><br>`;
            }
            if (bfBestBuyDays.length === 0) tradeHtml += '<i>Không giao dịch.</i>';
            tradeArea.innerHTML = tradeHtml;

            bfCurrentStepIdx++;
        }
        return false;
    }

    bfCurrentStepIdx++;
    const step = bfSteps[bfCurrentStepIdx];
    const stepNum = bfCurrentStepIdx + 1;

    let highlights = [];
    step.buys.forEach(d => highlights.push('buy-' + d));
    step.sells.forEach(d => highlights.push('sell-' + d));

    const isBest = step.money >= bfBestMoney - 0.001;
    const color = isBest ? '#29c702' : '#d4d4d4';

    btcAddLog(`<span style="color:${color};"><b>Nhánh ${stepNum}/${bfSteps.length}:</b></span> ${step.desc}`);
    btcAddLog(`  → Tiền cuối: <b style="color:${isBest ? '#dc2626' : '#94a3b8'};">${step.money.toFixed(2)}</b>${isBest && step.money > btcMoney ? ' ★ MAX MỚI' : ''}`);

    btcRenderChart(highlights);
    return true;
}

// =============================================
// ĐIỀU KHIỂN CHUNG
// =============================================
function btcNextStep() {
    if (btcAlgorithm === 'DP') {
        return btcNextStepDP();
    } else {
        return btcNextStepBrute();
    }
}

async function btcStartAuto() {
    if (btcIsSimulating) { btcIsSimulating = false; return; }
    btcIsSimulating = true;
    document.getElementById('btc-btn-play').innerText = '⏸ Tạm dừng';

    const delay = btcAlgorithm === 'BRUTE' ? 400 : 800;
    while (btcIsSimulating && btcNextStep()) {
        await new Promise(r => setTimeout(r, delay));
    }
    btcIsSimulating = false;
    document.getElementById('btc-btn-play').innerText = '▶ Chạy tự động';
}

}
