import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useConfig } from '../../contexts/ConfigContext';
import { useEvaluation } from '../../hooks/useEvaluation';

/**
 * Formulario para solicitar una valoración.  Permite elegir entre
 * valoración en línea (con fotos) o presencial.  Cuando el usuario
 * envía el formulario, se registra la solicitud y se redirige a la
 * página de confirmación.  Los campos se ajustan dinámicamente según
 * el tipo de valoración seleccionado.
 */
export const EvaluationForm: React.FC = () => {
  const { services } = useConfig();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('serviceId');
  const [serviceId, setServiceId] = useState<string>(preselected ?? (services[0]?.id ?? ''));
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [evaluationType, setEvaluationType] = useState<'online' | 'presencial'>('online');
  const [dateTime, setDateTime] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const { addEvaluation } = useEvaluation();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !serviceId) {
      alert('Completa los campos obligatorios');
      return;
    }
    if (evaluationType === 'presencial' && !dateTime) {
      alert('Selecciona fecha y hora para la valoración presencial');
      return;
    }
    const newEval = await addEvaluation({ serviceId, name, phone, evaluationType, dateTime: dateTime || undefined, images });
    navigate(`/evaluation/confirmation/${newEval.id}`);
  };

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Solicitar valoración</h2>
      {preselected && selectedService ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
          <p className="text-gray-800">{selectedService.name}</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="service">
            Servicio
          </label>
          <select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Teléfono</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de valoración</label>
        <div className="mt-1 flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="evaluationType"
              value="online"
              checked={evaluationType === 'online'}
              onChange={() => setEvaluationType('online')}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">En línea</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="evaluationType"
              value="presencial"
              checked={evaluationType === 'presencial'}
              onChange={() => setEvaluationType('presencial')}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Presencial</span>
          </label>
        </div>
      </div>
      {evaluationType === 'presencial' && (
        <div>
          <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y hora
          </label>
          <input
            id="dateTime"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}
      {evaluationType === 'online' && (
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Fotos (puedes subir varias)
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:bg-gray-50 file:text-sm file:font-semibold hover:file:bg-gray-100"
          />
        </div>
      )}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Enviar solicitud
        </button>
      </div>
    </form>
  );
};