"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft,
  Calendar,
  MapPin,
  Plane,
  Train
} from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";

const passengerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().transform(Number).pipe(z.number().min(1).max(120)),
  gender: z.enum(["Male", "Female", "Other"]),
  idType: z.enum(["Aadhaar", "PAN", "Passport"]),
  idNumber: z.string().min(5, "Valid ID required"),
});

const checkoutSchema = z.object({
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentBooking, clearBooking } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      passengers: [{ name: "", age: "" as any, gender: "Male", idType: "Aadhaar", idNumber: "" }],
      email: "",
      phone: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers"
  });

  useEffect(() => {
    if (!currentBooking) {
      router.push('/');
    }
  }, [currentBooking, router]);

  if (!currentBooking) return null;

  const type = searchParams.get('type') || currentBooking.type;

  const handlePayment = async (data: CheckoutFormData) => {
    setIsLoading(true);
    try {
      // 1. Create Order on Backend
      const order = await api.createRazorpayOrder(currentBooking.id);
      
      if (!order || !order.id) {
        throw new Error("Failed to create payment order");
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: order.amount,
        currency: order.currency,
        name: "ORBYN",
        description: `Booking for ${currentBooking.title}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment
            const verifyRes = await api.verifyRazorpayPayment({
              ...response,
              bookingId: currentBooking.id
            });

            if (verifyRes.success) {
              // 4. Finalize Booking in DB
              const bookingData = {
                ...currentBooking,
                passengers: data.passengers,
                contactEmail: data.email,
                contactPhone: data.phone,
                paymentId: response.razorpay_payment_id
              };

              // Redirect to success page
              toast.success("Payment Successful!");
              router.push(`/booking-confirmation/${currentBooking.id}`);
              clearBooking();
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: data.passengers[0].name,
          email: data.email,
          contact: data.phone
        },
        theme: { color: "#3B82F6" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const baseFare = currentBooking.price;
  const gst = Math.round(baseFare * 0.05);
  const serviceFee = 45;
  const total = baseFare + gst + serviceFee;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 bg-background">
      <div className="container mx-auto max-w-6xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> Back to details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8 border border-white/5">
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <User className="text-primary" /> Passenger Details
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit(handlePayment)} className="space-y-10">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Passenger {index + 1}</h3>
                      {index > 0 && (
                        <button type="button" onClick={() => remove(index)} className="text-xs text-red-400 hover:underline">Remove</button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Full Name</label>
                        <input {...register(`passengers.${index}.name`)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary" placeholder="Enter name as per ID" />
                        {errors.passengers?.[index]?.name && <p className="text-xs text-red-500 mt-1">{errors.passengers[index]?.name?.message}</p>}
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Age</label>
                        <input type="number" {...register(`passengers.${index}.age`)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary" />
                        {errors.passengers?.[index]?.age && <p className="text-xs text-red-500 mt-1">{errors.passengers[index]?.age?.message}</p>}
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Gender</label>
                        <select {...register(`passengers.${index}.gender`)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary appearance-none">
                          <option value="Male" className="bg-background">Male</option>
                          <option value="Female" className="bg-background">Female</option>
                          <option value="Other" className="bg-background">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">ID Proof Type</label>
                        <select {...register(`passengers.${index}.idType`)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary appearance-none">
                          <option value="Aadhaar" className="bg-background">Aadhaar Card</option>
                          <option value="PAN" className="bg-background">PAN Card</option>
                          <option value="Passport" className="bg-background">Passport</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">ID Number</label>
                        <input {...register(`passengers.${index}.idNumber`)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary" placeholder="Enter ID number" />
                        {errors.passengers?.[index]?.idNumber && <p className="text-xs text-red-500 mt-1">{errors.passengers[index]?.idNumber?.message}</p>}
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => append({ name: "", age: "" as any, gender: "Male", idType: "Aadhaar", idNumber: "" })} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:border-primary/50 hover:text-white transition-all flex items-center justify-center gap-2">
                  + Add Passenger
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Mail className="text-primary" size={20} /> Contact Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Email Address</label>
                        <input {...register("email")} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary" placeholder="For tickets & updates" />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Phone Number</label>
                        <input {...register("phone")} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-primary" placeholder="10-digit mobile number" />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8 border border-white/5 sticky top-28">
              <h2 className="text-xl font-display font-bold mb-6">Booking Summary</h2>
              
              <div className="flex items-start gap-4 mb-8">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={currentBooking.image || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=200'} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {type === 'flight' && <Plane size={14} className="text-primary" />}
                    {type === 'train' && <Train size={14} className="text-primary" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{type}</span>
                  </div>
                  <h3 className="font-bold text-white line-clamp-1">{currentBooking.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> {currentBooking.dates?.travelDate || currentBooking.dates?.checkIn}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Base Fare ({fields.length} Guest{fields.length > 1 ? 's' : ''})</span>
                  <span className="text-white font-medium">₹{baseFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">GST (5%)</span>
                  <span className="text-white font-medium">₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="text-white font-medium">₹{serviceFee}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-8">
                <div className="flex gap-3">
                  <ShieldCheck className="text-primary shrink-0" size={20} />
                  <p className="text-xs text-gray-400">
                    Your booking is secured with <span className="text-white font-bold">Orbyn Protection</span>. 100% refund on cancellations within 24 hours.
                  </p>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all neon-glow shadow-lg shadow-primary/20"
              >
                {isLoading ? "Processing..." : `Pay ₹${total.toLocaleString()}`} <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-4 mt-6 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" alt="Razorpay" />
                <div className="w-px h-4 bg-white/10" />
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">PCI-DSS Secured</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
