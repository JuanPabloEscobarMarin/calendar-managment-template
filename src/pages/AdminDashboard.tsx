import React from 'react';
import { useBookings } from '../hooks/useBookings';
import { useEvaluation } from '../hooks/useEvaluation';
import { useConfig } from '../contexts/ConfigContext';

/**
 * Panel de administración.  Presenta las reservas y solicitudes de
 * valoración registradas, permitiendo al negocio revisarlas.  En esta
 * plantilla el panel es solo de lectura, pero se puede ampliar con
 * funciones para modificar la disponibilidad, cambiar citas o marcar
 * como atendidas.
 */
const AdminDashboard: React.FC = () => {
  const { bookings } = useBookings();
  const { evaluations } = useEvaluation();
  const { services } = useConfig();

  const getServiceName = (serviceId: string) => services.find((s) => s.id === serviceId)?.name || '';

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reservas</h2>
        {bookings.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-2 text-sm text-gray-600">Servicio</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Cliente</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Teléfono</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Fecha y hora</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Sesiones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-none">
                    <td className="px-4 py-2 text-sm">{getServiceName(b.serviceId)}</td>
                    <td className="px-4 py-2 text-sm">{b.name}</td>
                    <td className="px-4 py-2 text-sm">{b.phone}</td>
                    <td className="px-4 py-2 text-sm">{new Date(b.dateTime).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{b.sessions ?? 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay reservas registradas.</p>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Valoraciones</h2>
        {evaluations.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-2 text-sm text-gray-600">Servicio</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Cliente</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Teléfono</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Tipo</th>
                  <th className="px-4 py-2 text-sm text-gray-600">Fecha/Hora</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((ev) => (
                  <tr key={ev.id} className="border-b last:border-none">
                    <td className="px-4 py-2 text-sm">{getServiceName(ev.serviceId)}</td>
                    <td className="px-4 py-2 text-sm">{ev.name}</td>
                    <td className="px-4 py-2 text-sm">{ev.phone}</td>
                    <td className="px-4 py-2 text-sm capitalize">{ev.evaluationType}</td>
                    <td className="px-4 py-2 text-sm">
                      {ev.evaluationType === 'presencial' && ev.dateTime
                        ? new Date(ev.dateTime).toLocaleString()
                        : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay valoraciones registradas.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;