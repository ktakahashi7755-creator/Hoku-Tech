# カリキュラム品質監査レポート

> 監査日: 2026-05-13
> 監査体制: 3 体の Explore エージェントによる並列監査 (Curriculum Depth / Hoku Integration / Assignments & SkillChecks)
> ベースライン: 21_audit_report.md (構造監査) の続編として、**教材中身の深さ** を測定する

---

## 1. サマリ — 全体品質

| 領域 | 状態 | コメント |
|------|------|----------|
| 構造 (HTML / JS / CSS / build) | ✅ 健全 | 21_audit_report で修正済 (Hoku wiring / brand / design polish) |
| カリキュラム広さ | ✅ 13 Phase / 約 204 Lesson 揃う | 構造的欠落なし |
| カリキュラム深さ | ⚠️ Phase 単位で大きく差 | **P03 / P02 が薄い**。それ以外は 4-5/5 |
| 課題 (Assignment) | 🔄 監査継続中 | 評価基準・合格ラインの粒度確認中 |
| Skill Check | 🔄 監査継続中 | commonMistakes / passLine / instructorCheckPoint の網羅性確認中 |
| Hoku 統合 (広さ) | ✅ 100% | 全 13 Phase に hokuUseCases + warnings 揃う |
| Hoku 応答 (深さ) | ⚠️ 50% | Mock 応答が **Phase 文脈を活用していない**。汎用的 |

---

## 2. Phase 別 カリキュラム深さスコア

| Phase | 名前 | Lesson 数 | 深さ | 主な弱点 |
|-------|------|-----------|------|---------|
| P00 | 事前準備 / PC 基礎 | 17 | 5/5 | なし — 模範的 |
| P01 | IT 基礎 / Web 基礎 | 13 | 4/5 | `l01-1-3` (プロトコル) が `steps:[]`、ハンズオン演習が無い |
| **P02** | **HTML / CSS** | **10** | **3/5** | **Chapter 3-6 が append ファイル分離。`l02-1-4` も `steps:[]`** |
| **P03** | **JavaScript 基礎** | **5** | **2/5** | **致命的: 9 Lesson が append ファイル分離 (`l03-2-2` 以降)**。React の前提崩壊リスク |
| P04 | Git / GitHub | 13 | 5/5 | なし |
| P05 | React | 16 | 4/5 | `l05-1-1` Vite セットアップで Node バージョン・npm キャッシュ系エラーが薄い。`l05-3-1` (useState) の errors が 2 件のみ |
| P06 | Next.js | 13 | 4/5 | 構造良し。設定系エラー追加余地あり |
| P07 | Java 基礎 | 14 | 5/5 | 模範的。OOP / 例外処理が深い |
| P08 | SQL / DB | 12 | 5/5 | 模範的。WHERE 欠落警告も明示 |
| P09 | Spring Boot | 17 | 5/5 | 模範的。3 層 → Postman → デプロイの導線完備 |
| P10 | Python 自動化 | 12 | 4/5 | 良し |
| P11 | AI 駆動開発 | 15 | 4/5 | 良し。Claude Code / プロンプト / ログ網羅 |
| P12 | 卒業制作 | 19 | 5/5 | 模範的。面談 23 問付き |

### 重要な所見

* **P02 / P03 の append ファイル分離** が最大の構造リスク。レッスン詳細画面から append ファイルのレッスンへ自然に到達できるか要検証。
* **P03 が React の前提**。`l03-2-2` (`map/filter/reduce`)、`l03-3-1` (Promise)、`l03-4-1` (DOM)、`l03-5-1` (fetch) が append のみなので、未経験者は React に進む前にここで躓きやすい。
* **P05 の状態管理エラー**: 「直接 mutate した」「stale closure」など現場頻発エラーの追記余地あり。

---

## 3. Hoku 統合 監査

### 3.1 広さ — 全 Phase で完備

| Phase | hokuUseCases | 警告 (NG例) | 質 |
|-------|-------------|-------------|------|
| P00 | 3 | 2 | 4/5 |
| P01 | 3 | 1 | 4/5 |
| P02 | 3 | 1 | 4/5 |
| P03 | 3 | 1 | 4/5 |
| P04 | 3 | 1 | 3/5 |
| P05 | 3 | 1 | 4/5 |
| P06 | 3 | 1 | 3/5 |
| P07 | 3 | 1 | 4/5 |
| P08 | 3 | 1 | 4/5 |
| P09 | 3 | 1 | 4/5 |
| P10 | 3 | 1 | 3/5 |
| P11 | 3 | 2 | 5/5 |
| P12 | 3 | 1 | 5/5 |

