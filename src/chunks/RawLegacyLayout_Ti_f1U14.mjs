import { e as createAstro, c as createComponent, f as addAttribute, r as renderComponent, d as renderTemplate, F as Fragment, l as renderHead, u as unescapeHTML } from './astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { $ as $$LegacyAssetBundle } from './LegacyAssetBundle_DbnA9-al.mjs';

const $$Astro = createAstro("https://www.tictap.me");
const $$RawLegacyLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RawLegacyLayout;
  const {
    title,
    lang = "es-ES",
    headExtraHtml = "",
    bodyClass = "",
    bodyItemType = "",
    bodyItemscope = false,
    bodyInnerHtml,
    cssBundles = [],
    jsBundles = []
  } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${cssBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": cssBundles })}`}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headExtraHtml)}` })}${renderHead()}</head> <body${addAttribute(bodyClass, "class")}${addAttribute(bodyItemType || void 0, "itemtype")}${addAttribute(bodyItemscope, "itemscope")}> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(bodyInnerHtml)}` })} ${jsBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": jsBundles })}`} </body></html>`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/RawLegacyLayout.astro", void 0);

export { $$RawLegacyLayout as $ };
