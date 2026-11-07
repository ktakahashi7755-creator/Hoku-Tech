import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { assertCanActOnStudent } from "@/lib/queries/student";
import { AssignmentBodySchema, RubricCriteriaSchema } from "@/lib/content/schema";
import { Card, PageHeader } from "@/components/ui";
import { SubmissionBadge } from "@/components/status-badge";
import { ReviewView, SubmissionContent } from "@/components/review-view";
import { formatDateTime } from "@/lib/labels";
import { ReviewForm, StartReviewButton } from "./review-form";
import { notFound } from "next/navigation";

// 受講生名などは入れない (ページ名はアクセス権の確認とは別に作られるため)
export const metadata: Metadata = { title: "採点" };

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

  // 同じ受講生・同じ課題の過去の回 (この提出の閲覧権限は上で確認済み。前回からの変化を比べられるよう、本文も読む)
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
            <div className="mt-3">
              <SubmissionContent submission={sub} noteLabel="受講生の備考" />
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
                  {h.id === sub.id ? (
                    <p className="mt-2 text-sm text-muted">この画面で表示している提出です。</p>
                  ) : (
                    // 過去の回の内容は折りたたんでおき、必要なときに開いて今回と見比べる
                    <details className="mt-2 rounded-lg border border-border">
                      <summary className="flex min-h-11 cursor-pointer items-center px-3 text-sm font-semibold">{h.attemptNo} 回目の提出内容を見る</summary>
                      <div className="border-t border-border p-3">
                        <SubmissionContent submission={h} label={`${h.attemptNo} 回目の提出コード`} noteLabel="受講生の備考" />
                      </div>
                    </details>
                  )}
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
