"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAssignment, duplicateRubric, updateAssignment, updateRubric, type AssignState } from "@/app/actions/cms-assign";
import type { AssignmentForm } from "@/lib/content/assignment-form";
import { ASSIGNMENT_TYPE_LABEL } from "@/lib/labels";
import { Button, Card, Field, FormMessage, inputStyles } from "@/components/ui";
import { ActionForm } from "@/components/action-form";

const FIELDS: { key: keyof AssignmentForm; label: string; rows: number; hint?: string }[] = [
  { key: "purpose", label: "課題の目的", rows: 2 },
  { key: "scenario", label: "想定シーン", rows: 2 },
  { key: "requirements", label: "必須要件", rows: 6, hint: "1 行に 1 項目" },
  { key: "recommended", label: "推奨要件 (加点)", rows: 3, hint: "1 行に 1 項目" },
  { key: "steps", label: "作業手順", rows: 5, hint: "1 行に 1 項目" },
  { key: "deliverables", label: "提出物", rows: 3, hint: "1 行に 1 項目" },
  { key: "readmeChecklist", label: "README に書くこと", rows: 3, hint: "1 行に 1 項目" },
  { key: "resubmitCondition", label: "再提出について", rows: 2 },
  { key: "interviewPoints", label: "面談で確認すること", rows: 3, hint: "1 行に 1 項目" },
];

export function AssignmentEditor({ id, initial, rubricId, rubrics }: { id: string; initial: AssignmentForm; rubricId: string; rubrics: { id: string; name: string }[] }) {
  const [f, setF] = useState(initial);
  const [rubric, setRubric] = useState(rubricId);
  const [state, setState] = useState<AssignState>(undefined);
  const [pending, start] = useTransition();
  const router = useRouter();
  const set = (k: keyof AssignmentForm, v: string | number) => setF((p) => ({ ...p, [k]: v }));
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await updateAssignment(id, f, rubric);
          setState(r);
          if (r?.ok) router.refresh();
        });
      }}
    >
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="a-title" className="text-sm font-semibold">タイトル</label>
          <input id="a-title" value={f.title} onChange={(e) => set("title", e.target.value)} className={inputStyles} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-pass" className="text-sm font-semibold">合格点 (100 点満点)</label>
            <input id="a-pass" type="number" min={1} max={100} value={f.passScore} onChange={(e) => set("passScore", Number(e.target.value))} className={inputStyles} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-rubric" className="text-sm font-semibold">ルーブリック</label>
            <select id="a-rubric" value={rubric} onChange={(e) => setRubric(e.target.value)} className={inputStyles}>
              {rubrics.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-status" className="text-sm font-semibold">公開</label>
            <select id="a-status" value={f.status} onChange={(e) => set("status", e.target.value)} className={inputStyles}>
              <option value="PUBLISHED">公開中</option>
              <option value="DRAFT">非公開</option>
            </select>
          </div>
        </div>
        {FIELDS.map((fld) => (
          <div key={fld.key} className="flex flex-col gap-1.5">
            <label htmlFor={`a-${fld.key}`} className="text-sm font-semibold">{fld.label}</label>
            <textarea id={`a-${fld.key}`} rows={fld.rows} value={String(f[fld.key])} onChange={(e) => set(fld.key, e.target.value)} className={inputStyles} />
            {fld.hint && <p className="text-xs text-muted">{fld.hint}</p>}
          </div>
        ))}
      </Card>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending} className="self-start">保存</Button>
    </form>
  );
}

type Criterion = { key: string; label: string; weight: number; description: string };

export function RubricEditor({ id, name, initial }: { id: string; name: string; initial: Criterion[] }) {
  const [n, setN] = useState(name);
  const [rows, setRows] = useState<Criterion[]>(initial);
  const [state, setState] = useState<AssignState>(undefined);
  const [pending, start] = useTransition();
  const router = useRouter();
  const total = rows.reduce((s, r) => s + (Number(r.weight) || 0), 0);
  const update = (i: number, patch: Partial<Criterion>) => setRows((p) => p.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await updateRubric(id, n, rows);
          setState(r);
          if (r?.ok) router.refresh();
        });
      }}
    >
      <p className="rounded-lg bg-accent-soft p-3 text-sm text-accent-strong">
        変更は、これからの採点に使われます。過去の採点は、採点した時点の観点と配点のまま残ります。
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="r-name" className="text-sm font-semibold">名前</label>
        <input id="r-name" value={n} onChange={(e) => setN(e.target.value)} className={inputStyles} />
      </div>
      {rows.map((r, i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">観点 {i + 1}</span>
            <button type="button" className="min-h-9 rounded px-2 text-sm text-danger hover:bg-danger-soft" onClick={() => setRows((p) => p.filter((_, j) => j !== i))}>削除</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`r-label-${i}`} className="text-sm font-semibold">観点の名前</label>
              <input id={`r-label-${i}`} value={r.label} onChange={(e) => update(i, { label: e.target.value })} className={inputStyles} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`r-weight-${i}`} className="text-sm font-semibold">配点</label>
              <input id={`r-weight-${i}`} type="number" min={1} value={r.weight} onChange={(e) => update(i, { weight: Number(e.target.value) })} className={inputStyles} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`r-desc-${i}`} className="text-sm font-semibold">説明 (講師が採点の基準にする)</label>
            <input id={`r-desc-${i}`} value={r.description} onChange={(e) => update(i, { description: e.target.value })} className={inputStyles} />
          </div>
        </Card>
      ))}
      <Button type="button" variant="secondary" className="self-start" onClick={() => setRows((p) => [...p, { key: "", label: "", weight: 0, description: "" }])}>観点を追加</Button>
      <p className={total === 100 ? "font-semibold text-success" : "font-semibold text-warning"} aria-live="polite">配点の合計: {total} / 100</p>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>保存</Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => start(async () => {
            const r = await duplicateRubric(id);
            if (r?.id) router.push(`/admin/content/rubrics/${r.id}`);
          })}
        >
          複製して新しいルーブリックを作る
        </Button>
      </div>
    </form>
  );
}

export function NewAssignmentForm({ moduleId, level, lessons }: { moduleId: string; level: string; lessons: { id: string; title: string }[] }) {
  const [state, action, pending] = useActionState(createAssignment, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.id) router.push(`/admin/content/assignments/${state.id}`);
  }, [state?.id, router]);
  return (
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">{level} に課題を追加</summary>
      <ActionForm action={action} className="mt-2 grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="moduleId" value={moduleId} />
        <Field label="タイトル" htmlFor={`na-t-${moduleId}`}>
          <input id={`na-t-${moduleId}`} name="title" className={inputStyles} />
        </Field>
        <Field label="URL 名 (例: a9-login-form)" htmlFor={`na-s-${moduleId}`}>
          <input id={`na-s-${moduleId}`} name="slug" className={inputStyles} autoCapitalize="off" />
        </Field>
        <Field label="形式" htmlFor={`na-type-${moduleId}`}>
          <select id={`na-type-${moduleId}`} name="type" className={inputStyles} defaultValue="CODE">
            {Object.entries(ASSIGNMENT_TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="前提のレッスン (完了すると取り組める)" htmlFor={`na-l-${moduleId}`}>
          <select id={`na-l-${moduleId}`} name="lessonId" className={inputStyles} defaultValue="">
            <option value="">なし</option>
            {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2"><FormMessage state={state} /></div>
        <Button type="submit" disabled={pending} className="self-start">作成</Button>
      </ActionForm>
    </details>
  );
}
