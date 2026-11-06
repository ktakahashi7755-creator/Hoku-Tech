# 検証用の共通処理: ビルドしてアプリを起動し、終了時に停止する
# (DB_URL / DB_USER / DB_PASSWORD は検証スクリプトが使い捨てのスキーマを指すように渡す)
set -e
mvn -q -B -ntp -DskipTests package
PORT=$((20000 + RANDOM % 20000))
java -jar target/book-api-1.0.0.jar --server.port=$PORT > app.log 2>&1 &
APP=$!
trap 'kill $APP 2>/dev/null; wait $APP 2>/dev/null || true' EXIT
for i in $(seq 1 60); do
  curl -s -o /dev/null "http://localhost:$PORT/api/hello" && break
  sleep 1
done
BASE="http://localhost:$PORT"

# call メソッド パス [JSON]: ステータスと本文を表示する
call() {
  local method=$1 path=$2 data=$3
  local args=(-s -X "$method" -o body.txt -D headers.txt -w '%{http_code}')
  [ -n "$data" ] && args+=(-H 'Content-Type: application/json' -d "$data")
  local code
  code=$(curl "${args[@]}" "$BASE$path")
  echo "$method $path -> $code"
  grep -i '^location:' headers.txt | tr -d '\r' | sed 's/^/  /' || true
  [ -s body.txt ] && { cat body.txt; echo; }
  return 0
}
