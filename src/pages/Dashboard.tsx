/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Bell, User, Clock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { dbService } from '../services/firebaseService';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      const q = query(
        collection(db, 'bookings'), 
        where('userId', '==', user.uid),
        orderBy('bookedAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
        setLoading(false);
      }, (error) => {
        console.error('Real-time bookings error:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="text-brand animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="py-24 container mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 shrink-0 space-y-2">
          <Link to="/dashboard" className="w-full bg-brand text-black p-4 flex items-center gap-4 font-black uppercase text-sm tracking-tight transition-all">
            <Calendar size={20} /> Dashboard
          </Link>
          <Link to="/profile" className="w-full bg-surface text-white p-4 flex items-center gap-4 font-black uppercase text-sm tracking-tight hover:bg-white/5 transition-all">
            <User size={20} /> My Profile
          </Link>
          <Link to="/notifications" className="w-full bg-surface text-white p-4 flex items-center gap-4 font-black uppercase text-sm tracking-tight hover:bg-white/5 transition-all">
            <Bell size={20} /> Notifications
          </Link>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-12 w-full">
          <div className="max-w-4xl">
            <span className="label-mono text-brand mb-4 block">Personal Area</span>
            <h1 className="text-5xl font-black uppercase mb-1 leading-none italic tracking-tighter">Welcome Back, {profile?.fullName?.split(' ')[0] || 'Warrior'}</h1>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-4">Membership: Pro Performance • Active</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
               <h3 className="text-2xl font-black uppercase border-b border-line pb-4 flex items-center gap-3 italic">
                 <Clock size={24} className="text-brand" /> Upcoming Classes
               </h3>
               {bookings.length > 0 ? (
                 <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="p-6 bg-surface border border-line group hover:border-brand transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-11 bg-brand/10 border border-brand/20 flex flex-col items-center justify-center font-mono">
                            <span className="text-[7px] text-brand/60 uppercase font-bold">Slot</span>
                            <span className="text-[10px] font-black text-brand leading-none">{booking.time || 'TBD'}</span>
                          </div>
                          <div>
                            <h4 className="font-bold uppercase tracking-tight text-white">{booking.sessionId}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-white/40 uppercase font-mono tracking-tighter">Booked: {booking.bookedAt?.toDate()?.toLocaleDateString() || 'Pending'}</p>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 ${booking.status === 'confirmed' ? 'bg-brand/20 text-brand' : 'bg-red-500/20 text-red-500'}`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'confirmed' && (
                            <button 
                              onClick={async () => {
                                if (window.confirm('Cancel this session?')) {
                                  try {
                                    await dbService.cancelBooking(booking.id);
                                  } catch (err) {
                                    console.error('Cancel error:', err);
                                  }
                                }
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === 'cancelled' && (
                            <button 
                              onClick={async () => {
                                try {
                                  // Re-confirm? Or just leave it. 
                                  // In some apps we might want to delete the record if cancelled.
                                  // await dbService.deleteBooking(booking.id);
                                } catch (err) {
                                  console.error('Delete error:', err);
                                }
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-white/10"
                              disabled
                            >
                              Cancelled
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-20 text-center border border-dashed border-line">
                    <p className="text-white/20 uppercase font-black text-xs">No bookings yet</p>
                    <Link to="/schedule" className="btn-primary mt-6 py-2 px-6 mx-auto inline-flex">Book a Class</Link>
                 </div>
               )}
            </section>

            <section className="space-y-6">
               <h3 className="text-2xl font-black uppercase border-b border-line pb-4 flex items-center gap-3">
                 <AlertCircle size={24} className="text-brand" /> Membership Status
               </h3>
               <div className="p-10 bg-brand text-black space-y-8">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-black uppercase leading-none">Pro Performance</h4>
                    <p className="text-xs font-bold uppercase opacity-60">Expires in 22 days</p>
                  </div>
                  <div className="h-1 bg-black/10 w-full relative">
                    <div className="absolute top-0 left-0 h-full bg-black w-2/3" />
                  </div>
                  <button className="w-full border-2 border-black py-3 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-brand transition-all">
                    Upgrade / Renew
                  </button>
               </div>
            </section>
          </div>

          <section className="space-y-6">
              <h3 className="text-2xl font-black uppercase border-b border-line pb-4">Activity Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Workouts', val: bookings.length.toString(), trend: 'Current Season' },
                   { label: 'Minutes', val: (bookings.length * 60).toString(), trend: 'Estimated' },
                   { label: 'Calories', val: (bookings.length * 400).toLocaleString(), trend: 'Projected' },
                   { label: 'Rank', val: '#42', trend: 'Top 10%' }
                 ].map(stat => (
                   <div key={stat.label} className="p-8 bg-surface border border-line hover:border-brand/30 transition-all group">
                      <p className="label-mono mb-4">{stat.label}</p>
                      <p className="text-5xl font-black text-brand group-hover:scale-110 transition-transform origin-left">{stat.val}</p>
                      <p className="text-[9px] uppercase font-bold text-white/20 mt-4 tracking-widest">{stat.trend}</p>
                   </div>
                 ))}
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}
