import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { PrototypeToast } from './types';

interface ToastContainerProps {
  toasts: PrototypeToast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        let borderClass = 'border-emerald-500/30';
        let bgClass = 'bg-[#181818]/95';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#E50914] shrink-0" />;
          borderClass = 'border-[#E50914]/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
          borderClass = 'border-sky-500/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-2xl backdrop-blur-md border ${borderClass} ${bgClass} text-white animate-in slide-in-from-bottom-3 duration-200`}
          >
            {icon}
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold tracking-wide uppercase text-neutral-200">
                {toast.title}
              </h4>
              <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
