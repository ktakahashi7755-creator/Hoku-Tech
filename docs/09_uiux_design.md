# UI/UX設計書 — Hoku Tech

---

## 1. デザインコンセプト

「法人研修でも違和感のない信頼感」と「Hokuの親しみやすい相棒感」の両立。

プロフェッショナルな学習環境でありながら、受講者が「相談しやすい」「続けやすい」と感じるデザインを目指す。
安っぽくなく、かつ堅すぎない。現場エンジニアが使っても恥ずかしくない品質を基準とする。

---

## 2. ブランドトーン

| 軸 | 方向性 |
|----|--------|
| プロフェッショナル ↔ 親しみやすい | 中央よりやや親しみやすい寄り |
| 清潔感 ↔ 温かみ | 中央 |
| シンプル ↔ 情報量豊富 | 中央よりシンプル寄り |
| 堅さ ↔ カジュアル | 中央よりやや堅め（法人向けを考慮）|

---

## 3. カラーシステム（CSS変数）

### ベースカラー

| 変数 | 値 | 用途 |
|------|-----|------|
| `--bg` | #ffffff | 背景（白）|
| `--bg-soft` | #f8fafc | 薄い背景（セクション）|
| `--bg-muted` | #f1f5f9 | ミュート背景 |
| `--sidebar-bg` | #fafbfc | サイドバー背景 |

### テキストカラー

| 変数 | 値 | 用途 |
|------|-----|------|
| `--ink` | #0f172a | 本文テキスト（最も濃い）|
| `--ink-2` | #334155 | 副見出し・重要テキスト |
| `--ink-3` | #64748b | サブテキスト・説明 |
| `--ink-4` | #94a3b8 | プレースホルダー・補足 |

### ブランドカラー

| 変数 | 値 | 用途 |
|------|-----|------|
| `--brand` | #2563eb | メインブランドブルー（CTA・リンク）|
| `--brand-h` | #1d4ed8 | ホバー時ブランドブルー |
| `--brand-soft` | #eff6ff | ブランドカラー薄め（背景強調）|
| `--brand-ink` | #1e3a8a | 濃いブランドブルー（テキスト強調）|

### ステータスカラー

| 変数 | 値 | 用途 |
|------|-----|------|
| `--green` | #16a34a | 完了・成功・オンライン |
| Hokuグラデ始点 | #1d4ed8 | パネルヘッダー左 |
| Hokuグラデ終点 | #0891b2 | パネルヘッダー右 |

### ライン・ボーダー

| 変数 | 値 | 用途 |
|------|-----|------|
| `--line` | #e2e8f0 | ボーダー（標準）|
| `--line-soft` | #f1f5f9 | ボーダー（薄め）|

---

## 4. タイポグラフィ

| 要素 | サイズ | 太さ | 備考 |
|------|--------|------|------|
| H1（メインコピー）| 1.8〜2.2rem | 800 | スマホは1.4〜1.6rem |
| H2（セクション見出し）| 1.3〜1.5rem | 700 | |
| H3（カード見出し）| 1.1rem | 700 | |
| 本文 | 0.9〜0.95rem | 400 | line-height: 1.7 |
| コード | 0.82〜0.88rem | — | JetBrains Mono / Fira Code |
| 小テキスト | 0.75〜0.82rem | 500〜600 | ラベル・バッジ |
| Hokuチャット | 0.84rem | 400 | line-height: 1.65 |

フォントスタック:
```css
font-family: 'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', system-ui, sans-serif;
```

---

## 5. コンポーネントデザイン方針

### カード

```css
border-radius: 10〜18px    /* 角丸（大きめ）*/
box-shadow: 0 4px 16px rgba(37,99,235,.07)  /* 薄い青みがかった影 */
border: 1px solid var(--line)  /* 細いボーダー */
/* hover時 */
border-color: var(--brand)
box-shadow: 0 8px 24px rgba(37,99,235,.12)
```

### ボタン（メイン）

```css
background: var(--brand)
color: white
border-radius: 8px
padding: 10px 20px
font-weight: 700
/* hover */
background: var(--brand-h)
transform: translateY(-1px)
```

### 入力欄

