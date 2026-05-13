/* =========================================================
   data/lesson-p01.js  ─  Phase 1「IT基礎・Web基礎」
   全 13 Lesson 完全版
   ========================================================= */
window.LESSON_P01 = {

/* ── Chapter 1-1: インターネットの仕組み ── */
'l01-1-1': {
  id:'l01-1-1', chapter:'c01-1', num:'1-1-1',
  title:'インターネットとWebページが表示される仕組み',
  duration:'20分',
  goal:'URLを打ち込んでWebページが表示されるまでの流れを図で説明できる。',
  why:'Webエンジニアとして働く上で「なぜ画面が表示されるのか」を説明できないと、バグ調査やパフォーマンス改善ができない。面談でも必ず聞かれる基礎知識。',
  fieldUse:'「このAPIのレスポンスが遅い」「画像が表示されない」などのトラブル対応で、リクエストの流れを理解していると原因の絞り込みが速くなる。',
  analogy:'インターネットは「世界規模の宅配便システム」。あなたがURL（住所）を入力すると、DNS（住所録）がIPアドレスを調べ、その住所のサーバーに荷物（リクエスト）を届け、サーバーから荷物（HTMLファイル）が返ってくる。',
  terms:[
    {term:'URL', meaning:'Uniform Resource Locator。Webページの住所。https://example.com/path のような形式。'},
    {term:'DNS', meaning:'Domain Name System。ドメイン名（example.com）をIPアドレスに変換する仕組み。インターネットの住所録。'},
    {term:'IPアドレス', meaning:'インターネット上の機器を識別する番号。192.168.1.1 のような形式。'},
    {term:'HTTP/HTTPS', meaning:'ブラウザとサーバーの通信規則。HTTPSはHTTPを暗号化したもの。'},
    {term:'ブラウザ', meaning:'Webページを表示するソフトウェア。Chrome・Firefox・Safari・Edge など。'},
  ],
  steps:[
    {num:1, title:'Webページ表示の流れを確認する',
     description:'ブラウザに https://www.google.com と打ってEnterを押す。裏側では以下が起きている。',
     windows:'1. ブラウザが DNS に「www.google.com のIPアドレスは？」と問い合わせる\n2. DNS が「142.250.x.x だよ」と返す\n3. ブラウザがそのIPアドレスのサーバーに「ページをください」とリクエスト\n4. サーバーがHTMLファイルをレスポンスとして送る\n5. ブラウザがHTMLを解釈して画面に表示する',
     mac:'同上。'},
    {num:2, title:'DevToolsでリクエストを観察する',
     description:'実際にリクエストが飛ぶ様子をDevToolsで確認する。',
     windows:'Chrome を開く → 任意のWebサイトに移動 → F12キー（DevTools を開く）→ 「Network」タブをクリック → ページをリロード（Ctrl+R）→ リスト表示されたファイルの1つをクリックして「Headers」タブを見る',
     mac:'Chrome で Cmd+Option+I → Network タブ → ページリロード（Cmd+R）'},
  ],
  code: null,
  expectedOutput:'DevToolsのNetworkタブに、HTMLファイル・CSSファイル・画像ファイルのリクエスト一覧が表示される。',
  errors:[
    {msg:'DevToolsが開かない', cause:'ショートカットキーが違う', fix:'Chromeのメニュー（右上…）→「その他のツール」→「デベロッパーツール」'}
  ],
  quiz:[
    {q:'URLを入力してページが表示されるまでに「DNS」は何をしますか？', a:'ドメイン名（例：google.com）をIPアドレスに変換する。'},
    {q:'HTTPとHTTPSの違いは何ですか？', a:'HTTPSはHTTPに暗号化（TLS）を加えたもの。通信内容を盗聴・改ざんから保護する。'},
  ],
  miniTask:'DevToolsのNetworkタブを開いてgoogle.comにアクセスし、最初に読み込まれるHTMLファイルのStatusコードを確認してください。',
  aiOk:['HTTPとHTTPSの違いをたとえ話で説明してください','DNSの仕組みを初心者向けに教えてください'],
  aiNg:[],
  interviewQ:['URLを入力してページが表示されるまでの流れを説明してください。'],
  nextLesson:'l01-1-2'
},

'l01-1-2': {
  id:'l01-1-2', chapter:'c01-1', num:'1-1-2',
  title:'クライアントとサーバーの役割分担',
  duration:'15分',
  goal:'クライアント・サーバーの役割の違いを図で説明できる。フロントエンド・バックエンドという言葉の意味を説明できる。',
  why:'「フロントエンドエンジニア」「バックエンドエンジニア」「フルスタック」という職種の意味を理解するために必要。自分が何を学んでいるかの地図になる。',
  fieldUse:'SESの案件で「このシステムはどんな構成ですか」と聞かれた時に答えられる。設計書を読む際にも必要な前提知識。',
  analogy:'レストランに例えると：クライアント（ブラウザ）はお客様、サーバーはキッチン。お客様は「ハンバーグください」（リクエスト）と言い、キッチンが料理を返す（レスポンス）。フロントエンドは食器・盛り付け、バックエンドはキッチンの中身。',
  terms:[
    {term:'クライアント', meaning:'サービスを要求する側。主にブラウザやスマホアプリ。'},
    {term:'サーバー', meaning:'サービスを提供する側。リクエストを受け取り処理してレスポンスを返すコンピュータ。'},
    {term:'フロントエンド', meaning:'ユーザーが直接見る・操作するUI部分。HTML/CSS/JavaScriptで作る。'},
    {term:'バックエンド', meaning:'サーバー側の処理。データ保存・認証・ビジネスロジックなど。Java/Python/Node.jsなど。'},
    {term:'フルスタック', meaning:'フロントエンドとバックエンドの両方を担当・開発できるエンジニア。'},
  ],
  steps:[
    {num:1, title:'Webアプリの構成を図で描く',
     description:'ノートに以下の3層を手書きで描く。図で理解することが大切。',
     windows:'[ブラウザ（クライアント）] → リクエスト → [Webサーバー（バックエンド）] → クエリ → [データベース]\n                           ← レスポンス ←',
     mac:'同上。'},
  ],
  code: null,
  expectedOutput:'クライアント・サーバー・DBの3層構成の図がノートに描ける。',
  errors:[],
  quiz:[
    {q:'フロントエンドとバックエンドの違いを一言で説明してください。', a:'フロントエンドはユーザーが見る画面、バックエンドはサーバー側の処理とデータ管理。'},
    {q:'なぜWebシステムはクライアントとサーバーに分かれているのですか？', a:'役割を分担することでスケーラビリティ（複数ユーザー対応）とセキュリティ（データをサーバー側で管理）が向上するから。'},
  ],
  miniTask:'自分が使っているWebサービスを1つ選んで「クライアントとサーバーがどんなやり取りをしているか」をノートに書いてください。',
  aiOk:['フルスタックエンジニアとフロントエンドエンジニアの違いを教えてください'],
  aiNg:[],
  interviewQ:['フロントエンドとバックエンドの違いを説明してください。'],
  nextLesson:'l01-1-3'
},

'l01-1-3': {
  id:'l01-1-3', chapter:'c01-1', num:'1-1-3',
  title:'プロトコルとポート番号',
  duration:'15分',
  goal:'HTTP・HTTPS・FTPなど主要プロトコルの役割を説明でき、ポート番号の概念を理解できる。',
  why:'「ポート8080で動かす」「HTTPSに対応させる」など、開発現場で当然のように出てくる言葉を理解するため。',
  fieldUse:'Spring Bootのデフォルトはポート8080、Reactの開発サーバーは3000番など。設定を変更する際に必要な知識。',
  analogy:'プロトコルは「言語」。日本語で話すか英語で話すかのルール。ポートは「受付窓口の番号」。郵便局でも「荷物は1番窓口、普通郵便は2番窓口」のように入口を分けている。',
  terms:[
    {term:'プロトコル', meaning:'通信の規則・手順。HTTP・HTTPS・FTP・SSHなどがある。'},
    {term:'ポート番号', meaning:'コンピュータ上のサービスの「受付番号」。0〜65535の数字で表す。HTTP=80、HTTPS=443、SSH=22など。'},
    {term:'localhost', meaning:'自分自身のコンピュータを指すホスト名。127.0.0.1 と同じ意味。開発中は http://localhost:3000 などでアクセスする。'},
  ],
  steps:[
    {num:1,title:'ターミナルから HTTP プロトコルでサーバーに話しかけてみる',description:'curl コマンドで Google にリクエストを送り、HTTP ステータスとヘッダだけ確認する。-I はヘッダ表示。',windows:'curl -I https://www.google.com',mac:'curl -I https://www.google.com'},
    {num:2,title:'明示的にポート番号を指定してアクセスする',description:'HTTPSのデフォルトは443番。明示的に書いても同じ結果になる。',windows:'curl -I https://www.google.com:443',mac:'curl -I https://www.google.com:443'},
    {num:3,title:'localhost の意味を確認する',description:'(任意) 開発用にローカルサーバーを立てて localhost:8000 にアクセスする。Pythonがあれば 1 行で立てられる。',windows:'# 別ターミナルで\npython -m http.server 8000\n# 元のターミナルで\ncurl -I http://localhost:8000',mac:'# 別ターミナルで\npython3 -m http.server 8000\n# 元のターミナルで\ncurl -I http://localhost:8000'},
    {num:4,title:'今 PC で開いているポートを見る',description:'macOS は lsof、Windows は netstat で確認できる。LISTEN 状態のものが「待ち受けポート」。',windows:'netstat -ano | findstr LISTEN',mac:'lsof -iTCP -sTCP:LISTEN -n -P'}
  ],
  code:'# よく使うポート番号の一覧\nHTTP      : 80\nHTTPS     : 443\nSSH       : 22\nFTP       : 21\nMySQL     : 3306\nSpring Boot開発 : 8080\nReact開発  : 3000\nNext.js開発 : 3000',
  expectedOutput:'curl の HTTP/2 200 ステータス行が見える。localhost:8000 に GET が通る。lsof / netstat で待ち受けポート一覧が表示される。',
  errors:[
    {msg:'curl: (6) Could not resolve host',cause:'インターネット未接続 or ホスト名スペルミス',fix:'まず https://www.google.com にブラウザでアクセスできるか確認。スペルもチェック。'},
    {msg:'curl: (7) Failed to connect to localhost port 8000',cause:'ローカルサーバーが起動していない、または別のポートで起動している',fix:'別ターミナルで python -m http.server 8000 が動いているか確認。起動メッセージのポート番号と合わせる。'},
    {msg:'Address already in use (port 8000 起動時)',cause:'既に何かが 8000 番ポートを使っている',fix:'別ポートで起動する (python -m http.server 8001)、または既存プロセスを停止する。'}
  ],
  quiz:[
    {q:'HTTPとFTPの違いは何ですか？', a:'HTTPはWebページの送受信、FTPはファイル転送に使うプロトコル。'},
    {q:'localhost:3000 の意味を説明してください。', a:'自分のPC（localhost）のポート番号3000番で動いているサービスにアクセスする。'},
  ],
  miniTask:'Spring Boot を起動したら何番ポートを確認しますか？また React の開発サーバーは何番ポートですか？答えをノートに書いてください。',
  aiOk:['SSHとHTTPSの違いを教えてください'],
  aiNg:[],
  interviewQ:['HTTPとHTTPSの違いを説明してください。'],
  nextLesson:'l01-2-1'
},

/* ── Chapter 1-2: Webサーバーとクライアント ── */
'l01-2-1': {
  id:'l01-2-1', chapter:'c01-2', num:'1-2-1',
  title:'HTTPリクエストとレスポンス',
  duration:'20分',
  goal:'HTTPのGET/POSTリクエストとレスポンスの構造（ヘッダー・ボディ・ステータスコード）を説明できる。',
  why:'バックエンドAPIを作るときも、フロントからAPIを呼ぶときも、HTTPの仕組みを知らないとデバッグができない。面談で必ず聞かれる。',
  fieldUse:'Spring BootでAPI（GET /api/tasks）を作るとき、フロントのfetch()でAPIを呼ぶとき、どちらもHTTPの知識が前提になる。',
  analogy:'HTTPリクエスト/レスポンスは「手紙のやり取り」。封筒（ヘッダー）に宛先・差出人・件名を書き、中身（ボディ）に本文を入れる。返事（レスポンス）には結果（ステータスコード）も入る。',
  terms:[
    {term:'HTTPメソッド', meaning:'GET（取得）・POST（作成）・PUT（更新）・DELETE（削除）の4種類が基本。REST APIの設計で使い分ける。'},
    {term:'ステータスコード', meaning:'レスポンスの結果を示す3桁の数字。200=成功、404=見つからない、500=サーバーエラーなど。'},
    {term:'リクエストヘッダー', meaning:'リクエストのメタ情報。Content-Type（データ形式）・Authorization（認証情報）などが入る。'},
    {term:'レスポンスボディ', meaning:'サーバーが返すデータ本体。JSONやHTMLが入ることが多い。'},
  ],
  steps:[
    {num:1, title:'DevToolsでHTTPを観察する',
     description:'実際のHTTPリクエスト/レスポンスをブラウザで確認する。',
     windows:'Chrome → F12 → Network タブ → 任意のサイトをリロード（Ctrl+R）→ 一覧からファイルをクリック → Headers タブでRequest/Response Headers を確認 → Response タブでボディを確認',
     mac:'Cmd+Option+I → Network → Cmd+R → 同様'},
  ],
  code:'# よく見るHTTPステータスコード\n200 OK           → 成功\n201 Created      → 新規作成成功（POST後によく返る）\n400 Bad Request  → リクエストの形式が間違っている\n401 Unauthorized → 認証が必要（ログインしていない）\n403 Forbidden    → アクセス権がない\n404 Not Found    → ページ・リソースが見つからない\n500 Internal Server Error → サーバー側のエラー',
  expectedOutput:'DevToolsでHTTPリクエストのメソッド・URL・ステータスコードを確認できる。',
  errors:[],
  quiz:[
    {q:'404エラーはどんな状況で返りますか？', a:'リクエストしたURLのページやリソースがサーバーに存在しない場合。'},
    {q:'GETとPOSTの使い分けを説明してください。', a:'GETはデータを取得するだけ（URLにパラメータ付加可）、POSTはデータを送信して作成・更新するときに使う（ボディにデータを入れる）。'},
  ],
  miniTask:'DevToolsを開いてTwitter（X）やYouTubeを開き、最初に返ってくるレスポンスのステータスコードとContent-Typeを確認してください。',
  aiOk:['HTTPの4つのメソッドの使い分けを表でまとめてください','ステータスコード一覧のよく使うものを教えてください'],
  aiNg:[],
  interviewQ:['GETとPOSTの違いを説明してください。','404と500エラーの違いは何ですか？'],
  nextLesson:'l01-2-2'
},

'l01-2-2': {
  id:'l01-2-2', chapter:'c01-2', num:'1-2-2',
  title:'JSONとデータ形式',
  duration:'15分',
  goal:'JSONの読み書きができる。APIがなぜJSONを使うのかを説明できる。',
  why:'React/Next.jsでAPIを呼び出してデータを表示する際、JSONのパースとアクセスは毎日使うスキル。JSONを読めないと開発が止まる。',
  fieldUse:'Spring BootのAPIレスポンスも、OpenWeatherMap等の外部APIのレスポンスも、ほぼ全てJSONで返ってくる。',
  analogy:'JSONはプログラム同士が情報を交換するための「共通語」。英語と日本語のエンジニアが図（JSON）で意思疎通するようなもの。',
  terms:[
    {term:'JSON', meaning:'JavaScript Object Notation。{}と[]を使って構造化データを表現するテキスト形式。現代のAPIで最も使われる。'},
    {term:'キーと値', meaning:'JSONの基本単位。{"name": "山田"} のように「キー: 値」のペアで構成する。'},
    {term:'JSON.parse()', meaning:'JSON文字列をJavaScriptオブジェクトに変換する関数。APIから受け取ったJSONを扱う時に使う。'},
    {term:'JSON.stringify()', meaning:'JavaScriptオブジェクトをJSON文字列に変換する関数。APIにデータを送る時に使う。'},
  ],
  steps:[],
  code:'// JSON の例（タスク管理APIのレスポンスイメージ）\n{\n  "id": 1,\n  "title": "HTML/CSSを学ぶ",\n  "done": false,\n  "tags": ["frontend", "html"],\n  "assignee": {\n    "name": "山田太郎",\n    "email": "yamada@example.com"\n  }\n}\n\n// JavaScriptでJSONを扱う\nconst json = \'{"name": "山田", "age": 25}\';\nconst obj = JSON.parse(json);  // 文字列 → オブジェクト\nconsole.log(obj.name);         // → 山田\n\nconst backToJson = JSON.stringify(obj); // オブジェクト → 文字列',
  expectedOutput:'JSON.parseとJSON.stringifyを使って相互変換できる。',
  errors:[
    {msg:'SyntaxError: Unexpected token in JSON', cause:'JSONの形式が正しくない（カンマ忘れ・クォート忘れなど）', fix:'JSONLintなどのバリデーターでJSONを確認する。'},
  ],
  quiz:[
    {q:'JSON.parse()とJSON.stringify()の違いは？', a:'parseは文字列→JSオブジェクト、stringifyはJSオブジェクト→文字列の変換。'},
    {q:'JSONで配列を表現するには？', a:'角括弧[]を使う。例：{"tags": ["react", "next.js"]}'},
  ],
  miniTask:'以下のJSONを手書きで作ってください：あなたの名前・年齢・スキル（配列）を含む自己紹介JSON',
  aiOk:['このJSONが正しい形式かチェックしてください：[JSONを貼る]','JSONとXMLの違いを教えてください'],
  aiNg:[],
  interviewQ:['JSONとは何ですか？なぜAPIでよく使われるのですか？'],
  nextLesson:'l01-2-3'
},

'l01-2-3': {
  id:'l01-2-3', chapter:'c01-2', num:'1-2-3',
  title:'Webブラウザの仕組みとDevTools活用',
  duration:'20分',
  goal:'ブラウザがHTMLをレンダリングする仕組みを理解し、DevToolsのElements・Console・Networkの3タブを使いこなせる。',
  why:'CSSが効かない・JSエラーが出る・APIがつながらないなど、日常的なデバッグは全てDevToolsで行う。これを使えないと開発効率が10分の1になる。',
  fieldUse:'「本番で画像が表示されない」「APIのレスポンスが想定と違う」「CSSが崩れる」── 全てDevToolsで調査する。',
  analogy:'DevToolsはWebエンジニアの「聴診器」。患者（Webページ）の内部を調べる道具で、何が起きているかを診断する。',
  terms:[
    {term:'DOM', meaning:'Document Object Model。HTMLをJavaScriptから操作するためのツリー構造。ElementsタブでDOMを確認できる。'},
    {term:'Console', meaning:'JavaScriptのconsole.log()やエラーが表示される場所。デバッグの基本。'},
    {term:'Network', meaning:'全てのHTTPリクエスト/レスポンスを記録するタブ。APIの確認に必須。'},
  ],
  steps:[
    {num:1, title:'DevToolsの3大タブを使う',
     description:'',
     windows:'F12でDevToolsを開く → 以下を順に試す：\n\n[Elements] 適当な要素を右クリック→「検証」→ HTMLの階層が表示される\n[Console] 「>」の後に 1+1 と打ってEnter → 2 が返る\n[Network] タブをクリック → Ctrl+R でリロード → リクエスト一覧を確認',
     mac:'Cmd+Option+I または右クリック→「検証」'},
  ],
  code:'// Console タブで試せるコマンド\nconsole.log("Hello DevTools");\nconsole.log(document.title);     // ページタイトルを表示\nconsole.log(location.href);      // 現在のURL\ndocument.body.style.background = "red"; // 背景を赤に変える（試し用）',
  expectedOutput:'ConsoleにHello DevToolsが表示される。ページのタイトルとURLが表示される。',
  errors:[
    {msg:'Consoleに赤いエラーが出る', cause:'JavaScriptの構文エラーまたは実行エラー', fix:'エラーメッセージの右側にあるファイル名と行番号をクリックして該当箇所を確認する。'},
  ],
  quiz:[
    {q:'DevToolsのElementsタブは何を確認するために使いますか？', a:'HTMLのDOM構造とCSSスタイルの確認・デバッグ。CSSが効いているか確認できる。'},
    {q:'APIのレスポンスを確認したい時はどのタブを使いますか？', a:'Networkタブ。'},
  ],
  miniTask:'任意のWebサイトでDevToolsを開き、Consoleタブで document.title と document.querySelectorAll("a").length を実行してください。',
  aiOk:['DevToolsのPerformanceタブの使い方を教えてください'],
  aiNg:[],
  interviewQ:['日常的に使うDevToolsのタブを教えてください。どんな時に使いますか？'],
  nextLesson:'l01-3-1'
},

/* ── Chapter 1-3: フロント・バック・DB ── */
'l01-3-1': {
  id:'l01-3-1', chapter:'c01-3', num:'1-3-1',
  title:'Webアプリの3層構造（フロント・バック・DB）',
  duration:'20分',
  goal:'フロントエンド・バックエンド・データベースの3層構成を図で説明でき、各層が担う役割を述べられる。',
  why:'「このバグはフロントの問題？バックの問題？DB？」と切り分けができるかどうかで、デバッグの速度が大きく変わる。SES現場でも「どのレイヤーを担当しているか」を明確に話す必要がある。',
  fieldUse:'面談で「どの技術スタックの案件をご希望ですか」と聞かれた際に「Next.jsのフロントとSpring Bootのバックを経験しました」と答えるための前提知識。',
  analogy:'飲食チェーンに例えると：フロントはホール（お客様が見る場所）、バックエンドはキッチン（注文を受けて料理する場所）、DBは食材倉庫（データを保存する場所）。',
  terms:[
    {term:'3層アーキテクチャ', meaning:'プレゼンテーション層（フロント）・アプリケーション層（バック）・データ層（DB）の3層でシステムを設計する考え方。'},
    {term:'REST API', meaning:'フロントとバックが通信するためのインターフェース。「/api/users でGETリクエストを投げるとユーザー一覧が返る」というルールを定める。'},
    {term:'ORM', meaning:'Object-Relational Mapping。SQLを直接書かずにオブジェクト操作でDBを扱う技術。JavaではJPA/Hibernate。'},
  ],
  steps:[
    {num:1, title:'3層の流れを追う',
     description:'タスク管理アプリを例に3層の流れを追ってみる。',
     windows:'[ユーザーが「タスク追加」ボタンをクリック]\n ↓ フロントエンド（Next.js）\n  POSTリクエストを /api/tasks に送る\n ↓ バックエンド（Spring Boot）\n  TaskControllerがリクエストを受ける\n  TaskServiceで入力を検証する\n  TaskRepositoryでDBに保存命令\n ↓ データベース（MySQL）\n  tasks テーブルに新しい行を挿入\n ↑ バックエンド → フロント\n  保存したタスクをJSONで返す\n ↑ フロントエンド\n  受け取ったタスクをリストに追加して表示',
     mac:'同上。'},
  ],
  code: null,
  expectedOutput:'3層の流れをノートに図で描ける。',
  errors:[],
  quiz:[
    {q:'バックエンドが必要な理由を2つ挙げてください。', a:'① データをDBに保存・取得する処理をサーバーで行うため ② 認証・認可などのセキュリティ処理をクライアントに依存せず行うため。'},
    {q:'REST APIはどのような役割を果たしますか？', a:'フロントエンドとバックエンドが取り決めたデータのやり取りのルール（インターフェース）。どのURLにどのHTTPメソッドでリクエストすれば何のデータが返るかを定義する。'},
  ],
  miniTask:'タスク管理アプリの「タスク一覧を表示する」機能について、フロント・バック・DBの3層でどんな処理が起きるかをフロー図で書いてください。',
  aiOk:['マイクロサービスとモノリスアーキテクチャの違いを初心者向けに説明してください'],
  aiNg:[],
  interviewQ:['Webアプリの3層構造を説明してください。'],
  nextLesson:'l01-3-2'
},

'l01-3-2': {
  id:'l01-3-2', chapter:'c01-3', num:'1-3-2',
  title:'クラウドとサーバーの種類',
  duration:'15分',
  goal:'オンプレ・クラウド・VPS・PaaS・SaaSの違いを説明でき、Vercel・Render・AWSが何者かを説明できる。',
  why:'「Vercelにデプロイする」「AWSを使っている現場」など、クラウドは現場で当たり前に出てくる用語。知らないと会話についていけない。',
  fieldUse:'Phase 6でVercelにNext.jsをデプロイし、Phase 9でRenderにSpring Bootをデプロイする。なぜそのサービスを使うかを理解するための基礎知識。',
  analogy:'クラウドはコンピュータの「レンタルサービス」。自分でサーバーを買って管理（オンプレ）するより、使った分だけ支払う（クラウド）方が多くの企業で採用されている。',
  terms:[
    {term:'クラウド', meaning:'インターネット経由で利用するサーバー・ストレージ・DBなどのITリソース。AWS・GCP・Azureが世界3大クラウド。'},
    {term:'PaaS', meaning:'Platform as a Service。アプリのデプロイだけに集中できるプラットフォーム。Vercel・Render・Herokuなど。インフラ管理不要。'},
    {term:'SaaS', meaning:'Software as a Service。ソフトウェアをサービスとして提供。Google Docs・Slack・GitHub など。'},
    {term:'Vercel', meaning:'Next.jsを作った会社が提供するPaaS。GitHubと連携してpushするだけで自動デプロイ。フロントエンドに特化。'},
    {term:'Render', meaning:'Web Service・DBホスティング・Cronなどを提供するPaaS。Spring BootのAPIのデプロイに使いやすい。無料枠あり。'},
  ],
  steps:[],
  code: null,
  expectedOutput:'クラウドとオンプレの違いを説明でき、Vercel/Renderの用途を説明できる。',
  errors:[],
  quiz:[
    {q:'PaaSとIaaSの違いは何ですか？', a:'PaaSはアプリのデプロイに集中できる（インフラ管理不要）、IaaSはOSレベルからインフラを自分で設定できる（自由度は高いが管理が必要）。'},
    {q:'なぜ現代の開発でクラウドが主流になったのですか？', a:'自分でサーバーを買う初期投資が不要・使った分だけ支払う・スケールアップが容易・世界中のデータセンターから選べるため。'},
  ],
  miniTask:'Vercel と Render それぞれどんなアプリに使うかをノートに書いてください。',
  aiOk:['AWSとGCPの違いを初心者向けに教えてください'],
  aiNg:[],
  interviewQ:['クラウドとオンプレミスの違いを教えてください。'],
  nextLesson:'l01-4-1'
},

/* ── Chapter 1-4: REST API と JSON ── */
'l01-4-1': {
  id:'l01-4-1', chapter:'c01-4', num:'1-4-1',
  title:'APIとは何か・REST APIの設計原則',
  duration:'20分',
  goal:'APIの概念を説明でき、REST APIの4大メソッド（GET/POST/PUT/DELETE）とエンドポイントの設計原則を説明できる。',
  why:'フロントエンドはAPIを呼ぶ、バックエンドはAPIを作る。APIを理解しないとどちらも開発できない。フルスタック開発の要。',
  fieldUse:'Spring BootでAPI設計をするとき、「このURLはGETかPOSTか？」「リソース名をどうするか？」という判断に直結する。',
  analogy:'APIはレストランの「メニュー」。「ハンバーグ（リソース）をください（GET）」「新しいメニューを追加して（POST）」のように、何をどうするかが決まっているインターフェース。',
  terms:[
    {term:'API', meaning:'Application Programming Interface。プログラム同士が通信するための窓口。Webでは主にHTTPを使ったREST APIが使われる。'},
    {term:'エンドポイント', meaning:'APIの窓口URL。/api/users（ユーザー一覧）、/api/users/1（ID=1のユーザー）など。リソースを表す名詞を使うのが原則。'},
    {term:'RESTful', meaning:'REST APIの設計原則に従っていること。URL設計・HTTPメソッドの使い分け・ステータスコードの適切な使用などが含まれる。'},
  ],
  steps:[],
  code:'# REST APIのエンドポイント設計例（タスク管理）\nGET    /api/tasks          → タスク一覧を取得\nGET    /api/tasks/1        → ID=1のタスクを取得\nPOST   /api/tasks          → 新しいタスクを作成\nPUT    /api/tasks/1        → ID=1のタスクを更新\nDELETE /api/tasks/1        → ID=1のタスクを削除\n\n# 悪い例（動詞を使っている）\nGET    /api/getTasks       → NG（動詞を入れない）\nPOST   /api/createTask     → NG（POSTは作成を意味するので不要）',
  expectedOutput:'タスク管理APIの5つのエンドポイント設計ができる。',
  errors:[],
  quiz:[
    {q:'タスクの情報を更新したい場合、HTTPメソッドは何を使いますか？', a:'PUT（全更新）またはPATCH（部分更新）。'},
    {q:'RESTfulな設計でURLに動詞を入れてはいけない理由は？', a:'HTTPメソッド（GET/POST/PUT/DELETE）自体が動詞の意味を持っているため、URLは「何を」（名詞・リソース）だけを表現すればよいから。'},
  ],
  miniTask:'ブログ記事管理アプリのREST APIエンドポイントを5つ設計してください（記事の一覧・詳細・作成・更新・削除）。',
  aiOk:['このAPIの設計はRESTfulですか？改善点を教えてください：[設計を貼る]'],
  aiNg:[],
  interviewQ:['REST APIとは何ですか？', 'GETとPOSTとPUTとDELETEの使い分けを説明してください。'],
  nextLesson:'l01-4-2'
},

'l01-4-2': {
  id:'l01-4-2', chapter:'c01-4', num:'1-4-2',
  title:'実際のAPIを呼んでみる（fetch入門）',
  duration:'25分',
  goal:'fetchを使って外部APIを呼び出し、JSONデータをConsoleに表示できる。',
  why:'React/Next.jsでデータを表示する際、APIからfetchするのは必須技術。早い段階で「実際のAPIをつなぐ体験」をしておくと、後の学習がスムーズになる。',
  fieldUse:'天気・地図・決済・認証など、外部APIと連携するのは現場で日常的にある。APIキーの扱い方・エラーハンドリングも含めて習得する。',
  analogy:'fetchはHTTP通信の「郵便配達員」。リクエストを送って、返ってきたレスポンス（手紙）を開けてデータを取り出す。',
  terms:[
    {term:'fetch()', meaning:'ブラウザ・Node.js 18以降で使えるHTTPリクエスト関数。Promiseを返す。'},
    {term:'async/await', meaning:'非同期処理を同期的に書ける構文。fetchと組み合わせて使う。'},
    {term:'JSONPlaceholder', meaning:'テスト用の無料APIサービス（jsonplaceholder.typicode.com）。ユーザー・投稿・コメントなどのデータを返す。'},
  ],
  steps:[
    {num:1, title:'ChromeのConsoleでAPIを呼ぶ',
     description:'Chromeを開いてDevToolsのConsoleで実行する。',
     windows:'F12 → Console タブ → 以下を貼り付けてEnter:\\nfetch(\'https://jsonplaceholder.typicode.com/users/1\')\\n  .then(res => res.json())\\n  .then(data => console.log(data));',
     mac:'Cmd+Option+I → Console → 同じコードを実行'},
  ],
  code:'// APIを呼ぶ基本的な書き方（async/await版）\nasync function getUser() {\n  try {\n    const response = await fetch(\'https://jsonplaceholder.typicode.com/users/1\');\n    if (!response.ok) throw new Error(\'Network error: \' + response.status);\n    const data = await response.json();\n    console.log(\'ユーザー名:\', data.name);\n    console.log(\'メール:\', data.email);\n  } catch (error) {\n    console.error(\'エラー:\', error);\n  }\n}\ngetUser();',
  expectedOutput:'Console に「ユーザー名: Leanne Graham」などが表示される。',
  errors:[
    {msg:'CORS error: blocked by CORS policy', cause:'ブラウザがクロスオリジンリクエストをブロックしている', fix:'JSONPlaceholderなどCORSを許可しているAPIを使う。または自分でバックエンドAPIにCORSヘッダーを設定する。'},
    {msg:'SyntaxError: Unexpected token < in JSON', cause:'レスポンスがJSONではなくHTMLが返っている（エラーページ等）', fix:'response.text()でデバッグしてレスポンス内容を確認する。'},
  ],
  quiz:[
    {q:'fetchで取得したレスポンスをJSONに変換するには何を呼びますか？', a:'response.json()を呼ぶ。これもPromiseを返すのでawaitする必要がある。'},
    {q:'async/awaitのasyncは何の略ですか？', a:'asynchronous（非同期）の略。'},
  ],
  miniTask:'JSONPlaceholderの /todos/1 エンドポイントを呼んで、title と completed をConsoleに表示してください。',
  aiOk:['このfetchのエラーの意味を教えてください：[エラーを貼る]','axios と fetch の違いを教えてください'],
  aiNg:['APIを呼ぶコードを全部書いてください（自分で書く練習が大切）'],
  interviewQ:['fetchとaxiosの違いを知っていますか？', 'async/awaitとは何ですか？'],
  nextLesson:'l01-4-3'
},

'l01-4-3': {
  id:'l01-4-3', chapter:'c01-4', num:'1-4-3',
  title:'データベースの役割と種類',
  duration:'15分',
  goal:'RDB（リレーショナルDB）とNoSQLの違いを説明でき、MySQLがどんなシステムで使われるかを述べられる。',
  why:'バックエンド開発には必ずDBが関わる。「なぜSQLを学ぶのか」「MySQLとMongoDBはどう違うのか」の前提知識。',
  fieldUse:'SES案件では「DBはMySQLです」「PostgreSQLで設計してください」など、DBの種類を指定されることが多い。',
  analogy:'DBはExcelの超高機能版。複数のテーブル（シート）をリレーション（関連）で繋ぎ、大量データを高速に検索・更新できる。',
  terms:[
    {term:'RDBMS', meaning:'Relational DataBase Management System。行と列のテーブル形式でデータを管理するDB。MySQL・PostgreSQL・Oracle・SQLiteなど。'},
    {term:'NoSQL', meaning:'リレーショナルDBではないDBの総称。MongoDB（ドキュメント型）・Redis（キーバリュー型）など。柔軟なスキーマが特徴。'},
    {term:'SQL', meaning:'Structured Query Language。RDBMSを操作する言語。SELECT・INSERT・UPDATE・DELETEが基本コマンド。'},
  ],
  steps:[],
  code: null,
  expectedOutput:'RDBMSとNoSQLの使い分けを説明できる。',
  errors:[],
  quiz:[
    {q:'MySQLとMongoDBの主な違いは？', a:'MySQLはテーブル型（スキーマが固定）・SQLで操作。MongoDBはドキュメント型（JSON形式・スキーマ柔軟）でNoSQL。'},
    {q:'なぜデータをファイルではなくDBに保存するのですか？', a:'複数ユーザーの同時アクセス・大量データの高速検索・トランザクション（整合性保証）・バックアップなど、ファイル管理では対応困難な要件のため。'},
  ],
  miniTask:'Excelで管理していた「社員名簿」をDBのテーブルに変換する場合、どんな列（カラム）が必要かリストアップしてください。',
  aiOk:['MySQLとPostgreSQLの違いを教えてください'],
  aiNg:[],
  interviewQ:['RDBMSとNoSQLの違いを説明してください。'],
  nextLesson:'l01-5-1'
},

/* ── Chapter 1-5: IT業界の働き方 ── */
'l01-5-1': {
  id:'l01-5-1', chapter:'c01-5', num:'1-5-1',
  title:'SES・受託・自社開発の違いとキャリアパス',
  duration:'20分',
  goal:'SES・受託開発・自社開発の違いを説明でき、それぞれのメリット・デメリットと自分のキャリアパスの描き方を理解できる。',
  why:'このカリキュラムを受講している多くの方がSES業界を目指している。現場での働き方・評価の仕組み・スキルの積み方を理解しておくことが重要。',
  fieldUse:'面談で「どんな働き方を希望しますか？」と必ず聞かれる。SES・受託・自社それぞれの特徴を理解した上で答えられると印象が大きく違う。',
  analogy:'SESは「派遣スタッフ」として様々なクライアントの現場で働くイメージ。受託は「工務店」として注文された家（システム）を建てる。自社開発は「自分の家」を自分たちで作り続ける。',
  terms:[
    {term:'SES', meaning:'System Engineering Service。エンジニアを時間単価でクライアントに提供する働き方。様々な現場・技術を経験できる。'},
    {term:'受託開発', meaning:'クライアントからシステム開発を請け負い、完成物を納品するビジネスモデル。'},
    {term:'自社開発', meaning:'自社のプロダクト（Webサービス・アプリ）を自分たちで開発・運用する働き方。'},
    {term:'スキルシート', meaning:'エンジニアの経験・スキルをまとめた履歴書。SES営業が案件マッチングに使う。'},
  ],
  steps:[
    {num:1, title:'3つの働き方を比較する',
     description:'',
     windows:'| 項目 | SES | 受託 | 自社開発 |\n|---|---|---|---|\n| 技術の幅 | 広い（現場による） | 中程度 | 深い（自社スタック）|\n| 単価 | 時間単価 | プロジェクト請負 | 月給制が多い |\n| 安定性 | 案件切替あり | 納期プレッシャー | 比較的安定 |\n| 未経験の入りやすさ | 高い | 中程度 | 低い（経験者優遇）|\n| 自己成長 | 速い（多様な現場）| 速い | 深い（一つのプロダクト）|',
     mac:'同上。'},
  ],
  code: null,
  expectedOutput:'3つの働き方の違いを自分の言葉で説明できる。',
  errors:[],
  quiz:[
    {q:'SESエンジニアとして評価されるために大切なことを2つ挙げてください。', a:'① スキルシートに載せられる実績・技術スタックを積み上げること ② クライアント先でのコミュニケーション・報連相のスキル。'},
    {q:'未経験者がSESから始めるメリットは何ですか？', a:'未経験でも比較的案件に参画しやすく、多様な現場で短期間にさまざまな技術・業界知識を習得できること。'},
  ],
  miniTask:'自分が3年後になりたいエンジニア像を1段落で書いてください（どんな技術を使い・どんな会社で働き・何をしているか）。',
  aiOk:['SESエンジニアのキャリアパスを教えてください','自社開発に転職するためのスキルセットを教えてください'],
  aiNg:[],
  interviewQ:['SESと自社開発の違いを説明してください。', 'なぜSES（または自社開発）を選びましたか？'],
  nextLesson:'l01-5-2'
},

'l01-5-2': {
  id:'l01-5-2', chapter:'c01-5', num:'1-5-2',
  title:'開発工程とアジャイル・ウォーターフォール',
  duration:'15分',
  goal:'システム開発の工程（要件定義→設計→実装→テスト→リリース）を説明でき、ウォーターフォールとアジャイルの違いを述べられる。',
  why:'「今の案件はどのフェーズですか？」という会話が現場で普通にある。開発工程を知ると、自分がどの段階で何をすべきかが明確になる。',
  fieldUse:'SES案件では「詳細設計フェーズから参画してください」「テスト工程を担当してください」という形で工程ごとに参画する。',
  analogy:'ウォーターフォールは「家の建築」。基礎→柱→壁→屋根と順番に進む。アジャイルは「家を少しずつ作りながら改善する」。まず1部屋を完成させ、住みながら追加していく。',
  terms:[
    {term:'ウォーターフォール', meaning:'要件定義→基本設計→詳細設計→実装→テスト→リリースを順番に進む開発手法。計画重視。変更に対応しにくい。'},
    {term:'アジャイル', meaning:'短いサイクル（スプリント）で開発・フィードバック・改善を繰り返す開発手法。変化に対応しやすい。'},
    {term:'スプリント', meaning:'アジャイル開発における1〜2週間程度の開発サイクル。スプリント終了時に動くソフトウェアをリリースする。'},
    {term:'スクラム', meaning:'アジャイル開発の代表的なフレームワーク。Sprint・Backlog・デイリースタンドアップなどの概念を持つ。'},
  ],
  steps:[],
  code: null,
  expectedOutput:'ウォーターフォールとアジャイルの違いを説明できる。',
  errors:[],
  quiz:[
    {q:'ウォーターフォール開発で「テスト」フェーズは通常いつ行われますか？', a:'実装フェーズの後。一通り実装が完了してから結合テスト・受入テストを行う。'},
    {q:'アジャイル開発のメリットを2つ挙げてください。', a:'① 要件変更に柔軟に対応できる ② 短いサイクルでリリースできるため早期に価値提供できる。'},
  ],
  miniTask:'「ToDoアプリを1ヶ月で作る」場合、アジャイルでどのようなスプリントを組むか計画を書いてください（1スプリント=1週間×4回）。',
  aiOk:['スクラム開発の具体的な進め方を教えてください','要件定義で大切なことを初心者向けに教えてください'],
  aiNg:[],
  interviewQ:['アジャイル開発とウォーターフォール開発の違いを教えてください。', '現場ではどちらの開発手法が多いですか？'],
  nextLesson: null
}

}; // end LESSON_P01