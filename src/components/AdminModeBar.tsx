import React from 'react';
import {
  ShieldCheck,
  Edit3,
  Plus,
  Database,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminModeBarProps {
  currentUser: User | null;
  onOpenEditSiteContent: (section?: 'hero' | 'letter' | 'sections' | 'couple') => void;
  onOpenAddMemory: () => void;
  onOpenAdminPortal: () => void;
  onLogout: () => void;
}

export const AdminModeBar: React.FC<AdminModeBarProps> = ({
  currentUser,
  onOpenEditSiteContent,
  onOpenAddMemory,
  onOpenAdminPortal,
  onLogout,
}) => {
  if (!currentUser) return null;

  return (
    <aside
      aria-label="Admin Control Bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-6 duration-300 pointer-events-none"
    >
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#E50914]/40 rounded-full px-4 sm:px-6 py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 text-white pointer-events-auto">
        {/* Left: Admin Status & Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wide">Admin Mode</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400 max-w-[140px] truncate" title={currentUser.email}>
              {currentUser.email}
            </span>
          </div>
          <div className="sm:hidden flex items-center gap-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Edit Site Texts & Letters */}
          <button
            onClick={() => onOpenEditSiteContent()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10"
            title="Edit headings, love letters, and site texts"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Edit Texts & Letters</span>
            <span className="md:hidden">Texts</span>
          </button>

          {/* Add New Memory */}
          <button
            onClick={onOpenAddMemory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Create a new relationship memory"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Memory</span>
          </button>

          {/* Supabase Portal / SQL Setup */}
          <button
            onClick={onOpenAdminPortal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-white/5"
            title="Open Admin Portal & SQL Setup"
          >
            <Database className="w-3.5 h-3.5 text-[#ff4d5a]" />
            <span className="hidden lg:inline ml-1">Portal</span>
          </button>
        </div>

        {/* Right: Quick Logout */}
        <div className="shrink-0 pl-1 border-l border-white/10">
          <button
            onClick={onLogout}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-full text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            title="Sign out of Admin Mode"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
