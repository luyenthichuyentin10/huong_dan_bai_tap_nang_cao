## 🏔️ Bài BTNC066: Dãy con tăng giảm
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Đề bài</div>

Cho một dãy số nguyên dương, tìm **dãy con dài nhất** có các đặc điểm sau:
* Độ dài của dãy là **1 số lẻ** $2k + 1$.
* Phần đầu của dãy có $k + 1$ số nguyên **tăng dần**.
* Phần sau của dãy có $k + 1$ số nguyên **giảm dần**.
* **Không có 2 số nguyên nào cạnh nhau** trong dãy có giá trị bằng nhau.

Ví dụ: `1, 2, 3, 4, 5, 4, 3, 2, 1` là 1 dãy thỏa điều kiện. Tuy nhiên, dãy `1, 2, 3, 4, 5, 4, 3, 2, 2` **không thỏa** (vì có 2 số bằng nhau cạnh nhau ở cuối).

Yêu cầu: trong một dãy cho trước, hãy tìm **dãy con dài nhất** thỏa mãn điều kiện trên.

### Input
- Dòng thứ nhất chứa số $n$ là độ dài của dãy.
- Dòng tiếp theo chứa $n$ số $a_i$ cách nhau khoảng trắng lần lượt là các phần tử trong dãy.

### Ràng buộc
- $0 < n \le 10^5$
- $0 < a_i \le 10^9$

### Output
- Dòng thứ nhất ghi **độ dài** của dãy con thỏa điều kiện tìm được.
- Dòng tiếp theo ghi các phần tử trong dãy con đó, mỗi phần tử cách nhau khoảng trắng.
- Nếu không tìm được dãy con tăng giảm thì ghi `"No"`.

### Sample Input
```
19
1 2 3 2 1 5 4 1 2 3 2 2 1
```

### Sample Output
```
9
1 2 3 4 5 4 3 2 1
```

### Giải thích
Dãy gốc: `1 2 3 2 1 5 4 1 2 3 2 2 1`

Dãy con tăng giảm dài nhất: `1 2 3 4 5 4 3 2 1` (lấy từ các vị trí phù hợp).
- Phần tăng: $1 < 2 < 3 < 4 < 5$ (5 phần tử).
- Đỉnh: $5$.
- Phần giảm: $5 > 4 > 3 > 2 > 1$ (5 phần tử).
- Tổng: $9 = 2 \times 4 + 1$ (lẻ ✓).

### Subtask
- **Subtask 1 (30%):** $n \le 1000$ → Vét cạn / DP cơ bản $O(n^2)$.
- **Subtask 2 (70%):** $n \le 10^5$ → DP tối ưu với tìm kiếm nhị phân $O(n \log n)$.
</div>

<!-- ============================================================ -->
<!-- PHẦN PHÂN TÍCH ĐỀ BÀI -->
<!-- ============================================================ -->
<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Phân tích đề bài</div>

### 🔍 1. Các thông tin trọng tâm
* Đây là bài toán tìm **Longest Bitonic Subsequence** (dãy con lưỡng hướng dài nhất).
* "Dãy con" (subsequence) — không cần liên tiếp, chỉ cần giữ thứ tự.
* Dãy kết quả có dạng "núi": **tăng nghiêm ngặt → đỉnh → giảm nghiêm ngặt**.
* Phần tăng và phần giảm **dùng chung đỉnh** và **phải cùng độ dài $k+1$**, nên:

<div class="math-formula">
Đặt $k + 1 = \min(LIS[i], \; LDS[i])$
<br><br>
Độ dài dãy tăng giảm với đỉnh tại vị trí $i$ = $2 \times \min(LIS[i], \; LDS[i]) - 1$
<div class="formula-notes">

* $LIS[i]$: Độ dài dãy con tăng nghiêm ngặt dài nhất **kết thúc** tại $a[i]$ (Longest Increasing Subsequence ending at $i$).
* $LDS[i]$: Độ dài dãy con giảm nghiêm ngặt dài nhất **bắt đầu** tại $a[i]$ (Longest Decreasing Subsequence starting at $i$).
* Lấy $\min$ vì **đề bài yêu cầu phần tăng và phần giảm cùng độ dài** $k+1$.
* Trừ 1 vì đỉnh $a[i]$ được đếm ở cả hai phần.
</div>
</div>

