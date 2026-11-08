/**
 * L4 フロントエンドの基礎 (HTML・CSS・JavaScript) と L6 チーム開発。
 * 元教材の HTML/CSS (No.34〜36: float・IE 前提・エディタ不統一) を再構成し、
 * 元教材になかった JavaScript とチーム開発を新規に作成した。
 */
import type { AssignmentDef, LessonDef } from "./curriculum";
import { TEAM_PROCESS_RUBRIC } from "./rubrics";
import { source } from "./sources";

const FE1 = "content/code/l4-html-css";
const FE2 = "content/code/l4-javascript";

export const L4_FRONTEND: LessonDef[] = [
  {
    slug: "l4-html-css",
    title: "HTML と CSS の基礎 (構造・レイアウト・スマホ対応)",
    estimatedMinutes: 120,
    ...source(140),
    content: {
      objectives: [
        "header・nav・main・footer・見出し・ラベル付きフォームで、意味の通る HTML を書ける",
        "ボックスモデルと Flexbox で要素を並べられる",
        "メディアクエリでスマホと PC の表示を切り替え、横スクロールを出さないページを作れる",
      ],
      prerequisites: ["ターミナルの基本操作", "VS Code でファイルを作成・保存できる"],
      explanation: [
        {
          heading: "HTML は「意味」、CSS は「見た目」",
          body: "HTML はページの構造と意味を表します。<header> はページの上部、<nav> はメニュー、<main> は主な内容、<footer> は下部です。見出しは <h1> → <h2> → <h3> の順に使います。こうした意味のあるタグを使うと、検索エンジンや読み上げソフトがページを正しく理解できます。\n色・大きさ・配置は CSS で指定します。HTML の style 属性に直接書くのではなく、別ファイル (style.css) にまとめると、全ページの見た目を 1 か所で管理できます。",
        },
        {
          heading: "作ったページをブラウザで開く",
          body: "Mac: ターミナルで index.html のあるフォルダに移動し、open index.html を実行します (Finder でダブルクリックしてもかまいません)。\nWindows (WSL2): ファイルは Ubuntu の中にあるため、ターミナルで index.html のあるフォルダに移動して explorer.exe . を実行します (. は今いるフォルダ)。エクスプローラーでそのフォルダが開くので、index.html をダブルクリックすると Windows のブラウザで開きます。\nこの開き方では、アドレスバーが file:// で始まります。HTML と CSS だけのページはこれで確かめられます。",
        },
        {
          heading: "フォームとラベル",
          body: "<label for=\"q\"> と <input id=\"q\"> のように for と id を同じにすると、ラベルと入力欄が結び付きます。読み上げソフトが「タイトル・著者、検索欄」と読めるほか、ラベルをクリックしても入力欄を選べます。プレースホルダー (薄い例示の文字) はラベルの代わりになりません。",
        },
        {
          heading: "ボックスモデル",
          body: "すべての要素は「内容 + padding (内側の余白) + border (枠線) + margin (外側の余白)」の箱です。box-sizing: border-box を指定すると、width に padding と border が含まれ、幅の計算が分かりやすくなります。",
        },
        {
          heading: "Flexbox",
          body: "親要素に display: flex を指定すると、子要素が横に並びます。flex-direction: column で縦並び、gap で間隔、flex-wrap: wrap で折り返し、flex: 1 で残りの幅を等分します。以前の教材で使われていた float と clearfix による横並びは古い方法で、現在は Flexbox (または Grid) を使います。",
        },
        {
          heading: "スマホ対応 (レスポンシブ)",
          body: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> がないと、スマホは PC 用の幅で縮小表示してしまいます。\n@media (min-width: 768px) { ... } の中に書いた CSS は、画面幅が 768px 以上のときだけ使われます。サンプルのように「まずスマホ向けに書き、広い画面向けの指定を追加する」(モバイルファースト) と、小さな画面での崩れを防げます。",
        },
      ],
      examples: [
        {
          title: "画面幅による変化 (実際にブラウザで表示した結果)",
          body: "375px (スマホ): カードは縦並びで、1 枚の幅は画面幅 375px から左右の余白 16px × 2 を引いた 343px\n1024px (PC): カードは横並びで、3 枚が同じ幅 (約 323px)\nどちらの幅でも横スクロールは出ません。",
        },
      ],
      code: [
        { language: "html", filename: "index.html", verifiedBy: `${FE1}/index.html` },
        { language: "css", filename: "style.css", verifiedBy: `${FE1}/style.css` },
        {
          language: "javascript",
          filename: "check.js (検証用: ブラウザで表示して確かめるスクリプト)",
          verifiedBy: `${FE1}/check.js`,
          output:
            "375px: カード 縦並び / 1 枚の幅 343px / 横スクロール なし\n1024px: カード 横並び / 1 枚の幅 323px / 横スクロール なし\nlang: ja\n見出しの順序: h1 > h2 > h3 > h3 > h3\nすべての入力欄にラベル: あり\nランドマーク: header, nav, main, footer",
          runner: `${FE1}/run.sh`,
        },
      ],
      exercises: [
        {
          title: "開発者ツールでスマホ表示を確かめる",
          task: "index.html をブラウザで開き (Mac は open index.html、WSL2 は explorer.exe . で開いたフォルダから index.html をダブルクリック)、開発者ツール (Windows は F12、Mac は Command + Option + I) のデバイス表示で幅 375px と 1024px を切り替えて、カードの並びが変わることを確かめてください。次に <meta name=\"viewport\"> を消して、スマホ幅の表示がどう変わるか確かめます。",
          hint: "デバイス表示は、開発者ツールの左上にあるスマホとタブレットの形のアイコン (Chrome では Windows が Ctrl + Shift + M、Mac が Command + Shift + M) で切り替えます。",
          answer: "375px ではカードが縦に並び、1024px では 3 枚が横に並びます。<meta name=\"viewport\"> を消すと、スマホ幅でもページが PC 用の幅 (多くのブラウザで 980px) で描かれて縮小表示され、文字が小さくなります。確かめたら meta を元に戻します。",
        },
        {
          title: "2 列のレイアウト",
          task: "画面幅 768px 以上のとき、検索フォームを左 (幅 240px)、カードの一覧を右 (残りの幅) に並べてください。768px 未満では縦に並ぶようにします。",
          hint: "section の中を 2 つの div で囲み、外側に display: flex、左に flex: 0 0 240px、右に flex: 1 を指定します。",
          answer: "例 (外側の div に class=\"layout\"、左に class=\"layout-side\"、右に class=\"layout-main\" を付けた場合):\n.layout {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n@media (min-width: 768px) {\n  .layout {\n    flex-direction: row;\n  }\n  .layout-side {\n    flex: 0 0 240px;\n  }\n  .layout-main {\n    flex: 1;\n  }\n}\nまずスマホ向けに縦並びを書き、768px 以上だけ横並びに変えます (モバイルファースト)。確認: 768px で左 240px・右に一覧、767px で縦並びになり、どちらも横スクロールが出ないこと。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "入力欄に名前を付ける方法として最も適切なものはどれですか。",
            choices: ["placeholder に書く", "入力欄の前に太字の文字を置く", "label の for と input の id を一致させる"],
            answerIndex: 2,
            explanation: "label と input を結び付けると、読み上げソフトが名前を読め、ラベルのクリックでも選択できます。",
          },
          {
            id: "q2",
            question: "要素を横に並べる、現在の標準的な方法はどれですか。",
            choices: ["float と clearfix", "display: flex (Flexbox)", "table タグ"],
            answerIndex: 1,
            explanation: "Flexbox や Grid を使います。float による横並びは古い方法です。",
          },
          {
            id: "q3",
            question: "@media (min-width: 768px) の中の CSS が使われるのはどれですか。",
            choices: ["画面幅が 768px 以上のとき", "画面幅が 768px 未満のとき", "画面幅がちょうど 768px のときだけ"],
            answerIndex: 0,
            explanation: "min-width: 768px は「画面幅が 768px 以上なら」という条件です。モバイルファーストでは、まずスマホ向けの CSS を書き、広い画面だけで変えたい指定をこの中に追加します。768px 未満では中身が使われないので、スマホの表示はそのまま保たれます。",
          },
        ],
      },
      workplaceUse: "業務システムの画面も、スマホやタブレットから使われることが増えています。意味のある HTML とラベル付きのフォームは、アクセシビリティ (障害の有無や環境にかかわらず使えること) の基本で、官公庁や大企業の案件では要件として求められます。",
      commonErrors: [
        {
          error: "スマホで表示すると文字が小さく、全体が縮小されている",
          cause: "<meta name=\"viewport\"> を書いていない",
          fix: "<head> に <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> を追加します。",
        },
        {
          error: "スマホで横スクロールが出る",
          cause: "固定の幅 (width: 1000px など) や、padding を含めた幅の計算違い",
          fix: "幅は % や flex で指定し、box-sizing: border-box を使います。開発者ツールで画面からはみ出している要素を探します。",
        },
        {
          error: "CSS が反映されない",
          cause: "<link> の href のパスの誤り、セレクタ (.card など) の綴りの誤り、ブラウザのキャッシュ",
          fix: "開発者ツールの「ネットワーク」で style.css が 200 で読めているか、「要素」で CSS が当たっているかを確認します。",
        },
      ],
      reviewPoints: ["HTML は意味、CSS は見た目", "入力欄には label", "横並びは Flexbox", "viewport とモバイルファースト", "375px で横スクロールが出ないか確かめる"],
    },
  },
  {
    slug: "l4-javascript",
    title: "JavaScript の基礎 (画面の操作と API の呼び出し)",
    estimatedMinutes: 120,
    content: {
      objectives: [
        "querySelector・addEventListener で、画面の要素を取得してイベントに反応できる",
        "fetch で REST API を呼び出し、結果を画面に表示できる",
        "textContent と innerHTML の違いを説明し、textContent で安全に表示できる",
      ],
      prerequisites: ["HTML と CSS の基礎 (構造・レイアウト・スマホ対応)", "HTTP の仕組み (リクエストとレスポンス)"],
      explanation: [
        {
          heading: "JavaScript の役割",
          body: "JavaScript はブラウザの中で動くプログラミング言語で、ボタンを押したときの処理や、サーバーからデータを取得して画面を書き換える処理を担当します。Java とは名前が似ていますが、別の言語です。\n変数は const (再代入しない) と let (再代入する) で宣言します。古い書き方の var は使いません。",
        },
        {
          heading: "要素の取得とイベント",
          body: "document.querySelector(\"#q\") で id が q の要素を取得します。element.addEventListener(\"submit\", 関数) で「送信されたら関数を実行する」という登録をします。フォームの送信は、そのままだとページが再読み込みされるので、event.preventDefault() で止めます。",
        },
        {
          heading: "fetch と async / await",
          body: "fetch(URL) はサーバーにリクエストを送り、結果を後で受け取るための Promise (「あとで結果が入る箱」) をすぐに返します。await を付けると「結果が届くまで待ってから次へ進む」書き方になり、await は async を付けた関数の中で使えます。fetch は 404 や 500 が返っても例外にならないため、res.ok (ステータスコードが 200 番台か) を必ず確認します。res.json() は本文の JSON を JavaScript のオブジェクトに変換する処理で、これにも await が必要です。\nURL に入力値を入れるときは encodeURIComponent でエンコードします。サンプルでは「Java & SQL」がそのまま正しく届いています。",
        },
        {
          heading: "ローカルサーバーで開く",
          body: "fetch を使うページは、file:// で開くと、ブラウザの制限で JSON ファイルや API を読み込めません。自分のパソコンで簡単な Web サーバー (ローカルサーバー) を起動し、http://localhost:5500/ で開きます。\n方法 1: index.html のあるフォルダで python3 -m http.server 5500 を実行し、ブラウザで http://localhost:5500/ を開く (止めるときは Ctrl + C。Windows でも Ubuntu のターミナルで実行し、Windows のブラウザで開けます)\n方法 2: VS Code の拡張機能「Live Server」を入れ、index.html を右クリックして Open with Live Server を選ぶ (既定のポートが 5500 です)\nサンプルの app.js は /api/books を呼ぶため、API がない状態で検索すると「検索に失敗しました (HTTP 404)」と表示されます。表示が変わることを確かめたら、固定の JSON ファイル (例: books.json を置き、fetch(\"books.json\") にする) や L5 の API につないで試します。",
        },
        {
          heading: "XSS と textContent",
          body: "XSS (クロスサイトスクリプティング) は、データに紛れ込ませた HTML や JavaScript が、画面に表示されたときに実行されてしまう攻撃です。\nelement.innerHTML = データ は、データを HTML として解釈します。element.textContent = データ は、ただの文字として表示します。サンプルの検証では、<img src=x onerror=...> というタイトルの本を、textContent では文字として表示して何も起きず、innerHTML ではスクリプトが実行されました。利用者やサーバーから来るデータは textContent で表示します。",
        },
        {
          heading: "画面側の入力チェックとサーバー側の入力チェック",
          body: "画面側のチェックは、入力ミスにすぐ気付いてもらうための「親切」です。画面を通さずに API を直接呼ぶこともできるため、安全のためのチェックは必ずサーバー側 (L5 の Bean Validation) でも行います。",
        },
      ],
      examples: [
        {
          title: "ブラウザで操作した結果",
          body: "検証用のスクリプトが実際にブラウザでフォームに入力し、送信し、表示を読み取っています。API は検証用に偽の応答に差し替えています (本物のサーバーを起動しなくても画面の動きを確かめられる、テストでよく使う方法です)。",
        },
      ],
      code: [
        { language: "html", filename: "index.html", verifiedBy: `${FE2}/index.html` },
        { language: "javascript", filename: "app.js", verifiedBy: `${FE2}/app.js` },
        {
          language: "javascript",
          filename: "check.js (検証用: ブラウザで画面を操作するスクリプト)",
          verifiedBy: `${FE2}/check.js`,
          output: [
            "1. 空のまま検索",
            "  エラー表示: タイトルを入力してください",
            "2. 日本語と記号を含む語で検索",
            "  (サーバーが受け取った検索語: Java & SQL)",
            "  2 件見つかりました",
            "  - Java 入門 (山田)",
            '  - <img src=x onerror="window.hacked=true"> (攻撃者)',
            "  タイトルの HTML は実行されたか: false",
            "3. サーバーがエラーを返した場合",
            "  (サーバーが受け取った検索語: エラー)",
            "  検索に失敗しました (HTTP 500)",
            "4. 比較: innerHTML で同じタイトルを表示した場合 (やってはいけない例)",
            "  タイトルの HTML は実行されたか: true",
          ].join("\n"),
          runner: `${FE2}/run.sh`,
        },
      ],
      exercises: [
        {
          title: "件数が 0 件のときの表示",
          task: "検索結果が 0 件のとき「見つかりませんでした。別の言葉で検索してください」と表示されるように render を変えてください。",
          hint: "render の最初で books.length が 0 かどうかを if で調べ、0 件なら status.textContent にメッセージを入れて return します。",
          answer: "例:\nfunction render(books) {\n  results.replaceChildren();\n  if (books.length === 0) {\n    status.textContent = \"見つかりませんでした。別の言葉で検索してください\";\n    return;\n  }\n  for (const book of books) {\n    const li = document.createElement(\"li\");\n    li.textContent = `${book.title} (${book.author})`;\n    results.append(li);\n  }\n  status.textContent = `${books.length} 件見つかりました`;\n}\n確認: 0 件の応答で「0 件見つかりました」ではなく、このメッセージが表示されること。",
        },
        {
          title: "L5 の API とつなぐ",
          task: "(L5 を修了してから取り組む発展課題) L5 で作った本の API (Spring Boot) を起動し、app.js の URL を /api/books?author=... に合わせて、著者で検索できるようにしてください。別のポートの API を呼ぶとき、ブラウザの開発者ツールに何のエラーが出るか確かめます。",
          hint: "別のオリジン (ポート) への fetch は CORS の制限を受けます。Spring 側で許可する設定が必要です。",
          answer: "fetch の URL を http://localhost:8080/api/books?author=${encodeURIComponent(...)} のように API のオリジンを含む形にすると、最初はコンソールに「... has been blocked by CORS policy」というエラーが出ます。Spring 側で画面のオリジン (例: http://localhost:5500) だけを許可する設定 (@CrossOrigin や CORS の設定。Spring Security を使っている場合は http.cors(Customizer.withDefaults()) も) を追加すると、著者で検索できるようになります。すべてのオリジンを許可する設定にはしません。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "サーバーから受け取った本のタイトルを画面に表示する方法として安全なものはどれですか。",
            choices: ["li.textContent = title", "li.innerHTML = title", "document.write(title)"],
            answerIndex: 0,
            explanation: "textContent は文字として表示するため、HTML やスクリプトが実行されません。",
          },
          {
            id: "q2",
            question: "addEventListener で登録した submit の処理の中で、ページの再読み込みを止めるにはどうしますか。",
            choices: ["関数の最後で return false する", "event.preventDefault() を呼ぶ", "submit ではなく click のイベントで処理を登録する"],
            answerIndex: 1,
            explanation: "submit イベントの既定の動作 (ページ遷移) を preventDefault で止めます。addEventListener の関数で return false しても止まりません (HTML の onsubmit 属性に書いた場合とは動きが違います)。",
          },
          {
            id: "q3",
            question: "画面側で入力チェックをしていれば、サーバー側のチェックは不要ですか。",
            choices: ["不要 (画面を通らない入力はないため)", "HTTPS なら不要", "必要 (API は画面を通さず直接呼べるため)"],
            answerIndex: 2,
            explanation: "画面側のチェックは、入力ミスにすぐ気付いてもらうためのものです。API は画面を通さずに直接呼べるので、安全のためのチェックはサーバー側で必ず行います。",
          },
        ],
      },
      workplaceUse: "現在の Web アプリは、画面 (JavaScript・React など) が REST API を呼び出して表示を作る構成が主流です。バックエンドを担当する場合でも、画面がどう API を呼ぶかを理解していると、API の設計やエラー応答を利用者に合わせて作れます。XSS 対策は、フロントエンド・バックエンドの両方で必須の知識です。",
      commonErrors: [
        {
          error: "Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')",
          cause: "要素が読み込まれる前に JavaScript が実行された、または id の綴りが違う",
          fix: "<script> に defer を付けるか </body> の直前に置きます。querySelector の id と HTML の id を見比べます。",
        },
        {
          error: "Access to fetch at 'http://localhost:8080/...' from origin 'http://localhost:5500' has been blocked by CORS policy",
          cause: "画面と API のオリジン (ホスト・ポート) が違い、API 側が許可していない",
          fix: "API 側で許可するオリジンを設定します (Spring なら @CrossOrigin や CORS の設定)。Spring Security を使っている場合は、SecurityConfig に http.cors(Customizer.withDefaults()) も必要です (ないと、Authorization ヘッダーを付けて呼ぶときなどにブラウザが事前に送る確認のリクエスト (OPTIONS) が、401 で拒否されます)。すべてのオリジンを許可する設定は避けます。",
        },
        {
          error: "Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules",
          cause: "async を付けていない関数の中で await を使った",
          fix: "関数に async を付けます (async (event) => { ... })。",
        },
      ],
      reviewPoints: ["const / let を使い、var は使わない", "フォーム送信は preventDefault", "fetch は await と res.ok の確認", "URL に入れる値は encodeURIComponent", "表示は textContent (innerHTML は XSS の危険)"],
    },
  },
];

