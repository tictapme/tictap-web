#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(siteRoot, 'src');
const astroRoot = path.join(siteRoot, 'astro');
const reportDir = path.join(astroRoot, 'migration-report');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, acc);
      continue;
    }
    if (entry.isFile() && entry.name === 'index.html') {
      acc.push(fullPath);
    }
  }
  return acc;
}

function uniq(values) {
  return [...new Set(values)];
}

function isRealAssetUrl(value) {
  if (!value) return false;
  if (value === '/css') return false;
  return /^(https?:\/\/|\/)/.test(value);
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });
}

function readMatches(html, regex) {
  return [...html.matchAll(regex)].map((match) => match[1]);
}

function classifyPage(route, bodyClasses, meta) {
  if (route === '/') return 'home-es';
  if (route === '/en/') return 'home-en';
  if (route.startsWith('/blog/page/')) return 'blog-pagination-es';
  if (route === '/blog/') return 'blog-archive-es';
  if (route.startsWith('/blog/')) return 'blog-single-es';
  if (route.startsWith('/en/blog/page/')) return 'blog-pagination-en';
  if (route === '/en/blog/') return 'blog-archive-en';
  if (route.startsWith('/en/blog/')) return 'blog-single-en';
  if (route === '/casos-de-exito/') return 'case-study-archive-es';
  if (route.startsWith('/casos-de-exito/')) return 'case-study-single-es';
  if (route === '/en/sucess-stories/') return 'case-study-archive-en';
  if (route.startsWith('/en/sucess-stories/')) return 'case-study-single-en';
  if (bodyClasses.includes('archive')) return route.startsWith('/en/') ? 'archive-en' : 'archive-es';
  if (route.startsWith('/en/')) return 'page-en';
  if (meta.headerId === '9642' && meta.footerId === '31645') return 'page-es';
  return 'other';
}

function toLocalAssetPath(urlPath) {
  const clean = urlPath.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
  return path.join(srcRoot, clean.replace(/^\/+/, ''));
}

function normalizeAssetName(asset) {
  return asset.replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
}

function collectInlineFlags(html) {
  return {
    hasElementorFrontendConfig: /elementorFrontendConfig/.test(html),
    hasElementorProFrontendConfig: /ElementorProFrontendConfig/.test(html),
    hasAstraConfig: /\bvar astra\b|\bwindow\.astra\b/.test(html),
    hasCookieBanner: /ckyBannerTemplate|cookie-law-info/i.test(html),
    hasWpmlSwitcher: /wpml-ls-/.test(html),
    hasSmartMenusMarkup: /smartmenus|menu-item-has-children|elementor-nav-menu--dropdown/.test(html),
  };
}

function buildShellSignature(meta) {
  return [
    `header:${meta.headerId || 'none'}`,
    `footer:${meta.footerId || 'none'}`,
    `body:${meta.bodyClassKey}`,
    `single:${meta.singleTemplateId || 'none'}`,
    `lang:${meta.lang}`,
  ].join('|');
}

