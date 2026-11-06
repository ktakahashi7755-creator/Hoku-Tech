#!/usr/bin/env bash
# 開発環境の確認スクリプト。WSL2 (Ubuntu) と macOS のターミナルで実行する: bash check-env.sh
# すべて [OK] になれば、このコースで使う環境がそろっている

ng=0
ok()  { echo "[OK] $1"; }
bad() { echo "[NG] $1 → $2"; ng=$((ng + 1)); }

# 1. Java 21 以上 (java -version の 1 行目から主バージョンを取り出す)
if command -v java >/dev/null; then
  major=$(java -version 2>&1 | grep -v JAVA_TOOL | head -1 | sed -E 's/.*version "([0-9]+).*/\1/')
  if [ "$major" -ge 21 ] 2>/dev/null; then ok "Java 21 以上 (java)"; else bad "Java 21 以上 (java)" "JDK 21 をインストールしてください"; fi
else
  bad "Java 21 以上 (java)" "JDK 21 をインストールしてください"
fi

# 2. コンパイラ (JRE ではなく JDK が入っているか)
command -v javac >/dev/null && ok "javac (JDK)" || bad "javac (JDK)" "JRE ではなく JDK をインストールしてください"

# 3. Maven
command -v mvn >/dev/null && ok "Maven (mvn)" || bad "Maven (mvn)" "Maven をインストールしてください"

# 4. Git と名前・メールアドレスの設定
if command -v git >/dev/null; then
  ok "Git"
  if [ -n "$(git config --global user.name)" ] && [ -n "$(git config --global user.email)" ]; then
    ok "Git の名前とメールアドレス"
  else
    bad "Git の名前とメールアドレス" "git config --global user.name / user.email を設定してください"
  fi
else
  bad "Git" "Git をインストールしてください"
fi

# 5. PostgreSQL (クライアントと、サーバーへの接続)
command -v psql >/dev/null && ok "PostgreSQL クライアント (psql)" || bad "PostgreSQL クライアント (psql)" "PostgreSQL をインストールしてください"
if command -v pg_isready >/dev/null && pg_isready -h localhost -p 5432 -q; then
  ok "PostgreSQL サーバー (localhost:5432)"
else
  bad "PostgreSQL サーバー (localhost:5432)" "PostgreSQL を起動してください"
fi

echo "---"
if [ "$ng" -eq 0 ]; then echo "すべての確認が完了しました"; else echo "$ng 件の項目を確認してください"; fi
