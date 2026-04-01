import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_BXisM0Nw.mjs';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/guille/www/tictap/marketing/website/","adapterName":"","routes":[{"file":"file:///home/guille/www/tictap/marketing/website/src/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas","isIndex":true,"type":"page","pattern":"^\\/blog\\/documentacion-tecnica-tienen-que-tener-tus-maquinas\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"documentacion-tecnica-tienen-que-tener-tus-maquinas","dynamic":false,"spread":false}]],"params":[],"component":"astro/src/pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.astro","pathname":"/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///home/guille/www/tictap/marketing/website/src/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"astro/src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///home/guille/www/tictap/marketing/website/src/en/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/blog","isIndex":true,"type":"page","pattern":"^\\/en\\/blog\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"astro/src/pages/en/blog/index.astro","pathname":"/en/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///home/guille/www/tictap/marketing/website/src/en/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en","isIndex":true,"type":"page","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"astro/src/pages/en/index.astro","pathname":"/en","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///home/guille/www/tictap/marketing/website/src/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"astro/src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.tictap.me","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/guille/www/tictap/marketing/website/astro/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/guille/www/tictap/marketing/website/astro/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:astro/src/pages/blog/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/guille/www/tictap/marketing/website/astro/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:astro/src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/guille/www/tictap/marketing/website/astro/src/pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.astro",{"propagation":"none","containsHead":true}],["/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/[slug].astro",{"propagation":"none","containsHead":true}],["/home/guille/www/tictap/marketing/website/astro/src/pages/en/blog/index.astro",{"propagation":"none","containsHead":true}],["/home/guille/www/tictap/marketing/website/astro/src/pages/en/index.astro",{"propagation":"none","containsHead":true}],["/home/guille/www/tictap/marketing/website/astro/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:astro/src/pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index@_@astro":"pages/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas.astro.mjs","\u0000@astro-page:astro/src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:astro/src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:astro/src/pages/en/blog/[slug]@_@astro":"pages/en/blog/_slug_.astro.mjs","\u0000@astro-page:astro/src/pages/en/blog/index@_@astro":"pages/en/blog.astro.mjs","\u0000@astro-page:astro/src/pages/en/index@_@astro":"pages/en.astro.mjs","\u0000@astro-page:astro/src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:astro/src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_H96b9KzW.mjs","/home/guille/www/tictap/marketing/website/astro/src/content/blog/ia-en-mantenimiento-note-taker.md?astroContentCollectionEntry=true":"chunks/ia-en-mantenimiento-note-taker_1On5suqf.mjs","/home/guille/www/tictap/marketing/website/astro/src/content/blog/ia-en-mantenimiento-note-taker.md?astroPropagatedAssets":"chunks/ia-en-mantenimiento-note-taker_B2sqjgFa.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:assets":"chunks/_astro_assets_B3fuiAaQ.mjs","\u0000astro:content-module-imports":"chunks/_astro_content-module-imports_B0nxoYfl.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","/home/guille/www/tictap/marketing/website/astro/src/content/blog/ia-en-mantenimiento-note-taker.md":"chunks/ia-en-mantenimiento-note-taker_C_7Cxnye.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///home/guille/www/tictap/marketing/website/src/blog/documentacion-tecnica-tienen-que-tener-tus-maquinas/index.html","/file:///home/guille/www/tictap/marketing/website/src/blog/index.html","/file:///home/guille/www/tictap/marketing/website/src/en/blog/index.html","/file:///home/guille/www/tictap/marketing/website/src/en/index.html","/file:///home/guille/www/tictap/marketing/website/src/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"VdI7BQOIAM8w5dunzPMoZV4akWHt1UfqZnGImnzo3Ck=","experimentalEnvGetSecretEnabled":false});

export { manifest };
