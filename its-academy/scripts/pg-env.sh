# backup.sh / restore.sh から読み込む。DATABASE_URL のパスワードを PGPASSWORD に移し、
# コマンドライン (ps で他の利用者から見える) にパスワードを載せないようにする。
# 結果は PG_URL (パスワードを除いた接続文字列)。
pg_url_without_password() {
  local url="$1" re='^(postgres(ql)?://)([^:@/]+):([^@]*)@(.*)$'
  if [[ "$url" =~ $re ]]; then
    local encoded="${BASH_REMATCH[4]}"
    # %xx 形式のパーセントエンコードを戻す
    PGPASSWORD="$(printf '%b' "${encoded//%/\\x}")"
    export PGPASSWORD
    PG_URL="${BASH_REMATCH[1]}${BASH_REMATCH[3]}@${BASH_REMATCH[5]}"
  else
    PG_URL="$url"
  fi
}
