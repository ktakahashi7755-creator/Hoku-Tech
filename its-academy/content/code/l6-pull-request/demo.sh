# プルリクエスト (PR) に出す前に、自分の変更を確認する手順
set -e
git init -q -b main app && cd app
git config user.name "Yamada Hanako" && git config user.email "hanako@example.com"
printf 'public class Lending {\n    static final int LIMIT = 3;\n}\n' > Lending.java
git add . && git commit -q -m "feat: add lending limit"

git switch -q -c feature/overdue-check
printf 'public class Lending {\n    static final int LIMIT = 3;\n\n    static boolean isOverdue(long days) {\n        return days > 14;\n    }\n}\n' > Lending.java
printf 'class LendingTest {}\n' > LendingTest.java
git add . && git commit -q -m "feat: add overdue check"

echo "--- 1. main との差分のファイル一覧 (PR に含まれる変更)"
git diff --stat main...feature/overdue-check
echo "--- 2. 差分の中身 (レビューで見られる内容)"
git diff main...feature/overdue-check -- Lending.java
echo "--- 3. PR に含まれるコミット"
git log --format='%s' main..feature/overdue-check

# レビューで「14 は定数にしてください」と指摘された → 同じブランチに修正を追加する
sed -i 's/return days > 14;/return days > LOAN_DAYS;/' Lending.java
sed -i 's/    static final int LIMIT = 3;/    static final int LIMIT = 3;\n    static final int LOAN_DAYS = 14;/' Lending.java
git commit -q -am "fix: use LOAN_DAYS constant (review)"
echo "--- 4. 指摘への対応を追加した後のコミット"
git log --format='%s' main..feature/overdue-check
