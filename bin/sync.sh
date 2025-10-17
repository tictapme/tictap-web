#!/bin/bash
# Sync entire site or a specific subfolder from remote 'generated' to local 'src'.
# Usage:
#   ./bin/sync.sh             # sync everything (current behavior)
#   ./bin/sync.sh carpeta     # sync only that subfolder (e.g., blog, en/blog, contacto)
#   ./bin/sync.sh --help      # show this help
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
  ./bin/sync.sh              # sincroniza todo
  ./bin/sync.sh carpeta      # sincroniza solo esa carpeta (p.ej. blog, en/blog, contacto)
  ./bin/sync.sh --help       # muestra esta ayuda

Detalles:
- La carpeta es relativa a src/ (no uses prefijo ./, los finales / se ignoran).
- Excluye: .git/, 404.html, bin/, _redirects
- Tras sincronizar, reemplaza staging-www.tictap.me -> www.tictap.me en .html y .xml del path afectado.
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

FOLDER="${1-}"

if [ -z "$FOLDER" ]; then
  # Full sync
  rsync -avz \
    --exclude='.git/' \
    --exclude='404.html' \
    --exclude='bin/' \
    --exclude='_redirects' \
    "$REMOTE_BASE/" "$LOCAL_BASE/" --delete

  TARGET_HTML_DIR="./src/"
  TARGET_XML_DIR="./src/"
else
  # Sync only the specified subfolder
  # Normalize by removing any leading ./ and trailing /
  FOLDER="${FOLDER#./}"
  FOLDER="${FOLDER%/}"

  rsync -avz \
    --exclude='.git/' \
    --exclude='404.html' \
    --exclude='bin/' \
    --exclude='_redirects' \
    "$REMOTE_BASE/$FOLDER/" "$LOCAL_BASE/$FOLDER/" --delete

  TARGET_HTML_DIR="./src/$FOLDER/"
  TARGET_XML_DIR="./src/$FOLDER/"
fi

# replace using sed all staging links with production links
if [ -d "$TARGET_HTML_DIR" ]; then
  find "$TARGET_HTML_DIR" -name "*.html" -type f -print0 | xargs -0 sed -i 's/staging-www\.tictap\.me/www\.tictap\.me/g' || true
fi

# xml files
if [ -d "$TARGET_XML_DIR" ]; then
  find "$TARGET_XML_DIR" -name "*.xml" -type f -print0 | xargs -0 sed -i 's/staging-www\.tictap\.me/www\.tictap\.me/g' || true
fi

# Adds Absolute urls for sitemaps
node bin/fix-sitemaps.js
