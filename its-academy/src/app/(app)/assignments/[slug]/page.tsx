import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireMyOverview } from "@/lib/queries/me";
import { AssignmentBodySchema, RubricCriteriaSchema } from "@/lib/content/schema";
import { Badge, Card, PageHeader } from "@/components/ui";
import { SubmissionBadge } from "@/components/status-badge";
import { ReviewView } from "@/components/review-view";
import { ASSIGNMENT_TYPE_LABEL, formatDateTime } from "@/lib/labels";
import { SubmissionForm } from "./submission-form";

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

/** タブ・読み上げで「どの課題か」が分かるよう、課題名をページ名にする (公開中の課題名のみ) */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const assignment = await db.assignment.findUnique({ where: { slug }, select: { status: true, title: true } });
  return { title: assignment?.status === "PUBLISHED" ? assignment.title : "課題" };
}

export default async function AssignmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user, overview } = await requireMyOverview();
  if (!overview.enrollment) notFound();
  const summary = overview.assignments.find((a) => a.slug === slug);
  if (!summary) notFound();

  const assignment = await db.assignment.findUniqueOrThrow({ where: { slug }, include: { rubric: true, lesson: { include: { currentVersion: true } } } });
  const body = AssignmentBodySchema.parse(assignment.body);
  const rubric = RubricCriteriaSchema.parse(assignment.rubric.criteria);
  const submissions = await db.submission.findMany({
    where: { assignmentId: assignment.id, userId: user.id },
    orderBy: { attemptNo: "desc" },
    include: { reviews: { orderBy: { createdAt: "desc" }, include: { reviewer: { select: { name: true } } } } },
  });
  const latest = submissions[0] ?? null;
  const draft = latest?.status === "DRAFT" ? latest : null;
  const lastFeedback = latest && ["CHANGES_REQUESTED", "FAILED"].includes(latest.status) ? latest : null;
  const canEdit = summary.unlocked && (!latest || latest.status === "DRAFT" || latest.status === "CHANGES_REQUESTED" || latest.status === "FAILED");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={assignment.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{ASSIGNMENT_TYPE_LABEL[assignment.type]}</Badge>
            <span>合格点 {assignment.passScore} / 100</span>
            <SubmissionBadge status={summary.latestStatus} />
          </span>
        }
      />

      {!summary.unlocked && assignment.lesson?.currentVersion && (
        <p className="rounded-lg bg-warning-soft p-3 text-warning">
          レッスン「<Link className="underline" href={`/lessons/${assignment.lesson.slug}`}>{assignment.lesson.currentVersion.title}</Link>」を完了すると提出できます。
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="flex flex-col gap-5">
          <div>
            <h2 className="font-bold">課題の目的</h2>
            <p className="mt-2">{body.purpose}</p>
          </div>
          <div>
            <h2 className="font-bold">想定シーン</h2>
            <p className="mt-2">{body.scenario}</p>
          </div>
          <List title="必須要件" items={body.requirements} />
          <List title="推奨要件 (加点)" items={body.recommended} />
          <List title="作業手順" items={body.steps} />
          <List title="提出物" items={body.deliverables} />
          <List title="README に書くこと" items={body.readmeChecklist} />
          <div>
            <h3 className="font-bold">再提出について</h3>
            <p className="mt-2">{body.resubmitCondition}</p>
          </div>
          <List title="面談で説明できるようにしておくこと" items={body.interviewPoints} />
        </Card>
        <Card className="self-start">
          <h2 className="font-bold">評価の観点 (ルーブリック)</h2>
          <table className="mt-3 w-full text-sm">
            <tbody className="divide-y divide-border">
              {rubric.map((c) => (
                <tr key={c.key}>
                  <th scope="row" className="py-2 pr-2 text-left align-top font-semibold">
                    {c.label}
                    <p className="font-normal text-muted">{c.description}</p>
                  </th>
                  <td className="py-2 text-right align-top tabular-nums">{c.weight} 点</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {latest && ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"].includes(latest.status) && (
        <p className="rounded-lg bg-accent-soft p-4 text-accent-strong" role="status">
          {latest.attemptNo} 回目の提出を受け付けました ({formatDateTime(latest.submittedAt)})。講師のレビューをお待ちください。結果が出るとお知らせが届きます。
        </p>
      )}
      {latest?.status === "PASSED" && (
        <p className="rounded-lg bg-success-soft p-4 font-semibold text-success" role="status">この課題は合格です。</p>
      )}

      {lastFeedback?.reviews[0] && (
        <Card tone="warning">
          <h2 className="font-bold">前回 ({lastFeedback.attemptNo} 回目) のレビュー</h2>
          <div className="mt-3">
            <ReviewView review={lastFeedback.reviews[0]} />
          </div>
        </Card>
      )}

      {canEdit && (
        <Card>
          <h2 className="font-bold">{lastFeedback ? "修正版を再提出する" : "提出する"}</h2>
          <div className="mt-4">
            <SubmissionForm
              assignmentId={assignment.id}
              type={assignment.type}
              defaults={{ text: draft?.text ?? lastFeedback?.text ?? "", repoUrl: draft?.repoUrl ?? lastFeedback?.repoUrl ?? "", note: draft?.note ?? "" }}
            />
          </div>
        </Card>
      )}

      <Card>
        <h2 className="font-bold">提出履歴</h2>
        {submissions.filter((s) => s.status !== "DRAFT").length === 0 ? (
          <p className="mt-3 text-sm text-muted">まだ提出していません。</p>
        ) : (
          <ol className="mt-3 flex flex-col gap-4">
            {submissions
              .filter((s) => s.status !== "DRAFT")
              .map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">{s.attemptNo} 回目</span>
                    <SubmissionBadge status={s.status} />
                    <span className="text-sm text-muted">{formatDateTime(s.submittedAt)}</span>
                  </div>
                  {s.repoUrl && <p className="mt-2 break-all text-sm">{s.repoUrl}</p>}
                  {s.reviews.map((r) => (
                    <div key={r.id} className="mt-3 border-t border-border pt-3">
                      <ReviewView review={r} />
                    </div>
                  ))}
                </li>
              ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
