import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useFloodGuard } from '../context/FloodGuardContext';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useFloodGuard();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        let borderClass = 'border-cyan-500/40 bg-[#0d2137]/95 text-cyan-200';
        let Icon = Info;
        if (notif.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-[#0a2318]/95 text-emerald-200';
          Icon = CheckCircle2;
        } else if (notif.type === 'warning') {
          borderClass = 'border-amber-500/60 bg-[#2b1f09]/95 text-amber-200';
          Icon = AlertTriangle;
        } else if (notif.type === 'error') {
          borderClass = 'border-red-500/60 bg-[#2b0d0d]/95 text-red-200';
          Icon = AlertCircle;
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-3.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all transform animate-in fade-in slide-in-from-right-4 duration-300 ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {notif.text}
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
