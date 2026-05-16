"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Home, Calendar, Shield, Flag, LogOut, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "listings", label: "Listings", icon: Home },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "reports", label: "Reports", icon: Flag },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      toast.error("Access denied. Admin account required.");
      router.push("/dashboard");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, propertiesRes, analyticsRes, reportsRes] = await Promise.all([
          api.getAllUsers(),
          api.getProperties(),
          api.getAnalytics(),
          api.getReports()
        ]);
        
        if (usersRes.users) setAllUsers(usersRes.users);
        if (propertiesRes.properties) setAllListings(propertiesRes.properties);
        if (analyticsRes && !analyticsRes.message) setAnalytics(analyticsRes);
        if (Array.isArray(reportsRes)) setReports(reportsRes);
      } catch (err) {
        console.error("Admin Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchData();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleResolveReport = async (id: string) => {
    try {
      await api.updateReportStatus(id, 'resolved');
      setReports(reports.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
      toast.success("Report resolved");
    } catch (err) {
      toast.error("Failed to resolve report");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.deleteUser(id);
      setAllUsers(allUsers.filter(u => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
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

  if (authLoading || isLoading) return <div className="min-h-screen pt-28 flex items-center justify-center text-white">Loading Admin Dashboard...</div>;
  if (!user) return null;

  const statsCards = [
    { label: "Total Users", value: analytics?.totalUsers || allUsers.length, change: "+8.2%", icon: Users, color: "text-blue-400" },
    { label: "Total Listings", value: analytics?.totalProperties || allListings.length, change: "+15.7%", icon: Home, color: "text-purple-400" },
    { label: "Total Bookings", value: analytics?.totalBookings || "0", change: "+22.1%", icon: Calendar, color: "text-green-400" },
    { label: "Revenue", value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`, change: "+18.4%", icon: DollarSign, color: "text-yellow-400" },
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <h3 className="font-semibold">Admin</h3>
                  <p className="text-xs text-red-400 flex items-center gap-1"><Shield size={12} /> Super Admin</p>
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
                    {tab.id === "reports" && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">2</span>
                    )}
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-4">
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
                <h2 className="text-2xl font-display font-bold">Admin Overview</h2>

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

                {/* Platform Activity Chart */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Platform Growth</h3>
                  <div className="h-64 flex items-end justify-between gap-3 px-4">
                    {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-t-lg relative group cursor-pointer"
                        style={{ background: `linear-gradient(to top, rgb(59, 130, 246), rgb(139, 92, 246))` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-black text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap">
                          {h * 12} users
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-3 px-4">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={18} className="text-yellow-400" />
                      <span className="text-sm font-medium">Pending Approvals</span>
                    </div>
                    <p className="text-3xl font-bold">7</p>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Flag size={18} className="text-red-400" />
                      <span className="text-sm font-medium">Open Reports</span>
                    </div>
                    <p className="text-3xl font-bold">2</p>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle size={18} className="text-green-400" />
                      <span className="text-sm font-medium">Active Hosts</span>
                    </div>
                    <p className="text-3xl font-bold">342</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users */}
            {activeTab === "users" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">User Management</h2>
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-gray-500">
                        <th className="text-left py-4 px-6 font-medium">User</th>
                        <th className="text-left py-4 px-6 font-medium hidden md:table-cell">Role</th>
                        <th className="text-left py-4 px-6 font-medium hidden lg:table-cell">Joined</th>
                        <th className="text-left py-4 px-6 font-medium">Status</th>
                        <th className="text-left py-4 px-6 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold uppercase">
                                {u.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === "admin" ? "bg-red-500/20 text-red-400" :
                              u.role === "host" ? "bg-purple-500/20 text-purple-400" :
                              "bg-blue-500/20 text-blue-400"
                            }`}>{u.role}</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 hidden lg:table-cell">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              active
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"><Eye size={16} /></button>
                              <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded-lg hover:bg-red-500/10 transition text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Listing Approvals */}
            {activeTab === "listings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Listing Management</h2>
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-sm text-gray-500">
                        <th className="text-left py-4 px-6 font-medium">Property</th>
                        <th className="text-left py-4 px-6 font-medium hidden md:table-cell">Host</th>
                        <th className="text-left py-4 px-6 font-medium hidden lg:table-cell">Price</th>
                        <th className="text-left py-4 px-6 font-medium">Status</th>
                        <th className="text-left py-4 px-6 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allListings.map((l) => (
                        <tr key={l._id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 px-6 text-sm font-medium">{l.title}</td>
                          <td className="py-4 px-6 text-sm text-gray-400 hidden md:table-cell">{l.host?.name || "Unknown"}</td>
                          <td className="py-4 px-6 text-sm hidden lg:table-cell">${l.price}/night</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                              approved
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"><Eye size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Bookings */}
            {activeTab === "bookings" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">All Bookings</h2>
                <div className="glass rounded-2xl p-6 text-center py-20">
                  <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">All booking data is available through the analytics API.</p>
                  <p className="text-gray-600 text-sm mt-2">{analytics?.totalBookings || 0} total bookings processed</p>
                </div>
              </motion.div>
            )}

            {/* Reports */}
            {activeTab === "reports" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-display font-bold mb-6">Reports & Moderation</h2>
                <div className="space-y-4">
                  {reports.length > 0 ? reports.map((r, i) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-xl p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          r.type === "spam" ? "bg-yellow-500/20 text-yellow-400" :
                          r.type === "safety" ? "bg-orange-500/20 text-orange-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          <Flag size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.property?.title || "Unknown Property"}</p>
                          <p className="text-xs text-gray-500">Reported by {r.reporter?.name || "User"} · {new Date(r.createdAt).toLocaleDateString()} · Type: {r.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.status === "open" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                        }`}>{r.status}</span>
                        {r.status === "open" && (
                          <button 
                            onClick={() => handleResolveReport(r._id)}
                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-20 text-gray-500 glass rounded-2xl">No reports found.</div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
