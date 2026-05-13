/* =========================================================
   data/lesson-p02.js  ─  Phase 2「HTML / CSS」詳細コンテンツ
   Chapter 2-1（HTML基礎）完全版 + 他Chapter骨格
   ========================================================= */
window.LESSON_P02 = {

/* ===========================
   Chapter 2-1：HTMLの基礎
   =========================== */
'l02-1-1': {
  id:'l02-1-1', chapter:'c02-1', num:'2-1-1',
  title:'HTMLとは何か・最初のHTMLを作る',
  duration:'30分',
  goal:'HTMLの役割を理解し、html-basic/index.html を作成してブラウザに「Hello World」を表示できる。',
  why:'WebページはすべてHTMLで構成されている。HTMLを書けないとWeb開発のスタートラインにも立てない。',
  fieldUse:'実務でHTMLを直接書くのは少なくなったが（ReactはJSXで書く）、デバッグ時にHTMLを読めないと詰まる。基礎は必ず身につける。',
  analogy:'HTMLは「Webページの骨組み」。家を建てるとき、柱・壁・屋根という構造が必要なように、Webページも見出し・段落・画像・リンクという構造が必要。HTMLはその骨組みを作る言語。',
  terms:[
    {term:'HTML', meaning:'HyperText Markup Languageの略。Webページの構造・内容を記述する言語。'},
    {term:'タグ', meaning:'<h1>のように山かっこで囲んだHTML要素の印。開始タグ<h1>と終了タグ</h1>のペアで使うものが多い。'},
    {term:'要素（element）', meaning:'開始タグから終了タグまでのひとまとまり。<p>段落のテキスト</p> が1つの要素。'},
    {term:'DOCTYPE宣言', meaning:'<!DOCTYPE html>で始まるHTMLファイルの最初の行。「これはHTML5文書です」とブラウザに伝える。'},
    {term:'head要素', meaning:'ページのメタ情報（タイトル・文字コード・CSSのリンクなど）を入れる場所。ブラウザには表示されない。'},
    {term:'body要素', meaning:'実際にブラウザに表示されるコンテンツを入れる場所。'},
    {term:'charset', meaning:'文字コードの指定。UTF-8を指定しないと日本語が文字化けする。'},
    {term:'Live Server', meaning:'ファイルを保存するとブラウザが自動でリロードされるVSCode拡張機能。'}
  ],
  steps:[
    {
      num:1, title:'フォルダとファイルを作成する',
      description:'まず作業フォルダを作り、HTMLファイルを作成する。',
      windows:'# ターミナルで実行\ncd ~/Desktop/dev\nmkdir html-basic\ncd html-basic\ntouch index.html\n\n# VSCodeで開く\ncode .  # ← 「.」はカレントフォルダを意味する',
      mac:'cd ~/Desktop/dev\nmkdir html-basic\ncd html-basic\ntouch index.html\ncode .'
    },
    {
      num:2, title:'HTMLの雛形を入力する',
      description:'VSCodeで index.html を開き、以下を入力する。「!」キーを押してTabを押すと自動入力される（Emmet機能）。',
      windows:'VSCodeで index.html をクリックして開く → 以下のHTMLを入力する。',
      mac:'同上。'
    },
    {
      num:3, title:'ブラウザで確認する',
      description:'Live Serverを使ってブラウザで表示を確認する。',
      windows:'VSCode右下の「Go Live」ボタンをクリック、またはindex.htmlを右クリック→「Open with Live Server」',
      mac:'同上。'
    }
  ],
  code:'<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>はじめてのHTML</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <p>これは私が最初に作ったWebページです。</p>\n</body>\n</html>',
  codeExplanation:[
    {line:'<!DOCTYPE html>', meaning:'「これはHTML5の文書です」とブラウザに宣言する。必ず最初に書く。'},
    {line:'<html lang="ja">', meaning:'HTMLの始まり。lang="ja"は「日本語のページ」という意味。音声読み上げソフトなどが使う。'},
    {line:'<meta charset="UTF-8">', meaning:'文字コードをUTF-8に設定。これがないと日本語が文字化けする。'},
    {line:'<meta name="viewport" ...>', meaning:'スマホでの表示を適切に調整するための設定。必ず入れる。'},
    {line:'<title>はじめてのHTML</title>', meaning:'ブラウザのタブに表示されるページのタイトル。検索エンジンにも使われる。'},
    {line:'</head>', meaning:'headの終わり。ここまでが「ページの設定情報」。'},
    {line:'<body>', meaning:'ここからブラウザに実際に表示される内容を書く。'},
    {line:'<h1>Hello World!</h1>', meaning:'一番大きな見出し（heading 1）。ページに1つだけ使うのが推奨。'},
    {line:'<p>これは...</p>', meaning:'段落（paragraph）。文章のまとまりを表すタグ。'},
    {line:'</body></html>', meaning:'bodyとhtmlの終わり。忘れると表示がおかしくなることがある。'}
  ],
  expectedOutput:'ブラウザに「Hello World!」と大きな見出しが表示され、その下に説明文が表示されている。',
  errors:[
    {msg:'文字化けする（日本語が???や■になる）', cause:'<meta charset="UTF-8">が抜けている。またはファイルの保存文字コードがUTF-8でない',
     fix:'<meta charset="UTF-8">をheadの中に追加。VSCodeのステータスバー右下の文字コードが「UTF-8」になっているか確認。'},
    {msg:'ブラウザに何も表示されない', cause:'bodyの外にコンテンツを書いている。またはファイルが保存されていない',
     fix:'<body>の中にコンテンツを書いているか確認。Ctrl+S（Cmd+S）で保存。'},
    {msg:'Live Serverのボタンが出ない', cause:'Live Server拡張機能がインストールされていない',
     fix:'VSCodeの拡張機能から「Live Server」を検索してインストール。'}
  ],
  quiz:[
    {q:'<!DOCTYPE html>は何のために書きますか？', a:'「これはHTML5の文書です」とブラウザに宣言するため。'},
    {q:'日本語の文字化けを防ぐために必要なタグは？', a:'<meta charset="UTF-8">'},
    {q:'bodyタグの役割は？', a:'ブラウザに実際に表示されるコンテンツを入れる場所。'}
  ],
  miniTask:'index.htmlを修正して以下を表示させてください：\n1. タイトルを「私の自己紹介ページ」に変える\n2. h1を「こんにちは！私は[自分の名前]です」に変える\n3. pタグを追加して「[出身地]出身のエンジニア志望です」と表示させる\n\nライブサーバーで表示確認し、スクリーンショットを撮る。',
  aiOk:['HTMLのタグの意味を教えてください', 'headとbodyの違いを初心者向けに説明してください'],
  aiNg:['私の自己紹介HTMLを全部作ってください（自分で書く練習が大切）'],
  interviewQ:['HTMLとは何ですか？', 'headとbodyの違いは？', 'charset=UTF-8はなぜ必要ですか？'],
  nextLesson:'l02-1-2'
},

'l02-1-2': {
  id:'l02-1-2', chapter:'c02-1', num:'2-1-2',
  title:'見出し・段落・リスト・改行',
  duration:'25分',
  goal:'h1〜h6・p・ul・ol・li・br・hrタグを使って、構造のある文書を作れる。',
  why:'タグの使い分けはSEOに影響する。h1を複数使ったり、装飾目的でタグを選ぶのはよくある間違い。',
  fieldUse:'ReactやNext.jsでもHTMLのタグは使う。意味のないdivだらけのコードはコードレビューで指摘される。',
  analogy:'h1〜h6は章・節・項の見出し。h1が「章」、h2が「節」、h3が「項」。本の目次のような階層構造を作る。',
  terms:[
    {term:'h1〜h6', meaning:'見出しタグ。h1が最大（一番重要）、h6が最小。1ページにh1は1つが推奨。'},
    {term:'p', meaning:'段落（paragraph）。文章のひとまとまりを表す。ブロック要素なので自動的に改行される。'},
    {term:'ul / ol', meaning:'ulは順序なしリスト（Unordered List）、olは順序ありリスト（Ordered List）。'},
    {term:'li', meaning:'リストの項目（List Item）。ul/olの中に入れる。'},
    {term:'br', meaning:'改行（line BReak）。終了タグなし。テキスト内で改行したい場合に使う。しかし乱用は禁止。'},
    {term:'hr', meaning:'水平線（Horizontal Rule）。セクション区切りに使う。終了タグなし。'}
  ],
  steps:[
    {
      num:1, title:'見出しタグを試す',
      description:'h1〜h6の違いを確認する。',
      windows:'index.htmlのbody内に以下を追記して Live Serverで確認する。',
      mac:'同上。'
    }
  ],
  code:'<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>タグの練習</title>\n</head>\n<body>\n\n  <!-- 見出し（h1はページに1つだけが原則） -->\n  <h1>大見出し（h1）</h1>\n  <h2>中見出し（h2）</h2>\n  <h3>小見出し（h3）</h3>\n  <h4>さらに小さい（h4）</h4>\n\n  <!-- 段落 -->\n  <p>これは1つ目の段落です。段落の中ではテキストが連続して表示されます。</p>\n  <p>これは2つ目の段落です。pタグを使うと自動的に上下に余白ができます。</p>\n\n  <!-- 順序なしリスト（点が付く） -->\n  <ul>\n    <li>HTML</li>\n    <li>CSS</li>\n    <li>JavaScript</li>\n  </ul>\n\n  <!-- 順序ありリスト（番号が付く） -->\n  <ol>\n    <li>環境構築（Phase 0）</li>\n    <li>Web基礎（Phase 1）</li>\n    <li>HTML/CSS（Phase 2）</li>\n  </ol>\n\n  <!-- 水平線（セクション区切り） -->\n  <hr>\n\n  <!-- 段落内での改行（多用禁止） -->\n  <p>1行目<br>2行目（brで改行）</p>\n\n</body>\n</html>',
  codeExplanation:[
    {line:'<!-- コメント -->', meaning:'HTMLのコメント。ブラウザには表示されない。メモや説明を書くのに使う。'},
    {line:'<h1>〜<h4>', meaning:'h1が一番大きく、数字が増えるほど小さくなる。見た目だけでなく「重要度の順番」を意味する。'},
    {line:'<ul><li>...</li></ul>', meaning:'ulがリストの入れ物、liが各項目。ulは「•」（ビュレット）が付く。'},
    {line:'<ol><li>...</li></ol>', meaning:'olは番号付きリスト。1.2.3.と自動で番号が付く。'},
    {line:'<hr>', meaning:'水平線。閉じタグは不要（自己終了タグ）。セクションを区切るのに使う。'},
    {line:'<br>', meaning:'強制改行。多用するとSEOに悪影響。改行が必要なら<p>で段落を分けるのが本来の使い方。'}
  ],
  expectedOutput:'ブラウザで見出しが大小で表示され、2種類のリスト（点・番号付き）と水平線が表示されている。',
  errors:[
    {msg:'ulやolの中にliが直接ない', cause:'liの外にテキストを書いている', fix:'<ul><li>テキスト</li></ul>のようにli必ず中に入れる。'},
    {msg:'改行されない', cause:'テキストに改行を入れてもHTMLでは無視される', fix:'<br>タグを使うか、<p>で段落を分ける。'}
  ],
  quiz:[
    {q:'h1タグは1ページに何個使うのが推奨ですか？', a:'1個。SEOの観点からh1は1ページに1つが推奨。'},
    {q:'ulとolの違いは？', a:'ulは順序なし（点が付く）、olは順序あり（番号が付く）リスト。'},
    {q:'brタグを多用してはいけない理由は？', a:'段落構造（pタグ）を使うのが正しい。brの多用はセマンティックな構造を壊し、SEOに悪影響。'}
  ],
  miniTask:'「私の好きなもの」というページを作ってください：\n- h1：ページタイトル\n- h2：「好きな食べ物」「好きな技術」の2つの見出し\n- それぞれh2の下にulリストで3項目ずつ\n- pタグで自己紹介文を1段落',
  aiOk:['h1〜h6の使い分けを教えてください', 'SEOとHTMLの関係を初心者向けに説明してください'],
  aiNg:['ページ全体を作ってください（自分で書く練習が大切）'],
  interviewQ:['h1タグは何個使っても良いですか？', 'ulとolはどう使い分けますか？'],
  nextLesson:'l02-1-3'
},

'l02-1-3': {
  id:'l02-1-3', chapter:'c02-1', num:'2-1-3',
  title:'リンク・画像・フォームの基本',
  duration:'30分',
  goal:'a・img・form・input・button タグを使って、リンク・画像表示・簡単なフォームを作れる。',
  why:'リンク・画像・フォームはほぼ全てのWebサイトで使われる。特にフォームはお問い合わせ・ログイン・検索など必須の要素。',
  fieldUse:'aタグのhref属性の書き方（相対パス・絶対パス・ページ内リンク）は面談でよく聞かれる。inputのtype属性を知らないと適切なフォームが作れない。',
  analogy:'aタグはドア（他のページへの入口）、imgタグは絵画（画像を貼る額縁）、formは郵便ポスト（ユーザーの入力を送る箱）。',
  terms:[
    {term:'a タグ', meaning:'アンカー（Anchor）タグ。href属性に移動先URLを書く。ハイパーリンクを作る。'},
    {term:'href属性', meaning:'「どこへリンクするか」を指定する属性。絶対URLか相対パスで書く。'},
    {term:'target="_blank"', meaning:'リンクを新しいタブで開く属性。外部サイトへのリンクに使う。'},
    {term:'img タグ', meaning:'画像を表示するタグ。src属性に画像パス、alt属性に代替テキストを書く（省略禁止）。'},
    {term:'alt属性', meaning:'画像が表示できない時や音声ブラウザが読み上げる代替テキスト。SEOにも影響。空文字alt=""でも良いが、意味のある画像には説明文を入れる。'},
    {term:'form タグ', meaning:'ユーザーからの入力を受け取る領域。action属性に送信先URLを指定。'},
    {term:'input タグ', meaning:'テキスト入力・チェックボックス・ラジオボタンなど様々な入力部品。type属性で種類を指定。'},
    {term:'button タグ', meaning:'クリックできるボタン。type="submit"でフォームを送信。'}
  ],
  steps:[
    {
      num:1, title:'画像ファイルを用意する',
      description:'html-basicフォルダの中にimagesフォルダを作り、テスト用の画像を置く。',
      windows:'cd ~/Desktop/dev/html-basic\nmkdir images\n\n# 画像は以下のいずれかで用意：\n# 方法1：自分で好きな画像をダウンロードして images/ に保存\n# 方法2：プレースホルダー画像（外部URL）を使う',
      mac:'同上。'
    }
  ],
  code:'<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>リンク・画像・フォーム</title>\n</head>\n<body>\n\n  <h1>リンク・画像・フォームの練習</h1>\n\n  <!-- ─── リンク ─── -->\n  <h2>リンク（aタグ）</h2>\n\n  <!-- 外部リンク：新しいタブで開く -->\n  <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">\n    Googleへ（新しいタブで開く）\n  </a>\n\n  <!-- 内部リンク：同じサイトの別ページへ -->\n  <a href="about.html">自己紹介ページへ</a>\n\n  <!-- ページ内リンク：同じページのidへジャンプ -->\n  <a href="#contact">お問い合わせへ移動</a>\n\n  <!-- ─── 画像 ─── -->\n  <h2>画像（imgタグ）</h2>\n\n  <!-- ローカルの画像 -->\n  <img src="images/profile.jpg" alt="プロフィール写真" width="200">\n\n  <!-- 外部の画像（テスト用プレースホルダー） -->\n  <img src="https://picsum.photos/300/200" alt="サンプル画像300x200">\n\n  <!-- ─── フォーム ─── -->\n  <h2 id="contact">お問い合わせフォーム（formタグ）</h2>\n\n  <form action="#" method="post">\n\n    <!-- テキスト入力 -->\n    <label for="name">お名前：</label>\n    <input type="text" id="name" name="name" placeholder="山田 太郎" required>\n    <br><br>\n\n    <!-- メールアドレス入力 -->\n    <label for="email">メールアドレス：</label>\n    <input type="email" id="email" name="email" placeholder="taro@example.com" required>\n    <br><br>\n\n    <!-- テキストエリア（複数行） -->\n    <label for="message">メッセージ：</label><br>\n    <textarea id="message" name="message" rows="4" cols="40" placeholder="ご質問・ご要望をどうぞ"></textarea>\n    <br><br>\n\n    <!-- チェックボックス -->\n    <label>\n      <input type="checkbox" name="agree" required>\n      プライバシーポリシーに同意する\n    </label>\n    <br><br>\n\n    <!-- 送信ボタン -->\n    <button type="submit">送信する</button>\n\n  </form>\n\n</body>\n</html>',
  codeExplanation:[
    {line:'rel="noopener noreferrer"', meaning:'target="_blank"と一緒に使う。セキュリティ対策。外部リンクを新しいタブで開く際に必須。'},
    {line:'href="#contact"', meaning:'#のあとはid名。同じページ内のid="contact"の要素までスクロールする。'},
    {line:'<img src="..." alt="...">', meaning:'imgは自己終了タグ（閉じタグなし）。altは必須。画像が表示されない時の代替テキスト。'},
    {line:'width="200"', meaning:'画像の幅を200pxに指定。heightを省略すると縦横比を保って縮小される。'},
    {line:'<label for="name">', meaning:'forとinputのidを同じにすると、labelをクリックするとinputにフォーカスが当たる。アクセシビリティに重要。'},
    {line:'type="email"', meaning:'メールアドレス専用の入力欄。スマホでは@キーが表示されやすくなる。簡易バリデーション機能もある。'},
    {line:'required', meaning:'必須入力項目の指定。送信ボタンを押した時に空欄だとエラーが出る。'},
    {line:'<textarea>', meaning:'複数行入力できるテキストボックス。rowsで行数、colsで列数を指定。'}
  ],
  expectedOutput:'ブラウザにリンク・画像・フォームが表示されている。フォームで送信ボタンを押すと未入力チェックが動く。',
  errors:[
    {msg:'画像が表示されない（alt文字が表示される）', cause:'srcのパスが間違っている', fix:'imagesフォルダの中にファイルがあるか確認。src="images/ファイル名.jpg"のパスをlsコマンドで確認する。'},
    {msg:'labelをクリックしてもフォーカスが当たらない', cause:'labelのforとinputのidが一致していない', fix:'<label for="name">と<input id="name">のname部分が完全一致しているか確認。'},
    {msg:'フォームの送信が動かない', cause:'action属性が正しく設定されていない、またはサーバー側の処理がない', fix:'ここではaction="#"のままでOK。実際の送信にはサーバー（バックエンド）が必要になる。'}
  ],
  quiz:[
    {q:'外部リンクを新しいタブで開くには何を追加しますか？', a:'target="_blank" rel="noopener noreferrer"'},
    {q:'imgのalt属性はなぜ必要ですか？', a:'画像が表示されない時の代替テキスト・アクセシビリティ・SEOのため。'},
    {q:'labelのfor属性とinputのid属性の関係は？', a:'同じ値を設定することで、labelクリック時に対応するinputにフォーカスが当たる。'}
  ],
  miniTask:'以下のページを作ってください（about.html）：\n1. 自分のプロフィール写真（またはプレースホルダー画像）\n2. 自己紹介文\n3. スキル一覧（リンク付き。例：HTMLクリックでMDNのHTML解説へ）\n4. 簡単なお問い合わせフォーム（名前・メール・メッセージ・送信ボタン）',
  aiOk:['aタグのhref属性に書けるものの種類を教えてください', 'inputのtype属性の種類一覧を教えてください'],
  aiNg:['about.htmlを全部作ってください'],
  interviewQ:['aタグのtarget="_blank"を使うとき何を気をつけますか？', 'imgのalt属性はなぜ重要ですか？'],
  nextLesson:'l02-1-4'
},

'l02-1-4': {
  id:'l02-1-4', chapter:'c02-1', num:'2-1-4',
  title:'ブロック要素とインライン要素',
  duration:'20分',
  goal:'ブロック要素とインライン要素の違いを理解し、適切にタグを選べる。divとspanの使い方を覚える。',
  why:'CSSでレイアウトを組む際、要素の「性質（ブロック/インライン）」を知らないと思い通りに配置できない。',
  fieldUse:'displayプロパティを使ってblock↔inlineを切り替えることがあるが、まず「デフォルトはどちらか」を知っておく必要がある。',
  analogy:'ブロック要素は「段落」—前後が自動改行され幅いっぱいに広がる。インライン要素は「文章中の単語」—文章の流れを壊さずに続く。',
  terms:[
    {term:'ブロック要素', meaning:'前後が自動改行され、幅が親要素いっぱいに広がる要素。h1〜h6・p・div・ul・ol・form・headerなど。'},
    {term:'インライン要素', meaning:'前後が改行されず、テキストの流れの中に続く要素。a・img・span・strong・em・inputなど。'},
    {term:'div', meaning:'Division。特に意味を持たないブロック要素。レイアウトのグループ化に使う。意味のあるタグがない場合の最後の手段。'},
    {term:'span', meaning:'特に意味を持たないインライン要素。テキストの一部だけスタイルを変えたい時に使う。'},
    {term:'strong', meaning:'強調（重要）を表すインライン要素。ブラウザでは太字で表示される。SEOにも影響。'},
    {term:'em', meaning:'強調（アクセント）を表すインライン要素。ブラウザではイタリック（斜め）で表示される。'}
  ],
  steps:[],
  code:'<!-- ブロック要素の例（前後に改行が入る） -->\n<div>これはdiv（ブロック）</div>\n<div>この前は自動的に改行される</div>\n\n<p>段落（pもブロック要素）</p>\n<h2>見出し（hもブロック要素）</h2>\n\n<!-- インライン要素の例（テキストの流れに続く） -->\n<p>\n  <strong>太字にしたいテキスト</strong>が文章の中に\n  <em>斜め（強調）のテキスト</em>と一緒に並ぶ。\n  <a href="#">リンクもインライン</a>なので改行されない。\n</p>\n\n<!-- spanで部分的にスタイルを当てる例 -->\n<p>\n  合格点は<span style="color:red; font-weight:bold;">70点以上</span>です。\n</p>\n\n<!-- divでグループ化する例 -->\n<div class="card">\n  <h3>カードのタイトル</h3>\n  <p>カードの内容</p>\n  <a href="#">詳細を見る</a>\n</div>',
  codeExplanation:[
    {line:'<div>', meaning:'意味のないブロック要素。CSSでグループとしてスタイルを当てる入れ物として使う。'},
    {line:'<span>', meaning:'意味のないインライン要素。テキストの一部だけCSSを当てる時に使う。'},
    {line:'<strong>', meaning:'「重要」を表す太字。見た目だけ太字にしたいならCSSのfont-weight:boldを使う。'},
    {line:'style="color:red"', meaning:'インラインスタイル。HTMLの中に直接CSSを書く方法。実務では分離するが練習では使ってOK。'}
  ],
  expectedOutput:'ブロック要素とインライン要素の違いがブラウザで視覚的に確認できる状態。',
  errors:[
    {msg:'ブロック要素の中にブロック要素を入れたのに改行されない', cause:'CSSで変更されている可能性がある', fix:'ブラウザのデベロッパーツールで要素のCSSを確認する。'},
    {msg:'pタグの中にdivを入れた', cause:'HTMLの規則違反。pタグの中にはインライン要素のみ入れられる', fix:'divをpの外に出す。または意味上も段落なら全体をdivで包む。'}
  ],
  quiz:[
    {q:'divとspanの違いは？', a:'divはブロック要素（改行される）、spanはインライン要素（改行されない）。'},
    {q:'pタグの中にdivタグを入れてもいいですか？', a:'いけない。pタグの中にはインライン要素のみ入れることができる。'},
    {q:'strongとb（太字）の違いは？', a:'strongは「重要」という意味を持つ（SEO・アクセシビリティに影響）。bは見た目だけ太字にする。'}
  ],
  miniTask:'既存のindex.htmlを見直して、divを使っている場所がheader・main・footerなどのセマンティックタグに置き換えられないか確認して修正する。',
  aiOk:['HTMLのブロック要素の一覧を教えてください', 'pタグの中に入れてはいけない要素は？'],
  aiNg:[],
  interviewQ:['ブロック要素とインライン要素の違いは？'],
  nextLesson:'l02-1-5'
},

'l02-1-5': {
  id:'l02-1-5', chapter:'c02-1', num:'2-1-5',
  title:'セマンティックHTMLで意味のあるページを作る',
  duration:'30分',
  goal:'header・nav・main・article・section・aside・footer を使ってセマンティックなHTMLを書ける。',
  why:'divだらけのHTMLは「意味が分からない」。セマンティックHTMLはSEO・アクセシビリティ・チームの可読性のすべてを改善する。現場でも「なぜここをdivにしたのか」とレビューで聞かれる。',
  fieldUse:'React/Next.jsでも最終的にHTMLが出力される。コンポーネントの中にセマンティックなHTMLを書くのが現場のルール。',
  analogy:'セマンティックHTMLは「ラベルが貼られた引き出し」。headerが頭、footerが足、mainが本文。ラベルがあると中を開けなくても何が入っているか分かる。',
  terms:[
    {term:'セマンティック（Semantic）', meaning:'「意味のある」という意味。HTMLのタグが見た目だけでなく、内容の意味を表すこと。'},
    {term:'header', meaning:'ページ上部またはセクションの見出し部分。ロゴ・ナビゲーションなどを含む。'},
    {term:'nav', meaning:'ナビゲーションリンクの集合。メニュー・パンくずリストなど。'},
    {term:'main', meaning:'ページのメインコンテンツ。1ページに1つ。サイドバー・ヘッダー・フッターを除く主要コンテンツ。'},
    {term:'article', meaning:'独立したコンテンツ（ブログ記事・ニュース記事・コメントなど）。単独で意味が通じる内容。'},
    {term:'section', meaning:'テーマでまとまったコンテンツのグループ。見出しと一緒に使う。'},
    {term:'aside', meaning:'補足情報・サイドバー・広告など。メインコンテンツと間接的に関連する情報。'},
    {term:'footer', meaning:'ページ下部。著作権・連絡先・プライバシーポリシーリンクなど。'}
  ],
  steps:[],
  code:'<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>セマンティックHTML</title>\n</head>\n<body>\n\n  <!-- ページ全体のヘッダー -->\n  <header>\n    <h1>Hoku Tech</h1>\n    <nav>\n      <ul>\n        <li><a href="#">ホーム</a></li>\n        <li><a href="#">カリキュラム</a></li>\n        <li><a href="#">お問い合わせ</a></li>\n      </ul>\n    </nav>\n  </header>\n\n  <!-- メインコンテンツ -->\n  <main>\n\n    <!-- トップセクション -->\n    <section>\n      <h2>未経験からフルスタックエンジニアへ</h2>\n      <p>AIと協働できるエンジニアを育てます。</p>\n    </section>\n\n    <!-- ブログ記事のようなコンテンツ -->\n    <article>\n      <h2>Phase 2 受講レポート</h2>\n      <p>HTML/CSSを3日間学んで自己紹介ページを作れました。</p>\n      <p><time datetime="2024-01-15">2024年1月15日</time></p>\n    </article>\n\n    <!-- サイドバー（補足情報） -->\n    <aside>\n      <h3>関連リンク</h3>\n      <ul>\n        <li><a href="#">MDN Web Docs</a></li>\n        <li><a href="#">GitHub Pages</a></li>\n      </ul>\n    </aside>\n\n  </main>\n\n  <!-- ページ全体のフッター -->\n  <footer>\n    <p>&copy; 2024 Hoku Tech. All rights reserved.</p>\n    <nav>\n      <a href="#">プライバシーポリシー</a> |\n      <a href="#">利用規約</a>\n    </nav>\n  </footer>\n\n</body>\n</html>',
  codeExplanation:[
    {line:'<header>', meaning:'ページ上部の入れ物。ロゴ・サイト名・ナビゲーションを含む。pageのheaderとsectionのheaderの両方に使える。'},
    {line:'<nav>', meaning:'ナビゲーションのまとまり。検索エンジンがサイト構造を理解するのに役立つ。'},
    {line:'<main>', meaning:'メインコンテンツ。ページに1つだけ。Google等の検索エンジンはmain内を重視する。'},
    {line:'<article>', meaning:'再利用可能な独立したコンテンツ。ブログ記事・ニュース記事・商品詳細などに使う。'},
    {line:'<section>', meaning:'テーマでまとめたコンテンツのグループ。必ず見出し（h2等）と一緒に使う。'},
    {line:'<aside>', meaning:'補足・サイドバー・広告など。mainとは独立した情報。'},
    {line:'<time datetime="...">', meaning:'機械可読な日時。datetime属性にISO形式（2024-01-15）で書く。'},
    {line:'&copy;', meaning:'著作権記号©のHTMLエンティティ。'}
  ],
  expectedOutput:'ブラウザにheader・main・footerが正しく配置されたページが表示されている。開発者ツールでElements確認時に意味のあるタグ構造が確認できる。',
  errors:[
    {msg:'mainが2つある', cause:'HTMLルール違反。mainは1ページに1つだけ', fix:'2つ目のmainをsectionやdivに変更する。'},
    {msg:'navの中に直接テキストを書いている', cause:'navの中はul/li構造かaタグが一般的', fix:'<nav><ul><li><a href="#">...</a></li></ul></nav>の形にする。'}
  ],
  quiz:[
    {q:'articleとsectionの使い分けは？', a:'articleは単独で意味が通じる独立したコンテンツ、sectionはテーマでまとめたグループ（見出しと一緒に使う）。'},
    {q:'mainタグは1ページにいくつ使えますか？', a:'1つ。'},
    {q:'なぜdivの代わりにsemantic要素を使うのですか？', a:'SEO向上・アクセシビリティ改善・コードの可読性向上のため。'}
  ],
  miniTask:'これまで作ったindex.htmlをセマンティックHTMLで全面改善する：\n- div → header/main/footer/section/article/nav に置き換える\n- h1はページに1つだけにする\n- navにはul/liを使う\n- 改善後のコードをGitHubにpushして、before/afterのスクリーンショットを撮る',
  aiOk:['このHTMLはセマンティック的に正しいですか：[HTMLを貼る]'],
  aiNg:['ページ全体のHTMLを作ってください'],
  interviewQ:['セマンティックHTMLとは何ですか？なぜ重要ですか？', 'articleとsectionの違いは？'],
  nextLesson:'l02-2-1'
},

/* ===========================
   Chapter 2-2：CSSの基礎（骨格）
   =========================== */
'l02-2-1': {
  id:'l02-2-1', chapter:'c02-2', num:'2-2-1',
  title:'CSSとは何か・HTMLへの適用方法',
  duration:'25分',
  goal:'CSSの役割を理解し、外部CSSファイルをHTMLにリンクして基本的なスタイルを当てられる。',
  why:'HTMLは構造、CSSは見た目。この役割分担が「保守しやすいコード」の基本。HTMLにstyle直書き（インラインスタイル）は実務で禁止されることがある。',
  fieldUse:'CSSファイルを1つにまとめるか・コンポーネントごとに分けるかは現場で議論になる。まず「外部CSSファイルに書く」基本を身につける。',
  analogy:'HTMLが建物の骨組みなら、CSSは内装・塗装。骨組みを作った後で、壁の色・床の素材・照明を決めるのと同じ。',
  terms:[
    {term:'CSS', meaning:'Cascading Style Sheetsの略。HTMLの見た目（色・フォント・余白・レイアウト等）を定義する言語。'},
    {term:'セレクタ', meaning:'「どの要素にスタイルを当てるか」を指定する部分。タグ名・クラス名・id名で指定できる。'},
    {term:'プロパティ', meaning:'変更したいスタイルの名前（color・font-size・marginなど）。'},
    {term:'値（バリュー）', meaning:'プロパティに設定する内容（red・16px・20pxなど）。'},
    {term:'宣言', meaning:'「プロパティ: 値;」のセット。複数の宣言をまとめて「宣言ブロック」という。'},
    {term:'外部CSSファイル', meaning:'.cssという拡張子のファイル。HTMLの<link>タグで読み込む。分離することで保守性が上がる。'},
    {term:'カスケード', meaning:'複数のスタイルが衝突した時、優先度のルール（詳細度・順序）に基づいてどちらを適用するかを決める仕組み。'}
  ],
  steps:[
    {
      num:1, title:'CSSファイルを作成する',
      description:'',
      windows:'cd ~/Desktop/dev/html-basic\ntouch style.css\n# または VSCodeでフォルダを右クリック→新しいファイル→style.css',
      mac:'同上。'
    },
    {
      num:2, title:'HTMLにCSSを読み込む',
      description:'index.htmlのheadにlinkタグを追加する。',
      windows:'VSCodeでindex.htmlを開き、</head>の直前に以下を追加する。',
      mac:'同上。'
    }
  ],
  code:'/* ─── style.css ─── */\n\n/* 全体のリセット（ブラウザごとのデフォルトスタイル差異をなくす） */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n/* bodyのベーススタイル */\nbody {\n  font-family: "Noto Sans JP", "Hiragino Sans", Arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.8;\n  color: #333333;\n  background-color: #ffffff;\n}\n\n/* 見出しのスタイル */\nh1 {\n  font-size: 2rem;\n  color: #1a1a2e;\n  margin-bottom: 16px;\n}\n\nh2 {\n  font-size: 1.5rem;\n  color: #16213e;\n  margin-top: 32px;\n  margin-bottom: 12px;\n}\n\n/* 段落のスタイル */\np {\n  margin-bottom: 16px;\n}\n\n/* リンクのスタイル */\na {\n  color: #2563eb;\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: underline;\n  color: #1d4ed8;\n}',
  codeExplanation:[
    {line:'/* コメント */', meaning:'CSSのコメント。/* と */ で囲む。HTMLコメントとは書き方が違う。'},
    {line:'* { }', meaning:'全要素に当てるCSSのリセット。margin・padding・box-sizingをリセットすることでブラウザ間の差異を減らす。'},
    {line:'box-sizing: border-box', meaning:'paddingとborderをwidth/heightの計算に含める設定。これがないと要素のサイズ計算が複雑になる。全要素に設定するのが現場の常識。'},
    {line:'font-family', meaning:'フォントの指定。カンマで区切ってフォールバック（代替フォント）を列挙する。最後はsans-serifのような汎用名。'},
    {line:'rem', meaning:'rootのem。htmlのフォントサイズを基準とした相対単位。1remはhtmlのfont-size（通常16px）と同じ。'},
    {line:'a:hover', meaning:'マウスが当たった（ホバー）時のスタイル。:が付くものを「疑似クラス」という。'}
  ],
  expectedOutput:'ブラウザでindex.htmlを開くとCSSが適用されてフォント・色・余白が変わっている状態。',
  errors:[
    {msg:'CSSが適用されない', cause:'linkタグのhrefのパスが間違っている。またはstyle.cssの場所が違う',
     fix:'index.htmlとstyle.cssが同じフォルダにあるか確認。<link href="style.css"のパスが正しいか確認。ブラウザのキャッシュをクリア（Ctrl+Shift+R）。'},
    {msg:'CSSの一部だけ適用されない', cause:'スペルミス・セミコロン忘れ・括弧の対応ミス', fix:'ブラウザのDevTools（F12）でElementsタブを開き、スタイルパネルで取り消し線が出ている部分を確認する。'}
  ],
  quiz:[
    {q:'CSSを外部ファイルに分ける理由は？', a:'HTMLと見た目を分離することで保守性が上がるから。同じCSSを複数ページで使いまわせる。'},
    {q:'box-sizing: border-boxを設定する理由は？', a:'paddingとborderをwidthの計算に含めることで、サイズ指定が直感的になるため。'},
    {q:'a:hoverはどんな時に動きますか？', a:'リンクにマウスカーソルが乗った（ホバーした）時。'}
  ],
  miniTask:'style.cssに以下を追加して、ブラウザで確認する：\n- h1のフォントサイズを2.5remにする\n- bodyの背景色を#f8f9faにする\n- ulのlist-styleを変更してみる（list-style: none; など）\n\nDevToolsのElementsタブで実際のCSSが適用されているか確認する。',
  aiOk:['CSSの詳細度（specificity）を初心者向けに説明してください', 'この CSSが効かない理由は何ですか：[コードを貼る]'],
  aiNg:['私のページのCSSを全部書いてください'],
  interviewQ:['CSSを外部ファイルに書く理由は？', 'box-sizing: border-boxはなぜ設定するのですか？'],
  nextLesson:'l02-2-2'
},

/* 残りのレッスンは骨格（タイトルとgoalのみ）*/
'l02-2-2': {
  id:'l02-2-2', chapter:'c02-2', num:'2-2-2',
  title:'セレクタの種類と優先度（詳細度）',
  duration:'30分',
  goal:'タグセレクタ・クラスセレクタ・IDセレクタ・属性セレクタを使い分け、CSSの詳細度（specificity）の仕組みを説明できる。',
  why:'CSSが「なぜか効かない」問題のほとんどは詳細度の理解不足。先に身につけておくと後の悩みが減る。',
  fieldUse:'現場ではクラスセレクタが基本。IDセレクタは詳細度が高すぎて後で困ることがある。',
  analogy:'詳細度は「命令の強さ」。上司（IDセレクタ）、同僚（クラス）、全員への一斉連絡（タグセレクタ）の順に強い。',
  terms:[
    {term:'タグセレクタ', meaning:'h1 { } のようにタグ名で指定。詳細度が最も低い。'},
    {term:'クラスセレクタ', meaning:'.card { } のように.クラス名で指定。最もよく使われる。'},
    {term:'IDセレクタ', meaning:'#header { } のように#id名で指定。詳細度が高く、1ページに1つしか使えない。'},
    {term:'詳細度（Specificity）', meaning:'CSSが競合した時どちらが優先されるかのスコア。ID > クラス > タグの順で強い。'}
  ],
  steps:[],
  code:'/* タグセレクタ */\np { color: blue; }\n\n/* クラスセレクタ（HTMLでclass="highlight"） */\n.highlight { background-color: yellow; }\n\n/* IDセレクタ（HTMLでid="main-title"） */\n#main-title { font-size: 3rem; }\n\n/* 子孫セレクタ（navの中のaだけに当てる） */\nnav a { color: white; }\n\n/* 直接の子要素セレクタ */\nul > li { list-style: none; }\n\n/* 疑似クラス */\n.btn:hover { background-color: darkblue; }\n.btn:focus { outline: 2px solid blue; }\ninput:disabled { opacity: 0.5; }\n\n/* 詳細度の計算例 */\n/* ID(100) + class(10) + tag(1) = スコア */\n/* p          → 0-0-1 */\n/* .highlight → 0-1-0 */\n/* #main-title → 1-0-0 */\n/* a:hover     → 0-1-1 */',
  errors:[
    {msg:'CSSが効かない', cause:'詳細度の低いセレクタが詳細度の高いセレクタに負けている', fix:'DevToolsで取り消し線を確認。より詳細なセレクタを使う、または!important（最終手段）。'}
  ],
  quiz:[
    {q:'クラスセレクタとIDセレクタの詳細度はどちらが高い？', a:'IDセレクタが高い（ID=100点、クラス=10点）。'},
    {q:'.nav a { }はどんな要素に当たりますか？', a:'class="nav"を持つ要素の中のaタグ（子孫）すべて。'}
  ],
  miniTask:'index.htmlでクラス・IDを使ったCSSを書き、DevToolsで詳細度を確認する。',
  aiOk:['CSSの詳細度の計算方法を教えてください'],
  aiNg:[],
  interviewQ:['CSSの詳細度とは何ですか？'],
  nextLesson:'l02-2-3'
},

'l02-2-3': {
  id:'l02-2-3', chapter:'c02-2', num:'2-2-3',
  title:'ボックスモデル・余白・サイズ',
  duration:'30分',
  goal:'ボックスモデル（content・padding・border・margin）を理解し、DevToolsでボックスを確認しながら余白を調整できる。',
  why:'レイアウト崩れの原因の多くはボックスモデルの誤解。「なぜかはみ出す」「なぜかズレる」はボックスを理解すれば解決できる。',
  fieldUse:'面談でよく聞かれる定番の質問。「ボックスモデルを図で説明してください」は必ず答えられるようにする。',
  analogy:'ボックスモデルはプレゼントの箱。中身（content）→ 緩衝材（padding）→ 箱の壁（border）→ 他の箱との隙間（margin）。',
  terms:[
    {term:'content', meaning:'要素の実際のコンテンツが入る領域。widthとheightで指定するのはここ（box-sizingによって変わる）。'},
    {term:'padding', meaning:'contentとborderの間の内側の余白。背景色が適用される。'},
    {term:'border', meaning:'要素の境界線。太さ・種類・色を指定できる。'},
    {term:'margin', meaning:'borderの外側の余白。隣接する要素との間隔。'}
  ],
  steps:[],
  code:'/* ボックスモデルの全プロパティ */\n.box {\n  /* コンテンツのサイズ */\n  width: 300px;\n  height: 200px;\n\n  /* 内側の余白（padding）- 上右下左の順 */\n  padding: 20px;            /* 全方向 */\n  padding: 10px 20px;       /* 上下 左右 */\n  padding: 10px 20px 30px;  /* 上 左右 下 */\n  padding: 10px 20px 30px 40px; /* 上 右 下 左（時計回り） */\n\n  /* 境界線（border） */\n  border: 1px solid #cccccc;   /* 太さ 種類 色 */\n  border-radius: 8px;           /* 角を丸くする */\n\n  /* 外側の余白（margin） */\n  margin: 16px;\n  margin: 0 auto;   /* 上下0、左右auto（=中央揃え） */\n}\n\n/* DevToolsで確認できるボックスモデル図 */\n/* ┌──────────────────────────────┐\n   │ margin                        │\n   │  ┌──────────────────────┐    │\n   │  │ border                │    │\n   │  │  ┌─────────────┐     │    │\n   │  │  │ padding       │    │    │\n   │  │  │  ┌─────────┐ │    │    │\n   │  │  │  │ content  │ │    │    │\n   │  │  │  └─────────┘ │    │    │\n   │  │  └─────────────┘     │    │\n   │  └──────────────────────┘    │\n   └──────────────────────────────┘ */',
  expectedOutput:'DevToolsのComputedタブでボックスモデルが図として確認できる。',
  errors:[],
  quiz:[
    {q:'marginとpaddingの違いは？', a:'marginは要素の外側の余白、paddingは要素の内側の余白。'},
    {q:'margin: 0 autoは何をしますか？', a:'上下の余白を0、左右をauto（均等）にする。ブロック要素を水平中央揃えにする定番手法。'}
  ],
  miniTask:'DevToolsのElementsタブでいくつかの要素をクリックし、ボックスモデルが表示されるComputedタブを確認する。',
  aiOk:['marginの相殺（マージンの相殺）について教えてください'],
  aiNg:[],
  interviewQ:['ボックスモデルとは何ですか？図で説明してください。'],
  nextLesson:'l02-2-4'
},

'l02-2-4': {
  id:'l02-2-4', chapter:'c02-2', num:'2-2-4',
  title:'色・フォント・テキストのスタイル',
  duration:'25分',
  goal:'色指定の4つの方法（キーワード・16進数・RGB・HSL）とフォントプロパティを使ってテキストスタイルを整えられる。',
  why:'デザインに合った色とフォントを正確に再現できることは、デザイナーと協働する現場で必須のスキル。',
  fieldUse:'デザインカンプには16進数の色コードが書かれていることが多い。Figmaなどのデザインツールから色コードをコピーしてCSSに貼る。',
  analogy:'色の指定方法は「色の言い方」。「赤」（キーワード）、「#FF0000」（16進数コード）、「rgb(255,0,0)」（RGB）はすべて同じ赤色を表す。',
  terms:[
    {term:'16進数カラーコード', meaning:'#ffffffのように#と6桁の16進数で色を表す方法。#ff0000が赤、#0000ffが青、#000000が黒、#ffffffが白。'},
    {term:'RGB', meaning:'Red・Green・Blueの光の三原色。それぞれ0〜255で指定。rgb(255, 0, 0)が赤。'},
    {term:'rgba', meaning:'RGBに透明度（0〜1）を加えたもの。rgba(0, 0, 0, 0.5)は半透明の黒。'},
    {term:'HSL', meaning:'色相(Hue)・彩度(Saturation)・明度(Lightness)で色を指定。人間にとって直感的に扱いやすい。'},
    {term:'Google Fonts', meaning:'Googleが無料で提供するWebフォント。linkタグで読み込んで使う。'}
  ],
  steps:[],
  code:'/* ─── 色の指定方法 ─── */\n.color-examples {\n  color: red;                     /* キーワード */\n  color: #e74c3c;                 /* 16進数 */\n  color: rgb(231, 76, 60);        /* RGB */\n  color: rgba(231, 76, 60, 0.8);  /* RGBA（透明度付き） */\n  color: hsl(6, 78%, 57%);        /* HSL */\n  background-color: #f8f9fa;\n}\n\n/* ─── フォントのスタイル ─── */\nbody {\n  /* Google Fontsを使う場合は<head>にlinkを追加 */\n  font-family: "Noto Sans JP", sans-serif;\n  font-size: 16px;         /* ベースのフォントサイズ */\n  font-weight: 400;        /* 太さ（100〜900、400=normal、700=bold）*/\n  line-height: 1.8;        /* 行間（数値のみ推奨：font-sizeの1.8倍） */\n  letter-spacing: 0.02em;  /* 文字間隔 */\n  color: #333333;\n}\n\n/* ─── テキストのスタイル ─── */\nh1 {\n  font-size: 2.5rem;     /* rem: rootのem（通常16pxが基準） */\n  font-weight: 700;      /* 太字 */\n  text-align: center;    /* 中央揃え */\n  text-transform: uppercase; /* 大文字変換 */\n}\n\n.description {\n  text-align: left;\n  text-decoration: underline; /* 下線 */\n  white-space: nowrap;        /* 折り返しなし */\n  overflow: hidden;           /* はみ出し非表示 */\n  text-overflow: ellipsis;    /* はみ出た部分を... で表示 */\n}',
  errors:[
    {msg:'Google Fontsが読み込まれない', cause:'<head>のlinkタグが正しくない、またはネット接続なし', fix:'GoogleFontsのサイトで目的のフォントを選択し、表示されたlinkをコピーしてHTMLのheadに貼る。'}
  ],
  quiz:[
    {q:'rgba(0, 0, 0, 0.5)は何色ですか？', a:'半透明（50%の透明度）の黒。'},
    {q:'remとpxの違いは？', a:'pxは固定のピクセル数、remはルート要素のフォントサイズ（通常16px）を基準とした相対単位。'}
  ],
  miniTask:'自分の好きな配色テーマでスタイルを作り、Google Fontsを読み込んで適用する。',
  aiOk:['この色コード#2563ebはどんな色ですか', 'font-weightの値の一覧を教えてください'],
  aiNg:[],
  interviewQ:['CSSで色を指定する方法をいくつか教えてください。'],
  nextLesson:'l02-3-1'
}

}; // end LESSON_P02