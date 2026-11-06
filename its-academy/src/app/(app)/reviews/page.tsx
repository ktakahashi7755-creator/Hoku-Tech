import type { Metadata } from "next";
import Link from "next/link";
import { requireMyOverview } from "@/lib/queries/me";
import { db } from "@/lib/db";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { ReviewView } from "@/components/review-view";
import { formatDateTime } from "@/lib/labels";
import { NotificationList } from "@/components/notification-list";

export const metadata: Metadata = { title: "質問・レビュー" };

export default async function ReviewsPage() {
  const { user, overview: o } = await requireMyOverview();
  if (!o.enrollment) return (
      <div className="flex flex-col gap-6">
        <PageHeader title="質問・レビュー" />
        <EmptyState>受講中のコースがありません。担当講師または管理者に連絡してください。</EmptyState>
      </div>
    );
  const reviews = await db.review.findMany({
    where: { submission: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    include: { reviewer: { select: { name: true } }, submission: { include: { assignment: { select: { title: true, slug: true } } } } },
  });
  const notices = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 });
  const comments = o.comments.filter((c) => c.visibility === "STUDENT");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="質問・レビュー" description="講師からのレビューとコメントがここに集まります。" />
      <Card>
        <h2 className="font-bold">質問するとき</h2>
        <p className="mt-2 text-sm">
          担当講師 ({o.enrollment.instructor?.name ?? "未設定"}) に、チャットで質問してください。
          「やりたいこと・起きていること (エラー全文)・期待した結果・試したこと・環境」の 5 つを書くと、早く的確な回答が返ってきます。
          書き方は <Link href="/lessons/l0-how-to-learn" className="text-accent underline">学習の進め方と質問の仕方</Link> を参照してください。
          パスワードや API キーは貼らないでください。
        </p>
      </Card>

      <Card>
        <h2 className="font-bold">課題のレビュー</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-muted">まだレビューはありません。</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-4">
                <p className="mb-2 font-semibold">
                  <Link className="text-accent underline" href={`/assignments/${r.submission.assignment.slug}`}>{r.submission.assignment.title}</Link>
                  <span className="ml-2 text-sm font-normal text-muted">{r.submission.attemptNo} 回目の提出</span>
                </p>
                <ReviewView review={r} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">講師からのコメント</h2>
          {comments.length === 0 ? (
            <p className="mt-3 text-sm text-muted">まだコメントはありません。</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg bg-surface p-3 text-sm">
                  <p className="whitespace-pre-wrap">{c.body}</p>
                  <p className="mt-1 text-xs text-muted">{c.author.name} ・ {formatDateTime(c.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="font-bold">お知らせ</h2>
          <NotificationList notices={notices} />
        </Card>
      </div>
    </div>
  );
}
