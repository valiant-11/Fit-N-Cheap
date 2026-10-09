import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker for offline PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/sw.js`;
    navigator.serviceWorker
      .register(swPath)
      .then(reg => {
        console.log('Fit N Cheap Service Worker registered:', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker registration failed:', err);
      });
  });
}
