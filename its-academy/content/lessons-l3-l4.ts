/**
 * L3 (Java 応用・オブジェクト指向) と L4 (SQL) のレッスン。
 * REOrGA 教材の監査 (docs/source-audit.md) で見つかった誤りを修正して再構成したもの。
 */
import type { AssignmentDef, LessonDef } from "./curriculum";
import { source } from "./sources";

export const L3_LESSONS: LessonDef[] = [
  {
    slug: "l3-inheritance",
    title: "継承とオーバーライド (this と super)",
    estimatedMinutes: 90,
    ...source(125),
    content: {
      objectives: [
        "extends で親クラスの機能を引き継ぐ子クラスを作れる",
        "@Override を付けて親クラスのメソッドを上書きできる",
        "this と super の違いを説明し、コンストラクタで super(...) を正しく呼べる",
      ],
      prerequisites: ["クラスとオブジェクト・カプセル化"],
      explanation: [
        {
          heading: "継承",
          body: "class Manager extends Employee と書くと、Manager は Employee のフィールドとメソッドを引き継ぎます。Employee を親クラス (スーパークラス)、Manager を子クラス (サブクラス) と呼びます。Java では親クラスは 1 つだけです (単一継承)。\n継承は「Manager は Employee の一種である」と言える関係のときに使います。単にコードを使い回したいだけなら、継承ではなく別のクラスを持たせる (委譲) ほうが変更に強くなります。",
        },
        {
          heading: "オーバーライド",
          body: "親クラスと同じ名前・同じ引数のメソッドを子クラスで定義し直すことをオーバーライドと呼びます。メソッドの前に @Override を付けると、名前や引数を書き間違えたときにコンパイラがエラーで教えてくれます。\n親クラスの型の変数 (Employee e) に子クラスのオブジェクトを入れても、実行されるのは子クラスのメソッドです。",
        },
        {
          heading: "this と super",
          body: "this は「このオブジェクト自身」です。this.name = name; は「このオブジェクトの name フィールドに、引数の name を入れる」という意味です。\nsuper は「親クラスの部分」です。super.monthlyPay() で親クラスのメソッドを呼べます。子クラスのコンストラクタでは、最初の行で super(...) を呼んで親クラスの初期化を行います (書かないと引数なしの super() が自動で呼ばれ、親に引数なしコンストラクタがなければコンパイルエラーになります)。",
        },
        {
          heading: "オーバーロードとの違い",
          body: "オーバーロードは「同じ名前で引数が違うメソッドを並べる」こと、オーバーライドは「親のメソッドを子が上書きする」ことです。名前が似ているので混同しやすい用語です。\nなお、メソッドの引数と同じ名前のローカル変数を宣言すると、警告ではなくコンパイルエラーになります。",
        },
      ],
      examples: [
        {
          title: "給与計算で考える",
          body: "社員 (Employee) の月給は基本給、管理職 (Manager) は基本給 + 手当です。Manager は monthlyPay だけを上書きし、describe (説明文を作る処理) は親のものをそのまま使います。describe の中で呼ばれる monthlyPay は、オブジェクトが Manager なら Manager 版になります。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "Main.java",
          output: "佐藤 さん: 300000円\n鈴木 さん: 450000円\n月給: 450000円",
          verifiedBy: "content/code/l3-inheritance/Main.java",
        },
      ],
      exercises: [
        {
          title: "契約社員クラスを追加する",
          task: "Employee を継承した Contractor (契約社員) クラスを作り、monthlyPay を「時給 × 時間」で計算するようにオーバーライドしてください。時給 1500 円・160 時間なら describe() が「田中 さん: 240000円」になることを確認します。",
          hint: "親クラスのコンストラクタには baseSalary として 0 を渡し、時給と時間は Contractor のフィールドに持ちます。",
          answer: "例:\nclass Contractor extends Employee {\n    private final int hourlyRate;\n    private final int hours;\n\n    Contractor(String name, int hourlyRate, int hours) {\n        super(name, 0); // 親の初期化を最初に行う\n        this.hourlyRate = hourlyRate;\n        this.hours = hours;\n    }\n\n    @Override\n    int monthlyPay() {\n        return hourlyRate * hours;\n    }\n}\nnew Contractor(\"田中\", 1500, 160).describe() は「田中 さん: 240000円」になります。describe は親のものですが、中で呼ばれる monthlyPay は Contractor 版です。",
        },
        {
          title: "@Override の効果を確かめる",
          task: "Manager の monthlyPay の名前を monthlypay (p が小文字) に変えてコンパイルし、@Override があるときと消したときでどう変わるか確かめてください。",
          hint: "@Override は「親クラスに同じメソッドがあるはず」という宣言です。付けたまま名前を変えたときと、外したときの実行結果の両方を見ます。",
          answer: "@Override があると「method does not override or implement a method from a supertype」というコンパイルエラーになります。消すとコンパイルは通りますが、monthlypay は別のメソッドとして追加されただけで上書きにならないため、手当が足されず、鈴木さんの月給が 400000 円になります。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "子クラスのコンストラクタで super(name, baseSalary) を書く場所はどこですか。",
            choices: ["コンストラクタの最後の行", "コンストラクタの最初の行", "どこでもよい"],
            answerIndex: 1,
            explanation: "super(...) の呼び出しはコンストラクタの最初の文でなければなりません。",
          },
          {
            id: "q2",
            question: "Employee e = new Manager(...); e.monthlyPay() で実行されるのはどちらですか。",
            choices: ["Manager の monthlyPay", "Employee の monthlyPay", "コンパイルエラー"],
            answerIndex: 0,
            explanation: "変数の型ではなく、実際のオブジェクト (Manager) のメソッドが実行されます。",
          },
          {
            id: "q3",
            question: "@Override を付ける主な理由はどれですか。",
            choices: ["子クラスに新しいメソッドを追加するため", "継承を禁止するため", "上書きのつもりの書き間違いをコンパイル時に見つけるため"],
            answerIndex: 2,
            explanation: "親に同じメソッドがなければコンパイルエラーになるので、名前や引数の間違いにすぐ気付けます。",
          },
        ],
      },
      workplaceUse: "業務システムでは、共通の処理を親クラスにまとめる設計や、フレームワーク (Spring Boot など) が用意したクラスを継承して一部だけ上書きする場面があります。ただし継承の階層が深いと変更の影響が読みにくくなるため、現場では「継承は浅く、インターフェースを活用する」方針がよく取られます。",
      commonErrors: [
        {
          error: "error: constructor Employee in class Employee cannot be applied to given types",
          cause: "子クラスのコンストラクタで super(...) を書かず、親に引数なしのコンストラクタがない",
          fix: "子クラスのコンストラクタの最初の行で、親のコンストラクタに合う引数で super(...) を呼びます。",
        },
        {
          error: "error: method does not override or implement a method from a supertype",
          cause: "@Override を付けたメソッドの名前・引数が親クラスと一致していない",
          fix: "親クラスのメソッドの名前・引数の型・数を見比べて合わせます。",
        },
        {
          error: "error: variable name is already defined in method",
          cause: "引数と同じ名前のローカル変数を宣言した",
          fix: "変数名を変えます。フィールドを指したいときは this.name と書きます。",
        },
      ],
      reviewPoints: ["継承は「〜は〜の一種」のときに使う", "上書きするメソッドには @Override", "子のコンストラクタは最初に super(...)", "this は自分、super は親の部分"],
    },
  },
  {
    slug: "l3-interfaces",
    title: "インターフェースとポリモーフィズム",
    estimatedMinutes: 90,
    ...source(138),
    content: {
      objectives: [
        "インターフェースを定義し、implements で実装できる",
        "インターフェース型の変数・リストで、異なるクラスを同じように扱える (ポリモーフィズム)",
        "抽象クラスとインターフェースの使い分けを説明できる",
      ],
      prerequisites: ["継承とオーバーライド (this と super)"],
      explanation: [
        {
          heading: "インターフェースは「できること」の約束",
          body: "interface Notifier { void send(String message); } は「Notifier なら send ができる」という約束 (契約) です。クラスは implements Notifier と書いて、約束したメソッドを実装します。1 つのクラスが複数のインターフェースを実装できます。\nJava 8 以降は、インターフェースに default メソッド (標準の実装) や static メソッドも書けます。",
        },
        {
          heading: "ポリモーフィズム",
          body: "List<Notifier> にメール通知とチャット通知を混ぜて入れ、n.send(...) と同じ書き方で呼べます。呼び出す側は相手が具体的にどのクラスかを知らなくてよく、新しい通知方法 (例: SMS) を追加しても呼び出す側のコードは変わりません。これがポリモーフィズム (多態性) です。",
        },
        {
          heading: "抽象クラスとの違い",
          body: "抽象クラス (abstract class) は、共通のフィールドや途中までの処理を持てる「未完成の親クラス」です。継承できる親は 1 つだけです。\nインターフェースは状態 (フィールド) を持たない「できることの約束」で、いくつでも実装できます。迷ったらまずインターフェースを使い、共通の処理を共有したい場合に抽象クラスを検討します。",
        },
      ],
      examples: [
        {
          title: "コンセントの形",
          body: "コンセントの形 (インターフェース) が決まっていれば、差し込むのが掃除機でもドライヤーでも同じように電気を使えます。壁の配線 (呼び出す側) は、何が差し込まれるかを知る必要がありません。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "Main.java",
          output:
            "[メール] hanako@example.com へ: 課題の締め切りは金曜日です\n[チャット] #its-2026 へ: 課題の締め切りは金曜日です\n[メール] ken@example.com へ: 課題の締め切りは金曜日です\n送信件数: 3",
          verifiedBy: "content/code/l3-interfaces/Main.java",
        },
      ],
      exercises: [
        {
          title: "通知方法を追加する",
          task: "Notifier を実装した SmsNotifier (電話番号を持ち「[SMS] 090-xxxx へ: …」と表示) を作り、main のリストに追加してください。main の for 文は変更しないこと。",
          hint: "class SmsNotifier implements Notifier として電話番号をフィールドに持ち、public void send(String message) を @Override 付きで実装します。",
          answer: "例:\nclass SmsNotifier implements Notifier {\n    private final String phone;\n\n    SmsNotifier(String phone) {\n        this.phone = phone;\n    }\n\n    @Override\n    public void send(String message) {\n        System.out.println(\"[SMS] \" + phone + \" へ: \" + message);\n    }\n}\nmain の List.of(...) に new SmsNotifier(\"090-xxxx\") を加えるだけで、for 文を変えずに「[SMS] 090-xxxx へ: 課題の締め切りは金曜日です」が表示され、送信件数は 4 になります。",
        },
        {
          title: "図形の面積",
          task: "double area() を持つインターフェース Shape と、Rectangle (幅・高さ)・Circle (半径) を作り、List<Shape> の面積の合計を表示してください。円周率は Math.PI を使います。",
          hint: "合計は拡張 for 文で shape.area() を足していきます。",
          answer: "例:\ninterface Shape {\n    double area();\n}\n\nclass Rectangle implements Shape {\n    private final double width;\n    private final double height;\n\n    Rectangle(double width, double height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    @Override\n    public double area() {\n        return width * height;\n    }\n}\n\nclass Circle implements Shape {\n    private final double radius;\n\n    Circle(double radius) {\n        this.radius = radius;\n    }\n\n    @Override\n    public double area() {\n        return Math.PI * radius * radius;\n    }\n}\n確認: List.of(new Rectangle(2, 3), new Circle(1)) の合計は 6 + 3.141592653589793 = 9.141592653589793 です。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "インターフェースについて正しいものはどれですか。",
            choices: ["クラスは 1 つのインターフェースしか実装できない", "クラスは複数のインターフェースを実装できる", "インターフェースは new で直接オブジェクトを作れる"],
            answerIndex: 1,
            explanation: "implements A, B のように複数実装できます。インターフェース自体は new できません。",
          },
          {
            id: "q2",
            question: "SmsNotifier を追加したとき、サンプルの for 文の変更は必要ですか。",
            choices: ["必要", "Notifier を抽象クラスに変えれば不要", "不要"],
            answerIndex: 2,
            explanation: "呼び出す側は Notifier として扱っているので、新しい実装を追加しても変更は不要です。",
          },
          {
            id: "q3",
            question: "共通のフィールドと途中までの処理を子クラスと共有したいとき、向いているのはどれですか。",
            choices: ["抽象クラス", "インターフェース", "static メソッド"],
            answerIndex: 0,
            explanation: "インターフェースはフィールド (状態) を持てない「できることの約束」です。共通のフィールドや途中までの処理を子クラスに引き継がせたい場合は、抽象クラスが向いています。",
          },
        ],
      },
      workplaceUse: "Spring Boot では、Repository や Service をインターフェースで定義し、実装を差し替えられるようにする設計が一般的です。テストでは本物のデータベースの代わりに、同じインターフェースを実装したテスト用の部品を使います。",
      commonErrors: [
        {
          error: "error: EmailNotifier is not abstract and does not override abstract method send(String) in Notifier",
          cause: "インターフェースのメソッドを実装していない、または引数が違う",
          fix: "public void send(String message) を実装します。@Override を付けると間違いに気付きやすくなります。",
        },
        {
          error: "error: send(String) in EmailNotifier cannot implement send(String) in Notifier ... attempting to assign weaker access privileges",
          cause: "実装したメソッドに public を付け忘れた (インターフェースのメソッドは public)",
          fix: "実装するメソッドには public を付けます。",
        },
      ],
      reviewPoints: ["インターフェースは「できること」の約束", "implements は複数可、extends は 1 つ", "呼び出す側はインターフェース型で扱う", "迷ったらまずインターフェース"],
    },
  },
  {
    slug: "l3-collections",
    title: "コレクション (List・Set・Map)",
    estimatedMinutes: 90,
    ...source(129),
    content: {
      objectives: [
        "List・Set・Map の違いを説明し、目的に合わせて選べる",
        "ArrayList・HashSet・LinkedHashMap で要素を追加・削除・検索できる",
        "ジェネリクス (<String> など) の意味を説明できる",
      ],
      prerequisites: ["繰り返しと配列", "インターフェースとポリモーフィズム"],
      explanation: [
        {
          heading: "配列との違い",
          body: "配列は長さが固定でしたが、コレクションは要素を追加・削除すると大きさが自動で変わります。List・Set・Map はインターフェースで、ArrayList や HashMap がその実装クラスです。変数の型はインターフェース (List<String> tasks = new ArrayList<>();) にするのが一般的です。",
        },
        {
          heading: "3 つの使い分け",
          body: "List: 順番があり、同じ値を重複して入れられる (例: 受講生が学習した順のレッスン)\nSet: 同じ値を 1 つしか持たない (例: タグの一覧)\nMap: キーと値の組 (例: 受講生名 → 点数)。同じキーで put すると上書きされる\nHashSet・HashMap は順番を保証しません。追加した順を保ちたいときは LinkedHashSet・LinkedHashMap を使います。",
        },
        {
          heading: "ジェネリクス",
          body: "List<String> の <String> は「この List には String だけを入れる」という指定です。違う型を入れようとするとコンパイルエラーになり、取り出すときにキャストも不要になります。右側の new ArrayList<>() の <> は型を省略した書き方です。\nジェネリクスには int のような基本型は書けないため、List<Integer> のようにラッパークラスを使います。",
        },
        {
          heading: "変更できないコレクション",
          body: "List.of(\"a\", \"b\") や Map.of(...) で作ったコレクションは変更できません (add すると UnsupportedOperationException)。最初から値が決まっている一覧に使います。",
        },
      ],
      examples: [
        {
          title: "選び方の目安",
          body: "「順番に並べたい」→ ArrayList\n「重複を除きたい・含まれているかを速く調べたい」→ HashSet\n「名前から値を引きたい」→ HashMap (順番も保つなら LinkedHashMap)\n要素の途中への挿入が多い場合に LinkedList を勧める説明もありますが、現在のほとんどの用途では ArrayList のほうが速く、まず ArrayList を使えば十分です。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "Main.java",
          output: "タスク: [環境構築, 変数とデータ型] (2 件)\nタグの数: 2\nsql を含む: true\n山田: 90\n佐藤: 67\n鈴木の点数: 0",
          verifiedBy: "content/code/l3-collections/Main.java",
        },
      ],
      exercises: [
        {
          title: "単語の出現回数",
          task: "String[] words = {\"java\", \"sql\", \"java\", \"git\", \"java\"}; の各単語の出現回数を Map<String, Integer> で数え、「java: 3」のように表示してください。",
          hint: "map.getOrDefault(word, 0) + 1 を put します。",
          answer: "java: 3\nsql: 1\ngit: 1 (LinkedHashMap を使った場合の順序)",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "受講生のメールアドレスを重複なく集めたいときに向いているのはどれですか。",
            choices: ["ArrayList", "配列", "HashSet"],
            answerIndex: 2,
            explanation: "Set は同じ値を 1 つしか持たないので、重複を自動で除けます。",
          },
          {
            id: "q2",
            question: "scores.put(\"山田\", 82); scores.put(\"山田\", 90); の後、scores.get(\"山田\") はどうなりますか。",
            choices: ["90", "82", "[82, 90]"],
            answerIndex: 0,
            explanation: "同じキーで put すると値が上書きされます。",
          },
          {
            id: "q3",
            question: "List<int> と書けない理由はどれですか。",
            choices: ["int は 21 億までしか表せないため", "ジェネリクスには基本型を書けないため", "List は数値を入れられないため"],
            answerIndex: 1,
            explanation: "< > の中にはクラス (参照型) しか書けず、int は基本型です。そこで int を包むクラス Integer を使い、List<Integer> と書きます。add(5) のように書くと、int と Integer は自動で変換されます。",
          },
        ],
      },
      workplaceUse: "データベースから取得した一覧は List、ID からデータを引く対応表は Map として扱うのが典型です。Spring Boot の Repository も List<Book> のような形で結果を返します。",
      commonErrors: [
        {
          error: "java.lang.UnsupportedOperationException",
          cause: "List.of(...) などで作った変更できないコレクションに add / remove した",
          fix: "変更したい場合は new ArrayList<>(List.of(...)) のようにコピーしてから使います。",
        },
        {
          error: "java.util.ConcurrentModificationException",
          cause: "拡張 for 文でコレクションを回しながら、同じコレクションの要素を削除した",
          fix: "list.removeIf(x -> 条件) を使うか、Iterator の remove() を使います。",
        },
        {
          error: "NullPointerException (Map の値を int に入れたとき)",
          cause: "存在しないキーで get すると null が返り、int に変換できない",
          fix: "getOrDefault(キー, 0) を使うか、containsKey で先に確かめます。",
        },
      ],
      reviewPoints: ["順番 → List、重複なし → Set、対応表 → Map", "変数の型はインターフェースで書く", "ジェネリクスでは Integer などのラッパークラス", "List.of は変更不可"],
    },
  },
  {
    slug: "l3-exceptions",
    title: "例外処理とスタックトレースの読み方",
    estimatedMinutes: 90,
    ...source(159),
    content: {
      objectives: [
        "検査例外・実行時例外・Error の違いを説明できる",
        "try / catch / finally と try-with-resources で例外を扱える",
        "スタックトレースから、例外の種類と発生した行を特定できる",
      ],
      prerequisites: ["メソッド (処理に名前を付ける)", "継承とオーバーライド (this と super)"],
      explanation: [
        {
          heading: "例外の 3 つの種類",
          body: "検査例外 (IOException など): ファイルが読めない等、プログラムの外の事情で起こりうる失敗。catch するか throws で呼び出し元に任せないとコンパイルエラーになります。ファイルが存在しないときの FileNotFoundException も検査例外です。\n実行時例外 (RuntimeException の子: NullPointerException、NumberFormatException など): 多くはプログラムの誤り。catch は強制されません。\nError (OutOfMemoryError など): メモリ不足など回復が難しい深刻な問題。通常は catch しません。Error は検査例外ではありません。",
        },
        {
          heading: "try / catch / finally",
          body: "try の中で例外が起きると、その後の処理は飛ばされ、型が合う catch が実行されます。catch は上から順に調べられるので、子クラス (NumberFormatException) を親クラス (IllegalArgumentException) より先に書きます。finally は例外の有無にかかわらず最後に必ず実行されます。",
        },
        {
          heading: "try-with-resources",
          body: "try (BufferedReader reader = ...) { } のように、ファイルやデータベース接続などの「後で閉じる必要があるもの」を try の () に書くと、ブロックを抜けるときに自動で close されます。finally で close を書くより短く、閉じ忘れを防げます。",
        },
        {
          heading: "throw と throws",
          body: "throw new IllegalArgumentException(\"理由\") は例外を「発生させる」文です。throws IOException はメソッドの宣言に付けて「このメソッドは IOException を呼び出し元に投げることがある」と知らせる書き方です。検査例外を投げるメソッドを呼ぶ側も、catch するか throws を書く必要があります。",
        },
        {
          heading: "スタックトレースの読み方",
          body: "例外を catch しないと、次のような表示 (スタックトレース) が出ます。\nException in thread \"main\" java.lang.NumberFormatException: For input string: \"abc\"\n    at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)\n    at java.base/java.lang.Integer.parseInt(Integer.java:662)\n    at Main.parseScore(Main.java:17)\n    at Main.sumLines(Main.java:11)\n1 行目で例外の種類と理由を確認し、at の行を上から見て、最初に出てくる「自分のファイル名と行番号」(ここでは Main.java:17) を開きます。そこが調べ始める場所です。その下の行 (Main.java:11) は「どこから呼ばれたか」を示します。java.base/ で始まる行は Java 本体の中なので、通常は読み飛ばして構いません (行番号は Java のバージョンで変わります)。",
        },
      ],
      examples: [
        {
          title: "例外は「異常の報告書」",
          body: "例外は、処理を続けられないことを呼び出し元に伝える報告書です。受け取った側 (catch) が対応を決めます。対応できない場所で握りつぶす (catch して何もしない) と、原因が分からない不具合になります。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "Main.java",
          output:
            "合計: 240\n-- 1 件の処理を終了\n数字ではない行があります: For input string: \"abc\"\n-- 1 件の処理を終了\n範囲外の値があります: 点数は 0〜100 です: 150\n-- 1 件の処理を終了",
          verifiedBy: "content/code/l3-exceptions/Main.java",
        },
      ],
      exercises: [
        {
          title: "catch の順番を入れ替える",
          task: "サンプルの catch (NumberFormatException e) と catch (IllegalArgumentException e) の順番を入れ替えてコンパイルし、エラーメッセージを読んで理由を説明してください。",
          hint: "NumberFormatException は IllegalArgumentException の子クラスです。親の catch が先にあると、子の例外がどこで捕まるかを考えます。",
          answer: "「exception NumberFormatException has already been caught」というコンパイルエラーになります。NumberFormatException は IllegalArgumentException の子クラスなので、先にある親の catch で必ず捕まり、後の catch に到達しないためです。",
        },
        {
          title: "スタックトレースを読む",
          task: "main の try / catch をすべて外し、throws IOException を main に付けて \"80\\nabc\" だけを処理してください。表示されたスタックトレースから、自分のコードで最初に出てくる行番号を答えてください。",
          hint: "1 行目で例外の種類と理由を確かめ、at の行を上から見て、Main.java が最初に出てくる行を探します。",
          answer: "1 行目は Exception in thread \"main\" java.lang.NumberFormatException: For input string: \"abc\" です。自分のコードで最初に出てくるのは at Main.parseScore(Main.java:17) で、Integer.parseInt を呼んでいる行です。その下の at Main.sumLines(Main.java:11) が呼び出し元で、さらに下に main の行が続きます (main の行番号は書き換え方によって変わります)。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "存在しないファイルを開こうとしたときの FileNotFoundException はどれに分類されますか。",
            choices: ["Error", "実行時例外", "検査例外"],
            answerIndex: 2,
            explanation: "IOException の子クラスで、検査例外です。catch か throws が必要です。",
          },
          {
            id: "q2",
            question: "try-with-resources を使う主な理由はどれですか。",
            choices: ["例外を発生させないため", "リソースの close を自動で確実に行うため", "catch を書かなくてもよくするため"],
            answerIndex: 1,
            explanation: "ブロックを抜けると自動で close されるので、閉じ忘れによるリソース漏れを防げます。",
          },
          {
            id: "q3",
            question: "スタックトレースで最初に確認すべきものはどれですか。",
            choices: ["1 行目の例外の種類と、自分のコードが出てくる最初の at の行", "最後の行", "java.base/ で始まる行 (Java 本体の行)"],
            answerIndex: 0,
            explanation: "例外の種類・理由と、自分のファイルの行番号が調査の出発点です。",
          },
        ],
      },
      workplaceUse: "現場の障害対応は、ログに出たスタックトレースを読むところから始まります。また、データベース接続やファイルは try-with-resources で確実に閉じないと、接続が足りなくなってシステムが止まる原因になります。",
      commonErrors: [
        {
          error: "error: unreported exception IOException; must be caught or declared to be thrown",
          cause: "検査例外を投げるメソッドを、catch も throws もせずに呼んだ",
          fix: "try / catch で対応するか、メソッドに throws IOException を付けて呼び出し元に任せます。",
        },
        {
          error: "error: exception NumberFormatException has already been caught",
          cause: "親クラスの例外の catch を、子クラスの catch より先に書いた",
          fix: "子クラス (より具体的な例外) の catch を先に書きます。",
        },
        {
          error: "例外が起きても何も表示されず、原因が分からない",
          cause: "catch (Exception e) { } のように例外を握りつぶしている",
          fix: "最低でもメッセージを出力するかログに記録し、対応できない場合は呼び出し元に投げ直します。",
        },
      ],
      reviewPoints: ["検査例外は catch か throws が必須", "catch は子クラスを先に", "閉じる必要があるものは try-with-resources", "スタックトレースは 1 行目と自分のコードの行を見る"],
    },
  },
  {
    slug: "l3-datetime",
    title: "日付と時刻 (java.time)",
    estimatedMinutes: 60,
    ...source(130),
    content: {
      objectives: [
        "LocalDate・LocalDateTime で日付を作り、加算・比較できる",
        "2 つの日付の間の日数を求められる",
        "DateTimeFormatter で日付を文字列に変換できる",
      ],
      prerequisites: ["クラスとオブジェクト・カプセル化", "例外処理とスタックトレースの読み方"],
      explanation: [
        {
          heading: "java.time を使う",
          body: "Java 8 以降は java.time パッケージ (LocalDate・LocalDateTime・Duration など) を使います。古い Date・Calendar・SimpleDateFormat には、月が 0 から始まる、オブジェクトを変更できるため共有すると壊れやすい、複数のスレッドから同時に使うと安全でない、といった問題があります。そのため、既存システムのコードを読むとき以外は使いません。",
        },
        {
          heading: "作る・足す・比べる",
          body: "LocalDate.of(2026, 10, 20) で日付を作ります (月は 1〜12 で指定)。今日は LocalDate.now() です。\nplusDays・plusWeeks・plusMonths は「新しい日付を返す」メソッドで、元の日付は変わりません (不変オブジェクト)。\n比較は isBefore・isAfter・isEqual、日数の差は ChronoUnit.DAYS.between(開始, 終了) です。",
        },
        {
          heading: "月末とうるう年",
          body: "1 月 31 日に 1 か月足すと、2 月 31 日は存在しないため 2 月の末日 (2026 年なら 2 月 28 日) になります。うるう年かどうかは isLeapYear() で調べられ、2 月 29 日の計算も自動で正しく行われます。",
        },
        {
          heading: "文字列との変換",
          body: "DateTimeFormatter.ofPattern(\"yyyy年M月d日 H時mm分\") で表示形式を決め、format で文字列にします。LocalDate.parse(\"2026-12-24\") は ISO 形式の文字列から日付を作ります。形式が合わないと DateTimeParseException (実行時例外) になります。",
        },
      ],
      examples: [
        {
          title: "テストしやすい書き方",
          body: "LocalDate.now() を処理の中で直接呼ぶと、実行する日によって結果が変わり、テストで期待値を決められません。サンプルのように、基準日を引数や変数で渡す書き方にすると、どの日に実行しても同じ結果を確かめられます。",
        },
      ],
      code: [
        {
          language: "java",
          filename: "Main.java",
          output:
            "返却期限: 2026-11-03\n期限の曜日: TUESDAY\n延滞日数: 3 日\n延滞している: true\n2028 年はうるう年: true\n1 月 31 日の 1 か月後: 2026-02-28\n面談: 2026年11月9日 14時05分\n文字列から: true",
          verifiedBy: "content/code/l3-datetime/Main.java",
        },
      ],
      exercises: [
        {
          title: "コース修了予定日",
          task: "学習開始日 2026-10-01 から 12 週間後の修了予定日と、その曜日を表示してください。",
          hint: "LocalDate.of(2026, 10, 1).plusWeeks(12) で修了予定日を作り、getDayOfWeek() で曜日を取り出します。",
          answer: "2026-12-24 (THURSDAY)",
        },
        {
          title: "締め切りまでの日数",
          task: "基準日と締め切り日を受け取り、「あと N 日」または「N 日超過」を返すメソッド String remaining(LocalDate today, LocalDate deadline) を作ってください。",
          hint: "ChronoUnit.DAYS.between(today, deadline) は、締め切りを過ぎるとマイナスになります。0 以上かどうかで、返す文字列を分けます。",
          answer: "例:\nstatic String remaining(LocalDate today, LocalDate deadline) {\n    long days = ChronoUnit.DAYS.between(today, deadline);\n    if (days >= 0) {\n        return \"あと \" + days + \" 日\";\n    }\n    return (-days) + \" 日超過\";\n}\n確認: today が 2026-11-01 で deadline が 2026-11-03 なら「あと 2 日」、同じ日なら「あと 0 日」、deadline が 2026-10-30 なら「2 日超過」です。",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "LocalDate d = LocalDate.of(2026, 1, 31); d.plusMonths(1); の後、d の値はどうなりますか。",
            choices: ["2026-01-31 (変わらない)", "2026-02-28", "2026-03-03"],
            answerIndex: 0,
            explanation: "plusMonths は新しい日付を返すだけで、d 自体は変わりません。結果は別の変数で受け取ります。",
          },
          {
            id: "q2",
            question: "LocalDate.of で 3 月を指定するときの月の値はどれですか。",
            choices: ["2", "3", "MARCH しか使えない"],
            answerIndex: 1,
            explanation: "java.time では月を 1〜12 で指定します (Calendar の 0 始まりとは違います)。",
          },
          {
            id: "q3",
            question: "テストしやすくするための書き方はどれですか。",
            choices: ["処理の中で毎回 LocalDate.now() を呼ぶ", "日付を文字列で持つ", "基準日を引数で受け取る"],
            answerIndex: 2,
            explanation: "基準日を外から渡せば、どの日に実行しても同じ結果を確認できます。",
          },
        ],
      },
      workplaceUse: "貸出期限・請求の締め日・研修の修了予定日など、業務システムには日付計算が多く出てきます。月末や祝日、タイムゾーンの扱いを誤ると請求金額や期限の誤りにつながるため、レビューでも重点的に確認されます。",
      commonErrors: [
        {
          error: "java.time.format.DateTimeParseException: Text '2026/12/24' could not be parsed",
          cause: "LocalDate.parse は標準で 2026-12-24 形式だけを受け付ける",
          fix: "DateTimeFormatter.ofPattern(\"yyyy/MM/dd\") を作り、LocalDate.parse(文字列, formatter) とします。",
        },
        {
          error: "java.time.DateTimeException: Invalid date 'FEBRUARY 30'",
          cause: "存在しない日付を LocalDate.of で作ろうとした",
          fix: "入力値を検証するか、例外を catch して利用者にエラーを伝えます。",
        },
      ],
      reviewPoints: ["日付は java.time (Date・Calendar は使わない)", "plus 系は新しい値を返す (元は不変)", "月は 1〜12", "基準日は引数で渡すとテストしやすい"],
    },
  },
];

