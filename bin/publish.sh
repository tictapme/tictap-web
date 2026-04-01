#!/bin/bash
# publish.sh
#
# Prepara src/ para la rama actual y, con confirmación del usuario, hace commit y push a esa rama.
#
# Pasos que ejecuta:
#   1. Lee la rama activa con `git branch --show-current`.
#   2. Ejecuta optimize-seo.js, normalize-pages-config.js y validate-static-site.js
#      pasando la variable SITE_BRANCH para que los scripts conozcan el contexto de rama.
#   3. Hace `git add src/` para incluir todos los cambios generados.
#   4. Pregunta confirmación antes de crear el commit y hacer push.
#
# Uso:
#   ./bin/publish.sh
#
# Precaución: hace push directo a la rama actual. Usar solo tras revisar el diff de src/.

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
