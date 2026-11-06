import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { Card, PageHeader } from "@/components/ui";
import { NewStudentForm } from "@/components/staff-forms";

export const metadata: Metadata = { title: "受講生を追加" };

export default async function NewStudentPage() {
  await requireUser(ADMIN_ROLES);
  const instructors = await db.user.findMany({ where: { role: "INSTRUCTOR", isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <div className="max-w-3xl">
      <PageHeader title="受講生を追加" description="追加すると公開中のコースに受講登録されます。仮パスワードは自動で作成します (システムには元に戻せない形で保存します)。" />
      <Card><NewStudentForm instructors={instructors} /></Card>
    </div>
  );
}
