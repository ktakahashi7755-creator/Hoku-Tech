/* =========================================================
   data/lesson-p00.js  ─  Phase 0「事前準備・PC基礎」
   全レッスンの詳細コンテンツ
   ========================================================= */
window.LESSON_P00 = {

/* ===========================
   Chapter 0-1：コンピュータとファイルの基礎
   =========================== */
'l00-1-1': {
  id:'l00-1-1', chapter:'c00-1', num:'0-1-1',
  title:'ファイルとフォルダを理解する',
  duration:'20分',
  goal:'ファイルとフォルダの概念、絶対パスと相対パスを理解し、自分のPCのフォルダ構成をターミナルで確認できる。',
  why:'プログラミングはすべて「どのファイルがどこにあるか」を指定して動く。パスの概念を理解していないと、コードを書いても「ファイルが見つからない」エラーで詰まり続ける。',
  fieldUse:'現場では毎日ファイルパスを扱う。ログファイルの場所、設定ファイルの場所、画像の保存先など。パスを間違えると本番でエラーになる。',
  analogy:'ファイルは「書類」、フォルダは「引き出し」。あなたの家（Cドライブ or /Users/あなた）の中に、リビング（Desktop）・書斎（Documents）などの引き出しがあり、その中に書類が入っている。パスとは「どの引き出しのどの書類か」を示す住所のこと。',
  terms:[
    {term:'ファイル', meaning:'データが保存された1つのまとまり。index.html、image.png、main.jsなどが例。'},
    {term:'フォルダ（ディレクトリ）', meaning:'ファイルを入れておく入れ物。Windowsでは「フォルダ」、Linuxでは「ディレクトリ」と呼ぶが同じもの。'},
    {term:'パス', meaning:'ファイルやフォルダの場所を示す文字列。住所のようなもの。'},
    {term:'絶対パス', meaning:'ルート（一番上）から始まる完全な住所。Windowsは C:\\Users\\名前\\Desktop、Macは /Users/名前/Desktop のように始まる。'},
    {term:'相対パス', meaning:'今いる場所（カレントディレクトリ）からの相対的な住所。../は1つ上、./は今いる場所を意味する。'},
    {term:'拡張子', meaning:'ファイル名の最後の「.html」「.js」「.png」などの部分。ファイルの種類を示す。'},
    {term:'カレントディレクトリ', meaning:'今ターミナルが「いる」フォルダ。cdコマンドで移動できる。'}
  ],
  steps:[
    {
      num:1, title:'まずWindowsとMacの違いを知る',
      description:'パスの区切り文字と最上位（ルート）が違う。これを最初に理解しておく。',
      windows:'区切り文字は \\ （バックスラッシュ）。ルートは C:\\ や D:\\ など。例：C:\\Users\\yamada\\Desktop\\work',
      mac:'区切り文字は / （スラッシュ）。ルートは /。例：/Users/yamada/Desktop/work'
    },
    {
      num:2, title:'Windowsのフォルダ構成を確認する',
      description:'エクスプローラーを開いて自分のフォルダ構成を把握する。',
      windows:'Windows キー → 「PC」をクリック → 左のツリーで「Windows (C:)」→「ユーザー」→「自分のユーザー名」の中を確認。デスクトップ・ドキュメント・ダウンロードがある。',
      mac:'Finder → 「移動」メニュー → 「ホーム」をクリック。デスクトップ・書類・ダウンロードがある。'
    },
    {
      num:3, title:'拡張子を表示する設定にする',
      description:'デフォルトでは拡張子が隠れていることがある。プログラミングでは必ず表示する。',
      windows:'エクスプローラーを開く → 上の「表示」タブ → 「ファイル名拡張子」にチェックを入れる',
      mac:'Finder → 上のメニューバー「Finder」→「設定」→「詳細」→「すべてのファイル名拡張子を表示」にチェック'
    }
  ],
  code: null,
  expectedOutput:'エクスプローラー（またはFinder）でファイル名の末尾に .txt .html .png などが表示されている状態。',
  errors:[
    {msg:'拡張子が表示されない', cause:'拡張子の表示設定がオフになっている', fix:'手順3の設定を確認する'},
    {msg:'ユーザーフォルダが見つからない', cause:'Cドライブの場所が違う', fix:'エクスプローラーの左ツリーで「Windows (C:)」→「ユーザー」と辿る'}
  ],
  quiz:[
    {q:'「絶対パス」と「相対パス」の違いを自分の言葉で説明してください。', a:'絶対パスはルート（一番上）からの完全な住所。相対パスは今いる場所からの相対的な住所。'},
    {q:'Windowsのパスで使われる区切り文字は？', a:'\\ （バックスラッシュ）'},
    {q:'.html の「.html」を何と呼ぶ？', a:'拡張子（かくちょうし）'}
  ],
  miniTask:'デスクトップに「work」というフォルダを作り、その中に「memo.txt」というファイルを作成してください（メモ帳などで作成可）。',
  aiOk:['パスの書き方を教えてください（例：Macの場合）','相対パスの例を具体的に見せてください'],
  aiNg:['ファイルを探してください','私のPCのフォルダ構成を教えてください（AIはあなたのPCを見られない）'],
  interviewQ:['相対パスと絶対パスの違いを教えてください', '拡張子とは何ですか？なぜ重要ですか？'],
  nextLesson:'l00-1-2'
},

'l00-1-2': {
  id:'l00-1-2', chapter:'c00-1', num:'0-1-2',
  title:'プログラミングで使うフォルダ構成を覚える',
  duration:'15分',
  goal:'開発プロジェクトの標準的なフォルダ構成を理解し、自分の「作業場所」を決めてフォルダを作れる。',
  why:'プロジェクトのフォルダ構成がバラバラだと、チームでコードを共有したとき「ファイルがどこにあるか分からない」状態になる。最初から整理された構成を習慣づける。',
  fieldUse:'現場では「このプロジェクトのフォルダ構成はどうなっていますか？」と聞かれることがある。標準的な構成を知っておくと、既存コードへの参加もスムーズになる。',
  analogy:'フォルダ構成はキッチンの配置と同じ。冷蔵庫にはご飯、棚には調味料、引き出しには道具を入れるルールを決めないと、毎回「あれどこ？」となる。',
  terms:[
    {term:'プロジェクトルート', meaning:'プロジェクトの一番上のフォルダ。index.html や package.json が置かれる場所。'},
    {term:'src/', meaning:'source（ソース）の略。メインのコードを入れるフォルダ。'},
    {term:'public/', meaning:'公開用の静的ファイル（画像など）を入れるフォルダ。'},
    {term:'assets/', meaning:'画像・CSS・JSなどのリソースファイルを入れるフォルダ。プロジェクトによりpublicと同義。'}
  ],
  steps:[
    {
      num:1, title:'作業用のフォルダを作る',
      description:'ここからすべての開発プロジェクトを作る「ホーム」となるフォルダを用意する。',
      windows:'デスクトップを右クリック → 「新規作成」→「フォルダー」→「dev」と入力してEnter。今後 C:\\Users\\ユーザー名\\Desktop\\dev の中にプロジェクトを作り続ける。',
      mac:'デスクトップで右クリック（またはControl+クリック）→「新規フォルダ」→「dev」と入力してReturn。今後 /Users/ユーザー名/Desktop/dev の中にプロジェクトを作り続ける。'
    },
    {
      num:2, title:'最初のプロジェクトフォルダを作る',
      description:'devフォルダの中に、今回の練習用フォルダを作る。',
      windows:'devフォルダをダブルクリックで開く → 中で右クリック → 「新規作成」→「フォルダー」→「phase00-practice」と入力。',
      mac:'devフォルダをFinder（ファインダー）で開く → Cmd+Shift+N → 「phase00-practice」と入力。'
    },
    {
      num:3, title:'VSCodeで開いてみる（インストール後に再度やる）',
      description:'この手順はVSCodeインストール後（Lesson 0-2-1）に戻って確認してもOK。',
      windows:'phase00-practiceフォルダを右クリック → 「Codeで開く」（VSCode導入後に表示される）',
      mac:'phase00-practiceフォルダをFinder上で選択 → 右クリック → 「"Visual Studio Code"で開く」（VSCode導入後）'
    }
  ],
  code:'/* 標準的なWebプロジェクトのフォルダ構成例 */\nmy-project/          ← プロジェクトルート\n├── index.html       ← メインのHTMLファイル\n├── assets/\n│   ├── css/\n│   │   └── style.css\n│   ├── js/\n│   │   └── main.js\n│   └── img/\n│       └── logo.png\n└── README.md        ← プロジェクトの説明',
  expectedOutput:'Desktop/dev/phase00-practice/ というフォルダが作成されている状態。',
  errors:[],
  quiz:[
    {q:'プロジェクトルートとは何ですか？', a:'プロジェクトの一番上のフォルダ。index.html や設定ファイルが置かれる場所。'},
    {q:'assets/img/ フォルダには何を入れますか？', a:'画像ファイル（.png .jpg .svg など）'}
  ],
  miniTask:'dev/phase00-practice/ の中に index.html というファイルを作成してください。内容は「こんにちは」の1行だけでOKです（メモ帳などで作成可）。',
  aiOk:['Webプロジェクトの一般的なフォルダ構成を教えてください', 'Reactプロジェクトのフォルダ構成はどうなりますか？'],
  aiNg:['私のプロジェクトのフォルダを整理してください'],
  interviewQ:['プロジェクトのフォルダ構成はどうしていますか？'],
  nextLesson:'l00-1-3'
},

'l00-1-3': {
  id:'l00-1-3', chapter:'c00-1', num:'0-1-3',
  title:'テキストエディタ vs IDE vs ターミナルとは何か',
  duration:'10分',
  goal:'テキストエディタ・IDE・ターミナルの役割の違いを理解し、なぜVSCodeを使うのかを説明できる。',
  why:'道具の用途を知らないと、適切に使えない。プログラミングの作業環境を構成するツールの役割分担を最初に整理しておくと、学習がスムーズになる。',
  fieldUse:'現場では「エディタは何を使っていますか？」と聞かれることがある。VSCodeが主流だが、IntelliJ（Java）・PyCharm（Python）など言語特化のIDEを使う現場もある。',
  analogy:'テキストエディタはメモ帳、IDEは「自動補完・エラーチェック・実行ボタン付き」の高機能メモ帳。ターミナルはPCに直接指示を出す「コマンドセンター」。',
  terms:[
    {term:'テキストエディタ', meaning:'コードを書くための軽量なツール。VSCode・Sublime Text・Atomなどが代表例。'},
    {term:'IDE（統合開発環境）', meaning:'Integrated Development Environment。コード補完・デバッグ・実行機能がすべて入った重量級ツール。IntelliJ IDEA・Eclipse など。'},
    {term:'ターミナル（コマンドライン）', meaning:'文字（コマンド）でPCに命令を出すツール。GUIでは操作できない作業ができる。MacはTerminal.app、Windowsはコマンドプロンプト・PowerShell・Git Bash等。'},
    {term:'VSCode', meaning:'Visual Studio Code。Microsoftが無料公開。軽量だが拡張機能で重量IDEに近い機能を持てる。現在のWeb開発で最もよく使われるエディタ。'}
  ],
  steps:[],
  code: null,
  expectedOutput: 'この Lesson に実際の作業はない。次の Lesson でVSCodeをインストールする。',
  errors:[],
  quiz:[
    {q:'VSCodeはテキストエディタとIDEのどちらに近いですか？', a:'どちらでもある。基本はテキストエディタだが拡張機能でIDEに近づけられる。'},
    {q:'ターミナルを使う理由を一言で言うと？', a:'GUIでは操作できない作業（コマンド・スクリプト実行）ができるから。'}
  ],
  miniTask: '次のLessonに進む前に、「VSCode・IDE・ターミナルの違い」を自分の言葉でノート（または日報）に書いてください。',
  aiOk:['IDEとテキストエディタの違いを初心者向けに説明してください'],
  aiNg:[],
  interviewQ:['普段どのエディタを使っていますか？その理由は？'],
  nextLesson:'l00-2-1'
},

/* ===========================
   Chapter 0-2：VSCodeのセットアップ
   =========================== */
'l00-2-1': {
  id:'l00-2-1', chapter:'c00-2', num:'0-2-1',
  title:'VSCodeをインストールして日本語化する',
  duration:'20分',
  goal:'VSCodeをインストールし、日本語化拡張機能を入れて、フォルダを開いてコードを書けるようにする。',
  why:'VSCodeは今後すべてのPhaseで使い続ける最重要ツール。最初に正しくセットアップしないと、毎回手間がかかる。',
  fieldUse:'現場の新入社員がまず最初にやるのが環境構築。VSCodeの設定をこなせると「自走できる人材」として評価が上がる。',
  analogy:'VSCodeはあなたの「デジタル作業机」。机を整理整頓してから仕事を始めるのと同じように、エディタも最初にしっかりセットアップする。',
  terms:[
    {term:'拡張機能（Extension）', meaning:'VSCodeに追加できる機能パッケージ。日本語化・コード補完・Lintなどを追加できる。'},
    {term:'コマンドパレット', meaning:'Ctrl+Shift+P（Mac: Cmd+Shift+P）で開くVSCodeの万能メニュー。コマンドを文字検索できる。'},
    {term:'ワークスペース', meaning:'VSCodeで開いているフォルダのこと。一度開いておくと次回も自動で開ける。'}
  ],
  steps:[
    {
      num:1, title:'VSCodeをダウンロードする',
      description:'公式サイトから自分のOSに合ったバージョンをダウンロードする。',
      windows:'ブラウザで「VSCode ダウンロード」と検索 → code.visualstudio.com へアクセス → 「Download for Windows」ボタンをクリック → ダウンロードされた .exe ファイルをダブルクリック → 「同意する」にチェック → インストール中に「PATHへの追加」オプションが出たら必ずチェックを入れる → インストール完了',
      mac:'ブラウザで「VSCode ダウンロード」と検索 → code.visualstudio.com へアクセス → 「Download for Mac」ボタンをクリック → ダウンロードされた .zip ファイルをダブルクリック → 展開されて出てきた「Visual Studio Code.app」をアプリケーションフォルダへドラッグ&ドロップ'
    },
    {
      num:2, title:'VSCodeを起動する',
      description:'インストール完了後、VSCodeを起動する。',
      windows:'デスクトップのVSCodeアイコンをダブルクリック、またはスタートメニューで「Visual Studio Code」を検索して起動。',
      mac:'アプリケーションフォルダから「Visual Studio Code」をダブルクリック、またはSpotlight（Cmd+Space）で「code」と入力して起動。'
    },
    {
      num:3, title:'日本語拡張機能をインストールする',
      description:'日本語UIにする。',
      windows:'VSCode左側のアイコン一覧から「拡張機能」アイコン（四角が4つ並んだもの）をクリック → 検索ボックスに「Japanese Language Pack」と入力 → 「Japanese Language Pack for Visual Studio Code」（Microsoft製）の「Install」をクリック → インストール後に「Change Language and Restart」ボタンが出たらクリック',
      mac:'同上。WindowsとMacで手順は同じ。'
    },
    {
      num:4, title:'フォルダを開く',
      description:'先ほど作ったphase00-practiceフォルダをVSCodeで開く。',
      windows:'VSCode上部メニュー「ファイル」→「フォルダーを開く」→ Desktop/dev/phase00-practice を選んで「フォルダーの選択」をクリック。',
      mac:'VSCode上部メニュー「ファイル」→「フォルダーを開く」→ Desktop/dev/phase00-practice を選んで「開く」をクリック。'
    },
    {
      num:5, title:'ターミナルを開く（VSCode内蔵）',
      description:'VSCode内にターミナルを開く。これでエディタとターミナルを行き来しなくて済む。',
      windows:'上部メニュー「ターミナル」→「新しいターミナル」をクリック。下部にターミナルが開く。Windows では PowerShell が起動することが多い。',
      mac:'上部メニュー「ターミナル」→「新しいターミナル」をクリック。下部にターミナルが開く。Macでは bash または zsh が起動する。'
    }
  ],
  code: null,
  expectedOutput:'VSCodeが日本語UIで起動し、下部にターミナルが表示されている状態。ターミナルに現在のフォルダパスが表示されている。',
  errors:[
    {msg:'「codeコマンドが見つかりません」エラーが出る', cause:'Windowsで「PATHへの追加」を忘れた、またはMacでPATH設定が未完了',
     fix:'Windowsは再インストール時に「PATHへの追加」にチェック。MacはVSCodeのコマンドパレット(Cmd+Shift+P)で「Shell Command: Install \'code\' command in PATH」を実行。'},
    {msg:'再起動後も英語UIのまま', cause:'再起動が完了していない', fix:'VSCodeを完全に終了（タスクバーから右クリックで終了）して再度起動する。'},
    {msg:'拡張機能が検索できない', cause:'インターネット接続なし or プロキシ設定が必要', fix:'インターネット接続を確認。社内ネットワークの場合はプロキシ設定が必要な場合がある。'}
  ],
  quiz:[
    {q:'コマンドパレットを開くショートカットキーは？', a:'Ctrl+Shift+P（Mac: Cmd+Shift+P）'},
    {q:'VSCode内蔵ターミナルを開くメニューは？', a:'上部「ターミナル」→「新しいターミナル」'}
  ],
  miniTask:'VSCodeで index.html を開き「こんにちは、VSCode！」と入力して保存（Ctrl+S / Cmd+S）してください。',
  aiOk:['VSCodeで〇〇するにはどうすればいいですか','このVSCodeのエラーは何ですか：[エラー文をコピー]'],
  aiNg:['VSCodeを代わりに設定してください（AIはあなたのPCを操作できない）'],
  interviewQ:['開発環境はどう構築しましたか？'],
  nextLesson:'l00-2-2'
},

'l00-2-2': {
  id:'l00-2-2', chapter:'c00-2', num:'0-2-2',
  title:'おすすめの拡張機能を入れる',
  duration:'20分',
  goal:'開発を快適にする必須の拡張機能を5つ以上インストールし、それぞれの用途を説明できる。',
  why:'拡張機能なしのVSCodeは素のメモ帳に近い。適切な拡張機能を入れることで、コードの色分け・補完・エラー検出が自動化され、学習効率が3倍以上上がる。',
  fieldUse:'現場では「設定を共有する」ために .vscode/extensions.json という設定ファイルにおすすめ拡張機能一覧を書いておく習慣がある。',
  analogy:'拡張機能は「机の便利グッズ」。ペン立て・電卓・メモ帳ホルダーを置くことで作業効率が上がるのと同じ。',
  terms:[
    {term:'Lint（リント）', meaning:'コードの文法ミスやスタイル違反を自動検出するツール。ESLintが有名。'},
    {term:'フォーマッター', meaning:'コードを自動整形するツール。Prettierが有名。インデントやクオートを統一する。'},
    {term:'Live Server', meaning:'ファイルを保存するたびにブラウザを自動リロードする拡張機能。HTML/CSSの確認が楽になる。'}
  ],
  steps:[
    {
      num:1, title:'拡張機能の入れ方を確認する',
      description:'左サイドバーの拡張機能アイコン（四角4つ）をクリック → 検索ボックスに名前を入力 → Installをクリック。',
      windows:'全OS共通の手順。',
      mac:'全OS共通の手順。'
    },
    {
      num:2, title:'以下の拡張機能をインストールする',
      description:'順番にインストールする。英語名で検索するのがコツ。',
      windows:'1. Japanese Language Pack for Visual Studio Code（日本語化）\n   → 検索：「Japanese Language Pack」\n\n2. Live Server（HTMLをブラウザでリアルタイム確認）\n   → 検索：「Live Server」 作者：Ritwick Dey\n\n3. Prettier - Code formatter（コードを自動整形）\n   → 検索：「Prettier」 作者：Prettier\n\n4. Auto Rename Tag（HTMLのタグ名変更を自動で対応）\n   → 検索：「Auto Rename Tag」\n\n5. Bracket Pair Colorizer（カッコを色分けして対応を分かりやすく）\n   → VSCode最新版は内蔵機能になったため不要な場合あり\n\n6. ESLint（JavaScriptの文法チェック）\n   → 検索：「ESLint」 作者：Microsoft\n\n7. vscode-icons（ファイルアイコンを見やすくする）\n   → 検索：「vscode-icons」',
      mac:'同上。WindowsとMacで手順は同じ。'
    },
    {
      num:3, title:'Prettierをデフォルトフォーマッターに設定する',
      description:'保存時にPrettierが自動整形されるようにする。',
      windows:'コマンドパレット（Ctrl+Shift+P）→「Open User Settings (JSON)」と入力→ 開いたsettings.jsonに以下を追記：\n\n{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode"\n}',
      mac:'コマンドパレット（Cmd+Shift+P）→「Open User Settings (JSON)」→ 同じJSONを追記。'
    }
  ],
  code:'// settings.json に追加する設定（Prettierを自動整形に設定）\n{\n  "editor.formatOnSave": true,\n  "editor.defaultFormatter": "esbenp.prettier-vscode",\n  "editor.tabSize": 2,\n  "editor.wordWrap": "on"\n}',
  expectedOutput:'VSCodeのサイドバーに各拡張機能が並んでいる。HTMLファイルを右クリックすると「Open with Live Server」が表示される。',
  errors:[
    {msg:'Live Serverが出ない', cause:'Live Serverのインストールが未完了', fix:'拡張機能一覧でLive Serverを確認。インストールボタンが押せているか確認する。'},
    {msg:'settings.jsonが開けない', cause:'コマンドパレットの入力が間違っている', fix:'「Open User Settings (JSON)」とタイプしてサジェストから選ぶ。'}
  ],
  quiz:[
    {q:'Live Serverはどんな拡張機能ですか？', a:'HTMLを保存するとブラウザが自動リロードされる拡張機能。'},
    {q:'Prettierは何のためのツールですか？', a:'コードを自動整形するフォーマッター。インデントやクオートを統一する。'}
  ],
  miniTask:'index.htmlを開いてLive Serverで起動してみる（右クリック→「Open with Live Server」）。ブラウザが開いて中身が表示されれば成功。',
  aiOk:['VSCodeの拡張機能〇〇の使い方を教えてください'],
  aiNg:[],
  interviewQ:['VSCodeでどんな拡張機能を使っていますか？'],
  nextLesson:'l00-2-3'
},

'l00-2-3': {
  id:'l00-2-3', chapter:'c00-2', num:'0-2-3',
  title:'VSCodeのショートカットキーを覚える',
  duration:'15分',
  goal:'開発で頻繁に使う10個以上のショートカットキーを覚え、マウスなしで基本操作ができる。',
  why:'プログラミングのスピードはタイピング速度よりもショートカット活用に大きく左右される。1日に同じ操作を100回する作業が、ショートカットで10秒→0.5秒になる。',
  fieldUse:'現場のエンジニアはほぼショートカットだけで操作する。マウスで操作していると「遅い」と感じられることがある。',
  analogy:'ショートカットキーは料理人の包丁さばき。慣れるまでは意識的に使う必要があるが、習慣になれば無意識にできるようになる。',
  terms:[],
  steps:[
    {
      num:1, title:'最重要ショートカットキー一覧',
      description:'以下を練習する。Windowsは Ctrl、MacはCmdを使うのが基本の違い。',
      windows:'■ ファイル操作\nCtrl+S         → 保存\nCtrl+Z         → 元に戻す\nCtrl+Y         → やり直し\nCtrl+C         → コピー\nCtrl+V         → 貼り付け\nCtrl+X         → 切り取り\n\n■ 検索・置換\nCtrl+F         → ファイル内検索\nCtrl+H         → 検索して置換\nCtrl+Shift+F   → フォルダ内全検索\n\n■ コード編集\nCtrl+/         → コメントアウト（選択中の行）\nAlt+↑/↓       → 行を上下に移動\nCtrl+D         → 同じ単語を次々選択（マルチカーソル）\nCtrl+Shift+K   → 行を削除\n\n■ 表示\nCtrl+Shift+P   → コマンドパレット\nCtrl+`         → ターミナル開閉\nCtrl+B         → サイドバー開閉\nCtrl+Shift+E   → エクスプローラーに移動',
      mac:'■ ファイル操作\nCmd+S          → 保存\nCmd+Z          → 元に戻す\nCmd+Shift+Z    → やり直し\nCmd+C          → コピー\nCmd+V          → 貼り付け\nCmd+X          → 切り取り\n\n■ 検索・置換\nCmd+F          → ファイル内検索\nCmd+H          → 検索して置換\nCmd+Shift+F    → フォルダ内全検索\n\n■ コード編集\nCmd+/          → コメントアウト\nOption+↑/↓    → 行を上下に移動\nCmd+D          → 同じ単語を次々選択\nCmd+Shift+K    → 行を削除\n\n■ 表示\nCmd+Shift+P    → コマンドパレット\nCtrl+`         → ターミナル開閉\nCmd+B          → サイドバー開閉\nCmd+Shift+E    → エクスプローラー'
    }
  ],
  code: null,
  expectedOutput: 'ショートカット練習完了。意識しなくても使えるようになるまで1週間ほど使い続ける。',
  errors:[],
  quiz:[
    {q:'コマンドパレットを開くショートカットは？（Windows）', a:'Ctrl+Shift+P'},
    {q:'複数の同じ単語を一度に選択するショートカットは？', a:'Ctrl+D（Mac: Cmd+D）'},
    {q:'行をコメントアウトするショートカットは？', a:'Ctrl+/（Mac: Cmd+/）'}
  ],
  miniTask:'index.htmlに10行のHTMLを書き、Ctrl+/（Cmd+/）でコメントアウト→解除を試してみる。',
  aiOk:['VSCodeで〇〇するショートカットはありますか？'],
  aiNg:[],
  interviewQ:[],
  nextLesson:'l00-3-1'
},

/* ===========================
   Chapter 0-3：ターミナルの基本操作
   =========================== */
'l00-3-1': {
  id:'l00-3-1', chapter:'c00-3', num:'0-3-1',
  title:'ターミナルを開いてみる',
  duration:'15分',
  goal:'WindowsとMacそれぞれでターミナルを開き、プロンプトが表示されている状態にできる。現在地（pwd）を確認できる。',
  why:'プログラミングのほとんどの作業はターミナルで行う。ターミナルを「怖いもの」から「便利な道具」に変えるのが最初の目標。',
  fieldUse:'現場ではターミナルを常時開いている。サーバー操作・パッケージインストール・Git操作・ビルドコマンドは全てターミナルで行う。',
  analogy:'ターミナルはPCへの「話しかけ」。GUIがPCとのジェスチャー会話なら、ターミナルは言葉での会話。慣れれば言葉の方が速い。',
  terms:[
    {term:'プロンプト', meaning:'ターミナルでコマンド入力を待っている状態を示す記号。Windowsは「>」、Macは「$」または「%」が表示される。'},
    {term:'コマンド', meaning:'ターミナルに打ち込む命令文。例：ls、cd、mkdir など。'},
    {term:'Shell（シェル）', meaning:'ターミナルの中で動いているコマンド処理プログラム。MacはZsh（またはBash）、WindowsはPowerShellやCmd。'},
    {term:'pwd', meaning:'Print Working Directoryの略。今いるフォルダのパスを表示するコマンド。'}
  ],
  steps:[
    {
      num:1, title:'ターミナルを開く',
      description:'OSごとにターミナルの開き方が違う。',
      windows:'以下の3種類がある。プログラミングでは Git Bash または PowerShell を使う。\n\n方法1（コマンドプロンプト）:\nスタートメニュー → 「cmd」と検索 → 「コマンドプロンプト」を起動\n\n方法2（PowerShell）:\nスタートメニュー → 「powershell」と検索 → 「Windows PowerShell」を起動\n\n方法3（Git Bash）← おすすめ:\nGitをインストール後（Lesson 0-5）に利用可能。\nスタートメニュー → 「git bash」と検索 → 起動',
      mac:'以下の2種類がある。どちらもOK。\n\n方法1（Terminal.app）:\nSpotlight（Cmd+Space）→「ターミナル」と入力 → Enter\n\n方法2（Finder経由）:\nFinder → アプリケーション → ユーティリティ → ターミナル'
    },
    {
      num:2, title:'プロンプトを確認する',
      description:'ターミナルが開くと、入力待ちの記号（プロンプト）が表示される。',
      windows:'PowerShellでは「PS C:\\Users\\ユーザー名>」のように表示される。この「>」の右でコマンドを入力する。',
      mac:'「ユーザー名@コンピュータ名 ～ %」または「$ 」のように表示される。'
    },
    {
      num:3, title:'現在地を確認する（pwd）',
      description:'今自分がどのフォルダにいるかを確認する。',
      windows:'PowerShellに「pwd」と入力してEnterを押す。パスが表示される。',
      mac:'ターミナルに「pwd」と入力してEnterを押す。「/Users/ユーザー名」などが表示される。'
    },
    {
      num:4, title:'VSCodeのターミナルを使う（推奨）',
      description:'VSCodeの内蔵ターミナルはプロジェクトフォルダに自動的に移動していて便利。',
      windows:'VSCodeを開いてフォルダを開く → Ctrl+` （バッククォート）でターミナルを開く → 現在のフォルダが表示される',
      mac:'VSCodeを開いてフォルダを開く → Ctrl+` でターミナルを開く'
    }
  ],
  code:'# 現在地を確認するコマンド\npwd\n\n# Windowsでの出力例\nC:\\Users\\yamada\\Desktop\\dev\\phase00-practice\n\n# Macでの出力例\n/Users/yamada/Desktop/dev/phase00-practice',
  expectedOutput:'ターミナルが開き、pwdコマンドを入力すると現在のフォルダパスが表示される状態。',
  errors:[
    {msg:'PowerShellでスクリプトの実行が無効と言われる', cause:'Windowsのセキュリティポリシー設定', fix:'PowerShellを「管理者として実行」→ Set-ExecutionPolicy RemoteSigned と入力してEnterを押す → Yを入力'},
    {msg:'ターミナルが文字化けする', cause:'文字コード設定がUTF-8になっていない', fix:'WindowsのPowerShellは比較的文字化けが起きにくい。Git Bashを使うと改善することが多い。'}
  ],
  quiz:[
    {q:'現在のフォルダを表示するコマンドは？', a:'pwd'},
    {q:'プロンプトとは何ですか？', a:'ターミナルがコマンド入力待ち状態であることを示す記号（> や $ など）'}
  ],
  miniTask:'ターミナルを開いてpwdコマンドを実行し、どのフォルダにいるかを確認してください。その結果をノートに書いてください。',
  aiOk:['このエラーメッセージの意味を教えてください：[エラーをコピー]'],
  aiNg:[],
  interviewQ:['普段どのターミナルを使っていますか？'],
  nextLesson:'l00-3-2'
},

'l00-3-2': {
  id:'l00-3-2', chapter:'c00-3', num:'0-3-2',
  title:'フォルダを移動する（cd・ls・mkdir）',
  duration:'25分',
  goal:'cd・ls（dir）・mkdir・touchコマンドを使ってフォルダの作成・移動・ファイル確認ができる。',
  why:'ターミナルの最重要操作がフォルダ移動とファイル確認。これをマスターすれば、npm install や git init など全てのコマンドをターミナルで実行できるようになる。',
  fieldUse:'現場でのサーバー作業はGUIが使えないことが多く、ターミナルのみで操作する。ファイルを間違ったフォルダで実行すると、「ファイルが見つからない」エラーが出る。',
  analogy:'cdは「部屋移動」、lsは「部屋の中を確認」、mkdirは「新しい部屋を作る」、touchは「新しい書類を作る」。',
  terms:[
    {term:'cd', meaning:'Change Directoryの略。フォルダを移動するコマンド。'},
    {term:'ls', meaning:'ファイルとフォルダの一覧を表示するコマンド（Mac/Linux）。Windowsのコマンドプロンプトではdir。PowerShellとGit Bashはlsが使える。'},
    {term:'mkdir', meaning:'Make Directoryの略。新しいフォルダを作るコマンド。'},
    {term:'touch', meaning:'新しい空のファイルを作るコマンド（Mac/Linux）。WindowsはNew-Item（PowerShell）またはecho.（cmd）。Git Bashはtouchが使える。'},
    {term:'.（ドット）', meaning:'カレントディレクトリ（今いるフォルダ）を意味する。'},
    {term:'..（ドット2つ）', meaning:'1つ上のフォルダ（親ディレクトリ）を意味する。cd ..で1つ上に移動できる。'},
    {term:'~（チルダ）', meaning:'ホームディレクトリを意味する。Macでは/Users/ユーザー名、Windowsでは C:\\Users\\ユーザー名。'}
  ],
  steps:[
    {
      num:1, title:'現在のフォルダの中身を確認する（ls）',
      description:'どんなファイルやフォルダがあるかを確認する。',
      windows:'# PowerShellまたはGit Bashで実行\nls\n\n# または（コマンドプロンプトの場合）\ndir',
      mac:'# ターミナルで実行\nls\n\n# 詳細情報付きで表示（サイズ・更新日など）\nls -la'
    },
    {
      num:2, title:'フォルダに移動する（cd）',
      description:'devフォルダ→phase00-practiceへ移動する練習。',
      windows:'# Desktop（デスクトップ）に移動\ncd Desktop\n\n# devフォルダへ移動\ncd dev\n\n# phase00-practiceへ移動\ncd phase00-practice\n\n# または一度に全部指定\ncd Desktop/dev/phase00-practice\n\n# 1つ上のフォルダへ戻る\ncd ..\n\n# ホームフォルダへ戻る\ncd ~',
      mac:'# Desktop（デスクトップ）に移動\ncd Desktop\n\n# devフォルダへ移動\ncd dev\n\n# phase00-practiceへ移動\ncd phase00-practice\n\n# または一度に全部指定\ncd Desktop/dev/phase00-practice\n\n# 1つ上のフォルダへ戻る\ncd ..\n\n# ホームフォルダへ戻る\ncd ~'
    },
    {
      num:3, title:'新しいフォルダを作る（mkdir）',
      description:'練習用のフォルダを作成する。',
      windows:'# 現在いるフォルダの中に「test」フォルダを作る\nmkdir test\n\n# 確認（testフォルダが表示されればOK）\nls',
      mac:'# 現在いるフォルダの中に「test」フォルダを作る\nmkdir test\n\n# 確認\nls'
    },
    {
      num:4, title:'新しいファイルを作る（touch / New-Item）',
      description:'空のファイルを作成する。',
      windows:'# Git Bashまたは最新のPowerShellの場合\ntouch index.html\n\n# PowerShell（古いバージョン）の場合\nNew-Item index.html\n\n# 確認\nls',
      mac:'# ターミナルで実行\ntouch index.html\n\n# 確認\nls'
    },
    {
      num:5, title:'Tab補完を使う（超重要）',
      description:'フォルダ名やファイル名を途中まで打ってTabを押すと自動補完される。',
      windows:'「cd Des」まで入力してTabを押す → 「cd Desktop」と補完される。Tabを複数回押すと候補が切り替わる。',
      mac:'同上。Tabで補完、候補が複数ある場合はTabを2回押すと一覧が表示される。'
    }
  ],
  code:'# ターミナルでの基本操作まとめ\n# ─────────────────────────────────────\n# 現在地の確認\npwd\n\n# フォルダ一覧の表示\nls          # Mac/Linux/Git Bash\ndir         # Windowsコマンドプロンプト\n\n# フォルダへ移動\ncd フォルダ名\ncd ..       # 1つ上へ\ncd ~        # ホームへ\n\n# フォルダを作成\nmkdir フォルダ名\n\n# ファイルを作成\ntouch ファイル名   # Mac/Linux/Git Bash\nNew-Item ファイル名  # Windows PowerShell\n\n# ─────────────────────────────────────\n# 実際の練習例\n# 1. phase00-practiceフォルダに移動\ncd ~/Desktop/dev/phase00-practice\n\n# 2. 中身を確認\nls\n\n# 3. srcフォルダを作成\nmkdir src\n\n# 4. srcの中にmain.jsを作成\ncd src\ntouch main.js\n\n# 5. 確認\nls  # → main.js が表示されればOK',
  expectedOutput:'$ pwd\n/Users/yamada/Desktop/dev/phase00-practice\n$ ls\nindex.html\n$ mkdir src\n$ cd src\n$ touch main.js\n$ ls\nmain.js',
  errors:[
    {msg:'bash: cd: Desktop: No such file or directory', cause:'現在地がホームフォルダではない。またはフォルダ名のスペル間違い', fix:'まずcd ~でホームに戻ってからcd Desktopと入力。フォルダ名は大文字小文字を区別する。'},
    {msg:'mkdir: cannot create directory \'test\': File exists', cause:'同名のフォルダがすでにある', fix:'ls で確認してから mkdir する。別の名前にするか、既存フォルダを使う。'},
    {msg:'touch: command not found（Windows）', cause:'touchコマンドはMac/Linux用。WindowsのコマンドプロンプトはNew-Item', fix:'Git Bashを使う。またはPowerShellで New-Item index.html と入力する。'}
  ],
  quiz:[
    {q:'1つ上のフォルダに移動するコマンドは？', a:'cd ..'},
    {q:'現在のフォルダの中身を表示するコマンドは？（Mac/Linux）', a:'ls'},
    {q:'「..」は何を意味しますか？', a:'1つ上の親ディレクトリ'}
  ],
  miniTask:'以下の操作をターミナルでやってみてください：\n1. ~/Desktop/dev/ へ移動\n2. ls でフォルダ一覧を確認\n3. mkdir phase00-terminal というフォルダを作る\n4. cd phase00-terminal で移動\n5. touch hello.txt でファイルを作る\n6. ls で確認する（hello.txtが表示されればOK）',
  aiOk:['このターミナルのエラーメッセージを説明してください：[メッセージ]','cdとls以外によく使うターミナルコマンドは何ですか？'],
  aiNg:['代わりにコマンドを実行してください（AIはあなたのPCを操作できない）'],
  interviewQ:['ターミナルでよく使うコマンドを教えてください'],
  nextLesson:'l00-3-3'
},

'l00-3-3': {
  id:'l00-3-3', chapter:'c00-3', num:'0-3-3',
  title:'ファイルを操作するコマンド（cp・mv・rm）',
  duration:'20分',
  goal:'cp・mv・rmコマンドでファイルのコピー・移動・削除ができる。rmの危険性を理解し、使う前に必ず確認する習慣がつく。',
  why:'開発中にファイルのコピー・移動・削除が必要になる場面は多い。GUIでもできるが、ターミナルでやれると速く、自動化もできる。',
  fieldUse:'本番サーバーではGUIが使えないため、ファイル操作はすべてターミナルで行う。rm -rfの誤操作で大切なファイルを失うのは現場でもある事故。',
  analogy:'cp は「コピーして貼り付け」、mv は「切り取って貼り付け」、rm は「削除」。ゴミ箱がないため、rm は即座に消える。',
  terms:[
    {term:'cp', meaning:'ファイルやフォルダをコピーするコマンド。'},
    {term:'mv', meaning:'ファイルやフォルダを移動するコマンド。ファイル名の変更にも使える。'},
    {term:'rm', meaning:'ファイルを削除するコマンド。ゴミ箱を経由しない。一度削除したファイルは基本的に元に戻せない。'},
    {term:'-r（オプション）', meaning:'再帰的（recursive）にフォルダごと処理する。rm -rでフォルダを削除できる。'},
    {term:'-f（オプション）', meaning:'強制（force）実行。確認なしで実行する。rm -rfは「強制的にフォルダごと全削除」。危険なので必ず確認する。'}
  ],
  steps:[
    {
      num:1, title:'ファイルをコピーする（cp）',
      description:'元ファイルはそのまま残って、コピー先にも同じ内容のファイルが作られる。',
      windows:'# hello.txtをhello-backup.txtとしてコピー\ncp hello.txt hello-backup.txt\n\n# Windowsコマンドプロンプトの場合はcopyコマンドを使う\ncopy hello.txt hello-backup.txt',
      mac:'# hello.txtをhello-backup.txtとしてコピー\ncp hello.txt hello-backup.txt\n\n# 確認\nls  # hello.txt と hello-backup.txt の両方が表示されればOK'
    },
    {
      num:2, title:'ファイルを移動・名前変更する（mv）',
      description:'別フォルダに移動するか、同じフォルダ内でmvを使うとファイル名の変更になる。',
      windows:'# ファイル名を変更（hello.txtをworld.txtにリネーム）\nmv hello.txt world.txt\n\n# 別フォルダへ移動\nmv world.txt ../world.txt  # 1つ上のフォルダへ移動',
      mac:'# ファイル名を変更\nmv hello.txt world.txt\n\n# 別フォルダへ移動\nmv world.txt ../world.txt'
    },
    {
      num:3, title:'ファイルを削除する（rm）',
      description:'注意：ゴミ箱に入らず即削除される。必ず確認してから実行。',
      windows:'# ファイルを削除（確認あり）\nrm hello-backup.txt\n\n# フォルダを中身ごと削除（最大注意）\n# rm -rf フォルダ名\n# ← 絶対に対象を確認してから実行！',
      mac:'# ファイルを削除\nrm hello-backup.txt\n\n# フォルダを中身ごと削除（最大注意）\n# rm -rf フォルダ名'
    }
  ],
  code:'# ファイル操作コマンドまとめ\n# ─────────────────────────────────────\n# コピー\ncp 元ファイル 新ファイル\n\n# 移動・名前変更\nmv 元ファイル 先ファイル（またはフォルダ）\n\n# ファイル削除（ゴミ箱なし・元に戻せない）\nrm ファイル名\n\n# フォルダを中身ごと削除（最大注意！）\nrm -rf フォルダ名\n\n# ─────────────────────────────────────\n# ⚠ 禁止コマンド（絶対に打ってはいけない）\n# rm -rf /           ← システム全体削除\n# rm -rf ~            ← ホームフォルダ全削除\n# rm -rf *            ← カレントフォルダ全削除',
  expectedOutput:'コピー・移動・削除が完了し、lsで意図したとおりファイルが存在している（または消えている）状態。',
  errors:[
    {msg:'rm: フォルダ名: is a directory', cause:'フォルダをrmで削除しようとした。フォルダにはrm -rが必要', fix:'rm -r フォルダ名 または rm -rf フォルダ名（内容を確認してから実行）'},
    {msg:'mv: cannot stat \'hello.txt\': No such file or directory', cause:'ファイル名のスペル間違い。またはそのフォルダにファイルが存在しない', fix:'lsでファイル名を確認してから実行する'}
  ],
  quiz:[
    {q:'ファイル名を変更するコマンドは？', a:'mv（例：mv 旧名前 新名前）'},
    {q:'rm -rf が危険な理由は？', a:'ゴミ箱を経由せず即削除され、元に戻せないから。フォルダを中身ごと削除できる。'},
    {q:'ファイルをコピーして元ファイルも残したい場合は？', a:'cp（例：cp 元ファイル コピー先ファイル）'}
  ],
  miniTask:'練習：\n1. touch practice.txt でファイルを作る\n2. cp practice.txt practice-copy.txt でコピーする\n3. ls で2つのファイルを確認する\n4. mv practice-copy.txt practice-renamed.txt でリネームする\n5. ls で確認する\n6. rm practice.txt で元ファイルを削除する\n7. ls で確認する（practice-renamed.txtだけ残ればOK）',
  aiOk:['このrmコマンドは何をしますか：[コマンド内容]'],
  aiNg:['私のPCのファイルを削除してください（AIはあなたのPCを操作できない）'],
  interviewQ:['サーバー上のファイル操作はどうやりますか？'],
  nextLesson:'l00-3-4'
},

'l00-3-4': {
  id:'l00-3-4', chapter:'c00-3', num:'0-3-4',
  title:'コマンドを組み合わせる・よく使うコマンド集',
  duration:'15分',
  goal:'コマンド履歴（↑キー）・catでファイル中身確認・echo・grepの基本が使える。',
  why:'ターミナルは組み合わせることで強力になる。単純なコマンドを覚えるより「コマンドの調べ方」を身につける。',
  fieldUse:'現場ではgrep でログファイルからエラーを探したり、catで設定ファイルを確認したりする。',
  analogy:'コマンドは道具。それぞれを組み合わせることで作業を効率化できる。',
  terms:[
    {term:'cat', meaning:'ファイルの中身を表示するコマンド（Concatenateの略）。'},
    {term:'echo', meaning:'文字列を出力するコマンド。リダイレクト（>）と組み合わせてファイルに書き込める。'},
    {term:'grep', meaning:'ファイル内や出力の中から特定の文字列を検索するコマンド。'},
    {term:'↑キー', meaning:'前に入力したコマンドを呼び出す。何度も同じコマンドを使う時に便利。'},
    {term:'clear', meaning:'ターミナルの表示を消去する。Ctrl+Lでも同じ。'}
  ],
  steps:[
    {
      num:1, title:'よく使うコマンドを練習する',
      description:'以下を順番に実行してみる。',
      windows:'# ファイルの中身を見る\ncat index.html\n\n# ファイルに文字を書き込む\necho "Hello World" > output.txt\ncat output.txt  # → Hello World と表示\n\n# 画面をクリア\nclear  # または Ctrl+L\n\n# コマンド履歴を使う\n# ↑キーを押すと前のコマンドが表示される',
      mac:'同上。'
    },
    {
      num:2, title:'コマンドのヘルプを見る',
      description:'コマンドの使い方が分からない時は --help オプションを使う。',
      windows:'# lsのヘルプを見る\nls --help\n\n# または man コマンド（Mac/Linuxのみ）\n# man ls  ← Macのターミナルで使える（qで終了）',
      mac:'# manコマンドでマニュアルを見る\nman ls  # qで終了\n\n# または --help\nls --help'
    }
  ],
  code:'# よく使うコマンド集\n# ─────────────────────────────────────\ncat ファイル名          # ファイルの中身を表示\necho "テキスト"         # テキストを表示\necho "テキスト" > ファイル  # ファイルに書き込む\nclear                    # 画面クリア（またはCtrl+L）\nhistory                  # コマンド履歴を表示\ngrep "検索文字" ファイル # ファイル内を検索\n# ─────────────────────────────────────\n# 便利なショートカット\n# ↑/↓キー    コマンド履歴を前後に移動\n# Ctrl+C      実行中のコマンドを停止\n# Ctrl+L      画面クリア\n# Tab         コマンド・ファイル名を補完',
  expectedOutput:'catでファイルの中身が表示され、echoで文字が出力されればOK。',
  errors:[
    {msg:'cat: ファイル名: No such file or directory', cause:'ファイルが存在しないフォルダで実行した', fix:'lsでファイル一覧を確認してからcatを実行。cdで正しいフォルダに移動してから実行。'}
  ],
  quiz:[
    {q:'実行中のコマンドを停止するには？', a:'Ctrl+C'},
    {q:'前に実行したコマンドを呼び出すキーは？', a:'↑キー（上矢印キー）'}
  ],
  miniTask:'index.htmlにHTMLを3行書いて保存し、catコマンドで内容を確認してください。',
  aiOk:['ターミナルで〇〇するにはどのコマンドを使いますか？'],
  aiNg:[],
  interviewQ:[],
  nextLesson:'l00-4-1'
},

/* ===========================
   Chapter 0-4：Node.jsのインストール
   =========================== */
'l00-4-1': {
  id:'l00-4-1', chapter:'c00-4', num:'0-4-1',
  title:'Node.jsとnpmとは何か',
  duration:'10分',
  goal:'Node.jsとnpmの役割を説明できる。なぜフロントエンド開発にNode.jsが必要なのかを理解する。',
  why:'ReactもNext.jsも、開発環境の構築にNode.jsが必要。npm（またはnpx）でパッケージをインストールする。Node.jsを知らないと「インストール方法が分からない」で詰まる。',
  fieldUse:'現場でNode.jsを使わない場面はほぼない。npmでライブラリを管理するのは全員が毎日やる。package.jsonを読めないと、既存プロジェクトへの参加が困難になる。',
  analogy:'Node.jsはJavaScriptを「外で」動かすエンジン。ブラウザの中でしか動かなかったJavaScriptを、ターミナル（外の世界）でも動かせるようにした道具。npmは「JavaScript用のAmazon」。必要なライブラリを一覧から選んでインストールできる。',
  terms:[
    {term:'Node.js', meaning:'JavaScriptをブラウザ外（サーバー・ターミナル）で実行できる環境。フロントエンド開発ツールのほとんどがNode.js上で動く。'},
    {term:'npm', meaning:'Node Package Manager。JavaScriptのライブラリ管理ツール。Reactなどのライブラリをインストールするのに使う。'},
    {term:'npx', meaning:'npmと一緒にインストールされるツール。パッケージを一時的にダウンロードして実行できる。create-react-appなどの初期化コマンドに使う。'},
    {term:'package.json', meaning:'プロジェクトの「説明書＋依存ライブラリ一覧」。どのライブラリをどのバージョンで使っているかが書かれている。'},
    {term:'node_modules/', meaning:'npmでインストールされたライブラリが保存されるフォルダ。容量が大きいのでGitでは無視する（.gitignoreに追加）。'},
    {term:'LTS', meaning:'Long Term Support。長期サポート版。安定版なので開発にはLTSを使う。'}
  ],
  steps:[],
  code: null,
  expectedOutput: 'この Lesson に実際の作業はない。次のLessonでインストールする。',
  errors:[],
  quiz:[
    {q:'npmとは何ですか？', a:'Node Package Manager。JavaScriptのライブラリをインストール・管理するツール。'},
    {q:'node_modulesフォルダをGitに含めない理由は？', a:'容量が大きすぎるから。package.jsonがあれば npm install で再現できる。'}
  ],
  miniTask: null,
  aiOk:['Node.jsとDenoの違いを教えてください','npmとyarnの違いを初心者向けに説明してください'],
  aiNg:[],
  interviewQ:['Node.jsとは何か説明してください'],
  nextLesson:'l00-4-2'
},

'l00-4-2': {
  id:'l00-4-2', chapter:'c00-4', num:'0-4-2',
  title:'Node.jsをインストールする（Windows・Mac対応）',
  duration:'25分',
  goal:'Node.jsをインストールし、node --versionとnpm --versionが通る状態にする。',
  why:'Node.jsなしではReact・Next.jsの環境構築ができない。正しいバージョン（LTS）を確実に入れる。',
  fieldUse:'現場では「このプロジェクトはNode.js 18以上で動かしてください」のような指定がある。バージョン管理ツールを使うと切り替えが楽になる。',
  analogy:'Node.jsのインストールはエンジンの取り付け。エンジンがないと車（React等）が走れない。',
  terms:[
    {term:'nvmもしくはvolta', meaning:'Node.jsのバージョン管理ツール。複数のNode.jsバージョンを切り替えて使える。'}
  ],
  steps:[
    {
      num:1, title:'Node.jsをダウンロードする（推奨：公式LTS版）',
      description:'公式サイトからLTS（長期サポート）版をダウンロードする。',
      windows:'ブラウザで「Node.js download」と検索 → nodejs.org/en へアクセス\n→「Download Node.js (LTS)」ボタンをクリック（20.x.x LTSと書かれたもの）\n→ .msiファイルがダウンロードされる\n→ ダウンロードした .msi をダブルクリック\n→「I accept the terms」にチェック → Next → Next\n→「Automatically install the necessary tools」はチェックしなくてOK\n→ Install → Finish',
      mac:'方法1（Homebrewを使う ← おすすめ）:\nターミナルに以下を貼り付けてEnter:\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n\nインストールが完了したら（M1/M2 Macは追加手順あり、インストール後の指示に従う）:\nbrew install node\n\n方法2（公式サイトから）:\nnodejs.org/en → Download Node.js (LTS) → macOS .pkg をダウンロード\n→ .pkgファイルをダブルクリック → 指示に従ってインストール'
    },
    {
      num:2, title:'インストールを確認する',
      description:'インストールが完了したらターミナルを開いてバージョンを確認する。',
      windows:'# ターミナル（PowerShellまたはGit Bash）で実行\nnode --version\n# → v20.x.x などと表示されればOK\n\nnpm --version\n# → 10.x.x などと表示されればOK\n\nnpx --version\n# → 10.x.x などと表示されればOK',
      mac:'# ターミナルで実行\nnode --version\n# → v20.x.x\n\nnpm --version\n# → 10.x.x\n\nnpx --version\n# → 10.x.x'
    },
    {
      num:3, title:'動作確認：Hello Worldを実行する',
      description:'Node.jsでJavaScriptを実行してみる。',
      windows:'# ターミナルで以下を実行\nnode -e "console.log(\'Hello, Node.js!\')"\n# → Hello, Node.js! と表示されればOK',
      mac:'node -e "console.log(\'Hello, Node.js!\')"\n# → Hello, Node.js! と表示されればOK'
    }
  ],
  code:'# インストール確認コマンド\nnode --version  # → v20.x.x\nnpm --version   # → 10.x.x\n\n# 動作確認（JavaScriptを直接実行）\nnode -e "console.log(\'Hello, Node.js!\')"\n# → Hello, Node.js!\n\n# Node.js の対話モード\nnode\n# → > が表示されたらJSを直接入力できる\n# 例：1 + 1 → 2\n# 終了は Ctrl+C を2回または .exit',
  expectedOutput:'$ node --version\nv20.11.0\n$ npm --version\n10.2.4\n$ node -e "console.log(\'Hello!\')"\nHello!',
  errors:[
    {msg:'node: command not found', cause:'インストールが完了していない、またはPATHが通っていない',
     fix:'Windowsは再起動を試みる。Macはターミナルを再起動する。それでも解決しない場合はPATH設定を確認（brew doctor コマンドが参考になる）。'},
    {msg:'Macで「brew: command not found」', cause:'Homebrewがインストールされていない', fix:'Step 1のHomebrewインストールコマンドをターミナルに貼り付けて実行する。'},
    {msg:'npm install 時に「EACCES: permission denied」', cause:'権限の問題（Macで多い）', fix:'sudoは使わず、nvmを使ってNode.jsを再インストールするのがベスト。'}
  ],
  quiz:[
    {q:'node --version コマンドは何を確認するためのコマンドですか？', a:'インストールされているNode.jsのバージョンを確認するコマンド。'},
    {q:'LTS版を使う理由は？', a:'長期サポートが保証されていて安定しているから。'},
    {q:'npxとnpmの違いは？', a:'npmはインストール済みパッケージを実行、npxはパッケージを一時的にダウンロードして実行できる。'}
  ],
  miniTask:'以下を確認してスクリーンショットを撮る：\n1. node --version の結果\n2. npm --version の結果\n3. node -e "console.log(\'私のNode.jsが動いた！\')" の結果',
  aiOk:['nvmを使ったNode.jsのバージョン管理方法を教えてください','このエラーの直し方を教えてください：[エラーを貼り付ける]'],
  aiNg:['代わりにNode.jsをインストールしてください'],
  interviewQ:['Node.jsとは何ですか？なぜフロントエンド開発に必要なのですか？'],
  nextLesson:'l00-5-1'
},

/* ===========================
   Chapter 0-5：Gitのインストールと設定
   =========================== */
'l00-5-1': {
  id:'l00-5-1', chapter:'c00-5', num:'0-5-1',
  title:'Gitとは何か・なぜ必要か',
  duration:'10分',
  goal:'Gitのバージョン管理の概念を理解し、なぜプログラミングにGitが必要なのかを説明できる。',
  why:'Gitを知らずに開発すると、コードを変更するたびに「さっきのコードに戻したいのに戻れない」事態が起きる。チームで同じコードを共有するのもGitなしでは不可能に近い。',
  fieldUse:'GitなしでSES現場に参加することは不可能。「Gitコマンドを使えますか？」は面談で必ず聞かれる。',
  analogy:'Gitは「コードのタイムマシン」。過去のどの時点にも戻れて、複数人が同時に別の変更を加えても合流できる。',
  terms:[
    {term:'バージョン管理', meaning:'ファイルの変更履歴を記録して、過去の状態に戻せるようにすること。'},
    {term:'リポジトリ（repo）', meaning:'Gitが管理するフォルダ全体のこと。ローカルリポジトリ（自分のPC）とリモートリポジトリ（GitHub）がある。'},
    {term:'コミット（commit）', meaning:'変更を保存する操作。「ここまでの変更を記録する」ことで、後からこの時点に戻せる。'},
    {term:'GitHub', meaning:'Gitリポジトリをクラウド上に保存・共有するサービス。コードのSNSとも言える。'},
    {term:'clone', meaning:'リモートリポジトリを自分のPCにコピーしてくる操作。'}
  ],
  steps:[],
  code: null,
  expectedOutput: 'この Lesson に実際の作業はない。次のLessonでインストールする。',
  errors:[],
  quiz:[
    {q:'Gitを使わないと困ることを2つ挙げてください。', a:'① 過去のコードに戻せない ② 複数人で同じコードを同時に修正できない'},
    {q:'コミットとは何ですか？', a:'その時点での変更を記録・保存する操作。後からこの時点に戻せる。'}
  ],
  miniTask: null,
  aiOk:['GitとGitHubの違いを教えてください','Gitのバージョン管理の仕組みをたとえ話で説明してください'],
  aiNg:[],
  interviewQ:['Gitとは何ですか？なぜ使うのですか？'],
  nextLesson:'l00-5-2'
},

'l00-5-2': {
  id:'l00-5-2', chapter:'c00-5', num:'0-5-2',
  title:'Gitをインストールして初期設定する',
  duration:'25分',
  goal:'Gitをインストールし、git --versionが通り、名前・メール・エディタの初期設定が完了している。',
  why:'Gitの初期設定をしないと、コミット時に「Author不明」になる。名前とメールは全コミットに記録されるため最初に設定しておく。',
  fieldUse:'現場では全員がGitを設定済みで参加してくることが前提。初日に「Gitが入っていない」は印象が悪い。',
  analogy:'Gitの初期設定は「自分の名前を印鑑に彫る」作業。彫っておかないと書類（コミット）に「誰の印鑑か」が記録されない。',
  terms:[
    {term:'git config', meaning:'Gitの設定を変更するコマンド。--globalオプションで全プロジェクト共通の設定ができる。'},
    {term:'user.name / user.email', meaning:'コミット時に記録される作者名とメールアドレス。GitHub のアカウントと合わせておくと良い。'}
  ],
  steps:[
    {
      num:1, title:'Gitをインストールする',
      description:'',
      windows:'ブラウザで「Git download Windows」と検索 → git-scm.com → 「Download for Windows」\n→ ダウンロードした .exe をダブルクリック\n→ インストール中の設定は基本的にデフォルトのままでOK（変更する箇所）\n\n⚠ 「Choosing the default editor used by Git」の画面では\n「Use Visual Studio Code as Git\'s default editor」を選ぶと便利\n\n⚠ 「Adjusting the name of the initial branch」では\n「Override the default branch name for new repositories」を選んで\n「main」と入力する（GitHubのデフォルトに合わせる）\n\n→ Installをクリック → Finish',
      mac:'# Homebrewがある場合（推奨）\nbrew install git\n\n# または Xcodeコマンドラインツールと一緒にインストール\ngit --version\n# 上を実行するとインストールダイアログが表示されることがある'
    },
    {
      num:2, title:'Gitが入ったか確認する',
      description:'',
      windows:'# PowerShellまたはGit Bashで実行\ngit --version\n# → git version 2.x.x と表示されればOK',
      mac:'git --version\n# → git version 2.x.x'
    },
    {
      num:3, title:'初期設定：名前とメールを設定する',
      description:'GitHubのアカウントと同じ名前・メールアドレスを設定することを推奨。',
      windows:'# ターミナル（Git BashまたはPowerShell）で実行\ngit config --global user.name "山田 太郎"\ngit config --global user.email "taro.yamada@example.com"\n\n# ← "" の中を自分の名前とメールアドレスに変える',
      mac:'git config --global user.name "山田 太郎"\ngit config --global user.email "taro.yamada@example.com"'
    },
    {
      num:4, title:'デフォルトブランチ名をmainに設定する',
      description:'GitHubのデフォルトに合わせて「main」を使う。',
      windows:'git config --global init.defaultBranch main',
      mac:'git config --global init.defaultBranch main'
    },
    {
      num:5, title:'設定を確認する',
      description:'設定が正しく保存されているか確認。',
      windows:'git config --list\n# → user.name=山田 太郎\n# → user.email=taro.yamada@example.com\n# などが表示されればOK',
      mac:'git config --list'
    }
  ],
  code:'# Gitの初期設定コマンド集\n# ─────────────────────────────────────\n# バージョン確認\ngit --version\n\n# 名前を設定\ngit config --global user.name "Your Name"\n\n# メールを設定\ngit config --global user.email "you@example.com"\n\n# デフォルトブランチをmainに\ngit config --global init.defaultBranch main\n\n# エディタをVSCodeに設定（任意）\ngit config --global core.editor "code --wait"\n\n# 設定を確認\ngit config --list',
  expectedOutput:'$ git --version\ngit version 2.43.0\n$ git config --list\nuser.name=山田 太郎\nuser.email=taro.yamada@example.com\ninit.defaultbranch=main',
  errors:[
    {msg:'git: command not found', cause:'Gitがインストールされていない、またはPATHが通っていない', fix:'インストールをやり直す。Windowsは再起動後にターミナルを開く。'},
    {msg:'error: could not lock config file', cause:'設定ファイルへの書き込み権限がない', fix:'ターミナルを管理者として実行（Windows）。macOSはsudo git configで解決することがあるが、権限設定を確認した方が良い。'}
  ],
  quiz:[
    {q:'git config --global user.name はなぜ設定しますか？', a:'コミットに作者名を記録するため。設定しないとコミット者が「不明」になる。'},
    {q:'--global オプションの意味は？', a:'全プロジェクト共通の設定として保存する。globalなしは現在のプロジェクトのみに適用。'}
  ],
  miniTask:'以下を実行してスクリーンショットを撮る：\n1. git --version\n2. git config --list（自分の名前とメールが表示されることを確認）',
  aiOk:['gitのssh設定方法を教えてください','このgitエラーの意味を教えてください：[エラーをコピー]'],
  aiNg:['git configを代わりに設定してください'],
  interviewQ:['Gitの初期設定で何を設定しましたか？'],
  nextLesson:'l00-6-1'
},

/* ===========================
   Chapter 0-6：GitHubのセットアップ
   =========================== */
'l00-6-1': {
  id:'l00-6-1', chapter:'c00-6', num:'0-6-1',
  title:'GitHubアカウントを作成する',
  duration:'15分',
  goal:'GitHubアカウントを作成し、プロフィール（名前・アイコン）を設定できる。',
  why:'GitHubはポートフォリオを公開する場所でもある。採用担当者がGitHubを見てスキルを判断することが多い。最初から丁寧なアカウントを作る。',
  fieldUse:'現場でコードをGitHubで共有するのは当たり前。アカウントが「ちゃんとした名前・プロフィール」になっていると信頼度が上がる。',
  analogy:'GitHubアカウントはエンジニアの「名刺」。コードが実績になって積み上がっていく。',
  terms:[
    {term:'GitHub', meaning:'Gitリポジトリをクラウド上に保存・共有するMicrosoft傘下のサービス。世界最大のコード共有プラットフォーム。'},
    {term:'README.md', meaning:'リポジトリの説明文。Markdownで書く。GitHubでは自動的に表示される。'},
    {term:'コントリビューション', meaning:'GitHubでコードを追加した記録。ユーザーページに草グラフ（緑のマス目）として可視化される。'}
  ],
  steps:[
    {
      num:1, title:'GitHubアカウントを作成する',
      description:'',
      windows:'ブラウザで github.com へアクセス\n→「Sign up」ボタンをクリック\n→ メールアドレスを入力（なるべく長く使えるもの）\n→ パスワードを設定（20文字以上が推奨）\n→ ユーザー名を設定（例：yamada-taro、英数字とハイフンのみ）\n→ 人間確認のパズルを解く\n→ メールに届いた確認コードを入力\n→ 無料プラン（Free）を選択して完了',
      mac:'同上。ブラウザで github.com へアクセス。'
    },
    {
      num:2, title:'プロフィールを設定する',
      description:'採用担当者が見ることを意識して設定する。',
      windows:'GitHub にログイン後\n→ 右上のアイコンをクリック → 「Your profile」\n→「Edit profile」をクリック\n→ Name：本名またはビジネスネームを入力\n→ Bio：「フルスタックエンジニアを目指して学習中」など\n→「Save」をクリック',
      mac:'同上。'
    },
    {
      num:3, title:'ユーザー名に注意する',
      description:'ユーザー名は後から変更できるが、リポジトリのURLが全部変わるので慎重に選ぶ。',
      windows:'推奨：英語のフルネーム（yamada-taro）または ニックネーム（ydataro）。大文字は使わない。記号はハイフンのみ。採用担当者に見られることを意識する。',
      mac:'同上。'
    }
  ],
  code: null,
  expectedOutput:'GitHubにログインでき、自分のプロフィールページが表示されている状態。',
  errors:[
    {msg:'ユーザー名がすでに使われている', cause:'同じ名前のアカウントが存在する', fix:'別のユーザー名を試す。名前_01などの数字を付けるのも一つの方法。'},
    {msg:'メールが届かない', cause:'スパムフォルダに入っている可能性', fix:'スパムフォルダを確認する。届かない場合は別のメールアドレスで試す。'}
  ],
  quiz:[
    {q:'GitHubのユーザー名に使えない文字は？', a:'記号（ハイフン以外）、スペース、日本語。'},
    {q:'GitHubを採用目的で見られることを意識すべき理由は？', a:'採用担当者がコードを確認する際、GitHubのプロフィールと実績を見ることが多いから。'}
  ],
  miniTask:'GitHubアカウントを作成し、プロフィールに「学習中・目標」を一言書いてください。アカウントURLをスクリーンショットで記録してください。',
  aiOk:['GitHubでよく使う機能を教えてください'],
  aiNg:[],
  interviewQ:['GitHubのアカウントはありますか？URLを教えてください。'],
  nextLesson:'l00-6-2'
},

'l00-6-2': {
  id:'l00-6-2', chapter:'c00-6', num:'0-6-2',
  title:'最初のリポジトリを作る',
  duration:'20分',
  goal:'GitHubで新しいリポジトリを作成し、ローカルと繋げてコードをpushできる。',
  why:'リポジトリの作り方を知らないと、全ての課題提出ができない。最初の1回を丁寧に行う。',
  fieldUse:'プロジェクト参加時は既存リポジトリをcloneするが、自分でプロジェクトを立ち上げる時はこの手順が必要。',
  analogy:'リポジトリを作ることは「GitHubにファイルキャビネット（引き出し）を設置する」こと。その引き出しに自分のコードを保存していく。',
  terms:[
    {term:'git init', meaning:'フォルダをGitリポジトリとして初期化するコマンド。.gitという隠しフォルダが作られる。'},
    {term:'git remote add origin', meaning:'ローカルリポジトリにリモートリポジトリ（GitHub）のURLを登録するコマンド。'},
    {term:'git push', meaning:'ローカルのコミットをリモートリポジトリ（GitHub）に送信するコマンド。'},
    {term:'main', meaning:'メインのブランチ名。かつてはmasterと呼ばれていたが、現在はmainが主流。'}
  ],
  steps:[
    {
      num:1, title:'GitHubで新しいリポジトリを作成する',
      description:'',
      windows:'GitHubにログイン → 右上の「+」ボタン → 「New repository」\n→ Repository name：「hello-github」と入力\n→ Description（任意）：「初めてのリポジトリ」\n→ Publicを選ぶ（面接官が見られるように）\n→「Add a README file」にチェック\n→「Create repository」をクリック',
      mac:'同上。'
    },
    {
      num:2, title:'ローカルにcloneする',
      description:'GitHubで作ったリポジトリを自分のPCにコピーする。',
      windows:'GitHubのリポジトリページで「<> Code」ボタンをクリック\n→「HTTPS」タブが選ばれていることを確認\n→ URLをコピー（例：https://github.com/yamada-taro/hello-github.git）\n\nターミナルで実行：\ncd ~/Desktop/dev\ngit clone https://github.com/ユーザー名/hello-github.git\ncd hello-github\nls  # README.md が表示されればOK',
      mac:'cd ~/Desktop/dev\ngit clone https://github.com/ユーザー名/hello-github.git\ncd hello-github\nls'
    },
    {
      num:3, title:'ファイルを追加してpushする',
      description:'',
      windows:'# cloneしたフォルダ内で作業\ncd ~/Desktop/dev/hello-github\n\n# 新しいファイルを作成\ntouch index.html\necho "<h1>Hello GitHub!</h1>" > index.html\n\n# 変更をステージング\ngit add .\n\n# コミット（変更を記録）\ngit commit -m "feat: index.htmlを追加"\n\n# GitHubへ送信\ngit push origin main\n\n# GitHubのページをリロードして index.html が表示されればOK',
      mac:'同上の手順。'
    }
  ],
  code:'# リポジトリ作成からpushまでの流れ\n# ─────────────────────────────────────\n# 1. GitHubでリポジトリを作成（ブラウザ操作）\n\n# 2. ローカルにclone\ncd ~/Desktop/dev\ngit clone https://github.com/ユーザー名/リポジトリ名.git\n\n# 3. フォルダに移動\ncd リポジトリ名\n\n# 4. ファイルを編集・作成する\n# ...\n\n# 5. 変更をステージング（Gitに「これを記録して」と指示）\ngit add .  # 全変更を対象\n# または特定ファイルのみ\ngit add index.html\n\n# 6. コミット（変更を保存・記録）\ngit commit -m "変更の説明をここに書く"\n\n# 7. GitHubへ送信\ngit push origin main\n\n# 8. GitHubのページを確認\n# ブラウザでリポジトリを開くと変更が反映されている',
  expectedOutput:'$ git push origin main\nEnumerating objects: 4, done.\nCounting objects: 100% (4/4), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), 328 bytes | 328.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/yamada-taro/hello-github.git\n   abc1234..def5678  main -> main',
  errors:[
    {msg:'remote: Support for password authentication was removed', cause:'GitHubはパスワード認証を廃止。Personal Access Token（PAT）が必要。',
     fix:'GitHub → Settings → Developer settings → Personal access tokens → Generate new token → repo にチェック → トークンをコピー → pushの際、パスワードの代わりにトークンを貼り付ける'},
    {msg:'fatal: not a git repository', cause:'git initしていないフォルダで git add や git commit を実行した',
     fix:'ls -la でカレントディレクトリを確認。正しいフォルダにいるか確認し、cloneしたフォルダの中で作業する。'},
    {msg:'error: src refspec main does not match any', cause:'コミットが1回も行われていない',
     fix:'git add . と git commit -m "初回コミット" を先に実行してからpushする'}
  ],
  quiz:[
    {q:'git clone と git init の違いは？', a:'cloneは既存リポジトリをコピー、initは新規ローカルリポジトリを作成。'},
    {q:'git add . の「.」は何を意味しますか？', a:'現在のフォルダ以下の変更ファイルをすべてステージングする。'},
    {q:'git commit -m "..." の -m は何の略ですか？', a:'message（メッセージ）の略。コミットの説明文を1行で書く。'}
  ],
  miniTask:'以下を完成させてスクリーンショットを提出：\n1. GitHubに「hello-github」リポジトリを作成\n2. ローカルにclone\n3. index.htmlを作成してpush\n4. GitHubのリポジトリページでindex.htmlが表示されているを確認',
  aiOk:['git push でエラーが出ました、このメッセージの意味を教えてください：[エラーをコピー]','Personal Access Tokenの作り方を教えてください'],
  aiNg:[],
  interviewQ:['GitHubへのpushの流れを教えてください（add → commit → push の説明）'],
  nextLesson:'l00-6-3'
},

'l00-6-3': {
  id:'l00-6-3', chapter:'c00-6', num:'0-6-3',
  title:'Phase 0 の振り返りと環境構築チェックリスト',
  duration:'20分',
  goal:'Phase 0の全作業を振り返り、すべての環境が正常に動いていることを確認できる。',
  why:'環境構築でのもれが後のPhaseで「なぜかエラーが出る」原因になる。最初にまとめてチェックする。',
  fieldUse:'現場では「環境構築手順書」を作ることがある。自分の環境構築の記録をつけておくと、次の人への引き継ぎや、PCを変えた時の再現ができる。',
  analogy:'旅行前のパッキングチェックリストと同じ。全部確認してから次のフェーズ（旅）に出発。',
  terms:[],
  steps:[
    {
      num:1, title:'全ツールの動作確認',
      description:'以下のコマンドを全部実行して、エラーなく動くことを確認する。',
      windows:'# ターミナルで実行\nnode --version    # v20.x.x\nnpm --version     # 10.x.x\nnpx --version     # 10.x.x\ngit --version     # git version 2.x.x\ngit config user.name   # 自分の名前が表示\ngit config user.email  # 自分のメールが表示',
      mac:'同上。'
    },
    {
      num:2, title:'VSCodeの拡張機能チェック',
      description:'VSCodeを開いて以下の拡張機能がインストールされているか確認。',
      windows:'VSCode左サイドバーの拡張機能アイコンをクリック\n→「INSTALLED（インストール済み）」のタブを確認\n\n必須：\n□ Japanese Language Pack\n□ Live Server\n□ Prettier\n□ ESLint\n□ Auto Rename Tag',
      mac:'同上。'
    },
    {
      num:3, title:'GitHubの確認',
      description:'',
      windows:'□ GitHubにログインできる\n□ プロフィールに名前が設定されている\n□ hello-githubリポジトリが作成されている\n□ index.htmlがpushされている',
      mac:'同上。'
    }
  ],
  code:'# Phase 0 完了チェックコマンド（まとめて実行）\necho "=== 環境チェック ==="\necho -n "Node.js: " && node --version\necho -n "npm: " && npm --version\necho -n "Git: " && git --version\necho -n "Git name: " && git config user.name\necho -n "Git email: " && git config user.email\necho "=== チェック完了 ==="',
  expectedOutput:'=== 環境チェック ===\nNode.js: v20.11.0\nnpm: 10.2.4\nGit: git version 2.43.0\nGit name: 山田 太郎\nGit email: taro.yamada@example.com\n=== チェック完了 ===',
  errors:[],
  quiz:[
    {q:'Phase 0の到達目標を3つ挙げてください。', a:'① ターミナルで基本コマンドが使える ② Node.js・Git・VSCodeが動く ③ GitHubにコードをpushできる'},
  ],
  miniTask:'上のチェックコマンドを実行してスクリーンショットを日報に添付してください。全て正常に表示されたらPhase 1に進んでOKです。',
  aiOk:[],
  aiNg:[],
  interviewQ:['開発環境の構築はできますか？どんなツールを使っていますか？'],
  nextLesson: null
}

}; // end LESSON_P00