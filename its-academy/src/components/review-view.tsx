import { DECISION_LABEL, formatDateTime } from "@/lib/labels";
import { ReviewScoresSchema } from "@/lib/content/schema";
import { GITHUB_REPO_URL } from "@/lib/validation";
import { CodeBlock } from "@/components/lesson/code-block";

type ReviewLike = {
  totalScore: number;
  passScore: number;
  decision: "PASS" | "CHANGES_REQUESTED" | "FAIL";
  comment: string;
  createdAt: Date;
  scores: unknown;
  reviewer: { name: string };
};

/**
 * 提出した内容 (リポジトリ URL・コード / 回答・備考)。採点画面と提出履歴で共通。
 * 呼び出し側で、その提出を見てよい人か (本人・担当講師・管理者) を確認してから渡すこと。
 * コードは横に長くなるため、キーボードでもスクロールできる領域 (ScrollRegion) に入れる
 */
export function SubmissionContent({
  submission,
  label = "提出コード",
  noteLabel = "備考",
}: {
  submission: { repoUrl: string | null; text: string | null; note: string | null };
  label?: string;
  noteLabel?: string;
}) {
  const { repoUrl, text, note } = submission;
  if (!repoUrl && !text && !note) return <p className="text-sm text-muted">提出内容は記録されていません。</p>;
  return (
    <div className="flex flex-col gap-3">
      {repoUrl && (
        <p className="break-all">
          リポジトリ:{" "}
          {GITHUB_REPO_URL.test(repoUrl) ? (
            <a className="text-accent underline" href={repoUrl} target="_blank" rel="noreferrer noopener">{repoUrl}</a>
          ) : (
            repoUrl
          )}
        </p>
      )}
      {text && <CodeBlock code={text} language="java" label={label} />}
      {note && (
        <div>
          <h3 className="text-sm font-semibold">{noteLabel}</h3>
          <p className="mt-1 whitespace-pre-wrap rounded-lg bg-surface p-3 text-sm">{note}</p>
        </div>
      )}
    </div>
  );
}

/** 採点結果 (採点時点のルーブリックのスナップショットを表示する) */
export function ReviewView({ review }: { review: ReviewLike }) {
  // 採点時点のスナップショット。形式が崩れていれば内訳は出さない (合計点と判定は表示する)
  const parsed = ReviewScoresSchema.safeParse(review.scores);
  const scores = parsed.success ? parsed.data : [];
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p>
        <span className="font-semibold">{DECISION_LABEL[review.decision]}</span>
        <span className="ml-2 tabular-nums">
          {review.totalScore} 点 (合格点 {review.passScore} 点)
        </span>
        <span className="ml-2 text-muted">
          {review.reviewer.name} ・ {formatDateTime(review.createdAt)}
        </span>
      </p>
      <p className="whitespace-pre-wrap rounded-lg bg-surface p-3">{review.comment}</p>
      {scores.length > 0 && (
        <table className="w-full max-w-md">
          <tbody className="divide-y divide-border">
            {scores.map((s) => (
              <tr key={s.key}>
                <th scope="row" className="py-1 text-left font-normal text-muted">{s.label}</th>
                <td className="py-1 text-right tabular-nums">
                  {s.score} / {s.weight}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
