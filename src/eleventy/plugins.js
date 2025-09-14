const pluginSitemap = require('@nichoth/eleventy-plugin-sitemap');

/**
 * Register Eleventy plugins (sitemap).
 * Robots.txt is generated via template (src/robots.liquid) to avoid extra dependency.
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig
 */
module.exports = function registerPlugins(eleventyConfig) {
  const siteUrl = process.env.SITE_URL || 'https://www.bmsventouse.fr';

  // Sitemap
  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: {
      hostname: siteUrl,
    },
  });
};