```css
border: 1px solid var(--line)
border-radius: 17px  /* Hoku入力欄 */
background: var(--bg-soft)
/* focus */
border-color: var(--brand)
background: white
```

### コードブロック

```css
background: #1a1f2e  /* ダークテーマ */
color: #e2e8f0
font-family: 'JetBrains Mono', 'Fira Code', monospace
border-radius: 8px
padding: 16px
font-size: 0.82rem
line-height: 1.7
```

---

## 6. Hokuキャラクターデザイン方針

| 要素 | 方針 |
|------|------|
| キャラクター | 星型・黄色・青リボン（子供っぽすぎず、親しみやすい）|
| 背景 | 透過PNG（白背景・青背景なし）|
| アニメーション | 軽い上下浮遊（3.5秒ループ）+ グリーンドットの呼吸 |
| サイズ | 64px（スマホ）/ 62px（PC）|
| 影 | filter: none（iOS SafariのCSSバグ回避）|
| 法人適合 | 安っぽくなく、かつ堅すぎない親しみやすさ |

---

## 7. レスポンシブ設計

| ブレークポイント | 幅 | 主な変更 |
|------------|-----|---------|
| スマホ | ≤480px | グリッド1カラム・Hokuパネル下部シート |
| 大型スマホ | 481〜767px | 一部2カラム |
| タブレット | 768〜1023px | サイドバー表示・2〜3カラム |
| PC | 1024px〜 | 最大幅1400px・余白充実 |

**横スクロール防止（最優先）**:
```css
body, #app { max-width: 100vw; overflow-x: hidden; }
* { box-sizing: border-box; }
/* 固定幅要素は max-width: 100% で上書き */
```

---

## 8. 情報設計・導線設計

### Phase学習導線

```
ホーム（Hoku Tech概要・CTAボタン）
  → Phase一覧（13Card・検索・フィルター）
    → Phase詳細（目標・Chapter一覧）
      → Lesson詳細（本文・コード・自己説明）
        → Assignment（課題・提出前チェック）
          → Skill Check（理解度確認）
            → 次のPhaseへ
```

### Hoku相談導線

```
全画面（バブル常駐）
  → タップ → 相談パネル開く
    → カテゴリチップ選択 → テンプレート表示 → コピー → 入力欄に貼り付け
    → スクショ添付 → テキスト補足 → 送信
    → Mock応答 → 状況整理 → 自分で考える
```

### 課題提出導線

```
Assignment詳細
  → Hoku提出前チェック（8項目）
  → GitHub push
  → README確認
  → 講師にURL送付
  → 講師レビュー → 合否判定
```

---

## 9. アクセシビリティ

| 観点 | 対応 |
|------|------|
| タッチターゲット | 最小44×44px |
| コントラスト | 本文4.5:1以上（--ink / --bg）|
| フォーカス | outlineを削除しない |
| alt属性 | 全img要素に付与 |
| aria-label | ボタン・アイコンに付与 |
| フォントサイズ | 最小14px |

---

## 10. アニメーション方針

| アニメーション | 目的 | 実装 |
|------------|------|------|
| hokuBreathe | Hokuキャラクターの「生きている感」| translateY(-5px) 3.5秒ループ |
| hokuPulse | オンラインドットの「活性感」| box-shadow pulse 2.5秒ループ |
| パネル開閉 | 自然な展開感 | scale(.88)→1 + translateY 0.22秒 |
| typing | Hokuが考えている感 | 3点dot bounce |
| hoverアニメ | インタラクション感 | transform: translateY(-2px) |

**重要**: iOS Safariでは `filter` プロパティを使用しない。`will-change: transform; transform: translateZ(0)` でGPU合成を使用。

---

## 11. 改善余地（優先度順）

| 改善項目 | 優先度 | 難易度 |
|---------|--------|--------|
| 用語集の検索ハイライト | 中 | 低 |
| Phase詳細の図解追加（全Phase）| 中 | 中 |
| ダークモード対応 | 低 | 高 |
| SC問題の画像対応 | 低 | 中 |
| 進捗可視化グラフ | 低 | 中 |
| アニメーション速度のユーザー設定 | 低 | 中 |
