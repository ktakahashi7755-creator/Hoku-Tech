# Hoku Tech

> AI駆動開発で、市場価値の高いフルスタックエンジニアへ

---

## 概要

**Hoku Tech** は、未経験者がReact / Next.js、Java / Spring Boot、Python、GitHub、AI活用を体系的に学び、設計・実装・課題提出・ポートフォリオ制作まで一貫して経験する12週間の実践型カリキュラムです。

**Hoku AIメンター** が学習の相棒として全フェーズに常駐し、エラー相談・コード解説・課題整理・README作成・面談練習を24時間サポートします。

---

## 現状機能

| 機能 | 状態 |
|------|------|
| 全 13 Phase / 約 204 Lesson 表示 | ✅ |
| Assignment 詳細 (Hoku 提出前チェック) | ✅ |
| Skill Check (p00〜p09) | ✅ |
| Skill Check (p10〜p12) | ⚠️ `data/skillchecks.js` に未収録 (`phases-extra.js` にインライン記載のみ) |
| 用語集 (50 語) / エラー集 (20 件) | ✅ |
| Hoku フローティング常駐 UI (ドラッグ・端吸着・位置保存) | ✅ |
| Hoku 相談パネル (チャット UI / 画像添付 UI / 10 カテゴリ) | ✅ |
| Hoku Mock 応答 (`HOKU_PROVIDER.send`) | ✅ |
| テンプレートコピー機能 (10 種) | ✅ |
| Phase 検索 / カテゴリフィルタ | ✅ |
| 進捗管理 (LocalStorage) | ✅ |
| スマホ対応 (375 px〜) / iOS Safari 対応 | ✅ |
| 講師向け / 法人向けページ | ✅ |
| 卒業制作テーマ (8 アプリ) | ✅ |
| Hoku マイク入力 (`#hokuMicBtn`) | 🟡 UI のみ・ハンドラ未接続 |
| 本物の AI / マルチモーダル API 連携 | 🔮 将来拡張 (`HOKU_PROVIDER` の差し替えで対応) |
| ログイン / ユーザー管理 / DB 進捗 | 🔮 将来拡張 |
| 講師レビュー UI (提出物採点画面) | 🔮 将来拡張 |

---

## 技術構成

```
単一HTML + Vanilla JS + CSS + data/*.js
外部ライブラリなし / フレームワークなし
サーバー不要 / ブラウザ直接起動
LocalStorageによる進捗保存
Pythonビルドスクリプトで単一HTML化
スマホファースト / iOS Safari対応
```

---

## ファイル構成

```
v2/
├── index.html                   ← マスターHTML
├── assets/
│   ├── css/style.css            ← 全スタイル（160KB）
│   └── js/main.js               ← 全インタラクション（164KB）
├── data/
│   ├── phases.js                ← Phase定義（13件）
│   ├── phases-extra.js          ← Phase追加情報
│   ├── chapters.js              ← Chapter定義
│   ├── diagrams.js              ← 技術図解データ
│   ├── p12-apps.js              ← P12卒業制作テーマ
│   ├── phase-illustrations.js   ← フェーズ図解
│   ├── sc-enhancements.js       ← SC詳細解説
│   ├── hoku.js                  ← Hoku基本設定
│   ├── hoku-assets.js           ← Hoku画像base64（161KB）
│   ├── hoku-phase-support.js    ← Phase別Hoku支援
│   ├── glossary.js              ← 用語集・エラー集
│   ├── assignments.js           ← 課題定義
│   ├── skillchecks.js           ← SC問題
│   ├── lesson-p00.js〜p12.js   ← Lesson 本文 (約 204 件)
│   └── lesson-p02-append.js / lesson-p03-append.js
├── scripts/
│   └── build_full.py            ← 単一 HTML ビルド (標準ライブラリのみ)
├── dist/                        ← ビルド成果物 (gitignored)
├── docs/                        ← ドキュメント群 (00–20)
├── CLAUDE.md                    ← Claude Code 用プロジェクト規約
└── README.md                    ← 本ファイル
```

---

## ビルド方法

```bash
# 1. JS 構文チェック
node --check assets/js/main.js
for f in data/*.js; do node --check "$f"; done

# 2. 単一 HTML ビルド (リポジトリ同梱の Python 標準ライブラリのみ)
python3 scripts/build_full.py
# → dist/hoku-tech.html  (1.4 MB 程度 / すべてインライン化)

# オプション: 出力先を指定
python3 scripts/build_full.py --out /path/to/hoku-tech.html
```

