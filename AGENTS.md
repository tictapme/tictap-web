# AGENTS

## Qué es este proyecto

Este repositorio contiene lo que fue una versión estática de la web de TicTAP generada desde un CMS anterior.
No hay renderizado dinámico en producción: Cloudflare Pages publica exactamente los archivos que hay en el directorio publicado.

Asunción operativa importante:
- cada `push` a `main` genera una nueva versión en producción

Eso implica que cualquier error en SEO técnico, redirecciones, `robots.txt`, sitemaps o cabeceras HTTP se publica tal cual.

## Estructura esperada

### Raíz del repositorio

- `src/`: salida estática publicada por Cloudflare Pages. Debe considerarse la fuente real de producción.
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

- los artículos nuevos deben entrar en `src/blog/<slug>/index.html`
- el HTML debe seguir el patrón de los artículos existentes: SEO en `<head>`, `article` en el cuerpo, CTAs reutilizando `blog-center-flex` y `boton-blog`
- antes de considerar cerrado un artículo generado, previsualizarlo con `npm run preview` o `npm run preview:src`
- cuando el contenido esté aprobado, validar el sitio estático y solo después preparar el `push` a `main`

También existe un hook de git en `.githooks/pre-commit` para bloquear commits si falla la validación.

## Scripts relevantes

- `npm run preview`: sirve localmente el sitio estático.
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
