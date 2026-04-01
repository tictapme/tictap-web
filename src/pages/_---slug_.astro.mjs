import { e as createAstro, c as createComponent, r as renderComponent, d as renderTemplate, F as Fragment, u as unescapeHTML, f as addAttribute, l as renderHead, n as defineScriptVars } from '../chunks/astro/server_BXisM0Nw.mjs';
import 'kleur/colors';
import { $ as $$BaseLegacyLayout } from '../chunks/BaseLegacyLayout_Cd9NXje7.mjs';
import { $ as $$BaseLegacyLayoutEn } from '../chunks/BaseLegacyLayoutEn_CYQ223gh.mjs';
import { s as stripBundleJsAssets, e as extractInlineConfigScripts, b as loadSourcePage, a as loadSourceStructuredPage, c as loadSourceStructuredElementorShellPage, d as loadSourceRedirectPage, f as listManagedLegacyRoutes } from '../chunks/LegacyAssetBundle_DbnA9-al.mjs';
import { $ as $$RawLegacyLayout } from '../chunks/RawLegacyLayout_Ti_f1U14.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$5 = createAstro("https://www.tictap.me");
const $$GenericPageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$GenericPageLayout;
  const {
    title,
    lang = "es-ES",
    bodyClass,
    bodyItemType = "https://schema.org/WebPage",
    headExtraHtml = "",
    afterBodyHtml = "",
    contentHtml
  } = Astro2.props;
  const isEnglish = lang.toLowerCase().startsWith("en");
  const Layout = isEnglish ? $$BaseLegacyLayoutEn : $$BaseLegacyLayout;
  const strippedAfterBody = stripBundleJsAssets(afterBodyHtml);
  const { configHtml, remainingHtml: finalAfterBodyHtml } = extractInlineConfigScripts(strippedAfterBody);
  const finalHeadExtraHtml = headExtraHtml + configHtml;
  return renderTemplate`${renderComponent($$result, "Layout", Layout, { "title": title, "lang": lang, "bodyClass": bodyClass, "bodyItemType": bodyItemType, "headExtraHtml": finalHeadExtraHtml, "afterBodyHtml": finalAfterBodyHtml, "cssBundles": ["base-css", "header-css"], "jsBundles": ["base-js", "header-js"] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/GenericPageLayout.astro", void 0);

const $$Astro$4 = createAstro("https://www.tictap.me");
const $$CaseStudyArchiveLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$CaseStudyArchiveLayout;
  const {
    title,
    lang = "es-ES",
    bodyClass,
    bodyItemType = "https://schema.org/Blog",
    headExtraHtml = "",
    afterBodyHtml = "",
    contentHtml
  } = Astro2.props;
  const isEnglish = lang.toLowerCase().startsWith("en");
  const Layout = isEnglish ? $$BaseLegacyLayoutEn : $$BaseLegacyLayout;
  return renderTemplate`${renderComponent($$result, "Layout", Layout, { "title": title, "lang": lang, "bodyClass": bodyClass, "bodyItemType": bodyItemType, "headExtraHtml": headExtraHtml, "afterBodyHtml": afterBodyHtml, "cssBundles": ["base-css", "header-css", "blog-archive-css"] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/CaseStudyArchiveLayout.astro", void 0);

const $$Astro$3 = createAstro("https://www.tictap.me");
const $$CaseStudySingleLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$CaseStudySingleLayout;
  const {
    title,
    lang = "es-ES",
    bodyClass,
    bodyItemType = "https://schema.org/Blog",
    headExtraHtml = "",
    afterBodyHtml = "",
    contentHtml
  } = Astro2.props;
  const isEnglish = lang.toLowerCase().startsWith("en");
  const Layout = isEnglish ? $$BaseLegacyLayoutEn : $$BaseLegacyLayout;
  return renderTemplate`${renderComponent($$result, "Layout", Layout, { "title": title, "lang": lang, "bodyClass": bodyClass, "bodyItemType": bodyItemType, "headExtraHtml": headExtraHtml, "afterBodyHtml": afterBodyHtml, "cssBundles": ["base-css", "header-css", "blog-single-css"] }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(contentHtml)}` })} ` })}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/CaseStudySingleLayout.astro", void 0);

const $$Astro$2 = createAstro("https://www.tictap.me");
const $$LegacyCaseStudyElementorLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$LegacyCaseStudyElementorLayout;
  const {
    title,
    lang = "es-ES",
    headExtraHtml = "",
    bodyClass = "",
    bodyItemType = "",
    bodyItemscope = false,
    headerHtml,
    contentHtml,
    footerHtml,
    afterFooterHtml = ""
  } = Astro2.props;
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headExtraHtml)}` })}${renderHead()}</head> <body${addAttribute(bodyClass, "class")}${addAttribute(bodyItemType || void 0, "itemtype")}${addAttribute(bodyItemscope, "itemscope")}> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headerHtml)}` })} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(contentHtml)}` })} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(footerHtml)}` })} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(afterFooterHtml)}` })} </body></html>`;
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/LegacyCaseStudyElementorLayout.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://www.tictap.me");
const $$RedirectPageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RedirectPageLayout;
  const {
    title,
    lang = "es-ES",
    headExtraHtml = "",
    bodyClass = "",
    targetUrl
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<html", '> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta http-equiv="refresh"', ">", "", "</head> <body", "> <script>(function(){", "\n      window.location = targetUrl;\n    })();<\/script> <p>\nEst\xE1s siendo redirigido a <a", ">", "</a> </p> </body></html>"])), addAttribute(lang, "lang"), title, addAttribute(`0;url=${targetUrl}`, "content"), renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(headExtraHtml)}` }), renderHead(), addAttribute(bodyClass, "class"), defineScriptVars({ targetUrl }), addAttribute(targetUrl, "href"), targetUrl);
}, "/home/guille/www/tictap/marketing/website/astro/src/layouts/RedirectPageLayout.astro", void 0);

