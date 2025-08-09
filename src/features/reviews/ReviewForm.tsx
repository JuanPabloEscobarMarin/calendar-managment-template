import React, { useState } from 'react';
import type { Review } from '../../types';

interface Props {
  onAdd: (review: Review) => void;
}

/**
 * Formulario para añadir una opinión.  Permite introducir el nombre del
 * cliente (opcional), seleccionar una puntuación de 1 a 5 y escribir un
 * comentario.  Al enviar, se genera un ID simple y se llama a la
 * función `onAdd` pasada por el componente padre.
 */
export const ReviewForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Por favor escribe tu opinión.');
      return;
    }
    const newReview: Review = {
      id: `rv-${Date.now()}`,
      name: name.trim() || 'Anónimo',
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    onAdd(newReview);
    // Reiniciar campos
    setName('');
    setRating(5);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Deja tu opinión</h3>
      <div>
        <label htmlFor="rev-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre (opcional)
        </label>
        <input
          id="rev-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Puntuación
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} {r === 1 ? 'estrella' : 'estrellas'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comentario
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="pt-2">
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
          Enviar opinión
        </button>
      </div>
    </form>
  );
};