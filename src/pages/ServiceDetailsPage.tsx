import React from 'react';
import { ServiceDetails } from '../features/services/ServiceDetails';

/**
 * Envuelve el componente de detalles de servicio.  Se separa en su
 * propia página para mantener las rutas claras en el enrutador.
 */
const ServiceDetailsPage: React.FC = () => {
  return <ServiceDetails />;
};

export default ServiceDetailsPage;