function main() {
  const htmlFiles = walk(srcRoot);
  const pages = [];
  const shellGroups = new Map();
  const pageTypeAssets = new Map();
  const assetUsage = new Map();

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const route = `/${path.relative(srcRoot, path.dirname(file)).replace(/\\/g, '/')}/`.replace(/\/index\/$/, '/');
    const bodyClasses = ((html.match(/<body[^>]+class=["']([^"']+)/i) || [])[1] || '')
      .split(/\s+/)
      .filter(Boolean);
    const headerId = (html.match(/<header[^>]+data-elementor-id=["']([^"']+)/i) || [])[1] || null;
    const footerId = (html.match(/<footer[^>]+data-elementor-id=["']([^"']+)/i) || [])[1] || null;
    const singleTemplateId = (html.match(/data-elementor-type=["']single-post["'][^>]+data-elementor-id=["']([^"']+)/i) || [])[1] || null;
    const htmlLang = (html.match(/<html[^>]+lang=["']([^"']+)/i) || [])[1] || 'unknown';
    const cssAssets = uniq(readMatches(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)/gi).filter(isRealAssetUrl));
    const jsAssets = uniq(readMatches(html, /<script[^>]+src=["']([^"']+)/gi).filter(isRealAssetUrl));
    const meta = {
      route,
      file,
      lang: route.startsWith('/en/') ? 'en' : 'es',
      htmlLang,
      bodyClassKey: bodyClasses
        .filter((item) =>
          /^(home|archive|single|page|category|tag|elementor-page-\d+|postid-\d+|page-id-\d+|ast-[^ ]+|elementor-template-full-width|wp-singular)$/.test(item),
        )
        .join(' '),
      headerId,
      footerId,
      singleTemplateId,
      bodyClasses,
      cssAssets,
      jsAssets,
      inlineFlags: collectInlineFlags(html),
    };

    const pageType = classifyPage(route, bodyClasses, meta);
    meta.pageType = pageType;
    meta.shellSignature = buildShellSignature(meta);

    pages.push(meta);

    if (!shellGroups.has(meta.shellSignature)) {
      shellGroups.set(meta.shellSignature, {
        shellSignature: meta.shellSignature,
        count: 0,
        routes: [],
        headerId,
        footerId,
        singleTemplateId,
        lang: meta.lang,
        pageTypes: new Set(),
      });
    }
    const shell = shellGroups.get(meta.shellSignature);
    shell.count += 1;
    if (shell.routes.length < 10) shell.routes.push(route);
    shell.pageTypes.add(pageType);

    if (!pageTypeAssets.has(pageType)) {
      pageTypeAssets.set(pageType, {
        pageType,
        count: 0,
        css: new Map(),
        js: new Map(),
      });
    }
    const bucket = pageTypeAssets.get(pageType);
    bucket.count += 1;
    for (const asset of cssAssets) {
      bucket.css.set(asset, (bucket.css.get(asset) || 0) + 1);
      const normalized = normalizeAssetName(asset);
      if (!assetUsage.has(normalized)) {
        assetUsage.set(normalized, {
          asset: normalized,
          count: 0,
          kind: 'css',
          localPath: toLocalAssetPath(asset),
          pageTypes: new Set(),
        });
      }
      const info = assetUsage.get(normalized);
      info.count += 1;
      info.pageTypes.add(pageType);
    }
    for (const asset of jsAssets) {
      bucket.js.set(asset, (bucket.js.get(asset) || 0) + 1);
      const normalized = normalizeAssetName(asset);
      if (!assetUsage.has(normalized)) {
        assetUsage.set(normalized, {
          asset: normalized,
          count: 0,
          kind: 'js',
          localPath: toLocalAssetPath(asset),
          pageTypes: new Set(),
        });
      }
      const info = assetUsage.get(normalized);
      info.count += 1;
      info.pageTypes.add(pageType);
    }
  }

  fs.mkdirSync(reportDir, { recursive: true });

  const pageTypeSummary = sortEntries(
    [...pageTypeAssets.values()].map((entry) => ({
      name: entry.pageType,
      count: entry.count,
      cssTop: sortEntries([...entry.css.entries()].map(([asset, count]) => ({ name: asset, count }))).slice(0, 12),
      jsTop: sortEntries([...entry.js.entries()].map(([asset, count]) => ({ name: asset, count }))).slice(0, 12),
    })),
  );

  const shellSummary = sortEntries(
    [...shellGroups.values()].map((entry) => ({
      name: entry.shellSignature,
      count: entry.count,
      headerId: entry.headerId,
      footerId: entry.footerId,
      singleTemplateId: entry.singleTemplateId,
      lang: entry.lang,
      pageTypes: [...entry.pageTypes].sort(),
      sampleRoutes: entry.routes,
    })),
  );

  const assetSummary = sortEntries(
    [...assetUsage.values()].map((entry) => ({
      name: entry.asset,
      kind: entry.kind,
      count: entry.count,
      localPath: path.relative(siteRoot, entry.localPath),
      localExists: fs.existsSync(entry.localPath),
      pageTypes: [...entry.pageTypes].sort(),
    })),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    totalPages: pages.length,
    pageTypes: pageTypeSummary,
    shells: shellSummary,
    assets: assetSummary,
    pages: pages.map((page) => ({
      route: page.route,
      file: path.relative(siteRoot, page.file),
      pageType: page.pageType,
      shellSignature: page.shellSignature,
      headerId: page.headerId,
      footerId: page.footerId,
      singleTemplateId: page.singleTemplateId,
      htmlLang: page.htmlLang,
      inlineFlags: page.inlineFlags,
    })),
  };

  fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify(report, null, 2));

  const lines = [];
  lines.push('# Astro Migration Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push(`Total pages scanned: ${report.totalPages}`);
  lines.push('');
  lines.push('## Page types');
  lines.push('');
  for (const entry of pageTypeSummary) {
    lines.push(`- \`${entry.name}\`: ${entry.count} pages`);
  }
  lines.push('');
  lines.push('## Shells');
  lines.push('');
  for (const shell of shellSummary.slice(0, 12)) {
    lines.push(`### ${shell.name}`);
    lines.push('');
    lines.push(`- Count: ${shell.count}`);
    lines.push(`- Header: ${shell.headerId || 'none'}`);
    lines.push(`- Footer: ${shell.footerId || 'none'}`);
    lines.push(`- Single template: ${shell.singleTemplateId || 'none'}`);
    lines.push(`- Page types: ${shell.pageTypes.join(', ')}`);
    lines.push(`- Sample routes: ${shell.sampleRoutes.join(', ')}`);
    lines.push('');
  }
  lines.push('## Asset recommendations');
  lines.push('');
  lines.push('- Header/footer base should be extracted around header `9642` and footer `31645` for Spanish, and header `10265` and footer `31753` for English.');
  lines.push('- Blog archive and blog single are distinct shells and should not share one Astro layout.');
  lines.push('- Favor local mirrored assets under `src/wp-content/...` instead of remote `https://www.tictap.me/...` references during migration.');
  lines.push('');
  lines.push('## Most used CSS assets');
  lines.push('');
  for (const entry of assetSummary.filter((item) => item.kind === 'css').slice(0, 20)) {
    lines.push(`- \`${entry.name}\` | used in ${entry.count} pages | local: \`${entry.localExists ? entry.localPath : 'missing'}\``);
  }
  lines.push('');
  lines.push('## Most used JS assets');
  lines.push('');
  for (const entry of assetSummary.filter((item) => item.kind === 'js').slice(0, 20)) {
    lines.push(`- \`${entry.name}\` | used in ${entry.count} pages | local: \`${entry.localExists ? entry.localPath : 'missing'}\``);
  }
  lines.push('');
  fs.writeFileSync(path.join(reportDir, 'README.md'), `${lines.join('\n')}\n`);

  console.log(`Wrote ${path.relative(siteRoot, path.join(reportDir, 'report.json'))}`);
  console.log(`Wrote ${path.relative(siteRoot, path.join(reportDir, 'README.md'))}`);
}

main();
