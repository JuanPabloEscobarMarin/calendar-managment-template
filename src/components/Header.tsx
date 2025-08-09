import React from "react";
import { Link } from "react-router-dom";
import { useConfig } from "../contexts/ConfigContext";

/**
 * Componente de cabecera que muestra el nombre del sitio y un menú simple.
 * Lee los datos de configuración desde el contexto para que el título y
 * enlaces puedan ser personalizados sin modificar el componente.
 */
export const Header: React.FC = () => {
  const config = useConfig();
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          <Link to="/">{config.siteName}</Link>
        </h1>
        <nav className="space-x-4 text-sm">
          <Link to="/services" className="text-gray-700 hover:text-indigo-600">
            Servicios
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-indigo-600">
            Productos
          </Link>
          <Link to="/reviews" className="text-gray-700 hover:text-indigo-600">
            Opiniones
          </Link>
          <Link to="/admin" className="text-gray-700 hover:text-indigo-600">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};
