"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Train, Search, MapPin, Calendar, Users, Filter, ArrowRight, Clock, Info } from "lucide-react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";

export default function TrainsPage() {
  const router = useRouter();
  const { setBooking } = useBookingStore();
  const [trains, setTrains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const fetchTrains = async () => {
    setIsLoading(true);
    try {
      const res = await api.searchTrains({ from, to, date });
      if (res.success) setTrains(res.trains);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = (train: any, cls: any) => {
    setBooking({
      id: train._id || train.trainNumber,
      type: 'train',
      title: train.trainName,
      price: cls.price,
      dates: { travelDate: date || new Date().toISOString() },
      details: {
        from: train.from.station,
        to: train.to.station,
        trainName: train.trainName,
        trainNumber: train.trainNumber,
        class: cls.type
      }
    });
    router.push(`/checkout?type=train&id=${train._id || train.trainNumber}&class=${cls.type}`);
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Domestic <span className="text-gradient">Trains</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Book Rajdhani, Shatabdi, Vande Bharat and other express trains across India.</p>
        </motion.div>

        {/* Search Bar */}
        <div className="glass rounded-3xl p-6 mb-12 flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 mb-2 block ml-2">From Station</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Delhi" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 mb-2 block ml-2">To Station</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Mumbai" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none" />
            </div>
          </div>
          <div className="w-full lg:w-48">
            <label className="text-xs text-gray-500 mb-2 block ml-2">Travel Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none" />
            </div>
          </div>
          <button onClick={fetchTrains} className="bg-primary hover:bg-blue-600 text-white p-3.5 rounded-xl transition-colors shadow-lg">
            <Search size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-48 glass rounded-2xl animate-pulse" />)
          ) : trains.length > 0 ? (
            trains.map((train) => (
              <motion.div key={train._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-6 border border-white/5 hover:border-primary/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Train size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{train.trainName}</h3>
                      <p className="text-xs text-gray-500 font-mono">{train.trainNumber} · {train.trainType}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p className="text-2xl font-bold">{train.departureTime}</p>
                      <p className="text-sm text-gray-400">{train.from.city}</p>
                    </div>
                    <div className="flex flex-col items-center flex-1 px-8">
                      <p className="text-xs text-gray-500 mb-1">{train.duration}</p>
                      <div className="w-full h-px bg-white/10 relative">
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{train.arrivalTime}</p>
                      <p className="text-sm text-gray-400">{train.to.city}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {train.classes.map((cls: any) => (
                      <div key={cls.type} className="bg-white/5 rounded-lg p-2 border border-white/5 hover:border-primary/30 cursor-pointer transition-all">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold">{cls.type}</span>
                          <span className="text-xs text-primary font-bold">₹{cls.price}</span>
                        </div>
                        <p className={`text-[10px] ${cls.seatsAvailable > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cls.seatsAvailable > 0 ? `Available: ${cls.seatsAvailable}` : 'Waitlist'}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Book Now <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 glass rounded-3xl">
              <Train size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No trains found</h3>
              <p className="text-gray-500">Try searching for different stations or dates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
