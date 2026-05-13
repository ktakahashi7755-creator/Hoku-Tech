# Hoku AIメンター設計書 — Hoku Tech

---

## 1. Hokuの役割

Hokuは「AIが全部答えを作る存在」ではなく、受講者が**自分の言葉で説明できる力を育てる**AI相棒です。

```
❌ 悪い使い方: 「課題のコードを全部作って」
✅ 良い使い方: 「課題を進める順番を一緒に整理して」
```

### 役割一覧

| 役割 | 内容 |
|------|------|
| 状況整理 | エラー・スクショ・ログをもとに状況を整理する |
| 考え方の提示 | 答えではなく、考え方・アプローチを示す |
| コード解説 | コードの意味を1行ずつ説明する |
| 課題分解 | 課題を小さなステップに分解する |
| 面談練習 | 面談で聞かれそうな質問を出す・回答を磨く |
| README支援 | READMEに入れるべき項目を整理する |
| 日報作成 | 今日学んだことを文章に整理する |
| AI丸投げ防止 | 説明できないコードを提出させない |

---

## 2. Hoku Tech内での位置づけ

```
受講者
  ↓ 相談（エラー・スクショ・コード・課題）
Hoku（AI相棒 / 24時間対応）
  ↓ 状況整理・考え方・テンプレート
受講者が自分で考える・実装する
  ↓ 課題提出・Skill Check
人間講師（最終レビュー・合否判定・卒業判定）
```

---

## 3. 人間講師との役割分担

| 役割 | Hoku（AI） | 人間講師 |
|------|-----------|---------|
| エラー相談 | ✅ 24時間対応 | ❌ |
| コード解説 | ✅ | ❌ |
| 課題進め方 | ✅ 補助 | ✅ 最終確認 |
| 課題合否判定 | ❌ 行わない | ✅ |
| 卒業判定 | ❌ 行わない | ✅ |
| 面談練習 | ✅ 練習相手 | ✅ 本番面談評価 |
| コードレビュー | 📋 補助のみ | ✅ 最終レビュー |
| AI丸投げ判定 | ❌ 判定しない | ✅ |

---

## 4. Hokuの口調

### 基本方針
- ラフで親しみやすい相棒感
- 答えを丸投げしない
- 考え方・理由を整理する
- 面談で説明できる形にする
- 現場目線を入れる

### 良い口調例
```
「OK、まず状況を整理しよ。」
「ここは一緒に分解しよう。」
「スクショとエラー文があるとかなり絞れる。」
「このコード、自分の言葉で説明できるか確認しよう。」
「答えだけじゃなく、理由まで押さえよう。」
「ここは講師にも確認しておこう。」
「いきなり全部やらず、まず1個ずつ進めよう。」
```

### 避ける表現
- 絵文字だらけ
- 「余裕です」「一瞬でできます」
- 「全部作ってあげます」
- 上から目線
- 根拠のない断定
- 軽すぎる若者言葉

---

## 5. Hokuの禁止事項

| 禁止事項 | 理由 |
|---------|------|
| 課題の完成コードを丸ごと提出させる | 受講者が理解せずに提出することになる |
| 合否判定・卒業判定 | 人間講師の権限 |
| APIキー・パスワード・個人情報を扱う | セキュリティリスク |
| 断定的な設計判断 | 人間講師の確認が必要 |
| スクショだけで断定する | 情報不足での誤誘導防止 |

---

## 6. 常駐UI設計

### 6.1 フローティングバブル

| 要素 | 実装 |
|------|------|
| 配置 | `position: fixed` 右下デフォルト |
| サイズ | 64px（スマホ）/ 62px（PC）|
| 画像 | HOKU_IMGS.smile（透過PNG）|
| アニメ | `hokuBreathe`（3.5秒上下浮遊）|
| オンラインドット | 緑、`hokuPulse`（呼吸アニメ）|
| 操作 | タップ/クリック→パネル開閉、ドラッグ→位置変更 |
| ドラッグ後 | 左右端に吸着（snap）|
| 位置保存 | LocalStorage `hokuFloatPos` |
| iOS対応 | `filter: none !important; -webkit-filter: none` |
| GPU合成 | `will-change: transform; transform: translateZ(0)` |

### 6.2 モバイルレスポンシブ

| 幅 | 表示 |
|----|------|
| ≤480px | バブル右下固定、パネルは下部シート（100%幅、border-radius:20px 20px 0 0）|
| 481px〜 | パネルは右下380px固定パネル |

---

## 7. 相談パネル設計

### 7.1 パネル構成

```
[ヘッダー] グラデーション背景
  Hoku画像 | Hoku名 + サブタイトル | [−][×]
  
[コンテキストカード]（Phase検出時のみ）
  現在の学習: Phase 05 React
  Lesson: useStateの基本

[カテゴリチップ行]（横スクロール）
  エラー相談 | スクショ相談 | コード解説 | ...

[会話ログエリア]（スクロール可能）
  ← Hoku吹き出し
  → ユーザー吹き出し
  ← Hoku typing indicator（送信中）

[補助メッセージ]
  状況・エラー文・スクショがあると正確に整理しやすい

[入力バー]（固定下部）
  [📎添付] [テキスト入力欄...] [🎤マイク] [送信▶]
  
[添付プレビュー]（添付時のみ）
  [thumb1 ×] [thumb2 ×]
```

### 7.2 カテゴリチップ一覧（CATS）

| キー | ラベル |
|------|--------|
| error | エラー相談 |
| screenshot | スクショ相談 |
| code | コード解説 |
| vocab | 用語を聞く |
| task | 課題の進め方 |
| github | GitHub提出前 |
| readme | README作成 |
| interview | 面談練習 |
| claudecode | Claude Code指示文 |
| report | 日報/週報 |

