import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConfig } from "../../contexts/ConfigContext";
import { useBookings } from "../../hooks/useBookings";
import {
  generateDaySlots,
  filterAvailableSlots,
  toIsoDate,
} from "../../utils/scheduling";
import type { Booking } from "../../types";

export const BookingForm: React.FC = () => {
  const { services, workingHours } = useConfig();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("serviceId");
  const [serviceId, setServiceId] = useState<string>(
    preselected ?? services[0]?.id ?? ""
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateIso, setDateIso] = useState<string>(toIsoDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [sessions, setSessions] = useState(1);
  const { bookings, addBooking } = useBookings();
  const navigate = useNavigate();

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  // Build slots for selected day
  const baseSlots = useMemo(
    () => generateDaySlots(new Date(dateIso + "T00:00:00"), workingHours),
    [dateIso, workingHours]
  );

  // Filter by overlaps
  const dayBookings = useMemo(
    () => bookings.filter((b) => b.dateTime.startsWith(dateIso)),
    [bookings, dateIso]
  );

  const availableSlots = useMemo(() => {
    if (!selectedService) return [];
    return filterAvailableSlots({
      dateIso,
      slots: baseSlots,
      service: selectedService,
      wh: workingHours,
      existing: dayBookings,
    });
  }, [baseSlots, selectedService, workingHours, dayBookings, dateIso]);

  // Reset slot if it becomes invalid after changes
  useEffect(() => {
    if (selectedSlot && !availableSlots.includes(selectedSlot)) {
      setSelectedSlot("");
    }
  }, [availableSlots, selectedSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !serviceId ||
      !name ||
      !phone ||
      !dateIso ||
      !selectedSlot ||
      !selectedService
    ) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    const startIso = new Date(
      dateIso + "T" + selectedSlot + ":00"
    ).toISOString();
    const payload: Omit<Booking, "id"> = {
      serviceId,
      name,
      phone,
      dateTime: startIso,
      sessions,
      durationMinutes: selectedService.durationMinutes,
    };
    const newBooking = await addBooking(payload);
    navigate(`/booking/confirmation/${newBooking.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Reservar cita</h2>

      {/* Servicio */}
      {preselected && selectedService ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio
          </label>
          <p className="text-gray-800">
            {selectedService.name}{" "}
            <span className="text-xs text-gray-500">
              ({selectedService.duration})
            </span>
          </p>
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
                {s.name} ({s.duration})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Datos del cliente */}
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

      {/* Fecha */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Fecha
        </label>
        <input
          id="date"
          type="date"
          value={dateIso}
          onChange={(e) => setDateIso(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {/* TODO: Puedes deshabilitar días no laborables con un datepicker más avanzado */}
      </div>

      {/* Slots disponibles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horarios disponibles{" "}
          {selectedService ? `(${selectedService.duration})` : ""}
        </label>
        {availableSlots.length ? (
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((hhmm) => (
              <button
                type="button"
                key={hhmm}
                onClick={() => setSelectedSlot(hhmm)}
                className={
                  "px-3 py-2 text-sm rounded border " +
                  (selectedSlot === hhmm
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300")
                }
              >
                {hhmm}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hay horarios disponibles para esta fecha. Prueba otra.
          </p>
        )}
      </div>

      {/* Sesiones */}
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
          disabled={!selectedSlot}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Confirmar reserva
        </button>
      </div>
    </form>
  );
};
