import fs from 'node:fs';
import path from 'node:path';

const legacyRoot = path.join(process.cwd(), 'astro', 'legacy-sources');
const sourceRoot = path.join(process.cwd(), 'src');

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(legacyRoot, relativePath), 'utf8');
}

function readSourceFile(relativePath: string) {
  return fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8');
}

function rewriteToLocal(html: string) {
  return html
    .replace(/https?:\/\/www\.tictap\.me/g, '')
    .replace(/https?:\/\/127\.0\.0\.1:\d+/g, '')
    .replace(/(href|src)=["']\/\/fonts\.googleapis\.com/gi, '$1="https://fonts.googleapis.com')
    .replace(/(href|src)=["']\/\/fonts\.gstatic\.com/gi, '$1="https://fonts.gstatic.com');
}

function mustMatch(html: string, pattern: RegExp, label: string) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return match[1];
}

function stripCommonAssetTags(html: string) {
  const commonAssetPatterns = [
    /<link[^>]+href=["'][^"']*wp-content\/themes\/astra\/assets\/css\/minified\/style-flex\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*sitepress-multilingual-cms\/templates\/language-switchers\/legacy-list-horizontal\/style\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*sitepress-multilingual-cms\/templates\/language-switchers\/menu-item\/style\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*wpml-cms-nav\/res\/css\/cms-navigation-base\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*wpml-cms-nav\/res\/css\/cms-navigation\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/frontend\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/widget-image\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/widget-heading\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/widget-social-icons\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/conditionals\/apple-webkit\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/lib\/font-awesome\/css\/all\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/lib\/font-awesome\/css\/v4-shims\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor-pro\/assets\/css\/widget-mega-menu\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor-pro\/assets\/css\/widget-nav-menu\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor-pro\/assets\/css\/modules\/sticky\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/lib\/animations\/styles\/fadeIn\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/lib\/animations\/styles\/e-animation-shrink\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/lib\/animations\/styles\/e-animation-grow\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*wp-content\/uploads\/elementor\/google-fonts\/css\/lato\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*wp-content\/uploads\/elementor\/google-fonts\/css\/varelaround\.css[^>]*>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/jquery\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/jquery-migrate\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*themes\/astra\/assets\/js\/minified\/style\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/ui\/core\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/ui\/mouse\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/ui\/slider\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/ui\/draggable\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/jquery\/jquery\.ui\.touch-punch\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor\/assets\/js\/webpack\.runtime\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor\/assets\/js\/frontend-modules\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor\/assets\/js\/frontend\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor-pro\/assets\/lib\/smartmenus\/jquery\.smartmenus\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor-pro\/assets\/lib\/sticky\/jquery\.sticky\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor-pro\/assets\/js\/webpack-pro\.runtime\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/dist\/hooks\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*wp-includes\/js\/dist\/i18n\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor-pro\/assets\/js\/frontend\.min\.js[^>]*><\/script>\s*/gi,
    /<script[^>]+src=["'][^"']*elementor-pro\/assets\/js\/elements-handlers\.min\.js[^>]*><\/script>\s*/gi,
  ];

  return commonAssetPatterns.reduce((current, pattern) => current.replace(pattern, ''), html);
}

export function loadLegacyPage(relativePath: string) {
  const rawHtml = readFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, 'body classes');
  const contentHtml = mustMatch(normalized, /(<div id="content" class="site-content">[\s\S]*?)<footer data-elementor-type="footer"/i, 'content');
  const afterFooterHtml = mustMatch(normalized, /<\/footer>([\s\S]*?)<\/body>/i, 'after footer');
  const title = mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim();
  const headExtraHtml = stripCommonAssetTags(headInner)
    .replace(/<meta charset=["'][^"']+["']>\s*/i, '')
    .replace(/<meta name=["']viewport["'][^>]*>\s*/i, '');

  return {
    title,
    bodyClass,
    headExtraHtml,
    contentHtml,
    afterFooterHtml,
  };
}

export function loadLegacyShell(relativePath: string) {
  const rawHtml = readFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headerHtml = mustMatch(
    normalized,
    /(<header[^>]+data-elementor-type=["']header["'][\s\S]*?<\/header>)/i,
    'header',
  );
  const footerHtml = mustMatch(
    normalized,
    /(<footer[^>]+data-elementor-type=["']footer["'][\s\S]*?<\/footer>)/i,
    'footer',
  );

  return {
    headerHtml,
    footerHtml,
  };
}

export function loadSourceShell(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headerHtml = mustMatch(
    normalized,
    /(<header[^>]+data-elementor-type=["']header["'][\s\S]*?<\/header>)/i,
    'header',
  );
  const footerHtml = mustMatch(
    normalized,
    /(<footer[^>]+data-elementor-type=["']footer["'][\s\S]*?<\/footer>)/i,
    'footer',
  );

  return {
    headerHtml,
    footerHtml,
  };
}

function normalizeRoute(relativePath: string) {
  if (relativePath === 'index.html') {
    return '/';
  }

  return `/${relativePath.replace(/\/index\.html$/i, '').replace(/^\/+/, '')}/`;
}

function shouldSkipManagedRoute(route: string) {
  if (route === '/blog/') {
    return true;
  }

  if (/^\/blog\/[^/]+\/$/i.test(route)) {
    return true;
  }

  return false;
}

function walkIndexPages(rootDir: string, currentDir = ''): string[] {
  const absoluteDir = path.join(rootDir, currentDir);
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const pages: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const nextRelative = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      pages.push(...walkIndexPages(rootDir, nextRelative));
      continue;
    }

    if (entry.isFile() && entry.name === 'index.html') {
      pages.push(nextRelative.replace(/\\/g, '/'));
    }
  }

  return pages;
}

export function listManagedLegacyRoutes() {
  return walkIndexPages(sourceRoot)
    .map((relativePath) => ({
      relativePath,
      route: normalizeRoute(relativePath),
    }))
    .filter(({ route }) => !shouldSkipManagedRoute(route));
}

export function loadSourcePage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not extract body for ${relativePath}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const bodyInnerHtml = bodyMatch[2];
  const title = mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim();
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/class=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/itemtype=["']([^"']+)["']/i);
  const hasBodyItemscope = /\sitemscope(?:=["'][^"']*["'])?/i.test(bodyAttributes);

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass: bodyClassMatch?.[1] || '',
    bodyItemType: bodyItemTypeMatch?.[1] || '',
    bodyItemscope: hasBodyItemscope,
    headExtraHtml: headInner
      .replace(/<meta charset=["'][^"']+["']>\s*/i, '')
      .replace(/<meta name=["']viewport["'][^>]*>\s*/i, '')
      .replace(/<title>[\s\S]*?<\/title>\s*/i, ''),
    bodyInnerHtml,
  };
}

export function loadSourceStructuredPage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, 'body classes');
  const contentHtml = mustMatch(normalized, /(<div id="content" class="site-content">[\s\S]*?)<footer data-elementor-type="footer"/i, 'content');
  const afterFooterHtml = mustMatch(normalized, /<\/footer>([\s\S]*?)<\/body>/i, 'after footer');
  const title = mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim();
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyItemTypeMatch = normalized.match(/<body[^>]+itemtype=["']([^"']+)["']/i);

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass,
    bodyItemType: bodyItemTypeMatch?.[1] || 'https://schema.org/WebPage',
    headExtraHtml: stripCommonAssetTags(headInner)
      .replace(/<meta charset=["'][^"']+["']>\s*/i, '')
      .replace(/<meta name=["']viewport["'][^>]*>\s*/i, ''),
    contentHtml,
    afterFooterHtml,
  };
}

export function loadSourceStructuredElementorShellPage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not extract body for ${relativePath}`);
  }

  const bodyAttributes = bodyMatch[1] || '';
  const bodyInnerHtml = bodyMatch[2];
  const title = mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim();
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/class=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/itemtype=["']([^"']+)["']/i);
  const hasBodyItemscope = /\sitemscope(?:=["'][^"']*["'])?/i.test(bodyAttributes);
  const headerMatch = bodyInnerHtml.match(/(<(header|div)[^>]+data-elementor-type=["']header["'][\s\S]*?<\/\2>)/i);
  const footerMatch = bodyInnerHtml.match(/(<(footer|div)[^>]+data-elementor-type=["']footer["'][\s\S]*?<\/\2>)/i);

  if (!headerMatch || !footerMatch) {
    throw new Error(`Could not extract Elementor shell for ${relativePath}`);
  }

  const headerHtml = headerMatch[1];
  const footerHtml = footerMatch[1];
  const headerIndex = bodyInnerHtml.indexOf(headerHtml);
  const footerIndex = bodyInnerHtml.indexOf(footerHtml, headerIndex + headerHtml.length);

  if (headerIndex === -1 || footerIndex === -1) {
    throw new Error(`Could not locate shell boundaries for ${relativePath}`);
  }

  const contentHtml = bodyInnerHtml.slice(headerIndex + headerHtml.length, footerIndex);
  const afterFooterHtml = bodyInnerHtml.slice(footerIndex + footerHtml.length);

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass: bodyClassMatch?.[1] || '',
    bodyItemType: bodyItemTypeMatch?.[1] || '',
    bodyItemscope: hasBodyItemscope,
    headExtraHtml: headInner
      .replace(/<meta charset=["'][^"']+["']>\s*/i, '')
      .replace(/<meta name=["']viewport["'][^>]*>\s*/i, '')
      .replace(/<title>[\s\S]*?<\/title>\s*/i, ''),
    headerHtml,
    contentHtml,
    footerHtml,
    afterFooterHtml,
  };
}
