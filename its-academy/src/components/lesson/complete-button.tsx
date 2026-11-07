"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLesson } from "@/app/actions/learning";
import { Button } from "@/components/ui";

export function CompleteButton({ lessonId, completed, canComplete }: { lessonId: string; completed: boolean; canComplete: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // 押したボタンが消えた後も、キーボードの位置と読み上げがここに残るようにする。
  // ページを開いたとき (すでに完了済み) は動かさない (画面がこの位置まで飛ばないように)
  const clicked = useRef(false);
  const doneRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (completed && clicked.current && document.activeElement === document.body) doneRef.current?.focus();
  }, [completed]);
  if (completed) {
    return (
      <p
        ref={doneRef}
        // 読み上げの領域にはしない (ページを開いたときから表示される文のため)。押した後は、フォーカスが移って読み上げられる
        tabIndex={-1}
        className="rounded-lg bg-success-soft p-3 font-semibold text-success outline-none"
      >
        このレッスンは学習完了です。
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        disabled={pending || !canComplete}
        onClick={() =>
          start(async () => {
            clicked.current = true;
            const r = await completeLesson(lessonId);
            if (r.error) setError(r.error);
            else router.refresh();
          })
        }
      >
        {pending ? "記録しています…" : "学習完了にする"}
      </Button>
      {!canComplete && <p className="text-sm text-muted">理解度チェックに合格すると押せるようになります。</p>}
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  );
}
