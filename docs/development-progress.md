# ITS ENGINEER ACADEMY — 開発進捗 (development-progress)

> 更新ルール: 各タスク完了時に更新する。ステータスは実際のファイル・テスト・成果物を根拠にする。
> 未検証のものは「完了」にしない。
> ステータス: `未着手` / `進行中` / `完了` / `保留 (要判断)` / `ブロック`

最終更新: 2026-11-06

---

## サマリ

| STEP | 内容 | ステータス |
|------|------|------------|
| 1 | 既存サイト完全調査 | 完了 |
| 2 | 教材一覧と改善点の整理 | 完了 (初版) |
| 3 | 教育ロードマップ設計 | 進行中 (v0.1 設計案。講師レビュー待ち) |
| 4 | 画面設計とデザインシステム | 完了 |
| 5 | DB・認証・権限設計 | 完了 |
| 6 | 教材閲覧機能 | 完了 |
| 7 | 個人進捗管理 | 完了 |
| 8 | 課題提出・レビュー | 完了 (選択・記述問題の専用 UI と GitHub OAuth は未実装) |
| 9 | 管理者ダッシュボード | 完了 (ロール変更画面は未実装) |
| 10 | 教材 CMS | 完了 (画像アップロードと課題の編集画面は未実装) |
| 11 | 教材移行 | 完了 (L0〜L7: 30 レッスン・課題 8 件。コード 28 件を実行検証済み。L8 AI 駆動開発は将来拡張として別途) |
| 12 | 総合テスト | 進行中 (アクセシビリティの自動検査を追加。Firefox/Safari・負荷・復元訓練は未実施) |
| 13 | 本番公開準備 | 未着手 (ホスティング契約は要承認) |

D-01 (開発リポジトリ) は未回答のため、仮定「本リポジトリの独立ディレクトリ `its-academy/` で開発し、
後で `git subtree split` で専用リポジトリへ履歴ごと切り出せる構成にする」で STEP 4〜9 を進めた。
Hoku Tech 本体のファイル (index.html / assets / data) には一切変更を加えていない。

---

## タスク詳細

### T-0-01 既存カリキュラムの全件取得

* 開発フェーズ: PHASE 0 / STEP 1
* ステータス: 完了
* 完了条件: 公開されている全教材 URL を列挙し、本文の取得状況を記録する
* 実装内容:
  * 一覧ページ `/curriculum/` 〜 `/curriculum/page/8/` を取得 (9 件 × 8 ページ = 72 件。`/page/9/` は 404)
  * WordPress REST API `/wp-json/wp/v2/curriculum` で 72 件の本文を取得 (`X-WP-Total: 72`)
  * 一覧ページの URL 集合と REST API の URL 集合が一致することを照合
  * `robots.txt` を確認 (`/wp-admin/` 以外は許可)。1 リクエスト/秒で取得
  * 認証が必要な領域 (ログイン・ダッシュボード・受講生登録) には触れていない
* 関連ファイル: `docs/source-audit.md`, `docs/source-inventory.csv`
* テスト結果: 一覧 72 件 = REST 72 件、差分 0
* 未解決課題: 画像 833 枚のうち外部ホットリンク 714 枚は到達確認していない (ネットワーク許可外)
* 次のアクション: 画像の到達確認と元データ (Google ドキュメント) の所在確認

### T-0-02 教材の品質・欠落分析

* 開発フェーズ: PHASE 0 / STEP 2
* ステータス: 完了 (初版)
* 完了条件: 全 72 記事を「維持・改善・再構成・新規追加」に分類し、改善優先度を付ける
* 関連ファイル: `docs/source-inventory.csv`, `docs/curriculum-gap-analysis.md`
* テスト結果: CSV 72 行 + ヘッダ。全行に分類と優先度あり (スクリプトで検査)。監査表と CSV の画像数・分類・優先度の一致をスクリプトで照合 (差分 0)。主要な誤り指摘 9 件を原文と照合済み
* 結果: 改善 44 / 再構成 28 / 維持 0。優先度 高 30 / 中 36 / 低 6
* 未解決課題: コード・実行結果が画像のため、コードの正しさは検証できていない
* 次のアクション: STEP 11 でコードを書き起こし、実行検証する

### T-0-03 教育ロードマップ設計

