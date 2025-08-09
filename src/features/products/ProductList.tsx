import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

/**
 * Lista los productos disponibles en el catálogo.  Muestra una imagen,
 * nombre y descripción.  Actualmente no ofrece funcionalidad de compra,
 * ya que la plantilla está pensada solo para visualización; sin
 * embargo, se podría añadir fácilmente un botón para contactar o
 * agregar al carrito.
 */
export const ProductList: React.FC = () => {
  const { products } = useConfig();
  if (!products.length) {
    return <p>No hay productos disponibles.</p>;
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((prod) => (
        <div key={prod.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
          {prod.image && (
            <img
              src={prod.image}
              alt={prod.name}
              className="object-contain h-40 w-full mb-4 rounded"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{prod.name}</h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow">{prod.description}</p>
        </div>
      ))}
    </div>
  );
};