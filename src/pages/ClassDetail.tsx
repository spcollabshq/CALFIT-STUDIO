/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Clock, Users, Calendar, ArrowLeft, ShieldCheck, Zap, Loader2, AlertTriangle } from 'lucide-react';
import { dbService } from '../services/firebaseService';

export default function ClassDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const schedule = await dbService.getSchedule();
        const session = schedule?.find(s => s.id === id);
        
        if (!session) {
          setError('Session not found.');
          return;
        }

        const [service, trainer] = await Promise.all([
          dbService.getService(session.serviceId),
          dbService.getTrainer(session.trainerId)
        ]);

        setData({ session, service, trainer });
      } catch (err) {
        setError('Synchronized session schematic failed to load.');
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

  if (error || !data?.session || !data?.service || !data?.trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <AlertTriangle className="text-red-500 mx-auto" size={48} />
          <p className="text-xl text-white/60">{error || 'Session synchronization failed.'}</p>
          <Link to="/schedule" className="btn-primary space-x-2"><ArrowLeft size={16}/><span>Back to Schedule</span></Link>
        </div>
      </div>
    );
  }

  const { session, service, trainer } = data;

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="mb-12">
        <Link to="/schedule" className="inline-flex items-center gap-2 text-white/50 hover:text-brand transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> Back to Schedule
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div>
            <span className="label-mono text-brand mb-4 block">Session Preview</span>
            <h1 className="text-6xl font-black uppercase mb-6 leading-none tracking-tighter">
              {service.title} <span className="text-white/20 text-3xl font-normal block mt-2">{session.day} {session.startTime}</span>
            </h1>
            <div className="flex flex-wrap gap-6 pt-6 border-t border-line">
              <div className="flex items-center gap-3">
                <Clock className="text-brand" size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{service.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-brand" size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{service.level} Level</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand" size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Coach {trainer.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="aspect-video w-full overflow-hidden border border-line">
              <img 
                src={service.image} 
                className="w-full h-full object-cover grayscale opacity-70"
                alt={service.title}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase">About this session</h3>
              <p className="text-white/60 leading-relaxed">{service.description}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-10 space-y-8 lg:sticky lg:top-32">
            <h3 className="text-2xl font-black uppercase border-b border-line pb-6">Secure Your Spot</h3>
            
            <div className="space-y-6">
              <div className="p-6 bg-black/40 border border-line flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight">{session.day}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-mono">{session.startTime} – {session.endTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase font-mono">Available Slots</p>
                  <p className="text-xl font-black text-brand">{session.availableSlots}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/booking/summary" className="btn-primary w-full py-5 text-lg group">
                  Book Now
                  <Zap className="fill-current group-hover:scale-125 transition-transform" size={18} />
                </Link>
                <div className="text-center">
                   <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                    Secure your spot before it fills up
                   </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-line">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 shrink-0">
                  <img src={trainer.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight">{trainer.name}</h4>
                  <p className="text-[10px] text-white/40 uppercase font-mono">{trainer.specialty}</p>
                  <Link to={`/trainers/${trainer.id}`} className="text-brand text-[10px] font-bold uppercase hover:underline mt-2 inline-block">
                    View Coach Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
