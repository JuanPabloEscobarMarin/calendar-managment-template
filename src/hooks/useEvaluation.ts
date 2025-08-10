import { useState, useEffect } from "react";
import type { Evaluation } from "../types";
import { supabase } from "../utils/supabaseClient";

/**
 * Hook para gestionar solicitudes de valoración con Supabase.  Carga
 * registros de la tabla `evaluations` y permite insertar nuevos.
 * Se requiere una tabla en Supabase con las columnas: id (text, PK),
 * serviceId, name, phone, evaluationType, dateTime (timestamp opcional),
 * images (jsonb o text[]).  Para subir imágenes reales, deberás usar
 * Supabase Storage; aquí solo se almacena la lista de nombres.
 */
export const useEvaluation = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("evaluations").select("*");
      if (!error && data) {
        setEvaluations(data as Evaluation[]);
      }
      if (!error && data) {
        setEvaluations(data);
      }
      setLoading(false);
    };
    fetchEvaluations();
  }, []);

  const addEvaluation = async (
    evalData: Omit<Evaluation, "id">
  ): Promise<Evaluation> => {
    const id = `ev-${Date.now()}`;
    const payload = { id, ...evalData };
    const { data, error } = await supabase
      .from("evaluations")
      .insert(payload)
      .select()
      .single();
    if (error || !data) {
      throw new Error(error?.message || "Error al crear la valoración");
    }
    setEvaluations((prev) => [...prev, data]);
    return data;
  };

  const getEvaluationById = (id: string): Evaluation | undefined => {
    return evaluations.find((ev) => ev.id === id);
  };

  return { evaluations, addEvaluation, getEvaluationById, loading };
};
