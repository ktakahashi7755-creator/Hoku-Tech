import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { isAdmin, STAFF_ROLES } from "@/lib/auth/roles";
import { assertCanViewStudent, getStudentOverview, hasEnrollment } from "@/lib/queries/student";
import { guidanceFor } from "@/lib/queries/staff";
import { SKILL_AREAS, SKILL_LABEL, SKILL_LEVEL_LABEL } from "@/lib/progress/skills";
import { Badge, Card, PageHeader } from "@/components/ui";
import { MetricCards } from "@/components/metric-cards";
import { WeekChart } from "@/components/week-chart";
import { SubmissionBadge } from "@/components/status-badge";
import { CommentForm, EnrollmentForm, SkillForm } from "@/components/staff-forms";
import { formatDate, formatDateTime, formatMinutes } from "@/lib/labels";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireUser(STAFF_ROLES);
  await assertCanViewStudent(viewer, id);
  const o = await getStudentOverview(id);
  if (!hasEnrollment(o)) notFound();

  const pendingReviews = o.assignments.filter((a) => ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"].includes(a.latestStatus ?? "")).length;
  const guidance = guidanceFor({ ...o, pendingReviews });
  const instructors = isAdmin(viewer.role)
    ? await db.user.findMany({ where: { role: "INSTRUCTOR", isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } })
    : [];
  const feedback = o.submissions.flatMap((s) => s.reviews.filter((r) => r.decision !== "PASS").map((r) => ({ ...r, attemptNo: s.attemptNo, assignmentId: s.assignmentId })));
  const titleOf = new Map(o.assignments.map((a) => [a.id, a.title]));
  const lowSkills = new Set(o.skills.filter((s) => s.level <= 2).map((s) => s.skill));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={o.student.name}
        description={`${o.student.affiliation ?? "所属未設定"} ・ ${o.student.email} ・ 入校日 ${formatDate(o.student.joinedAt)}`}
        actions={o.stagnant ? <Badge tone="warning">学習停滞の可能性 ({o.daysSinceActivity} 日)</Badge> : undefined}
      />

      <Card tone="accent">
        <h2 className="font-bold">次に必要な指導 (提案)</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {guidance.map((g, i) => (
            <li key={i} className="flex gap-2">
              <Badge tone={g.priority === "high" ? "danger" : g.priority === "medium" ? "warning" : "neutral"}>{{ high: "優先", medium: "確認", low: "参考" }[g.priority]}</Badge>
              <span>{g.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">自動で作った提案です。最終的な判断は担当講師が行ってください。</p>
      </Card>

      <MetricCards metrics={o.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">現在地と期間</h2>
          <dl className="mt-3 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
            <dt className="text-muted">現在の章</dt>
            <dd>{o.current ? `${o.current.level} ${o.current.moduleTitle} / ${o.current.title}` : "公開中の全レッスン完了"}</dd>
            <dt className="text-muted">学習開始</dt>
            <dd>{formatDate(o.enrollment.startedAt)} (開始から {o.daysSinceStart} 日)</dd>
            <dt className="text-muted">目標修了日</dt>
            <dd>{formatDate(o.enrollment.targetEndDate)}{o.pace && ` (目安 ${o.pace.expected}% / 実績 ${o.metrics.lessonCompletion}%)`}</dd>
            <dt className="text-muted">最終学習</dt>
            <dd>{formatDateTime(o.lastActivity)}</dd>
            <dt className="text-muted">連続学習</dt>
            <dd>{o.streak} 日</dd>
            <dt className="text-muted">累計学習時間</dt>
            <dd>{formatMinutes(o.totalMinutes)}</dd>
            <dt className="text-muted">最終ログイン</dt>
            <dd>{formatDateTime(o.student.lastLoginAt)}</dd>
          </dl>
        </Card>
        <Card>
          <h2 className="font-bold">直近 7 日間の学習</h2>
          <div className="mt-4"><WeekChart week={o.week} /></div>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold">課題の状況</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-2 font-semibold">課題</th>
                <th scope="col" className="py-2 font-semibold">状態</th>
                <th scope="col" className="py-2 font-semibold">提出回数</th>
                <th scope="col" className="py-2 font-semibold">最新の得点</th>
                <th scope="col" className="py-2 font-semibold">最終提出</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {o.assignments.map((a) => {
                const latest = o.submissions.find((s) => s.assignmentId === a.id && s.status !== "DRAFT");
                return (
                  <tr key={a.id}>
                    <td className="py-2">
                      {latest ? <Link className="text-accent underline" href={`/admin/reviews/${latest.id}`}>{a.title}</Link> : a.title}
                    </td>
                    <td className="py-2">{a.unlocked ? <SubmissionBadge status={a.latestStatus} /> : <Badge>前提未完了</Badge>}</td>
                    <td className="py-2 tabular-nums">{a.attempts}</td>
                    <td className="py-2 tabular-nums">{a.latestReviewScore ?? "—"}</td>
                    <td className="py-2">{formatDate(a.lastSubmittedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">レビューでの指摘 (合格以外)</h2>
          {feedback.length === 0 ? (
            <p className="mt-3 text-sm text-muted">指摘はありません。</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3 text-sm">
              {feedback.map((f) => (
                <li key={f.id} className="rounded-lg bg-surface p-3">
                  <p className="font-semibold">{titleOf.get(f.assignmentId)} ({f.attemptNo} 回目・{f.totalScore} 点)</p>
                  <p className="mt-1 whitespace-pre-wrap">{f.comment}</p>
                  <p className="mt-1 text-xs text-muted">{f.reviewer.name} ・ {formatDate(f.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">スキル評価 (不足している能力)</h2>
          {o.skills.length === 0 ? (
            <p className="mt-3 text-sm text-muted">まだ評価していません。</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody className="divide-y divide-border">
                {o.skills.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="py-2 text-left font-normal">
                      {SKILL_LABEL[s.skill] ?? s.skill} {lowSkills.has(s.skill) && <Badge tone="warning">要強化</Badge>}
                    </th>
                    <td className="py-2 text-right">{SKILL_LEVEL_LABEL[s.level]}</td>
                    <td className="py-2 pl-3 text-right text-xs text-muted">{s.assessor.name} ・ {formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="mt-5 border-t border-border pt-4">
            <SkillForm studentId={o.student.id} areas={SKILL_AREAS} levels={SKILL_LEVEL_LABEL} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">講師コメント</h2>
          <ul className="mt-3 flex flex-col gap-3 text-sm">
            {o.comments.map((c) => (
              <li key={c.id} className="rounded-lg bg-surface p-3">
                <p className="whitespace-pre-wrap">{c.body}</p>
                <p className="mt-1 text-xs text-muted">
                  {c.author.name} ・ {formatDateTime(c.createdAt)} ・ {c.visibility === "STUDENT" ? "受講生に表示" : "講師のみ"}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-border pt-4">
            <CommentForm studentId={o.student.id} />
          </div>
        </Card>
        {isAdmin(viewer.role) && (
          <Card>
            <h2 className="font-bold">受講設定 (コース割当・期限)</h2>
            <p className="mt-1 text-sm text-muted">{o.enrollment.course.title}</p>
            <div className="mt-4">
              <EnrollmentForm
                enrollment={{
                  id: o.enrollment.id,
                  instructorId: o.enrollment.instructorId,
                  targetEndDate: o.enrollment.targetEndDate ? o.enrollment.targetEndDate.toISOString().slice(0, 10) : "",
                  status: o.enrollment.status,
                }}
                instructors={instructors}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
