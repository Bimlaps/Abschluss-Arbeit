import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Globale Fehlerbehandlung
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Starting application...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode entfernt, um doppelte Renders zu vermeiden
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
