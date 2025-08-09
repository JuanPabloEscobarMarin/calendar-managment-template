import React from 'react';
import { BookingForm } from '../features/booking/BookingForm';

/**
 * Página que muestra el formulario de reserva.  Se utiliza para
 * encapsular la ruta correspondiente en el enrutador.
 */
const BookingPage: React.FC = () => {
  return <BookingForm />;
};

export default BookingPage;