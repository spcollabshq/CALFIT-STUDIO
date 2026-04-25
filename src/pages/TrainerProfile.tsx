/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, MessageSquare, Award, Loader2, AlertTriangle } from 'lucide-react';
import { dbService } from '../services/firebaseService';

export default function TrainerProfile() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trainData, servData] = await Promise.all([
          dbService.getTrainers(),
          dbService.getServices(),
        ]);
        const foundTrainer = trainData?.find(t => t.id === id);
        setTrainer(foundTrainer || null);
        setServices(servData || []);
      } catch (err) {
        setError('Trainer dossier missing. Network interruption.');
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

  if (error || !trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <AlertTriangle className="text-red-500 mx-auto" size={48} />
          <p className="text-xl text-white/60">{error || 'Trainer not found.'}</p>
          <Link to="/trainers" className="btn-primary">Return to Squad</Link>
        </div>
      </div>
    );
  }

  const relatedServices = services.filter(s => s.category.toLowerCase().includes(trainer.specialty.split(' ')[0].toLowerCase()));

  return (
    <div className="py-24 container mx-auto px-6">
      <div className="mb-12">
        <Link to="/trainers" className="inline-flex items-center gap-2 text-white/50 hover:text-brand transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft size={16} /> All Trainers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-1">
          <div className="relative aspect-[3/4] border border-line overflow-hidden mb-8">
            <img src={trainer.image} className="w-full h-full object-cover" />
            <div className="absolute top-0 right-0 p-4">
               <div className="bg-brand text-black font-black uppercase text-[10px] px-4 py-2">
                 Senior Pro
               </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="flex-1 btn-primary py-4">Book a Session</button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-16">
          <div>
            <span className="label-mono text-brand mb-4 block">{trainer.specialty} Coach</span>
            <h1 className="text-7xl font-black uppercase mb-6 leading-none">{trainer.name}</h1>
            <div className="flex gap-10 py-8 border-y border-line">
               <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-1">Experience</p>
                  <p className="text-xl font-bold">{trainer.experience}</p>
               </div>
               <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-1">Specialties</p>
                  <p className="text-xl font-bold">{trainer.specialty}</p>
               </div>
               <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mb-1">Rating</p>
                  <div className="flex items-center gap-1 text-brand">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xl font-bold">4.9</span>
                  </div>
               </div>
            </div>
          </div>

          <section>
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
              <MessageSquare size={24} className="text-brand" /> Experience & Bio
            </h2>
            <div className="prose prose-invert max-w-none text-white/60 text-lg leading-relaxed">
              <p>{trainer.bio}</p>
              <p className="mt-4">
                Specializing in high-performance conditioning and holistic wellness, I approach every session with the goal of creating sustainable, powerful change in my students' lives. My methodology combines traditional strength pillars with modern functional training.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
              <Award size={24} className="text-brand" /> Specialties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Advanced Strength Training', 'Mobility & Recovery', 'Competition Prep', 'Nutritional Guidence'].map(s => (
                <div key={s} className="p-6 bg-surface border border-line flex items-center justify-between group hover:border-brand transition-colors">
                  <span className="font-bold uppercase tracking-tight">{s}</span>
                  <div className="w-2 h-2 bg-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          {relatedServices.length > 0 && (
            <section>
              <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
                <Calendar size={24} className="text-brand" /> Classes Led By {trainer.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedServices.map(s => (
                  <Link to={`/services/${s.id}`} key={s.id} className="p-8 border border-line flex items-center justify-between group hover:bg-surface transition-all">
                    <h4 className="text-xl font-black uppercase">{s.title}</h4>
                    <ArrowLeft className="rotate-180 text-white/20 group-hover:text-brand group-hover:translate-x-2 transition-all" size={20} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
