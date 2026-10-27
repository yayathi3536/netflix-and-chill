import React from 'react';
import {
  ShieldCheck,
  Edit3,
  Plus,
  Database,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminModeBarProps {
  currentUser: User | null;
  onOpenEditSiteContent: (section?: 'hero' | 'letter' | 'sections' | 'couple') => void;
  onOpenAddMemory: () => void;
  onOpenAdminPortal: () => void;
  onOpenStudio: () => void;
  onLogout: () => void;
}

export const AdminModeBar: React.FC<AdminModeBarProps> = ({
  currentUser,
  onOpenEditSiteContent,
  onOpenAddMemory,
  onOpenAdminPortal,
  onOpenStudio,
  onLogout,
}) => {
  if (!currentUser) return null;

  return (
    <aside
      aria-label="Admin Control Bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl animate-in slide-in-from-bottom-6 duration-300 pointer-events-none"
    >
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#E50914]/40 rounded-xl px-3 sm:px-6 py-2 sm:py-2.5 netflix-modal-shadow flex items-center justify-between gap-2 sm:gap-3 text-[#FFFFFF] pointer-events-auto">
        {/* Left: Admin Status & Identity */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#E50914]"></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-neutral-300" />
            <span className="font-bold text-[#FFFFFF] tracking-wide uppercase font-bebas text-sm">Admin Verified</span>
            <span className="text-[#808080]">·</span>
            <span className="text-[#B3B3B3] max-w-[140px] truncate" title={currentUser.email}>
              {currentUser.email}
            </span>
          </div>
          <div className="sm:hidden flex items-center gap-1 text-xs font-bold text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Edit Site Texts & Letters */}
          <button
            onClick={() => onOpenEditSiteContent()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded bg-[#181818] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold transition-all cursor-pointer border border-[#808080]/30 min-h-[38px]"
            title="Edit texts & letters"
          >
            <Edit3 className="w-3.5 h-3.5 text-neutral-300" />
            <span className="hidden md:inline">Edit Content</span>
            <span className="md:hidden">Edit</span>
          </button>

          {/* Add New Memory */}
          <button
            onClick={onOpenAddMemory}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded bg-white hover:bg-white/80 text-black text-xs font-semibold shadow transition-all cursor-pointer min-h-[38px]"
            title="Create new title"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Title</span>
          </button>

          {/* Live Content Studio */}
          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 rounded bg-[#181818] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold transition-all cursor-pointer border border-[#E50914]/40 min-h-[38px]"
            title="Open live content studio"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-neutral-300" />
            <span className="hidden md:inline">Studio</span>
          </button>

          {/* Database Setup */}
          <button
            onClick={onOpenAdminPortal}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded bg-[#181818] hover:bg-white/10 text-[#B3B3B3] hover:text-[#FFFFFF] text-xs font-medium transition-colors cursor-pointer border border-[#808080]/30 min-h-[38px] flex items-center"
            title="Database Configuration"
          >
            <Database className="w-3.5 h-3.5 text-[#808080]" />
            <span className="hidden lg:inline ml-1">Database</span>
          </button>
        </div>

        {/* Right: Quick Logout */}
        <div className="shrink-0 pl-1 border-l border-[#181818]">
          <button
            onClick={onLogout}
            className="p-2 sm:px-2.5 sm:py-1 rounded text-[#808080] hover:text-[#FFFFFF] hover:bg-[#181818] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer min-h-[38px]"
            title="Sign out of Admin Mode"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-300" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
