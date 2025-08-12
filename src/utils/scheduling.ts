import type { WorkingHours, Service } from "../config/appConfig";

/** Parse 'HH:MM' => minutes since 00:00 */
export function parseHmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

/** minutes since 00:00 => 'HH:MM' */
export function minutesToHm(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Return YYYY-MM-DD in local TZ for a given Date */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Is the given date (local) a working day and not a holiday */
export function isWorkingDate(date: Date, wh: WorkingHours): boolean {
  const dow = date.getDay() === 0 ? 7 : date.getDay();
  const okDow = wh.workingDays.includes(dow);
  const iso = toIsoDate(date);
  const notHoliday = !wh.holidays.includes(iso);
  return okDow && notHoliday;
}

/** Build all aligned slots for a given date */
export function generateDaySlots(date: Date, wh: WorkingHours): string[] {
  if (!isWorkingDate(date, wh)) return [];

  const startM = parseHmToMinutes(wh.start);
  const endM = parseHmToMinutes(wh.end);
  const step = wh.slotMinutes;

  const slots: string[] = [];
  for (let t = startM; t + step <= endM; t += step) {
    slots.push(minutesToHm(t));
  }
  return slots;
}

/** Combine selected date 'YYYY-MM-DD' and 'HH:MM' into ISO string */
export function combineDateAndHmToISO(dateIso: string, hhmm: string): string {
  // Build local date
  const [y, mo, d] = dateIso.split("-").map((x) => parseInt(x, 10));
  const [h, mi] = hhmm.split(":").map((x) => parseInt(x, 10));
  const dt = new Date(y, mo - 1, d, h, mi, 0, 0);
  return dt.toISOString();
}

/** Helpers locales para armar fechas del día laboral */
function dateFromIsoAndHmLocal(dateIso: string, hhmm: string): Date {
  const [y, mo, d] = dateIso.split("-").map((x) => parseInt(x, 10));
  const [h, mi] = hhmm.split(":").map((x) => parseInt(x, 10));
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}
function workDayEdge(dateIso: string, hm: string): Date {
  return dateFromIsoAndHmLocal(dateIso, hm);
}

/**
 * Filtra slots por minLeadMinutes y evita solapes con EXISTENTES (reservas y/o valoraciones).
 * IMPORTANTE: `existing` acepta cualquier elemento con { dateTime, durationMinutes? }.
 * Así puedes pasar bookings y valoraciones juntas.
 */
export function filterAvailableSlots(params: {
  dateIso: string;
  slots: string[];
  service: Service;
  wh: WorkingHours;
  existing: Array<{ dateTime: string; durationMinutes?: number }>;
}): string[] {
  const { dateIso, slots, service, wh, existing } = params;

  // No mostrar slots antes del "lead" mínimo
  const leadLimit = new Date(Date.now() + wh.minLeadMinutes * 60 * 1000);

  // Aseguramos que el bloque completo del servicio quepa en la jornada
  const workStart = workDayEdge(dateIso, wh.start);
  const workEnd = workDayEdge(dateIso, wh.end);

  // Proyectar EXISTENTES (bookings/valoraciones) del mismo día a [bStart, bEnd)
  const existingWindows = existing
    .filter((x) => toIsoDate(new Date(x.dateTime)) === dateIso)
    .map((x) => {
      const bStart = new Date(x.dateTime);
      const durMin = Math.max(
        1,
        x.durationMinutes ?? service.durationMinutes ?? wh.slotMinutes
      );
      const bEnd = new Date(bStart.getTime() + durMin * 60 * 1000);
      return { bStart, bEnd };
    });

  return slots.filter((hhmm) => {
    // Inicio y fin del slot solicitado para el servicio seleccionado
    const start = dateFromIsoAndHmLocal(dateIso, hhmm);
    if (start < leadLimit) return false;

    const durMin = Math.max(1, service.durationMinutes);
    const end = new Date(start.getTime() + durMin * 60 * 1000);

    // Debe caber COMPLETO dentro del horario laboral
    if (start < workStart || end > workEnd) return false;

    // No debe solaparse con ninguna ventana existente [start, end)
    const collide = existingWindows.some(
      ({ bStart, bEnd }) => start < bEnd && bStart < end
    );
    return !collide;
  });
}
