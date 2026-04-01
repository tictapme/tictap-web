#!/bin/bash
# replace_url.sh
#
# Reemplaza en masa las URLs de host en todos los archivos de src/ según el modo indicado.
# Útil para alternar el sitio entre producción y el entorno develop (Cloudflare Pages preview).
#
# Modos:
#   production  (por defecto) – reemplaza cualquier host de staging/develop por www.tictap.me
#   develop                   – reemplaza www.tictap.me y hosts de staging por develop.wp-web.pages.dev
#
# Uso:
#   ./bin/replace_url.sh                          # modo production con regex y destino por defecto
#   ./bin/replace_url.sh production               # equivalente al anterior
#   ./bin/replace_url.sh develop                  # apunta todo a develop.wp-web.pages.dev
#   ./bin/replace_url.sh production "regex" "url" # regex y URL de destino personalizados
#
# Precaución: modifica todos los archivos de src/ en sitio. Pide confirmación antes de ejecutar.
# No ejecuta validación ni limpieza SEO posterior; hazlo manualmente si es necesario.

set -euo pipefail

MODE="${1:-production}"
SRC_DIR="src/"

case "$MODE" in
  production)
    DEFAULT_OLD_URL="static-www-tictap\\.tictap\\.me|develop\\.wp-web\\.pages\\.dev|staging-www\\.tictap\\.me|staging-www-tictap\\.tictap\\.me"
    DEFAULT_NEW_URL="www.tictap.me"
    ;;
  develop)
    DEFAULT_OLD_URL="www\\.tictap\\.me|static-www-tictap\\.tictap\\.me|staging-www\\.tictap\\.me|staging-www-tictap\\.tictap\\.me"
    DEFAULT_NEW_URL="develop.wp-web.pages.dev"
    ;;
  *)
    echo "Usage: $0 [production|develop] [old_url_regex] [new_url]"
    exit 1
    ;;
esac

OLD_URL="${2:-$DEFAULT_OLD_URL}"
NEW_URL="${3:-$DEFAULT_NEW_URL}"

if [ ! -d "$SRC_DIR" ]; then
  echo "Directory $SRC_DIR does not exist"
  exit 1
fi

echo
echo "Mode: $MODE"
echo "Replacing $OLD_URL with $NEW_URL in $SRC_DIR"
echo
read -p "Are you sure you want to continue? (Y/n) " -r
echo
if [[ ! $REPLY =~ ^[Yy]?$ ]]; then
  echo "Exiting..."
  exit 1
fi

find "$SRC_DIR" -type f | while read -r file; do
  sed -i -E "s/$OLD_URL/$NEW_URL/g" "$file"
done

echo "Replaced URLs from $OLD_URL to $NEW_URL in $SRC_DIR"
