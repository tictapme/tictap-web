import { c as createComponent, r as renderComponent, F as Fragment, d as renderTemplate, u as unescapeHTML, e as createAstro, f as addAttribute, l as renderHead, g as renderSlot } from './astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { g as loadSourceShell, h as loadShellCss, $ as $$LegacyAssetBundle } from './LegacyAssetBundle_DbnA9-al.mjs';
/* empty css                          */

const $$HeaderEn = createComponent(($$result, $$props, $$slots) => {
  const { headerHtml } = loadSourceShell("en/index.html");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headerHtml)}` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/components/header/HeaderEn.astro", void 0);

const $$FooterEn = createComponent(($$result, $$props, $$slots) => {
  const { footerHtml } = loadSourceShell("en/index.html");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(footerHtml)}` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/components/footer/FooterEn.astro", void 0);

const $$Astro = createAstro("https://www.tictap.me");
const $$BaseLegacyLayoutEn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLegacyLayoutEn;
  const shellCss = loadShellCss("en");
  const {
    title,
    bodyClass,
    lang = "en-US",
    headExtraHtml = "",
    afterBodyHtml = "",
    bodyItemType = "https://schema.org/WebPage",
    cssBundles = [],
    jsBundles = []
  } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")} data-astro-cid-jxpm4qrv> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${cssBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": cssBundles, "data-astro-cid-jxpm4qrv": true })}`}${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headExtraHtml)}` })}${!headExtraHtml.includes(".elementor-10265") && shellCss && renderTemplate`<style>${unescapeHTML(shellCss)}</style>`}${renderHead()}</head> <body${addAttribute(bodyItemType, "itemtype")} itemscope="itemscope"${addAttribute(bodyClass, "class")} data-astro-cid-jxpm4qrv> <a class="skip-link screen-reader-text" href="#content" title="Skip to content" data-astro-cid-jxpm4qrv>Skip to content</a> <div class="hfeed site" id="page" data-astro-cid-jxpm4qrv> ${renderComponent($$result, "HeaderEn", $$HeaderEn, { "data-astro-cid-jxpm4qrv": true })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "FooterEn", $$FooterEn, { "data-astro-cid-jxpm4qrv": true })} </div> ${jsBundles.length > 0 && renderTemplate`${renderComponent($$result, "LegacyAssetBundle", $$LegacyAssetBundle, { "bundleNames": jsBundles, "data-astro-cid-jxpm4qrv": true })}`} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(afterBodyHtml)}` })} </body></html>`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/BaseLegacyLayoutEn.astro", void 0);

export { $$BaseLegacyLayoutEn as $ };
