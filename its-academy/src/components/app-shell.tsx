import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import { isAdmin, isStaff, ROLE_LABEL } from "@/lib/auth/roles";
import { logout } from "@/app/actions/auth";
import { NavLinks, type NavItem } from "./nav-links";

const STUDENT_NAV: NavItem[] = [
  { href: "/home", label: "ホーム" },
  { href: "/curriculum", label: "カリキュラム" },
  { href: "/assignments", label: "課題" },
  { href: "/progress", label: "学習進捗" },
  { href: "/reviews", label: "質問・レビュー" },
  { href: "/me", label: "マイページ" },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const nav: NavItem[] = isStaff(user.role)
    ? [
        { href: "/admin", label: "ダッシュボード", exact: true },
        { href: "/admin/students", label: "受講生" },
        { href: "/admin/reviews", label: "レビュー" },
        { href: "/curriculum", label: "カリキュラム" },
        ...(isAdmin(user.role)
          ? [
              { href: "/admin/content", label: "教材管理" },
              { href: "/admin/settings", label: "設定" },
            ]
          : []),
        { href: "/me", label: "マイページ" },
      ]
    : STUDENT_NAV;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href={isStaff(user.role) ? "/admin" : "/home"} className="font-bold tracking-tight">
            ITS <span className="text-accent">ENGINEER ACADEMY</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted sm:inline">
              {user.name} ({ROLE_LABEL[user.role]})
            </span>
            <form action={logout}>
              <button type="submit" className="min-h-11 rounded-lg px-3 text-muted hover:bg-surface hover:text-text">
                ログアウト
              </button>
            </form>
          </div>
        </div>
        <NavLinks items={nav} />
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
