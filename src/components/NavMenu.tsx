import React, { useEffect } from 'react';
import {
  X,
  Home,
  Film,
  Clapperboard,
  Heart,
  Compass,
  Lock,
  Music,
  Shield,
  LogOut,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';
import { getProfileAvatarUrl } from '../data/builtInAvatars';

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeProfile: UserProfile;
  onSignOut?: () => void;
  currentUser: User | null;
  onOpenAdminModal: () => void;
  onToggleAudio: () => void;
  isAudioPlaying: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'our-story', label: 'Series', icon: Clapperboard },
  { id: 'memories', label: 'Movies', icon: Film },
  { id: 'little-things', label: 'Quirks', icon: Heart },
  { id: 'places-list', label: 'My List', icon: Compass },
  { id: 'secret-vault', label: 'Secret Vault', icon: Lock },
];

export const NavMenu: React.FC<NavMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  activeProfile,
  currentUser,
  onOpenAdminModal,
  onSignOut,
  onToggleAudio,
  isAudioPlaying,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide panel */}
      <aside
        className="relative flex h-full w-[80%] max-w-[340px] flex-col bg-[#141414] shadow-2xl animate-in slide-in-from-left duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <span className="font-bebas text-2xl tracking-wider text-[#E50914]">
            OUR UNIVERSE
          </span>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Music toggle */}
          <button
            onClick={onToggleAudio}
            className="flex w-full items-center gap-4 px-5 py-3.5 text-left text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-pressed={isAudioPlaying}
          >
            <Music className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              {isAudioPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
            </span>
          </button>
        </nav>

        {/* Profile footer */}
        <div className="space-y-2 border-t border-white/10 px-5 py-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[#E50914]">
              <img
                src={getProfileAvatarUrl(activeProfile)}
                alt={activeProfile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {activeProfile.name}
              </p>
              {currentUser && (
                <p className="truncate text-xs text-neutral-500">
                  {currentUser.email}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onOpenAdminModal();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded px-2 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Shield className="h-4 w-4" />
            <span>{currentUser ? 'Admin Panel' : 'Admin Sign In'}</span>
          </button>

          {onSignOut && (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded px-2 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
