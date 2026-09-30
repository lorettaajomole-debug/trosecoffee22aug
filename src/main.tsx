import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testShopifyConnection } from './services/shopify';

// Development-only connection test (never renders UI, never leaks tokens)
if (import.meta.env.DEV) {
  (window as unknown as { __testShopifyConnection?: typeof testShopifyConnection }).__testShopifyConnection = testShopifyConnection;
  testShopifyConnection().catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
