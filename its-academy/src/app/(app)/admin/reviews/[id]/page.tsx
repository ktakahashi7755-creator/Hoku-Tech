import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { assertCanActOnStudent } from "@/lib/queries/student";
import { AssignmentBodySchema, RubricCriteriaSchema } from "@/lib/content/schema";
import { Card, PageHeader } from "@/components/ui";
import { SubmissionBadge } from "@/components/status-badge";
import { ReviewView } from "@/components/review-view";
import { CodeBlock } from "@/components/lesson/code-block";
import { formatDateTime } from "@/lib/labels";
import { ReviewForm, StartReviewButton } from "./review-form";
import { notFound } from "next/navigation";

export default async function ReviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireUser(STAFF_ROLES);
  const sub = await db.submission.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } }, assignment: { include: { rubric: true } }, reviews: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { name: true } } } } },
  });
  if (!sub || sub.status === "DRAFT") notFound();
  // 採点画面は、採点できる相手 (自分以外の受講生) の提出だけを開ける
  await assertCanActOnStudent(viewer, sub.userId);

  const history = await db.submission.findMany({
    where: { assignmentId: sub.assignmentId, userId: sub.userId, status: { not: "DRAFT" } },
    orderBy: { attemptNo: "desc" },
    include: { reviews: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { name: true } } } } },
  });
  const criteria = RubricCriteriaSchema.parse(sub.assignment.rubric.criteria);
  const body = AssignmentBodySchema.parse(sub.assignment.body);
  const reviewable = ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"].includes(sub.status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={sub.assignment.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Link href={`/admin/students/${sub.user.id}`} className="text-accent underline">{sub.user.name}</Link>
            <span>{sub.attemptNo} 回目 ・ {formatDateTime(sub.submittedAt)}</span>
            <SubmissionBadge status={sub.status} />
          </span>
        }
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <h2 className="font-bold">提出内容</h2>
            <div className="mt-3 flex flex-col gap-3">
              {sub.repoUrl && (
                <p className="break-all">
                  リポジトリ: <a className="text-accent underline" href={sub.repoUrl} target="_blank" rel="noreferrer noopener">{sub.repoUrl}</a>
                </p>
              )}
              {sub.text && <CodeBlock code={sub.text} language="java" label="提出コード" />}
              {sub.note && (
                <div>
                  <h3 className="text-sm font-semibold">受講生の備考</h3>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-surface p-3 text-sm">{sub.note}</p>
                </div>
              )}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">必須要件</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
              {body.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </Card>
          <Card>
            <h2 className="font-bold">提出・採点の履歴</h2>
            <ol className="mt-3 flex flex-col gap-4">
              {history.map((h) => (
                <li key={h.id} className="rounded-lg border border-border p-3">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{h.attemptNo} 回目</span> <SubmissionBadge status={h.status} /> <span className="text-muted">{formatDateTime(h.submittedAt)}</span>
                  </p>
                  {h.reviews.map((r) => <div key={r.id} className="mt-2"><ReviewView review={r} /></div>)}
                </li>
              ))}
            </ol>
          </Card>
        </div>
        <Card className="self-start">
          <h2 className="font-bold">採点</h2>
          {reviewable ? (
            <div className="mt-3 flex flex-col gap-4">
              {sub.status !== "IN_REVIEW" && <StartReviewButton submissionId={sub.id} />}
              <ReviewForm submissionId={sub.id} criteria={criteria} passScore={sub.assignment.passScore} />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              <p role="status" className="rounded-lg bg-success-soft p-3 text-sm text-success">この提出は採点済みです。受講生に結果を通知しました。採点は履歴として残り、変更できません。</p>
              {sub.reviews[0] && <ReviewView review={sub.reviews[0]} />}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
