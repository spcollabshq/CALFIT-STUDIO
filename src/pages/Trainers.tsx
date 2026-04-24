/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Twitter, Loader2, AlertTriangle } from 'lucide-react';
import { fetchTrainers } from '../lib/api';
import { Trainer } from '../types';

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTrainers();
        setTrainers(data);
      } catch (err) {
        setError('Failed to load the elite squad. Systems offline.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="text-brand animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <AlertTriangle className="text-red-500 mx-auto" size={48} />
          <p className="text-xl text-white/60">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }
  return (
    <div className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mb-16">
        <span className="label-mono text-brand mb-4 block">Team</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none">Meet Our Trainers</h1>
        <p className="text-xl text-white/60">Professional athletes and dedicated coaches committed to your success.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="glass-card group overflow-hidden p-0">
            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 relative">
              <img src={trainer.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              {/* Socials Hover */}
              <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                {trainer.socials?.instagram && (
                  <a href="#" className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full hover:bg-brand transition-colors">
                    <Instagram size={18} />
                  </a>
                )}
                {trainer.socials?.twitter && (
                  <a href="#" className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full hover:bg-brand transition-colors">
                    <Twitter size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-8">
              <span className="label-mono text-brand text-[10px] mb-2 block">{trainer.specialty}</span>
              <h3 className="text-3xl font-black uppercase mb-4">{trainer.name}</h3>
              <p className="text-sm text-white/50 mb-8 line-clamp-2">{trainer.bio}</p>
              <Link to={`/trainers/${trainer.id}`} className="btn-primary w-full py-3 text-xs">
                View Profile <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
