# ITS ENGINEER ACADEMY — デプロイ・運用ガイド

> 版: v0.2 (2026-11-06)。本番環境はまだ存在しない (契約が必要なため未作成、development-progress.md の D-03)。
> 本書はローカル環境の手順 (実施・確認済み) と、本番化の手順案 (未実施) を分けて記載する。

---

## 1. ローカル開発環境 (確認済み)

前提: Node.js 22、PostgreSQL 16、JDK 21 (教材コードの検証に使用)

```bash
cd its-academy
cp .env.example .env            # DATABASE_URL を自分の環境に合わせる
npm ci
npm run db:migrate              # マイグレーションを適用
npm run db:seed                 # 開発用データ (本番では実行不可)
npm run dev                     # http://localhost:3000
```

開発用アカウント (パスワードは `SEED_PASSWORD`、未指定時は seed が表示する開発用の値):

| ロール | メール |
|--------|--------|
| 受講生 | student@its.example (ほか student2〜4) |
| 講師 | instructor@its.example / instructor2@its.example |
| 管理者 | admin@its.example |
| システム管理者 | super@its.example |

## 2. 検証コマンド

```bash
npm run typecheck && npm run lint && npm test && npm run verify:code && npm run build
npm run test:e2e -- --trace off   # TEST_DATABASE_URL の DB を作り直して実行
```

## 3. 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `DATABASE_URL` | 必須 | PostgreSQL 接続文字列。秘密情報としてホスティングのシークレット管理に保存し、リポジトリに書かない |
| `COOKIE_SECURE` | 本番必須 | `true` で Cookie に Secure 属性を付ける (HTTPS 前提) |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | 複数台構成で必須 | サーバーアクションの暗号鍵を全台で揃える |
| `SEED_PASSWORD` | 任意 | 開発用 seed のパスワード |
| `TEST_DATABASE_URL` | 任意 | E2E 用 DB |

## 4. 本番化の手順案 (未実施・要承認)

1. ホスティングと DB の選定・契約 (承認後)。候補: コンテナ実行環境 + マネージド PostgreSQL (日本リージョン、自動バックアップと PITR がある製品)
2. 環境変数をシークレットとして登録 (`DATABASE_URL`, `COOKIE_SECURE=true`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`)
3. `npm ci && npm run build` → `npm run db:migrate` → `npm start`
4. HTTPS 終端 (TLS 1.2 以上)。リバースプロキシ配下なら `X-Forwarded-For` を信頼する範囲を限定
5. 最初の SUPER_ADMIN を DB に直接作成 (seed は本番で動かない)。作成手順は運用者 2 名で実施し、監査ログに残す
6. エラー監視 (Sentry 等) の導入 — 個人情報をイベントに含めない設定にする (未決定事項)
7. 本番公開前チェック: test-plan.md の全項目成功、npm audit の残件の評価、バックアップ復元の訓練

## 5. バックアップと復元

| 項目 | 方針 |
|------|------|
| 方式 | マネージド DB の自動バックアップ (日次) + ポイントインタイムリカバリ (7 日以上) |
| 追加の論理バックアップ | 日次で `pg_dump --format=custom` を別リージョンのストレージへ。暗号化して保存 |
| 保存期間 | 日次 30 日 / 月次 12 か月 (個人情報の保存期間規程と合わせて最終決定) |
| 復元手順 | `pg_restore --clean --if-exists -d <復元先>` で検証用 DB に復元 → アプリを検証用 DB に向けて E2E を実行 → 問題なければ切り替え |
| 訓練 | 四半期ごとに復元訓練を行い、所要時間を記録する |

ローカルでの確認手順 (2026-11-06 実施。復元後の users / lesson_versions / reviews 件数が元 DB と一致することを確認):

```bash
pg_dump --format=custom "$DATABASE_URL" -f backup.dump
createdb -h localhost -U its its_academy_restore
pg_restore --no-owner -d "postgresql://its:<password>@localhost:5432/its_academy_restore" backup.dump
psql "postgresql://its:<password>@localhost:5432/its_academy_restore" \
  -c "select (select count(*) from users), (select count(*) from lesson_versions), (select count(*) from reviews)"
```

バックアップファイルには個人情報が含まれるため、作業後は確実に削除し、共有ストレージに置かない。

## 6. 定期運用

| 頻度 | 作業 |
|------|------|
| 毎日 | ダッシュボードで停滞・レビュー待ちを確認 |
| 毎週 | 依存パッケージの脆弱性確認 (`npm audit`)、監査ログの確認 |
| 毎月 | `login_attempts` と期限切れ `sessions` の削除 (削除ジョブは未実装) |
| 四半期 | バックアップ復元訓練、権限の棚卸し (退職講師の無効化) |
