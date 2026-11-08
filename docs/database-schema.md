# PROVIDE ENGINEER ACADEMY — データベース設計

> 版: v0.2 (2026-11-06) / 正: [`its-academy/prisma/schema.prisma`](../its-academy/prisma/schema.prisma) (PostgreSQL 16)

---

## 1. エンティティ一覧 (20 テーブル)

| 依頼書のエンティティ | テーブル | 役割 |
|----------------------|----------|------|
| users | `users` | 氏名・メール・パスワードハッシュ・ロール・所属・入校日・有効/無効・仮パスワードのままか (`must_change_password`)・最終ログイン日時 |
| roles | `users.role` (enum `Role`) | 4 ロール固定のため列挙型で表現。複数ロールが必要になったら中間テーブルへ移行 |
| — | `sessions` | ログインセッション (トークンの SHA-256 のみ保存) |
| — | `login_attempts` | ログイン試行 (試行制限用) |
| courses | `courses` | コース |
| modules | `modules` | レベル (L0〜L8)・選択モジュールの印 (`optional`。指標 A〜E に含めない) |
| lessons | `lessons` | レッスンの識別子・並び順・公開状態・公開予約日時・現在の版 |
| lesson_versions | `lesson_versions` | レッスン本文の版 (13 項目 JSON)・出典 URL・作成者 |
| enrollments | `enrollments` | 受講登録・担当講師・学習開始日・目標修了日・最終閲覧レッスン |
| lesson_progress | `lesson_progress` | レッスンごとの学習状態 (学習中/完了) と版 |
| learning_sessions | `learning_sessions` | 学習時間の記録 |
| assignments | `assignments` | 課題 (形式・本文・合格点・ルーブリック・前提レッスン) |
| submissions | `submissions` | 提出 (回数・状態・本文・リポジトリ URL・備考) |
| reviews | `reviews` | 採点 (観点別得点・合計・採点時の合格点・判定・コメント)。追記のみ |
| rubrics | `rubrics` | 評価観点と配点 (合計 100) |
| quiz_attempts | `quiz_attempts` | 理解度チェックの解答と得点 (版に紐づく) |
| skill_assessments | `skill_assessments` | 講師による実務スキル評価 (9 観点 × 1〜5)。履歴として追記 |
| instructor_comments | `instructor_comments` | 講師コメント (講師のみ / 受講生にも表示) |
| notifications | `notifications` | 受講生・講師への通知 |
| audit_logs | `audit_logs` | 操作の監査ログ。追記のみ |
| — | `settings` | 停滞検知の閾値など運用設定 |

## 2. 受講生ごとの管理項目との対応

| 依頼書の項目 | 保存先 |
|--------------|--------|
| 氏名 / ユーザー ID / 所属 / 入校日 | `users.name / id / affiliation / joined_at` |
| 学習開始日 / 目標修了日 | `enrollments.started_at / target_end_date` |
| 現在のレベル / 現在のレッスン | `enrollments.current_lesson_id` → `lessons.module.level` |
| 完了済み / 未完了レッスン | `lesson_progress.status` と公開中レッスンの差分 |
| 課題提出履歴 / レビュー結果 | `submissions` / `reviews` |
| 理解度テスト結果 | `quiz_attempts` |
| 学習時間 / 最終学習日時 / 連続学習日数 | `learning_sessions` + 各種記録の最新日時から算出 |
| 苦手分野 | 未合格の理解度チェック・修正依頼/不合格の課題・スキル評価 2 以下から算出 |
| 講師コメント | `instructor_comments` |
| 卒業制作状況 | `assignments.type = FINAL_PROJECT` の提出状態 (課題 a6-final-library-system) |
| 実務能力評価 | `skill_assessments` |

## 3. 整合性のルール

* `lesson_progress (user_id, lesson_id)`、`submissions (assignment_id, user_id, attempt_no)`、
  `lesson_versions (lesson_id, version)`、`enrollments (user_id, course_id)` は一意。
* `reviews`・`audit_logs`・`skill_assessments` はアプリから更新・削除しない (履歴)。データベースでも、
  マイグレーション `20261107120000_append_only_history` のトリガー (`forbid_history_change()`。行単位の BEFORE UPDATE OR DELETE) で
  書き換えと削除を拒否する (行単位のトリガーのため TRUNCATE には効かない。開発用の seed は TRUNCATE で作り直す)。
* スキーマ上は、受講生 (`users`) を削除すると個人の学習記録が連鎖削除される (`onDelete: Cascade`) が、
  採点・スキル評価が 1 件でもある受講生は、上のトリガーが連鎖削除を拒否するため削除できない
  (監査ログの `actor_id` も、削除に伴う更新がトリガーで拒否される)。アプリには利用者を削除する機能はなく、
  受講生・講師・管理者とも `is_active = false` で無効化する。退会者の個人情報の削除方法は D-09 の決定後に設計する。
* 教材 (`lessons`) を非公開にしても、進捗・採点の履歴は残る。

## 4. 個人情報の扱い

| データ | 区分 | 対策 |
|--------|------|------|
| 氏名・メール・所属 | 個人情報 | 本人・担当講師・管理者のみ閲覧 (サーバー側で検証) |
| パスワード | 秘密情報 | argon2id ハッシュのみ保存。ログ・監査ログに出さない |
| セッショントークン | 秘密情報 | SHA-256 のみ保存 |
| 提出物・コメント | 個人の学習記録 | 同上のアクセス制御。備考欄に秘密情報を書かないよう UI で注意喚起 |
| 監査ログの IP | 個人に紐づく情報 | 管理者のみ閲覧。保存期間は運用規程で定める (未決定事項 D-09) |

## 5. バックアップと復元

[deployment-guide.md §6](deployment-guide.md#6-バックアップと復元) を参照。

## 6. マイグレーション

* `prisma/migrations/` に SQL として保存し、本番は `npm run db:migrate` (`prisma migrate deploy`) で適用する。
* 開発中の `prisma migrate dev` は本番 DB に対して実行しない。
