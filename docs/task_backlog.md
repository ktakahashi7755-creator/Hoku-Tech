# タスクバックログ — Hoku Tech 教材品質向上

> 作成日: 2026-05-13
> ベース: `docs/curriculum_quality_audit.md` の所見を Task ID 付きで実行可能粒度に分解したもの
> 凡例:
>   - 優先度: P0 (即修正・学習導線/UI に直結) / P1 (高優先・品質直結) / P2 (中優先・品質向上) / P3 (将来拡張)
>   - 難易度: S (小) / M (中) / L (大)
>   - ステータス: ⬜ 未着手 / 🔄 着手中 / ✅ 完了 / ⏸ 保留

---

## P0 — 即修正 (UI / 学習導線に直結)

| Task ID | カテゴリ | 対象ファイル | 改善内容 | エージェント | 難易度 | 完了条件 | ステータス |
|---------|---------|------------|---------|--------------|-------|---------|-----------|
| T-P0-01 | UI 描画 | `assets/js/main.js:1004-1022` | `renderSkillChecks` に `sc-enhancements.js` の `commonMistakes` / `passLine` / `instructorCheckPoint` を描画する | UI/UX + QA | M | SC 詳細画面で 3 フィールドが表示され、horizontal scroll なし | ⬜ |
| T-P0-02 | UI 描画 | `assets/js/main.js:981-1001` | `renderAssignments` に `criteria` / `resubmit` / `reviewPoints` を描画 | UI/UX + Instructor Op | M | 課題詳細で全フィールドが表示される | ⬜ |
| T-P0-03 | Hoku | `assets/js/main.js:3265-3316` `buildMockResponse` | カテゴリ `report` / `claudecode` を実装し汎用 fallback から救出 | Hoku Mentor UX | S | `report`/`claudecode` カテゴリで意味のある応答が返る | ⬜ |
| T-P0-04 | 検証 | プロジェクト全体 | 禁止フレーズスキャン (準備中/TODO/ダミー/旧 FCC) を作業後に毎回実行 | QA | S | grep 結果 0 件 | ⬜ |
| T-P0-05 | データ整合 | `data/lesson-p02.js` / `lesson-p02-append.js` / `chapters.js` | Lesson 詳細画面から append ファイルのレッスンへ到達できるか検証。到達不可なら `nextLesson` リンクを明示化 | Curriculum Architect | M | P02 の全 Lesson が UI から到達可能 (20/20 チェーン到達) | ✅ |
| T-P0-06 | データ整合 | `data/lesson-p03.js` / `lesson-p03-append.js` | 同上、P03 の `l03-2-2` 以降が UI から到達可能か検証 | Curriculum Architect | M | P03 の全 Lesson が UI から到達可能 (22/22 チェーン到達) | ✅ |

## P1 — 高優先 (品質直結)

| Task ID | カテゴリ | 対象ファイル | 改善内容 | エージェント | 難易度 | 完了条件 | ステータス |
|---------|---------|------------|---------|--------------|-------|---------|-----------|
| T-P1-01 | Assignment | `data/assignments.js` | 全 13 課題に `instructorCheckPoints[]` (5-7 件/課題) を追加 | Instructor Op | L | 13 件すべてに 5+ 件入る | ⬜ |
| T-P1-02 | Assignment | `data/assignments.js` | 全 13 課題に `optionalFeatures[]` (3-5 件/課題) を追加 | Curriculum Architect | M | 13 件すべてに 3+ 件入る | ⬜ |
| T-P1-03 | Assignment | `data/assignments.js` | 10 課題に `readmeChecklist[]` を追加 (p01,p02,p03,p05,p06,p07,p08,p09,p10,p12) | Beginner Designer | M | 10 件で表示確認 | ⬜ |
| T-P1-04 | Hoku | `assets/js/main.js:3265` | `buildMockResponse` を `phaseNum` で switch して Phase 別エラー応答を返す (P03 async / P05 React / P09 Spring) | Hoku Mentor UX | M | P05 と P09 でエラー応答が異なる | ⬜ |
| T-P1-05 | Hoku | `assets/js/main.js:3294` | `code` カテゴリで Phase 別解説レンズ (P09 三層・P05 コンポーネント) を返す | Hoku Mentor UX | S | P05/P09 でコード解説応答が異なる | ⬜ |
| T-P1-06 | Hoku | `assets/js/main.js` | 「全部書いて/丸ごと実装して」検出ガードを全カテゴリへ展開 | Hoku Mentor UX | S | 該当フレーズで丸投げ防止文が返る | ⬜ |
| T-P1-07 | Lesson 深掘り | `data/lesson-p05.js` `l05-3-1` | useState の errors に「直接 mutate」「stale closure」を追加 | React Specialist | S | errors[] が 4+ 件 | ⬜ |
| T-P1-08 | Lesson 深掘り | `data/lesson-p05.js` `l05-1-1` | Vite セットアップに Node バージョン・npm キャッシュエラーを追加 | React Specialist | S | errors[] が 3+ 件 | ⬜ |
| T-P1-09 | Lesson 深掘り | `data/lesson-p01.js` `l01-1-3` | プロトコルに hands-on `steps` (curl/netstat 等) を追加 | Beginner Designer | S | steps[] が空でない | ⬜ |

