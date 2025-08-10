/**
 * La configuración de la aplicación se centraliza en este archivo.  Definirla
 * aquí permite reutilizar la misma base de código para distintos negocios
 * simplemente modificando los valores y sustituyendo las imágenes en
 * `src/assets/images`.
 */

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
  /** Indica si es obligatorio realizar una valoración antes de reservar la cita */
  requiresEvaluation?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Ruta relativa al directorio assets; esto facilita reemplazar imágenes */
  image: string;
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
}

/**
 * Configuración por defecto.  Puedes modificar estos valores para crear
 * diferentes instancias del sistema sin tocar el resto del código.
 */
export const defaultConfig: AppConfig = {
  siteName: "Beauty Booking",
  businessName: "Mi Cosmetóloga",
  tagline: "Tu belleza, nuestra pasión",
  contactPhone: "+57 123 456 789",
  contactEmail: "contacto@micomsetologa.com",
  services: [
    {
      id: "svc-1",
      name: "Limpieza facial",
      category: "Facial",
      description: "Tratamiento de limpieza profunda y exfoliación.",
      price: 120,
      duration: "60 min",
      requiresEvaluation: true,
    },
    {
      id: "svc-2",
      name: "Masaje relajante",
      category: "Corporal",
      description: "Masaje corporal completo para aliviar tensiones.",
      price: 150,
      duration: "75 min",
      requiresEvaluation: false,
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
  ],
};
