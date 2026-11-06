import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { toAssignmentForm } from "@/lib/content/assignment-form";
import { ASSIGNMENT_TYPE_LABEL } from "@/lib/labels";
import { ButtonLink, PageHeader } from "@/components/ui";
import { AssignmentEditor } from "@/components/cms/assignment-editor";

export default async function AssignmentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireUser(ADMIN_ROLES);
  const a = await db.assignment.findUnique({ where: { id }, include: { module: true, _count: { select: { submissions: true } } } });
  if (!a) notFound();
  const rubrics = await db.rubric.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true } });
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={a.title}
        description={`${a.module.level} ${a.module.title} ・ ${ASSIGNMENT_TYPE_LABEL[a.type]} ・ 提出 ${a._count.submissions} 件`}
        actions={<ButtonLink variant="secondary" href="/admin/content/assignments">一覧へ戻る</ButtonLink>}
      />
      <AssignmentEditor id={a.id} initial={toAssignmentForm(a)} rubricId={a.rubricId} rubrics={rubrics} />
    </div>
  );
}
