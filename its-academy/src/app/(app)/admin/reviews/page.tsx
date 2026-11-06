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
  const subs = await db.submission.findMany({
    where: { userId: { in: ids }, status: { in: current.statuses }, ...(assignment ? { assignment: { slug: assignment } } : {}) },
    orderBy: { submittedAt: "asc" }, // 古い提出から順に
    include: { user: { select: { name: true } }, assignment: { select: { title: true, passScore: true } } },
  });
  return (
    <div>
      <PageHeader title="レビュー" description="提出の古い順に並んでいます。担当の受講生の提出だけが表示されます。" />
      <nav aria-label="表示切り替え" className="mb-4 flex flex-wrap gap-2">
        {Object.entries(VIEWS).map(([key, v]) => (
          <Link
            key={key}
            href={`/admin/reviews?view=${key}`}
            aria-current={key === view ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${key === view ? "border-accent bg-accent-soft font-semibold text-accent-strong" : "border-border"}`}
          >
            {v.label}
          </Link>
        ))}
      </nav>
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
