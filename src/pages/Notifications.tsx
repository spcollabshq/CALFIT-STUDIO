/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Info, ShieldCheck, Zap, Inbox } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'booking', text: 'Booking confirmed for HIIT Training today at 09:00 AM.', time: '1 hour ago', icon: <Zap className="text-brand" /> },
    { id: 2, type: 'security', text: 'Your password was successfully updated.', time: '2 hours ago', icon: <ShieldCheck className="text-blue-500" /> },
    { id: 3, type: 'info', text: 'New Class Alert: Advanced Pilates starting next Monday.', time: '1 day ago', icon: <Info className="text-white/40" /> }
  ];

  return (
    <div className="py-24 container mx-auto px-6 max-w-4xl">
      <div className="mb-16">
        <span className="label-mono text-brand mb-4 block">Alerts</span>
        <h1 className="text-6xl font-black uppercase mb-6 leading-none">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(note => (
            <div key={note.id} className="p-8 bg-surface border border-line flex gap-8 items-start hover:border-brand/40 transition-colors">
               <div className="w-12 h-12 bg-black border border-line flex items-center justify-center shrink-0">
                  {note.icon}
               </div>
               <div className="space-y-2">
                  <p className="text-lg font-medium text-white/90 leading-tight">{note.text}</p>
                  <p className="text-[10px] text-white/20 uppercase font-mono tracking-widest">{note.time}</p>
               </div>
            </div>
          ))
        ) : (
          <div className="py-40 text-center border border-dashed border-line space-y-6">
             <Inbox size={48} className="mx-auto text-white/5" />
             <p className="label-mono text-white/20">No new notifications</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
         <button className="text-[10px] text-white/20 uppercase font-bold tracking-widest hover:text-brand transition-colors">
            Clear All Notifications
         </button>
      </div>
    </div>
  );
}
