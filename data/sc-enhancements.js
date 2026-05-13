window.SC_ENHANCEMENTS = {

'sc00-01': {
  commonMistakes:['ls と dir を混同する（ls はMac/Linux、Windows cmd は dir、PowerShell は ls どちらも使える）','../（2ドット）と./（1ドット）を混同する'],
  passLine:'「ls は現在のフォルダの中身を見るコマンド」と言えれば合格。オプションまで言えれば優秀。',
  instructorCheckPoint:'実際にターミナルを開いて ls と cd .. を実行させて確認する。'
},
'sc00-02': {
  commonMistakes:['cd . と cd .. を間違える（1ドットは現在のフォルダ、2ドットは親）','パスの区切り文字をWindowsでも / と思い込む（Windowsは \\ だが / も使える）'],
  passLine:'「cd .. で一つ上の階層に移動する」が言えれば合格。',
  instructorCheckPoint:'ホームディレクトリから Desktop/dev まで cd コマンドだけで移動させる。'
},
'sc00-03': {
  commonMistakes:['Ctrl+P と Ctrl+Shift+P を混同する（Ctrl+P はファイル検索）','コマンドパレットを開かずにマウスでメニューを探し続ける'],
  passLine:'Ctrl+Shift+P（Mac: Cmd+Shift+P）を使ってコマンドパレットが開ければ合格。',
  instructorCheckPoint:'「日本語化してください」と言って自分でコマンドパレットから設定させる。'
},
'sc00-04': {
  commonMistakes:['.gitignore に追記するファイル名のスペルミス（大文字小文字も厳密）','既にGit管理されているファイルを .gitignore に追加しても git rm --cached しないと効かないことを知らない'],
  passLine:'「.gitignore に書いたファイルはGitに追跡されなくなる」が言えれば合格。',
  instructorCheckPoint:'node_modules を .gitignore に追加させ git status で確認させる。'
},
'sc00-05': {
  commonMistakes:['node のコマンドを node.js と入力してしまう','--version の代わりに -v を使えることを知らない'],
  passLine:'node --version を打ってバージョンが表示されれば合格。',
  instructorCheckPoint:'npm --version も確認させる。v18以上か確認。'
},
'sc00-06': {
  commonMistakes:['~ をそのまま「チルダ」と読んで意味を知らない','Windows では ~ がホームではなく C:\\Users\\ユーザー名 であることを知らない'],
  passLine:'「~ はホームディレクトリ（/Users/名前）の省略記法」が言えれば合格。',
  instructorCheckPoint:'echo ~ を実行させてホームパスを確認させる。'
},
'sc00-07': {
  commonMistakes:['拡張子を「ファイルの種類を表す飾り」と思い、変更しても中身は変わらないと勘違い','Windowsで拡張子が非表示になっている設定を知らない'],
  passLine:'「.jsはJavaScript、.tsはTypeScript、.htmlはHTMLのファイル」が言えれば合格。',
  instructorCheckPoint:'VSCodeでいくつかのファイルを開いて拡張子から種類を言わせる。'
},
'sc00-08': {
  commonMistakes:['Live Server を起動したらブラウザが自動で開くと思い込み、ポートを確認しない','保存（Ctrl+S）しないと反映されないことに気づかない'],
  passLine:'「Live Server は index.html をブラウザで自動プレビューする拡張機能」が言えれば合格。',
  instructorCheckPoint:'実際に Live Server を起動させ、HTML を変更して保存→自動更新を確認させる。'
},
'sc00-09': {
  commonMistakes:['&& を「かつ」という日本語の意味として理解せず丸暗記している','1つ目のコマンドが失敗すると2つ目が実行されないことを知らない'],
  passLine:'「mkdirとcdを && で繋いで一行で実行できる」が言えれば合格。',
  instructorCheckPoint:'実際にコマンドを打たせて動作を確認する。'
},
'sc00-10': {
  commonMistakes:['git config を一度も実行せずにコミットしようとする','--global と --local の違いを理解していない'],
  passLine:'git config --global user.name と user.email を設定できれば合格。',
  instructorCheckPoint:'git config --list を実行させて設定が反映されているか確認する。'
},

'sc01-01': {
  commonMistakes:['404と400を混同する（404=見つからない、400=リクエスト不正）','500番台が全てサーバーエラーと理解しているが、具体的に503・502の違いを知らない'],
  passLine:'200・201・400・401・404・500 の意味が言えれば合格。全て言えれば優秀。',
  instructorCheckPoint:'「このエラーが出たら何を確認しますか？」と404・500それぞれで質問する。'
},
'sc01-02': {
  commonMistakes:['PATCHとPUTを混同する（PUT=全置換、PATCH=部分更新）','GETでもPOSTでも同じ結果が返ると思い込む'],
  passLine:'「新規作成はPOST」が言えれば合格。GET/POST/PUT/DELETE 4つ全部言えれば優秀。',
  instructorCheckPoint:'RESTful設計の「なぜGETでデータを作ってはいけないか」を説明させる。'
},
'sc01-03': {
  commonMistakes:['JSONのキーをシングルクォートで囲んでしまう（JSONは必ずダブルクォート）','末尾カンマをつけてしまう（JSONはNG、JSオブジェクトはOK）'],
  passLine:'「JSONはキーと文字列値をダブルクォートで囲む」が言えれば合格。',
  instructorCheckPoint:'わざと壊したJSONを見せて「どこが間違いですか？」と質問する。'
},
'sc01-04': {
  commonMistakes:['JSON.parse と JSON.stringify を逆に覚えている','parse した結果をさらに parse しようとしてエラーになる'],
  passLine:'「山田」が出力されれば合格。コードを実行して確認できれば優秀。',
  instructorCheckPoint:'JSON.stringify({name:"鈴木"}) を実行させて結果を確認させる。'
},
'sc01-05': {
  commonMistakes:['クライアントをサービスを提供する側と思い込む（逆）','ブラウザだけがクライアントと思い込む（モバイルアプリ・他のAPIもクライアントになる）'],
  passLine:'「クライアントはリクエストする側」が言えれば合格。',
  instructorCheckPoint:'「スマートフォンアプリがAPIを呼ぶ時、アプリはクライアント？サーバー？」と質問する。'
},
'sc01-06': {
  commonMistakes:['「HTTPSは別のプロトコル」と思い込む（HTTPに暗号化を追加したもの）','暗号化するのはリクエスト全体ではなく通信内容だけと誤解'],
  passLine:'「HTTPSはHTTPに暗号化（TLS/SSL）を追加したもの」が言えれば合格。',
  instructorCheckPoint:'「なぜパスワード入力ページはHTTPSが必須なのか」を説明させる。'
},
'sc01-07': {
  commonMistakes:['DNSを「ドメインを作る仕組み」と誤解する（変換するだけで作らない）','IPアドレスとURLを完全に別物として切り離して考える'],
  passLine:'「DNSはドメイン名をIPアドレスに変換する仕組み」が言えれば合格。',
  instructorCheckPoint:'「google.comにアクセスするまでの流れを順番に説明してください」と質問する。'
},
'sc01-08': {
  commonMistakes:['SESを「自社でサービスを作る」と誤解する','受託を「自社サービス」と混同する'],
  passLine:'「SESはエンジニアを客先に派遣するビジネスモデル」が言えれば合格。',
  instructorCheckPoint:'「3つの違いとそれぞれのメリット・デメリット」を説明させる。'
},
'sc01-09': {
  commonMistakes:['NetworkタブとConsoleタブを混同する（NetworkはHTTP通信、ConsoleはJS実行ログ）','F12の代わりに右クリック→検証を使うことを知らない'],
  passLine:'「HTTPリクエスト・レスポンスを確認するためにNetworkタブを使う」が言えれば合格。',
  instructorCheckPoint:'実際にDevToolsを開かせてリクエスト一覧を確認させる。'
},
'sc01-10': {
  commonMistakes:['DBを「バックエンドの一部」として捉え、3層として切り分けない','フロントエンドがDBに直接アクセスできると思い込む'],
  passLine:'フロント・バック・DBの3層を図で説明できれば合格。',
  instructorCheckPoint:'「なぜフロントエンドがDBに直接アクセスしてはいけないのか」を説明させる。'
},

'sc02-01': {
  commonMistakes:['h1〜h6を文字サイズ調整のためだけに使う（セマンティックな使い方を無視）','1ページに h1 を複数使う（SEO的にNG）'],
  passLine:'「h1〜h6は見出しの階層構造を表すタグ、サイズ変更はCSSで行う」が言えれば合格。',
  instructorCheckPoint:'作成したHTMLを見て「h1が何個ありますか？」と確認する。'
},
'sc02-02': {
  commonMistakes:['justify-content と align-items を逆に覚える（justify=主軸、align=交差軸）','Gridの方が簡単なケースでもFlexを無理やり使う'],
  passLine:'「Flexboxは1方向（横か縦）、Gridは2次元（横と縦両方）」が言えれば合格。',
  instructorCheckPoint:'「ナビゲーションバーはFlexとGridどちらが適切ですか？理由も」と質問する。'
},
'sc02-03': {
  commonMistakes:['「横に並べる」と「中央揃え」を同じプロパティでやろうとする','flex-direction: column の時に justify-content と align-items の意味が変わることを知らない'],
  passLine:'「justify-content: space-between は両端揃えで要素間に均等スペース」が言えれば合格。',
  instructorCheckPoint:'flex-direction: column に変えた時の動作を予測させる。'
},
'sc02-04': {
  commonMistakes:['viewportメタタグを書かずにレスポンシブが効かないと困惑する','initial-scale の値を変えてしまって表示が崩れる'],
  passLine:'「viewportメタタグがないとスマホでメディアクエリが機能しない」が言えれば合格。',
  instructorCheckPoint:'viewportタグを削除させてスマホ表示を確認させる。'
},
'sc02-05': {
  commonMistakes:['absoluteとfixedを混同する（absoluteはスクロールで動く、fixedは固定）','absoluteの親要素にpositionが設定されていないと画面全体が基準になることを知らない'],
  passLine:'「fixedはビューポート固定、absoluteは親要素基準」が言えれば合格。',
  instructorCheckPoint:'実際にposition: fixedとabsoluteを両方試させて動きの違いを確認させる。'
},
'sc02-06': {
  commonMistakes:['max-widthとmin-widthを逆に使ってしまう','768pxぴったりの端末での動作を考慮しない'],
  passLine:'「max-width: 768px は768px以下に適用」が言えれば合格。',
  instructorCheckPoint:'「デスクトップファーストとモバイルファーストの違い」を説明させる。'
},
'sc02-07': {
  commonMistakes:['「:root に書かなくてもどこかにCSS変数を定義すればいい」と思う','var() を使わずに同じ色を複数箇所にハードコードし続ける'],
  passLine:'「:root { --color-primary: #xxx; } で定義して var(--color-primary) で使う」が書けれれば合格。',
  instructorCheckPoint:'「テーマカラーを変更したい時、CSS変数を使っていると何が便利ですか？」と質問する。'
},
'sc02-08': {
  commonMistakes:['GETで大量のデータや機密情報を送ってしまう','POSTは常にリダイレクトが必要と思い込む'],
  passLine:'「GETはURLにデータが見える検索系、POSTは機密情報や大量データの送信」が言えれば合格。',
  instructorCheckPoint:'「ログインフォームをGETで送ると何が問題ですか？」と質問する。'
},
'sc02-09': {
  commonMistakes:['flex: 1 をflex-growだけと思い込む（flex-grow: 1, flex-shrink: 1, flex-basis: 0 の略）','flex: 0 を「非表示にする」と誤解する'],
  passLine:'「flex: 1 は利用可能なスペースを均等に分配する」が言えれば合格。',
  instructorCheckPoint:'flex: 2 と flex: 1 を並べてどう表示されるか予測させる。'
},
'sc02-10': {
  commonMistakes:['auto-fill と auto-fit の違いを知らない（auto-fit は空き列を伸ばす）','minmax の最小値に0を使って列が消えるバグを起こす'],
  passLine:'「画面幅に応じて自動で列数が変わるレスポンシブグリッド」が言えれば合格。',
  instructorCheckPoint:'実際にブラウザを縮小させて列が自動変化することを確認させる。'
},

'sc03-01': {
  commonMistakes:['const と let の選択基準を「見た目の好み」で決めている','constでオブジェクトのプロパティが変更できることを知らない'],
  passLine:'「constは再代入不可、letは再代入可能。基本はconst」が言えれば合格。',
  instructorCheckPoint:'「なぜvarを使わないようにするべきなのか」を説明させる。'
},
'sc03-02': {
  commonMistakes:['mapが新しい配列を返すことを忘れて戻り値を受け取らない','filterとmapを逆に使う（filterは絞り込み、mapは変換）'],
  passLine:'「[20, 40]」が答えられれば合格。処理の流れを説明できれば優秀。',
  instructorCheckPoint:'同じ処理をfor文で書かせて、mapとの比較を理解させる。'
},
'sc03-03': {
  commonMistakes:['async function と const fn = async () => の書き方が混在してどちらを使えばいいか迷う','awaitを使わずにPromiseをそのまま返してしまう'],
  passLine:'「asyncキーワードを関数の前に付ける（async function or async () =>）」が言えれば合格。',
  instructorCheckPoint:'awaitを外した時の動作の違いを確認させる。'
},
'sc03-04': {
  commonMistakes:['Content-Typeヘッダーを忘れてサーバーがJSONを解析できないエラーが起きる','responseのステータスを確認せずにjsonを直接パースして壊れたデータを受け取る'],
  passLine:'「method・headers（Content-Type）・body（JSON.stringify）の3つが必要」が言えれば合格。',
  instructorCheckPoint:'ヘッダーを省いた時のサーバー側のエラーを確認させる。'
},
'sc03-05': {
  commonMistakes:['イベント委譲を知らず、動的に追加した要素にイベントが効かなくて詰まる','e.target と e.currentTarget の違いを知らない'],
  passLine:'「親要素に1つイベントを設定して子要素のクリックを処理するパターン」が言えれば合格。',
  instructorCheckPoint:'「動的に追加したliにdeleteボタンのイベントが効かない時、どうしますか？」と質問する。'
},
'sc03-06': {
  commonMistakes:['localStorageに直接オブジェクトを入れてしまい [object Object] が保存される','JSON.parse と JSON.stringify を逆に使う'],
  passLine:'「JSON.stringify で文字列化してsetItem、getItemしたらJSON.parseでオブジェクトに戻す」が言えれば合格。',
  instructorCheckPoint:'実際にDevToolsのApplicationタブでlocalStorageの中身を確認させる。'
},
'sc03-07': {
  commonMistakes:['`5 == "5"` がtrueになることで混乱する','null == undefined がtrueになることを知らない（=== では false）'],
  passLine:'「===は型と値を両方比較する。実務では必ず===を使う」が言えれば合格。',
  instructorCheckPoint:'`0 == false`・`"" == false`・`null == undefined` の結果を予測させる。'
},
'sc03-08': {
  commonMistakes:['pushなどの破壊的メソッドを使ってしまう','スプレッド構文のネストが深い場合にシャローコピーの問題が起きることを知らない'],
  passLine:'「[...tasks, newTask] で新しい配列を作ってsetTasksに渡す」が書けれれば合格。',
  instructorCheckPoint:'tasksをpushで変更した場合とスプレッドで変更した場合の違いをReactで確認させる。'
},
'sc03-09': {
  commonMistakes:['「useStateを使えばOK」と覚えてしまい、なぜ必要かが説明できない','forEachやmapでDOMを直接操作するのと何が違うかが分からない'],
  passLine:'「stateが変わると自動で再レンダリングされるため、DOM操作を手動でしなくて良い」が言えれば合格。',
  instructorCheckPoint:'Vanilla JSで同じToDoアプリを作る場合何行かかるか比較させる。'
},
'sc03-10': {
  commonMistakes:['response.ok がfalseでもcatchに入らないことを知らない（ネットワークエラー以外はcatchに入らない）','fetchが返すのはPromiseで、jsonメソッドも非同期だと知らずに直接使う'],
  passLine:'「response.ok がfalseの時はHTTPステータスが400〜599の時。ネットワークエラーとは別」が言えれば合格。',
  instructorCheckPoint:'存在しないAPIを呼ばせて、エラーハンドリングが正しく動くか確認させる。'
},

'sc04-01': {
  commonMistakes:['git addをせずに直接commitしようとする','git add . とgit add ファイル名の違いを知らない'],
  passLine:'「addはステージング（コミット候補に追加）、commitは履歴として確定記録」が言えれば合格。',
  instructorCheckPoint:'git statusを見せて「これは何を意味しますか？」と質問する。'
},
'sc04-02': {
  commonMistakes:['ブランチを切らずにmainで直接作業し続ける','ブランチ名を「branch1」など意味のない名前にする'],
  passLine:'「チーム開発での変更の分離とPRによるコードレビューのため」が言えれば合格。',
  instructorCheckPoint:'「mainブランチで直接作業すると何が問題ですか？」と質問する。'
},
'sc04-03': {
  commonMistakes:['cloneしたリポジトリにさらにcloneしようとする','git pullとgit fetchの違いを知らない'],
  passLine:'「cloneは初回のコピー、pullは既存のローカルリポジトリを最新化する」が言えれば合格。',
  instructorCheckPoint:'チームメンバーが変更をpushした後に自分がpullする流れを実演させる。'
},
'sc04-04': {
  commonMistakes:['<<<<<< HEADから=======の間がどちらのコードか分からなくなる','コンフリクトマーカーを消さずにコミットしてしまう'],
  passLine:'「=======の上がHEAD（自分）、下が取り込もうとしている変更」が言えれば合格。',
  instructorCheckPoint:'意図的にコンフリクトを発生させて実際に解消させる。'
},
'sc04-05': {
  commonMistakes:['「修正した」「update」など何をしたかわからないメッセージを書く','スペルミスに気づかないまま大量のコミットを積んでしまう'],
  passLine:'「feat: 〇〇を追加」「fix: △△のバグを修正」のConventional Commits形式が書けれれば合格。',
  instructorCheckPoint:'過去のコミット履歴を見せて「このコミットは何をしましたか？」と質問する。'
},
'sc04-06': {
  commonMistakes:['node_modulesをpushしてリポジトリが数百MB以上になる','.envに書いたAPIキーをpushして流出させる'],
  passLine:'「node_modulesはpackage.jsonがあれば再現できる大容量フォルダのため除外する」が言えれば合格。',
  instructorCheckPoint:'「.envと.env.exampleの使い分けを説明してください」と質問する。'
},
'sc04-07': {
  commonMistakes:['index.html ではなく App.jsx を index ファイルと思い込む','サブフォルダの場合は /リポジトリ名/サブフォルダ名/ と入力が必要なことを知らない'],
  passLine:'「ルートのindex.htmlがGitHub Pagesのエントリポイント」が言えれば合格。',
  instructorCheckPoint:'実際にGitHub PagesのURLにアクセスして動作確認させる。'
},
'sc04-08': {
  commonMistakes:['PR descriptionを「修正しました」だけにする','何を確認すればいいか（How to test）を書かない'],
  passLine:'「変更内容・理由・確認方法の3点がPRに書かれていれば」合格。',
  instructorCheckPoint:'「このPRのdescriptionを改善するとしたらどう書き直しますか？」と質問する。'
},
'sc04-09': {
  commonMistakes:['GitHubFlowとgit-flowを混同する（GitHubFlowはシンプルな2ブランチ運用）','mainブランチを常にデプロイ可能な状態に保つことの意味を理解していない'],
  passLine:'「GitHubFlowはmain + featureブランチだけのシンプルな運用」が言えれば合格。',
  instructorCheckPoint:'「なぜmainブランチは常にデプロイ可能でなければならないのか」を説明させる。'
},
'sc04-10': {
  commonMistakes:['コンフリクトマーカーを削除しただけでgit addするのを忘れる','git addの後にgit commit --continueが必要なケースを知らない（mergeの場合）'],
  passLine:'「①マーカー編集→②git add→③git commitの3ステップ」が言えれば合格。',
  instructorCheckPoint:'「コンフリクトを解消した後にcommitメッセージは何と書きますか？」と質問する。'
},

'sc05-01': {
  commonMistakes:['import文なしにuseStateを使おうとしてエラーになる','import React from "react" が必要と思い込む（React 17以降は不要なケースが多い）'],
  passLine:'「import { useState } from "react"」が書けれれば合格。',
  instructorCheckPoint:'import文を消してエラーを見せた後、正しいimportを書かせる。'
},
'sc05-02': {
  commonMistakes:['setCountをcountと混同してcountに直接代入しようとする','setCount(count + 1)の代わりにcount = count + 1と書く'],
  passLine:'「countは現在値、setCountは更新関数、useState(0)が初期値0」が言えれば合格。',
  instructorCheckPoint:'count++を試させて動かないことを確認し、なぜかを説明させる。'
},
'sc05-03': {
  commonMistakes:['tasks.push(newTask)で直接変更してもReactが再レンダリングしない現象に詰まる','「setStateを呼んだのに再レンダリングされない」と言うが実はstateを直接変更している'],
  passLine:'「setStateが呼ばれた時だけReactが再レンダリングする。直接変更はNG」が言えれば合格。',
  instructorCheckPoint:'push で変更した時 vs スプレッド構文で setTasksした時の違いを実演させる。'
},
'sc05-04': {
  commonMistakes:['propsを「親と子が共有するグローバルな値」と誤解する','子から props を直接変更しようとしてエラーになる'],
  passLine:'「propsは親→子への読み取り専用データ。stateはコンポーネント自身が持つ変更可能なデータ」が言えれば合格。',
  instructorCheckPoint:'「子コンポーネントから親のstateを変更したい時どうしますか？」と質問する。'
},
'sc05-05': {
  commonMistakes:['依存配列を完全に省略してしまい無限ループになる','依存配列に全てのstateを入れてしまいほぼ毎回実行される'],
  passLine:'「useEffect(fn, [])はマウント時のみ実行」が言えれば合格。',
  instructorCheckPoint:'依存配列を省いた時の無限ループを実際に体験させて原因を探らせる。'
},
'sc05-06': {
  commonMistakes:['indexをkeyにして要素の順番が変わった時にバグを起こす','keyをランダムな値（Math.random()）にしてしまい毎回再マウントが起きる'],
  passLine:'「ReactがDOMの更新効率化のためにリストアイテムを識別するための一意なID」が言えれば合格。',
  instructorCheckPoint:'keyなしの時のコンソール警告を確認させ、indexをkeyにした場合の問題を説明させる。'
},
'sc05-07': {
  commonMistakes:['inputタグがformの外にあるのにtype="submit"が効かないと詰まる','e.preventDefaultを書き忘れてページがリロードされる'],
  passLine:'「formのsubmitのデフォルト動作（ページリロード）を止めるため」が言えれば合格。',
  instructorCheckPoint:'e.preventDefault()を消してみて何が起きるか確認させる。'
},
'sc05-08': {
  commonMistakes:['カスタムフックをコンポーネントの外で定義してしまう','useで始まらない名前をつけてReactの制約違反を起こす'],
  passLine:'「useXxx名前でReact hooksを使うロジックを再利用可能にしたもの」が言えれば合格。',
  instructorCheckPoint:'「useFetchというカスタムフックを作る場合、何を返すべきですか？」と質問する。'
},
'sc05-09': {
  commonMistakes:['クリーンアップが必要なのにreturnを書かないでメモリリークを起こす','クリーンアップ関数をuseEffectの外に書いてしまう'],
  passLine:'「アンマウント時または次のeffect実行前に実行される後片付け処理」が言えれば合格。',
  instructorCheckPoint:'setIntervalをクリーンアップなしで使ったコードのメモリリークを実演させる。'
},
'sc05-10': {
  commonMistakes:['mapでスプレッドを使わずに task.done = true で直接変更してしまう','id が一致しない時の条件式を間違えてしまう'],
  passLine:'「tasks.map(t => t.id === 2 ? {...t, done: true} : t)」が書けれれば合格。',
  instructorCheckPoint:'スプレッドを使わずにdoneを変更した場合、なぜバグになるかを説明させる。'
},

'sc06-01': {
  commonMistakes:['pages/dashboard.tsxと書いてしまう（旧Pages Router）','ファイル名をdashboard.tsx ではなく Dashboard.tsxと大文字にしてしまう'],
  passLine:'「app/dashboard/page.tsx」が正しく言えれば合格。',
  instructorCheckPoint:'「app/blog/[id]/page.tsxにアクセスするURLは？」と質問する。'
},
'sc06-02': {
  commonMistakes:['全てのコンポーネントにuse clientを付けてしまい、サーバーコンポーネントの恩恵を失う','use clientを付け忘れてuseStateがエラーになる'],
  passLine:'「データ取得・SEOはServer、useStateやイベントはClient」が言えれば合格。',
  instructorCheckPoint:'「fetchを使うコンポーネントはServerとClientどちらが適切ですか？理由も」と質問する。'
},
'sc06-03': {
  commonMistakes:['paramsをそのまま文字列として使いtype errorになる','generateStaticParamsを書かずにビルドが失敗する'],
  passLine:'「app/posts/[id]/page.tsx に { params: { id: string } } で受け取る」が言えれば合格。',
  instructorCheckPoint:'実際に/posts/1・/posts/2にアクセスさせてparamsの値を確認させる。'
},
'sc06-04': {
  commonMistakes:['aタグのhrefをLinkのhrefと混同して使い分けができない','外部リンクにもLinkを使ってしまう'],
  passLine:'「Linkはクライアントサイドナビゲーション（高速）、aはフルページリロード」が言えれば合格。',
  instructorCheckPoint:'NetworkタブでaタグとLinkの違いを実際に比較させる。'
},
'sc06-05': {
  commonMistakes:['PRごとにプレビューURLが生成されることを知らない','VercelとGitHubの連携設定後に自動でデプロイされる流れを知らない'],
  passLine:'「mainブランチへのpushで自動デプロイ」が言えれば合格。',
  instructorCheckPoint:'Vercelのダッシュボードを見せてデプロイの状況を確認させる。'
},
'sc06-06': {
  commonMistakes:['NEXT_PUBLIC_なしのAPI_KEYをブラウザのコードで使おうとして undefined になる','.env.localをGitHubにpushしてしまう'],
  passLine:'「NEXT_PUBLIC_プレフィックスなしはサーバーサイドのみ使用可能」が言えれば合格。',
  instructorCheckPoint:'「データベース接続文字列にNEXT_PUBLIC_を付けてはいけない理由」を説明させる。'
},
'sc06-07': {
  commonMistakes:['childrenを忘れてコンテンツが表示されないと詰まる','layout.tsxとpage.tsxの位置関係を混同する'],
  passLine:'「そのフォルダ以下のpage.tsxのコンテンツがchildrenとして渡される」が言えれば合格。',
  instructorCheckPoint:'layout.tsxからchildren propsを削除した時の動作を確認させる。'
},
'sc06-08': {
  commonMistakes:['GET・POSTをexport defaultで書いてしまう（named exportが必要）','routeファイルのパスを間違えてapi/hello.tsにしてしまう'],
  passLine:'「export async function GET() { return NextResponse.json(data) }」が書けれれば合格。',
  instructorCheckPoint:'実際にRoute Handlerを作成してfetchで呼び出させる。'
},
'sc06-09': {
  commonMistakes:['revalidate: 0とno-storeを同じものと思い込む','buildTimeでデータが古くなることを考慮せずに使い方を選ぶ'],
  passLine:'「next.revalidateは指定秒後にバックグラウンドでデータを再取得するISR」が言えれば合格。',
  instructorCheckPoint:'「この機能ではrevalidate・no-store・force-cacheのどれが適切ですか？理由も」と質問する。'
},
'sc06-10': {
  commonMistakes:['エラーメッセージを読まずに「use clientを追加すれば全部解決」と思い込む','Server ComponentでuseStateを使おうとする本質的な誤りを理解していない'],
  passLine:'「You are importing a component that needs useStateという趣旨のエラー」が答えられれば合格。',
  instructorCheckPoint:'わざとuseStateをServer Componentで使わせてエラーを体験させる。'
},

'sc07-01': {
  commonMistakes:['static を「共有する」とだけ覚えてなぜインスタンス不要かを理解していない','main メソッドをインスタンスメソッドとして定義してしまう'],
  passLine:'「public=公開、static=クラス共通、void=戻り値なし、main=エントリポイント」が言えれば合格。',
  instructorCheckPoint:'「mainがstaticでない場合、Javaはどうやって実行を開始しますか？」と質問する。'
},
'sc07-02': {
  commonMistakes:['オーバーフロー時に例外が投げられると思い込む','int と Integer の違いを知らない（プリミティブ型とラッパークラス）'],
  passLine:'「intは約-21億〜21億、範囲超えはオーバーフロー（例外なし）、大きな数はlongを使う」が言えれば合格。',
  instructorCheckPoint:'「int n = Integer.MAX_VALUE; n++; の値は？」と質問する。'
},
'sc07-03': {
  commonMistakes:['forEachと拡張for文を混同する','配列型とArrayListで書き方が違うことに混乱する'],
  passLine:'「for (String lang : langs) のように書く」コードが書けれれば合格。',
  instructorCheckPoint:'for文・拡張for文・Stream forEach の3通りを書き分けさせる。'
},
'sc07-04': {
  commonMistakes:['コンストラクタに戻り値型を書いてしまう（void もNG）','デフォルトコンストラクタが自動生成される条件を知らない'],
  passLine:'「インスタンス生成時（new の直後）に自動で呼ばれる特別なメソッド」が言えれば合格。',
  instructorCheckPoint:'コンストラクタにvoidを書かせてコンパイルエラーを体験させる。'
},
'sc07-05': {
  commonMistakes:['privateフィールドをpublicに変えて「動いた」で満足してしまう','setterにバリデーションを入れる価値を理解していない'],
  passLine:'「privateにして、publicなgetter/setterでのみアクセス可にする。setterでバリデーションができる」が言えれば合格。',
  instructorCheckPoint:'「setterでバリデーションをしないと何が問題ですか？」と質問する。'
},
'sc07-06': {
  commonMistakes:['「Javaは多重継承できない」を知らず複数のextendsを書いてコンパイルエラーになる','インターフェースに状態（フィールド）を持たせようとしてエラーになる'],
  passLine:'「インターフェースはimplements A, B と多重実装できる。abstractクラスは単一継承のみ」が言えれば合格。',
  instructorCheckPoint:'「ServiceインターフェースとServiceImplクラスに分ける設計の利点」を説明させる。'
},
'sc07-07': {
  commonMistakes:['Stream APIをfor文の置き換えとしか考えず、collectを忘れてStreamのまま扱う','filterとmapの順番を間違えて非効率なコードを書く'],
  passLine:'「[40, 50]」が答えられれば合格。filter→mapの流れが説明できれば優秀。',
  instructorCheckPoint:'同じ処理をfor文で書かせて、Stream APIとの可読性を比較させる。'
},
'sc07-08': {
  commonMistakes:['finallyを「catchの後に必ず実行される」と誤解し、returnを含むtryでも実行されることを知らない','try-with-resources の存在を知らずにfinallyでcloseを書き続ける'],
  passLine:'「try・catchの結果に関わらず必ず実行される。DBやファイルのclose処理に使う」が言えれば合格。',
  instructorCheckPoint:'「try-with-resourcesとtry-finally、どちらが推奨されますか？理由も」と質問する。'
},
'sc07-09': {
  commonMistakes:['readValueとwriteValueAsStringを逆に覚えている','シリアライズ・デシリアライズという用語を知らない'],
  passLine:'「writeValueAsStringはJava→JSON文字列に変換する」が言えれば合格。',
  instructorCheckPoint:'「Spring BootがJSON APIを自動でJSONに変換できる仕組みを説明してください」と質問する。'
},
'sc07-10': {
  commonMistakes:['4原則の名前は言えるが一言で説明できない','ポリモーフィズムを「複数の形を持つ」という表面的な意味でしか捉えていない'],
  passLine:'4原則を各1文で説明できれば合格。コード例を出せれば優秀。',
  instructorCheckPoint:'「Spring BootでRepositoryインターフェースを使う場面でどのOOP原則が使われていますか？」と質問する。'
},

'sc08-01': {
  commonMistakes:['LEFT JOINとRIGHT JOINを混同する','INNER JOINがデフォルトだと思い込み JOIN のみ書いて挙動を誤解する'],
  passLine:'「INNER JOINは両方に存在するもの、LEFT JOINは左テーブルの全件」が言えれば合格。',
  instructorCheckPoint:'ベン図を書かせてそれぞれのJOINが返すデータを説明させる。'
},
'sc08-02': {
  commonMistakes:['WHERE忘れを「まあ問題ない」と軽く考える','SELECT で確認してからUPDATEする習慣がない'],
  passLine:'「WHEREなしのUPDATE/DELETEは全件対象。本番DBでは重大な障害になる」が言えれば合格。',
  instructorCheckPoint:'実際にWHEREなしのUPDATEを試させて（テスト環境で）全件更新を体験させる。'
},
'sc08-03': {
  commonMistakes:['GROUP BYなしにCOUNTと他のカラムを一緒にSELECTしてエラーになる','COUNT(*)とCOUNT(カラム名)の違いを知らない（後者はNULLを除く）'],
  passLine:'「GROUP BYでuser_idをグループ化してCOUNTで各グループの件数を集計する」が言えれば合格。',
  instructorCheckPoint:'実際にSQLを書かせて実行結果を確認させる。'
},
'sc08-04': {
  commonMistakes:['ACID を全部言えるが意味が説明できない','原子性をAtomicity=「分割できない」とだけ暗記する'],
  passLine:'「Atomicity=全成功か全失敗。Consistency=一貫性。Isolation=分離。Durability=永続性」が言えれば合格。',
  instructorCheckPoint:'「送金処理でトランザクションが必要な理由」をATMの例で説明させる。'
},
'sc08-05': {
  commonMistakes:['インデックスを全カラムに付ければ速くなると思い込む','EXPLAIN の type=ALL の意味を知らない'],
  passLine:'「SELECT が速くなるがINSERT/UPDATEのオーバーヘッドが増える」が言えれば合格。',
  instructorCheckPoint:'EXPLAINを実行させてtype=ALLとrefの違いを確認させる。'
},
'sc08-06': {
  commonMistakes:['中間テーブルにPKが必要なことを知らない','ON DELETE CASCADEを設定せずに外部キー制約でDELETEが失敗する'],
  passLine:'「task_tagsのような中間テーブルを作り、task_idとtag_idの外部キーを持たせる」が言えれば合格。',
  instructorCheckPoint:'「中間テーブルなしに多対多を表現しようとしたら何が問題になりますか？」と質問する。'
},
'sc08-07': {
  commonMistakes:['WHERE と HAVING を同じものと思い込む','HAVING でGROUP BY前のカラムを参照しようとして混乱する'],
  passLine:'「WHEREはGROUP BY前の元データ絞り込み、HAVINGはGROUP BY後の集計結果絞り込み」が言えれば合格。',
  instructorCheckPoint:'「タスク数が3件以上のユーザーのみ取得するSQLをWHEREとHAVINGのどちらで書きますか？」と質問する。'
},
'sc08-08': {
  commonMistakes:['EXPLAINの出力を見ても何を意味するか理解できない','EXPLAIN ANALYZE と EXPLAIN の違いを知らない'],
  passLine:'「EXPLAINはSQLの実行計画を確認して、フルスキャンかインデックス使用かを調べる」が言えれば合格。',
  instructorCheckPoint:'実際にEXPLAINを実行させてrows列の数値に着目させる。'
},
'sc08-09': {
  commonMistakes:['ddl-auto=updateが本番でも安全だと思い込む','Flywayを使わずにスキーマ変更をそのまま本番に適用してデータが消える'],
  passLine:'「本番ではFlywayやLiquibaseなどのマイグレーションツールを使うべき」が言えれば合格。',
  instructorCheckPoint:'「ddl-auto=createとupdateの違い、本番でcreateにしたら何が起きますか？」と質問する。'
},
'sc08-10': {
  commonMistakes:['第3正規形を「全てのカラムが主キーに依存する」とだけ覚えて推移関数従属を説明できない','正規化しすぎてJOINが複雑になる逆正規化の概念を知らない'],
  passLine:'「主キー以外のカラムが主キーだけに依存している状態。推移関数従属がない」が言えれば合格。',
  instructorCheckPoint:'「注文テーブルに顧客名を直接持たせることの問題点」を説明させる。'
},

'sc09-01': {
  commonMistakes:['@ControllerだとJSONを返せないと勘違いして@ResponseBodyを個別につける','@RestControllerでHTMLのビューを返そうとしてエラーになる'],
  passLine:'「@RestControllerは@Controller + @ResponseBodyの合成でJSONを返す」が言えれば合格。',
  instructorCheckPoint:'@Controllerで@ResponseBodyなしのメソッドを書いてどうなるか確認させる。'
},
'sc09-02': {
  commonMistakes:['DI = @Autowiredと覚えて「なぜ注入するのか」が説明できない','コンストラクタインジェクションとフィールドインジェクションの使い分けを知らない'],
  passLine:'「Springが管理するBeanを自動で注入する。テスト時にモックに差し替えやすいのがメリット」が言えれば合格。',
  instructorCheckPoint:'「@Autowiredなしでnew TaskService()する場合の問題点」を説明させる。'
},
'sc09-03': {
  commonMistakes:['@GetMappingと@RequestMappingを混同する','PathVariableとRequestParamを逆に使う'],
  passLine:'「@GetMapping("/{id}")とメソッドの@PathVariable Long id」が書けれれば合格。',
  instructorCheckPoint:'「@PathVariableと@RequestParamはどう使い分けますか？」と質問する。'
},
'sc09-04': {
  commonMistakes:['EntityをDTOと完全に同一視する','Entityのパスワードフィールドが含まれたままAPIで返してしまう'],
  passLine:'「パスワード等の機密情報漏洩リスク・双方向リレーションでの循環参照」が言えれば合格。',
  instructorCheckPoint:'UserエンティティにpasswordフィールドがあるままAPIで返すとどうなるかを考えさせる。'
},
'sc09-05': {
  commonMistakes:['@ControllerAdviceと@ExceptionHandlerを別々のクラスに分散させる','特定のExceptionに対応するHandlerを書かずに汎用Exceptionだけにしてしまう'],
  passLine:'「@RestControllerAdviceクラスに@ExceptionHandlerメソッドで全コントローラーの例外を一元処理」が言えれば合格。',
  instructorCheckPoint:'実際に存在しないIDにアクセスさせて404のエラーレスポンスを確認させる。'
},
'sc09-06': {
  commonMistakes:['Spring Data JPAのクエリメソッドの命名規則を覚えず@Queryを乱用する','findByとgetByの違いを知らない（findByはOptionalを返す場合あり）'],
  passLine:'「メソッド名からSELECT ... WHERE title LIKE %keyword% のSQLが自動生成される」が言えれば合格。',
  instructorCheckPoint:'「findByTitleAndDone(String title, boolean done)のSQLは？」と質問する。'
},
'sc09-07': {
  commonMistakes:['Serviceメソッドにだけ@Transactionalを付けてControllerにも付けてしまう','REQUIRED以外のTransactionPropagationを知らない'],
  passLine:'「メソッド全体をDBトランザクションで包む。エラー時は自動でROLLBACK」が言えれば合格。',
  instructorCheckPoint:'「@Transactionalなしで複数の更新を行うとどんな問題が起きますか？」と質問する。'
},
'sc09-08': {
  commonMistakes:['@CrossOriginのoriginsに * をそのまま本番で使ってしまう','CORSの設定をフロント側（Next.js）でやろうとする'],
  passLine:'「WebConfigクラスでaddCorsMappingsをオーバーライドしてSpring Boot側で設定する」が書けれれば合格。',
  instructorCheckPoint:'実際にCORSエラーを発生させて設定で解消させる。'
},
'sc09-09': {
  commonMistakes:['@ValidをDTOクラスに付けてしまう（必要なのはControllerのパラメータの前）','@NotBlankと@NotNullの違いを知らない（@NotBlankは空白のみもNG）'],
  passLine:'「@PostMappingのメソッドの引数の@RequestBody DTOの前に@Validを付ける」が言えれば合格。',
  instructorCheckPoint:'@Validを外してバリデーションが無効になることを確認させる。'
},
'sc09-10': {
  commonMistakes:['3層の境界を曖昧にしてServiceからHTTPRequestを直接受け取る','RepositoryにビジネスロジックをべたがきしてServiceが空になる'],
  passLine:'「Controller=受付、Service=ビジネスロジック、Repository=DB操作」が言えれば合格。',
  instructorCheckPoint:'「Service層にHTTPステータスコードの知識があっていいですか？理由も」と質問する。'
},

'sc10-01': {
  commonMistakes:['systemのPythonにpipインストールしてプロジェクト間でバージョン競合を起こす','venvをactivateせずにパッケージをインストールしてしまう'],
  passLine:'「venvでプロジェクトごとに独立したパッケージ環境を作り、バージョン競合を防ぐ」が言えれば合格。',
  instructorCheckPoint:'「venvをactivateしている時としていない時の違いをwhich pythonコマンドで確認してください」と指示する。'
},
'sc10-02': {
  commonMistakes:['エンコーディングをutf-8で決め打ちして文字化けしてしまう','DataFrameの変数名を毎回dfにして複数DataFrameを扱う時に混乱する'],
  passLine:'「pd.read_csv("data.csv", encoding="utf-8")」が書けれれば合格。',
  instructorCheckPoint:'実際にCSVを読み込んでdf.head()とdf.dtypes を確認させる。'
},
'sc10-03': {
  commonMistakes:['range(10)が0〜9を返すことを忘れて10を含めようとする','if条件を== 0と書いてしまう（奇数・偶数の判定で% 0を使う初心者）'],
  passLine:'「[0, 2, 4, 6, 8]」が答えられれば合格。',
  instructorCheckPoint:'同じ処理を通常のfor文で書かせて内包表記の簡潔さを比較させる。'
},
'sc10-04': {
  commonMistakes:['finally と except else（正常時のみ実行）を混同する','裸のexcept:（Exception型を指定しない）を使ってデバッグが難しくなる'],
  passLine:'「tryは試みる処理、exceptはエラー時、finallyは結果に関わらず必ず実行」が言えれば合格。',
  instructorCheckPoint:'「ZeroDivisionErrorとTypeErrorを別々のexcept節で処理してください」と指示する。'
},
'sc10-05': {
  commonMistakes:['groupby後にmean()を呼ぶタイミングでカラム指定を忘れる','groupbyの結果がDataFrameではなくGroupByオブジェクトだと知らない'],
  passLine:'「deptカラムでグループ化してscoreの平均を計算する」が言えれば合格。',
  instructorCheckPoint:'「groupby("dept")["score"].agg(["mean","max","min"])を実行してみてください」と指示する。'
},
'sc10-06': {
  commonMistakes:['response.json()でなくresponse.textで受け取って手動でparseしようとする','status_code確認を忘れてエラーのレスポンスをデータとして処理してしまう'],
  passLine:'「requests.get(url)でGETリクエストを送り、response.json()でPythonの辞書に変換する」が書けれれば合格。',
  instructorCheckPoint:'存在しないURLにリクエストしてエラーハンドリングが必要なことを体験させる。'
},
'sc10-07': {
  commonMistakes:['ExcelファイルにAPIキーや個人情報を含む本物のデータを使ってしまう','matplotlibで日本語フォントが文字化けする問題に詰まる'],
  passLine:'「df.to_excel("output.xlsx", index=False) または openpyxl を使う」が言えれば合格。',
  instructorCheckPoint:'実際にExcelファイルを生成させて内容を確認させる。'
},
'sc10-08': {
  commonMistakes:['os.path.join と / 演算子を混同する','Pathオブジェクトをstr()に変換が必要な場面を知らない'],
  passLine:'「Path("data") / "file.csv"」が書けれれば合格。',
  instructorCheckPoint:'「Path("data") / "sub" / "file.csv"のようにネストさせてみてください」と指示する。'
},
'sc10-09': {
  commonMistakes:['selfをメソッド呼び出し時にも渡そうとしてTypeErrorになる','__init__を「コンストラクタ」と言えるがいつ呼ばれるかを知らない'],
  passLine:'「__init__はnew相当のインスタンス生成時に自動で呼ばれるコンストラクタ」が言えれば合格。',
  instructorCheckPoint:'JavaのコンストラクタとPythonの__init__を対比させて説明させる。'
},
'sc10-10': {
  commonMistakes:['left_onとright_onを逆に書いてしまう','how="inner"がデフォルトでhow="left"にしないと一方にしかないレコードが消えることを知らない'],
  passLine:'「pd.merge(tasks, users, left_on="user_id", right_on="id", how="left")」が書けれれば合格。',
  instructorCheckPoint:'SQLのINNER JOINとPandasのmerge(how="inner")が等価であることを確認させる。'
},

'sc11-01': {
  commonMistakes:['4要素のうち出力形式を省いてしまい長文の説明が返ってくる','役割を書かずに「○○してください」だけ書く'],
  passLine:'「役割・前提・制約・出力形式の4要素が揃ったプロンプト」が書けれれば合格。',
  instructorCheckPoint:'悪いプロンプト例を見せて「どこが不足していますか？」と質問する。'
},
'sc11-02': {
  commonMistakes:['「AIが書いたのでバグではない」と思い込んで確認をサボる','AIの出力を参考にしながら自分の理解で書き直す習慣がない'],
  passLine:'「セキュリティリスク・理解できないコードがある・面談で説明できない」が言えれば合格。',
  instructorCheckPoint:'「このAI生成コードの問題点を指摘してください」と質問して理解度を確認する。'
},
'sc11-03': {
  commonMistakes:['CLAUDE.mdをプロジェクト外に作ってしまう','技術スタックだけ書いてコーディング規約や自分の習熟度を書かない'],
  passLine:'「技術スタック・ディレクトリ構成・コーディング規約・習熟度の5項目以上」が言えれば合格。',
  instructorCheckPoint:'CLAUDE.mdを見せて「これで十分ですか？何が不足していますか？」と質問する。'
},
'sc11-04': {
  commonMistakes:['「セキュリティ上の懸念があるから使わない」と言いながら個人情報をプロンプトに貼る','「社内では禁止されていないから大丈夫」と思い込む'],
  passLine:'「個人情報・APIキー・パスワード・社内機密情報は—データに置き換える」が言えれば合格。',
  instructorCheckPoint:'「この文書（個人情報を含む）をAIで要約したい時どうしますか？」と質問する。'
},
'sc11-05': {
  commonMistakes:['AI利用ログを「書いた」で終わりにして採用判断の理由を書かない','修正したことだけ書いてなぜ修正したかを書かない'],
  passLine:'「何を依頼したか・採用/修正/却下したか・その理由の3点」が言えれば合格。',
  instructorCheckPoint:'実際のAI-USAGE.mdを見せて「改善できる点はありますか？」と質問する。'
},
'sc11-06': {
  commonMistakes:['「エラーが出ました」だけ送って文脈がない','スタックトレースをコピーせずにスクリーンショットだけ送る'],
  passLine:'「エラーメッセージ + 該当コード + 状況 + 試したこと の4点セット」が言えれば合格。',
  instructorCheckPoint:'悪い相談例と良い相談例を見せてどちらがより的確な回答を得られるか考えさせる。'
},
'sc11-07': {
  commonMistakes:['CLAUDE.mdを読ませずに作業させてプロジェクトの文脈を無視したコードが生成される','「ファイルを全部作って」と一気に依頼して全てを確認できない量のコードが生成される'],
  passLine:'「CLAUDE.mdを設定してGitHub Issueで要件を定義してから小さな単位で依頼する」が言えれば合格。',
  instructorCheckPoint:'「効果的なClaude Code活用のために最初にすべきことは？」と質問する。'
},
'sc11-08': {
  commonMistakes:['「AIを使っていません」と嘘をつくことがよいと思い込む','「全部AIに作ってもらいました」と正直に言うことが評価される思い込む'],
  passLine:'「具体的な使い方・自分の判断・修正内容を説明できれば評価される」が言えれば合格。',
  instructorCheckPoint:'模擬面談で「このコードをAIで作りましたか？」と質問して回答を評価する。'
},
'sc11-09': {
  commonMistakes:['設計判断もAIに任せてしまい「AIがそう言ったから」を理由にする','AIの出力が間違っていても権威に従うように採用してしまう'],
  passLine:'「ボイラープレート・エラー解読・テストケース洗い出しはOK。設計・判断・責任は人間が担う」が言えれば合格。',
  instructorCheckPoint:'「AIが提案したアーキテクチャをそのまま採用する場合の問題点」を説明させる。'
},
'sc11-10': {
  commonMistakes:['AI利用ログを最後にまとめて書こうとして忘れてしまう','「全部自分で書きました」という体裁を取ろうとしてログを省略する'],
  passLine:'「開発中にリアルタイムで記録する。採用判断の理由を書く。面談で見せられる状態にする」が言えれば合格。',
  instructorCheckPoint:'AI-USAGE.mdのサンプルを見せてどの情報が採用担当者に価値があるかを議論する。'
},

'sc12-01': {
  commonMistakes:['「タスク管理アプリを作りました」だけで終わる（技術・工夫・解決した課題がない）','3分以上かかってしまう（緊張のせいもあるが準備不足が主因）'],
  passLine:'「アプリ名・対象ユーザー・技術スタック・1つの工夫点」が30秒で言えれば合格。',
  instructorCheckPoint:'実際に30秒計って話させる。超えたら短縮の練習をする。'
},
'sc12-02': {
  commonMistakes:['「Controller・Service・Repositoryの3層です」と言えるが各層の責務を具体的に言えない','Repositoryにビジネスロジックを書いた状態で提出してしまう'],
  passLine:'「Controller=受付、Service=ロジック、Repository=DB操作」を自分のコードで説明できれば合格。',
  instructorCheckPoint:'コードを開かせて「このメソッドはどの層に属しますか？」と質問する。'
},
'sc12-03': {
  commonMistakes:['「Vercelが無料だから」だけを理由にする（Next.jsとの親和性を説明できない）','Renderではなくherokuを選んだがサポート終了していることを知らない'],
  passLine:'「Vercelはnext.js作成元のVercel社のサービスで親和性が高い。RenderはSpring Bootを無料でデプロイできる」が言えれば合格。',
  instructorCheckPoint:'「本番ではどのサービスを使いますか？Renderのデメリットは？」と質問する。'
},
'sc12-04': {
  commonMistakes:['苦労した点を「ありませんでした」と言ってしまう（成長機会の証明ができない）','CORS設定の問題を「よく分からないけど動いた」で終わらせる'],
  passLine:'「具体的な問題・試したこと・解決方法」の3点セットで話せれば合格。',
  instructorCheckPoint:'「その問題はなぜ起きたのですか？根本原因は何ですか？」と深掘りする。'
},
'sc12-05': {
  commonMistakes:['AIを使ったことを隠して「全部自分で書きました」と言ってしまう','「全部AIに作ってもらいました」とだけ言って自分の判断を説明できない'],
  passLine:'「AI-USAGE.mdを提示しながら採用した箇所と修正した理由を説明できれば」合格。',
  instructorCheckPoint:'「このコードをAIが生成した場合、あなたが判断してどう修正しましたか？」と質問する。'
},
'sc12-06': {
  commonMistakes:['「特にありません」と答えてしまう（改善点がないアプリは完璧すぎると思われる）','「もっとページを追加したい」などの表面的な回答に留まる'],
  passLine:'「JWT認証・通知機能・テストカバレッジ向上など技術的に意味のある追加機能」が言えれば合格。',
  instructorCheckPoint:'「その機能を追加するとしたら、まず何から始めますか？」と深掘りする。'
},
'sc12-07': {
  commonMistakes:['「分かりません」と言って質問しないまま終業する','Slackで長文を書かずに要点をまとめずに聞いてしまう'],
  passLine:'「自己紹介・業務確認・環境構築・規約確認・不明点はすぐ質問」の5点が言えれば合格。',
  instructorCheckPoint:'ロールプレイで初日の朝礼を再現して適切な自己紹介をさせる。'
},
'sc12-08': {
  commonMistakes:['「修正します」だけで指摘の意味を理解しないままコードを変える','指摘された理由を聞かずに「分かりました」と答えて後で同じミスをする'],
  passLine:'「理解→質問→修正→コメント返信の4ステップ」が言えれば合格。',
  instructorCheckPoint:'模擬コードレビューを行って「このコメントはどういう意味ですか？」と質問させる。'
},
'sc12-09': {
  commonMistakes:['「フルスタックエンジニアになりたいです」だけで具体性がない','3年後・5年後のイメージがなく「その時に考えます」と言ってしまう'],
  passLine:'「具体的な役割・技術・貢献イメージ」が3文以上で言えれば合格。',
  instructorCheckPoint:'「そのビジョンを実現するために今取り組んでいることは？」と深掘りする。'
},
'sc12-10': {
  commonMistakes:['学習プロセスの話ばかりで「苦労した=つまずいた」エピソードが出てこない','「レッスンが良かった」など表面的な感想で終わる'],
  passLine:'「具体的なつまずきと解決エピソード・その時の感情変化」が話せれば合格。',
  instructorCheckPoint:'「そのつまずきを通じて何を学びましたか？今後どう活かしますか？」と深掘りする。'
}

};