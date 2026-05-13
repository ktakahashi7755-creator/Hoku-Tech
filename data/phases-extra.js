/* =========================================================
   data/phases-extra.js
   各 Phase の詳細コンテンツ（20要素構造）
   phases.js の id に対応して PHASES_EXTRA に格納
   ========================================================= */
window.PHASES_EXTRA = {

p00: {
  prerequisites: ['PCが操作できる（ファイルのコピー・ブラウザで検索ができる）'],
  skills: ['ターミナル基本操作','VSCode利用','Node.js/Git/GitHub セットアップ','ファイル管理','スクリーンショット撮影・エラー文のコピー'],
  realWorldUse: '入社初日に「PCセットアップして環境構築してください」と言われる。ターミナルとエディタが使えないとそこで詰まる。Phase 0は「作業ができる状態にする」ための最重要フェーズ。',
  keywords: ['ターミナル','パス','拡張子','VSCode','Node.js','npm','Git','GitHub','リポジトリ','環境変数'],
  learningSteps: [
    'PCとOSの基本を確認する（Windows/Mac の違い）',
    'ブラウザ・Googleアカウントを整える',
    'VSCode をインストールして日本語化・拡張機能を入れる',
    'ターミナルを開いて cd / ls / mkdir / touch を練習する',
    'Node.js をインストールして node --version を確認する',
    'Git をインストールして名前・メールを設定する',
    'GitHub アカウントを作り最初のリポジトリを作る',
    '学習環境チェックシートに全てチェックを入れる'
  ],
  handsOn: [
    { title:'ターミナル練習', desc:'~/Desktop/dev/practice フォルダを作り、touch hello.txt で空ファイルを作る。ls で確認して cat hello.txt を実行する。' },
    { title:'VSCode練習', desc:'hello.txt を VSCode で開いて「Hello, World!」と書いて保存する。' },
    { title:'Git初期設定', desc:'git config --global user.name "名前" と git config --global user.email "メール" を実行して git config --list で確認する。' }
  ],
  hokuUseCases: [
    'インストールでエラーが出た → エラーメッセージをコピーして「このエラーが出ました。Mac/Windows の〇〇版です」と聞く',
    'コマンドの意味が分からない → 「ls コマンドは何をしますか」と聞く',
    'パスが分からない → 「現在 C:\\Users\\yamada にいます。Desktop/dev に移動するには？」と聞く'
  ],
  hokuWarnings: [
    'パスワードや個人情報をプロンプトに貼らない',
    '「全部セットアップして」と丸投げしない（自分でコマンドを打つことが大事）'
  ],
  errorConsultation: {
    template: '【OS】Windows 11 / Mac 13\n【何をしようとした】Node.jsをインストールしようとした\n【エラーメッセージ】（エラーをそのままコピー）\n【ターミナルのログ】（ターミナル画面のスクリーンショットも添付）\n【試したこと】公式サイトを見た・再起動した',
    screenshotTips: ['エラー文が読める解像度で撮る','パスワードや個人情報が映っていないか確認する','ターミナル全体が見えるよう少し引いて撮る']
  },
  interviewQ: [
    '学習環境はどのようにセットアップしましたか？',
    'ターミナルでよく使うコマンドを3つ教えてください。',
    'エラーが出た時にまず何をしますか？'
  ],
  passCriteria: [
    'node --version で 18.x 以上が表示される',
    'git --version でバージョンが表示される',
    'GitHubアカウントが作成されリポジトリが1つ以上ある',
    'VSCodeでファイルを編集・保存できる',
    '学習環境チェックシートの全項目にチェックがある'
  ],
  resubmit: '未確認のツールがある場合はインストールしてスクリーンショットを再提出。',
  nextPhaseCondition: '全ツールが動作して学習環境チェックシートが完了している'
},

p01: {
  prerequisites: ['Phase 0 完了（PCと開発環境が使える）','ブラウザでWebサイトを普通に使える'],
  skills: ['Webアプリの仕組み説明','HTTP/HTTPSの概念','REST APIとJSON','DevTools活用','SES/受託/自社開発の違い説明'],
  realWorldUse: 'SES案件参画初日の朝礼・自己紹介で「どんな技術が得意ですか」「Webアプリの仕組みは理解していますか」と聞かれる。ここで詰まると現場で困る。',
  keywords: ['HTTP','HTTPS','リクエスト','レスポンス','ステータスコード','REST API','JSON','DNS','フロントエンド','バックエンド','DB','クラウド','SES','受託','自社開発'],
  learningSteps: [
    'Webアプリの仕組みを図で説明できるようにする（クライアント・サーバー・DB）',
    'HTTP/HTTPSのリクエスト・レスポンスを理解する',
    'DevTools の Network タブで実際のリクエストを観察する',
    'JSON とは何かを理解して自分で書いてみる',
    'REST API のエンドポイント設計を読んで理解する',
    'SES・受託・自社開発の違いを説明できるようにする',
    'IT業界の職種と働き方の全体像を把握する'
  ],
  handsOn: [
    { title:'DevTools でリクエスト観察', desc:'Chrome で好きなサイトを開き F12 → Network タブ → リロード → リストの最初のリクエストをクリックして Status / Headers / Response を確認する。' },
    { title:'JSONを自分で書く', desc:'自分の自己紹介を JSON で書く: {"name":"","age":0,"skills":["",""],"goal":""}' },
    { title:'API を呼んでみる', desc:'Chrome Console で fetch("https://jsonplaceholder.typicode.com/users/1").then(r=>r.json()).then(console.log) を実行する。' }
  ],
  hokuUseCases: [
    'HTTPとHTTPSの違いがよく分からない → たとえ話で説明してもらう',
    'JSONの書き方を間違えた → エラーメッセージをコピーして聞く',
    'SESと自社開発のどちらを目指すか迷っている → 両方のメリット・デメリットを聞く'
  ],
  hokuWarnings: ['「この会社に応募すべきか」という採用判断はしない（講師に相談）'],
  errorConsultation: {
    template: '【何をしようとした】DevTools で Network タブを開こうとした\n【エラー・問題】（画面が変わらない・タブが見つからないなど）\n【ブラウザ】Chrome 〇〇版\n【OS】Windows/Mac\n【スクリーンショット】（添付）',
    screenshotTips: ['DevTools が開いた状態で撮る','何のサイトかも見えるよう全体を撮る']
  },
  interviewQ: [
    'クライアントとサーバーの関係を図で説明してください。',
    'HTTPとHTTPSの違いを教えてください。',
    'REST APIとは何ですか？',
    'SESと自社開発の違いを教えてください。',
    'フロントエンド・バックエンド・DBの役割分担を説明してください。'
  ],
  passCriteria: [
    'Webアプリの3層構造（フロント・バック・DB）を図で説明できる',
    'HTTPリクエスト/レスポンスとステータスコードを説明できる',
    'DevToolsのNetworkタブでリクエストを観察した経験がある',
    'SES/受託/自社開発の違いを自分の言葉で説明できる'
  ],
  resubmit: '説明が表面的すぎる場合は口頭確認を実施。',
  nextPhaseCondition: 'IT基礎理解レポートが提出されていて、口頭でも説明できる状態'
},

p02: {
  prerequisites: ['Phase 1 完了（IT基礎・Web基礎を理解している）','テキストエディタで文字を入力して保存できる'],
  skills: ['セマンティックHTML','Flexboxレイアウト','CSS Gridレイアウト','レスポンシブデザイン','DevToolsでのCSSデバッグ','GitHub Pagesでの公開'],
  realWorldUse: 'SES案件でフロントエンド開発を担当する際、HTML/CSSは毎日使う。Figmaのデザインカンプをコーディングする「コーダー」の仕事でも必須。',
  keywords: ['HTML','CSS','セマンティック','タグ','セレクタ','ボックスモデル','Flexbox','Grid','レスポンシブ','メディアクエリ','ブレイクポイント','DevTools'],
  learningSteps: [
    'HTMLの基本タグと構造を理解する',
    'セマンティックHTMLを書く（header/main/footer/article/section）',
    'CSSのボックスモデルを理解する（margin・padding・border）',
    'Flexboxで横並びレイアウトを作る',
    'CSS Gridでグリッドレイアウトを作る',
    'メディアクエリでレスポンシブ対応をする',
    'DevToolsでCSSをデバッグする',
    '自己紹介ページをGitHub Pagesで公開する'
  ],
  handsOn: [
    { title:'Flexboxナビゲーション', desc:'ヘッダーにロゴと3つのナビリンクを配置する。Flexboxで左にロゴ・右にリンクを配置する（justify-content: space-between）。' },
    { title:'Gridカードレイアウト', desc:'スキルカードを3列×2行に並べる。grid-template-columns: repeat(3, 1fr) を使う。スマホでは1列になるようメディアクエリを追加する。' },
    { title:'DevToolsでCSS修正', desc:'表示が崩れているCSSをDevToolsのElementsタブで確認し、Stylesパネルで値を変えて問題を特定する。' }
  ],
  hokuUseCases: [
    'Flexboxのプロパティが覚えられない → 「justify-contentの値一覧とそれぞれの動作を教えてください」',
    'メディアクエリが効かない → 「<meta viewport>は入れましたか？」と聞くと確認できる',
    'CSSが思うように効かない → 「このCSSコードを見て何が問題かを指摘してください」'
  ],
  hokuWarnings: ['「自己紹介ページを全部作って」はNG（デザインと内容は自分で決める）'],
  errorConsultation: {
    template: '【何をしようとした】Flexboxで横並びにしようとした\n【問題】縦に並んでしまう\n【HTML・CSS】（コードをコピー）\n【ブラウザ・バージョン】Chrome 〇〇\n【スクリーンショット】（現在の表示と意図した表示の両方）',
    screenshotTips: ['現在の表示とコードの両方をスクリーンショットに含める','DevToolsを開いた状態のスクリーンショットが最も分かりやすい']
  },
  interviewQ: [
    'FlexboxとGridの使い分けを説明してください。',
    'レスポンシブデザインとはどういう意味ですか？',
    'セマンティックHTMLを使う理由を教えてください。',
    'CSSが思うように効かない時、まず何を確認しますか？'
  ],
  passCriteria: [
    '自己紹介ページがGitHub PagesのURLでアクセスできる',
    'スマホ（390px）で横スクロールが出ない',
    'FlexboxとGridを両方使っている',
    'セマンティックHTMLタグ（header/main/footer/section等）を使っている'
  ],
  resubmit: 'スマホで崩れる・横スクロールが出る・GitHub Pagesで404が出る場合は修正して再提出。',
  nextPhaseCondition: '自己紹介ページのGitHub PagesのURLが提出されていてスマホで正常に表示される'
},

p03: {
  prerequisites: ['Phase 2 完了（HTML/CSSで静的ページが作れる）','VSCodeで快適に作業できる'],
  skills: ['変数・型・演算子','条件分岐・繰り返し','関数・アロー関数','配列操作（map/filter/reduce）','DOM操作','イベントリスナー','fetch/async/await','JSON処理','Consoleエラーの読み方'],
  realWorldUse: 'Reactを学ぶ前提知識として必須。ReactのuseState・useEffectもJavaScriptの関数・配列操作が分かっていないと理解できない。',
  keywords: ['変数','定数','型','DOM','イベント','コールバック','Promise','async/await','fetch','JSON','LocalStorage','スコープ','クロージャ'],
  learningSteps: [
    '変数・型・演算子を理解する（let/const/var の使い分け）',
    '条件分岐・繰り返しを書く',
    '関数・アロー関数を使いこなす',
    '配列のmap・filter・reduceを使う',
    'DOM操作でテキスト変更・要素追加・クラス切替をする',
    'addEventListener でクリック・入力を処理する',
    'fetch + async/await で外部APIを呼ぶ',
    'ToDoアプリ・天気アプリを自力で作る'
  ],
  handsOn: [
    { title:'イミュータブルな配列操作', desc:'const tasks = [{id:1,title:"HTML",done:false}] を作り、map・filter・spreadで追加/削除/更新する。push は使わない。' },
    { title:'DOM ToDoリスト', desc:'inputに入力してボタンを押したらliを追加する。各liに削除ボタンをつけて消せるようにする。LocalStorageに保存してリロードしても残るようにする。' },
    { title:'fetch天気アプリ', desc:'OpenWeatherMap APIで都市名を入力して天気を表示する。ローディング中・エラー時の表示も実装する。' }
  ],
  hokuUseCases: [
    'async/awaitが分からない → 「同期と非同期の違いをたとえ話で教えてください。Promiseとasync/awaitの関係も」',
    'CORSエラーが出た → 「CORSエラーが出ました。このAPIを呼んでいます：(URL)。解決方法を教えてください」',
    'mapとforEachの違いが分からない → 「mapとforEachの違いを具体的なコード例で教えてください」'
  ],
  hokuWarnings: ['ToDoアプリのコードを丸ごと生成させない（自分で書くことで身につく）'],
  errorConsultation: {
    template: '【何をしようとした】fetchでAPIを呼ぼうとした\n【エラー】（Consoleのエラーをコピー）\n【コード】（該当のfetchのコードをコピー）\n【APIのURL】（呼ぼうとしていたURL）\n【スクリーンショット】（Console タブが見える状態）',
    screenshotTips: ['Consoleタブのエラー全文が読めるよう拡大して撮る','Networkタブのレスポンスも撮ると原因特定が速い']
  },
  interviewQ: [
    'async/awaitとはどういう仕組みですか？',
    'mapとforEachの違いを教えてください。',
    'Promiseとは何ですか？',
    '配列をイミュータブルに更新するとはどういう意味ですか？',
    'LocalStorageとSessionStorageの違いは？'
  ],
  passCriteria: [
    'ToDoアプリが動作してGitHub Pagesで公開されている',
    'fetchを使ったAPIアプリが動作している',
    'LocalStorageでデータが永続化されている',
    'Consoleエラーが出ていない'
  ],
  resubmit: 'コードにconsole.logが大量に残っている・基本機能が動かない場合は修正して再提出。',
  nextPhaseCondition: 'ToDoアプリと天気アプリの両方がGitHub Pagesで公開されている'
},

p04: {
  prerequisites: ['Phase 3 完了（JavaScriptでWebアプリを作れる）'],
  skills: ['add/commit/push/pullの流れ','ブランチ運用','Pull Request','コンフリクト解消','.gitignore','GitHub Pagesでの公開','コミットメッセージ設計'],
  realWorldUse: 'SES参画初日に「リポジトリをcloneして環境構築してください」と言われる。GitなしにSES案件には参画できない。チーム開発ではbranch/PR/レビューのサイクルが毎日ある。',
  keywords: ['リポジトリ','ステージング','コミット','ブランチ','マージ','コンフリクト','プルリクエスト','fork','clone','remote','origin','main','HEAD'],
  learningSteps: [
    'GitとGitHubの違いを理解する',
    'add/commit/pushの基本フローを覚える',
    'featureブランチを作って作業する',
    'Pull Requestを作ってマージする',
    'コンフリクトを発生させて解消する',
    '.gitignoreで不要なファイルを管理する',
    'Conventional Commitsでコミットメッセージを書く',
    'GitHub Pagesで静的サイトを公開する'
  ],
  handsOn: [
    { title:'コンフリクト練習', desc:'同じファイルの同じ行を2つのブランチで別々に変更してコンフリクトを発生させ、VSCodeのマージエディタで解消する。' },
    { title:'PR練習', desc:'feature/add-about-page ブランチを作って変更をpushし、GitHub上でPRを作成。PRの説明文にWhy（なぜこの変更が必要か）・What（何を変えたか）・How to test（確認方法）を書く。' }
  ],
  hokuUseCases: [
    'コンフリクトが怖い → 「コンフリクトの解消手順を1ステップずつ教えてください」',
    'コミットメッセージの書き方 → 「Conventional Commitsの形式で、〇〇を追加した時のコミットメッセージを例示してください」',
    'git pushでエラー → 「このgitエラーが出ました：（エラーコピー）。原因と解決方法を教えてください」'
  ],
  hokuWarnings: ['機密情報（APIキー・パスワード）をリポジトリにpushしてしまった場合は即座に削除してキーを再発行する（Hokuが解決できる問題ではない・GitHubに連絡が必要な場合あり）'],
  errorConsultation: {
    template: '【何をしようとした】git push しようとした\n【エラー】（ターミナルのエラーをコピー）\n【ブランチ名】（現在のブランチ）\n【試したこと】（git status や git log で確認など）\n【スクリーンショット】（ターミナル全体）',
    screenshotTips: ['ターミナル全体のスクリーンショット（git statusとエラーの両方が見える）']
  },
  interviewQ: [
    'git addとgit commitの違いを説明してください。',
    'ブランチを使う理由を教えてください。',
    'コンフリクトが起きた時どうやって解消しますか？',
    '.gitignoreを使ったことはありますか？どんなファイルを追加しましたか？',
    'Pull Requestのdescriptionに何を書きますか？'
  ],
  passCriteria: [
    'GitHubリポジトリにREADMEがある',
    '3回以上のコミットがある',
    'featureブランチを使ったPRのマージ履歴がある',
    'コミットメッセージがConventional Commits形式になっている',
    '.gitignoreにnode_modulesが含まれている'
  ],
  resubmit: 'コミットが1回だけ・mainブランチに直接push・コミットメッセージが意味をなさない場合は修正して再提出。',
  nextPhaseCondition: 'GitHubでPRを使ったワークフローが完了していてREADMEがある'
},

p05: {
  prerequisites: ['Phase 3 完了（JavaScript基礎）','Phase 4 完了（Git/GitHub）','Node.js/npmが使える'],
  skills: ['コンポーネント設計','propsとstate','useStateによる状態管理','useEffectによる副作用処理','カスタムフック','制御コンポーネント','Reactのエラー読み方'],
  realWorldUse: 'フロントエンド案件の70%以上でReactまたはReactベースのフレームワーク（Next.js）を使う。ReactなしでフロントエンドのSES案件に参画するのは年々難しくなっている。',
  keywords: ['JSX','コンポーネント','props','state','useState','useEffect','カスタムフック','仮想DOM','再レンダリング','制御コンポーネント','イミュータブル'],
  learningSteps: [
    'Reactとは何か・なぜ使うかを理解する',
    'コンポーネントとJSXの書き方を覚える',
    'propsでデータを渡す',
    'useStateで状態を管理する',
    'useEffectで副作用を処理する',
    'コンポーネントを適切に分割する',
    'fetchでAPIデータを取得して表示する',
    'タスク管理アプリを完成させてデプロイする'
  ],
  handsOn: [
    { title:'状態のリフトアップ', desc:'TaskItemコンポーネントにチェックボックスを追加し、TaskListコンポーネントに状態をリフトアップして管理する。「onToggle」コールバックをpropsで渡す。' },
    { title:'カスタムフック作成', desc:'useFetch(url)カスタムフックを作り、data/loading/errorの3状態を返す。複数コンポーネントでAPIデータを取得する場合に再利用できる形にする。' }
  ],
  hokuUseCases: [
    '再レンダリングが多すぎてパフォーマンスが悪い → 「React.memoやuseCallbackをいつ使うか教えてください」',
    'useEffectの依存配列が分からない → 「useEffectの依存配列に何を入れるべきかのルールを教えてください。[deps]とは？」',
    'コンポーネントを何個に分けるべきか → 「このコードを適切な粒度にコンポーネント分割するアドバイスをください：（コードをコピー）」'
  ],
  hokuWarnings: ['タスク管理アプリのコードを丸ごと生成させない（設計と主要ロジックは自分で書く）'],
  errorConsultation: {
    template: '【エラーメッセージ】（Consoleのエラーをコピー）\n【何をしようとした】useStateで配列を更新しようとした\n【コンポーネント名】TaskList\n【該当コード】（エラーが出ている周辺のコード）\n【スクリーンショット】（Consoleエラーが見える状態）',
    screenshotTips: ['Consoleに赤いエラーが表示されている状態をスクリーンショット','エラーのコールスタックが見えるよう展開して撮る']
  },
  interviewQ: [
    'ReactのuseStateとはどういう仕組みですか？',
    'propsとstateの違いを教えてください。',
    '状態のリフトアップとはどういう意味ですか？',
    'useEffectの依存配列を空([])にするとどうなりますか？',
    'なぜReactではstateを直接変更してはいけないのですか？'
  ],
  passCriteria: [
    'タスク管理アプリが動作しデプロイされている',
    'コンポーネントが適切に分割されている（App/Form/List/Item）',
    'useStateで状態が管理されている',
    'LocalStorageで永続化されている',
    'Consoleエラーが出ていない'
  ],
  resubmit: 'Consoleエラーが出ている・基本CRUD機能が動かない場合は修正して再提出。',
  nextPhaseCondition: 'タスク管理アプリのデプロイURLが提出されていてCRUD全機能が動作する'
},

p06: {
  prerequisites: ['Phase 5 完了（React基礎）'],
  skills: ['App Router','Server/Client Components','動的ルーティング','Server Actions','Route Handler','Vercelデプロイ','環境変数管理'],
  realWorldUse: '2024年現在、新規フロントエンドプロジェクトの過半数がNext.jsを採用している。ReactだけでなくNext.jsが書けることで受けられる案件の幅が広がる。',
  keywords: ['App Router','layout.tsx','page.tsx','Server Component','Client Component','use client','Link','useRouter','usePathname','Metadata','Route Handler','Server Action','revalidate'],
  learningSteps: [
    'Next.jsとReactの違いを理解する',
    'App Routerのファイルベースルーティングを覚える',
    'layout.tsxで共通レイアウトを作る',
    'Server ComponentとClient Componentを使い分ける',
    '動的ルートで一覧→詳細ページを作る',
    'Route HandlerでAPI Routeを作る',
    '環境変数を適切に管理する',
    'Vercelにデプロイしてポートフォリオを公開する'
  ],
  handsOn: [
    { title:'Server/Client分離', desc:'ブログ一覧ページをServer Componentで作り、お気に入りボタンだけClient Componentに分離する。「use client」ディレクティブの配置を最小化する。' },
    { title:'動的ルート', desc:'app/posts/[id]/page.tsxを作り、generateStaticParamsで静的生成する。/posts/1 / /posts/2 など複数ページを自動生成する。' }
  ],
  hokuUseCases: [
    'Server ComponentとClient Componentの使い分けが分からない → 「useStateを使う場合はClient、データ取得のみならServer、という基準を例示してください」',
    'デプロイが失敗する → 「Vercelのデプロイが失敗しています。このエラーログを見て原因を教えてください：（ログをコピー）」',
    '環境変数の設定 → 「Next.jsでNEXT_PUBLIC_とNEXT_の違いは何ですか？」'
  ],
  hokuWarnings: ['APIキーをNEXT_PUBLIC_で始めて公開してしまわないように注意'],
  errorConsultation: {
    template: '【エラー】（ターミナルまたはブラウザのエラーをコピー）\n【何をしようとした】Server ComponentでuseStateを使おうとした\n【ファイル名と行番号】app/page.tsx:12\n【コード】（該当箇所）',
    screenshotTips: ['Next.jsのエラーページはかなり詳しいのでそのまま撮ってシェアする']
  },
  interviewQ: [
    'Next.jsとReactの違いを説明してください。',
    'Server ComponentとClient Componentの使い分けを教えてください。',
    'App RouterのFile-based Routingとはどういう仕組みですか？',
    '環境変数をどのように管理していますか？',
    'VercelにデプロイしたURLはありますか？'
  ],
  passCriteria: [
    'ポートフォリオサイトのVercel URLが提出されている',
    'App Routerでルーティングが実装されている',
    'Server ComponentとClient Componentが適切に使い分けられている',
    '.envがGitIgnoreされている'
  ],
  resubmit: 'デプロイURLが動かない・環境変数がGitHubに流出している場合は即座に修正。',
  nextPhaseCondition: 'ポートフォリオサイトのVercel URLが提出されていて正常にアクセスできる'
},

p07: {
  prerequisites: ['Phase 4 完了（Git/GitHub）','プログラミングの基本概念（変数・条件・繰り返し）が分かる'],
  skills: ['Java基本構文','OOPの4原則','例外処理','コレクション（ArrayList/HashMap）','Stream API','Javaのエラー読み方','コンソールアプリ設計'],
  realWorldUse: 'SES市場でJavaの案件は最も多い。Java/Spring BootはSES案件の40〜60%を占める。JavaはC言語系の型付けがあるため、JavaScriptより「プロらしいコード」を書く訓練になる。',
  keywords: ['JDK','JVM','クラス','インスタンス','コンストラクタ','カプセル化','継承','ポリモーフィズム','インターフェース','例外','try-catch','ArrayList','HashMap','Stream'],
  learningSteps: [
    'JDK/JVM/JREの違いを理解する',
    '型と変数・演算子・条件分岐・繰り返しを書く',
    'メソッドを定義して呼び出す',
    'クラスとインスタンスを設計する',
    'カプセル化・継承・ポリモーフィズムを実装する',
    'インターフェースを使って抽象化する',
    '例外処理（try-catch-finally）を実装する',
    'コレクションとStream APIを使う'
  ],
  handsOn: [
    { title:'OOP実践：タスク管理クラス', desc:'Taskクラス（カプセル化）・TaskServiceインターフェース・InMemoryTaskServiceを実装する。コンソールからCRUD操作できるアプリを完成させる。' },
    { title:'Stream API練習', desc:'List<Task>をStream APIでフィルタリング・マッピング・集計する。ラムダ式との違いも確認する。' }
  ],
  hokuUseCases: [
    'NullPointerExceptionが出た → 「このスタックトレースの読み方を教えてください：（スタックトレースをコピー）」',
    'インターフェースと抽象クラスの違いが分からない → 「インターフェースと抽象クラスをいつ使い分けるか、Spring Bootの例で説明してください」',
    'StreamとforEachのどちらを使うか → 「Javaのfor文・forEachメソッド・Stream APIのそれぞれの使いどころを教えてください」'
  ],
  hokuWarnings: ['コンソールアプリのコードを丸投げしない（設計とメインロジックは自分で考える）'],
  errorConsultation: {
    template: '【エラー種類】NullPointerException\n【スタックトレース】（コピー）\n【何をしようとした】Taskのタイトルを表示しようとした\n【該当コード】（エラーが指している行とその周辺）',
    screenshotTips: ['IntelliJやEclipseのエラー表示は右パネルに詳細が出るのでそちらも含める']
  },
  interviewQ: [
    'OOPの4原則（カプセル化・継承・ポリモーフィズム・抽象化）を説明してください。',
    'インターフェースを使う目的は何ですか？',
    'Javaのfinal・static・abstractキーワードの意味を教えてください。',
    'NullPointerExceptionが出た時どうやってデバッグしますか？',
    'Stream APIとforループの使い分けを教えてください。'
  ],
  passCriteria: [
    'コンソールアプリが正常に動作している',
    'OOPの4原則が実装されている',
    'インターフェースを使った設計になっている',
    '例外処理が実装されている',
    'Stream APIが1箇所以上使われている'
  ],
  resubmit: 'コンパイルエラーが残っている・クラス設計がOOP原則を満たしていない場合は修正して再提出。',
  nextPhaseCondition: 'コンソールアプリのGitHubリポジトリが提出されていて動作確認できる'
},

p08: {
  prerequisites: ['Phase 7 完了（Java基礎）','PCにMySQLまたはDockerがインストールされている'],
  skills: ['SELECT/INSERT/UPDATE/DELETE','JOIN（INNER/LEFT）','GROUP BY・HAVING','インデックス','ER図設計','正規化の基礎','トランザクションの概念'],
  realWorldUse: 'DB設計・SQLはバックエンドエンジニアの必須スキル。Spring BootのJPAはSQLを自動生成するが、JPQLやNativeQueryでSQLを書く場面は必ずある。JOIN・集計クエリは現場で毎日書く。',
  keywords: ['テーブル','カラム','レコード','主キー','外部キー','NULL','SELECT','WHERE','JOIN','GROUP BY','HAVING','インデックス','ER図','正規化','トランザクション','ACID'],
  learningSteps: [
    'RDBの概念（テーブル・行・列・主キー・外部キー）を理解する',
    'SELECT・WHERE・ORDER BY・LIMITを使いこなす',
    'INSERT・UPDATE・DELETEを書く（WHERE忘れに注意）',
    'INNER JOIN・LEFT JOINで複数テーブルを結合する',
    'GROUP BY・HAVINGで集計する',
    'ER図を書いてDBを設計する',
    '正規化の考え方を理解する',
    'トランザクションとACID特性を理解する'
  ],
  handsOn: [
    { title:'タスク管理DBの設計と実装', desc:'users・tasks・tags・task_tagsの4テーブルを設計してER図を書く。CREATE TABLE文を書いてテスト用データをINSERTする。' },
    { title:'JOINを使った複雑なSELECT', desc:'「ユーザーごとの完了タスク数」「最近7日のタスク一覧と担当者名」などの実務的なクエリを書く。' }
  ],
  hokuUseCases: [
    'JOINの種類が分からない → 「INNER JOIN・LEFT JOIN・RIGHT JOINの違いをベン図で説明してください」',
    'ER図の書き方が分からない → 「顧客管理システムのER図をMermaid形式で書いてください。テーブルの説明も入れてください」',
    'UPDATE文を間違えた → 「WHERE句を忘れてUPDATEしてしまいました。データを元に戻す方法はありますか？」'
  ],
  hokuWarnings: ['本番DBにUPDATE/DELETE前はかならずSELECTで対象を確認する（Hokuでも「WHERE確認を必ずしてください」と伝える）'],
  errorConsultation: {
    template: '【エラー】（MySQLのエラーメッセージをコピー）\n【実行したSQL】（SQLを貼る）\n【テーブル構造】（DESCRIBE テーブル名; の結果）\n【何をしようとした】外部キー制約を設定しようとした',
    screenshotTips: ['DBeaverやMySQL Workbenchのエラーパネルをスクリーンショット','SQL実行した状態のウィンドウ全体が分かりやすい']
  },
  interviewQ: [
    'JOIN（INNER JOIN / LEFT JOIN）の違いを教えてください。',
    '主キーと外部キーの役割を説明してください。',
    'GROUP BYとHAVINGの使い分けを教えてください。',
    'インデックスとは何ですか？いつ使いますか？',
    'トランザクションとACID特性を説明してください。'
  ],
  passCriteria: [
    'ER図が提出されている（4テーブル以上）',
    'CREATE TABLE文にPK・FK・NOT NULL制約が設定されている',
    'INNER JOIN・LEFT JOINを使ったSELECT文がある',
    'GROUP BY・HAVINGを使った集計クエリがある'
  ],
  resubmit: 'ER図が未提出・SQLが実行できない場合は修正して再提出。',
  nextPhaseCondition: 'ER図とCRUDのSQLファイルがGitHubに提出されている'
},

p09: {
  prerequisites: ['Phase 7 完了（Java基礎）','Phase 8 完了（SQL/DB）'],
  skills: ['@RestController/@GetMapping等','3層構造（Controller/Service/Repository）','Entity/DTO','JPA/Hibernate','バリデーション','例外処理','CORS設定','PostmanでのAPI確認','Renderへのデプロイ'],
  realWorldUse: 'SES案件でJava/Spring Bootのバックエンドを担当する場合、このフェーズの知識がそのまま業務で使える。CRUD APIの設計・実装・テストは入門案件でも求められる。',
  keywords: ['Spring Boot','Maven','Controller','Service','Repository','Entity','DTO','JPA','Hibernate','@Valid','ResponseEntity','@ExceptionHandler','CORS','application.properties'],
  learningSteps: [
    'Spring BootプロジェクトをSpring Initializrで作る',
    '@RestControllerとHTTPメソッドを理解する',
    'Controller→Service→Repositoryの3層構造を実装する',
    'EntityクラスでDBテーブルをマッピングする',
    'DTOでAPIのリクエスト/レスポンスを分離する',
    '@Validでバリデーションを実装する',
    '@ExceptionHandlerでエラーレスポンスを統一する',
    'CORS設定でNext.jsと接続する',
    'PostmanでCRUD APIを確認する',
    'RenderにデプロイしてAPIをpublicにする'
  ],
  handsOn: [
    { title:'3層構造CRUD実装', desc:'TaskController→TaskService→TaskRepository の3層でタスク管理CRUDを実装する。各層の責務を説明できるようにする。' },
    { title:'バリデーション＋エラーレスポンス', desc:'TaskRequest DTOに@NotBlank/@Sizeを設定し、@ExceptionHandlerでバリデーションエラーを400 Bad Requestで返す統一形式を実装する。' },
    { title:'Next.js接続', desc:'Phase 6で作ったNext.jsアプリからSpring BootのCRUD APIを呼ぶ。CORS設定を追加してフロントから正しくアクセスできることを確認する。' }
  ],
  hokuUseCases: [
    'Spring Bootのエラーログが読めない → 「このSpring Bootのエラーログを読んで原因を教えてください：（ログをコピー）」',
    'JpaRepositoryのメソッド名が分からない → 「findByTitleContainingIgnoreCaseAndDoneOrderByCreatedAtDescの意味を教えてください」',
    'DTOとEntityを分ける理由が分からない → 「Spring BootでEntityをそのままAPIレスポンスとして返してはいけない理由を教えてください」'
  ],
  hokuWarnings: ['application.propertiesのパスワードをGitHubにpushしない（環境変数で管理）'],
  errorConsultation: {
    template: '【エラー種類】BeanCreationException / 404 Not Found / etc.\n【エラーログ】（Spring Bootのコンソールログをコピー）\n【何をしようとした】APIエンドポイントを呼んだら404が返った\n【コントローラーのコード】（該当コード）\n【application.propertiesの関連設定】（DB接続情報はマスク）',
    screenshotTips: ['Spring Bootのコンソールにはスタックトレースが全て出るのでそのままコピー貼り付けが最も有効']
  },
  interviewQ: [
    'Spring Bootの3層構造（Controller/Service/Repository）を説明してください。',
    'DTOとEntityを分ける理由を教えてください。',
    'JPAとHibernateの関係を説明してください。',
    '@Transactionalをいつ使いますか？',
    'PostmanでAPIをテストしたことはありますか？'
  ],
  passCriteria: [
    'CRUD APIがPostmanで全メソッド確認できる',
    'Controller/Service/Repositoryの3層が分離されている',
    'DTOとEntityが分離されている',
    'バリデーションエラーが400で返る',
    'CORSが設定されていてNext.jsから接続できる'
  ],
  resubmit: 'APIが一部しか動かない・DTOとEntityが分離されていない場合は修正して再提出。',
  nextPhaseCondition: 'CRUD APIのPostman Collection（またはREADMEに curl コマンド）が提出されていて全エンドポイントが動作する'
},

p10: {
  prerequisites: ['Phase 3 完了（JavaScriptの基本）','Python 3.10以上がインストールされている'],
  skills: ['Pythonの基本構文','pandasによるデータ処理','matplotlibによる可視化','requestsによるAPI呼び出し','CSVとExcelの処理','業務自動化スクリプト設計'],
  realWorldUse: '業務自動化・データ分析・AI活用の場面でPythonが活躍する。SES以外でも、IT部門での業務効率化プロジェクトに参加する際にPythonを書けると価値が高い。',
  keywords: ['venv','pip','pandas','DataFrame','matplotlib','requests','pathlib','openpyxl','json','csv','例外処理','型ヒント'],
  learningSteps: [
    'venvで仮想環境を作り依存関係を管理する',
    '変数・型・条件分岐・繰り返し・関数を書く',
    'リストと辞書を操作する',
    'パスとファイル操作（pathlib）を使う',
    'pandasでCSV/Excelを読み込んで集計する',
    'matplotlibでグラフを作成してExcelに貼り付ける',
    'requestsで外部APIからデータを取得する',
    '業務自動化ツールを完成させる'
  ],
  handsOn: [
    { title:'月次レポート自動生成', desc:'売上CSVを読み込んでpandasで月別・商品別に集計し、matplotlibでグラフを作り、openpyxlで月次報告Excelを生成する。' },
    { title:'API自動取得ツール', desc:'requestsで天気API・為替APIなどのデータを定期取得してCSVに保存し、変動があればSlack（またはメール）に通知するスクリプトを作る。' }
  ],
  hokuUseCases: [
    'pandasのエラーが分からない → 「このpandasのエラーを解説してください：（エラーコピー）。DataFrameの構造はこうです：（df.head()の結果）」',
    'matplotlibで日本語が文字化けする → 「matplotlibで日本語フォントを設定する方法を教えてください（Mac/Windows別）」',
    'スクリプトの設計で迷っている → 「こういう処理をするPythonスクリプトの設計を相談したい。機能は〇〇です」'
  ],
  hokuWarnings: ['業務データ（個人情報・機密データ）をHokuに貼らない。—データに置き換えてから質問する'],
  errorConsultation: {
    template: '【エラー】（Pythonのエラーをコピー）\n【コード】（エラーが出ている関数をコピー）\n【データ】（使っているデータのサンプル。個人情報は—に置換）\n【Pythonバージョン】python --version\n【インストール済みパッケージ】pip list',
    screenshotTips: ['ターミナルのエラー全体（tracebackの最初から最後まで）を撮る']
  },
  interviewQ: [
    'Pythonでデータ分析をした経験はありますか？',
    'pandasのDataFrameとは何ですか？',
    'Python仮想環境（venv）を使う理由を教えてください。',
    '業務自動化でどんな課題を解決しましたか？'
  ],
  passCriteria: [
    'venv + requirements.txt で環境が再現できる',
    'CSVまたはExcelを読み込んで集計できている',
    'グラフまたはExcel出力が生成されている',
    'README.md に使い方が書かれている'
  ],
  resubmit: 'venvがない・requirements.txtがない・スクリプトがエラーで止まる場合は修正して再提出。',
  nextPhaseCondition: '自動化スクリプトのGitHubリポジトリが提出されてREADMEに従って動作確認できる'
},

p11: {
  prerequisites: ['Phase 5以降の開発経験（何かしらのアプリを作った経験）'],
  skills: ['プロンプト設計の4要素','AI利用ログの記録','Claude Code操作','Issue駆動開発','セキュリティ意識（APIキー・個人情報の扱い）','AI出力のレビューと採用判断'],
  realWorldUse: 'AI駆動開発を使いこなすエンジニアと使わないエンジニアでは生産性が2〜5倍変わる。AIに丸投げせず「AIを使いこなして説明責任を持てるエンジニア」がSES市場で求められている。',
  keywords: ['プロンプト','CLAUDE.md','Issue駆動開発','AI利用ログ','丸投げ防止','セキュリティ','採用判断','コードレビュー','README自動化'],
  learningSteps: [
    'AIツールの種類と使い分けを理解する',
    'プロンプトの4要素（役割・前提・制約・出力形式）を覚える',
    'AI出力を全てレビューして採用/修正を判断する',
    'Claude CodeでCLAUDE.mdを設定する',
    'GitHub IssueとAIを組み合わせた開発フローを体験する',
    'AI利用ログをREADMEに記録する',
    'セキュリティリスク（APIキー・個人情報）を理解する',
    '面談でAI活用を説明できるようにする'
  ],
  handsOn: [
    { title:'AI利用ログ作成', desc:'今週のプロジェクトでAIを使った箇所を全てリストアップする。「何を依頼したか」「AIの出力を採用したか・修正したか・却下したか」「なぜその判断をしたか」を記録する。' },
    { title:'Claude Codeで機能追加', desc:'Phase 9のCRUD APIに検索機能を追加する。Claude Codeに依頼する前にGitHub Issueで要件を定義する。AIが生成したコードを全てレビューして理解してからcommitする。' }
  ],
  hokuUseCases: [
    '良いプロンプトを書きたい → 「このタスクのプロンプトをレビューして改善案を教えてください：（プロンプトをコピー）」',
    'AIの出力が期待と違う → 「このAIの出力の何が間違っているか分析してください：（出力をコピー）」',
    'AI利用ログのフォーマットを確認 → 「このAI利用ログは採用担当者に見せて問題ない内容ですか：（ログをコピー）」'
  ],
  hokuWarnings: ['AIに「全部作って」とだけ指示するのは最もダメなパターン','APIキー・パスワード・個人情報・社内機密をプロンプトに貼らない'],
  errorConsultation: {
    template: '【何をしようとした】Claude CodeにAPIの実装を依頼した\n【問題】生成されたコードがコンパイルエラーになる\n【エラー】（エラーをコピー）\n【AIに渡したプロンプト】（プロンプトをコピー。機密情報は除く）\n【AIの出力コード】（出力コードをコピー）',
    screenshotTips: ['Claude Code のターミナル全体をスクリーンショット']
  },
  interviewQ: [
    'AIをどのように開発に活用していますか？',
    'AI出力をそのままコミットしてはいけない理由を教えてください。',
    'Claude Codeを使う時に注意することは何ですか？',
    'AI利用ログを残している理由を教えてください。'
  ],
  passCriteria: [
    'AI利用ログがREADMEに記録されている',
    'AIを使った箇所がコードコメントで明記されている',
    'AI出力を採用/修正/却下した理由が説明できる',
    'APIキーがGitHubに流出していない'
  ],
  resubmit: 'AI利用ログがない・APIキーがGitHubにある場合は修正して再提出。',
  nextPhaseCondition: 'AI利用ログが記録されていてAI活用の説明ができる状態'
},

p12: {
  prerequisites: ['Phase 5〜9完了（React・Next.js・Java・SQL・Spring Boot）','Phase 11完了（AI駆動開発）'],
  skills: ['要件定義・画面設計・DB設計・API設計','フルスタック実装（Next.js + Spring Boot + MySQL）','CORS・環境変数・セキュリティ','Vercel + Renderへのデプロイ','README・AI利用ログ','面談でのポートフォリオ説明'],
  realWorldUse: 'これが最終ポートフォリオ。SES面談で「何か作ったものを見せてください」と言われた時に見せるURL。フロントもバックもDBも全部繋がったアプリを作った経験があることがアピールポイントになる。',
  keywords: ['要件定義','画面設計','ER図','API設計','CRUD','バリデーション','認証（入口）','デプロイ','README','面談説明資料'],
  learningSteps: [
    '要件定義（ユーザーストーリー・機能一覧）を書く',
    '画面設計（ワイヤーフレーム）を作る',
    'DB設計（ER図）を書く',
    'API設計（エンドポイント一覧）を定義する',
    'Spring BootのCRUD APIを実装する',
    'Next.jsのフロントエンドを実装する',
    'フロントとバックを接続する（CORS・fetch）',
    'Vercel + Renderにデプロイする',
    'README・AI利用ログを整備する',
    '面談想定質問に自分の言葉で答える練習をする'
  ],
  handsOn: [
    { title:'要件定義ドキュメント', desc:'アプリの概要・対象ユーザー・ユーザーストーリー・機能一覧・非機能要件をGitHub Projectまたはmarkdownで書く。' },
    { title:'デプロイ後の動作確認', desc:'VercelのURLでフロントが表示される・RenderのURLでAPIが返る・フロントからバックのAPIを呼べる・DBへのデータ保存と取得ができる、の全てを確認する。' }
  ],
  hokuUseCases: [
    '設計の相談 → 「このアプリのDB設計をレビューしてください。改善点を指摘してください：（ER図またはテーブル定義）」',
    'デプロイのトラブル → 「Vercelのデプロイが失敗しています。このエラーを解析してください：（エラーログ）」',
    '面談練習 → 「このポートフォリオについて面接官として質問してください。私の回答を評価してください」'
  ],
  hokuWarnings: ['アプリを丸ごとAIに作ってもらわない（設計・実装の主体は自分）','デプロイ先のAPIキーがGitHubに含まれていないか最終確認'],
  errorConsultation: {
    template: '【環境】フロント：Vercel / バック：Render / DB：MySQL on Render\n【問題】フロントからバックのAPIを呼ぶとCORSエラーになる\n【エラー】（ブラウザのConsoleのエラーをコピー）\n【Spring BootのCORS設定】（WebConfigクラスのコード）\n【Next.jsのfetch URL】（使っているAPIのURL）',
    screenshotTips: ['ブラウザのConsoleエラー・Networkタブのリクエストとレスポンスのスクリーンショットをセットで送る']
  },
  interviewQ: [
    '作成したアプリについて3分で説明してください。',
    'なぜこのアプリを作ることにしましたか？',
    'DB設計で一番考えた点はどこですか？',
    'デプロイで苦労したことはありますか？どうやって解決しましたか？',
    'もし時間があれば追加したい機能は何ですか？',
    'AIをどのように活用しましたか？',
    'チームで開発するとしたら、このアプリをどう分担しますか？'
  ],
  passCriteria: [
    'フロント（Vercel URL）とバック（Render URL）がデプロイされている',
    'フロントからバックのAPIを呼んでCRUD操作が全て動作する',
    'README.mdにデプロイURL・技術スタック・セットアップ手順・AI利用ログがある',
    '面談想定質問に自分の言葉で答えられる',
    'ER図とAPI設計書がREADMEまたはdocsに含まれている'
  ],
  resubmit: 'デプロイURLがどちらか動かない・CRUD機能が一部動かない・READMEが不十分な場合は修正して再提出。',
  nextPhaseCondition: '卒業条件を全て満たしていて講師との最終レビューが完了している'
}

}; // end PHASES_EXTRA