// 要素を取得する
const form = document.querySelector("#search-form");
const input = document.querySelector("#q");
const error = document.querySelector("#error");
const status = document.querySelector("#status");
const results = document.querySelector("#results");

// 入力チェック (画面側)。サーバー側でも必ず同じチェックをする
function validate(text) {
  const q = text.trim();
  if (q.length === 0) return "タイトルを入力してください";
  if (q.length > 50) return "50 文字以内で入力してください";
  return "";
}

// 一覧を表示する。textContent を使うので、本のタイトルに HTML が含まれていても文字として表示される
function render(books) {
  results.replaceChildren(); // 前の結果を消す
  for (const book of books) {
    const li = document.createElement("li");
    li.textContent = `${book.title} (${book.author})`;
    results.append(li);
  }
  status.textContent = `${books.length} 件見つかりました`;
}

// 送信されたら API を呼ぶ
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // ページの再読み込みを止める
  const message = validate(input.value);
  error.textContent = message;
  if (message) return;

  status.textContent = "検索しています…";
  try {
    // 入力値は encodeURIComponent でエンコードしてから URL に入れる
    const res = await fetch(`/api/books?title=${encodeURIComponent(input.value.trim())}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    render(await res.json());
  } catch (e) {
    results.replaceChildren();
    status.textContent = `検索に失敗しました (${e.message})`;
  }
});
