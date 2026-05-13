# テスト仕様書 — Hoku Tech

---

## 1. テスト方針

| 方針 | 内容 |
|------|------|
| 自動テスト優先 | Playwrightによる自動化テスト（5回連続合格必須）|
| JSエラーゼロ | pageerror イベント0件 |
| 横スクロールゼロ | scrollWidth ≤ viewportWidth+10px |
| iOS互換 | Script error.（[FCC]warn）0件 |
| テスト前必須 | node --check → build_full.py → Playwright |

---

## 2. テスト環境

| 項目 | 内容 |
|------|------|
| ブラウザ | Chromium（Playwright）、iOS Safari（実機確認）|
| ビューポート | 375px, 390px, 768px, 1440px |
| テストツール | Playwright + Python subprocess |
| 構文チェック | node --check |
| ビルド | python3 /tmp/build_full.py |
| 出力 | /mnt/user-data/outputs/hoku-tech.html |

---

## 3. テストケース一覧

### 3.1 基本表示テスト

| TC-ID | テスト項目 | 操作 | 期待結果 | 優先度 |
|-------|---------|------|---------|--------|
| TC-001 | ページタイトル | ページ読み込み | `<title>` に「Hoku Tech」含む | 高 |
| TC-002 | ホーム表示 | ページ読み込み | h1 に「AI駆動開発」含む | 高 |
| TC-003 | サイドバー表示 | ページ読み込み | brand名「Hoku Tech」表示 | 中 |
| TC-004 | Hokuバブル表示 | ページ読み込み | `#hokuFloat` が存在する | 高 |
| TC-005 | バブルfixed確認 | CSSチェック | `position: fixed` | 高 |
| TC-006 | バブル青背景なし | CSSチェック | backgroundColor = rgba(0,0,0,0) | 高 |
| TC-007 | バブルfilterなし | CSSチェック | filter = none | 高 |

### 3.2 Phase機能テスト

| TC-ID | テスト項目 | 操作 | 期待結果 | 優先度 |
|-------|---------|------|---------|--------|
| TC-101 | Phase一覧表示 | 「Phase 一覧」クリック | Phase Card 13枚表示 | 高 |
| TC-102 | Phase詳細表示 | Phase Card クリック | Phase詳細画面表示 | 高 |
| TC-103 | Phase検索 | 検索ボックスに「React」入力 | React関連Phaseのみ表示 | 中 |
| TC-104 | カテゴリフィルター | 「Frontend」フィルター選択 | Frontend PhaseのみCard表示 | 中 |
| TC-105 | Hokuカード表示 | Phase詳細を開く | `.hoku-consult-box` が表示 | 中 |
| TC-106 | Phase完了マーク | 完了ボタンクリック | LocalStorage更新・進捗バー変化 | 中 |

### 3.3 Lesson機能テスト

| TC-ID | テスト項目 | 操作 | 期待結果 | 優先度 |
|-------|---------|------|---------|--------|
| TC-201 | Chapter展開 | Chapter Card クリック | Lesson一覧が開く（アコーディオン）|高 |
| TC-202 | Lesson詳細表示 | Lesson Row クリック | Lesson詳細画面表示 | 高 |
| TC-203 | コードハイライト | Lesson詳細開く | pre/codeにハイライト適用 | 中 |
| TC-204 | コードコピー | Copyボタンクリック | テキストコピー + 「✓ Copied」表示 | 中 |
| TC-205 | Hokuメモ表示 | Lesson詳細開く | `.hoku-sc-hint` が表示 | 中 |
| TC-206 | Lesson完了チェック | チェックボックスON | LocalStorage更新 | 中 |

### 3.4 Hoku機能テスト