* 開発フェーズ: PHASE 1 / STEP 3
* ステータス: 進行中
* 完了条件: L0〜L8 のレベル定義、週割り、評価の流れ、レッスン標準フォーマットが講師レビューを通過する
* 関連ファイル: `docs/curriculum-roadmap.md`, `docs/content-migration-plan.md`
* 未解決課題: IDE 統一、Servlet/JSP の扱い、DB 製品 (D-04〜D-06)
* 次のアクション: 講師レビュー

### T-4-01 デザインシステム

* 開発フェーズ: PHASE 2 / STEP 4
* ステータス: 完了
* 完了条件: カラートークンが WCAG AA を満たし、主要画面がスマホ〜PC で崩れない
* 実装内容: ライトテーマのトークン、ボタン・カード・バッジ・進捗バー・入力欄、3 カラムの学習画面
* 関連ファイル: `docs/design-system.md`, `its-academy/src/app/globals.css`, `its-academy/src/components/ui.tsx`
* テスト結果: コントラスト比を全組み合わせで計算 (最小 5.5:1)。E2E で 375/390/768/1440px の横スクロールなし。スクリーンショットで目視確認し、カード背景色の不具合を 1 件修正
* 未解決課題: axe・スクリーンリーダーでの検証は未実施
* 次のアクション: STEP 12 で実施

### T-5-01 DB・認証・権限

* 開発フェーズ: PHASE 6 / STEP 5
* ステータス: 完了
* 完了条件: 全エンティティのスキーマ、ログイン、ロール別の画面、受講生データのアクセス分離がテストで確認できる
* 実装内容: Prisma スキーマ 20 テーブル、argon2id、DB セッション (トークンのハッシュのみ保存)、ログイン試行制限、監査ログ、`requireUser` / `canViewStudent`
* 関連ファイル: `docs/architecture.md`, `docs/database-schema.md`, `its-academy/prisma/schema.prisma`, `its-academy/src/lib/auth/*`
* テスト結果: 単体 (アクセス分離 5 件・ロール付与 2 件・トークン 2 件) 成功。E2E #1 #2 #4 #6 成功 (受講生・担当外講師に他人のデータが HTML ごと出ないことを確認)
* 未解決課題: 権限不足ページの HTTP ステータスがストリーミングのため 200 になる (内容は 404 表示でデータなし)。ロール変更画面・パスワード再設定メールは未実装
* 次のアクション: メール送信基盤の決定 (D-10)

### T-6-01 教材閲覧

* 開発フェーズ: PHASE 2 / STEP 6
* ステータス: 完了
* 完了条件: 13 項目のレッスンを表示し、前回の続きから再開でき、前後に移動できる
* 実装内容: 章ナビ (スマホは折りたたみ)・目次・学習目安時間・進捗・前後リンク・コードのコピー・実行結果の区別・閲覧と学習時間の記録
* 関連ファイル: `its-academy/src/app/(app)/lessons/[slug]/page.tsx`, `its-academy/src/components/lesson/*`
* テスト結果: E2E #3 成功
* 未解決課題: 動画はリンク表示のみ
* 次のアクション: CMS で動画登録を実装するときに埋め込み表示を追加

### T-7-01 個人進捗

* 開発フェーズ: PHASE 3 / STEP 7
* ステータス: 完了
* 完了条件: 指標 A〜E を分離して算出し、ページを開いただけでは完了にならない
* 実装内容: 理解度チェック合格をサーバー側で確認してから完了。指標 A〜E、直近 7 日、連続日数、目標ペース、苦手分野、次にやること
* 関連ファイル: `its-academy/src/lib/progress/metrics.ts`, `its-academy/src/lib/queries/student.ts`, `its-academy/src/app/(app)/progress/page.tsx`
* テスト結果: 単体 18 件成功。E2E #3 (開いただけでは完了ボタンが押せない → 合格後に完了 → 再読み込み後も保持)
* 未解決課題: なし
* 次のアクション: —

### T-8-01 課題提出・レビュー

