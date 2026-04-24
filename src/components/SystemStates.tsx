/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
      <motion.div
        animate={{ 
          rotate: 360,
          borderColor: ['#DFFF00', '#FFFFFF', '#DFFF00']
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-t-brand border-line rounded-full"
      />
      <p className="label-mono animate-pulse">Loading your experience...</p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 container mx-auto px-6 text-center">
      <div className="w-20 h-20 bg-red-600/10 border border-red-600/20 text-red-600 flex items-center justify-center rounded-full mb-4">
        <AlertTriangle size={40} />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black uppercase italic">Something Went Wrong</h2>
        <p className="text-white/40 max-w-sm mx-auto">We encountered an unexpected error while processing your request.</p>
      </div>
      <button onClick={onRetry} className="btn-primary py-3 px-10">
        Try Again
      </button>
    </div>
  );
}

function AlertTriangle({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
