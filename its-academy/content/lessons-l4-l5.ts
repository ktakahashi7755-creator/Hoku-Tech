/**
 * L4 (HTTP・JDBC) と L5 (Spring Boot 4 / REST API / テスト) のレッスン。
 * REOrGA 教材の監査で見つかった問題 (Statement の文字列連結、jar の手動追加、パスワードの直書き、
 * Spring Boot 3.5 固定、REST API とテストの欠落) を解消して再構成した。
 */
import type { AssignmentDef, LessonDef } from "./curriculum";
import { source } from "./sources";

const BOOK = "content/code/l5-book-api";
const BOOK_SRC = `${BOOK}/src/main/java/com/example/bookapi`;

export const L4_HTTP: LessonDef = {
  slug: "l4-http",
  title: "HTTP の仕組み (リクエストとレスポンス)",
  estimatedMinutes: 75,
  ...source(160),
  content: {
    objectives: [
      "HTTP のリクエスト (メソッド・URL・ヘッダ・本文) とレスポンス (ステータスコード・ヘッダ・本文) を説明できる",
      "GET と POST の違いと使い分けを説明できる",
      "主なステータスコード (200・201・204・400・401・403・404・405・409・500) の意味が分かる",
    ],
    prerequisites: ["例外処理とスタックトレースの読み方", "ブラウザで Web ページを開いたことがある"],
    explanation: [
      {
        heading: "HTTP はブラウザとサーバーの会話のルール",
        body: "ブラウザ (クライアント) がサーバーに「リクエスト」を送り、サーバーが「レスポンス」を返します。この 1 往復が HTTP の基本です。\nリクエスト: メソッド (GET など)、URL、ヘッダ (付加情報)、本文 (送るデータ)\nレスポンス: ステータスコード (結果を表す 3 桁の数字)、ヘッダ、本文 (HTML や JSON)",
      },
      {
        heading: "メソッドの使い分け",
        body: "GET: データを取得する。送る値は URL の ? の後 (クエリ文字列) に付く\nPOST: データを新しく作る。送る値は本文に入れる\nPUT: データを置き換える (更新する)\nDELETE: データを削除する\nGET はブラウザの履歴やサーバーのログに URL ごと残るため、パスワードなどの秘密情報を GET で送ってはいけません。POST でも通信自体は暗号化されないので、ログイン画面などは必ず HTTPS (暗号化された HTTP) を使います。",
      },
      {
        heading: "ステータスコード",
        body: "2xx 成功: 200 OK / 201 Created (作成した。Location ヘッダに新しい URL) / 204 No Content (成功、本文なし)\n4xx クライアント側の誤り: 400 Bad Request (入力が不正) / 401 Unauthorized (ログインが必要) / 403 Forbidden (権限がない) / 404 Not Found / 405 Method Not Allowed (そのメソッドは受け付けない) / 409 Conflict (重複など、現在の状態と矛盾)\n5xx サーバー側の誤り: 500 Internal Server Error (プログラムの不具合など)",
      },
      {
        heading: "ヘッダと Cookie",
        body: "Content-Type は本文の形式 (text/html、application/json など) を表します。\nHTTP は 1 回ごとに独立していて、前のリクエストを覚えていません (ステートレス)。ログイン状態などを続けるために、サーバーは Set-Cookie ヘッダでブラウザに値 (セッション ID など) を保存させ、ブラウザは次のリクエストから Cookie ヘッダでその値を送ります。",
      },
    ],
    examples: [
      {
        title: "窓口の申込書",
        body: "リクエストは窓口に出す申込書、メソッドは申込書の種類 (照会・新規・変更・解約)、ヘッダは記入欄の付記、本文は申込内容です。レスポンスのステータスコードは窓口の返事 (受付完了・書類不備・担当窓口なし) に当たります。",
      },
    ],
    code: [
      {
        language: "java",
        filename: "Main.java",
        output:
          "GET /hello -> 200\n  Hello, hanako\nPOST /tasks -> 201\n  Location: /tasks/1\n  created: {\"title\":\"課題を提出する\"}\nGET /tasks -> 405\nGET /nothing -> 404\n  <h1>404 Not Found</h1>No context found for request",
        verifiedBy: "content/code/l4-http/Main.java",
      },
    ],
    exercises: [
      {
        title: "ブラウザの開発者ツールで HTTP を見る",
        task: "ブラウザで任意の Web サイトを開き、開発者ツール (F12) の「ネットワーク」タブで最初のリクエストを選んでください。メソッド・ステータスコード・Content-Type を書き出します。",
      },
      {
        title: "ステータスコードを返し分ける",
        task: "サンプルの /hello で、name が空のとき (/hello?name=) に 400 と「name を指定してください」を返すように変えてください。",
        hint: "exchange.sendResponseHeaders(400, body.length) と、本文の書き込みを name の判定の後に分けます。",
      },
    ],
    quiz: {
      passScore: 67,
      questions: [
        {
          id: "q1",
          question: "新しいデータの作成に成功したときに返すステータスコードとして最も適切なものはどれですか。",
          choices: ["200", "201", "204"],
          answerIndex: 1,
          explanation: "201 Created を返し、Location ヘッダで新しいデータの URL を伝えます。",
        },
        {
          id: "q2",
          question: "ログインのパスワードの送り方として正しいものはどれですか。",
          choices: ["GET のクエリ文字列で送る", "HTTPS の POST で本文に入れて送る", "HTTP の POST なら暗号化されるので問題ない"],
          answerIndex: 1,
          explanation: "GET は URL がログや履歴に残ります。POST でも HTTPS でなければ暗号化されません。",
        },
        {
          id: "q3",
          question: "ログインはしているが、管理者ページを見る権限がないときのステータスコードはどれですか。",
          choices: ["401", "403", "404"],
          answerIndex: 1,
          explanation: "401 はログインが必要、403 はログイン済みだが権限がない、です。存在自体を隠したい場合に 404 を返す設計もあります。",
        },
      ],
    },
    workplaceUse: "Web アプリの不具合調査では、まず開発者ツールでリクエストとレスポンス (特にステータスコードと本文) を確認します。L5 で作る REST API も、正しいメソッドとステータスコードを返すことが利用者との約束になります。",
    commonErrors: [
      {
        error: "405 Method Not Allowed",
        cause: "そのURL が受け付けないメソッドで送った (POST 専用の URL に GET したなど)",
        fix: "API の仕様でメソッドを確認します。フォームの method 属性やクライアントの設定を見直します。",
      },
      {
        error: "404 Not Found",
        cause: "URL の打ち間違い、またはサーバー側でその URL に対応する処理がない",
        fix: "URL の綴り・スラッシュ・大文字小文字を確認します。サーバーの起動ログで、登録されている URL を確認します。",
      },
      {
        error: "java.net.ConnectException: Connection refused",
        cause: "サーバーが起動していない、またはポート番号が違う",
        fix: "サーバーが起動しているか、URL のポート番号が合っているかを確認します。",
      },
    ],
    reviewPoints: ["リクエスト = メソッド・URL・ヘッダ・本文", "GET は取得、POST は作成", "2xx 成功・4xx クライアントの誤り・5xx サーバーの誤り", "秘密情報は HTTPS の POST で"],
  },
};

