import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "ログイン" };

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <p className="text-sm font-semibold tracking-wide text-accent">PROVIDE ENGINEER ACADEMY</p>
      <h1 className="mt-2 text-2xl font-bold">ログイン</h1>
      <p className="mt-2 text-muted">講師・管理者から受け取ったメールアドレスと仮パスワードでログインしてください (2 回目からは自分で決めたパスワード)。</p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-muted">パスワードを忘れた場合や、正しく入力してもログインできない場合 (アカウントの利用停止を含む) は、担当講師または管理者に連絡してください。</p>
    </main>
  );
}
