"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, Globe, MapPin, Heart, ShoppingBag, Plane, Train, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const navLinks = [
  { name: "Destinations", href: "/destinations", icon: MapPin },
  { name: "Stays", href: "/stays", icon: HomeIcon },
  { name: "Flights", href: "/flights", icon: Plane },
  { name: "Trains", href: "/trains", icon: Train },
  { name: "Experiences", href: "/experiences", icon: Globe },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            O
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter">ORBYN<span className="text-primary">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${pathname === link.href ? "text-primary" : "text-gray-400"}`}
            >
              {link.name}
              {pathname === link.href && <motion.div layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary" />}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          
          <div className="h-4 w-px bg-white/10" />

          {isAuthenticated ? (
            <Link href="/profile" className="flex items-center gap-3 group">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Welcome back,</p>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user?.name?.split(' ')[0]}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 group-hover:border-primary/50 transition-all">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Log In</Link>
              <Link href="/signup" className="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-primary/20 active:scale-95">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden relative z-10 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 bg-background z-40 lg:hidden flex flex-col p-8 pt-28">
            <div className="space-y-6">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-2xl font-display font-bold">
                    <link.icon className="text-primary" size={24} />
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl glass">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{user?.name?.charAt(0)}</div>
                    <div>
                      <p className="text-lg font-bold">{user?.name}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full py-4 text-red-400 font-bold border border-red-500/20 rounded-2xl">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 text-center text-white font-bold border border-white/10 rounded-2xl">Log In</Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 text-center bg-primary text-white font-bold rounded-2xl shadow-lg">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