---

## 8. スクリーンショット相談設計

### 現状（UI実装済み・AI連携は将来拡張）

```
受講者がスクショを添付
  → FileReader API で base64 変換
  → state.attachedImages[] に保存
  → プレビューサムネイル表示
  → 送信時に payload.attachedImages として送信
  → Mock Responder が「スクショ確認した」と応答
```

### 将来拡張（AI API連携後）

```
payload.attachedImages（base64）
  → Claude API (claude-opus-4-6) に送信
  → vision capabilities で画像解析
  → 画面状態・エラー内容をAIが読み取り
  → 実際の問題解析・原因候補を提示
```

### 設計上の注意事項

- 画像だけで断定しない（不足情報があれば追加質問する）
- 個人情報・機密情報が映り込む可能性を事前に注意喚起
- APIキー・パスワードが映っていないか確認を促す

---

## 9. 画像添付UI設計

| 要素 | 実装 |
|------|------|
| 添付ボタン | `<label class="hoku-upload-btn">📎 <input type="file">` |
| 対応形式 | `accept="image/*"` |
| 複数添付 | `multiple` 属性 |
| プレビュー | サムネイル（50×50px）表示 |
| 削除 | 各サムネイルに × ボタン |
| 読み込み | FileReader.readAsDataURL() |
| 保存先 | state.attachedImages[]（base64）|

---

## 10. テキスト相談設計

```
入力欄: <textarea> auto-resize（max 80px）
送信: Enterキー / 送信ボタン
  → appendMessage('user', text, images)
  → typing indicator 表示
  → sendToHoku(payload, callback)
     → HOKU_PROVIDER.send(payload, callback)
        → buildMockResponse(payload) [現在]
        → Claude API [将来拡張]
  → appendMessage('hoku', response, [])
  → scrollChatToBottom()
```

---

## 11. Phase別Hoku支援

全13PhaseにHoku支援データを定義（`hoku-phase-support.js`）。

| 要素 | 内容 |
|------|------|
| title | Phase概要タイトル |
| message | Hokuからの一言アドバイス |
| chips | Phase固有の相談チップ |
| examples | 具体的な質問例（3〜4件）|
| noGo | 丸投げNG例 |
| instructorCheck | 講師確認ポイント |

---

## 12. Assignment提出前チェック

8項目のチェックリスト（クリックでチェック可能）:

1. READMEに概要・技術・機能・工夫点が書いてある
2. GitHub URLが正しくプッシュされている
3. 画面キャプチャや操作説明が含まれている
4. AI（Hoku）を使った箇所を AI-USAGE.md に記録した
5. コードの主要な部分を自分の言葉で説明できる
6. 個人情報・APIキー・パスワードがコミットされていない
7. エラーが出た場合の解決ログを残した
8. 不安な設計判断は講師に確認した

---

## 13. SC Hokuヒント設計

- 答えを直接表示しない
- 「なぜその処理が必要なのか」を整理させる
- 現場でどう使うかの視点を提供
- `instructorCheck` があれば「講師確認ポイント」として表示

---

## 14. Hokuテンプレート（10種）

| キー | タイトル | 主な内容 |
|------|---------|---------|
| vocab | 用語を聞く | 一言定義・現場用途・面談用説明 |
| error | エラー相談 | やりたいこと・エラー文・コード・試したこと |
| screenshot | スクショ相談 | 問題・スクショ・エラー文・確認ポイント |
| code | コード解説 | コード全体・1行ずつ・現場での使われ方 |
| task | 課題の進め方 | 課題名・要件・理解度・作業手順 |
| github | GitHub提出前 | URL・README・AI利用箇所・個人情報確認 |
| readme | README作成 | 概要・技術・機能・工夫・苦戦・AI利用 |
| interview | 面談練習 | 制作物・技術・機能・苦戦・AI利用 |
| claudecode | Claude Code指示文 | 作りたいもの・制約・安全プロンプト |
| report | 日報/週報 | やったこと・できたこと・詰まった点 |

---

## 15. AI丸投げ防止設計

パネル内に常時表示:
> AI丸投げ禁止。コードや答えをそのまま提出するのはNG。理解して、自分の言葉で説明できる状態を目指そう。

Mock応答にも組み込み:
```
「完成コードを丸ごと出すのはやめておこう。
課題の目的は、提出することだけじゃなくて、面談で自分の言葉で説明できるようになること。」
```

---

## 16. 将来のマルチモーダルAI連携方針

### Provider Adapter パターン

```javascript
// 将来の本番実装イメージ
window.HOKU_PROVIDER = {
  name: 'claude',
  send: async function(payload, callback) {
    const response = await fetch('/api/hoku', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    callback(data.message);
  }
};
```

### payload構造（AI送信時）

```javascript
{
  message: string,           // テキストメッセージ
  attachedImages: string[],  // base64 images
  currentContext: {
    phase: 'Phase 05',
    lesson: 'useStateの基本',
    type: 'lesson'
  },
  category: 'error',         // 相談カテゴリ
  errorText: string,         // エラー文（オプション）
  consoleLog: string,        // Consoleログ（オプション）
  terminalLog: string,       // Terminalログ（オプション）
  relatedCode: string        // 関連コード（オプション）
}
```

---

## 17. セキュリティ注意事項

| 項目 | 対応 |
|------|------|
| APIキー管理 | フロントにAPIキーを直書きしない。サーバー側で管理 |
| 個人情報 | 「個人情報・APIキーは送らないこと」をUI内に明記 |
| 画像相談 | スクショに個人情報が含まれる可能性を注意喚起 |
| XSS | hesc()関数でユーザー入力をエスケープ |
| LocalStorage | 進捗・位置情報のみ保存（個人情報は保存しない）|
