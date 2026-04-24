/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ArrowRight, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/firebaseService';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Reviews() {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(data);
        setLoading(false);
      },
      (err) => {
        console.error('Real-time reviews error:', err);
        setError('Synchronized feedback stream interrupted.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    if (comment.trim().length < 10) {
       setError('Testimonies must be at least 10 characters.');
       return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await dbService.addReview(user.uid, profile.fullName, rating, comment);
      setComment('');
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to transmit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
        <div className="max-w-xl">
          <span className="label-mono text-brand mb-4 block tracking-widest text-[10px] font-bold uppercase">Feedback</span>
          <h1 className="text-6xl font-black uppercase mb-6 leading-none italic tracking-tighter">What Our Members Say</h1>
          <p className="text-xl text-white/60 font-display">A community built on sweat, persistence, and mutual support.</p>
        </div>
        {user ? (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary py-4 px-8"
          >
            {showForm ? 'Close Form' : 'Write a Review'} <MessageSquare size={18} />
          </button>
        ) : (
          <Link to="/auth" className="btn-primary py-4 px-8">
            Login to Review <ArrowRight size={18} />
          </Link>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-20"
          >
            <div className="p-10 border border-brand bg-brand/5 max-w-2xl mx-auto backdrop-blur-sm">
              <h3 className="text-2xl font-black uppercase mb-8 italic tracking-tighter text-brand">Share your experience</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="label-mono mb-4 block">Rating</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => setRating(s)}
                        className={`p-2 transition-colors ${rating >= s ? 'text-brand' : 'text-white/20'}`}
                      >
                        <Star size={32} fill={rating >= s ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label-mono mb-2 block">Comment</label>
                  <textarea 
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your transformation story..."
                    className="w-full bg-black border border-line p-4 focus:outline-none focus:border-brand transition-colors text-white font-display"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Finalize Review'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.length > 0 ? reviews.map((review, i) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex flex-col justify-between group h-full"
          >
            <div className="space-y-6">
              <div className="flex gap-1 text-brand">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    className={i < review.rating ? "drop-shadow-[0_0_8px_rgba(223,255,0,0.5)]" : "opacity-20"}
                  />
                ))}
              </div>
              <p className="text-xl italic font-display text-white/90 leading-relaxed">"{review.comment}"</p>
            </div>
            <div className="mt-12 pt-6 border-t border-line flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-line p-0.5 group-hover:border-brand transition-colors bg-surface flex items-center justify-center">
                  <span className="text-brand font-black text-xs">{review.userName?.[0]}</span>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm text-white">{review.userName}</h4>
                  <p className="label-mono opacity-40 text-[8px]">{review.timestamp?.toDate().toLocaleDateString() || 'Recent'}</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-white/5 border border-line flex items-center justify-center text-white/20 group-hover:text-brand group-hover:border-brand/40 transition-all">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-20 border border-line bg-surface">
            <p className="text-white/40 uppercase font-black tracking-widest text-xs">No reviews yet. Be the first to share your story.</p>
          </div>
        )}
      </div>

      <div className="mt-24 text-center">
        <p className="text-white/40 mb-8 font-display italic">Join 700+ fitness enthusiasts who have transformed their lives.</p>
        <Link to="/auth" className="text-brand font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all group">
          Join the Community Now <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

