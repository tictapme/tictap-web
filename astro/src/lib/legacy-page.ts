import fs from 'node:fs';
import path from 'node:path';

const legacyRoot = path.join(process.cwd(), 'astro', 'legacy-sources');
const sourceRoot = path.join(process.cwd(), 'src');

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(legacyRoot, relativePath), 'utf8');
}

function readSourceFile(relativePath: string) {
  const legacyPath = path.join(legacyRoot, relativePath);
  const sourcePath = path.join(sourceRoot, relativePath);

  if (fs.existsSync(legacyPath)) {
    return fs.readFileSync(legacyPath, 'utf8');
  }

  return fs.readFileSync(sourcePath, 'utf8');
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

export function extractInlineConfigScripts(html: string): { configHtml: string; remainingHtml: string } {
  const configScriptIds = [
    'astra-theme-js-js-extra',
    'elementor-frontend-js-before',
    'elementor-pro-frontend-js-before',
  ];

  let configHtml = '';
  let remainingHtml = html;

  for (const id of configScriptIds) {
    const pattern = new RegExp(`<script\\b[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`, 'i');
    const match = remainingHtml.match(pattern);
    if (match) {
      configHtml += match[0];
      remainingHtml = remainingHtml.replace(pattern, '');
    }
  }

  return { configHtml, remainingHtml };
}

export function stripBundleJsAssets(html: string) {
  const bundleJsPatterns = [
    /<script\b[^>]*src=["'][^"']*jquery\/jquery\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\/jquery-migrate\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*font-awesome\/js\/v4-shims\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*astra\/assets\/js\/minified\/style\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\/ui\/core\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\/ui\/mouse\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\/ui\/slider\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\/ui\/draggable\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*jquery\.ui\.touch-punch\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor\/assets\/js\/webpack\.runtime\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor\/assets\/js\/frontend-modules\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor\/assets\/js\/frontend\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*imagesloaded\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor-pro\/assets\/js\/webpack-pro\.runtime\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*js\/dist\/hooks\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*js\/dist\/i18n\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor-pro\/assets\/js\/frontend\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*elementor-pro\/assets\/js\/elements-handlers\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*smartmenus\/jquery\.smartmenus\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
    /<script\b[^>]*src=["'][^"']*sticky\/jquery\.sticky\.min\.js[^"']*["'][^>]*><\/script>\s*/gi,
  ];

  return bundleJsPatterns.reduce((current, pattern) => current.replace(pattern, ''), html);
}

function stripCommonCssAssetTags(html: string) {
  const commonCssAssetPatterns = [
    /<link[^>]+href=["'][^"']*wp-includes\/css\/dist\/block-library\/style\.min\.css[^>]*>\s*/gi,
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
  ];

  return commonCssAssetPatterns.reduce((current, pattern) => current.replace(pattern, ''), html);
}

function stripBaseHeadTags(html: string) {
  return html
    .replace(/<meta charset=["'][^"']+["']>\s*/gi, '')
    .replace(/<meta name=["']viewport["'][^>]*>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '');
}

function sanitizeHeadExtraHtml(html: string) {
  return stripBaseHeadTags(stripCommonCssAssetTags(html)).trim();
}

function sanitizeAfterFooterHtml(html: string) {
  const seenScriptSrcs = new Set<string>();

  const dedupedHtml = html
    .replace(/<script\b([^>]*)src=["']([^"']+)["']([^>]*)><\/script>\s*/gi, (match, beforeSrc, src, afterSrc) => {
      const normalizedSrc = src.replace(/\?ver=[^"'&]+/i, '');
      if (seenScriptSrcs.has(normalizedSrc)) {
        return '';
      }

      seenScriptSrcs.add(normalizedSrc);
      return `<script${beforeSrc}src="${src}"${afterSrc}></script>`;
    })
    .replace(/^\s*(?:<\/div>\s*)+/i, '')
    .trim();

  return reorderInlineScriptConfigs(dedupedHtml);
}

function moveInlineScriptBefore(html: string, inlineScriptId: string, targetScriptId: string) {
  const inlinePattern = new RegExp(
    `<script\\b[^>]*id=["']${inlineScriptId}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`,
    'i',
  );
  const inlineMatch = html.match(inlinePattern);

  if (!inlineMatch) {
    return html;
  }

  const inlineScript = inlineMatch[0].trim();
  const withoutInline = html.replace(inlinePattern, '');
  const targetPattern = new RegExp(
    `(<script\\b(?=[^>]*id=["']${targetScriptId}["'])(?=[^>]*src=["'][^"']+["'])[^>]*><\\/script>)`,
    'i',
  );

  if (!targetPattern.test(withoutInline)) {
    return html;
  }

  return withoutInline.replace(targetPattern, `${inlineScript}\n$1`);
}

function moveInlineScriptAfter(html: string, inlineScriptId: string, targetScriptId: string) {
  const inlinePattern = new RegExp(
    `<script\\b[^>]*id=["']${inlineScriptId}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`,
    'i',
  );
  const inlineMatch = html.match(inlinePattern);

  if (!inlineMatch) {
    return html;
  }

  const inlineScript = inlineMatch[0].trim();
  const withoutInline = html.replace(inlinePattern, '');
  const targetPattern = new RegExp(
    `(<script\\b(?=[^>]*id=["']${targetScriptId}["'])(?=[^>]*src=["'][^"']+["'])[^>]*><\\/script>)`,
    'i',
  );

  if (!targetPattern.test(withoutInline)) {
    return html;
  }

  return withoutInline.replace(targetPattern, `$1\n${inlineScript}`);
}

function reorderInlineScriptConfigs(html: string) {
  let reordered = html;

  reordered = moveInlineScriptBefore(reordered, 'astra-theme-js-js-extra', 'astra-theme-js');
  reordered = moveInlineScriptBefore(reordered, 'elementor-frontend-js-before', 'elementor-frontend-js');
  reordered = moveInlineScriptBefore(reordered, 'elementor-pro-frontend-js-before', 'elementor-pro-frontend-js');
  reordered = moveInlineScriptAfter(reordered, 'wp-i18n-js-after', 'wp-i18n-js');

  return reordered;
}

export function loadLegacyPage(relativePath: string) {
  const rawHtml = readFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, 'body classes');
  const contentHtml = mustMatch(normalized, /(<div id="content" class="site-content">[\s\S]*?)<footer data-elementor-type="footer"/i, 'content');
  const afterFooterHtml = mustMatch(normalized, /<\/footer>([\s\S]*?)<\/body>/i, 'after footer');
  const title = mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim();
  const headExtraHtml = sanitizeHeadExtraHtml(headInner);

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

  if (/^\/en\/blog\/[^/]+\/$/i.test(route)) {
    return true;
  }

  if (/^\/(?:en\/)?author\/.+/i.test(route)) {
    return true;
  }

  if (/^\/(?:en\/)?tag\/.+/i.test(route)) {
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
    headExtraHtml: stripBaseHeadTags(headInner),
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
    headExtraHtml: sanitizeHeadExtraHtml(headInner),
    contentHtml,
    afterFooterHtml: sanitizeAfterFooterHtml(afterFooterHtml),
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
    headExtraHtml: sanitizeHeadExtraHtml(headInner),
    headerHtml,
    contentHtml,
    footerHtml,
    afterFooterHtml: sanitizeAfterFooterHtml(afterFooterHtml),
  };
}

export function loadSourceRedirectPage(relativePath: string) {
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
  const targetMatch =
    normalized.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i) ||
    normalized.match(/window\.location\s*=\s*["']([^"']+)["']/i);

  if (!targetMatch) {
    throw new Error(`Could not extract redirect target for ${relativePath}`);
  }

  const targetUrl = targetMatch[1];

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass: bodyClassMatch?.[1] || '',
    headExtraHtml: stripBaseHeadTags(headInner)
      .replace(/<meta[^>]+http-equiv=["']refresh["'][^>]*>\s*/i, ''),
    bodyInnerHtml,
    targetUrl,
  };
}
