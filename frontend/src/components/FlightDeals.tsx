"use client";

import { motion } from "framer-motion";
import { Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

const deals = [
  { from: 'BOM', to: 'DEL', price: 4200, airline: 'IndiGo', logo: 'https://www.vectorlogo.zone/logos/indigo/indigo-icon.svg' },
  { from: 'DEL', to: 'GOI', price: 5800, airline: 'Air India', logo: 'https://www.vectorlogo.zone/logos/airindia/airindia-icon.svg' },
  { from: 'BLR', to: 'MAA', price: 2900, airline: 'SpiceJet', logo: 'https://www.vectorlogo.zone/logos/spicejet/spicejet-icon.svg' },
  { from: 'CCU', to: 'BOM', price: 6500, airline: 'Vistara', logo: 'https://www.vectorlogo.zone/logos/vistara/vistara-icon.svg' },
];

export default function FlightDeals() {
  return (
    <section className="py-20 px-6 md:px-12 bg-background">
      <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Best Flight <span className="text-gradient">Deals</span></h2>
          <p className="text-gray-400 max-w-xl">Fly to your favorite destinations at the lowest prices this week.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all group"
            >
              <Link href={`/flights?from=${deal.from}&to=${deal.to}`} className="block">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <img src={deal.logo} alt={deal.airline} className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">{deal.airline}</span>
                  </div>
                  <Plane size={16} className="text-primary -rotate-45" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-2xl font-bold">{deal.from}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Origin</p>
                  </div>
                  <div className="flex-1 h-px bg-white/10 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{deal.to}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Destination</p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Starting from</p>
                    <p className="text-xl font-bold text-primary">₹{deal.price}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight size={14} />
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
