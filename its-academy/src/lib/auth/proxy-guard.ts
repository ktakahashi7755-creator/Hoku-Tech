/**
 * proxy.ts から呼ぶ、ページ描画前のロール確認。
 * ページの描画 (ストリーミング) が始まると HTTP ステータスを変えられないため、
 * 権限が必要なエリアはここで判定し、権限がなければ本当の 404 を返す。
 * ページ側の requireUser() による確認も残す (二重の防御)。
 */
import { db } from "@/lib/db-core";
import { hashSessionToken } from "./token";
import { requiredRoles } from "./proxy-rules";

export type GuardResult = "allow" | "login" | "not_found";

export async function guard(pathname: string, token: string | undefined): Promise<GuardResult> {
  const roles = requiredRoles(pathname);
  if (!roles) return "allow";
  if (!token) return "login";
  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    select: { expiresAt: true, user: { select: { role: true, isActive: true } } },
  });
  if (!session || session.expiresAt.getTime() <= Date.now() || !session.user.isActive) return "login";
  return roles.includes(session.user.role) ? "allow" : "not_found";
}
