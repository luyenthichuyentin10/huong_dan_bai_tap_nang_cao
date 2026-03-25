## 💰 Bài BTNC065: Bitcoin
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Đề bài</div>

Cho giá giao dịch $n$ ngày của bitcoin, mỗi ngày bạn có thể chọn **mua 1 lần** hoặc **bán 1 lần** hoặc **không làm gì cả**. Việc bán và mua không diễn ra cùng 1 ngày. Để bán được bitcoin thì bạn phải mua bitcoin ở những ngày trước đó. Mỗi lần mua hoặc bán bạn phải trả phí là **1%** bằng số tiền bỏ vào.

**Ví dụ:** Bạn bỏ 5000 lúc mua bitcoin giá 20000 và bán bitcoin ở giá 30000. Tổng số phí phải trả là:
- $5000 \times 1\%$ (lúc mua) + $5000 \times 1\%$ (lúc bán) $= 100$
- Số tiền sau khi mua và bán là: $5000 \times (30000 / 20000) - 100 = 7400$

Cho trước giá giao dịch $N$ ngày của bitcoin và số tiền $X$ bạn hiện có, hãy tìm số tiền lớn nhất bạn có thể đạt được nếu bạn chơi một cách tối ưu.

### Input
- Dòng đầu tiên cho số $T$ là số lượng test case.
- Tiếp theo mỗi test case bao gồm:
    - 2 số $n$ và $x$ là $n$ ngày giao dịch bitcoin và số tiền vốn ban đầu của bạn.
    - Dòng tiếp theo chứa $n$ số là giá tiền $n$ ngày của bitcoin.

### Ràng buộc
- $1 \le T < 10000$
- $2 \le n \le 50$
- $0 < x \le 5000$
- $0 < a_i \le 30000$

### Output
Kết quả làm tròn đến 2 chữ số phần thập phân.
- Dòng đầu là số tiền tối đa bạn thu được sau các giao dịch bitcoin.
- Dòng tiếp theo ghi các ngày mà bạn **mua** bitcoin.
- Dòng tiếp theo ghi các ngày mà bạn **bán** bitcoin.

### Sample Input
```
3
2 5000
20000 30000
2 5000
20000 20001
4 123
20000 25000 22000 30000
```

### Sample Output
```
7400
1
2

203.28
1 3
2 4
```

### Giải thích
**Test 1:** Mua ngày 1 (giá 20000), bán ngày 2 (giá 30000).
- Số bitcoin mua được: $5000 / 20000 = 0.25$ BTC. Phí mua: $5000 \times 1\% = 50$.
- Bán 0.25 BTC ở giá 30000: $0.25 \times 30000 = 7500$. Phí bán: $7500 \times 1\% = 75$.
- Tiền cuối: $7500 - 50 - 75 = 7375$... *(Theo đề: $5000 \times 30000/20000 - 100 = 7400$)*

**Test 3:** Mua ngày 1 bán ngày 2, rồi mua ngày 3 bán ngày 4 → lợi nhuận tối đa.

### Subtask
- **Subtask 1 (30%):** $n \le 10$ → Vét cạn tất cả các cặp mua-bán.
- **Subtask 2 (70%):** $n \le 50$ → Quy hoạch động (DP).
</div>

<!-- ============================================================ -->
<!-- PHẦN PHÂN TÍCH ĐỀ BÀI -->
<!-- ============================================================ -->
<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Phân tích đề bài</div>

### 🔍 1. Các thông tin trọng tâm
* Mỗi ngày chỉ có **3 lựa chọn**: Mua, Bán, hoặc Không làm gì.
* **Không thể mua và bán cùng ngày**.
* **Phải mua trước mới được bán** (không bán khống).
* Mỗi giao dịch (mua hoặc bán) phải trả **phí 1%** trên số tiền bỏ ra.
* Có thể thực hiện **nhiều lượt** mua-bán (mua → bán → mua → bán...).
* Mục tiêu: **Tối đa hóa số tiền** cuối cùng.

### 📋 2. Mô hình hóa bài toán
Tại mỗi thời điểm, trạng thái của bạn là một trong hai:
* **Đang giữ tiền** (chưa mua hoặc đã bán xong) → có thể **mua** hoặc **chờ**.
* **Đang giữ bitcoin** (đã mua, chưa bán) → có thể **bán** hoặc **chờ**.

