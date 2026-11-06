import { db } from "@/lib/db";

/**
 * 死活監視用。データベースに接続できれば 200、できなければ 503。
 * ログイン不要のため、内部の情報 (エラーの内容・バージョン) は返さない。
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
