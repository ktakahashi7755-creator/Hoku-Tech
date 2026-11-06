# 検証用: 受講生が初期設定を終えた状態 (Git の名前・メールアドレスを設定済み) で確認スクリプトを実行する
export GIT_CONFIG_GLOBAL="$PWD/gitconfig"
git config --global user.name "Yamada Hanako"
git config --global user.email "hanako@example.com"
bash check-env.sh
