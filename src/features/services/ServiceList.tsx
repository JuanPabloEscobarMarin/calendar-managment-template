import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { ServiceCard } from './ServiceCard';

/**
 * Muestra una cuadrícula de tarjetas de servicios.  Obtiene la lista
 * directamente del contexto de configuración para que sea fácil de
 * sustituir o extender.  En proyectos reales podrías filtrar por
 * categorías o cargar los datos desde una API.
 */
export const ServiceList: React.FC = () => {
  const { services } = useConfig();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((svc) => (
        <ServiceCard key={svc.id} service={svc} />
      ))}
    </div>
  );
};