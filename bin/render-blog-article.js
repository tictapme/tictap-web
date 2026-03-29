#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function usage() {
  console.error('Usage: node bin/render-blog-article.js --meta <site.json> --body <article.md> --output <content.md>');
  process.exit(1);
}

function stripMarkdownTitle(body) {
  const lines = body.split(/\r?\n/);
  let index = 0;

  while (index < lines.length && lines[index].trim() === '') {
    index += 1;
  }

  if (index < lines.length && /^#\s+/.test(lines[index])) {
    lines.splice(index, 1);
  }

  while (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }

  return `${lines.join('\n').trim()}\n`;
}

function stripAsideWrapper(html) {
  const trimmed = html.trim();
  const wrapperMatch = trimmed.match(/^<div class="aside-card">([\s\S]*)<\/div>$/i);

  if (wrapperMatch) {
    return wrapperMatch[1].trim();
  }

  return trimmed;
}

function normalizeHeroAside(value, meta) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map(stripAsideWrapper);
  }

  const summary = meta.deck || meta.meta_description || '';
  return [
    '<h2>Lo que resuelve</h2><ul><li>Reduce fricción al registrar inspecciones.</li><li>Ayuda a completar checklists obligatorios.</li><li>Mejora la trazabilidad operativa.</li></ul>',
    `<h2>Idea central</h2><p>${summary}</p>`,
  ];
}

function yamlValue(value) {
  return JSON.stringify(value);
}

function buildFrontmatter(meta, heroAside) {
  const fields = {
    title: meta.title || meta.seo_title,
    seoTitle: meta.seo_title,
    metaDescription: meta.meta_description,
    publicUrl: meta.public_url,
    publishedTime: meta.published_time,
    modifiedTime: meta.modified_time,
    ogImage: meta.og_image,
    ogImageWidth: meta.og_image_width || 1024,
    ogImageHeight: meta.og_image_height || 620,
    author: meta.author || 'TicTAP',
    readingTime: meta.reading_time || '4 minutos',
    category: meta.category || 'mantenimiento y operaciones',
    deck: meta.deck || meta.meta_description,
    footerText: meta.footer_text || 'Artículo preparado para revisión local dentro del flujo Astro de TicTAP.',
    footerCtaText: meta.footer_cta_text || 'Hablar con TicTAP',
    footerCtaUrl: meta.footer_cta_url || 'https://www.tictap.me/contacto',
    heroAside,
  };

  const lines = ['---'];

  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key}: ${yamlValue(value)}`);
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--meta' || arg === '--body' || arg === '--output') {
    options[arg.slice(2)] = args[i + 1];
    i += 1;
  }
}

if (!options.meta || !options.body || !options.output) {
  usage();
}

const repoRoot = path.resolve(__dirname, '..');
const metaPath = path.resolve(process.cwd(), options.meta);
const bodyPath = path.resolve(process.cwd(), options.body);
const outputPath = path.resolve(process.cwd(), options.output);

const meta = JSON.parse(readFile(metaPath));
const body = readFile(bodyPath);
const heroAside = normalizeHeroAside(meta.hero_aside, meta);
const frontmatter = buildFrontmatter(meta, heroAside);
const articleContent = stripMarkdownTitle(body);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${frontmatter}${articleContent}`);

console.log(`Astro content written to ${path.relative(repoRoot, outputPath)}`);
