"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSchedule, createLesson, moveLesson, publishVersion, restoreVersionAsDraft, scheduleVersion, type CmsState, type EditBase } from "@/app/actions/cms";
import { Button, Field, FormMessage, inputStyles } from "@/components/ui";
import { ActionForm } from "@/components/action-form";
import { allowLeavingWithoutSave, currentEditBase, hasUnsavedLessonEdits, savedDraftVersion } from "./lesson-editor";
import { announce, reloadWithNotice } from "./notice";
import { NETWORK_ERROR, withNetworkFallback } from "@/lib/safe-action";

export function NewLessonForm({ moduleId, level }: { moduleId: string; level: string }) {
  const [state, action, pending] = useActionState(withNetworkFallback(createLesson, { error: NETWORK_ERROR }), undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.lessonId) router.push(`/admin/content/lessons/${state.lessonId}`);
  }, [state?.lessonId, router]);
  return (
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer content-center text-sm font-semibold text-accent">{level} にレッスンを追加</summary>
      <ActionForm action={action} state={state} className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
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

export function MoveButtons({ lessonId, title, first, last }: { lessonId: string; title: string; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const move = (direction: "up" | "down") =>
    start(async () => {
      setError(null);
      await moveLesson(lessonId, direction).catch(() => setError("並べ替えできませんでした。通信を確認してください。"));
    });
  return (
    <span className="flex flex-wrap items-center gap-1">
      {/* 一覧の中で、どのレッスンのボタンかが読み上げで分かるようにする */}
      <button type="button" aria-label={`「${title}」を上へ移動`} disabled={first || pending} onClick={() => move("up")} className="min-h-11 min-w-11 rounded-lg border border-border text-sm disabled:opacity-40">↑</button>
      <button type="button" aria-label={`「${title}」を下へ移動`} disabled={last || pending} onClick={() => move("down")} className="min-h-11 min-w-11 rounded-lg border border-border text-sm disabled:opacity-40">↓</button>
      {error && <span role="alert" className="text-sm text-danger">{error}</span>}
    </span>
  );
}

/** datetime-local の値 (日本時間として扱う) が現在より後か。サーバーでも同じ確認をする */
function isFutureJst(local: string): boolean {
  const t = new Date(`${local.length === 16 ? local + ":00" : local}+09:00`).getTime();
  return Number.isFinite(t) && t > Date.now();
}

export function PublishPanel({ lessonId, versionId, version, scheduled }: { lessonId: string; versionId: string; version: number; scheduled: boolean }) {
  const [at, setAt] = useState("");
  const [atError, setAtError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  // 結果は画面の上部に出す (公開するとこの欄は消えるため)
  const run = (fn: () => Promise<CmsState>) =>
    start(async () => {
      const r = await fn().catch((): CmsState => ({ error: "操作できませんでした。ページを再読み込みしてください。" }));
      announce(lessonId, r);
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
          <input
            id="publishAt"
            type="datetime-local"
            value={at}
            onChange={(e) => {
              setAt(e.target.value);
              setAtError(null);
            }}
            aria-invalid={atError ? true : undefined}
            aria-describedby={atError ? "publishAt-error" : undefined}
            className={inputStyles}
          />
          {atError && <p id="publishAt-error" role="alert" className="text-sm text-danger">{atError}</p>}
          <Button type="button" variant="secondary" disabled={pending || !at} onClick={() => {
            // 確認の後でサーバーに断られないよう、過去の日時は確認を出す前に知らせる
            if (!isFutureJst(at)) {
              setAtError("公開日時は現在より後にしてください。");
              return;
            }
            if (window.confirm(`この版を ${at.replace("T", " ")} (日本時間) に公開するよう予約します。よろしいですか?`)) run(() => scheduleVersion(lessonId, versionId, at));
          }}>予約する</Button>
        </div>
      )}
    </div>
  );
}

/** version: 予約していた版。becomesDraft: その版が最新 (取り消すと下書きとして編集の対象に戻る) か */
export function CancelScheduleButton({ lessonId, version, becomesDraft }: { lessonId: string; version: number; becomesDraft: boolean }) {
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
              announce(lessonId, {
                ok: becomesDraft
                  ? `公開の予約を取り消しました。予約していた版 (版 ${version}) は下書きに戻りました。`
                  : `公開の予約を取り消しました。予約していた版 (版 ${version}) は、公開されていない版として履歴に残ります。`,
              });
              router.refresh();
            } catch {
              announce(lessonId, { error: "予約を取り消せませんでした。ページを再読み込みしてください。" });
            }
          });
        }}
      >
        {pending ? "取り消しています…" : "予約を取り消す"}
      </Button>
    </span>
  );
}

/**
 * 版の履歴の操作。draftVersion: いまある下書きの版 (なければ null)。expected: 画面を開いたときの最新の版
 * (ほかの画面で保存された下書きを、確認しないまま置き換えないため)
 */
export function VersionActions({ lessonId, versionId, version, canRepublish, draftVersion, expected }: {
  lessonId: string;
  versionId: string;
  version: number;
  canRepublish: boolean;
  draftVersion: number | null;
  expected: EditBase;
}) {
  const [pending, start] = useTransition();
  const unsavedNote = "保存していない編集があります。続けると、その編集は失われます。";
  return (
    <span className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          // 保存済みの下書きも置き換わるため、下書きがあるときは必ず確認する (画面を開いた後にこの画面で保存した下書きも含める)
          const draftNow = savedDraftVersion(lessonId) ?? draftVersion;
          const warnings = [
            draftNow !== null && `下書き (版 ${draftNow}) があります。この版 (版 ${version}) の内容で上書きします (いまの下書きの内容は残りません)。`,
            hasUnsavedLessonEdits() && unsavedNote,
          ].filter(Boolean);
          if (warnings.length > 0 && !window.confirm(`${warnings.join("\n")}\nよろしいですか?`)) return;
          start(async () => {
            // 自分が保存した後は、その保存を元にする (画面を開いたときの値のままだと、自分の保存を「ほかの画面の保存」と取り違える)
            const r = await restoreVersionAsDraft(lessonId, versionId, currentEditBase(lessonId) ?? expected).catch((): CmsState => ({ error: "下書きを作れませんでした。通信を確認して、もう一度お試しください。" }));
            if (!r?.ok || r.version === undefined) return announce(lessonId, r);
            allowLeavingWithoutSave(); // 確認済みなので、再読み込みでもう一度確認を出さない
            reloadWithNotice({ kind: "restored", from: version, to: r.version }); // 編集フォームを復元した内容で読み直す
          });
        }}
        className="min-h-11 rounded-lg px-2 text-sm text-accent hover:bg-accent-soft">この版から下書きを作る</button>
      {canRepublish && (
        <button type="button" disabled={pending} onClick={() => {
            if (!window.confirm(`${hasUnsavedLessonEdits() ? unsavedNote + "\n" : ""}この版 (版 ${version}) を受講生に公開します。よろしいですか?`)) return;
            start(async () => {
              const r = await publishVersion(lessonId, versionId).catch((): CmsState => ({ error: "公開できませんでした。ページを再読み込みしてください。" }));
              if (!r?.ok) return announce(lessonId, r);
              // 下書きがないときは編集フォームが公開中の版の内容を表示しているため、再読み込みして入れ替える
              allowLeavingWithoutSave();
              reloadWithNotice({ kind: "republished", version });
            });
          }} className="min-h-11 rounded-lg px-2 text-sm text-accent hover:bg-accent-soft">この版に戻して公開</button>
      )}
    </span>
  );
}
