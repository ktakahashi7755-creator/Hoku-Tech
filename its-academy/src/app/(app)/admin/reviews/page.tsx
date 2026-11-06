import type { Metadata } from "next";
import Link from "next/link";
import type { SubmissionStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { STAFF_ROLES } from "@/lib/auth/roles";
import { visibleStudentIds } from "@/lib/queries/staff";
import { EmptyState, PageHeader } from "@/components/ui";
import { SubmissionBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/labels";

export const metadata: Metadata = { title: "レビュー" };

const VIEWS: Record<string, { label: string; statuses: SubmissionStatus[] }> = {
  pending: { label: "レビュー待ち", statuses: ["SUBMITTED", "IN_REVIEW", "RESUBMITTED"] },
  changes: { label: "修正依頼中", statuses: ["CHANGES_REQUESTED"] },
  done: { label: "合格・不合格", statuses: ["PASSED", "FAILED"] },
};

export default async function ReviewsQueue({ searchParams }: { searchParams: Promise<{ view?: string; assignment?: string }> }) {
  const viewer = await requireUser(STAFF_ROLES);
  const { view = "pending", assignment } = await searchParams;
  const current = VIEWS[view] ?? VIEWS.pending;
  const ids = await visibleStudentIds(viewer);
  const done = current === VIEWS.done;
  const DONE_LIMIT = 100;
  const found = await db.submission.findMany({
    where: { userId: { in: ids }, status: { in: current.statuses }, ...(assignment ? { assignment: { slug: assignment } } : {}) },
    // 未対応は古い提出から順に。採点済みは新しい順に直近 100 件
    orderBy: { submittedAt: done ? "desc" : "asc" },
    ...(done ? { take: DONE_LIMIT } : {}),
    include: { user: { select: { name: true } }, assignment: { select: { title: true, passScore: true, slug: true } } },
  });
  // 修正依頼のあと再提出された古い回は「修正依頼中」に出さない (最新の回だけ)
  let subs = found;
  if (current === VIEWS.changes && found.length > 0) {
    const latest = await db.submission.groupBy({
      by: ["assignmentId", "userId"],
      // 下書きは提出ではないため数えない (修正依頼の後に下書きを保存しても、修正依頼中の一覧から消さない)
      where: { userId: { in: [...new Set(found.map((s) => s.userId))] }, status: { not: "DRAFT" } },
      _max: { attemptNo: true },
    });
    const latestNo = new Map(latest.map((l) => [`${l.assignmentId}:${l.userId}`, l._max.attemptNo]));
    subs = found.filter((s) => latestNo.get(`${s.assignmentId}:${s.userId}`) === s.attemptNo);
  }
  const filterTitle = assignment ? (found[0]?.assignment.title ?? (await db.assignment.findUnique({ where: { slug: assignment }, select: { title: true } }))?.title ?? assignment) : null;
  const query = (key: string) => `/admin/reviews?view=${key}${assignment ? `&assignment=${encodeURIComponent(assignment)}` : ""}`;
  return (
    <div>
      <PageHeader title="レビュー" description="未対応の提出は古い順、合格・不合格は新しい順に表示します。講師には担当の受講生の提出だけが表示されます。" />
      <nav aria-label="表示切り替え" className="mb-4 flex flex-wrap gap-2">
        {Object.entries(VIEWS).map(([key, v]) => (
          <Link
            key={key}
            href={query(key)}
            aria-current={key === view ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${key === view ? "border-accent bg-accent-soft font-semibold text-accent-strong" : "border-border"}`}
          >
            {v.label}
          </Link>
        ))}
      </nav>
      {filterTitle && (
        <p className="mb-4 text-sm">
          課題「{filterTitle}」の提出だけを表示しています。{" "}
          <Link href={`/admin/reviews?view=${view}`} className="text-accent underline">すべての課題を表示</Link>
        </p>
      )}
      {done && subs.length === DONE_LIMIT && <p className="mb-4 text-sm text-muted">新しい順に {DONE_LIMIT} 件を表示しています。それより前の結果は受講生の詳細画面で確認できます。</p>}
      {subs.length === 0 ? (
        <EmptyState>該当する提出はありません。</EmptyState>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {subs.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link href={`/admin/reviews/${s.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">{s.assignment.title}</Link>
                <p className="text-sm text-muted">{s.user.name} ・ {s.attemptNo} 回目 ・ {formatDateTime(s.submittedAt)}</p>
              </div>
              <SubmissionBadge status={s.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
