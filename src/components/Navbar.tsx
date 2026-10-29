import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Menu,
  Bell,
  Plus,
  Music,
  X,
  ChevronDown,
  Lock,
  Shield,
  Database,
  Film,
  Users,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { User } from '@supabase/supabase-js';
import { getProfileAvatarUrl } from '../data/builtInAvatars';
import { MobileMenu } from './MobileMenu';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onSwitchProfileScreen?: () => void;
  onSignOut?: () => void;
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
  onSwitchProfileScreen,
  onSignOut,
  onOpenAddModal,
  notifications,
  onNotificationClick,
  currentUser,
  onOpenAdminModal,
  onOpenSetupModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[#141414] py-2 sm:py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ZONE 1: NETFLIX-STYLE BRAND LOGO */}
        <div className="flex items-center gap-4 lg:gap-8 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform duration-200 active:scale-95 min-h-[44px]"
            aria-label="Our Universe Home"
          >
            <span className="font-bebas text-xl sm:text-2xl lg:text-3xl tracking-wider text-[#E50914] font-black uppercase">
              OUR UNIVERSE
            </span>
          </button>

          {/* ZONE 2: NETFLIX SINGLE-LINE NAV LINKS */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`whitespace-nowrap text-sm transition-colors ${
                activeTab === 'home' ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('our-story')}
              className={`whitespace-nowrap text-sm transition-colors ${
                activeTab === 'our-story' ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Series
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`whitespace-nowrap text-sm transition-colors ${
                activeTab === 'memories' ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('scrapbook')}
              className={`whitespace-nowrap text-sm transition-colors ${
                activeTab === 'scrapbook' ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Scrapbook
            </button>
            <button
              onClick={() => setActiveTab('secret-vault')}
              className={`whitespace-nowrap text-sm transition-colors flex items-center gap-1.5 ${
                activeTab === 'secret-vault' ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Vault</span>
            </button>
          </nav>
        </div>

        {/* ZONE 3: ACTIONS & UTILITIES */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Expanding Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#141414] border border-[#808080] rounded px-2.5 py-1.5 shadow-inner transition-all w-32 sm:w-48 md:w-60">
                <Search className="w-3.5 h-3.5 text-[#B3B3B3] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-[#FFFFFF] placeholder-[#808080] focus:outline-none px-1.5 w-full"
                />
                <button
                  onClick={toggleSearch}
                  className="text-[#808080] hover:text-[#FFFFFF] p-1 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSearch}
                className="w-10 h-10 text-[#FFFFFF] hover:text-[#B3B3B3] transition-colors rounded-full hover:bg-[#181818] cursor-pointer flex items-center justify-center"
                aria-label="Search memories"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Music Soundtrack Toggle Button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded transition-all relative text-xs font-medium cursor-pointer min-h-[40px] ${
              isAudioPlaying
                ? 'bg-white text-black font-semibold shadow-md'
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
              className="w-10 h-10 text-[#FFFFFF] hover:text-[#B3B3B3] transition-colors rounded-full hover:bg-[#181818] relative cursor-pointer flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#808080] rounded-full ring-2 ring-[#000000]" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="fixed sm:absolute left-2.5 right-2.5 sm:left-auto sm:right-0 mt-3 sm:w-80 bg-[#141414]/95 border border-white/10 rounded-xl netflix-modal-shadow py-3 z-50 text-xs backdrop-blur-md">
                <div className="px-4 pb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-[#FFFFFF]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#808080] text-[#FFFFFF] px-2 py-0.5 rounded font-bold shadow-sm">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
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
                className="w-8 h-8 rounded-lg bg-[#808080] overflow-hidden flex items-center justify-center text-sm font-bold text-[#FFFFFF] shadow ring-1 ring-white/20"
              >
                <img
                  src={getProfileAvatarUrl(activeProfile)}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#B3B3B3]" />
            </button>

            {isProfileMenuOpen && (
              <div className="fixed sm:absolute right-2 sm:right-0 mt-3 w-64 max-w-[calc(100vw-1rem)] bg-[#141414]/95 border border-white/10 rounded-xl netflix-modal-shadow py-2 z-50 text-xs backdrop-blur-md">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-[#181818] transition-colors cursor-pointer min-h-[40px] ${
                        p.id === activeProfile.id ? 'text-[#FFFFFF] font-bold bg-[#181818]' : 'text-[#B3B3B3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md bg-[#808080] overflow-hidden flex items-center justify-center text-xs text-[#FFFFFF] shrink-0 ring-1 ring-white/10"
                        >
                          <img
                            src={getProfileAvatarUrl(p)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="truncate">{p.name}</span>
                      </div>
                      {p.id === activeProfile.id && (
                        <span className="w-2 h-2 rounded-full bg-[#808080]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-[#181818] space-y-1">
                  {onSwitchProfileScreen && (
                    <button
                      onClick={() => {
                        onSwitchProfileScreen();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer min-h-[40px]"
                    >
                      <Users className="w-4 h-4 text-[#808080]" />
                      <span>Switch Profiles</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenAdminModal();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer min-h-[40px]"
                  >
                    <Shield className="w-4 h-4 text-[#808080]" />
                    <span>{currentUser ? 'Admin Panel (Active)' : 'Account & Admin'}</span>
                  </button>

                  {currentUser && (
                    <button
                      onClick={() => {
                        onOpenSetupModal();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer min-h-[40px]"
                    >
                      <Database className="w-4 h-4 text-[#808080]" />
                      <span>Cloud Storage Setup</span>
                    </button>
                  )}

                  {onSignOut && (
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818] transition-colors cursor-pointer border-t border-[#181818] pt-2 mt-1 min-h-[40px]"
                    >
                      <LogOut className="w-4 h-4 text-[#808080]" />
                      <span>Sign Out of OUR UNIVERSE</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={onSelectProfile}
        onSwitchProfileScreen={onSwitchProfileScreen}
        onSignOut={onSignOut}
        currentUser={currentUser}
        onOpenAdminModal={onOpenAdminModal}
        onOpenSetupModal={onOpenSetupModal}
        onToggleAudio={toggleAudio}
        isAudioPlaying={isAudioPlaying}
      />

    </header>
  );
};
