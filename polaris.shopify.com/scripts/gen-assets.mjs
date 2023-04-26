import genCacheJson from './gen-cache-json.mjs';
import genSiteMap from './gen-site-map.mjs';
import genOgImages from './gen-og-images.mjs';
import genColors from './gen-colors.mjs';

// Generate nav & cache files which the docs site depend on to run
await genCacheJson();
// Build the docs site, then generate the sitemap.xml
await genSiteMap();
// Use the sitemap.xml to generate Open Graph images
await genOgImages();
// Generate CSS variables for the colors docs page
await genColors();
