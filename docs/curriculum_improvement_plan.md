# カリキュラム改善実行計画

> 作成日: 2026-05-13
> 対応する監査: `docs/curriculum_quality_audit.md`
> 対応するタスク一覧: `docs/task_backlog.md`

---

## 1. 改善方針

Hoku Tech は **構造健全 / カリキュラム広さ完備 / バックエンド系教材 5/5 / 卒業制作 5/5** の高品質ベースを既に持っている。今回の改善は「ゼロから書き直す」ではなく、以下 3 点に集中する。

1. **データはあるのに UI に出ていない情報を見える化** (最小コストで大効果)
2. **Hoku の Phase 文脈活用度を 50% → 80% に引き上げる** (相棒度の核)
3. **Assignment の評価粒度を上げる** (講師運用 / 法人研修向け)

---

## 2. Phase 別改善優先度

| 優先 | Phase | 理由 | 主アクション |
|------|-------|------|-------------|
| 1 | P02 / P03 | append ファイル分離による導線リスク (監査結果) | UI 到達性検証 → 不可なら `nextLesson` 明示化 |
| 2 | P05 (React) | 市場価値 + 面談直結。useState/Vite で実務エラー追記の余地 | errors 追記 + Hoku 応答強化 |
| 3 | P09 (Spring Boot) | 既に 5/5 だが Hoku 応答を Phase 別に出すと相棒度が劇的向上 | Hoku 応答 Phase 別 switch |
| 4 | P12 (卒業制作) | 5/5 + 面談 23 問あり。Assignment 側に参照を追加 | Assignment 強化 |
| 5 | P01 | 概論部の `steps:[]` を埋める | hands-on 演習追加 |
| 6 | P00 / P04 / P06 / P07 / P08 / P10 / P11 | 既に 4-5/5 で問題なし | 次回以降の継続課題 |

---

## 3. 短期 / 中期 / 長期計画

### 短期 (このセッション)

最小コスト・最大効果の P0 を完了させる。

* **T-P0-01**: SC 詳細 UI で `commonMistakes` / `passLine` / `instructorCheckPoint` を描画
* **T-P0-02**: Assignment 詳細 UI で `criteria` / `resubmit` / `reviewPoints` を描画
* **T-P0-03**: Hoku Mock 応答に `report` / `claudecode` カテゴリを実装
* **T-P0-04**: 禁止フレーズスキャン
* **T-P1-04**: Hoku Mock 応答に Phase 別エラー応答ロジックを追加
* **T-P1-07 / T-P1-08**: P05 useState / Vite に errors を追加

### 中期 (次セッション以降 2-3 回)

* **T-P1-01**: 全 13 課題に `instructorCheckPoints` を追加 (1 課題ずつ Instructor Op 視点で執筆)
* **T-P1-02**: 全 13 課題に `optionalFeatures` を追加
* **T-P1-03**: 10 課題に `readmeChecklist` を追加
* **T-P1-05 / T-P1-06**: Hoku Phase 別コード解説 / 丸投げガード全カテゴリ展開
* **T-P0-05 / T-P0-06**: P02 / P03 の append ファイル導線整備

### 長期 (継続課題)

* **T-P2-01〜T-P2-06**: Lesson 別 hokuMemos / scoringRubric / aiUsageLogTemplate / SC 問題 type ラベル付与 / P12 面談リンク / UI 余白調整
* **T-P3-01〜T-P3-05**: スキーマ検証 / 全 Lesson `commonPitfalls` / Hoku 文脈確認プロンプト / Playwright 同梱 / 英語版

---

## 4. テスト方針

各改善後、必ず以下を実施:

1. `node --check assets/js/main.js`
2. `for f in data/*.js; do node --check "$f"; done`
3. `python3 scripts/build_full.py` (ビルドサイズ要確認)
4. 禁止フレーズ grep (期待 0 件)
5. ローカル目視: index.html 直接開く → 該当画面で新フィールドが表示されることを確認
6. 375 / 390 / 768 / 1440 px 横スクロールチェック (CSS 開発者ツールで viewport 切替)
7. Console Error 0 件
8. `dist/hoku-tech.html` を `release/hoku-tech.html` に複製して iPhone 確認

---

## 5. 完了条件 (このセッション)

* ✅ `CLAUDE.md` に 14 エージェントチーム + 教材品質基準 + 完了報告フォーマット が含まれる
* ✅ `docs/task_backlog.md` に P0〜P3 のタスク一覧が完全粒度で並ぶ
* ✅ `docs/curriculum_quality_audit.md` に 3 領域の監査結果が file:line 引用付きで並ぶ
* ✅ `docs/curriculum_improvement_plan.md` (本ファイル) が存在
* ✅ P0 4 件 + 代表 P1 3 件が実装されてビルド通過
* ✅ 禁止フレーズ 0 件、JS 構文 OK、ビルドサイズ ±5% 内
* ✅ `release/hoku-tech.html` 更新 (iPhone 確認可能)