* 開発フェーズ: PHASE 5 / STEP 8
* ステータス: 完了
* 完了条件: 8 つのステータス遷移、ルーブリック採点、提出・採点・再提出の履歴が保存される
* 実装内容: 下書き / 提出 / 再提出、前提レッスンによる解放、GitHub URL 検証、講師のレビュー開始・採点 (合格点未満は合格不可)、採点スナップショット、通知
* 関連ファイル: `its-academy/src/app/actions/submissions.ts`, `its-academy/src/app/actions/staff.ts`, `its-academy/src/app/(app)/assignments/*`, `its-academy/src/app/(app)/admin/reviews/*`
* テスト結果: E2E #5 成功。提出後にフォームが消えて完了メッセージが見えない不具合を E2E で発見し、受付済み表示を追加して修正
* 未解決課題: 選択・記述・最終プロジェクト形式の専用 UI、GitHub OAuth
* 次のアクション: L7 卒業制作の課題データ作成時に FINAL_PROJECT の UI を追加

### T-10-01 教材 CMS

* 開発フェーズ: PHASE 8 / STEP 10
* ステータス: 完了 (一部除く)
* 完了条件: 管理者がコードを触らずにレッスンの作成・編集・並べ替え・下書き保存・プレビュー・公開・公開予約・版の差し戻しができ、受講生の記録が壊れない
* 実装内容:
  * 13 項目の構造化エディタ (繰り返し項目の追加・削除・並べ替え)
  * 下書きは入力途中でも保存可、公開時に検証して版を確定 (公開済みの版は書き換えない)
  * 公開予約は読み込み時に適用 (定期ジョブ不要・二重公開防止)
  * プレビュー、版の履歴 (作成者・学習記録の件数)、過去の版からの下書き作成・再公開
  * サンプルコードの「自動実行検証済み」の印は、コードと実行結果が公開中の版と同じ場合だけ引き継ぐ
* 関連ファイル: `its-academy/src/app/actions/cms.ts`, `its-academy/src/lib/content/draft.ts`, `its-academy/src/lib/content/publish.ts`, `its-academy/src/components/cms/*`, `its-academy/src/app/(app)/admin/content/*`, `its-academy/src/components/lesson/lesson-sections.tsx`
* テスト結果: 単体 8 件 (変換・必須チェック・検証済みの印の引き継ぎと偽装防止・往復変換)。E2E 4 件 (編集 → 下書きは受講生に見えない → プレビュー → 公開 / 必須不足の新規レッスンは公開できない / 公開予約の適用 / 講師は開けない)。編集後にメッセージが消える不具合を E2E で発見して修正
* 未解決課題: 画像・動画ファイルのアップロード (保存先のストレージが必要。現状は動画 URL のみ)、課題・ルーブリックの編集画面、版の差分表示
* 次のアクション: ストレージの選定 (D-11)

### T-11-01 教材移行 (第 2 弾)

* 開発フェーズ: PHASE 8 / STEP 11
* ステータス: 進行中
* 完了条件: 移行計画の優先順で、監査で見つかった誤りを直して 13 項目形式にし、コードを実行検証する
* 実装内容: L3 に 5 レッスン (継承・インターフェース・コレクション・例外・日付)、L4 に SQL 3 レッスン、課題 2 件 (図書の貸出管理クラス・店舗在庫の SQL) を追加。出典 URL は `content/sources.ts` (インベントリ CSV から生成) から引く
* テスト結果: 15 サンプル (Java 10・bash 2・SQL 3) を実行して一致。「よくあるエラー」に載せたコンパイラ・PostgreSQL のエラーメッセージ 15 件を実際に発生させて文言を確認
* 未解決課題: L1 環境構築 (WSL2・JDK・VS Code) の手順レッスン、L2 演算子・L3 static/final・パッケージ、L4 HTML/CSS/JavaScript・HTTP・JDBC、L5 Spring Boot、L6・L7 の全レッスン
* 次のアクション: L4 JDBC (PreparedStatement 必須) と HTTP、L5 Spring Boot の再構成 → T-11-02 で実施

### T-11-02 教材移行 (第 3 弾: HTTP・JDBC・Spring Boot)

