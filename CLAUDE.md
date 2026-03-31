# CLAUDE

## Qué es este proyecto

Este repositorio contiene la web estática de TicTAP.
La mayor parte del sitio sigue siendo un export estático heredado, pero los artículos del blog ya se están generando con Astro para centralizar header, footer, hero y contenido.
No hay renderizado dinámico en producción: Cloudflare Pages publica exactamente los archivos que hay en el directorio publicado.

Asunción operativa importante:
- cada `push` a `main` genera una nueva versión en producción

Eso implica que cualquier error en SEO técnico, redirecciones, `robots.txt`, sitemaps o cabeceras HTTP se publica tal cual.

## Estructura esperada

### Raíz del repositorio

- `src/`: salida estática publicada por Cloudflare Pages. Debe considerarse la fuente real de producción.
- `astro/`: fuente de Astro para el blog, los layouts compartidos y el renderizado progresivo del resto del export legacy.
- `bin/`: scripts de mantenimiento del export estático, limpieza SEO, validación y utilidades de preview/sync.
- `_redirects`: copia sincronizada del mapa de redirecciones publicado.
- `_headers`: copia sincronizada de cabeceras para Cloudflare Pages.
- `package.json`: scripts locales de preview, normalización y validación.
- `wrangler.toml`: configuración heredada de Workers. No controla el despliegue estático de Pages.

### Dentro de `src/`

- `index.html` y carpetas con `index.html`: páginas estáticas servidas por Pages.
- `_redirects`: archivo efectivo de redirecciones para Cloudflare Pages.
- `_headers`: archivo efectivo de cabeceras HTTP para Cloudflare Pages.
- `robots.txt`, `sitemap.xml`, `sitemap_index.xml`, `page-sitemap.xml`, `post-sitemap.xml`: señales SEO que se sirven en producción.
- `wp-content/`, `wp-includes/`: assets exportados del CMS anterior.

## Reglas de mantenimiento

- `src/` es la verdad de producción.
- `_redirects` y `_headers` de la raíz deben ser idénticos a los de `src/`.
- `canonical`, `og:url`, `hreflang`, JSON-LD, `robots.txt` y sitemaps deben apuntar a `https://www.tictap.me`.
- no deben quedar referencias a hosts de staging o preview como `develop.wp-web.pages.dev`.
- páginas utilitarias o de poco valor SEO como `cart`, `checkout`, `my-account`, archivos de autor/tag y landings de test deben permanecer fuera de indexación cuando aplique.

## Flujo recomendado antes de commit

1. Actualizar o sincronizar el export estático en `src/`.
2. Ejecutar `node bin/optimize-seo.js`.
3. Ejecutar `node bin/normalize-pages-config.js`.
4. Ejecutar `node bin/validate-static-site.js`.
5. Revisar el diff de `src/_redirects`, `src/_headers`, `robots.txt` y sitemaps antes de hacer commit.

## Flujo para artículos generados desde marketing

- los artículos nuevos deben entrar en `astro/src/content/blog/<slug>.md` y materializarse en `src/blog/<slug>/index.html`
- el renderizador de entrada es `bin/render-blog-article.js`, que convierte el paquete de marketing en contenido Astro
- el layout debe centralizar header, hero, article body y footer en `astro/src/layouts/BlogArticleLayout.astro`
- el índice `/blog/` debe renderizarse desde Astro usando la colección `astro/src/content/blog/` y debe mostrar el artículo nuevo como la primera tarjeta del archive
- antes de considerar cerrado un artículo generado, previsualizarlo con `npm run preview` para construir Astro, sincronizar `dist/` a `src/` y servir el resultado
- validar no solo la página del artículo, sino también que `/blog/` enlaza al nuevo post
- cuando el contenido esté aprobado, validar el sitio estático y solo después preparar el `push` a `main`

También existe un hook de git en `.githooks/pre-commit` para bloquear commits si falla la validación.

## Estado actual de migración a Astro

- El blog ya está gestionado por layouts Astro compartidos.
- El resto del sitio ya entra en el build de Astro mediante rutas genéricas que reemiten el HTML legacy desde `src/`.
- Eso permite que todo el sitio pase por un único pipeline de build, preview y sync, aunque no todas las páginas estén todavía refactorizadas a layouts semánticos compartidos.
- La siguiente fase de la migración consiste en ir sustituyendo páginas legacy raw por layouts Astro específicos por tipo de plantilla.

## Scripts relevantes

- `npm run preview`: construye Astro, sincroniza el resultado en `src/` y sirve localmente el sitio estático.
- `npm run astro:build`: construye el contenido de Astro a `dist/`.
- `npm run optimize:seo`: reescribe señales SEO y URLs legacy al dominio de producción.
- `npm run normalize:pages`: normaliza `_redirects` y sincroniza `_headers`/`_redirects` entre raíz y `src/`.
- `npm run validate:static`: valida SEO técnico y configuración de Cloudflare Pages.

## Criterios de redirecciones y caché

- en `_redirects`, usar código explícito siempre
- por defecto, los redirects de legado SEO deben ser `301`
- `src/_headers` define:
  - `noindex` para la respuesta 404
  - cache corta para `robots.txt` y sitemaps
  - cache larga e `immutable` para assets versionables en `wp-content` y `wp-includes`

## Qué no asumir

- no asumir comportamiento del CMS anterior en runtime
- no asumir plugins de SEO activos en producción
- no asumir que un archivo en la raíz del repo se publicará si no existe también en `src/`
