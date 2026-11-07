# 検証用: 初期管理者のパスワードは毎回ランダムに作り、画面には表示しない
export ADMIN_PASSWORD=$(head -c 18 /dev/urandom | base64)
source ./verify-lib.sh
# 初期管理者は起動直後 (CommandLineRunner) に作られるので、作られるまで待つ
for i in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' -u "admin:$ADMIN_PASSWORD" "$BASE/api/me")" = 200 ] && break
  sleep 1
done
HANAKO=hanako:correct-horse-battery
call POST /api/users '{"username":"hanako","password":"correct-horse-battery"}'
call POST /api/users '{"username":"hanako","password":"another-long-password"}'
call POST /api/users '{"username":"Ken","password":"short"}'
call GET  /api/books
LABEL="ユーザー hanako、誤ったパスワード" AUTH=hanako:wrong-password call GET /api/books
AUTH=$HANAKO call GET  /api/books
AUTH=$HANAKO call GET  /api/me
AUTH=$HANAKO call POST /api/books '{"title":"Java 入門","author":"山田","isbn":"9784000000001"}'
AUTH="admin:$ADMIN_PASSWORD" call POST /api/books '{"title":"Java 入門","author":"山田","isbn":"9784000000001"}'
