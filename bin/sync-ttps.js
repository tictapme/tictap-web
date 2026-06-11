#!/usr/bin/env node
/**
 * sync-ttps.js
 *
 * Sincroniza el bloque <style id="tt-ps-css"> y el <section class="tt-ps">
 * desde la home ES hacia la home EN, preservando el texto traducido EN.
 *
 * Uso: node bin/sync-ttps.js
 *
 * Qué sincroniza:
 *   - Todo el <style id="tt-ps-css">…</style>  (idéntico en ambos idiomas)
 *   - La estructura SVG del panel problema
 *   - La estructura SVG del panel solución
 *   - Los estilos inline
 *
 * Qué NO toca:
 *   - Textos de encabezados (.tt-ps__h3, .tt-ps__copy)
 *   - Bullets (<li> internos)
 *   - Texto de los ribbons
 *   - CTAs (href y texto de los botones)
 */

const fs = require('fs');

const ES_HOME = 'astro/legacy-sources/index.html';
const EN_HOME = 'astro/legacy-sources/en/index.html';

function extractBlock(html, startMarker, endTag) {
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const end = html.indexOf(endTag, start);
  if (end === -1) return null;
  return { start, end: end + endTag.length, content: html.slice(start, end + endTag.length) };
}

function extractSectionTtps(html) {
  const marker = '<section class="tt-ps">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
  // track depth of <section>
  let depth = 0, i = start;
  while (i < html.length) {
    if (html.startsWith('<section', i)) { depth++; i += 8; }
    else if (html.startsWith('</section>', i)) { depth--; if (depth === 0) { i += 10; break; } i += 10; }
    else i++;
  }
  return { start, end: i, content: html.slice(start, i) };
}

// ── 1. Leer archivos ──────────────────────────────────────────────────────────
let esHtml = fs.readFileSync(ES_HOME, 'utf8');
let enHtml = fs.readFileSync(EN_HOME, 'utf8');

// ── 2. Extraer <style id="tt-ps-css"> de ES ──────────────────────────────────
const esStyle = extractBlock(esHtml, '<style id="tt-ps-css">', '</style>');
if (!esStyle) { console.error('ERROR: <style id="tt-ps-css"> not found in ES home'); process.exit(1); }

// ── 3. Reemplazar <style id="tt-ps-css"> en EN ───────────────────────────────
const enStyle = extractBlock(enHtml, '<style id="tt-ps-css">', '</style>');
if (!enStyle) { console.error('ERROR: <style id="tt-ps-css"> not found in EN home'); process.exit(1); }

enHtml = enHtml.slice(0, enStyle.start) + esStyle.content + enHtml.slice(enStyle.end);
console.log('✓ CSS block synced ES → EN');

// ── 4. Sincronizar SVGs dentro de <section class="tt-ps"> ────────────────────
//    Extraemos el SVG del panel--problem y el SVG del panel--solution de ES
//    y los reemplazamos en EN (los SVGs son iguales en ambos idiomas).

function extractSvgInPanel(sectionHtml, panelClass) {
  const panelStart = sectionHtml.indexOf(`class="tt-ps__panel ${panelClass}`);
  if (panelStart === -1) return null;
  const vizStart = sectionHtml.indexOf('<div class="tt-ps__viz', panelStart);
  if (vizStart === -1) return null;
  // find opening <svg
  const svgStart = sectionHtml.indexOf('<svg', vizStart);
  if (svgStart === -1) return null;
  // find closing </svg>
  let depth = 0, i = svgStart;
  while (i < sectionHtml.length) {
    if (sectionHtml.startsWith('<svg', i)) { depth++; i += 4; }
    else if (sectionHtml.startsWith('</svg>', i)) { depth--; if (depth === 0) { i += 6; break; } i += 6; }
    else i++;
  }
  return { start: svgStart, end: i, content: sectionHtml.slice(svgStart, i) };
}

const esSection = extractSectionTtps(esHtml);
const enSectionBefore = extractSectionTtps(enHtml);
if (!esSection || !enSectionBefore) {
  console.error('ERROR: <section class="tt-ps"> not found in one of the files');
  process.exit(1);
}

let enSection = enSectionBefore.content;

// Replace problem SVG
const esProblemSvg = extractSvgInPanel(esSection.content, 'tt-ps__panel--problem');
const enProblemSvg = extractSvgInPanel(enSection, 'tt-ps__panel--problem');
if (esProblemSvg && enProblemSvg) {
  enSection = enSection.slice(0, enProblemSvg.start) + esProblemSvg.content + enSection.slice(enProblemSvg.end);
  console.log('✓ Problem panel SVG synced ES → EN');
}

// Replace solution SVG (re-extract after possible shift)
const esSolutionSvg = extractSvgInPanel(esSection.content, 'tt-ps__panel--solution');
const enSolutionSvg = extractSvgInPanel(enSection, 'tt-ps__panel--solution');
if (esSolutionSvg && enSolutionSvg) {
  enSection = enSection.slice(0, enSolutionSvg.start) + esSolutionSvg.content + enSection.slice(enSolutionSvg.end);
  console.log('✓ Solution panel SVG synced ES → EN');
}

// Write updated section back into EN html
enHtml = enHtml.slice(0, enSectionBefore.start) + enSection + enHtml.slice(enSectionBefore.end);

// ── 5. Guardar EN ─────────────────────────────────────────────────────────────
fs.writeFileSync(EN_HOME, enHtml);
console.log('\n✓ astro/legacy-sources/en/index.html updated');
console.log('\nNext steps:');
console.log('  npx astro build && node bin/sync-astro-output.js');
