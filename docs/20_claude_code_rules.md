# Claude Code 開発ルール — Hoku Tech

> **全開発者・AI開発エージェント必読。作業開始前に必ず確認すること。**

---

## 1. 作業開始前確認

作業開始前に必ず以下を確認する:

```bash
# 1. ファイル構成確認
ls /home/claude/v2/
ls /home/claude/v2/data/

# 2. 現在のビルドサイズ確認
ls -lh /mnt/user-data/outputs/hoku-tech.html

# 3. 構文チェック（変更前のベースラインを確認）
node --check /home/claude/v2/assets/js/main.js
```

---

## 2. 既存構成を壊さない

| ルール | 内容 |
|--------|------|
| 既存関数を削除しない | 置き換える場合は必ず動作確認後 |
| window.XXX変数を削除しない | 既存の参照が壊れる |
| CSSクラス名を変更しない | 既存のJSから参照されている |
| ナビゲーション構造を変更しない | routeHash()に影響する |
| data_filesの順序を変えない | 依存関係あり |

---

## 3. 単一HTML維持

```
✅ 正しい作業フロー:
v2/assets/js/main.js を編集
v2/assets/css/style.css を編集
v2/data/*.js を編集
v2/index.html を編集
↓
build_full.py でビルド
↓
hoku-tech.html として出力

❌ やってはいけないこと:
hoku-tech.html を直接編集する（ビルドで上書きされる）
外部CDNを追加する（オフライン動作が壊れる）
```

---

## 4. data/*.jsの扱い

```javascript
// ✅ 正しい形式
window.MY_DATA = [
  { id: '...', title: '...' }
];

// ❌ NGな形式
const MY_DATA = [...];  // windowに付かない
export default [...];   // ESModuleは使用不可
```

- データ変更後は必ず `node --check data/xxx.js` で構文確認
- ビルドスクリプトの `data_files` リストに追加を忘れずに

---

## 5. main.js 追記パッチ方針

```javascript
// ✅ 新機能はIIFEで追記（既存コードを壊さない）
(function() {
  'use strict';
  
  function myNewFeature() {
    // 実装
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    try {
      myNewFeature();
    } catch(e) {
      try { console.warn('[Hoku] myNewFeature error:', e && e.message); } catch(ex) {}
    }
  });
  
  // 必要な場合はグローバル公開
  window.myNewFeature = myNewFeature;
})();
```

### main.js修正時の注意

- 既存関数と同名の関数を追加しない
- `const`/`let` は旧実装箇所との混在に注意（IIFEの先頭で `'use strict'` を使用）
- 全setTimeoutコールバックを `try-catch` で保護する

---

## 6. CSS追加方針

```css
/* ✅ 新規クラスは末尾に追加（既存スタイルを壊さない）*/

/* ─────────────────────────────
   MY NEW FEATURE スタイル
───────────────────────────── */
.my-new-class {
  /* ... */
}

/* ❌ 既存クラスのプロパティを削除・上書きする場合は要注意 */
```

- CSS変数 `--brand`, `--ink` 等を積極的に使用
- インラインスタイルは最小限に（JSからのiOS対応修正は例外）
- `!important` はiOS対応目的のみ使用可

---

## 7. 外部ライブラリ禁止

```
❌ 禁止:
import React from 'react';
<script src="https://cdn.xxx.com/..."></script>
require('lodash');
npm install xxx;

✅ 許可:
Vanilla JS のみ
Web標準API（FileReader、localStorage、fetch等）
```

---

## 8. node --check 必須

変更後は必ず実行:

```bash
node --check /home/claude/v2/assets/js/main.js
# エラーがあれば修正してから次のステップへ

# data/*.js も確認
for f in /home/claude/v2/data/*.js; do
  node --check "$f" || echo "ERROR: $f"
done
```

---

## 9. ビルド必須

```bash
python3 /tmp/build_full.py
# ✅ Build complete: /mnt/user-data/outputs/hoku-tech.html
#    Size: XXX KB
```

