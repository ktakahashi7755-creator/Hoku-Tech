# PROVIDE ENGINEER ACADEMY

プロバイド株式会社のエンジニア育成プラットフォーム (LMS)。受講生の学習・課題提出、講師のレビュー、
管理者による進捗把握を 1 つのアプリで行う。

* 設計: [../docs/PRD.md](../docs/PRD.md) / [../docs/architecture.md](../docs/architecture.md) / [../docs/database-schema.md](../docs/database-schema.md)
* 進捗: [../docs/development-progress.md](../docs/development-progress.md) / 講師レビュー: [../docs/instructor-review-checklist.md](../docs/instructor-review-checklist.md)
* 起動・運用: [../docs/deployment-guide.md](../docs/deployment-guide.md)
* テスト: [../docs/test-plan.md](../docs/test-plan.md)

## すぐに動かす

```bash
cp .env.example .env     # DATABASE_URL を設定し、ローカルでは APP_ENV=local・COOKIE_SECURE=false にする (変え忘れると起動時に config_invalid で終了する)
npm ci
npx prisma generate      # Prisma クライアントを生成 (npm ci の後に毎回必要)
npm run db:migrate       # DB ユーザーに CREATEDB 権限がない場合は、先に createdb its_academy
npm run db:seed          # 開発用データ。本番では実行できない
npm run dev              # http://localhost:3000 (別のポートは PORT=3400 npm run dev)
```

開発用アカウントのパスワードは `its-dev-password-2026` (`SEED_PASSWORD` で変更可)。アカウントの一覧は deployment-guide.md §1。

本番・検証環境では seed の代わりに、マイグレーションの後で `npm run db:bootstrap` を実行する
(教材の登録と最初の管理者の作成。管理者を作るには `BOOTSTRAP_ADMIN_EMAIL` が必要。`BOOTSTRAP_ADMIN_PASSWORD` を指定しなければ初回パスワードを無作為に作って 1 回だけ表示)。

自分の Windows PC で見本データ入りのアプリを触る手順 (お試し用) は [try-on-windows.md](../docs/try-on-windows.md)。

本番と同じ構成 (Docker) で動かす手順は [deployment-guide.md](../docs/deployment-guide.md) の §5。

## よく使うコマンド

| コマンド | 内容 |
|----------|------|
| `npm run typecheck` / `npm run lint` | 型検査 / 静的解析 |
| `npm test` | 単体テスト (Vitest) |
| `npm run verify:code` | 教材のサンプルコードを JDK 21 / bash / PostgreSQL / Maven / Chromium で実行し、掲載した実行結果と比較 (`VERIFY_DATABASE_URL`、未指定なら `DATABASE_URL` の DB に一時スキーマを作って削除する) |
| `npm run build` | 本番ビルド |
| `npm run test:e2e -- --trace off` | E2E (Playwright)。先に `npm run build`。初回は `npx playwright install chromium`。詳しくは deployment-guide.md §2 |
| `scripts/backup.sh` / `scripts/restore.sh` | DB のバックアップと復元 (deployment-guide.md §6) |
| `npm run sheet -- --out <フォルダ>` / `--push` | チームのスプレッドシート (WBS・タスク・スケジュール・カリキュラム) の中身を書き出す / 反映する ([project-sheet.md](../docs/project-sheet.md)) |

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
