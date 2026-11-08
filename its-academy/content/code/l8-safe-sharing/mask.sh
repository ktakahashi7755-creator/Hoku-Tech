#!/usr/bin/env bash
# AI に貼る前に、秘密情報と個人情報の候補を見つけて伏せ字にする (使い方: bash mask.sh ファイル名)
# 完全には見つけられないので、最後は必ず自分の目で確認する
file="$1"
# 大文字・小文字を区別しない (PASSWORD= や Api_Key: も見つける)。Mac の sed には /I がないため、[Pp][Aa]... の形にする
# (Mac に入っている bash 3.2 でも動くよう、大文字への変換は tr で行う)
ci() { local out="" c i; for ((i = 0; i < ${#1}; i++)); do c="${1:i:1}"; case "$c" in [a-z]) out="$out[$(printf '%s' "$c" | tr a-z A-Z)$c]" ;; *) out="$out$c" ;; esac; done; printf '%s' "$out"; }
keys="($(ci password)|$(ci passwd)|$(ci secret)|$(ci token)|$(ci api)[_-]?$(ci key))"
echo "--- 見つかった候補"
grep -inE "${keys}[[:space:]]*[=:]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,}|0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}" "$file" \
  | sed -E 's/^([0-9]+):.*/  \1 行目/'
echo "--- 伏せ字にした内容"
sed -E \
  -e "s/(${keys}[[:space:]]*[=:][[:space:]]*).*/\\1****/" \
  -e 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/<メールアドレス>/g' \
  -e 's/0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}/<電話番号>/g' \
  "$file"
