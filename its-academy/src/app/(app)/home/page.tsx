import type { Metadata } from "next";
import Link from "next/link";
import { countUnreadNotices, requireMyOverview } from "@/lib/queries/me";
import { Card, EmptyState, PageHeader, ProgressBar, Stat } from "@/components/ui";
import { NextActionCard } from "@/components/next-action";
import { WeekChart } from "@/components/week-chart";
import { SubmissionBadge } from "@/components/status-badge";
import { formatDate, formatMinutes, formatStreak } from "@/lib/labels";

export const metadata: Metadata = { title: "ホーム" };

export default async function HomePage() {
  const { user, overview } = await requireMyOverview();
  if (!overview.enrollment) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="ホーム" />
        <EmptyState>受講中のコースがありません。担当講師または管理者に連絡してください。</EmptyState>
      </div>
    );
  }
  const o = overview;
  const slugs = Object.fromEntries(o.assignments.map((a) => [a.id, a.slug]));
  const openAssignments = o.assignments.filter((a) => a.unlocked && a.latestStatus !== "PASSED");
  const visibleComments = o.comments.filter((c) => c.visibility === "STUDENT").slice(0, 3);
  // まだ見ていないレビュー結果・講師コメントがあれば、「次にやること」の前に知らせる
  const unread = await countUnreadNotices(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">こんにちは、{user.name} さん</h1>
        <p className="text-muted">{o.enrollment.course.title}</p>
      </div>

      {unread > 0 && (
        <p role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-accent/40 bg-accent-soft p-4 text-accent-strong">
          <span className="font-semibold">まだ見ていないお知らせ (レビュー結果・講師コメント) が {unread} 件あります。</span>
          <Link href="/reviews" className="inline-flex min-h-11 items-center font-semibold underline">
            質問・レビューで確認する
          </Link>
        </p>
      )}

      <NextActionCard next={o.next} assignmentSlugs={slugs} firstTime={o.metrics.completedLessons === 0} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="教材の履修" value={`必修 ${o.metrics.completedLessons} / ${o.metrics.totalLessons}`} hint="必修レッスンのうち、理解度チェックに合格して完了したもの (L8 選択は含めない)" />
        <Stat label="課題の合格" value={`必修 ${o.metrics.passedAssignments} / ${o.metrics.totalAssignments}`} hint="必修の課題 (L8 選択は含めない)" />
        <Stat label="連続学習" value={formatStreak(o.streak, o.streakIncludesToday)} hint={o.streak > 0 && !o.streakIncludesToday ? "今日学習すると、連続日数がつながります" : undefined} />
        <Stat label="累計学習時間" value={formatMinutes(o.totalMinutes)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">コースの進み具合</h2>
          <div className="mt-4 flex flex-col gap-4">
            <ProgressBar value={o.metrics.lessonCompletion} label="教材の履修率" />
            {o.pace && (
              <p className="text-sm text-muted">
                目標修了日 {formatDate(o.enrollment.targetEndDate)} に向けた目安は {o.pace.expected}% です。
                {o.pace.diff >= 0 ? " 予定どおり進んでいます。" : ` 目安より ${-o.pace.diff} ポイント遅れています。無理のない計画を講師と相談しましょう。`}
              </p>
            )}
            {o.current && (
              <p className="text-sm">
                現在の学習領域: <span className="font-semibold">{o.current.level} {o.current.moduleTitle}</span>
              </p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">直近 7 日間の学習</h2>
          <div className="mt-4">
            <WeekChart week={o.week} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">取り組み中の課題</h2>
          {openAssignments.length === 0 ? (
            <p className="mt-3 text-sm text-muted">今取り組める課題はありません。</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {openAssignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/assignments/${a.slug}`} className="text-accent underline-offset-2 hover:underline">
                    {a.title}
                  </Link>
                  <SubmissionBadge status={a.latestStatus} />
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">講師からのコメント</h2>
          {visibleComments.length === 0 ? (
            <p className="mt-3 text-sm text-muted">まだコメントはありません。</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {visibleComments.map((c) => (
                <li key={c.id} className="rounded-lg bg-surface p-3">
                  {/* ホームでは要約だけを表示し、全文は「質問・レビュー」で読む */}
                  <p className="line-clamp-4 whitespace-pre-wrap">{c.body}</p>
                  {c.body.length > 160 && (
                    <Link href="/reviews" className="mt-1 inline-block text-sm text-accent underline">
                      全文を読む
                    </Link>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    {c.author.name} ・ {formatDate(c.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
