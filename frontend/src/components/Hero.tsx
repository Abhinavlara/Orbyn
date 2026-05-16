"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, Train } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stays");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guests, setGuests] = useState("");
  const [topProperties, setTopProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await api.getProperties({ limit: "3" });
        if (res.properties) {
          setTopProperties(res.properties);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    };
    fetchTop();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            Redefine Your <br className="hidden md:block" />
            <span className="text-gradient">Travel Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover extraordinary stays, immersive experiences, and seamless bookings with the world's most premium travel platform.
          </p>
        </motion.div>

        {/* Search Bar - Multi-tabbed Glassmorphism */}
        <div className="w-full max-w-5xl">
          {/* Tab Switcher */}
          <div className="flex gap-4 mb-4 ml-6">
            {['stays', 'flights', 'trains', 'experiences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-xl text-sm font-semibold transition-all ${
                  activeTab === tab 
                    ? 'bg-primary text-white' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass rounded-full p-2 md:p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl neon-glow relative"
          >
            {activeTab === 'stays' && (
              <>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Location</span>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where are you going?" 
                      className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0"
                    />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <Calendar className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Check In</span>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-transparent border-none outline-none text-gray-400 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 gap-3">
                  <Users className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Guests</span>
                    <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Add guests" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'flights' && (
              <>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">From</span>
                    <input type="text" placeholder="Origin city" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">To</span>
                    <input type="text" placeholder="Destination city" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 gap-3">
                  <Calendar className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Date</span>
                    <input type="date" className="bg-transparent border-none outline-none text-gray-400 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'trains' && (
              <>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">From Station</span>
                    <input type="text" placeholder="Source station" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">To Station</span>
                    <input type="text" placeholder="Destination station" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 gap-3">
                  <Calendar className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Date</span>
                    <input type="date" className="bg-transparent border-none outline-none text-gray-400 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'experiences' && (
              <>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <MapPin className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Location</span>
                    <input type="text" placeholder="Where to?" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-white/10 gap-3">
                  <Star className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">Activity</span>
                    <input type="text" placeholder="What to do?" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0 gap-3">
                  <Users className="text-primary" size={20} />
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-400 font-medium">People</span>
                    <input type="number" min="1" placeholder="How many?" className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm md:text-base w-full focus:ring-0" />
                  </div>
                </div>
              </>
            )}

            <button 
              onClick={() => {
                const params = new URLSearchParams();
                if (activeTab === 'stays') {
                  if (location) params.append('city', location);
                  if (guests) params.append('guests', guests);
                  router.push(`/stays?${params.toString()}`);
                } else {
                  router.push(`/${activeTab}`);
                }
              }}
              className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white rounded-full p-4 flex items-center justify-center transition-colors shadow-lg"
            >
              <Search size={24} />
            </button>
          </motion.div>
        </div>

        {/* Floating Cards Demo */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {(topProperties.length > 0 ? topProperties : [
            { _id: "1", title: "Santorini, Greece", price: 350, images: ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000&auto=format&fit=crop"] },
            { _id: "2", title: "Kyoto, Japan", price: 280, images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop"] },
            { _id: "3", title: "Swiss Alps", price: 420, images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop"] }
          ]).map((card, i) => (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: i === 1 ? -20 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 + (i * 0.2) }}
              whileHover={{ y: (i === 1 ? -20 : 0) - 10, scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden h-64 md:h-80 group cursor-pointer border border-white/10"
            >
              <Link href={`/property/${card._id}`}>
                <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110`} style={{ backgroundImage: `url(${card.images?.[0] || card.img})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 flex flex-col items-start w-full">
                  <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                  <span className="text-sm text-gray-300">${card.price}/night</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
