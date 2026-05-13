/* =========================================================
   data/p12-apps.js  ─  Phase 12 卒業制作アプリテンプレート
   8種類のアプリそれぞれに詳細な設計ドキュメント
   ========================================================= */
window.P12_APPS = [

{
  id: 'app-task',
  title: 'タスク管理アプリ',
  emoji: '✅',
  difficulty: '⭐⭐',
  summary: '未完了タスクの一覧・追加・完了・削除・優先度設定ができるWebアプリ。最もシンプルなCRUDアプリとして最初の卒業制作に最適。',
  target: '1週間後の自分・1ヶ月後の自分',
  functions: ['タスク一覧（優先度・期限・ステータスでフィルタ）','タスク追加（タイトル・説明・優先度・期限）','タスク完了切替','タスク削除','キーワード検索'],
  screens: ['トップ（タスク一覧）','タスク追加フォーム','タスク詳細/編集'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL / H2' },
  tables: [
    { name:'users', cols:'id, name, email, created_at' },
    { name:'tasks', cols:'id, user_id(FK), title, description, priority(ENUM:HIGH/MEDIUM/LOW), done(BOOLEAN), due_date, created_at, updated_at' }
  ],
  apiList: [
    { method:'GET',    path:'/api/tasks',     desc:'一覧取得（?priority=HIGH&done=false でフィルタ可）' },
    { method:'GET',    path:'/api/tasks/:id', desc:'1件取得' },
    { method:'POST',   path:'/api/tasks',     desc:'作成（title必須）' },
    { method:'PUT',    path:'/api/tasks/:id', desc:'更新（title/priority/done/due_date）' },
    { method:'DELETE', path:'/api/tasks/:id', desc:'削除' }
  ],
  learningEffect: ['基本的なCRUDの実装','フロント↔バック接続の基礎','フォームバリデーション','LocalStorageとDB永続化の比較'],
  implementSteps: [
    '1. Spring Bootプロジェクト作成・DB接続確認',
    '2. Entity/Repository/Service/Controller を実装',
    '3. PostmanでAPI動作確認',
    '4. Next.jsプロジェクト作成・API fetchを実装',
    '5. Vercel + RenderにデプロイしてCORSを設定',
    '6. README・AI利用ログを整備'
  ],
  readmeExample: '# タスク管理アプリ\n\n## デモURL\n- Frontend: https://xxx.vercel.app\n- API: https://xxx.onrender.com/api/tasks\n\n## 技術スタック\n- Frontend: Next.js 14 / TypeScript / Tailwind CSS\n- Backend: Spring Boot 3.x / Java 17\n- Database: MySQL 8 (Render)\n\n## 機能\n- タスクのCRUD\n- 優先度・完了状態でフィルタ\n- キーワード検索\n\n## セットアップ\n```bash\n# Backend\ncd backend && ./mvnw spring-boot:run\n# Frontend\ncd frontend && npm install && npm run dev\n```\n\n## AI活用について\n詳細は [AI-USAGE.md](./AI-USAGE.md) を参照',
  interviewPoints: [
    'なぜこのアプリを選びましたか？',
    'DB設計で気をつけた点は？',
    'バリデーションはどこで行っていますか？',
    'フロントとバックの接続で苦労したことは？'
  ],
  evalCriteria: ['CRUD全機能が動作する', 'バリデーションが実装されている', 'README.mdが整備されている', 'デプロイURLが動作する']
},

{
  id: 'app-study',
  title: '学習記録アプリ',
  emoji: '📚',
  difficulty: '⭐⭐⭐',
  summary: '毎日の学習時間・内容を記録して週次グラフで振り返れるアプリ。グラフ可視化とカレンダーUIがある中級難易度。',
  target: 'プログラミング学習者・資格勉強中のエンジニア',
  functions: ['今日の学習記録追加（日付・科目・時間・メモ）','週次/月次の学習時間グラフ','科目別の累計時間','記録の編集・削除','学習カレンダー表示'],
  screens: ['ダッシュボード（グラフ+直近記録）','学習記録一覧','記録追加/編集フォーム','科目マスタ管理'],
  techStack: { front:'Next.js (TypeScript) + Recharts', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'subjects', cols:'id, name, color_code, created_at' },
    { name:'study_logs', cols:'id, subject_id(FK), date, duration_minutes, memo, created_at' }
  ],
  apiList: [
    { method:'GET',    path:'/api/study-logs',        desc:'一覧（?start=&end= で期間絞り込み）' },
    { method:'POST',   path:'/api/study-logs',        desc:'記録追加' },
    { method:'PUT',    path:'/api/study-logs/:id',    desc:'更新' },
    { method:'DELETE', path:'/api/study-logs/:id',    desc:'削除' },
    { method:'GET',    path:'/api/study-logs/summary',desc:'週次/月次集計（GROUP BYクエリ）' },
    { method:'GET',    path:'/api/subjects',          desc:'科目一覧' },
    { method:'POST',   path:'/api/subjects',          desc:'科目追加' }
  ],
  learningEffect: ['集計クエリ（GROUP BY）の実践','グラフライブラリの組み込み','日付型の扱い','マスタデータとトランザクションデータの設計'],
  implementSteps: [
    '1. DB設計（subjects・study_logs）とER図作成',
    '2. 集計APIの実装（GROUP BYでSELECT）',
    '3. PostmanでAPI確認',
    '4. Next.js + Rechartsでグラフを実装',
    '5. カレンダーUIを実装',
    '6. デプロイ・README整備'
  ],
  readmeExample: '# 学習記録アプリ\n\n## 特徴\n- 週次学習グラフで進捗可視化\n- 科目別の累計時間を管理\n- 学習カレンダーで継続を確認',
  interviewPoints: [
    'グラフはどのライブラリを使いましたか？',
    '集計クエリはどのように実装しましたか？',
    '日付の扱い（タイムゾーン）で苦労したことは？'
  ],
  evalCriteria: ['学習記録のCRUDが動作する', '集計グラフが表示される', 'GROUP BYを使ったSQLがある', 'デプロイが完了している']
},

{
  id: 'app-attendance',
  title: '勤怠管理アプリ',
  emoji: '🕐',
  difficulty: '⭐⭐⭐',
  summary: '出勤・退勤時刻を記録して月次の勤務時間集計ができるアプリ。実務に直結するビジネスアプリとして評価されやすい。',
  target: 'SES・契約社員・アルバイトなど時給制の労働者',
  functions: ['出勤/退勤打刻（現在時刻をワンタップで記録）','日次・月次の勤務時間集計','残業時間の計算','勤怠記録の編集（管理者）','月次CSVエクスポート'],
  screens: ['今日の勤怠（打刻ボタン）','月次一覧（カレンダー形式）','勤怠編集フォーム','集計サマリー'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'employees', cols:'id, name, employee_code, created_at' },
    { name:'attendance_logs', cols:'id, employee_id(FK), date, clock_in(DATETIME), clock_out(DATETIME), note, created_at' }
  ],
  apiList: [
    { method:'POST', path:'/api/attendance/clock-in',   desc:'出勤打刻（現在時刻）' },
    { method:'POST', path:'/api/attendance/clock-out',  desc:'退勤打刻（現在時刻）' },
    { method:'GET',  path:'/api/attendance',            desc:'一覧（?year=&month= で絞り込み）' },
    { method:'GET',  path:'/api/attendance/summary',    desc:'月次集計（総労働時間・残業時間）' },
    { method:'PUT',  path:'/api/attendance/:id',        desc:'修正（管理者のみ）' }
  ],
  learningEffect: ['日時計算（LocalDateTime）の実践','状態管理（出勤中/退勤済）','ビジネスロジックの実装','集計ロジックのサービス層での実装'],
  implementSteps: [
    '1. 打刻ロジック設計（出勤状態の判定）',
    '2. 労働時間計算のビジネスロジック実装',
    '3. 月次集計APIの実装',
    '4. フロントの打刻UIと月次カレンダー実装',
    '5. デプロイ・README整備'
  ],
  readmeExample: '# 勤怠管理アプリ\n\n## 機能\n- ワンタップ出退勤打刻\n- 月次勤務時間集計\n- 残業時間の自動計算',
  interviewPoints: [
    '出勤状態（打刻済み/未打刻）をどうやって管理しましたか？',
    '労働時間の計算はどのように実装しましたか？',
    '業務システムとして実装するうえで気をつけた点は？'
  ],
  evalCriteria: ['打刻機能が動作する', '月次集計が表示される', '労働時間の計算が正しい', 'デプロイが完了している']
},

