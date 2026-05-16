"use client";

import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Mock save to DB
    setIsSubscribed(true);
    toast.success("Welcome to the Orbyn community!");
    setEmail("");
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[3rem] p-12 md:p-20 text-center border border-white/10 shadow-2xl overflow-hidden relative"
        >
          {/* Internal floating orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Join the <span className="text-gradient">Orbyn</span> Community</h2>
            <p className="text-gray-400 text-lg mb-10">
              Subscribe to our newsletter and be the first to know about exclusive deals, new destinations, and travel tips.
            </p>

            {isSubscribed ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-xl font-bold text-white">You're on the list!</p>
                <p className="text-gray-400">Check your inbox for a special welcome gift.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  Subscribe <Send size={18} />
                </button>
              </form>
            )}
            
            <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">No spam, just inspiration. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
