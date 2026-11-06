/**
 * L5 Spring Security と L7 卒業制作。
 * 元教材 (No.71 ログイン機能・No.72 SC3) の問題 (ロールと認可・CSRF の説明がない、
 * 合格基準・評価基準・期限・テスト要求がない) を解消して再構成した。
 */
import type { AssignmentDef, LessonDef } from "./curriculum";
import { source } from "./sources";

const SEC = "content/code/l5-secure-api";
const SEC_SRC = `${SEC}/src/main/java/com/example/bookapi`;

export const L5_SECURITY: LessonDef = {
  slug: "l5-security",
  title: "認証と認可 (Spring Security)",
  estimatedMinutes: 150,
  ...source(417),
  content: {
    objectives: [
      "認証 (だれか) と認可 (何をしてよいか) の違い、401 と 403 の違いを説明できる",
      "パスワードを BCrypt でハッシュ化して保存し、平文や画面・ログに出さない実装ができる",
      "Spring Security で URL とメソッドごとのアクセス制御 (ロール) を設定し、テストで確かめられる",
    ],
    prerequisites: ["REST API を作る (CRUD・入力チェック・エラー応答)", "API のテストを書く (JUnit 5・MockMvc)"],
    explanation: [
      {
        heading: "認証と認可",
        body: "認証 (Authentication) は「あなたはだれか」を確かめること (ログイン)、認可 (Authorization) は「その人に何を許すか」を決めることです。\nログインしていない・パスワードが違う → 401 Unauthorized\nログインしているが権限がない (一般利用者が本を登録しようとした) → 403 Forbidden\n画面でボタンを隠すだけでは認可になりません。API を直接呼ばれても拒否できるよう、必ずサーバー側で判定します。",
      },
      {
        heading: "パスワードはハッシュ化して保存する",
        body: "パスワードを平文で保存すると、データベースが漏えいしたときにすべての利用者のパスワードが知られてしまいます。保存するのは、元に戻せない変換 (ハッシュ) をした値だけです。\nBCrypt は、パスワードごとにランダムな値 (ソルト) を混ぜ、わざと計算に時間をかけるハッシュ方式です。同じパスワードでも毎回違う値になり、総当たりで元のパスワードを探すことも難しくなります。照合は passwordEncoder.matches(入力, 保存値) で行います。\nサンプルを実行すると、データベースには {bcrypt}$2a$10$… で始まる 68 文字の値だけが保存されます。{bcrypt} はアルゴリズムの印で、将来アルゴリズムを変えても古い値と共存できます。\nBCrypt は 72 バイトまでしか扱えず、Spring Security 7 ではそれより長いパスワードを encode すると例外になります。そのためサンプルの RegisterRequest では、パスワードを半角の英数字・記号 (1 文字 1 バイト) の 12〜64 文字に制限し、入力チェック (400) で止めています。",
      },
      {
        heading: "Spring Security の設定 (SecurityFilterChain)",
        body: "SecurityConfig の securityFilterChain で、リクエストが Controller に届く前に行うチェックを設定します。authorizeHttpRequests の requestMatchers は上から順に判定され、最初に一致したルールが使われます。\npermitAll(): だれでも可 / authenticated(): ログインした人 / hasRole(\"ADMIN\"): ADMIN のロールを持つ人\nログインの仕組み (UserDetailsService) は、データベースから利用者を探して、ユーザー名・パスワードのハッシュ・ロールを Spring Security に渡すだけです。パスワードの照合は Spring Security が行います。",
      },
      {
        heading: "HTTP Basic・セッション・CSRF",
        body: "このサンプルは API のため、リクエストのたびにユーザー名とパスワードを送る HTTP Basic 認証を使い、セッション (ログイン状態の記憶) を作りません。HTTP Basic のパスワードは暗号化されないため、必ず HTTPS で使います。\nブラウザの画面アプリでは、ログイン画面 (フォームログイン) とセッション Cookie を使うのが一般的です。その場合は CSRF (別のサイトから、ログイン中の利用者になりすまして送信させる攻撃) の対策が必須で、Spring Security の CSRF 対策を無効にしてはいけません。このサンプルで無効にしているのは、Cookie を使わない API だからです。",
      },
      {
        heading: "秘密情報の扱い",
        body: "初期管理者のパスワードは、ソースコードにも設定ファイルにも書かず、環境変数 ADMIN_PASSWORD から受け取ります。利用者の登録時に権限 (ロール) を選ばせず、必ず一般利用者として登録します。レスポンス (UserResponse) にはパスワードのハッシュ値も含めません。",
      },
    ],
    examples: [
      {
        title: "社員証と入館ゲート",
        body: "受付で社員証を確認するのが認証、社員証の種類によって入れるフロアが決まるのが認可です。社員証がない人は受付で止められ (401)、社員証はあっても権限のないフロアのゲートは開きません (403)。",
      },
    ],
    code: [
      { language: "java", filename: "config/SecurityConfig.java", verifiedBy: `${SEC_SRC}/config/SecurityConfig.java` },
      { language: "java", filename: "user/DbUserDetailsService.java", verifiedBy: `${SEC_SRC}/user/DbUserDetailsService.java` },
      { language: "java", filename: "user/UserService.java", verifiedBy: `${SEC_SRC}/user/UserService.java` },
      { language: "java", filename: "config/AdminInitializer.java", verifiedBy: `${SEC_SRC}/config/AdminInitializer.java` },
      {
        language: "java",
        filename: "src/test/java/com/example/bookapi/config/SecurityTest.java",
        verifiedBy: `${SEC}/src/test/java/com/example/bookapi/config/SecurityTest.java`,
        output: "[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS",
        runner: `${SEC}/run-test.sh`,
      },
      {
        language: "java",
        filename: "user/UserController.java",
        verifiedBy: `${SEC_SRC}/user/UserController.java`,
        output: [
          "POST /api/users -> 201",
          "  Location: /api/users/2",
          '{"id":2,"username":"hanako","role":"USER"}',
          "POST /api/users -> 409",
          '{"detail":"このユーザー名は使えません","instance":"/api/users","status":409,"title":"Conflict"}',
          "POST /api/users -> 400",
          '{"detail":"入力内容に誤りがあります","instance":"/api/users","status":400,"title":"Bad Request","errors":{"password":"パスワードは 12 文字以上にしてください","username":"ユーザー名は半角英小文字・数字の 3〜20 文字です"}}',
          "GET /api/books -> 401",
          '{"detail":"ログインが必要です","instance":"/api/books","status":401,"title":"Unauthorized"}',
          "GET /api/books (ユーザー hanako で認証) -> 401",
          '{"detail":"ログインが必要です","instance":"/api/books","status":401,"title":"Unauthorized"}',
          "GET /api/books (ユーザー hanako で認証) -> 200",
          "[]",
          "GET /api/me (ユーザー hanako で認証) -> 200",
          '{"id":2,"username":"hanako","role":"USER"}',
          "POST /api/books (ユーザー hanako で認証) -> 403",
          '{"detail":"この操作を行う権限がありません","instance":"/api/books","status":403,"title":"Forbidden"}',
          "POST /api/books (ユーザー admin で認証) -> 201",
          "  Location: /api/books/1",
          '{"id":1,"title":"Java 入門","author":"山田","isbn":"9784000000001"}',
        ].join("\n"),
        runner: `${SEC}/run-security.sh`,
      },
    ],
    exercises: [
      {
        title: "実行結果を読み解く",
        task: "実行結果の 2 つの「GET /api/books (ユーザー hanako で認証)」が 401 と 200 に分かれている理由を説明してください。また、hanako の id が 2 になっている理由を、AdminInitializer のコードから説明してください。",
        answer: "1 つ目は誤ったパスワードを送ったため認証に失敗して 401、2 つ目は正しいパスワードで 200。id が 2 なのは、アプリの起動直後に AdminInitializer が管理者 (id 1) を先に作るため。",
      },
      {
        title: "削除の権限を確かめるテスト",
        task: "SecurityTest に、ログインしていない利用者が DELETE /api/books/1 を呼ぶと 401 になるテストを追加してください。",
      },
      {
        title: "自分の情報だけを見られるようにする",
        task: "GET /api/users/{id} を追加し、本人か ADMIN だけが見られる (それ以外は 403) ようにしてください。",
        hint: "Principal のユーザー名と、取得した利用者のユーザー名を比べます。認可の判定は Service に置きます。",
      },
    ],
    quiz: {
      passScore: 67,
      questions: [
        {
          id: "q1",
          question: "ログイン済みの一般利用者が、管理者だけが使える API を呼んだときのステータスコードはどれですか。",
          choices: ["401", "403", "404"],
          answerIndex: 1,
          explanation: "認証はできている (だれかは分かる) が、権限がないので 403 Forbidden です。",
        },
        {
          id: "q2",
          question: "パスワードの保存方法として正しいものはどれですか。",
          choices: ["平文で保存し、データベースのアクセス権で守る", "暗号化して保存し、必要なときに復号する", "BCrypt などでハッシュ化した値だけを保存する"],
          answerIndex: 2,
          explanation: "元に戻せないハッシュを、ソルト付き・計算の重い方式 (BCrypt など) で保存します。",
        },
        {
          id: "q3",
          question: "Cookie のセッションでログイン状態を保つブラウザの画面アプリで、CSRF 対策をどう扱うべきですか。",
          choices: ["無効にする", "有効のまま使う", "HTTPS にすれば不要"],
          answerIndex: 1,
          explanation: "Cookie で認証する画面アプリでは CSRF 対策が必須です。HTTPS だけでは防げません。",
        },
      ],
    },
    workplaceUse: "認証・認可の不備は情報漏えいに直結するため、現場では最も慎重にレビューされる部分です。「画面で隠したから大丈夫」は通りません。API ごとに「だれが使えるか」を表にまとめ、テストで 401・403 を確かめるのが基本です。パスワードやトークンをログ・画面・Git に出さないことも徹底します。",
    commonErrors: [
      {
        error: "Spring Security を追加したら、既存のテストが Status expected:<200> but was:<401> で失敗する",
        cause: "すべての URL にログインが必要になったが、テストはログインしていない状態でリクエストしている",
        fix: "テストに @Import(SecurityConfig.class) を付けて本番と同じ設定を読み込み、@WithMockUser(roles = \"ADMIN\") などでログインした状態にします。",
      },
      {
        error: "IllegalArgumentException: Given that there is no default password encoder configured, each password must have a password encoding prefix.",
        cause: "データベースに平文のパスワードや、{bcrypt} の印のない値が入っている",
        fix: "登録時に passwordEncoder.encode(...) した値を保存します。平文のパスワードを手で INSERT しません。",
      },
      {
        error: "POST・PUT・DELETE だけが 403 になる (画面アプリ)",
        cause: "CSRF 対策が有効なのに、フォームに CSRF トークンを含めていない",
        fix: "Thymeleaf のフォーム (th:action) を使うと自動でトークンが入ります。CSRF 対策を無効にして回避してはいけません。",
      },
    ],
    reviewPoints: ["認証 = だれか (401)、認可 = 何をしてよいか (403)", "パスワードは BCrypt のハッシュだけを保存", "アクセス制御はサーバー側で、テストで確かめる", "Cookie で認証する画面アプリは CSRF 対策を有効に", "秘密情報は環境変数で渡し、表示・記録しない"],
  },
};

