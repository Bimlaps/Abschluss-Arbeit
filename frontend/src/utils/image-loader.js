// Intersection Observer für Lazy Loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            const srcset = img.getAttribute('data-srcset');
            
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.01
});

// Placeholder Generator
function generatePlaceholder(width, height, color = '#f3f4f6') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas.toDataURL();
}

// Hauptfunktion zum Initialisieren des Lazy Loadings
export function initLazyLoading() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        // Placeholder setzen
        const width = img.getAttribute('width') || 300;
        const height = img.getAttribute('height') || 200;
        img.src = generatePlaceholder(width, height);
        
        // Loading Animation
        img.style.transition = 'opacity 0.3s ease-in-out';
        img.style.opacity = '0';
        
        // Beobachten des Bildes
        imageObserver.observe(img);
        
        // Event Listener für das Laden
        img.addEventListener('load', () => {
            if (img.src !== generatePlaceholder(width, height)) {
                img.style.opacity = '1';
            }
        });
    });
}

// Optimierte Bildgrößen generieren
export function getOptimizedImageUrl(url, width) {
    // Hier könnte eine Integration mit einem Bildoptimierungsdienst erfolgen
    const sizes = [300, 600, 900, 1200];
    const nextSize = sizes.find(size => size >= width) || sizes[sizes.length - 1];
    return `${url}?width=${nextSize}`;
}

// Responsive Images Helper
export function createResponsiveImage(imageUrl, alt, sizes = '100vw') {
    const img = document.createElement('img');
    img.setAttribute('alt', alt);
    img.setAttribute('data-src', imageUrl);
    img.setAttribute('sizes', sizes);
    
    // Srcset für verschiedene Bildschirmgrößen
    const srcset = [300, 600, 900, 1200]
        .map(width => `${getOptimizedImageUrl(imageUrl, width)} ${width}w`)
        .join(', ');
    
    img.setAttribute('data-srcset', srcset);
    return img;
}

// Bildvorschau mit Blur-Up Effekt
export function createBlurUpImage(imageUrl, alt) {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    // Thumbnail für Blur-Up Effekt
    const thumbnail = document.createElement('img');
    thumbnail.src = getOptimizedImageUrl(imageUrl, 20); // Sehr kleine Version
    thumbnail.style.position = 'absolute';
    thumbnail.style.filter = 'blur(10px)';
    thumbnail.style.transform = 'scale(1.1)';
    thumbnail.style.width = '100%';
    thumbnail.style.height = '100%';
    
    // Hauptbild
    const mainImage = createResponsiveImage(imageUrl, alt);
    mainImage.style.position = 'relative';
    mainImage.style.opacity = '0';
    mainImage.style.transition = 'opacity 0.3s ease-in-out';
    
    container.appendChild(thumbnail);
    container.appendChild(mainImage);
    
    mainImage.addEventListener('load', () => {
        mainImage.style.opacity = '1';
        setTimeout(() => {
            thumbnail.remove();
        }, 300);
    });
    
    return container;
} 