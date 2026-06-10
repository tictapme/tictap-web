#!/usr/bin/env node

/**
 * sync-astro-output.js
 *
 * Sincroniza la salida del build de Astro (dist/) en el directorio publicado (src/).
 *
 * Pasos que ejecuta:
 *   1. Borra src/_astro/ para eliminar assets versionados del build anterior.
 *   2. Copia recursivamente todo dist/ sobre src/, sobreescribiendo archivos existentes.
 *   3. Elimina de src/ las rutas de autor y etiqueta (author/, tag/, en/author/, en/tag/)
 *      que Astro genera pero no deben publicarse.
 *
 * Uso:
 *   node bin/sync-astro-output.js
 *   (normalmente invocado desde `npm run preview` tras `npm run astro:build`)
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(repoRoot, 'dist');
const targetDir = path.join(repoRoot, 'src');
const targetAstroDir = path.join(targetDir, '_astro');
const prunedRouteDirs = ['author', 'tag', path.join('en', 'author'), path.join('en', 'tag')];

// Rutas protegidas: editadas manualmente en src/, el sync no las sobreescribe.
const protectedPaths = new Set([
  path.join('casos-de-exito', 'trazabilidad-de-grupos-electrogenos-para-dagartech', 'index.html'),
  path.join('casos-de-exito', 'yessss-electrical-stock', 'index.html'),
  path.join('en', 'sucess-stories', 'yesss-electrical-stock', 'index.html'),
  path.join('stock', 'partners-distribuidores', 'index.html'),
]);

function copyTree(source, target) {
  if (!fs.existsSync(source)) {
    return;
  }

  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyTree(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  const rel = path.relative(targetDir, target);
  if (protectedPaths.has(rel)) {
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function removeTree(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

if (fs.existsSync(targetAstroDir)) {
  fs.rmSync(targetAstroDir, { recursive: true, force: true });
}

copyTree(sourceDir, targetDir);
for (const relativeDir of prunedRouteDirs) {
  removeTree(path.join(targetDir, relativeDir));
}

// Actualiza referencias a CSS de Astro (_slug_.*.css) en páginas protegidas,
// para que apunten al hash generado en este build.
const newCssHash = (() => {
  const astroDir = path.join(targetDir, '_astro');
  if (!fs.existsSync(astroDir)) return null;
  const match = fs.readdirSync(astroDir).find(f => /^_slug_\..+\.css$/.test(f));
  return match || null;
})();

if (newCssHash) {
  for (const rel of protectedPaths) {
    const filePath = path.join(targetDir, rel);
    if (!fs.existsSync(filePath)) continue;
    let html = fs.readFileSync(filePath, 'utf-8');
    const updated = html.replace(/\/_astro\/_slug_\.[^"]+\.css/g, `/_astro/${newCssHash}`);
    if (updated !== html) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`  CSS hash updated in ${rel} → ${newCssHash}`);
    }
  }
}

console.log(`Astro output synced from ${path.relative(repoRoot, sourceDir)} to ${path.relative(repoRoot, targetDir)}`);
