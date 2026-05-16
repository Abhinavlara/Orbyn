"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  { slug: 'santorini', name: 'Santorini', country: 'Greece', stays: 124, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800' },
  { slug: 'bali', name: 'Bali', country: 'Indonesia', stays: 450, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800' },
  { slug: 'kyoto', name: 'Kyoto', country: 'Japan', stays: 89, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800' },
  { slug: 'zermatt', name: 'Zermatt', country: 'Switzerland', stays: 56, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800' },
  { slug: 'amalfi', name: 'Amalfi', country: 'Italy', stays: 210, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800' },
  { slug: 'jaipur', name: 'Jaipur', country: 'India', stays: 112, image: 'https://images.unsplash.com/photo-1599661046289-e31897856741?q=80&w=800' },
];

export default function FeaturedDestinations() {
  return (
    <section className="py-20 px-6 md:px-12 relative">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trending <span className="text-gradient">Destinations</span></h2>
            <p className="text-gray-400 max-w-xl">The most sought-after places for your next unforgettable journey.</p>
          </div>
          <Link href="/destinations" className="text-primary hover:underline font-medium mt-4 md:mt-0">Discover all →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/destinations/${dest.slug}`}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 border border-white/10">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${dest.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <ArrowUpRight size={20} />
                  </div>

                  <div className="absolute bottom-8 left-8">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">{dest.country}</span>
                    <h3 className="text-3xl font-display font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-gray-400 text-sm">{dest.stays} premium properties</p>
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
