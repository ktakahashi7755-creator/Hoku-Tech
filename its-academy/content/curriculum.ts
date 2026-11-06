/**
 * 初期カリキュラム定義 (seed と コード検証スクリプトが読み込む)。
 *
 * - code[].verifiedBy があるサンプルは scripts/verify-code.ts が実際に実行し、
 *   出力が output と一致することを検査する (CI でも実行)。
 * - code[].source は verifiedBy のファイルから読み込むため、ここには書かない。
 * - REOrGA 教材を元にしたレッスンは sourceUrl に元記事を記録する。
 */
import type { AssignmentBody, LessonContent, RubricCriteria } from "@/lib/content/schema";
import { L3_L4_ASSIGNMENTS, L3_LESSONS, L4_LESSONS } from "./lessons-l3-l4";
import { L4_HTTP, L4_JDBC, L5_ASSIGNMENT, L5_LESSONS } from "./lessons-l4-l5";
import { L5_SECURITY, L7_FINAL, L7_GUIDE } from "./lessons-l5-l7";
import { FE_L6_ASSIGNMENTS, L4_FRONTEND, L6_LESSONS } from "./lessons-fe-l6";
import { L1_GITHUB, L1_SETUP } from "./lessons-l1-setup";

export type CodeRef = Omit<LessonContent["code"][number], "source"> & { verifiedBy: string };

export type LessonDef = {
  slug: string;
  title: string;
  estimatedMinutes: number;
  sourceUrl?: string;
  sourcePostId?: number;
  content: Omit<LessonContent, "code"> & { code: CodeRef[] };
};

export type ModuleDef = {
  level: string;
  title: string;
  description: string;
  weeks: number;
  lessons: LessonDef[];
};

export type AssignmentDef = {
  slug: string;
  level: string;
  afterLesson: string; // このレッスンを完了すると取り組める
  title: string;
  type: "CODE" | "GITHUB_REPO" | "PROJECT" | "FINAL_PROJECT";
  passScore: number;
  body: AssignmentBody;
};

const REORGA = "https://engineer.reorga.co.jp/curriculum/";

export const STANDARD_RUBRIC: { name: string; criteria: RubricCriteria } = {
  name: "標準ルーブリック (コード課題)",
  criteria: [
    { key: "requirements", label: "要件充足", weight: 25, description: "必須要件をすべて満たしているか" },
    { key: "correctness", label: "正確性", weight: 20, description: "境界値や異常な入力でも正しく動くか" },
    { key: "readability", label: "可読性", weight: 15, description: "命名・インデント・コメントが読み手に優しいか" },
    { key: "maintainability", label: "保守性", weight: 10, description: "重複がなく、変更しやすい構造か" },
    { key: "testing", label: "テスト", weight: 10, description: "動作確認の手順と結果が示されているか" },
    { key: "security", label: "セキュリティ", weight: 10, description: "秘密情報を含めていないか。入力を検証しているか" },
    { key: "explanation", label: "説明能力", weight: 10, description: "README で目的・使い方・工夫を説明できているか" },
  ],
};

export const COURSE = {
  slug: "java-engineer",
  title: "Java エンジニア育成コース",
  description:
    "IT 未経験から、Java / SQL / Spring Boot で Web アプリを作り、チームで開発できるエンジニアを目指す 12 週間のコースです。",
  weeks: 12,
};

