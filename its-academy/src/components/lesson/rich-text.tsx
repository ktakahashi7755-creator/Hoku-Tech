/** 改行区切りのプレーンテキストを段落として表示する。HTML は解釈しない (XSS 対策) */
export function RichText({ text }: { text: string }) {
  return (
    <div className="prose-lesson">
      {text.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}
