# ITS ENGINEER ACADEMY — アーキテクチャ

> 版: v0.3 (2026-11-06) / 実装: [`its-academy/`](../its-academy/)

---

## 1. 技術構成の比較と決定

| 観点 | A: Next.js フルスタック (採用) | B: Spring Boot API + Next.js | C: 既製 LMS (Moodle / WordPress + Tutor LMS) |
|------|-------------------------------|------------------------------|-----------------------------------------------|
| 運用費 | サーバー 1 種 + PostgreSQL。最小構成なら月数千円台から | API と画面の 2 種を運用 | ホスティングは安いがプラグイン費用・保守工数 |
| 保守性 | 型 (TypeScript) が DB からの画面まで一貫 | Java 講師が API を保守できる利点。2 言語・2 デプロイ | 進捗の定義 (A〜E 分離) や評価ルーブリックの独自要件はプラグイン改造が必要 |
| セキュリティ | サーバーアクションの Origin 検査、サーバー側認可を 1 か所に集約 (DAL) | 認可が API と画面に分散しやすい | プラグインの脆弱性管理が継続的に必要 |
| 拡張性 (AI) | 構造化データ + サーバー側で外部 API を呼べる | 同等 | プラグイン次第 |
| 教育内容との関係 | LMS 本体の言語は教材 (Java) と分離してよい (依頼書どおり) | 教材と同じ Java で講師が触れる | — |

**決定: A を採用。** 理由は、1 チームで保守でき、権限チェックを 1 か所 (`src/lib/auth/dal.ts`) に集約でき、
運用費が最も小さいため。Java 講師が LMS に関与したい場合は、B への移行ではなく
「課題の自動テスト実行基盤」(将来の隔離実行環境) を Java で作る形を推奨する。

### 採用バージョン (2026-11-06 時点)

| 種別 | 採用 | 備考 |
|------|------|------|
| フレームワーク | Next.js 16.4.5 (App Router, Cache Components, Partial Prefetching) / React 19.3 | |
| 言語 | TypeScript 5 | |
| DB | PostgreSQL 16 | |
| ORM | Prisma 7.10.1 (ドライバアダプタ `@prisma/adapter-pg`) | 接続設定は `prisma.config.ts` と `src/lib/prisma-client.ts` |
| 認証 | 自前実装 (DB セッション + argon2id) | §3 |
| 検証 | zod 4 | |
| UI | Tailwind CSS 4 + 自作の最小コンポーネント (`src/components/ui.tsx`) | shadcn/ui は導入していない (§5) |
| テスト | Vitest 5 (単体) / Playwright 1.63 (E2E・Chromium / Firefox / WebKit) / axe-core 4.14 (アクセシビリティ) | |
| CI | GitHub Actions (`.github/workflows/its-academy.yml`) | PostgreSQL サービス + JDK 21。Firefox / WebKit の E2E とコンテナ構成の確認も実行 |
| 実行形態 | Next.js standalone 出力 + Docker (`its-academy/Dockerfile`, `docker-compose.yml`) | deployment-guide.md §5 |

## 2. 全体構成

```
ブラウザ
  │  HTTPS (Cookie: its_session  HttpOnly / SameSite=Lax / Secure)
  ▼
Next.js (Node.js)
  ├─ src/proxy.ts                 未ログインは /login へ。/admin/** はセッションとロールを DB で確認し、権限がなければ 404
  ├─ src/app/(auth)/login         ログイン画面
  ├─ src/app/(app)/...            受講生・講師・管理者の画面 (Server Components)
  ├─ src/app/actions/*.ts         サーバーアクション (更新処理。毎回 requireUser で認可)
  ├─ src/app/admin/export/...     CSV 出力 (Route Handler)
  ├─ src/app/api/health           死活監視 (ログイン不要。DB に接続できれば 200、できなければ 503)
  ├─ src/instrumentation*.ts      起動時の設定確認 (問題があれば終了) / サーバーエラーの JSON ログ
  ├─ src/lib/auth/                セッション・パスワード・ロール・試行制限
  ├─ src/lib/queries/             データ取得 (受講生の閲覧権限を検証してから取得)
  └─ src/lib/progress/            指標計算・指導提案 (純粋関数・単体テスト済み)
  ▼
PostgreSQL (Prisma)
```

