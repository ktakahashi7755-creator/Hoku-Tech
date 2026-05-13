# 運用設計書 — Hoku Tech

---

## 1. 教材更新運用

### 更新フロー

```
1. v2/data/*.js を編集
2. node --check data/xxx.js で構文確認
3. python3 /tmp/build_full.py でビルド
4. Playwrightテスト5回実施
5. Git commit & push
6. hoku-tech.html を配布
```

### 教材別更新手順

| 更新内容 | 対象ファイル | 注意事項 |
|---------|-----------|---------|
| Lesson追加 | lesson-pXX.js | ID体系: lXX-YY-ZZ 形式を維持 |
| Phase追加 | phases.js + lesson-pXX.js新規 | build_full.pyのdata_filesに追加必須 |
| 用語追加 | glossary.js | GLOSSARY[]の配列末尾に追加 |
| Assignment追加 | assignments.js | ID体系: aXX 形式を維持 |
| SC問題追加 | skillchecks.js | 対象phaseキーの配列に追加 |
| Hokuメッセージ更新 | hoku-phase-support.js | Phase IDと一致させる |
| テンプレート更新 | hoku-phase-support.js | HOKU_TEMPLATES の body を更新 |

---

## 2. ビルド運用

### 定常ビルド手順

```bash
# 1. 構文チェック（必須）
node --check /home/claude/v2/assets/js/main.js
for f in /home/claude/v2/data/*.js; do
  node --check "$f" && echo "OK: $f"
done

# 2. ビルド実行
python3 /tmp/build_full.py

# 3. 確認
ls -lh /mnt/user-data/outputs/hoku-tech.html
# → Size: ~1.4MB が正常範囲
```

### ビルド失敗時の対応

| エラー | 原因 | 対処 |
|--------|------|------|
| SyntaxError | data/*.jsに構文エラー | node --check で特定・修正 |
| FileNotFound | data_filesリストに未追加 | build_full.pyのdata_files配列に追加 |
| 2MB超過 | 画像base64が大きい | 画像圧縮・不要画像削除 |

---

## 3. テスト運用

### 変更別テスト要件

| 変更の種類 | node --check | ビルド | Playwright |
|---------|------------|-------|-----------|
| data/*.js更新 | ✅必須 | ✅必須 | ✅5回必須 |
| main.js更新 | ✅必須 | ✅必須 | ✅5回必須 |
| style.css更新 | — | ✅必須 | ✅5回必須 |
| index.html更新 | — | ✅必須 | ✅5回必須 |
| ドキュメントのみ | — | — | 最低1回確認 |

### 受け入れ基準

- Playwright全テスト合格（17/17以上）× 5回連続
- pageerror 0件
- `[FCC]` warningを含むconsole.warn 0件
- 375/390/768/1440px横スクロールなし

---

## 4. GitHub運用

```
main     ← 安定リリース版（直接pushは禁止）
develop  ← 開発統合ブランチ
feature/xxx ← 機能追加
hotfix/xxx  ← 緊急バグ修正
docs/xxx    ← ドキュメント更新
```

### コミット基準

- 1コミット = 1論理変更
- 必ずテスト合格後にコミット
- コミットメッセージ: `feat:`, `fix:`, `docs:`, `refactor:` 等

---

## 5. 講師運用

| タスク | 頻度 | 内容 |
|--------|------|------|
| 週次面談 | 週1回 | 進捗確認・詰まりポイント対応 |
| 課題レビュー | 提出後48時間以内 | コードレビュー・合否判定 |
| AI丸投げチェック | 課題レビュー時 | 自分の言葉で説明できるか確認 |
| 卒業判定 | Phase12完了後 | 全Phase完了・面談・ポートフォリオ |

---

## 6. 不具合対応フロー

```
1. JSエラー/Script error.発生
   → Playwright で再現確認
   → node --check で構文確認
   → try-catch追加・iOS互換修正
   → 5回テスト合格後リリース

2. 横スクロール発生
   → Chrome DevTools でoverflow確認
   → 原因要素に max-width: 100% or overflow-x: hidden 追加
   → 375/390/768/1440 全幅確認後リリース

3. 教材誤り発見
   → data/*.js を修正
   → build → test → リリース

4. Hoku関連バグ
   → iOS実機確認
   → try-catch保護・filter:none確認
   → 5回テスト後リリース
```

---

## 7. バックアップ

| バックアップ対象 | 方法 | 頻度 |
|--------------|------|------|
| v2/全ファイル | Git | 変更時 |
| hoku-tech.html（ビルド）| Gitignore（ローカル保持）| ビルド時 |
| fcc-source-v2.zip | ZIP保存 | 重要変更時 |

---

## 8. LocalStorage管理

| キー | 対応 |
|------|------|
| `fcc:v2:donePhases` | スキーマ変更時はマイグレーション必要 |
| `fcc:v2:doneLessons` | 旧形式(`fcc_done_lessons`)との互換維持 |
| `hokuFloatPos` | デバイス幅変更時は範囲外になる可能性あり |
| `hokuOpen` | 問題なし |

---

## 9. 将来LMS化時の運用移行

| 現状 | 将来 |
|------|------|
| LocalStorage進捗 | DB（Firestore/PostgreSQL）|
| HTMLファイル配布 | CDN/Next.js deployment |
| node --check | CI/CD pipeline |
| 手動Playwright | GitHub Actions自動テスト |
| 講師HTML確認 | 管理ダッシュボード |
| 教材data/*.js | CMS / Markdown + DB |
