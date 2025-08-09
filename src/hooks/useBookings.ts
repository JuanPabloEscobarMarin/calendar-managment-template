import { useState, useEffect } from 'react';
import type { Booking } from '../types';

/**
 * Hook sencillo para gestionar el estado de las reservas.  Utiliza
 * `localStorage` para persistir datos entre sesiones del navegador.  Las
 * funciones devueltas permiten añadir una nueva reserva y obtener una
 * reserva concreta por su identificador.  En un proyecto real se
 * remplazaría este hook por llamadas a un servicio back‑end.
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Cargar reservas desde localStorage al iniciar
  useEffect(() => {
    const stored = window.localStorage.getItem('bookings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Booking[];
        setBookings(parsed);
      } catch {
        // Ignorar valores corruptos
      }
    }
  }, []);

  // Guardar reservas en localStorage cada vez que cambien
  useEffect(() => {
    window.localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  /**
   * Añade una nueva reserva y devuelve el objeto creado.  Se genera un
   * identificador simple basado en la fecha/hora actual.  La función
   * devuelve una promesa para simular una llamada asíncrona.
   */
  const addBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    const id = `bk-${Date.now()}`;
    const newBooking: Booking = { id, ...booking };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  /**
   * Devuelve una reserva a partir de su identificador.  Si no se
   * encuentra ninguna, devuelve `undefined`.
   */
  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((b) => b.id === id);
  };

  return { bookings, addBooking, getBookingById };
};