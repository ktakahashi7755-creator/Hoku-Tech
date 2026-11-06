import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./prisma-client";

/**
 * Prisma クライアント (1 プロセスに 1 つ)。
 * 画面やサーバーアクションからは server-only を付けた "@/lib/db" を使う。
 * proxy.ts (React Server Components の外で動く) からはこちらを使う。
 *
 * 最初に使われた時点で生成する。モジュール読み込み時に生成すると、
 * DATABASE_URL を渡さない `next build` (Docker のビルドなど) が失敗するため。
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function client(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const target = client();
    const value = Reflect.get(target, property, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
});
