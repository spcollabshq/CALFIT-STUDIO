/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

export default function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface border border-brand/20 p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-full mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase text-white tracking-tighter italic">System Disruption</h2>
          <p className="text-white/60 leading-relaxed">
            We've encountered an unexpected performance issue. Our engineers are on it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Re-Calibrate System
          </button>
          <div className="pt-4 border-t border-line text-[10px] text-white/20 font-mono text-left overflow-auto max-h-32">
            Error Profile: {error?.message}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
