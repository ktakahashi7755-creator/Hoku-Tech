/**
 * 進捗指標の計算 (純粋関数のみ。DB には触れない)。
 *
 * 指標は混ぜずに分けて持つ:
 *   A 教材履修率   … 「学習完了」操作 (理解度チェック合格が条件) をしたレッスンの割合
 *   B 課題完了率   … 合格した課題の割合
 *   C 理解度評価   … 理解度チェックの最高得点の平均
 *   D 実装能力評価 … コード系課題の最新採点 (講師がルーブリックで採点) の平均
 *   E 実務準備状況 … 講師によるスキル評価 (1〜5) の平均を 100 点換算
 * ページを開いただけでは A は増えない。学習時間の長短は指標に含めない。
 */

export type SubmissionStatusValue =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "CHANGES_REQUESTED"
  | "RESUBMITTED"
  | "PASSED"
  | "FAILED";

export type AssignmentTypeValue =
  | "MULTIPLE_CHOICE"
  | "WRITTEN"
  | "CODE"
  | "GITHUB_REPO"
  | "PROJECT"
  | "FINAL_PROJECT";

const IMPLEMENTATION_TYPES: readonly AssignmentTypeValue[] = ["CODE", "GITHUB_REPO", "PROJECT", "FINAL_PROJECT"];

export type MetricInput = {
  lessons: { id: string; completed: boolean }[];
  assignments: {
    id: string;
    type: AssignmentTypeValue;
    latestStatus: SubmissionStatusValue | null;
    latestReviewScore: number | null;
  }[];
  quizBestScores: number[];
  latestSkillLevels: number[]; // 1〜5
};

export type Metrics = {
  lessonCompletion: number; // A (0〜100)
  completedLessons: number;
  totalLessons: number;
  assignmentCompletion: number; // B (0〜100)
  passedAssignments: number;
  totalAssignments: number;
  comprehension: number | null; // C。未受験なら null
  implementation: number | null; // D。未採点なら null
  workReadiness: number | null; // E。未評価なら null
};

function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

export function computeMetrics(input: MetricInput): Metrics {
  const completedLessons = input.lessons.filter((l) => l.completed).length;
  const passedAssignments = input.assignments.filter((a) => a.latestStatus === "PASSED").length;
  const implScores = input.assignments
    .filter((a) => IMPLEMENTATION_TYPES.includes(a.type) && a.latestReviewScore !== null)
    .map((a) => a.latestReviewScore as number);
  const skill = average(input.latestSkillLevels.map((l) => Math.min(5, Math.max(1, l)) * 20));

  return {
    lessonCompletion: percent(completedLessons, input.lessons.length),
    completedLessons,
    totalLessons: input.lessons.length,
    assignmentCompletion: percent(passedAssignments, input.assignments.length),
    passedAssignments,
    totalAssignments: input.assignments.length,
    comprehension: average(input.quizBestScores),
    implementation: average(implScores),
    workReadiness: skill,
  };
}

/** 理解度チェックの採点。全問の正答率 (0〜100) */
/**
 * 選択 (発展) モジュールのレッスン・課題・理解度チェックを除いた、必修だけの指標の入力を作る。
 * 選択モジュールに取り組まなくても指標が下がらず、取り組んでも必修の評価に混ざらないようにする。
 */
export function requiredMetricInput(input: {
  lessons: readonly { id: string; optional: boolean; completed: boolean }[];
  assignments: readonly (MetricInput["assignments"][number] & { optional: boolean })[];
  quizBest: ReadonlyMap<string, number>;
  latestSkillLevels: readonly number[];
}): MetricInput {
  const required = input.lessons.filter((l) => !l.optional);
  const requiredIds = new Set(required.map((l) => l.id));
  return {
    lessons: required.map((l) => ({ id: l.id, completed: l.completed })),
    assignments: input.assignments
      .filter((a) => !a.optional)
      .map((a) => ({ id: a.id, type: a.type, latestStatus: a.latestStatus, latestReviewScore: a.latestReviewScore })),
    quizBestScores: [...input.quizBest.entries()].filter(([id]) => requiredIds.has(id)).map(([, score]) => score),
    latestSkillLevels: [...input.latestSkillLevels],
  };
}

export function scoreQuiz(answerIndexes: readonly number[], given: readonly (number | null)[]): number {
  if (answerIndexes.length === 0) return 0;
  const correct = answerIndexes.filter((a, i) => given[i] === a).length;
  return percent(correct, answerIndexes.length);
}

