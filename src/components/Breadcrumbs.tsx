import React from "react";
import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

/**
 * Componente para mostrar un rastro de navegación.  Recibe una lista de
 * migas (crumbs) donde cada elemento puede contener un enlace.  Las
 * últimas migas se muestran como texto plano.  Este componente es
 * completamente opcional, pero mejora la usabilidad en vistas de detalle.
 */

export const Breadcrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  return (
    <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="list-reset inline-flex">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={idx} className="flex items-center">
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="hover:text-indigo-600">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {!isLast && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