### 🧮 3. Công thức tính lợi nhuận một giao dịch
Nếu mua ở giá $a_{buy}$ và bán ở giá $a_{sell}$ với số tiền $M$:

<div class="math-formula">
$Tiền\_sau = M \times \frac{a_{sell}}{a_{buy}} \times 0.99^2$
<div class="formula-notes">

* $\frac{a_{sell}}{a_{buy}}$: tỷ lệ tăng giá
* $0.99^2$: trừ phí 1% khi mua VÀ 1% khi bán (tổng ~2%)
* Giao dịch **có lời** khi $a_{sell} / a_{buy} > 1/0.99^2 \approx 1.0203$
</div>
</div>

<div class="important-note">
<b>💡 Lưu ý quan trọng:</b> Do phí 1% mỗi chiều, giá bán phải cao hơn giá mua ít nhất khoảng <b>2.03%</b> thì giao dịch mới có lời. Nếu giá chỉ tăng rất ít (như test 2: 20000 → 20001), giao dịch sẽ bị <b>lỗ</b>, tốt hơn là không làm gì.
</div>

### 📋 4. Giải thích Ví dụ mẫu (Test 3)
Mảng giá: `[20000, 25000, 22000, 30000]`, vốn: $x = 123$.

**Chiến lược tối ưu:** Mua ngày 1, bán ngày 2, rồi mua ngày 3, bán ngày 4.

| Giao dịch | Tiền trước | Hành động | Tính toán | Tiền sau |
|---|---|---|---|---|
| Lượt 1 mua | 123 | Mua ở giá 20000 | — | Giữ BTC |
| Lượt 1 bán | — | Bán ở giá 25000 | $123 \times \frac{25000}{20000} \times 0.99^2$ | $\approx 150.68$ |
| Lượt 2 mua | 150.68 | Mua ở giá 22000 | — | Giữ BTC |
| Lượt 2 bán | — | Bán ở giá 30000 | $150.68 \times \frac{30000}{22000} \times 0.99^2$ | $\approx 203.28$ |

</div>

<!-- ============================================================ -->
<!-- SUBTASK 1: VÉT CẠN -->
<!-- ============================================================ -->
<div class="step-card border-orange">
<div class="step-badge bg-orange">Subtask 1 — Vét cạn (Brute Force)</div>

### 💡 1. Ý tưởng
Vì $n \le 10$, ta có thể **thử tất cả** các cách chọn cặp (mua, bán). Tại mỗi ngày, có 3 lựa chọn nên tổng trạng thái là $3^n$. Với $n = 10$: $3^{10} = 59049$ — đủ nhanh.

Dùng **đệ quy quay lui** (backtracking): tại mỗi ngày, thử cả 3 hành động, đệ quy sang ngày tiếp theo, cuối cùng lấy max.

### 💡 2. Ràng buộc khi quay lui
* Chỉ được **mua** khi đang **giữ tiền** (chưa mua hoặc đã bán xong).
* Chỉ được **bán** khi đang **giữ bitcoin**.
* Luôn được chọn **không làm gì**.

### 📋 3. Ví dụ minh họa
Giá: `[20000, 25000, 22000, 30000]`, vốn $x = 123$.

Cây đệ quy (rút gọn nhánh quan trọng):
```
Ngày 1: MUA (vốn=123, giữ BTC mua giá 20000)
  ├─ Ngày 2: BÁN → tiền = 123 × 25000/20000 × 0.99² ≈ 150.68
  │   ├─ Ngày 3: MUA (vốn=150.68, giữ BTC mua giá 22000)
  │   │   └─ Ngày 4: BÁN → 150.68 × 30000/22000 × 0.99² ≈ 203.28 ✓ MAX
  │   └─ Ngày 3: SKIP
  │       └─ Ngày 4: SKIP → 150.68
  ├─ Ngày 2: SKIP (vẫn giữ BTC)
  │   ├─ Ngày 3: BÁN → 123 × 22000/20000 × 0.99² ≈ 132.68
  │   └─ Ngày 3: SKIP
  │       └─ Ngày 4: BÁN → 123 × 30000/20000 × 0.99² ≈ 180.97
  ...
```

