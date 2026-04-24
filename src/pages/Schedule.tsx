/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, MapPin, Loader2, AlertTriangle, Users } from 'lucide-react';
import { fetchSchedule, fetchServices, fetchTrainers } from '../lib/api';
import { ClassSession, Service, Trainer } from '../types';
import { clsx } from 'clsx';

export default function Schedule() {
  const [schedule, setSchedule] = useState<ClassSession[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [classFilter, setClassFilter] = useState('all');
  const [trainerFilter, setTrainerFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [schedData, servData, trainData] = await Promise.all([
          fetchSchedule(),
          fetchServices(),
          fetchTrainers(),
        ]);
        setSchedule(schedData);
        setServices(servData);
        setTrainers(trainData);
      } catch (err) {
        setError('Failed to sync schedule. Please refresh the matrix.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSchedule = schedule.filter(session => {
    const matchesDay = session.day === selectedDay;
    const matchesClass = classFilter === 'all' || session.serviceId === classFilter;
    const matchesTrainer = trainerFilter === 'all' || session.trainerId === trainerFilter;
    return matchesDay && matchesClass && matchesTrainer;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand animate-spin" size={48} />
        <p className="label-mono animate-pulse">Syncing Calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-md bg-surface border border-red-500/20 p-10">
          <AlertTriangle className="text-red-500 mx-auto" size={48} />
          <p className="text-xl text-white/80 font-black uppercase tracking-tighter">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">Retry Sync</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mb-16">
        <span className="label-mono text-brand mb-4 block">Calendar</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none tracking-tighter">Weekly Class Schedule</h1>
        <p className="text-xl text-white/60">Plan your week with our diverse range of morning and evening sessions.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface border border-line p-4 md:p-8 space-y-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-end">
          {/* Day Selector */}
          <div className="flex-grow">
            <label className="label-mono mb-4 block">Select Day</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    "px-6 py-3 uppercase font-display font-bold text-[10px] tracking-widest border transition-all shrink-0",
                    selectedDay === day 
                    ? "bg-brand text-black border-brand" 
                    : "border-line text-white/40 hover:border-white"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="label-mono mb-2 block">Class Type</label>
              <select 
                className="bg-black border border-line px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand w-48"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All Classes</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label-mono mb-2 block">Trainer</label>
              <select 
                className="bg-black border border-line px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand w-48"
                value={trainerFilter}
                onChange={(e) => setTrainerFilter(e.target.value)}
              >
                <option value="all">All Trainers</option>
                {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {filteredSchedule.length > 0 ? (
          filteredSchedule.map((session) => {
            const service = services.find(s => s.id === session.serviceId);
            const trainer = trainers.find(t => t.id === session.trainerId);
            const isFull = session.availableSlots === 0;

            return (
              <div 
                key={session.id}
                className="group bg-surface flex flex-col md:flex-row border border-line hover:border-brand transition-all relative overflow-hidden"
              >
                {isFull && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-black uppercase py-1 px-4 z-10">
                    Fully Booked
                  </div>
                )}
                
                {/* Time Rail */}
                <div className="bg-black/60 border-r border-line p-6 md:w-56 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand/20" />
                  <span className="font-mono text-3xl font-black tracking-tighter text-brand drop-shadow-[0_0_10px_var(--color-glow)]">{session.startTime}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2 font-bold whitespace-nowrap">Starts Promptly</span>
                </div>

                {/* Content */}
                <div className="flex-grow p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={clsx(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 border rounded-sm",
                        service?.category === 'cardio' ? "border-brand text-brand bg-brand/5" : "border-white/20 bg-white/5"
                      )}>
                        {service?.category}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">• {session.endTime.split(' ')[0]} / {service?.duration}</span>
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tight leading-none group-hover:text-brand transition-colors">{service?.title}</h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <Link to={`/trainers/${trainer?.id}`} className="text-xs text-white/60 hover:text-brand flex items-center gap-2 font-bold uppercase tracking-tight transition-colors">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-line shrink-0">
                          <img src={trainer?.image} className="w-full h-full object-cover grayscale" />
                        </div>
                        Coach {trainer?.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-mono bg-white/5 px-2 py-1 border border-line/50">
                        <Users size={12} className="text-brand/50" />
                        {session.availableSlots} / {session.totalSlots} Slots
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0 lg:items-end">
                    <Link 
                      to={`/booking/select-slot?service=${encodeURIComponent(service?.title || '')}`}
                      className={clsx(
                        "btn-primary py-4 px-10 text-sm w-full md:w-auto",
                        isFull && "hidden"
                      )}
                    >
                      Book Slot
                    </Link>
                    <Link to={`/services/${service?.id}`} className="text-[10px] text-white/40 font-bold uppercase tracking-[0.1em] hover:text-white flex items-center gap-2 group/link">
                       Full Details <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-32 border border-dashed border-line bg-surface/20">
            <Clock size={48} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-2xl font-black uppercase text-white/40 mb-2">No classes found</h3>
            <p className="text-white/30 max-w-sm mx-auto mb-8">Change your selection or try another day for more fitness opportunities.</p>
            <button 
              onClick={() => {setClassFilter('all'); setTrainerFilter('all'); setSelectedDay('Monday');}}
              className="btn-secondary py-2 px-6"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-12 p-6 border border-line/50 flex flex-wrap gap-8 items-center justify-center">
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-white/40">
           <MapPin size={12} className="text-brand" /> Main Studio Level 1
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-white/40">
           <Users size={12} className="text-brand" /> Limited Capacity
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-white/40">
           <Clock size={12} className="text-brand" /> 02hr Cancellation
        </div>
      </div>
    </div>
  );
}