| TC-ID | テスト項目 | 操作 | 期待結果 | 優先度 |
|-------|---------|------|---------|--------|
| TC-301 | パネル開く | バブルをクリック | `#hokuPanelEl` が表示 | 高 |
| TC-302 | ヘッダー表示 | パネル開く | `.hoku-header` と「Hoku」テキスト表示 | 高 |
| TC-303 | チャットUI表示 | パネル開く | `.hoku-chat-log` 表示 | 高 |
| TC-304 | 入力欄表示 | パネル開く | `.hoku-text-input` 表示 | 高 |
| TC-305 | カテゴリチップ | パネル開く | チップ10個以上表示 | 高 |
| TC-306 | チップ選択 | チップクリック | `.hoku-chip.active` & テンプレート表示 | 高 |
| TC-307 | テンプレートコピー | テンプレートCopyボタン | クリップボードコピー + 「✓ Copied」| 高 |
| TC-308 | メッセージ送信 | テキスト入力→送信 | `.hoku-user-bubble` 表示 | 高 |
| TC-309 | Hoku応答 | 送信後1.5秒 | `.hoku-bubble` 表示 | 高 |
| TC-310 | 画像添付UI | `.hoku-upload-btn` 確認 | ファイル入力ボタン表示 | 高 |
| TC-311 | パネル閉じる（×） | 閉じるボタンクリック | パネル非表示 | 高 |
| TC-312 | ESCで閉じる | ESCキー押下 | パネル非表示 | 中 |
| TC-313 | ドラッグ移動 | マウスドラッグ | バブル位置変更 | 高 |
| TC-314 | ドラッグ端吸着 | ドラッグ後マウスアップ | 左右端に吸着 | 中 |
| TC-315 | コンテキスト表示 | Phase詳細後にパネル開く | `.hoku-context-card` 表示 | 中 |
| TC-316 | Assignment提出前チェック | 課題詳細開く | `.hoku-precheck` 表示 | 中 |
| TC-317 | SC Hokuヒント | SC開く | `.hoku-sc-hint` 表示 | 中 |

### 3.5 レスポンシブテスト

| TC-ID | デバイス | ビューポート | 確認事項 | 優先度 |
|-------|---------|------------|---------|--------|
| TC-401 | iPhone SE | 375×667 | 横スクロールなし（≤385px）| 高 |
| TC-402 | iPhone 15 | 390×844 | 横スクロールなし（≤400px）| 高 |
| TC-403 | iPad | 768×1024 | 横スクロールなし（≤778px）| 高 |
| TC-404 | PC | 1440×900 | 横スクロールなし（≤1450px）| 高 |
| TC-405 | スマホ | 375px | Hokuパネルが下部シート表示 | 中 |
| TC-406 | スマホ | 375px | バブル右下に表示（固定）| 中 |
| TC-407 | スクロール後 | 全幅 | バブルが viewport 内に表示 | 高 |

### 3.6 エラー・品質テスト

| TC-ID | テスト項目 | 確認方法 | 期待結果 | 優先度 |
|-------|---------|---------|---------|--------|
| TC-501 | JSエラーゼロ | Playwright pageerror | 0件 | 高 |
| TC-502 | [FCC]エラーゼロ | console.warn | [FCC]含むwarn = 0件 | 高 |
| TC-503 | JS構文チェック | node --check main.js | エラーなし | 高 |
| TC-504 | data/*.js構文 | node --check data/*.js | 全ファイルエラーなし | 高 |
| TC-505 | ビルド成功 | build_full.py | hoku-tech.html 生成・サイズ確認 | 高 |

---

## 4. テスト実行手順

### 4.1 JS構文チェック

```bash
node --check /home/claude/v2/assets/js/main.js
for f in /home/claude/v2/data/*.js; do node --check "$f"; done
```

### 4.2 ビルド

```bash
python3 /tmp/build_full.py
# → ✅ Build complete: /mnt/user-data/outputs/hoku-tech.html
```

### 4.3 Playwrightテスト（5回連続）

```javascript
// テスト判定基準
// pass条件: fail=0 && errors.length=0
// 5回連続で pass になること

const checks = [
  'Hoku Tech title',
  '#hokuFloat exists',
  'position:fixed',
  '青背景なし',
  'パネル開閉',
  'チャットUI',
  'Phase13枚',
  'SE横スクロールなし',
  'PC横スクロールなし',
  'JSエラーゼロ',
  '[FCC]エラーゼロ',
];
```

---

## 5. 受け入れ基準

| 基準 | 判定 |
|------|------|
| Playwright 5回連続全項目pass | 必須 |
| JSエラー 0件 | 必須 |
| [FCC]エラー 0件 | 必須 |
| 横スクロール 0（375/390/768/1440px）| 必須 |
| ビルド成功（hoku-tech.html 生成）| 必須 |
| Phase 13枚表示 | 必須 |
| Hokuバブル常駐 | 必須 |
| パネル開閉・テンプレートコピー動作 | 必須 |

---

## 6. 過去のテスト記録

| 日付 | テスト回数 | 結果 | 備考 |
|------|---------|------|------|
| 2025-05 | 5回 | 17/17 ✅ | iOS Safari対応・snap修正後 |

> テスト実施時に更新してください。
