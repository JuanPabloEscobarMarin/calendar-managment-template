import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

/**
 * Página de inicio.  Presenta la marca del negocio y las principales
 * funcionalidades de la plataforma.  Incluye botones para navegar a
 * servicios, productos y opiniones.  Este diseño minimalista puede
 * ajustarse fácilmente a diferentes identidades corporativas.
 */
const Home: React.FC = () => {
  const config = useConfig();
  return (
    <div className="space-y-12">
      {/* Hero principal */}
      <section className="text-center py-16 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-lg shadow">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{config.businessName}</h2>
        <p className="text-lg text-gray-700 mb-6">{config.tagline}</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/services"
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 text-sm"
          >
            Ver servicios
          </Link>
          <Link
            to="/products"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 text-sm"
          >
            Productos
          </Link>
          <Link
            to="/reviews"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 text-sm"
          >
            Opiniones
          </Link>
        </div>
      </section>
      {/* Sección de ventajas */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Reserva en segundos</h3>
          <p className="text-sm text-gray-600">
            Elige el servicio que deseas y reserva tu cita con solo unos clics. Nuestro calendario siempre está actualizado.
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Valoraciones personalizadas</h3>
          <p className="text-sm text-gray-600">
            Solicita un diagnóstico en línea enviando tus fotos o agenda una valoración presencial según tu preferencia.
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Servicios en paquetes</h3>
          <p className="text-sm text-gray-600">
            Aprovecha nuestros paquetes de sesiones y personaliza la cantidad de citas de acuerdo con tus necesidades.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;