# Hoku Tech — ドキュメント一覧

> 最終更新: 2025年  
> プロジェクト: Hoku Tech（AI駆動フルスタック育成プログラム）

---

## ドキュメント構成

| # | ファイル | タイトル | 主な読者 | 更新タイミング |
|---|---------|---------|---------|--------------|
| 00 | [00_document_index.md](./00_document_index.md) | ドキュメント一覧（本ファイル） | 全員 | 新規doc追加時 |
| 01 | [01_project_overview.md](./01_project_overview.md) | プロジェクト概要 | 全員 | 方針変更時 |
| 02 | [02_wbs.md](./02_wbs.md) | WBS（作業分解構成） | PM・開発者 | スプリント開始時 |
| 03 | [03_requirements_definition.md](./03_requirements_definition.md) | 要件定義書 | PM・開発者・講師 | 要件変更時 |
| 04 | [04_basic_design.md](./04_basic_design.md) | 基本設計書 | 開発者 | 設計変更時 |
| 05 | [05_detailed_design.md](./05_detailed_design.md) | 詳細設計書 | 開発者 | 実装変更時 |
| 06 | [06_screen_design.md](./06_screen_design.md) | 画面設計書 | 開発者・デザイナー | UI変更時 |
| 07 | [07_function_list.md](./07_function_list.md) | 機能一覧 | PM・開発者・法人担当 | 機能追加・変更時 |
| 08 | [08_data_design.md](./08_data_design.md) | データ設計書 | 開発者・教材担当 | データ構造変更時 |
| 09 | [09_uiux_design.md](./09_uiux_design.md) | UI/UX設計書 | 開発者・デザイナー | デザイン変更時 |
| 10 | [10_hoku_design.md](./10_hoku_design.md) | Hoku AIメンター設計書 | 開発者・講師・PM | Hoku機能変更時 |
| 11 | [11_test_specification.md](./11_test_specification.md) | テスト仕様書 | 開発者・QA | テスト追加・変更時 |
| 12 | [12_operation_design.md](./12_operation_design.md) | 運用設計書 | PM・運用担当 | 運用フロー変更時 |
| 13 | [13_instructor_manual.md](./13_instructor_manual.md) | 講師運用マニュアル | 講師 | 運用変更時 |
| 14 | [14_student_guide.md](./14_student_guide.md) | 受講者利用ガイド | 受講者・講師 | カリキュラム変更時 |
| 15 | [15_business_proposal_base.md](./15_business_proposal_base.md) | 法人提案資料ベース | 法人営業担当 | 提案内容変更時 |
| 16 | [16_development_roadmap.md](./16_development_roadmap.md) | 開発ロードマップ | PM・開発者・経営層 | 四半期ごと |
| 17 | [17_risk_management.md](./17_risk_management.md) | リスク管理表 | PM・開発者 | リスク発生・解消時 |
| 18 | [18_issue_management.md](./18_issue_management.md) | 課題管理表 | PM・開発者 | 週次 |
| 19 | [19_github_operation.md](./19_github_operation.md) | GitHub運用ルール | 開発者 | ルール変更時 |
| 20 | [20_claude_code_rules.md](./20_claude_code_rules.md) | Claude Code開発ルール | 開発者 | ルール変更時 |

---

## ドキュメントの読み方ガイド

### 初めてHoku Techに関わる方

1. [01_project_overview.md](./01_project_overview.md) — 全体像の把握
2. [07_function_list.md](./07_function_list.md) — 実装済み機能の確認
3. [04_basic_design.md](./04_basic_design.md) — システム構成の理解
4. [20_claude_code_rules.md](./20_claude_code_rules.md) — 開発作業開始前の必読

### 開発者

- 設計理解: 04 → 05 → 08
- 機能追加前: 07 → 03 → 20
- テスト: 11
- 運用: 12 → 19

### 講師・教材担当者

- 運用理解: 13 → 14
- Hoku理解: 10
- データ構造: 08

### 法人・営業担当者

- 提案用: 15 → 01
- 機能確認: 07

### PM・マネジメント

- 全体把握: 01 → 02 → 16
- リスク・課題: 17 → 18

---

## 関連ファイル（プロジェクトルート）

```
v2/
├── README.md              ← プロジェクト概要（エントリーポイント）
├── index.html             ← メインHTML（単一ファイル）
├── assets/
│   ├── css/style.css      ← 全スタイル定義
│   └── js/main.js         ← 全インタラクション処理
├── data/                  ← 教材データ（*.js）
└── docs/                  ← 本ドキュメント群（本ディレクトリ）
```

## ビルド・出力

```bash
python3 /tmp/build_full.py
# → /mnt/user-data/outputs/hoku-tech.html
```

---

*このドキュメントはHoku Techの現状実装に基づいて作成されています。*
*未実装・将来拡張項目は各ドキュメント内に明記されています。*