13 Phase 全てに **canAsk (3 件以上)** と **dontAsk (1-2 件)** が定義済み。これは Hoku の「相棒像」の根幹であり、現状の品質は十分。

### 3.2 深さ — Mock 応答が Phase 文脈を活用しきれていない

**ファイル**: `assets/js/main.js:3265-3316` (`buildMockResponse`)

| 観点 | 状態 | 詳細 |
|------|------|------|
| Context 検出 | ✅ | `currentContext.phase` / `lesson` / `type` を DOM から検出 (line 3219-3238) |
| Image / category / errorText 受け取り | ✅ | `payload` から取得 |
| Phase 別エラー応答 | ❌ | `error`/`screenshot` カテゴリは P03 でも P09 でも同じ「typo/import/async/undefined」を返す。Java の NPE、Spring の `Caused by:` チェーンを認識しない |
| Phase 別コード解説 | ❌ | `code` カテゴリは「1 行ずつ説明」のみで、P05 → コンポーネント視点、P09 → 三層視点、の切替なし |
| `report` / `claudecode` カテゴリ | ❌ | switch に未実装、汎用 fallback 落ち |
| 丸投げガード | ⚠️ 部分 | `task` カテゴリのみ警告。`code`/`error` で「全部書いて」と来ても止まらない |
| Lesson 別 Hoku メモ | ⚠️ 汎用 | `canAsk.slice(0,3)` で Phase 共通の 3 件を使い回し。Lesson 単位カスタムなし |
| 「文脈確認しますか?」プロンプト | ❌ | Context は silent に自動検出。学習者は Hoku に Phase 情報が渡っていることを知らない |

### 3.3 Hoku の Top 5 改善ターゲット

1. **Phase 別エラー応答ロジック** (HIGH) — `buildMockResponse` 内で `phaseNum` を switch し、P09=Spring 用、P05=React 用、P03=JS async 用の応答テンプレを返す
2. **`report` / `claudecode` カテゴリ実装** (MED) — 8/10 → 10/10 カバレッジへ
3. **Phase 別コード解説レンズ** (HIGH) — `code` カテゴリで Phase に応じた読み解き視点を提供
4. **Lesson 別 hokuMemos** (MED) — `data/hoku-phase-support.js` に lesson キーを追加し、`l05-3-1` (useState)、`l05-4-1` (useEffect) で別メモを出す
5. **明示的な「丸投げガード」** (MED) — 「全部書いて」「実装して」「コード作って」を全カテゴリで検出し、考え方支援に誘導

---

## 4. Assignment / Skill Check 監査

### 4.1 Phase 別品質スコア

| Phase | Assignment 質 | SC データ質 | SC UI 描画 | 主弱点 |
|-------|--------------|------------|----------|--------|
| p00〜p12 (全 13 Phase) | **2/5** | **5/5** | **約 50%** | `instructorCheckPoints` 全欠落 / `optionalFeatures` 全欠落 / SC 拡張データが UI に出ない |

### 4.2 致命的: データはあるのに UI に出ていない

**`data/sc-enhancements.js` には 130 件分の充実データが入っているが、`assets/js/main.js:1004-1022` の `renderSkillChecks()` は `explanation` しか描画していない。** 以下のフィールドは「データに存在するが学習者・講師から見えない」状態:

| データ側にあるフィールド | UI 描画 | 状態 |
|-----------------------|--------|------|
| `commonMistakes[]` | ❌ | 完全に非表示 |
| `passLine` | ❌ | 完全に非表示 |
| `instructorCheckPoint` | ❌ | 完全に非表示 |

同様に **Assignment** も `renderAssignments()` (line 981-1001) が `criteria` / `resubmit` を描画していない。

### 4.3 全 13 Assignment に欠落しているフィールド

`data/assignments.js` の全 13 課題で以下が **完全欠落**:

