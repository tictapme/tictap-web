import { c as createComponent, r as renderComponent, d as renderTemplate } from '../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { $ as $$RawLegacyLayout } from '../chunks/RawLegacyLayout_Ti_f1U14.mjs';
import { b as loadSourcePage } from '../chunks/LegacyAssetBundle_DbnA9-al.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const page = loadSourcePage("en/index.html");
  return renderTemplate`${renderComponent($$result, "RawLegacyLayout", $$RawLegacyLayout, { "title": page.title, "lang": page.lang, "headExtraHtml": page.headExtraHtml, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "bodyItemscope": page.bodyItemscope, "bodyInnerHtml": page.bodyInnerHtml })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/en/index.astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/en/index.astro";
const $$url = "/en";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
