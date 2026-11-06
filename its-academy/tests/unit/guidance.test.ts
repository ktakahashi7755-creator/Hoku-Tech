import { describe, expect, it } from "vitest";
import { suggestGuidance } from "@/lib/progress/guidance";

const base = { stagnant: false, daysSinceActivity: 1, thresholdDays: 7, paceDiff: 0, failedQuizLessons: [], struggling: [], lowSkills: [], pendingReviews: 0 };

describe("suggestGuidance", () => {
  it("問題がなければ順調の提案だけを返す", () => {
    const g = suggestGuidance(base);
    expect(g).toHaveLength(1);
    expect(g[0].text).toContain("順調");
  });
  it("停滞は能力ではなく状況確認を促す", () => {
    const g = suggestGuidance({ ...base, stagnant: true, daysSinceActivity: 9 });
    expect(g[0].priority).toBe("high");
    expect(g[0].text).toContain("9 日");
    expect(g[0].text).not.toMatch(/能力不足|向いていない/);
  });
  it("同じ課題で複数回提出していれば面談を提案", () => {
    const g = suggestGuidance({ ...base, struggling: [{ title: "成績判定", attempts: 2, status: "CHANGES_REQUESTED" }] });
    expect(g.some((x) => x.text.includes("面談"))).toBe(true);
  });
  it("大きく遅れていれば計画見直し", () => {
    expect(suggestGuidance({ ...base, paceDiff: -20 }).some((x) => x.text.includes("20 ポイント"))).toBe(true);
    expect(suggestGuidance({ ...base, paceDiff: -10 }).some((x) => x.text.includes("ポイント"))).toBe(false);
  });
});
