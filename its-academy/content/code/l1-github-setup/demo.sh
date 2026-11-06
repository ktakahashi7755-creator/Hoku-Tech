# GitHub に接続するための SSH 鍵を作る (パスフレーズは確認用に空にしている。実際は設定する)
set -e
mkdir -p keys
ssh-keygen -q -t ed25519 -C "hanako@example.com" -N "" -f keys/id_ed25519

echo "作成されたファイル:"
ls keys
echo "公開鍵 (GitHub に登録する方) の種類とコメント:"
cut -d' ' -f1,3 keys/id_ed25519.pub
echo "秘密鍵 (自分だけが持つ方) の権限: $(stat -c '%a' keys/id_ed25519)"
