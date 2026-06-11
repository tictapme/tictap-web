#!/usr/bin/env node

// El export estático congeló el estado activo del menú: cada página muestra
// como activo el mismo elemento (en inglés, "Contact"). Este script elimina
// el estado activo congelado de la cabecera y lo vuelve a aplicar al elemento
// de menú que corresponde a la página actual.

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

// Clases de estado activo añadidas por WordPress que el export congeló.
const ACTIVE_TOKENS = new Set([
  'current-menu-item',
  'current-menu-ancestor',
  'current-menu-parent',
  'current_page_item',
  'current_page_parent',
  'current_page_ancestor',
  'current-page-ancestor',
  'current-page-parent',
  'elementor-item-active',
]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'index.html') out.push(full);
  }
  return out;
}

// Normaliza un href a una ruta comparable: sin host, sin barra final.
function normalizePath(href) {
  if (!href) return null;
  let value = href.trim();
  for (const host of KNOWN_HOSTS) {
    value = value.replace(new RegExp(`^https?://${host.replace(/\./g, '\\.')}`, 'i'), '');
    value = value.replace(new RegExp(`^//${host.replace(/\./g, '\\.')}`, 'i'), '');
  }
  if (/^https?:\/\//i.test(value)) return null; // host externo
  value = value.split('#')[0].split('?')[0];
  if (!value.startsWith('/')) value = `/${value}`;
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value;
}

function selfPath(file) {
  let rel = path.relative(SRC_DIR, file).split(path.sep).join('/');
  rel = rel.replace(/index\.html$/, '');
  if (!rel.startsWith('/')) rel = `/${rel}`;
  if (rel.length > 1 && rel.endsWith('/')) rel = rel.slice(0, -1);
  return rel;
}

function cleanClassTokens(cls) {
  return cls
    .split(/\s+/)
    .filter((token) => token && !ACTIVE_TOKENS.has(token))
    .join(' ');
}

const files = walk(SRC_DIR, []);
let changed = 0;
let activated = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const self = normalizePath(selfPath(file));
  let html = original;

  // 1) Quitar el estado activo congelado de los <li> del menú.
  html = html.replace(/<li class="([^"]*)">/g, (m, cls) => `<li class="${cleanClassTokens(cls)}">`);

  // 2) Quitar el estado activo congelado de los enlaces del menú.
  html = html.replace(/<a\s+([^>]*?)>/g, (m, attrs) => {
    if (!/\bmenu-link\b/.test(attrs)) return m;
    let next = attrs.replace(/\s*aria-current="page"/gi, '');
    next = next.replace(/class="([^"]*)"/, (cm, cls) => `class="${cleanClassTokens(cls)}"`);
    return `<a ${next}>`;
  });

  // 3) Marcar como activo el elemento de menú de la página actual.
  html = html.replace(
    /<li class="([^"]*)"><a href="([^"]*)"([^>]*?)class="([^"]*?\bmenu-link\b[^"]*?)"([^>]*)>/g,
    (full, liCls, href, mid, aCls, rest) => {
      if (normalizePath(href) !== self) return full;
      activated += 1;
      return `<li class="${liCls} current-menu-item current_page_item"><a href="${href}" aria-current="page"${mid}class="${aCls} elementor-item-active"${rest}>`;
    },
  );

  if (html !== original) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Menú activo corregido en ${changed} página(s).`);
console.log(`Elementos de menú marcados como activos: ${activated}.`);
