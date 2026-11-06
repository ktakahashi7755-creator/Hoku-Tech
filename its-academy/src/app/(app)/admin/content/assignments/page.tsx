import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { ASSIGNMENT_TYPE_LABEL } from "@/lib/labels";
import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { NewAssignmentForm } from "@/components/cms/assignment-editor";

export const metadata: Metadata = { title: "課題とルーブリック" };

export default async function AssignmentsAdminPage() {
  await requireUser(ADMIN_ROLES);
  const [modules, rubrics] = await Promise.all([
    db.module.findMany({
      orderBy: { position: "asc" },
      include: {
        assignments: { orderBy: { position: "asc" }, include: { rubric: { select: { name: true } }, _count: { select: { submissions: true } } } },
        lessons: { orderBy: { position: "asc" }, include: { currentVersion: { select: { title: true } } } },
      },
    }),
    db.rubric.findMany({ orderBy: { createdAt: "asc" }, include: { _count: { select: { assignments: true } } } }),
  ]);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="課題とルーブリック" description="課題の内容・合格点・評価の観点を編集します。" actions={<ButtonLink variant="secondary" href="/admin/content">教材管理へ戻る</ButtonLink>} />
      <Card>
        <h2 className="font-bold">ルーブリック (評価の観点)</h2>
        <ul className="mt-3 divide-y divide-border">
          {rubrics.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <Link href={`/admin/content/rubrics/${r.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">{r.name}</Link>
              <span className="text-sm text-muted">{r._count.assignments} 件の課題で使用</span>
            </li>
          ))}
        </ul>
      </Card>
      {modules.map((m) => (
        <Card key={m.id}>
          <h2 className="font-bold">{m.level} {m.title}</h2>
          {m.assignments.length === 0 ? (
            <p className="mt-2 text-sm text-muted">課題はありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {m.assignments.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/admin/content/assignments/${a.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">{a.title}</Link>
                    <p className="text-xs text-muted">
                      {ASSIGNMENT_TYPE_LABEL[a.type]} ・ 合格点 {a.passScore} 点 ・ {a.rubric.name} ・ 提出 {a._count.submissions} 件
                    </p>
                  </div>
                  <Badge tone={a.status === "PUBLISHED" ? "success" : "neutral"}>{a.status === "PUBLISHED" ? "公開中" : "非公開"}</Badge>
                </li>
              ))}
            </ul>
          )}
          <NewAssignmentForm moduleId={m.id} level={m.level} lessons={m.lessons.map((l) => ({ id: l.id, title: l.currentVersion?.title ?? l.slug }))} />
        </Card>
      ))}
    </div>
  );
}
