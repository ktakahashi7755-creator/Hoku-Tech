import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { isStaff } from "@/lib/auth/roles";
import { getStudentOverview } from "./student";

/**
 * まだ見ていないお知らせ (レビュー結果・講師コメント・提出の連絡) の件数。本人の分だけを数える。
 * メニューの印とホームの案内で使う (1 回の画面表示の中では 1 回だけ数える。個人の情報なので use cache はしない)
 */
export const countUnreadNotices = cache(async (userId: string) => db.notification.count({ where: { userId, readAt: null } }));

/** ログイン中の受講生自身の進捗。講師・管理者はダッシュボードへ */
export async function requireMyOverview() {
  const user = await requireUser();
  if (isStaff(user.role)) redirect("/admin");
  const overview = await getStudentOverview(user.id);
  return { user, overview };
}
