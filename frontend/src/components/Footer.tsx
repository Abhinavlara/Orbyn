"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Send, Camera, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Cancellation", href: "/cancellation" },
    { label: "Contact Us", href: "/contact" },
  ],
  Hosting: [
    { label: "Become a Host", href: "/host" },
    { label: "Host Resources", href: "/host-resources" },
    { label: "Community", href: "/community" },
    { label: "Responsible Hosting", href: "/responsible-hosting" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#050505]">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-white">
              ORBYN<span className="text-primary">.</span>
            </Link>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              The world&apos;s most premium travel and booking platform. Discover extraordinary stays.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[Globe, Send, Camera, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Orbyn. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-600 text-sm">
            <span className="flex items-center gap-2"><MapPin size={14} />Global</span>
            <span className="flex items-center gap-2"><Phone size={14} />+1 (800) ORBYN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
