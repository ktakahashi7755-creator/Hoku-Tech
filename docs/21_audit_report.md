# 21. 監査結果と変更サマリ (2026-05-13)

このドキュメントは、Hoku Tech v2 ソース一式 (`fccsourcev2.zip`) と
ビルド済み `ee55382f-hokutech.html` を起点に、開発エージェント体制で
実施した監査・修正の結果を記録するものです。今回の変更は次のブランチで
管理されています。

```
ブランチ: claude/analyze-hoku-tech-nikQM
ベース  : v2/ (fccsourcev2.zip 直のコピー、コミット 7053d53)
```

---

## 1. 監査体制

4 体の監査エージェントを並列起動し、それぞれ独立に file:line 引用で
レポートを返してもらいました。

| # | エージェント | 担当 | 主な検査対象 |
|---|--------------|------|--------------|
| 1 | Curriculum 監査 | 教材本体 | `data/phases.js` / `phases-extra.js` / `chapters.js` / `lesson-p00..p12.js` / `assignments.js` / `skillchecks.js` / `glossary.js` / `p12-apps.js` |
| 2 | Hoku レイヤ監査 | Hoku UI 実装 | `index.html` / `assets/js/main.js` / `data/hoku.js` / `data/hoku-assets.js` / `data/hoku-phase-support.js` |
| 3 | Design / UX 監査 | デザインシステム | `assets/css/style.css` / インラインスタイル / @media / 絵文字密度 / コントラスト / ヒット領域 |
| 4 | Docs + Dev 監査 | 設計書類 | `docs/00..20_*.md` / `README.md` / `scripts/` / `tests/` の有無 |

各エージェントの完全レポートはセッショントランスクリプトに保管されています。
以下は、そこから検出した重大な事実だけを抜粋し、現リポジトリへの修正状況と
紐付けたものです。

---

## 2. 実数の確定 (主張 vs 実測)

| 項目 | 旧 README / docs の主張 | 実測 (grep / awk) | 採用値 |
|------|--------------------------|--------------------|--------|
| Phase 数 | 13 | 13 (`phases.js`) | **13** |
| Chapter 数 | 50+ | **54** (`chapters.js`) | 54 |
| Lesson 数 | 174 (一部 docs) / 204 (index.html ヒーロー) | 203 (`grep ^'l[0-9]+-[0-9]+-[0-9]+':' data/lesson-p*.js`) + append 内 inline | **約 204** |
| Assignment 数 | 全 Phase 分 | **13** (`assignments.js`) | 13 |
| SkillCheck 対象 | (誤情報あり: p10-12 が無いとされていた) | **p00〜p12 すべて存在** (`skillchecks.js` 行 6–187) | p00〜p12 |
| 用語集 | 「約 70 語」 | **50 語** (`glossary.js` g001〜g030 とその他) | 50 語 |
| エラー集 | 20 件以上 | 20 件 | 20 件 |
| 卒業制作テーマ | 9 | 8 (`p12-apps.js`) + ポートフォリオ案内に 9 件目 | 8 (p12-apps) |

---

## 3. 致命度別の発見と対応

### 3.1 致命 — Hoku が runtime で完全に死んでいた

**事象**: `index.html` の `<script>` 行に
`data/hoku.js` / `data/hoku-assets.js` / `data/hoku-phase-support.js` /
`data/sc-enhancements.js` / `data/phase-illustrations.js` の 5 ファイルが
含まれていませんでした。`main.js` はこれらの提供する `window.HOKU_MENTOR` /
`HOKU_IMGS` / `HOKU_PHASE_SUPPORT` / `SC_ENHANCEMENTS` / `PHASE_ILLUSTRATIONS`
を参照しているため、Hoku の常駐バブルは登場するもののアバターも台詞も Phase 別
プロンプトも空で、SC 詳細と Phase 図解も DOM に到達しない状態でした。

**対応** (コミット `1e63998`): `index.html` に 5 つの `<script>` 行を追加。

### 3.2 高 — ビルドスクリプトがリポジトリ外にあった

**事象**: README は `python3 /tmp/build_full.py` を指定していたが、
そのスクリプトは `v2/` バンドルに含まれず、再現性のあるビルドができませんでした。

