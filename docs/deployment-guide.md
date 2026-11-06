# ITS ENGINEER ACADEMY — デプロイ・運用ガイド

> 版: v0.4 (2026-11-06)。本番環境はまだ存在しない (契約が必要なため未作成、development-progress.md の D-03)。
> 本書は「実施・確認済み」の手順と「本番化の手順案 (未実施・要承認)」を分けて記載する。

---

## 1. ローカル開発環境 (確認済み)

前提: Node.js 22、PostgreSQL 16、JDK 21 (教材コードの検証に使用)

```bash
cd its-academy
cp .env.example .env            # DATABASE_URL を自分の環境に合わせる。ローカルでは APP_ENV=local, COOKIE_SECURE=false
npm ci
npm run db:migrate              # マイグレーションを適用
npm run db:seed                 # 開発用データ (NODE_ENV=production では拒否される)
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

CI (`.github/workflows/its-academy.yml`) は上記に加えて Firefox / WebKit の E2E と、
コンテナ構成の確認 (§5 の起動・ヘッダー・起動拒否、§6 のバックアップと復元) を毎回実行する。

## 3. 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `DATABASE_URL` | 必須 (実行時) | PostgreSQL 接続文字列。秘密情報としてホスティングのシークレット管理に保存し、リポジトリに書かない。`next build` には不要 |
| `APP_ENV` | 推奨 | `production` / `staging` / `test` / `local`。`NODE_ENV=production` のときの既定は `production` |
| `COOKIE_SECURE` | 本番・検証で必須 | `true` で Cookie に Secure 属性、HSTS と `upgrade-insecure-requests` を付ける (HTTPS 前提)。**ヘッダーはビルド時に確定する**ため、ビルド時と実行時の両方で同じ値にする |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | 複数台構成で必須 | サーバーアクションの暗号鍵を全台で揃える |
| `TRUSTED_PROXY_HOPS` | 本番で推奨 | HTTPS を終端するプロキシの段数 (1 以上の整数)。ログイン試行の制限と監査ログの IP に `X-Forwarded-For` の末尾から数えた値を使い、利用者が書いた偽の値を使わない。未設定なら先頭の値 (プロキシなしのローカル向け)。Cloud Run は 1 (deploy-gcp.md §5) |
| `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_NAME` / `BOOTSTRAP_ADMIN_PASSWORD` | 初期設定のときだけ | `npm run db:bootstrap` で作る最初のシステム管理者 (§7) |
| `SEED_PASSWORD` | 任意 | 開発用 seed のパスワード |
| `TEST_DATABASE_URL` | 任意 | E2E 用 DB |
| `POSTGRES_PASSWORD` | docker compose で必須 | §5 の DB コンテナのパスワード |

### 起動時の設定確認 (確認済み)

`src/instrumentation-node.ts` が起動時に `src/lib/env-check.ts` で設定を確認し、問題があれば
1 行の JSON (`{"level":"fatal","event":"config_invalid","problems":[...]}`) を出して **終了コード 1 で終了する**。
値そのものはログに出さない。

| `APP_ENV` | 確認内容 |
|-----------|----------|
| production / staging | `DATABASE_URL` があること、`COOKIE_SECURE=true`、開発用・初期値のパスワード (`its_dev_only` など) を使っていないこと |
| test / local | `DATABASE_URL` があること |

## 4. 監視・ログ (確認済み)

| 項目 | 内容 |
|------|------|
| 死活監視 | `GET /api/health` (ログイン不要)。DB に接続できれば 200 `{"status":"ok"}`、できなければ 503 `{"status":"unavailable"}`。内部情報は返さない |
| エラーログ | サーバー側の例外を 1 行の JSON (`"event":"request_error"`) で標準エラーに出す (`src/instrumentation.ts`)。URL のクエリ・Cookie・本文は記録しない |
| セキュリティヘッダー | CSP (`default-src 'self'`、`frame-ancestors 'none'` など)、X-Frame-Options DENY、X-Content-Type-Options、Referrer-Policy、Permissions-Policy、HSTS (`COOKIE_SECURE=true` 時)。`X-Powered-By` は出さない (`src/lib/security-headers.ts`) |
| 外部のエラー監視サービス | 未導入 (個人情報の外部送信になりうるため要承認。D-03 と合わせて決定) |

CSP は `script-src 'unsafe-inline'` を含む。Next.js の Partial Prerender (事前に生成した HTML) は
リクエストごとの nonce と両立しないため。教材本文を HTML として解釈しない (architecture.md §3) ことで XSS を防いでいる。

## 5. コンテナで動かす (確認済み: 2026-11-06、Docker 29.9 / Compose 5.6)

| ファイル | 内容 |
|----------|------|
| `its-academy/Dockerfile` | `runner` (既定): Next.js の standalone 出力のみ・`node` ユーザーで実行・HEALTHCHECK 付き (約 440MB)。`tools`: マイグレーションと seed 用 (開発用の依存関係を含むため常駐させない) |
| `its-academy/docker-compose.yml` | `db` (PostgreSQL 16) → `migrate` (`prisma migrate deploy`、完了まで待つ) → `app` (127.0.0.1:3000)。`seed` は `demo` プロファイルのときだけ |

```bash
cd its-academy
printf 'POSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 24)" > .env
docker compose up -d --build --wait          # 既定は APP_ENV=production / COOKIE_SECURE=true
curl http://127.0.0.1:3000/api/health        # {"status":"ok"}
docker compose --profile demo run --rm seed  # 評価用のデモデータ (本番では実行しない)
docker compose down                          # 停止 (-v を付けると DB のデータも消える)
```

確認した内容 (同じ手順を CI の `container` ジョブでも実行):

* 本番と同じ設定 (APP_ENV=production, COOKIE_SECURE=true) で起動し、ヘルスチェックが 200、コンテナの HEALTHCHECK が healthy
* Chromium で受講生・管理者がログインでき、Cookie が `Secure` / `HttpOnly`、コンソールエラー 0 件
  (127.0.0.1 はブラウザが安全な接続として扱うため、HTTPS なしでも Secure Cookie で確認できる)
* 開発用パスワードの `DATABASE_URL` を渡すと、ログを 1 行出して終了コード 1 で終了する
* アプリのプロセスは root ではなく `node` (uid 1000) で動く
* `.env` はイメージに含めない (`.dockerignore`)。`next build` は `DATABASE_URL` なしで成功する

補足:

* Docker Hub の取得回数制限に当たる場合は `NODE_IMAGE` / `POSTGRES_IMAGE` で取得元を変えられる
  (例: `NODE_IMAGE=mirror.gcr.io/library/node:22-bookworm-slim`)。
* 社内プロキシなどで独自の CA 証明書が必要な場合は `docker build --secret id=ca,src=<証明書のパス>` を付ける。
* localhost / 127.0.0.1 以外の HTTP で試す場合だけ `COOKIE_SECURE=false APP_ENV=local docker compose up --build` とする
  (Secure Cookie は HTTPS 以外では送られないため)。この設定でインターネットに公開しない。
* インターネットへは、HTTPS を終端するリバースプロキシ (TLS 1.2 以上) 経由で公開する。

## 6. バックアップと復元

### スクリプト (確認済み)

| スクリプト | 内容 |
|------------|------|
| `scripts/backup.sh` | `pg_dump --format=custom` で `BACKUP_DIR` (既定 `./backups`) に `its_academy-<UTC時刻>.dump` を作る。`pg_restore --list` で読み戻せることを確認してから保存し、失敗時は途中のファイルを残さない。ファイルは所有者のみ読み書き可 (umask 077)。`BACKUP_RETENTION_DAYS` (既定 14) 日より古い `its_academy-*.dump` だけを削除する |
| `scripts/restore.sh` | `pg_restore --clean --if-exists --single-transaction` で復元。復元先の DB 名を表示して `yes` の入力を求める (`RESTORE_CONFIRM=yes` で省略) |

```bash
# ホストに PostgreSQL 16 のクライアントがある場合
DATABASE_URL=postgresql://... scripts/backup.sh
DATABASE_URL=postgresql://.../its_academy_restore scripts/restore.sh backups/its_academy-20261106T133726Z.dump

