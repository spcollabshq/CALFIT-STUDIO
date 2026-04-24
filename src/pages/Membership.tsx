/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, ArrowRight } from 'lucide-react';
import { PLANS } from '../data';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export default function Membership() {
  return (
    <div className="py-24 container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="label-mono text-brand mb-4 block">Pricing Plans</span>
        <h1 className="text-6xl md:text-7xl font-black uppercase mb-6 leading-none">Choose Your Plan</h1>
        <p className="text-xl text-white/60">Unlock unlimited potential with our flexible membership tiers designed for every fitness level.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={clsx(
              "relative flex flex-col p-10 border transition-all duration-500 overflow-hidden",
              plan.isPopular ? "bg-brand text-black border-brand scale-105 z-10" : "bg-surface text-white border-line hover:border-brand/50"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-black uppercase py-2 px-8 rotate-45 translate-x-8 translate-y-4">
                Most Popular
              </div>
            )}

            <div className="mb-12">
              <h3 className={clsx("text-2xl font-black uppercase mb-4", plan.isPopular ? "text-black" : "text-brand")}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-sm uppercase font-bold opacity-60 font-mono tracking-widest">{plan.billing}</span>
              </div>
            </div>

            <ul className="space-y-6 mb-12 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4 text-sm font-medium">
                  <Check className={clsx("shrink-0", plan.isPopular ? "text-black" : "text-brand")} size={20} />
                  <span className={clsx(plan.isPopular ? "text-black/80" : "text-white/70")}>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <Link 
                to="/auth" 
                className={clsx(
                  "btn-primary py-5 text-center block w-full",
                  plan.isPopular ? "bg-black text-white hover:bg-white hover:text-black" : ""
                )}
              >
                Get Started
              </Link>
              <button className={clsx(
                "w-full text-xs font-bold uppercase tracking-widest py-2 transition-colors",
                plan.isPopular ? "text-black/40 hover:text-black" : "text-white/30 hover:text-white"
              )}>
                Compare Plans
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-surface border border-line text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-black uppercase mb-4">Enterprise & Corporate</h3>
        <p className="text-white/60 mb-8 max-w-2xl mx-auto">Looking for a plan for your entire team? We offer customized corporate memberships with wellness workshops and specialized training.</p>
        <Link to="/contact" className="btn-secondary inline-flex py-3 px-10">
          Contact Sales <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
