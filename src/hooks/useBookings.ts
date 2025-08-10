import { useState, useEffect } from 'react';
import type { Booking } from '../types';
import { supabase } from '../utils/supabaseClient';

/**
 * Hook para gestionar reservas mediante Supabase.  Carga las reservas
 * desde la tabla `bookings` al montarse y proporciona funciones para
 * insertar nuevas reservas y consultar por ID.  Requiere que hayas
 * creado una tabla `bookings` en tu proyecto de Supabase con las
 * columnas: id (text, PK), serviceId (text), name (text), phone (text),
 * dateTime (timestamp), sessions (integer, opcional).
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar reservas desde Supabase al iniciar
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data) {
        setBookings(data as Booking[]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  /**
   * Inserta una reserva en Supabase y actualiza el estado local.  Se
   * genera un identificador basado en la fecha/hora actual, pero
   * podrías definir la columna `id` con un valor por defecto para que
   * lo genere la base de datos.  Devuelve la reserva creada.
   */
  const addBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    const id = `bk-${Date.now()}`;
    const payload = { id, ...booking };
    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();
    if (error || !data) {
      throw new Error(error?.message || 'Error al crear la reserva');
    }
    setBookings((prev) => [...prev, data]);
    return data as Booking;
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((b) => b.id === id);
  };

  return { bookings, addBooking, getBookingById, loading };
};