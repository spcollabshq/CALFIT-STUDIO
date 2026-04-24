/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dbService } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { user, profile } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: profile?.fullName || '',
      email: user?.email || '',
    }
  });

  // Re-sync if profile loads late
  useEffect(() => {
    if (profile || user) {
      reset({
        name: profile?.fullName || '',
        email: user?.email || '',
      });
    }
  }, [profile, user, reset]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setServerError(null);
      await dbService.saveContactMessage(data.name, data.email, data.message);
      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      console.error('Firestore Contact Error:', err);
      setServerError('Communication relay failure. Potential offline state.');
    }
  };

  return (
    <div className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mb-16">
        <span className="label-mono text-brand mb-4 block">Communication</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none italic tracking-tighter">Get in Touch</h1>
        <p className="text-xl text-white/60">We’re here to help you start your fitness journey. Reach out with any questions about our programs or memberships.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Form */}
        <div className="p-10 border border-line bg-surface/50 backdrop-blur-sm relative overflow-hidden">
          {isSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-brand/10 text-brand flex items-center justify-center rounded-full">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black uppercase">Transmission Received</h2>
              <p className="text-white/60">Our team will get back to you within 24 hours.</p>
              <button onClick={() => setIsSubmitted(false)} className="btn-secondary">New Message</button>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="label-mono mb-3 block">Full Name</label>
                  <input 
                    {...register('name')}
                    type="text" 
                    className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-line'} px-4 py-4 focus:outline-none focus:border-brand transition-colors text-white`}
                    placeholder="Alex Rivera"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 tracking-widest">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label-mono mb-3 block">Email Protocol</label>
                  <input 
                    {...register('email')}
                    type="email" 
                    className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-line'} px-4 py-4 focus:outline-none focus:border-brand transition-colors text-white`}
                    placeholder="pro@calfit.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 tracking-widest">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="label-mono mb-3 block">Inquiry Specification</label>
                <textarea 
                  {...register('message')}
                  rows={6} 
                  className={`w-full bg-black border ${errors.message ? 'border-red-500' : 'border-line'} px-4 py-4 focus:outline-none focus:border-brand transition-colors text-white resize-none`}
                  placeholder="Tell us about your fitness mission..."
                />
                {errors.message && <p className="text-red-500 text-[10px] uppercase font-bold mt-2 tracking-widest">{errors.message.message}</p>}
              </div>

              {serverError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
                  {serverError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-5 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Deploy Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase border-b border-brand pb-4">Info</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 border border-line flex items-center justify-center text-brand shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="label-mono mb-1">Call Us</p>
                    <p className="text-xl font-bold">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 border border-line flex items-center justify-center text-brand shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="label-mono mb-1">Email</p>
                    <p className="text-xl font-bold">hello@calfitstudio.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black uppercase border-b border-brand pb-4">Visit Us</h3>
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-line flex items-center justify-center text-brand shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="label-mono mb-1">Location</p>
                  <p className="text-xl font-bold leading-tight">12th Main Rd, Indiranagar, Bangalore, Karnataka 560038</p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-video border border-line grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand/10" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-black text-white px-8 py-4 border border-brand font-black uppercase text-sm tracking-widest shadow-2xl">
                 Open in Maps
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
