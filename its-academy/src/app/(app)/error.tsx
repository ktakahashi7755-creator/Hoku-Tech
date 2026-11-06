"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui";

/** 画面の表示中に想定外のエラーが起きたとき。詳細はサーバーのログ (request_error) に残り、利用者には出さない */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold">画面を表示できませんでした</h1>
      <p className="mt-2 text-muted">一時的な問題の可能性があります。もう一度お試しください。続く場合は、担当講師または管理者に連絡してください。</p>
      {error.digest && <p className="mt-2 text-xs text-muted">問い合わせ番号: {error.digest}</p>}
      <div className="mt-6 flex justify-center gap-3">
        <Button type="button" onClick={reset}>もう一度試す</Button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-4 text-accent underline">ホームへ戻る</Link>
      </div>
    </div>
  );
}
