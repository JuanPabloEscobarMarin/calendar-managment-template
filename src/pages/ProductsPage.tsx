import React from 'react';
import { ProductList } from '../features/products/ProductList';

/**
 * Página dedicada al catálogo de productos.  Se muestra una lista de
 * productos sin opción de compra, ya que la plantilla se centra en la
 * presentación.  Se podría enlazar con la tienda en línea en una
 * versión posterior.
 */
const ProductsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Productos</h2>
      <ProductList />
    </div>
  );
};

export default ProductsPage;