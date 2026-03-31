#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

status="$(git status --porcelain -- src)"

if [[ -z "$status" ]]; then
  exit 0
fi

if git diff --ignore-all-space --quiet -- src; then
  exit 0
fi

echo "Static export is out of sync with committed src/." >&2
echo "Run \`npm run static:prepare\`, review the generated changes, and commit them before pushing." >&2
echo >&2
printf '%s\n' "$status" >&2
exit 1
