import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConfig } from "../../contexts/ConfigContext";
import { useBookings } from "../../hooks/useBookings";
import {
  generateDaySlots,
  filterAvailableSlots,
  toIsoDate,
  combineDateAndHmToISO,
} from "../../utils/scheduling";
import type { Booking } from "../../types";

// Util para comparar instantes
const isoToDate = (iso: string) => new Date(iso);

export const BookingForm: React.FC = () => {
  const { services, workingHours } = useConfig();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("serviceId");
  const [serviceId, setServiceId] = useState<string>(
    preselected ?? services[0]?.id ?? ""
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Estado del "wizard" de sesiones
  // Cada sesión tiene su propia fecha y slot
  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );
  const sessionsCount = selectedService?.sessionsCount ?? 1;

  // Un array con N sesiones. Cada item: { dateIso, slot } (ambos string; slot 'HH:MM')
  const [sessionPicks, setSessionPicks] = useState<
    { dateIso: string; slot: string }[]
  >([]);

  // índice de la sesión que se está editando (0-based)
  const [stepIdx, setStepIdx] = useState(0);

  // Inicializa array al cambiar de servicio
  useEffect(() => {
    const today = toIsoDate(new Date());
    setSessionPicks(
      Array.from({ length: sessionsCount }).map(() => ({
        dateIso: today,
        slot: "",
      }))
    );
    setStepIdx(0);
  }, [sessionsCount]);

  // Bookings existentes para filtrar solapes
  const { bookings, addBooking } = useBookings();

  // Slots base para el día actual del paso
  const dateIsoForStep =
    sessionPicks[stepIdx]?.dateIso ?? toIsoDate(new Date());
  const baseSlots = useMemo(
    () =>
      generateDaySlots(new Date(dateIsoForStep + "T00:00:00"), workingHours),
    [dateIsoForStep, workingHours]
  );

  // Bookings existentes en ese día
  const dayBookings = useMemo(
    () => bookings.filter((b) => b.dateTime.startsWith(dateIsoForStep)),
    [bookings, dateIsoForStep]
  );

  // Construye "bloqueos" temporales a partir de sesiones ya elegidas en otras fechas
  // para evitar solapes contigo mismo si coinciden en el mismo día
  const tentativeAsBookings = useMemo(() => {
    // Transformamos picks (excepto el paso actual) en objetos tipo Booking para pasarlos a filterAvailableSlots
    const arr: Booking[] = [];
    sessionPicks.forEach((pick, idx) => {
      if (idx === stepIdx || !selectedService || !pick.slot || !pick.dateIso)
        return;
      // Si son del mismo día que estoy editando, bloquean
      if (pick.dateIso === dateIsoForStep) {
        const startIso = combineDateAndHmToISO(pick.dateIso, pick.slot);
        arr.push({
          // campos mínimos usados por filterAvailableSlots
          id: `tmp-${idx}`,
          serviceId: selectedService.id,
          name: name || "tmp",
          phone: phone || "tmp",
          dateTime: startIso,
          durationMinutes: selectedService.durationMinutes,
          // extras
          seriesId: "tmp",
          sessionIndex: idx + 1,
          totalSessions: sessionsCount,
        } as Booking);
      }
    });
    return arr;
  }, [
    sessionPicks,
    stepIdx,
    selectedService,
    dateIsoForStep,
    name,
    phone,
    sessionsCount,
  ]);

  // Filtra slots disponibles del día actual del paso, considerando:
  // - reservas ya existentes (dayBookings)
  // - sesiones propias ya seleccionadas ese mismo día (tentativeAsBookings)
  const availableSlotsRaw = useMemo(() => {
    if (!selectedService) return [];
    return filterAvailableSlots({
      dateIso: dateIsoForStep,
      slots: baseSlots,
      service: selectedService,
      wh: workingHours,
      existing: [...dayBookings, ...tentativeAsBookings],
    });
  }, [
    baseSlots,
    selectedService,
    workingHours,
    dayBookings,
    dateIsoForStep,
    tentativeAsBookings,
  ]);

  // Regla: la sesión k (k>1) no puede ser antes que la k-1
  const availableSlots = useMemo(() => {
    if (stepIdx === 0) return availableSlotsRaw;
    // Construimos ISO del fin mínimo permitido = inicio de la sesión previa
    const prev = sessionPicks[stepIdx - 1];
    if (!prev?.slot || !prev?.dateIso) return availableSlotsRaw;

    const minIso = combineDateAndHmToISO(prev.dateIso, prev.slot);
    const filtered = availableSlotsRaw.filter((hhmm) => {
      const candidateIso = combineDateAndHmToISO(dateIsoForStep, hhmm);
      return isoToDate(candidateIso).getTime() >= isoToDate(minIso).getTime();
    });
    return filtered;
  }, [availableSlotsRaw, stepIdx, sessionPicks, dateIsoForStep]);

  // Handlers para el paso actual
  const setPick = (patch: Partial<{ dateIso: string; slot: string }>) => {
    setSessionPicks((prev) => {
      const copy = prev.slice();
      copy[stepIdx] = { ...copy[stepIdx], ...patch };
      return copy;
    });
  };

  const goNext = () => {
    if (stepIdx < sessionsCount - 1) setStepIdx((i) => i + 1);
  };
  const goPrev = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  // Reset slot si ya no es válido tras cambiar fecha
  useEffect(() => {
    const pick = sessionPicks[stepIdx];
    if (pick?.slot && !availableSlots.includes(pick.slot)) {
      setPick({ slot: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSlots]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !name || !phone) {
      alert("Completa los campos obligatorios");
      return;
    }
    // Validar que todas las sesiones tengan fecha y slot
    for (let i = 0; i < sessionsCount; i++) {
      const p = sessionPicks[i];
      if (!p?.dateIso || !p?.slot) {
        alert(`Selecciona fecha y hora para la sesión ${i + 1}`);
        return;
      }
    }
    // Validar orden cronológico (por si el usuario cambió fechas luego)
    for (let i = 1; i < sessionsCount; i++) {
      const prevIso = combineDateAndHmToISO(
        sessionPicks[i - 1].dateIso,
        sessionPicks[i - 1].slot
      );
      const currIso = combineDateAndHmToISO(
        sessionPicks[i].dateIso,
        sessionPicks[i].slot
      );
      if (isoToDate(currIso) < isoToDate(prevIso)) {
        alert(`La sesión ${i + 1} no puede ser antes que la sesión ${i}`);
        return;
      }
    }

    // Crear una serie de reservas (1 por sesión)
    const seriesId = `series-${Date.now()}`;
    const payloads: Omit<Booking, "id">[] = sessionPicks.map((p, idx) => {
      const startIso = combineDateAndHmToISO(p.dateIso, p.slot);
      return {
        serviceId,
        name,
        phone,
        dateTime: startIso,
        durationMinutes: selectedService.durationMinutes,
        // campos de serie
        seriesId,
        sessionIndex: idx + 1,
        totalSessions: sessionsCount,
      };
    });

    // Insertar una por una (o Promise.all si tu API lo soporta)
    const created = [];
    for (const pl of payloads) {
      const saved = await addBooking(pl);
      created.push(saved);
    }

    // Navegar a la confirmación (puedes crear una pantalla por series)
    // Por ahora, mostramos la confirmación de la primera
    navigate(`/booking/confirmation/${created[0].id}`);
  };

  // --- UI ---
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md space-y-4"
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
              ({selectedService.duration}) · {selectedService.sessionsCount}{" "}
              {selectedService.sessionsCount === 1 ? "sesión" : "sesiones"}
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
                {s.name} ({s.duration}) · {s.sessionsCount}{" "}
                {s.sessionsCount === 1 ? "sesión" : "sesiones"}
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

      {/* Indicador de pasos (sesiones) */}
      {sessionsCount > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          {Array.from({ length: sessionsCount }).map((_, i) => {
            const picked = sessionPicks[i]?.slot && sessionPicks[i]?.dateIso;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setStepIdx(i)}
                className={
                  "text-xs px-2 py-1 rounded border " +
                  (i === stepIdx
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : picked
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300")
                }
                title={
                  picked
                    ? `${sessionPicks[i].dateIso} ${sessionPicks[i].slot}`
                    : "Sin seleccionar"
                }
              >
                Sesión {i + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Controles de fecha + slots para el paso actual */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha (sesión {stepIdx + 1})
          </label>
          <input
            id="date"
            type="date"
            value={sessionPicks[stepIdx]?.dateIso || toIsoDate(new Date())}
            onChange={(e) => setPick({ dateIso: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horarios disponibles{" "}
            {selectedService ? `(${selectedService.duration})` : ""}
          </label>
          {availableSlots.length ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((hhmm) => {
                const selected = sessionPicks[stepIdx]?.slot === hhmm;
                return (
                  <button
                    type="button"
                    key={hhmm}
                    onClick={() => setPick({ slot: hhmm })}
                    className={
                      "px-3 py-2 text-sm rounded border " +
                      (selected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300")
                    }
                  >
                    {hhmm}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No hay horarios disponibles para esta fecha.
            </p>
          )}
        </div>
      </div>

      {/* Navegación del wizard */}
      {sessionsCount > 1 && (
        <div className="flex justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIdx === 0}
            className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={
              stepIdx >= sessionsCount - 1 ||
              !sessionPicks[stepIdx]?.slot ||
              !sessionPicks[stepIdx]?.dateIso
            }
            className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={sessionPicks.some((p) => !p.slot || !p.dateIso)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Confirmar{" "}
          {sessionsCount === 1 ? "reserva" : `las ${sessionsCount} reservas`}
        </button>
      </div>
    </form>
  );
};
