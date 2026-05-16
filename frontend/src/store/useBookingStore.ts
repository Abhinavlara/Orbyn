import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingType = 'stay' | 'flight' | 'train' | 'experience';

interface BookingDetails {
  id: string;
  type: BookingType;
  title: string;
  image?: string;
  price: number;
  dates?: {
    checkIn?: string;
    checkOut?: string;
    travelDate?: string;
  };
  details: {
    location?: string;
    from?: string;
    to?: string;
    airline?: string;
    trainName?: string;
    trainNumber?: string;
    class?: string;
    guests?: {
      adults: number;
      children: number;
    };
  };
}

interface BookingState {
  currentBooking: BookingDetails | null;
  setBooking: (details: BookingDetails) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentBooking: null,
      setBooking: (details) => set({ currentBooking: details }),
      clearBooking: () => set({ currentBooking: null }),
    }),
    {
      name: 'orbyn_booking_storage',
    }
  )
);
