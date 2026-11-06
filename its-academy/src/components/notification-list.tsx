import Link from "next/link";
import { formatDateTime } from "@/lib/labels";

type Notice = { id: string; title: string; body: string; link: string | null; createdAt: Date; readAt: Date | null };

/** お知らせの一覧 (受講生のレビュー画面・講師のダッシュボードで共通) */
export function NotificationList({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return <p className="mt-3 text-sm text-muted">お知らせはありません。</p>;
  return (
    <ul className="mt-3 divide-y divide-border text-sm">
      {notices.map((n) => (
        <li key={n.id} className="py-2">
          <p className="font-semibold">
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
  );
}
