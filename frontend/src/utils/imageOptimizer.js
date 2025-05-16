import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

/**
 * Optimiert Bildgrößen basierend auf Viewport und Gerät
 */
export const getOptimizedImageUrl = (originalUrl, width = 800) => {
  if (!originalUrl) return '';
  
  // Wenn es bereits eine optimierte URL ist, verwende diese
  if (originalUrl.includes('_optimized')) {
    return originalUrl;
  }

  // Füge Größenparameter zur URL hinzu
  const url = new URL(originalUrl);
  url.searchParams.set('w', width);
  url.searchParams.set('q', '80'); // Qualität
  url.searchParams.set('auto', 'format'); // Automatisches Format (WebP wenn unterstützt)
  
  return url.toString();
};

/**
 * Lazy-Loading Bild-Komponente mit Blur-Effekt
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  width = 800,
  className = '',
  style = {}
}) => {
  const optimizedSrc = getOptimizedImageUrl(src, width);
  
  return (
    <LazyLoadImage
      alt={alt}
      src={optimizedSrc}
      effect="blur"
      className={className}
      style={style}
      width={width}
      loading="lazy"
    />
  );
};

/**
 * Generiert verschiedene Bildgrößen für srcset
 */
export const generateSrcSet = (originalUrl, sizes = [320, 640, 960, 1280, 1920]) => {
  if (!originalUrl) return '';
  
  return sizes
    .map(size => `${getOptimizedImageUrl(originalUrl, size)} ${size}w`)
    .join(', ');
};

/**
 * Prüft ob ein Bild im Viewport ist
 */
export const isInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Vorlädt wichtige Bilder
 */
export const preloadCriticalImages = (urls = []) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}; 