/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Filter, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchServices } from '../lib/api';
import { Service } from '../types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load fitness programs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || service.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'holistic'];

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
        <span className="label-mono text-brand mb-4 block">Programs</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none">All Fitness Programs</h1>
        <p className="text-xl text-white/60">Discover the right training path for your personal fitness goals.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input 
            type="text"
            placeholder="Search classes (e.g., Yoga, HIIT)"
            className="w-full bg-surface border border-line pl-12 pr-4 py-4 focus:outline-none focus:border-brand transition-colors text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={20} className="text-white/30 hidden sm:block shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-4 uppercase font-display font-bold text-xs tracking-widest border transition-all whitespace-nowrap ${
                category === cat 
                ? 'bg-brand text-black border-brand' 
                : 'border-line text-white/60 hover:border-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card group overflow-hidden"
          >
            <div className="aspect-video overflow-hidden relative mb-8">
              <img 
                src={service.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                alt={service.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-brand text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {service.level}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase leading-none">{service.title}</h3>
              <p className="text-white/60 leading-relaxed">{service.description}</p>
              <div className="pt-4 flex items-center justify-between">
                <span className="label-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  {service.duration}
                </span>
                <Link to={`/booking/select-slot?service=${encodeURIComponent(service.title)}`} className="btn-primary py-2 px-6">
                  Book Class <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-24 border border-dashed border-line">
          <p className="text-white/40 font-display uppercase tracking-widest">No classes found for selected filters</p>
          <button 
            onClick={() => {setSearchTerm(''); setCategory('all');}}
            className="text-brand text-sm font-bold uppercase mt-4 underline underline-offset-8"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
