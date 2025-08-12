import React, { useEffect, useMemo, useState } from "react";
import { useBookings } from "../hooks/useBookings";
import { useEvaluation } from "../hooks/useEvaluation";
import { useConfig } from "../contexts/ConfigContext";
import { toIsoDate, parseHmToMinutes, minutesToHm } from "../utils/scheduling";

// Evento normalizado para pintar timeline y KPIs
interface CalendarItem {
  id: string;
  kind: "booking" | "evaluation";
  start: string; // ISO
  end: string; // ISO
  serviceId: string;
  serviceName: string;
  price: number; // 0 si valoración sin cargo
  client: string;
  phone: string;
  createdAt?: string; // opcional
}

function fmtHm(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}
function isSameIsoDay(iso: string, dayIso: string) {
  return iso.startsWith(dayIso);
}

// Devuelve [lunes, domingo] de la semana de una fecha ISO (YYYY-MM-DD)
function getWeekRangeFromIso(dayIso: string): [string, string] {
  const [y, m, d] = dayIso.split("-").map((x) => parseInt(x, 10));
  const base = new Date(y, m - 1, d);
  const wd = base.getDay(); // 0..6 (Sun..Sat)
  const diffToMon = (wd + 6) % 7; // lunes=0
  const monday = new Date(base);
  monday.setDate(base.getDate() - diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [toIsoDate(monday), toIsoDate(sunday)];
}

export default function AdminDashboard() {
  const { bookings } = useBookings();
  const { evaluations } = useEvaluation();
  const config = useConfig();
  const { services, workingHours } = config;
  const currency = (config as any).currency ?? "COP";

  const [selectedDateIso, setSelectedDateIso] = useState<string>(
    toIsoDate(new Date())
  );
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Mapa servicios
  const svcMap = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services]
  );

  // Normalizar bookings
  const bookingItems: CalendarItem[] = useMemo(
    () =>
      bookings.map((b) => {
        const svc = svcMap.get(b.serviceId);
        const dur =
          (b as any).durationMinutes ??
          svc?.durationMinutes ??
          workingHours.slotMinutes;

        const start = new Date(b.dateTime);
        const end = new Date(start.getTime() + dur * 60 * 1000);

        return {
          id: b.id,
          kind: "booking",
          start: start.toISOString(),
          end: end.toISOString(),
          serviceId: b.serviceId,
          serviceName: svc?.name ?? "Servicio",
          // 👇 precio por sesión (no multiplicar por sessions)
          price: Math.round(svc?.price ?? 0),
          client: b.name,
          phone: b.phone,
          createdAt: (b as any).created_at,
          // (opcional) si guardas serie:
          // seriesId: (b as any).seriesId,
          // sessionIndex: (b as any).sessionIndex,
          // totalSessions: (b as any).totalSessions,
        };
      }),
    [bookings, svcMap, workingHours.slotMinutes]
  );

  // Normalizar valoraciones presenciales (30 min)
  const evalItems: CalendarItem[] = useMemo(
    () =>
      evaluations
        .filter((ev) => ev.evaluationType === "presencial" && ev.dateTime)
        .map((ev) => {
          const svc = svcMap.get(ev.serviceId);
          const dur = 30;
          const start = new Date(ev.dateTime!);
          const end = new Date(start.getTime() + dur * 60 * 1000);
          return {
            id: ev.id,
            kind: "evaluation",
            start: start.toISOString(),
            end: end.toISOString(),
            serviceId: ev.serviceId,
            serviceName: svc?.name ?? "Servicio",
            price: 0,
            client: ev.name,
            phone: ev.phone,
            createdAt: (ev as any).created_at,
          };
        }),
    [evaluations, svcMap]
  );

  const allItems = useMemo(
    () => [...bookingItems, ...evalItems],
    [bookingItems, evalItems]
  );

  // Día seleccionado
  const dayItems = useMemo(
    () => allItems.filter((i) => isSameIsoDay(i.start, selectedDateIso)),
    [allItems, selectedDateIso]
  );

  // --- KPIs del día seleccionado ---
  const totalEventsSelectedDay = dayItems.length;
  const expectedRevenueSelectedDay = useMemo(
    () =>
      dayItems.reduce(
        (acc, it) => acc + (it.kind === "booking" ? it.price : 0),
        0
      ),
    [dayItems]
  );
  const minutesOpenSelectedDay = useMemo(() => {
    const s = parseHmToMinutes(workingHours.start);
    const e = parseHmToMinutes(workingHours.end);
    return Math.max(0, e - s);
  }, [workingHours]);
  const minutesBusySelectedDay = useMemo(
    () =>
      dayItems.reduce(
        (acc, it) =>
          acc +
          (new Date(it.end).getTime() - new Date(it.start).getTime()) / 60000,
        0
      ),
    [dayItems]
  );
  const occupancySelectedDay = minutesOpenSelectedDay
    ? Math.min(
        100,
        Math.round((minutesBusySelectedDay / minutesOpenSelectedDay) * 100)
      )
    : 0;

  // KPIs semana/mes (se mantienen)
  function getWeekRange(d = new Date()) {
    const wd = d.getDay();
    const diff = (wd + 6) % 7;
    const mon = new Date(d);
    mon.setDate(d.getDate() - diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return [toIsoDate(mon), toIsoDate(sun)];
  }
  function inIsoRange(iso: string, a: string, b: string) {
    const wd = iso.slice(0, 10);
    return wd >= a && wd <= b;
  }
  const [weekStart, weekEnd] = getWeekRange();
  const expectedRevenueWeek = useMemo(
    () =>
      bookingItems
        .filter((b) => inIsoRange(b.start, weekStart, weekEnd))
        .reduce((acc, b) => acc + b.price, 0),
    [bookingItems, weekStart, weekEnd]
  );
  const todayIso = toIsoDate(new Date());
  const monthPrefix = todayIso.slice(0, 7);
  const expectedRevenueMonth = useMemo(
    () =>
      bookingItems
        .filter((b) => b.start.startsWith(monthPrefix))
        .reduce((acc, b) => acc + b.price, 0),
    [bookingItems, monthPrefix]
  );

  // --- Semana del día seleccionado (lunes a domingo) ---
  const [selWeekStart, selWeekEnd] = getWeekRangeFromIso(selectedDateIso);
  const selWeekDays: string[] = useMemo(() => {
    const days: string[] = [];
    const [y, m, d] = selWeekStart.split("-").map((n) => parseInt(n, 10));
    const start = new Date(y, m - 1, d);
    for (let i = 0; i < 7; i++) {
      const dt = new Date(start);
      dt.setDate(start.getDate() + i);
      days.push(toIsoDate(dt));
    }
    return days;
  }, [selWeekStart]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    selWeekDays.forEach((di) => map.set(di, []));
    for (const it of allItems) {
      const di = it.start.slice(0, 10);
      if (map.has(di)) map.get(di)!.push(it);
    }
    // ordenar cada día por hora
    for (const di of selWeekDays) {
      map.get(di)!.sort((a, b) => +new Date(a.start) - +new Date(b.start));
    }
    return map;
  }, [allItems, selWeekDays]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          Panel de administración
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Día:</label>
          <input
            type="date"
            value={selectedDateIso}
            onChange={(e) => setSelectedDateIso(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* KPIs del día + semana/mes */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          label="Eventos del día"
          value={totalEventsSelectedDay}
          hint={selectedDateIso}
        />
        <KpiCard
          label="Ingreso del día"
          value={formatCurrency(expectedRevenueSelectedDay, currency)}
          hint={selectedDateIso}
        />
        <KpiCard
          label="Ocupación del día"
          value={`${occupancySelectedDay}%`}
          hint={`${Math.round(
            minutesBusySelectedDay
          )} min / ${minutesOpenSelectedDay} min`}
        />
        <KpiCard
          label="Ingresos semana"
          value={formatCurrency(expectedRevenueWeek, currency)}
          hint={`${weekStart} → ${weekEnd}`}
        />
        <KpiCard
          label="Ingresos mes"
          value={formatCurrency(expectedRevenueMonth, currency)}
          hint={todayIso.slice(0, 7)}
        />
      </div>

      {/* Timeline del día */}
      <DayTimeline
        items={dayItems}
        workingStart={workingHours.start}
        workingEnd={workingHours.end}
        slotMinutes={workingHours.slotMinutes}
        selectedDateIso={selectedDateIso}
        now={now}
      />

      {/* Semana (L → D) del día seleccionado */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Semana {selWeekStart} → {selWeekEnd}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {selWeekDays.map((di) => (
            <WeekDayColumn
              key={di}
              dateIso={di}
              items={itemsByDay.get(di) ?? []}
              workingStart={workingHours.start}
              workingEnd={workingHours.end}
              slotMinutes={workingHours.slotMinutes}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800 mt-1">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function formatCurrency(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

// ---------------- TIMELINE (día) ----------------
function DayTimeline({
  items,
  workingStart,
  workingEnd,
  slotMinutes,
  selectedDateIso,
  now,
}: {
  items: CalendarItem[];
  workingStart: string;
  workingEnd: string;
  slotMinutes: number;
  selectedDateIso: string;
  now: Date;
}) {
  const sorted = [...items].sort(
    (a, b) => +new Date(a.start) - +new Date(b.start)
  );
  const startM = parseHmToMinutes(workingStart);
  const endM = parseHmToMinutes(workingEnd);
  const totalM = Math.max(1, endM - startM);

  const PX_PER_SLOT = 30; // altura por cada slot (p. ej., 30 px por 30 min)
  const PX_PER_MIN = PX_PER_SLOT / slotMinutes; // px por minuto
  const GUTTER_PX = 6; // separación fija entre bloques
  const MIN_BLOCK_PX = 60; // mínimo para legibilidad

  const containerHeight = Math.ceil(totalM * PX_PER_MIN);

  // Guías/etiquetas por hora
  const hourMarks: { label: string; top: number }[] = [];
  for (let m = startM; m <= endM; m += 60) {
    const deltaM = m - startM; // minutos desde el inicio
    const top = Math.round(deltaM * PX_PER_MIN);
    hourMarks.push({ label: minutesToHm(m), top });
  }

  // Línea de ahora (si corresponde)
  const todayIso = toIsoDate(now);
  let nowTopPx: number | null = null;
  if (selectedDateIso === todayIso) {
    const mins = now.getHours() * 60 + now.getMinutes();
    if (mins >= startM && mins <= endM) {
      nowTopPx = Math.round((mins - startM) * PX_PER_MIN);
    }
  }

  function blockRect(it: CalendarItem) {
    const s = new Date(it.start),
      e = new Date(it.end);
    const sm = s.getHours() * 60 + s.getMinutes();
    const em = e.getHours() * 60 + e.getMinutes();
    const top = Math.max(
      0,
      Math.round((sm - startM) * PX_PER_MIN) + Math.floor(GUTTER_PX / 2)
    );
    const rawHeight = Math.round((em - sm) * PX_PER_MIN) - GUTTER_PX;
    const height = Math.max(MIN_BLOCK_PX, rawHeight);
    return { top, height } as const;
  }

  return (
    <div
      className="relative border rounded-lg bg-white p-3 overflow-hidden"
      style={{ height: containerHeight }}
    >
      {hourMarks.map(({ label, top }) => (
        <div
          key={label}
          className="absolute left-0 right-0 border-t border-dashed border-gray-200"
          style={{ top }}
        >
          <span
            className="absolute -left-2 -translate-x-full text-[11px] text-gray-400 select-none"
            style={{ top: -6 }}
          >
            {label}
          </span>
        </div>
      ))}
      {nowTopPx !== null && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-rose-500"
          style={{ top: nowTopPx }}
        />
      )}
      {sorted.map((it) => {
        const { top, height } = blockRect(it);
        return (
          <div
            key={`${it.kind}-${it.id}`}
            className="absolute left-3 right-3"
            style={{ top, height }}
          >
            <div
              className={`rounded-md shadow px-3 py-2 text-white h-full flex flex-col justify-center ${
                it.kind === "booking" ? "bg-indigo-600" : "bg-emerald-600"
              }`}
              title={`${it.serviceName} — ${fmtHm(it.start)}–${fmtHm(
                it.end
              )} \n${it.client} • ${it.phone}`}
            >
              <div className="text-xs font-semibold truncate">
                {it.serviceName}
              </div>
              <div className="text-[11px] opacity-90 truncate">
                {fmtHm(it.start)}–{fmtHm(it.end)} · {it.client}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Semana: columna por día ----------------
function WeekDayColumn({
  dateIso,
  items,
  workingStart,
  workingEnd,
  slotMinutes,
}: {
  dateIso: string;
  items: CalendarItem[];
  workingStart: string;
  workingEnd: string;
  slotMinutes: number;
}) {
  const sorted = [...items].sort(
    (a, b) => +new Date(a.start) - +new Date(b.start)
  );

  const startM = parseHmToMinutes(workingStart);
  const endM = parseHmToMinutes(workingEnd);
  const totalM = Math.max(1, endM - startM);

  const PX_PER_SLOT = 18; // un poco más compacto en vista semanal
  const PX_PER_MIN = PX_PER_SLOT / slotMinutes;
  const GUTTER_PX = 6;
  const MIN_BLOCK_PX = 48; // algo menor pero legible

  const containerHeight = Math.ceil(totalM * PX_PER_MIN);

  // marcas por hora
  const hourMarks: number[] = [];
  for (let m = startM; m <= endM; m += 120) {
    // cada 2 horas para menos ruido visual
    hourMarks.push(Math.round((m - startM) * PX_PER_MIN));
  }

  function blockRect(it: CalendarItem) {
    const s = new Date(it.start),
      e = new Date(it.end);
    const sm = s.getHours() * 60 + s.getMinutes();
    const em = e.getHours() * 60 + e.getMinutes();
    const top = Math.max(
      0,
      Math.round((sm - startM) * PX_PER_MIN) + Math.floor(GUTTER_PX / 2)
    );
    const rawHeight = Math.round((em - sm) * PX_PER_MIN) - GUTTER_PX;
    const height = Math.max(MIN_BLOCK_PX, rawHeight);
    return { top, height } as const;
  }

  // Cabecera formato corto
  const d = new Date(dateIso + "T00:00:00");
  const header = d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-3 py-2 text-xs font-semibold text-gray-700 border-b flex items-center justify-between">
        <span>{header}</span>
        <span className="text-gray-400">{sorted.length}</span>
      </div>
      <div className="relative p-2" style={{ height: containerHeight }}>
        {hourMarks.map((top, idx) => (
          <div
            key={idx}
            className="absolute left-1 right-1 border-t border-dashed border-gray-200"
            style={{ top }}
          />
        ))}
        {sorted.map((it) => {
          const { top, height } = blockRect(it);
          return (
            <div
              key={`${it.kind}-${it.id}`}
              className="absolute left-1 right-1"
              style={{ top, height }}
            >
              <div
                className={`h-full rounded-md px-2 py-1 text-white text-[11px] leading-tight shadow ${
                  it.kind === "booking" ? "bg-indigo-600" : "bg-emerald-600"
                }`}
              >
                <div className="font-semibold truncate">
                  {fmtHm(it.start)} {it.serviceName}
                </div>
                <div className="opacity-90 truncate">{it.client}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
