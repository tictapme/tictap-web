const fs = require('fs');
const path = require('path');
const { resolvePublishContext } = require('./site-host');

const SRC_DIR = path.join(__dirname, '..', 'src');
const { host: TARGET_HOST, nonTargetHosts: LEGACY_HOSTS } = resolvePublishContext();
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.map', '.md', '.svg', '.txt', '.xml', '.xsl']);

const NOINDEX_ROUTE_PATTERNS = [
  /^\/404\/$/,
  /^\/cart\/$/,
  /^\/checkout\/$/,
  /^\/my-account\/$/,
  /^\/elementor-23836\/$/,
  /^\/en\/cart\/$/,
  /^\/en\/checkout\/$/,
  /^\/en\/my-account\/$/,
  /^\/en\/elementor-23836\/$/,
  /^\/author\/.+/,
  /^\/en\/author\/.+/,
  /^\/tag\/.+/,
  /^\/en\/tag\/.+/,
  /^\/blog\/page\/\d+\/$/,
  /^\/casos-de-exito\/page\/\d+\/$/,
  /^\/en\/blog\/page\/\d+\/$/,
  /^\/en\/sucess-stories\/page\/\d+\/$/,
];

const SITEMAP_FILES = ['page-sitemap.xml', 'post-sitemap.xml'];

normalizeTextAssets();
optimizeHtml();
optimizeXmlSitemaps();
writeRobotsTxt();

function normalizeTextAssets() {
  const textFiles = getFilesRecursive(SRC_DIR, (filePath) => {
    const baseName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return TEXT_EXTENSIONS.has(ext) || baseName === '_redirects' || baseName === '_headers';
  });

  for (const filePath of textFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = normalizeHosts(content);

    if (updated !== content) {
      fs.writeFileSync(filePath, updated);
    }
  }
}

function optimizeHtml() {
  const htmlFiles = getFilesRecursive(SRC_DIR, (filePath) => filePath.endsWith('.html'));

  for (const filePath of htmlFiles) {
    let html = fs.readFileSync(filePath, 'utf8');
    const route = routeFromFile(filePath);
    const updated = setRobotsDirective(rewriteUnwantedArchiveLinks(normalizeHosts(html)), shouldNoindex(route));

    if (updated !== html) {
      fs.writeFileSync(filePath, updated);
    }
  }
}

function rewriteUnwantedArchiveLinks(html) {
  return html.replace(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi, (anchor, href) => {
    const rewrittenHref = rewriteUnwantedArchiveHref(href);

    if (rewrittenHref === href) {
      return anchor;
    }

    return anchor
      .replace(`href="${href}"`, `href="${rewrittenHref}"`)
      .replace(/\srel="author"/gi, '')
      .replace(/\stitle="(?:View all posts by|Ver todas las entradas de)[^"]*"/gi, '');
  });
}

function rewriteUnwantedArchiveHref(href) {
  if (/^\/en\/author\/.+/i.test(href) || /^\/en\/tag\/.+/i.test(href)) {
    return '/en/blog/';
  }

  if (/^\/author\/.+/i.test(href) || /^\/tag\/.+/i.test(href)) {
    return '/blog/';
  }

  return href;
}

