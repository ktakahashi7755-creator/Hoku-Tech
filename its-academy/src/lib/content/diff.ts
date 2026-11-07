import { editorStateOf } from "./draft";

/**
 * 行単位の差分 (最長共通部分列)。CMS で版どうしの変更点を表示するために使う。純粋関数。
 */
type DiffLine = { type: "same" | "added" | "removed"; text: string };

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

/**
 * レッスンの版を、差分表示用の読みやすい行に変換する。
 * 公開済みの版 (教材の形式) と下書き (編集画面の形式) を同じ形 (編集画面の項目) にそろえてから行にするため、
 * 実際に変えた箇所だけが差分に出る。
 */
export function lessonToLines(v: { title: string; estimatedMinutes: number; content: unknown }): string[] {
  let d: ReturnType<typeof editorStateOf>;
  try {
    d = editorStateOf(v);
  } catch {
    // 現在の形式で読めない古い版は、保存されている内容をそのまま行にする (差分の画面ごと落とさない)
    return [`タイトル: ${v.title}`, `学習目安時間: ${v.estimatedMinutes} 分`, "(古い形式の版のため、保存されている内容をそのまま表示)", ...JSON.stringify(v.content, null, 1).split("\n")];
  }
  const lines: string[] = [`タイトル: ${d.title}`, `学習目安時間: ${d.estimatedMinutes} 分`];
  if (d.videoUrl) lines.push(`解説動画: ${d.videoUrl}`);
  const text = (label: string, value: string) => {
    if (value.trim()) lines.push(`[${label}]`, ...value.split("\n"));
  };
  text("できるようになること", d.objectives);
  text("前提知識", d.prerequisites);
  d.explanation.forEach((e, i) => text(`概念の解説 ${i + 1}: ${e.heading}`, e.body));
  d.examples.forEach((e, i) => text(`図解・具体例 ${i + 1}: ${e.title}`, e.body));
  d.code.forEach((c, i) => {
    text(`サンプルコード ${i + 1}: ${c.filename || c.language}`, c.source);
    text(`サンプルコード ${i + 1} の実行結果`, c.output);
  });
  d.exercises.forEach((e, i) => {
    text(`演習 ${i + 1}: ${e.title}`, e.task);
    text(`演習 ${i + 1} のヒント`, e.hint);
    text(`演習 ${i + 1} の解答例`, e.answer);
  });
  lines.push(`[理解度チェック] 合格点 ${d.quiz.passScore} 点`);
  d.quiz.questions.forEach((q, i) => {
    lines.push(`問 ${i + 1}. ${q.question}`, ...q.choices.split("\n").map((c, ci) => `  ${ci === Number(q.answerIndex) ? "○" : "・"} ${c}`), `  解説: ${q.explanation}`);
  });
  text("実務での利用場面", d.workplaceUse);
  d.commonErrors.forEach((e, i) => {
    lines.push(`[よくあるエラー ${i + 1}] ${e.error}`, `原因: ${e.cause}`, `対処: ${e.fix}`);
  });
  text("復習ポイント", d.reviewPoints);
  return lines;
}
