import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { lessonToLines, lineDiff } from "@/lib/content/diff";
import { ButtonLink, cx, PageHeader, ScrollRegion } from "@/components/ui";

/** 指定した版と、その 1 つ前の版との差分 */
export default async function DiffPage({ params }: { params: Promise<{ id: string; versionId: string }> }) {
  const { id, versionId } = await params;
  await requireUser(ADMIN_ROLES);
  const after = await db.lessonVersion.findFirst({ where: { id: versionId, lessonId: id } });
  if (!after) notFound();
  const before = await db.lessonVersion.findFirst({ where: { lessonId: id, version: { lt: after.version } }, orderBy: { version: "desc" } });
  const diff = lineDiff(before ? lessonToLines(before) : [], lessonToLines(after));
  const added = diff.filter((d) => d.type === "added").length;
  const removed = diff.filter((d) => d.type === "removed").length;
  return (
    <div>
      <PageHeader
        title={`差分: 版 ${before?.version ?? "なし"} → 版 ${after.version}`}
        description={`追加 ${added} 行 ・ 削除 ${removed} 行`}
        actions={<ButtonLink variant="secondary" href={`/admin/content/lessons/${id}`}>編集へ戻る</ButtonLink>}
      />
      <ScrollRegion label="版の差分" className="rounded-xl border border-border">
        <ol className="min-w-[640px] font-mono text-sm">
          {diff.map((d, i) => (
            <li
              key={i}
              className={cx(
                "whitespace-pre-wrap px-4 py-0.5",
                d.type === "added" && "bg-success-soft text-success",
                d.type === "removed" && "bg-danger-soft text-danger line-through",
              )}
            >
              <span className="sr-only">{d.type === "added" ? "追加: " : d.type === "removed" ? "削除: " : ""}</span>
              <span aria-hidden>{d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  "}</span>
              {d.text}
            </li>
          ))}
        </ol>
      </ScrollRegion>
    </div>
  );
}
