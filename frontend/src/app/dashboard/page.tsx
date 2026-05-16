"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Calendar, Heart, Bell, CreditCard, Settings, LogOut, MapPin, Star, Clock, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "bookings", label: "My Bookings", icon: Calendar },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function UserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading, fetchProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsRes, notificationsRes] = await Promise.all([
          api.getBookings(),
          api.getNotifications()
        ]);
        
        if (bookingsRes && !bookingsRes.message) setBookings(bookingsRes);
        if (notificationsRes && !notificationsRes.message) setNotifications(notificationsRes);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (authLoading || isLoading) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Loading Dashboard...</div>;
  if (!user) return null;

  const savedProperties = user.wishlist || [];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 sticky top-28"
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Tabs */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    {tab.id === "notifications" && notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-4"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Bookings */}
            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">My Bookings</h2>
                <div className="space-y-4">
                  {bookings.length > 0 ? bookings.map((b, i) => (
                    <motion.div
                      key={b._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4 group hover:border-white/20 transition-all"
                    >
                      <div 
                        className="w-full md:w-40 h-32 rounded-xl bg-cover bg-center flex-shrink-0" 
                        style={{ backgroundImage: `url(${b.property?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} 
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">{b.property?.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                              b.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {b.property?.location?.city}, {b.property?.location?.country}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> {new Date(b.dates?.checkIn).toLocaleDateString()} → {new Date(b.dates?.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="font-bold text-primary">${b.totalPrice}</span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 glass rounded-2xl">
                      <p className="text-gray-500">No bookings found.</p>
                      <Link href="/stays" className="text-primary mt-4 inline-block hover:underline">Browse stays</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Saved */}
            {activeTab === "saved" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Saved Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProperties.length > 0 ? savedProperties.map((p: any, i: number) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => router.push(`/property/${p._id}`)}
                    >
                      <div 
                        className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                        style={{ backgroundImage: `url(${p.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} 
                      />
                      <div className="p-5">
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {p.location?.city}, {p.location?.country}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold">${p.price}<span className="text-gray-500 font-normal text-sm">/night</span></span>
                          <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" /> {p.ratings?.average || 0}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-12 glass rounded-2xl">
                      <p className="text-gray-500">Your wishlist is empty.</p>
                      <Link href="/stays" className="text-primary mt-4 inline-block hover:underline">Browse stays</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">Notifications</h2>
                  <button 
                    onClick={async () => {
                      await api.markAllNotificationsRead();
                      toast.success("All notifications marked as read");
                      const updated = notifications.map(n => ({ ...n, read: true }));
                      setNotifications(updated);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <motion.div
                      key={n._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={async () => {
                        if (!n.read) {
                          await api.markNotificationRead(n._id);
                          const updated = notifications.map(notif => notif._id === n._id ? { ...notif, read: true } : notif);
                          setNotifications(updated);
                        }
                      }}
                      className={`glass rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:border-white/20 transition ${!n.read ? "border-l-2 border-l-primary" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        n.type === "booking_confirmed" ? "bg-green-500/20 text-green-400" :
                        n.type === "reminder" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-primary/20 text-primary"
                      }`}>
                        <Bell size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{n.title}</h4>
                        <p className="text-gray-500 text-sm mt-0.5">{n.message}</p>
                        <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                          <Clock size={12} /> {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-12 glass rounded-2xl">
                      <p className="text-gray-500">No notifications.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Payments */}
            {activeTab === "payments" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Payment History</h2>
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-gray-500">
                        <th className="text-left py-4 px-6 font-medium">Property</th>
                        <th className="text-left py-4 px-6 font-medium hidden md:table-cell">Date</th>
                        <th className="text-left py-4 px-6 font-medium">Amount</th>
                        <th className="text-left py-4 px-6 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length > 0 ? bookings.map((b) => (
                        <tr key={b._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 px-6 text-sm">{b.property?.title}</td>
                          <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">{new Date(b.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-sm font-medium">${b.totalPrice}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              b.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {b.paymentStatus?.charAt(0).toUpperCase() + b.paymentStatus?.slice(1)}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-gray-500">No payment history.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Account Settings</h2>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = Object.fromEntries(formData.entries());
                    try {
                      await api.updateProfile(data as any);
                      toast.success("Profile updated!");
                      fetchProfile();
                    } catch (err) {
                      toast.error("Update failed");
                    }
                  }}
                  className="glass rounded-2xl p-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        defaultValue={user.name} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        defaultValue={user.email} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        defaultValue={user.phone || ""} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
