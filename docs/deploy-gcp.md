# ITS ENGINEER ACADEMY — Google Cloud への公開手順 (D-03 承認後に実施)

> 版: v1.0 (2026-11-06)。**未実施**。Google Cloud の契約・プロジェクトはまだ存在しない。
> D-03 で Google Cloud が承認され、依頼者が契約とプロジェクト作成を済ませた後に、この順で実施する。
>
> 確認の状況:
> * このリポジトリ側 (コンテナ・接続文字列・初期設定コマンド・IP の扱い) は 2026-11-06 にローカルと CI で確認済み (§7)
> * Google Cloud とエックスサーバーの操作 (gcloud コマンド・画面名) は、作成時点で公式ドキュメントを調査環境から取得できなかったため、
>   一般的な手順に基づく。**各手順の前に公式ドキュメントで確認する** (「要確認」と書いた箇所は特に)

---

## 0. 決めておくこと

| 項目 | 例 | 決める人 |
|------|----|----------|
| Google Cloud の請求先・管理者アカウント | 会社の Google アカウント | 依頼者 |
| プロジェクト ID | `its-academy-prod` | 依頼者 |
| 公開するアドレス (サブドメイン) | `academy.<会社のドメイン>` | 依頼者 |
| 最初のシステム管理者のメールアドレス | 運用責任者のアドレス | 依頼者 |
| 作業者 | 2 名 (1 名が操作、1 名が確認) | 依頼者 |

以下では次の値を使う。実際の値に置き換える。

```bash
PROJECT=its-academy-prod
REGION=asia-northeast1                       # 東京
REPO=$REGION-docker.pkg.dev/$PROJECT/its-academy
INSTANCE=its-db
CONN=$PROJECT:$REGION:$INSTANCE              # Cloud SQL の接続名
DOMAIN=academy.example.co.jp                 # 実際のサブドメインに置き換える
```

## 1. プロジェクトの準備

```bash
gcloud config set project $PROJECT
gcloud services enable run.googleapis.com sqladmin.googleapis.com \
  artifactregistry.googleapis.com secretmanager.googleapis.com
gcloud artifacts repositories create its-academy --repository-format=docker --location=$REGION

# アプリ専用のサービスアカウント (最小権限)
gcloud iam service-accounts create its-academy-run
SA=its-academy-run@$PROJECT.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=roles/cloudsql.client
```

## 2. データベース (Cloud SQL for PostgreSQL 16)

```bash
gcloud sql instances create $INSTANCE --database-version=POSTGRES_16 --region=$REGION \
  --edition=ENTERPRISE --tier=db-g1-small --storage-type=SSD --storage-size=20 \
  --backup-start-time=18:00 --enable-point-in-time-recovery \
  --retained-backups-count=30 --retained-transaction-log-days=7 \
  --deletion-protection
gcloud sql databases create its_academy --instance=$INSTANCE

# アプリ用ユーザー。パスワードは画面に出さずに作り、Secret Manager にだけ保存する
DB_PASSWORD="$(openssl rand -hex 24)"
gcloud sql users create its_app --instance=$INSTANCE --password="$DB_PASSWORD"
printf '%s' "postgresql://its_app:$DB_PASSWORD@localhost/its_academy?host=/cloudsql/$CONN" \
  | gcloud secrets create its-database-url --data-file=-
unset DB_PASSWORD
gcloud secrets add-iam-policy-binding its-database-url --member=serviceAccount:$SA --role=roles/secretmanager.secretAccessor
```

* `18:00` は UTC (日本時間 3:00)。バックアップの保持数・PITR の日数は D-09 (保存期間) の決定に合わせて変える。
  PITR の保持日数の上限はエディションによって異なる (要確認)
* `db-g1-small` は共有コアで SLA の対象外 (hosting-options.md §2)。受講生が増えたら専用コアに変更する
* 接続文字列は Unix ソケット形式 (`?host=/cloudsql/<接続名>`)。この形式でアプリと Prisma が接続できることは確認済み (§7)

## 3. イメージの作成と登録

作業者の PC (Docker が使えるもの) で実行する。Apple Silicon の Mac でも Cloud Run 用に `linux/amd64` で作る。

