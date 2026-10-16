import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Plus,
  Volume2,
  VolumeX,
  Music,
  X,
  Heart,
  Sparkles,
  ChevronDown,
  Lock,
  Shield,
  Database,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { romanticAudio } from '../utils/romanticAudio';

import { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onOpenAddModal: () => void;
  notifications: NotificationItem[];
  onNotificationClick: (id: string, memoryId?: string) => void;
  currentUser: User | null;
  onOpenAdminModal: () => void;
  onOpenSetupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  activeProfile,
  profiles,
  onSelectProfile,
  onOpenAddModal,
  notifications,
  onNotificationClick,
  currentUser,
  onOpenAdminModal,
  onOpenSetupModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else {
        setSearchQuery('');
      }
      return !prev;
    });
  };

  const toggleAudio = () => {
    const newState = romanticAudio.toggle();
    setIsAudioPlaying(newState);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* ZONE 1: BRAND WORDMARK */}
        <div className="flex items-center gap-8 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform duration-200 active:scale-95"
            aria-label="Our Universe Home"
          >
            <div className="w-8 h-8 rounded-md bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <span className="font-bebas text-xl text-white font-black tracking-tighter">U</span>
            </div>
            <span className="font-bebas text-2xl sm:text-3xl tracking-wider text-[#E50914] font-black group-hover:text-[#ff3b47] transition-colors whitespace-nowrap">
              OUR UNIVERSE
            </span>
          </button>

          {/* ZONE 2: 4-5 CLEAN SINGLE-LINE NAV LINKS */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'home'
                  ? 'text-white font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('our-story')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'our-story'
                  ? 'text-white font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'memories'
                  ? 'text-white font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Memories
            </button>
            <button
              onClick={() => setActiveTab('little-things')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'little-things'
                  ? 'text-white font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Little Things
            </button>
            <button
              onClick={() => setActiveTab('places-list')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'places-list'
                  ? 'text-white font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Places & List
            </button>
            <button
              onClick={() => setActiveTab('secret-vault')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'secret-vault'
                  ? 'text-[#ff4d5a] font-bold border-b-2 border-[#E50914]'
                  : 'text-neutral-400 hover:text-[#ff4d5a]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Secret Vault</span>
            </button>
          </nav>
        </div>

        {/* ZONE 3: ACTIONS & UTILITIES */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Expanding Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-black/80 border border-white/20 rounded-full px-3 py-1.5 shadow-inner transition-all w-44 sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search titles, dates, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none px-2 w-full"
                />
                <button
                  onClick={toggleSearch}
                  className="text-neutral-400 hover:text-white p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-neutral-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Search memories"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Music Soundtrack Toggle Button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all relative text-xs font-medium cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#E50914] text-white ring-2 ring-[#E50914]/50 shadow-md shadow-[#E50914]/40'
                : 'bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 border border-white/10'
            }`}
            title={isAudioPlaying ? 'Mute background soundtrack' : 'Play romantic soundtrack'}
            aria-label="Toggle music soundtrack"
          >
            {isAudioPlaying ? (
              <Music className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
            ) : (
              <Music className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isAudioPlaying ? 'Playing' : 'Music'}
            </span>
            {isAudioPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
          </button>

          {/* Supabase Diagnostics / Setup Button */}
          <button
            onClick={onOpenSetupModal}
            className={`p-2 rounded-full transition-all relative ${
              isSupabaseConfigured()
                ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/30'
            }`}
            title={isSupabaseConfigured() ? 'Supabase Connected' : 'Supabase Setup Needed'}
            aria-label="Supabase Status"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Admin Security Portal Button */}
          <button
            onClick={onOpenAdminModal}
            className={`p-2 rounded-full transition-all relative ${
              currentUser
                ? 'text-white bg-emerald-950/50 ring-1 ring-emerald-500/50'
                : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
            title={currentUser ? `Admin Active: ${currentUser.email}` : 'Admin Sign In'}
            aria-label="Admin Security Portal"
          >
            <Shield className="w-4 h-4" />
            {currentUser && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            )}
          </button>

          {/* Add Memory Button (Admin only) */}
          {currentUser && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-semibold rounded-md shadow-md transition-colors cursor-pointer whitespace-nowrap active:scale-95 animate-in fade-in"
              title="Add a new relationship memory"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Memory</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsProfileMenuOpen(false);
              }}
              className="p-2 text-neutral-300 hover:text-white transition-colors rounded-full hover:bg-white/10 relative"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E50914]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#181818] border border-white/10 rounded-lg shadow-2xl py-3 z-50 text-xs">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-white/10">
                  <span className="font-semibold text-white tracking-wide">Notifications</span>
                  <span className="text-neutral-400 text-[11px]">{unreadCount} unread</span>
                </div>
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto dark-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick(n.id, n.memoryId);
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-white/5 transition-colors flex items-start gap-2.5 ${
                        !n.read ? 'bg-[#E50914]/5' : ''
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#ff4d5a] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-white">{n.title}</p>
                        <p className="text-neutral-400 mt-0.5 text-[11px] leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-neutral-500 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-md hover:bg-white/10 transition-colors group"
              aria-label="Switch Profile"
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center text-xs shadow ${activeProfile.avatarBg}`}
              >
                <span>{activeProfile.avatarEmoji}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-white/10 rounded-lg shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold border-b border-white/10">
                  Who's Watching?
                </div>
                <div className="py-1">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProfile(p);
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                        p.id === activeProfile.id ? 'text-white font-bold bg-white/5' : 'text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs ${p.avatarBg}`}
                        >
                          <span>{p.avatarEmoji}</span>
                        </div>
                        <span className="truncate">{p.name}</span>
                      </div>
                      {p.id === activeProfile.id && (
                        <Heart className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
                  <button
                    onClick={() => {
                      onOpenAdminModal();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{currentUser ? 'Admin Panel (Active)' : 'Admin Sign In'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSetupModal();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Database className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Supabase Diagnostics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around px-2 pt-2 border-t border-white/5 text-[11px] font-medium text-neutral-400">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2 ${activeTab === 'home' ? 'text-white font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('our-story')}
          className={`py-1 px-2 ${activeTab === 'our-story' ? 'text-white font-bold' : ''}`}
        >
          Story
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`py-1 px-2 ${activeTab === 'memories' ? 'text-white font-bold' : ''}`}
        >
          Memories
        </button>
        <button
          onClick={() => setActiveTab('little-things')}
          className={`py-1 px-2 ${activeTab === 'little-things' ? 'text-white font-bold' : ''}`}
        >
          Quirks
        </button>
        <button
          onClick={() => setActiveTab('places-list')}
          className={`py-1 px-2 ${activeTab === 'places-list' ? 'text-white font-bold' : ''}`}
        >
          Places
        </button>
        <button
          onClick={() => setActiveTab('secret-vault')}
          className={`py-1 px-2 text-[#ff4d5a] flex items-center gap-1 ${
            activeTab === 'secret-vault' ? 'font-bold' : ''
          }`}
        >
          <Lock className="w-3 h-3" />
          Vault
        </button>
      </div>
    </header>
  );
};
