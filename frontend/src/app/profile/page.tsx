"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Heart, Star, Bell, Edit2, Camera, MapPin, Mail, Phone, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";

const tabs = [
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Edit2 },
];

export default function ProfilePage() {
  const { user, isAuthenticated, fetchProfile, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Handle Google OAuth token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      api.setToken(token);
      fetchProfile();
      // Remove token from URL to keep it clean
      router.replace('/profile');
      toast.success("Logged in with Google!");
    }
  }, [searchParams, fetchProfile, router]);

  useEffect(() => {
    if (!isAuthenticated && !searchParams.get('token')) {
      router.push('/login');
      return;
    }
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const res = await api.getBookings();
        setBookings(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) loadBookings();
  }, [isAuthenticated]);

  const handleUpdateProfile = async () => {
    try {
      await api.updateProfile({ name, phone });
      await fetchProfile();
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    logout();
    router.push('/');
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated || !user) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto max-w-5xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white border-2 border-[#0a0a0a]">
                <Camera size={14} />
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400 flex items-center justify-center md:justify-start gap-1 mt-1"><Mail size={14} /> {user.email}</p>
              <p className="text-xs text-gray-600 mt-1 capitalize">Role: {user.role} · Member since {new Date(user.createdAt).getFullYear()}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors text-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'glass text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
              {isLoading ? (
                <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 glass rounded-2xl animate-pulse" />)}</div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, i) => (
                    <motion.div key={booking._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 flex flex-col md:flex-row gap-4 border border-white/5">
                      <div className="w-full md:w-40 h-28 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{booking.property?.title || 'Property'}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={13} /> {booking.property?.location?.city}, {booking.property?.location?.country}</p>
                        <div className="flex gap-4 mt-3 text-xs text-gray-400">
                          <span>Check-in: {new Date(booking.dates?.checkIn).toLocaleDateString()}</span>
                          <span>Check-out: {new Date(booking.dates?.checkOut).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">${booking.totalPrice}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400">No bookings yet</h3>
                  <p className="text-gray-600 mt-2">Explore amazing stays and book your next adventure!</p>
                  <Link href="/stays" className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">Browse Stays</Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-6">Saved Properties</h2>
              {user.wishlist && user.wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.wishlist.map((prop: any, i: number) => (
                    <motion.div key={prop._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <Link href={`/property/${prop._id || prop}`} className="glass rounded-2xl p-4 flex gap-4 border border-white/5 hover:border-primary/30 transition-all block">
                        <div className="w-24 h-24 rounded-xl bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${prop.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} />
                        <div>
                          <h3 className="font-semibold text-white text-sm">{prop.title || 'Saved Property'}</h3>
                          <p className="text-xs text-gray-500 mt-1">{prop.location?.city || 'View details'}</p>
                          {prop.price && <p className="text-sm font-bold text-primary mt-2">${prop.price}/night</p>}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400">No saved properties</h3>
                  <p className="text-gray-600 mt-2">Click the heart icon on any property to save it here.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-6">My Reviews</h2>
              <div className="text-center py-16">
                <Star size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">Reviews will appear here</h3>
                <p className="text-gray-600 mt-2">After completing a stay, you can leave a review for the host.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              <div className="glass rounded-2xl p-6 space-y-5 max-w-lg">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Email (cannot change)</label>
                  <input type="email" value={email} readOnly className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary focus:outline-none" />
                </div>
                <button onClick={handleUpdateProfile} className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors neon-glow">
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
