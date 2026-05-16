"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home, BarChart3, Calendar, PlusCircle, Settings, LogOut, MapPin, DollarSign, Eye, Star, TrendingUp, Users, Image as ImageIcon, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "listings", label: "My Listings", icon: Home },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "add", label: "Add Property", icon: PlusCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function HostDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [myListings, setMyListings] = useState<any[]>([]);
  const [hostBookings, setHostBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", city: "", country: "", price: "", amenities: "" });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && user?.role !== 'host' && user?.role !== 'admin') {
      toast.error("Access denied. Host account required.");
      router.push("/dashboard");
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [listingsRes, bookingsRes] = await Promise.all([
          api.getProperties({ hostId: user._id }),
          api.getHostBookings()
        ]);
        
        if (listingsRes.properties) setMyListings(listingsRes.properties);
        if (bookingsRes && !bookingsRes.message) setHostBookings(bookingsRes);
      } catch (err) {
        console.error("Host Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleSubmitProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', JSON.stringify({ city: formData.city, country: formData.country, address: `${formData.city}, ${formData.country}` }));
      data.append('price', formData.price);
      data.append('amenities', formData.amenities);
      
      selectedImages.forEach(image => {
        data.append('images', image);
      });

      const res = await api.createProperty(data);
      if (res._id) {
        toast.success("Property published!");
        setFormData({ title: "", description: "", city: "", country: "", price: "", amenities: "" });
        setSelectedImages([]);
        setActiveTab("listings");
        const updated = await api.getProperties({ hostId: user._id });
        if (updated.properties) setMyListings(updated.properties);
      } else {
        toast.error(res.message || "Failed to publish property");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (authLoading || isLoading) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Loading Host Dashboard...</div>;
  if (!user) return null;

  const totalRevenue = hostBookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.totalPrice : 0), 0);
  const totalBookings = hostBookings.length;
  const avgRating = myListings.reduce((sum, l) => sum + (l.ratings?.average || 0), 0) / (myListings.length || 1);

  const statsCards = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", icon: DollarSign, color: "text-green-400" },
    { label: "Total Bookings", value: totalBookings.toString(), change: "+8.3%", icon: Calendar, color: "text-blue-400" },
    { label: "Total Listings", value: myListings.length.toString(), change: "+15.2%", icon: Home, color: "text-purple-400" },
    { label: "Avg Rating", value: avgRating.toFixed(2), change: "+0.3%", icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 sticky top-28"
            >
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-xs text-primary">Host Dashboard</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
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
          <div className="lg:col-span-4">
            {/* Overview */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h2 className="text-2xl font-display font-bold">Host Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsCards.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <s.icon size={20} className={s.color} />
                        <span className="text-xs text-green-400 flex items-center gap-1"><TrendingUp size={12} /> {s.change}</span>
                      </div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {hostBookings.length > 0 ? hostBookings.slice(0, 3).map((b) => (
                      <div key={b._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold uppercase">
                            {b.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{b.user?.name}</p>
                            <p className="text-xs text-gray-500">{b.property?.title}</p>
                          </div>
                        </div>
                        <span className="font-medium text-sm">${b.totalPrice}</span>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">No recent bookings.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Listings */}
            {activeTab === "listings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold">My Listings</h2>
                  <button onClick={() => setActiveTab("add")} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-blue-600 transition">
                    <PlusCircle size={16} /> Add Property
                  </button>
                </div>
                <div className="space-y-4">
                  {myListings.length > 0 ? myListings.map((l, i) => (
                    <motion.div
                      key={l._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4"
                    >
                      <div 
                        className="w-full md:w-48 h-36 rounded-xl bg-cover bg-center flex-shrink-0" 
                        style={{ backgroundImage: `url(${l.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=400'})` }} 
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{l.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin size={14} /> {l.location?.city}, {l.location?.country}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">active</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                          <div><p className="text-lg font-bold">${l.price}</p><p className="text-xs text-gray-500">/ night</p></div>
                          <div><p className="text-lg font-bold">{l.ratings?.average || 0}</p><p className="text-xs text-gray-500">Rating</p></div>
                          <div><p className="text-lg font-bold">0</p><p className="text-xs text-gray-500">Views</p></div>
                          <div><p className="text-lg font-bold">{l.ratings?.count || 0}</p><p className="text-xs text-gray-500">Reviews</p></div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-gray-500">You haven't listed any properties yet.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Host Bookings */}
            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Bookings</h2>
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-gray-500">
                        <th className="text-left py-4 px-6 font-medium">Guest</th>
                        <th className="text-left py-4 px-6 font-medium hidden md:table-cell">Property</th>
                        <th className="text-left py-4 px-6 font-medium hidden lg:table-cell">Dates</th>
                        <th className="text-left py-4 px-6 font-medium">Total</th>
                        <th className="text-left py-4 px-6 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hostBookings.map((b) => (
                        <tr key={b._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 px-6 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold uppercase">
                                {b.user?.name?.charAt(0)}
                              </div>
                              {b.user?.name}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-400 hidden md:table-cell">{b.property?.title}</td>
                          <td className="py-4 px-6 text-sm text-gray-400 hidden lg:table-cell">
                            {new Date(b.dates?.checkIn).toLocaleDateString()} → {new Date(b.dates?.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-sm font-medium">${b.totalPrice}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              b.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                            }`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Add Property */}
            {activeTab === "add" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Add New Property</h2>
                <form onSubmit={handleSubmitProperty} className="glass rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-2 block">Property Title</label>
                      <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Luxury Villa in Santorini" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-2 block">Description</label>
                      <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your property..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none resize-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">City</label>
                      <input required type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Santorini" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Country</label>
                      <input required type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Greece" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Price per Night ($)</label>
                      <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="350" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Amenities (comma separated)</label>
                      <input type="text" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} placeholder="WiFi, Pool, Kitchen..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400 mb-2 block">Property Images</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-primary/50 transition cursor-pointer"
                      >
                        <ImageIcon size={32} className="text-gray-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          {selectedImages.length > 0 ? `${selectedImages.length} images selected` : "Drag & drop images or browse"}
                        </p>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files) {
                              setSelectedImages(Array.from(e.target.files));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <PlusCircle size={18} /> {isSubmitting ? "Publishing..." : "Publish Property"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Host Settings</h2>
                <div className="glass rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Business Name</label>
                      <input type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <button className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