{
  id: 'app-inquiry',
  title: '問い合わせ管理アプリ',
  emoji: '💬',
  difficulty: '⭐⭐⭐',
  summary: 'カスタマーサポート向けの問い合わせトラッキングアプリ。ステータス管理・担当者割り当て・返信記録などCRM的な機能を持つ。',
  target: 'カスタマーサポートチーム・ECサイト運営者',
  functions: ['問い合わせ一覧（ステータス別フィルタ）','問い合わせ詳細と返信スレッド','ステータス変更（未対応/対応中/解決済み/クローズ）','担当者割り当て','キーワード検索・カテゴリフィルタ'],
  screens: ['問い合わせ一覧（フィルタ付き）','問い合わせ詳細（返信スレッド）','新規問い合わせ登録フォーム','ダッシュボード（ステータス別件数）'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'users', cols:'id, name, email, role(ENUM:ADMIN/STAFF), created_at' },
    { name:'inquiries', cols:'id, name, email, subject, body, category, status(ENUM), assigned_to(FK→users), created_at, updated_at' },
    { name:'replies', cols:'id, inquiry_id(FK), user_id(FK), body, created_at' }
  ],
  apiList: [
    { method:'GET',    path:'/api/inquiries',       desc:'一覧（?status=&category= フィルタ）' },
    { method:'GET',    path:'/api/inquiries/:id',   desc:'詳細（返信スレッド含む）' },
    { method:'POST',   path:'/api/inquiries',       desc:'新規登録' },
    { method:'PUT',    path:'/api/inquiries/:id',   desc:'ステータス・担当者更新' },
    { method:'POST',   path:'/api/inquiries/:id/replies', desc:'返信追加' },
    { method:'GET',    path:'/api/inquiries/stats', desc:'ステータス別件数集計' }
  ],
  learningEffect: ['ENUM型の活用','1対多リレーション（問い合わせ:返信）','ステータスマシン設計','集計ダッシュボードの実装'],
  implementSteps: [
    '1. 問い合わせとステータスのDB設計',
    '2. 返信スレッドのAPI設計',
    '3. ステータス変更ロジックの実装',
    '4. Next.jsでのスレッド表示UI実装',
    '5. 集計ダッシュボードの実装',
    '6. デプロイ・README整備'
  ],
  readmeExample: '# 問い合わせ管理アプリ\n\n## 機能\n- 問い合わせの受付・ステータス管理\n- 担当者アサインと返信スレッド\n- ダッシュボードで対応状況の可視化',
  interviewPoints: [
    'ステータス管理をどのように設計しましたか？',
    '返信スレッドのデータ構造はどうなっていますか？',
    'カスタマーサポートツールとして実用的にするために工夫した点は？'
  ],
  evalCriteria: ['ステータス変更が動作する', '返信スレッドが動作する', 'フィルタ・検索が動作する', 'デプロイが完了している']
},