<div class="important-note">
<b>💡 Ràng buộc quan trọng:</b> Đề bài yêu cầu dãy có dạng $2k + 1$, tức phần tăng đúng $k+1$ phần tử và phần giảm đúng $k+1$ phần tử (kể cả đỉnh). <b>Hai nửa phải cùng độ dài!</b> Do đó ta không dùng <code>LIS[i] + LDS[i] - 1</code> mà phải dùng <code>2 × min(LIS[i], LDS[i]) - 1</code>. Ngoài ra cần <code>LIS[i] ≥ 2</code> và <code>LDS[i] ≥ 2</code> để có cả phần tăng lẫn phần giảm.
</div>

### 📋 2. Giải thích Ví dụ mẫu

Dãy: `1 2 3 2 1 5 4 1 2 3 2 2 1` (chỉ mục 1..19)

| Vị trí $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| $a[i]$ | 1 | 2 | 3 | 2 | 1 | 5 | 4 | 1 | 2 | 3 | 2 | 2 | 1 | — | — | — | — | — | — |

*(Dãy mẫu trong hình có 19 phần tử: `1 2 3 2 1 5 4 1 2 3 2 2 1`)*

Tại đỉnh $a[6] = 5$:
* $LIS[6]$: Dãy tăng kết thúc tại 5 → `1, 2, 3, 4, 5` → dài 5.
* $LDS[6]$: Dãy giảm bắt đầu tại 5 → `5, 4, 3, 2, 1` → dài 5.
* $\min(5, 5) = 5$, Tổng: $2 \times 5 - 1 = 9$ (lẻ ✓) → Đáp án.

</div>

<!-- ============================================================ -->
<!-- SUBTASK 1: VÉT CẠN / DP O(n²) -->
<!-- ============================================================ -->
<div class="step-card border-orange">
<div class="step-badge bg-orange">Subtask 1 — DP cơ bản O(n²)</div>

### 💡 Ý tưởng
Tính $LIS[i]$ và $LDS[i]$ cho mọi vị trí $i$ bằng thuật toán DP cổ điển $O(n^2)$, sau đó duyệt tìm đỉnh tốt nhất.

---

### 🎯 Bước 1: Ý nghĩa hàm DP và Bài toán cơ sở

**Định nghĩa:**

<div class="math-formula">
$LIS[i]$ = Độ dài dãy con tăng nghiêm ngặt dài nhất kết thúc tại vị trí $i$
<br><br>
$LDS[i]$ = Độ dài dãy con giảm nghiêm ngặt dài nhất bắt đầu tại vị trí $i$
</div>

**Bài toán cơ sở:**
* $LIS[1] = 1$ (dãy chỉ có 1 phần tử luôn có dãy tăng dài 1).
* $LDS[n] = 1$ (phần tử cuối luôn có dãy giảm dài 1).

---

### 🔄 Bước 2: Công thức truy hồi

**Tính $LIS[i]$ (duyệt trái → phải):**

<div class="math-formula">
$$LIS[i] = 1 + \max_{j < i,\; a[j] < a[i]} LIS[j]$$
<div class="formula-notes">

* Duyệt tất cả $j$ đứng **trước** $i$ mà $a[j] < a[i]$ (tăng nghiêm ngặt).
* Lấy $LIS[j]$ lớn nhất rồi cộng 1 (thêm $a[i]$ vào cuối).
* Nếu không có $j$ nào thỏa → $LIS[i] = 1$.
</div>
</div>

**Tính $LDS[i]$ (duyệt phải → trái):**

<div class="math-formula">
$$LDS[i] = 1 + \max_{j > i,\; a[j] < a[i]} LDS[j]$$
<div class="formula-notes">

* Duyệt tất cả $j$ đứng **sau** $i$ mà $a[j] < a[i]$ (giảm nghiêm ngặt).
* Lấy $LDS[j]$ lớn nhất rồi cộng 1.
* Nếu không có $j$ nào thỏa → $LDS[i] = 1$.
</div>
</div>

**Tìm đáp án:**

<div class="math-formula">
$$\text{Đáp án} = \max_{i=1}^{n} \Big( 2 \times \min(LIS[i], \; LDS[i]) - 1 \Big)$$
với điều kiện $LIS[i] \ge 2$ và $LDS[i] \ge 2$.
</div>

---

### 📊 Bước 3: Lập bảng kiểm chứng

**Ví dụ nhỏ:** Dãy $a = [1, 3, 5, 4, 2]$ ($n = 5$).

**Tính LIS (trái → phải):**

