import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

/**
 * Página de detalles de un servicio.  Recupera la información desde la
 * configuración por su ID y muestra los datos completos.  Incluye un
 * enlace para reservar una cita con el servicio seleccionado.
 */
export const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services } = useConfig();
  const service = services.find((s) => s.id === id);

  if (!service) {
    return <p>Servicio no encontrado.</p>;
  }

  const crumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Servicios', to: '/services' },
    { label: service.name },
  ];

  return (
    <div>
      <Breadcrumbs crumbs={crumbs} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{service.name}</h2>
      <p className="text-gray-700 mb-2">Categoría: {service.category}</p>
      <p className="text-gray-700 mb-2">Duración: {service.duration}</p>
      <p className="text-gray-700 mb-4">Precio: ${service.price.toFixed(0)}</p>
      <p className="text-gray-600 mb-6">{service.description}</p>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        {/* Si el servicio requiere valoración previa, mostrar solo el botón de valoración */}
        {service.requiresEvaluation ? (
          <>
            <p className="text-sm text-red-600 mb-2 sm:mb-0">Este servicio requiere valoración previa.</p>
            <Link
              to={`/evaluation?serviceId=${service.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              Solicitar valoración
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/booking?serviceId=${service.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              Reservar cita
            </Link>
            <Link
              to={`/evaluation?serviceId=${service.id}`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Solicitar valoración
            </Link>
          </>
        )}
      </div>
    </div>
  );
};