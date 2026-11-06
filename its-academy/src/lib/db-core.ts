import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./prisma-client";

/**
 * Prisma クライアント (1 プロセスに 1 つ)。
 * 画面やサーバーアクションからは server-only を付けた "@/lib/db" を使う。
 * proxy.ts (React Server Components の外で動く) からはこちらを使う。
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