const $$Astro = createAstro("https://www.tictap.me");
async function getStaticPaths() {
  return listManagedLegacyRoutes().filter(({ route }) => route !== "/").map(({ relativePath, route }) => ({
    params: {
      slug: route.replace(/^\/+|\/+$/g, "")
    },
    props: {
      relativePath
    }
  }));
}
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { relativePath } = Astro2.props;
  const rawPage = loadSourcePage(relativePath);
  const isCaseStudyArchive = /^casos-de-exito\/index\.html$/i.test(relativePath) || /^en\/sucess-stories\/index\.html$/i.test(relativePath);
  const isCaseStudySingleRoute = /^casos-de-exito\/.+\/index\.html$/i.test(relativePath) || /^en\/sucess-stories\/.+\/index\.html$/i.test(relativePath);
  const isStructuredCaseStudySingle = isCaseStudySingleRoute && /\bsingle-post\b/.test(rawPage.bodyClass) && /\bast-blog-single-style-1\b/.test(rawPage.bodyClass);
  const isLegacyElementorCaseStudySingle = isCaseStudySingleRoute && /data-elementor-type=["']header["'][^>]+data-elementor-id=["']9610["']/i.test(rawPage.bodyInnerHtml) && /data-elementor-type=["']footer["'][^>]+data-elementor-id=["']10152["']/i.test(rawPage.bodyInnerHtml);
  const isRedirectPage = /<meta[^>]+http-equiv=["']refresh["']/i.test(rawPage.headExtraHtml) || /window\.location\s*=/.test(rawPage.bodyInnerHtml);
  const isGenericPage = /\bpage-template-default\b/.test(rawPage.bodyClass) && /\bpage-id-\d+\b/.test(rawPage.bodyClass) && !/^\/?(en\/)?blog\//i.test(relativePath) && !/^\/?(en\/)?casos-de-exito\//i.test(relativePath) && !/^\/?(en\/)?sucess-stories\//i.test(relativePath) && !/^\/?(en\/)?author\//i.test(relativePath) && !/^\/?(en\/)?tag\//i.test(relativePath);
  const isStructuredCaseStudy = isCaseStudyArchive || isStructuredCaseStudySingle;
  let page = rawPage;
  let legacyElementorPage = null;
  let redirectPage = null;
  if (isGenericPage || isStructuredCaseStudy) {
    try {
      page = loadSourceStructuredPage(relativePath);
    } catch (error) {
      if (isGenericPage) {
        throw error;
      }
    }
  }
  if (isLegacyElementorCaseStudySingle) {
    legacyElementorPage = loadSourceStructuredElementorShellPage(relativePath);
  }
  if (isRedirectPage) {
    redirectPage = loadSourceRedirectPage(relativePath);
  }
  const canRenderStructuredCaseStudy = page !== rawPage && isStructuredCaseStudy;
  return renderTemplate`${canRenderStructuredCaseStudy && isCaseStudyArchive ? renderTemplate`${renderComponent($$result, "CaseStudyArchiveLayout", $$CaseStudyArchiveLayout, { "title": page.title, "lang": page.lang, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "headExtraHtml": page.headExtraHtml, "afterBodyHtml": page.afterFooterHtml, "contentHtml": page.contentHtml })}` : canRenderStructuredCaseStudy && isStructuredCaseStudySingle ? renderTemplate`${renderComponent($$result, "CaseStudySingleLayout", $$CaseStudySingleLayout, { "title": page.title, "lang": page.lang, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "headExtraHtml": page.headExtraHtml, "afterBodyHtml": page.afterFooterHtml, "contentHtml": page.contentHtml })}` : legacyElementorPage ? renderTemplate`${renderComponent($$result, "LegacyCaseStudyElementorLayout", $$LegacyCaseStudyElementorLayout, { "title": legacyElementorPage.title, "lang": legacyElementorPage.lang, "headExtraHtml": legacyElementorPage.headExtraHtml, "bodyClass": legacyElementorPage.bodyClass, "bodyItemType": legacyElementorPage.bodyItemType, "bodyItemscope": legacyElementorPage.bodyItemscope, "headerHtml": legacyElementorPage.headerHtml, "contentHtml": legacyElementorPage.contentHtml, "footerHtml": legacyElementorPage.footerHtml, "afterFooterHtml": legacyElementorPage.afterFooterHtml })}` : redirectPage ? renderTemplate`${renderComponent($$result, "RedirectPageLayout", $$RedirectPageLayout, { "title": redirectPage.title, "lang": redirectPage.lang, "headExtraHtml": redirectPage.headExtraHtml, "bodyClass": redirectPage.bodyClass, "targetUrl": redirectPage.targetUrl })}` : isGenericPage ? renderTemplate`${renderComponent($$result, "GenericPageLayout", $$GenericPageLayout, { "title": page.title, "lang": page.lang, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "headExtraHtml": page.headExtraHtml, "afterBodyHtml": page.afterFooterHtml, "contentHtml": page.contentHtml })}` : renderTemplate`${renderComponent($$result, "RawLegacyLayout", $$RawLegacyLayout, { "title": page.title, "lang": page.lang, "headExtraHtml": page.headExtraHtml, "bodyClass": page.bodyClass, "bodyItemType": page.bodyItemType, "bodyItemscope": page.bodyItemscope, "bodyInnerHtml": page.bodyInnerHtml })}`}`;
}, "/home/guille/www/tictap/marketing/website/astro/src/pages/[...slug].astro", void 0);

const $$file = "/home/guille/www/tictap/marketing/website/astro/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
