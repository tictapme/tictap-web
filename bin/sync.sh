#!/bin/bash
# Sync entire site or a specific subfolder from remote 'generated' to local 'src'.
# Usage:
#   ./bin/sync.sh                              # sync everything (current behavior)
#   ./bin/sync.sh carpeta [carpeta2 …]         # sync one or more subfolders (e.g., blog en/blog contacto)
#   ./bin/sync.sh --exclude=en/                # sync everything except a folder (relative to src/, e.g. src/en)
#   ./bin/sync.sh --exclude=en/ --exclude=blog # multiple excludes
#   ./bin/sync.sh --help                       # show this help
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
  ./bin/sync.sh                                 # sincroniza todo
  ./bin/sync.sh carpeta [carpeta2 …]            # sincroniza una o varias carpetas (p.ej. blog en/blog contacto)
  ./bin/sync.sh --exclude=en/                  # excluye una carpeta relativa a src/ (p.ej. en -> src/en)
  ./bin/sync.sh --exclude=en/ --exclude=blog   # puedes pasar varias exclusiones
  ./bin/sync.sh --help                          # muestra esta ayuda

Detalles:
- Las carpetas son relativas a src/ (no uses prefijo ./, los finales / se ignoran).
- --exclude acepta rutas relativas a src/ (sin ./ y opcional / final), por ejemplo: en, en/, blog, blog/.
- Excluye siempre: .git/, 404.html, bin/, _redirects
- Tras sincronizar, en los .html reemplaza cualquier host https://{sub}.tictap.me -> https://www.tictap.me (cualquier subdominio)
- En .xml mantiene: staging-www.tictap.me -> www.tictap.me
- Ejecuta: node bin/fix-sitemaps.js
EOF
}

REMOTE_BASE="debian@51.83.111.98:/home/debian/docker-wp/generated"
LOCAL_BASE="src"

FOLDERS=()
EXCLUDE_PATTERNS=()

# Parse arguments: folders and --exclude flags
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --help|-h)
      print_help
      exit 0
      ;;
    --exclude=*)
      EXCLUDE_PATTERNS+=("${1#--exclude=}")
      shift
      ;;
    --exclude)
      shift
      if [[ "$#" -eq 0 ]]; then
        echo "Error: --exclude requiere un valor (p.ej. --exclude=en/)" >&2
        exit 1
      fi
      EXCLUDE_PATTERNS+=("$1")
      shift
      ;;
    *)
      FOLDERS+=("$1")
      shift
      ;;
  esac
done

# Base rsync excludes
RSYNC_EXCLUDES=(
  "--exclude=.git/"
  "--exclude=404.html"
  "--exclude=bin/"
  "--exclude=_redirects"
  "--exclude=ai.md"
)

# Add user-specified excludes (relative to src/, normalized)
for RAW_EXC in "${EXCLUDE_PATTERNS[@]}"; do
  # Normaliza: quita ./ inicial y / final
  EXC="${RAW_EXC#./}"
  EXC="${EXC%/}"
  if [[ -n "$EXC" ]]; then
    # Forzamos / final para indicar carpeta en rsync
    RSYNC_EXCLUDES+=("--exclude=${EXC}/")
  fi
done

if [ "${#FOLDERS[@]}" -eq 0 ]; then
  # Full sync
  rsync -avz \
    "${RSYNC_EXCLUDES[@]}" \
    "$REMOTE_BASE/" "$LOCAL_BASE/" --delete

  TARGET_HTML_DIRS=( "./src/" )
  TARGET_XML_DIRS=( "./src/" )
else
  TARGET_HTML_DIRS=()
  TARGET_XML_DIRS=()
  for FOLDER in "${FOLDERS[@]}"; do
    # Normalize by removing any leading ./ and trailing /
    FOLDER="${FOLDER#./}"
    FOLDER="${FOLDER%/}"

    rsync -avz \
      "${RSYNC_EXCLUDES[@]}" \
      "$REMOTE_BASE/$FOLDER/" "$LOCAL_BASE/$FOLDER/" --delete

    TARGET_HTML_DIRS+=( "./src/$FOLDER/" )
    TARGET_XML_DIRS+=( "./src/$FOLDER/" )
  done
fi

# replace in HTML: any https://{sub}.tictap.me -> https://www.tictap.me
for TARGET_HTML_DIR in "${TARGET_HTML_DIRS[@]}"; do
  if [ -d "$TARGET_HTML_DIR" ]; then
    # General rule: replace any subdomain host of tictap.me to www.tictap.me (HTTPS only)
    find "$TARGET_HTML_DIR" -name "*.html" -type f -print0 | xargs -0 sed -E -i 's#https://((staging-www|staging-www-tictap|static-www)\.)+tictap\.me#https://www.tictap.me#g' || true
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
