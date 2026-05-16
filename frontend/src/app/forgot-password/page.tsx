"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {!sent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold">Reset Password</h1>
              <p className="text-gray-500 mt-2">Enter your email and we&apos;ll send you a reset link</p>
            </div>

            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors neon-glow">
                  Send Reset Link <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail size={28} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">Check Your Email</h1>
            <p className="text-gray-400 mb-8">We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span></p>
            <button onClick={() => setSent(false)} className="text-primary hover:underline text-sm">
              Didn&apos;t receive? Try again
            </button>
          </div>
        )}

        <p className="text-center mt-6">
          <Link href="/login" className="text-gray-500 text-sm flex items-center justify-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
