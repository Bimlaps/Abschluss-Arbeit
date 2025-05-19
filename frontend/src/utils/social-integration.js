// Vereinfachte Social Media Integration ohne SDK-Abhängigkeiten

// Share URLs für verschiedene Plattformen
const shareUrls = {
    facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    linkedin: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    whatsapp: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    telegram: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
};

// Social Share Buttons erstellen
export function createShareButtons(url, title, description) {
    const container = document.createElement('div');
    container.className = 'social-share-container';
    
    // Share-Buttons für verschiedene Plattformen
    const buttons = [
        {
            platform: 'facebook',
            icon: 'fa-facebook-f',
            text: 'Teilen',
            shareUrl: shareUrls.facebook(url)
        },
        {
            platform: 'twitter',
            icon: 'fa-twitter',
            text: 'Tweet',
            shareUrl: shareUrls.twitter(url, description)
        },
        {
            platform: 'linkedin',
            icon: 'fa-linkedin-in',
            text: 'Teilen',
            shareUrl: shareUrls.linkedin(url, title)
        },
        {
            platform: 'whatsapp',
            icon: 'fa-whatsapp',
            text: 'Teilen',
            shareUrl: shareUrls.whatsapp(url, title)
        },
        {
            platform: 'telegram',
            icon: 'fa-telegram',
            text: 'Teilen',
            shareUrl: shareUrls.telegram(url, title)
        }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `share-button ${btn.platform}`;
        button.innerHTML = `<i class="fab ${btn.icon}"></i> ${btn.text}`;
        button.onclick = () => {
            window.open(btn.shareUrl, '_blank', 'width=600,height=400');
            trackShare(btn.platform); // Optional: Tracking
        };
        container.appendChild(button);
    });

    return container;
}

// Social Media Meta Tags Generator
export function generateSocialMetaTags(data) {
    const metaTags = {
        // Open Graph (Facebook)
        'og:title': data.title,
        'og:description': data.description,
        'og:image': data.image,
        'og:url': data.url,
        'og:type': 'website',
        
        // Twitter Card
        'twitter:card': 'summary_large_image',
        'twitter:title': data.title,
        'twitter:description': data.description,
        'twitter:image': data.image
    };
    
    Object.entries(metaTags).forEach(([name, content]) => {
        const meta = document.createElement('meta');
        if (name.startsWith('og:')) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    });
}

// Einfaches Share-Tracking
function trackShare(platform) {
    // Hier könnte eine Integration mit einem Analytics-Service erfolgen
    console.log(`Share auf ${platform} getrackt`);
    
    // Beispiel für Google Analytics Event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'Social',
            'event_label': platform
        });
    }
}

// Social Media Feed Integration
export class SocialFeed {
    constructor(container) {
        this.container = container;
        this.feeds = {
            instagram: [],
            facebook: [],
            twitter: []
        };
    }
    
    async loadInstagramFeed() {
        try {
            const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${socialConfig.instagram.accessToken}`);
            const data = await response.json();
            this.feeds.instagram = data.data;
            return data.data;
        } catch (error) {
            console.error('Instagram Feed Error:', error);
            return [];
        }
    }
    
    async loadFacebookPosts() {
        try {
            const response = await fetch(`https://graph.facebook.com/${socialConfig.facebook.appId}/posts?access_token=${socialConfig.facebook.accessToken}`);
            const data = await response.json();
            this.feeds.facebook = data.data;
            return data.data;
        } catch (error) {
            console.error('Facebook Feed Error:', error);
            return [];
        }
    }
    
    renderFeed(platform) {
        const feed = this.feeds[platform];
        const feedContainer = document.createElement('div');
        feedContainer.className = `social-feed ${platform}`;
        
        feed.forEach(item => {
            const post = document.createElement('div');
            post.className = 'social-post';
            
            switch(platform) {
                case 'instagram':
                    post.innerHTML = `
                        <img src="${item.media_url}" alt="${item.caption || ''}" loading="lazy">
                        <p>${item.caption || ''}</p>
                        <a href="${item.permalink}" target="_blank">Auf Instagram ansehen</a>
                    `;
                    break;
                    
                case 'facebook':
                    post.innerHTML = `
                        <p>${item.message || ''}</p>
                        <a href="https://facebook.com/${item.id}" target="_blank">Auf Facebook ansehen</a>
                    `;
                    break;
            }
            
            feedContainer.appendChild(post);
        });
        
        return feedContainer;
    }
}

// Social Media Analytics
export class SocialAnalytics {
    constructor() {
        this.metrics = {
            shares: 0,
            likes: 0,
            comments: 0
        };
    }
    
    trackShare(platform) {
        this.metrics.shares++;
        // Hier könnte eine Integration mit einem Analytics-Service erfolgen
        console.log(`Share auf ${platform} getrackt`);
    }
    
