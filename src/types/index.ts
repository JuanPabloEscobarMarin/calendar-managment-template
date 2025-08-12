/**
 * Tipos compartidos en toda la aplicación.  Se incluyen definiciones
 * para reservas, valoraciones y opiniones.  Estos tipos ayudan a
 * mantener la coherencia en los componentes y funciones que utilizan
 * estos datos.
 */

/** Representa una reserva realizada por un cliente. */
export interface Booking {
  id: string;
  serviceId: string;
  name: string;
  phone: string;
  /** Fecha y hora seleccionadas en ISO 8601 (ej. "2025-08-15T14:30") */
  dateTime: string;
  /** Duración del servicio en minutos; opcional para facilitar comprobaciones del servidor */
  durationMinutes?: number;
  seriesId?: string; // ID de la serie de sesiones, si aplica
  sessionIndex?: number; // Índice de la sesión en la serie, si aplica
  totalSessions?: number; // Total de sesiones en la serie, si aplica
}

/** Representa una solicitud de valoración o diagnóstico. */
export interface Evaluation {
  id: string;
  serviceId: string;
  name: string;
  phone: string;
  /** Tipo de valoración: en línea con fotos o presencial en cabina */
  evaluationType: "online" | "presencial";
  /** Fecha y hora solicitada para valoraciones presenciales */
  dateTime?: string;
  /** Archivos de imágenes proporcionados por el cliente en valoraciones online */
  images?: File[];
  durationMinutes: 30; // Default to 30 minutes for online evaluations
}

/** Representa una opinión o reseña dejada por un cliente. */
export interface Review {
  id: string;
  name: string;
  rating: number; // entero entre 1 y 5
  comment: string;
  date: string; // fecha ISO
}
