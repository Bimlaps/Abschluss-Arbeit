import React, { Suspense, lazy } from 'react';

// Lade-Komponente
const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Laden...</p>
  </div>
);

// Lazy-loaded Komponenten
export const LazyGallery = lazy(() => import('./Gallery/Gallery'));
export const LazyServices = lazy(() => import('./Services/Services'));
export const LazyContact = lazy(() => import('./Contact/Contact'));
export const LazyMap = lazy(() => import('./Map/Map'));
export const LazyPricingTable = lazy(() => import('./Pricing/PricingTable'));

// HOC für Lazy Loading
export const withLazyLoading = (WrappedComponent) => {
  return function LazyComponent(props) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
};

// Vorgefertigte Lazy-Komponenten
export const Gallery = withLazyLoading(LazyGallery);
export const Services = withLazyLoading(LazyServices);
export const Contact = withLazyLoading(LazyContact);
export const Map = withLazyLoading(LazyMap);
export const PricingTable = withLazyLoading(LazyPricingTable);

// CSS für den Spinner
const styles = `
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Füge Styles zum Document hinzu
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 