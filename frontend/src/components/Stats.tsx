"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const stats = [
  { label: 'Destinations', value: 10000, suffix: '+' },
  { label: 'Happy Travelers', value: 50000, suffix: '+' },
  { label: 'Rating', value: 4.9, suffix: '★', decimals: 1 },
  { label: 'Countries', value: 150, suffix: '+' },
];

function Counter({ value, decimals = 0, duration = 2 }: { value: number, decimals?: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalMiliseconds = duration * 1000;
      const incrementTime = 50;
      const totalIncrements = totalMiliseconds / incrementTime;
      const incrementValue = (end - start) / totalIncrements;

      const timer = setInterval(() => {
        start += incrementValue;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

export default function Stats() {
  return (
    <section className="py-24 px-6 md:px-12 bg-background relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-3xl glass border border-white/5"
            >
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">
                <Counter value={stat.value} decimals={stat.decimals} />
                <span className="text-primary">{stat.suffix}</span>
              </h3>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
