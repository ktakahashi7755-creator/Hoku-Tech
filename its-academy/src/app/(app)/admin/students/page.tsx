import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { isAdmin, STAFF_ROLES } from "@/lib/auth/roles";
import { listStudentOverviews } from "@/lib/queries/staff";
import { Badge, ButtonLink, EmptyState, PageHeader, ScrollRegion } from "@/components/ui";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = { title: "受講生" };

const v = (x: number | null) => (x === null ? "—" : x);

const PAGE_SIZE = 50;

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ filter?: string; page?: string }> }) {
  const viewer = await requireUser(STAFF_ROLES);
  const { filter, page: pageParam } = await searchParams;
  let all = await listStudentOverviews(viewer);
  if (filter === "stagnant") all = all.filter((r) => r.stagnant);
  if (filter === "review") all = all.filter((r) => r.pendingReviews > 0);
  // 表示は 50 名ずつ (集計と絞り込みは全員を対象に行う)
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1), pages);
  const rows = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageHref = (n: number) => `/admin/students?${new URLSearchParams({ ...(filter ? { filter } : {}), page: String(n) })}`;

  const tabs = [
    ["", "すべて"],
    ["stagnant", "学習停滞の可能性"],
    ["review", "レビュー待ちあり"],
  ] as const;

  return (
    <div>
      <PageHeader
        title="受講生"
        description="A 教材履修率 / B 課題完了率 / C 理解度評価 / D 実装能力評価 / E 実務準備状況は、混ぜずに別々に見る指標です。"
        actions={
          <>
            <ButtonLink variant="secondary" href="/admin/export/students" prefetch={false}>CSV 出力</ButtonLink>
            {isAdmin(viewer.role) && <ButtonLink href="/admin/students/new">受講生を追加</ButtonLink>}
          </>
        }
      />
      <nav aria-label="絞り込み" className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={key ? `/admin/students?filter=${key}` : "/admin/students"}
            aria-current={(filter ?? "") === key ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${(filter ?? "") === key ? "border-accent bg-accent-soft font-semibold text-accent-strong" : "border-border"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {all.length} 名{pages > 1 && ` ・ ${(page - 1) * PAGE_SIZE + 1}〜${Math.min(page * PAGE_SIZE, all.length)} 名目を表示`}
      </p>
      {rows.length === 0 ? (
        <EmptyState>該当する受講生はいません。</EmptyState>
      ) : (
        <ScrollRegion scrollHint label="受講生の一覧" className="rounded-xl border border-border">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                {["氏名", "所属", "現在の学習領域", "A 教材履修率", "B 課題完了率", "C 理解度評価 (点)", "D 実装能力評価 (点)", "E 実務準備状況 (点)", "最終学習", "状態"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.student.id}>
                  <td className="px-3 py-3">
                    <Link href={`/admin/students/${r.student.id}`} className="font-semibold text-accent underline-offset-2 hover:underline">{r.student.name}</Link>
                    <div className="text-xs text-muted">担当 {r.enrollment.instructor?.name ?? "未設定"}</div>
                  </td>
                  <td className="px-3 py-3">{r.student.affiliation ?? "—"}</td>
                  <td className="px-3 py-3">{r.current ? `${r.current.level} ${r.current.title}` : "全レッスン完了"}</td>
                  <td className="px-3 py-3 tabular-nums">{r.metrics.lessonCompletion}%</td>
                  <td className="px-3 py-3 tabular-nums">{r.metrics.assignmentCompletion}%</td>
                  <td className="px-3 py-3 tabular-nums">{v(r.metrics.comprehension)}</td>
                  <td className="px-3 py-3 tabular-nums">{v(r.metrics.implementation)}</td>
                  <td className="px-3 py-3 tabular-nums">{v(r.metrics.workReadiness)}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatDate(r.lastActivity)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.stagnant && <Badge tone="warning">学習停滞の可能性</Badge>}
                      {r.pendingReviews > 0 && <Badge tone="accent">レビュー待ち {r.pendingReviews}</Badge>}
                      {r.struggling.length > 0 && <Badge tone="danger">要フォロー</Badge>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      )}
      {pages > 1 && (
        <nav aria-label="ページ送り" className="mt-4 flex flex-wrap items-center gap-2">
          {page > 1 && <Link href={pageHref(page - 1)} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm">前へ</Link>}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              aria-current={n === page ? "page" : undefined}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm ${n === page ? "border-accent bg-accent-soft font-semibold text-accent-strong" : "border-border"}`}
            >
              {n}
            </Link>
          ))}
          {page < pages && <Link href={pageHref(page + 1)} className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm">次へ</Link>}
        </nav>
      )}
    </div>
  );
}