    trackEngagement(type, platform) {
        this.metrics[type]++;
        console.log(`${type} auf ${platform} getrackt`);
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Minimale Social Media Integration
export class SocialLinks {
    constructor(options = {}) {
        this.links = {
            facebook: '',
            instagram: '',
            twitter: '',
            whatsapp: '',
            linkedin: ''
        };
        
        // Standard-Optionen
        this.options = {
            iconSize: options.iconSize || 'medium', // 'small', 'medium', 'large'
            showLabels: options.showLabels || false,
            customLabels: options.customLabels || {},
            iconColor: options.iconColor || '#333333'
        };

        // CSS-Styles für die Icons
        this.addStyles();
    }

    // Social Media Links setzen
    setLinks(links) {
        // Facebook (z.B. https://facebook.com/meinefirma)
        if (links.facebook) {
            this.links.facebook = links.facebook.startsWith('http') 
                ? links.facebook 
                : `https://facebook.com/${links.facebook}`;
        }

        // Instagram (z.B. https://instagram.com/meinefirma)
        if (links.instagram) {
            this.links.instagram = links.instagram.startsWith('http') 
                ? links.instagram 
                : `https://instagram.com/${links.instagram}`;
        }

        // Twitter (z.B. https://twitter.com/meinefirma)
        if (links.twitter) {
            this.links.twitter = links.twitter.startsWith('http') 
                ? links.twitter 
                : `https://twitter.com/${links.twitter}`;
        }

        // WhatsApp (Nur die Nummer, z.B. +491234567890)
        if (links.whatsapp) {
            this.links.whatsapp = links.whatsapp.startsWith('+') 
                ? links.whatsapp 
                : `+${links.whatsapp.replace(/[^0-9]/g, '')}`;
        }

        // LinkedIn (z.B. https://linkedin.com/company/meinefirma oder /in/username)
        if (links.linkedin) {
            this.links.linkedin = links.linkedin.startsWith('http') 
                ? links.linkedin 
                : `https://linkedin.com/${links.linkedin.startsWith('in/') ? links.linkedin : 'company/' + links.linkedin}`;
        }
    }

    // Styles zur Seite hinzufügen
    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .social-icons {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .social-icon {
                text-decoration: none;
                display: flex;
                align-items: center;
                transition: transform 0.2s ease;
                color: ${this.options.iconColor};
            }

            .social-icon:hover {
                transform: scale(1.1);
            }

            .social-icon.small i {
                font-size: 1.2rem;
            }

            .social-icon.medium i {
                font-size: 1.5rem;
            }

            .social-icon.large i {
                font-size: 2rem;
            }

            .social-icon-label {
                margin-left: 0.5rem;
                font-size: 0.9rem;
            }

            /* Plattform-spezifische Hover-Farben */
            .social-icon.facebook:hover { color: #1877f2; }
            .social-icon.instagram:hover { color: #e4405f; }
            .social-icon.twitter:hover { color: #1da1f2; }
            .social-icon.whatsapp:hover { color: #25d366; }
            .social-icon.linkedin:hover { color: #0077b5; }
        `;
        document.head.appendChild(styles);
    }

    // Standard-Labels für die Plattformen
    getDefaultLabel(platform) {
        const labels = {
            facebook: 'Facebook',
            instagram: 'Instagram',
            twitter: 'Twitter',
            whatsapp: 'WhatsApp',
            linkedin: 'LinkedIn'
        };
        return labels[platform];
    }

    // Social Media Icons mit Links erstellen
    createSocialIcons() {
        const container = document.createElement('div');
        container.className = 'social-icons';

        // Icons nur für gesetzte Links erstellen
        Object.entries(this.links).forEach(([platform, link]) => {
            if (link) {
                const icon = document.createElement('a');
                icon.href = platform === 'whatsapp' ? `https://wa.me/${link.replace(/[^0-9]/g, '')}` : link;
                icon.target = '_blank';
                icon.rel = 'noopener noreferrer';
                icon.className = `social-icon ${platform} ${this.options.iconSize}`;
                
                // Icon erstellen
                const iconElement = document.createElement('i');
                iconElement.className = `fab fa-${platform}`;
                icon.appendChild(iconElement);

                // Label hinzufügen, wenn aktiviert
                if (this.options.showLabels) {
                    const label = document.createElement('span');
                    label.className = 'social-icon-label';
                    label.textContent = this.options.customLabels[platform] || this.getDefaultLabel(platform);
                    icon.appendChild(label);
                }

                container.appendChild(icon);
            }
        });

        return container;
    }

    // Optionen aktualisieren
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.addStyles(); // Styles mit neuen Optionen aktualisieren
    }
}

// Beispiel-Nutzung:
/*
const social = new SocialLinks({
    iconSize: 'large',
    showLabels: true,
    customLabels: {
        facebook: 'Folge uns auf Facebook',
        whatsapp: 'Kontaktiere uns',
        linkedin: 'Vernetze dich mit uns'
    },
    iconColor: '#444444'
});

social.setLinks({
    facebook: 'meinefirma',
    instagram: 'meinefirma',
    twitter: 'meinefirma',
    whatsapp: '+491234567890',
    linkedin: 'company/meinefirma'
});

// Icons in die Seite einfügen
document.body.appendChild(social.createSocialIcons());

// Optionen später ändern
social.updateOptions({
    iconSize: 'small',
    showLabels: false
});
*/ 