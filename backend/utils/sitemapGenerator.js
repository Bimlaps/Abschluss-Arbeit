const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs').promises;
const path = require('path');
const Website = require('../models/Website');

/**
 * Generiert Sitemaps für alle aktiven Websites
 */
async function generateSitemaps() {
  try {
    // Hole alle aktiven Websites
    const websites = await Website.find({ 
      published: true,
      isDemo: false 
    });

    // Generiere Hauptsitemap für 247vitrine.com
    const mainLinks = [
      { url: '/', changefreq: 'monthly', priority: 1.0 },
      { url: '/login', changefreq: 'monthly', priority: 0.8 },
      { url: '/register', changefreq: 'monthly', priority: 0.8 },
      { url: '/features', changefreq: 'monthly', priority: 0.9 },
      { url: '/templates', changefreq: 'weekly', priority: 0.9 },
      { url: '/contact', changefreq: 'monthly', priority: 0.7 },
      { url: '/blog', changefreq: 'weekly', priority: 0.6 }
    ];

    await generateSitemap(mainLinks, 'main-sitemap.xml');

    // Generiere Sitemaps für jede Handwerker-Website
    for (const website of websites) {
      const websiteLinks = generateWebsiteLinks(website);
      const filename = `sitemap-${website.subdomain}.xml`;
      await generateSitemap(websiteLinks, filename);
    }

    // Generiere Sitemap-Index
    await generateSitemapIndex(websites);

    console.log('Sitemaps erfolgreich generiert');
  } catch (error) {
    console.error('Fehler beim Generieren der Sitemaps:', error);
    throw error;
  }
}

/**
 * Generiert Links für eine einzelne Website
 */
function generateWebsiteLinks(website) {
  const baseUrl = `https://${website.subdomain}.247vitrine.com`;
  const links = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/services', changefreq: 'weekly', priority: 0.9 },
    { url: '/gallery', changefreq: 'weekly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.8 }
  ];

  // Füge zusätzliche Seiten hinzu, falls vorhanden
  if (website.content?.gallery?.length > 0) {
    website.content.gallery.forEach(item => {
      links.push({
        url: `/gallery/${item.id}`,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
  }

  // Füge Dienstleistungsseiten hinzu
  if (website.content?.services?.length > 0) {
    website.content.services.forEach(service => {
      links.push({
        url: `/services/${service.id}`,
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  }

  // Konvertiere relative URLs zu absoluten URLs
  return links.map(link => ({
    ...link,
    url: `${baseUrl}${link.url}`
  }));
}

/**
 * Generiert eine einzelne Sitemap
 */
async function generateSitemap(links, filename) {
  try {
    const stream = new SitemapStream({ hostname: 'https://247vitrine.com' });
    
    // Füge Links zur Sitemap hinzu
    const data = Readable.from(links).pipe(stream);
    
    // Generiere XML
    const xml = await streamToPromise(data);
    
    // Speichere Sitemap
    const filepath = path.join(__dirname, '../public/sitemaps', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, xml);
    
    return filename;
  } catch (error) {
    console.error(`Fehler beim Generieren der Sitemap ${filename}:`, error);
    throw error;
  }
}

/**
 * Generiert Sitemap-Index
 */
async function generateSitemapIndex(websites) {
  try {
    const sitemaps = [
      { url: 'https://247vitrine.com/sitemaps/main-sitemap.xml' },
      ...websites.map(website => ({
        url: `https://247vitrine.com/sitemaps/sitemap-${website.subdomain}.xml`
      }))
    ];

    const stream = new SitemapStream({ hostname: 'https://247vitrine.com' });
    const data = Readable.from(sitemaps).pipe(stream);
    const xml = await streamToPromise(data);

    const filepath = path.join(__dirname, '../public/sitemap.xml');
    await fs.writeFile(filepath, xml);
  } catch (error) {
    console.error('Fehler beim Generieren des Sitemap-Index:', error);
    throw error;
  }
}

module.exports = {
  generateSitemaps,
  generateSitemap,
  generateWebsiteLinks
};