`dist/` は `.gitignore` 済み (ビルド成果物は履歴に含めない)。

---

## テスト方法

```bash
# Playwrightテスト（5回連続合格が必須）
node -e "
const { chromium } = require('playwright');
// ... テストスクリプト
"

# 受け入れ基準:
# - JSエラー 0件
# - [FCC]エラー（iOS Safari）0件
# - Phase 13枚表示
# - Hokuバブル常駐・パネル開閉
# - 375/390/768/1440px 横スクロールなし
```

---

## ドキュメント一覧

| # | ドキュメント | 概要 |
|---|------------|------|
| 00 | [docs/00_document_index.md](docs/00_document_index.md) | ドキュメント一覧 |
| 01 | [docs/01_project_overview.md](docs/01_project_overview.md) | プロジェクト概要 |
| 02 | [docs/02_wbs.md](docs/02_wbs.md) | WBS |
| 03 | [docs/03_requirements_definition.md](docs/03_requirements_definition.md) | 要件定義書 |
| 04 | [docs/04_basic_design.md](docs/04_basic_design.md) | 基本設計書 |
| 05 | [docs/05_detailed_design.md](docs/05_detailed_design.md) | 詳細設計書 |
| 06 | [docs/06_screen_design.md](docs/06_screen_design.md) | 画面設計書 |
| 07 | [docs/07_function_list.md](docs/07_function_list.md) | 機能一覧 |
| 08 | [docs/08_data_design.md](docs/08_data_design.md) | データ設計書 |
| 09 | [docs/09_uiux_design.md](docs/09_uiux_design.md) | UI/UX設計書 |
| 10 | [docs/10_hoku_design.md](docs/10_hoku_design.md) | Hoku AIメンター設計書 |
| 11 | [docs/11_test_specification.md](docs/11_test_specification.md) | テスト仕様書 |
| 12 | [docs/12_operation_design.md](docs/12_operation_design.md) | 運用設計書 |
| 13 | [docs/13_instructor_manual.md](docs/13_instructor_manual.md) | 講師運用マニュアル |
| 14 | [docs/14_student_guide.md](docs/14_student_guide.md) | 受講者利用ガイド |
| 15 | [docs/15_business_proposal_base.md](docs/15_business_proposal_base.md) | 法人提案資料ベース |
| 16 | [docs/16_development_roadmap.md](docs/16_development_roadmap.md) | 開発ロードマップ |
| 17 | [docs/17_risk_management.md](docs/17_risk_management.md) | リスク管理表 |
| 18 | [docs/18_issue_management.md](docs/18_issue_management.md) | 課題管理表 |
| 19 | [docs/19_github_operation.md](docs/19_github_operation.md) | GitHub運用ルール |
| 20 | [docs/20_claude_code_rules.md](docs/20_claude_code_rules.md) | Claude Code開発ルール |

---

## Hoku AIメンター概要

- **役割**: 学習の相棒（答えを与えるのではなく、考え方を整理する）
- **常駐**: 全画面・全Phase・スクロール中も右下に固定表示
- **操作**: タップで相談パネル開閉 / ドラッグで位置変更
- **相談内容**: エラー相談・スクショ相談・コード解説・課題整理・面談練習（10カテゴリ）
- **現状**: Mock応答実装済み。本物のAI API連携は将来拡張

---

## 将来拡張

- **Phase C**: Claude API によるマルチモーダルAI相談
- **Phase D**: ログイン・DB進捗管理
- **Phase E**: 講師レビューUI
- **Phase F**: Next.js化 / LMS化

---

## 開発ルール

**必読**: [CLAUDE.md](CLAUDE.md) / [docs/20_claude_code_rules.md](docs/20_claude_code_rules.md)

- 既存関数・構成を壊さない
- 新機能はIIFEで追記パッチ方式
- `node --check` → ビルド → Playwright 5回（必須）
- 外部ライブラリ禁止
- iOS Safari対応コード（try-catch・filter:none等）
- 横スクロール禁止（375px以上で確認）

---

## ライセンス

要確認（社内利用・法人提供の場合は別途ライセンス設定）