**対応** (コミット `cb4212e`):
- `scripts/build_full.py` を追加 (Python 標準ライブラリのみ、外部依存なし)。
- `dist/` を `.gitignore` で除外、ビルド成果物が履歴に入らないようにした。
- 出力先は `dist/hoku-tech.html`。検証ビルドで 1,448 KB、CSS 1 / JS 29 を
  インライン化した。

### 3.3 高 — ブランド残骸 (`fcc:v2:*` / `[FCC]` ラベル)

**事象**: `main.js` の LocalStorage キーが旧ブランド `fcc:v2:*` のままで、
console.warn ラベル `[FCC timeout]` / `[FCC MO]` / `[FCC]` / `[FCC-prog]` も残置。
ブランドは Hoku Tech に変わっているのに、計測 / 監視側の文字列が一致しない状態。

**対応** (コミット `9a3b18e`):
- LocalStorage キーを `hoku:v2:*` に正規化。**旧キーは読み出し時のフォール
  バックを実装** したので既存ユーザーの進捗は失われません。
- 書き込み時は新旧両方に書く (1 リリース分のミラー期間)。
- console.warn ラベルを `[Hoku ...]` に統一。

### 3.4 中 — ドキュメントが実装と齟齬

**事象**:
- 5 docs が「全 174 Lesson」を主張、UI は「204」を表示。
- 6 docs がテスト基準として `[FCC]` ラベルをそのまま参照。
- WBS 5.1.2 / 5.1.3 が「進行中」のまま、実際は 20 件納品済。
- WBS 1.2.1 の検証セルが `grep HOKU=0件` という誤り (旧ブランドを残さない検査の
  趣旨と矛盾)。
- `03_requirements_definition.md` の用語集が `Mock Responder = ダミー応答` と、
  禁止フレーズ「ダミー」を使ったうえに、実装上は context-aware な mock なので
  説明としても不正確。

**対応** (コミット `5571716`): 上記すべて整合させ、`README` には新しい状態列
(UI のみ / 開発中 / 将来拡張) を明示。

### 3.5 中 — デザインのほつれ

**事象**:
- `index.html` に **17 個のインライン白カード div** がほぼ同じスタイル文字列で
  並列していて (`background:#fff; border:1px solid var(--line); ...`)、
  共通クラス化されていなかった。
- 4 つの `<table class="data-table">` がスクロールガード無しで配置されていて、
  狭幅 (≤375px) で body 横スクロールを引き起こすリスクがあった。
- 講師/Hoku の役割分担表 (`index.html:381`) は本来比較表のはずが全セルが空文字で、
  情報を伝えていなかった。
- コピーボタンが `📋 コピー` で、しかも先頭に半角スペースが入っており、絵文字が
  レンダリングに失敗すると " コピー" と読めて品位を損なっていた。
- `Git / GitHub` バッジが `color:#475569` on `background:#f1f5f9` で WCAG AA
  境界以下。
- Hoku マイクボタン (`#hokuMicBtn`) はクリックハンドラが無いが、UI 上は操作可能に
  見えていた。
- フォーカスリングが未定義で、キーボード操作が見えない。

**対応** (コミット `da3069d`):
- `style.css` の末尾に Polish layer を追記 (`.card` / `.card-accent` /
  `.table-wrap` / hit-target / `:focus-visible` / `.tech-tag-neutral` /
  `.hoku-mic-btn[aria-disabled="true"]`)。
- `index.html` の 17 インラインカードを `.card` に置換、4 テーブルを
  `.table-wrap` でラップ、講師/Hoku 比較表に ○/—/補助/参考 を埋め込み、
  コピーボタンを `<button class="copy-btn" type="button" aria-label="…">コピー</button>`
  に整形、`Git / GitHub` バッジを `.tech-tag-neutral` に。
- `main.js` のマイクボタンに `aria-disabled="true" tabindex="-1"
  title="音声入力 (開発中)"` を付与し、誤操作とミスリードを止めた。

### 3.6 低 (記録のみ)

- `--brand` (青系: `#2563eb`) と `--pro-accent` (濃青: `#1a56db`) の 2 系統が
  CSS 内に並存。今回は破壊的変更を避けて手を入れず、`CLAUDE.md` に「将来統一
  対象」として明記。
