import { defineConfig } from "prisma/config";

// Prisma 7 は .env を自動で読み込まないため、ローカル開発では .env があれば読み込む (本番は環境変数で渡す)
try {
  process.loadEnvFile(".env");
} catch {
  // .env がない環境 (CI・本番) では何もしない
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
