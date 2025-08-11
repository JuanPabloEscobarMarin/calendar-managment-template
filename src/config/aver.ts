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
  name: string;
  category: string;
  description: string;
  price: number;
  /** Human readable, e.g. '60 min' */
  duration: string;
  /** Numeric duration in minutes for scheduling */
  durationMinutes: number;
  image?: string;
  requiresEvaluation?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface AppConfig {
  siteName: string;
  businessName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  services: Service[];
  products: Product[];
  workingHours: WorkingHours;
}

export const defaultConfig: AppConfig = {
  siteName: "Beauty Booking",
  businessName: "Tu Centro Estético",
  tagline: "Cuidado de tu piel y bienestar",
  contactPhone: "+57 300 000 0000",
  contactEmail: "contacto@tu-negocio.com",
  workingHours: {
    timezone: "America/Bogota",
    start: "08:00",
    end: "17:00",
    slotMinutes: 30,
    workingDays: [1, 2, 3, 4, 5, 6], // Lunes - Sábado
    holidays: [],
    minLeadMinutes: 60,
  },
  services: [
    {
      id: "svc-1",
      name: "Limpieza facial",
      category: "Facial",
      description: "Limpieza profunda con extracción y mascarilla",
      price: 120000,
      duration: "50 min",
      durationMinutes: 50,
      requiresEvaluation: false,
    },
    {
      id: "svc-2",
      name: "Peeling químico",
      category: "Facial",
      description: "Renovación de la piel mediante peeling controlado",
      price: 180000,
      duration: "45 min",
      durationMinutes: 45,
      requiresEvaluation: true,
    },
    {
      id: "svc-3",
      name: "Masaje descontracturante",
      category: "Corporal",
      description: "Masaje terapéutico para aliviar tensiones musculares",
      price: 150000,
      duration: "60 min",
      durationMinutes: 60,
      requiresEvaluation: false,
    },
  ],
  products: [
    {
      id: "prd-1",
      name: "Serum hidratante",
      description: "Ácido hialurónico + vitamina B5",
    },
    {
      id: "prd-2",
      name: "Protector solar 50+",
      description: "Protección UVA/UVB de amplio espectro",
    },
  ],
};
