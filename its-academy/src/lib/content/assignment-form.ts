/** 課題・ルーブリックの編集フォームの検証 (純粋関数) */
import { AssignmentBodySchema, RubricCriteriaSchema, type AssignmentBody, type RubricCriteria } from "./schema";
import { lines } from "./draft";

export type AssignmentForm = {
  title: string;
  passScore: number;
  status: "PUBLISHED" | "DRAFT";
  purpose: string;
  scenario: string;
  requirements: string;
  recommended: string;
  steps: string;
  deliverables: string;
  readmeChecklist: string;
  resubmitCondition: string;
  interviewPoints: string;
};

/** 編集フォームに読み込む。下書きは必須項目が空のことがあるので、検証せずに読み込む (検証は保存時) */
export function toAssignmentForm(a: { title: string; passScore: number; status: string; body: unknown }): AssignmentForm {
  const raw = (a.body ?? {}) as Record<string, unknown>;
  const text = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : "");
  const list = (k: string) => (Array.isArray(raw[k]) ? (raw[k] as unknown[]).filter((x): x is string => typeof x === "string") : []);
  const b = {
    purpose: text("purpose"), scenario: text("scenario"), requirements: list("requirements"), recommended: list("recommended"),
    steps: list("steps"), deliverables: list("deliverables"), readmeChecklist: list("readmeChecklist"),
    resubmitCondition: text("resubmitCondition"), interviewPoints: list("interviewPoints"),
  };
  return {
    title: a.title,
    passScore: a.passScore,
    status: a.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    purpose: b.purpose,
    scenario: b.scenario,
    requirements: b.requirements.join("\n"),
    recommended: b.recommended.join("\n"),
    steps: b.steps.join("\n"),
    deliverables: b.deliverables.join("\n"),
    readmeChecklist: b.readmeChecklist.join("\n"),
    resubmitCondition: b.resubmitCondition,
    interviewPoints: b.interviewPoints.join("\n"),
  };
}

export function fromAssignmentForm(f: AssignmentForm):
  | { ok: true; title: string; passScore: number; status: "PUBLISHED" | "DRAFT"; body: AssignmentBody }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const title = f.title.trim();
  if (!title || title.length > 120) errors.push("タイトルは 1〜120 文字で入力してください");
  const passScore = Number(f.passScore);
  if (!Number.isInteger(passScore) || passScore < 1 || passScore > 100) errors.push("合格点は 1〜100 の整数にしてください");
  const parsed = AssignmentBodySchema.safeParse({
    purpose: f.purpose.trim(),
    scenario: f.scenario.trim(),
    requirements: lines(f.requirements),
    recommended: lines(f.recommended),
    steps: lines(f.steps),
    deliverables: lines(f.deliverables),
    readmeChecklist: lines(f.readmeChecklist),
    resubmitCondition: f.resubmitCondition.trim(),
    interviewPoints: lines(f.interviewPoints),
  });
  const LABEL: Record<string, string> = { purpose: "課題の目的", scenario: "想定シーン", requirements: "必須要件", steps: "作業手順", deliverables: "提出物", resubmitCondition: "再提出について" };
  if (!parsed.success) for (const i of parsed.error.issues) errors.push(`${LABEL[String(i.path[0])] ?? String(i.path[0])}: 入力してください (必須)`);
  if (errors.length || !parsed.success) return { ok: false, errors: [...new Set(errors)] };
  return { ok: true, title, passScore, status: f.status, body: parsed.data };
}

/** ルーブリックの観点を検証する。key は観点名から作らず、既存の key を保つ (過去の採点との対応のため) */
export function validateRubric(criteria: { key: string; label: string; weight: number; description: string }[]):
  | { ok: true; criteria: RubricCriteria }
  | { ok: false; errors: string[] } {
  const cleaned = criteria.map((c, i) => ({
    key: c.key.trim() || `criterion_${i + 1}`,
    label: c.label.trim(),
    weight: Math.round(Number(c.weight)),
    description: c.description.trim(),
  }));
  const errors: string[] = [];
  if (cleaned.length === 0) errors.push("観点を 1 つ以上入力してください");
  cleaned.forEach((c, i) => {
    if (!c.label) errors.push(`観点 ${i + 1}: 名前を入力してください`);
    if (!c.description) errors.push(`観点 ${i + 1}: 説明を入力してください`);
    if (!Number.isInteger(c.weight) || c.weight < 1) errors.push(`観点 ${i + 1}: 配点は 1 以上の整数にしてください`);
  });
  if (new Set(cleaned.map((c) => c.key)).size !== cleaned.length) errors.push("観点の key が重複しています");
  const total = cleaned.reduce((s, c) => s + (Number.isFinite(c.weight) ? c.weight : 0), 0);
  if (total !== 100) errors.push(`配点の合計を 100 にしてください (現在 ${total})`);
  if (errors.length) return { ok: false, errors };
  return { ok: true, criteria: RubricCriteriaSchema.parse(cleaned) };
}

/** 新しく作る課題の本文 (空)。CMS で内容を入力してから公開する */
export function emptyAssignmentBody() {
  return { purpose: "", scenario: "", requirements: [], recommended: [], steps: [], deliverables: [], readmeChecklist: [], resubmitCondition: "", interviewPoints: [] };
}

/** 新しく作る課題の合格点の初期値 */
export const DEFAULT_PASS_SCORE = 70;