## P2 — 中優先 (品質向上)

| Task ID | カテゴリ | 対象ファイル | 改善内容 | エージェント | 難易度 | 完了条件 | ステータス |
|---------|---------|------------|---------|--------------|-------|---------|-----------|
| T-P2-01 | Hoku | `data/hoku-phase-support.js` | Lesson 別 `hokuMemos` を追加 (代表 Lesson 5-10 件で開始) | Hoku Mentor UX | M | 該当 Lesson 詳細で Lesson 別メモが出る |⬜ |
| T-P2-02 | Assignment | `data/assignments.js` | 全 13 課題に `scoringRubric` (重み付け) を追加 | Instructor Op | M | 13 件で表示 | ⬜ |
| T-P2-03 | Assignment | `data/assignments.js` | 8 課題に `aiUsageLogTemplate` を追加 | AI Driven Specialist | S | 8 件で表示 | ⬜ |
| T-P2-04 | SC | `data/skillchecks.js` | SC 問題に `type` (code-reading / error-id / prompt-writing) ラベル付与 | QA | M | 130 件全件にラベル | ⬜ |
| T-P2-05 | P12 | `data/assignments.js:162-173` | 卒業制作課題に面談 23 問への参照リンクを追加 | Curriculum Architect | S | UI に表示 | ⬜ |
| T-P2-06 | UI | `assets/css/style.css` | 課題・SC 詳細画面のカードレイアウト改善 (新フィールド分の余白調整) | UI/UX | S | 横スクロールなし、可読性 OK | ⬜ |

## P3 — 将来拡張

| Task ID | カテゴリ | 対象ファイル | 改善内容 | エージェント | 難易度 | 完了条件 | ステータス |
|---------|---------|------------|---------|--------------|-------|---------|-----------|
| T-P3-01 | DevOps | `scripts/audit_data_consistency.py` | `data/*.js` のスキーマ検証スクリプトを追加 (chapter↔lesson 参照 / nextLesson / 孤立 / Assignment 必須 5 フィールド)。Python 標準ライブラリのみ。失敗時 exit 1。 | Release Manager | M | CI で実行可能、CLAUDE.md 作業後チェックリストに追加済 | ✅ |
| T-P3-02 | Lesson 深掘り | `data/lesson-p*.js` 全て | 各 Lesson に `commonPitfalls` を 2-3 件追加 | Beginner Designer | L | 全 Lesson 4+ 件 | ⬜ |
| T-P3-03 | Hoku | `assets/js/main.js` | Hoku に「Phase 文脈を使いますか?」明示的プロンプト | Hoku Mentor UX | S | UI に出る | ⬜ |
| T-P3-04 | テスト | `tests/playwright/` (新規) | Playwright スクリプトを正式同梱 | QA | L | 5 連発合格 | ⬜ |
| T-P3-05 | 多言語 | 全 data | 英語版データ追加 (法人向け国際展開) | Curriculum Architect | L | en 版が選べる | ⬜ |

---

## 今回セッションで実装するスコープ

このセッションでは **P0 タスク 4 件 (T-P0-01〜T-P0-04)** + **代表的な P1 (T-P1-04 = Hoku Phase 別応答 / T-P1-07 = P05 useState errors / T-P1-08 = P05 Vite セットアップ)** を実装する。残りは継続課題として `docs/task_backlog.md` 上に残し、次セッションで順次着手する。
