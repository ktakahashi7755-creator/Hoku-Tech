/* =========================================================
   data/skillchecks.js  ─  全 Phase スキルチェック
   ========================================================= */
window.SKILLCHECKS = {

p00: { phase:'p00', title:'Phase 0 スキルチェック',
questions:[
  {id:'sc00-01',type:'choice',q:'ターミナルで現在のフォルダのファイル一覧を表示するコマンドは？',choices:['ls','cd','mkdir','pwd'],answer:'ls',explanation:'ls（Macまたはpower shell以外）またはdir（Windowsのcmd）でファイル一覧を表示できる。'},
  {id:'sc00-02',type:'choice',q:'「ひとつ上の階層」のフォルダに移動するコマンドは？',choices:['cd ..','cd /','cd ~','cd -'],answer:'cd ..',explanation:'cd ..（ドット2つ）で親ディレクトリに移動する。cd ~はホームディレクトリ、cd /はルートディレクトリ。'},
  {id:'sc00-03',type:'text',q:'VS Codeのコマンドパレットを開くキーボードショートカットは？（Windows）',answer:'Ctrl+Shift+P',explanation:'Ctrl+Shift+P（Win）またはCmd+Shift+P（Mac）でコマンドパレットを開く。全ての機能をキーボードで実行できる。'},
  {id:'sc00-04',type:'choice',q:'.gitignoreファイルの役割は何ですか？',choices:['Gitの設定ファイル','Gitの管理対象外にするファイルを記述する','コミットメッセージのテンプレート','ブランチの設定'],answer:'Gitの管理対象外にするファイルを記述する',explanation:'.gitignoreに記述したファイル・フォルダはGitに追跡されない。node_modules・.envなどを記述する。'},
  {id:'sc00-05',type:'text',q:'Node.jsのバージョンを確認するコマンドは？',answer:'node --version または node -v',explanation:'node --version または node -v でインストールされているNode.jsのバージョンを表示できる。'},
  {id:'sc00-06',type:'choice',q:'パス「~/Desktop/dev/project」の「~」は何を意味しますか？',choices:['ルートディレクトリ','現在のディレクトリ','ホームディレクトリ','親ディレクトリ'],answer:'ホームディレクトリ',explanation:'~はホームディレクトリ（/Users/ユーザー名またはC:\\Users\\ユーザー名）を指す省略記法。'},
  {id:'sc00-07',type:'text',q:'ファイルの拡張子が.jsの場合、何のファイルですか？',answer:'JavaScriptファイル',explanation:'.jsはJavaScriptのファイル拡張子。.tsはTypeScript・.htmlはHTML・.cssはCSS・.javaはJava。'},
  {id:'sc00-08',type:'choice',q:'VS CodeのLive Serverはどんな用途に使いますか？',choices:['ターミナルを開く','HTMLファイルをブラウザでリアルタイムプレビューする','JavaScriptをコンパイルする','GitHubにコードをpushする'],answer:'HTMLファイルをブラウザでリアルタイムプレビューする',explanation:'Live Server拡張はHTMLファイルを保存するたびにブラウザを自動リロードする開発サーバーを起動する。'},
  {id:'sc00-09',type:'code',q:'以下のターミナルコマンドの意味を説明してください：mkdir myapp && cd myapp',answer:'mkdir myappでmyappというフォルダを作成し（&&で繋いで）続けてそのフォルダに移動するコマンド。&&は前のコマンドが成功した場合のみ次を実行する。',explanation:'&&（論理AND）で複数のコマンドを繋げて一行で実行できる。'},
  {id:'sc00-10',type:'choice',q:'Gitをインストールした後、コミット時に必要な最初の設定は何ですか？',choices:['パスワードの設定','ユーザー名とメールアドレスの設定','SSHキーの生成','リポジトリの初期化'],answer:'ユーザー名とメールアドレスの設定',explanation:'git config --global user.name "名前" と git config --global user.email "メール" を設定しないとコミット時にエラーになる。'}
]},

p01: { phase:'p01', title:'Phase 1 スキルチェック',
questions:[
  {id:'sc01-01',type:'choice',q:'HTTPステータスコード404は何を意味しますか？',choices:['サーバーエラー','認証が必要','リソースが見つからない','リクエストが成功'],answer:'リソースが見つからない',explanation:'404 Not Found。リクエストしたURL・リソースがサーバーに存在しない。500はサーバーエラー、401は認証エラー、200は成功。'},
  {id:'sc01-02',type:'text',q:'REST APIでデータを新規作成する時に使うHTTPメソッドは何ですか？',answer:'POST',explanation:'POST（作成）・GET（取得）・PUT/PATCH（更新）・DELETE（削除）がREST APIの基本。'},
  {id:'sc01-03',type:'choice',q:'JSONの説明として正しいのはどれですか？',choices:['JavaScriptでしか使えないデータ形式','キーと値のペアで構造化データを表すテキスト形式','バイナリ形式のデータ','XMLと同じ形式'],answer:'キーと値のペアで構造化データを表すテキスト形式',explanation:'JSON（JavaScript Object Notation）はテキストベースの軽量データ形式。JavaScript以外でも全ての言語で使える。'},
  {id:'sc01-04',type:'code',q:'以下のJavaScriptコードの出力は何ですか？\nconst json = \'{"name":"山田","age":25}\';\nconst obj = JSON.parse(json);\nconsole.log(obj.name);',answer:'山田',explanation:'JSON.parse()でJSON文字列をJSオブジェクトに変換する。obj.nameで"山田"が取得できる。'},
  {id:'sc01-05',type:'choice',q:'クライアントサーバーモデルで「クライアント」は何を指しますか？',choices:['データを保存するサーバー','サービスを要求する側（ブラウザ等）','APIを提供するサーバー','データベース'],answer:'サービスを要求する側（ブラウザ等）',explanation:'クライアント（=要求側）がサーバー（=提供側）にリクエストを送り、レスポンスを受け取る。'},
  {id:'sc01-06',type:'text',q:'HTTPSとHTTPの違いは何ですか？（1文で）',answer:'HTTPSはHTTPに暗号化（TLS/SSL）を加えたもので通信内容を盗聴・改ざんから守る',explanation:'HTTPはデータをそのまま送受信するが、HTTPSはTLS/SSLで暗号化する。現代のWebはほぼHTTPS必須。'},
  {id:'sc01-07',type:'choice',q:'DNS（Domain Name System）の役割は何ですか？',choices:['IPアドレスの割り当て','ドメイン名をIPアドレスに変換する','HTTPSの暗号化','データベースの管理'],answer:'ドメイン名をIPアドレスに変換する',explanation:'DNSはドメイン名（example.com）をIPアドレス（93.184.216.34）に変換する「インターネットの住所録」。'},
  {id:'sc01-08',type:'choice',q:'SES（System Engineering Service）とはどんな働き方ですか？',choices:['自社プロダクトを作る会社','エンジニアをクライアントに派遣してサービスを提供するビジネスモデル','フリーランス','リモートワーク専門の会社'],answer:'エンジニアをクライアントに派遣してサービスを提供するビジネスモデル',explanation:'SESはエンジニアの時間単価で稼ぐビジネスモデル。様々な現場・技術を経験できるが案件依存。'},
  {id:'sc01-09',type:'text',q:'DevToolsのNetworkタブは何を確認するために使いますか？',answer:'全てのHTTPリクエスト・レスポンスを確認するために使う。APIの呼び出し状況・ステータスコード・レスポンス内容を調査できる。',explanation:'Networkタブはページ読み込み時・操作時に発生する全HTTPリクエストを記録する。APIのデバッグに必須。'},
  {id:'sc01-10',type:'choice',q:'Webアプリの「3層アーキテクチャ」の3つとは何ですか？',choices:['HTML・CSS・JavaScript','フロントエンド・バックエンド・データベース','クライアント・サーバー・ネットワーク','デザイン・開発・テスト'],answer:'フロントエンド・バックエンド・データベース',explanation:'Presentation層（フロント）・Application層（バック）・Data層（DB）の3層でWebシステムは構成される。'}
]},

p02: { phase:'p02', title:'Phase 2 スキルチェック',
questions:[
  {id:'sc02-01',type:'choice',q:'HTMLの<h1>〜<h6>タグの正しい使い方は？',choices:['文字の大きさを決めるためだけに使う','見出しの階層構造を表すために使う','ブロック要素を作るために使う','CSSクラスを適用するために使う'],answer:'見出しの階層構造を表すために使う',explanation:'<h1>はページの主題（1ページに1つ推奨）・<h2>はセクション見出しなど、見出しの階層を表す。文字サイズの調整はCSSで行う。'},
  {id:'sc02-02',type:'text',q:'CSSのdisplay: flex と display: grid の使い分けを教えてください。',answer:'Flexboxは1次元（横か縦の1方向）のレイアウトに、Gridは2次元（横と縦両方）のレイアウトに適している。ナビゲーションはFlex、カードグリッドはGridが多い。',explanation:'Flexboxは1方向の並べ方を制御、Gridは行と列の2次元グリッドを定義する。'},
  {id:'sc02-03',type:'code',q:'以下のCSSで「justify-content: space-between」は何をしますか？\n.container { display: flex; justify-content: space-between; }',answer:'フレックスコンテナ内のアイテムを主軸方向に均等に配置して、最初と最後のアイテムを両端に配置する。',explanation:'space-betweenは要素間に等しいスペースを設け、両端には余白を作らない。ナビゲーションのロゴ・メニュー配置によく使う。'},
  {id:'sc02-04',type:'choice',q:'<meta name="viewport" content="width=device-width, initial-scale=1.0"> は何のために必要ですか？',choices:['SEO対策','スマホでのレスポンシブ表示を正しく機能させる','ページの言語を設定する','文字コードを設定する'],answer:'スマホでのレスポンシブ表示を正しく機能させる',explanation:'このmetaタグがないと、スマホブラウザがPC画面のレイアウトを縮小して表示するため、メディアクエリが効かなくなる。'},
  {id:'sc02-05',type:'text',q:'CSSのposition: absolute と position: fixed の違いは何ですか？',answer:'absoluteは最も近い position: relative の親要素を基準に配置される。fixedはビューポート（画面）を基準に配置されてスクロールしても同じ位置に固定される。',explanation:'absoluteは親要素基準、fixedは画面基準。fixedはヘッダー・フッターの固定に使われる。'},
  {id:'sc02-06',type:'choice',q:'@media (max-width: 768px) { ... } はどの画面サイズに適用されますか？',choices:['768px以上の画面','768px以下の画面','768pxちょうどの画面','全ての画面'],answer:'768px以下の画面',explanation:'max-widthは「最大この幅まで」という意味。768px以下（スマホ・タブレット）の画面に適用される。'},
  {id:'sc02-07',type:'code',q:'CSSカスタムプロパティを定義して使う書き方を答えてください。',answer:':root { --color-primary: #2563eb; } .btn { background: var(--color-primary); }',explanation:':rootで--変数名を定義してvar(--変数名)で参照する。テーマカラーの一元管理に使う。'},
  {id:'sc02-08',type:'text',q:'HTMLフォームでPOSTメソッドを使う場合とGETメソッドを使う場合の違いは？',answer:'GETはURLにパラメータを付けて送信（検索フォームなど）、POSTはボディにデータを入れて送信（ログイン・登録など機密情報を含む場合）。',explanation:'GETはURLにデータが見える・ブックマーク可能。POSTはURLに見えない・大量データ・機密情報に向く。'},
  {id:'sc02-09',type:'choice',q:'Flexboxのflex: 1 の意味は何ですか？',choices:['幅を1pxにする','利用可能なスペースを均等に占める','z-indexを1にする','ボーダーを1pxにする'],answer:'利用可能なスペースを均等に占める',explanation:'flex: 1 はflex-grow: 1, flex-shrink: 1, flex-basis: 0の省略形。全アイテムにflex: 1を指定すると均等分割される。'},
  {id:'sc02-10',type:'text',q:'CSS Gridのgrid-template-columns: repeat(auto-fill, minmax(280px, 1fr))はどんなレイアウトを作りますか？',answer:'最小280pxで1fr（利用可能スペース）まで広がるカラムを画面幅に合わせて自動で詰め込む。画面が広い時は多列、狭い時は少列になるレスポンシブなグリッドレイアウト。',explanation:'auto-fillとminmaxの組み合わせでメディアクエリなしのレスポンシブグリッドが作れる。'}
]},

p03: { phase:'p03', title:'Phase 3 スキルチェック',
questions:[
  {id:'sc03-01',type:'choice',q:'JavaScriptのconstとletの違いは？',choices:['constは数値のみ、letは文字列のみ','constは再代入不可、letは再代入可能','constはグローバルスコープ、letはローカルスコープ','constはブロックスコープ外でも使える'],answer:'constは再代入不可、letは再代入可能',explanation:'constは宣言後に再代入できない。オブジェクトのプロパティ変更は可能（参照が変わらないため）。原則constを使い、再代入が必要な時だけletを使う。'},
  {id:'sc03-02',type:'code',q:'以下のコードの出力を答えてください：\nconst nums = [1,2,3,4,5];\nconst result = nums.filter(n => n%2===0).map(n => n*10);\nconsole.log(result);',answer:'[20, 40]',explanation:'filterで偶数（2,4）を抽出し、mapで10倍にすると[20,40]になる。'},
  {id:'sc03-03',type:'text',q:'async/awaitを使う時に関数に付けるキーワードは何ですか？',answer:'async（async function fetchData() {} または const fetchData = async () => {}）',explanation:'asyncキーワードを関数の前に付けることでその関数がPromiseを返す非同期関数になる。関数内でawaitが使えるようになる。'},
  {id:'sc03-04',type:'choice',q:'fetchでHTTP POSTリクエストを送る時に必要な設定は？',choices:['method: "POST"のみ','method: "POST"とheaders: {"Content-Type": "application/json"}とbody: JSON.stringify(data)','urlに?methodをつける','Proxyの設定が必要'],answer:'method: "POST"とheaders: {"Content-Type": "application/json"}とbody: JSON.stringify(data)',explanation:'POSTは①method:"POST"②Content-Typeヘッダー③bodyにJSON.stringifyしたデータ、の3つが必要。'},
  {id:'sc03-05',type:'code',q:'以下のDOM操作コードが何をするか説明してください：\ndocument.querySelector("#list").addEventListener("click", (e) => {\n  if (e.target.classList.contains("delete-btn")) {\n    e.target.closest("li").remove();\n  }\n});',answer:'#listという要素にクリックイベントを設定して、クリックされた要素がdelete-btnクラスを持つ場合に最も近い親のli要素を削除する（イベント委譲パターン）。',explanation:'イベント委譲（event delegation）。親要素に1つイベントを設定して、子要素のイベントを処理するパターン。動的に追加された要素にも有効。'},
  {id:'sc03-06',type:'text',q:'localStorageにオブジェクトを保存する正しい手順は？',answer:'JSON.stringify(obj)でJSON文字列に変換してlocalStorage.setItem("key", json)で保存。取得時はlocalStorage.getItem("key")でJSON文字列を取得してJSON.parse()でオブジェクトに戻す。',explanation:'localStorageは文字列のみ保存できる。オブジェクトはJSON.stringify/parseで変換が必要。'},
  {id:'sc03-07',type:'choice',q:'JavaScriptの===と==の違いは？',choices:['全く同じ','===は型と値の両方を比較、==は型を変換して比較する','===は数値のみ、==は文字列のみ','===はオブジェクト比較、==はプリミティブ比較'],answer:'===は型と値の両方を比較、==は型を変換して比較する',explanation:'5 === "5" はfalse（型が違う）、5 == "5"はtrue（型変換してから比較）。実務では必ず===を使う。'},
  {id:'sc03-08',type:'code',q:'スプレッド構文を使ってtasksに新しいタスクを追加するコードを書いてください。',answer:'const newTasks = [...tasks, {id: Date.now(), title: newTitle, done: false}];',explanation:'スプレッド構文で元の配列を展開して新要素を追加した新しい配列を作る。pushは元の配列を変更するためReactでは使わない。'},
  {id:'sc03-09',type:'text',q:'なぜVanilla JSのToDoアプリよりReactの方が状態管理が楽ですか？',answer:'Vanilla JSでは状態（tasks配列）が変わるたびに手動でDOM更新関数を呼ぶ必要がある。ReactのuseStateは状態変化時に自動で再レンダリングするため、状態更新だけ考えればよく、DOM操作を直接書かなくて済む。',explanation:'宣言的UIの考え方：「状態がこうなったらこう表示する」を定義すれば、Reactが差分更新してくれる。'},
  {id:'sc03-10',type:'choice',q:'fetchでAPIを呼ぶ時、response.ok がfalseの時とは？',choices:['ネットワーク接続エラーの時','HTTPステータスコードが400〜599の時','JSONのパースが失敗した時','タイムアウトした時'],answer:'HTTPステータスコードが400〜599の時',explanation:'response.okはステータスが200〜299の時true。404・500などはfalse。ネットワークエラーはcatchに入る（response.okはチェックされない）。'}
]},

p04: { phase:'p04', title:'Phase 4 スキルチェック',
questions:[
  {id:'sc04-01',type:'text',q:'git add と git commit の違いを説明してください。',answer:'git addは変更をステージング（コミット準備エリア）に追加する操作。git commitはステージングされた変更を履歴として記録する操作。addは「コミットする内容を選ぶ」、commitは「決定して記録する」。',explanation:'Gitは変更の選択（add）と記録（commit）が2ステップに分かれている。複数ファイルの中から特定ファイルだけコミットしたい場合に有用。'},
  {id:'sc04-02',type:'choice',q:'git push -u origin main の -u オプションは何をしますか？',choices:['リモートを削除する','upstreamを設定して以降はgit pushのみで同じブランチにpushできるようにする','強制pushする','新しいブランチを作成する'],answer:'upstreamを設定して以降はgit pushのみで同じブランチにpushできるようにする',explanation:'-u（--set-upstream）オプションで追跡設定をする。一度設定すればgit pushだけでOK。'},
  {id:'sc04-03',type:'text',q:'git clone と git pull の違いを1文で説明してください。',answer:'cloneは最初の1回だけリポジトリをローカルにコピーする。pullは既にcloneしたリポジトリの最新変更をリモートから取り込む。',explanation:'新しく参加するプロジェクトはclone、日々の作業前はpullで最新化する。'},
  {id:'sc04-04',type:'choice',q:'コンフリクトが発生した時に<<<<<<<、=======、>>>>>>>のマーカーが表示されます。=======の上は何を表しますか？',choices:['マージ元のブランチの変更','HEAD（現在のブランチ）の内容','両方が同意した変更','マージ先のブランチの内容'],answer:'HEAD（現在のブランチ）の内容',explanation:'<<<<<<< HEADから=======までが現在のブランチの内容、=======から>>>>>>>が取り込もうとしているブランチの内容。どちらを残すか手動で編集してから git addする。'},
  {id:'sc04-05',type:'code',q:'良いコミットメッセージの例と悪いコミットメッセージの例を1つずつ書いてください。',answer:'良い例：feat: タスク一覧のフィルター機能を追加（Conventional Commits準拠、具体的な変更内容）。悪い例：「修正」「update」（何を変更したか不明）。',explanation:'良いコミットメッセージは「3ヶ月後の自分や他のエンジニアが見てすぐ意味が分かる」ことが基準。'},
  {id:'sc04-06',type:'text',q:'.gitignoreにnode_modulesを追加する理由は何ですか？',answer:'node_modulesは数万ファイル・数百MBになることがある巨大なフォルダで、package.jsonがあればnpm installで再現できる。不要なファイルをGitHubにpushするとリポジトリが肥大化して遅くなる。',explanation:'node_modulesはpackage.jsonから再現できる依存関係なのでバージョン管理不要。'},
  {id:'sc04-07',type:'choice',q:'GitHub Pages で静的サイトを公開する場合、ルートに必要なファイルは？',choices:['app.js','style.css','index.html','README.md'],answer:'index.html',explanation:'GitHub Pagesはルートのindex.htmlをデフォルトページとして表示する。index.htmlがないと404になる。'},
  {id:'sc04-08',type:'text',q:'Pull Request（PR）を出す前に自分でやるべきことを3つ挙げてください。',answer:'①動作確認（全機能をテストした）②コードの自己レビュー（デバッグコード削除・誤字修正）③PR説明文に変更内容・理由・確認方法を記載する。',explanation:'質の高いPRはレビュアーの時間を節約し、マージまでが速くなる。'},
  {id:'sc04-09',type:'choice',q:'GitHubFlowのブランチ戦略の特徴は何ですか？',choices:['mainとdevelopの2ブランチを常に維持する','mainブランチを常にデプロイ可能な状態に保ちfeatureブランチで作業する','リリースごとにブランチを切る','ブランチを使わない'],answer:'mainブランチを常にデプロイ可能な状態に保ちfeatureブランチで作業する',explanation:'GitHubFlowはシンプルで小規模チームやCIが整っているプロジェクトに向く。main+featureのみのシンプルな構成。'},
  {id:'sc04-10',type:'text',q:'コンフリクトを解消した後にcommitするための手順を順番に書いてください。',answer:'①コンフリクトしているファイルを開く②<<<<<<<・=======・>>>>>>>マーカーを削除して正しい内容に編集する③git add ファイル名でステージング④git commit -m "merge: ..."でマージコミットを作成する。',explanation:'コンフリクトマーカーが残ったままcommitするとコードにマーカー文字が入ってしまうので必ず全て削除する。'}
]},

p05: { phase:'p05', title:'Phase 5 スキルチェック',
questions:[
  {id:'sc05-01',type:'choice',q:'ReactのuseStateを使うには何をimportする必要がありますか？',choices:["import React from 'react'",'import { useState } from "react"','import useState from "react"',"import { state } from 'react'"],answer:'import { useState } from "react"',explanation:'Reactの名前付きエクスポートとして提供されているuseStateを分割代入でインポートする。'},
  {id:'sc05-02',type:'code',q:'const [count, setCount] = useState(0); の各部分の意味を説明してください。',answer:'countは現在の状態値（初期値0）、setCountは状態を更新する関数、useState(0)は初期値0でstateを作成するReact Hook。',explanation:'useStateは[現在値, 更新関数]の配列を返す。慣習としてsetXxxという命名を使う。'},
  {id:'sc05-03',type:'text',q:'なぜReactのstateを直接変更してはいけないのですか？',answer:'ReactはsetStateが呼ばれた時だけ再レンダリングする仕組みのため、直接変更しても再レンダリングが起きず画面に反映されない。また予測困難なバグの原因になる。',explanation:'state.push(item)ではなくsetState([...state, item])のように新しい配列を作ってsetStateに渡す。'},
  {id:'sc05-04',type:'choice',q:'propsとstateの違いで正しいものは？',choices:['propsは親から受け取る・子から変更可能、stateは自分が管理する','propsは親から受け取る・読み取り専用、stateは自分が管理して変更できる','propsは外部データ、stateはAPIデータ','propsはサーバーからのデータ、stateはユーザーの入力'],answer:'propsは親から受け取る・読み取り専用、stateは自分が管理して変更できる',explanation:'propsはコンポーネント間のデータの受け渡し（読み取り専用）。stateはコンポーネント内部の変更可能なデータ。'},
  {id:'sc05-05',type:'code',q:'useEffectで「コンポーネントのマウント時にのみ実行する」ための書き方を答えてください。',answer:'useEffect(() => { /* 処理 */ }, []); // 第2引数に空配列を渡す',explanation:'依存配列を[]（空配列）にするとマウント時（初回レンダリング後）のみ実行される。'},
  {id:'sc05-06',type:'text',q:'Reactでリストを表示するために.map()を使う時、なぜkeyが必要ですか？',answer:'ReactがDOMの更新を効率化するために各リストアイテムを識別するキーが必要。keyがないと「どのアイテムが変わったか」を特定できず全て再レンダリングされてパフォーマンスが低下する。また警告も出る。',explanation:'keyは兄弟要素間で一意であればよい。配列のindexをkeyにするのは要素の順序が変わる可能性がある場合に問題が起きる。'},
  {id:'sc05-07',type:'choice',q:'フォームのsubmitハンドラでe.preventDefault()を呼ぶ理由は？',choices:['フォームをリセットするため','フォームのデフォルト送信（ページリロード）を止めるため','バリデーションを実行するため','非同期処理を開始するため'],answer:'フォームのデフォルト送信（ページリロード）を止めるため',explanation:'SPAではページリロードなしでJavaScriptで処理を完結させたいため、デフォルト動作を止める必要がある。'},
  {id:'sc05-08',type:'text',q:'カスタムフックとは何ですか？いつ作りますか？',answer:'useXxxで始まる自作の関数で内部でReact hooksを使うもの。同じuseState+useEffectのパターンを複数コンポーネントで使い回す時や、ロジックをコンポーネントから分離したい時に作る。',explanation:'useFetch・useLocalStorage・useFormのような汎用ロジックをカスタムフックに分離すると再利用性が上がる。'},
  {id:'sc05-09',type:'choice',q:'useEffectのクリーンアップ関数はいつ実行されますか？',choices:['コンポーネントのマウント時','setStateが呼ばれた時','コンポーネントのアンマウント時または次のeffect実行前','依存配列の値が変わった直後'],answer:'コンポーネントのアンマウント時または次のeffect実行前',explanation:'クリーンアップ関数（useEffectのreturnで返す関数）は①コンポーネントが消える時②次のeffect実行の直前に実行される。タイマーやイベントリスナーの後片付けに使う。'},
  {id:'sc05-10',type:'code',q:'タスクリストからid=2のタスクのdoneをtrueに更新するstateの書き方を答えてください。',answer:'setTasks(tasks.map(t => t.id === 2 ? {...t, done: true} : t));',explanation:'mapで全要素を処理してid=2の要素だけdone:trueに書き換えた新しい配列を作ってsetTasksに渡す（イミュータブルな更新）。'}
]},

p06: { phase:'p06', title:'Phase 6 スキルチェック',
questions:[
  {id:'sc06-01',type:'choice',q:'Next.jsのApp RouterでURLが/dashboardになるファイルのパスは？',choices:['pages/dashboard.tsx','src/dashboard/index.tsx','app/dashboard/page.tsx','app/dashboard.tsx'],answer:'app/dashboard/page.tsx',explanation:'App Routerはapp/フォルダ以下のpage.tsxがルートになる。app/dashboard/page.tsxが/dashboardのページ。'},
  {id:'sc06-02',type:'text',q:'Server ComponentとClient Componentの使い分けを説明してください。',answer:'Server Componentはサーバーで実行。データ取得・DBアクセス・SEOに適する。useState/useEffect/イベントハンドラは使えない。Client Componentは"use client"を先頭に書いてブラウザで実行。インタラクション・useStateが必要な場合に使う。',explanation:'App Routerのデフォルトはサーバーコンポーネント。インタラクティブな部分だけ"use client"にするのがベスト。'},
  {id:'sc06-03',type:'code',q:'Next.jsのApp Routerで動的ルート（/posts/1・/posts/2）を実現するファイルパスとpropsの受け取り方は？',answer:'app/posts/[id]/page.tsxを作成して、function PostPage({ params }: { params: { id: string } }) のようにparamsからidを受け取る。',explanation:'[id]のようにフォルダ名を[]で囲むと動的ルートになる。paramsオブジェクトでURLパラメータを受け取る。'},
  {id:'sc06-04',type:'choice',q:'Next.jsのLinkコンポーネントを<a>タグの代わりに使う理由は？',choices:['見た目が変わる','クライアントサイドナビゲーションでページ全体リロードなしに遷移できる','SEOに有利','CSSが自動適用される'],answer:'クライアントサイドナビゲーションでページ全体リロードなしに遷移できる',explanation:'<a href>はページリロードが発生する。<Link href>はSPA的なナビゲーションで必要なコンポーネントだけ更新するため速い。'},
  {id:'sc06-05',type:'text',q:'Vercelに自動デプロイが行われるタイミングはいつですか？',answer:'GitHubの本番ブランチ（mainなど）にpushされた時。PRごとにプレビュー環境も自動作成される。',explanation:'Vercelはコードpushを検知して自動でビルド・デプロイを実行する。デプロイ状況はVercelのダッシュボードで確認できる。'},
  {id:'sc06-06',type:'choice',q:'Next.jsの環境変数でブラウザからアクセスできるのはどの書き方ですか？',choices:['DATABASE_URL=xxx','PRIVATE_KEY=xxx','NEXT_PUBLIC_API_URL=xxx','APP_SECRET=xxx'],answer:'NEXT_PUBLIC_API_URL=xxx',explanation:'NEXT_PUBLIC_で始まる環境変数のみブラウザのJavaScriptからアクセスできる。それ以外はサーバーサイドのみ。'},
  {id:'sc06-07',type:'text',q:'layout.tsxのchildrenとは何ですか？',answer:'そのlayoutファイルの配下にあるpage.tsxのコンテンツ（またはネストされたlayoutのコンテンツ）。RootLayoutのchildren = ページのJSXが渡される。',explanation:'layout.tsxは<html><body>などの共通部分を定義して、childrenでページのコンテンツを受け取る。'},
  {id:'sc06-08',type:'choice',q:'Next.jsのRoute Handler（app/api/path/route.ts）でGETリクエストを処理するには？',choices:["export default function handler() {}",'export async function GET() { return NextResponse.json(data); }','router.get("/path", handler)',"app.get('/path', handler)"],answer:'export async function GET() { return NextResponse.json(data); }',explanation:'App RouterのRoute HandlerはHTTPメソッド名と同じ関数をexportする。GET・POST・PUT・DELETEをそれぞれexportできる。'},
  {id:'sc06-09',type:'text',q:'Server ComponentでAPIを呼ぶ場合のfetchオプションnext: { revalidate: 60 }は何をしますか？',answer:'60秒ごとにバックグラウンドでデータを再取得する（ISR: Incremental Static Regeneration）。ビルド時に生成した静的HTMLを一定時間後に更新する仕組み。',explanation:'cache: "no-store"は毎回取得、force-cacheはキャッシュを使う、next.revalidateは指定秒ごとに更新。'},
  {id:'sc06-10',type:'code',q:'"use client"を書かないとどんなエラーが起きますか？（具体例）',answer:'"You\'re importing a component that needs useState. It only works in a Client Component but none of its parents are marked with \"use client\"" のようなエラー。useStateやuseEffectをServer Componentで使おうとするとビルドエラーが発生する。',explanation:'useStateなどのReact Hooksはブラウザでしか動かないので、Server Componentでは使えない。'}
]},

p07: { phase:'p07', title:'Phase 7 スキルチェック',
questions:[
  {id:'sc07-01',type:'choice',q:'Javaのpublic static void mainの各キーワードの意味は？',choices:['公開・静的・戻り値なし・メインメソッド','プライベート・静的・void型・メソッド名','公開・インスタンス・戻り値なし・引数','公開・静的・整数型・エントリポイント'],answer:'公開・静的・戻り値なし・メインメソッド',explanation:'public=どこからも呼べる、static=インスタンス不要、void=戻り値なし、main=Javaのエントリポイントの決まり文句。'},
  {id:'sc07-02',type:'text',q:'Javaのint型の範囲を答えてください。また、この範囲を超えた場合何が起きますか？',answer:'intは-2^31〜2^31-1（約-21億〜21億）。範囲を超えると「オーバーフロー」が起き、最小値または最大値に折り返される（例外は投げられない）。大きな数はlongを使う。',explanation:'Javaはオーバーフロー時にエラーを投げない（C言語と同様）。大きな数値ではlongまたはBigIntegerを使う。'},
  {id:'sc07-03',type:'code',q:'Javaのfor-each文を使って配列{"Java","Python","JS"}の全要素を表示するコードを書いてください。',answer:'String[] langs = {"Java","Python","JS"};\nfor (String lang : langs) {\n    System.out.println(lang);\n}',explanation:'for (型 変数 : コレクション)の形式がJavaのfor-each（拡張for）文。インデックスが不要な場合に使う。'},
  {id:'sc07-04',type:'choice',q:'Javaのコンストラクタとは何ですか？',choices:['staticメソッドの一種','インスタンス生成時に自動で呼ばれる特別なメソッド','戻り値がvoidのメソッド','finalキーワードが付いたメソッド'],answer:'インスタンス生成時に自動で呼ばれる特別なメソッド',explanation:'コンストラクタはnewでインスタンスを作る時に自動実行される。戻り値はない（voidも書かない）。フィールドの初期化に使う。'},
  {id:'sc07-05',type:'text',q:'カプセル化とはどういう設計原則ですか？なぜ必要ですか？',answer:'フィールドをprivateにして、publicなgetter/setterのみでアクセスを許可する設計。理由：①setterでバリデーションを入れられる②内部実装を変更してもインターフェース（getter/setter）は変わらない③読み取り専用フィールドが作れる。',explanation:'カプセル化はデータとその操作を「カプセル」に包んで外部から守る設計原則。'},
  {id:'sc07-06',type:'choice',q:'Javaのインターフェースと抽象クラスの主な違いは？',choices:['インターフェースはフィールドを持てる、抽象クラスは持てない','インターフェースは多重実装できる（implements A, B）、抽象クラスは単一継承','インターフェースはpublicのみ、抽象クラスはprivateも可','インターフェースはメソッド実装を持てない（Java 8以降は除く）'],answer:'インターフェースは多重実装できる（implements A, B）、抽象クラスは単一継承',explanation:'Javaは多重継承を許可しないが、インターフェースは多重実装できる。インターフェースは「型の契約」、抽象クラスは「共通実装の共有」。'},
  {id:'sc07-07',type:'code',q:'以下のJavaコードの出力を答えてください：\nList<Integer> nums = List.of(1,2,3,4,5);\nList<Integer> result = nums.stream().filter(n -> n>3).map(n -> n*10).collect(Collectors.toList());\nSystem.out.println(result);',answer:'[40, 50]',explanation:'stream()でStreamを作り、filter(n>3)で[4,5]を抽出し、map(n*10)で[40,50]に変換し、collectでListに戻す。'},
  {id:'sc07-08',type:'text',q:'Javaの例外処理でfinallyブロックはいつ実行されますか？',answer:'try-catchの実行結果に関わらず必ず実行される。try内で処理が成功してもcatchに入ってもfinallyは実行される。DBやファイルのクローズ処理など後片付けに使う。',explanation:'finallyはリソース解放に使う重要なブロック。try-with-resourcesを使えばfinallyなしでリソースを自動解放できる。'},
  {id:'sc07-09',type:'choice',q:'JacksonのObjectMapper.writeValueAsString()は何をしますか？',choices:['JSON文字列をJavaオブジェクトに変換する','JavaオブジェクトをJSON文字列に変換する','XMLをJSONに変換する','Javaオブジェクトをバイト列に変換する'],answer:'JavaオブジェクトをJSON文字列に変換する',explanation:'writeValueAsString()はJava→JSON（シリアライズ）。readValue()はJSON→Java（デシリアライズ）。Spring BootのAPIでJSONを返す時に内部で使われる。'},
  {id:'sc07-10',type:'text',q:'OOPの4原則（カプセル化・継承・ポリモーフィズム・インターフェース）を各1文で説明してください。',answer:'カプセル化=データをprivateにして窓口（getter/setter）経由でのみアクセスさせる。継承=親クラスの機能を子クラスが引き継ぐ（extends）。ポリモーフィズム=同じメソッド名が異なるクラスで異なる動作をする（@Override）。インターフェース=メソッドの「契約」を定義して実装クラスに強制する（implements）。',explanation:'OOPの4原則はJava面談の頻出質問。具体的なコード例を交えて説明できると良い。'}
]},

p08: { phase:'p08', title:'Phase 8 スキルチェック',
questions:[
  {id:'sc08-01',type:'choice',q:'SQLのINNER JOINとLEFT JOINの違いは？',choices:['INNER JOINは全テーブル結合、LEFT JOINは2テーブルのみ','INNER JOINは両テーブルに存在するレコードのみ、LEFT JOINは左テーブルの全件+右テーブルの一致するもの','INNER JOINは高速、LEFT JOINは低速','LEFT JOINは右テーブルを全件返す'],answer:'INNER JOINは両テーブルに存在するレコードのみ、LEFT JOINは左テーブルの全件+右テーブルの一致するもの',explanation:'INNER JOIN=両方に存在するもの、LEFT JOIN=左テーブルを全件（右に存在しない場合はNULL）。'},
  {id:'sc08-02',type:'text',q:'なぜUPDATE文にはWHERE句を付けるべきですか？',answer:'WHEREなしのUPDATEはテーブルの全レコードを更新してしまう。意図していない全件更新は本番DBでは重大な障害になる。必ずWHEREで対象を絞り込む。',explanation:'DELETE文も同様。WHERE忘れは初心者の最も危険なミスの一つ。本番作業前はSELECTで確認してからUPDATE/DELETEを実行する習慣をつける。'},
  {id:'sc08-03',type:'code',q:'ユーザー別のタスク完了数を取得するSQLを書いてください（usersとtasksテーブル）。',answer:'SELECT u.name, COUNT(t.id) as done_count FROM users u LEFT JOIN tasks t ON u.id = t.user_id AND t.done = TRUE GROUP BY u.id, u.name;',explanation:'LEFT JOINでタスクがいないユーザーも表示。GROUP BYでユーザーごとにグループ化。COUNT(t.id)は結合されたタスクのIDを数える（NULL=0）。'},
  {id:'sc08-04',type:'choice',q:'トランザクションのACIDのAは何を意味しますか？',choices:['Availability','Atomicity（原子性）','Authentication','Authorization'],answer:'Atomicity（原子性）',explanation:'Atomicity=トランザクション内の操作は全て成功か全て失敗のどちらか（中途半端な状態にならない）。'},
  {id:'sc08-05',type:'text',q:'DBインデックスの仕組みとメリット・デメリットを説明してください。',answer:'インデックスはBツリー構造でデータへの高速な参照先を記録する。メリット：SELECTが高速になる。デメリット：INSERTやUPDATE時にインデックスも更新するためオーバーヘッドが増える・ストレージが増える。',explanation:'検索頻度が高いカラム（WHERE句に頻出）にインデックスを付ける。全カラムには付けない。'},
  {id:'sc08-06',type:'choice',q:'多対多のリレーション（タスクとタグ）をRDBで表現する方法は？',choices:['tasksテーブルにtag_id列を追加する','tagsテーブルにtask_id列を追加する','task_tagsという中間テーブルを作成する','外部キーは使わない'],answer:'task_tagsという中間テーブルを作成する',explanation:'多対多は直接外部キーで表現できないため中間テーブル（関連テーブル）を作る。task_tagsはtask_idとtag_idの外部キーを持つ。'},
  {id:'sc08-07',type:'text',q:'SQLのGROUP BYとHAVINGの使い分けを説明してください。',answer:'GROUP BYはデータをグループ化して集計する。WHEREはGROUP BY前の元データを絞り込む。HAVINGはGROUP BY後の集計結果を絞り込む（例：タスクが3件以上のユーザーのみ）。',explanation:'WHERE=元データ絞り込み（GROUP BY前）、HAVING=集計結果絞り込み（GROUP BY後）の使い分けが重要。'},
  {id:'sc08-08',type:'code',q:'EXPLAINコマンドは何のために使いますか？簡単に説明してください。',answer:'EXPLAIN SELECT ... でSQLの実行計画を確認する。type列がALLならフルスキャン（遅い）、refやrangeならインデックス使用（速い）。ボトルネックのあるクエリを特定してインデックス追加などのチューニングに使う。',explanation:'EXPLAIN type=ALLはパフォーマンス問題のサイン。インデックスを追加してrefかrangeに改善する。'},
  {id:'sc08-09',type:'choice',q:'spring.jpa.hibernate.ddl-auto=updateを本番で使ってもよいですか？',choices:['はい、常にupdateを使うべきです','いいえ、本番ではFlywayやLiquibaseなどのマイグレーションツールを使うべきです','はい、createよりupdateの方が安全です','どちらでも同じです'],answer:'いいえ、本番ではFlywayやLiquibaseなどのマイグレーションツールを使うべきです',explanation:'ddl-auto=updateはHibernateがスキーマを自動変更するため予期しない変更が起きる可能性がある。本番ではFlywayやLiquibaseでマイグレーションを管理するのがベストプラクティス。'},
  {id:'sc08-10',type:'text',q:'第3正規形とはどういう状態ですか？1文で説明してください。',answer:'主キー以外のカラムが主キーだけに依存している状態。つまり推移関数従属（非主キーが別の非主キーに依存）がない状態。',explanation:'第3正規形はデータの重複・更新異常を最小化した設計。ただし結合が増えるのでパフォーマンストレードオフがある。'}
]},

p09: { phase:'p09', title:'Phase 9 スキルチェック',
questions:[
  {id:'sc09-01',type:'choice',q:'@RestControllerと@Controllerの違いは？',choices:['@RestControllerはJSONを返す、@ControllerはHTMLビューを返す','@RestControllerはGETのみ、@ControllerはPOSTのみ','@RestControllerはSpring Boot専用、@ControllerはSpring MVC専用','違いはない'],answer:'@RestControllerはJSONを返す、@ControllerはHTMLビューを返す',explanation:'@RestControllerは@Controller + @ResponseBodyの合成。全メソッドが@ResponseBody付きになるためJSONを返す。@Controllerは主にThymeleafなどのビューを返す。'},
  {id:'sc09-02',type:'text',q:'Spring BootのDI（依存性注入）とは何ですか？なぜコンストラクタインジェクションが推奨されますか？',answer:'DIはSpringが管理するBeanを自動で注入する仕組み。コンストラクタインジェクションが推奨される理由：①テスト時にモックを差し込みやすい②フィールドをfinalにできる③必須依存関係が明確になる。',explanation:'@Autowiredフィールドインジェクションより、コンストラクタインジェクションがSpring公式でも推奨。'},
  {id:'sc09-03',type:'code',q:'Spring BootでURLが/api/tasks/{id}のGETリクエストを処理するコードを書いてください。',answer:'@GetMapping("/{id}")\npublic TaskResponse getTask(@PathVariable Long id) {\n    return taskService.findById(id);\n}',explanation:'@GetMapping("/{id}")でURLパスパラメータを定義し、@PathVariableで受け取る。'},
  {id:'sc09-04',type:'choice',q:'Spring BootでEntityをそのままAPIのレスポンスとして返してはいけない理由は？',choices:['Entityはシリアライズできないから','パスワードなど機密情報が漏れる可能性があり、循環参照でJSONが壊れる可能性があるから','パフォーマンスが悪いから','Spring Bootの仕様で禁止されているから'],answer:'パスワードなど機密情報が漏れる可能性があり、循環参照でJSONが壊れる可能性があるから',explanation:'Entityには全フィールドが含まれる。パスワード・内部IDなどをそのまま返すのはセキュリティリスク。DTOでAPIのレスポンス形式を明示的に定義する。'},
  {id:'sc09-05',type:'text',q:'@ControllerAdviceと@ExceptionHandlerを組み合わせた使い方を説明してください。',answer:'@RestControllerAdviceを付けたクラスを作成して、その中に@ExceptionHandlerを付けたメソッドを定義する。特定の例外が発生した時に全コントローラーから共通のエラーレスポンスを返せる。コントローラーごとに例外処理を書く必要がなくなる。',explanation:'グローバルな例外ハンドリングでエラーレスポンスを統一する。プロジェクト全体でエラーフォーマットが一致するようになる。'},
  {id:'sc09-06',type:'choice',q:'JpaRepositoryのfindByTitleContaining(String keyword)はどんなSQLを実行しますか？',choices:['SELECT * FROM tasks WHERE title = keyword','SELECT * FROM tasks WHERE title LIKE %keyword%','SELECT * FROM tasks WHERE title LIKE keyword%','SELECT * FROM tasks WHERE CONTAINS(title, keyword)'],answer:'SELECT * FROM tasks WHERE title LIKE %keyword%',explanation:'Spring Data JPAはメソッド名からSQLを自動生成する（クエリメソッド）。ContainingはLIKE %xxx%に対応。'},
  {id:'sc09-07',type:'text',q:'@Transactionalアノテーションを付ける目的は何ですか？',answer:'メソッド全体をDBトランザクションで包むため。複数のDB操作（INSERT・UPDATE等）をする場合に、どれか1つが失敗した時に全てロールバックして整合性を保つ。Spring Bootでは@Transactionalがあれば自動でCOMMIT/ROLLBACKを管理する。',explanation:'Spring BootはAOPを使って@Transactionalを処理する。Serviceメソッドに付けることが多い。'},
  {id:'sc09-08',type:'code',q:'Spring BootでCORSエラーを解決するためのグローバル設定クラスの骨格を書いてください。',answer:'@Configuration\npublic class WebConfig implements WebMvcConfigurer {\n    @Override\n    public void addCorsMappings(CorsRegistry registry) {\n        registry.addMapping("/api/**")\n            .allowedOrigins("http://localhost:3000");\n    }\n}',explanation:'WebMvcConfigurerのaddCorsMappingsをオーバーライドしてCORSを設定する。本番では実際のフロントのURLを指定する。'},
  {id:'sc09-09',type:'choice',q:'@Validアノテーションを付ける場所はどこですか？',choices:['Entityクラスに付ける','@RequestBodyの引数の前に付ける','RepositoryインターフェースのメソッドのDTO引数の前に付ける','Controllerクラスに付ける'],answer:'@RequestBodyの引数の前に付ける',explanation:'@PostMapping public ResponseEntity create(@Valid @RequestBody TaskRequest req)のように、バリデーション対象のDTOの前に@Validを付ける。これによりDTO内の@NotBlankなどのアノテーションが実行される。'},
  {id:'sc09-10',type:'text',q:'Spring BootのController・Service・Repositoryの役割をそれぞれ1文で説明してください。',answer:'Controller=HTTPリクエストを受け取りServiceを呼んでレスポンスを返す（受付窓口）。Service=ビジネスロジック（バリデーション・データ変換・複数Repositoryの協調）を実行する（業務担当者）。Repository=DBのCRUD操作を担当する（倉庫係）。JpaRepositoryを継承してfindAll・saveなどのメソッドを自動生成する。',explanation:'3層の責務分離はSpring Bootの基本設計。Controllerに全部書くと保守不可能になる。'}
]},

p10: { phase:'p10', title:'Phase 10 スキルチェック',
questions:[
  {id:'sc10-01',type:'text',q:'Pythonのvenvとはなぜ使いますか？',answer:'プロジェクトごとに独立したPythonパッケージ環境を作るため。グローバルにパッケージをインストールするとプロジェクト間でバージョン競合が起きる。venvで分離することで「このプロジェクトはrequests==2.28を使うが別のプロジェクトはrequests==2.25を使う」といった状況を安全に管理できる。',explanation:'npmのnode_modules（package.json）に相当する仕組み。'},
  {id:'sc10-02',type:'code',q:'PythonでCSVファイルを読み込んでpandasのDataFrameに格納するコードを書いてください。',answer:'import pandas as pd\ndf = pd.read_csv("data.csv", encoding="utf-8")',explanation:'pd.read_csvでCSVを読み込みDataFrameに格納する。encodingで文字コードを指定。日本語CSVはutf-8またはshift_jisが多い。'},
  {id:'sc10-03',type:'choice',q:'Pythonのリスト内包表記 [x for x in range(10) if x % 2 == 0] の結果は？',choices:['[1,3,5,7,9]','[0,2,4,6,8]','[0,1,2,3,4,5,6,7,8,9]','[]'],answer:'[0,2,4,6,8]',explanation:'range(10)は0〜9。if x % 2 == 0で偶数のみフィルタリング。結果は0・2・4・6・8の5要素リスト。'},
  {id:'sc10-04',type:'text',q:'Pythonのtry-except-finallyブロックの各部分はいつ実行されますか？',answer:'tryブロックは正常な処理を書く。exceptブロックは例外が発生した時に実行される。finallyブロックは例外の有無に関わらず必ず実行される（ファイルのcloseなどの後片付けに使う）。',explanation:'Javaのtry-catch-finallyと同じ役割。Pythonでは複数のexcept節を書いて例外の種類ごとに処理を分けられる。'},
  {id:'sc10-05',type:'choice',q:'pandasのdf.groupby("dept")["score"].mean()は何をしますか？',choices:['deptカラムを削除する','scoreカラムをmean（平均）で置換する','deptカラムでグループ化してscoreの平均を計算する','deptとscoreをくっつける'],answer:'deptカラムでグループ化してscoreの平均を計算する',explanation:'groupby()で指定カラムでグループ化し、["score"]で集計対象を選択し、.mean()で平均を計算する。SQLのGROUP BY+AVG()に相当。'},
  {id:'sc10-06',type:'code',q:'Pythonのrequestsライブラリで外部APIにGETリクエストを送るコードを書いてください。',answer:"import requests\nresponse = requests.get('https://api.example.com/data')\nif response.status_code == 200:\n    data = response.json()\nprint(data)",explanation:'requestsのget()でGETリクエストを送り、status_codeで成功確認、.json()でJSONをPython辞書に変換する。'},
  {id:'sc10-07',type:'text',q:'PythonでExcelファイルを出力するためのライブラリは何ですか？どのようなコードで出力しますか？',answer:'openpyxlまたはpandas（xlsxwriter使用）。pandasの場合：df.to_excel("output.xlsx", index=False, sheet_name="データ")で出力できる。',explanation:'pandasのDataFrameから直接Excelを生成できる。複数シートや書式設定が必要な場合はopenpyxlを使う。'},
  {id:'sc10-08',type:'choice',q:'Pythonのpathlib.Pathで2つのパスを結合する方法は？',choices:['Path("data").join("file.csv")','Path("data") + "file.csv"','Path("data") / "file.csv"','os.path.join("data", "file.csv")'],answer:'Path("data") / "file.csv"',explanation:'pathlibでは/演算子でパスを結合する。OS差異を気にせず使えるのがpathlibのメリット。'},
  {id:'sc10-09',type:'text',q:'Pythonのクラスの__init__メソッドとselfの役割を説明してください。',answer:'__init__はインスタンス生成時に自動で呼ばれるコンストラクタ。selfはインスタンス自身を指す参照（Javaのthisに相当）。selfをメソッドの第1引数に明示的に書くのがPythonの規則。self.name = nameでインスタンス変数を定義する。',explanation:'Javaのコンストラクタとthisに相当。Pythonはselfを明示的に書く必要がある。'},
  {id:'sc10-10',type:'code',q:'Pythonのコードで2つのCSVをpandasでマージ（SQL JOINに相当）するコードを書いてください。',answer:"import pandas as pd\nusers = pd.read_csv('users.csv')\ntasks = pd.read_csv('tasks.csv')\nmerged = pd.merge(tasks, users, left_on='user_id', right_on='id', how='left')",explanation:'pd.mergeはSQLのJOINに相当。left_on/right_onで結合キーを指定。howはleft/inner/right/outerが使える。'}
]},

p11: { phase:'p11', title:'Phase 11 スキルチェック',
questions:[
  {id:'sc11-01',type:'text',q:'プロンプトの4要素を挙げてください。',answer:'①役割（あなたは〇〇エンジニアです）②前提（使用技術・状況）③制約（やってはいけないこと）④出力形式（コードのみ・日本語コメント等）',explanation:'4要素が揃うとAIの出力精度が大幅に上がる。特に制約と出力形式は省略されがち。'},
  {id:'sc11-02',type:'choice',q:'AIの出力をそのままコードにコミットしてはいけない理由は？',choices:['AIが常に間違っているから','セキュリティリスク・理解していないバグが含まれる可能性があり面談で説明できないから','著作権の問題があるから','コードが重くなるから'],answer:'セキュリティリスク・理解していないバグが含まれる可能性があり面談で説明できないから',explanation:'AI出力は必ず理解・レビューしてから採用する。「なぜこのコードか」を説明できない状態でコミットすると面談で詰まる。'},
  {id:'sc11-03',type:'text',q:'CLAUDE.mdに書くと効果的な内容を5つ挙げてください。',answer:'①プロジェクト概要・目的②技術スタック（バージョン含む）③ディレクトリ構成④コーディング規約・命名規則⑤自分の習熟度（初心者、日本語コメント必要等）',explanation:'CLAUDE.mdの情報が多いほどClaudeがプロジェクトを理解して適切なコードを生成できる。'},
  {id:'sc11-04',type:'choice',q:'AIを使うべきでない作業はどれですか？',choices:['エラーメッセージの解読','ボイラープレートコードの生成','機密情報（APIキー・顧客データ）を含むプロンプトの送信','テストケースの洗い出し'],answer:'機密情報（APIキー・顧客データ）を含むプロンプトの送信',explanation:'AIプロバイダーのサーバーに機密情報が送信される。APIキーは即時invalidate・顧客データはプロンプトに絶対入れない。代わりに—データを使う。'},
  {id:'sc11-05',type:'text',q:'AI利用ログに記録すべき内容を3つ挙げてください。',answer:'①何を依頼したか（プロンプトの概要）②AIの出力を採用したか・修正したか③なぜその採用/修正判断をしたか',explanation:'AI利用の透明性のために記録する。面談で「AIをどう使ったか」を具体的に説明できる状態にするため。'},
  {id:'sc11-06',type:'choice',q:'AIへのエラー相談で最も効果的な情報の組み合わせは？',choices:['エラーメッセージだけを貼る','エラーメッセージ+該当コード+発生状況+確認したこと','エラーが出ました、直してと書く','スクリーンショットだけを貼る'],answer:'エラーメッセージ+該当コード+発生状況+確認したこと',explanation:'医師への症状説明と同じ。情報が多いほど的確な回答が得られる。「直して」だけでは文脈が分からず精度が下がる。'},
  {id:'sc11-07',type:'text',q:'Claude Codeを使う前に何を準備すると効果が高まりますか？',answer:'CLAUDE.mdの整備（プロジェクト概要・技術スタック・コーディング規約・自分の習熟度を記載）。また作業を始める前にGitHub Issueで「何を実装するか」を明確に定義しておくとClaudeに的確に依頼できる。',explanation:'CLAUDE.mdとIssueの組み合わせでClaude Codeの効果が最大化する。'},
  {id:'sc11-08',type:'choice',q:'面談で「AIをどう使いましたか？」と聞かれた時、最も評価される回答は？',choices:['AIは一切使っていませんと答える','エンドポイント設計の叩き台をAIに生成してもらい全行レビューして修正しました、と具体的に答える','全部AIに作ってもらいましたと正直に答える','AIは詳しくないと答える'],answer:'エンドポイント設計の叩き台をAIに生成してもらい全行レビューして修正しました、と具体的に答える',explanation:'AI活用は現代エンジニアのスキル。使った事実より「どう使ったか・何を自分で判断したか」が評価される。'},
  {id:'sc11-09',type:'text',q:'AIに頼ってよい作業と、自分で考えるべき作業を各2つ挙げてください。',answer:'AIに頼ってよい：①定型コードの生成②エラーメッセージの解読。自分で考えるべき：①アーキテクチャ・技術選定の最終判断②セキュリティ上の判断。',explanation:'AIは「知識は豊富だが文脈・経験がない新人」。判断・経験が必要なことは人間が担う。'},
  {id:'sc11-10',type:'text',q:'AIコードレビューで「この指摘を採用すべきか」の判断基準を2つ挙げてください。',answer:'①指摘の内容を自分で理解できるか（理解できない指摘は採用判断できない）②プロジェクトの文脈・要件に合っているか（AIが知らない制約がある可能性）',explanation:'AI指摘を全部採用するのも全部無視するのも危険。理解した上で自分で判断することが重要。'}
]},

p12: { phase:'p12', title:'Phase 12 スキルチェック（最終確認）',
questions:[
  {id:'sc12-01',type:'text',q:'あなたの卒業制作アプリを30秒で説明してください。',answer:'（自分のアプリについて：アプリ名・課題・使用技術・工夫した点の4要素を含める）',explanation:'面談で最初に聞かれる質問。30秒以内にスラスラ言えるまで練習する。'},
  {id:'sc12-02',type:'text',q:'卒業制作でSpring Bootの3層構造（Controller/Service/Repository）をどのように実装しましたか？',answer:'（自分の実装内容を具体的に：Controllerでリクエスト受付→Serviceでバリデーション・ビジネスロジック→Repositoryでjpa操作→DTOでレスポンス返却）',explanation:'具体的なクラス名やコードを交えて説明できると良い。'},
  {id:'sc12-03',type:'text',q:'卒業制作でデプロイした環境と、その選定理由を教えてください。',answer:'（Vercel + Renderの場合：Vercelはnext.jsとの親和性が高く無料でCI/CDが自動化される。RenderはSpring Bootを無料でデプロイできてGitHub連携が簡単。）',explanation:'なぜその技術を選んだかの「理由」が話せることが重要。'},
  {id:'sc12-04',type:'text',q:'卒業制作で最も苦労したことと、どう解決しましたか？',answer:'（自分の経験を答える：CORSエラー・デプロイ時の環境変数設定・フロントとバックの型不一致など）',explanation:'困難を経験してそれを解決したエピソードは面談で高く評価される。具体的に話せるよう準備する。'},
  {id:'sc12-05',type:'text',q:'AIを使って開発した部分と、自分で実装した部分を具体的に教えてください。',answer:'（AI-USAGE.mdの内容を基に回答：AI=ボイラープレート・設計の叩き台、自分=要件判断・バリデーション設計・エラーハンドリングなど）',explanation:'採用担当者はAIを使ったことではなく「どう使ったか・何を自分で判断したか」を見ている。'},
  {id:'sc12-06',type:'text',q:'もし卒業制作にあと1機能追加するとしたら何を追加しますか？その理由も教えてください。',answer:'（例：JWT認証→未認証ユーザーのデータアクセスを防ぐため・本番想定の実装として/タスクの期限通知機能→リマインダーとして使えるため）',explanation:'「このアプリをどう改善するか」を考えていることは開発に真剣に取り組んでいる証拠。'},
  {id:'sc12-07',type:'text',q:'SES案件に参画した初日、まず何をしますか？',answer:'自己紹介と担当業務の確認・プロジェクトのリポジトリのclone・ローカル環境の構築・チームのコーディング規約の確認・わからないことはすぐに質問する姿勢を示す。',explanation:'初日の行動は現場への適応力を見せる場。報連相を徹底してチームの一員になる意欲を見せる。'},
  {id:'sc12-08',type:'text',q:'コードレビューで指摘を受けた時、どのように対応しますか？',answer:'①指摘の意味を理解する（分からなければ質問する）②なぜそう修正すべきかを確認する③修正してpushする④修正内容と理由をコメントで返信する。指摘を批判と受け取らず成長の機会として捉える。',explanation:'コードレビューへの対応はSES現場でのチームワーク評価に直結する。'},
  {id:'sc12-09',type:'text',q:'5年後にどんなエンジニアになりたいですか？',answer:'（自分のビジョンを答える：例：フルスタックで設計からデプロイまで一人でできる、AI活用でチームの生産性を上げる、自社開発でプロダクトオーナーに近い位置で働く、など）',explanation:'キャリアビジョンがある人材は採用担当者の印象に残りやすい。具体的な技術スタックや役割まで話せると良い。'},
  {id:'sc12-10',type:'text',q:'このカリキュラムで一番成長を感じた瞬間を教えてください。',answer:'（自分の経験を正直に答える：初めてAPIが繋がった時・デプロイできた時・エラーを自分で解決できた時など）',explanation:'学習への熱意と成長実感は採用の重要な判断材料。具体的なエピソードを話せるよう準備する。'}
]}

};