export const L4_LESSONS: LessonDef[] = [
  {
    slug: "l4-sql-select",
    title: "データベースと SELECT 文",
    estimatedMinutes: 90,
    ...source(170),
    content: {
      objectives: [
        "リレーショナルデータベース・テーブル・主キーの意味を説明できる",
        "CREATE TABLE でテーブルを作り、INSERT でデータを入れられる",
        "SELECT・WHERE・ORDER BY・LIKE で必要なデータを取り出せる",
      ],
      prerequisites: ["ターミナルの基本操作", "開発環境を整える (Windows / Mac)"],
      explanation: [
        {
          heading: "データベースと RDBMS",
          body: "データベースはデータを整理して保存し、取り出せるようにする仕組みです。表 (テーブル) の形でデータを持つものをリレーショナルデータベースと呼び、それを管理するソフトを RDBMS (例: PostgreSQL、MySQL、Oracle Database) と呼びます。\nSQL は RDBMS を操作する言語で、ISO / JIS で標準化されていますが、製品ごとに独自の書き方 (方言) もあります。このコースでは PostgreSQL を使います。",
        },
        {
          heading: "テーブル・列・行・主キー",
          body: "テーブルは列 (カラム: id、name、price など) と行 (レコード: 1 件のデータ) でできています。主キー (PRIMARY KEY) は行を一意に特定する列で、重複も空 (NULL) も許されません。NOT NULL は空を禁止、CHECK は値の条件、DEFAULT は省略時の値を指定する制約です。",
        },
        {
          heading: "SQL の分類",
          body: "DDL (データ定義): CREATE TABLE、ALTER TABLE、DROP TABLE など、テーブルの構造を作る・変える命令\nDML (データ操作): SELECT、INSERT、UPDATE、DELETE など、中のデータを扱う命令\nDCL (権限): GRANT、REVOKE など",
        },
        {
          heading: "SELECT の基本",
          body: "SELECT 列 FROM テーブル WHERE 条件 ORDER BY 並べる列;\nWHERE では =、<>、<、<=、AND、OR を使えます。LIKE '%ノート%' は「ノートを含む」(% は 0 文字以上の任意の文字列)、'ノート%' は「ノートで始まる」です。ORDER BY price DESC で降順になります。SELECT * は全列ですが、実務では必要な列を書くのが基本です。",
        },
      ],
      examples: [
        {
          title: "テーブルは Excel のシートに似ている",
          body: "列が見出し、行が 1 件のデータです。違いは、列ごとに型 (整数・文字列など) と制約が決まっていて、ルールに合わないデータは入れられないことです。この厳しさが、データの正しさを守ります。",
        },
      ],
      code: [
        {
          language: "sql",
          filename: "demo.sql",
          output:
            "CREATE TABLE\nINSERT 0 4\n--- 300 円以下の商品を安い順に\n    name    | price\n------------+-------\n ボールペン |   150\n 付箋       |   200\n ノート     |   300\n(3 rows)\n\n--- 名前に「ノート」を含み、在庫がある商品\n id |      name      | stock\n----+----------------+-------\n  1 | ノート         |   120\n  3 | ノートパソコン |     5\n(2 rows)",
          verifiedBy: "content/code/l4-sql-select/demo.sql",
        },
      ],
      exercises: [
        {
          title: "条件を変えて取り出す",
          task: "サンプルのテーブルから、在庫が 0 の商品の名前を表示する SQL と、価格の高い順に上位 2 件を表示する SQL を書いてください。",
          hint: "上位 N 件は ORDER BY ... DESC LIMIT N です。",
          answer: "SELECT name FROM products WHERE stock = 0;\nSELECT name, price FROM products ORDER BY price DESC LIMIT 2;",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "主キーについて正しいものはどれですか。",
            choices: ["行を一意に特定し、重複も NULL も許されない", "NULL を入れてもよい", "重複してもよい"],
            answerIndex: 0,
            explanation: "主キーは「どの行か」を必ず 1 件に決めるための列です。値が重複すると 2 つの行を区別できず、NULL だと行を指定できないため、どちらも禁止されています。更新・削除や、他のテーブルからの参照 (外部キー) も主キーで行います。",
          },
          {
            id: "q2",
            question: "名前が「ノート」で始まる商品を探す条件はどれですか。",
            choices: ["name LIKE '%ノート'", "name = 'ノート%'", "name LIKE 'ノート%'"],
            answerIndex: 2,
            explanation: "% は任意の文字列です。'ノート%' は「ノートの後に何か続く」= ノートで始まる、です。",
          },
          {
            id: "q3",
            question: "CREATE TABLE はどの分類の命令ですか。",
            choices: ["DML", "DDL", "DCL"],
            answerIndex: 1,
            explanation: "テーブルの構造を定義する命令は DDL です。",
          },
        ],
      },
      workplaceUse: "Web アプリの画面に表示される一覧や検索結果は、裏で SELECT 文が実行されています。開発者は不具合調査のために、本番に近いデータを SELECT で直接確認することもよくあります (更新系の SQL は慎重に扱います。次のレッスン以降で学びます)。",
      commonErrors: [
        {
          error: "ERROR:  relation \"product\" does not exist",
          cause: "テーブル名の打ち間違い (products と product)、または別のデータベース・スキーマに接続している",
          fix: "psql で \\dt を実行してテーブル一覧を確認します。",
        },
        {
          error: "ERROR:  column \"名前\" does not exist",
          cause: "文字列の値を ' ' ではなく \" \" で囲んだ (PostgreSQL では \" \" は列名を表す)",
          fix: "文字列は WHERE name = 'ノート' のように単一引用符で囲みます。",
        },
        {
          error: "ERROR:  duplicate key value violates unique constraint \"products_pkey\"",
          cause: "すでにある主キーの値で INSERT した",
          fix: "id を重複しない値にします。自動採番には GENERATED ALWAYS AS IDENTITY を使います。",
        },
      ],
      reviewPoints: ["主キーは一意・NOT NULL", "文字列は ' ' で囲む", "LIKE の % は任意の文字列", "SELECT * より必要な列を書く"],
    },
  },
  {
    slug: "l4-sql-join",
    title: "テーブルの結合と集計 (JOIN・GROUP BY)",
    estimatedMinutes: 90,
    ...source(176),
    content: {
      objectives: [
        "外部キーでテーブル同士の関係を表せる",
        "INNER JOIN と LEFT JOIN の違いを説明し、使い分けられる",
        "GROUP BY・COUNT・AVG・HAVING で集計できる",
      ],
      prerequisites: ["データベースと SELECT 文"],
      explanation: [
        {
          heading: "テーブルを分ける理由と外部キー",
          body: "商品テーブルにカテゴリ名を毎回書くと、カテゴリ名を変えるときに全行を直す必要があり、書き間違いも起きます。カテゴリを別テーブルに分け、商品には category_id だけを持たせる設計を正規化と呼びます。\nREFERENCES categories (id) は外部キー制約で、存在しないカテゴリの id を入れられないようにします。",
        },
        {
          heading: "JOIN",
          body: "FROM products p INNER JOIN categories c ON p.category_id = c.id は、2 つのテーブルの行を ON の条件 (ID が一致) でつなぎます。p・c はテーブルの別名です。\nINNER JOIN: 両方に対応がある行だけ (カテゴリのない「福袋」は出ない)\nLEFT JOIN: 左側のテーブルの行はすべて残し、対応がなければ右側の列を NULL にする (商品のない「書籍」も出る)\n結合の条件は名前ではなく ID (キー) で書きます。",
        },
        {
          heading: "集計",
          body: "GROUP BY でグループに分け、COUNT (件数)・SUM (合計)・AVG (平均)・MAX・MIN でグループごとに計算します。COUNT(*) は行数、COUNT(列) はその列が NULL でない行数です。\nWHERE は集計前の行を絞り込み、HAVING は集計後のグループを絞り込みます。AS で列に別名を付けられます。",
        },
        {
          heading: "集合演算",
          body: "2 つの SELECT の結果を組み合わせる命令もあります。UNION は和 (どちらかにある行)、INTERSECT は積 (両方にある行)、EXCEPT は差 (前にあって後ろにない行) です。",
        },
      ],
      examples: [
        {
          title: "INNER と LEFT の違い",
          body: "クラス名簿 (左) と提出物一覧 (右) をつなぐとき、INNER JOIN だと提出した人だけ、LEFT JOIN だと全員が並び、未提出の人の提出物欄は空 (NULL) になります。「未提出者を探す」には LEFT JOIN を使います。",
        },
      ],
      code: [
        {
          language: "sql",
          filename: "demo.sql",
          output:
            "CREATE TABLE\nCREATE TABLE\nINSERT 0 3\nINSERT 0 5\n--- INNER JOIN: カテゴリのある商品だけ\n      商品      | カテゴリ\n----------------+----------\n ノート         | 文房具\n ボールペン     | 文房具\n ノートパソコン | パソコン\n マウス         | パソコン\n(4 rows)\n\n--- LEFT JOIN: 商品のないカテゴリも残す。カテゴリごとの件数と平均価格\n カテゴリ | 件数 | 平均価格\n----------+------+----------\n 文房具   |    2 |      225\n パソコン |    2 |    50250\n 書籍     |    0 |\n(3 rows)\n\n--- HAVING: 平均価格が 1000 円以上のカテゴリ\n カテゴリ | 平均価格\n----------+----------\n パソコン |    50250\n(1 row)",
          verifiedBy: "content/code/l4-sql-join/demo.sql",
        },
      ],
      exercises: [
        {
          title: "カテゴリごとの最高価格",
          task: "カテゴリ名と、そのカテゴリで最も高い商品の価格を表示してください。商品のないカテゴリは表示しなくてかまいません。",
          hint: "categories と products を INNER JOIN でつなぎ、GROUP BY でカテゴリごとに分けてから MAX(p.price) を使います。",
          answer: "SELECT c.name, MAX(p.price)\nFROM categories c JOIN products p ON p.category_id = c.id\nGROUP BY c.id, c.name;",
        },
        {
          title: "カテゴリ未設定の商品",
          task: "カテゴリが設定されていない商品の名前を表示してください。",
          hint: "NULL の判定は = NULL ではなく IS NULL です。",
          answer: "SELECT name FROM products WHERE category_id IS NULL;",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "商品が 1 つもないカテゴリも一覧に含めたいときに使うのはどれですか。",
            choices: ["INNER JOIN", "categories を左にした LEFT JOIN", "WHERE で結合"],
            answerIndex: 1,
            explanation: "LEFT JOIN は左側 (categories) の行をすべて残し、対応する商品がなければ商品の列を NULL にします。INNER JOIN では、商品のないカテゴリは結果から消えてしまいます。",
          },
          {
            id: "q2",
            question: "集計後のグループを条件で絞り込むのはどれですか。",
            choices: ["HAVING", "WHERE", "ORDER BY"],
            answerIndex: 0,
            explanation: "WHERE は集計前の行、HAVING は集計後のグループに対する条件です。",
          },
          {
            id: "q3",
            question: "INTERSECT が返すのはどれですか。",
            choices: ["2 つの結果のどちらかにある行", "前の結果にあって後ろにない行", "2 つの結果の両方にある行"],
            answerIndex: 2,
            explanation: "INTERSECT は積 (共通部分)、EXCEPT は差です。",
          },
        ],
      },
      workplaceUse: "管理画面の「受講生ごとの提出件数」「月別の売上」といった集計は GROUP BY で作ります。結合の条件を誤ると件数が何倍にも膨らむ不具合 (行の重複) が起きるため、集計結果は件数の小さいデータで必ず検算します。",
      commonErrors: [
        {
          error: "ERROR:  column \"c.name\" must appear in the GROUP BY clause or be used in an aggregate function",
          cause: "GROUP BY に含めていない列を、集計関数を使わずに SELECT した",
          fix: "その列を GROUP BY に追加するか、MAX などの集計関数で囲みます。",
        },
        {
          error: "ERROR:  column reference \"name\" is ambiguous",
          cause: "結合した両方のテーブルに同じ列名があり、どちらか分からない",
          fix: "p.name のようにテーブルの別名を付けて書きます。",
        },
        {
          error: "結合したら件数が想定より多い",
          cause: "ON の条件が不足していて、1 行に複数行が対応している",
          fix: "ON の条件をキーで正しく書き、結合前後の件数を COUNT(*) で比べます。",
        },
      ],
      reviewPoints: ["テーブルは分けて外部キーでつなぐ", "INNER は両方にある行、LEFT は左を全部残す", "WHERE は集計前、HAVING は集計後", "INTERSECT は積、EXCEPT は差"],
    },
  },
  {
    slug: "l4-sql-modify",
    title: "データの更新・削除とトランザクション",
    estimatedMinutes: 75,
    ...source(174),
    content: {
      objectives: [
        "UPDATE・DELETE を、対象を確かめてから安全に実行できる",
        "BEGIN・COMMIT・ROLLBACK でトランザクションを使える",
        "論理削除と物理削除の違いと使い分けを説明できる",
      ],
      prerequisites: ["データベースと SELECT 文"],
      explanation: [
        {
          heading: "UPDATE と DELETE",
          body: "UPDATE テーブル SET 列 = 値 WHERE 条件; と DELETE FROM テーブル WHERE 条件; は、WHERE を書き忘れると全行が対象になります。実行する前に、同じ WHERE 条件で SELECT して対象の行と件数を確かめるのが安全な手順です。実行後に表示される UPDATE 1 の数字は、変更された行数です。",
        },
        {
          heading: "トランザクション",
          body: "トランザクションは「全部成功するか、全部なかったことにするか」の単位です。BEGIN で始め、問題なければ COMMIT で確定、誤りに気付いたら ROLLBACK で BEGIN の前の状態に戻せます。\n例えば「A さんの残高を減らす」と「B さんの残高を増やす」は、片方だけ実行されると困るので、1 つのトランザクションにまとめます (原子性)。",
        },
        {
          heading: "論理削除と物理削除",
          body: "物理削除 (DELETE) は行そのものを消します。論理削除は deleted_at や status などの列で「削除済み」の印を付け、行は残します。論理削除は誤操作からの復旧や履歴の確認がしやすい反面、すべての SELECT に「削除済みを除く」条件が必要です。学習記録や評価のように後から確認が必要なデータは論理削除、一時的なデータは物理削除、のように使い分けます。",
        },
      ],
      examples: [
        {
          title: "下書き保存と送信",
          body: "トランザクションはメールの下書きに似ています。BEGIN 後の変更は下書きで、COMMIT が送信、ROLLBACK が下書きの破棄です。送信 (COMMIT) した後は取り消せません。",
        },
      ],
      code: [
        {
          language: "sql",
          filename: "demo.sql",
          output:
            "CREATE TABLE\nINSERT 0 3\n--- UPDATE は必ず WHERE を付け、先に同じ条件で SELECT して対象を確かめる\n id | name | plan\n----+------+-------\n  2 | 佐藤 | basic\n(1 row)\n\nUPDATE 1\n--- トランザクション: 誤って全件を更新しても ROLLBACK で元に戻せる\nBEGIN\nUPDATE 3\n free_の件数\n-------------\n           3\n(1 row)\n\nROLLBACK\n id | name | plan\n----+------+-------\n  1 | 山田 | basic\n  2 | 佐藤 | pro\n  3 | 鈴木 | pro\n(3 rows)\n\n--- 論理削除と物理削除\nUPDATE 1\nDELETE 1\n id | name | plan\n----+------+------\n  2 | 佐藤 | pro\n(1 row)",
          verifiedBy: "content/code/l4-sql-modify/demo.sql",
        },
      ],
      exercises: [
        {
          title: "ROLLBACK を体験する",
          task: "BEGIN; の後に DELETE FROM members; を実行し、SELECT で 0 件になったことを確かめてから ROLLBACK; してください。もう一度 SELECT して元に戻ったことを確認します。",
          hint: "BEGIN; の後の変更は、COMMIT するまで確定しません。ROLLBACK; を実行すると BEGIN の前の状態に戻ります。",
          answer: "BEGIN;\nDELETE FROM members;\nSELECT * FROM members;\nROLLBACK;\nSELECT * FROM members;\nDELETE の後には削除した行数 (サンプルを最後まで実行した後なら DELETE 2) が表示され、1 回目の SELECT は (0 rows) になります。ROLLBACK 後の SELECT では、削除前の行がすべて表示されます。",
        },
        {
          title: "論理削除された会員を復元する",
          task: "サンプルで論理削除した山田さん (id = 1) を復元する UPDATE 文を書いてください。",
          hint: "サンプルの論理削除は、deleted_at に日時を入れて印を付けていました。印を消すには、その列を NULL に戻します。",
          answer: "UPDATE members SET deleted_at = NULL WHERE id = 1;",
        },
      ],
      quiz: {
        passScore: 67,
        questions: [
          {
            id: "q1",
            question: "UPDATE を安全に実行するための手順として正しいものはどれですか。",
            choices: ["WHERE を付けずに実行してから確認する", "同じ WHERE 条件で先に SELECT し、対象と件数を確かめる", "DELETE してから INSERT し直す"],
            answerIndex: 1,
            explanation: "実行前に対象を確認し、必要ならトランザクションの中で実行します。",
          },
          {
            id: "q2",
            question: "BEGIN の後の変更をなかったことにする命令はどれですか。",
            choices: ["COMMIT", "UNDO", "ROLLBACK"],
            answerIndex: 2,
            explanation: "ROLLBACK で BEGIN 前の状態に戻ります。COMMIT した後は戻せません。",
          },
          {
            id: "q3",
            question: "論理削除の注意点として正しいものはどれですか。",
            choices: ["検索のたびに削除済みを除く条件が必要", "データが完全に消える", "復元できない"],
            answerIndex: 0,
            explanation: "行は残るので、WHERE deleted_at IS NULL などの条件を忘れると削除済みのデータが表示されてしまいます。",
          },
        ],
      },
      workplaceUse: "本番データベースで UPDATE・DELETE を手で実行する作業は、事前に SQL をレビューしてもらい、トランザクションの中で件数を確認してから COMMIT する手順が一般的です。アプリの中でも、複数のテーブルを更新する処理はトランザクションでまとめます (Spring Boot では @Transactional)。",
      commonErrors: [
        {
          error: "UPDATE 3 (1 件だけ変えるつもりだった)",
          cause: "WHERE 条件を書き忘れた、または条件が広すぎる",
          fix: "COMMIT 前なら ROLLBACK します。自動コミットの環境では戻せないため、更新系は必ず BEGIN してから実行します。",
        },
        {
          error: "ERROR:  update or delete on table \"categories\" violates foreign key constraint",
          cause: "他のテーブルから外部キーで参照されている行を削除しようとした",
          fix: "先に参照している行を削除・変更するか、論理削除を検討します。",
        },
        {
          error: "ERROR:  current transaction is aborted, commands ignored until end of transaction block",
          cause: "トランザクションの途中でエラーが起き、以降の命令が受け付けられない状態",
          fix: "ROLLBACK してから、エラーの原因を直してやり直します。",
        },
      ],
      reviewPoints: ["更新・削除の前に同じ条件で SELECT", "更新系は BEGIN してから", "COMMIT で確定、ROLLBACK で取り消し", "履歴が必要なデータは論理削除"],
    },
  },
];

