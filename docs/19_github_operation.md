# GitHub運用ルール — Hoku Tech

---

## 1. ブランチ戦略

```
main          ← 安定リリース版（直接pushは禁止）
develop       ← 開発統合ブランチ（PRのマージ先）
feature/xxx   ← 機能追加
fix/xxx       ← バグ修正（通常）
hotfix/xxx    ← 緊急バグ修正（mainへ直接PR）
docs/xxx      ← ドキュメント更新
refactor/xxx  ← リファクタリング
```

### ブランチ命名例

```
feature/hoku-drag-ios
fix/snap-undefined-error
docs/update-instructor-manual
hotfix/ios-script-error
```

---

## 2. コミットメッセージルール

### プレフィックス一覧

| プレフィックス | 用途 | 例 |
|-------------|------|-----|
| `feat:` | 新機能追加 | `feat: Hokuパネルに画像添付プレビューを追加` |
| `fix:` | バグ修正 | `fix: snap関数undefined修正` |
| `docs:` | ドキュメント更新 | `docs: 講師マニュアルを更新` |
| `style:` | フォーマット変更（機能変化なし）| `style: インデント統一` |
| `refactor:` | リファクタリング | `refactor: bindEventsをIIFEで整理` |
| `test:` | テスト追加・修正 | `test: Playwrightテストにドラッグ確認追加` |
| `chore:` | ビルド・設定変更 | `chore: build_full.py のdata_files順序修正` |
| `perf:` | パフォーマンス改善 | `perf: hoku-assets.jsの画像圧縮` |

### コミットメッセージ例

```
feat: HokuフローティングバブルのiOSタッチドラッグを改善

- touchmoveをbubble要素に直接バインド（passive:false）
- e.preventDefault()でスクロールを抑制
- テスト: 17/17 × 5回全合格
```

### コミット前チェックリスト

```
□ node --check main.js 確認
□ node --check data/*.js 確認
□ build_full.py ビルド成功
□ Playwright 5回全合格
□ JSエラー 0件
□ 横スクロールなし（375/390/768/1440px）
□ 準備中/TODO/ダミー表現なし
```

---

## 3. PR（Pull Request）ルール

### PRテンプレート

```markdown
## 変更内容
- [ 変更した機能・修正内容 ]

## 変更ファイル
- assets/js/main.js: [ 変更概要 ]
- assets/css/style.css: [ 変更概要 ]
- data/xxx.js: [ 変更概要 ]

## テスト結果
- [ ] node --check: ✅ OK
- [ ] ビルド成功: ✅ OK / Size: xxx KB
- [ ] Playwright: 5回中 [ ] /5合格
- [ ] JSエラー: 0件
- [ ] 横スクロール: なし（375/390/768/1440px）
- [ ] `[Hoku]` エラー: 0 件 (旧 `[FCC]` ラベル両方を検査)

## レビュー観点
- [ iOS Safari対応コードが入っているか ]
- [ 新規CSSで横スクロールが発生していないか ]
- [ 準備中/TODO/ダミーがないか ]
```

---

## 4. レビュー観点

| 観点 | チェック内容 |
|------|-----------|
| 構文チェック | node --checkエラーゼロ |
| テスト結果 | Playwright 5回全合格 |
| iOS対応 | try-catch・filter:none・passive:false等 |
| 横スクロール | scrollWidth確認 |
| 準備中/TODO除去 | 教材内にTODO・準備中・ダミーなし |
| 既存機能の破損確認 | Phase/Lesson/Assignment/SC/Hoku全動作 |
| ドキュメント更新 | 機能変更時はdocs/*.mdも更新 |

---

## 5. タグ・リリース管理

```
v1.0.0  ← メジャーリリース（大機能追加・構成変更）
v1.1.0  ← マイナーリリース（機能追加）
v1.0.1  ← パッチリリース（バグ修正）

例:
v1.0.0  Hoku Tech 初版リリース（静的教材完成）
v1.1.0  Hoku Float v2 リリース
v1.2.0  ドキュメント完成
v2.0.0  AI API連携リリース
```

---

## 6. 禁止事項

```
❌ main ブランチへの直接push
❌ フロントコードにAPIキーを直書き
❌ hoku-tech.html（ビルド出力）のGit管理（.gitignore対象）
❌ node_modules/ のコミット
❌ 外部CDN追加（オフライン動作を壊す）
❌ テスト未実施でのPRマージ
❌ 教材内の準備中/TODO/ダミー表現
```

---

## 7. .gitignore 設定

```
# ビルド出力
/mnt/user-data/outputs/
*.html.build

# Node.js
node_modules/
npm-debug.log*

# 機密情報
.env
.env.local
*.key
*.pem

# OS
.DS_Store
Thumbs.db

# バックアップ
*.zip
*.bak
```

---

## 8. Claude Code作業ログルール

Claude Codeで作業を行った場合、コミットメッセージに以下を含める:

```
[claude-code] feat: Hoku固定UIのiOS対応を改善

- touchmove passive:false で実装
- filter:none でiOS青背景バグを修正
- snap()関数を再追加
- テスト: 17/17 × 5 回全合格、`[Hoku]` エラー: 0 件 (旧 `[FCC]` ラベル両方を検査)
```

---

## 9. Issue運用

### Issueテンプレート（バグ報告）

```markdown
## 発生環境
- OS/ブラウザ: 
- 画面幅: 
- Hoku Techバージョン:

## 再現手順
1. 
2. 
3. 

## 期待結果
## 実際の結果
## スクリーンショット
## 関連コード
```

### Issueラベル

| ラベル | 用途 |
|--------|------|
| `bug` | バグ報告 |
| `feature` | 機能リクエスト |
| `docs` | ドキュメント |
| `ios` | iOS Safari関連 |
| `hoku` | Hoku AI関連 |
| `content` | 教材内容 |
| `priority-high` | 優先度高 |

---

## 10. ビルド成果物管理

| ファイル | Git管理 | 配布 |
|---------|---------|------|
| hoku-tech.html | ❌ .gitignore | 配布・ホスティング |
| fullstack-career-camp.html | ❌ .gitignore | 互換用 |
| fcc-source-v2.zip | ❌ .gitignore | バックアップ |
| v2/ 全ファイル | ✅ Git管理 | ソース管理 |