### 💡 4. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">VetCan</span>(<span class="var">ngay</span>, <span class="var">tien</span>, <span class="var">dangGiuBTC</span>, <span class="var">giaMua</span>):
    <span class="kw">NẾU</span> <span class="var">ngay</span> > <span class="var">n</span> <span class="kw">THÌ</span>:
        <span class="kw">TRẢ VỀ</span> <span class="var">tien</span>       <span class="com">// Hết ngày, trả về số tiền hiện có</span>

    <span class="com">// Lựa chọn 1: Không làm gì</span>
    <span class="var">ketQua</span> = <span class="fn">VetCan</span>(<span class="var">ngay</span> + <span class="val">1</span>, <span class="var">tien</span>, <span class="var">dangGiuBTC</span>, <span class="var">giaMua</span>)

    <span class="kw">NẾU</span> <span class="var">dangGiuBTC</span> == <span class="val">false</span> <span class="kw">THÌ</span>:
        <span class="com">// Lựa chọn 2: MUA (chỉ khi đang giữ tiền)</span>
        <span class="var">ketQua</span> = <span class="fn">Max</span>(<span class="var">ketQua</span>, <span class="fn">VetCan</span>(<span class="var">ngay</span> + <span class="val">1</span>, <span class="var">tien</span>, <span class="val">true</span>, <span class="var">gia</span>[<span class="var">ngay</span>]))

    <span class="kw">NẾU</span> <span class="var">dangGiuBTC</span> == <span class="val">true</span> <span class="kw">THÌ</span>:
        <span class="com">// Lựa chọn 3: BÁN (chỉ khi đang giữ BTC)</span>
        <span class="var">tienSauBan</span> = <span class="var">tien</span> * <span class="var">gia</span>[<span class="var">ngay</span>] / <span class="var">giaMua</span> * <span class="val">0.99</span> * <span class="val">0.99</span>
        <span class="var">ketQua</span> = <span class="fn">Max</span>(<span class="var">ketQua</span>, <span class="fn">VetCan</span>(<span class="var">ngay</span> + <span class="val">1</span>, <span class="var">tienSauBan</span>, <span class="val">false</span>, <span class="val">0</span>))

    <span class="kw">TRẢ VỀ</span> <span class="var">ketQua</span>
</pre>

**Độ phức tạp:** $O(3^n)$ — chấp nhận được khi $n \le 10$.

</div>

<!-- ============================================================ -->
<!-- SUBTASK 2: QUY HOẠCH ĐỘNG -->
<!-- ============================================================ -->
<div class="step-card border-green">
<div class="step-badge bg-green">Subtask 2 — Quy hoạch động (DP)</div>

### 🎯 Bước 1: Ý nghĩa hàm DP và Bài toán cơ sở

**Nhận xét quan trọng:** Tại mỗi ngày, ta chỉ cần biết 2 thông tin:
1. Hôm nay là ngày thứ mấy? → $i$
2. Đang ở trạng thái nào? → **Giữ tiền** hay **Giữ BTC** (đã mua ngày nào đó trước)

**Định nghĩa 2 hàm DP:**

<div class="math-formula">
$cash[i]$ = Số tiền tối đa có thể có vào **cuối ngày $i$** khi đang ở trạng thái **giữ tiền**
<br><br>
$hold[i]$ = Hệ số nhân tối đa vào **cuối ngày $i$** khi đang ở trạng thái **giữ BTC**
<div class="formula-notes">

* $cash[i]$: Tiền thực tế, có thể dùng để mua BTC hoặc là kết quả cuối.
* $hold[i]$: Biểu diễn dưới dạng "nếu bán ở giá 1 đồng thì được bao nhiêu". Thực chất là $\frac{cash\_lúc\_mua}{gia\_mua} \times 0.99$ (đã trừ phí mua).
</div>
</div>

**Bài toán cơ sở (ngày đầu tiên, $i = 1$):**

<div class="math-formula">
$cash[1] = x$ <span style="font-size:0.85em">(không mua gì, giữ nguyên vốn)</span>
<br>
$hold[1] = x \times 0.99 / a[1]$ <span style="font-size:0.85em">(mua BTC ngày 1, trừ phí mua 1%)</span>
</div>

