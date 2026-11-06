"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSchedule, createLesson, moveLesson, publishVersion, restoreVersionAsDraft, scheduleVersion, type CmsState } from "@/app/actions/cms";
import { Button, inputStyles } from "@/components/ui";
import { hasUnsavedLessonEdits } from "./lesson-editor";

function Msg({ state }: { state: CmsState }) {
  if (!state) return null;
  return (
    <div aria-live="polite">
      {state.ok && <p role="status" className="rounded-lg bg-success-soft p-3 text-sm text-success">{state.ok}</p>}
      {state.error && <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{state.error}</p>}
      {state.errors && state.errors.length > 0 && (
        <ul role="alert" className="list-disc rounded-lg bg-danger-soft p-3 pl-7 text-sm text-danger">
          {state.errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
    </div>
  );
}

export function NewLessonForm({ moduleId, level }: { moduleId: string; level: string }) {
  const [state, action, pending] = useActionState(createLesson, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.lessonId) router.push(`/admin/content/lessons/${state.lessonId}`);
  }, [state?.lessonId, router]);
  return (
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">{level} にレッスンを追加</summary>
      <form action={action} className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <input type="hidden" name="moduleId" value={moduleId} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`t-${moduleId}`} className="text-sm font-semibold">タイトル</label>
          <input id={`t-${moduleId}`} name="title" className={inputStyles} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`s-${moduleId}`} className="text-sm font-semibold">URL 名 (例: l2-strings)</label>
          <input id={`s-${moduleId}`} name="slug" className={inputStyles} autoCapitalize="off" />
        </div>
        <Button type="submit" disabled={pending}>作成</Button>
        <div className="sm:col-span-3"><Msg state={state} /></div>
      </form>
    </details>
  );
}

export function MoveButtons({ lessonId, first, last }: { lessonId: string; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  return (
    <span className="flex gap-1">
      <button type="button" aria-label="上へ移動" disabled={first || pending} onClick={() => start(() => moveLesson(lessonId, "up"))} className="min-h-11 min-w-11 rounded-lg border border-border text-sm disabled:opacity-40">↑</button>
      <button type="button" aria-label="下へ移動" disabled={last || pending} onClick={() => start(() => moveLesson(lessonId, "down"))} className="min-h-11 min-w-11 rounded-lg border border-border text-sm disabled:opacity-40">↓</button>
    </span>
  );
}

export function PublishPanel({ lessonId, versionId, version, scheduled }: { lessonId: string; versionId: string; version: number; scheduled: boolean }) {
  const [state, setState] = useState<CmsState>(undefined);
  const [at, setAt] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<CmsState>) =>
    start(async () => {
      const r = await fn();
      setState(r);
      if (r?.ok) router.refresh();
    });
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">版 {version} (下書き) を公開します。公開すると受講生の画面がこの版に切り替わります。受講生のこれまでの完了記録は残ります。</p>
      <Button type="button" disabled={pending} onClick={() => run(() => publishVersion(lessonId, versionId))}>今すぐ公開する</Button>
      {!scheduled && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <label htmlFor="publishAt" className="text-sm font-semibold">公開を予約する (日本時間)</label>
          <input id="publishAt" type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className={inputStyles} />
          <Button type="button" variant="secondary" disabled={pending || !at} onClick={() => run(() => scheduleVersion(lessonId, versionId, at))}>予約する</Button>
        </div>
      )}
      <Msg state={state} />
    </div>
  );
}

export function CancelScheduleButton({ lessonId }: { lessonId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="flex flex-col gap-1">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              await cancelSchedule(lessonId);
            } catch {
              setError("予約を取り消せませんでした。ページを再読み込みしてください。");
            }
          })
        }
      >
        {pending ? "取り消しています…" : "予約を取り消す"}
      </Button>
      {error && <span role="alert" className="text-sm text-danger">{error}</span>}
    </span>
  );
}

export function VersionActions({ lessonId, versionId, canRepublish }: { lessonId: string; versionId: string; canRepublish: boolean }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<CmsState>(undefined);
  return (
    <span className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (hasUnsavedLessonEdits() && !window.confirm("保存していない編集があります。この版から下書きを作ると、その編集は失われます。続けますか?")) return;
          start(async () => {
            await restoreVersionAsDraft(lessonId, versionId);
            window.location.reload(); // 編集フォームを復元した内容で読み直す
          });
        }}
        className="min-h-11 rounded-lg px-2 text-sm text-accent hover:bg-accent-soft">この版から下書きを作る</button>
      {canRepublish && (
        <button type="button" disabled={pending} onClick={() => {
            if (!window.confirm("この版を受講生に公開します。よろしいですか?")) return;
            start(async () => setState(await publishVersion(lessonId, versionId)));
          }} className="min-h-11 rounded-lg px-2 text-sm text-accent hover:bg-accent-soft">この版に戻して公開</button>
      )}
      {state?.error && <span role="alert" className="text-sm text-danger">{state.error}</span>}
    </span>
  );
}
