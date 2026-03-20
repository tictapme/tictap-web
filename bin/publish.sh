#!/bin/bash
set -euo pipefail

current_branch=$(git branch --show-current)

echo "Preparing static site for branch: $current_branch"
SITE_BRANCH="$current_branch" node bin/optimize-seo.js
SITE_BRANCH="$current_branch" node bin/normalize-pages-config.js
SITE_BRANCH="$current_branch" node bin/validate-static-site.js

git add src/

read -p "Do you want to commit and push? [Y/n] " -r
echo
if [[ ! $REPLY =~ ^[Yy]?$ ]]
then
    echo "Exiting..."
    exit 1
fi

git commit -m "Prepare static site for $current_branch"
echo "Committed static"
git push origin "$current_branch"
echo "Pushed last changes to $current_branch"
