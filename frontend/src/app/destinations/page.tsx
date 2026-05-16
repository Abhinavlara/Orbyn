"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.getProperties();
        if (res.properties) {
          // Group properties by city to create "destinations"
          const grouped: any = {};
          res.properties.forEach((p: any) => {
            const city = p.location.city;
            if (!grouped[city]) {
              grouped[city] = {
                name: city,
                country: p.location.country,
                properties: 0,
                rating: 0,
                ratingSum: 0,
                image: p.images?.[0] || "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800",
                description: p.description
              };
            }
            grouped[city].properties += 1;
            grouped[city].ratingSum += (p.ratings?.average || 0);
          });

          const formatted = Object.values(grouped).map((d: any) => ({
            ...d,
            rating: (d.ratingSum / d.properties).toFixed(1)
          }));
          setDestinations(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (isLoading) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Loading Destinations...</div>;
  if (destinations.length === 0) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">No destinations found.</div>;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Explore</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-3">
            Top <span className="text-gradient">Destinations</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">
            From sun-kissed coastlines to snow-capped peaks, discover the world&apos;s most extraordinary places.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}3
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-2xl overflow-hidden h-80 cursor-pointer border border-white/5"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${d.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <MapPin size={14} /> {d.country}
                  <span className="ml-auto flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" /> {d.rating}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white">{d.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{d.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">{d.properties} properties</span>
                  <Link href="/stays" className="text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
