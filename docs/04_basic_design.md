# 基本設計書 — Hoku Tech

---

## 1. システム全体構成

```
ブラウザ（受講者）
     │
     ├─ ファイル直接起動 / Webサーバー経由
     │
     └─ hoku-tech.html（単一HTML）
          │
          ├─ <style> インライン CSS（style.cssから結合）
          ├─ <script> データ（data/*.jsから結合）
          └─ <script> メインロジック（main.jsから結合）
                │
                ├─ LocalStorage（進捗・Hoku位置）
                └─ [将来] AI API（Claude/OpenAI）
```

---

## 2. アーキテクチャ方針

| 方針 | 内容 |
|------|------|
| 単一HTMLファイル | 配布・利用の簡便性を優先。サーバー不要 |
| Vanilla JS | 依存ライブラリゼロ。長期保守性を確保 |
| window.XXX形式 | データをグローバル変数として管理 |
| 追記パッチ方式 | main.jsへの機能追加はIIFEで追記（既存コードを壊さない）|
| iOS Safari互換 | try-catch全保護・optional chaining禁止・filter:none |
| スマホファースト | 375px基準でデザイン・375〜1440pxでレスポンシブ |

---

## 3. ファイル構成

```
v2/
├── index.html              ← マスターHTML（セクション・ナビ定義）
├── assets/
│   ├── css/style.css       ← 全スタイル定義（160KB）
│   └── js/main.js          ← 全インタラクション処理（164KB）
├── data/
│   ├── phases.js           ← Phase定義（13件）
│   ├── phases-extra.js     ← Phase追加情報
│   ├── chapters.js         ← Chapter定義
│   ├── diagrams.js         ← 技術図解データ
│   ├── p12-apps.js         ← P12卒業制作テーマ
│   ├── phase-illustrations.js ← フェーズ図解
│   ├── sc-enhancements.js  ← SC詳細解説
│   ├── hoku.js             ← Hoku設定・テンプレート基本
│   ├── hoku-assets.js      ← Hoku画像base64（161KB）
│   ├── hoku-phase-support.js ← Phase別Hoku支援データ
│   ├── glossary.js         ← 用語集 (50 語) ・エラー集 (20 件)
│   ├── assignments.js      ← 課題定義 (13 件)
│   ├── skillchecks.js      ← SC 問題定義 (p00〜p12)
│   ├── sc-enhancements.js  ← SC 詳細解説
│   ├── lesson-p00〜p12.js  ← Lesson 本文 (約 204 Lesson)
│   ├── lesson-p02-append.js / lesson-p03-append.js
│   ├── phase-illustrations.js / diagrams.js / p12-apps.js
│   ├── hoku.js / hoku-assets.js / hoku-phase-support.js
├── scripts/
│   └── build_full.py       ← 単一 HTML ビルド (標準ライブラリのみ)
├── dist/                   ← ビルド成果物 (gitignored)
├── docs/                   ← ドキュメント群 (本ディレクトリ)
├── CLAUDE.md               ← Claude Code 用プロジェクト規約
└── README.md               ← プロジェクト概要
```

---

## 4. 画面構成

ナビゲーション（`data-view`属性）で表示画面を切り替える。

| data-view | 画面名 | 対応関数 |
|-----------|--------|---------|
| home | ホーム | renderHome() |
| phases | Phase一覧 | renderPhaseList() |
| glossary | 用語集 | renderGlossary() |
| error-list | エラー集 | renderErrorList() |
| assignments | 課題 | renderAssignments() |
| skillchecks | Skill Check | renderSkillChecks() |
| hoku | Hoku活用 | renderHoku() / renderHokuPage() |
| p12-apps | P12テーマ | renderP12Apps() |
| ai-rules | AI活用ルール | — |
| claude-code | Claude Code活用 | — |
| portfolio | ポートフォリオ | — |
| instructor | 講師向け | — |
| templates | テンプレート集 | renderTemplates() |
| business | 法人向け | — |
| pricing | 価格・プラン | — |

Phase/Lesson詳細はモーダル的にオーバーレイ表示（showPhaseDetail/showLessonDetail）。

---

## 5. データ構成

### 5.1 主要データオブジェクト

```
window.PHASES          ← Phase[]（13件）
window.PHASES_EXTRA    ← Phase追加情報
window.CHAPTERS        ← {[phaseId]: Chapter[]}
window.LESSON_P00〜12  ← Lesson[]（各Phase分）
window.ASSIGNMENTS     ← Assignment[]
window.SKILLCHECKS     ← {[phaseId]: {questions: SCQuestion[]}}
window.SC_ENHANCEMENTS ← {[scId]: {hints, explanation}}
window.GLOSSARY        ← Term[]
window.GLOSSARY_ERRORS ← ErrorItem[]
window.DIAGRAMS        ← Diagram[]
window.P12_APPS        ← AppTheme[]
window.HOKU_MENTOR     ← HokuConfig
window.HOKU_PHASE_SUPPORT ← {[phaseId]: PhaseSupport}
window.HOKU_TEMPLATES  ← {[key]: Template}
window.HOKU_IMG_MAIN   ← base64 URI
window.HOKU_IMGS       ← {[expression]: base64 URI}
```

