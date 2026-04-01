import { c as createComponent, r as renderComponent, F as Fragment, d as renderTemplate, u as unescapeHTML, e as createAstro, f as addAttribute, l as renderHead, g as renderSlot } from './astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { g as loadSourceShell, h as loadShellCss, $ as $$LegacyAssetBundle } from './LegacyAssetBundle_DbnA9-al.mjs';
/* empty css                          */

const $$HeaderEs = createComponent(($$result, $$props, $$slots) => {
  const { headerHtml } = loadSourceShell("index.html");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headerHtml)}` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/components/header/HeaderEs.astro", void 0);

const $$FooterEs = createComponent(($$result, $$props, $$slots) => {
  const { footerHtml } = loadSourceShell("index.html");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(footerHtml)}` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/components/footer/FooterEs.astro", void 0);

const $$Astro = createAstro("https://www.tictap.me");
const $$BaseLegacyLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLegacyLayout;
  const shellCss = loadShellCss("es");
  const {
    title,
    bodyClass,
    lang = "es-ES",
    headExtraHtml = "",
    afterBodyHtml = "",
    bodyItemType = "https://schema.org/Blog",
    cssBundles = [],
    jsBundles = []
  } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")} data-astro-cid-uwls57wg> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${cssBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": cssBundles, "data-astro-cid-uwls57wg": true })}`}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headExtraHtml)}` })}${!headExtraHtml.includes(".elementor-9642") && shellCss && renderTemplate`<style>${unescapeHTML(shellCss)}</style>`}${renderHead()}</head> <body${addAttribute(bodyItemType, "itemtype")} itemscope="itemscope"${addAttribute(bodyClass, "class")} data-astro-cid-uwls57wg> <a class="skip-link screen-reader-text" href="#content" title="Ir al contenido" data-astro-cid-uwls57wg>Ir al contenido</a> <div class="hfeed site" id="page" data-astro-cid-uwls57wg> ${renderComponent($$result, "HeaderEs", $$HeaderEs, { "data-astro-cid-uwls57wg": true })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "FooterEs", $$FooterEs, { "data-astro-cid-uwls57wg": true })} </div> ${jsBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": jsBundles, "data-astro-cid-uwls57wg": true })}`} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(afterBodyHtml)}` })} </body></html>`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/BaseLegacyLayout.astro", void 0);

export { $$BaseLegacyLayout as $ };
