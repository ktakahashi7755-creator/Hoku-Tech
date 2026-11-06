import type { SubmissionStatusValue } from "@/lib/progress/metrics";

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatusValue | "NOT_STARTED", string> = {
  NOT_STARTED: "未着手",
  DRAFT: "取り組み中",
  SUBMITTED: "提出済み",
  IN_REVIEW: "レビュー中",
  RESUBMITTED: "再提出",
  CHANGES_REQUESTED: "修正依頼",
  PASSED: "合格",
  FAILED: "不合格",
};

export const ASSIGNMENT_TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "選択問題",
  WRITTEN: "記述問題",
  CODE: "コード提出",
  GITHUB_REPO: "GitHub リポジトリ提出",
  PROJECT: "実践制作",
  FINAL_PROJECT: "最終プロジェクト",
};

export function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function formatDateTime(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} 分`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} 時間 ${m} 分` : `${h} 時間`;
}
