"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import api from "@/services/api";

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getAllReviews();
        if (Array.isArray(res) && res.length > 0) {
          setReviews(res);
        } else {
          // Fallback to mock
          setReviews([
            { name: "Sarah Chen", user: { name: "Sarah Chen" }, rating: 5, comment: "Orbyn completely changed how I travel. The curation is unparalleled." },
            { name: "James Mitchell", user: { name: "James Mitchell" }, rating: 5, comment: "The booking flow is seamless, the UI is stunning, and the properties are world-class." },
            { name: "Aiko Tanaka", user: { name: "Aiko Tanaka" }, rating: 5, comment: "I've used every booking platform. Orbyn stands apart with its attention to detail." },
          ]);
        }
      } catch (err) {
        console.error("Testimonials fetch error:", err);
      }
    };
    fetchReviews();
  }, []);
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[200px]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3">
            Loved by <span className="text-gradient">Travelers</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((t, i) => (
            <motion.div
              key={t._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-8 relative group"
            >
              <Quote size={24} className="text-primary/30 mb-4" />
              <p className="text-gray-300 leading-relaxed mb-6 h-24 overflow-hidden line-clamp-4">{t.comment}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  {t.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.user?.name || "Guest"}</p>
                  <p className="text-xs text-gray-500">{t.property?.title || "Luxury Traveler"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
