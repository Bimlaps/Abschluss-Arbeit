// Static Site Export Utilities
import { createWriteStream, mkdir } from 'fs';
import { join } from 'path';
import { minify } from 'html-minifier';
import CleanCSS from 'clean-css';
import { minify as minifyJS } from 'terser';

// Konfiguration für den Export
const exportConfig = {
    minify: {
        html: {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        },
        css: {
            level: 2
        },
        js: {
            compress: true,
            mangle: true
        }
    },
    paths: {
        assets: '/assets',
        images: '/assets/images',
        styles: '/assets/css',
        scripts: '/assets/js'
    }
};

// Hauptexport-Klasse
export class StaticExporter {
    constructor(websiteData) {
        this.data = websiteData;
        this.exportPath = '';
        this.assets = {
            images: new Set(),
            styles: new Set(),
            scripts: new Set()
        };
    }

    // Export initialisieren
    async initializeExport(exportPath) {
        this.exportPath = exportPath;
        
        // Verzeichnisstruktur erstellen
        await mkdir(exportPath, { recursive: true });
        await mkdir(join(exportPath, 'assets'), { recursive: true });
        await mkdir(join(exportPath, 'assets/images'), { recursive: true });
        await mkdir(join(exportPath, 'assets/css'), { recursive: true });
        await mkdir(join(exportPath, 'assets/js'), { recursive: true });
    }

    // Assets sammeln
    collectAssets() {
        // Bilder sammeln
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
                this.assets.images.add(src);
            }
        });

        // Stylesheets sammeln
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                this.assets.styles.add(href);
            }
        });

        // Scripts sammeln
        document.querySelectorAll('script').forEach(script => {
            const src = script.getAttribute('src');
            if (src) {
                this.assets.scripts.add(src);
            }
        });
    }

    // HTML optimieren
    async optimizeHTML(html) {
        // Pfade anpassen
        let optimizedHTML = html
            .replace(/src="\/images\//g, `src="${exportConfig.paths.images}/`)
            .replace(/href="\/css\//g, `href="${exportConfig.paths.styles}/`)
            .replace(/src="\/js\//g, `src="${exportConfig.paths.scripts}/`);

        // HTML minifizieren
        if (exportConfig.minify.html) {
            optimizedHTML = minify(optimizedHTML, exportConfig.minify.html);
        }

        return optimizedHTML;
    }

    // CSS optimieren
    async optimizeCSS(css) {
        const cleanCSS = new CleanCSS(exportConfig.minify.css);
        return cleanCSS.minify(css).styles;
    }

    // JavaScript optimieren
    async optimizeJS(js) {
        const result = await minifyJS(js, exportConfig.minify.js);
        return result.code;
    }

    // Assets exportieren
    async exportAssets() {
        // Bilder kopieren
        for (const imagePath of this.assets.images) {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const fileName = imagePath.split('/').pop();
            const filePath = join(this.exportPath, 'assets/images', fileName);
            
            const fileStream = createWriteStream(filePath);
            const buffer = await blob.arrayBuffer();
            fileStream.write(Buffer.from(buffer));
            fileStream.end();
        }

        // Styles exportieren
        for (const stylePath of this.assets.styles) {
            const response = await fetch(stylePath);
            const css = await response.text();
            const optimizedCSS = await this.optimizeCSS(css);
            const fileName = stylePath.split('/').pop();
            const filePath = join(this.exportPath, 'assets/css', fileName);
            
            const fileStream = createWriteStream(filePath);
            fileStream.write(optimizedCSS);
            fileStream.end();
        }

        // Scripts exportieren
        for (const scriptPath of this.assets.scripts) {
            const response = await fetch(scriptPath);
            const js = await response.text();
            const optimizedJS = await this.optimizeJS(js);
            const fileName = scriptPath.split('/').pop();
            const filePath = join(this.exportPath, 'assets/js', fileName);
            
            const fileStream = createWriteStream(filePath);
            fileStream.write(optimizedJS);
            fileStream.end();
        }
    }

    // Seiten generieren
    async generatePages() {
        const pages = this.data.pages;
        
        for (const page of pages) {
            const html = await this.optimizeHTML(page.content);
            const filePath = join(this.exportPath, page.path);
            
            // Verzeichnis für die Seite erstellen
            await mkdir(join(this.exportPath, page.path.split('/').slice(0, -1).join('/')), { recursive: true });
            
            // HTML-Datei schreiben
            const fileStream = createWriteStream(filePath);
            fileStream.write(html);
            fileStream.end();
        }
    }

    // Zusätzliche Dateien generieren
    async generateAdditionalFiles() {
        // robots.txt
        const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${this.data.siteUrl}/sitemap.xml`;
        const robotsPath = join(this.exportPath, 'robots.txt');
        const robotsStream = createWriteStream(robotsPath);
        robotsStream.write(robotsTxt);
        robotsStream.end();

        // sitemap.xml
        const sitemap = this.generateSitemap();
        const sitemapPath = join(this.exportPath, 'sitemap.xml');
        const sitemapStream = createWriteStream(sitemapPath);
        sitemapStream.write(sitemap);
        sitemapStream.end();
    }

    // Sitemap generieren
    generateSitemap() {
        const pages = this.data.pages;
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        pages.forEach(page => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${this.data.siteUrl}${page.path}</loc>\n`;
            sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
            sitemap += '    <changefreq>weekly</changefreq>\n';
            sitemap += '    <priority>0.8</priority>\n';
            sitemap += '  </url>\n';
        });
        
        sitemap += '</urlset>';
        return sitemap;
    }

    // Hauptexport-Funktion
    async export(exportPath) {
        try {
            console.log('Starting export process...');
            
            // Export initialisieren
            await this.initializeExport(exportPath);
            console.log('Export directory structure created');
            
            // Assets sammeln und exportieren
            this.collectAssets();
            await this.exportAssets();
            console.log('Assets exported');
            
            // Seiten generieren
            await this.generatePages();
            console.log('Pages generated');
            
            // Zusätzliche Dateien generieren
            await this.generateAdditionalFiles();
            console.log('Additional files generated');
            
            console.log('Export completed successfully!');
            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }
} 