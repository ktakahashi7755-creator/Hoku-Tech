"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { saveDraft, type CmsState } from "@/app/actions/cms";
import type { EditorDraft } from "@/lib/content/draft";
import { CODE_LANGUAGES } from "@/lib/content/languages";
import { Button, cx, inputStyles } from "@/components/ui";

/** 同じ画面のほかの操作 (版から下書きを作る など) が、保存していない編集を消さないかを確認するため */
let editorDirty = false;
export function hasUnsavedLessonEdits(): boolean {
  return editorDirty;
}

const LANGS = CODE_LANGUAGES;

function Section({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    // fieldset は既定で中身の幅より狭くならないため、min-w-0 でスマホの幅に収める
    <fieldset className="min-w-0 rounded-xl border border-border p-4 sm:p-5">
      <legend className="px-1 font-bold">
        <span className="mr-2 text-accent">{String(n).padStart(2, "0")}</span>
        {title}
      </legend>
      {hint && <p className="mb-3 text-sm text-muted">{hint}</p>}
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function Text({ label, value, onChange, rows, mono, id }: { label: string; value: string; onChange: (v: string) => void; rows?: number; mono?: boolean; id: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} spellCheck={!mono} className={cx(inputStyles, mono && "font-mono text-sm")} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputStyles} />
      )}
    </div>
  );
}

