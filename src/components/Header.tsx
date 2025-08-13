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
    <header className=" md:p-8 bg-[#1a1a1a] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="tm-0 text-[1.8rem] font-bold text-[#cba313ff]">
          <Link to="/">{config.siteName}</Link>
        </h1>
        <nav className="flex flex-wrap justify-center md:justify-start list-none m-0 p-0">
          <ul className="flex flex-wrap justify-center md:justify-start list-none m-0 p-0">
          <li className="mx-2 my-2 md:ml-6 md:my-0"><Link to="/services" className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#f5c518]">Servicios</Link></li>
          <li className="mx-2 my-2 md:ml-6 md:my-0"><Link to="/products" className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#f5c518]">Productos</Link></li>
          <li className="mx-2 my-2 md:ml-6 md:my-0"><Link to="/reviews" className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#f5c518]">Opiniones</Link></li>
          <li className="mx-2 my-2 md:ml-6 md:my-0"><Link to="/admin" className="no-underline text-white font-medium transition-colors duration-300 hover:text-[#f5c518]">Admin</Link></li>
        </ul>
        </nav>
      </div>
    </header>
  );
};
