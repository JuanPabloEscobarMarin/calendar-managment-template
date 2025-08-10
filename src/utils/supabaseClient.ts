import { createClient } from "@supabase/supabase-js";

/**
 * Inicializa el cliente de Supabase usando las variables de entorno
 * proporcionadas por Vite.  Debes definir `VITE_SUPABASE_URL` y
 * `VITE_SUPABASE_ANON_KEY` en un fichero `.env` en la raíz del
 * proyecto.  Por ejemplo:
 *
 * VITE_SUPABASE_URL=https://xyzcompany.supabase.co
 * VITE_SUPABASE_ANON_KEY=public-anon-key
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
