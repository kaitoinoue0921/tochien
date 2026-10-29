#!/bin/zsh
# ビルドして gh-pages ブランチへ公開する
set -e
cd "$(dirname "$0")/.."
npm run build
touch out/.nojekyll
cd out
rm -rf .git
git init -q && git checkout -qb gh-pages && git add -A && git commit -qm "Deploy"
git remote add origin https://github.com/kaitoinoue0921/tochien.git
git push -qf origin gh-pages
echo "deployed: https://kaitoinoue0921.github.io/tochien/"
