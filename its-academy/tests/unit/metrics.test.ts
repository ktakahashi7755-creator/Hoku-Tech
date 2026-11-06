import { describe, expect, it } from "vitest";
import {
  computeMetrics,
  isStagnant,
  last7Days,
  learningStreak,
  nextAction,
  paceAgainstTarget,
  requiredMetricInput,
  scoreQuiz,
  statusFromDecision,
  totalRubricScore,
} from "@/lib/progress/metrics";

const d = (s: string) => new Date(s);

describe("computeMetrics", () => {
  it("指標 A〜E を分けて計算する", () => {
    const m = computeMetrics({
      lessons: [
        { id: "a", completed: true },
        { id: "b", completed: false },
        { id: "c", completed: true },
        { id: "d", completed: false },
      ],
      assignments: [
        { id: "x", type: "CODE", latestStatus: "PASSED", latestReviewScore: 80 },
        { id: "y", type: "GITHUB_REPO", latestStatus: "CHANGES_REQUESTED", latestReviewScore: 50 },
        { id: "z", type: "WRITTEN", latestStatus: "PASSED", latestReviewScore: 100 },
      ],
      quizBestScores: [100, 50],
      latestSkillLevels: [3, 4],
    });
    expect(m.lessonCompletion).toBe(50);
    expect(m.assignmentCompletion).toBe(67);
    expect(m.comprehension).toBe(75);
    expect(m.implementation).toBe(65); // WRITTEN は実装能力に含めない
    expect(m.workReadiness).toBe(70);
  });

  it("データがない指標は 0 ではなく null (未評価) にする", () => {
    const m = computeMetrics({ lessons: [], assignments: [], quizBestScores: [], latestSkillLevels: [] });
    expect(m.lessonCompletion).toBe(0);
    expect(m.comprehension).toBeNull();
    expect(m.implementation).toBeNull();
    expect(m.workReadiness).toBeNull();
  });
});

describe("scoreQuiz", () => {
  it("正答率を 100 点満点で返す", () => {
    expect(scoreQuiz([0, 1, 2], [0, 1, 0])).toBe(67);
    expect(scoreQuiz([0, 1], [null, null])).toBe(0);
  });
});

describe("learningStreak", () => {
  const now = d("2026-11-06T03:00:00Z"); // JST 12:00
  it("今日を含む連続日数", () => {
    expect(learningStreak([d("2026-11-06T01:00:00Z"), d("2026-11-05T10:00:00Z"), d("2026-11-04T10:00:00Z")], now)).toBe(3);
  });
  it("今日未学習でも昨日までの連続は保つ", () => {
    expect(learningStreak([d("2026-11-05T10:00:00Z"), d("2026-11-04T10:00:00Z")], now)).toBe(2);
  });
  it("日本時間の日付で数える (UTC 前日 16:00 は JST 翌日 1:00)", () => {
    expect(learningStreak([d("2026-11-05T16:00:00Z")], now)).toBe(1);
  });
  it("途切れたら 0", () => {
    expect(learningStreak([d("2026-11-03T10:00:00Z")], now)).toBe(0);
  });
});

describe("last7Days", () => {
  it("7 日分の枠を作り分単位で集計する", () => {
    const r = last7Days([{ startedAt: d("2026-11-06T01:00:00Z"), durationSec: 1800 }], d("2026-11-06T03:00:00Z"));
    expect(r).toHaveLength(7);
    expect(r[6]).toEqual({ day: "2026-11-06", minutes: 30 });
    expect(r[0].day).toBe("2026-10-31");
  });
});

describe("isStagnant", () => {
  it("閾値日数以上の無活動で停滞の可能性", () => {
    const now = d("2026-11-10T00:00:00Z");
    expect(isStagnant(d("2026-11-03T00:00:00Z"), d("2026-10-01T00:00:00Z"), now, 7)).toBe(true);
    expect(isStagnant(d("2026-11-04T00:00:00Z"), d("2026-10-01T00:00:00Z"), now, 7)).toBe(false);
  });
  it("一度も学習していなければ開始日から数える", () => {
    expect(isStagnant(null, d("2026-11-09T00:00:00Z"), d("2026-11-10T00:00:00Z"), 7)).toBe(false);
  });
});

describe("paceAgainstTarget", () => {
  it("経過割合と履修率の差", () => {
    const r = paceAgainstTarget(d("2026-11-01"), d("2026-11-11"), 30, d("2026-11-06"));
    expect(r).toEqual({ expected: 50, diff: -20 });
  });
  it("目標日がなければ null", () => {
    expect(paceAgainstTarget(d("2026-11-01"), null, 30, d("2026-11-06"))).toBeNull();
  });
});

