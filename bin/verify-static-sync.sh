#!/usr/bin/env bash
# verify-static-sync.sh
#
# Comprueba que src/ no tiene cambios pendientes de commitear respecto al índice de git.
# Sale con código 0 si src/ está limpio; con código 1 si hay diferencias reales.
#
# Se usa como guardia en hooks de git (pre-push) para bloquear un push cuando el export
# estático ha cambiado pero no se ha commitado: obliga al desarrollador a revisar y
# commitear los cambios de src/ antes de publicar.
#
# Uso:
#   ./bin/verify-static-sync.sh
#   (normalmente invocado desde .githooks/pre-push, no directamente)

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
