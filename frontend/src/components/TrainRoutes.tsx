"use client";

import { motion } from "framer-motion";
import { Train, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const routes = [
  { from: 'NDLS', to: 'CSTM', name: 'Rajdhani Express', price: 2850, duration: '15h 30m', type: 'Superfast' },
  { from: 'BNC', to: 'MAS', name: 'Shatabdi Express', price: 1450, duration: '4h 50m', type: 'Express' },
  { from: 'HWH', to: 'NDLS', name: 'Duronto Express', price: 3100, duration: '17h 15m', type: 'Superfast' },
  { from: 'MAO', to: 'PNVL', name: 'Vande Bharat', price: 1950, duration: '7h 45m', type: 'High Speed' },
];

export default function TrainRoutes() {
  return (
    <section className="py-20 px-6 md:px-12 bg-white/[0.01]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Popular Train <span className="text-gradient">Routes</span></h2>
            <p className="text-gray-400 max-w-xl">Reliable and comfortable travel across the Indian railway network.</p>
          </div>
          <Link href="/trains" className="text-primary hover:underline font-medium mt-4 md:mt-0 flex items-center gap-1">View all trains <ArrowRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-6 border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-all" />
              <Link href={`/trains?from=${route.from}&to=${route.to}`} className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <Train size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">{route.type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} /> {route.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{route.name}</h3>
                  <p className="text-sm text-gray-400 font-mono tracking-tighter uppercase">{route.from} <span className="text-primary mx-2">→</span> {route.to}</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-500 uppercase">Fares from</p>
                  <p className="text-2xl font-bold text-white">₹{route.price}</p>
                  <button className="mt-2 text-xs font-bold text-primary group-hover:underline">Check Availability</button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
