"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, Clock, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";

const airports = [
  { code: 'DEL', city: 'New Delhi' },
  { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bangalore' },
  { code: 'GOI', city: 'Goa' },
  { code: 'SXR', city: 'Srinagar' },
  { code: 'MAA', city: 'Chennai' },
  { code: 'COK', city: 'Kochi' },
  { code: 'CCU', city: 'Kolkata' },
];

export default function FlightsPage() {
  const router = useRouter();
  const { setBooking } = useBookingStore();
  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [stopsFilter, setStopsFilter] = useState("");
  const [sortBy, setSortBy] = useState("price");

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (passengers) params.passengers = passengers;
      if (flightClass) params.flightClass = flightClass;
      if (maxPrice < 10000) params.maxPrice = String(maxPrice);
      if (stopsFilter !== "") params.stops = stopsFilter;
      if (sortBy) params.sortBy = sortBy;
      const res = await api.searchFlights(params);
      setFlights(res.flights || []);
    } catch (err) {
      console.error("Failed to search flights:", err);
      toast.error("Failed to search flights");
    } finally {
      setIsLoading(false);
    }
  };

  // Load all flights initially
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const res = await api.searchFlights();
        setFlights(res.flights || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const getAirlineBg = (airline: string) => {
    if (airline.includes('IndiGo')) return 'from-blue-600/20 to-blue-900/20';
    if (airline.includes('Air India')) return 'from-red-600/20 to-orange-900/20';
    if (airline.includes('Vistara')) return 'from-purple-600/20 to-purple-900/20';
    if (airline.includes('SpiceJet')) return 'from-yellow-600/20 to-red-900/20';
    return 'from-gray-600/20 to-gray-900/20';
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Explore</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-3">
            Find <span className="text-gradient">Flights</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">Search and compare the best flight deals across major airlines.</p>
        </motion.div>

        {/* Search Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 md:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">FROM</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none appearance-none">
                <option value="" className="bg-[#111]">Select city</option>
                {airports.map(a => <option key={a.code} value={a.code} className="bg-[#111]">{a.city} ({a.code})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">TO</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none appearance-none">
                <option value="" className="bg-[#111]">Select city</option>
                {airports.map(a => <option key={a.code} value={a.code} className="bg-[#111]">{a.city} ({a.code})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">DATE</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">PASSENGERS</label>
              <input type="number" min="1" max="9" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={handleSearch} className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors neon-glow">
                <Search size={18} /> Search Flights
              </button>
            </div>
          </div>

          {/* Extra filters row */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <select value={flightClass} onChange={(e) => setFlightClass(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-300 text-sm focus:border-primary focus:outline-none appearance-none">
              <option value="" className="bg-[#111]">All Classes</option>
              <option value="Economy" className="bg-[#111]">Economy</option>
              <option value="Business" className="bg-[#111]">Business</option>
              <option value="First" className="bg-[#111]">First Class</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-300 text-sm focus:border-primary focus:outline-none appearance-none">
              <option value="price" className="bg-[#111]">Sort: Price Low→High</option>
              <option value="price-desc" className="bg-[#111]">Sort: Price High→Low</option>
              <option value="departure" className="bg-[#111]">Sort: Departure Time</option>
              <option value="duration" className="bg-[#111]">Sort: Duration</option>
            </select>
            <select value={stopsFilter} onChange={(e) => setStopsFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-gray-300 text-sm focus:border-primary focus:outline-none appearance-none">
              <option value="" className="bg-[#111]">Any Stops</option>
              <option value="0" className="bg-[#111]">Direct Only</option>
              <option value="1" className="bg-[#111]">1 Stop</option>
            </select>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : flights.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm mb-4">{flights.length} flight{flights.length > 1 ? 's' : ''} found</p>
            {flights.map((flight, i) => (
              <motion.div
                key={flight._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl p-6 hover:border-primary/30 border border-white/5 transition-all cursor-pointer group`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Airline */}
                  <div className="flex items-center gap-4 min-w-[160px]">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAirlineBg(flight.airline)} flex items-center justify-center`}>
                      <Plane size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{flight.airline}</p>
                      <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                    </div>
                  </div>

                  {/* Route & Time */}
                  <div className="flex items-center gap-6 flex-1">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{flight.departureTime}</p>
                      <p className="text-xs text-gray-500">{flight.from.code}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-gray-500 mb-1">{flight.duration}</p>
                      <div className="w-full flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1 h-px bg-gradient-to-r from-primary to-primary/30" />
                        {flight.stops > 0 && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                        {flight.stops > 0 && <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/30 to-primary" />}
                        <Plane size={14} className="text-primary" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                        {flight.stopCity ? ` via ${flight.stopCity}` : ''}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white">{flight.arrivalTime}</p>
                      <p className="text-xs text-gray-500">{flight.to.code}</p>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="text-right min-w-[140px]">
                    <p className="text-2xl font-bold text-white">₹{flight.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mb-2">{flight.class} · {flight.seatsAvailable} seats left</p>
                    <button 
                      onClick={() => {
                        setBooking({
                          id: flight._id,
                          type: 'flight',
                          title: `${flight.airline} ${flight.flightNumber}`,
                          price: flight.price,
                          dates: { travelDate: date || new Date().toISOString() },
                          details: {
                            from: flight.from.code,
                            to: flight.to.code,
                            airline: flight.airline,
                            class: flight.class
                          }
                        });
                        router.push(`/checkout?type=flight&id=${flight._id}`);
                      }}
                      className="bg-primary hover:bg-blue-600 text-white text-sm font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : hasSearched ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Plane size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No flights found</h3>
            <p className="text-gray-600 mt-2">Try changing your search criteria</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Plane size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">Search for flights above</h3>
            <p className="text-gray-600 mt-2">Select your origin, destination, and travel date</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
