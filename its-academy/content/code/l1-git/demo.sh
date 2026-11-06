git init -q -b main my-profile
cd my-profile
git config user.name "Yamada Hanako"
git config user.email "hanako@example.com"
echo "# 山田花子のプロフィール" > README.md
git status --short
git add README.md
git commit -q -m "docs: add README"
git log --oneline | sed 's/^[0-9a-f]* /<hash> /'
git switch -c feature/hobby
echo "趣味: 登山" >> README.md
git diff --stat