export const L6_LESSONS: LessonDef[] = [
  {
    slug: "l6-branch-conflict",
    title: "ブランチ運用とコンフリクトの解消",
    estimatedMinutes: 90,
    content: {
      objectives: [
        "GitHub Flow (main + 機能ブランチ + PR) の流れを説明できる",
        "コンフリクト (衝突) が起きる理由を説明し、印 (<<<<<<< など) を読んで解消できる",
        "解消の内容を独断で決めず、仕様や相手に確認してから決められる",
      ],
      prerequisites: ["Git の基本 (commit とブランチ)", "API のテストを書く (JUnit 5・MockMvc)"],
      explanation: [
        {
          heading: "GitHub Flow",
          body: "1. main は常に動く状態に保つ\n2. 作業ごとに main から機能ブランチを作る (feature/limit-5 など)\n3. 小さくコミットし、GitHub に push して PR (プルリクエスト) を作る\n4. レビューと CI (自動テスト) が通ったら main にマージする\nブランチは 1 つの目的 (1 機能・1 修正) に絞り、長く放置しないことが、コンフリクトを減らす一番の方法です。",
        },
        {
          heading: "コンフリクトが起きる理由",
          body: "2 人が同じファイルの同じ行を別々に変更し、それを合わせようとすると、Git はどちらを残すべきか判断できません。これがコンフリクトです。Git は「CONFLICT (content): Merge conflict in README.md」と表示し、ファイルに印を書き込みます。\n<<<<<<< HEAD から ======= までが今いるブランチ (自分) の内容、======= から >>>>>>> main までが取り込もうとしたブランチ (main) の内容です。\n注意: これは git merge の場合です。git rebase の途中では逆になり、HEAD 側が取り込み先 (main)、もう一方が自分のコミットになります。",
        },
        {
          heading: "解消の手順",
          body: "1. git status で衝突しているファイルを確認する\n2. ファイルを開き、印を消して正しい内容にする (どちらか片方・両方の組み合わせ・新しい内容)\n3. 正しい内容が分からないときは、仕様書を確認し、相手の担当者に相談する\n4. ビルドとテストを実行して壊れていないことを確かめる\n5. git add して git commit する\nサンプルでは、上限を「5 冊」と「4 冊」に変えた 2 人の変更が衝突し、仕様を確認して「5 冊」に決めています。",
        },
        {
          heading: "履歴を壊す操作に注意",
          body: "git push --force は、リモートの履歴を自分の手元の内容で上書きします。他の人が使っているブランチ (特に main) で使うと、他の人のコミットを消してしまいます。チームの共有ブランチでは使いません。\n自分だけが使っている作業ブランチを rebase した後など、どうしても上書きが必要なときは git push --force-with-lease を使います。リモートに自分の知らないコミットが増えていたら上書きを中止してくれるため、他の人のコミットを消す事故を防げます。",
        },
      ],
      examples: [
        {
          title: "共同編集の書類",
          body: "同じ書類の同じ段落を 2 人が別々に書き換えたら、どちらの文を採用するかは話し合って決めるしかありません。Git もそこは人に判断を任せ、両方の文を並べて見せてくれます。",
        },
      ],
      code: [
        {
          language: "bash",
          filename: "demo.sh",
          output: [
            "Auto-merging README.md",
            "CONFLICT (content): Merge conflict in README.md",
            "Automatic merge failed; fix conflicts and then commit the result.",
            "--- 衝突したファイルの中身",
            "# 図書管理システム",
            "<<<<<<< HEAD",
            "貸出上限: 5 冊",
            "=======",
            "貸出上限: 4 冊",
            ">>>>>>> main",
            "--- 解消後の履歴",
            "*   merge: resolve limit conflict (5 冊に決定)",
            "|\\",
            "| * docs: change limit to 4",
            "* | docs: change limit to 5",
            "|/",
            "* docs: add README",
          ].join("\n"),
          verifiedBy: "content/code/l6-branch-conflict/demo.sh",
        },
      ],
      exercises: [
        {
          title: "コンフリクトを自分で起こして解消する",
          task: "demo.sh と同じ手順を自分のリポジトリで行い、衝突したファイルを VS Code で開いてください。VS Code に表示される「現在の変更を取り込む / 入力側の変更を取り込む」ボタン (英語表示では Accept Current Change / Accept Incoming Change) の意味を、印の位置と対応させて説明します。",
          hint: "印の 3 つの区切り (<<<<<<< HEAD・=======・>>>>>>> main) と、それぞれのボタンを押したときに残る内容を見比べます。",
          answer: "「現在の変更を取り込む」は <<<<<<< HEAD から ======= まで (今いるブランチ = 自分の変更) を残し、「入力側の変更を取り込む」は ======= から >>>>>>> main まで (取り込もうとしたブランチの変更) を残します。「両方の変更を取り込む」は両方を並べて残します (いずれも git merge の場合。rebase では向きが逆になります)。どれを選んでも、印が消えたことを確かめてから git add と git commit を行い、テストを実行します。",
        },
        {
          title: "衝突を減らす工夫",
          task: "チームでコンフリクトを減らすための工夫を 3 つ挙げてください。",
          hint: "コンフリクトは、同じファイルの同じ行を別々のブランチで長い間変更していると起きやすくなります。",
          answer: "例: ブランチを小さく短く保つ / こまめに main を取り込む / 同じファイルを同時に大きく変更する作業は事前に相談して分担する / フォーマッタを統一して不要な差分を出さない",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "<<<<<<< HEAD と ======= の間に書かれているのはどれですか。",
            choices: ["今いるブランチ (自分) の内容", "取り込もうとしたブランチの内容", "両方を合わせた内容"],
            answerIndex: 0,
            explanation: "HEAD は今いるブランチを指します。======= の後が取り込もうとした側です。",
          },
          {
            id: "q2",
            question: "衝突の正しい内容が分からないときの対応として適切なものはどれですか。",
            choices: ["自分の変更を残す", "両方の内容を印ごと残してコミットする", "仕様を確認し、相手の担当者に相談して決める"],
            answerIndex: 2,
            explanation: "どちらが正しいかは仕様と相手の意図で決まります。独断で決めると他の人の作業を壊します。",
          },
          {
            id: "q3",
            question: "チームで共有している main ブランチで避けるべき操作はどれですか。",
            choices: ["git pull", "git push --force", "git revert (取り消しのコミットを追加する)"],
            answerIndex: 1,
            explanation: "--force はリモートの履歴を自分の手元の内容で上書きするため、他の人がすでに push したコミットを消すおそれがあります。git pull は取り込み、git revert は取り消しのコミットを追加するだけで、履歴を消しません。",
          },
        ],
      },
      workplaceUse: "チーム開発では、コンフリクトの解消は日常的な作業です。解消後に必ずビルドとテストを実行することと、判断に迷ったら担当者に相談することが、事故を防ぎます。",
      commonErrors: [
        {
          error: "error: Your local changes to the following files would be overwritten by merge",
          cause: "コミットしていない変更があるまま merge・pull した",
          fix: "先にコミットするか、git stash で一時的に退避してから実行します。",
        },
        {
          error: "解消後に印 (<<<<<<< など) がファイルに残ったままコミットした",
          cause: "印を消し忘れた",
          fix: "git diff で確認し、印を消してコミットし直します。ビルドやテストで気付けることが多いので、解消後は必ず実行します。",
        },
        {
          error: "! [rejected] main -> main (fetch first)",
          cause: "リモートに自分の手元にないコミットがある",
          fix: "git pull で取り込んでから push します。--force で上書きしてはいけません。",
        },
      ],
      reviewPoints: ["main は常に動く状態に", "ブランチは小さく短く", "HEAD 側が自分、もう一方が取り込む側", "迷ったら仕様を確認し相談", "共有ブランチで --force は使わない"],
    },
  },
  {
    slug: "l6-pull-request-review",
    title: "プルリクエストとコードレビュー",
    estimatedMinutes: 90,
    content: {
      objectives: [
        "PR を出す前に、自分の差分とコミットを確認できる",
        "目的・変更内容・確認方法が分かる PR の説明を書ける",
        "レビューの指摘に対応し、自分もレビューで具体的なコメントを書ける",
      ],
      prerequisites: ["ブランチ運用とコンフリクトの解消"],
      explanation: [
        {
          heading: "PR を出す前のセルフチェック",
          body: "git diff --stat main...ブランチ名 で変更したファイルの一覧、git diff main...ブランチ名 で中身、git log main..ブランチ名 で PR に含まれるコミットを確認します。関係ない変更 (デバッグ用の出力、別の作業の変更、.env など秘密情報のファイル) が混ざっていないかを、レビュアーに見せる前に自分で見つけます。テストが通ることも必ず確かめます。",
        },
        {
          heading: "PR の説明に書くこと",
          body: "目的: 何のための変更か (関連するチケット番号)\n変更内容: 何をどう変えたか (箇条書き)\n確認方法: どう動作確認したか、レビュアーがどう確かめられるか\n気になっている点: 自信がない部分や、相談したい設計\nAI を使った場合はその範囲\n1 つの PR は小さく (目安: 数百行まで) すると、レビューが速く、見落としも減ります。",
        },
        {
          heading: "レビューの受け方",
          body: "指摘は人ではなくコードへのものです。指摘ごとに「直しました (コミット)」「この理由でこうしています」「意図が分からないので確認させてください」のどれかで返信します。修正は同じブランチに追加のコミットとして push すると、PR に自動で反映されます。サンプルでは、レビューの指摘 (14 を定数にする) に対応するコミットを追加しています。",
        },
        {
          heading: "レビューの仕方",
          body: "見る順番の例: 1. 要件どおりか 2. 不具合・境界値 3. セキュリティ (入力チェック・権限・秘密情報) 4. テスト 5. 読みやすさ・命名\nコメントは具体的に書き、理由と提案を添えます。「ここ変です」ではなく「14 が何の数字か読み手に伝わらないので、LOAN_DAYS などの定数にしませんか」のように書きます。必須の修正と、好みの範囲の提案 (「nit:」など) を区別します。",
        },
      ],
      examples: [
        {
          title: "PR の説明の例",
          body: "## 目的\n延滞の判定を追加します (#12)\n## 変更内容\n- Lending.isOverdue を追加 (貸出から 14 日を超えたら延滞)\n- 境界値 (14 日・15 日) のテストを追加\n## 確認方法\nmvn test (12 件成功)\n## 相談したいこと\n返却期限の当日は延滞に含めない解釈にしています。仕様の確認をお願いします。",
        },
      ],
      code: [
        {
          language: "bash",
          filename: "demo.sh",
          output: [
            "--- 1. main との差分のファイル一覧 (PR に含まれる変更)",
            " Lending.java     | 4 ++++",
            " LendingTest.java | 1 +",
            " 2 files changed, 5 insertions(+)",
            "--- 2. 差分の中身 (レビューで見られる内容)",
            "diff --git a/Lending.java b/Lending.java",
            "index 0afbd0f..940bc47 100644",
            "--- a/Lending.java",
            "+++ b/Lending.java",
            "@@ -1,3 +1,7 @@",
            " public class Lending {",
            "     static final int LIMIT = 3;",
            "+",
            "+    static boolean isOverdue(long days) {",
            "+        return days > 14;",
            "+    }",
            " }",
            "--- 3. PR に含まれるコミット",
            "feat: add overdue check",
            "--- 4. 指摘への対応を追加した後のコミット",
            "fix: use LOAN_DAYS constant (review)",
            "feat: add overdue check",
          ].join("\n"),
          verifiedBy: "content/code/l6-pull-request/demo.sh",
        },
      ],
      exercises: [
        {
          title: "レビューコメントを書き直す",
          task: "次のレビューコメントを、理由と提案が伝わるように書き直してください。「この if 文、分かりにくいです」「テストが足りない」",
          hint: "「何が問題か (理由)」と「どうすればよいか (提案)」を、それぞれ 1 文ずつ入れます。",
          answer: "例: 「条件が 3 つ並んでいて意図が読み取りにくいので、canLend() のような名前のメソッドに切り出しませんか」「上限ちょうど (3 冊目) と上限超え (4 冊目) のテストがあると、境界の不具合に気付けると思います」",
        },
        {
          title: "自分の PR を見直す",
          task: "これまでの課題で作ったリポジトリに PR を 1 つ作り、上の「PR の説明に書くこと」に沿って説明を書いてください。",
          hint: "PR を作る前に git diff --stat main...ブランチ名 で、関係ない変更が混ざっていないかを確かめます。",
          answer: "良い PR の説明は、目的 (関連する Issue があれば番号)・変更内容 (箇条書き)・確認方法 (実行したコマンドと結果)・気になっている点がそろい、読んだ人がコードを見る前に何をどう確かめればよいか分かるものです。確認: 差分に .env・target/・デバッグ用の出力が入っていないこと、テストが通ること、AI を使った場合はその範囲を書いたこと。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "PR を出す前に git diff main...ブランチ名 で確認する主な目的はどれですか。",
            choices: ["コミットの数を減らすため", "関係ない変更や秘密情報が混ざっていないかを自分で確かめるため", "main を更新するため"],
            answerIndex: 1,
            explanation: "レビュアーに見せる前に、自分の差分を自分で見直します。",
          },
          {
            id: "q2",
            question: "レビューで指摘を受けたときの対応として適切なものはどれですか。",
            choices: ["同じブランチに修正のコミットを追加し、指摘に返信する", "修正を --force で push し直し、返信はしない", "PR を閉じて作り直す"],
            answerIndex: 0,
            explanation: "追加のコミットは PR に自動で反映されます。指摘ごとに対応内容を返信します。",
          },
          {
            id: "q3",
            question: "良いレビューコメントはどれですか。",
            choices: ["「ここ変です」", "「私ならこう書きます」とだけ書いて、自分のコードを貼る", "「14 が何の数字か伝わりにくいので、定数にしませんか」"],
            answerIndex: 2,
            explanation: "理由と具体的な提案があると、相手がすぐに対応できます。",
          },
        ],
      },
      workplaceUse: "多くの開発現場では、コードは PR とレビューを経てからでないと main に入りません。レビューで伝わる説明を書けること、指摘に素直に対応できることは、技術力と同じくらい評価されます。",
      commonErrors: [
        {
          error: "PR に .env やビルド成果物 (target/) が含まれている",
          cause: ".gitignore に書かずに git add . した",
          fix: ".gitignore に追加し、git rm --cached .env (フォルダは git rm -r --cached target/) でリポジトリから外します (手元のファイルは残ります)。秘密情報が push 済みなら、すぐに講師に報告してキーを無効化します (履歴から消すだけでは不十分です)。",
        },
        {
          error: "PR が大きすぎてレビューが進まない",
          cause: "複数の機能や、関係のない整形 (フォーマット) を 1 つの PR に入れた",
          fix: "機能ごとに PR を分けます。整形だけの変更は別の PR にします。",
        },
      ],
      reviewPoints: ["PR 前に diff と log を自分で見る", "説明は目的・変更内容・確認方法", "PR は小さく", "指摘には修正コミットと返信で応える", "コメントは理由と提案を添えて"],
    },
  },
  {
    slug: "l6-reporting-tickets",
    title: "報告・相談とチケットの書き方",
    estimatedMinutes: 60,
    content: {
      objectives: [
        "作業の状況を「結論 → 理由 → 次の行動」の順で報告できる",
        "不具合のチケットを、再現手順・期待結果・実際の結果が分かる形で書ける",
        "作業を分割して見積もり、遅れそうなときに早めに相談できる",
      ],
      prerequisites: ["学習の進め方と質問の仕方", "プルリクエストとコードレビュー"],
      explanation: [
        {
          heading: "報告は結論から",
          body: "「〜を調べていて、〜も試して、それで…」と経緯から話すと、相手は何をすればよいか分かりません。\n結論: 「貸出機能は完了、返却機能は 1 日遅れる見込みです」\n理由: 「延滞日数の計算で仕様の確認が必要になったためです」\n次の行動: 「本日中に仕様を確認し、明日の午前に完成させます」\nの順で伝えます。毎日の終わりには、進んだこと・困っていること・明日の予定を短く報告します。",
        },
        {
          heading: "チケット (Issue) の書き方",
          body: "不具合のチケットには次を書きます。\nタイトル: 何が起きるか (例: 3 冊借りている利用者が 4 冊目を借りられてしまう)\n再現手順: 1, 2, 3 と番号付きで、だれがやっても同じことが起きる手順\n期待結果と実際の結果\n環境: ブラウザ、ブランチ、データの条件\n証拠: エラーメッセージ (全文)、スクリーンショット。パスワードや個人情報は消す\n機能追加のチケットには、目的と「完了の条件」(何ができたら完了か) を書きます。",
        },
        {
          heading: "見積もりと早めの相談",
          body: "作業は半日〜1 日で終わる大きさに分けて見積もります。「全体で 3 日」より「画面 0.5 日・API 1 日・テスト 1 日・予備 0.5 日」の方が、進み具合を正しく判断できます。\n見積もりの半分の時間が過ぎても先が見えないときは、その時点で相談します。期限の直前に「終わりません」と伝えるより、早い相談の方がチームは助かります。",
        },
      ],
      examples: [
        {
          title: "悪い報告と良い報告",
          body: "悪い例: 「ログイン、ちょっと詰まってます」\n良い例: 「ログイン機能はまだ完了していません。正しいパスワードでも 401 が返ります。DB のパスワードは {bcrypt} 付きで保存されていることを確認済みです。認証の設定を 30 分調べても原因が分からないので、15 時に 10 分ほど画面を見ていただけますか」",
        },
      ],
      code: [],
      exercises: [
        {
          title: "不具合のチケットを書く",
          task: "「一般利用者のアカウントで本の削除ボタンを押すと、本が削除されてしまう」という不具合を見つけた想定で、タイトル・再現手順・期待結果・実際の結果・環境を書いたチケットを作ってください。",
          hint: "再現手順には番号を付け、だれが操作しても同じ結果になるように、ログインする利用者や操作する本まで具体的に書きます。",
          answer: "タイトル: 一般利用者が本を削除できてしまう\n再現手順: 1. hanako (一般利用者) でログイン 2. 本の一覧で「Java 入門」の削除を押す\n期待結果: 403 になり、削除されない\n実際の結果: 204 が返り、本が削除される\n環境: feature/delete ブランチ、Chrome",
        },
        {
          title: "作業を分割して見積もる",
          task: "卒業制作の「返却機能」を、半日〜1 日の作業に分割し、それぞれの完了の条件を書いてください。",
          hint: "API・テスト・README のように作業の種類で分けると、半日〜1 日の大きさにしやすくなります。",
          answer: "例:\n1. 返却 API (返却日の記録と延滞日数の計算): 0.5 日。完了の条件: 期限内の返却で延滞 0 日、期限の翌日の返却で延滞 1 日が返る\n2. 返却のテスト (境界値と権限): 0.5 日。完了の条件: 期限の当日・翌日の返却と、ログインしていない場合 (401) のテストが通る\n3. README の更新: 0.5 日。完了の条件: 返却 API の説明と確認手順が README にある\n4. 予備: 0.5 日\n確認: どの作業も 1 日以内で、完了したかどうかをだれでも判定できる条件になっていること。",
        },
      ],
      quiz: {
        passScore: 100,
        questions: [
          {
            id: "q1",
            question: "進み具合の報告として最も適切なものはどれですか。",
            choices: ["調べたことを順番にすべて話す", "結論 → 理由 → 次の行動の順に話す", "完成するまで報告しない"],
            answerIndex: 1,
            explanation: "結論から伝えると、相手は必要な判断をすぐにできます。",
          },
          {
            id: "q2",
            question: "見積もりの半分の時間が過ぎても先が見えないときの対応はどれですか。",
            choices: ["期限まで一人で頑張る", "見積もりを黙って延ばす", "その時点で状況を共有して相談する"],
            answerIndex: 2,
            explanation: "早く相談すれば、手伝ってもらう・仕様を見直すなどの手が打てます。",
          },
          {
            id: "q3",
            question: "不具合のチケットに必ず書くべき内容の組み合わせはどれですか。",
            choices: ["再現手順・期待結果・実際の結果", "見つけた人の感想と、推測した原因", "修正にかかる時間の見積もり"],
            answerIndex: 0,
            explanation: "再現手順があれば、だれでも同じ現象を起こして確かめられます。期待結果と実際の結果の差が、直すべき点そのものです。原因の推測や見積もりは書いてもよいですが、それだけでは不具合を再現できません。",
          },
        ],
      },
      workplaceUse: "配属後に最初に評価されるのは、技術力だけでなく「報告が分かりやすい」「困ったときに早く相談できる」ことです。チケットの書き方が良いと、自分が担当していない不具合でも、だれでも素早く再現して直せます。",
      commonErrors: [
        {
          error: "「動きません」とだけ書いたチケット",
          cause: "再現手順・期待結果・実際の結果が書かれていない",
          fix: "だれがやっても同じことが起きる手順と、エラーメッセージの全文を書きます。",
        },
        {
          error: "期限の当日に「終わりません」と報告した",
          cause: "作業を分割しておらず、遅れに気付くのが遅かった",
          fix: "作業を半日〜1 日単位に分け、半分の時間が過ぎた時点で状況を共有します。",
        },
      ],
      reviewPoints: ["報告は結論 → 理由 → 次の行動", "チケットは再現手順・期待結果・実際の結果", "作業は半日〜1 日に分けて見積もる", "半分過ぎて見えなければ相談"],
    },
  },
];