export const L3_L4_ASSIGNMENTS: AssignmentDef[] = [
  {
    slug: "a3-library-lending",
    level: "L3",
    afterLesson: "l3-datetime",
    title: "図書の貸出管理クラス",
    type: "CODE",
    passScore: 70,
    body: {
      purpose: "クラス設計・カプセル化・コレクション・例外・日付計算を組み合わせ、業務ルールを持つクラスを作る。",
      scenario: "社内の図書コーナーの貸出管理を、まずはコマンドラインで動く形で作る想定です。L7 の卒業制作 (図書管理システム) の土台になります。",
      requirements: [
        "Book (ID・タイトル・著者) と Member (ID・氏名) のクラスを作り、フィールドは private にする",
        "Library クラスに lend(memberId, bookId, LocalDate today) と giveBack(bookId, LocalDate today) を作る",
        "1 人 3 冊まで。貸出中の本は貸せない。返却期限は貸出日の 2 週間後 (例: 11/1 に貸出 → 期限は 11/15)",
        "返却期限の翌日以降を延滞とする (today.isAfter(返却期限) のとき)。期限の当日は延滞ではない",
        "延滞中の本を持っている会員には貸さない",
        "giveBack は延滞日数を返す (延滞していなければ 0。例: 期限 11/15 の本を 11/18 に返すと 3)",
        "ルール違反は IllegalStateException などの例外で、理由が分かるメッセージを付けて知らせる",
        "main で、正常な貸出・4 冊目の貸出・延滞中の貸出・返却の各場面を実行し、結果を表示する",
      ],
      recommended: ["今日の日付を引数で受け取り、実行日に依存しない作りにする", "Map<String, Book> などで ID から検索できるようにする"],
      steps: ["ルールを箇条書きにし、それぞれを確かめる main の場面を先に決める", "Book・Member を作る", "Library の lend を作り、ルールごとに確認する", "giveBack と延滞の判定を作る", "実行結果を備考欄に貼って提出する"],
      deliverables: ["すべての .java ファイルの全文 (1 つのテキストにまとめて貼る)", "main の実行結果と、各場面で確かめたルール (備考欄)"],
      readmeChecklist: [],
      resubmitCondition: "ルールのいずれかが守られない場合、またはフィールドが外部から直接変更できる場合は修正依頼になります。",
      interviewPoints: ["どのクラスにどの責任を持たせたか", "日付を引数で受け取った理由", "例外を使った理由と、catch する場所"],
    },
  },
  {
    slug: "a4-sql-inventory",
    level: "L4",
    afterLesson: "l4-sql-modify",
    title: "店舗在庫の SQL",
    type: "CODE",
    passScore: 70,
    body: {
      purpose: "テーブル設計 (主キー・外部キー) と、結合・集計・更新の SQL を、実際のデータで正しく書けることを確認する。",
      scenario: "複数店舗を持つ雑貨店から「店舗ごとの在庫状況を SQL で確認したい」と依頼された想定です。",
      requirements: [
        "stores (店舗)・products (商品・価格)・stocks (店舗ごとの在庫数) の 3 テーブルを、主キー・外部キー・NOT NULL を付けて作る。stocks の主キーは (store_id, product_id) の組み合わせにする",
        "店舗 3 件・商品 5 件・在庫 10 件以上のデータを INSERT する",
        "店舗名・商品名・在庫数の一覧を、店舗名 → 商品名の順に表示する (JOIN)",
        "店舗ごとの在庫の合計数と、在庫金額 (価格 × 在庫数) の合計を表示する (GROUP BY)",
        "stocks に 1 行も登録されていない商品 (どの店舗でも扱っていない商品) を表示する (LEFT JOIN と IS NULL)。在庫数 0 の行がある商品は対象外",
        "ある店舗のある商品の在庫を 5 減らす UPDATE を、BEGIN … COMMIT の中で、事前の SELECT 付きで書く",
      ],
      recommended: ["在庫数がマイナスにならない CHECK 制約", "各 SQL の前に -- で何をする SQL かをコメントする"],
      steps: ["テーブルの関係を図 (手書きでよい) にする", "CREATE TABLE と INSERT を書いて psql で実行する", "各 SELECT を書き、結果を手で検算する", "UPDATE をトランザクションの中で実行する", "SQL 全文と実行結果を提出する"],
      deliverables: ["SQL ファイルの全文", "psql での実行結果と、手で検算した結果 (備考欄)"],
      readmeChecklist: [],
      resubmitCondition: "外部キーがない、結合の結果が検算と合わない、WHERE のない UPDATE がある場合は修正依頼になります。",
      interviewPoints: ["テーブルを 3 つに分けた理由", "INNER JOIN と LEFT JOIN の使い分け", "UPDATE の前に何を確認したか"],
    },
  },
];