* 開発フェーズ: PHASE 8 / STEP 11
* ステータス: 完了 (この範囲)
* 完了条件: L4 HTTP・JDBC と L5 Spring Boot の基本・REST API・テストを、現行のバージョンで実際にビルド・起動して検証する
* 実装内容:
  * L4: HTTP の仕組み (Java 標準の HttpServer / HttpClient で実際に通信)、JDBC (Maven でドライバ取得・PreparedStatement・SQL インジェクションの実演・try-with-resources・トランザクション・接続情報は環境変数)
  * L5: Spring Boot の基本 (DI・@RestController)、REST API (Controller/Service/Repository・DTO + Bean Validation・ProblemDetail で 400/404/409)、テスト (JUnit 5・@WebMvcTest・MockMvc・@MockitoBean)
  * 課題「掲示板 REST API」(元教材の Springboot 課題を、評価基準・テスト・README 要件付きで再設計)
  * 教材のバージョンは Spring Boot 4.1.2 / Java 21 / PostgreSQL JDBC 42.7.14 (元教材の Spring Boot 3.5.0 は 1 世代前のため)
  * 検証スクリプトに runner (Maven プロジェクトをビルド → アプリを起動 → curl で API を呼ぶ → 停止) を追加。DB は毎回使い捨てのスキーマ
* 関連ファイル: `its-academy/content/lessons-l4-l5.ts`, `its-academy/content/code/l4-http/`, `its-academy/content/code/l4-jdbc/`, `its-academy/content/code/l5-book-api/`, `its-academy/scripts/verify-code.ts`
* テスト結果: 20 サンプル一致 (うち Maven プロジェクト 4 件: JDBC 実行、Spring Boot の起動と API 呼び出し 2 件、mvn test 4 件成功)。Spring Boot 4 での import の場所・@MockBean の廃止・モック忘れのエラーメッセージを実際に確認
* 検証中に見つけたこと: クエリ文字列の日本語をエンコードせずに送ると Tomcat が HTML の 400 を返す。初心者がつまずく点として REST API レッスンの「よくあるエラー」に追加
* 未解決課題: L5 Spring Security (認証・認可・パスワードのハッシュ化)、L4 HTML/CSS/JavaScript、L1 環境構築の手順、L6・L7
* 次のアクション: L5 Spring Security と、L7 卒業制作 (図書管理システム) の課題設計 → T-11-03 で実施

### T-11-03 教材移行 (第 4 弾: Spring Security・卒業制作)

* 開発フェーズ: PHASE 8 / STEP 11
* ステータス: 完了 (この範囲)
* 完了条件: 認証・認可を、実際に起動したアプリで 401・403・201 を確かめた教材にする。卒業制作に評価基準・テスト要件・面談項目を付ける
* 実装内容:
  * L5「認証と認可 (Spring Security)」: Spring Security 7 (Spring Boot 4.1.2)。BCrypt でのハッシュ保存、データベースの利用者による認証、ロールによる URL・メソッドごとの認可、401・403 を ProblemDetail 形式で統一、初期管理者のパスワードは環境変数、新規登録は必ず一般利用者、CSRF を無効にしてよい条件と画面アプリでは必須である理由
  * L7「卒業制作の進め方」と課題「卒業制作: 図書管理システム」(元教材の SC3 を再設計。必須・追加要件、テスト 15 件以上、README の要件、講師 2 名の採点と面談・AI 評価は使わない)
  * PROJECT / FINAL_PROJECT 形式の課題をリポジトリ URL で提出できるようにした
* 関連ファイル: `its-academy/content/lessons-l5-l7.ts`, `its-academy/content/code/l5-secure-api/`, `its-academy/src/lib/validation.ts`
* テスト結果: 22 サンプル一致 (セキュリティ: mvn test 9 件成功、実際の起動で 201・409・400・401・401・200・200・403・201)。2 回実行して出力が同一であることを確認。データベースにはパスワードが {bcrypt} のハッシュ (68 文字) としてのみ保存され、アプリのログに管理者パスワードが出ないことを確認
* 検証中に見つけたこと:
  * Spring Security を追加すると既存のテストが 401・403 で失敗する → テストに @Import(SecurityConfig.class) と @WithMockUser を付ける手順を教材の「よくあるエラー」に追加
  * 401・403 の既定の応答は日時を含み、ほかのエラーと形式が違う → 認証エラーの応答を ProblemDetail 形式に統一
  * 初期管理者を作る CommandLineRunner はアプリが受付を始めた後に動く → 登録の順序で ID が変わるため、検証スクリプトは管理者の作成を待ってから実行
  * 「パスワードの前に {bcrypt} などの印がない」場合のエラー文は、Spring Security 7 で文言が変わっていた → 実際の文言に修正
* 未解決課題: L4 HTML/CSS/JavaScript、L1 環境構築の手順、L6 チーム開発の全レッスン、L8 AI 駆動開発
* 次のアクション: L6 チーム開発 (ブランチ戦略・PR・コードレビュー・報告) と L4 フロントエンド基礎 → T-11-04 で実施

