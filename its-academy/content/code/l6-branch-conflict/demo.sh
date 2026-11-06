# 2 人が同じ行を変更して衝突 (コンフリクト) させ、解消するまで
set -e
git init -q -b main team-repo && cd team-repo
git config user.name "Yamada Hanako" && git config user.email "hanako@example.com"
printf '# 図書管理システム\n貸出上限: 3 冊\n' > README.md
git add README.md && git commit -q -m "docs: add README"

# 山田さん: 機能ブランチで上限を 5 冊に変更
git switch -q -c feature/limit-5
sed -i 's/3 冊/5 冊/' README.md
git commit -q -am "docs: change limit to 5"

# その間に main では佐藤さんの変更 (上限を 4 冊に) が取り込まれた
git switch -q main
sed -i 's/3 冊/4 冊/' README.md
git commit -q -am "docs: change limit to 4"

# 山田さんのブランチに main を取り込むと衝突する
git switch -q feature/limit-5
git merge main || true
echo "--- 衝突したファイルの中身"
cat README.md

# 仕様を確認した結果「5 冊」に決まったので、印を消して正しい内容にする
printf '# 図書管理システム\n貸出上限: 5 冊\n' > README.md
git add README.md
git commit -q -m "merge: resolve limit conflict (5 冊に決定)"
echo "--- 解消後の履歴"
git log --graph --format='%s' | head -6
