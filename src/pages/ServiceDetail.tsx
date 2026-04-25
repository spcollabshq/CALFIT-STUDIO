/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { dbService } from '../services/firebaseService';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await dbService.getService(id);
        setService(data || null);
      } catch (err) {
        setError('Transmission error. Class schematic failed to load.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="text-brand animate-spin" size={48} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <AlertTriangle className="text-red-500 mx-auto" size={48} />
          <p className="text-xl text-white/60">{error || 'Class not found.'}</p>
          <Link to="/services" className="btn-primary">Back to Programs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={service.image} 
            className="w-full h-full object-cover grayscale opacity-50"
            alt={service.title}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 pb-16">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/50 hover:text-brand transition-colors mb-8 uppercase text-xs font-bold tracking-widest">
            <ArrowLeft size={16} /> Back to Programs
          </Link>
          <div className="max-w-4xl">
            <span className="label-mono text-brand mb-4 block">{service.category}</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase mb-6 leading-[0.8]">
              {service.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">{service.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-4xl font-black uppercase mb-8">What You’ll Get</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">{service.fullDescription}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-6 border border-line bg-surface/30">
                    <CheckCircle2 className="text-brand shrink-0" />
                    <span className="text-white/80 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-10 bg-surface/50 border-l-4 border-brand">
              <h3 className="text-2xl font-black uppercase mb-4">Who It’s For</h3>
              <p className="text-white/60 leading-relaxed italic">{service.whoIsItFor}</p>
            </section>
          </div>

          {/* Sidebar / CTA */}
          <aside className="space-y-8">
            <div className="glass-card sticky top-32 p-8 space-y-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 uppercase tracking-widest">Class Duration</span>
                <span className="font-bold text-brand">{service.duration}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-8 border-b border-line">
                <span className="text-white/40 uppercase tracking-widest">Skill Level</span>
                <span className="font-bold">{service.level}</span>
              </div>

              <div className="space-y-4">
                <Link to={`/booking/select-slot?service=${encodeURIComponent(service.title)}`} className="btn-primary w-full">
                  Book This Class
                </Link>
                <Link to="/schedule" className="btn-secondary w-full">
                  View Schedule
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button className="flex-1 border border-line p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex-1 border border-line p-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-wider">
                  <Heart size={14} /> Wishlist
                </button>
              </div>
            </div>
            
            <div className="p-8 border border-dashed border-line">
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                * All classes are limited in capacity to ensure quality instruction. Please book at least 2 hours in advance.
              </p>
              <Link to="/legal/refund-policy" className="text-brand text-[10px] uppercase font-bold tracking-widest hover:underline">
                Refund & Cancellation Policy
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
