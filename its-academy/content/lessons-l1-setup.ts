/**
 * L1 開発環境の構築と GitHub の準備。
 * 元教材 No.4〜8・16〜19 の問題 (「wsl –install」のエンダッシュ、macOS を Linux と記述、
 * IDE が VS Code と Eclipse で切り替わる、PAT の手順を外部記事に委任、git branch -b の誤り、
 * PostgreSQL の trust 設定) を解消して再構成した。
 */
import type { LessonDef } from "./curriculum";
import { source } from "./sources";

export const L1_SETUP: LessonDef = {
  slug: "l1-dev-environment",
  title: "開発環境を整える (Windows / Mac)",
  estimatedMinutes: 120,
  ...source(62),
  content: {
    objectives: [
      "Windows (WSL2 の Ubuntu) または Mac に、JDK 21・Maven・Git・PostgreSQL・VS Code を入れられる",
      "PostgreSQL にパスワード付きの自分用ユーザーとデータベースを作れる",
      "確認スクリプトで、このコースに必要な環境がそろったことを確かめられる",
    ],
    prerequisites: ["学習の進め方と質問の仕方"],
    explanation: [
      {
        heading: "このコースで使う環境",
        body: "Windows: WSL2 (Windows の中で Linux を動かす仕組み) の Ubuntu を使います。ターミナルの操作もプログラムの実行も Ubuntu の中で行います。\nMac: macOS は Linux ではありませんが、同じ UNIX 系のため、ほぼ同じコマンドが使えます。標準の「ターミナル」と Homebrew (ソフトを入れる道具) を使います。\nエディタは全レッスンを通して VS Code を使います (Eclipse は使いません)。",
      },
      {
        heading: "Windows: WSL2 と Ubuntu",
        body: "1. PowerShell を「管理者として実行」で開き、wsl --install を実行する (- は半角のハイフン 2 つ。全角や長いダッシュ – だと失敗します)\n2. 再起動後、Ubuntu が開いたらユーザー名とパスワードを決める。パスワードは入力しても画面に何も表示されませんが、入力されています\n3. sudo apt update && sudo apt upgrade -y で最新にする\n仮想化が無効でインストールに失敗する場合は、エラーメッセージを講師に送ってください (パソコンの設定 (BIOS) の変更が必要なことがあります)。",
      },
      {
        heading: "必要なソフトを入れる",
        body: "Ubuntu (WSL2):\nsudo apt install -y openjdk-21-jdk maven git postgresql\nsudo service postgresql start\nMac (Homebrew を入れた後):\nbrew install openjdk@21 maven git postgresql@16\nbrew services start postgresql@16\n(Mac の openjdk@21 は、インストール後に表示される「PATH を通す」案内に従ってください)\nJDK は「Java の開発キット」で、実行環境 (JRE) とコンパイラ (javac) を含みます。JRE だけでは Java のプログラムを作れません。",
      },
      {
        heading: "PostgreSQL の自分用ユーザー",
        body: "管理者ユーザー (postgres) で日常の開発をせず、自分用のユーザーとデータベースを作ります。\nsudo -u postgres createuser --pwprompt --createdb its (Mac は createuser --pwprompt --createdb its)\ncreatedb -h localhost -U its its_practice\nパスワードは必ず設定します。設定ファイルを trust (パスワードなしで接続できる設定) に変えて回避してはいけません。だれでもデータベースに入れる状態になります。",
      },
      {
        heading: "VS Code",
        body: "Windows では、VS Code を Windows 側にインストールし、拡張機能「WSL」を入れます。Ubuntu のターミナルで作業フォルダに移動して code . を実行すると、VS Code が Ubuntu の中のファイルを開きます (Windows 側の C ドライブにファイルを置くと、動作が遅くなったり改行コードの問題が起きたりします)。\n拡張機能「Extension Pack for Java」を入れると、Java の補完・実行・デバッグができます。",
      },
    ],
    examples: [
      {
        title: "環境はレストランの厨房",
        body: "JDK は調理器具、Maven は食材の仕入れ係、Git は作業記録のノート、PostgreSQL は冷蔵庫、VS Code は作業台です。すべてがそろって、はじめて料理 (開発) に集中できます。最初に確認スクリプトで道具がそろっているかを点検します。",
      },
    ],
    code: [
      {
        language: "bash",
        filename: "check-env.sh",
        output:
          "[OK] Java 21 以上 (java)\n[OK] javac (JDK)\n[OK] Maven (mvn)\n[OK] Git\n[OK] Git の名前とメールアドレス\n[OK] PostgreSQL クライアント (psql)\n[OK] PostgreSQL サーバー (localhost:5432)\n---\nすべての確認が完了しました",
        verifiedBy: "content/code/l1-dev-environment/check-env.sh",
        runner: "content/code/l1-dev-environment/run.sh",
      },
    ],
    exercises: [
      {
        title: "確認スクリプトを実行する",
        task: "check-env.sh を作業フォルダに保存し、bash check-env.sh を実行してください。[NG] の項目があれば、→ の後の案内に従って直し、すべて [OK] になるまで繰り返します。最後の画面のスクリーンショットを講師に送ります。",
      },
      {
        title: "Java を動かす",
        task: "VS Code で Hello.java を作り、「こんにちは、(自分の名前)」と表示するプログラムを書いて、ターミナルで java Hello.java を実行してください。",
        hint: "public class Hello { public static void main(String[] args) { System.out.println(\"...\"); } }",
      },
    ],
    quiz: {
      passScore: 100,
      questions: [
        {
          id: "q1",
          question: "WSL2 をインストールするコマンドとして正しいものはどれですか。",
          choices: ["wsl –install (長いダッシュ)", "wsl --install (半角ハイフン 2 つ)", "wsl -install"],
          answerIndex: 1,
          explanation: "オプションは半角ハイフン 2 つです。資料からコピーするときに、長いダッシュに変換されていないか注意します。",
        },
        {
          id: "q2",
          question: "PostgreSQL に接続できないとき、やってはいけない対処はどれですか。",
          choices: ["サーバーが起動しているか確認する", "設定を trust にしてパスワードなしで接続できるようにする", "ユーザー名とパスワードを確認する"],
          answerIndex: 1,
          explanation: "trust にすると、だれでもパスワードなしで接続できてしまいます。",
        },
        {
          id: "q3",
          question: "Windows で開発するファイルを置く場所として推奨されるのはどこですか。",
          choices: ["Ubuntu (WSL2) のホームディレクトリの下", "Windows のデスクトップ", "C:\\Program Files"],
          answerIndex: 0,
          explanation: "Ubuntu の中に置き、VS Code の WSL 拡張機能で開きます。",
        },
      ],
    },
    workplaceUse: "配属先でも、最初の仕事は開発環境の構築です。手順書どおりに進め、うまくいかないときにエラーメッセージを正確に伝えられることが大切です。チームでは、このコースの check-env.sh のような確認スクリプトを用意して、全員の環境をそろえることがよくあります。",
    commonErrors: [
      {
        error: "javac: command not found",
        cause: "JDK ではなく JRE だけが入っている、または PATH が通っていない",
        fix: "Ubuntu は openjdk-21-jdk (jre ではなく jdk) を入れます。Mac はインストール時に表示された PATH の設定を行い、ターミナルを開き直します。",
      },
      {
        error: "psql: error: connection to server at \"localhost\" (127.0.0.1), port 5432 failed: Connection refused",
        cause: "PostgreSQL のサーバーが起動していない",
        fix: "Ubuntu は sudo service postgresql start、Mac は brew services start postgresql@16 で起動します。",
      },
      {
        error: "psql: error: ... FATAL:  password authentication failed for user \"its\"",
        cause: "パスワードの入力ミス、またはユーザーを作っていない",
        fix: "createuser の手順をやり直します。設定を trust に変えて回避してはいけません。",
      },
    ],
    reviewPoints: ["Windows は WSL2 の Ubuntu、Mac はターミナル + Homebrew", "JDK 21 (javac があること)", "PostgreSQL は自分用のユーザーにパスワードを付ける", "エディタは VS Code に統一", "check-env.sh がすべて [OK]"],
  },
};

