# CLAUDE.md — its-academy (ITS ENGINEER ACADEMY)

このディレクトリは Hoku Tech とは別の製品。リポジトリ直下の CLAUDE.md の
「外部ライブラリ禁止・単一 HTML」の制約は Hoku Tech 本体 (index.html / assets / data) に対するもので、
ここには適用しない。ここでのルール:

1. 認可は必ずサーバー側で行う。ページ・サーバーアクション・Route Handler の先頭で `requireUser(roles)`。
   受講生のデータは `assertCanViewStudent` を通してから取得する。UI の表示制御だけに頼らない。
2. 進捗指標 A〜E を混ぜない。ページを開いただけでレッスンを完了にしない (理解度チェック合格が条件)。
3. 採点 (`reviews`)・監査ログ・スキル評価は追記のみ。過去の評価を書き換えない。
4. 教材のサンプルコードは `content/code/` に実ファイルを置き、`npm run verify:code` で実行結果と一致させる。
5. 秘密情報 (`.env`、パスワード、トークン) をコミット・ログ出力しない。個人情報を `use cache` しない。
6. 変更後は `npm run typecheck && npm run lint && npm test && npm run verify:code && npm run build` と E2E を実行し、
   `../docs/development-progress.md` を実際の結果で更新する。
7. Next.js 16 はトレーニングデータと API が異なる。コードを書く前に `node_modules/next/dist/docs/` を読む (AGENTS.md)。

@AGENTS.md
