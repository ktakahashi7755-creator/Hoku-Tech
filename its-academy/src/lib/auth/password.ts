import { randomBytes } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

// OWASP Password Storage Cheat Sheet の argon2id 推奨値 (m=19MiB, t=2, p=1)
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export const PASSWORD_MIN_LENGTH = 12;

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTIONS);
}

export async function verifyPassword(stored: string, plain: string): Promise<boolean> {
  try {
    return await verify(stored, plain);
  } catch {
    return false;
  }
}

/** 管理者が発行する仮パスワード・初期パスワード (16 文字の URL 安全な文字列)。初回ログインで変更を求める */
export function generateTempPassword(): string {
  return randomBytes(12).toString("base64url");
}
