/**
 * CMS のレッスン編集フォーム (EditorDraft) と、保存形式 (LessonContent) の相互変換。
 * 純粋関数のみ (単体テスト: tests/unit/draft.test.ts)。
 */
import { LessonContentSchema, type LessonContent } from "./schema";

export type EditorDraft = {
  title: string;
  estimatedMinutes: number;
  changeNote: string;
  videoUrl: string;
  objectives: string; // 1 行 1 項目
  prerequisites: string;
  reviewPoints: string;
  explanation: { heading: string; body: string }[];
  examples: { title: string; body: string }[];
  code: { language: LessonContent["code"][number]["language"]; filename: string; source: string; output: string; verifiedBy?: string }[];
  exercises: { title: string; task: string; hint: string; answer: string }[];
  quiz: { passScore: number; questions: { question: string; choices: string; answerIndex: number; explanation: string }[] };
  workplaceUse: string;
  commonErrors: { error: string; cause: string; fix: string }[];
};

export const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function emptyDraft(title = ""): EditorDraft {
  return {
    title,
    estimatedMinutes: 30,
    changeNote: "",
    videoUrl: "",
    objectives: "",
    prerequisites: "",
    reviewPoints: "",
    explanation: [{ heading: "", body: "" }],
    examples: [],
    code: [],
    exercises: [{ title: "", task: "", hint: "", answer: "" }],
    quiz: { passScore: 67, questions: [{ question: "", choices: "", answerIndex: 0, explanation: "" }] },
    workplaceUse: "",
    commonErrors: [{ error: "", cause: "", fix: "" }],
  };
}

export function toEditorDraft(v: { title: string; estimatedMinutes: number; content: unknown }): EditorDraft {
  const c = LessonContentSchema.parse(v.content);
  return {
    title: v.title,
    estimatedMinutes: v.estimatedMinutes,
    changeNote: "",
    videoUrl: c.videoUrl ?? "",
    objectives: c.objectives.join("\n"),
    prerequisites: c.prerequisites.join("\n"),
    reviewPoints: c.reviewPoints.join("\n"),
    explanation: c.explanation,
    examples: c.examples,
    code: c.code.map((x) => ({ language: x.language, filename: x.filename ?? "", source: x.source, output: x.output ?? "", verifiedBy: x.verifiedBy })),
    exercises: c.exercises.map((e) => ({ title: e.title, task: e.task, hint: e.hint ?? "", answer: e.answer ?? "" })),
    quiz: {
      passScore: c.quiz.passScore,
      questions: c.quiz.questions.map((q) => ({ question: q.question, choices: q.choices.join("\n"), answerIndex: q.answerIndex, explanation: q.explanation })),
    },
    workplaceUse: c.workplaceUse,
    commonErrors: c.commonErrors,
  };
}

const LABELS: Record<string, string> = {
  objectives: "できるようになること",
  prerequisites: "前提知識",
  explanation: "概念の解説",
  examples: "図解・具体例",
  code: "サンプルコード",
  exercises: "演習",
  quiz: "理解度チェック",
  workplaceUse: "実務での利用場面",
  commonErrors: "よくあるエラー",
  reviewPoints: "復習ポイント",
  videoUrl: "動画 URL",
};

type DraftResult =
  | { ok: true; title: string; estimatedMinutes: number; changeNote: string | null; content: LessonContent }
  | { ok: false; errors: string[] };

/**
 * フォームの内容を検証して保存形式にする。
 * サンプルコードの verifiedBy (実行検証済みの印) は、前の版と source・output が完全に同じ場合だけ引き継ぐ。
 * 1 文字でも変えたら「未検証」に戻す。
 */
export function fromEditorDraft(d: EditorDraft, previous?: LessonContent | null): DraftResult {
  const errors: string[] = [];
  const title = d.title.trim();
  if (!title) errors.push("タイトルを入力してください");
  if (title.length > 120) errors.push("タイトルは 120 文字以内にしてください");
  const minutes = Math.round(Number(d.estimatedMinutes));
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 600) errors.push("学習目安時間は 5〜600 分にしてください");

  const prevByVerified = new Map((previous?.code ?? []).filter((c) => c.verifiedBy).map((c) => [c.verifiedBy!, c]));
  const code = d.code.map((c) => {
    const prev = c.verifiedBy ? prevByVerified.get(c.verifiedBy) : undefined;
    const unchanged = !!prev && prev.source === c.source.trimEnd() && (prev.output ?? "") === c.output.trimEnd();
    return {
      language: c.language,
      filename: c.filename.trim() || undefined,
      source: c.source.trimEnd(),
      output: c.output.trimEnd() || undefined,
      verifiedBy: unchanged ? c.verifiedBy : undefined,
      // 複数ファイルの実行スクリプトは編集画面に出さないため、前の版から引き継ぐ (実行検証の印と同じ条件)
      runner: unchanged ? prev?.runner : undefined,
    };
  });

  const candidate = {
    objectives: lines(d.objectives),
    prerequisites: lines(d.prerequisites),
    explanation: d.explanation.map((e) => ({ heading: e.heading.trim(), body: e.body.trim() })),
    examples: d.examples.map((e) => ({ title: e.title.trim(), body: e.body.trim() })),
    code,
    exercises: d.exercises.map((e) => ({ title: e.title.trim(), task: e.task.trim(), hint: e.hint.trim() || undefined, answer: e.answer.trim() || undefined })),
    quiz: {
      passScore: Math.round(Number(d.quiz.passScore)),
      questions: d.quiz.questions.map((q, i) => ({
        id: `q${i + 1}`,
        question: q.question.trim(),
        choices: lines(q.choices),
        answerIndex: Number(q.answerIndex),
        explanation: q.explanation.trim(),
      })),
    },
    workplaceUse: d.workplaceUse.trim(),
    commonErrors: d.commonErrors.map((e) => ({ error: e.error.trim(), cause: e.cause.trim(), fix: e.fix.trim() })),
    reviewPoints: lines(d.reviewPoints),
    videoUrl: d.videoUrl.trim() || undefined,
  };

  const parsed = LessonContentSchema.safeParse(candidate);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const [head, ...rest] = issue.path.map(String);
      const pos = rest.filter((p) => /^\d+$/.test(p)).map((p) => `${Number(p) + 1} 件目`).join(" ");
      const msg = issue.code === "too_small" ? "入力してください (必須)" : issue.message;
      errors.push(`${LABELS[head] ?? head}${pos ? ` (${pos})` : ""}: ${msg}`);
    }
  }
  if (d.videoUrl.trim() && !/^https:\/\//.test(d.videoUrl.trim())) errors.push("動画 URL は https:// で始まる URL にしてください");
  if (errors.length || !parsed.success) return { ok: false, errors: [...new Set(errors)] };
  return { ok: true, title, estimatedMinutes: minutes, changeNote: d.changeNote.trim() || null, content: parsed.data };
}

/** すべてのサンプルコードが実行検証済みか (学習画面の「実行確認済み」表示に使う) */
export function allCodeVerified(content: LessonContent): boolean {
  return content.code.length > 0 && content.code.every((c) => !!c.verifiedBy);
}

/** 版の content から編集フォームの状態を取り出す。下書きは { editorDraft } 形式で保存している */
export function editorStateOf(v: { title: string; estimatedMinutes: number; content: unknown }): EditorDraft {
  const c = v.content as { editorDraft?: EditorDraft } | null;
  if (c && typeof c === "object" && "editorDraft" in c && c.editorDraft) return { ...emptyDraft(), ...c.editorDraft };
  return toEditorDraft(v);
}