| $i$ | $a[i]$ | Các $j < i$ thỏa $a[j] < a[i]$ | $LIS[i]$ |
|---|---|---|---|
| 1 | 1 | Không có | **1** |
| 2 | 3 | $j=1$: $a[1]=1 < 3$ → $LIS[1]=1$ | $1 + 1 =$ **2** |
| 3 | 5 | $j=1$: 1, $j=2$: 2 → max = 2 | $1 + 2 =$ **3** |
| 4 | 4 | $j=1$: 1, $j=2$: 2 → max = 2 | $1 + 2 =$ **3** |
| 5 | 2 | $j=1$: $a[1]=1 < 2$ → $LIS[1]=1$ | $1 + 1 =$ **2** |

**Tính LDS (phải → trái):**

| $i$ | $a[i]$ | Các $j > i$ thỏa $a[j] < a[i]$ | $LDS[i]$ |
|---|---|---|---|
| 5 | 2 | Không có | **1** |
| 4 | 4 | $j=5$: $a[5]=2 < 4$ → $LDS[5]=1$ | $1 + 1 =$ **2** |
| 3 | 5 | $j=4$: 2, $j=5$: 1 → max = 2 | $1 + 2 =$ **3** |
| 2 | 3 | $j=5$: $a[5]=2 < 3$ → $LDS[5]=1$ | $1 + 1 =$ **2** |
| 1 | 1 | Không có | **1** |

**Bảng tổng hợp:**

| $i$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $a[i]$ | 1 | 3 | 5 | 4 | 2 |
| $LIS[i]$ | 1 | 2 | **3** | 3 | 2 |
| $LDS[i]$ | 1 | 2 | **3** | 2 | 1 |
| $LIS + LDS - 1$ | 1 | 3 | **5** | 4 | 2 |
| $2 \times \min - 1$ | 1 | 3 | **5** | 3 | 1 |

**Đỉnh tối ưu:** $i = 3$ ($a[3] = 5$), $\min(LIS[3], LDS[3]) = \min(3, 3) = 3$, tổng = $2 \times 3 - 1 = 5$ (lẻ ✓).

**Lưu ý:** Tại $i = 4$: $LIS[4] = 3, LDS[4] = 2$ → $\min = 2$ → tổng = $2 \times 2 - 1 = 3$. Dù $LIS + LDS - 1 = 4$, ta chỉ được lấy $3$ vì phần tăng và phần giảm phải cùng độ dài.

**Truy vết:** Dãy kết quả = `1, 3, 5, 4, 2`.

---

### 💡 4. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">DayConTangGiam_N2</span>(<span class="var">a</span>[], <span class="var">n</span>):
    <span class="com">// Bước 1: Tính LIS (trái → phải)</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="var">n</span>:
        <span class="var">LIS</span>[<span class="var">i</span>] = <span class="val">1</span>
        <span class="kw">CHO</span> <span class="var">j</span> = <span class="val">1</span> đến <span class="var">i</span> - <span class="val">1</span>:
            <span class="kw">NẾU</span> <span class="var">a</span>[<span class="var">j</span>] < <span class="var">a</span>[<span class="var">i</span>] <span class="kw">VÀ</span> <span class="var">LIS</span>[<span class="var">j</span>] + <span class="val">1</span> > <span class="var">LIS</span>[<span class="var">i</span>]:
                <span class="var">LIS</span>[<span class="var">i</span>] = <span class="var">LIS</span>[<span class="var">j</span>] + <span class="val">1</span>
                <span class="var">prevLIS</span>[<span class="var">i</span>] = <span class="var">j</span>    <span class="com">// Lưu vết</span>

    <span class="com">// Bước 2: Tính LDS (phải → trái)</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="var">n</span> xuống <span class="val">1</span>:
        <span class="var">LDS</span>[<span class="var">i</span>] = <span class="val">1</span>
        <span class="kw">CHO</span> <span class="var">j</span> = <span class="var">n</span> xuống <span class="var">i</span> + <span class="val">1</span>:
            <span class="kw">NẾU</span> <span class="var">a</span>[<span class="var">j</span>] < <span class="var">a</span>[<span class="var">i</span>] <span class="kw">VÀ</span> <span class="var">LDS</span>[<span class="var">j</span>] + <span class="val">1</span> > <span class="var">LDS</span>[<span class="var">i</span>]:
                <span class="var">LDS</span>[<span class="var">i</span>] = <span class="var">LDS</span>[<span class="var">j</span>] + <span class="val">1</span>
                <span class="var">nextLDS</span>[<span class="var">i</span>] = <span class="var">j</span>    <span class="com">// Lưu vết</span>

    <span class="com">// Bước 3: Tìm đỉnh tối ưu</span>
    <span class="var">best</span> = <span class="val">0</span>, <span class="var">peak</span> = <span class="val">-1</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="var">n</span>:
        <span class="com">// Đảm bảo có cả tăng và giảm</span>
        <span class="kw">NẾU</span> <span class="var">LIS</span>[<span class="var">i</span>] >= <span class="val">2</span> <span class="kw">VÀ</span> <span class="var">LDS</span>[<span class="var">i</span>] >= <span class="val">2</span>:
            <span class="com">// Phần tăng = phần giảm = min(LIS, LDS)</span>
            <span class="var">k1</span> = <span class="fn">Min</span>(<span class="var">LIS</span>[<span class="var">i</span>], <span class="var">LDS</span>[<span class="var">i</span>])
            <span class="var">len</span> = <span class="val">2</span> * <span class="var">k1</span> - <span class="val">1</span>
            <span class="kw">NẾU</span> <span class="var">len</span> > <span class="var">best</span>:
                <span class="var">best</span> = <span class="var">len</span>
                <span class="var">peak</span> = <span class="var">i</span>

    <span class="kw">TRẢ VỀ</span> <span class="var">best</span>, <span class="var">peak</span>
