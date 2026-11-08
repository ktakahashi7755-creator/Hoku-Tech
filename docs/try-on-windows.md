# 自分の Windows PC で ITS ENGINEER ACADEMY を触る (お試し用)

見本データ入りのアプリを、自分の PC の中だけで動かす手順。インターネットには公開しない。
所要時間: 初回 15〜30 分 (ダウンロードとビルドの待ち時間を含む)。2 回目からは 1 分ほど。

> この手順は、本番と同じ Docker の構成を、お試し用の設定 (HTTP・見本データ) で動かすもの。
> 2026-11-08 に同じ設定で起動し、PC のブラウザとスマホ相当のブラウザ (同じネットワークの IP アドレス) でログインできることを確認した。
> Windows の画面での操作は未確認のため、うまくいかない場合はエラーの表示を Claude Code に伝える。

## 1. 準備 (1 回だけ)

1. **Docker Desktop** を入れる: <https://www.docker.com/products/docker-desktop/> から Windows 版をダウンロードしてインストールし、PC を再起動する。
   * 起動すると画面右下のタスクトレイにクジラのアイコンが出る。「Engine running」になるまで待つ。
   * 初回に WSL2 の更新を求められたら、表示に従う。
   * Docker Desktop は、従業員 250 人未満かつ年間売上 1,000 万ドル未満の会社・個人・教育目的では無料。それを超える会社は有料のプランが必要 (Docker 社の規約。条件は変わることがあるため、導入前に Docker 社のサイトで最新の条件を確認する)。
2. **PowerShell** を開く (スタートメニューで「PowerShell」と入力)。

## 2. ダウンロードと起動

PowerShell に、次を 1 ブロックずつ貼り付けて Enter を押す。

```powershell
# (1) アプリ一式をダウンロードして、ドキュメント フォルダに展開する
cd $HOME\Documents
Invoke-WebRequest -Uri "https://github.com/ktakahashi7755-creator/Hoku-Tech/archive/refs/heads/claude/sharp-bohr-4wbemd.zip" -OutFile its-academy.zip
Expand-Archive its-academy.zip -DestinationPath its-academy-trial -Force
cd "its-academy-trial\Hoku-Tech-claude-sharp-bohr-4wbemd\its-academy"
```

```powershell
# (2) お試し用の設定ファイルを作る (DB のパスワードはランダムに作る。この PC の中だけで使う)
$pw = -join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
@("POSTGRES_PASSWORD=$pw", "APP_ENV=local", "COOKIE_SECURE=false") | Set-Content -Encoding ascii .env.docker
```

```powershell
# (3) 起動する (初回は 5〜15 分かかる。最後に Healthy と出れば成功)
docker compose --env-file .env.docker up -d --build --wait
```

```powershell
# (4) 見本データ (受講生・講師・管理者のアカウントと学習の記録) を入れる
docker compose --env-file .env.docker --profile demo run --rm seed
```

## 3. 触る

ブラウザで <http://localhost:3000> を開き、次のどれかでログインする (パスワードはすべて `its-dev-password-2026`)。

| 立場 | メールアドレス |
|------|----------------|
| 受講生 | `student@its.example` (ほかに student2〜4) |
| 講師 | `instructor@its.example` |
| 管理者 | `admin@its.example` |

## 4. スマホでも触る (同じ Wi-Fi の中だけ)

1. 設定ファイルにスマホからの接続を許す 1 行を足して、起動し直す。

   ```powershell
   Add-Content -Encoding ascii .env.docker "APP_BIND=0.0.0.0"
   docker compose --env-file .env.docker up -d --wait
   ```

2. PC の IP アドレスを調べる。

   ```powershell
   (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -match 'Wi-Fi|Ethernet|イーサネット' -and $_.IPAddress -notlike '169.*' }).IPAddress
   ```

3. スマホを PC と同じ Wi-Fi につなぎ、ブラウザで `http://<上の IP アドレス>:3000` を開く (例: `http://192.168.1.23:3000`)。
4. 開けない場合は、Windows のファイアウォールで受信を許可する (PowerShell を「管理者として実行」して 1 回だけ):

   ```powershell
   New-NetFirewallRule -DisplayName "ITS Academy (trial)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
   ```

   Wi-Fi のネットワークの種類が「パブリック」の場合は許可されない。自宅・社内の信頼できる Wi-Fi だけで、種類を「プライベート」にして試す。

> 注意: 見本データのパスワードは公開されている (この手順書にも書いてある)。同じ Wi-Fi の人なら誰でもログインできるため、
> カフェなどの共用 Wi-Fi では行わない。試し終わったら下の手順で止め、`APP_BIND=0.0.0.0` の行を消す。

## 5. 止める・やり直す・消す

```powershell
cd "$HOME\Documents\its-academy-trial\Hoku-Tech-claude-sharp-bohr-4wbemd\its-academy"
docker compose --env-file .env.docker stop                       # 止める (データは残る。再開は up -d)
docker compose --env-file .env.docker --profile demo run --rm seed   # 見本データを最初の状態に戻す
docker compose --env-file .env.docker down -v                    # すべて消す (データも消える)
```

最新の版に更新するときは、§2 の (1) からやり直す (古いフォルダは消してよい)。

## 6. うまくいかないとき

| 症状 | 対処 |
|------|------|
| `docker` が見つからない | Docker Desktop が起動しているか (タスクトレイのクジラ)、PowerShell を開き直したかを確認する |
| (3) で止まる・失敗する | もう一度 (3) を実行する (ダウンロードの途中で切れた場合)。それでも失敗するときは、表示の最後の 20 行を Claude Code に伝える |
| ログインしても戻される | 設定ファイルに `COOKIE_SECURE=false` があるか確認し、`docker compose --env-file .env.docker up -d --build --wait` で作り直す |
| `localhost:3000` が使用中 | ほかのアプリがポート 3000 を使っている。そのアプリを止めてから (3) を実行する |
