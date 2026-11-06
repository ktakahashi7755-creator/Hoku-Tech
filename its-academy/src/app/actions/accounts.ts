"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth/dal";
import { hashPassword } from "@/lib/auth/password";
import { ADMIN_ROLES, canAssignRole, canManageAccount } from "@/lib/auth/roles";
import { revokeAllSessions } from "@/lib/auth/session";

export type AccountState = { ok?: string; error?: string; tempPassword?: string } | undefined;

const RoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"]);

async function loadTarget(actor: { id: string; role: Role }, userId: string) {
  const target = await db.user.findUnique({ where: { id: z.cuid().parse(userId) }, select: { id: true, role: true, name: true } });
  if (!target) return { error: "アカウントが見つかりません。" } as const;
  if (!canManageAccount(actor, target)) return { error: "このアカウントは操作できません (自分自身、または自分と同じか上位の権限)。" } as const;
  return { target } as const;
}

export async function changeRole(userId: string, newRole: string): Promise<AccountState> {
  const actor = await requireUser(ADMIN_ROLES);
  const role = RoleSchema.parse(newRole);
  const r = await loadTarget(actor, userId);
  if ("error" in r) return { error: r.error };
  if (!canAssignRole(actor.role, role)) return { error: "その権限は付与できません。" };
  if (r.target.role === role) return { ok: "変更はありません。" };
  await db.user.update({ where: { id: r.target.id }, data: { role } });
  // 権限が変わったので、相手のセッションを無効化して再ログインさせる
  await revokeAllSessions(r.target.id);
  await audit({ actorId: actor.id, action: "user.role_change", targetType: "user", targetId: r.target.id, metadata: { from: r.target.role, to: role } });
  revalidatePath("/admin/users");
  return { ok: `${r.target.name} さんの権限を変更しました。` };
}

/** 仮パスワードを発行する (メール送信の仕組みがないため、画面に一度だけ表示する) */
export async function issueTemporaryPassword(userId: string): Promise<AccountState> {
  const actor = await requireUser(ADMIN_ROLES);
  const r = await loadTarget(actor, userId);
  if ("error" in r) return { error: r.error };
  const tempPassword = randomBytes(12).toString("base64url");
  await db.user.update({ where: { id: r.target.id }, data: { passwordHash: await hashPassword(tempPassword), mustChangePassword: true } });
  await revokeAllSessions(r.target.id);
  await audit({ actorId: actor.id, action: "user.temporary_password", targetType: "user", targetId: r.target.id });
  return { ok: `${r.target.name} さんの仮パスワードを発行しました。`, tempPassword };
}

export async function setActive(userId: string, active: boolean): Promise<AccountState> {
  const actor = await requireUser(ADMIN_ROLES);
  const r = await loadTarget(actor, userId);
  if ("error" in r) return { error: r.error };
  await db.user.update({ where: { id: r.target.id }, data: { isActive: z.boolean().parse(active) } });
  if (!active) await revokeAllSessions(r.target.id);
  await audit({ actorId: actor.id, action: active ? "user.activate" : "user.deactivate", targetType: "user", targetId: r.target.id });
  revalidatePath("/admin/users");
  return { ok: active ? "利用を再開しました。" : "利用を停止しました (ログイン中の端末もログアウトされます)。" };
}

/** 期限切れのセッションと、30 日より古いログイン試行の記録を削除する */
export async function cleanupStaleRecords(): Promise<AccountState> {
  const actor = await requireUser(ADMIN_ROLES);
  const [sessions, attempts] = await Promise.all([
    db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    db.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
  ]);
  await audit({ actorId: actor.id, action: "maintenance.cleanup", metadata: { sessions: sessions.count, loginAttempts: attempts.count } });
  revalidatePath("/admin/settings");
  return { ok: `期限切れのセッション ${sessions.count} 件、古いログイン試行 ${attempts.count} 件を削除しました。` };
}
