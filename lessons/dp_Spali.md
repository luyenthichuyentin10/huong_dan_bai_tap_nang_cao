## 🪞 Bài BTNC104: Chuỗi đối xứng (Longest Palindromic Substring)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Đề bài</div>

Một chuỗi được gọi là **đối xứng (Palindrome)** nếu khi đọc chuỗi này từ phải qua trái cũng chính là chuỗi ban đầu.

Cho một chuỗi $s$, bằng cách **xóa đi một số ký tự** trong chuỗi $s$ để thu được một chuỗi mới là chuỗi đối xứng **dài nhất**.

### Input
- Cho chuỗi $s$.

### Ràng buộc
- **Subtask 1 (50%):** $0 < n \le 100$
- **Subtask 2 (50%):** $0 < n \le 10^6$

### Output
- Ghi ra chuỗi con đối xứng dài nhất tìm được.

### Sample Input
```
babad
```

### Sample Output
```
bab
```

### Giải thích
Chuỗi gốc: `babad` (độ dài 5).

Các chuỗi con (liên tiếp) đối xứng: `bab` (vị trí 1–3, dài 3), `aba` (vị trí 2–4, dài 3).

Đáp án: `bab` (hoặc `aba`, cả hai đều dài 3).

### Subtask
- **Subtask 1 (50%):** $n \le 100$ → Vét cạn hoặc DP $O(n^2)$.
- **Subtask 2 (50%):** $n \le 10^6$ → Thuật toán Manacher $O(n)$.
</div>

<!-- ============================================================ -->
<!-- PHẦN PHÂN TÍCH ĐỀ BÀI -->
<!-- ============================================================ -->
<div class="step-card border-yellow">
<div class="step-badge bg-yellow">Phân tích đề bài</div>

### 🔍 1. Các thông tin trọng tâm
* Tìm **chuỗi con liên tiếp** (substring) dài nhất mà đọc xuôi = đọc ngược.
* Đây là bài **Longest Palindromic Substring** — bài kinh điển.
* Palindrome có 2 dạng:
    * **Dạng lẻ:** Có tâm là 1 ký tự, mở rộng đối xứng hai bên. Ví dụ: `aba`, `racecar`.
    * **Dạng chẵn:** Có tâm là khe giữa 2 ký tự. Ví dụ: `abba`, `noon`.

<div class="important-note">
<b>💡 Ý tưởng cốt lõi — Mở rộng từ tâm:</b> Mọi palindrome đều có một "tâm". Ta có thể thử từng vị trí làm tâm, rồi mở rộng sang hai bên cho đến khi hai ký tự đối xứng khác nhau. Có $2n - 1$ vị trí tâm có thể ($n$ tâm lẻ + $n - 1$ tâm chẵn).
</div>

### 📋 2. Giải thích Ví dụ mẫu

Chuỗi: `babad`

| Tâm | Loại | Mở rộng | Palindrome | Dài |
|---|---|---|---|---|
| b (vị trí 1) | Lẻ | Không mở rộng được | `b` | 1 |
| a (vị trí 2) | Lẻ | b**a**b → 2 bên giống | `bab` | **3** |
| b (vị trí 3) | Lẻ | a**b**a → 2 bên giống | `aba` | **3** |
| a (vị trí 4) | Lẻ | b**a**d → 2 bên khác | `a` | 1 |
| d (vị trí 5) | Lẻ | Không mở rộng được | `d` | 1 |
| khe 1-2 | Chẵn | b≠a → dừng | — | 0 |
| khe 2-3 | Chẵn | a≠b → dừng | — | 0 |
| khe 3-4 | Chẵn | b≠a → dừng | — | 0 |
| khe 4-5 | Chẵn | a≠d → dừng | — | 0 |

Palindrome dài nhất: `bab` hoặc `aba` (dài 3).

### 📋 3. Ví dụ thêm

Chuỗi: `lmevxveyzl`

| Tâm | Palindrome |
|---|---|
| x (vị trí 5) | e**v**x**v**e → mở rộng: `evxve` (dài 5) ✓ |

Đáp án: `evxve`.

</div>

<!-- ============================================================ -->
<!-- VÉT CẠN -->
<!-- ============================================================ -->
<div class="step-card border-red">
<div class="step-badge bg-red">Phương pháp Vét cạn</div>

### 💡 1. Ý tưởng
Duyệt tất cả cặp $(i, j)$ với $1 \le i \le j \le n$, kiểm tra $s[i..j]$ có phải palindrome không, lấy chuỗi dài nhất.

