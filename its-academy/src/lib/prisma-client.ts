import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/** Prisma 7 はドライバアダプタ経由で接続する。接続先は環境変数 DATABASE_URL */
export function createPrismaClient(connectionString = process.env.DATABASE_URL): PrismaClient {
  if (!connectionString) throw new Error("DATABASE_URL が設定されていません");
  // 接続数の上限。DB 側の max_connections と台数に合わせて DB_POOL_MAX で変える (既定 10)
  const max = Number(process.env.DB_POOL_MAX) > 0 ? Number(process.env.DB_POOL_MAX) : 10;
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, max }) });
}
