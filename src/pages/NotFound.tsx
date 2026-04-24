/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6 text-center space-y-12">
      <div className="relative">
         <span className="text-[200px] font-black text-white/5 leading-none select-none">404</span>
         <Ghost size={80} className="text-brand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="space-y-4 relative z-10 -mt-10">
        <h1 className="text-6xl font-black uppercase tracking-tighter italic">Page Not Found</h1>
        <p className="text-white/40 max-w-md mx-auto text-lg leading-relaxed">
          The fitness journey you’re looking for doesn’t exist on this path. Let’s get you back to the main studio.
        </p>
      </div>
      <Link to="/" className="btn-primary py-4 px-12 group">
        <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
        Go to Homepage
      </Link>
    </div>
  );
}