### T-11-04 教材移行 (第 5 弾: フロントエンド基礎・チーム開発)

* 開発フェーズ: PHASE 8 / STEP 11
* ステータス: 完了 (この範囲)
* 完了条件: L4 の HTML/CSS/JavaScript と L6 チーム開発を、実際の Git 操作・ブラウザでの表示で確かめた教材にする
* 実装内容:
  * L4「HTML と CSS の基礎」: 意味のあるタグ・ラベル付きフォーム・ボックスモデル・Flexbox・viewport とモバイルファースト (元教材の float・IE 前提・エディタ不統一を解消)
  * L4「JavaScript の基礎」(新規): イベント・fetch と async/await・encodeURIComponent・textContent による XSS 対策・画面側とサーバー側の入力チェックの役割
  * L6「ブランチ運用とコンフリクトの解消」「プルリクエストとコードレビュー」「報告・相談とチケットの書き方」(新規)
  * 課題「本の検索画面」「チーム開発演習 (Issue・PR・レビュー)」
  * 検証スクリプトでブラウザ (Chromium) による確認ができるようにした: 375px と 1024px のレイアウト、ラベル・見出し・ランドマーク、フォーム操作、API の偽の応答、XSS の比較 (textContent では実行されず、innerHTML では実行される)
* 関連ファイル: `its-academy/content/lessons-fe-l6.ts`, `its-academy/content/code/l4-html-css/`, `its-academy/content/code/l4-javascript/`, `its-academy/content/code/l6-*/`, `.github/workflows/its-academy.yml` (Chromium のインストールを検証の前に移動)
* テスト結果: 26 サンプル一致 (Git の衝突の印・履歴のグラフ・差分、ブラウザでの表示結果を含む)。XSS の検証は 3 回実行して出力が同一。新規 6 レッスンを 375px で表示して横スクロールなし
* 検証中に見つけたこと: 検証用の偽のサーバーが存在しないファイル (XSS の img タグが要求する画像) で止まった → 実際のサーバーと同じく 404 を返すように修正
* 未解決課題: L1 環境構築 (WSL2・JDK・VS Code・PostgreSQL) の手順レッスン、L8 AI 駆動開発、L4 の HTML/CSS 課題の自動採点
* 次のアクション: L1 環境構築の手順レッスン (OS ごとの手順。実行環境に依存するため画面の確認方法を検討)、L8 AI 駆動開発コースの設計 → L1 は T-11-05 で実施

### T-11-05 教材移行 (第 6 弾: L1 環境構築・GitHub)

* 開発フェーズ: PHASE 8 / STEP 11
* ステータス: 完了
* 完了条件: 元教材 No.4〜8・16〜19 の誤りを解消し、OS によらず「環境がそろったか」を確かめられる教材にする
* 実装内容:
  * L1「開発環境を整える (Windows / Mac)」: WSL2 の Ubuntu と Mac を並べて記載。wsl --install (半角ハイフン)、macOS は Linux ではなく UNIX 系、エディタは VS Code に統一、PostgreSQL は自分用ユーザーにパスワード (trust にしない)
  * 環境の確認スクリプト check-env.sh: Java 21・javac・Maven・Git と名前の設定・psql・PostgreSQL の起動を [OK]/[NG] で表示 (バージョン番号ではなく判定を出すため、結果が環境の更新で変わらない)
  * L1「GitHub の準備」: 二要素認証、SSH 鍵 (公開鍵だけを登録・秘密鍵の権限 600)、clone と push。元教材の PAT 手順の外部記事への委任と git branch -b の誤りを解消
  * seed のデモ状態をレッスンの位置ではなく slug で指定するよう変更 (レッスンを追加しても状態がずれない)
* テスト結果: 28 サンプル一致 (確認スクリプトはこのコンテナで全項目 [OK]、SSH 鍵の作成は鍵の中身を出さずに種類・コメント・権限だけを確認)
* 未解決課題: Mac での手順の実機確認 (このコンテナは Linux のため未確認)、Windows の WSL2 インストール画面の確認
* 次のアクション: 講師による Mac / Windows 実機での手順確認

### T-12-01 アクセシビリティの自動検査

