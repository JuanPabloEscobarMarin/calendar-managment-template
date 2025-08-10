import React from "react";
import { ReviewList } from "../features/reviews/ReviewList";
import { ReviewForm } from "../features/reviews/ReviewForm";
import type { Review } from "../types";
import { useReviews } from "../hooks/useReviews";

/**
 * Página de opiniones.  Lee las reseñas desde Supabase mediante el
 * hook `useReviews` y permite añadir nuevas opiniones a la base de
 * datos.  Las reseñas se muestran de más recientes a más antiguas.
 */
const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useReviews();

  const handleAdd = (review: Review) => {
    // Extraer campos relevantes; el id se generará en Supabase
    const { name, rating, comment, date } = review;
    addReview({ name, rating, comment, date });
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
