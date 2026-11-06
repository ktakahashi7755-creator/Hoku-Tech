import "server-only";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";
import { isStaff } from "@/lib/auth/roles";
import { getStudentOverview } from "./student";

/** ログイン中の受講生自身の進捗。講師・管理者はダッシュボードへ */
export async function requireMyOverview() {
  const user = await requireUser();
  if (isStaff(user.role)) redirect("/admin");
  const overview = await getStudentOverview(user.id);
  return { user, overview };
}
