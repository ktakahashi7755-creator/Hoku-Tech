#!/usr/bin/env bash
# AI に貼る前に、秘密情報と個人情報の候補を見つけて伏せ字にする (使い方: bash mask.sh ファイル名)
# 完全には見つけられないので、最後は必ず自分の目で確認する
file="$1"
echo "--- 見つかった候補"
grep -nE '(password|passwd|secret|token|api[_-]?key)[[:space:]]*[=:]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}|0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}' "$file" \
  | sed -E 's/^([0-9]+):.*/  \1 行目/'
echo "--- 伏せ字にした内容"
sed -E \
  -e 's/((password|passwd|secret|token|api[_-]?key)[[:space:]]*[=:][[:space:]]*).*/\1****/I' \
  -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/<メールアドレス>/g' \
  -e 's/0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}/<電話番号>/g' \
  "$file"
