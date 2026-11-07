import { NextResponse, type NextRequest } from "next/server";
import { guard } from "@/lib/auth/proxy-guard";

/**
 * ページの描画前に行う確認。
 * 1. Cookie がなければログイン画面へ (楽観的な確認)
 * 2. 管理者・講師のエリアは、セッションとロールを DB で確かめ、権限がなければ 404 を返す
 * 認証・認可の本体は各ページとサーバーアクションの requireUser() でも必ず行う。
 */
const PUBLIC_PATHS = ["/login", "/api/health"];
const SESSION_COOKIE = "its_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/home" : "/login", request.url));
  }
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    // ログインの後に、開こうとしていたページへ戻れるようにする
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  const result = await guard(pathname, token);
  if (result === "login") return NextResponse.redirect(new URL("/login", request.url));
  if (result === "not_found") {
    // 存在しないパスに書き換えると、Next.js の 404 画面が本当の 404 ステータスで返る (画面の存在も明かさない)
    return NextResponse.rewrite(new URL("/_not-found-guard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // 静的ファイル (画像・アイコン・robots.txt) はログインなしで返す
  matcher: ["/((?!_next/static|_next/image|robots\\.txt$|.*\\.(?:png|svg|ico)$).*)"],
};
