import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES, ROLE_LABEL } from "@/lib/auth/roles";
import { getStagnationThreshold } from "@/lib/queries/settings";
import { Card, PageHeader, ScrollRegion } from "@/components/ui";
import { SettingsForm } from "@/components/staff-forms";
import { formatDateTime } from "@/lib/labels";

export const metadata: Metadata = { title: "設定" };

export default async function SettingsPage() {
  await requireUser(ADMIN_ROLES);
  const threshold = await getStagnationThreshold();
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { actor: { select: { name: true, role: true } } } });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="設定" />
      <Card className="max-w-xl">
        <h2 className="font-bold">学習停滞の検知</h2>
        <div className="mt-4"><SettingsForm threshold={threshold} /></div>
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
                  <td className="py-2">{formatDateTime(l.createdAt)}</td>
                  <td className="py-2">{l.actor ? `${l.actor.name} (${ROLE_LABEL[l.actor.role]})` : "—"}</td>
                  <td className="py-2 font-mono text-xs">{l.action}</td>
                  <td className="py-2 font-mono text-xs">{l.targetType ? `${l.targetType}:${l.targetId}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollRegion>
      </Card>
    </div>
  );
}
