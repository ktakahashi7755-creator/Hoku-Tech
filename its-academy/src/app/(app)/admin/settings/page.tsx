import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES, ROLE_LABEL } from "@/lib/auth/roles";
import { getStagnationThreshold } from "@/lib/queries/settings";
import { Card, PageHeader, ScrollRegion } from "@/components/ui";
import { CleanupButton, SettingsForm } from "@/components/staff-forms";
import { AUDIT_ACTION_LABEL, formatDateTime } from "@/lib/labels";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  await requireUser(ADMIN_ROLES);
  const threshold = await getStagnationThreshold();
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { actor: { select: { name: true, role: true } } } });
  const targetNames = await auditTargetNames(logs);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="設定" />
      <Card className="max-w-xl">
        <h2 className="font-bold">学習停滞の検知</h2>
        <div className="mt-4"><SettingsForm threshold={threshold} /></div>
      </Card>
      <Card className="max-w-xl">
        <h2 className="font-bold">記録の整理</h2>
        <p className="mt-1 text-sm text-muted">期限切れのログインセッションと、30 日より古いログイン試行の記録を削除します (月 1 回を目安)。</p>
        <div className="mt-4"><CleanupButton /></div>
      </Card>
      <Card>
        <h2 className="font-bold">監査ログ (直近 30 件)</h2>
        <ScrollRegion label="監査ログ" className="mt-3">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-2 font-semibold">日時</th>
                <th scope="col" className="py-2 font-semibold">操作者</th>
                <th scope="col" className="py-2 font-semibold">操作</th>
                <th scope="col" className="py-2 font-semibold">対象</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap py-2">{formatDateTime(l.createdAt)}</td>
                  <td className="py-2">{l.actor ? `${l.actor.name} (${ROLE_LABEL[l.actor.role]})` : "—"}</td>
                  <td className="py-2">
                    {AUDIT_ACTION_LABEL[l.action] ?? l.action}
                    <span className="ml-2 font-mono text-xs text-muted">{l.action}</span>
                  </td>
                  <td className="py-2">{l.targetType && l.targetId ? (targetNames.get(`${l.targetType}:${l.targetId}`) ?? `${l.targetType}:${l.targetId}`) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </Card>
    </div>
  );
}

/** 監査ログの対象 (ID) を、画面に出す名前に変える。種類ごとにまとめて 1 回ずつ読み込む */
async function auditTargetNames(logs: { targetType: string | null; targetId: string | null }[]): Promise<Map<string, string>> {
  const ids = (type: string) => [...new Set(logs.filter((l) => l.targetType === type && l.targetId).map((l) => l.targetId!))];
  const [users, lessons, assignments, rubrics, submissions, enrollments] = await Promise.all([
    db.user.findMany({ where: { id: { in: ids("user") } }, select: { id: true, name: true } }),
    db.lesson.findMany({ where: { id: { in: ids("lesson") } }, select: { id: true, slug: true, currentVersion: { select: { title: true } } } }),
    db.assignment.findMany({ where: { id: { in: ids("assignment") } }, select: { id: true, title: true } }),
    db.rubric.findMany({ where: { id: { in: ids("rubric") } }, select: { id: true, name: true } }),
    db.submission.findMany({ where: { id: { in: ids("submission") } }, select: { id: true, attemptNo: true, user: { select: { name: true } }, assignment: { select: { title: true } } } }),
    db.enrollment.findMany({ where: { id: { in: ids("enrollment") } }, select: { id: true, user: { select: { name: true } } } }),
  ]);
  const names = new Map<string, string>();
  for (const u of users) names.set(`user:${u.id}`, `アカウント: ${u.name}`);
  for (const l of lessons) names.set(`lesson:${l.id}`, `レッスン: ${l.currentVersion?.title ?? l.slug}`);
  for (const a of assignments) names.set(`assignment:${a.id}`, `課題: ${a.title}`);
  for (const r of rubrics) names.set(`rubric:${r.id}`, `ルーブリック: ${r.name}`);
  for (const s of submissions) names.set(`submission:${s.id}`, `提出: ${s.user.name} ・ ${s.assignment.title} (${s.attemptNo} 回目)`);
  for (const e of enrollments) names.set(`enrollment:${e.id}`, `受講設定: ${e.user.name}`);
  return names;
}
