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
import { supabaseService, checkIsAdmin } from './services/supabaseService';
import { isSupabaseConfigured } from './services/supabaseClient';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CarouselRow } from './components/CarouselRow';
import { DetailModal } from './components/DetailModal';
import { RelivePlayer } from './components/RelivePlayer';
import { SecretVaultModal } from './components/SecretVaultModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { EditSiteContentModal } from './components/EditSiteContentModal';
import { AdminModeBar } from './components/AdminModeBar';
import { MovieCard } from './components/MovieCard';
import { MusicPlayer } from './components/MusicPlayer';
import { romanticAudio } from './utils/romanticAudio';
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
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isEditSiteContentOpen, setIsEditSiteContentOpen] = useState(false);
  const [editSiteContentInitialTab, setEditSiteContentInitialTab] = useState<SiteContentSection>('hero');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Computed verified administrator status
  const isAdmin = useMemo(() => checkIsAdmin(currentUser), [currentUser]);


  // Places filter tab state
  const [placesFilter, setPlacesFilter] = useState<'all' | 'visited' | 'bucket-list'>('all');

  useEffect(() => {
    // 1. Load initial profiles and notifications
    setProfiles(storageService.getProfiles());
    setActiveProfile(storageService.getActiveProfile());
    setNotifications(storageService.getNotifications());

    // 2. Load site texts & letters
    storageService.loadSiteContent().then((content) => {
      setSiteContent(content);
    });

    // 3. Fetch authenticated Supabase session
    if (isSupabaseConfigured()) {
      supabaseService.getCurrentUser().then((user) => {
        setCurrentUser(user);
      });

      const unsubscribe = supabaseService.onAuthStateChange((user) => {
        setCurrentUser(user);
      });

      // 4. Load remote memories asynchronously
      fetchRemoteMemories();

      return () => {
        unsubscribe();
      };
    } else {
      setStorageSource('local');
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
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
      window.location.hash = tab;
    }
  };

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
    storageService.setActiveProfile(profile.id);
    setActiveProfile(profile);
  };

  const handleNotificationClick = (id: string, memoryId?: string) => {
    storageService.markNotificationAsRead(id);
    setNotifications(storageService.getNotifications());
    if (memoryId) {
      const target = memories.find((m) => m.id === memoryId);
      if (target) {
        if (target.isSecret) {
          setSecretVaultMemory(target);
        } else {
          setSelectedMemory(target);
        }
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

  const toggleAudio = () => {
    const active = romanticAudio.toggle();
    setIsAudioPlaying(active);
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
    return memories.filter((m) => m.category === 'memories' && m.progress !== undefined);
  }, [memories]);

  const ourStorySeries = useMemo(() => {
    return memories
      .filter((m) => m.category === 'our-story' && m.id !== 'featured-story-of-us')
      .sort((a, b) => (a.isTop10 || 99) - (b.isTop10 || 99));
  }, [memories]);

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

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col selection:bg-[#E50914] selection:text-white">
      {/* NETFLIX-STYLE TOP NAVIGATION */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
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

      {/* TOP SYSTEM STATUS NOTIFICATION (Non-intrusive) */}
      {!isSupabaseReady ? (
        <div className="pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Local Mode:</strong> Supabase credentials not detected in environment. Using persistent browser storage.
              </span>
            </div>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-white bg-amber-500/30 hover:bg-amber-500/50 px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              Setup Supabase &rarr;
            </button>
          </div>
        </div>
      ) : isSchemaMissing ? (
        <div className="pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 shadow-xl">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-semibold text-white">Database Tables Need Setup:</span>{' '}
                <span className="text-amber-300/90">
                  Supabase is connected, but the <code>public.memories</code> table has not been created yet. Copy and run the SQL migration script in your Supabase SQL Editor.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-white bg-[#E50914] hover:bg-[#b80710] px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow active:scale-95 shrink-0"
            >
              Copy SQL Migration &rarr;
            </button>
          </div>
        </div>
      ) : statusNotification ? (
        <div className="pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{statusNotification}</span>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-white bg-blue-500/30 hover:bg-blue-500/50 px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              Sync Database
            </button>
          </div>
        </div>
      ) : null}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pb-16">
        {/* SEARCH RESULTS VIEW (When search is active) */}
        {filteredMemories !== null ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12">
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
                className="text-xs text-[#ff4d5a] hover:underline cursor-pointer"
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
                    onPlay={(mem) => setPlayingMemory({ memory: mem })}
                    onOpenInfo={(mem) => setSelectedMemory(mem)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onToggleFavorite={handleToggleFavorite}
                    onUnlockVault={(mem) => setSecretVaultMemory(mem)}
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
                    onPlay={(m) => setPlayingMemory({ memory: m })}
                    onOpenInfo={(m) => setSelectedMemory(m)}
                    onToggleWatchlist={handleToggleWatchlist}
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

                {/* CONTENT ROWS SECTION */}
                <div className="relative z-20 -mt-10 sm:-mt-16 space-y-2">
                  {/* ROW 1: CONTINUE WATCHING: OUR MEMORIES */}
                  {continueWatchingItems.length > 0 && (
                    <CarouselRow
                      title={siteContent.section_continue_title || "Continue Watching: Our Memories"}
                      subtitle={siteContent.section_continue_sub || "Pick up right where we left off"}
                      items={continueWatchingItems}
                      onPlay={(m) => setPlayingMemory({ memory: m })}
                      onOpenInfo={(m) => setSelectedMemory(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* ROW 2: ORIGINAL SERIES: OUR STORY (TOP 10 PORTRAITS) */}
                  {ourStorySeries.length > 0 && (
                    <CarouselRow
                      title={siteContent.section_our_story_title || "Original Series: Our Story"}
                      subtitle={siteContent.section_our_story_sub || "Top 10 Relationship Chapters of All Time"}
                      items={ourStorySeries}
                      isPortrait={true}
                      onPlay={(m) => setPlayingMemory({ memory: m })}
                      onOpenInfo={(m) => setSelectedMemory(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* ROW 3: COLLECTION: LITTLE THINGS I LOVE ABOUT YOU */}
                  {littleThingsCollection.length > 0 && (
                    <CarouselRow
                      title={siteContent.section_little_things_title || "Collection: Little Things I Love About You"}
                      subtitle={siteContent.section_little_things_sub || "Micro-moments that steal my heart every single day"}
                      items={littleThingsCollection}
                      onPlay={(m) => setPlayingMemory({ memory: m })}
                      onOpenInfo={(m) => setSelectedMemory(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* ROW 4: MY LIST: PLACES & EXPERIENCES TOGETHER */}
                  {placesListItems.length > 0 && (
                    <CarouselRow
                      title={siteContent.section_places_title || "My List: Places and Experiences Together"}
                      subtitle={siteContent.section_places_sub || "Our travel passport & dream bucket list"}
                      items={placesListItems}
                      onPlay={(m) => setPlayingMemory({ memory: m })}
                      onOpenInfo={(m) => setSelectedMemory(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                      onEditMemory={isAdmin ? handleOpenEditMemoryModal : undefined}
                      onEditSection={isAdmin ? () => {
                        setEditSiteContentInitialTab('sections');
                        setIsEditSiteContentOpen(true);
                      } : undefined}
                    />
                  )}

                  {/* ROW 5: HIDDEN EPISODES: PERSONAL SURPRISES & LETTERS */}
                  {secretVaultItems.length > 0 && (
                    <CarouselRow
                      title={siteContent.section_vault_title || "Hidden Episodes: Personal Surprises and Letters"}
                      subtitle={siteContent.section_vault_sub || "Locked confidential notes for your eyes only"}
                      items={secretVaultItems}
                      onPlay={(m) => setPlayingMemory({ memory: m })}
                      onOpenInfo={(m) => setSelectedMemory(m)}
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
                </div>
              </div>
            )}

            {/* TAB: OUR STORY (Dedicated Timeline & Story View) */}
            {activeTab === 'our-story' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#ff4d5a] font-bold tracking-widest uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chronological Journey</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-5xl text-white font-black tracking-wide">
                    Original Series: Our Story
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
                    Every milestone chapter in order from the day the universe aligned our paths to building our forever future.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ourStorySeries.map((ch, idx) => (
                    <div
                      key={ch.id}
                      onClick={() => setSelectedMemory(ch)}
                      className="bg-[#181818] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer group hover:scale-[1.02] flex flex-col justify-between"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <div className="absolute top-3 left-3 z-20">
                          <span className="font-bebas text-lg px-2.5 py-0.5 rounded bg-[#E50914] text-white font-bold shadow">
                            Chapter {idx + 1}
                          </span>
                        </div>
                        <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                          <MovieCard
                            memory={ch}
                            onPlay={(m) => setPlayingMemory({ memory: m })}
                            onOpenInfo={(m) => setSelectedMemory(m)}
                            onToggleWatchlist={handleToggleWatchlist}
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>{ch.date}</span>
                          <span className="text-emerald-400 font-bold">{ch.matchScore}% Match</span>
                        </div>
                        <h3 className="font-bebas text-xl text-white font-bold leading-tight group-hover:text-[#ff4d5a] transition-colors">
                          {ch.title}
                        </h3>
                        <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                          {ch.synopsis}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MEMORIES (Continue Watching & All Memories) */}
            {activeTab === 'memories' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 space-y-8">
                <div>
                  <h1 className="font-bebas text-4xl sm:text-5xl text-white font-black tracking-wide">
                    Our Memories
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
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
                        onPlay={(mem) => setPlayingMemory({ memory: mem })}
                        onOpenInfo={(mem) => setSelectedMemory(mem)}
                        onToggleWatchlist={handleToggleWatchlist}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* TAB: LITTLE THINGS I LOVE ABOUT YOU */}
            {activeTab === 'little-things' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-bold tracking-widest uppercase mb-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-400" />
                    <span>The Uncensored Truth</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-5xl text-white font-black tracking-wide">
                    Little Things I Love About You
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
                    The microscopic quirks, gestures, and adorable habits that make you the only person for me.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {littleThingsCollection.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMemory(item)}
                      className="p-6 rounded-xl bg-gradient-to-br from-[#1a1719] to-[#121214] border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer shadow-lg hover:scale-[1.02] space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-rose-400 font-semibold tracking-wider uppercase">
                            {item.duration}
                          </span>
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                        </div>
                        <h3 className="font-bebas text-2xl text-white font-bold leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-neutral-400 italic">
                          "{item.subtitle}"
                        </p>
                        <p className="text-xs text-neutral-300 leading-relaxed font-light">
                          {item.fullStory}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Click for details</span>
                        <span className="text-emerald-400 font-bold">{item.matchScore}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PLACES & LIST (Interactive Travel Board) */}
            {activeTab === 'places-list' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold tracking-widest uppercase mb-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Travel Passport</span>
                    </div>
                    <h1 className="font-bebas text-4xl sm:text-5xl text-white font-black tracking-wide">
                      Places & Experiences Together
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
                      Our favorite shared adventures and future dream destinations.
                    </p>
                  </div>

                  {/* Filter Controls (Constitution-compliant segmented control buttons) */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10 shrink-0">
                    <button
                      onClick={() => setPlacesFilter('all')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        placesFilter === 'all'
                          ? 'bg-white text-black shadow'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      All Places ({memories.filter((m) => m.category === 'places-list').length})
                    </button>
                    <button
                      onClick={() => setPlacesFilter('visited')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                        placesFilter === 'visited'
                          ? 'bg-white text-black shadow'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Visited</span>
                    </button>
                    <button
                      onClick={() => setPlacesFilter('bucket-list')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                        placesFilter === 'bucket-list'
                          ? 'bg-white text-black shadow'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Bucket List</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {placesListItems.map((p) => (
                    <MovieCard
                      key={p.id}
                      memory={p}
                      onPlay={(mem) => setPlayingMemory({ memory: mem })}
                      onOpenInfo={(mem) => setSelectedMemory(mem)}
                      onToggleWatchlist={handleToggleWatchlist}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECRET VAULT */}
            {activeTab === 'secret-vault' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#ff4d5a] font-bold tracking-widest uppercase mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Top Secret</span>
                  </div>
                  <h1 className="font-bebas text-4xl sm:text-5xl text-white font-black tracking-wide">
                    Hidden Episodes: Personal Surprises & Letters
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mt-1">
                    Password-protected love letters, intimate confessions, and redeemable surprise date night coupons.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {secretVaultItems.map((vault) => (
                    <div
                      key={vault.id}
                      onClick={() => setSecretVaultMemory(vault)}
                      className="p-6 rounded-xl bg-gradient-to-br from-[#1c1214] to-[#121212] border border-[#E50914]/30 hover:border-[#E50914] transition-all cursor-pointer shadow-xl hover:scale-[1.02] flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#ff4d5a] bg-[#E50914]/15 px-2 py-0.5 rounded">
                            CLASSIFIED
                          </span>
                          <Lock className="w-4 h-4 text-[#ff4d5a] group-hover:animate-bounce" />
                        </div>
                        <h3 className="font-bebas text-2xl sm:text-3xl text-white font-bold">
                          {vault.title}
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {vault.synopsis}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Unlock with anniversary code</span>
                        <span className="font-bold text-[#ff4d5a] group-hover:underline">
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

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/60 py-10 px-4 sm:px-6 lg:px-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bebas text-xl text-[#E50914] font-black">
                OUR UNIVERSE
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-300">Season Forever</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Built with all my love for you. Every moment, every memory, forever streaming in our hearts.
            </p>
          </div>

          {/* Supabase Status & Admin Utilities */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] transition-colors cursor-pointer"
            >
              <Database
                className={`w-3.5 h-3.5 ${
                  storageSource === 'supabase' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              />
              <span>
                {storageSource === 'supabase'
                  ? 'Cloud Synced (Supabase)'
                  : 'Local Mode (Supabase Setup)'}
              </span>
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] transition-colors cursor-pointer"
            >
              <Shield
                className={`w-3.5 h-3.5 ${
                  currentUser ? 'text-emerald-400' : 'text-neutral-400'
                }`}
              />
              <span>{currentUser ? 'Admin Verified' : 'Admin Sign In'}</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-[11px]"
              title="Download memory backup JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              title="Reset default relationship story"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
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
            setPlayingMemory({ memory: m, episode: ep });
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
          onSelectRelated={(item) => setSelectedMemory(item)}
        />
      )}

      {/* RELIVE PLAYER (FULLSCREEN CINEMATIC PLAYER) */}
      {playingMemory && (
        <RelivePlayer
          memory={playingMemory.memory}
          episode={playingMemory.episode}
          onClose={() => setPlayingMemory(null)}
          onNextMemory={() => {
            const currentIndex = memories.findIndex((m) => m.id === playingMemory.memory.id);
            const nextMemory = memories[(currentIndex + 1) % memories.length];
            setPlayingMemory({ memory: nextMemory });
          }}
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
          onLogout={async () => {
            await supabaseService.signOut();
            setCurrentUser(null);
          }}
        />
      )}

      {/* PERSISTENT FLOATING MUSIC PLAYER */}
      <MusicPlayer />
    </div>
  );
}

