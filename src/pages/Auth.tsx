/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/firebaseService';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
});

type AuthData = z.infer<typeof authSchema>;

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthData) => {
    try {
      setError('');
      
      if (mode === 'signup') {
        if (!data.name) {
          setError('Operational name is required for registration.');
          return;
        }
        await authService.signUp(data.email, data.password, data.name);
        setMode('login');
        reset();
      } else {
        await authService.signIn(data.email, data.password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email identity already registered.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid credentials. Access Denied.');
      } else {
        setError(err.message || 'System authentication failure.');
      }
    }
  };

  return (
    <div className="min-h-screen py-24 flex items-center justify-center container mx-auto px-6 relative overflow-hidden bg-black">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand opacity-[0.03] blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black uppercase mb-4 tracking-tighter italic scale-105 origin-center">
            {mode === 'login' ? 'Auth' : 'Enroll'}
          </h1>
          <p className="label-mono opacity-40">
            {mode === 'login' ? 'Sync Profile' : 'Initiate Training Protocol'}
          </p>
        </div>

        <div className="p-10 border border-line bg-surface/50 backdrop-blur-2xl shadow-2xl relative">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'signup' && (
                <motion.div
                  key="signup-fields"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input 
                      {...register('name')}
                      type="text" 
                      placeholder="Operational Name"
                      className={`input-field pl-12 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-[9px] uppercase font-bold mt-1 tracking-widest">{errors.name.message as string}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                {...register('email')}
                type="email" 
                placeholder="Email Identity"
                className={`input-field pl-12 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-[9px] uppercase font-bold mt-1 tracking-widest">{errors.email.message as string}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                {...register('password')}
                type="password" 
                placeholder="Secure Token"
                className={`input-field pl-12 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-[9px] uppercase font-bold mt-1 tracking-widest">{errors.password.message as string}</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-5 text-sm group disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'login' ? 'Establish Session' : 'Register Profile'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-line" />
            <span className="relative z-10 bg-surface px-4 mx-auto block w-fit text-[10px] text-white/20 uppercase font-bold tracking-widest">
              Or Continue With
            </span>
          </div>

          <button 
            type="button"
            onClick={async () => {
              try {
                setError('');
                await authService.signInWithGoogle();
                navigate('/dashboard');
              } catch (err: any) {
                console.error('Google Auth Error:', err);
                setError(err.message || 'Verification relay failed.');
              }
            }}
            className="w-full border border-line py-4 flex items-center justify-center gap-3 hover:bg-white/5 transition-colors uppercase text-xs font-bold tracking-widest mb-8"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Establish with Google
          </button>

          <div className="text-center space-y-4">
            <p className="text-xs text-white/40 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => {setMode(mode === 'login' ? 'signup' : 'login'); setError('');}}
                className="text-brand font-bold uppercase ml-2 hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </button>
            </p>
            {mode === 'login' && (
              <button className="text-[10px] text-white/20 uppercase font-bold tracking-widest hover:text-white transition-colors">
                Forgot Password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
