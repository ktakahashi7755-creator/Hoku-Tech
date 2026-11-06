/**
 * 講師向けの「次に必要な指導」の提案 (ルールベース)。
 * 学習時間の短さだけで能力不足と判断しない。最終判断は講師が行う。
 */
export type GuidanceInput = {
  stagnant: boolean;
  daysSinceActivity: number | null;
  thresholdDays: number;
  paceDiff: number | null;
  failedQuizLessons: string[];
  struggling: { title: string; attempts: number; status: string | null }[];
  lowSkills: string[];
  pendingReviews: number;
};

export type Guidance = { priority: "high" | "medium" | "low"; text: string };

export function suggestGuidance(i: GuidanceInput): Guidance[] {
  const out: Guidance[] = [];
  if (i.pendingReviews > 0) {
    out.push({ priority: "high", text: `レビュー待ちの提出が ${i.pendingReviews} 件あります。受講生の手が止まらないよう、早めに採点してください。` });
  }
  if (i.stagnant) {
    out.push({
      priority: "high",
      text: `最終学習から ${i.daysSinceActivity ?? "—"} 日経過しています (基準 ${i.thresholdDays} 日)。体調・業務・つまずきの有無を確認する連絡をしてください。`,
    });
  }
  for (const s of i.struggling) {
    if (s.attempts >= 2) {
      out.push({ priority: "high", text: `課題「${s.title}」で ${s.attempts} 回提出しています。指摘が伝わっているか、面談で一緒にコードを確認してください。` });
    } else if (s.status === "CHANGES_REQUESTED") {
      out.push({ priority: "medium", text: `課題「${s.title}」は修正依頼中です。再提出の見通しを確認してください。` });
    } else if (s.status === "FAILED") {
      out.push({ priority: "medium", text: `課題「${s.title}」が不合格です。前提となるレッスンの復習計画を一緒に立ててください。` });
    }
  }
  if (i.failedQuizLessons.length > 0) {
    out.push({ priority: "medium", text: `理解度チェックが未合格のレッスンがあります: ${i.failedQuizLessons.join("、")}。` });
  }
  if (i.paceDiff !== null && i.paceDiff <= -15) {
    out.push({ priority: "medium", text: `目標修了日に対する目安より ${-i.paceDiff} ポイント遅れています。学習時間の確保または目標日の見直しを相談してください。` });
  }
  if (i.lowSkills.length > 0) {
    out.push({ priority: "low", text: `スキル評価が 2 以下の観点: ${i.lowSkills.join("、")}。次の課題で重点的に確認してください。` });
  }
  if (out.length === 0) {
    out.push({ priority: "low", text: "順調に進んでいます。次の課題の提出を促し、取り組みを認めるコメントを送ってください。" });
  }
  return out;
}

/**
 * 指導提案の対象にする課題: 合格していないもので、修正依頼・不合格、または 2 回以上提出したもの
 * (何回目でも合格した課題は対象にしない)。
 */
export function strugglingAssignments<T extends { latestStatus: string | null; attempts: number }>(assignments: readonly T[]): T[] {
  return assignments.filter(
    (a) => a.latestStatus !== "PASSED" && (a.latestStatus === "CHANGES_REQUESTED" || a.latestStatus === "FAILED" || a.attempts >= 2),
  );
}

/** 理解度チェックを受けたが一度も合格していない必修レッスン (選択モジュールは対象にしない) */
export function weakLessons<T extends { id: string; optional: boolean }>(lessons: readonly T[], attempted: ReadonlySet<string>, passed: ReadonlySet<string>): T[] {
  return lessons.filter((l) => !l.optional && attempted.has(l.id) && !passed.has(l.id));
}
