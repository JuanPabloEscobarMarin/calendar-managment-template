import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

const Home: React.FC = () => {
  const config = useConfig();
  return (
    <div className="flex-col justify-between items-center space-y-12 space-x-10">
      <section className="text-center py-16 bg-[#1a1a1a] shadow w-100">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{config.businessName}</h2>
        <p className="text-lg text-white mb-6">{config.tagline}</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/services"
            className="bg-[#cba313ff] text-white px-6 py-3 rounded hover:bg-[#e0b30b] text-base font-medium">
            Ver servicios
          </Link>
          <Link
            to="/products"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 text-base font-medium">
            Productos
          </Link>
          <Link
            to="/reviews"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 text-base font-medium">
            Opiniones
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">¿Por qué elegirnos?</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-transform hover:-translate-y-1 flex flex-col">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reserva en segundos</h3>
              <p className="text-gray-600 mb-6 flex-grow">Elige el servicio que deseas y reserva tu cita con solo unos clics. Nuestro calendario siempre está actualizado.</p>
              <Link to="/about" className="inline-block bg-transparent text-gray-900 font-medium py-2 px-4 rounded border-2 border-gray-900 hover:bg-gray-900 hover:text-white mt-auto">
                Reserva ya!
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-transform hover:-translate-y-1 flex flex-col">
              <div className="text-4xl mb-4">🧐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Valoraciones personalizadas</h3>
              <p className="text-gray-600 mb-6 flex-grow">Solicita un diagnóstico en línea enviando tus fotos o agenda una valoración presencial según tu preferencia.</p>
              <Link to="/premium-services" className="iinline-block bg-transparent text-gray-900 font-medium py-2 px-4 rounded border-2 border-gray-900 hover:bg-gray-900 hover:text-white mt-auto">
                Solicita tu valoración
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center transform transition-transform hover:-translate-y-1 flex flex-col">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Servicios en paquetes</h3>
              <p className="text-gray-600 mb-6 flex-grow">Aprovecha nuestros paquetes de sesiones y personaliza la cantidad de citas de acuerdo con tus necesidades.</p>
              <Link to="/facilities" className="inline-block bg-transparent text-gray-900 font-medium py-2 px-4 rounded border-2 border-gray-900 hover:bg-gray-900 hover:text-white mt-auto">
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;