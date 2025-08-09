import React, { createContext, useContext } from "react";
import type { AppConfig } from "../config/appConfig.ts";
import { defaultConfig } from "../config/appConfig.ts";

/**
 * Contexto para compartir la configuración global de la aplicación.  El
 * proveedor envía la configuración a todos los componentes hijos.  Esto
 * permite construir plantillas reutilizables leyendo valores desde
 * `appConfig.ts` sin propagar props manualmente.
 */
const ConfigContext = createContext<AppConfig>(defaultConfig);

/**
 * Hook que devuelve la configuración actual.  Debe usarse dentro de un
 * `ConfigProvider`.  Si ningún proveedor está presente, se devuelve la
 * configuración por defecto.
 */
export const useConfig = () => useContext(ConfigContext);

interface ConfigProviderProps {
  config?: AppConfig;
  children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  config = defaultConfig,
  children,
}) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
