"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import { Search, SlidersHorizontal, X, MapPin, Star, DollarSign } from "lucide-react";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";

export default function StaysPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('city') || "";
  
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.getProperties();
        if (res.properties) {
          // Add default image logic for DB properties to match UI
          const formatted = res.properties.map((p: any) => ({
            id: p._id,
            title: p.title,
            location: `${p.location.city}, ${p.location.country}`,
            price: p.price,
            rating: p.ratings?.average || 0,
            reviews: p.ratings?.count || 0,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000&auto=format&fit=crop"
          }));
          setAllProperties(formatted);
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filtered = allProperties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesRating = p.rating >= minRating;
    return matchesSearch && matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            Explore <span className="text-gradient">Stays</span>
          </h1>
          <p className="text-gray-500 mt-2">Find your perfect place from our curated collection</p>
        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row items-stretch gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search destinations, properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border transition-colors ${
              showFilters ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <DollarSign size={14} /> Price Range
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Star size={14} /> Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        minRating === r ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-gray-400"
                      }`}
                    >
                      {r === 0 ? "All" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin size={14} /> Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Villa", "Hotel", "Apartment", "Cabin"].map((t) => (
                    <button
                      key={t}
                      className="px-4 py-2 rounded-lg text-sm border border-white/10 text-gray-400 hover:border-primary hover:text-primary transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">{filtered.length} properties found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((prop, i) => (
            <PropertyCard key={prop.id} {...prop} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No properties match your filters.</p>
            <button
              onClick={() => { setSearch(""); setPriceRange([0, 1000]); setMinRating(0); }}
              className="text-primary mt-4 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