</pre>

**Độ phức tạp:** $O(n^2)$ thời gian, $O(n)$ bộ nhớ.

</div>

<!-- ============================================================ -->
<!-- SUBTASK 2: DP O(n log n) -->
<!-- ============================================================ -->
<div class="step-card border-green">
<div class="step-badge bg-green">Subtask 2 — DP tối ưu O(n log n)</div>

### 🎯 Bước 1: Ý nghĩa và cải tiến

Thuật toán $O(n^2)$ chậm vì phải duyệt lại tất cả $j < i$. Ta có thể cải tiến bằng kỹ thuật **Patience Sorting** (LIS bằng tìm kiếm nhị phân).

**Ý tưởng cốt lõi:** Duy trì mảng `tails[]` — trong đó `tails[k]` là **giá trị nhỏ nhất** có thể kết thúc dãy tăng độ dài $k$.

<div class="math-formula">
$tails[k]$ = Giá trị cuối nhỏ nhất của mọi dãy tăng có độ dài $k$
<div class="formula-notes">

* Mảng `tails` luôn **tăng nghiêm ngặt**.
* Với mỗi $a[i]$ mới, dùng **binary search** để tìm vị trí chèn → $O(\log n)$ mỗi phần tử.
* $LIS[i]$ = vị trí chèn + 1.
</div>
</div>

**Bài toán cơ sở:** `tails` ban đầu rỗng.

---

### 🔄 Bước 2: Công thức / Thuật toán

**Tính LIS[i] bằng binary search:**

Với mỗi phần tử $a[i]$:
1. Dùng `lower_bound` trên `tails` tìm vị trí $pos$ — vị trí đầu tiên mà $tails[pos] \ge a[i]$.
2. Nếu $pos$ = cuối mảng → thêm $a[i]$ vào cuối (dãy dài hơn).
3. Ngược lại → thay thế $tails[pos] = a[i]$ (cải thiện khả năng mở rộng).
4. $LIS[i] = pos + 1$.

**Tính LDS[i]:** Duyệt mảng **ngược** từ $n$ về $1$, áp dụng cùng thuật toán.

**Tìm đáp án:** Giống Subtask 1, duyệt tìm đỉnh tối ưu.

---

### 📊 Bước 3: Lập bảng kiểm chứng

**Ví dụ:** Dãy $a = [1, 3, 5, 4, 2]$.

**Tính LIS bằng binary search (trái → phải):**

| Bước | $a[i]$ | `tails` trước | Binary search | Thao tác | `tails` sau | $LIS[i]$ |
|---|---|---|---|---|---|---|
| $i=1$ | 1 | `[]` | rỗng → thêm | append 1 | `[1]` | **1** |
| $i=2$ | 3 | `[1]` | $3 > 1$ → thêm | append 3 | `[1, 3]` | **2** |
| $i=3$ | 5 | `[1, 3]` | $5 > 3$ → thêm | append 5 | `[1, 3, 5]` | **3** |
| $i=4$ | 4 | `[1, 3, 5]` | lower_bound(4) → pos=2 | thay tails[2]=4 | `[1, 3, 4]` | **3** |
| $i=5$ | 2 | `[1, 3, 4]` | lower_bound(2) → pos=1 | thay tails[1]=2 | `[1, 2, 4]` | **2** |

