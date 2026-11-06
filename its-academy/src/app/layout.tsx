import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ITS ENGINEER ACADEMY", template: "%s | ITS ENGINEER ACADEMY" },
  description: "未経験から実務で活躍できるエンジニアを育てる、ITS 合同会社の学習プラットフォーム",
  // 受講生向けの非公開サービスのため、検索エンジンに載せない (public/robots.txt と同じ方針)
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-dvh antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bg focus:px-3 focus:py-2">
          本文へスキップ
        </a>
        {children}
      </body>
    </html>
  );
}
