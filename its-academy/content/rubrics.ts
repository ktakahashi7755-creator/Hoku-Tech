/**
 * 課題の採点に使うルーブリック (評価の観点表)。配点の合計はどれも 100。
 * 課題 (AssignmentDef) の rubric で指定し、指定のない課題は STANDARD_RUBRIC を使う。
 * 採点結果 (reviews.scores) には採点時点の観点と配点が記録されるため、
 * ここを変えても過去の採点は変わらない。
 */
import type { RubricCriteria } from "@/lib/content/schema";

export type RubricDef = { name: string; criteria: RubricCriteria };

/** コードを書く課題 (CODE・GITHUB_REPO・PROJECT・FINAL_PROJECT) の標準 */
export const STANDARD_RUBRIC: RubricDef = {
  name: "標準ルーブリック (コード課題)",
  criteria: [
    { key: "requirements", label: "要件充足", weight: 25, description: "必須要件をすべて満たしているか" },
    { key: "correctness", label: "正確性", weight: 20, description: "境界値や異常な入力でも正しく動くか" },
    { key: "readability", label: "可読性", weight: 15, description: "命名・インデント・コメントが読み手に優しいか" },
    { key: "maintainability", label: "保守性", weight: 10, description: "重複がなく、変更しやすい構造か" },
    { key: "testing", label: "テスト", weight: 10, description: "動作確認の手順と結果 (境界値を含む) が、README・備考欄・テストコードのいずれかで示されているか" },
    { key: "security", label: "セキュリティ", weight: 10, description: "秘密情報を含めていないか。入力を検証しているか" },
    { key: "explanation", label: "説明能力", weight: 10, description: "README (リポジトリ提出) または備考欄 (コード提出) で、目的・使い方・工夫を説明できているか" },
  ],
};

/** README を書き、ブランチ → PR → マージを経験する課題 (a1) */
export const README_RUBRIC: RubricDef = {
  name: "README・Git 操作の課題ルーブリック",
  criteria: [
    { key: "requirements", label: "要件充足", weight: 30, description: "リポジトリ・README の項目・ブランチと PR・コミットの件数など、必須要件をすべて満たしているか" },
    { key: "git_flow", label: "Git の操作", weight: 25, description: "main 以外のブランチで作業し、PR を作ってからマージしているか" },
    { key: "commit_message", label: "コミットメッセージ", weight: 15, description: "「種類: 内容」の形式で、何を変えたかが読み手に分かるか" },
    { key: "readme_quality", label: "README の分かりやすさ", weight: 20, description: "見出しと箇条書きで整理され、目標と学習計画が読み手に伝わるか" },
    { key: "security", label: "セキュリティ", weight: 10, description: "住所・電話番号などの個人情報や、秘密情報を公開していないか" },
  ],
};

/** Issue・PR・レビュー・報告の進め方を評価する課題 (a8) */
export const TEAM_PROCESS_RUBRIC: RubricDef = {
  name: "チーム開発の課題ルーブリック",
  criteria: [
    { key: "issue", label: "Issue", weight: 15, description: "再現手順または完了の条件が書かれ、作業の単位が適切か" },
    { key: "pull_request", label: "PR の説明", weight: 20, description: "目的・変更内容・確認方法が書かれ、レビューする人が確かめられるか" },
    { key: "review_response", label: "レビューへの対応", weight: 20, description: "指摘に修正コミットと返信で対応し、分からない点は質問しているか" },
    { key: "review_given", label: "レビューの質", weight: 20, description: "他の人の PR に、理由と提案のあるコメントをしているか" },
    { key: "quality", label: "変更の品質", weight: 15, description: "テストが通り、コンフリクトを相手と相談して正しく解消しているか" },
    { key: "reporting", label: "報告・相談", weight: 10, description: "日報が結論 → 理由 → 次の行動の形で、毎日書かれているか" },
  ],
};

/** AI コーディングツールを使い、出力を検証した過程を評価する課題 (a10) */
export const AI_ASSISTED_RUBRIC: RubricDef = {
  name: "AI を使った開発の課題ルーブリック",
  criteria: [
    { key: "requirements", label: "要件充足", weight: 20, description: "機能が仕様どおりに動き、CLAUDE.md (技術・コマンド・ルール) があるか" },
    { key: "testing", label: "テスト", weight: 20, description: "仕様から自分で決めた境界値のテストがあり、すべて成功しているか (期待値を AI の出力から作っていないか)" },
    { key: "verification", label: "検証の過程", weight: 25, description: "AI の誤りや不適切な提案を、どう見つけてどう直したかを具体的に示しているか" },
    { key: "code_quality", label: "コードの品質", weight: 15, description: "依頼の範囲外の変更がなく、読みやすく変更しやすいコードか" },
    { key: "security", label: "セキュリティ", weight: 10, description: "秘密情報・個人情報をリポジトリや AI への入力に含めていないか" },
    { key: "explanation", label: "説明能力", weight: 10, description: "PR の説明で、AI に依頼した内容・AI を使った範囲・自分で確かめたことが読み手に伝わるか" },
  ],
};