const DAY_MS = 24 * 60 * 60 * 1000;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 日本時間の日付キー (YYYY-MM-DD) */
export function jstDayKey(d: Date): string {
  return new Date(d.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

/** 連続学習日数。今日または昨日まで途切れずに学習した日数 (日本時間) */
export function learningStreak(activity: readonly Date[], now: Date): number {
  const days = new Set(activity.map(jstDayKey));
  let cursor = now.getTime();
  if (!days.has(jstDayKey(new Date(cursor)))) cursor -= DAY_MS; // 今日まだ学習していなくても昨日までの連続は保つ
  let streak = 0;
  while (days.has(jstDayKey(new Date(cursor)))) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

/** 直近 7 日間の学習分数 (古い日 → 今日) */
export function last7Days(
  sessions: readonly { startedAt: Date; durationSec: number }[],
  now: Date,
): { day: string; minutes: number }[] {
  const result: { day: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    result.push({ day: jstDayKey(new Date(now.getTime() - i * DAY_MS)), minutes: 0 });
  }
  const index = new Map(result.map((r, i) => [r.day, i]));
  for (const s of sessions) {
    const i = index.get(jstDayKey(s.startedAt));
    if (i !== undefined) result[i].minutes += Math.round(s.durationSec / 60);
  }
  return result;
}

/**
 * 何日前か。日本時間の暦日で数える (画面の「最終学習日」の表示と一致させるため)。
 * 例: 11/01 23:50 → 11/08 10:00 は 7 日前 (経過時間は 6 日 10 時間でも)
 */
export function daysSince(date: Date | null, now: Date): number | null {
  if (!date) return null;
  const day = (d: Date) => Date.parse(`${jstDayKey(d)}T00:00:00Z`);
  return Math.round((day(now) - day(date)) / DAY_MS);
}

/**
 * 学習停滞の検知。最終学習日から threshold 日以上経過していれば「停滞の可能性」。
 * 能力の判定ではなく、講師が声をかけるきっかけとして使う。
 */
export function isStagnant(lastActivity: Date | null, startedAt: Date, now: Date, thresholdDays: number): boolean {
  const base = lastActivity ?? startedAt;
  return (daysSince(base, now) ?? 0) >= thresholdDays;
}

/**
 * 目標に対するペース。開始日〜目標修了日の経過割合と履修率を比べる。
 * diff > 0 なら予定より進んでいる。
 */
export function paceAgainstTarget(
  startedAt: Date,
  targetEnd: Date | null,
  lessonCompletion: number,
  now: Date,
): { expected: number; diff: number } | null {
  if (!targetEnd) return null;
  // 目標修了日は日付だけを持つ (UTC 0 時 = 日本時間 9 時)。その日の終わり (日本時間 24 時) までを期間とする
  const end = Date.parse(`${jstDayKey(targetEnd)}T00:00:00+09:00`) + DAY_MS;
  const total = end - startedAt.getTime();
  if (total <= 0) return null;
  const elapsed = Math.min(Math.max(now.getTime() - startedAt.getTime(), 0), total);
  const expected = Math.round((elapsed / total) * 100);
  return { expected, diff: lessonCompletion - expected };
}

export type NextAction =
  | { kind: "fix_submission"; assignmentId: string; title: string }
  | { kind: "lesson"; lessonId: string; slug: string; title: string; resume: boolean }
  | { kind: "assignment"; assignmentId: string; title: string }
  | { kind: "awaiting_review"; count: number }
  | { kind: "done" };

/**
 * 次に取り組むべき内容。
 * 1. 修正依頼の課題 2. 学習中のレッスン 3. 未完了の最初のレッスン
 * 4. 前提レッスンを終えた未提出課題 5. レビュー待ち 6. すべて完了
 */
export function nextAction(input: {
  lessons: { id: string; slug: string; title: string; status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" }[];
  currentLessonId: string | null;
  assignments: {
    id: string;
    title: string;
    unlocked: boolean;
    latestStatus: SubmissionStatusValue | null;
  }[];
}): NextAction {
  const fix = input.assignments.find((a) => a.latestStatus === "CHANGES_REQUESTED");
  if (fix) return { kind: "fix_submission", assignmentId: fix.id, title: fix.title };

  const current = input.lessons.find((l) => l.id === input.currentLessonId && l.status === "IN_PROGRESS");
  if (current) return { kind: "lesson", lessonId: current.id, slug: current.slug, title: current.title, resume: true };

  const todo = input.assignments.find((a) => a.unlocked && (a.latestStatus === null || a.latestStatus === "DRAFT"));
  const firstOpen = input.lessons.find((l) => l.status !== "COMPLETED");
  // 前提レッスンを終えた課題は、次のレッスンより先に提出する
  if (todo) return { kind: "assignment", assignmentId: todo.id, title: todo.title };
  if (firstOpen) {
    return { kind: "lesson", lessonId: firstOpen.id, slug: firstOpen.slug, title: firstOpen.title, resume: firstOpen.status === "IN_PROGRESS" };
  }

  const waiting = input.assignments.filter((a) =>
    a.latestStatus === "SUBMITTED" || a.latestStatus === "IN_REVIEW" || a.latestStatus === "RESUBMITTED",
  ).length;
  if (waiting > 0) return { kind: "awaiting_review", count: waiting };
  return { kind: "done" };
}

/** レビュー判定から提出ステータスへ */
export function statusFromDecision(decision: "PASS" | "CHANGES_REQUESTED" | "FAIL"): SubmissionStatusValue {
  return decision === "PASS" ? "PASSED" : decision === "FAIL" ? "FAILED" : "CHANGES_REQUESTED";
}

/** ルーブリックの採点を合計する。各観点 0〜weight 点 */
export function totalRubricScore(scores: readonly { weight: number; score: number }[]): number {
  return scores.reduce((sum, s) => sum + Math.min(Math.max(Math.round(s.score), 0), s.weight), 0);
}
