/** GitHub リポジトリの URL (https://github.com/owner/repo) */
export const GITHUB_REPO_URL = /^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}\/?$/;

/** リポジトリの URL で提出する課題の形式 (それ以外はコード・回答の本文で提出) */
export const REPO_SUBMISSION_TYPES = ["GITHUB_REPO", "PROJECT", "FINAL_PROJECT"] as const;

export function submitsRepository(type: string): boolean {
  return (REPO_SUBMISSION_TYPES as readonly string[]).includes(type);
}
