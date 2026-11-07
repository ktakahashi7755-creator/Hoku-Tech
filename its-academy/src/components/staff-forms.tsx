"use client";

import { useActionState, useState, useTransition } from "react";
import { cleanupStaleRecords } from "@/app/actions/accounts";
import { addComment, addSkillAssessment, createStudent, updateEnrollment, updateSettings, type NewStudentState } from "@/app/actions/staff";
import { ActionForm } from "./action-form";
import { Button, Field, FormMessage, inputStyles } from "./ui";

export function CommentForm({ studentId }: { studentId: string }) {
  const [state, action, pending] = useActionState(addComment, undefined);
  return (
    <ActionForm action={action} state={state} resetOnSuccess className="flex flex-col gap-3">
      <input type="hidden" name="studentId" value={studentId} />
      <Field label="コメント" htmlFor="body" error={state?.fieldErrors?.body}>
        <textarea id="body" name="body" rows={3} className={inputStyles} required maxLength={5000} />
      </Field>
      <fieldset className="flex min-w-0 flex-wrap gap-4 text-sm">
        <legend className="mb-1 font-semibold">公開範囲</legend>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="visibility" value="INTERNAL" defaultChecked /> 講師・管理者のみ</label>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="visibility" value="STUDENT" /> 受講生にも表示</label>
      </fieldset>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending}>コメントを保存</Button>
    </ActionForm>
  );
}

export function SkillForm({ studentId, areas, levels }: { studentId: string; areas: readonly { key: string; label: string }[]; levels: Record<number, string> }) {
  const [state, action, pending] = useActionState(addSkillAssessment, undefined);
  return (
    <ActionForm action={action} state={state} resetOnSuccess className="flex flex-col gap-3">
      <input type="hidden" name="studentId" value={studentId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="観点" htmlFor="skill">
          <select id="skill" name="skill" className={inputStyles}>
            {areas.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </Field>
        <Field label="レベル" htmlFor="level">
          <select id="level" name="level" className={inputStyles} defaultValue={3}>
            {Object.entries(levels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Field label="根拠・メモ" htmlFor="note" hint="どの課題・面談をもとに評価したかを書いてください (1,000 文字まで)。">
        <input id="note" name="note" className={inputStyles} maxLength={1000} />
      </Field>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending}>評価を記録</Button>
    </ActionForm>
  );
}

export function EnrollmentForm({ enrollment, instructors }: { enrollment: { id: string; instructorId: string | null; targetEndDate: string; status: string }; instructors: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(updateEnrollment, undefined);
  return (
    <ActionForm
      action={action}
      className="flex flex-col gap-3"
      confirm={(_submitter, form) => {
        const next = new FormData(form).get("status");
        if (next === enrollment.status) return null;
        if (next === "WITHDRAWN") return "受講状態を「退校」にします。受講生は課題を提出できなくなります。よろしいですか?";
        if (next === "COMPLETED") return "受講状態を「修了」にします。よろしいですか?";
        if (next === "PAUSED") return "受講状態を「休止中」にします。休止中は課題を提出できません。よろしいですか?";
        return null;
      }}
    >
      <input type="hidden" name="enrollmentId" value={enrollment.id} />
      <Field label="担当講師" htmlFor="instructorId" error={state?.fieldErrors?.instructorId}>
        <select id="instructorId" name="instructorId" defaultValue={enrollment.instructorId ?? ""} className={inputStyles}>
          <option value="">未設定</option>
          {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </Field>
      <Field label="目標修了日 (学習期限)" htmlFor="targetEndDate">
        <input id="targetEndDate" name="targetEndDate" type="date" defaultValue={enrollment.targetEndDate} className={inputStyles} />
      </Field>
      <Field label="受講状態" htmlFor="status">
        <select id="status" name="status" defaultValue={enrollment.status} className={inputStyles}>
          <option value="ACTIVE">受講中</option>
          <option value="PAUSED">休止中</option>
          <option value="COMPLETED">修了</option>
          <option value="WITHDRAWN">退校</option>
        </select>
      </Field>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending}>受講設定を保存</Button>
    </ActionForm>
  );
}

export function NewStudentForm({ instructors }: { instructors: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<NewStudentState, FormData>(createStudent, undefined);
  return (
    <ActionForm action={action} state={state} resetOnSuccess className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="氏名" htmlFor="name" error={state?.fieldErrors?.name}><input id="name" name="name" className={inputStyles} /></Field>
        <Field label="メールアドレス" htmlFor="email" error={state?.fieldErrors?.email}><input id="email" name="email" type="email" className={inputStyles} /></Field>
        <Field label="所属" htmlFor="affiliation"><input id="affiliation" name="affiliation" className={inputStyles} /></Field>
        <Field label="入校日" htmlFor="joinedAt"><input id="joinedAt" name="joinedAt" type="date" className={inputStyles} /></Field>
        <Field label="担当講師" htmlFor="instructorId">
          <select id="instructorId" name="instructorId" className={inputStyles} defaultValue="">
            <option value="">未設定</option>
            {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </Field>
        <Field label="目標修了日 (学習期限)" htmlFor="targetEndDate"><input id="targetEndDate" name="targetEndDate" type="date" className={inputStyles} /></Field>
      </div>
      <FormMessage state={state} />
      {state?.tempPassword && (
        <div className="rounded-lg border border-warning bg-warning-soft p-4 text-sm">
          <p className="font-semibold">仮パスワード (この画面を離れると再表示できません)</p>
          <p className="mt-2 font-mono text-base">{state.email} / {state.tempPassword}</p>
          <p className="mt-2">受講生に安全な方法で伝え、初回ログイン後にマイページで変更するよう案内してください。チャットに貼る場合は、伝えた後にメッセージを削除してください。</p>
        </div>
      )}
      <Button type="submit" disabled={pending}>{pending ? "追加しています…" : "追加する"}</Button>
    </ActionForm>
  );
}

export function SettingsForm({ threshold }: { threshold: number }) {
  const [state, action, pending] = useActionState(updateSettings, undefined);
  return (
    <ActionForm action={action} className="flex flex-col gap-3">
      <Field label="学習停滞とみなす日数" htmlFor="stagnationThresholdDays" hint="最終学習日からこの日数以上経過した受講生をダッシュボードに表示します (1〜60 日)。" error={state?.fieldErrors?.stagnationThresholdDays}>
        <input id="stagnationThresholdDays" name="stagnationThresholdDays" type="number" min={1} max={60} defaultValue={threshold} className={`${inputStyles} max-w-40`} />
      </Field>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending} className="self-start">保存</Button>
    </ActionForm>
  );
}

export function CleanupButton() {
  const [state, setState] = useState<{ ok?: string; error?: string } | undefined>(undefined);
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        className="self-start"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("期限切れのセッションと 30 日より前のログイン試行の記録を削除します。元に戻せません。よろしいですか?")) return;
          start(async () => {
            try {
              setState(await cleanupStaleRecords());
            } catch {
              setState({ error: "削除できませんでした。時間をおいて再度お試しください。" });
            }
          });
        }}
      >
        {pending ? "削除しています…" : "古い記録を削除する"}
      </Button>
      <div aria-live="polite">
        {state?.ok && <p role="status" className="text-sm text-success">{state.ok}</p>}
        {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      </div>
    </div>
  );
}
