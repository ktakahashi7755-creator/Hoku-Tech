import { DECISION_LABEL, formatDateTime } from "@/lib/labels";
import { ReviewScoresSchema } from "@/lib/content/schema";

type ReviewLike = {
  totalScore: number;
  passScore: number;
  decision: "PASS" | "CHANGES_REQUESTED" | "FAIL";
  comment: string;
  createdAt: Date;
  scores: unknown;
  reviewer: { name: string };
};


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
