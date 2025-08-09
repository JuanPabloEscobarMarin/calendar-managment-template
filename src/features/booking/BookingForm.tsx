import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConfig } from "../../contexts/ConfigContext";
import { useBookings } from "../../hooks/useBookings";

/**
 * Formulario para reservar una cita.  Permite seleccionar el servicio
 * (si no viene preseleccionado), introducir los datos del cliente y
 * escoger la fecha y hora deseada.  Al enviar, registra la reserva
 * mediante el hook `useBookings` y redirige a la página de
 * confirmación.
 */
export const BookingForm: React.FC = () => {
  const { services } = useConfig();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("serviceId");
  const [serviceId, setServiceId] = useState<string>(
    preselected ?? services[0]?.id ?? ""
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [sessions, setSessions] = useState(1);
  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !name || !phone || !dateTime) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    const newBooking = await addBooking({
      serviceId,
      name,
      phone,
      dateTime,
      sessions,
    });
    navigate(`/booking/confirmation/${newBooking.id}`);
  };

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Reservar cita</h2>
      {preselected && selectedService ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio
          </label>
          <p className="text-gray-800">{selectedService.name}</p>
        </div>
      ) : (
        <div>
          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Servicio
          </label>
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="dateTime"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fecha y hora
        </label>
        <input
          id="dateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="sessions"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Número de sesiones
        </label>
        <input
          id="sessions"
          type="number"
          min={1}
          value={sessions}
          onChange={(e) => setSessions(parseInt(e.target.value, 10) || 1)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Confirmar reserva
        </button>
      </div>
    </form>
  );
};