export const FE_L6_ASSIGNMENTS: AssignmentDef[] = [
  {
    slug: "a7-book-search-page",
    level: "L4",
    afterLesson: "l4-javascript",
    title: "本の検索画面 (HTML・CSS・JavaScript)",
    type: "GITHUB_REPO",
    passScore: 70,
    body: {
      purpose: "意味のある HTML・スマホ対応の CSS・API を呼ぶ JavaScript を組み合わせ、使いやすく安全な画面を作る。",
      scenario: "L5 で作る本の API の画面を、フロントエンド担当として先に作る想定です。API ができるまでは、固定の JSON ファイルを使って画面を作ります。",
      requirements: [
        "検索フォーム (ラベル付き) と、結果の一覧を表示する画面",
        "空のまま検索したら、エラーを表示して API を呼ばない",
        "結果は textContent で表示する (innerHTML に利用者やサーバーのデータを入れない)",
        "0 件・通信エラーのときに、利用者に分かるメッセージを表示する",
        "375px と 1024px で崩れず、横スクロールが出ない",
      ],
      recommended: ["検索中は検索ボタンを押せないようにする", "L5 の API につないで動かす (CORS の設定を含む)"],
      steps: ["画面の構成 (HTML) を書く", "CSS でスマホ → PC の順にレイアウトする", "固定の JSON ファイル (例: books.json) を置き、python3 -m http.server 5500 か VS Code の Live Server でローカルサーバーを起動して http://localhost:5500/ で開く (file:// で開くと fetch で JSON を読めません。WSL2 でも Windows のブラウザで開けます)", "JavaScript で入力チェックと表示を作る", "開発者ツールで 375px・1024px を確認する", "GitHub に push し、README にスクリーンショットを載せる"],
      deliverables: ["GitHub リポジトリの URL", "375px と 1024px のスクリーンショット (README に掲載)"],
      readmeChecklist: ["画面の説明", "375px・1024px のスクリーンショット", "工夫した点 (アクセシビリティ・エラー表示)"],
      resubmitCondition: "innerHTML にデータを入れている、入力欄にラベルがない、375px で横スクロールが出る場合は修正依頼になります。",
      interviewPoints: ["textContent を使う理由", "画面側とサーバー側の入力チェックの役割の違い", "スマホ対応で工夫したこと"],
    },
  },
  {
    slug: "a8-team-pr",
    level: "L6",
    afterLesson: "l6-reporting-tickets",
    title: "チーム開発演習 (Issue・PR・レビュー)",
    type: "GITHUB_REPO",
    passScore: 70,
    rubric: TEAM_PROCESS_RUBRIC,
    body: {
      purpose: "チケット → ブランチ → PR → レビュー対応 → マージの流れと、報告・相談を、実際のリポジトリで一通り経験する。",
      scenario: "講師が編成した受講生 2〜3 名のチームで 1 つのリポジトリを共有し、講師が用意した掲示板 API のリポジトリ (L5 の課題と同じ仕様) に機能を追加する想定です。受講生の人数が足りない場合は、講師がチームの一員として PR を作り、それをレビュー対象にします。",
      requirements: [
        "Issue を 2 件以上作る (不具合 1 件・機能追加 1 件。再現手順または完了の条件を書く)",
        "Issue ごとにブランチを作り、PR の説明に目的・変更内容・確認方法を書く",
        "レビューの指摘に、修正コミットと返信で対応する (少なくとも 1 往復)",
        "他の人の PR を 1 件以上レビューし、理由と提案のあるコメントを 2 件以上書く",
        "コンフリクトが起きた場合は、相手と相談して解消し、テストが通ることを確かめる",
        "毎日の終わりに、結論 → 理由 → 次の行動の形で進み具合を報告する",
      ],
      recommended: ["GitHub Actions で PR ごとにテストを自動実行する", "PR のテンプレート (.github/pull_request_template.md) を作る"],
      steps: ["チームのリポジトリに招待してもらう", "Issue を作り、担当を決める", "ブランチ → 実装 → テスト → PR", "レビューと対応", "マージ後、Issue を閉じる"],
      deliverables: ["チームのリポジトリの URL", "自分が作った PR とレビューした PR の URL (備考欄)", "自分が作成した Issue の URL (備考欄)", "日報 (チームで決めた提出先) の URL または写し (備考欄)"],
      readmeChecklist: [],
      resubmitCondition: "Issue・PR の説明が不足している、レビューの指摘に対応していない、他の人の PR をレビューしていない場合は修正依頼になります。",
      interviewPoints: ["一番難しかったレビューの指摘と、どう対応したか", "コンフリクトをどう解消したか", "他の人の PR で指摘したことと、その理由"],
    },
  },
];
