import { describe, expect, it } from "vitest";
import { lineDiff, lessonToLines } from "@/lib/content/diff";
import { editorStateOf } from "@/lib/content/draft";
import { fromAssignmentForm, validateRubric, type AssignmentForm } from "@/lib/content/assignment-form";

describe("lineDiff", () => {
  it("追加・削除・変更なしの行を判定する", () => {
    expect(lineDiff(["a", "b", "c"], ["a", "x", "c", "d"])).toEqual([
      { type: "same", text: "a" },
      { type: "removed", text: "b" },
      { type: "added", text: "x" },
      { type: "same", text: "c" },
      { type: "added", text: "d" },
    ]);
  });
  it("同じ内容なら変更なしだけ", () => {
    expect(lineDiff(["a"], ["a"])).toEqual([{ type: "same", text: "a" }]);
    expect(lineDiff([], [])).toEqual([]);
  });
});

describe("lessonToLines", () => {
  const published = {
    title: "配列",
    estimatedMinutes: 30,
    content: {
      objectives: ["配列を作れる"],
      prerequisites: ["変数とデータ型"],
      explanation: [{ heading: "配列", body: "同じ型の値を並べる入れ物" }],
      examples: [],
      code: [{ language: "java", filename: "Main.java", source: "class Main {}" }],
      exercises: [{ title: "合計", task: "合計を求める", hint: "for を使う", answer: "15" }],
      quiz: { passScore: 100, questions: [{ id: "q1", question: "最初の添え字は?", choices: ["0", "1"], answerIndex: 0, explanation: "0 から始まる" }] },
      workplaceUse: "一覧データの集計",
      commonErrors: [{ error: "ArrayIndexOutOfBoundsException", cause: "範囲外", fix: "< length" }],
      reviewPoints: ["添え字は 0 から"],
    },
  };
  it("項目を読みやすい行にする (正解の選択肢に印を付ける)", () => {
    const l = lessonToLines(published);
    expect(l.slice(0, 4)).toEqual(["タイトル: 配列", "学習目安時間: 30 分", "[できるようになること]", "配列を作れる"]);
    expect(l).toContain("  ○ 0");
    expect(l).toContain("  ・ 1");
  });
  it("公開済みの版と、それを編集した下書きの差分には、変えた箇所だけが出る", () => {
    const draft = { title: "配列 (改訂)", estimatedMinutes: 30, content: { editorDraft: { ...editorStateOf(published), title: "配列 (改訂)" } } };
    const diff = lineDiff(lessonToLines(published), lessonToLines(draft)).filter((d) => d.type !== "same");
    expect(diff).toEqual([
      { type: "removed", text: "タイトル: 配列" },
      { type: "added", text: "タイトル: 配列 (改訂)" },
    ]);
  });
});

const form: AssignmentForm = {
  title: "成績判定", passScore: 70, status: "PUBLISHED", purpose: "目的", scenario: "場面",
  requirements: "要件 1\n\n要件 2", recommended: "", steps: "手順", deliverables: "提出物", readmeChecklist: "",
  resubmitCondition: "条件", interviewPoints: "",
};

describe("fromAssignmentForm", () => {
  it("1 行 1 項目を配列にする", () => {
    const r = fromAssignmentForm(form);
    expect(r.ok && r.body.requirements).toEqual(["要件 1", "要件 2"]);
  });
  it("合格点の範囲と必須項目を検証する", () => {
    const r = fromAssignmentForm({ ...form, passScore: 0, requirements: "" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toContain("合格点は 1〜100 の整数にしてください");
    expect(r.errors).toContain("必須要件: 入力してください (必須)");
  });
});

describe("validateRubric", () => {
  const base = [
    { key: "requirements", label: "要件充足", weight: 60, description: "要件" },
    { key: "readability", label: "可読性", weight: 40, description: "読みやすさ" },
  ];
  it("配点の合計が 100 なら有効", () => {
    expect(validateRubric(base).ok).toBe(true);
  });
  it("合計が 100 でなければエラー", () => {
    const r = validateRubric([{ ...base[0], weight: 50 }, base[1]]);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toContain("配点の合計を 100 にしてください (現在 90)");
  });
  it("新しい観点には key を自動で付け、既存の key は保つ", () => {
    const r = validateRubric([base[0], { key: "", label: "テスト", weight: 40, description: "テストの有無" }]);
    expect(r.ok && r.criteria.map((c) => c.key)).toEqual(["requirements", "criterion_2"]);
  });
});

import { toAssignmentForm } from "@/lib/content/assignment-form";

describe("toAssignmentForm", () => {
  it("必須項目が空の下書きでも読み込める", () => {
    const f = toAssignmentForm({ title: "下書き", passScore: 70, status: "DRAFT", body: { purpose: "", requirements: [] } });
    expect(f.purpose).toBe("");
    expect(f.requirements).toBe("");
    expect(f.status).toBe("DRAFT");
  });
});
