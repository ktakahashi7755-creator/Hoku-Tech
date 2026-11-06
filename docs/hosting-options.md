# ITS ENGINEER ACADEMY — 本番環境の選定資料 (D-03)

> 版: v1.0 (2026-11-06)。目的: 本番環境 (アプリの実行環境と PostgreSQL) の契約先を決めるための比較。
> 契約・申し込みは行っていない。金額は 2026-11-06 時点の調査値で、契約前に各社の公式ページで再確認が必要。

---

## 1. 前提

| 項目 | 内容 |
|------|------|
| アプリ | Docker イメージ 1 つ (deployment-guide.md §5)。常時 1 台、0.5〜1 vCPU / 1GB |
| DB | PostgreSQL 16。1〜2GB メモリ・20GB。自動バックアップと任意時点への復元 (PITR) が必要 |
| 利用規模 | 受講生 20〜200 名と講師数名。平日の日中が中心 |
| 個人情報 | 受講生の氏名・メール・学習記録を扱うため、**データは国内 (東京・大阪) に置く** |
| ドメイン | 依頼者が独自ドメインを保有 (2026-11-06 確認)。アプリはそのサブドメイン (例: `academy.<独自ドメイン>`) で公開し、新規取得はしない。DNS の管理先と、エックスサーバーの契約種別 (レンタルサーバー / VPS) は未確認 |
| 金額の換算 | 1 USD = 150 円 (仮定)。税抜 (さくらのクラウドのみ税込) |

## 2. 比較

| 候補 | アプリ / DB | 国内 | バックアップ・PITR | 月額の目安 | 主な注意点 |
|------|-------------|------|--------------------|------------|------------|
| **Google Cloud** | Cloud Run (最小 1 台) / Cloud SQL | 東京・大阪 | 自動バックアップ・PITR あり (保持日数は要確認) | 約 9,000〜17,000 円 | HTTPS・独自ドメイン・秘密情報の管理が標準。構成要素が最も少ない |
| AWS | ECS Fargate + ロードバランサー / RDS | 東京・大阪 | 保持 1〜35 日・PITR あり | 約 11,000〜14,000 円 | 手軽な App Runner は 2026-04-30 で新規受付終了。ネットワーク設計が必要で手間が増える |
| Azure | Container Apps / PostgreSQL Flexible Server | 東日本 | 保持 7〜35 日・PITR あり | 約 6,000〜8,000 円 (第三者情報からの概算・要確認) | 東日本の単価を公式ページで確認できていない |
| さくらのクラウド | AppRun / データベースアプライアンス | 国内 | **PostgreSQL は日次バックアップのみ (PITR は MariaDB のみ)** | 約 6,500 円 (税込) | 円建て・国内事業者。PostgreSQL 16 対応は要確認 |
| Fly.io | Machines / Managed Postgres | 東京 | 保持 10 日・PITR あり | 約 7,200 円〜 | 米ドルのカード払い。日本語サポート・請求書払いは要確認 |
| Render | — | **なし** (最寄りはシンガポール) | — | 対象外 | 国内保管の条件を満たさない |
| 国内 VPS | docker compose / 自前の PostgreSQL | 国内 | 自前で用意 (scripts/backup.sh など) | 約 1,000〜2,500 円 (要確認) | OS 更新・監視・障害対応をすべて自社で行う。インフラ担当がいない場合は勧めない |

内訳 (調査値):

* Google Cloud: Cloud Run 1 vCPU / 1GiB を常時稼働で約 47 ドル (リクエスト時のみ CPU 課金にすると約 23 ドル)、
  Cloud SQL db-g1-small 33.58 ドル (共有コア・SLA 対象外。専用 1 vCPU なら約 64 ドル)、SSD 20GB 約 4.4 ドル
* AWS: Fargate 0.5 vCPU / 1GB 約 22.5 ドル、ロードバランサー約 21 ドル、パブリック IPv4 約 11 ドル、RDS db.t4g.micro 約 18.3 ドル (small なら 36.5 ドル)、ストレージ約 2.8 ドル
* さくらのクラウド: AppRun 共用型 月額上限 3,720 円、DB アプライアンス 10GB 2,750 円〜
* Fly.io: アプリ約 6.7 ドル、Managed Postgres Basic 38 ドル

## 3. 推奨

**Google Cloud (Cloud Run + Cloud SQL、東京リージョン) を推奨する。**

* 作成済みの Docker イメージをそのまま載せられ、HTTPS・独自ドメイン・秘密情報の管理・自動バックアップと PITR がすべて用意されている
* 必要な部品が最も少なく、インフラ専任者がいなくても運用しやすい
* 月 1 万円前後で、受講生 200 名規模まで構成を変えずに対応できる見込み (負荷試験: test-plan.md §4)

次点は AWS (同等の機能だが設定項目が多い)。円建て・国内事業者を重視する場合はさくらのクラウドだが、
PostgreSQL で任意時点への復元ができないため、個人情報を扱う本番 DB として許容できるかの判断が必要。

## 4. 決定後の作業 (deployment-guide.md §7)

1. 契約・プロジェクト作成 (依頼者側)。請求先と管理者アカウントを決める
2. DB の作成 (東京・自動バックアップ・PITR 有効)、秘密情報 (DATABASE_URL など) の登録
3. イメージのビルドと登録、マイグレーションの実行、アプリの起動
4. 保有している独自ドメインのサブドメインを DNS でアプリに向け、HTTPS を設定、死活監視 (/api/health) の登録
5. 最初の管理者アカウントの作成と、復元訓練 1 回

## 5. 確認できていない点 (契約前に公式ページ・営業窓口で確認)

* 調査環境から各社の公式ページの多くを直接読めなかったため、Google Cloud と AWS の単価以外は検索結果の抜粋・第三者情報による
* Cloud SQL の PITR 保持日数、Azure 東日本の単価、さくらの DB アプライアンスの PostgreSQL 16 対応、Fly.io 東京の割増の有無
* 為替レート (150 円/ドルは仮定)

## 6. 出典 (2026-11-06 参照)

* 本文を確認: https://cloud.google.com/run/pricing / https://cloud.google.com/sql/pricing / AWS Price List API (ap-northeast-1 の ECS・App Runner・RDS・ELB・VPC)
* 検索結果の抜粋のみ: https://docs.aws.amazon.com/ja_jp/apprunner/latest/dg/apprunner-availability-change.html /
  https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html /
  https://learn.microsoft.com/azure/postgresql/flexible-server/concepts-backup-restore /
  https://azure.microsoft.com/ja-jp/pricing/details/container-apps/ /
  https://cloud.sakura.ad.jp/products/apprun-shared/ / https://cloud.sakura.ad.jp/products/database-appliance/ /
  https://manual.sakura.ad.jp/cloud/appliance/database/database-pitr.html / https://render.com/docs/regions /
  https://fly.io/mpg/ / https://fly.io/pricing/