function optimizeXmlSitemaps() {
  for (const fileName of SITEMAP_FILES) {
    const filePath = path.join(SRC_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const xml = fs.readFileSync(filePath, 'utf8');
    const normalized = normalizeHosts(xml);
    const entries = extractUrlEntries(normalized);
    const deduped = dedupeAndFilterEntries(entries);
    const rebuilt = buildUrlSetXml(deduped);
    fs.writeFileSync(filePath, rebuilt);
  }

  const sitemapIndexXml = buildSitemapIndexXml();
  fs.writeFileSync(path.join(SRC_DIR, 'sitemap.xml'), sitemapIndexXml);
  fs.writeFileSync(path.join(SRC_DIR, 'sitemap_index.xml'), sitemapIndexXml);
}

function writeRobotsTxt() {
  const robotsTxt = ['User-agent: *', 'Disallow:', '', `Sitemap: ${TARGET_HOST}/sitemap_index.xml`, ''].join('\n');
  fs.writeFileSync(path.join(SRC_DIR, 'robots.txt'), robotsTxt);
}

function normalizeHosts(content) {
  return LEGACY_HOSTS.reduce((current, host) => {
    const escapedHost = host.replace(/\//g, '\\/');
    const escapedProdHost = TARGET_HOST.replace(/\//g, '\\/');
    const encodedHost = encodeURIComponent(host);
    const encodedProdHost = encodeURIComponent(TARGET_HOST);
    const malformedHost = host.replace('https://', 'https:/');
    const hostName = host.replace(/^https?:\/\//, '');

    return current
      .split(host)
      .join(TARGET_HOST)
      .split(malformedHost)
      .join(TARGET_HOST)
      .split(hostName)
      .join(TARGET_HOST.replace(/^https?:\/\//, ''))
      .split(escapedHost)
      .join(escapedProdHost)
      .split(encodedHost)
      .join(encodedProdHost);
  }, content);
}

function setRobotsDirective(html, noindex) {
  const desired = noindex
    ? '<meta name="robots" content="noindex, follow">'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';

  if (/<meta name="robots" content="[^"]*">/i.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]*">/i, desired);
  }

  if (/<meta name="viewport"[^>]*>/i.test(html)) {
    return html.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${desired}`);
  }

  return html.replace(/<head>/i, `<head>\n${desired}`);
}

function shouldNoindex(route) {
  return NOINDEX_ROUTE_PATTERNS.some((pattern) => pattern.test(route));
}

function routeFromFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}/`;
  }

  return `/${relativePath}`;
}

function getFilesRecursive(dirPath, predicate) {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(fullPath, predicate));
      continue;
    }

    if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

function extractUrlEntries(xml) {
  const entries = [];
  const matches = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const entryXml of matches) {
    const locMatch = entryXml.match(/<loc>([\s\S]*?)<\/loc>/);
    if (!locMatch) {
      continue;
    }

    const lastmodMatch = entryXml.match(/<lastmod>([\s\S]*?)<\/lastmod>/);
    entries.push({
      loc: decodeXml(locMatch[1].trim()),
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : '',
      xml: entryXml,
    });
  }

  return entries;
}

function dedupeAndFilterEntries(entries) {
  const byLoc = new Map();

  for (const entry of entries) {
    let url;
    try {
      url = new URL(entry.loc);
    } catch {
      continue;
    }

    if (url.search) {
      continue;
    }

    if (shouldNoindex(url.pathname)) {
      continue;
    }

    const normalizedLoc = `${TARGET_HOST}${url.pathname}`;
    const normalizedXml = normalizeHosts(entry.xml).replace(entry.loc, normalizedLoc);
    const current = {
      loc: normalizedLoc,
      lastmod: entry.lastmod,
      xml: normalizedXml,
    };

    const previous = byLoc.get(normalizedLoc);
    if (!previous || current.lastmod > previous.lastmod) {
      byLoc.set(normalizedLoc, current);
    }
  }

  return [...byLoc.values()];
}

function buildUrlSetXml(entries) {
  const header = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${TARGET_HOST}/main-sitemap.xsl"?>`;
  const openTag = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = entries.map((entry) => `\t${entry.xml.replace(/\n/g, '\n\t')}`).join('\n');
  const closeTag = '</urlset>';
  const footer = '<!-- XML Sitemap generated by Yoast SEO -->';

  return [header, openTag, body, closeTag, footer].filter(Boolean).join('\n');
}

function buildSitemapIndexXml() {
  const header = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${TARGET_HOST}/main-sitemap.xsl"?>`;
  const openTag = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const body = SITEMAP_FILES.filter((fileName) => fs.existsSync(path.join(SRC_DIR, fileName)))
    .map((fileName) => {
      const fullPath = path.join(SRC_DIR, fileName);
      const lastmod = new Date(fs.statSync(fullPath).mtimeMs).toISOString();

      return [
        '\t<sitemap>',
        `\t\t<loc>${TARGET_HOST}/${fileName}</loc>`,
        `\t\t<lastmod>${lastmod}</lastmod>`,
        '\t</sitemap>',
      ].join('\n');
    })
    .join('\n');
  const closeTag = '</sitemapindex>';
  const footer = '<!-- XML Sitemap generated by Yoast SEO -->';

  return [header, openTag, body, closeTag, footer].join('\n');
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
