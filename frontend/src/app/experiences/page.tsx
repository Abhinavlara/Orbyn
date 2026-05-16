"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Star, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.getProperties();
        if (res.properties) {
          setExperiences(res.properties);
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const filteredExperiences = selectedCat === "All" 
    ? experiences 
    : experiences.filter(exp => exp.category?.includes(selectedCat) || exp.title.includes(selectedCat));

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Unique</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mt-3">
            Curated <span className="text-gradient">Experiences</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">
            Unforgettable activities hosted by local experts. Go beyond the ordinary.
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["All", "Adventure", "Culture", "Food", "Luxury", "Wellness"].map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                selectedCat === cat ? "bg-primary text-white" : "border border-white/10 text-gray-400 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-80 glass rounded-2xl animate-pulse" />
            ))
          ) : filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp, i) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group glass rounded-2xl overflow-hidden cursor-pointer"
              >
                <Link href={`/property/${exp._id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${exp.images?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-white">{exp.category || "Luxury"}</span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{exp.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {exp.location?.city}, {exp.location?.country}</p>

                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> 4 hours</span>
                      <span className="flex items-center gap-1"><Users size={14} /> 8 max</span>
                      <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" /> {exp.ratings?.average || 5.0} ({exp.ratings?.count || 0})</span>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                      <div>
                        <span className="text-xl font-bold">${exp.price}</span>
                        <span className="text-gray-500 text-sm"> / person</span>
                      </div>
                      <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">No experiences found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
