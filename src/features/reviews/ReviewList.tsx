import React from 'react';
import type { Review } from '../../types';

interface Props {
  reviews: Review[];
}

/**
 * Muestra una lista de opiniones de clientes.  Cada reseña incluye
 * nombre (opcional), puntuación y comentario.  Se utilizan estrellas
 * Unicode para visualizar la calificación de manera sencilla.
 */
export const ReviewList: React.FC<Props> = ({ reviews }) => {
  if (!reviews.length) {
    return <p className="text-gray-600">No hay opiniones todavía.</p>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((rev) => {
        const stars = '★★★★★☆☆☆☆☆'.slice(5 - rev.rating, 10 - rev.rating);
        return (
          <div key={rev.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-800">
                {rev.name || 'Anónimo'}
              </span>
              <span className="ml-auto text-xs text-gray-500">
                {new Date(rev.date).toLocaleDateString()}
              </span>
            </div>
            <div className="text-yellow-500 mb-1 text-sm">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
            <p className="text-sm text-gray-700">{rev.comment}</p>
          </div>
        );
      })}
    </div>
  );
};