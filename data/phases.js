/* =========================================================
   data/phases.js  ─  全 13 Phase のメタデータ
   ========================================================= */
window.PHASES = [
  {
    id: 'p00', num: 0, title: '事前準備・PC基礎',
    category: 'Foundation', duration: '0.5週',
    emoji: '🖥️',
    goal: 'PCを使って開発環境を自分でゼロから構築できる状態になる。ターミナルを怖がらず操作でき、VSCode・Node.js・Git・GitHubを使えるようにする。',
    goalItems: [
      'ファイルとフォルダの概念を説明できる',
      'ターミナルを開いて cd / ls / mkdir / touch を使える',
      'VSCodeをインストールして日本語化・拡張機能を入れられる',
      'Node.js のバージョンを確認できる（node --version）',
      'git --version が通り、名前とメールを設定できる',
      'GitHubのアカウントを作り、最初のリポジトリを作れる',
      '環境構築で詰まったときに自分でエラーを調べられる'
    ],
    chapters: ['c00-1','c00-2','c00-3','c00-4','c00-5','c00-6']
  },
  {
    id: 'p01', num: 1, title: 'IT基礎・Web基礎',
    category: 'Foundation', duration: '0.5週',
    emoji: '🌐',
    goal: 'インターネット・サーバー・HTTP・APIの仕組みを自分の言葉で説明できる。Webアプリがどう動くかの全体像を把握し、今後の学習の地図として使えるようにする。',
    goalItems: [
      'クライアント/サーバーの関係を図で説明できる',
      'HTTPリクエスト/レスポンスの仕組みを説明できる',
      'REST APIとJSONの基本を理解している',
      'DevToolsのNetworkタブでリクエストを観察できる',
      'SES・受託・自社開発の違いを説明できる',
      '「フロント・バック・DB」という3層構成を図解できる'
    ],
    chapters: ['c01-1','c01-2','c01-3','c01-4','c01-5']
  },
  {
    id: 'p02', num: 2, title: 'HTML / CSS',
    category: 'Frontend', duration: '1週',
    emoji: '🎨',
    goal: 'セマンティックなHTMLで構造を作り、FlexboxとGridで崩れないレイアウトを組み、メディアクエリでスマホ対応した自己紹介ページをGitHub Pagesで公開できる。',
    goalItems: [
      'セマンティックHTMLタグを適切に使い分けられる',
      'CSSのボックスモデルを図で説明できる',
      'Flexboxで横並び・中央寄せ・均等配置ができる',
      'Gridで2カラムレイアウトを作れる',
      'メディアクエリで3ブレイクポイントのレスポンシブを実装できる',
      '自己紹介ページを GitHub Pages で公開できる',
      'デベロッパーツールでCSSをデバッグできる'
    ],
    chapters: ['c02-1','c02-2','c02-3','c02-4','c02-5','c02-6']
  },
  {
    id: 'p03', num: 3, title: 'JavaScript基礎',
    category: 'Frontend', duration: '1.5週',
    emoji: '⚡',
    goal: '変数・関数・配列・DOM操作・fetch APIを使いこなし、天気APIアプリを自力で実装できる。非同期処理の仕組みを初心者に説明できるレベルまで理解する。',
    goalItems: [
      'let/const/varの違いを説明し、適切に使い分けられる',
      'アロー関数と普通の関数の書き方を両方書ける',
      '配列のmap/filter/reduceを使いこなせる',
      'DOM取得・テキスト変更・クラス操作ができる',
      'addEventListener でクリック・入力イベントを扱える',
      'fetch + async/awaitでAPI呼び出しができる',
      '天気APIアプリを自力で作りGitHub Pagesで公開できる',
      'DevToolsのConsoleでエラーを読んで対処できる'
    ],
    chapters: ['c03-1','c03-2','c03-3','c03-4','c03-5','c03-6','c03-7']
  },
  {
    id: 'p04', num: 4, title: 'Git / GitHub',
    category: 'DevOps', duration: '0.5週',
    emoji: '📝',
    goal: 'ブランチ運用・プルリクエスト・コンフリクト解消まで実務のチーム開発フローを一通り体験できる。GitHub Actions の基本も理解する。',
    goalItems: [
      'add/commit/push/pull の流れを説明できる',
      'featureブランチを切って作業し、PRを出せる',
      'コンフリクトを自力で解消できる',
      '.gitignore を適切に書ける',
      'GitHub Pages でサイトを公開できる',
      'チーム開発で恥ずかしくないコミットメッセージが書ける'
    ],
    chapters: ['c04-1','c04-2','c04-3','c04-4','c04-5']
  },
  {
    id: 'p05', num: 5, title: 'React',
    category: 'Frontend', duration: '1.5週',
    emoji: '⚛️',
    goal: 'コンポーネント・props・state・useEffectを理解し、LocalStorage永続化付きのタスク管理アプリを設計・実装できる。',
    goalItems: [
      '関数コンポーネントとJSXを書ける',
      'propsで親から子へデータを渡せる',
      'useStateで状態管理ができる',
      'useEffectの依存配列を適切に使える',
      'コンポーネント分割の基準を説明できる',
      'タスク管理アプリ（CRUD + LocalStorage）を実装できる'
    ],
    chapters: ['c05-1','c05-2','c05-3','c05-4','c05-5','c05-6']
  },
  {
    id: 'p06', num: 6, title: 'Next.js',
    category: 'Frontend', duration: '1週',
    emoji: '▲',
    goal: 'App RouterによるSSR/SSGを理解し、API Routesを使ったフルスタック構成でポートフォリオサイトをVercelにデプロイできる。',
    goalItems: [
      'App RouterとPages Routerの違いを説明できる',
      'Server ComponentとClient Componentを適切に使い分けられる',
      '動的ルーティング（[slug]）を実装できる',
      'API Routesで簡単なAPIを作れる',
      'Vercelにデプロイできる',
      'metadataでSEO設定ができる'
    ],
    chapters: ['c06-1','c06-2','c06-3','c06-4','c06-5','c06-6']
  },
  {
    id: 'p07', num: 7, title: 'Java基礎',
    category: 'Backend', duration: '1.5週',
    emoji: '☕',
    goal: 'Javaの静的型付けとオブジェクト指向を理解し、カプセル化・継承・例外処理を使ったコマンドラインアプリを自力で作れる。',
    goalItems: [
      'Javaの基本型と参照型の違いを説明できる',
      'クラスとインスタンスの概念を図で説明できる',
      'カプセル化（private + getter/setter）を実装できる',
      '継承とインターフェースを使い分けられる',
      'try-catch-finallyで例外処理できる',
      'ArrayListとHashMapを使いこなせる'
    ],
    chapters: ['c07-1','c07-2','c07-3','c07-4','c07-5','c07-6']
  },
  {
    id: 'p08', num: 8, title: 'SQL / DB',
    category: 'Database', duration: '0.5週',
    emoji: '🗄️',
    goal: 'リレーショナルDBの設計原則を理解し、MySQLでCRUDを含む実用的なSQLを書き、複数テーブルのJOINクエリを自力で組める。',
    goalItems: [
      'テーブル設計・正規化の考え方を説明できる',
      'SELECT/INSERT/UPDATE/DELETEを書ける',
      'WHERE/ORDER BY/GROUP BY/HAVINGを使える',
      'INNER JOIN / LEFT JOINの違いを説明できる',
      'ERダイアグラムを読み書きできる',
      '3テーブルを結合したクエリを書ける'
    ],
    chapters: ['c08-1','c08-2','c08-3','c08-4','c08-5']
  },
  {
    id: 'p09', num: 9, title: 'Spring Boot',
    category: 'Backend', duration: '1.5週',
    emoji: '🍃',
    goal: 'Controller/Service/Repositoryの3層構造でREST APIを実装し、MySQLと連携したCRUD APIをPostmanで確認できる。DTOとバリデーションを適切に使える。',
    goalItems: [
      'Spring Boot プロジェクトをSpring Initializrで作れる',
      'Controller/Service/Repository の役割を説明できる',
      'JPA + Entityでテーブル操作できる',
      'DTOへの詰め替えができる',
      '@Validでバリデーションを実装できる',
      'CORSを設定してフロントから繋げられる',
      'Postmanで4エンドポイントを確認できる'
    ],
    chapters: ['c09-1','c09-2','c09-3','c09-4','c09-5','c09-6','c09-7']
  },
  {
    id: 'p10', num: 10, title: 'Python基礎・自動化',
    category: 'Automation', duration: '1週',
    emoji: '🐍',
    goal: 'Python の基本構文とpandasを使いこなし、CSVの読み込み・集計・グラフ出力・Excel出力まで業務自動化スクリプトを自力で書ける。',
    goalItems: [
      'venv で仮想環境を作れる',
      '基本構文（条件分岐・繰り返し・関数）を書ける',
      'pandasでCSVを読み込んで集計できる',
      'requestsでAPIを呼び出せる',
      '業務を自動化するスクリプトを1本完成させられる',
      'requirements.txtを作れる'
    ],
    chapters: ['c10-1','c10-2','c10-3','c10-4','c10-5']
  },
  {
    id: 'p11', num: 11, title: 'AI駆動開発',
    category: 'AI', duration: '1週',
    emoji: '🤖',
    goal: 'ChatGPT/Claude/Claude Codeを開発の各工程で適切に使い、AI利用ログを残しながら設計から実装・テスト・READMEまでをAIと協働できる。',
    goalItems: [
      'プロンプトの4要素（役割・前提・制約・出力形式）を使いこなせる',
      'Claude Codeをインストールし、CLAUDE.mdを作れる',
      'Issue化して1機能ずつAIに依頼できる',
      'AI出力を自分でレビューして採用/不採用の判断ができる',
      'AI利用ログをMarkdownで残せる',
      'READMEに「AI使用箇所」欄を書ける',
      '面談で「AIをどう使ったか」を具体的に語れる'
    ],
    chapters: ['c11-1','c11-2','c11-3','c11-4','c11-5','c11-6']
  },
  {
    id: 'p12', num: 12, title: 'フルスタック最終制作',
    category: 'Capstone', duration: '1.5週',
    emoji: '🚀',
    goal: '要件定義→設計→実装→デプロイ→READMEまで、Next.js + Spring Boot + MySQL のフルスタックアプリを一人で完成させ、面談で30秒以内に説明できる。',
    goalItems: [
      '要件定義書と画面設計書を作れる',
      'ER図とAPI仕様書を作れる',
      'Next.jsフロントとSpring BootバックをCORS接続できる',
      'Vercel + Renderにデプロイできる',
      'README（スクショ・技術・起動方法・AI使用箇所）を書ける',
      '面談想定質問23問に8割以上答えられる',
      '「何を作った・なぜ・何が難しかった・AIをどう使った」を30秒で語れる'
    ],
    chapters: ['c12-1','c12-2','c12-3','c12-4','c12-5','c12-6','c12-7','c12-8']
  }
];