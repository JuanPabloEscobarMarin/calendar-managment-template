import React from "react";
import type { Service } from "../../config/appConfig";
import { Link } from "react-router-dom";

interface Props {
  service: Service;
}

/**
 * Tarjeta que muestra información básica de un servicio.  Se utiliza en
 * listados y enlaza a la página de detalles.  El estilo usa Tailwind
 * para que sea fácil de ajustar a diferentes marcas.
 */
export const ServiceCard: React.FC<Props> = ({ service }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {service.name}
      </h3>
      <p
        className="text-sm text-gray-600 mb-2 overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {service.description}
      </p>
      <p className="text-sm text-gray-700 mb-1">Duración: {service.duration}</p>
      <p className="text-sm text-gray-700 mb-4">
        Precio: ${service.price.toFixed(0)}
      </p>
      <Link
        to={`/services/${service.id}`}
        className="inline-block mt-auto bg-indigo-600 text-white text-xs px-3 py-2 rounded hover:bg-indigo-700"
      >
        Ver detalles
      </Link>
    </div>
  );
};
