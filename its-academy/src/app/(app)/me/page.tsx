import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { isStaff, ROLE_LABEL } from "@/lib/auth/roles";
import { Card, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/labels";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "マイページ" };

export default async function MePage() {
  const me = await requireUser(undefined, { allowPendingPasswordChange: true });
  const user = await db.user.findUniqueOrThrow({
    where: { id: me.id },
    select: { name: true, email: true, role: true, affiliation: true, joinedAt: true, lastLoginAt: true, mustChangePassword: true },
  });
  const enrollment = await db.enrollment.findFirst({ where: { userId: me.id }, include: { course: true, instructor: { select: { name: true } } } });
  const rows: [string, string][] = [
    ["氏名", user.name],
    ["メールアドレス", user.email],
    ["権限", ROLE_LABEL[user.role]],
    ["所属", user.affiliation ?? "—"],
    ["入校日", formatDate(user.joinedAt)],
    ...(enrollment
      ? ([
          ["受講コース", enrollment.course.title],
          ["学習開始日", formatDate(enrollment.startedAt)],
          ["目標修了日", formatDate(enrollment.targetEndDate)],
          ["担当講師", enrollment.instructor?.name ?? "未設定"],
        ] as [string, string][])
      : []),
  ];
  const profileCard = (
      <Card>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="break-all">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>
  );
  const passwordCard = (
    <Card className="max-w-lg" id="password">
      <h2 className="font-bold">パスワードの変更</h2>
      {user.mustChangePassword && (
        <p className="mt-2 text-sm text-muted">はじめに、受け取ったパスワードを自分だけのパスワードに変更してください。変更すると、すべての画面を使えるようになります。</p>
      )}
      <div className="mt-4">
        <PasswordForm homeHref={isStaff(user.role) ? "/admin" : "/home"} />
      </div>
    </Card>
  );
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="マイページ" description="登録情報の変更は管理者に依頼してください。" />
      {/* 仮パスワードのままなら、パスワードの変更を登録情報より先に表示する。
          パスワード欄は常に同じ位置に置く (変更直後の再描画で入力欄と完了メッセージが消えないように) */}
      {!user.mustChangePassword && profileCard}
      {passwordCard}
      {user.mustChangePassword && profileCard}
    </div>
  );
}