| 欠落フィールド | 影響 | 例 (file:line) |
|---------------|------|----------------|
| `instructorCheckPoints[]` | 講師が課題レビューで何を見るか不明 | line 17 (p00), line 82 (p05), line 173 (p12) |
| `optionalFeatures[]` | 受講者が拡張機能の候補を知らない | 全 13 件 |
| `readmeChecklist[]` | 提出 README の必須項目が不明 (10/13 件) | p01, p02, p03, p05, p06, p07, p08, p09, p10, p12 |
| `aiUsageLogTemplate` | AI 利用ログの形式が不明 (8/13 件) | p03, p05, p06, p07, p09, p10, p11, p12 |
| `scoringRubric` | 評価重み付けがない | 全 13 件 |
| `interviewQuestions[]` (P12 のみ) | 卒制で面談 23 問への参照リンクなし | line 162-173 (p12) |

### 4.4 Top 10 最大影響ギャップ (P0 / P1 候補)

| # | ギャップ | 優先度 | 修正箇所 |
|---|---------|--------|---------|
| 1 | SC 拡張 (`commonMistakes` / `passLine` / `instructorCheckPoint`) が UI に出ない | **P0** | `main.js:1004-1022` `renderSkillChecks` |
| 2 | Assignment 評価基準・再提出条件が UI に出ない | **P0** | `main.js:981-1001` `renderAssignments` |
| 3 | 13 課題に `instructorCheckPoints` 追加 | **P1** | `data/assignments.js` 全件 |
| 4 | 13 課題に `optionalFeatures` 追加 | **P1** | `data/assignments.js` 全件 |
| 5 | 10 課題に `readmeChecklist` 追加 | **P1** | `data/assignments.js` |
| 6 | 8 課題に `aiUsageLogTemplate` 追加 | **P2** | `data/assignments.js` |
| 7 | SC 問題に `type` ラベル (code-reading / error-id / prompt-writing) 付与 | **P2** | `data/skillchecks.js` |
| 8 | 全課題に `scoringRubric` (重み付け) 追加 | **P2** | `data/assignments.js` |
| 9 | P12 課題に `interviewQuestions` 参照を追加 | **P2** | `data/assignments.js:162-173` |
| 10 | `data/*.js` のスキーマバリデーション lint 追加 | **P3** | `scripts/` 新規 |

詳細タスクは `docs/task_backlog.md` を参照。

---

## 5. 全体所見

### 強い領域

* **構造健全性**: HTML / JS / CSS / Build / Hoku wiring すべて健全 (21_audit で実施済)
* **バックエンド系教材**: P07 Java / P08 SQL / P09 Spring Boot は **SES 法人研修にそのまま使える品質**
* **卒業制作 P12**: 19 Lesson + 面談 23 問 + 8 アプリテンプレで「現場ポートフォリオ → 面談」までの導線完備
* **Hoku 広さ**: 13 Phase 全てに丸投げ防止設計あり

### 弱い領域

* **P02 / P03 の構造リスク**: append ファイル分離が「未経験者がレッスンを見落とす」原因になる可能性
* **Hoku 応答の汎用性**: 全 Phase 共通のテンプレ応答で、Phase 文脈の活用が不足
* **Assignment / SC の評価粒度**: 合格ライン・講師確認ポイントの定義が一部欠落 (詳細は 3 体目監査で確定)

---

## 6. 改善優先度マップ

| 優先度 | 領域 | 想定影響 |
|--------|------|----------|
| **P0** | P02 / P03 の append ファイルが Lesson 詳細から到達できているか検証 | 学習導線の致命的欠落の可能性 |
| **P0** | Hoku Mock 応答に `report` / `claudecode` を追加 | 2 カテゴリが silent に壊れている |
| **P1** | Hoku Mock 応答を Phase 別 switch に拡張 (P05/P09/P03 重点) | Hoku の「相棒度」が大幅向上 |
| **P1** | P03 (JavaScript) の append ファイル統合 or 明示的リンク | React 前提の崩壊防止 |
| **P1** | P02 (HTML/CSS) の append ファイル統合 or 明示的リンク | CSS 学習導線改善 |
| **P1** | Lesson 別 hokuMemos の導入 (`l05-3-1` 等) | Hoku の Lesson 単位カスタム |
| **P2** | P05 の useState/useEffect エラー追記 (mutation, stale closure) | React 実務頻出エラー対応 |
| **P2** | P01 `l01-1-3` (プロトコル) にハンズオン steps 追加 | 完全な hands-on coverage |
| **P2** | Hoku 「丸投げガード」を全カテゴリへ展開 | 教育倫理強化 |
| **P3** | Lesson 単位の `interviewQ` 強化 | 面談導線さらに強化 |

詳細タスクは `docs/task_backlog.md` を参照。
