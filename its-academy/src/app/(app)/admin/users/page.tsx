import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { ADMIN_ROLES, canAssignRole, canManageAccount, ROLE_LABEL } from "@/lib/auth/roles";
import type { Role } from "@prisma/client";
import { Badge, PageHeader, ScrollRegion } from "@/components/ui";
import { formatDateTime } from "@/lib/labels";
import { AccountControls } from "./account-controls";

export const metadata: Metadata = { title: "アカウント" };

const ALL_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"];

export default async function UsersPage() {
  const me = await requireUser(ADMIN_ROLES);
  const users = await db.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, email: true, role: true, isActive: true, mustChangePassword: true, lastLoginAt: true },
  });
  const assignable = ALL_ROLES.filter((r) => canAssignRole(me.role, r));

  return (
    <div>
      <PageHeader
        title="アカウント"
        description="権限の変更・仮パスワードの発行・利用停止を行います。自分自身と、自分と同じか上位の権限のアカウントは操作できません。操作はすべて監査ログに残ります。"
      />
      <ScrollRegion label="アカウントの一覧" className="rounded-xl border border-border">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              {["氏名", "メールアドレス", "権限", "状態", "最終ログイン", "操作"].map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="align-top">
                <td className="px-3 py-3 font-semibold">{u.name}{u.id === me.id && <span className="ml-1 text-xs text-muted">(自分)</span>}</td>
                <td className="px-3 py-3 break-all">{u.email}</td>
                <td className="px-3 py-3">{ROLE_LABEL[u.role]}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge tone={u.isActive ? "success" : "neutral"}>{u.isActive ? "利用中" : "停止中"}</Badge>
                    {u.mustChangePassword && <Badge tone="warning">仮パスワード</Badge>}
                  </div>
                </td>
                <td className="px-3 py-3">{formatDateTime(u.lastLoginAt)}</td>
                <td className="px-3 py-3">
                  {canManageAccount(me, u) ? (
                    <AccountControls user={{ id: u.id, name: u.name, role: u.role, isActive: u.isActive }} roles={assignable.map((r) => ({ value: r, label: ROLE_LABEL[r] }))} />
                  ) : (
                    <span className="text-muted">操作できません</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollRegion>
    </div>
  );
}
