"use client";

import { useState, useTransition } from "react";
import { setLessonStatus } from "@/app/actions/cms";
import { Button } from "@/components/ui";

export function LessonStatusToggle({ lessonId, published }: { lessonId: string; published: boolean }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok?: string; error?: string } | null>(null);
  return (
    <span className="flex flex-col gap-1">
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => {
          if (published && !window.confirm("このレッスンを非公開にします。受講生はこのレッスンを開けなくなり、予約公開も取り消されます。よろしいですか?")) return;
          start(async () => {
            setMessage(null);
            try {
              setMessage((await setLessonStatus(lessonId, published ? "DRAFT" : "PUBLISHED")) ?? null);
            } catch {
              setMessage({ error: "変更できませんでした。ページを再読み込みしてください。" });
            }
          });
        }}
      >
        {pending ? "変更しています…" : published ? "非公開にする" : "公開する"}
      </Button>
      <span aria-live="polite" className="text-sm">
        {message?.ok && <span className="text-success">{message.ok}</span>}
        {message?.error && <span role="alert" className="text-danger">{message.error}</span>}
      </span>
    </span>
  );
}
