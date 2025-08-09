import React, { useState, useEffect } from 'react';
import { ReviewList } from '../features/reviews/ReviewList';
import { ReviewForm } from '../features/reviews/ReviewForm';
import type { Review } from '../types';

/**
 * Página de opiniones.  Permite ver las reseñas existentes y añadir
 * nuevas opiniones mediante un formulario.  La información se guarda
 * en `localStorage` para permanecer entre sesiones.  En una
 * aplicación real, estas reseñas se obtendrían de una API.
 */
const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const stored = window.localStorage.getItem('reviews');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Review[];
        setReviews(parsed);
      } catch {
        // ignorar
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    window.localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleAdd = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Opiniones</h2>
      <ReviewForm onAdd={handleAdd} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsPage;