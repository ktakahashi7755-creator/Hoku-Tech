import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { isAdmin, STAFF_ROLES } from "@/lib/auth/roles";
import { listStudentOverviews } from "@/lib/queries/staff";
import { Badge, ButtonLink, EmptyState, PageHeader, ScrollRegion } from "@/components/ui";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = { title: "受講生" };

const v = (x: number | null) => (x === null ? "—" : x);

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const viewer = await requireUser(STAFF_ROLES);
  const { filter } = await searchParams;
  let rows = await listStudentOverviews(viewer);
  if (filter === "stagnant") rows = rows.filter((r) => r.stagnant);
  if (filter === "review") rows = rows.filter((r) => r.pendingReviews > 0);

  const tabs = [
    ["", "すべて"],
    ["stagnant", "学習停滞の可能性"],
    ["review", "レビュー待ちあり"],
  ] as const;

  return (
    <div>
      <PageHeader
        title="受講生"
        description="A 教材履修率 / B 課題完了率 / C 理解度 / D 実装能力 / E 実務準備 は別々の指標です。"
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
      {rows.length === 0 ? (
        <EmptyState>該当する受講生はいません。</EmptyState>
      ) : (
        <ScrollRegion label="受講生の一覧" className="rounded-xl border border-border">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                {["氏名", "所属", "現在の学習領域", "A 履修率", "B 課題完了", "C 理解度", "D 実装能力", "E 実務準備", "最終学習", "状態"].map((h) => (
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
                  <td className="px-3 py-3">{formatDate(r.lastActivity)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.stagnant && <Badge tone="warning">停滞の可能性</Badge>}
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
    </div>
  );
}