* 開発フェーズ: PHASE 9 / STEP 12
* ステータス: 完了 (自動検査の範囲)
* 完了条件: 主要画面が WCAG 2.2 A / AA の自動検査 (axe-core) で違反 0 件、キーボードだけで主要操作ができる
* 実装内容: E2E に axe-core による検査を追加 (ログイン、受講生 9 画面 × 375px・1280px、講師・管理者 8 画面)。キーボードだけでのログインと「本文へスキップ」の検査
* 見つかった違反と修正: scrollable-region-focusable (serious) — 横スクロールするコード・実行結果・表がキーボードでスクロールできなかった → 名前付きのフォーカス可能な領域 (ScrollRegion) に変更 (7 か所)
* 関連ファイル: `its-academy/tests/e2e/03-a11y.spec.ts`, `its-academy/src/components/ui.tsx`
* テスト結果: 自動検査 26 画面で違反 0 件、キーボード操作のテスト成功
* 未解決課題: ログイン直後 (クライアント側の画面遷移) にフォーカスが先頭に戻らない点の評価、スクリーンリーダーでの手動確認
* 次のアクション: Firefox / WebKit での E2E、負荷試験、バックアップ復元の訓練

### T-9-01 管理者・講師ダッシュボード

* 開発フェーズ: PHASE 4 / STEP 9
* ステータス: 完了
* 完了条件: 全受講生の状況・停滞者・レビュー待ちを把握でき、受講生ごとに 7 つの問い (現在地・期間・苦戦している課題・提出回数・指摘・不足能力・次の指導) に答えられる
* 実装内容: ダッシュボード集計 (停滞・レビュー待ち・平均履修率・合格率・修了率・平均学習期間・講師別担当数)、受講生一覧 (A〜E・絞り込み)、受講生詳細、コメント、スキル評価、受講設定、受講生追加、停滞閾値、教材公開、CSV、監査ログ
* 関連ファイル: `its-academy/src/app/(app)/admin/*`, `its-academy/src/lib/queries/staff.ts`, `its-academy/src/lib/progress/guidance.ts`, `its-academy/src/app/admin/export/students/route.ts`
* テスト結果: 単体 (指導提案 4 件・CSV 3 件) 成功。E2E #6 #7 成功
* 未解決課題: ロール変更画面、一覧の集計 SQL 化 (受講生 100 名超で必要)
* 次のアクション: STEP 10 教材 CMS

---

## 確認が必要な事項 (重要な意思決定)

| ID | 内容 | 仮定 (回答があるまでの前提) |
|----|------|------------------------------|
| D-01 | LMS 本体をどのリポジトリで開発するか。現リポジトリ (Hoku Tech) は「外部ライブラリ禁止・単一 HTML」のルールがあり、Next.js / PostgreSQL 構成と両立しない | 新規リポジトリ (例: `its-engineer-academy`) を推奨。調査ドキュメントのみ本リポジトリに置く |
| D-02 | Hoku Tech と ITS ENGINEER ACADEMY の関係 (別製品 / 統合 / 置き換え) | 別製品として扱う。Hoku Tech のブランド・データは変更しない |
| D-03 | ホスティングと DB の運用先 (費用が発生するため事前承認が必要) | 契約は行わない。ローカル (Docker の PostgreSQL) で開発を進める |
| D-04 | IDE を VS Code に統一するか | VS Code に統一し、Eclipse 記事は「参考」に格下げ |
| D-05 | Servlet/JSP の扱い | 概要 + 1 課題に圧縮し、Spring Boot に時間を回す |
| D-06 | DB 製品 | PostgreSQL に統一 |
| D-07 | 既存教材の著作権と画像の元データの所在 | 依頼者制作として扱うが、Qiita 由来画像など第三者素材は掲載しない |
| D-08 | 認証方式 (メール + パスワード / Google Workspace SSO / 招待制) | 管理者が受講生を追加し、初期パスワードを手渡し (実装済み)。SSO は後から追加できる構成 |
| D-09 | 個人情報・監査ログ (IP) の保存期間 | 未設定。規程の決定後に削除ジョブを実装 |
| D-10 | メール送信サービス (招待・パスワード再設定・通知) | 契約が必要なため未導入。通知は画面内のお知らせのみ |
| D-11 | 画像・動画の保存先 (オブジェクトストレージ) | 未導入。既存教材の画像 (Google ドキュメントの直リンク) は移行しない方針で、図解はテキストで代替 |
