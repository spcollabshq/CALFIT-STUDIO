/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Twitter, Phone, MapPin, ArrowRight, User as UserIcon, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function VerificationBanner() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  
  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    try {
      await authService.sendVerificationEmail();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error('Verification resend error:', err);
    }
  };

  return (
    <div className="bg-brand text-black py-2 px-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] relative z-[60]">
      {sent ? (
        <>
          <CheckCircle2 size={14} />
          <span>Verification Relay Dispatched. Check your inbox.</span>
        </>
      ) : (
        <>
          <AlertTriangle size={14} />
          <span>Accuracy Check: Your email is not verified. Some features like Bookings may be restricted.</span>
          <button onClick={handleResend} className="underline hover:text-white transition-colors ml-4">Resend Link</button>
        </>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Classes', href: '/services' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Membership', href: '/membership' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-black/90 backdrop-blur-md border-line py-3" : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tighter">
            CALFIT<span className="text-brand"> STUDIO</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => cn(
                "text-sm font-display font-medium uppercase tracking-widest transition-colors hover:text-brand",
                isActive ? "text-brand" : "text-white/70"
              )}
            >
              {link.name}
            </NavLink>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-line pl-8">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-brand transition-colors group">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand border border-brand/20 group-hover:bg-brand group-hover:text-black transition-all">
                  <UserIcon size={16} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[100px]">
                  {profile?.fullName || 'User'}
                </span>
              </Link>
              <button 
                onClick={async () => { await authService.logOut(); navigate('/'); }}
                className="p-2 text-white/40 hover:text-red-500 transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary py-2 px-5 text-xs">
              Join Now
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-line p-8 flex flex-col gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => cn(
                  "text-xl font-display font-bold uppercase tracking-widest transition-colors",
                  isActive ? "text-brand" : "text-white/70"
                )}
              >
                {link.name}
              </NavLink>
            ))}
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-xl font-display font-bold uppercase tracking-widest text-white/70 hover:text-brand">
                  Profile
                </Link>
                <button 
                  onClick={async () => { await authService.logOut(); navigate('/'); }}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 py-4 font-bold uppercase tracking-widest text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary w-full">
                Join Now
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-line mt-20">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="font-display text-2xl font-bold tracking-tighter">
              CALFIT<span className="text-brand"> STUDIO</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              From Yoga to CrossFit, find the perfect workout that fits your lifestyle. Premium facilities, expert trainers.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="w-10 h-10 border border-line flex items-center justify-center hover:bg-brand hover:text-black transition-all">
                <Instagram size={18} />
              </Link>
              <Link to="#" className="w-10 h-10 border border-line flex items-center justify-center hover:bg-brand hover:text-black transition-all">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Classes', 'Schedule', 'Membership', 'Trainers', 'About', 'Contact'].map(item => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-sm text-white/60 hover:text-brand transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'FAQs'].map(item => (
                <li key={item}>
                  <Link to={`/legal/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="text-sm text-white/60 hover:text-brand transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-sm text-white/40">Subscribe to get fitness tips and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-black border border-line px-4 py-3 text-sm focus:outline-none focus:border-brand flex-1"
              />
              <button className="bg-brand text-black p-3 hover:bg-white transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs text-white/50">
                <Phone size={14} className="text-brand" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <MapPin size={14} className="text-brand" />
                <span>Indiranagar, Bangalore, KA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
            &copy; {new Date().getFullYear()} CALFIT STUDIO. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
            DESIGNED FOR PERFORMANCE
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand selection:text-black">
      <VerificationBanner />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main 
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow pt-24 lg:pt-0"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
