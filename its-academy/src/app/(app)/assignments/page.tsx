import type { Metadata } from "next";
import Link from "next/link";
import { requireMyOverview } from "@/lib/queries/me";
import { Badge, EmptyState, PageHeader, ScrollRegion } from "@/components/ui";
import { SubmissionBadge } from "@/components/status-badge";
import { ASSIGNMENT_TYPE_LABEL, formatDate } from "@/lib/labels";

export const metadata: Metadata = { title: "課題" };

export default async function AssignmentsPage() {
  const { overview } = await requireMyOverview();
  if (!overview.enrollment) return (
      <div className="flex flex-col gap-6">
        <PageHeader title="課題" />
        <EmptyState>受講中のコースがありません。担当講師または管理者に連絡してください。</EmptyState>
      </div>
    );
  return (
    <div>
      <PageHeader title="課題" description="前提のレッスンを完了すると取り組めます。講師がルーブリックで採点し、コメントを返します。" />
      {overview.assignments.length === 0 ? (
        <EmptyState>公開中の課題はまだありません。</EmptyState>
      ) : (
      <ScrollRegion label="課題の一覧" className="rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">課題</th>
              <th scope="col" className="px-4 py-3 font-semibold">形式</th>
              <th scope="col" className="px-4 py-3 font-semibold">状態</th>
              <th scope="col" className="px-4 py-3 font-semibold">提出回数</th>
              <th scope="col" className="px-4 py-3 font-semibold">最新の得点</th>
              <th scope="col" className="px-4 py-3 font-semibold">最終提出</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {overview.assignments.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">
                  <span className="mr-2 text-xs text-muted">{a.level}</span>
                  <Link href={`/assignments/${a.slug}`} className="font-semibold text-accent underline-offset-2 hover:underline">
                    {a.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{ASSIGNMENT_TYPE_LABEL[a.type]}</td>
                <td className="px-4 py-3">{a.unlocked ? <SubmissionBadge status={a.latestStatus} /> : <Badge>前提レッスン未完了</Badge>}</td>
                <td className="px-4 py-3 tabular-nums">{a.attempts}</td>
                <td className="px-4 py-3 tabular-nums">{a.latestReviewScore === null ? "—" : `${a.latestReviewScore} / 合格 ${a.passScore}`}</td>
                <td className="px-4 py-3">{formatDate(a.lastSubmittedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>
      )}
    </div>
  );
}