### 💡 2. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">VetCan</span>(<span class="var">s</span>, <span class="var">n</span>):
    <span class="var">best</span> = <span class="val">""</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="var">n</span>:
        <span class="kw">CHO</span> <span class="var">j</span> = <span class="var">i</span> đến <span class="var">n</span>:
            <span class="kw">NẾU</span> <span class="fn">LaPalindrome</span>(<span class="var">s</span>[<span class="var">i</span>..<span class="var">j</span>]):
                <span class="kw">NẾU</span> <span class="var">j</span> - <span class="var">i</span> + <span class="val">1</span> > <span class="fn">Len</span>(<span class="var">best</span>):
                    <span class="var">best</span> = <span class="var">s</span>[<span class="var">i</span>..<span class="var">j</span>]
    <span class="kw">TRẢ VỀ</span> <span class="var">best</span>
</pre>

**Độ phức tạp:** $O(n^3)$ — Duyệt $O(n^2)$ cặp, kiểm tra palindrome $O(n)$.

</div>

<!-- ============================================================ -->
<!-- SUBTASK 1: EXPAND FROM CENTER / DP O(n²) -->
<!-- ============================================================ -->
<div class="step-card border-orange">
<div class="step-badge bg-orange">Subtask 1 — Mở rộng từ tâm O(n²)</div>

### 🎯 Bước 1: Ý nghĩa và Bài toán cơ sở

**Định nghĩa:**

<div class="math-formula">
$expand(c, type)$ = Palindrome dài nhất có tâm tại vị trí $c$
<div class="formula-notes">

* $type = lẻ$: Tâm là ký tự $s[c]$. Bắt đầu với palindrome dài 1.
* $type = chẵn$: Tâm là khe giữa $s[c]$ và $s[c+1]$. Bắt đầu với palindrome dài 0.
</div>
</div>

**Bài toán cơ sở:**
* Palindrome lẻ tại tâm $c$: bắt đầu $left = c$, $right = c$ (dài 1).
* Palindrome chẵn tại khe $c$: bắt đầu $left = c$, $right = c + 1$ (kiểm tra ngay).

---

### 🔄 Bước 2: Thuật toán mở rộng

Với mỗi tâm, lặp mở rộng:

<div class="math-formula">
Trong khi $left \ge 1$ và $right \le n$ và $s[left] = s[right]$:
<br>→ Ghi nhận palindrome $s[left..right]$, rồi $left--, right++$.
</div>

**Duyệt:** $n$ tâm lẻ + $(n-1)$ tâm chẵn = $2n - 1$ tâm.

**Mỗi tâm** mở rộng tối đa $O(n)$ bước → Tổng $O(n^2)$.

---

### 📊 Bước 3: Lập bảng kiểm chứng

**Ví dụ:** $s =$ `"cbbd"` ($n = 4$).

**Duyệt tâm lẻ:**

| Tâm | $s[c]$ | Mở rộng | Palindrome | Dài |
|---|---|---|---|---|
| 1 | c | c≠? (biên) | `c` | 1 |
| 2 | b | c≠b → dừng | `b` | 1 |
| 3 | b | b≠d → dừng | `b` | 1 |
| 4 | d | d≠? (biên) | `d` | 1 |

**Duyệt tâm chẵn:**

| Khe | $s[c], s[c+1]$ | So sánh | Mở rộng | Palindrome | Dài |
|---|---|---|---|---|---|
| 1–2 | c, b | c≠b | — | — | 0 |
| 2–3 | b, b | b=b ✓ | c≠d → dừng | `bb` | **2** |
| 3–4 | b, d | b≠d | — | — | 0 |

**Kết quả:** Palindrome dài nhất = `bb` (dài 2).

---

### 💡 4. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">MoRongTuTam</span>(<span class="var">s</span>, <span class="var">left</span>, <span class="var">right</span>):
    <span class="kw">LẶP KHI</span> <span class="var">left</span> >= <span class="val">0</span> <span class="kw">VÀ</span> <span class="var">right</span> < <span class="var">n</span> <span class="kw">VÀ</span> <span class="var">s</span>[<span class="var">left</span>] == <span class="var">s</span>[<span class="var">right</span>]:
        <span class="var">left</span> = <span class="var">left</span> - <span class="val">1</span>
        <span class="var">right</span> = <span class="var">right</span> + <span class="val">1</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">s</span>[<span class="var">left</span>+<span class="val">1</span> .. <span class="var">right</span>-<span class="val">1</span>]