```bash
cd its-academy
TAG=$(git rev-parse --short HEAD)
gcloud auth configure-docker $REGION-docker.pkg.dev
docker build --platform linux/amd64 -t $REPO/app:$TAG .
docker build --platform linux/amd64 --target tools -t $REPO/tools:$TAG .
docker push $REPO/app:$TAG
docker push $REPO/tools:$TAG
```

`COOKIE_SECURE` は既定で `true` のままにする (HTTPS 前提のヘッダーがビルド時に入る)。

## 4. マイグレーションと初期設定 (Cloud Run ジョブ)

```bash
# マイグレーション (リリースのたびに、アプリを入れ替える前に実行する)
gcloud run jobs create its-migrate --image=$REPO/tools:$TAG --region=$REGION \
  --service-account=$SA --set-cloudsql-instances=$CONN \
  --set-secrets=DATABASE_URL=its-database-url:latest
gcloud run jobs execute its-migrate --region=$REGION --wait

# 初期設定 (最初の 1 回だけ): 教材の登録と最初のシステム管理者の作成
# 初回パスワードは Secret Manager に置き、ジョブのログに出さない
openssl rand -base64 18 | tr -d '\n' | gcloud secrets create its-bootstrap-password --data-file=-
gcloud secrets add-iam-policy-binding its-bootstrap-password --member=serviceAccount:$SA --role=roles/secretmanager.secretAccessor
gcloud run jobs create its-bootstrap --image=$REPO/tools:$TAG --region=$REGION \
  --service-account=$SA --set-cloudsql-instances=$CONN \
  --set-secrets=DATABASE_URL=its-database-url:latest,BOOTSTRAP_ADMIN_PASSWORD=its-bootstrap-password:latest \
  --set-env-vars=BOOTSTRAP_ADMIN_EMAIL=<最初の管理者のメールアドレス> \
  --command=npm --args=run,-s,db:bootstrap
gcloud run jobs execute its-bootstrap --region=$REGION --wait
```

* 初回パスワードは、2 人目の作業者が `gcloud secrets versions access latest --secret=its-bootstrap-password` で確認して管理者に伝える。
  初回ログイン時にパスワードの変更が求められる。変更を確認したら `its-bootstrap-password` と `its-bootstrap` ジョブを削除する
* `db:bootstrap` は何度実行しても、登録済みの教材・作成済みの管理者を変更しない。デモ用の受講生は作らない

## 5. アプリの公開 (Cloud Run サービス)

```bash
gcloud run deploy its-academy --image=$REPO/app:$TAG --region=$REGION \
  --service-account=$SA --add-cloudsql-instances=$CONN \
  --set-secrets=DATABASE_URL=its-database-url:latest \
  --set-env-vars=APP_ENV=production,COOKIE_SECURE=true,TRUSTED_PROXY_HOPS=1 \
  --port=3000 --cpu=1 --memory=1Gi --min-instances=1 --max-instances=1 \
  --allow-unauthenticated
```

* `--max-instances=1`: 1 台で 200 名規模まで対応できる見込み (test-plan.md §4)。2 台以上にする場合は
  `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` を Secret Manager に置いて全台に渡す
* `TRUSTED_PROXY_HOPS=1`: ログイン試行の制限と監査ログに使う IP を、`X-Forwarded-For` の末尾から 1 つ目にする。
  利用者が先頭に偽の値を書いても使われない (§7 で確認)。Cloud Run が末尾に実際の接続元を追記する前提で、
  公開後に自分の IP が監査ログに記録されることを確かめる (要確認)。ロードバランサーを前に置く場合は段数が変わる
* 公開直後は Cloud Run の既定のアドレス (`https://its-academy-....run.app`) で動作を確認する

## 6. 独自ドメイン (エックスサーバーの DNS)

会社のドメインの DNS はエックスサーバーで管理している (hosting-options.md §1)。
既存のホームページやメールの設定は変えず、**サブドメインのレコードを追加するだけ**にする。

