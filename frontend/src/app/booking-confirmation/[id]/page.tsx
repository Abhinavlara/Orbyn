"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  User, 
  Ticket,
  ChevronRight,
  Plane,
  Train,
  Home
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // Trigger confetti here if library was installed
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-[3rem] p-8 md:p-12 text-center border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-8 border border-green-500/20"
          >
            <CheckCircle2 size={48} />
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Booking <span className="text-green-500">Confirmed!</span></h1>
          <p className="text-gray-400 mb-8">Your journey starts here. A confirmation email has been sent to your registered address.</p>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 mb-10 text-left">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Booking ID</p>
                <p className="text-lg font-mono font-bold text-primary">ORB-{id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                <Ticket size={24} />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Ticket size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="text-sm font-bold">Premium Stay / Journey</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">A</div>
                <p className="text-sm font-medium">1 Adult · Confirmed</p>
              </div>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Download size={18} /> Download Ticket
            </button>
            <Link href="/profile/bookings" className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
              My Bookings <ArrowRight size={18} />
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            Need help? Contact our 24/7 support at <span className="text-primary hover:underline cursor-pointer">support@orbyn.com</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
