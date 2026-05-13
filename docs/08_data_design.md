# データ設計書 — Hoku Tech

---

## window.PHASES

| 項目 | 内容 |
|------|------|
| 目的 | Phase定義（13件）|
| ファイル | data/phases.js |

### フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✅ | 'p00'〜'p12' |
| num | number | ✅ | 0〜12 |
| title | string | ✅ | Phase名 |
| category | string | ✅ | Foundation/Frontend/Backend等 |
| duration | string | ✅ | '0.5週' 等 |
| emoji | string | - | アイコン絵文字 |
| goal | string | ✅ | Phase目標文 |
| goalItems | string[] | ✅ | 達成目標リスト |
| prereq | string | - | 前提知識 |

---

## window.LESSON_P00〜P12

| 項目 | 内容 |
|------|------|
| 目的 | Lesson 本文定義 (約 204 Lesson) |
| ファイル | data/lesson-p00.js〜data/lesson-p12.js (および data/lesson-p02-append.js / data/lesson-p03-append.js) |

### 構造

```javascript
{ chapters: [ { id, title, lessons: [ { id, title, body, code, selfCheck, nextAction } ] } ] }
```

### Lessonフィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✅ | 'l05-01-01' 形式 |
| title | string | ✅ | Lesson名 |
| body | string | ✅ | HTML本文 |
| code | string | - | サンプルコード |
| selfCheck | string | - | 自己説明チェック文 |
| nextAction | string | - | 次のアクション |

---

## window.ASSIGNMENTS

| 項目 | 内容 |
|------|------|
| 目的 | 課題定義 |
| ファイル | data/assignments.js |

### フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✅ | 'a00'〜 |
| phase | string | ✅ | 'p00'〜'p12' |
| title | string | ✅ | 課題名 |
| goal | string | ✅ | 課題目標 |
| requirements | string[] | ✅ | 要件リスト |
| submit | string | ✅ | 提出方法 |
| review | string | ✅ | 評価観点 |

---

## window.SKILLCHECKS

| 項目 | 内容 |
|------|------|
| 目的 | SC問題定義 |
| ファイル | data/skillchecks.js |

### 構造

```javascript
{
  p00: { questions: [ { id, question, answer, hint, explanation } ] },
  p01: { ... },
  ...
}
```

---

## window.GLOSSARY / COMMON_ERRORS

| 変数 | 目的 | ファイル |
|------|------|---------|
| GLOSSARY | 用語集（約70語）| glossary.js |
| GLOSSARY_ERRORS | エラー用語 | glossary.js |
| COMMON_ERRORS | よくあるエラーと解決策 | glossary.js |
| GLOSSARY_EXTRA_TERMS | 追加用語集 | glossary.js |

---

## Hoku関連データ

| 変数 | 目的 | ファイル |
|------|------|---------|
| HOKU_MENTOR | Hoku基本設定（役割・できること・テンプレート等）| hoku.js |
| HOKU_PHASE_SUPPORT | Phase別Hoku支援データ（13Phase）| hoku-phase-support.js |
| HOKU_TEMPLATES | テンプレート10種（body文字列）| hoku-phase-support.js |
| HOKU_IMG_MAIN | メインHoku画像base64 URI | hoku-assets.js |
| HOKU_IMGS | 表情別画像8種（smile/thinking/pointing等）| hoku-assets.js |
| HOKU_CONTEXT_MAP | コンテキスト別表情マッピング | hoku-assets.js |

---

## LocalStorage キー一覧

| キー | 型 | 用途 | 初期値 |
|------|-----|------|--------|
| `fcc:v2:donePhases` | JSON Array | 完了Phase IDリスト | [] |
| `fcc:v2:doneLessons` | JSON Array | 完了Lesson IDリスト | [] |
| `fcc_done_lessons` | JSON Array | 旧形式（互換）| [] |
| `hokuFloatPos` | JSON {x,y} | Hokuバブル位置 | null |
| `hokuOpen` | Number | パネル開閉状態 | 0 |