{
  id: 'app-inventory',
  title: '在庫管理アプリ',
  emoji: '📦',
  difficulty: '⭐⭐⭐⭐',
  summary: '商品の入出庫を管理して在庫数をリアルタイムで把握できるアプリ。業務システム色が強く面談で好印象を与えやすい。',
  target: '小売業・製造業の倉庫担当者',
  functions: ['商品マスタ管理（追加・編集・削除）','入庫・出庫の記録（トランザクション）','現在庫数の自動計算','在庫アラート（設定数以下で警告）','入出庫履歴一覧'],
  screens: ['商品一覧（現在庫付き）','商品詳細（入出庫履歴）','入庫登録フォーム','出庫登録フォーム','在庫アラート一覧'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'products', cols:'id, name, sku(UNIQUE), category, unit, alert_threshold, created_at' },
    { name:'stock_transactions', cols:'id, product_id(FK), type(ENUM:IN/OUT), quantity, note, transaction_date, created_at' },
    { name:'stock_summary (VIEW or computed)', cols:'product_id, current_stock（入庫合計 - 出庫合計）' }
  ],
  apiList: [
    { method:'GET',    path:'/api/products',              desc:'商品一覧（現在庫を集計して返す）' },
    { method:'POST',   path:'/api/products',              desc:'商品追加' },
    { method:'PUT',    path:'/api/products/:id',          desc:'商品情報更新' },
    { method:'POST',   path:'/api/transactions',          desc:'入出庫記録（type=IN/OUT, quantity）' },
    { method:'GET',    path:'/api/transactions',          desc:'取引履歴一覧（?product_id= で絞り込み）' },
    { method:'GET',    path:'/api/products/alerts',       desc:'在庫アラート商品一覧' }
  ],
  learningEffect: ['ENUM型とビジネスルール','集計クエリで在庫数を計算','@Transactionalの重要性（在庫の整合性）','マスタデータとトランザクションデータの設計パターン'],
  implementSteps: [
    '1. DB設計（products・stock_transactions）',
    '2. 在庫数集計ロジック（SUM(type=IN) - SUM(type=OUT)）の実装',
    '3. 在庫アラートAPIの実装',
    '4. @Transactionalで在庫の整合性を保つ',
    '5. Next.jsでのUI実装',
    '6. デプロイ・README整備'
  ],
  readmeExample: '# 在庫管理アプリ\n\n## 機能\n- 商品マスタ管理\n- 入出庫トランザクション記録\n- 在庫数のリアルタイム集計\n- 在庫アラート',
  interviewPoints: [
    '在庫数の計算をどのように実装しましたか？',
    'なぜ@Transactionalが必要なのか説明してください。',
    '業務システムとして考慮したトラブルケースは何ですか？'
  ],
  evalCriteria: ['入出庫記録が動作する', '在庫数の計算が正しい', '在庫アラートが動作する', 'デプロイが完了している']
},