1. **Google 側で対応付けを作る**
   `gcloud beta run domain-mappings create --service=its-academy --domain=$DOMAIN --region=$REGION`
   * 初めてのドメインでは、所有者の確認 (Google Search Console) を求められる。確認用の TXT レコードが表示される
   * 東京リージョンで Cloud Run のドメイン対応付けが使えるか、提供状況 (プレビューかどうか) は要確認。
     使えない場合は外部アプリケーションロードバランサー (月 18 ドル前後の追加、要確認) で対応し、`TRUSTED_PROXY_HOPS` を見直す
2. **エックスサーバーで DNS レコードを追加する** (サーバーパネルの「DNSレコード設定」。画面名は要確認)
   | 種別 | ホスト名 | 内容 | 用途 |
   |------|----------|------|------|
   | TXT | (ドメインそのもの) | Google が表示した確認用の値 | 所有者の確認 (求められた場合だけ) |
   | CNAME | `academy` (選んだサブドメイン) | Google が表示した値 (`ghs.googlehosted.com.` の想定・要確認) | アプリへの対応付け |
   * 既存のレコード (ホームページの A レコード、メールの MX レコード) は**変更・削除しない**
   * 前提: ドメインのネームサーバーがエックスサーバーになっていること (ホームページとメールをエックスサーバーで運用していれば通常そうなっている)
3. **反映を待つ**。数時間 (最大 1〜2 日) で `https://$DOMAIN` が使えるようになり、HTTPS の証明書は Google が自動で発行・更新する
4. 反映後、`curl -sI https://$DOMAIN/login` で `strict-transport-security` が付くことを確認する

## 7. このリポジトリ側で確認済みのこと (2026-11-06)

| 項目 | 確認方法 | 結果 |
|------|----------|------|
| Unix ソケット形式の `DATABASE_URL` で接続できる | ローカルの PostgreSQL のソケット (`?host=/var/run/postgresql`) で Prisma から件数を取得 | 成功 |
| 起動時の設定確認がソケット形式の接続文字列を受け付ける | 単体テスト (`env-check.test.ts`) | 成功 |
| 初期設定コマンド (`npm run db:bootstrap`) | 空の DB で 3 回実行 (管理者のメールアドレスなし → 指定 → 再実行)。tools イメージ内でも実行。CI の container ジョブでも毎回実行 | 教材 35 件・課題 9 件・管理者 1 名、受講登録 0 件。再実行で変化なし |
| 初期設定で作った管理者でログイン | 本番ビルドのアプリで実際にログイン | パスワード変更の案内画面に移動 |
| `TRUSTED_PROXY_HOPS=1` で偽の IP を使わない | `X-Forwarded-For: 6.6.6.6, 203.0.113.9` を付けてログインに失敗 | 記録された IP は `203.0.113.9`。単体テストでも確認 |

## 8. 公開後の作業

1. 死活監視: Cloud Monitoring の稼働時間チェックに `https://$DOMAIN/api/health` を登録し、失敗時に運用者へメール通知
2. ログ: 標準エラーの JSON ログは Cloud Logging に集まる。`jsonPayload.event="request_error"` でエラーを絞り込める (要確認)
3. 復元訓練を 1 回行う: Cloud SQL のバックアップから別インスタンスに復元し、件数を比べる (deployment-guide.md §6)
4. test-plan.md の公開前チェックを本番のアドレスで実施する
5. 講師・受講生のアカウントを管理画面 (アカウント) から作成する

## 9. リリースの手順 (2 回目以降)

```bash
TAG=$(git rev-parse --short HEAD)
docker build --platform linux/amd64 -t $REPO/app:$TAG . && docker push $REPO/app:$TAG
docker build --platform linux/amd64 --target tools -t $REPO/tools:$TAG . && docker push $REPO/tools:$TAG
gcloud run jobs update its-migrate --image=$REPO/tools:$TAG --region=$REGION
gcloud run jobs execute its-migrate --region=$REGION --wait
gcloud run deploy its-academy --image=$REPO/app:$TAG --region=$REGION
```

問題があれば、Cloud Run の前のリビジョンに戻す (`gcloud run services update-traffic its-academy --to-revisions=<前のリビジョン>=100`)。
マイグレーションは元に戻せない変更を含みうるため、DB を戻す必要がある場合は PITR で復元する。
