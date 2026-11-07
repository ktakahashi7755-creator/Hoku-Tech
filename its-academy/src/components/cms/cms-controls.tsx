"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSchedule, createLesson, moveLesson, publishVersion, restoreVersionAsDraft, scheduleVersion, type CmsState } from "@/app/actions/cms";
import { Button, Field, FormMessage, inputStyles } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { hasUnsavedLessonEdits } from "./lesson-editor";
import { announce } from "./notice";

export function NewLessonForm({ moduleId, level }: { moduleId: string; level: string }) {
  const [state, action, pending] = useActionState(createLesson, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.lessonId) router.push(`/admin/content/lessons/${state.lessonId}`);
  }, [state?.lessonId, router]);
  return (
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">{level} にレッスンを追加</summary>
      <ActionForm action={action} className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <input type="hidden" name="moduleId" value={moduleId} />
        <Field label="タイトル" htmlFor={`t-${moduleId}`}>
          <input id={`t-${moduleId}`} name="title" className={inputStyles} />
        </Field>
        <Field label="URL 名 (例: l2-strings)" htmlFor={`s-${moduleId}`}>
          <input id={`s-${moduleId}`} name="slug" className={inputStyles} autoCapitalize="off" />
        </Field>
        <Button type="submit" disabled={pending}>作成</Button>
        <div className="sm:col-span-3"><FormMessage state={state} /></div>
      </ActionForm>
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
  const [at, setAt] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  // 結果は画面の上部に出す (公開するとこの欄は消えるため)
  const run = (fn: () => Promise<CmsState>) =>
    start(async () => {
      const r = await fn().catch((): CmsState => ({ error: "操作できませんでした。ページを再読み込みしてください。" }));
      announce(r);
      if (r?.ok) router.refresh();
    });
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">版 {version} (下書き) を公開します。公開すると受講生の画面がこの版に切り替わります。受講生のこれまでの完了記録は残ります。</p>
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("この版を今すぐ受講生に公開します。よろしいですか?")) run(() => publishVersion(lessonId, versionId));
        }}
      >
        今すぐ公開する
      </Button>
      {!scheduled && (
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <label htmlFor="publishAt" className="text-sm font-semibold">公開を予約する (日本時間)</label>
          <input id="publishAt" type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className={inputStyles} />
          <Button type="button" variant="secondary" disabled={pending || !at} onClick={() => {
            if (window.confirm(`この版を ${at.replace("T", " ")} (日本時間) に公開するよう予約します。よろしいですか?`)) run(() => scheduleVersion(lessonId, versionId, at));
          }}>予約する</Button>
        </div>
      )}
    </div>
  );
}

export function CancelScheduleButton({ lessonId }: { lessonId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <span className="flex flex-col gap-1">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("公開の予約を取り消します。よろしいですか?")) return;
          start(async () => {
            try {
              await cancelSchedule(lessonId);
              announce({ ok: "公開の予約を取り消しました。予約していた版は、公開されていない版として履歴に残ります。" });
              router.refresh();
            } catch {
              announce({ error: "予約を取り消せませんでした。ページを再読み込みしてください。" });
            }
          });
        }}
      >
        {pending ? "取り消しています…" : "予約を取り消す"}
      </Button>
    </span>
  );
}

export function VersionActions({ lessonId, versionId, canRepublish }: { lessonId: string; versionId: string; canRepublish: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
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
            start(async () => {
              const r = await publishVersion(lessonId, versionId).catch((): CmsState => ({ error: "公開できませんでした。ページを再読み込みしてください。" }));
              announce(r);
              if (r?.ok) router.refresh();
            });
          }} className="min-h-11 rounded-lg px-2 text-sm text-accent hover:bg-accent-soft">この版に戻して公開</button>
      )}
    </span>
  );
}
