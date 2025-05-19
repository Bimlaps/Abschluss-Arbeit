class WebsiteGenerator {
    constructor() {
        this.templates = {
            'business-modern': {
                path: '/templates/business/modern.html',
                features: ['responsive', 'contact-form', 'about-section', 'services', 'testimonials']
            },
            'business-classic': {
                path: '/templates/business/classic.html',
                features: ['responsive', 'contact-form', 'about-section', 'team', 'clients']
            },
            'portfolio-creative': {
                path: '/templates/portfolio/creative.html',
                features: ['responsive', 'gallery', 'projects', 'skills', 'contact-form']
            },
            'portfolio-minimal': {
                path: '/templates/portfolio/minimal.html',
                features: ['responsive', 'gallery', 'about-section', 'contact-form']
            },
            'blog-magazine': {
                path: '/templates/blog/magazine.html',
                features: ['responsive', 'articles', 'categories', 'search', 'newsletter']
            },
            'blog-personal': {
                path: '/templates/blog/personal.html',
                features: ['responsive', 'articles', 'about-section', 'social-media']
            }
        };

        this.layoutTemplates = {
            modern: '/layouts/modern/preview.html',
            classic: '/layouts/classic/preview.html',
            dynamic: '/layouts/dynamic/preview.html'
        };

        this.designSchemas = {
            minimalistisch: {
                spacing: 'spacious',
                typography: {
                    headings: 'sans',
                    body: 'sans-light'
                },
                borders: 'subtle'
            },
            elegant: {
                spacing: 'balanced',
                typography: {
                    headings: 'serif',
                    body: 'sans'
                },
                borders: 'refined'
            },
            bold: {
                spacing: 'compact',
                typography: {
                    headings: 'sans-bold',
                    body: 'sans'
                },
                borders: 'strong'
            }
        };
    }

    async generate() {
        try {
            // Lade gespeicherte Daten
            const templateChoice = localStorage.getItem('selectedTemplate');
            const layoutChoice = localStorage.getItem('selectedLayout');
            const designSchema = localStorage.getItem('designSchema');
            const colorPalette = JSON.parse(localStorage.getItem('colorPalette'));
            const companyInfo = JSON.parse(localStorage.getItem('companyInfo'));

            // Validiere Daten
            if (!this.validateData(templateChoice, layoutChoice, designSchema, colorPalette, companyInfo)) {
                throw new Error('Unvollständige oder ungültige Daten');
            }

            // 1. Template vorbereiten
            await this.prepareTemplate(templateChoice);
            this.updateProgress('Template wird vorbereitet', 15);

            // 2. Layout anpassen
            await this.prepareLayout(layoutChoice);
            this.updateProgress('Layout wird angepasst', 30);

            // 3. Design-Schema anwenden
            await this.applyDesignSchema(designSchema);
            this.updateProgress('Design-Schema wird angewendet', 45);

            // 4. Inhalte einfügen
            await this.insertContent(companyInfo);
            this.updateProgress('Inhalte werden eingefügt', 60);

            // 5. Features aktivieren
            await this.enableFeatures(templateChoice);
            this.updateProgress('Features werden aktiviert', 75);

            // 6. SEO-Optimierung
            await this.optimizeSEO(companyInfo);
            this.updateProgress('Optimierung für Suchmaschinen', 90);

            // 7. Finale Überprüfung
            await this.finalCheck();
            this.updateProgress('Finale Überprüfung', 100);

            return {
                success: true,
                websiteUrl: this.generateWebsiteUrl(companyInfo.name),
                adminUrl: this.generateAdminUrl(companyInfo.name)
            };
        } catch (error) {
            console.error('Fehler bei der Website-Generierung:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validateData(templateChoice, layoutChoice, designSchema, colorPalette, companyInfo) {
        return (
            templateChoice &&
            this.templates[templateChoice] &&
            layoutChoice &&
            designSchema &&
            colorPalette &&
            companyInfo &&
            companyInfo.name &&
            companyInfo.industry &&
            companyInfo.contact.email &&
            companyInfo.contact.phone
        );
    }

    async prepareTemplate(templateChoice) {
        const template = this.templates[templateChoice];
        if (!template) {
            throw new Error('Ungültige Template-Auswahl');
        }

        // Template laden und vorbereiten
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    async enableFeatures(templateChoice) {
        const template = this.templates[templateChoice];
        const features = template.features;

        for (const feature of features) {
            await this.activateFeature(feature);
        }
    }

    async activateFeature(feature) {
        // Feature-spezifische Aktivierung
        switch (feature) {
            case 'contact-form':
                await this.setupContactForm();
                break;
            case 'gallery':
                await this.setupGallery();
                break;
            case 'articles':
                await this.setupBlog();
                break;
            case 'newsletter':
                await this.setupNewsletter();
                break;
            // Weitere Features hier hinzufügen
        }
    }

    async prepareLayout(layoutChoice) {
        const templatePath = this.layoutTemplates[layoutChoice];
        if (!templatePath) {
            throw new Error('Ungültige Layout-Auswahl');
        }

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    async applyDesignSchema(schemaChoice) {
        const schema = this.designSchemas[schemaChoice];
        if (!schema) {
            throw new Error('Ungültiges Design-Schema');
        }

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    async insertContent(companyInfo) {
        // Validiere und sanitize Inhalte
        const sanitizedContent = this.sanitizeContent(companyInfo);

        // Füge Inhalte in das Template ein
        await this.insertCompanyInfo(sanitizedContent);
        await this.processLogo(companyInfo.logo);
        await this.setupContactForm(sanitizedContent.contact);
        await this.setupSocialMedia(sanitizedContent.social);

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    async optimizeSEO(companyInfo) {
        // SEO-Optimierungen durchführen
        await this.generateMetaTags(companyInfo);
        await this.generateSitemap();
        await this.setupAnalytics();

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    async finalCheck() {
        // Finale Überprüfungen durchführen
        await this.validateHTML();
        await this.checkResponsiveness();
        await this.testFunctionality();
        await this.optimizePerformance();

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
    }

    sanitizeContent(content) {
        return {
            ...content,
            name: this.sanitizeText(content.name),
            description: this.sanitizeText(content.description),
            contact: {
                email: this.sanitizeEmail(content.contact.email),
                phone: this.sanitizePhone(content.contact.phone),
                address: this.sanitizeText(content.contact.address)
            },
            social: {
                facebook: this.sanitizeUrl(content.social.facebook),
                instagram: this.sanitizeUrl(content.social.instagram)
            }
        };
    }

    sanitizeText(text) {
        return text ? text.trim().replace(/<[^>]*>/g, '') : '';
    }

    sanitizeEmail(email) {
        return email ? email.trim().toLowerCase() : '';
    }

    sanitizePhone(phone) {
        return phone ? phone.replace(/[^\d+\-\s()]/g, '') : '';
    }

    sanitizeUrl(url) {
        if (!url) return '';
        try {
            const parsed = new URL(url);
            return parsed.href;
        } catch {
            return '';
        }
    }

    generateWebsiteUrl(companyName) {
        const sanitizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        return `https://${sanitizedName}.domain.de`;
    }

    generateAdminUrl(companyName) {
        return `${this.generateWebsiteUrl(companyName)}/admin`;
    }

    updateProgress(status, percent) {
        const event = new CustomEvent('generationProgress', {
            detail: { status, percent }
        });
        window.dispatchEvent(event);
    }
}

// Export der Generator-Klasse
window.WebsiteGenerator = WebsiteGenerator; 