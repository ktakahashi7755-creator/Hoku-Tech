"use client";

import { useTransition } from "react";
import { setLessonStatus } from "@/app/actions/staff";
import { Button } from "@/components/ui";

export function LessonStatusToggle({ lessonId, published }: { lessonId: string; published: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="secondary" disabled={pending} onClick={() => start(() => setLessonStatus(lessonId, published ? "DRAFT" : "PUBLISHED"))}>
      {published ? "非公開にする" : "公開する"}
    </Button>
  );
}
