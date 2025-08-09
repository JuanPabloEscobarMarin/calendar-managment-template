import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvaluation } from '../../hooks/useEvaluation';
import { useConfig } from '../../contexts/ConfigContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

/**
 * Muestra la confirmación de una solicitud de valoración.  Recupera
 * la solicitud por su identificador y presenta un mensaje al cliente.
 */
export const EvaluationConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEvaluationById } = useEvaluation();
  const { services } = useConfig();
  const evaluation = id ? getEvaluationById(id) : undefined;
  const service = evaluation ? services.find((s) => s.id === evaluation.serviceId) : undefined;

  if (!evaluation || !service) {
    return (
      <div className="max-w-xl mx-auto text-center p-6 bg-white rounded shadow">
        <p className="text-lg font-semibold mb-4">Solicitud no encontrada</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const crumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Valoración confirmada' },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <Breadcrumbs crumbs={crumbs} />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">¡Valoración solicitada!</h2>
      <p className="mb-2">
        Gracias, <span className="font-medium">{evaluation.name}</span>. Tu solicitud de valoración para el servicio de
        <span className="font-medium"> {service.name}</span> ha sido registrada.
      </p>
      {evaluation.evaluationType === 'presencial' ? (
        <p className="mb-4">Nos veremos el {new Date(evaluation.dateTime || '').toLocaleString()} para tu valoración.</p>
      ) : (
        <p className="mb-4">Nuestro especialista revisará tus fotos y se pondrá en contacto contigo pronto.</p>
      )}
      <p className="mb-6">Te contactaremos al teléfono {evaluation.phone} para cualquier confirmación.</p>
      <Link
        to="/services"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        Solicitar otro servicio
      </Link>
    </div>
  );
};