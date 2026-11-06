"use client";

/** ルートのレイアウト自体が表示できないときの画面 (ここではアプリのスタイルを読み込めない場合がある) */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "4rem 1rem", textAlign: "center", background: "#fff", color: "#111" }}>
        <h1 style={{ fontSize: "1.5rem" }}>画面を表示できませんでした</h1>
        <p>時間をおいて再度お試しください。続く場合は、担当講師または管理者に連絡してください。</p>
        {error.digest && <p style={{ fontSize: "0.75rem", color: "#555" }}>問い合わせ番号: {error.digest}</p>}
        <button type="button" onClick={reset} style={{ minHeight: 44, padding: "0 1rem", marginTop: "1rem" }}>
          もう一度試す
        </button>
      </body>
    </html>
  );
}
