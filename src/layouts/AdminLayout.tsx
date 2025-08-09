import React from 'react';
import { Header } from '../components/Header';

/**
 * Layout sencillo para el panel de administración.  Por defecto reutiliza
 * el mismo encabezado que las páginas públicas, pero en un proyecto real
 * podrías utilizar un menú o cabecera distinto.  No se incluye footer
 * para maximizar el área de gestión.
 */
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  );
};