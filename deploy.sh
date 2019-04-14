#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd example

git init
git add -A
git commit -m 'deploy via deploy.sh'
git push -f git@github.com:romanslonov/pure-modal.git master:gh-pages

cd -
