import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { applyScheduledPublishes } from "@/lib/content/publish";
import { editorStateOf } from "@/lib/content/draft";
import { Badge, ButtonLink, Card, PageHeader } from "@/components/ui";
import { LessonEditor } from "@/components/cms/lesson-editor";
import { CancelScheduleButton, PublishPanel, VersionActions } from "@/components/cms/cms-controls";
import { CmsNotice } from "@/components/cms/notice";
import { formatDateTime } from "@/lib/labels";

// 受講生名などは入れない (ページ名はアクセス権の確認とは別に作られるため)
export const metadata: Metadata = { title: "レッスンの編集" };

export default async function LessonEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireUser(ADMIN_ROLES);
  await applyScheduledPublishes();
  const lesson = await db.lesson.findUnique({
    where: { id },
    include: {
      module: true,
      versions: { orderBy: { version: "desc" }, include: { author: { select: { name: true } }, _count: { select: { progress: true } } } },
    },
  });
  if (!lesson) notFound();
  const latest = lesson.versions[0];
  const draft = latest && !latest.publishedAt && latest.id !== lesson.scheduledVersionId ? latest : null;
  const scheduled = lesson.versions.find((v) => v.id === lesson.scheduledVersionId) ?? null;
  const current = lesson.versions.find((v) => v.id === lesson.currentVersionId) ?? null;
  const editing = draft ?? current ?? latest;
  const expected = latest && { versionId: latest.id, editedAt: latest.editedAt.toISOString() };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={editing?.title ?? lesson.slug}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{lesson.module.level} {lesson.module.title} ・ {lesson.slug}</span>
            <Badge tone={lesson.status === "PUBLISHED" ? "success" : "neutral"}>{lesson.status === "PUBLISHED" ? "公開中" : "非公開"}</Badge>
            {draft && <Badge tone="warning">下書き 版 {draft.version} を編集中</Badge>}
          </span>
        }
        actions={
          <>
            <ButtonLink variant="secondary" href="/admin/content">一覧へ戻る</ButtonLink>
            {editing && <ButtonLink variant="secondary" href={`/admin/content/lessons/${lesson.id}/preview/${editing.id}`}>プレビュー</ButtonLink>}
          </>
        }
      />

      {/* 公開・予約などの結果 (操作した欄は結果で消えることがあるため、ここに出す) */}
      <CmsNotice lessonId={lesson.id} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {editing && (
            // 保存の後も入力と結果のメッセージを残す。同時編集の確認には、画面を開いたときの最新の版を使う
            <LessonEditor
              key={lesson.id}
              lessonId={lesson.id}
              // 下書きがないときは次の保存で新しい版を作るため、元の版のメモは引き継がない
              initial={{ ...editorStateOf(editing), ...(draft ? {} : { changeNote: "" }) }}
              base={expected}
              draftId={draft?.id ?? null}
            />
          )}
        </div>
        <div className="flex flex-col gap-6 xl:sticky xl:top-28 xl:self-start">
          <Card>
            <h2 className="font-bold">公開</h2>
            <div className="mt-3">
              {scheduled ? (
                <div className="flex flex-col gap-3 text-sm">
                  <p>版 {scheduled.version} を {formatDateTime(lesson.publishAt)} に公開する予約があります。</p>
                  <CancelScheduleButton lessonId={lesson.id} version={scheduled.version} becomesDraft={scheduled.id === latest.id} />
                </div>
              ) : draft ? (
                <PublishPanel lessonId={lesson.id} versionId={draft.id} version={draft.version} scheduled={false} />
              ) : (
                <p className="text-sm text-muted">公開待ちの下書きはありません。編集して「下書きを保存」すると新しい版の下書きができます。</p>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">版の履歴</h2>
            <ol className="mt-3 flex flex-col gap-3 text-sm">
              {lesson.versions.map((v) => (
                <li key={v.id} className="rounded-lg border border-border p-3">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">版 {v.version}</span>
                    {v.id === lesson.currentVersionId && <Badge tone="success">公開中</Badge>}
                    {v.id === lesson.scheduledVersionId && <Badge tone="accent">予約</Badge>}
                    {v.id === draft?.id && <Badge tone="warning">下書き</Badge>}
                    {/* 新しい版ができた後に残った、公開されなかった版 (予約を取り消した版など)。編集の対象ではない */}
                    {!v.publishedAt && v.id !== draft?.id && v.id !== lesson.scheduledVersionId && <Badge tone="neutral">未公開</Badge>}
                  </p>
                  <p className="mt-1">{v.changeNote ?? "—"}</p>
                  <p className="text-xs text-muted">
                    {v.author?.name ?? "—"} ・ 作成 {formatDateTime(v.createdAt)}
                    {/* 公開日時は最初に公開したときのもの (「この版に戻して公開」では変わらない) */}
                    {v.publishedAt && ` ・ 初回公開 ${formatDateTime(v.publishedAt)}`} ・ 学習記録 {v._count.progress} 件
                  </p>
                  {v.sourceUrl && <a href={v.sourceUrl} target="_blank" rel="noreferrer" className="text-xs underline">移行元の記事</a>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Link href={`/admin/content/lessons/${lesson.id}/preview/${v.id}`} className="inline-flex min-h-11 items-center px-2 text-sm text-accent underline">プレビュー</Link>
                    {v.version > 1 && <Link href={`/admin/content/lessons/${lesson.id}/diff/${v.id}`} className="inline-flex min-h-11 items-center px-2 text-sm text-accent underline">前の版との差分 (版 {v.version - 1} → {v.version})</Link>}
                    {current && v.id !== current.id && v.version - 1 !== current.version && (
                      <Link href={`/admin/content/lessons/${lesson.id}/diff/${v.id}?against=${current.id}`} className="inline-flex min-h-11 items-center px-2 text-sm text-accent underline">公開中の版 (版 {current.version}) との差分</Link>
                    )}
                    {v.id !== draft?.id && (
                      <VersionActions
                        lessonId={lesson.id}
                        versionId={v.id}
                        version={v.version}
                        canRepublish={!!v.publishedAt && v.id !== lesson.currentVersionId}
                        draftVersion={draft?.version ?? null}
                        expected={expected}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
