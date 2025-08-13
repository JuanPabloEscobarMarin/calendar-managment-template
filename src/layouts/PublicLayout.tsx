import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/**
 * Layout para páginas públicas.  Incluye el header y el footer, y un
 * contenedor principal para el contenido.  El diseño utiliza utilidades
 * de Tailwind para estructura flexible.
 */
export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main >{children}</main>
      <Footer />
    </div>
  );
};