export const L4_JDBC: LessonDef = {
  slug: "l4-jdbc",
  title: "Java からデータベースを操作する (JDBC)",
  estimatedMinutes: 120,
  ...source(180),
  content: {
    objectives: [
      "Maven で JDBC ドライバを依存関係に追加できる",
      "PreparedStatement で SQL を実行し、SQL インジェクションを防げる",
      "try-with-resources で接続を確実に閉じ、トランザクションを Java から制御できる",
    ],
    prerequisites: ["データの更新・削除とトランザクション", "例外処理とスタックトレースの読み方"],
    explanation: [
      {
        heading: "JDBC とドライバ",
        body: "JDBC は Java からデータベースを操作するための標準の API (決まった使い方) です。実際に PostgreSQL と通信する部品は「JDBC ドライバ」で、データベース製品ごとに用意されています。\nドライバの jar ファイルを手で置くのではなく、Maven の pom.xml に依存関係として書けば、Maven が自動でダウンロードします。JDBC 4.0 以降は Class.forName(...) によるドライバの読み込みも不要です。",
      },
      {
        heading: "接続情報は環境変数で渡す",
        body: "DriverManager.getConnection(URL, ユーザー, パスワード) で接続します。URL は jdbc:postgresql://ホスト:ポート/データベース名 の形式です。\nパスワードをソースコードに書くと Git の履歴に残り、漏えいの原因になります。サンプルのように環境変数 (System.getenv) や、Git に含めない設定ファイルから読みます。",
      },
      {
        heading: "PreparedStatement と SQL インジェクション",
        body: "SQL に利用者の入力を文字列連結で埋め込むと、入力に ' OR '1'='1 のような文字列を入れられたとき、SQL の条件が書き換えられてしまいます (SQL インジェクション)。サンプルでは、名前で検索しただけなのに全件が返っています。\nPreparedStatement では、SQL の値の部分を ? にしておき、setString などで値を渡します。値は SQL の一部ではなく「ただの値」として扱われるので、条件は書き換えられません。利用者の入力を含む SQL は必ず PreparedStatement で書きます。",
      },
      {
        heading: "結果の読み方と後片付け",
        body: "SELECT は executeQuery で実行し、ResultSet を next() で 1 行ずつ進めて getString(\"列名\") などで値を読みます。INSERT・UPDATE・DELETE は executeUpdate で、戻り値は変更した行数です。\nConnection・PreparedStatement・ResultSet は使い終わったら閉じる必要があります。try-with-resources に書けば自動で閉じられます。閉じ忘れると接続が足りなくなり、システムが止まる原因になります。",
      },
      {
        heading: "トランザクション",
        body: "JDBC は初期状態では 1 文ごとに自動で確定 (自動コミット) します。複数の更新をまとめたいときは setAutoCommit(false) にして、成功したら commit()、失敗したら rollback() します。サンプルの 2 回目の移動では、残高不足で rollback したため、途中まで減らしたポイントも元に戻っています。",
      },
    ],
    examples: [
      {
        title: "SQL インジェクションのたとえ",
        body: "「お名前: ____ 様の記録を見せてください」という申込書の空欄に「山田 様、または全員」と書かれたら、文章の意味が変わってしまいます。PreparedStatement は空欄を「名前を書く専用の欄」にして、何が書かれても名前として扱う仕組みです。",
      },
    ],
    code: [
      { language: "xml", filename: "pom.xml", verifiedBy: "content/code/l4-jdbc/pom.xml" },
      {
        language: "java",
        filename: "src/main/java/com/example/jdbc/Main.java",
        output:
          "--- 100 ポイント以上の会員\n山田: 120\n鈴木: 200\n--- 名前で検索 (入力: ' OR '1'='1)\n文字列連結 (危険): 3 件\nPreparedStatement (安全): 0 件\n--- ポイント移動\n50 ポイント移動しました\n失敗したので取り消し: ポイントが足りません\n山田: 70\n佐藤: 130\n鈴木: 200",
        verifiedBy: "content/code/l4-jdbc/src/main/java/com/example/jdbc/Main.java",
        runner: "content/code/l4-jdbc/run.sh",
      },
    ],
    exercises: [
      {
        title: "会員を追加するメソッド",
        task: "void addMember(Connection conn, int id, String name) を PreparedStatement で作り、id = 4、名前「高橋」、ポイント 0 で追加してください。同じ id で 2 回呼ぶと何が起きるか確かめます。",
        answer: "2 回目は主キーの重複で PSQLException (duplicate key value violates unique constraint \"members_pkey\") が発生する。",
      },
      {
        title: "インジェクションを自分で試す",
        task: "文字列連結の検索に、入力として 山田' -- を渡すと何件返るか予想してから実行してください。-- は SQL のコメントです。",
        answer: "1 件。入力の ' で文字列が閉じられ、後ろの ' が -- でコメントになるため、name = '山田' の検索になる。PreparedStatement なら 0 件。",
      },
    ],
    quiz: {
      passScore: 67,
      questions: [
        {
          id: "q1",
          question: "利用者の入力を含む検索 SQL の書き方として正しいものはどれですか。",
          choices: ["\"... WHERE name = '\" + input + \"'\" と連結する", "PreparedStatement で \"... WHERE name = ?\" とし setString で渡す", "入力から ' を取り除いてから連結すれば十分"],
          answerIndex: 1,
          explanation: "自作の文字の除去では漏れが出ます。PreparedStatement で値を渡すのが基本です。",
        },
        {
          id: "q2",
          question: "データベースのパスワードの扱いとして適切なものはどれですか。",
          choices: ["定数としてソースコードに書く", "環境変数や Git に含めない設定から読む", "README に書いて共有する"],
          answerIndex: 1,
          explanation: "ソースコードや README に書くと Git の履歴に残り、漏えいします。",
        },
        {
          id: "q3",
          question: "setAutoCommit(false) の後、途中で例外が起きたときに呼ぶべきなのはどれですか。",
          choices: ["commit()", "rollback()", "何もしない"],
          answerIndex: 1,
          explanation: "rollback() で途中までの変更を取り消し、データの整合性を保ちます。",
        },
      ],
    },
    workplaceUse: "現在の業務では JDBC を直接書くより Spring Data JPA などのフレームワークを使うことが多いですが、その内部では JDBC が動いています。性能の調査や複雑な SQL を書く場面で JDBC の知識が必要になります。SQL インジェクション対策と秘密情報の管理は、どの技術を使っても必ず守るべき基本です。",
    commonErrors: [
      {
        error: "org.postgresql.util.PSQLException: Connection to localhost:5432 refused",
        cause: "PostgreSQL が起動していない、またはホスト・ポートが違う",
        fix: "PostgreSQL が起動しているか、接続 URL のホスト名とポート番号を確認します。",
      },
      {
        error: "org.postgresql.util.PSQLException: FATAL: password authentication failed for user",
        cause: "ユーザー名かパスワードが違う、または環境変数が設定されていない (null)",
        fix: "環境変数が設定されているかを確認します。設定ファイルのアクセス制限を trust (パスワードなし) にして回避してはいけません。",
      },
      {
        error: "java.sql.SQLException: No suitable driver found for jdbc:postgresql://...",
        cause: "JDBC ドライバが依存関係に入っていない、または URL の書き方が違う",
        fix: "pom.xml に org.postgresql:postgresql があるか、URL が jdbc:postgresql:// で始まっているかを確認します。",
      },
    ],
    reviewPoints: ["ドライバは Maven で追加する", "パスワードはソースに書かない", "入力を含む SQL は必ず PreparedStatement", "接続は try-with-resources で閉じる", "まとめて更新するときは commit / rollback"],
  },
};

