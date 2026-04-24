/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Navigate } from 'react-router-dom';

export default function Legal() {
  const { slug } = useParams();
  
  const contentMap: Record<string, { title: string, content: string }> = {
    'privacy-policy': {
      title: 'Your Privacy Matters',
      content: 'At CalFit Studio, we value your privacy. This policy outlines how we collect, use, and protect your personal information when you use our fitness studio services.'
    },
    'terms-conditions': {
      title: 'Terms & Conditions',
      content: 'By accessing CalFit Studio, you agree to be bound by these terms. This include session booking rules, facility usage guidelines, and membership conduct.'
    },
    'refund-policy': {
      title: 'Refund & Cancellation Policy',
      content: 'Classes must be cancelled at least 2 hours in advance. No-shows are charged in full. Membership refunds are handled on a pro-rata basis within the first 7 days.'
    }
  };

  const active = slug && contentMap[slug];

  if (!active) return <Navigate to="/404" />;

  return (
    <div className="py-40 container mx-auto px-6 max-w-4xl">
      <div className="space-y-12">
        <h1 className="text-7xl font-black uppercase mb-12 border-b-4 border-brand pb-8 leading-none italic tracking-tighter">
          {active.title}
        </h1>
        <div className="prose prose-invert prose-xl max-w-none text-white/60 space-y-10 leading-[1.6]">
           <p className="font-bold text-white text-2xl uppercase tracking-tight">Last Updated: April 2024</p>
           <p>{active.content}</p>
           <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold uppercase text-white tracking-widest flex items-center gap-4">
                    <span className="w-6 h-[1px] bg-brand" /> Section {i}.0
                  </h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
