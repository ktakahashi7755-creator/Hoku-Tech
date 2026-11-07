"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLesson } from "@/app/actions/learning";
import { Button } from "@/components/ui";

export function CompleteButton({ lessonId, completed, canComplete }: { lessonId: string; completed: boolean; canComplete: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  if (completed) {
    // 押したボタンが消えた後も、キーボードの位置と読み上げがここに残るようにする
    return (
      <p
        ref={(el) => {
          if (el && document.activeElement === document.body) el.focus();
        }}
        tabIndex={-1}
        role="status"
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