### レンダリング

* `cacheComponents: true`。認証が必要な画面は `(app)/layout.tsx` の `<Suspense>` 内で描画し、
  ヘッダー等の静的部分を先に返す (Partial Prerender)。
* 個人データは `use cache` しない (共有キャッシュに個人情報を載せない)。

## 3. 認証・認可

| 項目 | 実装 | ファイル |
|------|------|----------|
| パスワード保存 | argon2id (m=19MiB, t=2, p=1)。最小 12 文字 | `src/lib/auth/password.ts` |
| セッション | 256bit ランダムトークンを Cookie に、DB には SHA-256 ハッシュのみ保存。7 日で失効、残り 1 日で延長 | `src/lib/auth/session.ts` |
| Cookie | HttpOnly / SameSite=Lax / Secure (本番は `COOKIE_SECURE=true`) | 同上 |
| ログイン試行制限 | 15 分間にメール単位 5 回・IP 単位 30 回の失敗で拒否 | `src/lib/auth/rate-limit.ts` |
| アカウント列挙対策 | 失敗メッセージを統一。存在しないユーザーでも照合用の固定ハッシュと照合して応答時間を揃える | `src/app/actions/auth.ts` |
| パスワード変更 | 全セッションを失効させてから新しいセッションを発行 | 同上 |
| 認可 | 全ページ・全サーバーアクション・Route Handler で `requireUser(roles)` | `src/lib/auth/dal.ts` |
| 個人データの分離 | 受講生本人 / 管理者 / **その受講生の担当講師**のみ閲覧可 (`canViewStudent`) | `src/lib/auth/roles.ts`, `src/lib/queries/student.ts` |
| ロール付与・アカウント操作 | ADMIN は INSTRUCTOR / STUDENT のみ付与・操作可、SUPER_ADMIN はすべて。自分自身は操作できない (`canAssignRole`, `canManageAccount`)。仮パスワード発行時は全セッションを失効し、次回ログインで変更を必須にする | `src/lib/auth/roles.ts`, `src/app/actions/accounts.ts` |
| CSRF | サーバーアクションは POST のみ + Next.js が Origin と Host を照合 + SameSite=Lax | Next.js 組み込み |
| XSS | 教材本文は HTML として解釈せず React のエスケープで表示 (`RichText`)。`dangerouslySetInnerHTML` 不使用 | `src/components/lesson/rich-text.tsx` |
| 入力検証 | すべて zod でサーバー側検証 (長さ・形式・列挙値)。GitHub URL は正規表現で限定 | `src/app/actions/*.ts`, `src/lib/validation.ts` |
| CSV インジェクション | `= + - @` 等で始まるセルに `'` を付与 | `src/lib/csv.ts` |
| 監査ログ | ログイン成功/失敗・ログアウト・パスワード変更・提出・採点・コメント・スキル評価・受講設定・設定変更・教材公開・課題とルーブリックの編集・ロール変更・仮パスワード発行・利用停止と再開・古い記録の削除・CSV 出力 | `src/lib/audit.ts` |
| セキュリティヘッダー | CSP (`frame-ancestors 'none'` など)、HSTS (HTTPS 時)、X-Frame-Options、nosniff、Referrer-Policy、Permissions-Policy。Partial Prerender と nonce が両立しないため `script-src` は `'unsafe-inline'` を含む | `src/lib/security-headers.ts` |
| 起動時の設定確認 | 本番・検証環境で COOKIE_SECURE なし・開発用パスワードの接続文字列なら終了コード 1 で終了 | `src/lib/env-check.ts`, `src/instrumentation-node.ts` |

### 権限不足時の応答

* **ロールで決まるエリア** (`/admin/**`、管理者専用の教材管理・設定・受講生追加): ページの描画前に `src/proxy.ts` が
  セッションとロールを DB で確認し、権限がなければ Next.js の 404 画面を **HTTP 404** で返す (`src/lib/auth/proxy-guard.ts`)。
  未ログイン・期限切れは `/login` へ 307 リダイレクト。
