import type { AssignmentTypeValue, SubmissionStatusValue } from "@/lib/progress/metrics";

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

/** 採点の判定 */
export const DECISION_LABEL = { PASS: "合格", CHANGES_REQUESTED: "修正依頼", FAIL: "不合格" } as const;

export const ASSIGNMENT_TYPE_LABEL: Record<AssignmentTypeValue, string> = {
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

/** 監査ログの操作の表示名 (記録上のコードは変えずに、画面でだけ読みやすくする) */
export const AUDIT_ACTION_LABEL: Record<string, string> = {
  "auth.login": "ログイン",
  "auth.login_failed": "ログイン失敗",
  "auth.logout": "ログアウト",
  "auth.password_changed": "パスワード変更",
  "user.create": "受講生の追加",
  "user.role_change": "権限の変更",
  "user.temporary_password": "仮パスワードの発行",
  "user.deactivate": "利用停止",
  "user.activate": "利用再開",
  "enrollment.update": "受講設定の変更",
  "submission.submit": "課題の提出",
  "review.start": "レビュー開始",
  "review.submit": "採点の確定",
  "comment.create": "講師コメント",
  "skill.assess": "スキル評価",
  "lesson.create": "レッスンの作成",
  "lesson.save_draft": "レッスンの下書き保存",
  "lesson.publish": "レッスンの公開",
  "lesson.schedule": "公開の予約",
  "lesson.schedule_cancel": "予約の取り消し",
  "lesson.scheduled_publish": "予約した版の公開",
  "lesson.scheduled_publish_failed": "予約公開の失敗",
  "lesson.restore_version": "過去の版から下書き",
  "lesson.move": "レッスンの並べ替え",
  "lesson.status": "公開・非公開の切り替え",
  "assignment.create": "課題の作成",
  "assignment.update": "課題の編集",
  "rubric.create": "ルーブリックの作成",
  "rubric.update": "ルーブリックの編集",
  "settings.update": "設定の変更",
  "maintenance.cleanup": "古い記録の削除",
  "export.students_csv": "CSV の出力",
  "bootstrap.curriculum": "初期設定 (教材の登録)",
  "bootstrap.super_admin": "初期設定 (管理者の作成)",
  "seed.run": "開発用データの投入",
};
