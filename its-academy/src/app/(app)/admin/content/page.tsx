import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { Badge, Card, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/labels";
import { LessonStatusToggle } from "./status-toggle";

export const metadata: Metadata = { title: "教材公開" };

export default async function ContentPage() {
  await requireUser(ADMIN_ROLES);
  const modules = await db.module.findMany({
    orderBy: [{ course: { createdAt: "asc" } }, { position: "asc" }],
    include: { lessons: { orderBy: { position: "asc" }, include: { currentVersion: true, _count: { select: { versions: true } } } } },
  });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="教材公開" description="レッスンの公開・非公開を切り替えます。非公開にしても受講生の進捗と評価の履歴は消えません。" />
      {modules.map((m) => (
        <Card key={m.id}>
          <h2 className="font-bold">{m.level} {m.title}</h2>
          {m.lessons.length === 0 ? (
            <p className="mt-2 text-sm text-muted">レッスンはまだありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {m.lessons.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/lessons/${l.slug}`} className="font-semibold text-accent underline-offset-2 hover:underline">{l.currentVersion?.title ?? l.slug}</Link>
                    <p className="text-xs text-muted">
                      版 {l.currentVersion?.version ?? "—"} (全 {l._count.versions} 版) ・ 更新 {formatDate(l.currentVersion?.createdAt)}
                      {l.currentVersion?.sourceUrl && (
                        <> ・ <a href={l.currentVersion.sourceUrl} className="underline" target="_blank" rel="noreferrer">移行元の記事</a></>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={l.status === "PUBLISHED" ? "success" : "neutral"}>{l.status === "PUBLISHED" ? "公開中" : "非公開"}</Badge>
                    <LessonStatusToggle lessonId={l.id} published={l.status === "PUBLISHED"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
