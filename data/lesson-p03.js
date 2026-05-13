/* =========================================================
   data/lesson-p03.js  ─  Phase 3「JavaScript基礎」詳細コンテンツ
   Chapter 3-1（変数・型・演算子）完全版
   ========================================================= */
window.LESSON_P03 = {

'l03-1-1': {
  id:'l03-1-1', chapter:'c03-1', num:'3-1-1',
  title:'JavaScriptとは何か・なぜ学ぶのか',
  duration:'15分',
  goal:'JavaScriptがWebでどんな役割を担うかを説明でき、HTMLファイルにJSを読み込んでConsoleに文字を出力できる。',
  why:'HTMLは骨組み、CSSは見た目。しかし「ボタンを押したら何かが起きる」「データを取得して表示する」にはJavaScriptが必要。Webの動的な動作はすべてJSで作る。',
  fieldUse:'フロントエンド開発はほぼ全員JavaScript。React・Vue・AngularもJSがベース。バックエンドでも Node.js としてサーバーで動く。最初から投資する価値が最も高い言語の一つ。',
  analogy:'HTMLが家の柱・壁、CSSが壁紙・色・装飾、JavaScriptがドア・エレベーター・照明スイッチ。「動く部分」を作るのがJavaScript。',
  terms:[
    {term:'JavaScript（JS）', meaning:'Webブラウザで動く唯一のプログラミング言語。略してJS。最近はサーバー（Node.js）でも動く。'},
    {term:'Console（コンソール）', meaning:'ブラウザのDevToolsにある出力画面。console.log()でメッセージを表示できる。デバッグに必須。'},
    {term:'console.log()', meaning:'() の中の値をConsoleに出力する命令（関数）。プログラミングの「print文」にあたる。'},
    {term:'script タグ', meaning:'HTMLにJavaScriptを埋め込むためのタグ。srcで外部JSファイルを読み込む。'},
    {term:'DOM', meaning:'Document Object Model。HTMLをJavaScriptから操作するためのインターフェース。「JSがHTMLを読んで・変えられる」のはDOMのおかげ。'}
  ],
  steps:[
    {
      num:1, title:'作業フォルダとファイルを作る',
      description:'Phase 3用のフォルダにJSの練習ファイルを作成する。',
      windows:'cd ~/Desktop/dev\nmkdir js-basic\ncd js-basic\ntouch index.html\ntouch main.js\ncode .',
      mac:'cd ~/Desktop/dev\nmkdir js-basic\ncd js-basic\ntouch index.html\ntouch main.js\ncode .'
    },
    {
      num:2, title:'HTMLにJSを読み込む',
      description:'index.htmlを作成し、main.jsを読み込む。',
      windows:'VSCodeでindex.htmlを開き、以下のコードを入力する。',
      mac:'同上。'
    },
    {
      num:3, title:'console.logを実行する',
      description:'main.jsにconsole.logを書いてブラウザで確認する。',
      windows:'VSCodeでmain.jsを開いて以下を入力し保存。その後Live Serverで開く。F12でDevToolsを開いてConsoleタブを確認。',
      mac:'同上。'
    }
  ],
  code:'<!-- index.html -->\n<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>JavaScript入門</title>\n</head>\n<body>\n  <h1>JavaScript練習中</h1>\n\n  <!-- scriptタグは</body>の直前に書く（理由は後述） -->\n  <script src="main.js"><\/script>\n</body>\n</html>',
  code2:'// main.js\n// JavaScriptのコメントは // で始める\n\n// Consoleに文字を出力する（一番基本のデバッグ方法）\nconsole.log("Hello, JavaScript!");\n\n// 計算もできる\nconsole.log(1 + 1);        // → 2\nconsole.log(10 * 5);       // → 50\nconsole.log(100 / 4);      // → 25\nconsole.log(17 % 5);       // → 2 （余り）\n\n// 文字列と数値を混ぜると…\nconsole.log("答えは" + 42); // → 答えは42\n\n// 複数の値を一度に表示\nconsole.log("名前:", "山田太郎", "年齢:", 25);',
  codeExplanation:[
    {line:'<script src="main.js"><\/script>', meaning:'main.jsを読み込む。</body>の直前に書くのは、HTMLが読み込まれてから実行するため。'},
    {line:'console.log("Hello!")', meaning:'DevToolsのConsoleタブにHello!と表示する。引数は文字列・数値・変数など何でもOK。'},
    {line:'17 % 5', meaning:'%は剰余（余り）演算子。17÷5=3余り2なので結果は2。ループや番号の奇数偶数判定に使う。'},
    {line:'"答えは" + 42', meaning:'+演算子は文字列と数値を結合する。この場合42は文字列に変換されて「答えは42」になる。'}
  ],
  expectedOutput:'Console タブに以下が順番に表示される：\nHello, JavaScript!\n2\n50\n25\n2\n答えは42\n名前: 山田太郎 年齢: 25',
  errors:[
    {msg:'Uncaught SyntaxError: Unexpected token', cause:'コードに文法エラーがある。クオート（"）の閉じ忘れ、括弧のミスなど', fix:'エラーのある行番号がConsoleに表示される。該当行を確認してクオートや括弧を確認する。'},
    {msg:'Consoleに何も表示されない', cause:'scriptタグのsrc属性のパスが間違っている。またはmain.jsが保存されていない', fix:'index.htmlとmain.jsが同じフォルダにあるか確認。<script src="main.js">のパスを確認。Ctrl+Sで保存してからリロード。'},
    {msg:'404 (Not Found) main.js', cause:'main.jsが見つからない', fix:'ターミナルでlsを実行してmain.jsが存在するか確認。フォルダの場所が違う可能性がある。'}
  ],
  quiz:[
    {q:'console.log()は何のためのコードですか？', a:'ブラウザのConsoleに値を出力するための関数。主にデバッグ（問題の確認・調査）に使う。'},
    {q:'scriptタグを</body>の直前に書く理由は？', a:'HTMLが読み込まれてからJSを実行するため。headに書くとHTMLが読まれる前に実行されDOMが取得できないことがある。'},
    {q:'% 演算子は何ですか？', a:'剰余（余り）演算子。割り算の余りを返す。'}
  ],
  miniTask:'main.jsに以下を追加して、Consoleで結果を確認する：\n1. 自分の誕生年を変数に入れて（変数はまだ知らなくてOK）、console.logで出力\n2. 今年から誕生年を引いて年齢を計算してconsole.logで出力\n3. 自分の名前をconsole.logで出力する',
  aiOk:['このJavaScriptのエラーメッセージの意味を教えてください：[メッセージをコピー]', 'console.log以外のconsoleメソッドを教えてください'],
  aiNg:['main.jsのコードを全部書いてください（最初の一歩は自分で書く）'],
  interviewQ:['JavaScriptとは何ですか？', 'scriptタグはどこに書くのが良いですか？'],
  nextLesson:'l03-1-2'
},

'l03-1-2': {
  id:'l03-1-2', chapter:'c03-1', num:'3-1-2',
  title:'変数を理解する（let・const・var）',
  duration:'30分',
  goal:'let と const の違いを説明でき、適切に使い分けて変数を宣言・代入・参照できる。varを使わない理由も説明できる。',
  why:'プログラムは「データを一時的に覚えておいて使い回す」処理の連続。変数がなければ、計算した値をもう一度使うたびに書き直す必要がある。変数は「データの入れ物」。',
  fieldUse:'実務では原則として const を使い、再代入が必要な場合のみ let を使う。var は使わない（理由を説明できることが重要）。コードレビューで「なぜvarを使っているのですか」と聞かれる。',
  analogy:'constは「名前の刻まれた固定の引き出し」。一度決めたら中身は変えられない（入れ直せない）。letは「付箋のついた引き出し」。中身は後から入れ替えられる。varは「どこからでも触れる不安定な引き出し」—現代では使わない。',
  terms:[
    {term:'変数（variable）', meaning:'データを一時的に保存して名前で参照できる入れ物。const・let で宣言する。'},
    {term:'const', meaning:'定数（constant）の略。一度代入したら再代入できない変数。原則これを使う。'},
    {term:'let', meaning:'再代入できる変数。forループのカウンターや、後から値が変わるものに使う。'},
    {term:'var', meaning:'古い変数宣言。スコープの問題があるため現代では使わない。'},
    {term:'宣言（declaration）', meaning:'「この名前の変数を使います」と宣言する。const name = "値";'},
    {term:'代入（assignment）', meaning:'変数に値を入れること。= 演算子を使う（数学の=とは意味が違う）。'},
    {term:'データ型（type）', meaning:'データの種類。文字列（string）・数値（number）・真偽値（boolean）・null・undefinedなど。'}
  ],
  steps:[
    {
      num:1, title:'constで変数を宣言する',
      description:'main.jsを開いて変数の練習を始める。',
      windows:'VSCodeでmain.jsを開き、既存のコードを消して以下を入力する。',
      mac:'同上。'
    }
  ],
  code:'// ─────────────────────────────────────\n// 1. const（定数）の宣言と使い方\n// ─────────────────────────────────────\n\n// 宣言 + 代入（初期化）\nconst name = "山田太郎";\nconst age = 25;\nconst isStudent = true;\n\n// 参照（使う）\nconsole.log(name);     // → 山田太郎\nconsole.log(age);      // → 25\nconsole.log(isStudent);// → true\n\n// 式の中で使う\nconsole.log("私は" + age + "歳です。");  // → 私は25歳です。\n\n// テンプレートリテラル（バッククォートで書く）\nconsole.log(`私は${age}歳の${name}です`); // → 私は25歳の山田太郎です\n\n// constは再代入できない（エラーになる）\n// name = "鈴木";  // ← TypeError: Assignment to constant variable.\n\n// ─────────────────────────────────────\n// 2. let（再代入できる変数）の使い方\n// ─────────────────────────────────────\n\nlet score = 0;\nconsole.log("最初のスコア:", score); // → 0\n\nscore = 100;  // 再代入OK\nconsole.log("更新後のスコア:", score); // → 100\n\nscore = score + 50;  // 現在の値に50を加える\nconsole.log("さらに加算:", score); // → 150\n\n// 省略記法\nscore += 30;   // score = score + 30 と同じ\nscore -= 20;   // score = score - 20 と同じ\nscore *= 2;    // score = score * 2 と同じ\nconsole.log("最終スコア:", score); // → 320\n\n// ─────────────────────────────────────\n// 3. データ型の確認\n// ─────────────────────────────────────\n\nconst str = "文字列";          // string（文字列）\nconst num = 42;                // number（数値）\nconst float = 3.14;           // number（小数もnumber）\nconst bool = true;             // boolean（真偽値）\nconst nothing = null;          // null（意図的に「何もない」）\nlet unset;                     // undefined（宣言したが代入していない）\n\nconsole.log(typeof str);    // → string\nconsole.log(typeof num);    // → number\nconsole.log(typeof bool);   // → boolean\nconsole.log(typeof nothing); // → object（JSの歴史的バグ。nullはobjectではない）\nconsole.log(typeof unset);  // → undefined',
  codeExplanation:[
    {line:'const name = "山田太郎"', meaning:'constで変数nameを宣言し、文字列"山田太郎"を代入（初期化）。文字列はシングルまたはダブルクォートで囲む。'},
    {line:'`私は${age}歳`', meaning:'テンプレートリテラル。バッククォート（\`）で囲み\${変数名}で変数を埋め込める。+で結合するより読みやすい。'},
    {line:'score += 30', meaning:'スコア = スコア + 30 と同じ省略記法。-= *= /= も同様にある。'},
    {line:'typeof str', meaning:'変数のデータ型を文字列で返す演算子。デバッグ時に「この変数が何型か」を確認するのに使う。'},
    {line:'null → object', meaning:'typeof nullが"object"を返すのはJavaScriptの歴史的なバグ。面談でも聞かれることがある有名な話。'}
  ],
  expectedOutput:'山田太郎\n25\ntrue\n私は25歳です。\n私は25歳の山田太郎です\n最初のスコア: 0\n更新後のスコア: 100\nさらに加算: 150\n最終スコア: 320\nstring\nnumber\nboolean\nobject\nundefined',
  errors:[
    {msg:'TypeError: Assignment to constant variable.', cause:'constで宣言した変数に再代入しようとした', fix:'再代入が必要な場合はconstをletに変える。再代入が不要ならその行を削除。'},
    {msg:'ReferenceError: 変数名 is not defined', cause:'宣言していない変数を使おうとした（スペルミスが多い）', fix:'変数名のスペルを確認。constまたはletで宣言しているか確認。'},
    {msg:'Uncaught SyntaxError: Unexpected token \'{\'', meaning:'テンプレートリテラルのバッククォートを使わずに${}を書いた', fix:'テンプレートリテラルは"や\'ではなく\`（バッククォート）で囲む。'}
  ],
  quiz:[
    {q:'constとletの使い分け基準は？', a:'原則constを使う。後から値が変わる必要がある場合のみletを使う。'},
    {q:'テンプレートリテラルの書き方は？', a:'バッククォート（\`）で文字列を囲み、変数は\${変数名}で埋め込む。'},
    {q:'typeof nullが返す値は？なぜですか？', a:'"object"を返す。これはJavaScriptの歴史的なバグで、本来はnullを返すべきだった。'}
  ],
  miniTask:'自分の「自己紹介変数」を作ってください：\n1. const name = "自分の名前";\n2. const birthYear = 生まれ年;\n3. let currentYear = 2024;\n4. let age = currentYear - birthYear;\n5. console.log(`私は${name}、${age}歳です`);\n\nさらに：\n6. ageに1を足して「来年の年齢」も表示する',
  aiOk:['varを使わない理由を詳しく教えてください（スコープの問題）', 'JavaScriptのデータ型の一覧を教えてください'],
  aiNg:['変数の練習コードを全部書いてください'],
  interviewQ:['constとletの違いを教えてください', 'varを使わない理由は？', 'typeof nullが"object"を返す理由は？'],
  nextLesson:'l03-1-3'
},

'l03-1-3': {
  id:'l03-1-3', chapter:'c03-1', num:'3-1-3',
  title:'条件分岐（if・else・switch）',
  duration:'30分',
  goal:'if・else if・else と三項演算子を使って条件によって異なる処理を書ける。switchとの使い分けを説明できる。',
  why:'「点数が70点以上なら合格、未満なら不合格」のような「もし〇〇ならば〇〇する」処理はすべてのプログラムに必要。',
  fieldUse:'APIのレスポンスに応じた処理分岐、ログインチェック、バリデーション（入力値確認）などで毎日使う。三項演算子はReactのJSXで頻出。',
  analogy:'if文は「道路の分岐点」。条件が true（真）なら右の道へ、false（偽）なら左の道へ。',
  terms:[
    {term:'if文', meaning:'「もし〜なら」の条件分岐。条件がtrueの時だけ{}の中を実行する。'},
    {term:'else', meaning:'if条件がfalseの時の処理。「それ以外」。'},
    {term:'else if', meaning:'複数の条件を順番に確認する。最初にtrueになった条件の処理だけ実行。'},
    {term:'比較演算子', meaning:'2つの値を比較して true/false を返す。=== は型も含めて等しいか、!== は等しくないか。'},
    {term:'論理演算子', meaning:'&&（AND・かつ）、||（OR・または）、!（NOT・でない）で複数条件を組み合わせる。'},
    {term:'三項演算子', meaning:'条件 ? 真の場合 : 偽の場合。if-elseを1行で書く省略記法。Reactでよく使う。'},
    {term:'switch文', meaning:'1つの値が複数のパターンのどれに当てはまるかで分岐する。'}
  ],
  steps:[],
  code:'// ─────────────────────────────────────\n// 1. 基本的なif文\n// ─────────────────────────────────────\n\nconst score = 85;\n\nif (score >= 70) {\n  console.log("合格！"); // scoreが70以上なので実行される\n}\n\n// ─────────────────────────────────────\n// 2. if - else（二択）\n// ─────────────────────────────────────\n\nif (score >= 70) {\n  console.log("合格！");\n} else {\n  console.log("不合格…再提出してください");\n}\n\n// ─────────────────────────────────────\n// 3. if - else if - else（多択）\n// ─────────────────────────────────────\n\nif (score >= 90) {\n  console.log("S評価：優秀！");\n} else if (score >= 80) {\n  console.log("A評価：よくできました");\n} else if (score >= 70) {\n  console.log("B評価：合格");\n} else {\n  console.log("C評価：要再提出");\n}\n\n// ─────────────────────────────────────\n// 4. 比較演算子の種類\n// ─────────────────────────────────────\n\nconsole.log(5 === 5);   // true  厳密等価（型も値も同じ）\nconsole.log(5 === "5"); // false（数値と文字列は異なる型）\nconsole.log(5 == "5");  // true  ← ==は型を変換して比較（非推奨！）\nconsole.log(5 !== 3);   // true  厳密不等価\nconsole.log(10 > 5);    // true\nconsole.log(10 >= 10);  // true\nconsole.log(5 < 3);     // false\n\n// === と == の違い：実務では必ず=== を使う\n// == は予期しない型変換が起きるため、バグの温床になる\n\n// ─────────────────────────────────────\n// 5. 論理演算子（AND・OR・NOT）\n// ─────────────────────────────────────\n\nconst age = 20;\nconst hasTicket = true;\n\n// AND（&&）: 両方 true のとき true\nif (age >= 18 && hasTicket) {\n  console.log("入場できます");\n}\n\n// OR（||）: どちらか一方が true のとき true\nconst isMember = false;\nconst hasCoupon = true;\n\nif (isMember || hasCoupon) {\n  console.log("割引が適用されます");\n}\n\n// NOT（!）: true を false に、false を true に反転\nif (!isMember) {\n  console.log("会員ではありません");\n}\n\n// ─────────────────────────────────────\n// 6. 三項演算子（Reactでよく使う）\n// ─────────────────────────────────────\n\n// 書き方：条件 ? 真の値 : 偽の値\nconst result = score >= 70 ? "合格" : "不合格";\nconsole.log(result); // → 合格\n\n// Reactのボタン無効化の例\nconst isLoading = false;\nconst btnText = isLoading ? "送信中..." : "送信する";\nconsole.log(btnText); // → 送信する',
  codeExplanation:[
    {line:'score >= 70', meaning:'scoreが70以上ならtrue、未満ならfalse。>=は「以上」の比較演算子。'},
    {line:'=== と ==', meaning:'===は型も値も厳密に比較（推奨）。==は型を自動変換して比較（非推奨・バグの原因）。5==="5"はfalseだが5=="5"はtrue。'},
    {line:'&&（AND）', meaning:'左側と右側の両方がtrueの時だけtrue。「かつ」。'},
    {line:'||（OR）', meaning:'左側か右側のどちらかがtrueならtrue。「または」。'},
    {line:'score >= 70 ? "合格" : "不合格"', meaning:'三項演算子。scoreが70以上なら"合格"、そうでなければ"不合格"を返す。'}
  ],
  expectedOutput:'合格！\nA評価：よくできました\ntrue\nfalse\ntrue\ntrue\n入場できます\n割引が適用されます\n会員ではありません\n合格\n送信する',
  errors:[
    {msg:'SyntaxError: Unexpected token else', cause:'if文の{}（波括弧）が合っていない', fix:'if文の開き{と閉じ}が対応しているか確認。VS Code でif文の行をクリックすると対応する括弧がハイライトされる。'},
    {msg:'条件が常にtrueまたは常にfalseになる', cause:'==（二重）を使っているか、条件の比較方向が逆', fix:'===（三重）を使う。> と >= 、< と <= を混同していないか確認。'}
  ],
  quiz:[
    {q:'=== と == の違いは何ですか？どちらを使うべきですか？', a:'===は型も値も厳密に比較。==は型変換して比較（バグの原因になる）。実務では===を使う。'},
    {q:'三項演算子の書き方は？', a:'条件 ? 真の時の値 : 偽の時の値'},
    {q:'&&（AND）と||（OR）の違いは？', a:'&&は両方がtrueの時true、||はどちらかがtrueならtrue。'}
  ],
  miniTask:'点数（0〜100）を const score に入れて：\n1. 90点以上→「S評価」、80点以上→「A評価」、70点以上→「B評価」、70点未満→「要再挑戦」を表示\n2. 三項演算子で「合格 or 不合格」を1行で表示\n3. スコアが60〜80の間（60以上かつ80以下）の場合に「境界ライン」と表示する（&&を使う）',
  aiOk:['JavaScriptのswitch文はどんな時に使いますか？', 'falsyな値とは何ですか？'],
  aiNg:['点数判定のコードを全部書いてください'],
  interviewQ:['===と==の違いは？', '三項演算子を使う場面は？'],
  nextLesson:'l03-2-1'
},

/* ===== Chapter 3-2: 関数（骨格あり） ===== */
'l03-2-1': {
  id:'l03-2-1', chapter:'c03-2', num:'3-2-1',
  title:'関数の基本（宣言・呼び出し・引数・戻り値）',
  duration:'35分',
  goal:'関数宣言・関数式・アロー関数の3つの書き方を書けて、引数と戻り値の仕組みを説明できる。',
  why:'同じ処理を何度も書くのを避けるのが関数の目的。コードの再利用・保守性・テストのしやすさがすべて「関数に分割する」ことで改善される。',
  fieldUse:'全てのプログラムは関数の集まり。React のコンポーネントも関数。API 呼び出しも関数内で行う。「この処理を関数化できますか」は実務でよく言われる。',
  analogy:'関数は「自動化された機械」。入力（引数）を入れると処理して出力（戻り値）を返す。電卓の+ボタンのようなもの—2つの数字（引数）を入れると合計（戻り値）が出てくる。',
  terms:[
    {term:'関数（function）', meaning:'名前を付けて処理をまとめたもの。何度でも呼び出せる。'},
    {term:'引数（argument / parameter）', meaning:'関数に渡す入力値。function add(a, b)のaとbが引数（パラメータ）。'},
    {term:'戻り値（return value）', meaning:'関数が返す出力値。returnキーワードで返す。returnなし（またはreturn;）の関数はundefinedを返す。'},
    {term:'関数宣言', meaning:'function 名前() { }の書き方。巻き上げ（hoisting）があるため宣言前でも呼べる。'},
    {term:'関数式', meaning:'const fn = function() { }の書き方。変数に関数を代入する。'},
    {term:'アロー関数', meaning:'const fn = () => { }の書き方。ES6以降の省略記法。Reactで最もよく使われる。'}
  ],
  steps:[],
  code:'// ─────────────────────────────────────\n// 1. 関数宣言（最も基本的な書き方）\n// ─────────────────────────────────────\n\nfunction greet(name) {\n  return "こんにちは、" + name + "さん！";\n}\n\n// 関数の呼び出し\nconst message = greet("山田");\nconsole.log(message); // → こんにちは、山田さん！\n\n// 引数を変えると違う結果になる\nconsole.log(greet("鈴木")); // → こんにちは、鈴木さん！\nconsole.log(greet("田中")); // → こんにちは、田中さん！\n\n// ─────────────────────────────────────\n// 2. 複数の引数と戻り値\n// ─────────────────────────────────────\n\nfunction add(a, b) {\n  return a + b;  // a + b の計算結果を返す\n}\n\nconsole.log(add(3, 5));   // → 8\nconsole.log(add(10, 20)); // → 30\n\n// 引数のデフォルト値（ES6以降）\nfunction greetWithTime(name, time = "午前") {\n  return `おはよう（${time}）${name}さん`;\n}\n\nconsole.log(greetWithTime("山田"));         // → おはよう（午前）山田さん\nconsole.log(greetWithTime("鈴木", "午後")); // → おはよう（午後）鈴木さん\n\n// ─────────────────────────────────────\n// 3. アロー関数（Reactでよく見る書き方）\n// ─────────────────────────────────────\n\n// 通常の関数式\nconst multiply = function(a, b) {\n  return a * b;\n};\n\n// アロー関数に書き換え\nconst multiplyArrow = (a, b) => {\n  return a * b;\n};\n\n// さらに省略（1行でreturnできる場合）\nconst multiplyShort = (a, b) => a * b;\n\nconsole.log(multiplyShort(4, 5)); // → 20\n\n// 引数が1つの場合は括弧も省略できる\nconst double = n => n * 2;\nconsole.log(double(7)); // → 14\n\n// ─────────────────────────────────────\n// 4. 実用例：バリデーション関数\n// ─────────────────────────────────────\n\n// メールアドレスに@が含まれるか確認する関数\nconst isValidEmail = (email) => {\n  return email.includes("@");\n};\n\nconsole.log(isValidEmail("user@example.com")); // → true\nconsole.log(isValidEmail("invalidEmail"));      // → false\n\n// パスワードの長さチェック\nconst isValidPassword = (password, minLength = 8) => {\n  return password.length >= minLength;\n};\n\nconsole.log(isValidPassword("abc123"));     // → false（6文字）\nconsole.log(isValidPassword("abcdefgh"));   // → true（8文字）',
  errors:[
    {msg:'undefined が返ってくる', cause:'returnを書き忘れた、またはreturnの位置が間違っている', fix:'関数の中にreturn文があるか確認。returnはそこで関数を終了して値を返す。returnなしはundefinedを返す。'},
    {msg:'引数が undefined になる', cause:'関数呼び出し時に引数を渡し忘れた', fix:'関数呼び出しの()内に引数を渡す。または引数にデフォルト値を設定する（= "デフォルト値"）。'}
  ],
  quiz:[
    {q:'アロー関数と通常の関数の主な違いは？', a:'書き方が短い。thisの挙動が違う（アロー関数は外側のthisを参照）。'},
    {q:'return文を書かないと何が返りますか？', a:'undefinedが返る。'},
    {q:'引数のデフォルト値はどう書きますか？', a:'function fn(name = "デフォルト") のように=で指定する。'}
  ],
  miniTask:'以下の関数を作ってください：\n1. 半径を受け取って円の面積を返す関数（Math.PI * r * r）\n2. 名前と点数を受け取って「〇〇さんは〇〇点で合格/不合格」と返す関数\n3. 配列を受け取って合計を返す関数（まだ配列を知らなくてもOK：次のLessonへのプレビュー）',
  aiOk:['アロー関数と通常の関数でthisが違う理由を教えてください', 'クロージャとは何ですか？'],
  aiNg:['バリデーション関数を全部書いてください'],
  interviewQ:['関数の引数と戻り値を説明してください', 'アロー関数はどんな時に使いますか？'],
  nextLesson:'l03-3-1'
}

}; // end LESSON_P03