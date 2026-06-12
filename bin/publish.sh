#!/usr/bin/env bash
# publish.sh
#
# Construye el export estático, lo materializa en src/, valida y hace push.
# Equivalente a: static:prepare + commit si src/ cambió + git push.
#
# Uso:
#   npm run publish
#   ./bin/publish.sh

set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

echo "[publish] Building and validating static export..."
npm run static:prepare

if ! git diff --ignore-all-space --quiet -- src; then
  echo "[publish] Committing updated static export..."
  git add src/
  git commit -m "build: sync static export"
fi

echo "[publish] Pushing..."
git push
