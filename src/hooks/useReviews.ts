import { useState, useEffect } from "react";
import type { Review } from "../types/index";
import { supabase } from "../utils/supabaseClient";

/**
 * Hook para gestionar opiniones almacenadas en Supabase.  Requiere una
 * tabla `reviews` con las columnas: id (text, PK), name (text), rating
 * (integer), comment (text), date (timestamp).  Permite obtener todas
 * las reseñas y añadir nuevas.
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const addReview = async (review: Omit<Review, "id">): Promise<Review> => {
    const id = `rv-${Date.now()}`;
    const payload = { id, ...review };
    const { data, error } = await supabase
      .from("reviews")
      .insert(payload)
      .select()
      .single();
    if (error || !data) {
      throw new Error(error?.message || "Error al crear la reseña");
    }
    setReviews((prev) => [data, ...prev]);
    return data;
  };

  return { reviews, addReview, loading };
};
