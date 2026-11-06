#!/usr/bin/env bash
# バックアップからの復元 (docs/deployment-guide.md §6)
#
#   DATABASE_URL=postgresql://.../its_academy_restore scripts/restore.sh backups/its_academy-....dump
#
# 復元先のデータベースの既存データは置き換わる。本番に戻す前に、別のデータベースへ復元して中身を確認すること。
# 実行には確認の入力が必要 (RESTORE_CONFIRM=yes で省略可。自動の復元テスト用)。
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL を設定してください (復元先)}"
file="${1:?復元するバックアップファイルを指定してください}"
[ -f "$file" ] || { echo "ファイルがありません: $file" >&2; exit 2; }

pg_restore --list "$file" > /dev/null
target="$(psql "$DATABASE_URL" -Atc 'SELECT current_database()')"

if [ "${RESTORE_CONFIRM:-}" != "yes" ]; then
  printf 'データベース "%s" の内容を %s で置き換えます。続けるには yes と入力: ' "$target" "$file"
  read -r answer
  [ "$answer" = "yes" ] || { echo "中止しました"; exit 1; }
fi

pg_restore --clean --if-exists --no-owner --no-privileges --single-transaction --exit-on-error \
  --dbname="$DATABASE_URL" "$file"
echo "復元しました: $target"
