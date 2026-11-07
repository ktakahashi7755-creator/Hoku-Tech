import type { Metadata } from "next";
import Link from "next/link";
import { requireMyOverview } from "@/lib/queries/me";
import { Card, EmptyState, PageHeader, ProgressBar } from "@/components/ui";
import { MetricCards } from "@/components/metric-cards";
import { WeekChart } from "@/components/week-chart";
import { LessonBadge } from "@/components/status-badge";
import { SKILL_LABEL, SKILL_LEVEL_LABEL } from "@/lib/progress/skills";
import { formatDate, formatMinutes, formatStreak } from "@/lib/labels";

export const metadata: Metadata = { title: "学習進捗" };

export default async function ProgressPage() {
  const { overview: o } = await requireMyOverview();
  if (!o.enrollment) return (
      <div className="flex flex-col gap-6">
        <PageHeader title="学習進捗" />
        <EmptyState>受講中のコースがありません。担当講師または管理者に連絡してください。</EmptyState>
      </div>
    );
  const byModule = o.modules
    .filter((m) => m.lessons.length > 0)
    .map((m) => {
      const ls = o.lessons.filter((l) => l.level === m.level);
      const done = ls.filter((l) => l.status === "COMPLETED").length;
      return { m, ls, done, pct: Math.round((done / ls.length) * 100) };
    });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="学習進捗"
        description={`学習開始 ${formatDate(o.enrollment.startedAt)} ・ 目標修了 ${formatDate(o.enrollment.targetEndDate)} ・ 担当講師 ${o.enrollment.instructor?.name ?? "未設定"}`}
      />
      <MetricCards metrics={o.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">目標に対する進み具合</h2>
          {o.pace ? (
            <div className="mt-4 flex flex-col gap-3">
              <ProgressBar value={o.metrics.lessonCompletion} label={`教材の履修率 (必修 ${o.metrics.completedLessons} / ${o.metrics.totalLessons})`} />
              <ProgressBar value={o.pace.expected} label="今日時点の目安" />
              <p className="text-sm text-muted">
                {o.pace.diff >= 0 ? "目安どおり、または目安より進んでいます。" : `目安より ${-o.pace.diff} ポイント遅れています。週の学習計画を講師と見直しましょう。`}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">目標修了日が設定されていません。設定は担当講師または管理者に依頼してください。</p>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">直近 7 日間の学習</h2>
          <p className="mt-1 text-sm text-muted">
            連続 {formatStreak(o.streak, o.streakIncludesToday)} ・ 累計 {formatMinutes(o.totalMinutes)} ・ 最終学習 {formatDate(o.lastActivity)}
          </p>
          <div className="mt-4">
            <WeekChart week={o.week} />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold">レベル別の履修状況</h2>
        {byModule.length === 0 && <p className="mt-3 text-sm text-muted">公開中のレッスンはまだありません。</p>}
        <ul className="mt-4 flex flex-col gap-5">
          {byModule.map(({ m, ls, done, pct }) => (
            <li key={m.id}>
              <ProgressBar value={pct} label={`${m.level} ${m.title} (${done} / ${ls.length})`} />
              <ul className="mt-2 flex flex-wrap gap-2">
                {ls.map((l) => (
                  <li key={l.id}>
                    <Link href={`/lessons/${l.slug}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-sm hover:bg-surface">
                      {l.title} <LessonBadge status={l.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">復習するとよいところ</h2>
          {o.weakLessons.length === 0 && o.struggling.length === 0 ? (
            <p className="mt-3 text-sm text-muted">今のところありません。</p>
          ) : (
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
              {o.weakLessons.map((l) => (
                <li key={l.id}>
                  <Link className="text-accent underline" href={`/lessons/${l.slug}`}>{l.title}</Link> の理解度チェックが未合格です
                </li>
              ))}
              {o.struggling.map((a) => (
                <li key={a.id}>
                  課題「<Link className="text-accent underline" href={`/assignments/${a.slug}`}>{a.title}</Link>」で講師の指摘があります。コメントを確認して取り組み直しましょう
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">講師によるスキル評価</h2>
          {o.skills.length === 0 ? (
            <p className="mt-3 text-sm text-muted">まだ評価はありません。課題や面談をもとに講師が評価します。</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody className="divide-y divide-border">
                {o.skills.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className="py-2 text-left font-normal">{SKILL_LABEL[s.skill] ?? s.skill}</th>
                    <td className="py-2 text-right">{SKILL_LEVEL_LABEL[s.level]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
