# 詳細設計書 — Hoku Tech

---

## 1. index.html 詳細

### 構成

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <title>Hoku Tech — AI駆動フルスタック育成プログラム</title>
  <meta name="description" content="...">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- CSS はビルド時インライン化 -->
</head>
<body>
  <div id="app">
    <aside id="sidebar">         ← 左ナビゲーション
    <main id="main-content">
      <section class="app-section" id="sec-home">
      <section class="app-section" id="sec-phases">
      <section class="app-section" id="sec-hoku">
      ... 計15セクション
    </main>
  </div>
  <div id="hokuFloatRoot"></div>  ← Hokuフローティングバブルのマウントポイント
  <!-- data/*.js はビルド時インライン化 -->
  <!-- main.js はビルド時インライン化 -->
</body>
```

### ナビゲーション構造

| data-view | セクションID | 表示条件 |
|-----------|------------|---------|
| home | sec-home | デフォルト表示 |
| phases | sec-phases | Phase一覧 |
| glossary | sec-glossary | 用語集 |
| error-list | sec-error-list | エラー集 |
| assignments | sec-assignments | 課題 |
| skillchecks | sec-skillchecks | SC |
| hoku | sec-hoku | Hoku活用 |
| p12-apps | sec-p12-apps | P12テーマ |
| instructor | sec-instructor | 講師向け |
| business | sec-business | 法人向け |
| templates | sec-templates | テンプレート |

---

## 2. main.js 詳細

### 2.1 ユーティリティ関数

| 関数名 | 引数 | 戻り値 | 機能 |
|--------|------|--------|------|
| `_esc(s)` | string | string | HTMLエスケープ（&lt;>等） |
| `_qs(sel, ctx)` | string, Element? | Element \| null | querySelector ラッパー |
| `_qsa(sel, ctx)` | string, Element? | NodeList | querySelectorAll ラッパー |
| `_safeTimeout(fn, ms)` | Function, number | void | try-catch付きsetTimeout |
| `_safeMO(callback)` | Function | MutationObserver | try-catch付きMO生成 |
| `_unique(arr)` | Array | Array | 重複排除（Set代替） |
| `hesc(s)` | string | string | Hoku UI用HTMLエスケープ |

### 2.2 LocalStorage管理

```javascript
const LS = {
  get: (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
};

const Progress = {
  donePhases:   () => LS.get('fcc:v2:donePhases', []),
  doneLessons:  () => LS.get('fcc:v2:doneLessons', []),
  togglePhase:  (n) => { ... LS.set('fcc:v2:donePhases', a); },
  toggleLesson: (id) => { ... LS.set('fcc:v2:doneLessons', a); }
};

// Hoku用（IIFE内）
function safeGet(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
function safeSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
```

### 2.3 ルーティング・ナビゲーション

```javascript
function nav(view) {
  // 全セクション非表示 → 指定セクションのみ表示
  // updateBreadcrumb(view)
  // 各renderXxx() を呼ぶ
}

function routeHash() {
  const hash = location.hash.slice(1);
  // #/phases, #/phase/p05, #/lesson/l05-01-01 等を解析
  // nav() または showPhaseDetail() / showLessonDetail() を呼ぶ
}
```

### 2.4 ホーム関連

| 関数 | 機能 |
|------|------|
| `renderHome()` | ホーム画面描画。ヒーロー・統計・ロードマップ・Hoku紹介セクション |
| `updateHomeStats()` | 統計数値（Phase数・Lesson数等）を動的更新 |
| `updateProgress()` | 進捗バー（完了Phase割合）を更新 |
| `renderHokuHomeSection()` | ホームのHoku紹介カードを描画 |

### 2.5 Phase関連

| 関数 | 機能 |
|------|------|
| `renderPhaseList()` | 13PhaseをCard形式で表示。検索・カテゴリフィルター適用 |
| `showPhaseDetail(phaseId)` | Phase詳細オーバーレイを表示 |
| `addProgressBars()` | Phase詳細のLesson進捗バーを追加 |
| `hookShowPhase()` | Phase詳細へのHoku注入・拡張機能フック |
| `injectHokuPhaseConsult(phaseId, root)` | Phase詳細にHoku相談カード挿入 |

### 2.6 Lesson関連

| 関数 | 機能 |
|------|------|
| `showChapterDetail(chapterId)` | チャプター展開・Lesson一覧表示 |
| `showLessonDetail(lessonId)` | Lesson詳細表示 |
| `lessonSection(lesson)` | Lesson HTML文字列生成 |
| `enhanceLessonDetail()` | コードハイライト・コピーボタン追加 |
| `applyCodeHighlight()` | pre/codeタグにシンタックスハイライト適用 |
| `injectSelfExplain()` | 自己説明チェックセクション挿入 |
| `injectNextAction()` | 次のアクションセクション挿入 |
| `bindOsTabs()` | OS別コマンドタブ切替バインド |
| `bindLessonDone()` | Lesson完了チェックボックスバインド |
| `injectHokuLessonCard(lessonId, root)` | Lesson詳細にHokuメモカード挿入 |
| `injectHokuAssignmentCheck(asgnRoot)` | Assignment詳細にHoku提出前チェックリスト挿入 |
| `injectHokuScHint(questionEl, question)` | SC問題にHokuヒント挿入 |
| `getDiagramForLesson(lessonId)` | Lesson関連の図解データ取得 |
| `injectLessonDiagram()` | Lesson詳細に図解挿入 |

### 2.7 コンテンツ関連

| 関数 | 機能 |
|------|------|
| `renderGlossary()` | 用語集一覧表示 |
| `renderExtraGlossary()` | 追加用語集表示 |
| `renderErrorList()` | エラー集表示 |
| `renderAssignments()` | 課題一覧・詳細表示 |
| `renderSkillChecks()` | SC表示（Phase別タブ）|
| `renderP12Apps()` | P12テーマ一覧表示 |
| `renderDiagrams()` | 技術図解一覧表示 |
| `renderTemplates()` | Hokuテンプレート集表示 |
| `renderHoku()` | Hoku活用ページ表示 |
| `renderHokuPage()` | Hoku活用ページ詳細コンテンツ描画 |
| `injectDiagram()` | Phase/Lesson詳細に図解挿入 |

### 2.8 Hokuフローティング関連（HOKU_FLOAT_V2 IIFE）

| 関数 | 機能 |
|------|------|
| `createFloatUI()` | フローティングバブル・パネルのDOM生成 |
| `openPanel()` | Hoku相談パネルを開く |
| `closePanel()` | パネルを閉じる |
| `togglePanel()` | パネル開閉切替 |
| `buildPanelHTML()` | パネルHTMLを生成（コンテキスト・チップ・ログ・入力バー）|
| `buildChatLogHTML()` | 会話ログHTMLを生成 |
| `buildContextHTML()` | 現在学習コンテキストHTMLを生成 |
| `buildMockResponse(payload)` | カテゴリ・コンテキストに応じたMock応答を生成 |
| `sendToHoku(payload, callback)` | Provider Adapterを通じてAIに送信 |
| `getContext()` | 現在表示画面のPhase/Lesson情報を取得 |
| `updatePanelPosition()` | パネル位置をバブル位置に合わせて更新 |
| `snap()` | バブルを画面端に吸着 |
| `restorePosition()` | LocalStorageから位置を復元 |
| `onDragStart(cx,cy)` | ドラッグ開始処理 |
| `onDragMove(cx,cy)` | ドラッグ移動処理 |
| `onDragEnd()` | ドラッグ終了・タップ判定処理 |
| `bindEvents()` | マウス・タッチイベントバインド |
| `bindPanelEvents()` | パネル内イベントバインド |
| `bindCopyButtons()` | テンプレートコピーボタンバインド |
| `applyPanelAvatar()` | パネルのHoku画像を適用 |
| `updatePreviewRow()` | 添付画像プレビュー更新 |
| `sendMessage()` | メッセージ送信処理 |
| `appendMessage(role, text, images)` | 会話ログに追加 |
| `scrollChatToBottom()` | チャットログを最下部にスクロール |
| `doInjectHokuLesson()` | Lesson詳細へのHokuカード注入 |

---

## 3. style.css 詳細

### CSS変数（デザイントークン）

```css
:root {
  /* 背景 */
  --bg: #fff
  --bg-soft: #f8fafc
  --bg-muted: #f1f5f9
  --sidebar-bg: #fafbfc

  /* テキスト */
  --ink: #0f172a
  --ink-2: #334155
  --ink-3: #64748b
  --ink-4: #94a3b8

  /* ライン */
  --line: #e2e8f0
  --line-soft: #f1f5f9

  /* ブランドカラー */
  --brand: #2563eb
  --brand-h: #1d4ed8
  --brand-soft: #eff6ff
  --brand-ink: #1e3a8a

  /* アクセントカラー */
  --green: #16a34a
  --hf-blue: #2563eb
  --hf-sky: #0891b2
}
```

### 主要CSSクラス

| クラス | 用途 |
|--------|------|
| `.app-section` | 各ページセクション（display切替で表示/非表示）|
| `.phase-card` | Phase一覧カード |
| `.lesson-row` | Lesson行 |
| `.chapter-card` | チャプターアコーディオン |
| `.hoku-float` | フローティングバブルコンテナ（position:fixed）|
| `.hoku-float-avatar` | Hoku画像（background:none、filter:none）|
| `.hoku-float-dot` | オンライングリーンドット |
| `.hoku-panel` | 相談パネルコンテナ |
| `.hoku-header` | パネルグラデーションヘッダー |
| `.hoku-chip-row` | カテゴリチップ横スクロール行 |
| `.hoku-chip` | カテゴリ選択チップ |
| `.hoku-chat-log` | 会話ログスクロールエリア |
| `.hoku-bubble` | Hoku吹き出し（左寄せ）|
| `.hoku-user-bubble` | ユーザー吹き出し（右寄せ）|
| `.hoku-input-bar` | 下部固定入力バー |
| `.hoku-text-input` | テキスト入力欄（textarea）|
| `.hoku-send-btn` | 送信ボタン |
| `.hoku-upload-btn` | 画像添付ボタン（label+input[file]）|
| `.hoku-preview-row` | 添付画像プレビュー行 |
| `.hoku-consult-box` | Phase詳細埋込Hokuカード |
| `.hoku-sc-hint` | SC/Lesson埋込Hokuヒント |
| `.hoku-precheck` | Assignment提出前チェックリスト |

---

## 4. data/*.js 詳細

### 4.1 phases.js — Phase定義

```javascript
window.PHASES = [
  {
    id: 'p00',         // Phase識別子
    num: 0,            // Phase番号
    title: '事前準備・PC基礎',
    category: 'Foundation',
    duration: '0.5週',
    emoji: '🖥️',
    goal: 'PCを使って...',
    goalItems: ['...'],  // 習得目標リスト
    prereq: '...',       // 前提知識
    // ...
  },
  // ... p01〜p12
];
```

### 4.2 lesson-p*.js — Lesson定義

```javascript
window.LESSON_P05 = {
  chapters: [
    {
      id: 'c05-1',
      title: 'React入門',
      lessons: [
        {
          id: 'l05-01-01',
          title: 'コンポーネント設計',
          body: '<p>...</p>',   // HTML本文
          code: '...',          // サンプルコード
          selfCheck: '...',     // 自己説明チェック
          nextAction: '...',    // 次のアクション
        }
      ]
    }
  ]
};
```

### 4.3 assignments.js — Assignment定義

```javascript
window.ASSIGNMENTS = [
  {
    id: 'a00',
    phase: 'p00',
    title: '開発環境セットアップ完了報告',
    goal: '...',
    prereq: '...',
    build: '...',
    requirements: ['...'],  // 要件リスト
    submit: '...',          // 提出方法
    review: '...',          // 評価観点
  },
  // ... a01〜
];
```

### 4.4 hoku-phase-support.js — Phase別Hoku支援

```javascript
window.HOKU_PHASE_SUPPORT = {
  p00: {
    title: 'まずは環境を整えよう',
    message: 'PC操作から学習環境まで...',
    chips: ['用語を聞く', 'スクショ相談', '環境確認', '質問の整理'],
    examples: ['Hoku、拡張子って何か初心者向けに説明して', ...],
    noGo: ['全部設定して', ...],
    instructorCheck: '...',
  },
  // p01〜p12
};

