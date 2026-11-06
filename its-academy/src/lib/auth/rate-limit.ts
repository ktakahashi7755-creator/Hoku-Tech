import "server-only";
import { db } from "@/lib/db";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 30;

/** 直近 15 分の失敗回数でログイン試行を制限する */
export async function isLoginThrottled(email: string, ip: string | null): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [byEmail, byIp] = await Promise.all([
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    ip ? db.loginAttempt.count({ where: { ip, success: false, createdAt: { gte: since } } }) : 0,
  ]);
  return byEmail >= MAX_FAILS_PER_EMAIL || byIp >= MAX_FAILS_PER_IP;
}

export async function recordLoginAttempt(email: string, ip: string | null, success: boolean) {
  await db.loginAttempt.create({ data: { email, ip, success } });
}