export const MODULES: ModuleDef[] = [
  {
    level: "L0",
    title: "IT 入門",
    description: "学び方・質問の仕方と、コンピュータの基本を知る",
    weeks: 0.5,
    lessons: [
      {
        slug: "l0-how-to-learn",
        title: "学習の進め方と質問の仕方",
        estimatedMinutes: 30,
        sourceUrl: REORGA + "%e3%82%ab%e3%83%aa%e3%82%ad%e3%83%a5%e3%83%a9%e3%83%a0%e3%81%ae%e9%80%b2%e3%82%81%e6%96%b9/",
        sourcePostId: 45,
        content: {
          objectives: [
            "このコースの進め方 (レッスン → 理解度チェック → 課題 → レビュー) を説明できる",
            "詰まったときに、相手が答えやすい質問文を書ける",
            "AI ツールを使うときのルールを守れる",
          ],
          prerequisites: ["パソコンでブラウザを開き、文字を入力できること"],
          explanation: [
            {
              heading: "学習の 1 サイクル",
              body:
                "各レッスンは「読む → サンプルを自分で動かす → 演習 → 理解度チェック」の順に進めます。理解度チェックに合格すると「学習完了」を押せるようになります。ページを開いただけでは完了になりません。\nレベルの区切りには課題があります。課題は講師がルーブリック (評価の観点表) で採点し、合格・修正依頼・不合格のいずれかで返します。修正依頼は失敗ではなく、現場のコードレビューと同じ練習です。",
            },
            {
              heading: "15 分ルール",
              body:
                "自分で調べても 15 分以上進まないときは質問しましょう。悩み続けるより、状況を整理して聞くほうが早く、整理する過程で自己解決することもよくあります。",
            },
            {
              heading: "良い質問の 5 要素",
              body:
                "1. やりたいこと (目的)\n2. 実際に起きていること (エラーメッセージは全文をコピー)\n3. 期待していた結果\n4. 自分で試したこと・調べたこと\n5. 環境 (OS、Java のバージョン、どのレッスンか)\n「動きません」だけでは、答える側は何も判断できません。",
            },
            {
              heading: "AI ツールの使い方のルール",
              body:
                "AI にエラーの意味を聞いたり、ヒントをもらったりするのは構いません。ただし、AI が出したコードは「自分で 1 行ずつ説明できる」まで理解してから使ってください。課題の提出時には、AI を使った場合はどこで使ったかを備考欄に書きます。パスワードや会社の情報を AI に貼り付けてはいけません。",
            },
          ],
          examples: [
            {
              title: "悪い質問と良い質問",
              body:
                "悪い例: 「Java が動きません」\n良い例: 「l2-variables のサンプルを動かそうとしています。java Main.java を実行すると『エラー: メイン・クラスMainを検出およびロードできませんでした』と表示されます。ファイル名は Main.java で、ターミナルは同じフォルダで開いています。Windows 11 + WSL2 (Ubuntu 24.04)、Java 21 です。」",
            },
          ],
          code: [],
          exercises: [
            {
              title: "質問文を書く練習",
              task:
                "次の状況を、良い質問の 5 要素を使って質問文にしてください。「ターミナルで javac と打ったら command not found と出た。昨日 Java をインストールしたはず。」",
              hint: "環境と、インストールの確認のために何を試したかを入れましょう。",
              answer:
                "例: 「Java のインストールを確認しています。WSL2 の Ubuntu で javac -version を実行すると『javac: command not found』と表示されます。期待していたのは javac 21 のようなバージョン表示です。昨日 sudo apt install openjdk-21-jdk を実行しましたが、その時のメッセージは確認していません。Windows 11 + WSL2 (Ubuntu 24.04) です。」",
            },
          ],
          quiz: {
            passScore: 100,
            questions: [
              {
                id: "q1",
                question: "レッスンが「学習完了」になる条件として正しいものはどれですか。",
                choices: ["ページを開いた時点", "理解度チェックに合格して、学習完了を押したとき", "講師が承認したとき"],
                answerIndex: 1,
                explanation: "ページを開いただけでは完了になりません。理解度チェックに合格してから学習完了を押します。",
              },
              {
                id: "q2",
                question: "AI が生成したコードを課題に使うときのルールはどれですか。",
                choices: [
                  "そのまま提出してよい",
                  "使ってはいけない",
                  "1 行ずつ説明できるまで理解し、使ったことを備考欄に書く",
                ],
                answerIndex: 2,
                explanation: "AI の利用は禁止ではありませんが、理解して説明できることと、利用の申告が条件です。",
              },
            ],
          },
          workplaceUse:
            "現場では、チャットやチケット (課題管理ツール) で質問・報告する場面が毎日あります。「何をしたいか・何が起きたか・何を試したか」が書ける人は、経験が浅くても信頼されます。",
          commonErrors: [
            {
              error: "エラーメッセージの一部だけを伝えてしまう",
              cause: "長いメッセージのうち、自分が重要だと思った部分だけを切り取った",
              fix: "エラーメッセージは全文をコピーして貼ります。重要な情報は最初の数行にあることが多いです。",
            },
            {
              error: "API キーやパスワードを質問に貼ってしまう",
              cause: "設定ファイルをそのままコピーした",
              fix: "秘密情報は「****」に置き換えてから貼ります。誤って貼った場合はすぐ講師に報告し、キーを無効化します。",
            },
          ],
          reviewPoints: ["学習完了には理解度チェックの合格が必要", "15 分詰まったら質問する", "質問は 5 要素で書く", "AI 生成コードは説明できるまで理解し、利用を申告する"],
        },
      },
    ],
  },
  {
    level: "L1",
    title: "開発環境・Git",
    description: "ターミナルと Git/GitHub を使って、ファイルと変更履歴を管理できるようになる",
    weeks: 1,
    lessons: [
      L1_SETUP,
      {
        slug: "l1-terminal-basics",
        title: "ターミナルの基本操作",
        estimatedMinutes: 60,
        sourceUrl: REORGA + "unix%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89/",
        sourcePostId: 87,
        content: {
          objectives: [
            "現在地 (カレントディレクトリ) を意識してコマンドを実行できる",
            "mkdir / cd / ls / touch / mv / cat でファイルとフォルダを操作できる",
            "相対パスと絶対パスの違いを説明できる",
          ],
          prerequisites: ["WSL2 (Windows) またはターミナル (Mac) を開けること"],
          explanation: [
            {
              heading: "ターミナルとは",
              body:
                "ターミナルは、文字でコンピュータに命令する画面です。開発ではサーバーの操作、ビルド、Git など多くの作業をターミナルで行います。マウス操作より手順を正確に記録・共有できるのが利点です。",
            },
            {
              heading: "カレントディレクトリとパス",
              body:
                "ターミナルは常に「今いるフォルダ (カレントディレクトリ)」を持っています。pwd で確認できます。\n絶対パスは / から始まる住所 (例: /home/hanako/practice)、相対パスは今いる場所からの道順 (例: docs/memo.txt、.. は 1 つ上のフォルダ) です。",
            },
            {
              heading: "よく使うコマンド",
              body:
                "pwd: 現在地を表示\nls: フォルダの中身を一覧\ncd フォルダ名: 移動 (cd .. で 1 つ上へ)\nmkdir フォルダ名: フォルダを作る\ntouch ファイル名: 空のファイルを作る\nmv 元 先: 移動・名前の変更\ncat ファイル名: 中身を表示\nrm ファイル名: 削除 (ゴミ箱を経由せず、元に戻せません)",
            },
          ],
          examples: [
            {
              title: "道順のたとえ",
              body: "絶対パスは「東京都千代田区…」という住所、相対パスは「この交差点から 2 つ先を右」という道順です。道順は今いる場所によって意味が変わります。",
            },
          ],
          code: [
            {
              language: "bash",
              filename: "demo.sh",
              output: "はじめてのファイル\nmemo.txt\npractice",
              verifiedBy: "content/code/l1-terminal/demo.sh",
            },
          ],
          exercises: [
            {
              title: "フォルダ構成を作る",
              task:
                "ホームディレクトリに its-practice フォルダを作り、その中に java と sql の 2 つのフォルダを作ってください。最後に its-practice で ls を実行し、2 つのフォルダが表示されることを確認します。",
              hint: "cd ~ でホームディレクトリに戻れます。",
              answer: "cd ~\nmkdir its-practice\ncd its-practice\nmkdir java sql\nls",
            },
          ],
          quiz: {
            passScore: 100,
            questions: [
              {
                id: "q1",
                question: "/home/hanako/practice にいるとき、cd .. を実行するとどこへ移動しますか。",
                choices: ["/home/hanako", "/home", "/home/hanako/practice/.."],
                answerIndex: 0,
                explanation: ".. は 1 つ上のフォルダを表します。",
              },
              {
                id: "q2",
                question: "rm で削除したファイルについて正しいものはどれですか。",
                choices: ["ゴミ箱から戻せる", "元に戻せない", "1 時間以内なら戻せる"],
                answerIndex: 1,
                explanation: "rm はゴミ箱を経由しません。特に rm -r (フォルダごと削除) は実行前に対象を ls で確認します。",
              },
            ],
          },
          workplaceUse: "本番サーバーへのログ調査、アプリの起動・停止、ビルドの実行などで毎日使います。誤った場所で rm を実行する事故を防ぐため、現場でも pwd で現在地を確認する習慣が重要です。",
          commonErrors: [
            {
              error: "No such file or directory",
              cause: "カレントディレクトリが想定と違う、またはファイル名の打ち間違い",
              fix: "pwd で現在地、ls で中身を確認します。Tab キーで名前を補完すると打ち間違いを防げます。",
            },
            {
              error: "Permission denied",
              cause: "そのファイルやフォルダを操作する権限がない",
              fix: "自分のホームディレクトリ (~) の中で作業しているか確認します。sudo は意味を理解してから使います。",
            },
          ],
          reviewPoints: ["作業前に pwd で現在地を確認する", "絶対パスは / から、相対パスは現在地から", "rm は元に戻せない"],
        },
      },
      {
        slug: "l1-git-basics",
        title: "Git の基本 (commit とブランチ)",
        estimatedMinutes: 90,
        sourceUrl: REORGA + "git%e3%81%ae%e5%b0%8e%e5%85%a5/",
        sourcePostId: 80,
        content: {
          objectives: [
            "Git が何を解決するツールかを説明できる",
            "status → add → commit の流れで変更を記録できる",
            "git switch -c でブランチを作り、main を壊さずに作業できる",
          ],
          prerequisites: ["ターミナルの基本操作", "Git がインストールされていること (git --version で確認)"],
          explanation: [
            {
              heading: "Git とは",
              body:
                "Git はフォルダ (リポジトリ) 全体の変更履歴を記録するツールです。いつ・誰が・何を・なぜ変えたかが残るので、問題が起きたときに原因の変更を探したり、前の状態に戻したりできます。GitHub は Git のリポジトリをインターネット上で共有するサービスです。",
            },
            {
              heading: "3 つの場所",
              body:
                "作業ツリー (編集中のファイル) → ステージ (次の commit に含める変更) → リポジトリ (記録済みの履歴)。\ngit add でステージに載せ、git commit で記録します。git status でいまどの状態かを確認します。",
            },
            {
              heading: "ブランチ",
              body:
                "ブランチは履歴の分岐です。main ブランチは「いつでも動く状態」に保ち、新しい作業は git switch -c feature/作業名 で作ったブランチで行います。作業が終わったら GitHub でプルリクエスト (PR) を出し、レビューを受けてから main に取り込みます。",
            },
            {
              heading: "コミットメッセージ",
              body: "「何をしたか」を 1 行で書きます。このコースでは「種類: 内容」の形式 (例: docs: add README、fix: correct tax calculation) を使います。",
            },
          ],
          examples: [
            {
              title: "セーブポイントのたとえ",
              body: "commit はゲームのセーブポイントです。こまめにセーブしておけば、失敗してもその地点からやり直せます。ブランチは「本編のセーブデータを残したまま、別のデータで試す」ことに当たります。",
            },
          ],
          code: [
            {
              language: "bash",
              filename: "demo.sh",
              output:
                "?? README.md\n<hash> docs: add README\nSwitched to a new branch 'feature/hobby'\n README.md | 1 +\n 1 file changed, 1 insertion(+)",
              verifiedBy: "content/code/l1-git/demo.sh",
            },
          ],
          exercises: [
            {
              title: "自分のリポジトリで 2 回 commit する",
              task:
                "my-profile リポジトリを作り、README.md に名前を書いて 1 回目の commit をします。次に feature/goal ブランチを作り、README.md に「このコースの目標」を 1 行追記して 2 回目の commit をしてください。最後に git log --oneline で 2 件の履歴があることを確認します。",
              hint: "2 回目の commit の前にも git add が必要です。",
              answer: "git switch -c feature/goal\necho \"目標: Spring Boot で Web アプリを作る\" >> README.md\ngit add README.md\ngit commit -m \"docs: add goal\"\ngit log --oneline",
            },
          ],
          quiz: {
            passScore: 100,
            questions: [
              {
                id: "q1",
                question: "新しいブランチを作って切り替えるコマンドはどれですか。",
                choices: ["git branch -b feature/x", "git switch -c feature/x", "git commit -b feature/x"],
                answerIndex: 1,
                explanation: "git switch -c (または git checkout -b) です。git branch に -b オプションはありません。",
              },
              {
                id: "q2",
                question: "git status の出力で「??」が付いたファイルの意味はどれですか。",
                choices: ["Git がまだ追跡していない新しいファイル", "エラーのあるファイル", "削除されたファイル"],
                answerIndex: 0,
                explanation: "?? は untracked (未追跡) です。git add すると追跡対象になります。",
              },
              {
                id: "q3",
                question: "git rebase の説明として正しいものはどれですか。",
                choices: ["直前のコミットを取り消す", "コミットを別の土台の上に付け替える", "リモートから変更を取得する"],
                answerIndex: 1,
                explanation: "rebase はコミットを付け替える操作です。取り消しは git revert (取り消しのコミットを作る) を使います。",
              },
            ],
          },
          workplaceUse:
            "チーム開発ではほぼすべての会社が Git を使います。ブランチを切って作業し、PR でレビューを受けて main に取り込む流れは L6 チーム開発で本格的に練習します。",
          commonErrors: [
            {
              error: "Author identity unknown",
              cause: "git config で名前とメールアドレスを設定していない",
              fix: "git config --global user.name \"Yamada Hanako\" と git config --global user.email \"you@example.com\" を設定します。名前に空白があるときは引用符で囲みます。",
            },
            {
              error: "nothing added to commit",
              cause: "git add をせずに git commit した",
              fix: "git status で変更を確認し、git add ファイル名 してから commit します。",
            },
            {
              error: "パスワードやキーを commit してしまった",
              cause: ".env などの設定ファイルを git add . でまとめて追加した",
              fix: "すぐ講師に報告し、キーを無効化します。秘密情報のファイルは .gitignore に書いて追跡対象から外します。",
            },
          ],
          reviewPoints: ["status → add → commit", "作業は main ではなくブランチで", "ブランチ作成は git switch -c", "秘密情報は commit しない (.gitignore)"],
        },
      },
      L1_GITHUB,
    ],
  },
  {
    level: "L2",
    title: "Java 基礎",
    description: "変数・条件分岐・繰り返し・配列・メソッドで、小さなプログラムを自分で書けるようになる",
    weeks: 2,
    lessons: [
      {
        slug: "l2-variables-types",
        title: "変数とデータ型",
        estimatedMinutes: 60,
        sourceUrl: REORGA + "%e3%83%87%e3%83%bc%e3%82%bf%e5%9e%8b%e3%83%bb%e6%96%87%e5%ad%97%e5%88%97%e3%82%af%e3%83%a9%e3%82%b9/",
        sourcePostId: 88,
        content: {
          objectives: [
            "int / double / boolean / String を使い分けて変数を宣言できる",
            "整数同士の割り算と余りの結果を予測できる",
            "java Main.java で 1 ファイルのプログラムを実行できる",
          ],
          prerequisites: ["ターミナルの基本操作", "JDK 21 のインストール (java -version で確認)"],
          explanation: [
            {
              heading: "変数は名前の付いた箱",
              body: "変数は値を入れておく箱です。Java では箱に入れられる値の種類 (データ型) を最初に決めます。\n書き方: データ型 変数名 = 値;\n例: int price = 1200;",
            },
            {
              heading: "よく使うデータ型",
              body:
                "int: 整数 (-21億〜21億)\nlong: 大きな整数\ndouble: 小数 (誤差が出ることがあるため、お金の計算には使わない)\nboolean: true / false\nchar: 1 文字 ('A')\nString: 文字列 (\"こんにちは\")。String はクラス (参照型) で、先頭が大文字です。",
            },
            {
              heading: "計算のルール",
              body:
                "整数 ÷ 整数の結果は整数になり、小数点以下は切り捨てられます (7 / 2 は 3)。% は割り算の余りです。どちらかが小数 (7.0) なら結果も小数になります。\n(int) のように型を指定して変換することをキャストと呼びます。",
            },
            {
              heading: "変数名のルール",
              body: "英字で始め、2 語目以降の先頭を大文字にする (キャメルケース: taxRate、isMember)。int や class など Java の予約語は使えません。",
            },
          ],
          examples: [
            {
              title: "データ型は箱の形",
              body: "int の箱には整数しか入りません。int price = \"1200\"; のように文字列を入れようとすると、プログラムを動かす前の段階 (コンパイル時) でエラーになります。間違いに早く気付けるのが型の利点です。",
            },
          ],
          code: [
            {
              language: "java",
              filename: "Main.java",
              output: "Java入門書 の税込価格: 1320円\n会員ですか: true\n7 / 2 = 3\n7 % 2 = 1\n7.0 / 2 = 3.5",
              verifiedBy: "content/code/l2-variables/Main.java",
            },
          ],
          exercises: [
            {
              title: "自己紹介プログラム",
              task: "名前 (String)、年齢 (int)、身長 cm (double)、Java 経験の有無 (boolean) を変数にして、「山田花子 (25歳) 身長 158.5cm Java経験: false」のように 1 行で表示してください。",
              hint: "文字列と変数は + でつなげられます。",
            },
            {
              title: "結果を予測する",
              task: "実行する前に 10 / 4、10 % 4、10.0 / 4 の結果を紙に書き、実行して確かめてください。",
              answer: "2、2、2.5",
            },
          ],
          quiz: {
            passScore: 67,
            questions: [
              {
                id: "q1",
                question: "int a = 9; int b = 2; のとき a / b の結果はどれですか。",
                choices: ["4.5", "4", "5"],
                answerIndex: 1,
                explanation: "整数同士の割り算は小数点以下が切り捨てられます。",
              },
              {
                id: "q2",
                question: "金額の計算に向いていないデータ型はどれですか。",
                choices: ["int", "long", "double"],
                answerIndex: 2,
                explanation: "double は 2 進数で小数を表すため誤差が出ます。お金は整数 (円) で計算します。",
              },
              {
                id: "q3",
                question: "変数名として Java の慣習に沿っているものはどれですか。",
                choices: ["TaxRate", "tax_rate", "taxRate"],
                answerIndex: 2,
                explanation: "変数名はキャメルケース (先頭小文字、2 語目以降の先頭大文字) で書きます。",
              },
            ],
          },
          workplaceUse: "業務システムでは、金額・数量・日付・状態 (有効/無効) など、すべてのデータを適切な型で扱います。型の選び方を誤ると、端数の誤差や桁あふれといった不具合につながります。",
          commonErrors: [
            {
              error: "error: incompatible types: String cannot be converted to int",
              cause: "int の変数に文字列 (\"...\") を代入した",
              fix: "値の型と変数の型を合わせます。文字列を数値にするときは Integer.parseInt(\"1200\") を使います。",
            },
            {
              error: "日本語が「???」と表示される (文字化け)",
              cause: "ターミナルの文字コードと Java の出力の文字コードが違う",
              fix: "java -Dstdout.encoding=UTF-8 Main.java で実行するか、ターミナルの文字コードを UTF-8 に設定します。",
            },
            {
              error: "error: ';' expected",
              cause: "文の最後のセミコロンを忘れた",
              fix: "エラーに表示された行番号の行末 (またはその 1 行前) を確認します。",
            },
          ],
          reviewPoints: ["データ型 変数名 = 値;", "整数 ÷ 整数は切り捨て", "お金は double ではなく整数で", "変数名はキャメルケース"],
        },
      },
      {
        slug: "l2-conditionals",
        title: "条件分岐 (if / switch)",
        estimatedMinutes: 60,
        sourceUrl: REORGA + "%e5%88%b6%e5%be%a1%e6%96%87%e6%9d%a1%e4%bb%b6%e5%88%86%e5%b2%90-if-else-else-if-switch/",
        sourcePostId: 107,
        content: {
          objectives: [
            "if / else if / else で条件に応じた処理を書ける",
            "&& と || で複数の条件を組み合わせられる",
            "文字列の比較に equals を使う理由を説明できる",
          ],
          prerequisites: ["変数とデータ型"],
          explanation: [
            {
              heading: "if 文",
              body: "if (条件) { 条件が true のときの処理 } else if (別の条件) { ... } else { どれにも当てはまらないとき }\n条件は上から順に調べられ、最初に true になったブロックだけが実行されます。",
            },
            {
              heading: "比較演算子と論理演算子",
              body: "== 等しい、!= 等しくない、> >= < <= 大小\n&& かつ (両方 true)、|| または (どちらか true)、! 否定\n例: score < 0 || score > 100 は「0 未満、または 100 より大きい」。",
            },
            {
              heading: "switch",
              body: "1 つの値で分岐が多いときは switch が読みやすくなります。Java 14 以降は case \"SAT\", \"SUN\" -> \"休日\"; のようなアロー記法 (switch 式) が使え、break の書き忘れによる不具合を防げます。",
            },
            {
              heading: "文字列は equals で比較する",
              body: "== は「同じ箱 (同じオブジェクト) か」を比べ、equals は「中身の文字が同じか」を比べます。文字列の中身を比べるときは必ず equals を使います。",
            },
          ],
          examples: [
            {
              title: "入力チェックを先に書く",
              body: "範囲外の値 (例: 120 点) を最初の if で弾くと、後の条件は「0〜100 のどこか」だけを考えればよくなります。この書き方をガード節と呼びます。",
            },
          ],
          code: [
            {
              language: "java",
              filename: "Main.java",
              output:
                "95点 -> A\n80点 -> A\n65点 -> B\n40点 -> 再挑戦\n120点 -> 入力エラー: 0〜100 で入力してください\nSAT は 休日\n== で比較: false\nequals で比較: true",
              verifiedBy: "content/code/l2-conditionals/Main.java",
            },
          ],
          exercises: [
            {
              title: "送料計算",
              task: "購入金額 (int) から送料を決めるメソッドを書いてください。0 未満は「入力エラー」、5000 円以上は送料 0 円、それ未満は 500 円。0、4999、5000、-1 で動作を確認します。",
              hint: "境界値 (4999 と 5000) を必ず試します。",
            },
          ],
          quiz: {
            passScore: 67,
            questions: [
              {
                id: "q1",
                question: "score が 80 のとき、if (score >= 60) {A} else if (score >= 80) {B} はどちらを実行しますか。",
                choices: ["A", "B", "両方"],
                answerIndex: 0,
                explanation: "上から順に調べ、最初に true になった A だけが実行されます。条件の順番が重要です。",
              },
              {
                id: "q2",
                question: "文字列 input の中身が \"yes\" か調べる正しい書き方はどれですか。",
                choices: ["input == \"yes\"", "input.equals(\"yes\")", "input = \"yes\""],
                answerIndex: 1,
                explanation: "文字列の中身の比較は equals です。= は代入です。",
              },
              {
                id: "q3",
                question: "「age が 20 以上かつ 65 未満」を表す条件はどれですか。",
                choices: ["age >= 20 || age < 65", "age >= 20 && age < 65", "20 <= age < 65"],
                answerIndex: 1,
                explanation: "「かつ」は &&。Java では 20 <= age < 65 のような書き方はできません。",
              },
            ],
          },
          workplaceUse: "権限チェック (管理者なら表示)、入力チェック (必須項目が空ならエラー)、料金計算 (会員なら割引) など、業務ロジックの大半は条件分岐です。境界値でのテストは現場でも必ず行います。",
          commonErrors: [
            {
              error: "文字列が一致しているのに if が false になる",
              cause: "== で文字列を比較している",
              fix: "equals を使います。null の可能性があるときは \"yes\".equals(input) と定数側から呼びます。",
            },
            {
              error: "error: incompatible types: int cannot be converted to boolean",
              cause: "if (score = 80) のように == ではなく = (代入) を書いた",
              fix: "比較は == です。",
            },
          ],
          reviewPoints: ["条件は上から順に評価される", "範囲外の値は最初に弾く (ガード節)", "文字列は equals", "境界値でテストする"],
        },
      },
      {
        slug: "l2-loops-arrays",
        title: "繰り返しと配列",
        estimatedMinutes: 90,
        sourceUrl: REORGA + "%e9%85%8d%e5%88%97/",
        sourcePostId: 105,
        content: {
          objectives: [
            "配列を作り、添え字 (0 始まり) で要素を読み書きできる",
            "for / 拡張 for / while を使い分けられる",
            "合計・平均・最大値を求めるプログラムを書ける",
          ],
          prerequisites: ["変数とデータ型", "条件分岐"],
          explanation: [
            {
              heading: "配列",
              body: "同じ型の値を並べて入れる入れ物です。int[] scores = {72, 88, 95}; のように作ります。要素は scores[0] のように添え字で取り出し、添え字は 0 から始まります。要素数は scores.length で分かります。配列の長さは作った後に変えられません (長さを変えたいときは L3 で学ぶ ArrayList を使います)。",
            },
            {
              heading: "for 文",
              body: "for (初期化; 続ける条件; 更新) { 処理 }\n例: for (int i = 0; i < scores.length; i++) は「i を 0 から始め、要素数未満の間、1 ずつ増やす」。",
            },
            {
              heading: "拡張 for 文",
              body: "for (int score : scores) は「配列の要素を 1 つずつ score に入れて繰り返す」。添え字が不要なときはこちらが簡潔で、範囲外アクセスの心配もありません。",
            },
            {
              heading: "while 文",
              body: "while (条件) { 処理 } は条件が true の間繰り返します。回数が決まっていない繰り返しに使います。条件が変化しないと無限ループになるので注意します。",
            },
          ],
          examples: [
            {
              title: "配列はロッカー",
              body: "番号付きのロッカーが並んでいる状態です。番号は 0 番から始まるので、5 個のロッカーの最後は 4 番です。",
            },
          ],
          code: [
            {
              language: "java",
              filename: "Main.java",
              output: "人数: 5\n合計: 395\n平均: 79.0\n最高点: 95\nwhile の 1 回目\nwhile の 2 回目\nwhile の 3 回目",
              verifiedBy: "content/code/l2-loops-arrays/Main.java",
            },
          ],
          exercises: [
            {
              title: "最低点と合格者数",
              task: "サンプルの scores から最低点と、70 点以上の人数を求めて表示してください。",
              answer: "最低点: 61、70 点以上: 4 人",
            },
            {
              title: "九九の 1 行",
              task: "for 文を使い、3 の段 (3 6 9 ... 27) を 1 行に表示してください。",
              hint: "改行しない出力は System.out.print です。",
            },
          ],
          quiz: {
            passScore: 67,
            questions: [
              {
                id: "q1",
                question: "int[] a = {10, 20, 30}; のとき a[3] を参照するとどうなりますか。",
                choices: ["30 が返る", "0 が返る", "ArrayIndexOutOfBoundsException が発生する"],
                answerIndex: 2,
                explanation: "添え字は 0〜2 です。範囲外を参照すると実行時に例外が発生します。",
              },
              {
                id: "q2",
                question: "サンプルで平均を (double) sum / scores.length と書いている理由はどれですか。",
                choices: ["整数の割り算で小数点以下が切り捨てられるのを防ぐため", "速く計算するため", "エラーを防ぐため"],
                answerIndex: 0,
                explanation: "int 同士の割り算は切り捨てになるため、片方を double に変換しています。",
              },
              {
                id: "q3",
                question: "for (int i = 0; i <= scores.length; i++) の問題点はどれですか。",
                choices: ["問題ない", "最後に範囲外の添え字を参照する", "最初の要素を飛ばす"],
                answerIndex: 1,
                explanation: "<= だと i が length と同じ値になり、範囲外を参照します。< を使います。",
              },
            ],
          },
          workplaceUse: "一覧データの集計 (売上合計、平均点、在庫の最小値) は業務で頻繁に出てきます。実務では配列より List を使うことが多いですが、考え方は同じです。",
          commonErrors: [
            {
              error: "ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5",
              cause: "添え字が要素数以上になった (多くは <= の書き間違い)",
              fix: "ループ条件を i < 配列.length にします。スタックトレースの at Main.main(Main.java:行番号) で行を特定します。",
            },
            {
              error: "プログラムが終わらない (無限ループ)",
              cause: "while の条件に使う変数を更新していない",
              fix: "Ctrl + C で止め、ループ内で条件の変数 (count++ など) が変化しているか確認します。",
            },
          ],
          reviewPoints: ["添え字は 0 から length - 1", "添え字が不要なら拡張 for", "平均は double に変換してから割る", "ループ条件は < を使う"],
        },
      },
      {
        slug: "l2-methods",
        title: "メソッド (処理に名前を付ける)",
        estimatedMinutes: 75,
        sourceUrl: REORGA + "%e3%83%a1%e3%82%bd%e3%83%83%e3%83%89%e9%96%a2%e6%95%b0/",
        sourcePostId: 120,
        content: {
          objectives: [
            "引数と戻り値のあるメソッドを定義して呼び出せる",
            "void の意味を説明できる",
            "オーバーロードを使い分けられる",
          ],
          prerequisites: ["変数とデータ型", "条件分岐", "繰り返しと配列"],
          explanation: [
            {
              heading: "メソッドとは",
              body: "まとまった処理に名前を付けたものです。同じ処理を何度も書かずに済み、名前から処理内容が分かるのでコードが読みやすくなります。\n書き方: static 戻り値の型 メソッド名(型 引数名, ...) { 処理; return 値; }",
            },
            {
              heading: "引数と戻り値",
              body: "引数はメソッドに渡す材料、戻り値はメソッドが返す結果です。戻り値がないメソッドは戻り値の型に void と書きます。",
            },
            {
              heading: "オーバーロード",
              body: "引数の型や数が違えば、同じ名前のメソッドを複数定義できます。呼び出すときの引数で、どのメソッドが使われるかが決まります。",
            },
            {
              heading: "static について",
              body: "このレッスンのメソッドには static が付いています。static は「オブジェクトを作らずに呼べる」という意味です。オブジェクトについては L3 で学びます。",
            },
          ],
          examples: [
            {
              title: "メソッドは自動販売機",
              body: "お金と商品番号 (引数) を入れると、飲み物 (戻り値) が出てきます。中の仕組みを知らなくても使えるのが、メソッドに分ける利点です。",
            },
          ],
          code: [
            {
              language: "java",
              filename: "Main.java",
              output: "ノート: 330円 (税込)\nペン: 165円 (税込)\n5\n3.75",
              verifiedBy: "content/code/l2-methods/Main.java",
            },
          ],
          exercises: [
            {
              title: "BMI を計算するメソッド",
              task: "身長 (m, double) と体重 (kg, double) を受け取り、BMI (体重 ÷ 身長の 2 乗) を返すメソッド bmi を作り、1.6m・50kg で呼び出して表示してください。",
              answer: "19.531249999999996 (double の誤差を含む値。表示を整える方法は L3 で扱う)",
            },
          ],
          quiz: {
            passScore: 67,
            questions: [
              {
                id: "q1",
                question: "戻り値を返さないメソッドの戻り値の型はどれですか。",
                choices: ["null", "void", "empty"],
                answerIndex: 1,
                explanation: "void は「何も返さない」という意味です。",
              },
              {
                id: "q2",
                question: "add(1.5, 2.25) を呼んだとき、サンプルで実行されるのはどちらですか。",
                choices: ["int add(int, int)", "double add(double, double)", "コンパイルエラー"],
                answerIndex: 1,
                explanation: "引数の型が double なので、double 版のオーバーロードが選ばれます。",
              },
              {
                id: "q3",
                question: "withTax を price * 110 / 100 と整数で計算している理由はどれですか。",
                choices: ["double だと誤差が出る可能性があるため", "速いため", "Java の決まりだから"],
                answerIndex: 0,
                explanation: "お金の計算は整数で行い、端数の処理 (切り捨てなど) を明示します。",
              },
            ],
          },
          workplaceUse: "現場のコードは「1 つのメソッドは 1 つの仕事」を基本に分割されます。メソッド名だけで何をするか分かるように名前を付けることが、レビューで最もよく指摘される点の 1 つです。",
          commonErrors: [
            {
              error: "error: missing return statement",
              cause: "戻り値があるメソッドで、return しない経路がある (if の else がないなど)",
              fix: "すべての分岐で return しているか確認します。",
            },
            {
              error: "error: non-static method ... cannot be referenced from a static context",
              cause: "main から static の付いていないメソッドを呼んだ",
              fix: "このレッスンではメソッドに static を付けます。static でないメソッドの呼び方は L3 で学びます。",
            },
          ],
          reviewPoints: ["static 戻り値の型 名前(引数)", "戻り値なしは void", "引数が違えば同名メソッドを定義できる (オーバーロード)", "1 メソッド 1 仕事"],
        },
      },
    ],
  },
  {
    level: "L3",
    title: "Java 応用・オブジェクト指向",
    description: "クラスとオブジェクトでデータと処理をまとめ、変更に強いコードを書く",
    weeks: 2,
    lessons: [
      {
        slug: "l3-classes-objects",
        title: "クラスとオブジェクト・カプセル化",
        estimatedMinutes: 90,
        sourceUrl: REORGA + "%e3%82%af%e3%83%a9%e3%82%b9%e3%83%bb%e3%83%95%e3%82%a3%e3%83%bc%e3%83%ab%e3%83%89%e5%a4%89%e6%95%b0/",
        sourcePostId: 119,
        content: {
          objectives: [
            "クラス・フィールド・コンストラクタ・メソッドの役割を説明できる",
            "new でオブジェクトを作り、メソッドを呼び出せる",
            "private と検証付きメソッドで、不正な状態を防げる (カプセル化)",
          ],
          prerequisites: ["メソッド"],
          explanation: [
            {
              heading: "クラスとオブジェクト",
              body: "クラスは設計図、オブジェクト (インスタンス) は設計図から作った実物です。BankAccount クラスから、山田さんの口座・佐藤さんの口座という別々のオブジェクトを作れます。",
            },
            {
              heading: "フィールドとコンストラクタ",
              body: "フィールドはオブジェクトが持つデータ (owner、balance)。コンストラクタは new したときに 1 回だけ呼ばれ、フィールドの初期値を設定します。this.owner は「このオブジェクトの owner フィールド」を指し、同名の引数と区別するために使います。",
            },
            {
              heading: "カプセル化",
              body: "フィールドを private にすると、クラスの外から直接書き換えられなくなります。残高を変える方法を deposit / withdraw に限定し、その中で金額をチェックすれば「残高がマイナス」という不正な状態を防げます。final を付けたフィールドは一度設定したら変更できません。",
            },
            {
              heading: "例外で異常を知らせる",
              body: "不正な操作には throw new IllegalArgumentException(\"理由\") で例外を投げます。呼び出し側は try / catch で受け取って対応します。例外の詳しい扱いは後のレッスンで学びます。",
            },
          ],
          examples: [
            {
              title: "銀行の窓口",
              body: "お客さんは金庫 (フィールド) に直接手を入れられず、窓口 (メソッド) を通してお金を出し入れします。窓口では残高を確認してから払い出します。",
            },
          ],
          code: [
            {
              language: "java",
              filename: "Main.java",
              output: "山田 花子 の残高: 1500円\nエラー: 残高不足です (残高 1500円)\n残高は変わらない: 1500円",
              verifiedBy: "content/code/l3-classes/Main.java",
            },
          ],
          exercises: [
            {
              title: "入金のチェックを確かめる",
              task: "main で account.deposit(0) を呼び、例外のメッセージが表示されるよう try / catch を書いてください。",
            },
            {
              title: "商品クラスを作る",
              task: "name (変更不可) と stock (在庫数) を持つ Product クラスを作り、出荷メソッド ship(int qty) で在庫を減らしてください。在庫より多い数量や 0 以下の数量は例外にします。",
            },
          ],
          quiz: {
            passScore: 67,
            questions: [
              {
                id: "q1",
                question: "balance を private にする主な理由はどれですか。",
                choices: ["処理を速くするため", "クラスの外から不正な値に書き換えられるのを防ぐため", "メモリを節約するため"],
                answerIndex: 1,
                explanation: "変更をメソッド経由に限定し、そこで検証するためです。",
              },
              {
                id: "q2",
                question: "コンストラクタが呼ばれるのはいつですか。",
                choices: ["new でオブジェクトを作るとき", "メソッドを呼ぶたび", "プログラム終了時"],
                answerIndex: 0,
                explanation: "new のときに 1 回だけ呼ばれ、初期化を行います。",
              },
              {
                id: "q3",
                question: "引数とフィールドが同じ名前 owner のとき、フィールドを指す書き方はどれですか。",
                choices: ["owner", "this.owner", "super.owner"],
                answerIndex: 1,
                explanation: "this は「このオブジェクト自身」を指します。",
              },
            ],
          },
          workplaceUse: "業務システムの「注文」「顧客」「在庫」などはクラスで表されます。不正な状態を作れないクラス設計は、不具合を減らす最も効果的な方法の 1 つで、L5 の Spring Boot でも同じ考え方を使います。",
          commonErrors: [
            {
              error: "error: balance has private access in BankAccount",
              cause: "クラスの外から private フィールドに直接アクセスした",
              fix: "getBalance() などのメソッドを通して値を取得します。",
            },
            {
              error: "NullPointerException",
              cause: "new していない (null の) 変数に対してメソッドを呼んだ",
              fix: "スタックトレースの行を確認し、その変数に new したオブジェクトが入っているか確かめます。",
            },
          ],
          reviewPoints: ["クラスは設計図、オブジェクトは実物", "コンストラクタで初期化", "フィールドは private、変更はメソッド経由で検証", "不正な操作は例外で知らせる"],
        },
      },
      ...L3_LESSONS,
    ],
  },
  { level: "L4", title: "Web 技術・SQL", description: "HTTP・HTML/CSS/JavaScript・SQL・JDBC を学び、Web アプリの仕組みを理解する", weeks: 2, lessons: [...L4_FRONTEND, L4_HTTP, ...L4_LESSONS, L4_JDBC] },
  { level: "L5", title: "Spring Boot・API 開発", description: "Spring Boot で認証付きの Web アプリと REST API を作り、テストを書く", weeks: 2, lessons: [...L5_LESSONS, L5_SECURITY] },
  { level: "L6", title: "実践開発・チーム開発", description: "ブランチ・PR・コードレビュー・チケット駆動で、チームで開発する", weeks: 1.5, lessons: L6_LESSONS },
  { level: "L7", title: "卒業制作・実務能力評価", description: "要件定義から発表までを一人で行い、講師が実務能力を評価する", weeks: 1, lessons: [L7_GUIDE] },
];

