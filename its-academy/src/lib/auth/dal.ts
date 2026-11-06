import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import type { Role } from "@prisma/client";
import { validateSession, type SessionUser } from "./session";

/** 1 リクエスト内で何度呼んでもセッション検証は 1 回 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  return validateSession();
});

/**
 * ログイン必須。roles を指定した場合はロールも検証する。
 * 権限不足は 404 として扱い、画面の存在自体を明かさない。
 */
export async function requireUser(roles?: readonly Role[]): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) notFound();
  return user;
}
