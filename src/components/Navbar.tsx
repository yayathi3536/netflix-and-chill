import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Menu,
  Bell,
  Plus,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { User } from '@supabase/supabase-js';
import { getProfileAvatarUrl } from '../data/builtInAvatars';
import { NavMenu } from './NavMenu';

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
  const [hideNav, setHideNav] = useState(false);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      setHideNav(y > lastScrollY.current && y > 200);
      lastScrollY.current = y;
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
        hideNav ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled ? 'bg-[#141414] py-2 sm:py-3' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* ZONE 1: NETFLIX-STYLE BRAND LOGO */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-md shrink-0"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left transition-transform active:scale-95"
            aria-label="Go to home"
          >
            <span className="font-bebas text-xl sm:text-2xl lg:text-3xl tracking-wider text-[#E50914] font-black uppercase">
              OUR UNIVERSE
            </span>
          </button>

        </div>

        {/* ZONE 3: ACTIONS & UTILITIES */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
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
              onClick={() => {
                if (onSwitchProfileScreen) {
                  onSwitchProfileScreen();
                } else {
                  setIsProfileMenuOpen((prev) => !prev);
                }
              }}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-[#181818] transition-colors cursor-pointer"
              aria-label="Switch profile"
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

          </div>
        </div>
      </div>

      <NavMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMenuOpen(false);
        }}
        activeProfile={activeProfile}
        currentUser={currentUser}
        onOpenAdminModal={onOpenAdminModal}
        onSignOut={onSignOut}
        onToggleAudio={toggleAudio}
        isAudioPlaying={isAudioPlaying}
      />

    </header>
  );
};
