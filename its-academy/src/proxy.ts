import { NextResponse, type NextRequest } from "next/server";

/**
 * 楽観的なリダイレクトのみを行う (Cookie の有無だけを見る)。
 * 本当の認証・認可は各ページとサーバーアクションの requireUser() で必ず行う。
 */
const PUBLIC_PATHS = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("its_session");

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/home" : "/login", request.url));
  }
  if (!hasSession && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico)$).*)"],
};
