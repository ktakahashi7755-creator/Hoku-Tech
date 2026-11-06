"use client";

import { useEffect } from "react";
import { pingLearning, recordLessonView } from "@/app/actions/learning";

/** 閲覧の記録と、画面が表示されている間の学習時間の記録 (60 秒ごと) */
export function LessonActivity({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    recordLessonView(lessonId).catch(() => {});
    pingLearning(lessonId).catch(() => {});
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") pingLearning(lessonId).catch(() => {});
    }, 60_000);
    return () => clearInterval(timer);
  }, [lessonId]);
  return null;
}
