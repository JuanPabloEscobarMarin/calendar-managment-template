import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ConfigProvider } from './contexts/ConfigContext';
import { defaultConfig } from './config/appConfig';

// Punto de entrada: monta la aplicación en el elemento con id 'root'.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider config={defaultConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);