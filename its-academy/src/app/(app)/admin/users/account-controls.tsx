"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeRole, issueTemporaryPassword, setActive, type AccountState } from "@/app/actions/accounts";
import { Button, inputStyles } from "@/components/ui";

export function AccountControls({ user, roles }: { user: { id: string; name: string; role: string; isActive: boolean }; roles: { value: string; label: string }[] }) {
  const [role, setRole] = useState(user.role);
  const [state, setState] = useState<AccountState>(undefined);
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<AccountState>) =>
    start(async () => {
      const r = await fn();
      setState(r);
      router.refresh();
    });

  return (
    <div className="flex min-w-64 flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor={`role-${user.id}`} className="sr-only">{user.name} さんの権限</label>
        <select id={`role-${user.id}`} value={role} onChange={(e) => setRole(e.target.value)} className={`${inputStyles} min-h-10 py-1`}>
          {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <Button type="button" variant="secondary" disabled={pending || role === user.role} onClick={() => {
            const label = roles.find((r) => r.value === role)?.label ?? role;
            if (window.confirm(`${user.name} さんの権限を「${label}」に変更します。変更すると、その人はすべての端末でログアウトされます。よろしいですか?`)) run(() => changeRole(user.id, role));
          }}>
          変更
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" disabled={pending} onClick={() => {
          if (window.confirm(`${user.name} さんの仮パスワードを発行します。今のパスワードは使えなくなり、すべての端末でログアウトされます。よろしいですか?`)) run(() => issueTemporaryPassword(user.id));
        }}>
          仮パスワードを発行
        </Button>
        <Button type="button" variant={user.isActive ? "danger" : "secondary"} disabled={pending} onClick={() => {
          const message = user.isActive
            ? `${user.name} さんの利用を停止します。ログインできなくなり、すべての端末でログアウトされます。よろしいですか?`
            : `${user.name} さんの利用を再開します。よろしいですか?`;
          if (window.confirm(message)) run(() => setActive(user.id, !user.isActive));
        }}>
          {user.isActive ? "利用を停止" : "利用を再開"}
        </Button>
      </div>
      <div aria-live="polite">
        {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
        {state?.ok && <p role="status" className="text-sm text-success">{state.ok}</p>}
        {state?.tempPassword && (
          <p className="mt-1 rounded-lg border border-warning bg-warning-soft p-2 text-sm">
            仮パスワード (この画面を離れると再表示できません): <span className="font-mono">{state.tempPassword}</span>
            <br />本人に安全な方法で伝えてください。次回のログインで変更が求められます。
          </p>
        )}
      </div>
    </div>
  );
}
