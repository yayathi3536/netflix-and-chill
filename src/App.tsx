import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  Download,
  RotateCcw,
  Film,
  Compass,
  CheckCircle,
  Clock,
  Database,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';
import { MemoryItem, Episode, UserProfile, NotificationItem, SiteContentMap, SiteContentSection } from './types';
import { storageService } from './services/storage';
import { supabaseService, checkIsAdmin, checkIsApproved } from './services/supabaseService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { VisualArt } from './components/VisualArt';
import { StorylineView } from './components/StorylineView';
import { CarouselRow } from './components/CarouselRow';
import { DetailModal } from './components/DetailModal';
import { RelivePlayer } from './components/RelivePlayer';
import { SecretVaultModal } from './components/SecretVaultModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { EditSiteContentModal } from './components/EditSiteContentModal';
import { AdminModeBar } from './components/AdminModeBar';
import { AdminStudioModal } from './components/AdminStudioModal';
import { MovieCard } from './components/MovieCard';
import { MusicPlayer } from './components/MusicPlayer';
import { SurpriseModal } from './components/SurpriseModal';
import { ConstellationSection } from './components/ConstellationSection';
import { AuthScreen } from './components/AuthScreen';
import ProfileSelect from './components/ProfileSelect';
import { romanticAudio } from './utils/romanticAudio';
import { hasValidVideo, isLetterItem, getMemoryImageUrl } from './utils/mediaHelpers';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [memories, setMemories] = useState<MemoryItem[]>(storageService.getInitialMemories());
  const [siteContent, setSiteContent] = useState<SiteContentMap>(storageService.getInitialSiteContent());
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState<UserProfile>(storageService.getActiveProfile());
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Supabase & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(isSupabaseConfigured());
  const [hasSelectedProfile, setHasSelectedProfile] = useState<boolean>(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);
  const [storageSource, setStorageSource] = useState<'supabase' | 'local'>('local');
  const [isSchemaMissing, setIsSchemaMissing] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modals & Player State
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [playingMemory, setPlayingMemory] = useState<{ memory: MemoryItem; episode?: Episode } | null>(null);
  const [secretVaultMemory, setSecretVaultMemory] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState<MemoryItem | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isEditSiteContentOpen, setIsEditSiteContentOpen] = useState(false);
  const [editSiteContentInitialTab, setEditSiteContentInitialTab] = useState<SiteContentSection>('hero');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [soundtrackTrackIndex, setSoundtrackTrackIndex] = useState(0);

  // Authorization must come from server-controlled app_metadata.
  const isAdmin = useMemo(() => checkIsAdmin(currentUser), [currentUser]);
  const isApproved = useMemo(() => checkIsApproved(currentUser), [currentUser]);

  // Authorized profiles for the signed-in user
  const authorizedProfiles = useMemo(() => {
    return storageService.getAuthorizedProfiles(currentUser?.id, currentUser?.email, isAdmin);
  }, [profiles, currentUser, isAdmin]);

  // Places filter tab state
  const [placesFilter, setPlacesFilter] = useState<'all' | 'visited' | 'bucket-list'>('all');

  useEffect(() => {
    // 1. Load initial profiles and notifications
    setProfiles(storageService.getProfiles());
    setActiveProfile(storageService.getActiveProfile());
    setNotifications(storageService.getNotifications());

    // 2. Fetch authenticated Supabase session. Private content is loaded only for approved accounts.
    if (isSupabaseConfigured()) {
      supabaseService
        .getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          if (user && checkIsApproved(user)) {
            storageService.loadSiteContent().then((content) => setSiteContent(content));
            fetchRemoteMemories();
            const sessionProfileId = storageService.getSelectedSessionProfileId(user.id);
            const allowed = storageService.getAuthorizedProfiles(
              user.id,
              user.email,
              checkIsAdmin(user)
            );
            const matchedProfile = allowed.find((p) => p.id === sessionProfileId);
            if (matchedProfile) {
              setActiveProfile(matchedProfile);
              setHasSelectedProfile(true);
            } else {
              setHasSelectedProfile(false);
            }
          } else {
            setHasSelectedProfile(false);
            setMemories([]);
            setSiteContent({});
          }
        })
        .finally(() => {
          setIsAuthChecking(false);
        });

      const unsubscribe = supabaseService.onAuthStateChange((user, _session, event) => {
        setCurrentUser(user);

        // Never leave private content in React state after sign-out or a pending-account transition.
        if (!user || !checkIsApproved(user)) {
          setHasSelectedProfile(false);
          setMemories([]);
          setSiteContent({});
          setSelectedMemory(null);
          setPlayingMemory(null);
          setSecretVaultMemory(null);
        } else if (event !== 'TOKEN_REFRESHED') {
          // Refresh server-authorized content after sign-in/account changes.
          void fetchRemoteMemories();
          void storageService.loadSiteContent().then((content) => setSiteContent(content));
        }

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        } else if (event === 'SIGNED_OUT' || !user) {
          setHasSelectedProfile(false);
          setIsPasswordRecovery(false);
        }
      });

      return () => {
        unsubscribe();
      };
    } else {
      setStorageSource('local');
      setIsAuthChecking(false);
    }
  }, []);

  // Synchronize client-side routing with URL hash for GitHub Pages deep linking and discreet admin route (#admin, #login)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'admin' || hash === 'login') {
        setIsAdminModalOpen(true);
        return;
      }
      const validTabs = ['home', 'our-story', 'memories', 'little-things', 'places-list', 'secret-vault'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    } else {
      history.pushState(null, '', `#${tab}`);
    }
  };

  // Keep the active tab synchronized with browser back/forward navigation.
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validTabs = ['home', 'our-story', 'memories', 'little-things', 'places-list', 'secret-vault'];
      setActiveTab(validTabs.includes(hash) ? hash : 'home');
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const fetchRemoteMemories = async () => {
    setIsLoadingData(true);
    try {
      const result = await storageService.loadMemories();
      setMemories(result.memories);
      setStorageSource(result.source);
      if (result.isSchemaMissing) {
        setIsSchemaMissing(true);
        setStatusNotification(null);
      } else {
        setIsSchemaMissing(false);
        if (result.error) {
          setStatusNotification(result.error);
        } else {
          setStatusNotification(null);
        }
      }
    } catch (err) {
      console.warn('Notice: Using local memories cache while database tables are initialized.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleToggleWatchlist = async (id: string) => {
    await storageService.toggleWatchlist(id);
    const updated = memories.map((m) =>
      m.id === id ? { ...m, isInWatchlist: !m.isInWatchlist } : m
    );
    setMemories(updated);

    if (selectedMemory && selectedMemory.id === id) {
      setSelectedMemory({
        ...selectedMemory,
        isInWatchlist: !selectedMemory.isInWatchlist,
      });
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const target = memories.find((m) => m.id === id);
    if (target) {
      const updated = { ...target, isFavorite: !target.isFavorite };
      await storageService.saveMemory(updated);
      setMemories(memories.map((m) => (m.id === id ? updated : m)));
    }
  };

  const handleSelectProfile = (profile: UserProfile) => {
    const isAllowed = authorizedProfiles.some((p) => p.id === profile.id);
    const chosen = isAllowed ? profile : authorizedProfiles[0] || profile;
    storageService.setActiveProfile(chosen.id, currentUser?.id);
    setActiveProfile(chosen);
    setHasSelectedProfile(true);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    const updatedList = storageService.saveProfile(updatedProfile);
    setProfiles(updatedList);
    if (activeProfile.id === updatedProfile.id) {
      setActiveProfile(updatedProfile);
    }
  };

  const handleSignOut = async () => {
    storageService.clearSelectedSessionProfile(currentUser?.id);
    await supabaseService.signOut();
    setCurrentUser(null);
    setHasSelectedProfile(false);
    setIsPasswordRecovery(false);
  };

  const handleOpenItem = (memory: MemoryItem) => {
    if (isLetterItem(memory)) {
      setSecretVaultMemory(memory);
    } else {
      setSelectedMemory(memory);
    }
  };

  const handlePlayMemory = (memory: MemoryItem, episode?: Episode) => {
    if (hasValidVideo(memory, episode)) {
      setPlayingMemory({ memory, episode });
    } else {
      handleOpenItem(memory);
    }
  };

  const handleNotificationClick = (id: string, memoryId?: string) => {
    storageService.markNotificationAsRead(id);
    setNotifications(storageService.getNotifications());
    if (memoryId) {
      const target = memories.find((m) => m.id === memoryId);
      if (target) {
        handleOpenItem(target);
      }
    }
  };

  const handleOpenEditMemoryModal = (memory: MemoryItem) => {
    setMemoryToEdit(memory);
    setIsAddModalOpen(true);
  };

  const handleAddOrUpdateMemory = async (memoryItem: MemoryItem) => {
    setIsLoadingData(true);
    const { success, item, error } = await storageService.saveMemory(memoryItem);
    setIsLoadingData(false);

    if (error) {
      alert(`Note: ${error}`);
    }

    // Refresh memory list
    const existingIndex = memories.findIndex((m) => m.id === item.id);
    if (existingIndex >= 0) {
      const updated = [...memories];
      updated[existingIndex] = item;
      setMemories(updated);
    } else {
      setMemories([item, ...memories]);
    }

    setMemoryToEdit(null);
  };

  const handleDeleteMemory = async (id: string, photoUrl?: string) => {
    setIsLoadingData(true);
    const { success, error } = await storageService.deleteMemory(id, photoUrl);
    setIsLoadingData(false);

    if (!success && error) {
      alert(`Delete error: ${error}`);
      return;
    }

    setMemories(memories.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) setSelectedMemory(null);
    setMemoryToEdit(null);
  };

  const handleExportData = () => {
    const json = storageService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `our_universe_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all memories and notes to default story?')) {
      storageService.resetToDefaults();
      setMemories(storageService.getInitialMemories());
    }
  };

  useEffect(() => {
    const handleAudioState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean; currentTrackIndex: number }>;
      if (customEvent.detail) {
        if (typeof customEvent.detail.isPlaying === 'boolean') {
          setIsAudioPlaying(customEvent.detail.isPlaying);
        }
        if (typeof customEvent.detail.currentTrackIndex === 'number') {
          setSoundtrackTrackIndex(customEvent.detail.currentTrackIndex);
        }
      }
    };
    window.addEventListener('ouruniverse:audiostate', handleAudioState);
    return () => window.removeEventListener('ouruniverse:audiostate', handleAudioState);
  }, []);

  const toggleAudio = () => {
    window.dispatchEvent(new CustomEvent('ouruniverse:toggleplay'));
  };

  // Groupings for Netflix Rows
  const featuredItem = useMemo(() => {
    return (
      memories.find((m) => m.id === 'featured-story-of-us') ||
      memories[0] ||
      null
    );
  }, [memories]);

  const continueWatchingItems = useMemo(() => {
    return memories
      .filter((m) => m.category === 'memories' && m.progress !== undefined)
      .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
  }, [memories]);

  const ourStorySeries = useMemo(() => {
    const rawStories = memories.filter(
      (m) => m.category === 'our-story' && m.id !== 'featured-story-of-us'
    );

    // Retrieve custom order from siteContent or local storage
    let customOrderIds: string[] | null = null;
    if (siteContent.storyline_custom_order) {
      try {
        const parsed = JSON.parse(siteContent.storyline_custom_order);
        if (Array.isArray(parsed) && parsed.length > 0) {
          customOrderIds = parsed;
        }
      } catch (e) {
        // ignore parse error
      }
    }
    if (!customOrderIds) {
      customOrderIds = storageService.getStorylineOrder();
    }

    if (customOrderIds && customOrderIds.length > 0) {
      return [...rawStories].sort((a, b) => {
        const indexA = customOrderIds!.indexOf(a.id);
        const indexB = customOrderIds!.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        const rankA = a.sortOrder ?? a.isTop10 ?? 999;
        const rankB = b.sortOrder ?? b.isTop10 ?? 999;
        return rankA - rankB;
      });
    }

    return [...rawStories].sort((a, b) => {
      const rankA = a.sortOrder ?? a.isTop10 ?? 999;
      const rankB = b.sortOrder ?? b.isTop10 ?? 999;
      return rankA - rankB;
    });
  }, [memories, siteContent.storyline_custom_order]);

  const handleReorderStoryline = async (newOrderedStories: MemoryItem[]) => {
    const orderedIds = newOrderedStories.map((s) => s.id);
    const updatedMemories = memories.map((m) => {
      const idx = orderedIds.indexOf(m.id);
      if (idx !== -1) {
        return { ...m, isTop10: idx + 1, sortOrder: idx + 1 };
      }
      return m;
    });
    setMemories(updatedMemories);

    setSiteContent((prev) => ({
      ...prev,
      storyline_custom_order: JSON.stringify(orderedIds),
    }));

    return await storageService.saveStorylineOrder(newOrderedStories);
  };

  const littleThingsCollection = useMemo(() => {
    return memories.filter((m) => m.category === 'little-things');
  }, [memories]);

  const placesListItems = useMemo(() => {
    const base = memories.filter((m) => m.category === 'places-list');
    if (placesFilter === 'all') return base;
    return base.filter((p) => p.listStatus === placesFilter);
  }, [memories, placesFilter]);

  const secretVaultItems = useMemo(() => {
    return memories.filter((m) => m.category === 'secret-vault' || m.isSecret);
  }, [memories]);

  // Search Filtering
  const filteredMemories = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        (m.subtitle && m.subtitle.toLowerCase().includes(query)) ||
        m.synopsis.toLowerCase().includes(query) ||
        (m.location && m.location.toLowerCase().includes(query)) ||
        m.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [memories, searchQuery]);

  const isSupabaseReady = isSupabaseConfigured();

  const renderAppContent = () => {
    // 1. INITIAL SESSION CHECK LOADING SCREEN
    if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col items-center justify-center gap-4 selection:bg-neutral-700 selection:text-[#FFFFFF]">
        <div className="font-bebas text-4xl sm:text-5xl tracking-widest text-neutral-300 font-black uppercase animate-pulse">
          OUR UNIVERSE
        </div>
        <Loader2 className="w-7 h-7 text-neutral-300 animate-spin" />
      </div>
    );
  }

  // 2. UNAUTHENTICATED VISITOR (OR PASSWORD RECOVERY) -> LOGIN / SIGN UP
  if (!currentUser || isPasswordRecovery) {
    return (
      <AuthScreen
        initialMode={isPasswordRecovery ? 'update-password' : 'signin'}
        onAuthSuccess={(user) => {
          storageService.clearSelectedSessionProfile(user.id);
          setCurrentUser(user);
          setIsPasswordRecovery(false);
          setHasSelectedProfile(false);
          if (checkIsApproved(user)) {
            fetchRemoteMemories();
            storageService.loadSiteContent().then((content) => setSiteContent(content));
          } else {
            setMemories([]);
            setSiteContent({});
          }
        }}
        onPasswordUpdated={() => setIsPasswordRecovery(false)}
      />
    );
  }

  // 3. Authenticated but not manually approved: do not render cached/private content.
  if (currentUser && !isApproved) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-xl border border-[#333333] bg-[#141414] p-8 text-center">
          <div className="font-bebas text-4xl tracking-widest text-neutral-300 font-black uppercase mb-5">
            OUR UNIVERSE
          </div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-700/10">
            <Shield className="h-7 w-7 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-semibold mb-3">Waiting for approval</h1>
          <p className="text-sm leading-6 text-[#B3B3B3] mb-6">
            Your email is verified, but this account has not been approved yet. Please ask the site owner to approve it in Supabase. Your private memories and letters stay hidden until approval.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded bg-neutral-700 px-5 py-2.5 text-sm font-semibold hover:bg-[#404040] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // 4. APPROVED USER -> WHO'S WATCHING? PROFILE SELECTION
  if (!hasSelectedProfile) {
    return (
      <ProfileSelect
        profiles={authorizedProfiles}
        onSelect={handleSelectProfile}
        onSaveProfile={handleSaveProfile}
        userEmail={currentUser.email}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
    );
  }

  // 4. SELECTED AUTHORIZED PROFILE -> OUR UNIVERSE HOME
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col selection:bg-neutral-700 selection:text-[#FFFFFF]">
      {/* NETFLIX-STYLE TOP NAVIGATION */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeProfile={activeProfile}
        profiles={authorizedProfiles}
        onSelectProfile={handleSelectProfile}
        onSwitchProfileScreen={() => {
          storageService.clearSelectedSessionProfile(currentUser.id);
          setHasSelectedProfile(false);
        }}
        onSignOut={handleSignOut}
        onOpenAddModal={() => {
          setMemoryToEdit(null);
          setIsAddModalOpen(true);
        }}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        currentUser={isAdmin ? currentUser : null}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
      />

      {/* TOP SYSTEM STATUS NOTIFICATION (Admin Only) */}
      {isAdmin && (!isSupabaseReady ? (
        <div className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-[4%] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded bg-[#181818] border border-neutral-500/30 text-xs text-[#B3B3B3]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-neutral-300 shrink-0" />
              <span>
                <strong className="text-[#FFFFFF]">Local Mode:</strong> Supabase credentials not detected in environment. Using persistent browser storage.
              </span>
            </div>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-[#FFFFFF] bg-neutral-700 hover:bg-[#404040] px-3 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer self-start sm:self-auto min-h-[36px]"
            >
              Setup Supabase &rarr;
            </button>
          </div>
        </div>
      ) : isSchemaMissing ? (
        <div className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-[4%] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded bg-[#181818] border border-neutral-500/50 text-xs text-[#B3B3B3] shadow-xl">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-semibold text-[#FFFFFF]">Database Tables Need Setup:</span>{' '}
                <span className="text-[#B3B3B3]">
                  Supabase is connected, but the <code>public.memories</code> table has not been created yet. Copy and run the SQL migration script in your Supabase SQL Editor.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-[#FFFFFF] bg-neutral-700 hover:bg-[#404040] px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow active:scale-95 shrink-0 min-h-[36px]"
            >
              Copy SQL Migration &rarr;
            </button>
          </div>
        </div>
      ) : statusNotification ? (
        <div className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-[4%] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded bg-[#181818] border border-neutral-500/30 text-xs text-[#B3B3B3]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-300 shrink-0" />
              <span className="text-[#FFFFFF]">{statusNotification}</span>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[#FFFFFF] bg-neutral-700 hover:bg-[#404040] px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer self-start sm:self-auto min-h-[36px]"
            >
              Sync Database
            </button>
          </div>
        </div>
      ) : null)}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pb-16">
        {/* SEARCH RESULTS VIEW (When search is active) */}
        {filteredMemories !== null ? (
          <div className="w-full px-4 sm:px-6 lg:px-[4%] pt-24 sm:pt-28 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-bebas text-3xl sm:text-4xl text-white font-bold tracking-wide">
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Found {filteredMemories.length} matching relationship memories
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-300 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {filteredMemories.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Film className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="font-bebas text-2xl text-neutral-400">
                  No memories found matching that query
                </h3>
                <p className="text-xs text-neutral-500">
                  Try searching for "roadtrip", "coffee", "first date", or tags!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMemories.map((m) => (
                  <MovieCard
                    key={m.id}
                    memory={m}
                    className="w-full"
                    onPlay={(mem) => handlePlayMemory(mem)}
                    onOpenInfo={(mem) => handleOpenItem(mem)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onToggleFavorite={handleToggleFavorite}
                    onUnlockVault={(mem) => setSecretVaultMemory(mem)}
                    onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TAB ROUTING */
          <>
            {activeTab === 'home' && (
              <div>
                {/* 1. HERO BILLBOARD */}
                {featuredItem && (
                  <HeroBanner
                    memory={featuredItem}
                    onPlay={(m) => handlePlayMemory(m)}
                    onOpenInfo={(m) => handleOpenItem(m)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onExploreMemories={() => handleTabChange('memories')}
                    isAudioPlaying={isAudioPlaying}
                    onToggleAudio={toggleAudio}
                    isAdmin={isAdmin}
                    onEditHero={() => {
                      setEditSiteContentInitialTab('hero');
                      setIsEditSiteContentOpen(true);
                    }}
                    customTitle={siteContent.hero_title}
                    customSubtitle={siteContent.hero_subtitle}
                    customSynopsis={siteContent.hero_synopsis}
                    customBackdropUrl={siteContent.hero_backdrop_url}
                    customBadge={siteContent.hero_badge}
                    customSeriesTag={siteContent.hero_series_tag}
                  />
                )}

                {/* CONTENT ROWS SECTION: Our Story, Timeline of Our Universe, Continue Watching, Memories */}
                <div className="relative z-20 space-y-2 mt-4 sm:mt-6">
                  {/* ROW 1: CONTINUE WATCHING */}
                  {(isLoadingData || continueWatchingItems.length > 0) && (
                    <CarouselRow
                      title={siteContent.section_continue_title || "Continue Watching: Our Memories"}
                      subtitle={siteContent.section_continue_sub || "Pick up right where we left off"}
                      items={continueWatchingItems}
                      isLoading={isLoadingData}
                      onPlay={(m) => handlePlayMemory(m)}
                      onOpenInfo={(m) => handleOpenItem(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onUnlockVault={(m) => setSecretVaultMemory(m)}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* ROW 2: ORIGINAL SERIES: OUR STORY (TOP 10 PORTRAITS) */}
                  {(isLoadingData || ourStorySeries.length > 0) && (
                    <CarouselRow
                      title={siteContent.section_our_story_title || "Original Series: Our Story"}
                      subtitle={siteContent.section_our_story_sub || "Top 10 Relationship Chapters of All Time"}
                      items={ourStorySeries}
                      isLoading={isLoadingData}
                      isPortrait={true}
                      onPlay={(m) => handlePlayMemory(m)}
                      onOpenInfo={(m) => handleOpenItem(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onUnlockVault={(m) => setSecretVaultMemory(m)}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* TIMELINE OF OUR UNIVERSE */}
                  <ConstellationSection
                    milestones={ourStorySeries}
                    onSelectMilestone={(m) => handleOpenItem(m)}
                  />
                </div>
              </div>
            )}

            {/* TAB: OUR STORY (Dedicated Timeline & Story View with Custom Drag-and-Drop Order) */}
            {activeTab === 'our-story' && (
              <StorylineView
                stories={ourStorySeries}
                onReorder={handleReorderStoryline}
                onSelectStory={(ch) => handleOpenItem(ch)}
                onPlayStory={(ch) => handlePlayMemory(ch)}
                onToggleWatchlist={handleToggleWatchlist}
                onUnlockVault={(ch) => setSecretVaultMemory(ch)}
                onEditStory={isAdmin ? handleOpenEditMemoryModal : undefined}
                isAdmin={isAdmin}
              />
            )}

            {/* TAB: MEMORIES (Continue Watching & All Memories) */}
            {activeTab === 'memories' && (
              <div className="w-full px-4 sm:px-6 lg:px-[4%] pt-24 sm:pt-28 pb-12 space-y-8 bg-[#000000]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-bold tracking-widest uppercase mb-1">
                    <Film className="w-3.5 h-3.5" />
                    <span>FEATURE FILMS & MEMORIES</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
                    Our Memories
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
                    Unscripted moments, laughing fits, rainy dates, and cozy quiet evenings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {memories
                    .filter((m) => m.category === 'memories')
                    .map((m) => (
                      <MovieCard
                        key={m.id}
                        memory={m}
                        className="w-full"
                        onPlay={(mem) => handlePlayMemory(mem)}
                        onOpenInfo={(mem) => handleOpenItem(mem)}
                        onToggleWatchlist={handleToggleWatchlist}
                        onToggleFavorite={handleToggleFavorite}
                        onUnlockVault={(mem) => setSecretVaultMemory(mem)}
                        onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TAB: LITTLE THINGS I LOVE ABOUT YOU */}
            {activeTab === 'little-things' && (
              <div className="w-full px-4 sm:px-6 lg:px-[4%] pt-24 sm:pt-28 pb-12 space-y-8 bg-[#000000]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-bold tracking-widest uppercase mb-1">
                    <Heart className="w-3.5 h-3.5 fill-[#E50914]" />
                    <span>ORIGINAL COLLECTION</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
                    Little Things I Love About You
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
                    The microscopic quirks, gestures, and adorable habits that make you the only person for me.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {littleThingsCollection.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMemory(item)}
                      className="p-5 rounded-xl bg-[#141414] border border-white/10 hover:border-white/30 netflix-card-shadow transition-all duration-300 cursor-pointer hover:scale-[1.02] space-y-3.5 flex flex-col justify-between group select-none"
                    >
                      {Boolean(getMemoryImageUrl(item, 'landscape')) && (
                        <div className="relative block aspect-video w-full shrink-0 rounded-lg overflow-hidden bg-[#000000] -mt-1 mb-4">
                          <VisualArt
                            id={item.id}
                            category={item.category}
                            title={item.title}
                            imageUrl={getMemoryImageUrl(item, 'landscape')}
                            variant="landscape"
                            aspectRatio="16/9"
                            focalPosition="center"
                            fit="cover"
                            fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                            className="block w-full h-full"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-neutral-300 font-bold tracking-wider uppercase">
                            {item.duration || 'Quirk'}
                          </span>
                          <Heart className="w-4 h-4 text-[#E50914] fill-[#E50914]/40 group-hover:fill-[#E50914] transition-colors" />
                        </div>
                        <h3 className="font-bebas text-2xl text-[#FFFFFF] font-bold leading-tight uppercase tracking-wide">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-[#B3B3B3] font-medium italic">
                            "{item.subtitle}"
                          </p>
                        )}
                        <p className="text-xs text-[#B3B3B3] leading-relaxed font-light line-clamp-3">
                          {item.fullStory}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
                        <span className="uppercase tracking-wider font-semibold group-hover:text-[#FFFFFF] transition-colors flex items-center gap-1">
                          <span>More Info</span>
                          <span>&rarr;</span>
                        </span>
                        <span className="text-[#FFFFFF] font-bold">{item.matchScore}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PLACES & LIST (Interactive Travel Board) */}
            {activeTab === 'places-list' && (
              <div className="w-full px-4 sm:px-6 lg:px-[4%] pt-24 sm:pt-28 pb-12 space-y-8 bg-[#000000]">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-bold tracking-widest uppercase mb-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>MY LIST & EXPEDITIONS</span>
                    </div>
                    <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
                      Places & Experiences Together
                    </h1>
                    <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
                      Our favorite shared adventures and future dream destinations.
                    </p>
                  </div>

                  {/* Filter Controls: Sleek Segmented Control */}
                  <div className="flex items-center gap-1 p-1 bg-[#141414] rounded-lg border border-white/10 shrink-0">
                    <button
                      onClick={() => setPlacesFilter('all')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        placesFilter === 'all'
                          ? 'bg-neutral-700 text-[#FFFFFF] font-bold shadow-md'
                          : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
                      }`}
                    >
                      All Places ({memories.filter((m) => m.category === 'places-list').length})
                    </button>
                    <button
                      onClick={() => setPlacesFilter('visited')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        placesFilter === 'visited'
                          ? 'bg-neutral-700 text-[#FFFFFF] font-bold shadow-md'
                          : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#FFFFFF]" />
                      <span>Visited</span>
                    </button>
                    <button
                      onClick={() => setPlacesFilter('bucket-list')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                        placesFilter === 'bucket-list'
                          ? 'bg-neutral-700 text-[#FFFFFF] font-bold shadow-md'
                          : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#FFFFFF]" />
                      <span>Bucket List</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {placesListItems.map((p) => (
                    <MovieCard
                      key={p.id}
                      memory={p}
                      onPlay={(mem) => handlePlayMemory(mem)}
                      onOpenInfo={(mem) => handleOpenItem(mem)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onUnlockVault={(mem) => setSecretVaultMemory(mem)}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECRET VAULT */}
            {activeTab === 'secret-vault' && (
              <div className="w-full px-4 sm:px-6 lg:px-[4%] pt-24 sm:pt-28 pb-12 space-y-8 bg-[#000000]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-bold tracking-widest uppercase mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>CONFIDENTIAL & PROTECTED</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
                    Hidden Episodes: Personal Surprises & Letters
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
                    Password-protected love letters, intimate confessions, and redeemable surprise date night coupons.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {secretVaultItems.map((vault) => (
                    <div
                      key={vault.id}
                      onClick={() => setSecretVaultMemory(vault)}
                      className="p-6 rounded bg-[#141414] border border-[#181818] hover:border-neutral-500/60 transition-all cursor-pointer shadow-xl hover:scale-[1.02] flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#FFFFFF] bg-neutral-700 px-2.5 py-0.5 rounded shadow">
                            CONFIDENTIAL
                          </span>
                          <Lock className="w-4 h-4 text-neutral-300 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="font-bebas text-2xl sm:text-3xl text-[#FFFFFF] font-bold uppercase tracking-wide">
                          {vault.title}
                        </h3>
                        <p className="text-xs text-[#B3B3B3] leading-relaxed font-light">
                          {vault.synopsis}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#181818] flex items-center justify-between text-xs">
                        <span className="text-neutral-300">Unlock with anniversary code</span>
                        <span className="font-bold text-neutral-300 group-hover:underline uppercase tracking-wider">
                          Tap to Unlock &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER - STRICT NETFLIX DARK THEME */}
      <footer className="border-t border-[#181818] bg-[#000000] py-12 px-4 sm:px-6 lg:px-8 text-neutral-300 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bebas text-2xl text-neutral-300 font-black tracking-widest uppercase">
                OUR UNIVERSE
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-[#FFFFFF] font-bold text-xs uppercase tracking-wider">Season Forever</span>
            </div>
            <p className="text-[11px] text-[#B3B3B3] max-w-md">
              Built with all my love for you. Every moment, every memory, forever streaming in our hearts.
            </p>
          </div>

          {/* Supabase Status & Admin Utilities */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141414] hover:bg-[#181818] border border-neutral-500/30 text-[11px] transition-colors cursor-pointer text-[#B3B3B3] hover:text-[#FFFFFF]"
            >
              <Shield
                className={`w-3.5 h-3.5 ${
                  isAdmin ? 'text-neutral-300' : 'text-neutral-300'
                }`}
              />
              <span>{isAdmin ? 'Admin Verified' : 'Admin Sign In'}</span>
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141414] hover:bg-[#181818] border border-neutral-500/30 text-[11px] transition-colors cursor-pointer text-[#B3B3B3] hover:text-[#FFFFFF]"
                >
                  <Database
                    className={`w-3.5 h-3.5 ${
                      storageSource === 'supabase' ? 'text-neutral-300' : 'text-neutral-300'
                    }`}
                  />
                  <span>
                    {storageSource === 'supabase'
                      ? 'Cloud Synced (Supabase)'
                      : 'Local Mode (Supabase Setup)'}
                  </span>
                </button>

                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#181818] hover:bg-white/10 border border-neutral-500/30 text-[#FFFFFF] transition-colors cursor-pointer text-[11px]"
                  title="Download memory backup JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  className="p-1.5 rounded hover:bg-[#181818] text-neutral-300 hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  title="Reset default relationship story"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* DETAIL MODAL OVERLAY */}
      {selectedMemory && (
        <DetailModal
          memory={selectedMemory}
          currentUser={isAdmin ? currentUser : null}
          onClose={() => setSelectedMemory(null)}
          onPlay={(m, ep) => {
            setSelectedMemory(null);
            handlePlayMemory(m, ep);
          }}
          onToggleWatchlist={handleToggleWatchlist}
          onToggleFavorite={handleToggleFavorite}
          onUnlockVault={(m) => {
            setSelectedMemory(null);
            setSecretVaultMemory(m);
          }}
          onEditMemory={isAdmin ? (m) => {
            setSelectedMemory(null);
            setMemoryToEdit(m);
            setIsAddModalOpen(true);
          } : undefined}
          relatedMemories={memories.filter(
            (m) => m.id !== selectedMemory.id && m.category === selectedMemory.category
          )}
          onSelectRelated={(item) => handleOpenItem(item)}
        />
      )}

      {/* RELIVE PLAYER (FULLSCREEN CINEMATIC PLAYER) */}
      {playingMemory && (
        <RelivePlayer
          memory={playingMemory.memory}
          episode={playingMemory.episode}
          onClose={() => setPlayingMemory(null)}
          onNextMemory={(() => {
            const videoMemories = memories.filter((m) => hasValidVideo(m));
            if (videoMemories.length <= 1) return undefined;
            return () => {
              const currentIndex = videoMemories.findIndex((m) => m.id === playingMemory.memory.id);
              const nextMemory = videoMemories[(currentIndex + 1) % videoMemories.length];
              setPlayingMemory({ memory: nextMemory });
            };
          })()}
        />
      )}

      {/* SECRET VAULT MODAL (LOVE LETTERS & COUPONS) */}
      {secretVaultMemory && (
        <SecretVaultModal
          memory={secretVaultMemory}
          onClose={() => setSecretVaultMemory(null)}
          onRedeemCoupon={() => {
            setMemories([...storageService.getLocalMemories()]);
          }}
          isAdmin={isAdmin}
          onEditLetter={() => {
            setEditSiteContentInitialTab('letter');
            setIsEditSiteContentOpen(true);
          }}
          customLetterTitle={siteContent.letter_title}
          customLetterSubtitle={siteContent.letter_subtitle}
          customLetterDate={siteContent.letter_date}
          customLetterContent={siteContent.letter_content}
          customLetterSignoff={siteContent.letter_signoff}
          customPasscode={siteContent.secret_passcode}
        />
      )}

      {/* ADD / EDIT MEMORY MODAL WITH SUPABASE STORAGE PHOTO UPLOAD */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        currentUser={isAdmin ? currentUser : null}
        memoryToEdit={memoryToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setMemoryToEdit(null);
        }}
        onAddMemory={handleAddOrUpdateMemory}
        onDeleteMemory={handleDeleteMemory}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* ADMIN AUTH MODAL (LOGIN & SYNC) */}
      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user) {
            fetchRemoteMemories();
            storageService.loadSiteContent().then((content) => setSiteContent(content));
          }
        }}
        onMigrationComplete={() => {
          fetchRemoteMemories();
          storageService.loadSiteContent().then((content) => setSiteContent(content));
        }}
      />

      {/* SUPABASE SETUP & DEPLOYMENT GUIDE MODAL */}
      <SupabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        isSchemaMissing={isSchemaMissing}
      />

      {/* EDIT SITE CONTENT & LETTERS MODAL */}
      <EditSiteContentModal
        isOpen={isEditSiteContentOpen}
        onClose={() => setIsEditSiteContentOpen(false)}
        siteContent={siteContent}
        onUpdateSiteContent={(newContent) => {
          setSiteContent(newContent);
        }}
        initialSection={editSiteContentInitialTab}
      />

      {/* FLOATING ADMIN MODE BAR */}
      {isAdmin && (
        <AdminModeBar
          currentUser={currentUser}
          onOpenEditSiteContent={(sec) => {
            if (sec) setEditSiteContentInitialTab(sec);
            setIsEditSiteContentOpen(true);
          }}
          onOpenAddMemory={() => {
            setMemoryToEdit(null);
            setIsAddModalOpen(true);
          }}
          onOpenAdminPortal={() => setIsAdminModalOpen(true)}
          onOpenStudio={() => setIsAdminStudioOpen(true)}
          onLogout={handleSignOut}
        />
      )}

      {/* LIVE ADMIN STUDIO — uses the same authorized memory state and existing editor */}
      {isAdmin && isAdminStudioOpen && (
        <AdminStudioModal
          memories={memories}
          onClose={() => setIsAdminStudioOpen(false)}
          onAddMemory={() => {
            setMemoryToEdit(null);
            setIsAddModalOpen(true);
          }}
          onEditMemory={handleOpenEditMemoryModal}
        />
      )}

      {/* INTERACTIVE SURPRISE MODAL */}
      <SurpriseModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        anniversaryDateStr={
          siteContent.anniversary_date && siteContent.anniversary_date >= '2025-06-15'
            ? siteContent.anniversary_date
            : '2025-06-15'
        }
        partner1={siteContent.partner1_name || 'My Girl 👑'}
        partner2={siteContent.partner2_name || 'Your Guy 🌙'}
      />

      {/* PERSISTENT FLOATING MUSIC PLAYER */}
      <MusicPlayer isAdmin={isAdmin} />
    </div>
    );
  };

  return (
    <>
      {renderAppContent()}
    </>
  );
}