- `HOKU_PROVIDER.send()` は mock のみ。実 AI API への接続は `data/hoku.js` 直下と
  `main.js:3236-3244` の adapter を差し替えれば置換可能。今回はスコープ外。
- `data/hoku-assets.js` は base64 画像のため約 165 KB。Phase C で遅延読み込み or
  外部ファイル化を検討する余地あり (`docs/17_risk_management.md:R-001`)。

---

## 4. コミット一覧 (このセッション)

| SHA | 種別 | 内容 |
|-----|------|------|
| 7053d53 | chore | v2 ベースラインのインポート |
| 1e63998 | fix | 5 スクリプト wiring 修正 (Hoku 完全復旧) |
| cb4212e | feat | `scripts/build_full.py` + `CLAUDE.md` + README 事実訂正 |
| 9a3b18e | refactor | LocalStorage `fcc:v2:*` → `hoku:v2:*` (互換読み出し) + console label |
| da3069d | style | デザイン Polish layer (card / table-wrap / focus / hit target / mic a11y) |
| 5571716 | docs | docs 整合 (Lesson 数, FCC→Hoku ラベル, WBS 完了状態) |

---

## 5. 検証手順 (このセッションで通したもの)

```bash
# 構文
node --check assets/js/main.js
for f in data/*.js; do node --check "$f"; done

# ビルド
python3 scripts/build_full.py
# → dist/hoku-tech.html (1,448 KB, CSS 1 / JS 29 inlined)

# 主要マーカー
grep -c 'data-src="data/hoku.js"'              dist/hoku-tech.html  # 1
grep -c 'data-src="data/hoku-assets.js"'       dist/hoku-tech.html  # 1
grep -c 'data-src="data/hoku-phase-support.js"' dist/hoku-tech.html  # 1
grep -c 'data-src="data/sc-enhancements.js"'   dist/hoku-tech.html  # 1
grep -c '\[Hoku timeout\]'                     dist/hoku-tech.html  # 1
grep -c '\[FCC'                                dist/hoku-tech.html  # 0
grep -c 'class="card"'                         dist/hoku-tech.html  # 17
grep -c 'class="table-wrap"'                   dist/hoku-tech.html  # 4
grep -c 'background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:16px' \
                                               dist/hoku-tech.html  # 0
grep -c 'aria-disabled="true"'                 dist/hoku-tech.html  # 2 (mic etc.)
```

ブラウザ実機テスト (Playwright 5 連発) は本リポジトリには同梱しません
(外部依存ゼロ方針)。`docs/11_test_specification.md` のシナリオに沿って、
CI / ローカルで実施してください。

---

## 6. 残課題と次の改善案

| 優先度 | 項目 | 場所 |
|--------|------|------|
| 高 | 実 AI / マルチモーダル API 接続 | `assets/js/main.js:3236-3244` の `HOKU_PROVIDER` を adapter として差し替え |
| 高 | マイク `#hokuMicBtn` の実装 (Web Speech API) または UI 撤去 | `assets/js/main.js:3448` |
| 中 | 色系統の統一 (`--pro-*` → `--brand-*` への正規化) | `assets/css/style.css:1434-1445` |
| 中 | 講師レビュー UI (採点画面) | docs/07 機能 IN-002〜005 |
| 中 | ログイン / DB 進捗管理 | docs/16 ロードマップ Phase D |
| 中 | Playwright スクリプトを `tests/` 配下に正式配置 | リポジトリに無し |
| 中 | `data/hoku-assets.js` の遅延読み込み or 外部化 (165 KB) | `index.html` の script 順 + 動的 load |
| 低 | フォーカスリングと `aria-current` を全 nav-item に動的付与 | `assets/js/main.js` の `.active` 切替時 |
| 低 | LocalStorage 旧キー (`fcc:v2:*`) ミラー書き込みを次リリースで削除 | `assets/js/main.js:141-160` |

---

## 7. 安全性 / 後戻りのために

- 致命 wiring 修正・LocalStorage 移行・docs 訂正は **すべて独立コミット**
  にしているので、必要なら `git revert <sha>` で局所的に戻せます。
- ビルド成果物 `dist/hoku-tech.html` は `.gitignore` 済 (履歴に含めない)。
- アップロード時のリファレンス `reference-hokutech-built.html` (旧ビルド) も
  `.gitignore` でローカルのみ保持しています (cross-check 用)。