# docker compose の DB を、PostgreSQL イメージに入っているクライアントでバックアップする場合
. ./.env
docker run --rm --network its-academy_default -v "$PWD/scripts:/scripts:ro" -v "$PWD/backups:/backups" \
  -e BACKUP_DIR=/backups -e DATABASE_URL="postgresql://its:$POSTGRES_PASSWORD@db:5432/its_academy" \
  postgres:16 /scripts/backup.sh
```

確認した内容 (2026-11-06):

* seed 済みの DB をバックアップ → 別の DB に復元し、users / lessons / lesson_progress / submissions / reviews / audit_logs の件数が一致 (8 / 35 / 21 / 3 / 3 / 3)
* 同じファイルを 2 回続けて復元しても成功する (`--clean --if-exists`)
* 20 日前の日付の `its_academy-*.dump` は削除され、同じ日付の別名ファイルは残る
* CI の `container` ジョブで毎回、バックアップ → 復元 → マイグレーション件数の一致を確認する

### 本番での方針 (未実施・D-03 / D-09 の決定後に確定)

| 項目 | 方針 |
|------|------|
| 方式 | マネージド DB の自動バックアップ (日次) + ポイントインタイムリカバリ (7 日以上) |
| 追加の論理バックアップ | 日次で `scripts/backup.sh` を実行し、暗号化して別リージョンのストレージへ |
| 保存期間 | 日次 30 日 / 月次 12 か月 (個人情報の保存期間規程 D-09 と合わせて最終決定) |
| 復元手順 | `scripts/restore.sh` で検証用 DB に復元 → アプリを検証用 DB に向けて E2E を実行 → 問題なければ切り替え |
| 訓練 | 四半期ごとに復元訓練を行い、所要時間を記録する |

バックアップファイルには個人情報が含まれるため、共有ストレージに置かず、作業用に取り出したものは作業後に削除する。
`backups/` は `.gitignore` 済み。

## 7. 本番化の手順案 (未実施・要承認)

Google Cloud の場合の具体的なコマンドは [deploy-gcp.md](deploy-gcp.md)。


1. ホスティングと DB の選定・契約 (承認後、D-03)。候補: コンテナ実行環境 + マネージド PostgreSQL (日本リージョン、自動バックアップと PITR がある製品)
2. シークレットの登録: `DATABASE_URL`、`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (複数台の場合)。`APP_ENV=production`、`COOKIE_SECURE=true`
3. イメージのビルド: `docker build -t its-academy .` と `docker build --target tools -t its-academy-tools .`
4. リリースごとに `its-academy-tools` で `npx prisma migrate deploy` を実行してから `its-academy` を入れ替える
5. HTTPS 終端 (TLS 1.2 以上)。リバースプロキシ配下なら `X-Forwarded-For` を信頼する範囲を限定する
6. 死活監視に `/api/health` を登録し、標準エラーの JSON ログをログ基盤に送る
7. 初期設定 `npm run db:bootstrap` (tools イメージ、確認済み) で教材を登録し、最初の SUPER_ADMIN を作る (seed は本番で動かない)。
   運用者 2 名で実施し、初回ログイン時にパスワードを変更する。docker compose では
   `BOOTSTRAP_ADMIN_EMAIL=... docker compose --profile setup run --rm bootstrap`
8. 本番公開前チェック: test-plan.md の全項目成功、npm audit の残件の評価、復元訓練 1 回

## 8. 定期運用

| 頻度 | 作業 |
|------|------|
| 毎日 | ダッシュボードで停滞・レビュー待ちを確認。バックアップの成功を確認 |
| 毎週 | 依存パッケージの脆弱性確認 (`npm audit`)、監査ログの確認 |
| 毎月 | 設定画面の「古い記録を削除」で期限切れセッションと 30 日より前のログイン試行を削除 (監査ログに残る) |
| 四半期 | バックアップ復元訓練、権限の棚卸し (管理者の「アカウント」画面で退職講師を無効化) |
