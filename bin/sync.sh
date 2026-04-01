#!/bin/bash
# sync.sh
#
# Sincroniza el export estático del servidor remoto al directorio publicado local (src/).
# Tras la sincronización ejecuta el pipeline completo de limpieza y validación SEO.
#
# Uso:
#   ./bin/sync.sh                              # sincroniza todo el sitio
#   ./bin/sync.sh carpeta [carpeta2 …]         # sincroniza una o más subcarpetas (p.ej. blog en/blog contacto)
#   ./bin/sync.sh --exclude=en/                # sincroniza todo excepto la carpeta indicada (relativa a src/)
#   ./bin/sync.sh --exclude=en/ --exclude=blog # múltiples exclusiones
#   ./bin/sync.sh --help                       # muestra la ayuda completa
#
# Detalles:
# - El remoto es debian@51.83.111.98:/home/debian/docker-wp/generated (export del CMS).
# - Las carpetas son rutas relativas a src/ (sin prefijo ./, el / final se ignora).
# - Siempre excluye: .git/, 404.html, bin/, _redirects, ai.md
# - Tras la descarga, reemplaza en HTML cualquier subdominio de staging de tictap.me por www.tictap.me,
#   y en XML reemplaza staging-www.tictap.me por www.tictap.me.
# - Pipeline post-sync:
#     1. node bin/fix-sitemaps.js          → añade URLs absolutas a los sitemaps
#     2. node bin/normalize-pages-config.js → normaliza _headers/_redirects y los sincroniza en src/
#     3. node bin/optimize-seo.js          → corrige canonical, noindex y referencias de sitemap
#     4. node bin/validate-static-site.js  → falla rápido si el export no es seguro para producción

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
- Ejecuta: node bin/normalize-pages-config.js
- Ejecuta: node bin/optimize-seo.js
- Ejecuta: node bin/validate-static-site.js
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

# Adds absolute URLs for sitemaps
node bin/fix-sitemaps.js

# Normalizes Cloudflare Pages config files and syncs them into src/
node bin/normalize-pages-config.js

# Normalizes canonical signals, noindex rules and sitemap references
node bin/optimize-seo.js

# Fails fast if the static export is not safe to publish on Cloudflare Pages
node bin/validate-static-site.js