**Tính LDS bằng binary search (phải → trái):**

| Bước | $a[i]$ | `tails` trước | Thao tác | `tails` sau | $LDS[i]$ |
|---|---|---|---|---|---|
| $i=5$ | 2 | `[]` | append 2 | `[2]` | **1** |
| $i=4$ | 4 | `[2]` | $4 > 2$ → append | `[2, 4]` | **2** |
| $i=3$ | 5 | `[2, 4]` | $5 > 4$ → append | `[2, 4, 5]` | **3** |
| $i=2$ | 3 | `[2, 4, 5]` | lower_bound(3) → pos=1 | thay → `[2, 3, 5]` | **2** |
| $i=1$ | 1 | `[2, 3, 5]` | lower_bound(1) → pos=0 | thay → `[1, 3, 5]` | **1** |

**Kết quả giống Subtask 1:** LIS = `[1,2,3,3,2]`, LDS = `[1,2,3,2,1]`. Đỉnh tại $i=3$: $\min(3, 3) = 3$, tổng = $2 \times 3 - 1 = 5$ ✓.

---

### 💡 4. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">TinhLIS_NlogN</span>(<span class="var">a</span>[], <span class="var">n</span>):
    <span class="var">tails</span> = [] <span class="com">// Mảng rỗng ban đầu</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="var">n</span>:
        <span class="var">pos</span> = <span class="fn">LowerBound</span>(<span class="var">tails</span>, <span class="var">a</span>[<span class="var">i</span>])
        <span class="kw">NẾU</span> <span class="var">pos</span> == <span class="fn">Len</span>(<span class="var">tails</span>):
            <span class="fn">ThêmCuối</span>(<span class="var">tails</span>, <span class="var">a</span>[<span class="var">i</span>])
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">tails</span>[<span class="var">pos</span>] = <span class="var">a</span>[<span class="var">i</span>]
        <span class="var">LIS</span>[<span class="var">i</span>] = <span class="var">pos</span> + <span class="val">1</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">LIS</span>

<span class="kw">HÀM</span> <span class="fn">TinhLDS_NlogN</span>(<span class="var">a</span>[], <span class="var">n</span>):
    <span class="var">tails</span> = []
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="var">n</span> xuống <span class="val">1</span>:
        <span class="var">pos</span> = <span class="fn">LowerBound</span>(<span class="var">tails</span>, <span class="var">a</span>[<span class="var">i</span>])
        <span class="kw">NẾU</span> <span class="var">pos</span> == <span class="fn">Len</span>(<span class="var">tails</span>):
            <span class="fn">ThêmCuối</span>(<span class="var">tails</span>, <span class="var">a</span>[<span class="var">i</span>])
        <span class="kw">NGƯỢC LẠI</span>:
            <span class="var">tails</span>[<span class="var">pos</span>] = <span class="var">a</span>[<span class="var">i</span>]
        <span class="var">LDS</span>[<span class="var">i</span>] = <span class="var">pos</span> + <span class="val">1</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">LDS</span>

<span class="kw">HÀM</span> <span class="fn">DayConTangGiam_NlogN</span>(<span class="var">a</span>[], <span class="var">n</span>):
    <span class="var">LIS</span> = <span class="fn">TinhLIS_NlogN</span>(<span class="var">a</span>, <span class="var">n</span>)
    <span class="var">LDS</span> = <span class="fn">TinhLDS_NlogN</span>(<span class="var">a</span>, <span class="var">n</span>)
    <span class="var">best</span> = <span class="val">0</span>, <span class="var">peak</span> = <span class="val">-1</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="var">n</span>:
        <span class="kw">NẾU</span> <span class="var">LIS</span>[<span class="var">i</span>] >= <span class="val">2</span> <span class="kw">VÀ</span> <span class="var">LDS</span>[<span class="var">i</span>] >= <span class="val">2</span>:
            <span class="var">k1</span> = <span class="fn">Min</span>(<span class="var">LIS</span>[<span class="var">i</span>], <span class="var">LDS</span>[<span class="var">i</span>])
            <span class="var">len</span> = <span class="val">2</span> * <span class="var">k1</span> - <span class="val">1</span>
            <span class="kw">NẾU</span> <span class="var">len</span> > <span class="var">best</span>:
                <span class="var">best</span> = <span class="var">len</span>, <span class="var">peak</span> = <span class="var">i</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">best</span>, <span class="var">peak</span>
</pre>

**Độ phức tạp:** $O(n \log n)$ thời gian, $O(n)$ bộ nhớ.

</div>
