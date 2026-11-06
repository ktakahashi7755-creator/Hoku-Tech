import { describe, expect, it } from "vitest";
import { allCodeVerified, emptyDraft, fromEditorDraft, toEditorDraft, type EditorDraft } from "@/lib/content/draft";

function validDraft(): EditorDraft {
  return {
    ...emptyDraft("配列の基本"),
    estimatedMinutes: 45,
    objectives: "配列を作れる\n\n  添え字で要素を読める  ",
    prerequisites: "変数とデータ型",
    reviewPoints: "添え字は 0 から",
    explanation: [{ heading: "配列", body: "同じ型の値を並べる入れ物" }],
    code: [{ language: "java", filename: "Main.java", source: "class Main {}\n\n", output: "", verifiedBy: undefined }],
    exercises: [{ title: "合計", task: "合計を求める", hint: "", answer: "" }],
    quiz: { passScore: 100, questions: [{ question: "最初の添え字は?", choices: "0\n1", answerIndex: 0, explanation: "0 から始まる" }] },
    workplaceUse: "一覧データの集計",
    commonErrors: [{ error: "ArrayIndexOutOfBoundsException", cause: "範囲外", fix: "< length" }],
  };
}

describe("fromEditorDraft", () => {
  it("1 行 1 項目の入力を配列にし、空行と前後の空白を除く", () => {
    const r = fromEditorDraft(validDraft());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.content.objectives).toEqual(["配列を作れる", "添え字で要素を読める"]);
    expect(r.content.quiz.questions[0]).toMatchObject({ id: "q1", choices: ["0", "1"] });
    expect(r.content.code[0].source).toBe("class Main {}");
    expect(r.content.code[0].filename).toBe("Main.java");
    expect(r.content.examples).toEqual([]);
  });

  it("必須項目が空なら日本語のエラーを返す", () => {
    const d = { ...validDraft(), title: " ", objectives: "", commonErrors: [] };
    const r = fromEditorDraft(d);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toContain("タイトルを入力してください");
    expect(r.errors.some((e) => e.startsWith("できるようになること"))).toBe(true);
    expect(r.errors.some((e) => e.startsWith("よくあるエラー"))).toBe(true);
  });

  it("正解の番号が選択肢の範囲外ならエラー", () => {
    const d = validDraft();
    d.quiz.questions[0].answerIndex = 5;
    const r = fromEditorDraft(d);
    expect(r.ok).toBe(false);
  });

  it("学習目安時間と動画 URL を検証する", () => {
    expect(fromEditorDraft({ ...validDraft(), estimatedMinutes: 1 }).ok).toBe(false);
    expect(fromEditorDraft({ ...validDraft(), videoUrl: "http://example.com/v" }).ok).toBe(false);
    expect(fromEditorDraft({ ...validDraft(), videoUrl: "https://example.com/v" }).ok).toBe(true);
  });

  it("実行検証済みの印は、コードと実行結果が前の版と同じときだけ引き継ぐ", () => {
    const prevDraft = validDraft();
    prevDraft.code[0] = { language: "java", filename: "Main.java", source: "class Main {}", output: "ok", verifiedBy: "content/code/x/Main.java" };
    const prev = fromEditorDraft(prevDraft);
    if (!prev.ok) throw new Error("setup");
    prev.content.code[0].verifiedBy = "content/code/x/Main.java";

    const same = fromEditorDraft(prevDraft, prev.content);
    expect(same.ok && same.content.code[0].verifiedBy).toBe("content/code/x/Main.java");

    const edited = structuredClone(prevDraft);
    edited.code[0].source = "class Main { }";
    const r = fromEditorDraft(edited, prev.content);
    expect(r.ok && r.content.code[0].verifiedBy).toBeUndefined();

    const outputEdited = structuredClone(prevDraft);
    outputEdited.code[0].output = "OK";
    const r2 = fromEditorDraft(outputEdited, prev.content);
    expect(r2.ok && r2.content.code[0].verifiedBy).toBeUndefined();
  });

  it("フォームから送られた verifiedBy だけでは検証済みにならない (前の版が必要)", () => {
    const d = validDraft();
    d.code[0].verifiedBy = "content/code/forged/Main.java";
    const r = fromEditorDraft(d, null);
    expect(r.ok && r.content.code[0].verifiedBy).toBeUndefined();
  });
});

describe("toEditorDraft", () => {
  it("保存形式 → フォーム → 保存形式で内容が変わらない", () => {
    const first = fromEditorDraft(validDraft());
    if (!first.ok) throw new Error("setup");
    const back = fromEditorDraft(toEditorDraft({ title: first.title, estimatedMinutes: first.estimatedMinutes, content: first.content }), first.content);
    expect(back.ok && back.content).toEqual(first.content);
  });
});

describe("allCodeVerified", () => {
  it("コードがない、または 1 つでも未検証なら false", () => {
    const r = fromEditorDraft(validDraft());
    if (!r.ok) throw new Error("setup");
    expect(allCodeVerified(r.content)).toBe(false);
    expect(allCodeVerified({ ...r.content, code: [] })).toBe(false);
    expect(allCodeVerified({ ...r.content, code: [{ ...r.content.code[0], verifiedBy: "a" }] })).toBe(true);
  });
});
