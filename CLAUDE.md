# CLAUDE.md — Hoku Tech 開発ルール (Claude Code 用)

このファイルは Claude Code が Hoku Tech のリポジトリで作業するときに
**最初に読むべきプロジェクト規約** です。エージェント / サブエージェント
含め、コード変更を伴う作業の前に必ず順守してください。

詳細根拠は [docs/20_claude_code_rules.md](docs/20_claude_code_rules.md) と
[docs/19_github_operation.md](docs/19_github_operation.md) にあります。

---

## プロジェクト要旨

* **名称**: Hoku Tech (旧称 Fullstack Career Camp / FCC は廃止)
* **概要**: 未経験者を 12 週で React/Next.js・Java/Spring Boot・Python・
  GitHub・AI 駆動開発まで導く実践型 LMS。**13 Phase / 約 204 Lesson** /
  Hoku AI メンター常駐 / 課題提出 / スキルチェック / 面談対策。
* **形態**: 単一 HTML + Vanilla JS + CSS + `data/*.js`。
  ブラウザ直起動。`scripts/build_full.py` で単一HTML化 (`dist/hoku-tech.html`)。

---

## 技術制約 (破ったら差し戻し)

1. **外部ライブラリ / フレームワーク追加禁止** (React, Vue, jQuery, lodash,
   Tailwind CDN など含む)。Vanilla のみ。
2. **CDN 参照禁止**。フォント・スクリプト・スタイルすべてリポジトリ内。
3. **単一 HTML + `assets/` + `data/`** の構成を保つ。`index.html` を分割し
   ないこと。
4. **既存 LocalStorage キーを破壊しない**。`fcc:v2:*` → `hoku:v2:*` のような
   リネームは、**旧キーからの読み出しフォールバック** を付けたうえで段階移行。
5. **API キー / 秘密情報のハードコード禁止**。
6. **Hoku のマルチモーダル / 実 AI API 接続は未実装**。`HOKU_PROVIDER` は
   Mock のまま。実装済みのように見せない。
7. **新機能は IIFE で追記パッチ方式**。既存関数の挙動を黙って変えない。

---

## ファイル / 役割マップ

| パス | 役割 |
|------|------|
| `index.html` | マスター HTML。全 `<script src>` はここで一括宣言。 |
| `assets/css/style.css` | 全スタイル。CSS カスタムプロパティで色系を定義。 |
| `assets/js/main.js` | 全 UI レンダリング・ナビ・Hoku 常駐 UI・課題/SC 描画。 |
| `data/phases.js` | 13 Phase の基本情報。`window.PHASES`。 |
| `data/phases-extra.js` | Phase 詳細 (用語・図解・hokuUseCases 等)。`window.PHASES_EXTRA`。 |
| `data/chapters.js` | 54 Chapter。`window.CHAPTERS`。 |
| `data/phase-illustrations.js` | Phase 別 SVG 図解。`window.PHASE_ILLUSTRATIONS`。 |
| `data/diagrams.js` | 共通図解 (hokuFlow, aiDevFlow 等)。`window.DIAGRAMS`。 |
| `data/lesson-p00.js` … `lesson-p12.js` | レッスン本体 (各 `window.LESSON_PXX`)。 |
| `data/lesson-p02-append.js` / `lesson-p03-append.js` | レッスン追記。スコープは元ファイルと同じ。 |
| `data/assignments.js` | 13 課題。`window.ASSIGNMENTS`。 |
| `data/skillchecks.js` | p00〜p09 のスキルチェック。**p10/p11/p12 は欠落** (要追記)。 |
| `data/sc-enhancements.js` | SC 詳細解説 (`window.SC_ENHANCEMENTS`)。 |
| `data/glossary.js` | 用語 50 / エラー 20。`window.GLOSSARY`。 |
| `data/p12-apps.js` | 卒制 8 テンプレ。`window.P12_APPS`。 |
| `data/hoku.js` | Hoku のロール定義・口調・サンプル会話。`window.HOKU_MENTOR`。 |
| `data/hoku-assets.js` | Hoku アバター base64 (約 165 KB)。`window.HOKU_IMGS` / `window.HOKU_IMG_MAIN`。 |
| `data/hoku-phase-support.js` | Phase 別 Hoku 支援。`window.HOKU_PHASE_SUPPORT`。 |
| `scripts/build_full.py` | 単一 HTML 化スクリプト。`dist/hoku-tech.html` を出力。 |
| `dist/` | ビルド成果物。Git 追跡しない (`.gitignore` 設定)。 |
| `docs/00…20_*.md` | 全設計ドキュメント。 |

---

## ナビ ID と View 対応

`index.html` の `.nav-item[data-view=...]` と `section#sec-<view>` は
1 対 1。**新規 View を追加する場合は両方を必ず作る**:

