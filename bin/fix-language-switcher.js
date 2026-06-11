#!/usr/bin/env node

// Reescribe el selector de idioma (WPML) de cada página estática para que
// apunte a la URL equivalente en el otro idioma en lugar de a la home.
//
// El export congeló cada selector a un href fijo (normalmente la home del
// otro idioma). Aquí se reconstruye el mapa de equivalencias a partir de los
// <link rel="alternate" hreflang> del <head> y se corrige cada selector.

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'src');
const KNOWN_HOSTS = [
  'www.tictap.me',
  'tictap.me',
  'staging-www.tictap.me',
  'static-www-tictap.tictap.me',
  'develop.wp-web.pages.dev',
];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

// Convierte cualquier href a una ruta absoluta del sitio ("/blog/foo/").
function toSitePath(href) {
  if (!href) return null;
  let value = href.trim();
  for (const host of KNOWN_HOSTS) {
    value = value.replace(new RegExp(`^https?://${host.replace(/\./g, '\\.')}`, 'i'), '');
    value = value.replace(new RegExp(`^//${host.replace(/\./g, '\\.')}`, 'i'), '');
  }
  if (/^https?:\/\//i.test(value)) return null; // host externo, ignorar
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.split('#')[0].split('?')[0];
  if (!/\.[a-z0-9]+$/i.test(value) && !value.endsWith('/')) value += '/';
  return value;
}

// Ruta del sitio a partir de la ubicación del fichero.
function selfPath(file) {
  let rel = path.relative(SRC_DIR, file).split(path.sep).join('/');
  rel = rel.replace(/index\.html$/, '');
  if (!rel.startsWith('/')) rel = `/${rel}`;
  if (!rel.endsWith('/')) rel += '/';
  return rel;
}

const files = walk(SRC_DIR, []);

// Paso 1: construir el mapa de equivalencias es <-> en.
const esToEn = new Map();
const enToEs = new Map();

const altRe = /<link\s+rel="alternate"\s+hreflang="(es|en)"\s+href="([^"]*)"/gi;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  let es = null;
  let en = null;
  let m;
  altRe.lastIndex = 0;
  while ((m = altRe.exec(html)) !== null) {
    const lang = m[1].toLowerCase();
    const sitePath = toSitePath(m[2]);
    if (!sitePath) continue;
    if (lang === 'es' && !es) es = sitePath;
    if (lang === 'en' && !en) en = sitePath;
  }
  if (es && en) {
    if (!esToEn.has(es)) esToEn.set(es, en);
    if (!enToEs.has(en)) enToEs.set(en, es);
  }
}

// Paso 2: reescribir el selector de idioma en cada página.
const switcherRe =
  /(<a\s+href=")([^"]*)("\s+hreflang="(es|en)"\s+lang="(?:es|en)"\s+class="wpml-ls-link")/gi;

let changed = 0;
let unresolved = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const self = selfPath(file);
  let fileChanged = false;

  html = html.replace(switcherRe, (full, pre, oldHref, post, targetLang) => {
    let target;
    if (targetLang === 'en') {
      target = esToEn.get(self) || '/en/';
    } else {
      target = enToEs.get(self) || '/';
    }
    if (!esToEn.has(self) && !enToEs.has(self) && target === '/en/') {
      unresolved += 1;
    }
    if (target === oldHref) return full;
    fileChanged = true;
    return `${pre}${target}${post}`;
  });

  if (fileChanged) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Selector de idioma corregido en ${changed} página(s).`);
console.log(`Equivalencias: ${esToEn.size} es→en, ${enToEs.size} en→es.`);