* **個別のデータで決まる場合** (存在しない slug、担当外の受講生の詳細など): ページ内の `notFound()` で 404 画面を表示する。
  描画 (ストリーミング) が始まった後の判定のため HTTP ステータスは 200 だが、Next.js が `noindex` を付け、
  他人のデータは HTML に含まれない (E2E で検証)。ストリーミング開始後にステータスを変えられないのは Next.js の仕様。
* ページ側の `requireUser()` / `assertCanViewStudent()` による確認は残す (二重の防御)。
* `forbidden()` (403) は Next.js 16.4 で実験的機能のため採用していない。
* 検証 (2026-11-06): 受講生は /admin 配下がすべて 404、講師は教材管理・設定・受講生追加が 404・それ以外は 200、管理者はすべて 200。
* `proxy.ts` は React Server Components の外で動くため、`server-only` を付けない `src/lib/db-core.ts` の Prisma クライアントを使う。

## 4. 教材データと進捗データの分離

* 教材: `courses → modules → lessons → lesson_versions`。本文は `lesson_versions.content` (JSON, zod で検証)。
* 選択モジュール (`modules.optional`、L8) のレッスン・課題・理解度チェックは指標 A〜E の計算から除く (`requiredMetricInput`)。
* 進捗: `lesson_progress` は `lesson_id` に紐づき、`lesson_version_id` (最後に学習した版) と
  `completed_version_id` (完了時の版) を持つ。
* 理解度チェックは `lesson_version_id` に紐づくため、教材を改訂すると新しい版の合格が必要になる (過去の合格記録は残る)。
* 採点は `reviews.scores` に採点時点のルーブリックを、`reviews.pass_score` に採点時点の合格点を保存する。

## 5. UI 方針

* 依頼書の推奨は shadcn/ui だったが、必要な部品 (ボタン・カード・バッジ・入力・進捗バー) が少なく、
  CLI による生成コードの取り込みより自作の小さな部品の方が監査しやすいため導入していない。
  部品が増えた段階で再検討する。
* フォントは外部 CDN を使わず OS の日本語フォントを使う (`globals.css` の `--font-sans`)。

## 6. 教材コードの検証

`content/curriculum.ts` のサンプルコードは `content/code/` の実ファイルを参照し、
`scripts/verify-code.ts` が JDK 21 / bash / PostgreSQL 16 (使い捨てスキーマ) / Maven (runner スクリプトでビルド・起動・curl) で実行して、
教材に載せた実行結果と行ごとに比較する (行末の空白のみ無視)。CI で毎回実行し、一致しなければ失敗する。
CMS で編集したコードは自動検証の対象外のため、「自動実行検証済み」の印はコードと実行結果が変わらない場合だけ引き継ぎ、
学習画面の説明文も検証済みかどうかで切り替える。

## 7. 既知のリスクと対応方針

| リスク | 内容 | 対応 |
|--------|------|------|
| npm audit | 本番の依存関係は 0 件 (Prisma 7.10.1 への更新で high 3 件を解消、Vitest 5 への更新で開発用の critical 2 件を解消)。残りは開発用の lint ツール (eslint-config-next 経由の minimatch) の moderate 8 件で、利用者に配布されない | eslint-config-next の更新時に再確認 |
| 受講生一覧の集計 | 一括読み込みと SQL での集計で 200 名 0.25 秒・700 名 0.8 秒 (test-plan.md §4) | 同時アクセスが多い大規模運用では、集計結果を保存する方式を検討 |
| ログイン試行制限の分散環境 | DB ベースのため複数台構成でも有効だが、`login_attempts` が増え続ける | 管理者が設定画面から 30 日より前の記録と期限切れセッションを削除できる (監査ログに残る)。自動実行は運用先の決定後 |
| 学習時間の精度 | 画面表示中に 60 秒ごとに記録 (1 回最大 90 秒加算)。複数タブで重複しうる | 指標には使わず参考表示のみ |
