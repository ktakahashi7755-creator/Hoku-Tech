import type { z } from "zod";

/**
 * サーバーアクションがフォームに返す結果。
 * error: フォーム全体のエラー / fieldErrors: 入力欄ごとのエラー / ok: 成功のメッセージ /
 * values: エラー時に入力欄へ戻す値 (パスワードは含めない)
 */
export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: string; values?: Record<string, string> } | undefined;

/** zod の検証エラーを、入力欄ごとのエラーに変換する (同じ欄に複数あれば最初の 1 件) */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    out[key] ??= issue.message;
  }
  return out;
}

/**
 * 入力の形 (長さの上限・件数の上限など) の検証エラーを、画面に出せる文の一覧にする。
 * 例外で画面ごと落とすと、編集中の内容が失われるため、メッセージとして返す。
 */
export function shapeErrors(error: z.ZodError): string[] {
  return error.issues.slice(0, 5).map((i) => {
    const where = i.path.length ? `${i.path.join(" > ")}: ` : "";
    if (i.code === "too_big") return `${where}長すぎるか、項目が多すぎます (上限 ${"maximum" in i ? String(i.maximum) : ""})`;
    return `${where}${i.message}`;
  });
}
