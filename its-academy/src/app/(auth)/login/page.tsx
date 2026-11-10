import type { Metadata } from "next";
import { Icon, Logo, type IconName } from "@/components/icons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "ログイン" };

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  { icon: "code", title: "実務に直結するカリキュラム", body: "Java・SQL・Spring Boot を、動くコードで確かめながら学びます" },
  { icon: "chart", title: "学習の進み具合がひと目でわかる", body: "履修率・課題・学習時間を、毎日の画面で確認できます" },
  { icon: "users", title: "課題とレビューで着実に", body: "講師のコードレビューで、現場で通用する書き方を身につけます" },
];

/** 学習画面をかたどった飾りの絵 (HTML と CSS だけで描く。文字は入れない) */
function HeroArt() {
  const bars = [
    ["w-16", "bg-accent/70"],
    ["w-28", "bg-[#7aa7e8]"],
    ["w-20", "bg-success/60"],
    ["w-32", "bg-[#7aa7e8]"],
    ["w-12", "bg-accent/70"],
    ["w-24", "bg-[#b9c6d8]"],
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent-soft via-bg to-transparent" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg shadow-raised">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#f0b3ad]" />
          <span className="size-2.5 rounded-full bg-[#f3d38f]" />
          <span className="size-2.5 rounded-full bg-[#a9d8b8]" />
        </div>
        <div className="grid grid-cols-[1fr_120px]">
          <div className="flex flex-col gap-2.5 bg-output p-5">
            {bars.map(([w, c], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-3 text-right font-mono text-[10px] text-output-muted">{i + 1}</span>
                <span className={`h-2 rounded-full ${w} ${c}`} style={{ marginLeft: i % 3 === 1 ? 16 : i % 3 === 2 ? 32 : 0 }} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 p-4">
            {[true, true, false].map((done, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon name={done ? "checkCircle" : "circle"} className={done ? "size-4 text-success" : "size-4 text-border-strong"} />
                <span className="h-1.5 flex-1 rounded-full bg-surface-2" />
              </div>
            ))}
            <div className="mt-auto h-1.5 rounded-full bg-surface-2">
              <div className="h-full w-2/3 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-3 -bottom-5 flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 shadow-raised">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" className="size-4" strokeWidth={2.5} />
        </span>
        <span className="h-1.5 w-16 rounded-full bg-surface-2" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main id="main" className="min-h-dvh bg-gradient-to-b from-bg to-canvas">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-6 lg:py-10">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          {/* スマホでは入力欄を先に出す (DOM の順もフォームが先) */}
          <section aria-labelledby="login-title" className="rounded-3xl border border-border bg-bg p-6 shadow-raised sm:p-8 lg:order-2">
            <h1 id="login-title" className="text-2xl font-bold tracking-tight sm:text-[28px]">
              ログイン
            </h1>
            <p className="mt-2 text-sm text-muted">講師・管理者から受け取ったメールアドレスと仮パスワードでログインしてください (2 回目からは自分で決めたパスワード)。</p>
            <div className="mt-7">
              <LoginForm />
            </div>
            <p className="mt-6 flex gap-2 rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted">
              <Icon name="message" className="mt-0.5 size-4 shrink-0" />
              パスワードを忘れた場合や、正しく入力してもログインできない場合 (アカウントの利用停止を含む) は、担当講師または管理者に連絡してください。
            </p>
          </section>

          <section aria-label="サービスの紹介" className="lg:order-1">
            <p className="inline-flex rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-semibold text-accent-strong">未経験から、実務で活躍できるエンジニアへ</p>
            <p className="mt-5 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-[44px]">
              Web エンジニアとしての
              <br />
              実践力を身につける
            </p>
            <p className="mt-5 max-w-xl text-muted">Java・SQL・Spring Boot を中心に、基礎から実践、AI 駆動開発まで学べる、社会人のためのプログラミング学習サービスです。</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3 sm:flex-col">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={f.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{f.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{f.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-12 hidden lg:block">
              <HeroArt />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
