import React from 'react';
import { EvaluationForm } from '../features/evaluation/EvaluationForm';

/**
 * Página para solicitar valoración.  Renderiza el formulario de
 * valoración y se integra dentro del layout público.
 */
const EvaluationPage: React.FC = () => {
  return <EvaluationForm />;
};

export default EvaluationPage;