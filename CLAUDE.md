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
| `data/skillchecks.js` | p00〜p12 のスキルチェック (品質強化は継続課題)。 |
| `data/sc-enhancements.js` | SC 詳細解説 (`window.SC_ENHANCEMENTS`)。 |
| `data/glossary.js` | 用語 50 / エラー 20。`window.GLOSSARY`。 |
| `data/p12-apps.js` | 卒制 8 テンプレ。`window.P12_APPS`。 |
| `data/hoku.js` | Hoku のロール定義・口調・サンプル会話。`window.HOKU_MENTOR`。 |
| `data/hoku-assets.js` | Hoku アバター base64 (約 165 KB)。`window.HOKU_IMGS` / `window.HOKU_IMG_MAIN`。 |
| `data/hoku-phase-support.js` | Phase 別 Hoku 支援。`window.HOKU_PHASE_SUPPORT`。 |
| `scripts/build_full.py` | 単一 HTML 化スクリプト。`dist/hoku-tech.html` を出力。 |
| `scripts/audit_data_consistency.py` | `data/*.js` の整合性検査 (Python 標準ライブラリのみ)。chapter↔lesson 参照 / nextLesson / 孤立 / Assignment 必須フィールドを検査し、失敗時 exit 1。 |
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

# データ整合性検査 (chapter↔lesson 参照 / nextLesson / 孤立 / Assignment 必須フィールド)
python3 scripts/audit_data_consistency.py

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
* カリキュラム監査 → `docs/curriculum_quality_audit.md`
* 改善計画 → `docs/curriculum_improvement_plan.md`
* タスクバックログ → `docs/task_backlog.md`

---

## 開発エージェントチーム (14 エージェント)

Claude Code は単一エージェントではなく、以下の **役割エージェント** を内的に切替えながら作業する。1 タスクごとに「どのエージェントの判断で動いているか」を明示すること。

### A. 戦略レイヤ

| # | エージェント | 役割 | 判断基準 | 主な成果物 |
|---|-------------|------|----------|-----------|
| 1 | **Product Owner Agent** | プロダクト価値・優先順位・法人訴求・受講者体験を統括 | (1) Hoku Tech の価値が上がるか (2) 未経験者が迷わないか (3) 法人に見せられるか (4) Hoku の価値が明確か (5) AI 丸投げになっていないか | 改善方針 / 優先順位 / ロードマップ / 受け入れ基準 |
| 2 | **Curriculum Architect Agent** | 13 Phase / 12 週カリキュラム全体設計 | 学習順序が自然か / 前提知識が満たされるか / Phase 間の接続があるか / 最終制作に収束するか | Phase 設計 / Lesson 設計 / 課題設計 / SC 設計 |
| 3 | **Beginner Learning Designer Agent** | 完全未経験者が読んで作業できる粒度へ翻訳 | 専門用語が説明されているか / 手順が具体的か / つまずきポイントが明示されているか | 初心者向け説明 / たとえ話 / よくある間違い / Hoku 質問例 |

### B. 技術レイヤ

| # | エージェント | 役割 | 重点領域 |
|---|-------------|------|----------|
| 4 | **Fullstack Engineer Agent** | フロント・バック・DB・API・GitHub・デプロイの実務整合性 | 現場で通用するか / 技術説明が正確か / 成果物がポートフォリオになるか |
| 5 | **React / Next.js Specialist** | React/Next.js 深掘り | コンポーネント / props / state / useState / useEffect / App Router / Server-Client Components / Vercel / 真っ白画面エラー |
| 6 | **Java / Spring Boot Specialist** | Spring Boot 深掘り | Controller / Service / Repository / Entity / DTO / JPA / Validation / Postman / 起動エラー / DB 接続エラー / CORS |
| 7 | **Python / Automation Specialist** | Python・業務自動化 | 文法 / CSV / Excel / API / JSON / 業務自動化 / エラー処理 |
| 8 | **AI Driven Development Specialist** | AI 駆動開発の設計 | Claude Code / プロンプト / AI 利用ログ / AI セルフレビュー / 丸投げ防止設計 |

### C. 体験 / 品質レイヤ

| # | エージェント | 役割 | 重点領域 |
|---|-------------|------|----------|
| 9 | **Hoku Mentor UX Agent** | Hoku を学習体験の中心に配置 | Phase 別 Hoku メッセージ / 相談導線 / スクショ相談 / テンプレート / 相棒口調 |
| 10 | **UI/UX Design Agent** | 視覚・余白・モバイル表示 | カード UI / 余白 / コードブロック / スマホ最適化 / 横スクロール防止 |
| 11 | **Instructor Operation Agent** | 講師運用 (課題評価・面談・卒業判定) | 講師レビュー観点 / 面談質問 / 合格・再提出基準 / AI 丸投げ判定基準 |
| 12 | **QA / Test Agent** | 表示崩れ・JS エラー・ビルド健全性 | Playwright シナリオ / スマホ確認 / Console Error / ビルドサイズ |
| 13 | **Documentation Agent** | README / docs / CLAUDE.md / WBS 更新 | 監査ログ / タスク一覧 / 作業ログ |
| 14 | **Release Manager Agent** | Git ブランチ / コミット / ビルド / リリース可否 | 作業前後の git 状態 / コミット候補 / リリース判定 / 残課題整理 |

