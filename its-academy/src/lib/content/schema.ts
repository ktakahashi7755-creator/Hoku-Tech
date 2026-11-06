import { z } from "zod";

/**
 * レッスン本文の標準フォーマット (13 項目)。
 * 1 目標 / 2 学習目安時間 (LessonVersion.estimatedMinutes) / 3 前提知識 / 4 概念解説 /
 * 5 図解・具体例 / 6 サンプルコード / 7 実行結果 / 8 演習 / 9 理解度チェック /
 * 10 実務での利用場面 / 11 よくあるエラー / 12 復習ポイント / 13 次のレッスン (並び順から自動)
 */
export const CodeSampleSchema = z.object({
  language: z.enum(["java", "bash", "sql", "html", "css", "javascript", "text"]),
  filename: z.string().optional(),
  source: z.string().min(1),
  /** 実行結果 (実際に実行して得た出力をそのまま記載) */
  output: z.string().optional(),
  /** content/ 配下の検証用ソースのパス (scripts/verify-code.ts が実行して output と照合する) */
  verifiedBy: z.string().optional(),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  answerIndex: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

export const LessonContentSchema = z
  .object({
    objectives: z.array(z.string().min(1)).min(1),
    prerequisites: z.array(z.string().min(1)),
    explanation: z.array(z.object({ heading: z.string().min(1), body: z.string().min(1) })).min(1),
    examples: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })),
    code: z.array(CodeSampleSchema),
    exercises: z.array(
      z.object({ title: z.string().min(1), task: z.string().min(1), hint: z.string().optional(), answer: z.string().optional() }),
    ).min(1),
    quiz: z.object({ passScore: z.number().int().min(0).max(100), questions: z.array(QuizQuestionSchema).min(1) }),
    workplaceUse: z.string().min(1),
    commonErrors: z.array(z.object({ error: z.string().min(1), cause: z.string().min(1), fix: z.string().min(1) })).min(1),
    reviewPoints: z.array(z.string().min(1)).min(1),
    videoUrl: z.string().url().optional(),
  })
  .superRefine((c, ctx) => {
    c.quiz.questions.forEach((q, i) => {
      if (q.answerIndex >= q.choices.length) {
        ctx.addIssue({ code: "custom", path: ["quiz", "questions", i, "answerIndex"], message: "answerIndex が選択肢の範囲外です" });
      }
    });
  });

export type LessonContent = z.infer<typeof LessonContentSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const RubricCriteriaSchema = z
  .array(z.object({ key: z.string().min(1), label: z.string().min(1), weight: z.number().int().positive(), description: z.string().min(1) }))
  .min(1)
  .refine((cs) => cs.reduce((s, c) => s + c.weight, 0) === 100, "ルーブリックの配点合計は 100 にしてください");

export type RubricCriteria = z.infer<typeof RubricCriteriaSchema>;

export const AssignmentBodySchema = z.object({
  purpose: z.string().min(1),
  scenario: z.string().min(1),
  requirements: z.array(z.string().min(1)).min(1),
  recommended: z.array(z.string().min(1)),
  steps: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  readmeChecklist: z.array(z.string().min(1)),
  resubmitCondition: z.string().min(1),
  interviewPoints: z.array(z.string().min(1)),
});

export type AssignmentBody = z.infer<typeof AssignmentBodySchema>;
