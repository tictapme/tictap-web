import { c as createComponent, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML } from '../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_Bww9j2hy.mjs';
import { $ as $$BaseLegacyLayout } from '../chunks/BaseLegacyLayout_Cd9NXje7.mjs';
import { l as loadLegacyPage } from '../chunks/LegacyAssetBundle_DbnA9-al.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const page = loadLegacyPage("blog/index.html");
  const generatedPosts = (await getCollection("blog")).sort(
    (left, right) => new Date(right.data.publishedTime).getTime() - new Date(left.data.publishedTime).getTime()
  );
  function normalizePath(value) {
    try {
      const url = new URL(value, "https://www.tictap.me");
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return String(value || "").replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
    }
  }
  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function formatLegacyDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre"
    ];
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
  }
  function extractLegacyArticles(contentHtml2, widgetId) {
    const pattern = new RegExp(
      `(<div class="elementor-element elementor-element-${widgetId}[\\s\\S]*?<div class="elementor-posts-container elementor-posts elementor-posts--skin-cards elementor-grid" role="list">)([\\s\\S]*?)(</div>\\s*<div class="e-load-more-anchor"|</div>\\s*</div>\\s*</div>\\s*<div class="elementor-element elementor-element-3eb33a95)`
    );
    const match = contentHtml2.match(pattern);
    if (!match) {
      throw new Error(`Could not extract archive widget ${widgetId}`);
    }
    const articles = match[2].match(/<article class="elementor-post[\s\S]*?<\/article>/g) ?? [];
    return {
      pattern,
      prefix: match[1],
      suffix: match[3],
      articles
    };
  }
  function extractLegacyHref(articleHtml) {
    const match = articleHtml.match(/<a class="elementor-post__thumbnail__link" href="([^"]+)"/i);
    return match ? normalizePath(match[1]) : "";
  }
  function buildGeneratedArticleCard(post) {
    const href = normalizePath(post.data.publicUrl || `/blog/${post.slug}/`);
    const title = escapeHtml(post.data.title);
    const category = escapeHtml(post.data.category);
    const image = escapeHtml(post.data.ogImage);
    const imageWidth = String(post.data.ogImageWidth || 700);
    const imageHeight = String(post.data.ogImageHeight || 391);
    escapeHtml(formatLegacyDate(post.data.publishedTime));
    return `
<article class="elementor-post elementor-grid-item post-generated post type-post status-publish format-standard has-post-thumbnail hentry category-blog ast-grid-common-col ast-full-width" role="listitem">
  <div class="elementor-post__card">
    <a class="elementor-post__thumbnail__link" href="${href}" tabindex="-1"><div class="elementor-post__thumbnail"><img fetchpriority="high" width="${imageWidth}" height="${imageHeight}" src="${image}" alt="${title}" decoding="async" sizes="(max-width: 700px) 100vw, 700px"></div></a>
    <div class="elementor-post__badge">${category}</div>
    <div class="elementor-post__text">
      <h2 class="elementor-post__title">
        <a href="${href}">
          ${title}
        </a>
      </h2>
      <div class="elementor-post__read-more-wrapper">
        <a class="elementor-post__read-more" href="${href}" aria-label="M\xE1s informaci\xF3n sobre ${title}" tabindex="-1">
          Ver m\xE1s \xBB
        </a>
      </div>
    </div>
  </div>
</article>`.trim();
  }
  const mainArchive = extractLegacyArticles(page.contentHtml, "88896a4");
  const generatedPaths = new Set(
    generatedPosts.map((post) => normalizePath(post.data.publicUrl || `/blog/${post.slug}/`))
  );
  const legacyArticles = mainArchive.articles.filter((articleHtml) => !generatedPaths.has(extractLegacyHref(articleHtml)));
  const renderedArticles = [...generatedPosts.map(buildGeneratedArticleCard), ...legacyArticles].join("\n");
  const contentHtml = page.contentHtml.replace(mainArchive.pattern, `$1${renderedArticles}$3`);
  const headExtraHtml = `${page.headExtraHtml}
<style>
.elementor-8333 .elementor-element.elementor-element-88896a4 .elementor-post__text {
  padding: 0 13px;
  margin-top: 20px;
}
</style>`;
  return renderTemplate`${renderComponent($$result, "BaseLegacyLayout", $$BaseLegacyLayout, { "title": page.title, "bodyClass": page.bodyClass, "headExtraHtml": headExtraHtml, "afterBodyHtml": page.afterFooterHtml, "cssBundles": ["base-css", "header-css", "blog-archive-css"] }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/blog/index.astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
