# 検証用: テストを実行し、結果の集計行だけを表示する
mvn -B -ntp test 2>&1 | grep -E '^\[INFO\] Tests run: [0-9]+, Failures' | tail -1
mvn -B -ntp test 2>&1 | grep -E 'BUILD (SUCCESS|FAILURE)'
