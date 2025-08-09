import React from "react";
import { useConfig } from "../contexts/ConfigContext";

/**
 * Pie de página con información básica del negocio.  Utiliza la
 * configuración para mostrar el nombre, el teléfono y el correo.  Se
 * pueden añadir enlaces a redes sociales u otros datos a medida.
 */
export const Footer: React.FC = () => {
  const config = useConfig();
  return (
    <footer className="bg-gray-100 py-6 mt-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p className="font-semibold text-gray-700">{config.businessName}</p>
        <p className="mt-1">{config.tagline}</p>
        <p className="mt-1">
          Contacto:{" "}
          <a href={`tel:${config.contactPhone}`} className="text-indigo-600">
            {config.contactPhone}
          </a>{" "}
          •{" "}
          <a href={`mailto:${config.contactEmail}`} className="text-indigo-600">
            {config.contactEmail}
          </a>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          © {new Date().getFullYear()} {config.businessName}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};
