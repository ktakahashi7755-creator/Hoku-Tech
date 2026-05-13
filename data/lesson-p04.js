/* =========================================================
   data/lesson-p04.js  ─  Phase 4「Git / GitHub」全13レッスン
   ========================================================= */
window.LESSON_P04 = {

/* ── Chapter 4-1: Gitの仕組みと初期化 ── */
'l04-1-1': {
  id:'l04-1-1', chapter:'c04-1', num:'4-1-1',
  title:'Gitとは何か・バージョン管理の考え方',
  duration:'15分',
  goal:'Gitが解決する問題を説明でき、ローカルリポジトリとリモートリポジトリの違いを述べられる。',
  why:'Gitなしの開発は「最終版_本当の最終版_修正済み.zip」地獄になる。現場でGitを使わない開発はほぼ存在しない。',
  fieldUse:'SES案件参画初日に「リポジトリをcloneしてください」と言われる。Gitの操作ができないと仕事にならない。',
  analogy:'Gitはコードの「タイムマシン」。いつでも過去の状態に戻れ、複数の作業を並行でき、チームで同じファイルを安全に編集できる。',
  terms:[
    {term:'リポジトリ', meaning:'Gitが管理するファイル・変更履歴の保管場所。ローカルリポジトリ（自分のPC）とリモートリポジトリ（GitHub）がある。'},
    {term:'コミット', meaning:'変更内容を記録するGitの操作。「セーブポイント」のようなもの。コミットするとその時点に戻れる。'},
    {term:'ブランチ', meaning:'コードの流れを分岐させる機能。mainブランチを汚さずに新機能を開発できる。'},
  ],
  steps:[],
  code: null,
  expectedOutput:'Gitが解決する問題とバージョン管理の概念を説明できる。',
  errors:[],
  quiz:[
    {q:'Gitを使わずにチーム開発するとどんな問題が起きますか？', a:'① 誰がいつ何を変更したか分からない ② 複数人が同じファイルを変更するとどちらが最新か分からない ③ バグを入れたコミットを特定できない。'},
    {q:'ローカルリポジトリとリモートリポジトリの違いは？', a:'ローカルは自分のPC上のリポジトリ、リモートはGitHub等のサーバー上のリポジトリ。pushでローカル→リモート、pullでリモート→ローカルに同期する。'},
  ],
  miniTask:'自分の学習フォルダをGitで管理するとどんなメリットがあるか3つ書いてください。',
  aiOk:['GitとSVNの違いを教えてください','Gitのステージングエリアとは何ですか？'],
  aiNg:[],
  interviewQ:['Gitを使うメリットを教えてください。'],
  nextLesson:'l04-1-2'
},

'l04-1-2': {
  id:'l04-1-2', chapter:'c04-1', num:'4-1-2',
  title:'git init と最初のコミット',
  duration:'25分',
  goal:'git init でローカルリポジトリを作成し、ファイルを追加してgit add・git commitで最初のコミットができる。',
  why:'全てのGitリポジトリはinitから始まる。add→commitの流れはGitの最基本操作。',
  fieldUse:'新規プロジェクトを始める時、または既存フォルダをGitで管理し始める時に使う。',
  analogy:'git init はノートを「日記帳」として登録する手続き。git add は「この内容を書き留める」準備、git commit は「今日の日記として確定させる」操作。',
  terms:[
    {term:'git init', meaning:'カレントフォルダをGitリポジトリとして初期化するコマンド。.gitという隠しフォルダが作られる。'},
    {term:'git add', meaning:'変更したファイルをコミットの準備（ステージング）に追加するコマンド。'},
    {term:'git commit', meaning:'ステージングした変更を記録するコマンド。-mオプションでメッセージを付ける。'},
    {term:'git status', meaning:'現在の状態（変更済み・ステージング済みなど）を確認するコマンド。'},
  ],
  steps:[
    {num:1, title:'リポジトリを初期化してコミットする',
     description:'',
     windows:'cd ~/Desktop/dev\\nmkdir git-practice && cd git-practice\\ngit init\\n# ファイルを作成\\necho "# Git練習" > README.md\\n# 状態確認\\ngit status\\n# ステージング\\ngit add README.md\\n# コミット\\ngit commit -m "feat: README.md を追加"\\n# 履歴確認\\ngit log --oneline',
     mac:'cd ~/Desktop/dev\\nmkdir git-practice && cd git-practice\\ngit init\\necho "# Git練習" > README.md\\ngit status\\ngit add README.md\\ngit commit -m "feat: README.md を追加"\\ngit log --oneline'},
  ],
  code:'# Gitの基本コマンド流れ\ngit init                          # リポジトリ初期化\ngit status                        # 状態確認（よく使う）\ngit add ファイル名                # 特定ファイルをステージング\ngit add .                         # 全変更をステージング\ngit commit -m "変更の説明"        # コミット（メッセージ必須）\ngit log --oneline                 # コミット履歴を一行で表示\ngit log --oneline --graph         # ブランチをグラフで表示',
  expectedOutput:'git log --oneline に「feat: README.md を追加」が表示される。',
  errors:[
    {msg:'Author identity unknown', cause:'git config で名前・メールを設定していない', fix:'git config --global user.name "名前" と git config --global user.email "メール" を実行する。'},
    {msg:'fatal: not a git repository', cause:'git initしていないフォルダでgit addを実行した', fix:'git init を実行してからもう一度試す。'},
  ],
  quiz:[
    {q:'git addとgit commitの違いは？', a:'addはコミットする変更の選択（ステージング）、commitはその変更を記録（保存）する操作。addしてからcommitする。'},
    {q:'git status は何を確認するためのコマンドですか？', a:'現在のリポジトリの状態。変更済みファイル・ステージング済みファイル・untracked（未追跡）ファイルを確認できる。'},
  ],
  miniTask:'git-practice フォルダで：\\n1. index.html を作成してgit add → git commit する\\n2. style.css を作成してgit add → git commit する\\n3. git log --oneline で2つのコミットが表示されることを確認する',
  aiOk:['このgitエラーの意味を教えてください：[エラーをコピー]','git addの.と特定ファイル指定の使い分けを教えてください'],
  aiNg:[],
  interviewQ:['git addとgit commitの違いを説明してください。'],
  nextLesson:'l04-1-3'
},

'l04-1-3': {
  id:'l04-1-3', chapter:'c04-1', num:'4-1-3',
  title:'良いコミットメッセージの書き方',
  duration:'15分',
  goal:'コミットメッセージの目的と、プロジェクトで使われる規約（Conventional Commits）を理解して書ける。',
  why:'コミットメッセージは「未来の自分と仲間へのメモ」。3ヶ月後に「ここで何を変えたのか」を知るための唯一の手がかりになる。現場でコードレビューで必ず確認される。',
  fieldUse:'現場では「feat:」「fix:」「docs:」などのプレフィックスをつけるConventional Commitsが標準になっている。CIパイプラインで自動チェックされることも。',
  analogy:'コミットメッセージは新聞の見出し。「変更しました」では読者に伝わらない。「ログイン機能にJWT認証を追加」のように「何を・なぜ・どうした」が一目で分かるべき。',
  terms:[
    {term:'Conventional Commits', meaning:'コミットメッセージの標準規約。feat:（新機能）fix:（バグ修正）docs:（ドキュメント）などのプレフィックスを使う。'},
  ],
  steps:[],
  code:'# 良いコミットメッセージの例（Conventional Commits）\nfeat: タスク一覧画面を追加\nfix: ログイン時のNullPointerExceptionを修正\ndocs: READMEに起動手順を追記\nstyle: インデントをタブからスペース2に統一\nrefactor: UserServiceのメソッドを分割して責務を整理\ntest: TaskServiceの単体テストを追加\nchore: 依存ライブラリをアップデート\n\n# 悪いコミットメッセージの例\n- "修正" （何を修正したか不明）\n- "update" （何を更新したか不明）\n- "asdf" （意味不明）\n- "最終" （これが本当の最終かわからない）\n- "WIP" （作業中のまま）',
  expectedOutput:'プレフィックス付きの意味のあるコミットメッセージを書ける。',
  errors:[],
  quiz:[
    {q:'新しい機能を追加した場合のコミットメッセージのプレフィックスは？', a:'feat:（featureの略）'},
    {q:'バグを修正した場合のプレフィックスは？', a:'fix:'},
  ],
  miniTask:'先ほど作った git-practice リポジトリのコミットメッセージを振り返り、Conventional Commits の規約に沿っているか確認・修正してください。',
  aiOk:['このコミットメッセージは適切ですか：[メッセージをコピー]'],
  aiNg:[],
  interviewQ:['どんなコミットメッセージを書くようにしていますか？'],
  nextLesson:'l04-2-1'
},

/* ── Chapter 4-2: add・commit・push ── */
'l04-2-1': {
  id:'l04-2-1', chapter:'c04-2', num:'4-2-1',
  title:'GitHubにリポジトリを作ってpushする',
  duration:'25分',
  goal:'GitHubで新規リポジトリを作り、ローカルと連携してgit pushできる状態にする。',
  why:'Gitをローカルだけで使っても課題提出・ポートフォリオ公開・チーム開発ができない。GitHubと繋ぐことで初めてGitの真価が発揮される。',
  fieldUse:'全課題のGitHub提出・GitHub Pagesでの公開・面談でのポートフォリオ確認に使う。',
  analogy:'ローカルリポジトリはノートの「下書き」、GitHubは「クラウド保存」。手書きのメモをGoogleドキュメントに保存するようなイメージ。',
  terms:[
    {term:'git push', meaning:'ローカルのコミットをリモートリポジトリ（GitHub）に送信するコマンド。'},
    {term:'origin', meaning:'リモートリポジトリのデフォルトの別名。git remote add origin [URL] で登録する。'},
    {term:'git remote', meaning:'リモートリポジトリの設定を確認・追加・変更するコマンド。'},
  ],
  steps:[
    {num:1, title:'GitHubにリポジトリを作成する',
     description:'',
     windows:'github.com にログイン → 右上「+」→「New repository」→ Repository name: git-practice → Public → 「Add a README file」はチェックしない → 「Create repository」',
     mac:'同上。'},
    {num:2, title:'ローカルとGitHubを繋げてpushする',
     description:'',
     windows:'# ターミナルで実行（git-practiceフォルダ内で）\\ngit remote add origin https://github.com/ユーザー名/git-practice.git\\ngit branch -M main\\ngit push -u origin main\\n# 認証を求められたらGitHubのPersonal Access Tokenを入力',
     mac:'同上。'},
  ],
  code:'# push後の確認コマンド\ngit remote -v          # リモートの設定を確認\ngit push origin main   # mainブランチをpush\ngit push               # -u設定後はこれだけでOK\ngit log --oneline      # ローカルのコミット履歴確認',
  expectedOutput:'GitHubのリポジトリページを開くと、ローカルで作ったファイルが表示されている。',
  errors:[
    {msg:'Support for password authentication was removed', cause:'GitHub がパスワード認証を廃止', fix:'GitHubの Settings → Developer settings → Personal access tokens → Generate new token → repo にチェック → トークンをパスワード代わりに使う。'},
    {msg:'error: remote origin already exists', cause:'既に origin が登録されている', fix:'git remote set-url origin [新しいURL] で変更する。'},
  ],
  quiz:[
    {q:'git push -u origin main の -u オプションは何をしますか？', a:'upstream（上流）を設定する。次回から git push だけで main にpushできるようになる。'},
  ],
  miniTask:'git-practiceリポジトリをGitHubにpushして、GitHubのページでファイルが表示されることを確認してスクリーンショットを撮ってください。',
  aiOk:['git pushでこのエラーが出ました：[エラーをコピー]','SSHキーでGitHubに接続する方法を教えてください'],
  aiNg:[],
  interviewQ:['git addからpushまでの流れを説明してください。'],
  nextLesson:'l04-2-2'
},

'l04-2-2': {
  id:'l04-2-2', chapter:'c04-2', num:'4-2-2',
  title:'git pull・git clone・git log',
  duration:'20分',
  goal:'git clone でリモートをローカルにコピーし、git pull で最新を取り込み、git log でコミット履歴を確認できる。',
  why:'チーム開発では他のメンバーの変更を取り込む（pull）・既存プロジェクトに参加する（clone）・履歴を調べる（log）が毎日必要になる。',
  fieldUse:'SES案件参画初日は「まずリポジトリをcloneして環境構築してください」から始まることがほとんど。',
  analogy:'git clone は「コピーして手元に持ってくる」、git pull は「最新号の雑誌に更新する」イメージ。',
  terms:[
    {term:'git clone', meaning:'リモートリポジトリをローカルにコピーするコマンド。最初の一回だけ実行する。'},
    {term:'git pull', meaning:'リモートリポジトリの変更をローカルに取り込むコマンド。git fetch + git merge の省略形。'},
    {term:'git log', meaning:'コミット履歴を表示するコマンド。--oneline（1行表示）--graph（ブランチ図）などのオプションがある。'},
  ],
  steps:[
    {num:1, title:'git clone を体験する',
     description:'',
     windows:'cd ~/Desktop/dev\\ngit clone https://github.com/ユーザー名/git-practice.git clone-test\\ncd clone-test\\nls\\ngit log --oneline',
     mac:'同上。'},
  ],
  code:'# cloneとpullの基本\ngit clone [URL]                      # リポジトリをローカルにコピー\ngit clone [URL] フォルダ名           # フォルダ名を指定してクローン\ngit pull origin main                 # リモートのmainブランチを取り込む\ngit pull                             # デフォルトブランチをpull\n\n# git log のオプション\ngit log                              # 詳細なコミット履歴\ngit log --oneline                    # 1行表示\ngit log --oneline --graph            # ブランチをグラフ表示\ngit log --oneline -5                 # 直近5件\ngit log --author="山田"              # 特定の人のコミットだけ',
  expectedOutput:'git log --oneline でコミット履歴が表示される。',
  errors:[
    {msg:'fatal: repository not found', cause:'URLが間違っているか、アクセス権がない', fix:'GitHubのリポジトリページでURLを再確認する。プライベートリポジトリの場合は認証が必要。'},
  ],
  quiz:[
    {q:'git cloneとgit pullの違いは？', a:'cloneは最初に一度だけリポジトリ全体をコピーする。pullは既にcloneした状態で、リモートの最新変更だけを取り込む。'},
  ],
  miniTask:'GitHubで他の人の公開リポジトリ（例：github.com/microsoft/vscode）をcloneして git log --oneline で最近のコミットを確認してください。',
  aiOk:['git fetchとgit pullの違いを教えてください'],
  aiNg:[],
  interviewQ:['git cloneとgit pullの違いを説明してください。'],
  nextLesson:'l04-2-3'
},

'l04-2-3': {
  id:'l04-2-3', chapter:'c04-2', num:'4-2-3',
  title:'.gitignoreの書き方',
  duration:'15分',
  goal:'.gitignoreを作成してnode_modules・.envなど不要/危険なファイルをGitの管理対象外にできる。',
  why:'APIキーや認証情報を.envに書いてGitHubに上げてしまうと、セキュリティ事故になる。node_modulesを上げると巨大ファイルで遅くなる。両方とも事故の前に習慣として防ぐ。',
  fieldUse:'新プロジェクト開始時に.gitignoreを必ず作る。現場で「.envをcommitしないように」と言われる前に自分で管理できるようにする。',
  analogy:'.gitignoreは「荷物の仕分けリスト」。空港で預けてはいけない荷物（刃物・爆発物=機密情報・巨大ファイル=node_modules）をリストアップして排除する。',
  terms:[
    {term:'.gitignore', meaning:'Gitの管理対象外にするファイル・フォルダのリストを書くファイル。プロジェクトのルートに置く。'},
    {term:'.env', meaning:'APIキー・DBパスワードなどの機密情報を管理するファイル。絶対にGitHubにアップしない。'},
  ],
  steps:[],
  code:'# .gitignore の例（Node.js/Reactプロジェクト）\n# 依存関係\nnode_modules/\n\n# 環境変数（機密情報）\n.env\n.env.local\n.env.production\n\n# ビルド成果物\n.next/\ndist/\nbuild/\n\n# OS生成ファイル\n.DS_Store\nThumbs.db\n\n# エディタ設定\n.vscode/\n*.swp\n\n# テストカバレッジ\ncoverage/',
  expectedOutput:'git status で .env や node_modules が表示されなくなる。',
  errors:[
    {msg:'すでにコミットしたファイルがgitignoreに効かない', cause:'.gitignoreは新規ファイルにしか効かない。既にトラッキングされたファイルには効かない。', fix:'git rm --cached ファイル名 でトラッキングを解除してから.gitignoreに追記する。'},
  ],
  quiz:[
    {q:'.envファイルをGitHubに上げてしまった場合、どんな被害が起きる可能性がありますか？', a:'APIキーやDBパスワードが第三者に読まれ、サービスへの不正アクセス・不正利用・課金被害が起きる可能性がある。'},
    {q:'node_modulesをGitにコミットしない理由は？', a:'数万ファイル・数百MBになることがある巨大なフォルダで、package.jsonがあれば npm install で再現できるため。'},
  ],
  miniTask:'プロジェクトフォルダで .gitignore を作成し、node_modules・.env・.DS_Store を追加してください。git status で確認してください。',
  aiOk:['このプロジェクト用の.gitignoreテンプレートを教えてください（Spring Boot用）'],
  aiNg:[],
  interviewQ:['.gitignoreはどんなファイルをGitの管理外にしていますか？'],
  nextLesson:'l04-3-1'
},

/* ── Chapter 4-3: ブランチとマージ ── */
'l04-3-1': {
  id:'l04-3-1', chapter:'c04-3', num:'4-3-1',
  title:'ブランチの作成・切り替え・削除',
  duration:'25分',
  goal:'git branch・git checkout・git switchを使ってブランチを作成・切り替え・削除できる。featureブランチ運用の意味を説明できる。',
  why:'本番コード（mainブランチ）を直接触るのは危険。featureブランチで作業して、完成したらmainにマージするのが現場の基本。',
  fieldUse:'現場では「feature/user-login」のようなブランチを作り、PRを出してコードレビューを受けてからmainにマージするのが標準。',
  analogy:'ブランチは「平行宇宙」。mainブランチを壊さずに別の宇宙（ブランチ）で作業し、完成したら元の宇宙にマージする。',
  terms:[
    {term:'ブランチ', meaning:'コードの変更履歴を枝分かれさせる機能。mainブランチをベースに feature ブランチを作って作業する。'},
    {term:'git switch', meaning:'ブランチを切り替えるコマンド（git checkout の新しい代替）。'},
    {term:'HEAD', meaning:'現在のブランチの最新コミットを指すポインタ。「今ここにいる」場所を示す。'},
  ],
  steps:[
    {num:1, title:'ブランチを作って作業する',
     description:'',
     windows:'# 現在のブランチを確認\\ngit branch\\n\\n# featureブランチを作成して切り替え\\ngit switch -c feature/add-login\\n# または（古い書き方）\\ngit checkout -b feature/add-login\\n\\n# ブランチの確認（*がついているのが現在のブランチ）\\ngit branch\\n\\n# 作業してコミット\\necho "login機能" > login.html\\ngit add login.html\\ngit commit -m "feat: ログイン画面を追加"\\n\\n# mainに戻る\\ngit switch main',
     mac:'同上。'},
  ],
  code:'# ブランチ操作コマンドまとめ\ngit branch                     # ブランチ一覧\ngit branch -a                  # リモートブランチも表示\ngit switch ブランチ名           # ブランチを切り替え\ngit switch -c ブランチ名        # ブランチを作成して切り替え\ngit branch -d ブランチ名        # ブランチを削除（マージ済みのみ）\ngit branch -D ブランチ名        # 強制削除',
  expectedOutput:'git branch で feature/add-login ブランチが作成されて * が付いていることを確認。',
  errors:[
    {msg:'error: pathspec \'ブランチ名\' did not match any file(s)', cause:'存在しないブランチに切り替えようとした', fix:'git branch でブランチ名を確認する。新規作成なら -c オプションをつける。'},
  ],
  quiz:[
    {q:'なぜmainブランチで直接作業しないのですか？', a:'mainブランチは安定した本番コードを保つ場所。未提出や破壊的な変更をmainに入れると、チーム全員に影響が出るため。'},
  ],
  miniTask:'feature/todo-list という名前のブランチを作成し、todo.htmlをコミットしてから git branch --merged で確認してください。',
  aiOk:['ブランチ命名規則のベストプラクティスを教えてください'],
  aiNg:[],
  interviewQ:['なぜfeatureブランチで作業するのですか？', 'ブランチの命名規則はどうしていますか？'],
  nextLesson:'l04-3-2'
},

'l04-3-2': {
  id:'l04-3-2', chapter:'c04-3', num:'4-3-2',
  title:'マージの仕組みとfast-forward',
  duration:'20分',
  goal:'git merge でブランチを統合でき、fast-forwardとthree-way mergeの違いを説明できる。',
  why:'ブランチを作って作業した後、mainに統合（マージ）する操作は開発の基本サイクル。マージの仕組みを知らないとコンフリクトで困る。',
  fieldUse:'PRがApproveされた後にmainにマージする。マージ方法（fast-forward・squash・rebase）を選ぶのはチームのルールによる。',
  analogy:'マージは「支流が本流に合流する」イメージ。featureブランチという支流がmainという本流に流れ込む。',
  terms:[
    {term:'fast-forward merge', meaning:'branchがmainから分岐して以来mainが変更されていない場合、そのままポインタを進めるだけのマージ。履歴が直線になる。'},
    {term:'three-way merge', meaning:'mainとfeatureの両方が変更されている場合に行うマージ。マージコミットが作られる。'},
  ],
  steps:[
    {num:1, title:'featureブランチをmainにマージする',
     description:'',
     windows:'# mainブランチに移動\\ngit switch main\\n\\n# featureブランチをmainにマージ\\ngit merge feature/add-login\\n\\n# 履歴確認\\ngit log --oneline --graph\\n\\n# マージ済みブランチを削除\\ngit branch -d feature/add-login',
     mac:'同上。'},
  ],
  code:'# マージのコマンド\ngit switch main                   # mainに移動（必須）\ngit merge feature/add-login       # featureをmainにマージ\ngit merge --no-ff feature/add-login  # fast-forwardを禁止してマージコミットを作る\ngit log --oneline --graph         # マージ後の履歴を確認',
  expectedOutput:'git log --oneline --graph でfeatureブランチのコミットがmainに統合されて表示される。',
  errors:[],
  quiz:[
    {q:'git merge の前にどのブランチにいる必要がありますか？', a:'マージ先のブランチ（通常はmain）。マージを受け入れる側のブランチに切り替えてからmergeコマンドを実行する。'},
  ],
  miniTask:'feature/todo-list ブランチをmainにマージして git log --oneline --graph で結果を確認してください。',
  aiOk:['git rebaseとgit mergeの違いを教えてください'],
  aiNg:[],
  interviewQ:['マージとリベースの違いを説明してください（知っていれば）。'],
  nextLesson:'l04-3-3'
},

'l04-3-3': {
  id:'l04-3-3', chapter:'c04-3', num:'4-3-3',
  title:'コンフリクトの発生と解消',
  duration:'30分',
  goal:'コンフリクトが発生する仕組みを理解し、VSCodeを使ってコンフリクトを解消してマージできる。',
  why:'チーム開発では必ずコンフリクトが起きる。解消できないエンジニアは作業が止まってチームに迷惑をかける。初日から対応できる力が必要。',
  fieldUse:'SES案件での最初のコンフリクト解消時に焦らないための事前練習として重要。解消できることよりも、コンフリクトが怖くないことが大切。',
  analogy:'コンフリクトは「二人が同じ場所に文章を書いた状態」。Gitは「どちらが正しいか分からないので人間に判断してもらう」。',
  terms:[
    {term:'コンフリクト', meaning:'2つのブランチで同じ箇所が異なる変更をされた場合に発生する衝突。手動で解消が必要。'},
    {term:'<<<<<<<', meaning:'コンフリクトマーカー。=======の上がHEAD（現在のブランチ）の内容、下がマージしようとしているブランチの内容。'},
  ],
  steps:[
    {num:1, title:'コンフリクトを意図的に発生させて解消する',
     description:'',
     windows:'# セットアップ：mainに index.html を作成\\ngit switch main\\necho "<h1>Main Branch</h1>" > index.html\\ngit add index.html && git commit -m "feat: index.html追加"\\n\\n# featureブランチで同じファイルを変更\\ngit switch -c feature/conflict-test\\necho "<h1>Feature Branch</h1>" > index.html\\ngit add index.html && git commit -m "feat: h1を変更"\\n\\n# mainに戻って別の変更\\ngit switch main\\necho "<h1>Main Changed</h1>" > index.html\\ngit add index.html && git commit -m "feat: mainでもh1を変更"\\n\\n# マージを試みる（コンフリクト発生）\\ngit merge feature/conflict-test\\n# → CONFLICT と表示される\\n\\n# VSCodeでindex.htmlを開いて解消する\\ncode index.html',
     mac:'同上。'},
  ],
  code:'# コンフリクト時のindex.htmlの中身（例）\n<<<<<<< HEAD\n<h1>Main Changed</h1>\n=======\n<h1>Feature Branch</h1>\n>>>>>>> feature/conflict-test\n\n# 解消後（どちらかを選ぶか、両方を組み合わせる）\n<h1>Main Changed (+ Feature)</h1>\n\n# 解消後のコマンド\ngit add index.html\ngit commit -m "merge: conflict resolved in index.html"',
  expectedOutput:'コンフリクトを解消してマージコミットが作成される。',
  errors:[
    {msg:'ファイルにコンフリクトマーカーが残ったままコミットした', cause:'解消を途中で止めてgit addしてしまった', fix:'git diff HEAD で確認して、<<<<<<<・=======・>>>>>>>マーカーを全て消してからgit addし直す。'},
  ],
  quiz:[
    {q:'コンフリクトを解消するには具体的に何をしますか？', a:'① コンフリクトしているファイルを開く ② <<<<<<<・=======・>>>>>>>のマーカーを消す ③ 残したい内容に編集する ④ git add でステージング ⑤ git commit でマージコミットを作る。'},
  ],
  miniTask:'上記の手順でコンフリクトを意図的に発生させて解消してください。解消後の git log --oneline --graph をスクリーンショットで提出。',
  aiOk:['このコンフリクトはどちらを残すべきですか：[コンフリクト部分をコピー]'],
  aiNg:['コンフリクトを自動解消してください（どちらが正しいかはあなただけが知っている）'],
  interviewQ:['コンフリクトが起きた時どう対処しますか？'],
  nextLesson:'l04-4-1'
},

/* ── Chapter 4-4: プルリクエストとコンフリクト ── */
'l04-4-1': {
  id:'l04-4-1', chapter:'c04-4', num:'4-4-1',
  title:'GitHub でプルリクエストを出す',
  duration:'25分',
  goal:'GitHubでPull Requestを作成し、レビュー・承認・マージまでの一連の流れを体験できる。',
  why:'現場でのコードレビューはほぼ全てPR経由。PRの書き方が雑だとレビュアーの時間を無駄にする。丁寧なPRは技術力と同等に評価される。',
  fieldUse:'SES案件でのPR文化は現場によるが、自社開発はほぼ全てPRベース。GitHub Actionsでのテスト自動化もPRをトリガーにすることが多い。',
  analogy:'PRは「作ったものの報告書」。何を変えたのか・なぜ変えたのか・どうテストしたかを説明することで、レビュアーの負担を減らし品質を上げる。',
  terms:[
    {term:'Pull Request（PR）', meaning:'自分のブランチをbaseブランチ（通常main）にマージする申請。コードレビューの場でもある。'},
    {term:'レビュアー', meaning:'PRの変更内容を確認・コメントする人。承認（Approve）するとマージ可能になる。'},
    {term:'Assignee', meaning:'そのPRの担当者（通常PR作成者自身）。'},
  ],
  steps:[
    {num:1, title:'PRを作成する手順',
     description:'',
     windows:'# featureブランチを作って変更をpush\\ngit switch -c feature/add-readme-detail\\necho "## 詳細説明\\nこのリポジトリはGitの練習用です。" >> README.md\\ngit add README.md\\ngit commit -m "docs: README に詳細説明を追加"\\ngit push origin feature/add-readme-detail\\n\\n# GitHubを開くと「Compare & pull request」ボタンが出る\\n# クリックしてPR作成画面へ',
     mac:'同上。'},
  ],
  code:'# 良いPRの構成\n## 概要\n- タスク一覧に優先度フィルター機能を追加しました\n\n## 変更内容\n- FilterComponent コンポーネントを追加\n- TaskList から FilterComponent を呼び出すように修正\n- スタイルを修正\n\n## 動作確認\n- [ ] 「高」フィルターを選択すると高優先度タスクだけ表示される\n- [ ] フィルターをクリアすると全タスクが表示される\n- [ ] スマホ表示で崩れない\n\n## スクリーンショット\n[フィルター実装後の画面]\n\n## 関連Issue\nCloses #12',
  expectedOutput:'GitHubにPRが作成され、変更差分（diff）が表示されている。',
  errors:[],
  quiz:[
    {q:'PRを出す前に自分でやるべきことを3つ挙げてください。', a:'① 動作確認（チェックリスト） ② コードの自己レビュー（誤字・デバッグコード削除） ③ PR本文に変更内容・理由・確認方法を記述。'},
  ],
  miniTask:'featureブランチを作ってREADMEを変更し、GitHubでPRを作成してください。PRのタイトルと説明文をConventional Commitsに沿って書いてください。',
  aiOk:['このPRの説明文を改善してください：[PR文をコピー]'],
  aiNg:[],
  interviewQ:['PRを出す際に気をつけていることを教えてください。'],
  nextLesson:'l04-4-2'
},

'l04-4-2': {
  id:'l04-4-2', chapter:'c04-4', num:'4-4-2',
  title:'コードレビューの受け方・返し方',
  duration:'15分',
  goal:'コードレビューのコメントに適切に対応し、修正・再提出・承認のサイクルを理解できる。',
  why:'レビューコメントへの対応の仕方は、技術力と同様に現場で評価される。「なぜ指摘されたか」を理解せずにコードを直すだけでは成長しない。',
  fieldUse:'SES現場では上位SEがコードレビューをする。レビューコメントを「批判」ではなく「学びの機会」として受け取れるエンジニアが成長する。',
  analogy:'コードレビューは「文章の赤ペン先生」。指摘は作者への攻撃ではなくコードへのフィードバック。',
  terms:[
    {term:'LGTM', meaning:'Looks Good To Me。PRが問題ないことを示すレビュアーのコメント。Approveの前に使うことが多い。'},
    {term:'nit', meaning:'nitpick（細かい指摘）の略。必ずしも修正が必要ではない軽微な指摘。'},
  ],
  steps:[],
  code:'# コードレビューへの適切な対応例\n# ─────────────────────────────────────\n# レビュアーのコメント：\n# 「handleSubmit が長すぎます。バリデーション部分を別関数に分けましょう」\n\n# 悪い対応：\n# - 「分かりました」とだけ返信してコードを変えない\n# - 言われた通りに変えるがなぜかを理解しない\n\n# 良い対応：\n# 1. 「ご指摘ありがとうございます。validateForm()に分離しました。\n#    理由：関数の責務を単一にするためです。」とコメント\n# 2. コードを修正してpush（同じブランチに）\n# 3. コメントにpushしたコミットIDを記載\n# 4. Reviewerに再確認を依頼',
  expectedOutput:'レビューコメントに適切に返信し、修正をpushしてre-requestできる。',
  errors:[],
  quiz:[
    {q:'レビューコメントに返信する際に大切なことは何ですか？', a:'① なぜそう修正したかを説明する ② 修正コミットをpushして確認しやすくする ③ 理解できない指摘は「なぜですか」と質問する。'},
  ],
  miniTask:'自分のPRに「このコードのこの部分をこう改善すべき」という自己レビューコメントを書き、修正してpushしてください。',
  aiOk:['このレビューコメントへの返信文を添削してください：[返信をコピー]'],
  aiNg:[],
  interviewQ:['コードレビューで指摘された時どう対応しますか？'],
  nextLesson:'l04-5-1'
},

/* ── Chapter 4-5: GitHub Pages公開 ── */
'l04-5-1': {
  id:'l04-5-1', chapter:'c04-5', num:'4-5-1',
  title:'GitHub Pages で静的サイトを公開する',
  duration:'25分',
  goal:'GitHubリポジトリをGitHub Pagesに設定し、自分のHTMLサイトをhttps://ユーザー名.github.io/リポジトリ名 で公開できる。',
  why:'Phase 2で作る自己紹介ページをGitHub Pagesで公開する。面談で「どこで見れますか？」と聞かれた時に即座に答えられる状態にする。',
  fieldUse:'ポートフォリオサイト・静的ドキュメントサイト・デモページをコストゼロで公開できる。Vercelの前に仕組みを理解するためにも有用。',
  analogy:'GitHub Pagesは「GitHubが提供する無料レンタルサーバー」。リポジトリにHTMLを置くだけで世界に公開できる。',
  terms:[
    {term:'GitHub Pages', meaning:'GitHubリポジトリの静的ファイル（HTML/CSS/JS）を自動でホスティングするサービス。無料。'},
    {term:'静的サイト', meaning:'サーバーサイドの処理なしにHTMLファイルをそのまま返すサイト。バックエンドは不要。'},
  ],
  steps:[
    {num:1, title:'GitHub Pages を設定する',
     description:'',
     windows:'# 1. GitHubでリポジトリを開く\n# 2. Settings タブをクリック\n# 3. 左のメニューで「Pages」をクリック\n# 4. Source で「Deploy from a branch」を選択\n# 5. Branch で「main」・フォルダで「/ (root)」を選択\n# 6. Save をクリック\n# 数分後に https://ユーザー名.github.io/リポジトリ名 で公開される',
     mac:'同上。'},
  ],
  code:'# GitHub Pagesを使うためのリポジトリ構成\nmy-portfolio/\n├── index.html   ← トップページ（必須）\n├── style.css\n├── main.js\n└── assets/\n    └── img/',
  expectedOutput:'ブラウザで https://ユーザー名.github.io/リポジトリ名（公開URL） を開くと自分のHTMLが表示される。',
  errors:[
    {msg:'404 Not Found（GitHub Pagesが表示されない）', cause:'① Pages設定が完了していない ② index.htmlが存在しない ③ 設定から数分待っていない', fix:'Settings→Pagesで設定を確認。index.htmlがルートにあるか確認。5分程度待ってから再度アクセス。'},
  ],
  quiz:[
    {q:'GitHub Pagesで公開できないファイル・機能は何ですか？', a:'サーバーサイドの処理（PHP・Python・Java等）・DBへの書き込み・動的なAPI処理。HTML/CSS/JSだけの静的サイトのみ公開可能。'},
  ],
  miniTask:'Phase 0で作ったフォルダかdemoフォルダをGitHubにpushしてGitHub Pagesで公開し、URLをスクリーンショットで提出してください。',
  aiOk:['GitHub Pagesにカスタムドメインを設定する方法を教えてください'],
  aiNg:[],
  interviewQ:['GitHub Pagesとは何ですか？どんなサイトが公開できますか？'],
  nextLesson:'l04-5-2'
},

'l04-5-2': {
  id:'l04-5-2', chapter:'c04-5', num:'4-5-2',
  title:'チーム開発のGitフロー（GitHubFlow入門）',
  duration:'15分',
  goal:'GitHubFlowの概念（main→feature→PR→merge）を説明でき、実際の現場でどのように使われるかを述べられる。',
  why:'個人開発でもGitHubFlowを意識して作業すると、後でチーム開発に移行しやすい。SES案件でのチーム参画時に即戦力になれる。',
  fieldUse:'GitHub FlowはGitHub・Vercel・スタートアップで広く使われている。Gitflowとの違いも理解しておく。',
  analogy:'GitHubFlowは「提案書→レビュー→承認→本採用」のサイクル。featureブランチが提案書、PRがレビューの場、mergeが本採用。',
  terms:[
    {term:'GitHubFlow', meaning:'mainブランチ+featureブランチ+PRというシンプルなブランチ戦略。常にmainをデプロイ可能な状態に保つ。'},
    {term:'Gitflow', meaning:'main・develop・feature・release・hotfixの5種類のブランチを使うより複雑な戦略。大規模リリース管理に向く。'},
  ],
  steps:[],
  code:'# GitHubFlow の基本的な流れ\n# 1. mainから新しいブランチを作る\ngit switch -c feature/新機能名\n\n# 2. 変更を加えてコミット（こまめに）\ngit add . && git commit -m "feat: 変更内容"\n\n# 3. GitHubにpush\ngit push origin feature/新機能名\n\n# 4. GitHubでPRを作成 → レビュー → Approve\n# 5. mainにマージ（GitHub上のボタンで）\n# 6. ローカルのmainを最新化\ngit switch main && git pull\n# 7. マージ済みブランチを削除\ngit branch -d feature/新機能名',
  expectedOutput:'GitHubFlowのサイクルを1回完遂できる。',
  errors:[],
  quiz:[
    {q:'GitHubFlowでmainブランチはどういう状態を保つべきですか？', a:'常にデプロイ可能な状態（テストが通り、本番に出せる状態）を保つ。'},
  ],
  miniTask:'GitHubFlow の流れで「ナビゲーションを追加する」フィーチャーを実装し、PRを出してセルフマージしてください。',
  aiOk:['GitflowとGitHubFlowの使い分けを教えてください'],
  aiNg:[],
  interviewQ:['現場でのブランチ運用ルールはどうしていましたか（または考えていますか）？'],
  nextLesson: null
}

}; // end LESSON_P04