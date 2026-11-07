import "server-only";
import { db } from "@/lib/db";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 30;

/**
 * ログインの試行を始める。照合の前に「失敗」として記録してから、直近 15 分の失敗を数える
 * (先に数えて後で記録すると、同時に大量に送られた試行がすべて上限の前の回数を見て、上限を超えて照合されるため)。
 * 上限を超えていれば記録を消して null を返す (待っている間に試しても、待ち時間が延びないように)。
 * 照合に成功したら finishLoginAttempt で成功に直す。
 */
export async function startLoginAttempt(email: string, ip: string | null): Promise<{ id: string } | null> {
  const attempt = await db.loginAttempt.create({ data: { email, ip, success: false }, select: { id: true } });
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [byEmail, byIp] = await Promise.all([
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    ip ? db.loginAttempt.count({ where: { ip, success: false, createdAt: { gte: since } } }) : 0,
  ]);
  if (byEmail > MAX_FAILS_PER_EMAIL || byIp > MAX_FAILS_PER_IP) {
    await db.loginAttempt.delete({ where: { id: attempt.id } });
    return null;
  }
  return attempt;
}

/** 照合に成功した試行を成功に直す (失敗の回数に数えない) */
export async function finishLoginAttempt(attempt: { id: string }): Promise<void> {
  await db.loginAttempt.update({ where: { id: attempt.id }, data: { success: true } });
}
