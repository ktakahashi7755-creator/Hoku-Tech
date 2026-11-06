# ITS ENGINEER ACADEMY

ITS 合同会社のエンジニア育成プラットフォーム (LMS)。受講生の学習・課題提出、講師のレビュー、
管理者による進捗把握を 1 つのアプリで行う。

* 設計: [../docs/PRD.md](../docs/PRD.md) / [../docs/architecture.md](../docs/architecture.md) / [../docs/database-schema.md](../docs/database-schema.md)
* 進捗: [../docs/development-progress.md](../docs/development-progress.md)
* 起動・運用: [../docs/deployment-guide.md](../docs/deployment-guide.md)
* テスト: [../docs/test-plan.md](../docs/test-plan.md)

## すぐに動かす

```bash
cp .env.example .env     # DATABASE_URL を設定 (PostgreSQL 16)
npm ci
npm run db:migrate
npm run db:seed          # 開発用データ。本番では実行できない
npm run dev
```

本番と同じ構成 (Docker) で動かす手順は [deployment-guide.md](../docs/deployment-guide.md) の §5。

## よく使うコマンド

| コマンド | 内容 |
|----------|------|
| `npm run typecheck` / `npm run lint` | 型検査 / 静的解析 |
| `npm test` | 単体テスト (Vitest) |
| `npm run verify:code` | 教材のサンプルコードを JDK 21 / bash / PostgreSQL / Maven / Chromium で実行し、掲載した実行結果と比較 (`DATABASE_URL` が必要) |
| `npm run build` | 本番ビルド |
| `npm run test:e2e -- --trace off` | E2E (Playwright)。`TEST_DATABASE_URL` の DB を作り直す |
| `scripts/backup.sh` / `scripts/restore.sh` | DB のバックアップと復元 (deployment-guide.md §6) |

## ディレクトリ

| パス | 内容 |
|------|------|
| `prisma/` | スキーマ・マイグレーション・seed |
| `content/` | 初期カリキュラム定義と、実行検証するサンプルコード |
| `src/app/(app)/` | ログイン後の画面 (受講生・講師・管理者) |
| `src/app/actions/` | 更新処理 (サーバーアクション。毎回サーバー側で認可) |
| `src/lib/auth/` | セッション・パスワード・ロール |
| `src/lib/progress/` | 指標計算・指導提案 (純粋関数) |
| `src/lib/queries/` | データ取得 (閲覧権限を確認してから取得) |
| `tests/unit`, `tests/e2e` | 単体・E2E テスト |
| `Dockerfile`, `docker-compose.yml` | コンテナでの実行 |
