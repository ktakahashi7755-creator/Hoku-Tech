# バックアップと、いつでも呼び出すための手順

PROVIDE ENGINEER ACADEMY の成果物 (アプリ・教材・設計文書・テスト) を、いつでも同じ状態で取り出し・動かせるようにするための手順。
受講生のデータ (本番の DB) のバックアップは [deployment-guide.md](deployment-guide.md) §6 を参照。

## 1. 何が、どこに残っているか

| 種類 | 場所 | 中身 |
|------|------|------|
| 確定版の目印 (タグ) | 持ち出し用のファイルの中の `its-academy-final-2026-11-08`。GitHub には依頼者が画面から追加する (§2) | この時点のすべてのファイルと履歴。いつでもこの状態に戻せる |
| 開発中のブランチ | GitHub の `claude/sharp-bohr-4wbemd` | 最新の作業。タグの後の変更もここに積まれる |
| 持ち出し用の 1 ファイル (git bundle) | 依頼者の手元 (チャットで受け取ったファイル) | リポジトリの全履歴を 1 ファイルにしたもの。GitHub に入れない場合でも復元できる |
| チェックサム | bundle と同じ場所の `.sha256` | ファイルが壊れていないかの確認用 |
| カリキュラムの PDF | 依頼者の手元 | 教材の一覧 (閲覧用) |

* 本番の DB はまだない (ホスティング契約の承認待ち D-03)。開発用の DB の中身は `npm run db:seed` でいつでも作り直せる見本データだけなので、バックアップの対象にしない。
* `.env` (パスワード・接続文字列) はどこにも保存しない。復元するときは `.env.example` から作り直す。

## 2. 確定版を呼び出す (GitHub から)

開発の環境からは GitHub へタグを送れなかったため、GitHub のタグは依頼者が画面から作る (1 回だけ・約 1 分):

1. リポジトリの「Releases」→「Draft a new release」(または「Create a new release」)
2. 「Choose a tag」に `its-academy-final-2026-11-08` と入力し「Create new tag」
3. 「Target」でブランチ `claude/sharp-bohr-4wbemd` を選ぶ (確定版のコミットは、持ち出し用のファイルの中のタグと同じもの。作業完了報告に記載)
4. タイトルに「PROVIDE ENGINEER ACADEMY 確定版 2026-11-07」と入れて「Publish release」。必要なら bundle と .sha256 のファイルも添付できる

タグを作った後は、次のように呼び出せる:

```bash
git clone https://github.com/ktakahashi7755-creator/Hoku-Tech.git
cd Hoku-Tech
git checkout its-academy-final-2026-11-08     # 確定版の状態にする (読むだけなら、このまま)
git switch -c restore-from-final              # この状態から作業を続ける場合は、新しいブランチを作る
```

GitHub の画面からは「Code」→ ブランチの選択 →「Tags」→ `its-academy-final-2026-11-08` で、ファイルを見る・ZIP で取り出すことができる。

## 3. 持ち出し用のファイル (git bundle) から呼び出す

GitHub に入れない場合や、別の場所に移す場合に使う。

```bash
# 1. ファイルが壊れていないか確認 (OK と出ればよい)
sha256sum -c its-academy-final-2026-11-08.bundle.sha256      # Mac は: shasum -a 256 -c ...

# 2. 取り出して、中身を確かめる (git bundle verify はリポジトリの中で実行する)
git clone its-academy-final-2026-11-08.bundle Hoku-Tech
cd Hoku-Tech
git bundle verify ../its-academy-final-2026-11-08.bundle
git checkout its-academy-final-2026-11-08

# 3. (任意) 新しい GitHub リポジトリに載せ直す
git remote set-url origin https://github.com/<組織>/<新しいリポジトリ>.git
git remote set-head origin -d                                          # 下の push で「HEAD」という名前のブランチを作らないように
git push origin 'refs/remotes/origin/*:refs/heads/*' && git push origin --tags   # すべてのブランチとタグ (--all では取り出したブランチしか送られない)
```

PROVIDE ENGINEER ACADEMY だけを独立したリポジトリにする場合は、取り出した後に
`git subtree split --prefix=its-academy -b its-academy-only` で its-academy の履歴だけのブランチを作れる (D-01)。

## 4. 取り出した後に動かす

[its-academy/README.md](../its-academy/README.md) の「すぐに動かす」のとおり (Node.js 22 と PostgreSQL 16 が必要)。要点:

```bash
cd its-academy
cp .env.example .env          # DATABASE_URL を設定し、ローカルでは APP_ENV=local・COOKIE_SECURE=false にする (本番の値は入れない)
npm ci && npx prisma generate
npm run db:migrate && npm run db:seed
npm run dev                   # http://localhost:3000
```

確認: `npm run typecheck && npm run lint && npm test && npm run verify:code && npm run build`、続けて E2E
(`npm run test:e2e -- --trace off`)。確定版の時点の結果は [development-progress.md](development-progress.md) と [test-plan.md](test-plan.md) にある。

## 5. 新しい確定版を作るとき (作業が進んだ後)

```bash
git tag -a its-academy-final-YYYY-MM-DD -m "確定版: <内容>"
git push origin its-academy-final-YYYY-MM-DD
git bundle create its-academy-final-YYYY-MM-DD.bundle --all
sha256sum its-academy-final-YYYY-MM-DD.bundle > its-academy-final-YYYY-MM-DD.bundle.sha256
git bundle verify its-academy-final-YYYY-MM-DD.bundle   # 作ったリポジトリの中で実行する
```

タグは消さない・付け替えない (過去の確定版を後から呼び出せるようにするため)。
