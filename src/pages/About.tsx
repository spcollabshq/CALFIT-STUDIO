/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Target, Shield, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="py-24">
      <section className="container mx-auto px-6 mb-24">
        <div className="max-w-4xl">
          <span className="label-mono text-brand mb-4 block">Our Story</span>
          <h1 className="text-7xl font-black uppercase mb-8 leading-none tracking-tighter italic">We Build More Than Just Bodies</h1>
          <p className="text-2xl text-white/80 leading-relaxed mb-12">
            Founded in 2018, CalFit Studio was born from a simple belief: fitness should be high-performance, personalized, and unapologetically ambitious.
          </p>
          <div className="aspect-video w-full border border-line grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative">
            <img 
               src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop" 
               className="w-full h-full object-cover" 
               alt="Our Gym"
               referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand/5" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-24 border-y border-line">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Target />, title: 'Mission', desc: 'To provide world-class training accessible to everyone from beginners to athletes.' },
              { icon: <Shield />, title: 'Integrity', desc: 'Honest coaching, science-backed methods, and zero gimmicks.' },
              { icon: <Heart />, title: 'Passion', desc: 'A community driven by the love for the grind and the joy of progress.' },
              { icon: <Users />, title: 'Community', desc: 'We are stronger together. Our studio is your second home.' }
            ].map((item, i) => (
              <div key={i} className="space-y-6">
                <div className="w-16 h-16 bg-black border border-line flex items-center justify-center text-brand">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black uppercase">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black uppercase leading-none">The CalFit Philosophy</h2>
            <p className="text-white/60 text-lg leading-relaxed italic">
              "Performance is not just about the numbers on the bar; it's about the discipline of the mind and the resilience of the spirit."
            </p>
            <p className="text-white/40 leading-relaxed">
              We don't believe in quick fixes. We believe in the compound effect of small, consistent actions. Whether you're here for HIIT, Yoga, or CrossFit, you're here to build a better version of yourself.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-square bg-surface border border-line p-10 flex flex-col justify-center">
                <span className="text-5xl font-black text-brand mb-2">700+</span>
                <span className="label-mono">Members</span>
             </div>
             <div className="aspect-square bg-surface border border-line p-10 flex flex-col justify-center">
                <span className="text-5xl font-black text-brand mb-2">15+</span>
                <span className="label-mono">Expert Coaches</span>
             </div>
             <div className="aspect-square bg-surface border border-line p-10 flex flex-col justify-center">
                <span className="text-5xl font-black text-brand mb-2">24/7</span>
                <span className="label-mono">Support</span>
             </div>
             <div className="aspect-square bg-surface border border-line p-10 flex flex-col justify-center">
                <span className="text-5xl font-black text-brand mb-2">5.0</span>
                <span className="label-mono">Vibe</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