export const L7_GUIDE: LessonDef = {
  slug: "l7-final-project-guide",
  title: "卒業制作の進め方 (要件定義から発表まで)",
  estimatedMinutes: 60,
  ...source(446),
  content: {
    objectives: [
      "卒業制作の流れ (要件定義・設計・実装・テスト・発表) と、各段階で作るものを説明できる",
      "要件を「必須」と「追加」に分け、期間内に終わる計画を立てられる",
      "評価の観点を理解し、面談で自分の設計と判断を説明できる",
    ],
    prerequisites: ["認証と認可 (Spring Security)", "API のテストを書く (JUnit 5・MockMvc)", "Git の基本 (commit とブランチ)"],
    explanation: [
      {
        heading: "卒業制作で確かめること",
        body: "卒業制作は、L0〜L6 で学んだことを使い、仕様書を読んで一人でシステムを作り上げる課題です。動くものを作るだけでなく、「なぜその設計にしたか」「何をテストしたか」「どこに AI を使い、どう確かめたか」を説明できることを評価します。題材は図書管理システムです。",
      },
      {
        heading: "1 週間の進め方",
        body: "1 日目: 仕様書を読み、不明点を質問としてまとめる。必須要件と追加要件に分ける\n2 日目: テーブル設計 (ER 図)、API の一覧、画面の一覧を作り、講師に確認してもらう\n3〜5 日目: 必須要件から順に、1 機能ずつ「実装 → テスト → commit → PR」で進める\n6 日目: 追加要件、README、動作確認の手順書\n7 日目: 発表 (10 分) と面談 (20 分)\n毎日の終わりに、進み具合・困っていること・明日の予定を講師に報告します。",
      },
      {
        heading: "要件の読み方と質問の仕方",
        body: "仕様書の「1 人 3 冊まで」のような数値や条件は、すべてテストの候補です。曖昧な点 (例: 延滞中に返却したら次の日から借りられるか) は、勝手に決めずに質問します。質問は「仕様書の該当箇所・自分の解釈・選択肢」をそろえて送ると、早く確実に回答が得られます。決まったことは README に記録します。",
      },
      {
        heading: "AI の使い方",
        body: "AI ツールの利用は禁止しませんが、提出物の備考欄に「どこで使ったか・自分で何を確かめたか」を書きます。AI が出したコードは、1 行ずつ説明できるまで読み、テストで動作を確かめてから使います。面談では、AI が出したコードについても設計の理由を質問します。パスワードや個人情報を AI に入力してはいけません。",
      },
    ],
    examples: [
      {
        title: "要件を分ける例",
        body: "必須: ログイン、本の検索、貸出 (3 冊まで・2 週間)、返却、延滞の表示、管理者による本の登録\n追加: 予約、貸出履歴の CSV 出力、督促メール\n期間内に必須をすべて完成させることを最優先にし、追加は時間が残った場合に取り組みます。",
      },
    ],
    code: [],
    exercises: [
      {
        title: "質問リストを作る",
        task: "卒業制作の課題文を読み、曖昧だと思う点を 5 つ挙げ、それぞれ「仕様書の該当箇所・自分の解釈・選択肢」の形で質問文にしてください。",
      },
      {
        title: "テーブル設計を描く",
        task: "利用者・本・貸出の 3 つのテーブルの ER 図を描き、主キー・外部キー・必須項目を書き込んでください。紙に手書きでも構いません。",
      },
    ],
    quiz: {
      passScore: 100,
      questions: [
        {
          id: "q1",
          question: "仕様書に曖昧な点を見つけたときの対応として正しいものはどれですか。",
          choices: ["自分の判断で決めて進める", "該当箇所・自分の解釈・選択肢をそろえて質問し、決まったことを README に記録する", "その機能を作らない"],
          answerIndex: 1,
          explanation: "現場でも、仕様の確認は開発者の重要な仕事です。決まったことは記録に残します。",
        },
        {
          id: "q2",
          question: "期間内に終わらなそうなときに優先すべきものはどれですか。",
          choices: ["見た目を整える", "必須要件をすべて完成させ、テストを書く", "追加要件を 1 つでも多く作る"],
          answerIndex: 1,
          explanation: "必須要件の完成とテストが最優先です。追加要件は評価の加点にとどまります。",
        },
      ],
    },
    workplaceUse: "現場の開発も「仕様を読む → 不明点を確認する → 設計を合意する → 小さく作ってレビューを受ける → 報告する」の繰り返しです。卒業制作の進め方そのものが、配属後の仕事の進め方の練習になります。",
    commonErrors: [
      {
        error: "最終日にすべてをまとめて commit・push した",
        cause: "機能ごとに commit・PR を作らずに進めた",
        fix: "1 機能ずつ commit・PR を作ります。履歴は「どう進めたか」を説明する材料になり、問題が起きたときに戻れる地点にもなります。",
      },
      {
        error: "他の人の環境で起動できない",
        cause: "起動に必要な環境変数・データベースの準備手順が README にない",
        fix: "README に、必要なソフトのバージョン・環境変数の名前 (値は書かない)・起動とテストのコマンドを書き、別のフォルダに clone し直して手順どおりに動くか確かめます。",
      },
    ],
    reviewPoints: ["必須要件を最優先し、追加要件は後から", "曖昧な点は質問し、決定を記録", "1 機能ずつ実装 → テスト → commit → PR", "AI の利用は申告し、説明できるまで確かめる"],
  },
};

