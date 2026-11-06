/**
 * 行単位の差分 (最長共通部分列)。CMS で版どうしの変更点を表示するために使う。純粋関数。
 */
export type DiffLine = { type: "same" | "added" | "removed"; text: string };

export function lineDiff(before: string[], after: string[]): DiffLine[] {
  const n = before.length;
  const m = after.length;
  // lcs[i][j] = before[i..] と after[j..] の最長共通部分列の長さ
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = before[i] === after[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (before[i] === after[j]) {
      out.push({ type: "same", text: before[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ type: "removed", text: before[i++] });
    } else {
      out.push({ type: "added", text: after[j++] });
    }
  }
  while (i < n) out.push({ type: "removed", text: before[i++] });
  while (j < m) out.push({ type: "added", text: after[j++] });
  return out;
}

/** レッスンの版を、差分表示用の読みやすい行に変換する */
export function lessonToLines(v: { title: string; estimatedMinutes: number; content: unknown }): string[] {
  const c = v.content as Record<string, unknown>;
  const lines: string[] = [`タイトル: ${v.title}`, `学習目安時間: ${v.estimatedMinutes} 分`];
  const push = (label: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string") {
      lines.push(`[${label}]`, ...value.split("\n"));
    } else if (Array.isArray(value)) {
      lines.push(`[${label}]`);
      value.forEach((item) => {
        if (typeof item === "string") lines.push(`- ${item}`);
        else lines.push(...Object.entries(item as Record<string, unknown>).flatMap(([k, val]) => `${k}: ${String(val)}`.split("\n")));
      });
    } else if (typeof value === "object") {
      lines.push(`[${label}]`, ...JSON.stringify(value, null, 1).split("\n"));
    }
  };
  if (c && "editorDraft" in c) {
    lines.push("(下書き: 入力途中のため、保存されたフォームの内容を表示)");
    push("下書き", (c as { editorDraft: unknown }).editorDraft);
    return lines;
  }
  for (const [key, label] of [
    ["objectives", "できるようになること"], ["prerequisites", "前提知識"], ["explanation", "概念の解説"], ["examples", "図解・具体例"],
    ["code", "サンプルコード"], ["exercises", "演習"], ["quiz", "理解度チェック"], ["workplaceUse", "実務での利用場面"],
    ["commonErrors", "よくあるエラー"], ["reviewPoints", "復習ポイント"], ["videoUrl", "動画"],
  ] as const) {
    push(label, c?.[key]);
  }
  return lines;
}
