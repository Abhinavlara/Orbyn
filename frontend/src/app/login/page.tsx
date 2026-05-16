"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, fetchProfile } = useAuthStore();
  const [authMethod, setAuthMethod] = useState<'email' | 'otp'>('otp');
  
  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [timer, setTimer] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOTP(phone);
      if (res.success) {
        setStep(2);
        setTimer(60);
        // Show OTP in toast for development
        if (res.otp) {
          toast.success(`DEV MODE: OTP is ${res.otp}`, { duration: 8000, icon: '🔑' });
        } else {
          toast.success("OTP sent to your mobile number");
        }
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) return toast.error("Enter 6-digit OTP");
    setIsLoading(true);
    try {
      const res = await api.verifyOTP({ identifier: phone, otp });
      if (res.token) {
        api.setToken(res.token);
        await fetchProfile();
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/5">
          {/* Auth Method Switcher */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-8">
            <button onClick={() => setAuthMethod('otp')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${authMethod === 'otp' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              Mobile OTP
            </button>
            <button onClick={() => setAuthMethod('email')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${authMethod === 'email' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              Email Login
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && authMethod === 'otp' && (
            <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
              <p className="text-xs text-yellow-500 font-bold uppercase tracking-wider">🛠️ DEV MODE ACTIVE</p>
              <p className="text-sm text-yellow-200 mt-1">Use OTP: <span className="font-mono font-bold">123456</span></p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMethod === 'otp' ? (
              <motion.div key="otp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {step === 1 ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-bold">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3">
                          <img src="https://flagcdn.com/in.svg" className="w-4 h-3 rounded-sm" />
                          <span className="text-sm font-bold">+91</span>
                        </div>
                        <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-24 pr-4 text-white focus:border-primary outline-none transition-all" />
                      </div>
                    </div>
                    <button onClick={handleSendOTP} disabled={isLoading} className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all neon-glow">
                      {isLoading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">Change Number</button>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-bold">Verification Code</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-mono tracking-[0.5em] text-center focus:border-primary outline-none transition-all" />
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Didn't receive it? {timer > 0 ? <span className="text-primary font-bold">Resend in {timer}s</span> : <button onClick={handleSendOTP} className="text-primary font-bold hover:underline">Resend Now</button>}
                      </p>
                    </div>
                    <button onClick={handleVerifyOTP} disabled={isLoading} className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all neon-glow">
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-bold">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-primary outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-bold">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white focus:border-primary outline-none" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all neon-glow">
                    {isLoading ? "Logging in..." : "Login to Orbyn"} <ArrowRight size={18} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-white/5">
            <button onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <Link href="/signup" className="text-primary hover:underline font-bold">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