export const L5_LESSONS: LessonDef[] = [
  {
    slug: "l5-spring-boot-intro",
    title: "Spring Boot の基本 (DI とコントローラ)",
    estimatedMinutes: 90,
    ...source(330),
    content: {
      objectives: [
        "Spring Boot プロジェクトの構成 (pom.xml・起動クラス・パッケージ) を説明できる",
        "DI (依存性の注入) とコンストラクタインジェクションの意味を説明できる",
        "@RestController と @GetMapping で、HTTP リクエストに応答する処理を書ける",
      ],
      prerequisites: ["HTTP の仕組み (リクエストとレスポンス)", "インターフェースとポリモーフィズム", "Maven で依存関係を追加できる (JDBC のレッスン)"],
      explanation: [
        {
          heading: "フレームワークと Spring Boot",
          body: "ライブラリは「自分のコードが呼び出す道具」、フレームワークは「自分のコードを呼び出してくれる土台」です。Spring Boot では、HTTP リクエストを受け取る・データベースにつなぐといった共通の処理はフレームワークが行い、開発者は業務ごとの処理を書きます (制御の反転)。\nSpring Boot は Spring Framework を、設定をほとんど書かずに使えるようにしたものです。このコースでは Spring Boot 4.1 と Java 21 を使います。",
        },
        {
          heading: "プロジェクトの構成",
          body: "pom.xml: 使うライブラリ (スターター) を書く。spring-boot-starter-webmvc は Web アプリ、spring-boot-starter-data-jpa はデータベース\n@SpringBootApplication を付けたクラス: main メソッドから起動する。このクラスのパッケージ (com.example.bookapi) の下にあるクラスが自動で読み込まれる\nsrc/main/resources/application.properties: 設定 (接続先など)\nJava のパッケージ名にハイフン (-) は使えません。",
        },
        {
          heading: "DI (依存性の注入)",
          body: "@Service や @RestController を付けたクラスは、Spring がオブジェクトを作って管理します (これを Bean と呼びます)。HelloController のコンストラクタに GreetingService の引数を書くと、Spring が作った GreetingService を渡してくれます。自分で new しないので、テストのときに偽物の部品に差し替えられます。これを DI (Dependency Injection) と呼び、コンストラクタで受け取る書き方を推奨します。",
        },
        {
          heading: "@RestController と @GetMapping",
          body: "@RestController を付けたクラスのメソッドの戻り値は、そのままレスポンスの本文になります (オブジェクトを返すと JSON に変換されます)。@GetMapping(\"/api/hello\") は「GET /api/hello のリクエストをこのメソッドで処理する」という対応付けです。@RequestParam はクエリ文字列 (?name=hanako) の値を引数で受け取ります。画面 (HTML) を返す場合は @Controller とテンプレート (Thymeleaf) を使いますが、このコースでは JSON を返す REST API を中心に学びます。",
        },
        {
          heading: "起動の仕方",
          body: "プロジェクトのフォルダで ./mvnw spring-boot:run (Maven Wrapper がある場合) または mvn spring-boot:run を実行します。IDE の実行ボタンでも起動できますが、コマンドでの起動方法も覚えておくと、環境によらず同じ手順で動かせます。",
        },
      ],
      examples: [
        {
          title: "DI は「必要な道具を手渡してもらう」こと",
          body: "職人が自分で道具を作る (new する) のではなく、親方 (Spring) が道具を用意して手渡します。練習のときは本物の代わりに練習用の道具を渡せるので、職人の腕前だけを確かめられます (テストのしやすさ)。",
        },
      ],
      code: [
        { language: "java", filename: "BookApiApplication.java", verifiedBy: `${BOOK_SRC}/BookApiApplication.java` },
        { language: "java", filename: "hello/GreetingService.java", verifiedBy: `${BOOK_SRC}/hello/GreetingService.java` },
        {
          language: "java",
          filename: "hello/HelloController.java",
          output: "GET /api/hello -> 200\nHello, guest!\nGET /api/hello?name=hanako -> 200\nHello, hanako!",
          verifiedBy: `${BOOK_SRC}/hello/HelloController.java`,
          runner: `${BOOK}/run-hello.sh`,
        },
      ],
      exercises: [
        {
          title: "あいさつを時間帯で変える",
          task: "GreetingService の greet を、引数に時刻 (int hour) を加えて、5〜10 時は Good morning、それ以外は Hello にしてください。コントローラは hour をクエリ文字列で受け取ります (省略時は 12)。",
        },
        {
          title: "new した場合と比べる",
          task: "HelloController の中で new GreetingService() と書いた場合、テストで GreetingService を偽物に差し替えられなくなる理由を 2〜3 行で説明してください。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "Spring が推奨する依存関係の受け取り方はどれですか。",
            choices: ["フィールドに直接 new する", "コンストラクタの引数で受け取る", "static 変数に入れる"],
            answerIndex: 1,
            explanation: "コンストラクタインジェクションにすると、必要な部品が明確になり、テストで差し替えやすくなります。",
          },
          {
            id: "q2",
            question: "@RestController のメソッドがオブジェクトを返したとき、レスポンスの本文はどうなりますか。",
            choices: ["HTML のテンプレート名として扱われる", "JSON に変換される", "何も返らない"],
            answerIndex: 1,
            explanation: "@RestController の戻り値は本文になり、オブジェクトは JSON に変換されます。",
          },
          {
            id: "q3",
            question: "@SpringBootApplication のクラスが com.example.bookapi にあるとき、自動で読み込まれないクラスはどれですか。",
            choices: ["com.example.bookapi.book.BookService", "com.example.bookapi.hello.GreetingService", "com.example.other.OtherService"],
            answerIndex: 2,
            explanation: "起動クラスと同じパッケージとその下のパッケージだけが自動で読み込まれます。",
          },
        ],
      },
      workplaceUse: "Java の業務 Web アプリやバックエンド API の多くが Spring Boot で作られています。現場のコードを読むときも、@RestController → @Service → Repository の流れと、コンストラクタで部品を受け取る DI の形を押さえておけば、全体の構造をつかめます。",
      commonErrors: [
        {
          error: "Parameter 0 of constructor in ...HelloController required a bean of type '...GreetingService' that could not be found.",
          cause: "GreetingService に @Service を付け忘れた、または起動クラスより上や別のパッケージに置いた",
          fix: "@Service を付け、起動クラスのパッケージの下に置きます。",
        },
        {
          error: "Web server failed to start. Port 8080 was already in use.",
          cause: "前に起動したアプリが動いたまま、または別のソフトが 8080 番を使っている",
          fix: "前のアプリを停止します。別のポートで起動するなら --server.port=8081 を付けます。",
        },
        {
          error: "Whitelabel Error Page / 404 (ブラウザで URL を開いたとき)",
          cause: "@GetMapping のパスと開いた URL が一致していない",
          fix: "起動ログやコードの @GetMapping の値と、ブラウザの URL を見比べます。",
        },
      ],
      reviewPoints: ["フレームワークが自分のコードを呼ぶ (制御の反転)", "部品はコンストラクタで受け取る (DI)", "@RestController の戻り値は本文 (JSON)", "起動クラスのパッケージの下に置く"],
    },
  },
  {
    slug: "l5-rest-api",
    title: "REST API を作る (CRUD・入力チェック・エラー応答)",
    estimatedMinutes: 150,
    ...source(372),
    content: {
      objectives: [
        "Controller・Service・Repository に役割を分けて CRUD の API を作れる",
        "DTO と Bean Validation で入力をチェックし、400 を返せる",
        "例外を適切なステータスコード (404・409) と共通形式のエラーに変換できる",
      ],
      prerequisites: ["Spring Boot の基本 (DI とコントローラ)", "Java からデータベースを操作する (JDBC)", "テーブルの結合と集計 (JOIN・GROUP BY)"],
      explanation: [
        {
          heading: "REST API の設計",
          body: "リソース (ここでは本) を URL で表し、操作を HTTP メソッドで表します。\nGET /api/books 一覧 / GET /api/books/1 1 件 / POST /api/books 作成 (201 + Location) / PUT /api/books/1 更新 / DELETE /api/books/1 削除 (204)\nURL には動詞 (/getBook など) を入れず、名詞で表すのが基本です。",
        },
        {
          heading: "3 つの層",
          body: "Controller: HTTP の受け取りと返却だけを担当 (URL・ステータスコード)\nService: 業務のルール (ISBN の重複禁止など) とトランザクション (@Transactional)\nRepository: データベースとのやり取り。JpaRepository を継承したインターフェースを書くだけで、保存・検索・削除が使える\n層を分けると、それぞれを単独でテストでき、変更の影響も小さくなります。",
        },
        {
          heading: "エンティティと JPA",
          body: "@Entity を付けたクラスがテーブルに対応します。@Id が主キー、@GeneratedValue(strategy = GenerationType.IDENTITY) はデータベースによる自動採番です。JPA (Spring Data JPA) が SQL を作って実行し、内部では JDBC と PreparedStatement が使われます。\nfindByAuthorOrderById のように決まった規則でメソッド名を付けると、その名前から SQL が作られます。",
        },
        {
          heading: "DTO と入力チェック",
          body: "受け取る値はエンティティではなく専用の record (DTO: BookRequest) で受け取ります。こうすると、id など利用者に変更させたくない項目を受け付けずに済みます。\n@NotBlank・@Size・@Pattern などで入力のルールを書き、コントローラの引数に @Valid を付けると、ルール違反の場合はメソッドが呼ばれる前に MethodArgumentNotValidException が発生します。",
        },
        {
          heading: "エラー応答をそろえる",
          body: "@RestControllerAdvice を付けたクラスで、例外ごとにステータスコードと本文を決めます。サンプルでは、Spring の ProblemDetail (RFC 9457 で決められたエラー形式) を使い、status・title・detail を返しています。エラーの本文にスタックトレースや SQL を含めると、攻撃の手がかりになるため返しません。",
        },
      ],
      examples: [
        {
          title: "レストランの分業",
          body: "ホール係 (Controller) は注文を受けて料理を運ぶだけ、料理長 (Service) はレシピと品質のルールを守り、倉庫係 (Repository) は食材の出し入れだけをします。ホール係が倉庫に直接入らないことで、それぞれの仕事を変えやすくなります。",
        },
      ],
      code: [
        { language: "java", filename: "book/Book.java", verifiedBy: `${BOOK_SRC}/book/Book.java` },
        { language: "java", filename: "book/BookRepository.java", verifiedBy: `${BOOK_SRC}/book/BookRepository.java` },
        { language: "java", filename: "book/BookRequest.java", verifiedBy: `${BOOK_SRC}/book/BookRequest.java` },
        { language: "java", filename: "book/BookService.java", verifiedBy: `${BOOK_SRC}/book/BookService.java` },
        { language: "java", filename: "book/ApiExceptionHandler.java", verifiedBy: `${BOOK_SRC}/book/ApiExceptionHandler.java` },
        { language: "properties", filename: "application.properties", verifiedBy: `${BOOK}/src/main/resources/application.properties` },
        {
          language: "java",
          filename: "book/BookController.java",
          output: [
            "POST /api/books -> 201",
            "  Location: /api/books/1",
            '{"id":1,"title":"Java 入門","author":"山田","isbn":"9784000000001"}',
            "POST /api/books -> 201",
            "  Location: /api/books/2",
            '{"id":2,"title":"SQL 入門","author":"佐藤","isbn":"9784000000002"}',
            "GET /api/books -> 200",
            '[{"id":1,"title":"Java 入門","author":"山田","isbn":"9784000000001"},{"id":2,"title":"SQL 入門","author":"佐藤","isbn":"9784000000002"}]',
            "PUT /api/books/1 -> 200",
            '{"id":1,"title":"Java 入門 第 2 版","author":"山田","isbn":"9784000000001"}',
            "GET /api/books?author=%E5%B1%B1%E7%94%B0 -> 200",
            '[{"id":1,"title":"Java 入門 第 2 版","author":"山田","isbn":"9784000000001"}]',
            "POST /api/books -> 400",
            '{"detail":"入力内容に誤りがあります","instance":"/api/books","status":400,"title":"Bad Request","errors":{"isbn":"ISBN は 13 桁の数字です","title":"タイトルは必須です"}}',
            "POST /api/books -> 409",
            '{"detail":"ISBN 9784000000002 はすでに登録されています","instance":"/api/books","status":409,"title":"Conflict"}',
            "DELETE /api/books/2 -> 204",
            "GET /api/books/2 -> 404",
            '{"detail":"ID 2 の本は見つかりません","instance":"/api/books/2","status":404,"title":"Not Found"}',
          ].join("\n"),
          verifiedBy: `${BOOK_SRC}/book/BookController.java`,
          runner: `${BOOK}/run-crud.sh`,
        },
      ],
      exercises: [
        {
          title: "curl で API を呼ぶ",
          task: "アプリを起動し、ターミナルから curl -i -X POST http://localhost:8080/api/books -H 'Content-Type: application/json' -d '{\"title\":\"Git 入門\",\"author\":\"鈴木\",\"isbn\":\"9784000000003\"}' を実行してください。-i を付けるとステータスコードとヘッダも表示されます。",
        },
        {
          title: "出版年を追加する",
          task: "Book に出版年 (publishedYear、1900〜今年) を追加し、BookRequest に入力チェック (@Min・@Max) を付け、レスポンスにも含めてください。範囲外の値で 400 と項目別のエラーが返ることを確かめます。",
          hint: "今年の上限は固定値ではなく、Service でチェックする方法も考えてみましょう。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "ISBN が重複しているかを確認する処理を置く場所として最も適切なのはどれですか。",
            choices: ["Controller", "Service", "Entity のコンストラクタ"],
            answerIndex: 1,
            explanation: "業務のルールは Service に置きます。Controller は HTTP の受け渡しに専念させます。",
          },
          {
            id: "q2",
            question: "リクエストの受け取りに Entity ではなく DTO (BookRequest) を使う理由として正しいものはどれですか。",
            choices: ["処理が速くなるから", "受け付ける項目と入力チェックを明示し、id など変更させたくない項目を受け取らないため", "JPA の決まりだから"],
            answerIndex: 1,
            explanation: "DTO で受け付ける項目を限定すると、意図しない項目の上書きを防げます。",
          },
          {
            id: "q3",
            question: "クエリ文字列に日本語 (author=山田) を入れて送るときに必要なことはどれですか。",
            choices: ["そのまま送る", "URL エンコード (パーセントエンコード) して送る", "全角を半角に変える"],
            answerIndex: 1,
            explanation: "URL に使えない文字は %E5%B1%B1 のようにエンコードします。そのまま送ると 400 になることがあります。",
          },
        ],
      },
      workplaceUse: "フロントエンド (React など) やスマホアプリは、こうした REST API を呼び出して画面を作ります。API の URL・メソッド・ステータスコード・エラー形式は利用者との約束なので、チームで仕様書 (OpenAPI など) にまとめ、変更するときは影響を確認します。",
      commonErrors: [
        {
          error: "400 Bad Request (本文が HTML の Tomcat のエラーページ)",
          cause: "URL のクエリ文字列に日本語などをエンコードせずに入れた",
          fix: "クエリ文字列は URL エンコードします。curl なら --get --data-urlencode 'author=山田' を使います。",
        },
        {
          error: "415 Unsupported Media Type",
          cause: "POST・PUT で Content-Type: application/json を付けずに JSON を送った",
          fix: "リクエストに Content-Type: application/json ヘッダを付けます。",
        },
        {
          error: "jakarta.persistence... / Not a managed type: class ...Book",
          cause: "エンティティが起動クラスのパッケージの外にある、または javax.persistence を import している (Spring Boot 3 以降は jakarta.persistence)",
          fix: "パッケージの位置と import を確認します。古い教材や記事の javax.* はそのまま使えません。",
        },
      ],
      reviewPoints: ["URL は名詞、操作はメソッド", "Controller・Service・Repository に分ける", "受け取りは DTO + @Valid", "例外は @RestControllerAdvice で共通の形式に", "エラーにスタックトレースを含めない"],
    },
  },
  {
    slug: "l5-testing",
    title: "API のテストを書く (JUnit 5・MockMvc)",
    estimatedMinutes: 90,
    content: {
      objectives: [
        "JUnit 5 でテストを書き、mvn test で実行できる",
        "@WebMvcTest と MockMvc で、コントローラのステータスコードと本文を検証できる",
        "@MockitoBean でサービスを偽物に差し替え、正常系と異常系を分けてテストできる",
      ],
      prerequisites: ["REST API を作る (CRUD・入力チェック・エラー応答)"],
      explanation: [
        {
          heading: "なぜテストを書くのか",
          body: "テストは「この入力ならこう動く」をコードで記録したものです。修正のたびに手で画面を確かめなくても、mvn test で一瞬で確認でき、変更で別の場所を壊したこと (デグレード) にすぐ気付けます。課題の評価観点「テスト」でも、テストコードがあるかを確認します。",
        },
        {
          heading: "JUnit 5 の基本",
          body: "@Test を付けたメソッドが 1 つのテストです。@DisplayName で日本語の説明を付けられます。テストは「準備 (given) → 実行 (when) → 確認 (then)」の 3 段で書くと読みやすくなります。テストは src/test/java の下に、対象と同じパッケージで置きます。",
        },
        {
          heading: "@WebMvcTest と MockMvc",
          body: "@WebMvcTest(BookController.class) は、Web の部分 (コントローラ・入力チェック・例外ハンドラ) だけを起動するテストです。データベースは使わないので速く動きます。MockMvc は実際にサーバーを起動せずに HTTP リクエストを送る道具で、status().isCreated() や jsonPath(\"$.title\") で結果を確認します。",
        },
        {
          heading: "@MockitoBean で部品を差し替える",
          body: "@MockitoBean を付けたフィールドは、本物の BookService の代わりに Mockito の偽物 (モック) になります。given(service.findById(99L)).willThrow(...) のように「こう呼ばれたらこう返す」を指定できます。DI でコンストラクタから部品を受け取る設計にしているので、この差し替えができます。\nSpring Boot 4 では @WebMvcTest の import が org.springframework.boot.webmvc.test.autoconfigure に変わっています。古い記事の @MockBean は @MockitoBean に置き換えます。",
        },
        {
          heading: "何をテストするか",
          body: "正常系 (200・201) だけでなく、異常系 (404・400・409) を必ず書きます。入力チェックのテストでは、境界の値 (空文字・13 桁と 12 桁など) を選びます。テストが通ることを確認したら、わざとコードを壊してテストが失敗することも一度確かめておくと、テストが本当に検証しているかが分かります。",
        },
      ],
      examples: [
        {
          title: "テストは自動の点検リスト",
          body: "飛行機は毎回の出発前に決まった点検リストを確認します。テストはこの点検リストを自動化したもので、何度でも同じ品質で確認できます。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "src/test/java/com/example/bookapi/book/BookControllerTest.java",
          output: "[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS",
          verifiedBy: `${BOOK}/src/test/java/com/example/bookapi/book/BookControllerTest.java`,
          runner: `${BOOK}/run-test.sh`,
        },
      ],
      exercises: [
        {
          title: "重複 ISBN のテストを追加する",
          task: "service.create が DuplicateIsbnException を投げたときに 409 と detail のメッセージが返ることを確かめるテストを追加してください。",
          hint: "given(service.create(any())).willThrow(new DuplicateIsbnException(\"9784000000002\"));",
        },
        {
          title: "テストが失敗することを確かめる",
          task: "ApiExceptionHandler の notFound で返すステータスを HttpStatus.BAD_REQUEST に変えて mvn test を実行し、どのテストがどんなメッセージで失敗するかを読んでから元に戻してください。",
          answer: "「存在しない本は 404 と理由を返す」が失敗し、Status expected:<404> but was:<400> と表示される。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "@WebMvcTest の説明として正しいものはどれですか。",
            choices: ["アプリ全体とデータベースを起動する", "Web の部分 (コントローラなど) だけを起動し、データベースは使わない", "ブラウザを起動して画面を操作する"],
            answerIndex: 1,
            explanation: "Web 層だけを起動するので速く、サービスはモックに差し替えます。",
          },
          {
            id: "q2",
            question: "テストで BookService を偽物に差し替えるために使うアノテーションはどれですか (Spring Boot 4)。",
            choices: ["@Autowired", "@MockitoBean", "@Service"],
            answerIndex: 1,
            explanation: "@MockitoBean で Mockito のモックに置き換わります (古い @MockBean は使いません)。",
          },
          {
            id: "q3",
            question: "テストケースの選び方として適切なものはどれですか。",
            choices: ["正常系だけを書く", "正常系に加えて、404・400 などの異常系と入力の境界値を書く", "失敗するテストは消す"],
            answerIndex: 1,
            explanation: "異常系と境界値にこそ不具合が潜みます。",
          },
        ],
      },
      workplaceUse: "多くの現場では、プルリクエストを出すと CI (GitHub Actions など) が自動でテストを実行し、失敗したらマージできない仕組みになっています。テストのないコードはレビューで「テストを追加してください」と指摘されるのが一般的です。",
      commonErrors: [
        {
          error: "package org.springframework.boot.test.autoconfigure.web.servlet does not exist",
          cause: "Spring Boot 3 の記事の import を使っている (Spring Boot 4 で場所が変わった)",
          fix: "org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest を import し、pom.xml に spring-boot-starter-webmvc-test を追加します。",
        },
        {
          error: "No qualifying bean of type '...BookService' available",
          cause: "@WebMvcTest ではサービスが起動されないのに、モックを用意していない",
          fix: "テストクラスに @MockitoBean BookService service; を追加します。",
        },
        {
          error: "java.lang.AssertionError: Status expected:<201> but was:<400>",
          cause: "テストで送った JSON が入力チェックに通っていない、または Content-Type がない",
          fix: "andDo(print()) を付けて実際のレスポンスを表示し、送った内容とエラーの本文を確認します。",
        },
      ],
      reviewPoints: ["準備 → 実行 → 確認の 3 段で書く", "@WebMvcTest + MockMvc で Web 層を速くテスト", "依存部品は @MockitoBean で差し替え", "異常系と境界値を必ず書く"],
    },
  },
];

