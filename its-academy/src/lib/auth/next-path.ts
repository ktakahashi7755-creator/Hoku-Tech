/**
 * ログイン後に戻る先 (?next=)。このアプリの中のパスだけを受け付ける (外部サイトへの転送に使われないように)。
 */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 300) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value === "/login" || value.startsWith("/login?") || value.startsWith("/api/")) return null;
  return /^[A-Za-z0-9/_\-.?=&%]+$/.test(value) ? value : null;
}
