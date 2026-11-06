import { createHash, randomBytes } from "node:crypto";

/** 256bit のランダムトークン (Cookie に入れる値) */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** DB には生トークンではなく SHA-256 ハッシュだけを保存する */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
