import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { courseSummary, listStudentOverviews } from "@/lib/queries/staff";
import { Badge, Card, EmptyState, PageHeader, Stat } from "@/components/ui";
import { formatDate } from "@/lib/labels";
import { db } from "@/lib/db";
import { NotificationList } from "@/components/notification-list";

export const metadata: Metadata = { title: "ダッシュボード" };

export default async function AdminDashboard() {
  const viewer = await requireUser(STAFF_ROLES);
  const rows = await listStudentOverviews(viewer);
  const s = await courseSummary(rows, viewer);
  const stagnant = rows.filter((r) => r.stagnant);
  const waiting = rows.filter((r) => r.pendingReviews > 0);
  const fixes = rows.filter((r) => r.assignments.some((a) => a.latestStatus === "CHANGES_REQUESTED"));
  const notices = await db.notification.findMany({ where: { userId: viewer.id }, orderBy: { createdAt: "desc" }, take: 10 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="ダッシュボード" description={viewer.role === "INSTRUCTOR" ? "担当している受講生の状況です。" : "全受講生の状況です。"} />
      {rows.length === 0 && (
        <EmptyState>
          {viewer.role === "INSTRUCTOR" ? "担当している受講生はまだいません。管理者が受講生の担当講師に設定すると、ここに表示されます。" : "受講生はまだ登録されていません。「受講生」から追加できます。"}
        </EmptyState>
      )}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="受講生" value={s.students} />
        <Stat label="学習停滞の可能性" value={s.stagnant} hint={rows[0] ? `最終学習から ${rows[0].threshold} 日以上` : "最終学習から基準日数以上"} />
        <Stat label="レビュー待ち" value={s.pendingReviews} />
        <Stat label="平均教材履修率" value={rows.length ? `${s.avgLessonCompletion}%` : "—"} />
        <Stat label="レビュー合格率" value={s.passRate === null ? "—" : `${s.passRate}%`} hint="採点件数に占める合格の割合" />
        <Stat label="修了率" value={s.completionRate === null ? "—" : `${s.completionRate}%`} hint={s.avgDays === null ? "修了者なし" : `平均学習期間 ${s.avgDays} 日`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">学習が止まっている可能性がある受講生</h2>
          <p className="mt-1 text-xs text-muted">学習時間の長短や停滞だけで能力を判断しないでください。まず状況を確認する連絡を。</p>
          {stagnant.length === 0 ? (
            <p className="mt-3 text-sm text-muted">該当者はいません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {stagnant.map((r) => (
                <li key={r.student.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <Link href={`/admin/students/${r.student.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">{r.student.name}</Link>
                  <span className="text-sm text-muted">最終学習 {formatDate(r.lastActivity)} ({r.daysSinceActivity ?? "—"} 日前) ・ {r.current?.title ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">対応が必要な提出</h2>
          {waiting.length === 0 && fixes.length === 0 ? (
            <p className="mt-3 text-sm text-muted">ありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {waiting.map((r) => (
                <li key={r.student.id} className="flex items-center justify-between gap-2 py-3">
                  <Link href={`/admin/students/${r.student.id}`} className="text-accent underline-offset-2 hover:underline">{r.student.name}</Link>
                  <Badge tone="accent">レビュー待ち {r.pendingReviews}</Badge>
                </li>
              ))}
              {fixes.map((r) => (
                <li key={r.student.id + "f"} className="flex items-center justify-between gap-2 py-3">
                  <Link href={`/admin/students/${r.student.id}`} className="text-accent underline-offset-2 hover:underline">{r.student.name}</Link>
                  <Badge tone="warning">修正依頼中</Badge>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/reviews" className="mt-3 inline-block text-sm text-accent underline">レビュー一覧へ</Link>
        </Card>
      </div>

      {s.instructors.length > 0 && (
        <Card>
          <h2 className="font-bold">講師別の担当者数</h2>
          <ul className="mt-3 divide-y divide-border">
            {s.instructors.map((i) => (
              <li key={i.id} className="flex justify-between py-2">
                <span>{i.name}</span>
                <span className="tabular-nums">{i._count.instructedEnrolls} 名</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card>
        <h2 className="font-bold">お知らせ</h2>
        <NotificationList notices={notices} />
      </Card>
    </div>
  );
}
