import { c as createComponent, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML } from '../../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { $ as $$BaseLegacyLayoutEn } from '../../chunks/BaseLegacyLayoutEn_CYQ223gh.mjs';
import { a as loadSourceStructuredPage } from '../../chunks/LegacyAssetBundle_DbnA9-al.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const page = loadSourceStructuredPage("en/blog/index.html");
  return renderTemplate`${renderComponent($$result, "BaseLegacyLayoutEn", $$BaseLegacyLayoutEn, { "title": page.title, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "headExtraHtml": page.headExtraHtml, "afterBodyHtml": page.afterFooterHtml, "cssBundles": ["base-css", "header-css", "blog-archive-css"] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(page.contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/index.astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/index.astro";
const $$url = "/en/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
