import { e as createAstro, c as createComponent, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML } from '../../../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import fs from 'node:fs';
import path from 'node:path';
import { $ as $$BaseLegacyLayoutEn } from '../../../chunks/BaseLegacyLayoutEn_CYQ223gh.mjs';
import { a as loadSourceStructuredPage, s as stripBundleJsAssets, e as extractInlineConfigScripts } from '../../../chunks/LegacyAssetBundle_DbnA9-al.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://www.tictap.me");
async function getStaticPaths() {
  const blogDir = path.join(process.cwd(), "src", "en", "blog");
  const entries = fs.readdirSync(blogDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && e.name !== "page").map((e) => ({ params: { slug: e.name } }));
}
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const page = loadSourceStructuredPage(`en/blog/${slug}/index.html`);
  const strippedAfterBody = stripBundleJsAssets(page.afterFooterHtml);
  const { configHtml, remainingHtml: afterBodyHtml } = extractInlineConfigScripts(strippedAfterBody);
  const headExtraHtml = page.headExtraHtml + configHtml;
  return renderTemplate`${renderComponent($$result, "BaseLegacyLayoutEn", $$BaseLegacyLayoutEn, { "title": page.title, "lang": page.lang, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "headExtraHtml": headExtraHtml, "afterBodyHtml": afterBodyHtml, "cssBundles": ["base-css", "header-css", "blog-single-css"], "jsBundles": ["base-js", "header-js"] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(page.contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/[slug].astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/[slug].astro";
const $$url = "/en/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