export const ASSIGNMENTS: AssignmentDef[] = [
  {
    slug: "a1-github-profile",
    level: "L1",
    afterLesson: "l1-git-basics",
    title: "GitHub に自己紹介リポジトリを公開する",
    type: "GITHUB_REPO",
    passScore: 70,
    body: {
      purpose: "Git の基本操作 (commit・ブランチ) と、GitHub でリポジトリを公開する流れを一通り経験する。",
      scenario: "配属初日に「自己紹介を README にまとめてチームのリポジトリに PR を出して」と頼まれた想定です。",
      requirements: [
        "GitHub に public リポジトリ its-profile を作る",
        "README.md に名前 (ニックネーム可)・このコースの目標・学習計画を書く",
        "main 以外のブランチで作業し、PR を作って自分でマージする",
        "commit が 3 件以上あり、メッセージが「種類: 内容」の形式",
      ],
      recommended: ["README に見出し (#) と箇条書きを使う", "PR の説明欄に変更内容を書く"],
      steps: [
        "GitHub でリポジトリを作成し、手元に git clone する",
        "git switch -c feature/profile でブランチを作る",
        "README.md を編集して commit (3 回以上に分ける)",
        "git push -u origin feature/profile で送る",
        "GitHub で PR を作成し、内容を確認してマージする",
      ],
      deliverables: ["リポジトリの URL", "マージした PR の URL (備考欄)"],
      readmeChecklist: ["名前", "このコースの目標", "週ごとの学習計画"],
      resubmitCondition: "要件のいずれかを満たしていない場合は修正依頼になります。指摘を直して再提出してください。",
      interviewPoints: ["ブランチを使う理由", "commit と push の違い", "PR で何をレビューしてもらうか"],
    },
  },
  {
    slug: "a2-grade-calculator",
    level: "L2",
    afterLesson: "l2-methods",
    title: "成績判定プログラム",
    type: "CODE",
    passScore: 70,
    body: {
      purpose: "条件分岐・配列・繰り返し・メソッドを組み合わせて、仕様どおりに動くプログラムを書く。",
      scenario: "研修担当者から「テストの点数一覧から、評価と統計を出すツールが欲しい」と依頼された想定です。",
      requirements: [
        "int 配列の点数一覧から、合計・平均 (小数第 1 位まで)・最高点・最低点を表示する",
        "各点数に評価を付ける: 80 以上 A / 60 以上 B / それ未満 C",
        "0 未満または 100 より大きい値は「入力エラー」と表示し、統計から除外する",
        "評価を決める処理を String grade(int score) メソッドに分ける",
      ],
      recommended: ["統計の計算もメソッドに分ける", "空の配列のときの動作を考えて README に書く"],
      steps: [
        "仕様から境界値 (0, 59, 60, 79, 80, 100, -1, 101) を書き出す",
        "grade メソッドを書き、境界値で動作を確かめる",
        "統計を計算する処理を書く",
        "実行結果を貼り付けて提出する",
      ],
      deliverables: ["Main.java の全文", "境界値を含む配列での実行結果 (備考欄)"],
      readmeChecklist: [],
      resubmitCondition: "境界値で誤った評価が出る、または入力エラーの値が統計に含まれる場合は修正依頼になります。",
      interviewPoints: ["境界値をどう選んだか", "メソッドに分けた理由", "平均を小数で出すために何をしたか"],
    },
  },
  ...L3_L4_ASSIGNMENTS,
  L5_ASSIGNMENT,
  ...FE_L6_ASSIGNMENTS,
  L7_FINAL,
];
