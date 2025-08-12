import React from "react";
import { useParams, Link } from "react-router-dom";
import { useBookings } from "../../hooks/useBookings";
import { useConfig } from "../../contexts/ConfigContext";
import { Breadcrumbs } from "../../components/Breadcrumbs";

/**
 * Confirmación de reserva:
 * - Si es una reserva de 1 sesión: muestra el resumen normal.
 * - Si pertenece a una serie (seriesId): muestra, además, el listado de TODAS las sesiones de esa serie.
 */
export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookingById, bookings } = useBookings();
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

  // Detectar serie (multi-sesión)
  const isSeries = Boolean(
    (booking as any).seriesId &&
      (booking as any).totalSessions &&
      (booking as any).totalSessions > 1
  );
  const seriesId = (booking as any).seriesId as string | undefined;

  // Si es serie, recolectar TODAS las sesiones de esa serie y ordenarlas por sessionIndex o fecha
  const seriesBookings =
    isSeries && seriesId
      ? bookings
          .filter((b) => (b as any).seriesId === seriesId)
          .sort((a, b) => {
            const ai = (a as any).sessionIndex ?? 0;
            const bi = (b as any).sessionIndex ?? 0;
            if (ai && bi) return ai - bi;
            // fallback por fecha
            return (
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          })
      : [];

  // Totales estimados (precio por sesión * total de sesiones)
  const totalSessions = (booking as any).totalSessions ?? 1;
  const pricePerSession = service.price ?? 0;
  const totalEstimated = pricePerSession * totalSessions;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <Breadcrumbs crumbs={crumbs} />

      <h2 className="text-xl font-semibold text-gray-800">
        ¡Reserva confirmada!
      </h2>

      <div className="space-y-1">
        <p>
          Gracias, <span className="font-medium">{booking.name}</span>. Tu cita
          para el servicio de{" "}
          <span className="font-medium">{service.name}</span> ha sido
          programada.
        </p>

        <p>Fecha y hora: {new Date(booking.dateTime).toLocaleString()}</p>

        {(booking as any).totalSessions && (booking as any).sessionIndex ? (
          <p>
            Sesión {(booking as any).sessionIndex} de{" "}
            {(booking as any).totalSessions}
          </p>
        ) : (
          <p>Sesión única</p>
        )}

        <p>Te contactaremos al teléfono {booking.phone} si es necesario.</p>
      </div>

      {/* Si hay serie, mostrar el resumen completo */}
      {isSeries && seriesBookings.length > 0 && (
        <div className="mt-4 border rounded-lg">
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
            <div className="font-semibold text-gray-800">Resumen</div>
            <div className="text-sm text-gray-600">
              {totalSessions} {totalSessions === 1 ? "sesión" : "sesiones"} ·{" "}
              Precio por sesión: ${pricePerSession.toLocaleString()} · Total: $
              {totalEstimated.toLocaleString()}
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">Fecha y hora</th>
                    <th className="px-2 py-2">Servicio</th>
                    <th className="px-2 py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {seriesBookings.map((b) => {
                    const svc = services.find((s) => s.id === b.serviceId);
                    const idx = (b as any).sessionIndex ?? undefined;
                    const dur =
                      (b as any).durationMinutes ?? svc?.durationMinutes;
                    return (
                      <tr key={b.id} className="border-t last:border-b-0">
                        <td className="px-2 py-2">{idx ?? "-"}</td>
                        <td className="px-2 py-2">
                          {new Date(b.dateTime).toLocaleString()}
                        </td>
                        <td className="px-2 py-2">{svc?.name ?? "Servicio"}</td>
                        <td className="px-2 py-2">
                          {dur ? `${dur} min` : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Nota útil */}
            <p className="mt-3 text-xs text-gray-500">
              Si necesitas reprogramar alguna sesión, por favor ponte en
              contacto con nosotros.
            </p>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Link
          to="/services"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          Reservar otro servicio
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
