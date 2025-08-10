import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConfig } from "../../contexts/ConfigContext";
import { useEvaluation } from "../../hooks/useEvaluation";
import {
  generateDaySlots,
  filterAvailableSlots,
  toIsoDate,
} from "../../utils/scheduling";
import type { Evaluation } from "../../types";
import { useBookings } from "../../hooks/useBookings";

export const EvaluationForm: React.FC = () => {
  const { services, workingHours } = useConfig();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("serviceId");
  const [serviceId, setServiceId] = useState<string>(
    preselected ?? services[0]?.id ?? ""
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [evaluationType, setEvaluationType] = useState<"online" | "presencial">(
    "online"
  );
  const [dateIso, setDateIso] = useState<string>(toIsoDate(new Date()));
  const [slot, setSlot] = useState<string>("");
  const { addEvaluation } = useEvaluation();
  const { bookings } = useBookings(); // para evitar solapes si comparten recurso
  const navigate = useNavigate();

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  const baseSlots = useMemo(
    () => generateDaySlots(new Date(dateIso + "T00:00:00"), workingHours),
    [dateIso, workingHours]
  );

  const dayBookings = useMemo(
    () => bookings.filter((b) => b.dateTime.startsWith(dateIso)),
    [bookings, dateIso]
  );

  // Para valoraciones presenciales, usa una duración por defecto (30 min) o la del servicio si aplica
  const evalDuration = selectedService?.durationMinutes
    ? Math.min(selectedService.durationMinutes, 60)
    : 30;

  const availableSlots = useMemo(() => {
    if (evaluationType !== "presencial") return [];
    // Mapeamos un servicio temporal con la duración de evaluación
    const tempService = {
      ...(selectedService || { durationMinutes: evalDuration }),
      durationMinutes: evalDuration,
    } as any;
    return filterAvailableSlots({
      dateIso,
      slots: baseSlots,
      service: tempService,
      wh: workingHours,
      existing: dayBookings,
    });
  }, [
    evaluationType,
    baseSlots,
    selectedService,
    workingHours,
    dayBookings,
    dateIso,
    evalDuration,
  ]);

  useEffect(() => {
    if (slot && !availableSlots.includes(slot)) setSlot("");
  }, [availableSlots, slot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !serviceId) {
      alert("Completa los campos obligatorios");
      return;
    }
    if (evaluationType === "presencial" && !slot) {
      alert("Selecciona fecha y hora para la valoración presencial");
      return;
    }

    const payload: Omit<Evaluation, "id"> = {
      serviceId,
      name,
      phone,
      evaluationType,
      dateTime:
        evaluationType === "presencial"
          ? new Date(dateIso + "T" + slot + ":00").toISOString()
          : undefined,
      durationMinutes: 30,
    };

    const newEval = await addEvaluation(payload as any);
    navigate(`/evaluation/confirmation/${newEval.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Solicitar valoración
      </h2>

      {/* Servicio */}
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
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="service"
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

      {/* Datos cliente */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="name"
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
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="phone"
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

      {/* Tipo valoración */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de valoración
        </label>
        <div className="mt-1 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="evaluationType"
              value="online"
              checked={evaluationType === "online"}
              onChange={() => setEvaluationType("online")}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">En línea</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="evaluationType"
              value="presencial"
              checked={evaluationType === "presencial"}
              onChange={() => setEvaluationType("presencial")}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Presencial</span>
          </label>
        </div>
      </div>

      {/* Fecha + slots solo si presencial */}
      {evaluationType === "presencial" && (
        <>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horarios disponibles (~{evalDuration} min)
            </label>
            {availableSlots.length ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((hhmm) => (
                  <button
                    type="button"
                    key={hhmm}
                    onClick={() => setSlot(hhmm)}
                    className={
                      "px-3 py-2 text-sm rounded border " +
                      (slot === hhmm
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
                No hay horarios disponibles para esta fecha.
              </p>
            )}
          </div>
        </>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Enviar solicitud
        </button>
      </div>
    </form>
  );
};
