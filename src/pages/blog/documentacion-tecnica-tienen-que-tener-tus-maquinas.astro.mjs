import { c as createComponent, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML } from '../../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { $ as $$BaseLegacyLayout } from '../../chunks/BaseLegacyLayout_Cd9NXje7.mjs';
import { l as loadLegacyPage } from '../../chunks/LegacyAssetBundle_DbnA9-al.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const page = loadLegacyPage("blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.html");
  return renderTemplate`${renderComponent($$result, "BaseLegacyLayout", $$BaseLegacyLayout, { "title": page.title, "bodyClass": page.bodyClass, "headExtraHtml": page.headExtraHtml, "afterBodyHtml": page.afterFooterHtml }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(page.contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.astro";
const $$url = "/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
