const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const path = require('path');

/**
 * Generiert eine Sitemap für alle veröffentlichten Websites
 * @param {Array} websites - Liste der Websites
 * @param {string} baseUrl - Basis-URL für die Sitemap
 * @returns {Promise<boolean>} - Erfolg der Sitemap-Generierung
 */
exports.generateSitemap = async (websites, baseUrl) => {
  try {
    // Erstelle einen Sitemap-Stream
    const smStream = new SitemapStream({ hostname: baseUrl });
    const pipeline = smStream.pipe(createGzip());

    // Füge alle veröffentlichten Websites zur Sitemap hinzu
    websites.forEach(website => {
      if (website.published && !website.isDemo) {
        smStream.write({
          url: `/${website.subdomain}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: website.updatedAt
        });
      }
    });

    // Füge statische Seiten hinzu
    smStream.write({
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    });

    smStream.write({
      url: '/about',
      changefreq: 'monthly',
      priority: 0.7
    });

    smStream.write({
      url: '/contact',
      changefreq: 'monthly',
      priority: 0.7
    });

    // Beende den Stream
    smStream.end();

    // Speichere die Sitemap
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml.gz');
    const sitemapDir = path.dirname(sitemapPath);

    // Stelle sicher, dass das Verzeichnis existiert
    if (!fs.existsSync(sitemapDir)) {
      fs.mkdirSync(sitemapDir, { recursive: true });
    }

    // Warte auf die Fertigstellung des Streams und speichere die Sitemap
    const buffer = await streamToPromise(pipeline);
    fs.writeFileSync(sitemapPath, buffer);

    console.log('Sitemap erfolgreich generiert:', sitemapPath);
    return true;
  } catch (error) {
    console.error('Fehler bei der Sitemap-Generierung:', error);
    return false;
  }
};