export const L1_GITHUB: LessonDef = {
  slug: "l1-github-setup",
  title: "GitHub の準備 (アカウント・SSH 鍵・clone と push)",
  estimatedMinutes: 60,
  ...source(79),
  content: {
    objectives: [
      "GitHub のアカウントを作り、二要素認証を設定できる",
      "SSH 鍵を作り、公開鍵だけを GitHub に登録できる",
      "リポジトリを clone し、ブランチを作って push できる",
    ],
    prerequisites: ["開発環境を整える (Windows / Mac)", "Git の基本 (commit とブランチ)"],
    explanation: [
      {
        heading: "GitHub のアカウント",
        body: "https://github.com でアカウントを作ります。ユーザー名は課題の提出や就職活動でも使うので、本名に近い・仕事で使える名前にします。二要素認証 (パスワードに加えてスマホのアプリなどで確認する仕組み) を必ず設定します。",
      },
      {
        heading: "SSH 鍵: 公開鍵と秘密鍵",
        body: "git push のたびにパスワードを入力しないよう、SSH 鍵で認証します。ssh-keygen -t ed25519 -C \"メールアドレス\" を実行すると、2 つのファイルができます。\nid_ed25519.pub (公開鍵): GitHub の Settings → SSH and GPG keys に登録する方。人に見せても問題ありません\nid_ed25519 (秘密鍵): 自分のパソコンだけに置く方。だれにも渡さず、チャットや AI に貼ってはいけません。権限が 600 (自分だけが読める) になっていることを確認します\n実際に作るときはパスフレーズ (鍵のパスワード) を設定します。",
      },
      {
        heading: "clone・ブランチ・push",
        body: "git clone git@github.com:ユーザー名/リポジトリ名.git でリポジトリを手元にコピーします。作業は git switch -c feature/作業名 で作ったブランチで行い、git push -u origin feature/作業名 で GitHub に送ります。2 回目からは git push だけで送れます。\n(ブランチの作成は git switch -c または git checkout -b です。git branch -b というオプションはありません。)",
      },
    ],
    examples: [
      {
        title: "公開鍵と秘密鍵",
        body: "公開鍵は「南京錠」、秘密鍵は「その鍵」です。南京錠 (公開鍵) は GitHub に預けても問題ありませんが、鍵 (秘密鍵) を持っている人だけが開けられます。鍵を人に渡したら、だれでも開けられてしまいます。",
      },
    ],
    code: [
      {
        language: "bash",
        filename: "demo.sh",
        output: "作成されたファイル:\nid_ed25519\nid_ed25519.pub\n公開鍵 (GitHub に登録する方) の種類とコメント:\nssh-ed25519 hanako@example.com\n秘密鍵 (自分だけが持つ方) の権限: 600",
        verifiedBy: "content/code/l1-github-setup/demo.sh",
      },
    ],
    exercises: [
      {
        title: "SSH 鍵を登録して接続を確かめる",
        task: "ssh-keygen -t ed25519 -C \"自分のメールアドレス\" で鍵を作り (パスフレーズを設定)、cat ~/.ssh/id_ed25519.pub の内容を GitHub に登録してください。ssh -T git@github.com を実行し、「Hi ユーザー名! You've successfully authenticated」と表示されることを確かめます。",
      },
      {
        title: "初めての push",
        task: "GitHub で practice というリポジトリを「Add a README file」にチェックを入れて作り (main ブランチが作られます)、git clone します。feature/readme ブランチを作って README.md に 1 行追記し、commit して git push -u origin feature/readme で送ってください。GitHub の画面に feature/readme ブランチが表示され、main はそのまま残っていることを確かめます。",
        hint: "空のリポジトリに最初に feature/readme を push すると、そのブランチが既定のブランチ (main の代わり) になってしまいます。README 付きで作れば main が先にできます。",
      },
    ],
    quiz: {
      passScore: 100,
      questions: [
        {
          id: "q1",
          question: "GitHub に登録するのはどちらのファイルですか。",
          choices: ["id_ed25519 (秘密鍵)", "id_ed25519.pub (公開鍵)", "両方"],
          answerIndex: 1,
          explanation: "登録するのは公開鍵だけです。秘密鍵はだれにも渡しません。",
        },
        {
          id: "q2",
          question: "新しいブランチを作って切り替えるコマンドはどれですか。",
          choices: ["git branch -b feature/x", "git switch -c feature/x", "git push -b feature/x"],
          answerIndex: 1,
          explanation: "git switch -c (または git checkout -b) です。",
        },
      ],
    },
    workplaceUse: "会社のリポジトリに参加するときも、SSH 鍵の登録と二要素認証の設定が最初の手続きです。秘密鍵やアクセストークンの流出は、会社のソースコードの流出につながるため、厳しく管理されます。",
    commonErrors: [
      {
        error: "git@github.com: Permission denied (publickey).",
        cause: "公開鍵を GitHub に登録していない、または別の鍵を使っている",
        fix: "cat ~/.ssh/id_ed25519.pub の内容が GitHub に登録されているか確認し、ssh -T git@github.com で接続を確かめます。",
      },
      {
        error: "fatal: The current branch feature/readme has no upstream branch.",
        cause: "新しいブランチを初めて push するときに、送り先を指定していない",
        fix: "git push -u origin feature/readme を実行します。",
      },
      {
        error: "秘密鍵やトークンをチャット・AI・リポジトリに貼ってしまった",
        cause: "公開鍵と秘密鍵の区別があいまいだった",
        fix: "すぐに講師に報告し、GitHub から該当の鍵を削除して作り直します。",
      },
    ],
    reviewPoints: ["二要素認証を設定する", "登録するのは公開鍵 (.pub) だけ", "秘密鍵は渡さない・貼らない", "push は git push -u origin ブランチ名"],
  },
};
