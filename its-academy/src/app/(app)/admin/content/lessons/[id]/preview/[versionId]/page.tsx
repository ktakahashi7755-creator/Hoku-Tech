import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { LessonContentSchema } from "@/lib/content/schema";
import { editorStateOf, fromEditorDraft } from "@/lib/content/draft";
import { Badge, ButtonLink, PageHeader } from "@/components/ui";
import { LessonSections } from "@/components/lesson/lesson-sections";

/** 公開前プレビュー。受講生の画面と同じ部品で表示する (理解度チェックは正解付きで表示) */
export default async function PreviewPage({ params }: { params: Promise<{ id: string; versionId: string }> }) {
  const { id, versionId } = await params;
  await requireUser(ADMIN_ROLES);
  const v = await db.lessonVersion.findFirst({ where: { id: versionId, lessonId: id }, include: { lesson: { include: { module: true } } } });
  if (!v) notFound();
  const finalized = LessonContentSchema.safeParse(v.content);
  const result = finalized.success ? { ok: true as const, content: finalized.data, title: v.title, estimatedMinutes: v.estimatedMinutes } : fromEditorDraft(editorStateOf(v));

  return (
    <div className="mx-auto max-w-3xl">
      <p role="note" className="mb-6 rounded-lg bg-warning-soft p-3 text-sm text-warning">
        プレビュー (版 {v.version}{v.publishedAt ? "・公開済み" : "・未公開"})。受講生には {v.publishedAt ? "公開中の版のみ" : "まだ"} 表示されません。
      </p>
      <PageHeader
        title={result.ok ? result.title : v.title}
        description={<span className="flex flex-wrap items-center gap-2">{v.lesson.module.level} {v.lesson.module.title}{result.ok && <Badge tone="accent">学習目安 {result.estimatedMinutes} 分</Badge>}</span>}
        actions={<ButtonLink variant="secondary" href={`/admin/content/lessons/${id}`}>編集へ戻る</ButtonLink>}
      />
      {result.ok ? (
        <LessonSections
          content={result.content}
          quizSlot={
            <ol className="list-decimal space-y-3 pl-6">
              {result.content.quiz.questions.map((q) => (
                <li key={q.id}>
                  <p>{q.question}</p>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {q.choices.map((c, i) => <li key={i} className={i === q.answerIndex ? "font-semibold text-success" : ""}>{c}{i === q.answerIndex && " (正解)"}</li>)}
                  </ul>
                  <p className="mt-1 text-sm text-muted">解説: {q.explanation}</p>
                </li>
              ))}
              <p className="text-sm text-muted">合格ライン {result.content.quiz.passScore} 点</p>
            </ol>
          }
        />
      ) : (
        <div role="alert" className="rounded-lg bg-danger-soft p-4 text-sm text-danger">
          <p className="font-semibold">必須項目が不足しているため、まだ表示できません。</p>
          <ul className="mt-2 list-disc pl-5">{result.errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
