import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { applyScheduledPublishes } from "@/lib/content/publish";
import { Badge, Card, PageHeader } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/labels";
import { MoveButtons, NewLessonForm } from "@/components/cms/cms-controls";
import { LessonStatusToggle } from "./status-toggle";

export const metadata: Metadata = { title: "教材管理" };

export default async function ContentPage() {
  await requireUser(ADMIN_ROLES);
  await applyScheduledPublishes();
  const modules = await db.module.findMany({
    orderBy: [{ course: { createdAt: "asc" } }, { position: "asc" }],
    include: {
      lessons: {
        orderBy: { position: "asc" },
        include: { currentVersion: true, versions: { orderBy: { version: "desc" }, take: 1 } },
      },
    },
  });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="教材管理"
        description="レッスンの作成・編集・並べ替え・公開を行います。公開中の版は書き換えず、編集は新しい版の下書きとして保存されます。非公開にしても受講生の進捗と評価の履歴は消えません。"
      />
      {modules.map((m) => (
        <Card key={m.id}>
          <h2 className="font-bold">{m.level} {m.title}</h2>
          {m.lessons.length === 0 ? (
            <p className="mt-2 text-sm text-muted">レッスンはまだありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {m.lessons.map((l, i) => {
                const latest = l.versions[0];
                const hasDraft = latest && !latest.publishedAt && latest.id !== l.scheduledVersionId;
                return (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <MoveButtons lessonId={l.id} first={i === 0} last={i === m.lessons.length - 1} />
                      <div className="min-w-0">
                        <Link href={`/admin/content/lessons/${l.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">
                          {l.currentVersion?.title ?? latest?.title ?? l.slug}
                        </Link>
                        <p className="text-xs text-muted">
                          {l.slug} ・ 公開中の版 {l.currentVersion?.version ?? "なし"} ・ 更新 {formatDate(latest?.createdAt)}
                          {l.currentVersion?.sourceUrl && (
                            <> ・ <a href={l.currentVersion.sourceUrl} className="underline" target="_blank" rel="noreferrer">移行元の記事</a></>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {hasDraft && <Badge tone="warning">下書き (版 {latest.version})</Badge>}
                      {l.scheduledVersionId && <Badge tone="accent">公開予約 {formatDateTime(l.publishAt)}</Badge>}
                      <Badge tone={l.status === "PUBLISHED" ? "success" : "neutral"}>{l.status === "PUBLISHED" ? "公開中" : "非公開"}</Badge>
                      {l.currentVersionId && <LessonStatusToggle lessonId={l.id} published={l.status === "PUBLISHED"} />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <NewLessonForm moduleId={m.id} level={m.level} />
        </Card>
      ))}
    </div>
  );
}
