# Astro Migration Plan

## Objective

Move the static site from exported WordPress HTML to Astro-managed layouts without breaking the visual shell or the Elementor-era interactions that are still needed.

## What the scan shows

- The site has 214 static `index.html` pages.
- Most pages still share the same Spanish shell:
  - header `9642`
  - footer `31645`
- English pages mostly share:
  - header `10265`
  - footer `31753`
- Blog archive and blog single do not use the same shell.
- Tag archives, author archives, case-study archives, pages, and blog posts are distinct templates.
- Most CSS/JS assets already exist locally under `src/wp-content/...`.

## Practical conclusion

Do not migrate page by page.

Migrate by shell and asset bundle:

1. global base shell
2. language-specific header/footer
3. blog single
4. blog archive
5. generic landing/solution page
6. archive pages
7. case-study pages

## Recommended Astro structure

Create these reusable pieces:

- `astro/src/layouts/BaseLegacyLayout.astro`
- `astro/src/layouts/BaseLegacyLayoutEn.astro`
- `astro/src/layouts/BlogSingleLayout.astro`
- `astro/src/layouts/BlogArchiveLayout.astro`
- `astro/src/layouts/GenericPageLayout.astro`
- `astro/src/layouts/ArchiveLayout.astro`
- `astro/src/layouts/CaseStudyLayout.astro`

Create these components:

- `astro/src/components/header/HeaderEs.astro`
- `astro/src/components/header/HeaderEn.astro`
- `astro/src/components/footer/FooterEs.astro`
- `astro/src/components/footer/FooterEn.astro`
- `astro/src/components/head/LegacyHeadBase.astro`
- `astro/src/components/head/LegacyHeadBlogSingle.astro`
- `astro/src/components/head/LegacyHeadBlogArchive.astro`
- `astro/src/components/scripts/LegacyShellScripts.astro`

## Asset bundles to extract

### 1. Base shell bundle

Needed by almost every page:

- Astra base CSS
- WPML switcher CSS
- Elementor frontend CSS
- shared font CSS
- Astra JS
- jQuery + jQuery UI pieces
- Elementor frontend runtime
- Elementor Pro frontend runtime
- hooks/i18n

These should be loaded from local mirrored files:

- `src/wp-content/themes/astra/...`
- `src/wp-content/plugins/elementor/...`
- `src/wp-content/plugins/elementor-pro/...`
- `src/wp-content/plugins/sitepress-multilingual-cms/...`
- `src/wp-content/plugins/wpml-cms-nav/...`
- `src/wp-includes/js/...`

### 2. Header bundle

Needed for the shared header:

- `widget-mega-menu.min.css`
- `widget-nav-menu.min.css`
- `sticky.min.css`
- `fadeIn.min.css`
- `e-animation-shrink.min.css`
- `jquery.smartmenus.min.js`
- `jquery.sticky.min.js`
- `elementor-pro frontend`
- `elements-handlers.min.js`

Also required:

- the exact inline config globals:
  - `astra`
  - `elementorFrontendConfig`
  - `ElementorProFrontendConfig`
- the exact inline CSS generated for header `9642` and header `10265`

### 3. Blog single bundle

Additional to base shell:

- `widget-post-info.min.css`
- article single inline CSS
- single-post body classes
- single-post schema/meta

### 4. Blog archive bundle

Different from blog single:

- archive body classes
- archive template CSS
- archive inline rules
- pagination-specific markup

### 5. Generic page bundle

For landing pages and solution pages:

- base shell
- page-specific Elementor inline CSS
- optional Swiper / animation assets when used

## Migration order

### Phase 1

Stabilize the shell:

- extract Spanish header/footer from the live static pages
- switch asset references from remote URLs to local `/wp-content/...`
- centralize inline configs in one Astro component

### Phase 2

Finish blog:

- blog single layout
- blog archive layout
- English blog archive/single variants if needed

### Phase 3

Generic pages:

- home
- contact
- pricing
- solutions

### Phase 4

Archives and edge pages:

- tag pages
- author pages
- case studies
- legal pages

## Important constraints

- Do not rely on ad hoc copied HTML per page.
- Keep header/footer/template ownership centralized in Astro.
- Do not mix remote `https://www.tictap.me/...` assets with Astro pages if the same asset already exists locally.
- Validate each shell with `npm run preview`.

## Commands

- Analyze current export:
  - `npm run analyze:astro-migration`
- Build Astro:
  - `npm run astro:build`
- Sync Astro output into static source:
  - `node bin/sync-astro-output.js`
- Preview final static site:
  - `npm run preview`
