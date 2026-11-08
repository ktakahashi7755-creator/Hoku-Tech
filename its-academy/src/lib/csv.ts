/**
 * CSV の 1 セル。Excel で開いたときの数式実行 (CSV インジェクション) を防ぐため、
 * 先頭の空白を除いた最初の文字が = + - @ (全角を含む)、またはタブ・改行で始まる値は先頭に ' を付ける。
 */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[\t\r\n]/.test(s) || /^[\s\u3000]*[=+\-@＝＋－＠]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: unknown[][]): string {
  // BOM 付き UTF-8 (Excel で文字化けしないように)
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