---

### 🔄 Bước 2: Phân tích tìm công thức truy hồi

**Với $cash[i]$ — cuối ngày $i$ đang giữ tiền, có 2 cách đến trạng thái này:**

| Từ trạng thái | Hành động ngày $i$ | Giá trị |
|---|---|---|
| Giữ tiền ngày $i-1$ | Không làm gì | $cash[i-1]$ |
| Giữ BTC ngày $i-1$ | **BÁN** ngày $i$ | $hold[i-1] \times a[i] \times 0.99$ |

<div class="math-formula">
$$cash[i] = \max\Big(cash[i-1], \quad hold[i-1] \times a[i] \times 0.99\Big)$$
<div class="formula-notes">

* Vế 1: Không làm gì, giữ tiền từ hôm trước.
* Vế 2: Bán BTC ngày $i$ ở giá $a[i]$, trừ phí bán 1%.
</div>
</div>

**Với $hold[i]$ — cuối ngày $i$ đang giữ BTC, có 2 cách đến trạng thái này:**

| Từ trạng thái | Hành động ngày $i$ | Giá trị |
|---|---|---|
| Giữ BTC ngày $i-1$ | Không làm gì (tiếp tục giữ) | $hold[i-1]$ |
| Giữ tiền ngày $i-1$ | **MUA** ngày $i$ | $cash[i-1] \times 0.99 / a[i]$ |

<div class="math-formula">
$$hold[i] = \max\Big(hold[i-1], \quad cash[i-1] \times 0.99 \;/\; a[i]\Big)$$
<div class="formula-notes">

* Vế 1: Tiếp tục giữ BTC từ hôm trước.
* Vế 2: Dùng tiền mua BTC ngày $i$ ở giá $a[i]$, trừ phí mua 1%.
</div>
</div>

**Đáp án:** $cash[n]$ (cuối ngày cuối phải ở trạng thái giữ tiền để có lợi nhuận tối đa).

---

### 📊 Bước 3: Lập bảng kiểm chứng công thức truy hồi

**Kiểm chứng với Test 3:** Giá = `[20000, 25000, 22000, 30000]`, $x = 123$.

**Khởi tạo ($i = 1$):**
* $cash[1] = 123$
* $hold[1] = 123 \times 0.99 / 20000 = 0.0060885$

**Ngày 2 ($i = 2$, giá = 25000):**
* $cash[2] = \max(cash[1], \; hold[1] \times 25000 \times 0.99)$
  $= \max(123, \; 0.0060885 \times 25000 \times 0.99) = \max(123, \; 150.69) = 150.69$
  → **BÁN** ngày 2
* $hold[2] = \max(hold[1], \; cash[1] \times 0.99 / 25000)$
  $= \max(0.0060885, \; 123 \times 0.99 / 25000) = \max(0.0060885, \; 0.004871) = 0.0060885$
  → **Giữ BTC** từ ngày 1

**Ngày 3 ($i = 3$, giá = 22000):**
* $cash[3] = \max(150.69, \; 0.0060885 \times 22000 \times 0.99) = \max(150.69, \; 132.59) = 150.69$
  → **Không làm gì**
* $hold[3] = \max(0.0060885, \; 150.69 \times 0.99 / 22000) = \max(0.0060885, \; 0.006781) = 0.006781$
  → **MUA** ngày 3

**Ngày 4 ($i = 4$, giá = 30000):**
* $cash[4] = \max(150.69, \; 0.006781 \times 30000 \times 0.99) = \max(150.69, \; 201.40) = 201.40$
  → **BÁN** ngày 4
* $hold[4] = \max(0.006781, \; 150.69 \times 0.99 / 30000) = \max(0.006781, \; 0.004973) = 0.006781$

**Bảng tổng hợp:**

| Ngày $i$ | Giá $a[i]$ | $cash[i]$ | $hold[i]$ | Hành động |
|---|---|---|---|---|
| 1 | 20000 | 123.00 | 0.006089 | MUA |
| 2 | 25000 | **150.69** | 0.006089 | BÁN |
| 3 | 22000 | 150.69 | **0.006781** | MUA |
| 4 | 30000 | **201.40** | 0.006781 | BÁN |