ビルドが失敗した場合は作業を一時停止して原因を調査する。

---

## 10. Playwrightテスト5回必須

```python
# 5回連続で全項目pass が必要
for i in range(1, 6):
    result = run_playwright_test()
    # 全て '🎉 XX/XX' or 'pass XX/XX' になること
```

**1回でも失敗した場合は、修正してから再度5回実施する。**

テスト確認項目の最低限:
- JSエラー 0件
- `[FCC]` エラー（iOSエラー） 0件
- Phase 13枚表示
- Hokuバブル表示・パネル開閉
- 375/390/768/1440px 横スクロールなし

---

## 11. スマホ横スクロール禁止

```javascript
// テスト確認方法
const scrollWidth = document.body.scrollWidth;
const viewportWidth = window.innerWidth;
// scrollWidth <= viewportWidth + 10 であること

// よくある原因:
// - 固定幅要素（min-width: 400px 等）
// - hoku-floating-panel の幅設定
// - overflow: visible の親要素
```

新規CSSを追加した場合は全幅で横スクロールをチェックする。

---

## 12. 準備中・TODO・ダミー禁止

教材・UI内に以下の表現を含めない:

```
❌ 禁止表現:
準備中 / 近日公開 / coming soon / TODO / ダミー
placeholder / lorem / 未確定 / 仮置き / 未実装

✅ 許可:
「将来拡張」（設計ドキュメント内での分類として）
「要確認」（ドキュメント内での不確定事項として）
```

---

## 13. iOS Safari対応ルール

```javascript
// ✅ iOS対応が必要なパターン

// 1. catch{}パラメータ省略 → パラメータ付きに
try { ... } catch {} → try { ... } catch(e) {}

// 2. optional chaining → null check
x?.y → x && x.y

// 3. replaceWith → replaceChild
el.replaceWith(newEl) → parent.replaceChild(newEl, el)

// 4. touchmove は passive:false + preventDefault
el.addEventListener('touchmove', fn, { passive: false });
// fn内で: if(!dragging) return; e.preventDefault();

// 5. filter: drop-shadow → filter: none
.hoku-float-avatar { filter: none !important; }

// 6. body.overflowY変更はtouchstart内では使わない
// CSS touch-action: none に任せる

// 7. 全非同期コールバックはtry-catchで保護
setTimeout(function() {
  try { ... } catch(e) { console.warn('[Hoku]', e&&e.message); }
}, delay);
```

---

## 14. 作業完了報告フォーマット

```markdown
## 作業完了報告

### 実装内容
- [変更した機能・追加した機能の概要]

### 変更ファイル
- `assets/js/main.js`: [変更内容]
- `assets/css/style.css`: [変更内容]
- `data/xxx.js`: [変更内容]
- `index.html`: [変更内容]

### JS構文チェック結果
- main.js: ✅ OK
- data/*.js: ✅ 全ファイルOK

### ビルド結果
✅ Build complete: /mnt/user-data/outputs/hoku-tech.html
   Size: XXXX KB

### Playwrightテスト結果（5回）
Round 1/5: 🎉 XX/XX
Round 2/5: 🎉 XX/XX
Round 3/5: 🎉 XX/XX
Round 4/5: 🎉 XX/XX
Round 5/5: 🎉 XX/XX
✅ 5/5全合格!

### JSエラー
0件 ✅

### 残課題（あれば正直に記載）
- [未解決の課題]

### 次の改善案
- [次にやるべきこと]
```

---

## 15. ファイルサイズ管理

| ファイル | 現状 | 注意 |
|---------|------|------|
| hoku-tech.html（ビルド出力）| 約1.4MB | 2MBを超えたら要最適化 |
| hoku-assets.js | 161KB（Hoku画像含む）| 圧縮対応済み |
| main.js | 164KB | 分割は当面不要 |
| style.css | 160KB | 未使用CSSに注意 |

画像はbase64埋め込み。新規画像追加時はサイズに注意。
