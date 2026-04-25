/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Zap, Clock, Users, Star, Loader2 } from 'lucide-react';
import { dbService } from '../services/firebaseService';
import { Service } from '../types';

export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servData, revsData] = await Promise.all([
          dbService.getServices(),
          dbService.getReviews(),
        ]);
        setServices(servData || []);
        setReviews((revsData || []).slice(0, 2)); // Show only top 2
      } catch (err) {
        console.error('Home data sync failure');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, filter: 'grayscale(1) contrast(1.1)' }}
            animate={{ scale: 1, filter: 'grayscale(0.8) contrast(1)' }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Gym Atmosphere"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(223,255,0,0.05),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <span className="label-mono mb-6 block drop-shadow-md">Precision • Power • Performance</span>
            <h1 className="text-7xl md:text-[10rem] font-black uppercase mb-8 leading-[0.85] tracking-tighter italic">
              Level <span className="text-brand text-stroke-brand">Up</span> <br />
              <span className="relative">
                Your Life
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-2 w-full bg-brand origin-left"
                />
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-12 max-w-xl leading-relaxed">
              Find the perfect burnout. From high-octane CrossFit to mindful Yoga, calibrate your body at the city's most advanced fitness hub.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking/select-slot" className="btn-primary group h-16 px-10">
                Book a Session
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services" className="btn-secondary h-16 px-10">
                Explore Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 border-y border-line bg-surface/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border border-line flex items-center justify-center text-brand">
                <Trophy size={32} />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase tracking-tight">Expert Trainers</h3>
                <p className="text-sm text-white/50">Certified professional coaching</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border border-line flex items-center justify-center text-brand">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase tracking-tight">7 AM – 12 AM</h3>
                <p className="text-sm text-white/50">Flexible timings for your schedule</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border border-line flex items-center justify-center text-brand">
                <Zap size={32} />
              </div>
              <div>
                <h3 className="font-display font-bold uppercase tracking-tight">Modern Studio</h3>
                <p className="text-sm text-white/50">Beginner to Advanced programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <span className="label-mono mb-4 block">Our Programs</span>
              <h2 className="text-5xl font-black uppercase mb-6 leading-none">Find Your Perfect Workout</h2>
              <p className="text-white/60">Choose from a variety of classes designed to build strength, flexibility, and mental resilience.</p>
            </div>
            <Link to="/services" className="btn-secondary py-2 px-6 flex items-center gap-2 group">
              View All Services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="animate-spin text-brand" size={32} />
              </div>
            ) : (
              services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative h-[400px] overflow-hidden"
                >
                  <img 
                    src={service.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    alt={service.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <span className="label-mono text-brand mb-2 block">{service.category}</span>
                    <h3 className="text-2xl font-black uppercase mb-4">{service.title}</h3>
                    <Link 
                      to={`/services/${service.id}`}
                      className="text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <Star size={400} className="text-brand" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="label-mono text-brand mb-4 block">Success Stories</span>
            <h2 className="text-5xl font-black uppercase mb-4 leading-none">Loved by Our Members</h2>
            <p className="text-white/60">Rated 4.4 by 700+ fitness enthusiasts across the city.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="animate-spin text-brand" size={32} />
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="glass-card flex flex-col gap-6">
                  <div className="flex gap-1 text-brand">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-xl italic font-display text-white/90">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold uppercase tracking-tight">{review.userName}</h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest">{review.timestamp?.toDate().toLocaleDateString() || 'Recent'}</p>
                    </div>
                    <Users className="text-white/10" size={32} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-brand text-black">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-none italic">
            Are You Ready to Push Your Limits?
          </h2>
          <p className="text-xl font-medium mb-12 opacity-80">
            Join the CalFit community today and get a complimentary session with an expert trainer.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link to="/auth" className="bg-black text-white px-10 py-5 font-display font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all text-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

