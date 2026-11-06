# エラーの相談で設定ファイルを AI に見せる前に、伏せ字にする
dir="$(dirname "$0")"
bash "$dir/mask.sh" "$dir/application.properties"
