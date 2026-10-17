import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Plus,
  Music,
  X,
  ChevronDown,
  Lock,
  Shield,
  Database,
  Film,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onOpenAddModal?: () => void;
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
      setIsScrolled(window.scrollY > 25);
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

  useEffect(() => {
    const handleAudioState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean; currentTrackIndex: number }>;
      if (customEvent.detail && typeof customEvent.detail.isPlaying === 'boolean') {
        setIsAudioPlaying(customEvent.detail.isPlaying);
      }
    };
    window.addEventListener('ouruniverse:audiostate', handleAudioState);
    return () => window.removeEventListener('ouruniverse:audiostate', handleAudioState);
  }, []);

  const toggleAudio = () => {
    window.dispatchEvent(new CustomEvent('ouruniverse:toggleplay'));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/95 backdrop-blur-md shadow-2xl py-3 border-b border-[#181818]'
          : 'bg-gradient-to-b from-[#000000]/90 via-[#000000]/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ZONE 1: NETFLIX-STYLE BRAND LOGO */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform duration-200 active:scale-95"
            aria-label="Our Universe Home"
          >
            <span className="font-bebas text-2xl sm:text-3xl tracking-widest text-[#E50914] font-black uppercase drop-shadow-md select-none">
              OUR UNIVERSE
            </span>
          </button>

          {/* ZONE 2: NETFLIX SINGLE-LINE NAV LINKS */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'home'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('our-story')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'our-story'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              Series
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'memories'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('scrapbook')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'scrapbook'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              Scrapbook
            </button>
            <button
              onClick={() => setActiveTab('little-things')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'little-things'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              Quirks
            </button>
            <button
              onClick={() => setActiveTab('places-list')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'places-list'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              My List
            </button>
            <button
              onClick={() => setActiveTab('secret-vault')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 cursor-pointer text-xs lg:text-sm ${
                activeTab === 'secret-vault'
                  ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Vault</span>
            </button>
          </nav>
        </div>

        {/* ZONE 3: ACTIONS & UTILITIES */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Expanding Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#141414] border border-[#808080] rounded px-3 py-1.5 shadow-inner transition-all w-44 sm:w-60">
                <Search className="w-3.5 h-3.5 text-[#B3B3B3] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Titles, episodes, memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-[#FFFFFF] placeholder-[#808080] focus:outline-none px-2 w-full"
                />
                <button
                  onClick={toggleSearch}
                  className="text-[#808080] hover:text-[#FFFFFF] p-0.5 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="p-2 text-[#FFFFFF] hover:text-[#B3B3B3] transition-colors rounded-full hover:bg-[#181818] cursor-pointer"
                aria-label="Search memories"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Music Soundtrack Toggle Button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all relative text-xs font-medium cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow-md'
                : 'bg-[#181818] text-[#FFFFFF] hover:bg-white/10 border border-[#808080]/30'
            }`}
            title={isAudioPlaying ? 'Mute soundtrack' : 'Play soundtrack'}
            aria-label="Toggle music soundtrack"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAudioPlaying ? 'Playing' : 'Music'}
            </span>
            {isAudioPlaying && (
              <span className="flex items-center gap-0.5 ml-0.5">
                <span className="w-1 h-2.5 bg-[#FFFFFF] rounded-full animate-pulse" />
                <span className="w-1 h-3.5 bg-[#FFFFFF] rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1 h-2 bg-[#FFFFFF] rounded-full animate-pulse [animation-delay:0.4s]" />
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="p-2 text-[#FFFFFF] hover:text-[#B3B3B3] transition-colors rounded hover:bg-[#181818] relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full ring-2 ring-[#000000]" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#141414] border border-[#808080]/40 rounded shadow-2xl py-3 z-50 text-xs">
                <div className="px-4 pb-2 border-b border-[#181818] flex items-center justify-between">
                  <span className="font-semibold text-[#FFFFFF]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#E50914] text-[#FFFFFF] px-2 py-0.5 rounded font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#181818]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick(n.id, n.memoryId);
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 hover:bg-[#181818] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#181818]/60' : ''
                      }`}
                    >
                      <div className="font-medium text-[#FFFFFF] mb-0.5">{n.title}</div>
                      <div className="text-[#B3B3B3] text-[11px] leading-relaxed">
                        {n.message}
                      </div>
                      <div className="text-[#808080] text-[10px] mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-[#181818] transition-colors cursor-pointer"
              aria-label="User Profile"
            >
              <div
                className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-sm font-bold text-[#FFFFFF] shadow"
              >
                <span>{activeProfile.avatarEmoji || '❤️'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#B3B3B3]" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#141414] border border-[#808080]/40 rounded shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[#B3B3B3] text-[11px] uppercase tracking-wider font-semibold border-b border-[#181818]">
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
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#181818] transition-colors cursor-pointer ${
                        p.id === activeProfile.id ? 'text-[#FFFFFF] font-bold bg-[#181818]' : 'text-[#B3B3B3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded bg-[#E50914] flex items-center justify-center text-xs text-[#FFFFFF]"
                        >
                          <span>{p.avatarEmoji || '❤️'}</span>
                        </div>
                        <span className="truncate">{p.name}</span>
                      </div>
                      {p.id === activeProfile.id && (
                        <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-[#181818] space-y-1">
                  <button
                    onClick={() => {
                      onOpenAdminModal();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>{currentUser ? 'Admin Panel (Active)' : 'Admin Sign In'}</span>
                  </button>

                  {currentUser && (
                    <button
                      onClick={() => {
                        onOpenSetupModal();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-[#808080]" />
                      <span>Cloud Storage Setup</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around px-2 pt-2.5 border-t border-[#181818] text-[11px] font-medium text-[#B3B3B3] overflow-x-auto no-scrollbar bg-[#000000]">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'home' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('our-story')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'our-story' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          Series
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'memories' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => setActiveTab('scrapbook')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'scrapbook' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          Scrapbook
        </button>
        <button
          onClick={() => setActiveTab('little-things')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'little-things' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          Quirks
        </button>
        <button
          onClick={() => setActiveTab('places-list')}
          className={`py-1 px-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'places-list' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          My List
        </button>
        <button
          onClick={() => setActiveTab('secret-vault')}
          className={`py-1 px-2 whitespace-nowrap text-[#B3B3B3] flex items-center gap-1 cursor-pointer ${
            activeTab === 'secret-vault' ? 'text-[#FFFFFF] font-bold border-b-2 border-[#E50914]' : ''
          }`}
        >
          <Lock className="w-3 h-3 text-[#E50914]" />
          <span>Vault</span>
        </button>
      </div>
    </header>
  );
};