export const L5_ASSIGNMENT: AssignmentDef = {
  slug: "a5-board-api",
  level: "L5",
  afterLesson: "l5-testing",
  title: "掲示板 REST API",
  type: "GITHUB_REPO",
  passScore: 70,
  body: {
    purpose: "Spring Boot で、層の分割・入力チェック・エラー応答・テストを備えた REST API を一人で作れることを確認する。",
    scenario: "社内の連絡用掲示板のバックエンドを任された想定です。画面はフロントエンド担当が別に作るため、API だけを作ります。",
    requirements: [
      "スレッド (タイトル・作成者・作成日時) の一覧・詳細・作成・更新・削除の API (GET・POST・PUT・DELETE)",
      "スレッドへのコメント (本文・投稿者・投稿日時) の一覧と投稿の API",
      "Controller・Service・Repository に分け、受け取りは DTO + Bean Validation",
      "存在しない ID は 404、入力の誤りは 400 (項目ごとのエラー) を ProblemDetail 形式で返す",
      "MockMvc のテストを 6 件以上 (各 API の正常系と、404・400 を含む)",
      "データベースは PostgreSQL。接続情報は環境変数で渡し、リポジトリに含めない",
    ],
    recommended: ["一覧の並び順 (新しい順) とページング (?page=0&size=20)", "コメントのあるスレッドを削除したときの動作を決めて README に書く", "GitHub Actions で mvn test を自動実行"],
    steps: [
      "API の一覧 (メソッド・URL・ステータスコード) を README に先に書く",
      "Spring Boot 4.1 / Java 21 のプロジェクトを作り、GitHub に push する",
      "スレッドの CRUD とテストを作る",
      "コメントの API とテストを作る",
      "README を仕上げ、PR を作ってからマージし、リポジトリ URL を提出する",
    ],
    deliverables: ["GitHub リポジトリの URL", "mvn test の結果 (備考欄)", "AI を使った場合は、使った場面と自分で確認したこと (備考欄)"],
    readmeChecklist: ["API の一覧 (メソッド・URL・説明・ステータスコード)", "起動方法 (必要な環境変数の名前。値は書かない)", "テストの実行方法", "設計で工夫した点・決めたルール"],
    resubmitCondition: "API が仕様どおりのステータスコードを返さない、テストがない・失敗する、接続情報がリポジトリに含まれている場合は修正依頼になります。",
    interviewPoints: ["層を分けた理由と、それぞれの責任", "DTO を使う理由", "どの異常系をテストしたか", "トランザクションが必要な処理はどこか"],
  },
};
