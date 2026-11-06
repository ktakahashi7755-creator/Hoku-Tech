import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/** Prisma 7 はドライバアダプタ経由で接続する。接続先は環境変数 DATABASE_URL */
export function createPrismaClient(connectionString = process.env.DATABASE_URL): PrismaClient {
  if (!connectionString) throw new Error("DATABASE_URL が設定されていません");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