/** 繰り返し項目 (解説・演習・エラーなど) の追加・削除・並べ替え */
function Repeat<T>({ items, onChange, make, label, render }: { items: T[]; onChange: (v: T[]) => void; make: () => T; label: string; render: (item: T, set: (v: T) => void, i: number) => ReactNode }) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-muted">{label} {i + 1}</span>
            <span className="flex gap-1">
              <button type="button" className="min-h-9 rounded px-2 text-sm text-accent hover:bg-accent-soft disabled:opacity-40" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${label} ${i + 1} を上へ`}>↑</button>
              <button type="button" className="min-h-9 rounded px-2 text-sm text-accent hover:bg-accent-soft disabled:opacity-40" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`${label} ${i + 1} を下へ`}>↓</button>
              <button
                type="button"
                className="min-h-9 rounded px-2 text-sm text-danger hover:bg-danger-soft"
                aria-label={`${label} ${i + 1} を削除`}
                onClick={() => {
                  if (window.confirm(`${label} ${i + 1} を削除しますか? (保存するまでは元に戻せます: ページを再読み込み)`)) onChange(items.filter((_, j) => j !== i));
                }}
              >
                削除
              </button>
            </span>
          </div>
          {render(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))), i)}
        </div>
      ))}
      <Button type="button" variant="secondary" className="self-start" onClick={() => onChange([...items, make()])}>
        {label}を追加
      </Button>
    </div>
  );
}

export function LessonEditor({ lessonId, initial }: { lessonId: string; initial: EditorDraft }) {
  const [d, setD] = useState<EditorDraft>(initial);
  const [state, setState] = useState<CmsState>(undefined);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();
  const set = <K extends keyof EditorDraft>(k: K, v: EditorDraft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  };

  // 保存していない編集があるまま画面を離れようとしたら、ブラウザの確認を出す
  useEffect(() => {
    editorDirty = dirty;
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      editorDirty = false;
    };
  }, [dirty]);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveDraft(lessonId, d);
          setState(r);
          if (r?.ok) {
            setDirty(false);
            router.refresh();
          }
        });
      }}
    >
      <Section n={0} title="基本情報" hint="学習目安時間は、初めて学ぶ受講生が演習まで終えるのにかかる時間です。">
        <Text id="title" label="タイトル" value={d.title} onChange={(v) => set("title", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="minutes" className="text-sm font-semibold">学習目安時間 (分)</label>
            <input id="minutes" type="number" min={5} max={600} value={d.estimatedMinutes} onChange={(e) => set("estimatedMinutes", Number(e.target.value))} className={inputStyles} />
          </div>
          <Text id="videoUrl" label="解説動画の URL (任意・https)" value={d.videoUrl} onChange={(v) => set("videoUrl", v)} />
        </div>
      </Section>

      <Section n={1} title="このレッスンでできるようになること" hint="1 行に 1 項目。「〜できる」の形で書きます。">
        <Text id="objectives" label="目標" rows={4} value={d.objectives} onChange={(v) => set("objectives", v)} />
      </Section>
      <Section n={2} title="必要な前提知識" hint="1 行に 1 項目。なければ空欄。">
        <Text id="prerequisites" label="前提知識" rows={3} value={d.prerequisites} onChange={(v) => set("prerequisites", v)} />
      </Section>
      <Section n={3} title="概念の解説" hint="専門用語は最初に出てきたところで説明します。改行は段落になります。HTML は使えません。">
        <Repeat label="解説" items={d.explanation} onChange={(v) => set("explanation", v)} make={() => ({ heading: "", body: "" })}
          render={(e, setE, i) => (
            <div className="flex flex-col gap-3">
              <Text id={`exh${i}`} label="見出し" value={e.heading} onChange={(v) => setE({ ...e, heading: v })} />
              <Text id={`exb${i}`} label="本文" rows={6} value={e.body} onChange={(v) => setE({ ...e, body: v })} />
            </div>
          )} />
      </Section>
      <Section n={4} title="図解・具体例" hint="たとえ話や具体例。任意。">
        <Repeat label="具体例" items={d.examples} onChange={(v) => set("examples", v)} make={() => ({ title: "", body: "" })}
          render={(e, setE, i) => (
            <div className="flex flex-col gap-3">
              <Text id={`ext${i}`} label="タイトル" value={e.title} onChange={(v) => setE({ ...e, title: v })} />
              <Text id={`exbd${i}`} label="本文" rows={4} value={e.body} onChange={(v) => setE({ ...e, body: v })} />
            </div>
          )} />
      </Section>
      <Section n={5} title="サンプルコードと実行結果" hint="実行結果は実際に実行して得た出力をそのまま貼ります。コードを変更すると「自動実行検証済み」の印は外れます。">
        <Repeat label="サンプルコード" items={d.code} onChange={(v) => set("code", v)} make={(): EditorDraft["code"][number] => ({ language: "java", filename: "", source: "", output: "" })}
          render={(c, setC, i) => (
            <div className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`lang${i}`} className="text-sm font-semibold">言語</label>
                  <select id={`lang${i}`} value={c.language} onChange={(e) => setC({ ...c, language: e.target.value as (typeof LANGS)[number] })} className={inputStyles}>
                    {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <Text id={`fn${i}`} label="ファイル名 (任意)" value={c.filename} onChange={(v) => setC({ ...c, filename: v })} />
              </div>
              <Text id={`src${i}`} label="コード" rows={10} mono value={c.source} onChange={(v) => setC({ ...c, source: v })} />
              <Text id={`out${i}`} label="実行結果" rows={4} mono value={c.output} onChange={(v) => setC({ ...c, output: v })} />
              {c.verifiedBy && <p className="text-xs text-success">自動実行検証の対象: {c.verifiedBy} (コードか実行結果を変えると外れます)</p>}
            </div>
          )} />
      </Section>
      <Section n={6} title="自分で試す演習" hint="最低 1 つ。解答例は受講生が開くまで隠れます。">
        <Repeat label="演習" items={d.exercises} onChange={(v) => set("exercises", v)} make={() => ({ title: "", task: "", hint: "", answer: "" })}
          render={(e, setE, i) => (
            <div className="flex flex-col gap-3">
              <Text id={`et${i}`} label="タイトル" value={e.title} onChange={(v) => setE({ ...e, title: v })} />
              <Text id={`ek${i}`} label="課題文" rows={3} value={e.task} onChange={(v) => setE({ ...e, task: v })} />
              <Text id={`eh${i}`} label="ヒント (任意)" value={e.hint} onChange={(v) => setE({ ...e, hint: v })} />
              <Text id={`ea${i}`} label="解答例 (任意)" rows={4} mono value={e.answer} onChange={(v) => setE({ ...e, answer: v })} />
            </div>
          )} />
      </Section>
      <Section n={7} title="理解度チェック" hint="合格するとレッスンを完了できます。選択肢は 1 行に 1 つ。">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="passScore" className="text-sm font-semibold">合格ライン (0〜100 点)</label>
          <input id="passScore" type="number" min={0} max={100} value={d.quiz.passScore} onChange={(e) => set("quiz", { ...d.quiz, passScore: Number(e.target.value) })} className={cx(inputStyles, "max-w-32")} />
        </div>
        <Repeat label="問題" items={d.quiz.questions} onChange={(v) => set("quiz", { ...d.quiz, questions: v })} make={() => ({ question: "", choices: "", answerIndex: 0, explanation: "" })}
          render={(q, setQ, i) => {
            const choices = q.choices.split("\n").map((c) => c.trim()).filter(Boolean);
            return (
              <div className="flex flex-col gap-3">
                <Text id={`qq${i}`} label="問題文" rows={2} value={q.question} onChange={(v) => setQ({ ...q, question: v })} />
                <Text id={`qc${i}`} label="選択肢 (1 行に 1 つ)" rows={4} value={q.choices} onChange={(v) => setQ({ ...q, choices: v })} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`qa${i}`} className="text-sm font-semibold">正解</label>
                  <select id={`qa${i}`} value={q.answerIndex} onChange={(e) => setQ({ ...q, answerIndex: Number(e.target.value) })} className={inputStyles}>
                    {choices.length === 0 && <option value={0}>選択肢を入力してください</option>}
                    {choices.map((c, ci) => <option key={ci} value={ci}>{ci + 1}. {c}</option>)}
                  </select>
                </div>
                <Text id={`qe${i}`} label="解説 (採点後に表示)" rows={2} value={q.explanation} onChange={(v) => setQ({ ...q, explanation: v })} />
              </div>
            );
          }} />
      </Section>
      <Section n={8} title="実務での利用場面">
        <Text id="workplace" label="現場でどう使うか" rows={3} value={d.workplaceUse} onChange={(v) => set("workplaceUse", v)} />
      </Section>
      <Section n={9} title="よくあるエラー" hint="エラーメッセージは実際の表示どおりに書きます。最低 1 つ。">
        <Repeat label="エラー" items={d.commonErrors} onChange={(v) => set("commonErrors", v)} make={() => ({ error: "", cause: "", fix: "" })}
          render={(e, setE, i) => (
            <div className="flex flex-col gap-3">
              <Text id={`ce${i}`} label="エラー" value={e.error} onChange={(v) => setE({ ...e, error: v })} />
              <Text id={`cc${i}`} label="原因" value={e.cause} onChange={(v) => setE({ ...e, cause: v })} />
              <Text id={`cf${i}`} label="対処" value={e.fix} onChange={(v) => setE({ ...e, fix: v })} />
            </div>
          )} />
      </Section>
      <Section n={10} title="復習ポイント" hint="1 行に 1 項目。">
        <Text id="review" label="復習ポイント" rows={3} value={d.reviewPoints} onChange={(v) => set("reviewPoints", v)} />
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-border bg-bg/95 px-4 py-4 backdrop-blur">
        <Text id="changeNote" label="変更内容のメモ (版の履歴に残ります)" value={d.changeNote} onChange={(v) => set("changeNote", v)} />
        <div aria-live="polite" className="flex flex-col gap-2">
          {state?.ok && <p role="status" className="rounded-lg bg-success-soft p-3 text-sm text-success">{state.ok}</p>}
          {state?.errors && state.errors.length > 0 && (
            <div role="alert" className="rounded-lg bg-warning-soft p-3 text-sm text-warning">
              <p className="font-semibold">公開するには次の項目が必要です (下書きは保存できます)</p>
              <ul className="mt-1 list-disc pl-5">{state.errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
          {state?.error && <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{state.error}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>{pending ? "保存しています…" : "下書きを保存"}</Button>
          {dirty && <span className="text-sm text-muted">保存していない変更があります</span>}
        </div>
      </div>
    </form>
  );
}
