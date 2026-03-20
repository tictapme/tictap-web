# TicTAP
https://www.tictap.me/

## Sitemap

Once you converted the wordpress website to an static website you need to convert the relative URL's to Absolute URL's from all the sitemaps

Simply execute the script sync.sh located in bin or run the following command `node ..\scripts\add-absolute-url-sitemap.js`

## SEO cleanup

After each sync, run `node bin/optimize-seo.js` to:

- replace staging or development hosts with `https://www.tictap.me`
- set `noindex, follow` on utility, archive and test pages
- deduplicate the XML sitemaps and keep only the sitemap files that exist
- point `robots.txt` to the production sitemap index
