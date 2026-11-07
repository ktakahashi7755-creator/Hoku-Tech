import Link from "next/link";
import { formatDateTime } from "@/lib/labels";
import { Badge } from "./ui";
import { MarkRead } from "./mark-read";

type Notice = { id: string; title: string; body: string; link: string | null; createdAt: Date; readAt: Date | null };

/** お知らせの一覧 (受講生のレビュー画面・講師のダッシュボードで共通)。まだ見ていないものに「新着」を付け、表示したら既読にする */
export function NotificationList({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return <p className="mt-3 text-sm text-muted">お知らせはありません。</p>;
  const unread = notices.filter((n) => !n.readAt).map((n) => n.id);
  return (
    <>
      <MarkRead ids={unread} />
      <ul className="mt-3 divide-y divide-border text-sm">
        {notices.map((n) => (
          <li key={n.id} className="py-2">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              {!n.readAt && <Badge tone="accent">新着</Badge>}
              {/* アプリ内のページだけをリンクにする */}
              {n.link?.startsWith("/") ? (
                <Link href={n.link} className="text-accent underline-offset-2 hover:underline">
                  {n.title}
                </Link>
              ) : (
                n.title
              )}
            </p>
            <p>{n.body}</p>
            <p className="text-xs text-muted">{formatDateTime(n.createdAt)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
