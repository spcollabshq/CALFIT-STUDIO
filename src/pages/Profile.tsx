/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Lock, Mail, Camera, Save, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/firebaseService';

export default function Profile() {
  const { user, profile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    if (fullName.trim().length < 3) {
      setError('Full name is too brief.');
      return;
    }

    try {
      setIsSaving(true);
      setSuccess(false);
      setError(null);
      await dbService.updateUserProfile(user.uid, { fullName, phoneNumber });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message || 'Synchronization failure.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="text-brand animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="py-24 container mx-auto px-6 max-w-4xl">
      <div className="mb-16">
        <span className="label-mono text-brand mb-4 block">Settings</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none italic tracking-tighter">My Profile</h1>
      </div>

      <div className="space-y-16">
        {/* Photo */}
        <section className="flex flex-col md:flex-row gap-12 items-center pb-16 border-b border-line">
           <div className="relative group">
              <div className="w-40 h-40 bg-surface border-2 border-line rounded-none flex items-center justify-center overflow-hidden">
                 <User size={64} className="text-white/10" />
              </div>
           </div>
           <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-black uppercase italic">{profile?.fullName || 'Anonymous Warrior'}</h3>
              <p className="text-sm text-white/40 font-mono">ID: {user?.uid.slice(0, 12)}...</p>
              <p className="text-xs text-brand uppercase font-bold tracking-widest bg-brand/10 inline-block px-3 py-1">Member Level: Pro Performance</p>
           </div>
        </section>

        {/* Info Form */}
        <section className="space-y-8">
           <h3 className="text-2xl font-black uppercase flex items-center gap-3 italic">
              <User size={24} className="text-brand" /> Account Details
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-surface/50 border border-line backdrop-blur-sm relative">
              <div className="space-y-3">
                 <label className="label-mono">Full Name</label>
                 <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field font-bold" 
                />
              </div>
              <div className="space-y-3">
                 <label className="label-mono">Email Address (Immutable)</label>
                 <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input type="email" value={user?.email || ''} readOnly className="input-field font-bold opacity-50 cursor-not-allowed" />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="label-mono">Phone Number</label>
                 <input 
                  type="text" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 890" 
                  className="input-field font-bold" 
                />
              </div>
              <div className="md:col-span-2 pt-6 flex items-center gap-6">
                 <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary py-5 px-12 text-sm disabled:opacity-50 min-w-[200px]"
                 >
                    {isSaving ? <Loader2 className="animate-spin" /> : <>Save Updates <Save size={18} /></>}
                 </button>
                 {success && (
                   <div className="flex items-center gap-2 text-brand font-bold uppercase text-[10px] tracking-widest animate-pulse">
                     <CheckCircle2 size={16} /> Profile Synchronized
                   </div>
                 )}
                 {error && (
                   <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                     <AlertTriangle size={16} /> {error}
                   </div>
                 )}
              </div>
           </div>
        </section>

        {/* Security */}
        <section className="space-y-8">
           <h3 className="text-2xl font-black uppercase flex items-center gap-3">
              <Lock size={24} className="text-brand" /> Security
           </h3>
           <div className="p-10 border border-line bg-surface space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="label-mono">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-black border border-line px-4 py-3 focus:outline-none focus:border-brand text-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="label-mono">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-black border border-line px-4 py-3 focus:outline-none focus:border-brand text-white" />
                 </div>
              </div>
              <button className="btn-secondary py-3 px-8 text-xs font-black">
                 Update Password
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