各エージェントの詳細責務は `docs/curriculum_improvement_plan.md` の対応セクションに展開する。

---

## タスク分割ルール

* **1 タスク = 1 成果物または 1 改善領域**。`Phase 単位` / `data ファイル単位` / `UI 単位` のいずれかで切る。
* **大規模変更前は必ずコミット境界を作る**。安全にロールバックできるサイズに保つ。
* **実装前に作業計画を出す** (どのファイルのどこを何のために変えるか)。
* **実装後に検証結果を出す** (構文・ビルド・禁止フレーズ・目視)。
* **未完了は正直に残課題化する**。「だいたいできた」での `completed` は禁止。

### 悪い例 / 良い例

```
❌ 悪い例: 「全カリキュラムを改善する」
✅ 良い例: 「Phase 05 React の useState/useEffect Lesson (l05-2-1, l05-3-1) に、
   初心者向け説明・コード読解・よくあるエラー・Hoku 質問例を追加する」

❌ 悪い例: 「Skill Check を強化する」
✅ 良い例: 「Skill Check p05 にコード読解問題を 2 問追加し、
   commonMistakes / passLine / instructorCheckPoint を補強する」
```

---

## 教材品質基準 (世界最高峰の定義)

すべての **Phase / Lesson / Assignment / Skill Check** は、以下を満たすこと。1 つでも欠けたら「未完了」。

### Phase レベル必須項目

* このフェーズで何を学ぶか
* なぜ必要か (キャリア・現場の文脈)
* 現場でどう使うか
* 初心者がつまずくポイント (3 件以上)
* 重要用語と平易な説明
* 学習ステップ (具体的)
* 手を動かす演習
* よくあるエラー (3 件以上)
* Hoku に相談すべきタイミング
* Hoku への質問例 (3 件以上)
* 講師に聞くべきこと
* 課題提出前チェック
* 面談で説明すべきこと
* 次 Phase へ進む条件

### Lesson レベル必須項目

* 目的 (`goal`) / なぜ学ぶか (`why`)
* 初心者向け説明 / たとえ話 (`analogy`)
* 現場での使い方 (`fieldUse`)
* 重要用語 (`terms` — 各 term に平易な `meaning`)
* 図解 (該当する場合)
* コード例 (`code`) と読み方の解説
* 手順付きハンズオン (`steps[]` — 空配列禁止)
* 期待出力 (`expectedOutput`)
* よくあるエラー (`errors[]` — 最低 2 件)
* エラー時の確認順序
* Hoku 質問例 (`aiOk`)
* 自分の言葉で説明する練習
* 小テスト (`quiz` — 最低 1 件)
* 次にやること (`nextLesson`)

### Assignment レベル必須項目

* 課題の目的 / 想定シーン
* 作るもの (機能仕様)
* 必須要件 / 推奨要件
* 作業手順
* 提出物 (GitHub URL / README / スクリーンショット)
* README に書く内容のチェックリスト
* スクリーンショット要件
* Hoku 利用ログの記載要件
* 評価基準 (重み付き)
* 合格条件 / 再提出条件
* 講師レビュー観点 (`instructorCheckPoints`)
* 面談で答えるべきポイント

### Skill Check レベル必須項目

* 問題の狙い
* 模範解答 / 解説
* よくある間違い (`commonMistakes`)
* 合格ライン (`passLine`)
* 講師確認ポイント (`instructorCheckPoint`)
* コード読解問題 (各 Phase に最低 1 問)
* エラー原因特定問題 (各 Phase に最低 1 問)
* Hoku への質問作成問題 (AI 駆動 Phase で必須)
* 面談想定質問

---

## 作業完了報告フォーマット

作業終了時は必ず以下を報告すること。

```markdown
## 作業完了報告 — <作業名>

### 実施エージェント
<上記 14 エージェントから該当するものを列挙>

### 実施内容
- <変更点 1>
- <変更点 2>

### 変更ファイル
- `path/to/file.js`: <変更内容>

### 追加ファイル
- `path/to/new.md`: <内容>

### 改善した Phase / Lesson / Assignment / SC
- Phase 05 (React) — Lesson l05-2-1, l05-3-1
- Skill Check p09 — commonMistakes / passLine 追加

### Hoku 改善内容
- <該当する場合>

### 検証結果
- node --check: ✅ / ❌ <内訳>
- ビルド: ✅ <サイズ> / ❌
- 禁止フレーズスキャン: 0 件 / 残 N 件 (内訳)
- 目視: ホーム / Phase 一覧 / Phase 詳細 / Lesson 詳細 / Assignment / SC / Hoku / 講師 / 法人 全て表示確認
- スマホ確認: 375 / 390 / 768 / 1440 px 横スクロールなし
- Console Error: 0 件

### 残課題
- <正直に書く>

### 次にやるべきタスク
- <docs/task_backlog.md の該当 Task ID>
```