export const L7_FINAL: AssignmentDef = {
  slug: "a6-final-library-system",
  level: "L7",
  afterLesson: "l7-final-project-guide",
  title: "卒業制作: 図書管理システム",
  type: "FINAL_PROJECT",
  passScore: 75,
  body: {
    purpose: "仕様書を読み、要件定義から設計・実装・テスト・説明までを一人で行い、配属後に実務を任せられる力があるかを確認する。",
    scenario: "社内の図書コーナーの貸出管理を、紙の台帳からシステムに置き換える依頼を受けた想定です。利用者は一般社員 (一般利用者) と総務担当 (管理者) です。",
    requirements: [
      "ログイン (メールアドレスまたはユーザー名とパスワード)。パスワードは BCrypt でハッシュ化して保存する",
      "権限は一般利用者と管理者の 2 種類。管理者だけが本の登録・編集・削除と、利用者一覧の閲覧をできる (サーバー側で判定)",
      "本の検索 (タイトル・著者の部分一致) と一覧。貸出中かどうかを表示する",
      "貸出: 1 人 3 冊まで。貸出中の本は貸せない。返却期限は貸出日の 2 週間後。延滞中の本がある利用者には貸さない",
      "返却: 返却日を記録する。延滞していた場合は延滞日数を表示する",
      "自分の貸出中の本と返却期限、延滞の有無を確認できる",
      "Spring Boot 4.1 / Java 21 / PostgreSQL。接続情報・初期管理者のパスワードは環境変数で渡し、リポジトリに含めない",
      "テスト: 貸出ルール (上限・延滞・貸出中) のテストと、権限 (401・403) のテストを含め 15 件以上",
      "README: 要件の解釈と決めたこと、ER 図、API (または画面) の一覧、起動とテストの手順",
    ],
    recommended: ["予約 (貸出中の本を予約し、返却されたら予約者に貸せる)", "貸出履歴の CSV 出力 (管理者)", "画面 (Thymeleaf または React) の作成", "GitHub Actions でのテスト自動実行"],
    steps: [
      "課題文を読み、質問リストを講師に送る (1 日目)",
      "ER 図・API (画面) の一覧を作り、講師の確認を受ける (2 日目)",
      "必須要件を 1 機能ずつ、実装 → テスト → commit → PR で進める (3〜5 日目)",
      "追加要件・README・別の環境での動作確認 (6 日目)",
      "リポジトリを提出し、発表 10 分と面談 20 分を受ける (7 日目)",
    ],
    deliverables: [
      "GitHub リポジトリの URL (main ブランチに最終版。PR の履歴が残っていること)",
      "mvn test の結果 (備考欄)",
      "AI を使った場合は、使った場面と自分で確かめたこと (備考欄)",
      "発表資料 (README 内の章でも可)",
    ],
    readmeChecklist: ["要件の解釈と、質問して決めたこと", "ER 図", "API (または画面) の一覧と権限", "必要な環境変数の名前 (値は書かない)", "起動・テストの手順", "テストの観点", "作れなかったことと、その理由"],
    resubmitCondition: "必須要件の貸出ルールまたは権限の判定が守られていない、パスワードが平文で保存されている、接続情報がリポジトリに含まれている、テストがない・失敗する場合は修正依頼になります。合否は講師 2 名の採点と面談で判定し、AI の評価は使いません。",
    interviewPoints: [
      "テーブル設計の理由 (なぜその列・その関係にしたか)",
      "貸出ルールをどの層で、どうテストしたか",
      "認可をサーバー側で判定している箇所",
      "仕様の曖昧な点をどう扱ったか",
      "AI を使った箇所と、自分で確かめたこと",
      "時間があれば次に何を改善するか",
    ],
  },
};
