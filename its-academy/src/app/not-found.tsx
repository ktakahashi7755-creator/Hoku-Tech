import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-sm font-semibold text-muted">404</p>
      <h1 className="mt-2 text-2xl font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-muted">URL が間違っているか、このページを表示する権限がありません。</p>
      <Link href="/" className="mt-6 inline-block text-accent underline">ホームへ戻る</Link>
    </div>
  );
}
