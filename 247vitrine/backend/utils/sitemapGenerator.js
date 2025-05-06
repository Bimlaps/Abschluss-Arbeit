const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const path = require('path');

/**
 * Generiert eine Sitemap für alle Websites
 * @param {Array} websites - Array mit allen Websites
 * @param {string} baseUrl - Basis-URL der Plattform
 * @returns {Promise<boolean>} - Erfolg oder Misserfolg
 */
async function generateSitemap(websites, baseUrl = 'https://247vitrine.com') {
  try {
    // Erstelle einen Sitemap-Stream
    const smStream = new SitemapStream({ hostname: baseUrl });
    const pipeline = smStream.pipe(createGzip());
    
    // Füge die Hauptseite hinzu
    smStream.write({ url: '/', changefreq: 'monthly', priority: 1.0 });
    
    // Füge alle Websites hinzu
    websites.forEach(website => {
      const subdomain = website.subdomain || website._id;
      smStream.write({
        url: `/${subdomain}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: website.updatedAt || new Date()
      });
    });
    
    // Beende den Stream
    smStream.end();
    
    // Generiere die Sitemap
    const sitemap = await streamToPromise(pipeline);
    
    // Speichere die Sitemap
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml.gz');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log(`Sitemap erfolgreich generiert und gespeichert unter ${sitemapPath}`);
    return true;
  } catch (error) {
    console.error('Fehler bei der Generierung der Sitemap:', error);
    return false;
  }
}

module.exports = { generateSitemap };
