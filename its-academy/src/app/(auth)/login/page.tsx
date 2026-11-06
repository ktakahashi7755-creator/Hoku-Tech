import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "ログイン" };

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <p className="text-sm font-semibold tracking-wide text-accent">ITS ENGINEER ACADEMY</p>
      <h1 className="mt-2 text-2xl font-bold">ログイン</h1>
      <p className="mt-2 text-muted">講師から届いたメールアドレスとパスワードでログインしてください。</p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-muted">パスワードを忘れた場合は、担当講師または管理者に連絡してください。</p>
    </main>
  );
}
