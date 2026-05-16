"use client";

import { motion } from "framer-motion";
import { Star, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";
import toast from "react-hot-toast";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  index?: number;
}

export default function PropertyCard({ id, title, location, price, rating, reviews, image, index = 0 }: PropertyCardProps) {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.wishlist) {
      setSaved(user.wishlist.some((p: any) => p._id === id || p === id));
    }
  }, [user, id]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to save properties");
      return;
    }
    try {
      await api.toggleWishlist(id);
      setSaved(!saved);
      fetchProfile(); // Refresh user data to update wishlist globally
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden border border-white/5 bg-surface hover:border-white/10 transition-all duration-300"
    >
      <Link href={`/property/${id}`}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Save */}
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center transition-colors"
          >
            <Heart
              size={16}
              className={saved ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>

          {/* Rating badge */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-xs font-medium text-white flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)} <span className="text-gray-400">({reviews})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin size={14} /> {location}
          </p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-white">${price}</span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
            <span className="text-xs text-gray-600 border border-white/10 px-3 py-1 rounded-full">
              Book Now
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
