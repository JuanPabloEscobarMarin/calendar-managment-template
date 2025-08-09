import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { ServiceList } from '../features/services/ServiceList';

/**
 * Página que muestra todos los servicios.  Permite filtrar por
 * categoría si existen varias.  Esto proporciona una experiencia más
 * cómoda al cliente cuando la oferta es amplia.  El filtro es
 * opcional; si no se selecciona ningún valor, se muestran todos los
 * servicios.
 */
const ServicesPage: React.FC = () => {
  const { services } = useConfig();
  const categories = Array.from(new Set(services.map((s) => s.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todas'>('Todas');
  const filteredServices = selectedCategory === 'Todas' ? services : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Nuestros servicios</h2>
        {categories.length > 1 && (
          <div className="mt-2 md:mt-0">
            <label htmlFor="category" className="text-sm text-gray-700 mr-2">
              Categoría:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            >
              <option value="Todas">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Renderizar lista filtrada usando ServiceCard directamente porque necesitamos filtrar manualmente */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((svc) => (
          <div key={svc.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{svc.name}</h3>
            <p
              className="text-sm text-gray-600 mb-2 overflow-hidden"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
            >
              {svc.description}
            </p>
            <p className="text-sm text-gray-700 mb-1">Duración: {svc.duration}</p>
            <p className="text-sm text-gray-700 mb-4">Precio: ${svc.price.toFixed(0)}</p>
            <a
              href={`/services/${svc.id}`}
              className="inline-block mt-auto bg-indigo-600 text-white text-xs px-3 py-2 rounded hover:bg-indigo-700"
            >
              Ver detalles
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;