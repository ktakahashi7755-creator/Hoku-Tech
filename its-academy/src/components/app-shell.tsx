import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { isAdmin, isStaff, ROLE_LABEL } from "@/lib/auth/roles";
import { logout } from "@/app/actions/auth";
import { NavLinks, type NavItem } from "./nav-links";
import { FocusOnArrival } from "./focus-on-arrival";
import { FocusRescue } from "./focus-rescue";
import { countUnreadNotices } from "@/lib/queries/me";
import { Icon, Logo } from "./icons";

/** 受講生のメニュー。お知らせは「質問・レビュー」に表示されるため、未読の件数をそこに付ける */
const studentNav = (unread: number): NavItem[] => [
  { href: "/home", label: "ホーム", icon: "home" },
  { href: "/curriculum", label: "カリキュラム", icon: "book" },
  { href: "/assignments", label: "課題", icon: "clipboard" },
  { href: "/progress", label: "学習進捗", icon: "chart" },
  { href: "/reviews", label: "質問・レビュー", badge: unread, icon: "message" },
  { href: "/me", label: "マイページ", icon: "user" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser(undefined, { allowPendingPasswordChange: true });
  // 未読のお知らせの件数 (ログイン中の本人の分だけ。お知らせを表示する画面 = 受講生は「質問・レビュー」、講師・管理者はダッシュボードに付ける)
  const unread = user.mustChangePassword ? 0 : await countUnreadNotices(user.id);
  // 仮パスワードのままの間は、パスワード変更 (マイページ) 以外の画面は使えないため、メニューにも出さない
  const nav: NavItem[] = user.mustChangePassword
    ? [{ href: "/me", label: "マイページ", icon: "user" }]
    : isStaff(user.role)
    ? [
        { href: "/admin", label: "ダッシュボード", exact: true, badge: unread, icon: "grid" },
        { href: "/admin/students", label: "受講生", icon: "users" },
        { href: "/admin/reviews", label: "レビュー", icon: "message" },
        { href: "/curriculum", label: "カリキュラム", icon: "book" },
        ...(isAdmin(user.role)
          ? ([
              { href: "/admin/content", label: "教材管理", icon: "layers" },
              { href: "/admin/users", label: "アカウント", icon: "user" },
              { href: "/admin/settings", label: "設定", icon: "settings" },
            ] satisfies NavItem[])
          : []),
        { href: "/me", label: "マイページ", icon: "user" },
      ]
    : studentNav(unread);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
        {/* 広い画面: ロゴ・メニュー・利用者を 1 行に並べる。狭い画面: メニューを 2 行目に回し、横にスクロールさせる */}
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 px-4 pt-2 lg:flex-nowrap lg:py-2">
          <Link href={isStaff(user.role) ? "/admin" : "/home"} className="order-1 inline-flex min-h-11 shrink-0 items-center rounded-lg">
            <Logo />
          </Link>
          <div className="order-3 w-full min-w-0 lg:order-2 lg:w-auto lg:flex-1">
            <NavLinks items={nav} />
          </div>
          <div className="order-2 ml-auto flex items-center gap-2 text-sm lg:order-3">
            <span className="hidden items-center gap-2 text-muted sm:inline-flex">
              <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">
                {user.name.trim().charAt(0)}
              </span>
              <span className="max-w-48 truncate">
                {user.name} ({ROLE_LABEL[user.role]})
              </span>
            </span>
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-muted hover:bg-surface hover:text-text">
                <Icon name="logout" className="size-[18px]" />
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>
      <FocusOnArrival />
      <FocusRescue />
      <main id="main" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-8 outline-none sm:py-10">
        {user.mustChangePassword && (
          <p role="alert" className="mb-6 rounded-xl border border-warning bg-warning-soft p-4 text-warning">
            仮パスワードでログインしています。<Link href="/me#password" className="font-semibold underline">パスワードを変更</Link>すると、すべての画面を使えるようになります。
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