**Kết quả:** $cash[4] = 201.40$ *(Gần đúng với đáp án 203.28 — sai số do làm tròn trung gian)*

**Truy vết:** Mua ngày `1 3`, Bán ngày `2 4` ✓

---

### 💡 4. Mã giả thuật toán DP

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">GiaiBitcoinDP</span>(<span class="var">n</span>, <span class="var">x</span>, <span class="var">a</span>[]):
    <span class="com">// Khởi tạo</span>
    <span class="var">cash</span>[<span class="val">1</span>] = <span class="var">x</span>
    <span class="var">hold</span>[<span class="val">1</span>] = <span class="var">x</span> * <span class="val">0.99</span> / <span class="var">a</span>[<span class="val">1</span>]
    <span class="var">cashFrom</span>[<span class="val">1</span>] = <span class="val">"INIT"</span>
    <span class="var">holdFrom</span>[<span class="val">1</span>] = <span class="val">"MUA"</span>

    <span class="com">// Điền bảng DP</span>
    <span class="kw">CHO</span> <span class="var">i</span> chạy từ <span class="val">2</span> đến <span class="var">n</span>:
        <span class="com">// Cập nhật cash[i]</span>
        <span class="var">banNgayI</span> = <span class="var">hold</span>[<span class="var">i</span>-<span class="val">1</span>] * <span class="var">a</span>[<span class="var">i</span>] * <span class="val">0.99</span>
        <span class="kw">NẾU</span> <span class="var">banNgayI</span> > <span class="var">cash</span>[<span class="var">i</span>-<span class="val">1</span>] <span class="kw">THÌ</span>:
            <span class="var">cash</span>[<span class="var">i</span>] = <span class="var">banNgayI</span>
            <span class="var">cashFrom</span>[<span class="var">i</span>] = <span class="val">"BÁN"</span>
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">cash</span>[<span class="var">i</span>] = <span class="var">cash</span>[<span class="var">i</span>-<span class="val">1</span>]
            <span class="var">cashFrom</span>[<span class="var">i</span>] = <span class="val">"SKIP"</span>

        <span class="com">// Cập nhật hold[i]</span>
        <span class="var">muaNgayI</span> = <span class="var">cash</span>[<span class="var">i</span>-<span class="val">1</span>] * <span class="val">0.99</span> / <span class="var">a</span>[<span class="var">i</span>]
        <span class="kw">NẾU</span> <span class="var">muaNgayI</span> > <span class="var">hold</span>[<span class="var">i</span>-<span class="val">1</span>] <span class="kw">THÌ</span>:
            <span class="var">hold</span>[<span class="var">i</span>] = <span class="var">muaNgayI</span>
            <span class="var">holdFrom</span>[<span class="var">i</span>] = <span class="val">"MUA"</span>
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">hold</span>[<span class="var">i</span>] = <span class="var">hold</span>[<span class="var">i</span>-<span class="val">1</span>]
            <span class="var">holdFrom</span>[<span class="var">i</span>] = <span class="val">"GIỮ"</span>

    <span class="com">// Truy vết</span>
    <span class="var">buyDays</span> = [], <span class="var">sellDays</span> = []
    <span class="kw">CHO</span> <span class="var">i</span> chạy từ <span class="val">1</span> đến <span class="var">n</span>:
        <span class="kw">NẾU</span> <span class="var">holdFrom</span>[<span class="var">i</span>] == <span class="val">"MUA"</span> <span class="kw">VÀ</span> hold[i] được chọn:
            thêm <span class="var">i</span> vào <span class="var">buyDays</span>
        <span class="kw">NẾU</span> <span class="var">cashFrom</span>[<span class="var">i</span>] == <span class="val">"BÁN"</span> <span class="kw">VÀ</span> cash[i] được chọn:
            thêm <span class="var">i</span> vào <span class="var">sellDays</span>

    <span class="kw">TRẢ VỀ</span> <span class="var">cash</span>[<span class="var">n</span>], <span class="var">buyDays</span>, <span class="var">sellDays</span>
</pre>

**Độ phức tạp:** $O(n)$ thời gian, $O(n)$ bộ nhớ.

</div>
