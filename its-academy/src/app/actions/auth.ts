"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit, clientIp } from "@/lib/audit";
import { hashPassword, PASSWORD_MIN_LENGTH, verifyPassword } from "@/lib/auth/password";
import { isLoginThrottled, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { createSession, deleteCurrentSession, revokeAllSessions } from "@/lib/auth/session";
import { requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: string } | undefined;

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("メールアドレスの形式で入力してください").max(254),
  password: z.string().min(1, "パスワードを入力してください").max(256),
});

// ユーザーが存在しない場合も同じ時間がかかるよう、ダミーのハッシュと照合する
let dummyHash: Promise<string> | null = null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  }
  const { email, password } = parsed.data;
  const ip = await clientIp();

  if (await isLoginThrottled(email, ip)) {
    return { error: "ログインの試行回数が上限に達しました。15 分ほど待ってから再度お試しください。" };
  }

  const user = await db.user.findUnique({ where: { email } });
  dummyHash ??= hashPassword("dummy-password-for-timing");
  const valid = user ? await verifyPassword(user.passwordHash, password) : (await verifyPassword(await dummyHash, password), false);

  if (!user || !valid || !user.isActive) {
    await recordLoginAttempt(email, ip, false);
    await audit({ actorId: user?.id ?? null, action: "auth.login_failed" });
    // どちらが間違っているかは伝えない (アカウントの存在を推測されないため)
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  await recordLoginAttempt(email, ip, true);
  await createSession(user.id);
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await audit({ actorId: user.id, action: "auth.login" });
  // 期限切れのセッションをこのタイミングで片付ける
  await db.session.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });
  if (user.mustChangePassword) redirect("/me?changePassword=1");
  redirect(isStaff(user.role) ? "/admin" : "/home");
}

export async function logout(): Promise<void> {
  const user = await requireUser();
  await deleteCurrentSession();
  await audit({ actorId: user.id, action: "auth.logout" });
  redirect("/login");
}

const PasswordSchema = z
  .object({
    current: z.string().min(1, "現在のパスワードを入力してください"),
    next: z.string().min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH} 文字以上にしてください`).max(256),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "確認用のパスワードが一致しません" });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireUser();
  const parsed = PasswordSchema.safeParse({ current: formData.get("current"), next: formData.get("next"), confirm: formData.get("confirm") });
  if (!parsed.success) {
    return { fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  }
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await verifyPassword(user.passwordHash, parsed.data.current))) {
    return { fieldErrors: { current: "現在のパスワードが正しくありません" } };
  }
  if (parsed.data.next === parsed.data.current) {
    return { fieldErrors: { next: "現在のパスワードと違うパスワードにしてください" } };
  }
  await db.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(parsed.data.next), mustChangePassword: false } });
  // 他の端末のセッションを無効化し、この端末は新しいセッションで継続する
  await revokeAllSessions(me.id);
  await createSession(me.id);
  await audit({ actorId: me.id, action: "auth.password_changed" });
  return { ok: "パスワードを変更しました。ほかの端末ではログアウトされました。" };
}