{
  id: 'app-crm',
  title: '顧客管理アプリ（CRM）',
  emoji: '👥',
  difficulty: '⭐⭐⭐⭐',
  summary: '顧客情報・対応履歴・商談ステータスを管理するシンプルなCRMアプリ。SES営業やB2Bビジネスの現場で使われる業務システムタイプ。',
  target: '営業チーム・カスタマーサクセスチーム',
  functions: ['顧客一覧（会社名・担当者・最終対応日）','顧客詳細と対応履歴スレッド','商談ステータス管理（リード/商談中/クローズ）','タグ付け・フィルタリング','顧客検索'],
  screens: ['顧客一覧（フィルタ・検索付き）','顧客詳細（対応履歴・商談情報）','顧客追加/編集フォーム','ダッシュボード（ファネル・件数）'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'customers', cols:'id, company_name, contact_name, email, phone, status(ENUM:LEAD/NEGOTIATING/CLOSED/LOST), created_at, updated_at' },
    { name:'activities', cols:'id, customer_id(FK), type(ENUM:CALL/EMAIL/MEETING/NOTE), content, activity_date, created_by, created_at' },
    { name:'tags', cols:'id, name, color' },
    { name:'customer_tags', cols:'customer_id(FK), tag_id(FK)' }
  ],
  apiList: [
    { method:'GET',    path:'/api/customers',         desc:'一覧（?status=&keyword= フィルタ）' },
    { method:'POST',   path:'/api/customers',         desc:'顧客追加' },
    { method:'PUT',    path:'/api/customers/:id',     desc:'情報・ステータス更新' },
    { method:'GET',    path:'/api/customers/:id/activities', desc:'対応履歴一覧' },
    { method:'POST',   path:'/api/customers/:id/activities', desc:'対応履歴追加' },
    { method:'GET',    path:'/api/customers/stats',   desc:'ステータス別件数' }
  ],
  learningEffect: ['CRMのデータモデル設計','多対多タグ付け（customer_tags）','ファネル表示のためのGROUP BY','ソフトデリート（削除フラグ）の概念'],
  implementSteps: [
    '1. 顧客・対応履歴・タグのDB設計',
    '2. タグの多対多テーブル実装',
    '3. ファネル集計APIの実装',
    '4. Next.jsでのファネル図・一覧UI実装',
    '5. タグフィルタの実装',
    '6. デプロイ・README整備'
  ],
  readmeExample: '# 顧客管理アプリ\n\n## 機能\n- 顧客情報とステータス管理\n- 対応履歴（電話/メール/商談）の記録\n- タグ付けとフィルタリング\n- 商談ファネルの可視化',
  interviewPoints: [
    'タグの多対多をどのように実装しましたか？',
    '商談ステータスの状態遷移はどのように管理しましたか？',
    'CRMとして実用的にするために工夫した点は何ですか？'
  ],
  evalCriteria: ['顧客CRUD・対応履歴追加が動作する', 'タグ付け・フィルタが動作する', '集計ダッシュボードが表示される', 'デプロイが完了している']
},

