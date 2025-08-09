/**
 * Este módulo contiene funciones simuladas que representan llamadas al
 * servidor.  En una implementación real, estas funciones realizarían
 * peticiones HTTP (por ejemplo, con fetch o axios) a un back‑end.
 */

export interface SubmitBookingPayload {
  serviceId: string;
  name: string;
  phone: string;
  dateTime: string;
  sessions?: number;
}

export interface SubmitEvaluationPayload {
  serviceId: string;
  name: string;
  phone: string;
  evaluationType: "online" | "presencial";
  dateTime?: string;
  images?: File[];
}

/**
 * Envía una reserva.  Genera un ID de manera simple y devuelve el
 * objeto resultante.  Sustituye esta lógica por una petición HTTP
 * cuando dispongas de una API.
 */
export async function submitBooking(payload: SubmitBookingPayload) {
  const id = `bk-${Date.now()}`;
  return { id, ...payload };
}

/**
 * Envía una solicitud de valoración.  Genera un ID y devuelve el
 * objeto resultante.  En una solución real puedes subir también las
 * imágenes a un almacenamiento externo.
 */
export async function submitEvaluation(payload: SubmitEvaluationPayload) {
  const id = `ev-${Date.now()}`;
  return { id, ...payload };
}
