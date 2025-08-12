/**
 * La configuración de la aplicación se centraliza en este archivo.  Definirla
 * aquí permite reutilizar la misma base de código para distintos negocios
 * simplemente modificando los valores y sustituyendo las imágenes en
 * `src/assets/images`.
 */

export interface WorkingHours {
  /** IANA timezone for business logic */
  timezone: string; // e.g. 'America/Bogota'
  /** e.g. '08:00' */
  start: string;
  /** e.g. '17:00' */
  end: string;
  /** slot granularity in minutes, typically 30 */
  slotMinutes: number;
  /** 1..7 => Mon..Sun */
  workingDays: number[];
  /** ISO dates 'YYYY-MM-DD' that are closed */
  holidays: string[];
  /** Minimum minutes in advance to allow a booking */
  minLeadMinutes: number;
}

export interface Service {
  id: string;
  /** Nombre del servicio, por ejemplo “Limpieza facial” */
  name: string;
  /** Categoría a la que pertenece el servicio (facial, corporal, depilación, etc.) */
  category: string;
  /** Descripción corta para mostrar al cliente */
  description: string;
  /** Precio del servicio en la moneda local */
  price: number;
  /** Duración aproximada (por ejemplo “60 min”) */
  duration: string;
  durationMinutes: number; // opcional, si se desea calcular automáticamente
  /** Indica si es obligatorio realizar una valoración antes de reservar la cita */
  requiresEvaluation?: boolean;
  sessionCount: number; // opcional, si se desea limitar el número de sesiones
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number; // opcional, si se desea mostrar precio
  /** Categoría del producto (opcional) */
  category?: string;
}

export interface AppConfig {
  /** Nombre que aparece en el título del sitio y barra de navegación */
  siteName: string;
  /** Nombre comercial del negocio */
  businessName: string;
  /** Breve eslogan o texto descriptivo */
  tagline: string;
  /** Teléfono de contacto mostrado en el footer */
  contactPhone: string;
  /** Correo de contacto mostrado en el footer */
  contactEmail: string;
  /** Servicios disponibles para reservar */
  services: Service[];
  /** Productos que se muestran en el catálogo */
  products: Product[];
  /** Zona horaria del negocio, para mostrar correctamente las fechas */
  workingHours: WorkingHours;
}
/** Duración fija de las valoraciones presenciales en minutos */
export const evalDuration = 60;

export const defaultConfig: AppConfig = {
  siteName: "Barberia Booking",
  businessName: "BarberShop",
  tagline: "aqui te coltamo el pelo",
  contactPhone: "+57 321 842 6226",
  contactEmail: "contacto@barberia.com",
  workingHours: {
    timezone: "America/Bogota",
    start: "08:00",
    end: "17:00",
    slotMinutes: 30, // sólo :00 y :30
    workingDays: [1, 2, 3, 4, 5, 6, 7], // 1=Lunes … 7=Domingo
    holidays: [] as string[], // ISO dates: ['2025-08-20']
    minLeadMinutes: 29, // no permitir citas con menos de 60 min de antelación
  },
  services: [
    {
      id: "svc-1",
      name: "Limpieza facial",
      category: "Facial",
      description: "Tratamiento de limpieza profunda y exfoliación.",
      price: 120000,
      duration: "60 min",
      durationMinutes: 60,
      requiresEvaluation: true,
      sessionCount: 1,
    },
    {
      id: "svc-2",
      name: "Masaje relajante",
      category: "Corporal",
      description: "Masaje corporal completo para aliviar tensiones.",
      price: 150000,
      duration: "75 min",
      durationMinutes: 75,
      requiresEvaluation: false,
      sessionCount: 3,
    },
    {
      id: "svc-3",
      name: "Corte de cabello y barba",
      category: "Facial",
      description: "te coltamos el pelo y la barba",
      price: 40000,
      duration: "50 min",
      durationMinutes: 50,
      requiresEvaluation: false,
      sessionCount: 1,
    },
    {
      id: "svc-4",
      name: "Prueba de Tiempo",
      category: "Reloj",
      description: "Servicio de prueba de tiempo",
      price: 40000,
      duration: "3 horas y 20 minutos",
      durationMinutes: 200,
      requiresEvaluation: false,
      sessionCount: 1,
    },
  ],
  products: [
    {
      id: "prd-1",
      name: "Crema hidratante",
      description: "Ideal para piel seca, con ingredientes naturales.",
      image: "/assets/images/crema-hidratante.png",
    },
    {
      id: "prd-2",
      name: "Gel facial purificante",
      description: "Limpia y purifica la piel mixta y grasa.",
      image: "/assets/images/gel-facial.png",
    },
    {
      id: "prd-3",
      name: "Minoxidil",
      description: "Crece el cabello y fortalece los folículos.",
      image: "/assets/images/minoxidil-facial.png",
    },
  ],
};