{
  id: 'app-daily',
  title: '日報管理アプリ',
  emoji: '📝',
  difficulty: '⭐⭐',
  summary: '毎日の業務報告を提出・確認できるアプリ。SESや研修生の日報管理として実際に使えるシンプルなアプリ。',
  target: 'SES研修生・新入社員・受講者と講師',
  functions: ['日報提出（今日の作業内容・進捗・困ったこと・明日の予定）','日報一覧（日付・提出者でフィルタ）','コメント機能（講師がフィードバック）','提出状況の確認（未提出アラート）','週次まとめ機能'],
  screens: ['今日の日報フォーム','日報一覧（自分の日報・全員の日報）','日報詳細（コメント付き）','週次レポートページ'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL' },
  tables: [
    { name:'users', cols:'id, name, role(ENUM:STUDENT/INSTRUCTOR), created_at' },
    { name:'daily_reports', cols:'id, user_id(FK), report_date(DATE), work_content, progress, problems, tomorrow_plan, created_at, updated_at' },
    { name:'comments', cols:'id, report_id(FK), user_id(FK), content, created_at' }
  ],
  apiList: [
    { method:'GET',    path:'/api/reports',           desc:'一覧（?user_id=&date= フィルタ）' },
    { method:'POST',   path:'/api/reports',           desc:'日報提出（1日1回のみ）' },
    { method:'PUT',    path:'/api/reports/:id',       desc:'日報修正（当日のみ）' },
    { method:'POST',   path:'/api/reports/:id/comments', desc:'コメント追加' },
    { method:'GET',    path:'/api/reports/status',    desc:'今週の提出状況一覧' }
  ],
  learningEffect: ['1日1件のビジネスルール実装（ユニーク制約）','日付型の操作','コメント機能（1対多）','ロールベースのデータ表示制御'],
  implementSteps: [
    '1. 日報・コメントのDB設計（1日1回制約）',
    '2. 提出済みチェックとバリデーション実装',
    '3. コメントAPIの実装',
    '4. Next.jsでの日報フォーム・一覧・詳細UI実装',
    '5. デプロイ・README整備'
  ],
  readmeExample: '# 日報管理アプリ\n\n## 機能\n- 毎日の業務日報を提出・管理\n- 講師からのコメント機能\n- 提出状況の可視化',
  interviewPoints: [
    '1日1回のみ提出できる制約をどう実装しましたか？',
    'このアプリを実際に使ってみた感想は？',
    '改善したい機能は何ですか？'
  ],
  evalCriteria: ['日報の提出・閲覧が動作する', 'コメント機能が動作する', '提出状況の確認ができる', 'デプロイが完了している']
},

{
  id: 'app-ai-support',
  title: 'AIチャット付き業務支援アプリ',
  emoji: '🤖',
  difficulty: '⭐⭐⭐⭐⭐',
  summary: 'OpenAI APIまたはClaude APIを使ってユーザーの質問にAIが回答する業務支援アプリ。問い合わせの返信ドラフト生成・FAQ応答・要約機能などを含む最上位難易度。',
  target: 'カスタマーサポートチーム・ナレッジ共有を行う組織',
  functions: ['AIチャット（GPT-4またはClaude APIを使用）','問い合わせ内容から返信ドラフト自動生成','FAQドキュメントの要約','チャット履歴の保存と再閲覧','AI利用ログ（コスト管理）'],
  screens: ['AIチャットUI（メッセージ履歴付き）','問い合わせ詳細（AIドラフト提案）','FAQドキュメント管理','AI利用ログ・コスト管理'],
  techStack: { front:'Next.js (TypeScript)', back:'Spring Boot 3.x', db:'MySQL', ai:'OpenAI API / Anthropic Claude API' },
  tables: [
    { name:'chat_sessions', cols:'id, user_id(FK), title, created_at' },
    { name:'chat_messages', cols:'id, session_id(FK), role(ENUM:USER/ASSISTANT), content, token_count, created_at' },
    { name:'ai_usage_logs', cols:'id, user_id(FK), model, tokens_used, cost_estimate, created_at' }
  ],
  apiList: [
    { method:'POST', path:'/api/chat/message',    desc:'AIにメッセージ送信（sessionId + message）' },
    { method:'GET',  path:'/api/chat/sessions',   desc:'チャット履歴一覧' },
    { method:'GET',  path:'/api/chat/sessions/:id',desc:'特定セッションのメッセージ一覧' },
    { method:'POST', path:'/api/ai/draft',        desc:'問い合わせ本文から返信ドラフト生成' },
    { method:'GET',  path:'/api/ai/usage',        desc:'AI利用状況・コスト集計' }
  ],
  learningEffect: ['外部AIAPIの呼び出し（Spring BootからREST）','ストリーミングレスポンスの処理','トークン管理とコスト意識','AIの回答を採用/修正するUI設計'],
  implementSteps: [
    '1. OpenAI または Claude APIキーの取得と環境変数設定',
    '2. Spring BootからAI APIを呼ぶServiceの実装',
    '3. チャットセッションのDB設計と実装',
    '4. Next.jsでのチャットUI実装',
    '5. AI利用ログの記録実装',
    '6. セキュリティ確認（APIキーの漏洩防止）',
    '7. デプロイ・README整備（AI利用コスト注意書き付き）'
  ],
  readmeExample: '# AIチャット付き業務支援アプリ\n\n⚠️ APIキー利用にコストが発生します。デモ用の使用量上限を設定しています。\n\n## 機能\n- GPT-4によるAIチャット\n- 問い合わせ返信ドラフト自動生成\n- AIトークン使用量のログ管理\n\n## 技術スタック\n- AI: OpenAI API (gpt-4o)\n- Backend: Spring Boot 3.x\n- Frontend: Next.js 14',
  interviewPoints: [
    'AIAPIを安全に使うためにどのような対策をしましたか？',
    'AIの出力をそのまま使わずレビューする仕組みはありますか？',
    'トークン数とコストをどのように管理しましたか？',
    'AIを組み込むことで解決しようとした課題は何ですか？'
  ],
  evalCriteria: ['AIチャット機能が動作する', 'APIキーがGitHubに流出していない', 'AI利用ログが記録される', 'デプロイが完了している']
}

]; // end P12_APPS