import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Suppress benign Vite WebSocket errors that are expected in this environment
if (typeof window !== 'undefined') {
  const isViteError = (err: any) => {
    const msg = err?.message || String(err);
    return (
      msg.includes('WebSocket') ||
      msg.includes('vite') ||
      msg.includes('HMR') ||
      msg.includes('closed without opened')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isViteError(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isViteError(event.error) || isViteError(event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
