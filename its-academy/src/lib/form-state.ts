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
