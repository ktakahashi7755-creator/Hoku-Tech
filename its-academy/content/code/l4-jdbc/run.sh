# 検証用: ビルドして実行する (DB_URL / DB_USER / DB_PASSWORD は検証スクリプトが渡す)
set -e
mvn -q -B -ntp compile dependency:copy-dependencies -DoutputDirectory=target/lib >/dev/null
java -Dstdout.encoding=UTF-8 -cp "target/classes:target/lib/*" com.example.jdbc.Main
