import "server-only";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import { generateSessionToken, hashSessionToken } from "./token";

export const SESSION_COOKIE = "its_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 日
const RENEW_THRESHOLD_MS = 1000 * 60 * 60 * 24; // 残り 1 日を切ったら延長
const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 延長を続けても、ログインから 30 日で再ログインを求める

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  await db.session.create({
    data: { tokenHash: hashSessionToken(token), userId, expiresAt, userAgent },
  });
  // Cookie は最長期間 (30 日) まで保持する。7 日使わなければ DB 側の期限 (expiresAt) で無効になり、
  // 使い続けている間は DB 側で延長する (画面の描画中は Cookie を書き換えられないため、期限の管理は DB で行う)
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(new Date(Date.now() + MAX_SESSION_AGE_MS)));
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: import("@prisma/client").Role;
  mustChangePassword: boolean;
};

/** Cookie のトークンを検証し、有効ならユーザーを返す。期限切れ・無効ユーザーは null */
export async function validateSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: { select: { id: true, name: true, email: true, role: true, isActive: true, mustChangePassword: true } } },
  });
  if (!session) return null;
  const now = Date.now();
  if (session.expiresAt.getTime() <= now || now - session.createdAt.getTime() > MAX_SESSION_AGE_MS || !session.user.isActive) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (session.expiresAt.getTime() - now < RENEW_THRESHOLD_MS) {
    await db.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(now + SESSION_TTL_MS), lastSeenAt: new Date() },
    });
  }
  const { isActive: _active, ...user } = session.user;
  void _active;
  return user;
}

export async function deleteCurrentSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
  }
  jar.delete(SESSION_COOKIE);
}

/** パスワード変更・アカウント停止時に全端末のセッションを無効化する */
export async function revokeAllSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } });
}