<span class="kw">HÀM</span> <span class="fn">TimPalinDaiNhat</span>(<span class="var">s</span>, <span class="var">n</span>):
    <span class="var">best</span> = <span class="var">s</span>[<span class="val">0</span>]
    <span class="kw">CHO</span> <span class="var">c</span> = <span class="val">0</span> đến <span class="var">n</span> - <span class="val">1</span>:
        <span class="com">// Palindrome lẻ: tâm tại c</span>
        <span class="var">p1</span> = <span class="fn">MoRongTuTam</span>(<span class="var">s</span>, <span class="var">c</span>, <span class="var">c</span>)
        <span class="kw">NẾU</span> <span class="fn">Len</span>(<span class="var">p1</span>) > <span class="fn">Len</span>(<span class="var">best</span>): <span class="var">best</span> = <span class="var">p1</span>

        <span class="com">// Palindrome chẵn: tâm tại khe c, c+1</span>
        <span class="var">p2</span> = <span class="fn">MoRongTuTam</span>(<span class="var">s</span>, <span class="var">c</span>, <span class="var">c</span> + <span class="val">1</span>)
        <span class="kw">NẾU</span> <span class="fn">Len</span>(<span class="var">p2</span>) > <span class="fn">Len</span>(<span class="var">best</span>): <span class="var">best</span> = <span class="var">p2</span>

    <span class="kw">TRẢ VỀ</span> <span class="var">best</span>
</pre>

**Độ phức tạp:** $O(n^2)$ thời gian, $O(1)$ bộ nhớ phụ.

</div>

<!-- ============================================================ -->
<!-- SUBTASK 2: MANACHER O(n) -->
<!-- ============================================================ -->
<div class="step-card border-green">
<div class="step-badge bg-green">Subtask 2 — Thuật toán Manacher O(n)</div>

### 🎯 Bước 1: Ý nghĩa và Tiền xử lý

**Vấn đề:** Mở rộng từ tâm mất $O(n^2)$ vì mỗi tâm phải mở rộng từ đầu. Manacher tận dụng **tính đối xứng** của palindrome đã biết để bỏ qua nhiều bước.

**Tiền xử lý:** Chèn ký tự `#` giữa các ký tự để xử lý thống nhất cả palindrome lẻ và chẵn:

<div class="math-formula">
$s =$ `"abba"` → $t =$ `"^#a#b#b#a#$"`
<div class="formula-notes">

* `^` và `$` là ký tự canh biên (sentinel) để tránh kiểm tra biên.
* Mỗi palindrome (lẻ hoặc chẵn) trong $s$ đều trở thành palindrome **lẻ** trong $t$.
* Ví dụ: `bb` (chẵn) → `#b#b#` (lẻ, tâm tại `#` giữa).
</div>
</div>

**Định nghĩa:**

<div class="math-formula">
$P[i]$ = Bán kính palindrome lớn nhất có tâm tại vị trí $i$ trong chuỗi $t$
<div class="formula-notes">

* Palindrome tại $i$ trong $t$ là: $t[i - P[i] \;..\; i + P[i]]$.
* Độ dài palindrome tương ứng trong $s$ gốc: $P[i]$.
</div>
</div>

---

### 🔄 Bước 2: Công thức Manacher

Duy trì 2 biến: $C$ (tâm) và $R$ (biên phải) của palindrome **vươn xa nhất** bên phải đã biết.

**Với mỗi vị trí $i$:**

**Bước 2a — Tận dụng đối xứng:**

<div class="math-formula">
Nếu $i < R$: $P[i] = \min(R - i, \; P[2C - i])$
<div class="formula-notes">

* $2C - i$ là **vị trí gương** (mirror) của $i$ qua tâm $C$.
* $P[mirror]$ cho biết palindrome tại vị trí gương dài bao nhiêu.
* Lấy $\min$ với $R - i$ vì không thể vượt quá biên $R$ đã biết.
</div>
</div>

**Bước 2b — Mở rộng tiếp:**

Thử mở rộng palindrome tại $i$ vượt qua phần đã biết.

**Bước 2c — Cập nhật:**

Nếu $i + P[i] > R$, cập nhật $C = i$, $R = i + P[i]$.

---

### 📊 Bước 3: Lập bảng kiểm chứng

**Ví dụ:** $s =$ `"abba"` → $t =$ `"^#a#b#b#a#$"`.