### 5.2 LocalStorage

```
fcc:v2:donePhases    ← 完了Phase ID[]
fcc:v2:doneLessons   ← 完了Lesson ID[]
fcc_done_lessons     ← 旧形式（互換維持）
hokuFloatPos         ← {x, y} Hokuバブル位置
hokuOpen             ← 0 or 1 パネル開閉状態
```

---

## 6. 主要機能構成

### 6.1 ルーティング

```
URLハッシュ → routeHash() → nav() → 各render関数
```

### 6.2 Phase/Lesson表示フロー

```
renderPhaseList()
  → Phase Card クリック
    → showPhaseDetail(phaseId)
      → Chapter Card クリック
        → showChapterDetail(chapterId)
          → Lesson Row クリック
            → showLessonDetail(lessonId)
              → enhanceLessonDetail()
              → injectSelfExplain()
              → injectNextAction()
              → injectHokuLessonCard()
```

### 6.3 Hokuフロー

```
createFloatUI()           ← ページ読み込み時に常駐バブル生成
  → バブルクリック/タップ
    → openPanel()
      → buildPanelHTML()
        → getContext()    ← 現在画面のPhase/Lessonを取得
      → bindPanelEvents()
        → チップクリック → テンプレート表示
        → 送信 → sendToHoku(payload) → HOKU_PROVIDER.send() → buildMockResponse()
        → 画像添付 → FileReader → state.attachedImages[]
```

---

## 7. Hoku AIメンター構成

```
HOKU_PROVIDER (Provider Adapter)
  ├── name: 'mock'           ← 現在: Mock Responder
  └── send(payload, cb)      ← 将来: Claude API / OpenAI API に差し替え

payload構造:
  {
    message: string,
    attachedImages: string[],  // base64
    currentContext: { phase, lesson, type },
    category: string
  }
```

---

## 8. LocalStorage設計

| キー | 型 | 用途 | 保存タイミング |
|------|-----|------|--------------|
| `fcc:v2:donePhases` | JSON Array | Phase完了履歴 | Phase完了ボタン押下時 |
| `fcc:v2:doneLessons` | JSON Array | Lesson完了履歴 | Lessonチェック時 |
| `hokuFloatPos` | JSON {x,y} | Hokuバブル位置 | ドラッグ終了時 |
| `hokuOpen` | Number 0/1 | パネル開閉状態 | パネル開閉時 |

---

## 9. ビルド設計

```python
# /tmp/build_full.py
BASE = '/home/claude/v2'
OUT  = '/mnt/user-data/outputs/hoku-tech.html'

# 処理フロー:
# 1. index.html 読み込み
# 2. style.css をインライン化
# 3. data_files を順番にインライン化
# 4. main.js をインライン化
# 5. 単一HTML として出力
# 6. 互換用コピー (fullstack-career-camp.html)
```

data_filesの読み込み順序（依存関係のため順番重要）:
```
phases.js → chapters.js → phases-extra.js → diagrams.js →
p12-apps.js → phase-illustrations.js → sc-enhancements.js →
hoku.js → hoku-assets.js → hoku-phase-support.js →
lesson-p00〜p12.js → glossary.js → assignments.js → skillchecks.js
```

---

## 10. レスポンシブ設計

| ブレークポイント | 対象 | 主な変更 |
|----------------|------|---------|
| ≤480px | スマホ | Hokuパネル下部シート化、グリッド1カラム |
| 481〜767px | 大型スマホ | 一部2カラム |
| 768px〜 | タブレット以上 | サイドバー表示、2〜3カラム |
| 1440px〜 | PC | 最大幅制限、余白調整 |

横スクロール防止: `max-width: 100vw; overflow-x: hidden` をbody・各コンテナに適用。

---

## 11. エラー処理方針

| エラー種別 | 対応 |
|-----------|------|
| JavaScript実行エラー | try-catch で捕捉・console.warn('[Hoku]') |
| DOMアクセスエラー | null チェック後にアクセス |
| LocalStorageエラー | safeGet/safeSet で try-catch |
| 画像ロードエラー | フォールバック（文字「H」表示） |
| ビルドエラー | node --check で事前検知 |

---

## 12. 将来拡張方針

### 12.1 AI API連携

```javascript
// HOKU_PROVIDER を差し替えるだけで対応可能
window.HOKU_PROVIDER = {
  name: 'claude',
  send: async (payload, callback) => {
    const response = await fetch('YOUR_API_ENDPOINT', { ... });
    callback(await response.text());
  }
};
```

### 12.2 Next.js化

- 現在の`data/*.js`をJSON/Markdownに変換
- 各画面をNext.js Page Componentに変換
- LocalProgressをDB（Supabase/Firestore等）に移行
- Hoku Provider Adapterをserver-side APIに移行

### 12.3 LMS化

- ユーザー認証（NextAuth/Firebase Auth）
- 進捗管理DB（課題提出・SC完了・講師コメント）
- 講師ダッシュボード（複数受講者の進捗一覧）
- 管理画面（教材追加・Phase設定）
