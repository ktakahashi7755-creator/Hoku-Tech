#!/usr/bin/env bash
# データベースのバックアップ (docs/deployment-guide.md §6)
#
#   DATABASE_URL=postgresql://... scripts/backup.sh
#
# 環境変数:
#   DATABASE_URL           必須。接続文字列 (ログには出さない)
#   BACKUP_DIR             保存先 (既定: ./backups)。暗号化されたディスク等、受講生の個人情報を置いてよい場所にする
#   BACKUP_RETENTION_DAYS  これより古いバックアップを削除する日数 (既定: 14)
#
# 出力: its_academy-YYYYMMDDTHHMMSSZ.dump (pg_dump のカスタム形式。pg_restore で戻す)
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL を設定してください}"
. "$(dirname "$0")/pg-env.sh"
pg_url_without_password "$DATABASE_URL"
dir="${BACKUP_DIR:-./backups}"
days="${BACKUP_RETENTION_DAYS:-14}"
case "$days" in ''|*[!0-9]*) echo "BACKUP_RETENTION_DAYS は 0 以上の整数で指定してください" >&2; exit 2 ;; esac

umask 077
mkdir -p "$dir"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
out="$dir/its_academy-$stamp.dump"
tmp="$out.partial"

# 途中で失敗したときに壊れたファイルを残さない
trap 'rm -f "$tmp"' EXIT
pg_dump --format=custom --no-owner --no-privileges --dbname="$PG_URL" --file="$tmp"
# 読み戻せることを確認してから正式な名前にする
pg_restore --list "$tmp" > /dev/null
mv "$tmp" "$out"
trap - EXIT

echo "保存しました: $out ($(wc -c < "$out") bytes)"

# 保持期間を過ぎたものを削除 (このスクリプトが作った名前のファイルだけが対象)
find "$dir" -maxdepth 1 -type f -name 'its_academy-*.dump' -mtime +"$days" -print -delete | sed 's/^/削除しました: /'
