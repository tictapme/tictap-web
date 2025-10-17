#!/bin/bash
# Sync entire site or a specific subfolder from remote 'generated' to local 'src'.
# Usage:
#   ./bin/sync.sh                     # sync everything (current behavior)
#   ./bin/sync.sh carpeta [carpeta2 …] # sync one or more subfolders (e.g., blog en/blog contacto)
#   ./bin/sync.sh --help              # show this help
#
# Notes:
# - The optional "carpeta" is a path relative to src/ (e.g., blog, en/blog, contacto).
# - Excludes: .git/, 404.html, bin/, _redirects
# - After syncing, staging links are replaced with production in .html/.xml within the affected path.
# - Finally, node bin/fix-sitemaps.js is executed.

set -euo pipefail

print_help() {
  cat <<'EOF'
Sincroniza todo el sitio o una carpeta concreta desde el remoto a ./src

Uso:
  ./bin/sync.sh                       # sincroniza todo
  ./bin/sync.sh carpeta [carpeta2 …]  # sincroniza una o varias carpetas (p.ej. blog en/blog contacto)
  ./bin/sync.sh --help                # muestra esta ayuda

Detalles:
- Las carpetas son relativas a src/ (no uses prefijo ./, los finales / se ignoran).
- Excluye: .git/, 404.html, bin/, _redirects
- Tras sincronizar, en los .html reemplaza cualquier host https://{sub}.tictap.me -> https://www.tictap.me (cualquier subdominio)
- En .xml mantiene: staging-www.tictap.me -> www.tictap.me
- Ejecuta: node bin/fix-sitemaps.js
EOF
}

# Help flag
if [[ "${1-}" == "--help" || "${1-}" == "-h" ]]; then
  print_help
  exit 0
fi

REMOTE_BASE="debian@51.83.111.98:/home/debian/docker-wp/generated"
LOCAL_BASE="src"

if [ "$#" -eq 0 ]; then
  # Full sync
  rsync -avz \
    --exclude='.git/' \
    --exclude='404.html' \
    --exclude='bin/' \
    --exclude='_redirects' \
    "$REMOTE_BASE/" "$LOCAL_BASE/" --delete

  TARGET_HTML_DIRS=( "./src/" )
  TARGET_XML_DIRS=( "./src/" )
else
  TARGET_HTML_DIRS=()
  TARGET_XML_DIRS=()
  for FOLDER in "$@"; do
    # Normalize by removing any leading ./ and trailing /
    FOLDER="${FOLDER#./}"
    FOLDER="${FOLDER%/}"

    rsync -avz \
      --exclude='.git/' \
      --exclude='404.html' \
      --exclude='bin/' \
      --exclude='_redirects' \
      "$REMOTE_BASE/$FOLDER/" "$LOCAL_BASE/$FOLDER/" --delete

    TARGET_HTML_DIRS+=( "./src/$FOLDER/" )
    TARGET_XML_DIRS+=( "./src/$FOLDER/" )
  done
fi

# replace in HTML: any https://{sub}.tictap.me -> https://www.tictap.me
for TARGET_HTML_DIR in "${TARGET_HTML_DIRS[@]}"; do
  if [ -d "$TARGET_HTML_DIR" ]; then
    # General rule: replace any subdomain host of tictap.me to www.tictap.me (HTTPS only)
    find "$TARGET_HTML_DIR" -name "*.html" -type f -print0 | xargs -0 sed -E -i 's#https://([^/]+\.)+tictap\.me#https://www.tictap.me#g' || true
  fi
done

# xml files
for TARGET_XML_DIR in "${TARGET_XML_DIRS[@]}"; do
  if [ -d "$TARGET_XML_DIR" ]; then
    find "$TARGET_XML_DIR" -name "*.xml" -type f -print0 | xargs -0 sed -i 's/staging-www\.tictap\.me/www\.tictap\.me/g' || true
  fi
done

# Adds Absolute urls for sitemaps
node bin/fix-sitemaps.js
