"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Download, 
  XCircle,
  Plane,
  Train,
  Home,
  Clock,
  CheckCircle2
} from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.getUserBookings();
        setBookings(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold">My <span className="text-gradient">Bookings</span></h1>
          <p className="text-gray-500 mt-2">Manage your upcoming and past journeys in one place.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all shrink-0 ${
                filter === f ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 glass rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 glass rounded-[3rem] border border-white/5">
            <Ticket size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No bookings yet</h3>
            <p className="text-gray-600 mt-2 mb-8">Start exploring and book your first journey!</p>
            <button onClick={() => window.location.href = '/'} className="bg-primary text-white font-bold px-8 py-3 rounded-xl">Explore Now</button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon/Image */}
                  <div className="w-full md:w-40 h-40 md:h-auto aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0">
                    <img src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${getStatusColor(booking.paymentStatus === 'paid' ? 'confirmed' : 'pending')}`}>
                            {booking.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: ORB-{booking._id.substring(0,6).toUpperCase()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{booking.property?.title || 'Travel Booking'}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{booking.totalPrice?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Paid</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs">{new Date(booking.dates?.checkIn || booking.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-xs truncate">{booking.property?.location?.city || 'India'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <button className="flex-1 bg-white/5 hover:bg-white/10 text-xs font-bold py-3 rounded-xl border border-white/5 transition-all flex items-center justify-center gap-2">
                        <Download size={14} /> Ticket
                      </button>
                      <button className="flex-1 bg-white/5 hover:bg-red-500/10 text-xs font-bold text-gray-400 hover:text-red-400 py-3 rounded-xl border border-white/5 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
                        <XCircle size={14} /> Cancel
                      </button>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
