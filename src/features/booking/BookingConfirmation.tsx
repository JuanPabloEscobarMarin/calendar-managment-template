import React from "react";
import { useParams, Link } from "react-router-dom";
import { useBookings } from "../../hooks/useBookings";
import { useConfig } from "../../contexts/ConfigContext";
import { Breadcrumbs } from "../../components/Breadcrumbs";

/**
 * Muestra la confirmación de una reserva.  Recupera la reserva por su
 * identificador y presenta un resumen al usuario.  Si la reserva no se
 * encuentra (por ejemplo, al recargar con un ID inválido), se muestra
 * un mensaje apropiado.
 */
export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookingById } = useBookings();
  const { services } = useConfig();
  const booking = id ? getBookingById(id) : undefined;
  const service = booking
    ? services.find((s) => s.id === booking.serviceId)
    : undefined;

  if (!booking || !service) {
    return (
      <div className="max-w-xl mx-auto text-center p-6 bg-white rounded shadow">
        <p className="text-lg font-semibold mb-4">Reserva no encontrada</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const crumbs = [
    { label: "Inicio", to: "/" },
    { label: "Reserva confirmada" },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <Breadcrumbs crumbs={crumbs} />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ¡Reserva confirmada!
      </h2>
      <p className="mb-2">
        Gracias, <span className="font-medium">{booking.name}</span>. Tu cita
        para el servicio de
        <span className="font-medium"> {service.name}</span> ha sido programada.
      </p>
      <p className="mb-1">
        Fecha y hora: {new Date(booking.dateTime).toLocaleString()}
      </p>
      <p className="mb-1">Número de sesiones: {booking.sessions ?? 1}</p>
      <p className="mb-6">
        Te contactaremos al teléfono {booking.phone} si es necesario.
      </p>
      <Link
        to="/services"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        Reservar otro servicio
      </Link>
    </div>
  );
};