window.HOKU_TEMPLATES = {
  vocab: { label: '用語を聞く', body: '...' },
  error: { label: 'エラー相談', body: '...' },
  screenshot: { label: 'スクショ相談', body: '...' },
  code: { label: 'コード解説', body: '...' },
  task: { label: '課題の進め方', body: '...' },
  github: { label: 'GitHub提出前', body: '...' },
  readme: { label: 'README作成', body: '...' },
  interview: { label: '面談練習', body: '...' },
  claudecode: { label: 'Claude Code指示文', body: '...' },
  report: { label: '日報/週報', body: '...' },
};
```

---

## 5. Phase表示処理

```
renderPhaseList()
├── PHASES をフィルター（カテゴリ・検索キーワード）
├── Phase Card HTML生成（progress表示含む）
└── イベントバインド（カードクリック → showPhaseDetail）

showPhaseDetail(phaseId)
├── PHASES, PHASES_EXTRA からデータ取得
├── sec-phase-detail に HTML描画
├── addProgressBars() でLesson進捗バー追加
├── hookShowPhase() で拡張機能注入
└── injectHokuPhaseConsult(phaseId) でHokuカード挿入
```

---

## 6. Lesson表示処理

```
showLessonDetail(lessonId)
├── LESSON_Pxx から lesson データ取得
├── sec-lesson-detail に HTML描画
├── enhanceLessonDetail() でコードハイライト・コピー追加
├── injectSelfExplain() で自己説明チェック追加
├── injectNextAction() で次のアクション追加
├── injectLessonDiagram() で図解追加（対応する図解がある場合）
└── injectHokuLessonCard() でHokuメモ追加
```

---

## 7. Hoku処理の詳細

### 7.1 コンテキスト取得

```javascript
function getContext() {
  // 1. .dh-num（Phase詳細の番号バッジ）を確認
  // 2. breadcrumb から Phase番号を取得
  // 3. #lesson-detail-root h1 から Lesson名を取得
  // → { phase: 'Phase 05', lesson: 'useStateの基本', type: 'lesson' }
}
```

### 7.2 Mock応答生成

```javascript
function buildMockResponse(payload) {
  const { category, message, attachedImages, currentContext } = payload;
  // カテゴリ別・画像有無・コンテキストに応じた応答テキストを返す
  // 例: category='error' → エラー相談テンプレート応答
  // 例: attachedImages.length > 0 → スクショ確認応答
}
```

---

## 8. ビルド処理

```python
# build_full.py の処理順序
html = read('index.html')
css  = read('style.css')
# 1. CSSをインライン化
html = html.replace('<link rel="stylesheet"...>', f'<style>{css}</style>')
# 2. data/*.js を順番に <script> タグとしてインライン化
for fn in data_files:
    data_js = read(f'data/{fn}')
    # </body>直前に挿入
# 3. main.js をインライン化
main_js = read('assets/js/main.js')
# 4. 出力
write('hoku-tech.html', html)
```

---

## 9. 例外処理

### iOS Safari対応ルール

1. `catch {}` → `catch(e) {}` に変更
2. `?.` → `if(x) x.method()` に変更
3. `?.` → `&&` チェーンに変更
4. `replaceWith()` → `replaceChild()` に変更
5. `filter: drop-shadow()` → `filter: none; will-change: transform` に変更
6. `touchmove` → `{ passive: false }` + `e.preventDefault()` に変更
7. 全setTimeoutコールバック → `try { ... } catch(e) {}` で保護

---

## 10. 主要な状態変数（Hoku IIFE内）

```javascript
const state = {
  open: false,              // パネル開閉状態
  minimized: false,         // 最小化状態
  dragging: false,          // ドラッグ中フラグ
  pos: { x: null, y: null }, // バブル位置
  dragOffset: { x: 0, y: 0 }, // ドラッグオフセット
  activeCategory: null,     // 選択中カテゴリ
  attachedImages: [],        // 添付画像base64[]
  chatLog: [],               // 会話ログ [{role, text, images}]
  currentContext: null,      // 現在の学習コンテキスト
};
```
