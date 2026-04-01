import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { e as createAstro, c as createComponent, f as addAttribute, d as renderTemplate } from './astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import 'clsx';

const legacyRoot = path.join(process.cwd(), "astro", "legacy-sources");
const sourceRoot = path.join(process.cwd(), "src");
const repoRoot = process.cwd();
const gitSourceCache = /* @__PURE__ */ new Map();
function readFile(relativePath) {
  return fs.readFileSync(path.join(legacyRoot, relativePath), "utf8");
}
function readSourceFile(relativePath) {
  const legacyPath = path.join(legacyRoot, relativePath);
  const sourcePath = path.join(sourceRoot, relativePath);
  const gitRelativePath = path.posix.join("src", relativePath.replace(/\\/g, "/"));
  if (fs.existsSync(legacyPath)) {
    return fs.readFileSync(legacyPath, "utf8");
  }
  if (gitSourceCache.has(gitRelativePath)) {
    const cached = gitSourceCache.get(gitRelativePath);
    if (cached !== null) {
      return cached;
    }
  } else {
    try {
      const committedHtml = execFileSync("git", ["show", `HEAD:${gitRelativePath}`], {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      });
      gitSourceCache.set(gitRelativePath, committedHtml);
      return committedHtml;
    } catch {
      gitSourceCache.set(gitRelativePath, null);
    }
  }
  return fs.readFileSync(sourcePath, "utf8");
}
function rewriteToLocal(html) {
  return html.replace(/https?:\/\/www\.tictap\.me/g, "").replace(/https?:\/\/127\.0\.0\.1:\d+/g, "").replace(/(href|src)=["']\/\/fonts\.googleapis\.com/gi, '$1="https://fonts.googleapis.com').replace(/(href|src)=["']\/\/fonts\.gstatic\.com/gi, '$1="https://fonts.gstatic.com');
}
function decodeHtmlEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function mustMatch(html, pattern, label) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return match[1];
}
const shellCssCache = /* @__PURE__ */ new Map();
function loadShellCss(lang) {
  if (shellCssCache.has(lang)) return shellCssCache.get(lang);
  const headerId = lang === "es" ? "9642" : "10265";
  const refPath = lang === "es" ? "index.html" : "en/index.html";
  try {
    const rawHtml = readSourceFile(refPath);
    const headInner = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
    const styleBlocks = [...headInner.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
    const block = styleBlocks.find((s) => s.includes(`.elementor-${headerId} `)) ?? "";
    const rules = [...block.matchAll(new RegExp(`\\.elementor-${headerId}[^{}]*\\{[^{}]*\\}`, "g"))].map(
      (m) => m[0]
    );
    const css = rules.join("");
    shellCssCache.set(lang, css);
    return css;
  } catch {
    shellCssCache.set(lang, "");
    return "";
  }
}
function extractInlineConfigScripts(html) {
  const configScriptIds = [
    "astra-theme-js-js-extra",
    "elementor-frontend-js-before",
    "elementor-pro-frontend-js-before"
  ];
  let configHtml = "";
  let remainingHtml = html;
  for (const id of configScriptIds) {
    const pattern = new RegExp(`<script\\b[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`, "i");
    const match = remainingHtml.match(pattern);
    if (match) {
      configHtml += match[0];
      remainingHtml = remainingHtml.replace(pattern, "");
    }
  }
  return { configHtml, remainingHtml };
}
function stripBundleJsAssets(html) {
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
    /<script\b[^>]*src=["'][^"']*sticky\/jquery\.sticky\.min\.js[^"']*["'][^>]*><\/script>\s*/gi
  ];
  return bundleJsPatterns.reduce((current, pattern) => current.replace(pattern, ""), html);
}
function stripCommonCssAssetTags(html) {
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
    /<link[^>]+href=["'][^"']*wp-content\/uploads\/elementor\/google-fonts\/css\/varelaround\.css[^>]*>\s*/gi
  ];
  return commonCssAssetPatterns.reduce((current, pattern) => current.replace(pattern, ""), html);
}
function stripBaseHeadTags(html) {
  return html.replace(/<meta charset=["'][^"']+["']>\s*/gi, "").replace(/<meta name=["']viewport["'][^>]*>\s*/gi, "").replace(/<title>[\s\S]*?<\/title>\s*/gi, "");
}
function stripAstroInjectedHeadHtml(html) {
  return html.replace(
    /\.elementor-location-header\[data-astro-cid-[^\]]+\][\s\S]*?\.site-main\[data-astro-cid-[^\]]+\]\{position:relative;z-index:1\}/gis,
    ""
  ).replace(/<style>\s*<\/style>\s*/gis, "").replace(/\sdata-astro-cid-[a-z0-9]+(?:=(?:"[^"]*"|'[^']*'))?/gi, "");
}
function sanitizeHeadExtraHtml(html) {
  return stripAstroInjectedHeadHtml(stripBaseHeadTags(stripCommonCssAssetTags(html))).trim();
}
function sanitizeAfterFooterHtml(html) {
  const seenScriptSrcs = /* @__PURE__ */ new Set();
  const dedupedHtml = html.replace(/<script\b([^>]*)src=["']([^"']+)["']([^>]*)><\/script>\s*/gi, (match, beforeSrc, src, afterSrc) => {
    const normalizedSrc = src.replace(/\?ver=[^"'&]+/i, "");
    if (seenScriptSrcs.has(normalizedSrc)) {
      return "";
    }
    seenScriptSrcs.add(normalizedSrc);
    return `<script${beforeSrc}src="${src}"${afterSrc}><\/script>`;
  }).replace(/^\s*(?:<\/div>\s*)+/i, "").trim();
  return reorderInlineScriptConfigs(dedupedHtml);
}
function moveInlineScriptBefore(html, inlineScriptId, targetScriptId) {
  const inlinePattern = new RegExp(
    `<script\\b[^>]*id=["']${inlineScriptId}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`,
    "i"
  );
  const inlineMatch = html.match(inlinePattern);
  if (!inlineMatch) {
    return html;
  }
  const inlineScript = inlineMatch[0].trim();
  const withoutInline = html.replace(inlinePattern, "");
  const targetPattern = new RegExp(
    `(<script\\b(?=[^>]*id=["']${targetScriptId}["'])(?=[^>]*src=["'][^"']+["'])[^>]*><\\/script>)`,
    "i"
  );
  if (!targetPattern.test(withoutInline)) {
    return html;
  }
  return withoutInline.replace(targetPattern, `${inlineScript}
$1`);
}
function moveInlineScriptAfter(html, inlineScriptId, targetScriptId) {
  const inlinePattern = new RegExp(
    `<script\\b[^>]*id=["']${inlineScriptId}["'][^>]*>[\\s\\S]*?<\\/script>\\s*`,
    "i"
  );
  const inlineMatch = html.match(inlinePattern);
  if (!inlineMatch) {
    return html;
  }
  const inlineScript = inlineMatch[0].trim();
  const withoutInline = html.replace(inlinePattern, "");
  const targetPattern = new RegExp(
    `(<script\\b(?=[^>]*id=["']${targetScriptId}["'])(?=[^>]*src=["'][^"']+["'])[^>]*><\\/script>)`,
    "i"
  );
  if (!targetPattern.test(withoutInline)) {
    return html;
  }
  return withoutInline.replace(targetPattern, `$1
${inlineScript}`);
}
function reorderInlineScriptConfigs(html) {
  let reordered = html;
  reordered = moveInlineScriptBefore(reordered, "astra-theme-js-js-extra", "astra-theme-js");
  reordered = moveInlineScriptBefore(reordered, "elementor-frontend-js-before", "elementor-frontend-js");
  reordered = moveInlineScriptBefore(reordered, "elementor-pro-frontend-js-before", "elementor-pro-frontend-js");
  reordered = moveInlineScriptAfter(reordered, "wp-i18n-js-after", "wp-i18n-js");
  return reordered;
}
function loadLegacyPage(relativePath) {
  const rawHtml = readFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, "body classes");
  const contentHtml = mustMatch(normalized, /(<div id="content" class="site-content">[\s\S]*?)<footer data-elementor-type="footer"/i, "content");
  const afterFooterHtml = mustMatch(normalized, /<\/footer>([\s\S]*?)<\/body>/i, "after footer");
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, "title").trim());
  const headExtraHtml = sanitizeHeadExtraHtml(headInner);
  return {
    title,
    bodyClass,
    headExtraHtml,
    contentHtml,
    afterFooterHtml
  };
}
function loadSourceShell(relativePath) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headerHtml = mustMatch(
    normalized,
    /(<header[^>]+data-elementor-type=["']header["'][\s\S]*?<\/header>)/i,
    "header"
  );
  const footerHtml = mustMatch(
    normalized,
    /(<footer[^>]+data-elementor-type=["']footer["'][\s\S]*?<\/footer>)/i,
    "footer"
  );
  return {
    headerHtml,
    footerHtml
  };
}
function normalizeRoute(relativePath) {
  if (relativePath === "index.html") {
    return "/";
  }
  return `/${relativePath.replace(/\/index\.html$/i, "").replace(/^\/+/, "")}/`;
}
function shouldSkipManagedRoute(route) {
  if (route === "/blog/") {
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
function walkIndexPages(rootDir, currentDir = "") {
  const absoluteDir = path.join(rootDir, currentDir);
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const nextRelative = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...walkIndexPages(rootDir, nextRelative));
      continue;
    }
    if (entry.isFile() && entry.name === "index.html") {
      pages.push(nextRelative.replace(/\\/g, "/"));
    }
  }
  return pages;
}
function listManagedLegacyRoutes() {
  return walkIndexPages(sourceRoot).map((relativePath) => ({
    relativePath,
    route: normalizeRoute(relativePath)
  })).filter(({ route }) => !shouldSkipManagedRoute(route));
}
function loadSourcePage(relativePath) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not extract body for ${relativePath}`);
  }
  const bodyAttributes = bodyMatch[1] || "";
  const bodyInnerHtml = bodyMatch[2];
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, "title").trim());
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/class=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/itemtype=["']([^"']+)["']/i);
  const hasBodyItemscope = /\sitemscope(?:=["'][^"']*["'])?/i.test(bodyAttributes);
  return {
    title,
    lang: langMatch?.[1] || "es-ES",
    bodyClass: bodyClassMatch?.[1] || "",
    bodyItemType: bodyItemTypeMatch?.[1] || "",
    bodyItemscope: hasBodyItemscope,
    headExtraHtml: stripAstroInjectedHeadHtml(stripBaseHeadTags(headInner)).trim(),
    bodyInnerHtml
  };
}
function loadSourceStructuredPage(relativePath) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyClass = mustMatch(normalized, /<body[^>]+class=["']([^"']+)["']/i, "body classes");
  const contentHtml = mustMatch(normalized, /(<div id="content" class="site-content">[\s\S]*?)<footer data-elementor-type="footer"/i, "content");
  const afterFooterHtml = mustMatch(normalized, /<\/footer>([\s\S]*?)<\/body>/i, "after footer");
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, "title").trim());
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyItemTypeMatch = normalized.match(/<body[^>]+itemtype=["']([^"']+)["']/i);
  return {
    title,
    lang: langMatch?.[1] || "es-ES",
    bodyClass,
    bodyItemType: bodyItemTypeMatch?.[1] || "https://schema.org/WebPage",
    headExtraHtml: sanitizeHeadExtraHtml(headInner),
    contentHtml,
    afterFooterHtml: sanitizeAfterFooterHtml(afterFooterHtml)
  };
}
function loadSourceStructuredElementorShellPage(relativePath) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not extract body for ${relativePath}`);
  }
  const bodyAttributes = bodyMatch[1] || "";
  const bodyInnerHtml = bodyMatch[2];
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, "title").trim());
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
    lang: langMatch?.[1] || "es-ES",
    bodyClass: bodyClassMatch?.[1] || "",
    bodyItemType: bodyItemTypeMatch?.[1] || "",
    bodyItemscope: hasBodyItemscope,
    headExtraHtml: sanitizeHeadExtraHtml(headInner),
    headerHtml,
    contentHtml,
    footerHtml,
    afterFooterHtml: sanitizeAfterFooterHtml(afterFooterHtml)
  };
}
function loadSourceRedirectPage(relativePath) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, "head");
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error(`Could not extract body for ${relativePath}`);
  }
  const bodyAttributes = bodyMatch[1] || "";
  const bodyInnerHtml = bodyMatch[2];
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, "title").trim());
  const langMatch = normalized.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/class=["']([^"']+)["']/i);
  const targetMatch = normalized.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i) || normalized.match(/window\.location\s*=\s*["']([^"']+)["']/i);
  if (!targetMatch) {
    throw new Error(`Could not extract redirect target for ${relativePath}`);
  }
  const targetUrl = targetMatch[1];
  return {
    title,
    lang: langMatch?.[1] || "es-ES",
    bodyClass: bodyClassMatch?.[1] || "",
    headExtraHtml: stripAstroInjectedHeadHtml(stripBaseHeadTags(headInner)).replace(/<meta[^>]+http-equiv=["']refresh["'][^>]*>\s*/i, ""),
    bodyInnerHtml,
    targetUrl
  };
}

const css = (href, id) => ({ kind: "css", href, id });
const js = (href, id) => ({ kind: "js", href, id });
const legacyBundles = {
  "base-css": [
    css("/wp-content/themes/astra/assets/css/minified/style-flex.min.css", "astra-theme-css"),
    css("/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-list-horizontal/style.min.css", "wpml-legacy-horizontal-css"),
    css("/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/menu-item/style.min.css", "wpml-menu-item-css"),
    css("/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation-base.css", "wpml-cms-navigation-base-css"),
    css("/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation.css", "wpml-cms-navigation-css"),
    css("/wp-content/plugins/elementor/assets/css/frontend.min.css", "elementor-frontend-css"),
    css("/wp-content/plugins/elementor/assets/css/widget-image.min.css", "elementor-widget-image-css"),
    css("/wp-content/plugins/elementor/assets/css/widget-heading.min.css", "elementor-widget-heading-css"),
    css("/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css", "elementor-widget-social-icons-css"),
    css("/wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css", "elementor-apple-webkit-css"),
    css("/wp-content/plugins/elementor/assets/lib/font-awesome/css/all.min.css", "font-awesome-all-css"),
    css("/wp-content/plugins/elementor/assets/lib/font-awesome/css/v4-shims.min.css", "font-awesome-v4-shims-css"),
    css("/wp-content/uploads/elementor/google-fonts/css/lato.css", "elementor-google-font-lato-css"),
    css("/wp-content/uploads/elementor/google-fonts/css/varelaround.css", "elementor-google-font-varelaround-css"),
    css("/wp-content/plugins/elementor/assets/css/widget-icon-list.min.css", "elementor-widget-icon-list-css")
  ],
  "base-js": [
    js("/wp-includes/js/jquery/jquery.min.js", "jquery-core-js"),
    js("/wp-includes/js/jquery/jquery-migrate.min.js", "jquery-migrate-js"),
    js("/wp-content/plugins/elementor/assets/lib/font-awesome/js/v4-shims.min.js", "font-awesome-4-shim-js"),
    js("/wp-content/themes/astra/assets/js/minified/style.min.js", "astra-theme-js"),
    js("/wp-includes/js/jquery/ui/core.min.js", "jquery-ui-core-js"),
    js("/wp-includes/js/jquery/ui/mouse.min.js", "jquery-ui-mouse-js"),
    js("/wp-includes/js/jquery/ui/slider.min.js", "jquery-ui-slider-js"),
    js("/wp-includes/js/jquery/ui/draggable.min.js", "jquery-ui-draggable-js"),
    js("/wp-includes/js/jquery/jquery.ui.touch-punch.js", "jquery-touch-punch-js"),
    js("/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js", "elementor-webpack-runtime-js"),
    js("/wp-content/plugins/elementor/assets/js/frontend-modules.min.js", "elementor-frontend-modules-js"),
    js("/wp-content/plugins/elementor/assets/js/frontend.min.js", "elementor-frontend-js"),
    js("/wp-includes/js/imagesloaded.min.js", "imagesloaded-js"),
    js("/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js", "elementor-pro-webpack-runtime-js"),
    js("/wp-includes/js/dist/hooks.min.js", "wp-hooks-js"),
    js("/wp-includes/js/dist/i18n.min.js", "wp-i18n-js"),
    js("/wp-content/plugins/elementor-pro/assets/js/frontend.min.js", "elementor-pro-frontend-js"),
    js("/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js", "pro-elements-handlers-js")
  ],
  "header-css": [
    css("/wp-content/plugins/elementor-pro/assets/css/widget-mega-menu.min.css", "elementor-pro-widget-mega-menu-css"),
    css("/wp-content/plugins/elementor-pro/assets/css/widget-nav-menu.min.css", "elementor-pro-widget-nav-menu-css"),
    css("/wp-content/plugins/elementor-pro/assets/css/modules/sticky.min.css", "elementor-pro-sticky-css"),
    css("/wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css", "elementor-fadein-css"),
    css("/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-shrink.min.css", "elementor-shrink-css"),
    css("/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-grow.min.css", "elementor-grow-css")
  ],
  "header-js": [
    js("/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js", "smartmenus-js"),
    js("/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js", "e-sticky-js")
  ],
  "home-css": [
    css("/wp-content/plugins/the-plus-addons-for-elementor-page-builder/assets/css/main/plus-extra-adv/plus-extra-adv.min.css", "theplus-plus-extra-adv-css"),
    css("/wp-content/plugins/the-plus-addons-for-elementor-page-builder/assets/css/main/heading-animation/tp-heading-animation.css", "theplus-heading-animation-css"),
    css("/wp-content/plugins/the-plus-addons-for-elementor-page-builder/assets/css/main/heading-animation/heading-animation-style-6.css", "theplus-heading-animation-style-6-css"),
    css("/wp-content/plugins/elementor/assets/css/widget-image-box.min.css", "elementor-widget-image-box-css")
  ],
  "blog-single-css": [
    css("/wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css", "elementor-pro-widget-post-info-css")
  ],
  "blog-archive-css": [
    css("/wp-includes/css/dist/block-library/style.min.css", "wp-block-library-css")
  ],
  "cookie-js": [
    js("/wp-content/plugins/cookie-law-info/lite/frontend/js/script.min.js", "cookie-law-info-js")
  ],
  "analytics-js": []
};
function getLegacyBundle(...bundleNames) {
  return bundleNames.flatMap((bundleName) => legacyBundles[bundleName]);
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.tictap.me");
const $$LegacyAssetBundle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LegacyAssetBundle;
  const { bundleNames, extraAssets = [] } = Astro2.props;
  const assets = [...getLegacyBundle(...bundleNames), ...extraAssets];
  return renderTemplate`${assets.map(
    (asset) => asset.kind === "css" ? renderTemplate`<link rel="stylesheet"${addAttribute(asset.href, "href")}${addAttribute(asset.id, "id")}>` : renderTemplate(_a || (_a = __template(["<script", "", "><\/script>"])), addAttribute(asset.href, "src"), addAttribute(asset.id, "id"))
  )}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/components/head/LegacyAssetBundle.astro", void 0);

export { $$LegacyAssetBundle as $, loadSourceStructuredPage as a, loadSourcePage as b, loadSourceStructuredElementorShellPage as c, loadSourceRedirectPage as d, extractInlineConfigScripts as e, listManagedLegacyRoutes as f, loadSourceShell as g, loadShellCss as h, loadLegacyPage as l, stripBundleJsAssets as s };
