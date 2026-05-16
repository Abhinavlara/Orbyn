"use client";

import { motion } from "framer-motion";
import { Mountain, Palmtree, Utensils, Gem, Activity, Landmark, Building, Leaf } from "lucide-react";
import Link from "next/link";

const categories = [
  { id: 'Adventure', name: 'Adventure', icon: Mountain, color: 'from-orange-500/20 to-red-500/20' },
  { id: 'Beach', name: 'Beach', icon: Palmtree, color: 'from-blue-400/20 to-cyan-400/20' },
  { id: 'Food', name: 'Food', icon: Utensils, color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'Luxury', name: 'Luxury', icon: Gem, color: 'from-purple-500/20 to-pink-500/20' },
  { id: 'Wellness', name: 'Wellness', icon: Activity, color: 'from-green-400/20 to-emerald-400/20' },
  { id: 'Culture', name: 'Culture', icon: Landmark, color: 'from-amber-500/20 to-yellow-600/20' },
  { id: 'City', name: 'City', icon: Building, color: 'from-slate-400/20 to-gray-600/20' },
  { id: 'Nature', name: 'Nature', icon: Leaf, color: 'from-lime-400/20 to-green-500/20' },
];

export default function Categories() {
  return (
    <section className="py-20 px-6 md:px-12 bg-background relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Explore by <span className="text-gradient">Category</span></h2>
            <p className="text-gray-400 max-w-xl">From thrill-seeking adventures to serene wellness retreats, find your perfect escape.</p>
          </div>
          <Link href="/stays" className="text-primary hover:underline font-medium mt-4 md:mt-0">View all stays →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={`/stays?category=${cat.id}`} className="flex flex-col items-center">
                <div className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${cat.color} border border-white/5 flex items-center justify-center transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-3`}>
                  <cat.icon size={32} className="text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
