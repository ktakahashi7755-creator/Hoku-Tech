import { Badge } from "./ui";
import { SUBMISSION_STATUS_LABEL } from "@/lib/labels";
import type { SubmissionStatusValue } from "@/lib/progress/metrics";

const TONE: Record<SubmissionStatusValue | "NOT_STARTED", "neutral" | "accent" | "success" | "warning" | "danger"> = {
  NOT_STARTED: "neutral",
  DRAFT: "neutral",
  SUBMITTED: "accent",
  IN_REVIEW: "accent",
  RESUBMITTED: "accent",
  CHANGES_REQUESTED: "warning",
  PASSED: "success",
  FAILED: "danger",
};

export function SubmissionBadge({ status }: { status: SubmissionStatusValue | null }) {
  const s = status ?? "NOT_STARTED";
  return <Badge tone={TONE[s]}>{SUBMISSION_STATUS_LABEL[s]}</Badge>;
}

export function LessonBadge({ status }: { status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" }) {
  if (status === "COMPLETED") return <Badge tone="success">学習完了</Badge>;
  if (status === "IN_PROGRESS") return <Badge tone="accent">学習中</Badge>;
  return <Badge>未学習</Badge>;
}
