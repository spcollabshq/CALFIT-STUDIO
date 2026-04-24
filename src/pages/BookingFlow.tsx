/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowRight, CreditCard, ShieldCheck, Ticket, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/firebaseService';

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ['Select Slot', 'Summary', 'Payment', 'Result'];
  return (
    <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto overflow-x-auto pb-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3 shrink-0">
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold",
            currentStep > i ? "bg-brand text-black" : currentStep === i ? "border-2 border-brand text-brand" : "border-2 border-line text-white/30"
          )}>
            {currentStep > i ? <Check size={16} /> : i + 1}
          </div>
          <span className={clsx(
            "text-[10px] uppercase font-bold tracking-widest",
            currentStep === i ? "text-white" : "text-white/30"
          )}>
            {step}
          </span>
          {i < steps.length - 1 && <div className="w-12 h-[1px] bg-line mx-4" />}
        </div>
      ))}
    </div>
  );
}

export default function BookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Extract service from query params if available
  const queryParams = new URLSearchParams(location.search);
  const serviceName = queryParams.get('service') || 'HIIT Training';

  const currentStep = location.pathname.includes('select-slot') ? 0 : 
                      location.pathname.includes('summary') ? 1 : 
                      location.pathname.includes('payment') ? 2 : 3;

  useEffect(() => {
    if (!authLoading && !user && !location.pathname.includes('success') && !location.pathname.includes('failure')) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate, location]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="text-brand animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="py-24 container mx-auto px-6">
      <StepIndicator currentStep={currentStep} />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Routes location={location}>
            <Route path="select-slot" element={<SelectSlot serviceName={serviceName} />} />
            <Route path="summary" element={<BookingSummary />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="failure" element={<FailurePage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const SLOTS = ['07:00 AM', '09:00 AM', '11:00 AM', '05:30 PM', '07:30 PM'];

function SelectSlot({ serviceName }: { serviceName: string }) {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black uppercase mb-4 italic tracking-tighter">Choose Your Time</h2>
        <p className="text-white/40">Select an available session for <span className="text-brand font-bold">{serviceName}</span></p>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {SLOTS.map(time => (
          <button 
            key={time}
            onClick={() => navigate('/booking/summary', { state: { time, serviceName } })}
            className="w-full bg-surface border border-line p-8 flex items-center justify-between group hover:border-brand transition-all"
          >
            <div className="flex items-center gap-6">
              <span className="text-2xl font-black font-mono tracking-tighter text-brand">{time}</span>
              <div className="text-left">
                <p className="font-bold uppercase tracking-tight">{serviceName}</p>
                <p className="text-[10px] text-white/30 uppercase font-mono">By Senior Instructor</p>
              </div>
            </div>
            <ArrowRight className="group-hover:translate-x-2 transition-transform text-white/20 group-hover:text-brand" />
          </button>
        ))}
        <div className="pt-10 flex flex-col items-center gap-4">
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest flex items-center gap-2">
            <Ticket size={14} className="text-brand" /> Secure your spot before it fills up
          </p>
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-brand" /> Cancel at least 2 hours before class
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const time = location.state?.time || 'Today, 09:00 AM';
  const serviceName = location.state?.serviceName || 'HIIT Training';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="max-w-lg mx-auto bg-surface border border-line p-10 space-y-10">
        <h2 className="text-3xl font-black uppercase border-b border-line pb-6 italic tracking-tighter">Review Your Booking</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 uppercase tracking-widest">Class</span>
            <span className="font-bold uppercase tracking-tight text-brand">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 uppercase tracking-widest">Date & Time</span>
            <span className="font-bold uppercase tracking-tight">{time}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40 uppercase tracking-widest">Coach</span>
            <span className="font-bold uppercase tracking-tight">Senior Instructor</span>
          </div>
          <div className="pt-6 border-t border-line flex justify-between items-center">
            <span className="text-lg font-black uppercase tracking-widest text-white/40">Total Due</span>
            <span className="text-3xl font-black text-brand">₹499</span>
          </div>
        </div>

        <button onClick={() => navigate('/booking/payment', { state: { time, serviceName } })} className="btn-primary w-full py-5 text-lg">
          Proceed to Payment <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const time = location.state?.time || 'HIIT Training';
  const serviceName = location.state?.serviceName || 'HIIT Training';

  const handlePay = async () => {
    if (!user) return;

    // Accuracy: Check if email is verified as per Firestore rules
    if (!user.emailVerified) {
      alert("Please verify your email address to complete booking.");
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      // Create actual booking in Firestore with accurate time
      await dbService.createBooking(user.uid, serviceName, time);
      navigate('/booking/success');
    } catch (error: any) {
      console.error('Booking Error:', error);
      navigate('/booking/failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="max-w-lg mx-auto space-y-10">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase mb-4 italic tracking-tighter">Complete Payment</h2>
          <p className="text-white/40 uppercase font-mono tracking-widest text-[10px] flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-brand" /> All payments are secured and encrypted
          </p>
        </div>

        <div className="bg-surface border border-line p-10 space-y-6">
          <div className="space-y-4">
            <label className="label-mono">Card Details</label>
            <div className="space-y-4">
               <div className="relative">
                 <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                 <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="w-full bg-black border border-line pl-12 pr-4 py-4 focus:outline-none focus:border-brand text-white" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" defaultValue="12/25" className="bg-black border border-line px-4 py-4 focus:outline-none focus:border-brand text-white" />
                  <input type="password" placeholder="CVV" defaultValue="***" className="bg-black border border-line px-4 py-4 focus:outline-none focus:border-brand text-white" />
               </div>
            </div>
          </div>

          <button 
            onClick={handlePay} 
            disabled={loading}
            className="btn-primary w-full py-5 text-xl relative"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Pay Now ₹499"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessPage() {
  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-xl mx-auto py-20">
      <div className="inline-flex w-24 h-24 bg-brand text-black rounded-full items-center justify-center mb-8 shadow-[0_0_50px_rgba(223,255,0,0.3)]">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-6xl font-black uppercase mb-6 leading-none tracking-tighter italic">Booking Confirmed! 🎉</h2>
      <p className="text-xl text-white/60 mb-12">See you at your class. Your dashboard has been updated.</p>
      <div className="flex flex-col gap-4">
        <Link to="/dashboard" className="btn-primary py-4">View Your Bookings</Link>
        <Link to="/" className="text-white/40 uppercase font-black tracking-widest text-xs hover:text-white transition-colors">Back to Home</Link>
      </div>
    </motion.div>
  );
}

function FailurePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-xl mx-auto py-20">
      <div className="inline-flex w-24 h-24 bg-red-600 text-white rounded-full items-center justify-center mb-8">
        <AlertCircle size={48} />
      </div>
      <h2 className="text-5xl font-black uppercase mb-6 italic tracking-tighter">Payment Failed</h2>
      <p className="text-lg text-white/40 mb-12">Something went wrong while processing your request. Please check your card details and try again.</p>
      <Link to="/booking/payment" className="btn-primary py-4">Retry Payment</Link>
    </motion.div>
  );
}