```
home / phases / phase-detail / chapter-detail / lesson-detail /
glossary / error-list / ai-rules / claude-code / portfolio /
assignments / skillchecks / hoku / instructor / templates /
business / p12-apps / pricing
```

---

## Hoku 設計の鉄則

* **Hoku は相棒。答えを丸ごと出す係ではない**。`data/hoku.js` の口調・
  使い方ガイドを基準に表現を統一。
* **画像添付 UI は実装済み**。受け取る payload 仕様:
  `{ message, images[], currentContext, category, errorText, consoleLog,
  terminalLog, relatedCode, timestamp }`。
  `assets/js/main.js` の `HOKU_PROVIDER.send(payload, callback)` が窓口。
* **Mock 応答 → 実 API 接続** に切り替える際は、`HOKU_PROVIDER` の
  プロバイダアダプタだけ差し替える。UI / 呼び出し側は触らない。
* **API キーや個人情報を Hoku パネルに直接貼らない** よう注意文を残す。
* **マイク (`#hokuMicBtn`) はビジュアルのみ**。クリックハンドラ未接続。
  実装するまでは `aria-disabled` などで挙動を抑える。

---

## 作業前チェックリスト

1. `git status` がクリーンか。
2. これから触る関数の影響範囲を `grep` で把握。
3. 既存の LocalStorage キーを変えるなら、読み出し時の旧キー
   フォールバックを必ず先に書く。
4. `data/*.js` のスキーマを変えるなら、それを参照する `main.js` の
   箇所を全部 grep して同時に直す。

---

## 作業後チェックリスト (必須)

```bash
# 構文チェック
node --check assets/js/main.js
for f in data/*.js; do node --check "$f"; done

# 単一 HTML ビルド
python3 scripts/build_full.py

# 禁止フレーズスキャン (期待: 0 件)
LC_ALL=C grep -nE \
  '準備中|近日公開|coming soon|TODO|仮置き|ダミー|placeholder|lorem|未完成|作成予定|爆速|最強|完全攻略|誰でも簡単|Fullstack Career Camp|AI Fullstack Career Camp|AI Driven Career Camp' \
  -r assets data index.html README.md docs 2>/dev/null \
  || echo 'no banned phrases'
```

* JS 構文エラーは即修正。`node --check` で 1 件でも落ちたら commit しない。
* `dist/hoku-tech.html` のサイズが異常に変わっていないか確認。
* ブラウザ手元確認: `index.html` を直接開いて
  ホーム / Phase 一覧 / Phase 詳細 / Lesson 詳細 / Assignment / SC /
  用語集 / Hoku ページ / 講師向け / 法人向け をクリック巡回。
  Hoku 常駐バブル (右下) が常時表示・パネル開閉できることを確認。
* 横スクロール: 375 / 390 / 768 / 1440 px で `<body>` から横スクロール
  が発生しないこと。

---

## Playwright テスト (CI / 人手)

リポジトリには Playwright を同梱しません (外部ライブラリ禁止)。
受け入れテストは `docs/11_test_specification.md` のシナリオに沿って、
別環境 (CI / ローカル) で実行してください。期待値はそちらが正。

---

## Git 運用

* デフォルトブランチ: `main` (将来)。現状は `claude/analyze-hoku-tech-nikQM`
  などのフィーチャーブランチで作業。
* コミットは **意味のある単位** で。1 機能 = 1 コミット。
* コミットメッセージは
  `type(scope): summary` 形式 (`fix`, `feat`, `refactor`, `docs`, `chore`, `style`)。
  本文に **なぜ変えたか** を 1〜3 行で書く。
* `--no-verify` / `--force` / `--amend (公開済み)` は使わない。
* push 先は明示 (`git push -u origin <branch>`)。

詳細: [docs/19_github_operation.md](docs/19_github_operation.md)

---

## 絶対禁止事項

* 既存関数を黙ってリネーム / シグネチャ変更
* `data/*.js` のキー名・トップレベル global 変数名の破壊的変更
* `dist/` をリポジトリに含める
* ブランドの再変更 (Hoku Tech が現行名)
* Hoku の回答に「合否判定」「卒業判定」を行わせる文言追加
* 旧名 `Fullstack Career Camp` / `AI Fullstack Career Camp` /
  `AI Driven Career Camp` / `FCC` を新規に書き込むこと
* AI が生成したコードを「自分で書いた」体で提示するサンプル文の追加

---

## 質問前に見る場所

* 設計判断 → `docs/04_basic_design.md` / `05_detailed_design.md`
* Hoku の仕様 → `docs/10_hoku_design.md`
* テスト基準 → `docs/11_test_specification.md`
* GitHub 運用 → `docs/19_github_operation.md`
* Claude Code 細則 → `docs/20_claude_code_rules.md`
