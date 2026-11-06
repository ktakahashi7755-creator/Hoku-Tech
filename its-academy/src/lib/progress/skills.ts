/** 講師が評価する実務能力の観点 (E 実務準備状況) */
export const SKILL_AREAS = [
  { key: "git", label: "Git / GitHub" },
  { key: "java_basics", label: "Java 基礎" },
  { key: "oop", label: "オブジェクト指向" },
  { key: "web_sql", label: "Web / SQL" },
  { key: "spring", label: "Spring Boot / API" },
  { key: "testing", label: "テスト" },
  { key: "security", label: "セキュリティ" },
  { key: "debugging", label: "エラー解析・デバッグ" },
  { key: "communication", label: "質問・報告・説明" },
] as const;

export const SKILL_LABEL: Record<string, string> = Object.fromEntries(SKILL_AREAS.map((s) => [s.key, s.label]));

export const SKILL_LEVEL_LABEL: Record<number, string> = {
  1: "1 説明を受けてもできない",
  2: "2 手順があればできる",
  3: "3 一人でできる",
  4: "4 他者に説明できる",
  5: "5 実務で応用できる",
};
