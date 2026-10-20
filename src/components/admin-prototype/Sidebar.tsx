import React from 'react';
import {
  LayoutDashboard,
  Film,
  Image as ImageIcon,
  Heart,
  BookOpen,
  Sliders,
  Ticket,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import { AdminTab } from './types';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onExitPrototype: () => void;
  counts: {
    memories: number;
    photos: number;
    letters: number;
    chapters: number;
    coupons: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onExitPrototype,
  counts,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'memories',
      label: 'Memories',
      icon: <Film className="w-5 h-5 shrink-0" />,
      badge: counts.memories,
    },
    {
      id: 'photos',
      label: 'Photo Gallery',
      icon: <ImageIcon className="w-5 h-5 shrink-0" />,
      badge: counts.photos,
    },
    {
      id: 'letters',
      label: 'Love Letters',
      icon: <Heart className="w-5 h-5 shrink-0" />,
      badge: counts.letters,
    },
    {
      id: 'chapters',
      label: 'Story Chapters',
      icon: <BookOpen className="w-5 h-5 shrink-0" />,
      badge: counts.chapters,
    },
    {
      id: 'site-content',
      label: 'Site Content',
      icon: <Sliders className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: <Ticket className="w-5 h-5 shrink-0" />,
      badge: counts.coupons,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'preview',
      label: 'Preview Website',
      icon: <Eye className="w-5 h-5 shrink-0 text-[#E50914]" />,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#121212] border-r border-white/10 text-white select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#0e0e0e]">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bebas text-lg tracking-wider text-white shadow-lg shadow-[#E50914]/20 shrink-0">
              U
            </div>
            <div className="min-w-0">
              <span className="font-bebas text-xl tracking-widest text-[#E50914] font-black block leading-none truncate">
                OUR UNIVERSE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mt-0.5">
                Admin Studio Pro
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded bg-[#E50914] flex items-center justify-center font-bebas text-lg tracking-wider text-white shadow-lg shadow-[#E50914]/20">
            U
          </div>
        )}

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prototype Isolation Notice Banner */}
      {!isCollapsed && (
        <div className="mx-3 my-3 p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2 text-[11px] text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block">Isolated Prototype</span>
            <span className="text-neutral-400 text-[10px] leading-tight block">
              In-memory state. No database or live records affected.
            </span>
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 dark-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/25 font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 bg-[#0e0e0e] space-y-2">
        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex w-full items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>

        {/* Return to Live Site */}
        <button
          onClick={onExitPrototype}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer ${
            isCollapsed ? 'px-2' : ''
          }`}
          title="Return to Main Website"
        >
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          {!isCollapsed && <span>Return to Website</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
