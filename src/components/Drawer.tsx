import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass =
    width === 'sm' ? 'sm:w-[400px]' : width === 'lg' ? 'sm:w-[640px]' : 'sm:w-[520px]';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`relative h-full w-full ${widthClass} bg-[#141414] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white tracking-tight truncate">{title}</h2>
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
};