| $i$ | $t[i]$ | Mirror | $P[i]$ khởi tạo | Mở rộng | $P[i]$ cuối | $C$ | $R$ | Palindrome trong $s$ |
|---|---|---|---|---|---|---|---|---|
| 1 | # | — | 0 | #≠^ → 0 | **0** | 1 | 1 | — |
| 2 | a | — | 0 | #=#, ^≠# → 0+1 | **1** | 2 | 3 | `a` |
| 3 | # | 1 | min(0,0)=0 | a≠# → 0 | **0** | 2 | 3 | — |
| 4 | b | 0 | 0 | #=#, a≠# → 0+1 | **1** | 4 | 5 | `b` |
| 5 | # | 3 | min(0,0)=0 | b=b → 1, #=#→ 2, a=a→ 3, #=#→ 4 | **4** | 5 | 9 | `abba` ✓ |
| 6 | b | 4 | min(3,1)=1 | a≠# → dừng | **1** | 5 | 9 | `b` |
| 7 | # | 3 | min(2,0)=0 | b≠a → dừng | **0** | 5 | 9 | — |
| 8 | a | 2 | min(1,1)=1 | ^≠# → dừng | **1** | 5 | 9 | `a` |
| 9 | # | 1 | min(0,0)=0 | a≠$ → dừng | **0** | 5 | 9 | — |

**Max:** $P[5] = 4$ → Palindrome dài 4 trong $s$ gốc, tại vị trí $start = (5 - 4) / 2 = 0$ → `abba` ✓.

---

### 💡 4. Mã giả

<pre class="pseudocode">
<span class="kw">HÀM</span> <span class="fn">Manacher</span>(<span class="var">s</span>, <span class="var">n</span>):
    <span class="com">// Bước 1: Chèn ký tự</span>
    <span class="var">t</span> = <span class="val">"^#"</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">0</span> đến <span class="var">n</span> - <span class="val">1</span>:
        <span class="var">t</span> += <span class="var">s</span>[<span class="var">i</span>] + <span class="val">"#"</span>
    <span class="var">t</span> += <span class="val">"$"</span>

    <span class="com">// Bước 2: Tính P[i]</span>
    <span class="var">C</span> = <span class="val">0</span>, <span class="var">R</span> = <span class="val">0</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="fn">Len</span>(<span class="var">t</span>) - <span class="val">2</span>:
        <span class="var">mirror</span> = <span class="val">2</span> * <span class="var">C</span> - <span class="var">i</span>
        <span class="kw">NẾU</span> <span class="var">i</span> < <span class="var">R</span>:
            <span class="var">P</span>[<span class="var">i</span>] = <span class="fn">Min</span>(<span class="var">R</span> - <span class="var">i</span>, <span class="var">P</span>[<span class="var">mirror</span>])
        <span class="com">// Mở rộng</span>
        <span class="kw">LẶP KHI</span> <span class="var">t</span>[<span class="var">i</span> + <span class="var">P</span>[<span class="var">i</span>] + <span class="val">1</span>] == <span class="var">t</span>[<span class="var">i</span> - <span class="var">P</span>[<span class="var">i</span>] - <span class="val">1</span>]:
            <span class="var">P</span>[<span class="var">i</span>]++
        <span class="com">// Cập nhật</span>
        <span class="kw">NẾU</span> <span class="var">i</span> + <span class="var">P</span>[<span class="var">i</span>] > <span class="var">R</span>:
            <span class="var">C</span> = <span class="var">i</span>, <span class="var">R</span> = <span class="var">i</span> + <span class="var">P</span>[<span class="var">i</span>]

    <span class="com">// Bước 3: Tìm max</span>
    <span class="var">maxLen</span> = <span class="val">0</span>, <span class="var">center</span> = <span class="val">0</span>
    <span class="kw">CHO</span> <span class="var">i</span> = <span class="val">1</span> đến <span class="fn">Len</span>(<span class="var">t</span>) - <span class="val">2</span>:
        <span class="kw">NẾU</span> <span class="var">P</span>[<span class="var">i</span>] > <span class="var">maxLen</span>:
            <span class="var">maxLen</span> = <span class="var">P</span>[<span class="var">i</span>], <span class="var">center</span> = <span class="var">i</span>

    <span class="var">start</span> = (<span class="var">center</span> - <span class="var">maxLen</span>) / <span class="val">2</span>
    <span class="kw">TRẢ VỀ</span> <span class="var">s</span>[<span class="var">start</span> .. <span class="var">start</span> + <span class="var">maxLen</span> - <span class="val">1</span>]
</pre>

**Độ phức tạp:** $O(n)$ thời gian, $O(n)$ bộ nhớ.

<div class="important-note">
<b>💡 Tại sao Manacher là O(n)?</b> Mặc dù có vòng lặp mở rộng bên trong, tổng số bước mở rộng qua tất cả các vị trí bị giới hạn bởi $R$ — mà $R$ chỉ tăng, không bao giờ giảm, và tối đa bằng $2n$. Nên tổng thời gian là $O(n)$.
</div>

</div>