describe("nextAction", () => {
  const lessons = [
    { id: "l1", slug: "l1", title: "L1", status: "COMPLETED" as const },
    { id: "l2", slug: "l2", title: "L2", status: "IN_PROGRESS" as const },
    { id: "l3", slug: "l3", title: "L3", status: "NOT_STARTED" as const },
  ];
  it("修正依頼が最優先", () => {
    const r = nextAction({ lessons, currentLessonId: "l2", assignments: [{ id: "a", title: "A", unlocked: true, latestStatus: "CHANGES_REQUESTED" }] });
    expect(r.kind).toBe("fix_submission");
  });
  it("前回の続き (学習中) から再開", () => {
    const r = nextAction({ lessons, currentLessonId: "l2", assignments: [] });
    expect(r).toMatchObject({ kind: "lesson", lessonId: "l2", resume: true });
  });
  it("前提を終えた未提出課題はレッスンより先", () => {
    const r = nextAction({ lessons, currentLessonId: null, assignments: [{ id: "a", title: "A", unlocked: true, latestStatus: null }] });
    expect(r).toMatchObject({ kind: "assignment", assignmentId: "a" });
  });
  it("全部終わってレビュー待ちだけ残る", () => {
    const done = lessons.map((l) => ({ ...l, status: "COMPLETED" as const }));
    const r = nextAction({ lessons: done, currentLessonId: null, assignments: [{ id: "a", title: "A", unlocked: true, latestStatus: "SUBMITTED" }] });
    expect(r).toEqual({ kind: "awaiting_review", count: 1 });
  });
});

describe("rubric", () => {
  it("各観点を 0〜配点に丸めて合計する", () => {
    expect(totalRubricScore([{ weight: 30, score: 40 }, { weight: 20, score: -5 }, { weight: 50, score: 25.4 }])).toBe(55);
  });
  it("判定とステータスの対応", () => {
    expect(statusFromDecision("PASS")).toBe("PASSED");
    expect(statusFromDecision("CHANGES_REQUESTED")).toBe("CHANGES_REQUESTED");
    expect(statusFromDecision("FAIL")).toBe("FAILED");
  });
});

describe("requiredMetricInput (選択モジュールの除外)", () => {
  const lessons = [
    { id: "r1", optional: false, completed: true },
    { id: "r2", optional: false, completed: false },
    { id: "o1", optional: true, completed: false },
  ];
  const assignments = [
    { id: "a1", type: "CODE" as const, latestStatus: "PASSED" as const, latestReviewScore: 80, optional: false },
    { id: "a2", type: "CODE" as const, latestStatus: null, latestReviewScore: null, optional: true },
  ];

  it("選択モジュールのレッスン・課題・理解度チェックは指標に含めない", () => {
    const input = requiredMetricInput({ lessons, assignments, quizBest: new Map([["r1", 100], ["o1", 0]]), latestSkillLevels: [3] });
    expect(input.lessons.map((l) => l.id)).toEqual(["r1", "r2"]);
    expect(input.assignments.map((a) => a.id)).toEqual(["a1"]);
    expect(input.quizBestScores).toEqual([100]);
    const m = computeMetrics(input);
    expect(m.lessonCompletion).toBe(50);
    expect(m.assignmentCompletion).toBe(100);
    expect(m.comprehension).toBe(100);
  });

  it("選択モジュールを進めても必修の指標は変わらない", () => {
    const before = computeMetrics(requiredMetricInput({ lessons, assignments, quizBest: new Map([["r1", 100]]), latestSkillLevels: [] }));
    const after = computeMetrics(
      requiredMetricInput({
        lessons: lessons.map((l) => (l.optional ? { ...l, completed: true } : l)),
        assignments: assignments.map((a) => (a.optional ? { ...a, latestStatus: "FAILED" as const, latestReviewScore: 10 } : a)),
        quizBest: new Map([["r1", 100], ["o1", 20]]),
        latestSkillLevels: [],
      }),
    );
    expect(after).toEqual(before);
  });

  it("公開されていないレッスンの理解度チェックは含めない", () => {
    expect(requiredMetricInput({ lessons, assignments, quizBest: new Map([["gone", 40]]), latestSkillLevels: [] }).quizBestScores).toEqual([]);
  });
});
