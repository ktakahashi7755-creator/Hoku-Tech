import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { RubricCriteriaSchema } from "@/lib/content/schema";
import { ButtonLink, PageHeader } from "@/components/ui";
import { RubricEditor } from "@/components/cms/assignment-editor";

// 受講生名などは入れない (ページ名はアクセス権の確認とは別に作られるため)
export const metadata: Metadata = { title: "ルーブリックの編集" };

export default async function RubricEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireUser(ADMIN_ROLES);
  const r = await db.rubric.findUnique({ where: { id }, include: { assignments: { select: { title: true } } } });
  if (!r) notFound();
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={r.name}
        description={`使用している課題: ${r.assignments.map((a) => a.title).join("、") || "なし"}`}
        actions={<ButtonLink variant="secondary" href="/admin/content/assignments">一覧へ戻る</ButtonLink>}
      />
      <RubricEditor id={r.id} name={r.name} initial={RubricCriteriaSchema.parse(r.criteria)} />
    </div>
  );
}
