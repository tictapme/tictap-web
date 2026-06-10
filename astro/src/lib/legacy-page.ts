import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const legacyRoot = path.join(process.cwd(), 'astro', 'legacy-sources');
const sourceRoot = path.join(process.cwd(), 'src');
const repoRoot = process.cwd();
const gitSourceCache = new Map<string, string | null>();

function readFile(relativePath: string) {
  return fs.readFileSync(path.join(legacyRoot, relativePath), 'utf8');
}

function readSourceFile(relativePath: string) {
  const legacyPath = path.join(legacyRoot, relativePath);
  const sourcePath = path.join(sourceRoot, relativePath);
  const gitRelativePath = path.posix.join('src', relativePath.replace(/\\/g, '/'));

  if (fs.existsSync(legacyPath)) {
    return fs.readFileSync(legacyPath, 'utf8');
  }

  if (gitSourceCache.has(gitRelativePath)) {
    const cached = gitSourceCache.get(gitRelativePath);
    if (cached !== null) {
      return cached;
    }
  } else {
    try {
      const committedHtml = execFileSync('git', ['show', `HEAD:${gitRelativePath}`], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      gitSourceCache.set(gitRelativePath, committedHtml);
      return committedHtml;
    } catch {
      gitSourceCache.set(gitRelativePath, null);
    }
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

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function mustMatch(html: string, pattern: RegExp, label: string) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return match[1];
}

function ensureElementorBodyClasses(bodyClass: string, pageHtml: string): string {
  if (!/data-elementor-type=["']header["']/i.test(pageHtml)) {
    return bodyClass;
  }

  const classes = bodyClass.split(/\s+/).filter(Boolean);
  for (const required of ['elementor-default', 'elementor-kit-6185']) {
    if (!classes.includes(required)) {
      classes.push(required);
    }
  }
  return classes.join(' ');
}

const shellCssCache = new Map<string, string>();
const shellCssMqCache = new Map<string, string>();
const globalInlineCssCache = new Map<string, string>();

/**
 * Extracts the global inline CSS blocks that WordPress/Elementor inject on every page
 * (astra-theme-css-inline-css and elementor-frontend-inline-css) from the reference
 * index page. These blocks contain CSS custom properties (colors, spacing, kit vars)
 * that the header and all Elementor widgets rely on, but that individual legacy-exported
 * pages may not include in their own <head>.
 */
export function loadGlobalInlineCss(lang: 'es' | 'en'): string {
  if (globalInlineCssCache.has(lang)) return globalInlineCssCache.get(lang)!;

  const refPath = lang === 'es' ? 'index.html' : 'en/index.html';
  const styleIds = ['astra-theme-css-inline-css', 'elementor-frontend-inline-css'];

  try {
    const rawHtml = readSourceFile(refPath);
    const headInner = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const blocks = styleIds
      .map((id) => {
        const match = headInner.match(
          new RegExp(`<style[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/style>`, 'i'),
        );
        return match ? match[1] : '';
      })
      .filter(Boolean);
    const css = blocks.join('\n');
    globalInlineCssCache.set(lang, css);
    return css;
  } catch {
    globalInlineCssCache.set(lang, '');
    return '';
  }
}

export function loadShellCss(lang: 'es' | 'en'): string {
  if (shellCssCache.has(lang)) return shellCssCache.get(lang)!;

  const headerId = '9642';
  const refPath = 'index.html';

  try {
    const rawHtml = readSourceFile(refPath);
    const headInner = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const styleBlocks = [...headInner.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
    const block = styleBlocks.find((s) => s.includes(`.elementor-${headerId} `)) ?? '';
    const blockWithoutMedia = block.replace(/@media[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g, '');
    const rules = [...blockWithoutMedia.matchAll(new RegExp(`\\.elementor-${headerId}[^{}]*\\{[^{}]*\\}`, 'g'))].map(
      (m) => m[0],
    );
    const mqRules = [...block.matchAll(/@media[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g)]
      .map((m) => m[0])
      .filter((mq) => mq.includes(`.elementor-${headerId}`));
    const css = rules.join('') + mqRules.join('');
    shellCssCache.set(lang, css);
    return css;
  } catch {
    shellCssCache.set(lang, '');
    return '';
  }
}

export function loadShellCssMq(lang: 'es' | 'en'): string {
  if (shellCssMqCache.has(lang)) return shellCssMqCache.get(lang)!;

  const headerId = '9642';
  const refPath = 'index.html';

  try {
    const rawHtml = readSourceFile(refPath);
    const headInner = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
    const styleBlocks = [...headInner.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
    const block = styleBlocks.find((s) => s.includes(`.elementor-${headerId} `)) ?? '';
    const mqRules = [...block.matchAll(/@media[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g)]
      .map((m) => m[0])
      .filter((mq) => mq.includes(`.elementor-${headerId}`));
    const css = mqRules.join('');
    shellCssMqCache.set(lang, css);
    return css;
  } catch {
    shellCssMqCache.set(lang, '');
    return '';
  }
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
    /<link[^>]+href=["'][^"']*elementor-pro\/assets\/css\/widget-post-info\.min\.css[^>]*>\s*/gi,
    /<link[^>]+href=["'][^"']*elementor\/assets\/css\/widget-icon-list\.min\.css[^>]*>\s*/gi,
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

function stripAstroInjectedHeadHtml(html: string) {
  return html
    .replace(
      /\.elementor-location-header\[data-astro-cid-[^\]]+\][\s\S]*?\.site-main\[data-astro-cid-[^\]]+\]\{position:relative;z-index:1\}/gis,
      '',
    )
    .replace(/<style>\s*<\/style>\s*/gis, '')
    .replace(/\sdata-astro-cid-[a-z0-9]+(?:=(?:"[^"]*"|'[^']*'))?/gi, '');
}

export function sanitizeHeadExtraHtml(html: string) {
  return stripAstroInjectedHeadHtml(stripBaseHeadTags(stripCommonCssAssetTags(html))).trim();
}

export function sanitizeAfterFooterHtml(html: string) {
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
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
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
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/class=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/itemtype=["']([^"']+)["']/i);
  const hasBodyItemscope = /\sitemscope(?:=["'][^"']*["'])?/i.test(bodyAttributes);

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass: ensureElementorBodyClasses(bodyClassMatch?.[1] || '', bodyInnerHtml),
    bodyItemType: bodyItemTypeMatch?.[1] || '',
    bodyItemscope: hasBodyItemscope,
    headExtraHtml: stripAstroInjectedHeadHtml(stripBaseHeadTags(headInner)).trim(),
    bodyInnerHtml,
  };
}

export function loadSourceStructuredPage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, 'body classes');
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyItemTypeMatch = normalized.match(/<body[^>]+itemtype=["']([^"']+)["']/i);

  // Support both <footer data-elementor-type="footer"> and <div data-elementor-type="footer">
  const contentMatch = normalized.match(
    /(<div id="content" class="site-content">[\s\S]*?)<(?:footer|div)\b[^>]+data-elementor-type=["']footer["']/i,
  );
  if (!contentMatch) throw new Error(`Could not extract content for ${relativePath}`);
  const contentHtml = contentMatch[1];

  let afterFooterHtml: string;
  const afterFooterByTag = normalized.match(/<\/footer>([\s\S]*?)<\/body>/i);
  if (afterFooterByTag) {
    afterFooterHtml = afterFooterByTag[1];
  } else {
    // Footer uses <div> — extract the script block that follows the footer div
    const footerDivPos = normalized.search(/elementor-location-footer/i);
    const scriptsPos = footerDivPos !== -1 ? normalized.indexOf('<script', footerDivPos) : -1;
    const bodyClosePos = normalized.lastIndexOf('</body>');
    afterFooterHtml = scriptsPos !== -1 && scriptsPos < bodyClosePos
      ? normalized.slice(scriptsPos, bodyClosePos)
      : '';
  }

  return {
    title,
    lang: langMatch?.[1] || 'es-ES',
    bodyClass: ensureElementorBodyClasses(bodyClass, normalized),
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
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
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
    bodyClass: ensureElementorBodyClasses(bodyClassMatch?.[1] || '', bodyInnerHtml),
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
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
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
    headExtraHtml: stripAstroInjectedHeadHtml(stripBaseHeadTags(headInner))
      .replace(/<meta[^>]+http-equiv=["']refresh["'][^>]*>\s*/i, ''),
    bodyInnerHtml,
    targetUrl,
  };
}
