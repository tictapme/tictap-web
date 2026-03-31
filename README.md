# TicTAP
https://www.tictap.me/

## Sitemap

Once you converted the wordpress website to an static website you need to convert the relative URL's to Absolute URL's from all the sitemaps

Simply execute the script sync.sh located in bin or run the following command `node ..\scripts\add-absolute-url-sitemap.js`

## SEO cleanup

After each sync, run `node bin/optimize-seo.js` to:

- replace non-target hosts with the host that matches the active branch
- set `noindex, follow` on utility, archive and test pages
- deduplicate the XML sitemaps and keep only the sitemap files that exist
- point `robots.txt` to the sitemap index of the active host

Host mapping:

- `main` -> `https://www.tictap.me`
- `develop` -> `https://develop.wp-web.pages.dev`

You can override automatic detection with `SITE_BRANCH=<branch>` or `SITE_HOST=<full-host>`.

## Astro migration

- The blog is already rendered through Astro layouts and content collections.
- The rest of the legacy static export is now also routed through Astro build pages before being synced back into `src/`.
- Current migration mode:
  - blog pages: shared Astro layouts
  - non-blog pages: Astro catch-all rendering of the existing legacy HTML

This keeps one build pipeline for the whole site while the remaining legacy templates are progressively replaced with reusable Astro layouts.
