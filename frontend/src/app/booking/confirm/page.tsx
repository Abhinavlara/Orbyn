"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, MapPin, Calendar, Users, ArrowRight, Shield, QrCode, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";

const steps = ["Details", "Payment", "Confirmation"];

export default function BookingConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }
      try {
        // Since we don't have getBookingById, we use getBookings and filter
        const res = await api.getBookings();
        const found = res.bookings?.find((b: any) => b._id === bookingId);
        if (found) {
          setBooking(found);
        } else {
          toast.error("Booking not found");
        }
      } catch (err) {
        console.error("Fetch booking error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      const res = await api.createCheckoutSession(bookingId!);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error("Payment initialization failed");
    }
  };

  if (isLoading) return <div className="min-h-screen pt-28 flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Loading...</div>;
  if (!booking && bookingId) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Booking not found.</div>;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i <= step ? "bg-primary text-white" : "bg-white/5 text-gray-500 border border-white/10"
              }`}>
                {i < step ? <Check size={18} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden md:block ${i <= step ? "text-white" : "text-gray-500"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-16 h-px ${i < step ? "bg-primary" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Guest Details */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-display font-bold mb-6">Guest Details</h2>
              <div className="glass rounded-2xl p-6 space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                </div>
              </div>
              <button onClick={() => setStep(1)} className="w-full mt-6 bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Continue to Payment <ArrowRight size={18} />
              </button>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 sticky top-28">
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <div 
                  className="rounded-xl overflow-hidden h-40 mb-4 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${booking?.property?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600'})` }} 
                />
                <h4 className="font-semibold">{booking?.property?.title || "Luxury Property"}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {booking?.property?.location?.city}, {booking?.property?.location?.country}
                </p>
                <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} /> 
                    {booking ? `${new Date(booking.dates.checkIn).toLocaleDateString()} – ${new Date(booking.dates.checkOut).toLocaleDateString()}` : "Dates TBD"}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={14} /> {booking?.guests?.adults || 0} adults, {booking?.guests?.children || 0} children
                  </div>
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${booking?.totalPrice || 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>${booking?.totalPrice || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-6">Payment</h2>
            <div className="glass rounded-2xl p-6 space-y-5 text-center py-12">
              <Shield size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold">Secure Stripe Payment</h3>
              <p className="text-gray-400 text-sm px-10">
                You will be redirected to Stripe's secure checkout page to complete your payment for <strong>{booking?.property?.title}</strong>.
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/200px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-6 opacity-50" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-xl glass border border-white/10 text-gray-400 hover:text-white transition-colors font-medium">
                Back
              </button>
              <button onClick={handlePayment} className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Pay ${booking?.totalPrice} <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3">Booking Confirmed!</h2>
            <p className="text-gray-400 mb-8">Your reservation at Luxury Villa in Santorini has been confirmed. A confirmation email has been sent.</p>

            <div className="glass rounded-2xl p-6 mb-8 text-left space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Booking ID</span><span className="font-mono text-primary">ORB-2024-78A3K</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Property</span><span>Luxury Villa in Santorini</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Dates</span><span>Dec 15 – Dec 20, 2024</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Guests</span><span>2</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Total Paid</span><span className="font-bold text-green-400">$1,795</span></div>
            </div>

            {/* QR Code placeholder */}
            <div className="glass rounded-2xl p-6 mb-8 flex flex-col items-center">
              <QrCode size={80} className="text-primary mb-3" />
              <p className="text-sm text-gray-400">Show this QR at check-in</p>
            </div>

            <div className="flex gap-4">
              <a href="/dashboard" className="flex-1 py-3.5 rounded-xl border border-white/10 text-center text-gray-300 hover:text-white transition">Dashboard</a>
              <a href="/" className="flex-1 bg-primary text-white py-3.5 rounded-xl text-center font-semibold hover:bg-blue-600 transition">Explore More</a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
