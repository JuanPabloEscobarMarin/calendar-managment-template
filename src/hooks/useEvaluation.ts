import { useState, useEffect } from 'react';
import type { Evaluation } from '../types';

/**
 * Hook para gestionar solicitudes de valoración.  Similar a `useBookings`,
 * persiste los datos en `localStorage` y ofrece funciones para
 * añadir nuevas solicitudes y buscarlas por ID.  Esto permite que la
 * plantilla funcione sin un back‑end real, aunque en una solución
 * profesional se conectarían a un API.
 */
export const useEvaluation = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('evaluations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Evaluation[];
        setEvaluations(parsed);
      } catch {
        // ignorar
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  const addEvaluation = async (evalData: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
    const id = `ev-${Date.now()}`;
    const newEval: Evaluation = { id, ...evalData };
    setEvaluations((prev) => [...prev, newEval]);
    return newEval;
  };

  const getEvaluationById = (id: string): Evaluation | undefined => {
    return evaluations.find((ev) => ev.id === id);
  };

  return { evaluations, addEvaluation, getEvaluationById };
};