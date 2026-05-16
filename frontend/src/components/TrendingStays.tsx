"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Heart, MapPin, ArrowRight } from "lucide-react";
import api from "@/services/api";

export default function TrendingStays() {
  const [stays, setStays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await api.getProperties({ limit: "4" });
        if (res.properties) setStays(res.properties);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStays();
  }, []);

  return (
    <section className="py-20 px-6 md:px-12 bg-white/[0.02]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trending <span className="text-gradient">Stays</span></h2>
            <p className="text-gray-400 max-w-xl">Curated collection of the highest-rated properties worldwide.</p>
          </div>
          <Link href="/stays" className="text-primary hover:underline font-medium mt-4 md:mt-0 flex items-center gap-1">Explore all stays <ArrowRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-80 glass rounded-2xl animate-pulse" />)
          ) : stays.map((stay, i) => (
            <motion.div
              key={stay._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/property/${stay._id}`}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 border border-white/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${stay.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} />
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors">
                    <Heart size={18} />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-sm font-bold text-white">${stay.price} <span className="text-xs font-normal text-gray-400">/ night</span></span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{stay.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {stay.location?.city}, {stay.location?.country}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold">{stay.rating || 4.9}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
