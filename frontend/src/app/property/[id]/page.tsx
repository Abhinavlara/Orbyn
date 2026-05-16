"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Share2, MapPin, Wifi, Car, Waves, Utensils, Wind, Tv, Shield, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";

export default function PropertyDetailPage() {
  const router = useRouter();
  const { setBooking } = useBookingStore();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.getProperty(id);
        if (res && !res.message) {
          setProperty({
            id: res._id,
            title: res.title,
            description: res.description,
            location: res.location,
            price: res.price,
            rating: res.ratings?.average || 0,
            reviewCount: res.ratings?.count || 0,
            images: res.images?.length > 0 ? res.images : ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop"],
            amenities: res.amenities?.map((a: string) => ({ icon: Wifi, label: a })) || [], // simplified for mapping
            host: { name: res.host?.name || "Host", image: res.host?.profileImage || "H", joinedYear: new Date(res.host?.createdAt).getFullYear() || 2024, responseRate: "98%" },
            reviews: [] // To be fetched or populated
          });
        }
      } catch (err) {
        console.error("Failed to load property:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  if (isLoading) return <div className="min-h-screen pt-24 pb-20 flex items-center justify-center text-white">Loading...</div>;
  if (!property) return <div className="min-h-screen pt-24 pb-20 flex items-center justify-center text-white">Property not found.</div>;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Image Gallery */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] mb-8">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${property.images[currentImage]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Nav buttons */}
          <button
            onClick={() => setCurrentImage((currentImage - 1 + property.images.length) % property.images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentImage((currentImage + 1) % property.images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ChevronRight size={20} />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentImage ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-3">
            <button onClick={() => setSaved(!saved)} className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Heart size={18} className={saved ? "fill-red-500 text-red-500" : "text-white"} />
            </button>
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold">{property.title}</h1>
                  <p className="text-gray-400 mt-2 flex items-center gap-1">
                    <MapPin size={16} /> {property.location.address}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full glass text-sm">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  {property.rating} <span className="text-gray-500">({property.reviewCount})</span>
                </div>
              </div>
            </motion.div>

            {/* Host */}
            <div className="flex items-center gap-4 py-6 border-y border-white/10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {property.host.image}
              </div>
              <div>
                <p className="font-semibold">Hosted by {property.host.name}</p>
                <p className="text-sm text-gray-500">Superhost · Joined {property.host.joinedYear} · {property.host.responseRate} response rate</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-400 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl border border-white/5 bg-surface"
                  >
                    <a.icon size={18} className="text-primary" />
                    <span className="text-sm text-gray-300">{a.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Reviews</h2>
              <div className="space-y-6">
                {property.reviews.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          {r.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(r.rating)].map((_, j) => (
                          <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{r.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="h-64 rounded-2xl glass flex items-center justify-center border border-white/5">
                <div className="text-center">
                  <MapPin size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">{property.location.address}</p>
                  <p className="text-gray-600 text-xs mt-1">Interactive map available soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 sticky top-28"
            >
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">${property.price}</span>
                <span className="text-gray-500">/ night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">CHECK-IN</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">CHECK-OUT</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">GUESTS</label>
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl py-3 px-4">
                    <Users size={16} className="text-gray-500" />
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">-</button>
                    <span className="font-medium flex-1 text-center">{guests}</span>
                    <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">+</button>
                  </div>
                </div>
              </div>

              {checkIn && checkOut && (
                <div className="border-t border-white/10 pt-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>${property.price} × {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} nights</span>
                    <span>${property.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Service fee</span>
                    <span>$45</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>${property.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) + 45}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (!checkIn || !checkOut) return alert('Please select dates');
                  
                  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
                  const total = (property.price * nights) + 45;

                  setBooking({
                    id: property.id,
                    type: 'stay',
                    title: property.title,
                    price: total,
                    dates: { checkIn, checkOut },
                    details: {
                      location: property.location.address,
                      guests: { adults: guests, children: 0 }
                    }
                  });
                  
                  router.push(`/checkout?type=stay&id=${property.id}`);
                }}
                className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors neon-glow block text-center"
              >
                Reserve & Pay
              </button>

              <p className="text-center text-gray-600 text-xs mt-3">You won&apos;t be charged yet</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
