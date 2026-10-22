import React, { useState } from 'react';
import { LogOut, ShieldCheck, Pencil, Plus, Check, X, UploadCloud, Loader2, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types';
import { supabaseService } from '../services/supabaseService';
import {
  BUILT_IN_AVATARS,
  BUILT_IN_AVATAR_CATEGORIES,
  BuiltInAvatarCategory,
  BuiltInAvatarItem,
  getProfileAvatarUrl,
} from '../data/builtInAvatars';

const PROFILE_TILE_COLORS = ['#E50914', '#176B87', '#6B3FA0', '#237A57', '#B85C24', '#2855A6'];

const getProfileTileColor = (profile: UserProfile) => {
  const key = profile.id || profile.name;
  const index = Array.from(key).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return PROFILE_TILE_COLORS[index % PROFILE_TILE_COLORS.length];
};

export default function ProfileSelect({
  profiles,
  onSelect,
  onManage,
  onSaveProfile,
  userEmail,
  isAdmin = false,
  onSignOut,
}: {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onManage?: () => void;
  onSaveProfile?: (profile: UserProfile) => void;
  userEmail?: string;
  isAdmin?: boolean;
  onSignOut?: () => void;
}) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editor form state
  const [draftName, setDraftName] = useState('');
  const [draftSeason, setDraftSeason] = useState('');
  const [draftAvatarUrl, setDraftAvatarUrl] = useState<string | undefined>(undefined);
  const [draftAvatarId, setDraftAvatarId] = useState<string | undefined>(undefined);
  const [draftEmoji, setDraftEmoji] = useState('❤️');
  const [draftBg, setDraftBg] = useState('bg-[#E50914]');
  const [activeCategory, setActiveCategory] = useState<'all' | BuiltInAvatarCategory>('all');
  const [formError, setFormError] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState('');

  const openEditModal = (profile: UserProfile) => {
    setIsCreatingNew(false);
    setEditingProfile(profile);
    setDraftName(profile.name);
    setDraftSeason(profile.favoriteSeason || '');
    setDraftAvatarUrl(profile.avatarUrl || getProfileAvatarUrl(profile));
    setDraftAvatarId(profile.avatarId);
    setDraftEmoji(profile.avatarEmoji || '❤️');
    setDraftBg(profile.avatarBg || 'bg-[#E50914]');
    setActiveCategory('all');
    setFormError('');
    setAvatarUploadError('');
  };

  const openCreateModal = () => {
    const defaultAvatar = BUILT_IN_AVATARS[0];
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name: '',
      role: 'together',
      avatarEmoji: '❤️',
      avatarBg: 'bg-[#E50914]',
      avatarUrl: defaultAvatar.url,
      avatarId: defaultAvatar.id,
      favoriteSeason: 'Season Forever',
    };
    setIsCreatingNew(true);
    setEditingProfile(newProfile);
    setDraftName('');
    setDraftSeason('Season Forever');
    setDraftAvatarUrl(defaultAvatar.url);
    setDraftAvatarId(defaultAvatar.id);
    setDraftEmoji('❤️');
    setDraftBg('bg-[#E50914]');
    setActiveCategory('all');
    setFormError('');
    setAvatarUploadError('');
  };

  const closeEditor = () => {
    setEditingProfile(null);
    setIsCreatingNew(false);
    setFormError('');
    setAvatarUploadError('');
  };

  const handleSelectBuiltInAvatar = (avatar: BuiltInAvatarItem) => {
    setDraftAvatarUrl(avatar.url);
    setDraftAvatarId(avatar.id);
  };

  const handleClearBuiltInAvatar = () => {
    setDraftAvatarUrl(undefined);
    setDraftAvatarId(undefined);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarUploadError('');

    try {
      const { url, error } = await supabaseService.uploadPhoto(file);
      if (url) {
        setDraftAvatarUrl(url);
        setDraftAvatarId(undefined);
      } else if (error) {
        // Fallback: local FileReader if storage bucket not yet reachable
        const reader = new FileReader();
        reader.onload = () => {
          setDraftAvatarUrl(reader.result as string);
          setDraftAvatarId(undefined);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setDraftAvatarUrl(reader.result as string);
          setDraftAvatarId(undefined);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Avatar photo upload error:', err);
      setAvatarUploadError(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = draftName.trim();
    if (!trimmedName) {
      setFormError('Please enter a profile name.');
      return;
    }
    if (!editingProfile) return;

    const updated: UserProfile = {
      ...editingProfile,
      name: trimmedName,
      favoriteSeason: draftSeason.trim() || undefined,
      avatarEmoji: draftEmoji,
      avatarBg: draftBg,
      avatarUrl: draftAvatarUrl,
      avatarId: draftAvatarId,
    };

    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    closeEditor();
  };

  const filteredAvatars =
    activeCategory === 'all'
      ? BUILT_IN_AVATARS
      : BUILT_IN_AVATARS.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050507] text-[#FFFFFF] flex flex-col items-center justify-between relative overflow-hidden select-none selection:bg-[#E50914] selection:text-[#FFFFFF]">
      {/* 1. Deep-black cinematic background with delicate starlight dust */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[#000000]" />
        {/* Subtle top & bottom dark vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.12)_0%,transparent_60%)]" />

        {/* 2. SUBTLE DARK CRIMSON AMBIENT LIGHTING BEHIND PROFILE CARDS */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] max-w-[96vw] h-[480px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.22)_0%,rgba(180,10,25,0.10)_42%,transparent_72%)] blur-3xl opacity-90"
        />
        {/* Secondary softer deep crimson bloom */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[80vw] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.18)_0%,transparent_70%)] blur-2xl"
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl px-4 sm:px-12 pt-5 sm:pt-8 flex flex-wrap justify-between items-center gap-3">
        <div className="font-bebas text-2xl sm:text-5xl tracking-[0.18em] sm:tracking-[0.25em] text-[#E50914] font-black uppercase drop-shadow-[0_2px_14px_rgba(229,9,20,0.4)] transition-transform duration-300 hover:scale-[1.02]">
          OUR UNIVERSE
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#a3a3a3] bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#E50914] shrink-0" />}
              <span className="truncate max-w-[220px] font-medium">{userEmail}</span>
            </div>
          )}

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/15 text-xs text-[#a3a3a3] hover:text-[#FFFFFF] transition-all cursor-pointer backdrop-blur-sm min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered "Who's watching?" Gateway */}
      <main className="relative z-10 flex-1 w-full max-w-6xl flex flex-col items-center justify-center px-4 sm:px-8 py-8 sm:py-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-6 sm:mb-14">
          <h1 className="text-3xl sm:text-6xl md:text-[68px] font-medium tracking-tight text-white mb-2 sm:mb-3 text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            {isManageMode ? 'Manage Profiles' : "Who's watching?"}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#a3a3a3] font-light text-center tracking-wide max-w-md mx-auto px-2">
            {isManageMode
              ? 'Select a profile to customize its avatar tile, name, or tagline.'
              : 'Choose your profile to begin your journey through OUR UNIVERSE'}
          </p>
        </div>

        {/* Profile Cards Grid */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-10 md:gap-12 lg:gap-14 w-full">
          {profiles.map((profile) => {
            // Netflix-style profile tiles: bold solid colours and a clean initial,
            // while keeping the chosen photo/avatar available in the profile editor.
            const tileColor = getProfileTileColor(profile);
            const profileInitial = profile.name.trim().charAt(0).toUpperCase() || '♥';

            return (
              <div
                key={profile.id}
                className="group w-32 xs:w-36 sm:w-44 md:w-48 lg:w-52 flex flex-col items-center text-center focus-within:outline-none shrink-0"
              >
                <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 aspect-square">
                  <button
                    type="button"
                    onClick={() => {
                      if (isManageMode) {
                        openEditModal(profile);
                      } else {
                        onSelect(profile);
                      }
                    }}
                    className={`w-full h-full rounded-lg overflow-hidden relative cursor-pointer border-2 border-white/10 group-hover:border-[#E50914] focus-visible:border-white shadow-[0_14px_45px_rgba(0,0,0,0.9)] group-hover:shadow-[0_20px_60px_rgba(229,9,20,0.45),0_0_35px_rgba(229,9,20,0.3)] transition-all duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-2 focus:outline-none bg-[#101014]`}
                    aria-label={
                      isManageMode
                        ? `Edit profile and avatar for ${profile.name}`
                        : `Select profile ${profile.name}`
                    }
                  >
                    {/* Clean Netflix-inspired colour tile (custom avatar remains editable) */}
                    <div
                      className="absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-300 ease-out"
                      style={{ backgroundColor: tileColor }}
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/35" />
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-white/10" />
                      <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full border-[20px] border-black/10" />
                      <span className="relative z-10 font-bebas text-7xl sm:text-8xl md:text-9xl leading-none tracking-tight text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.3)] select-none">
                        {profileInitial}
                      </span>
                    </div>

                    {/* Manage Mode Pencil Overlay */}
                    {isManageMode && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-black/80 flex items-center justify-center text-white shadow-2xl">
                          <Pencil className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Quick Edit Pencil Shortcut */}
                  {!isManageMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(profile);
                      }}
                      title={`Customize avatar for ${profile.name}`}
                      aria-label={`Customize avatar for ${profile.name}`}
                      className="opacity-70 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/85 hover:bg-[#E50914] text-white border border-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-110"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Profile Name & Tagline */}
                <div className="w-full text-center mt-3 space-y-0.5 px-1">
                  <span className="block text-sm sm:text-lg md:text-xl font-medium text-[#B3B3B3] group-hover:text-white transition-colors duration-200 truncate tracking-wide">
                    {profile.name}
                  </span>
                  {profile.favoriteSeason && (
                    <span className="block text-[11px] sm:text-xs text-[#737373] group-hover:text-[#a3a3a3] transition-colors duration-200 line-clamp-1 font-light">
                      {profile.favoriteSeason}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Profile Card when in Manage Mode */}
          {isManageMode && (
            <button
              type="button"
              onClick={openCreateModal}
              className="group w-32 xs:w-36 sm:w-44 md:w-48 lg:w-52 flex flex-col items-center text-center cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
              aria-label="Add Profile"
            >
              <div className="w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border-2 border-dashed border-white/20 group-hover:border-[#E50914] flex items-center justify-center transition-all duration-300 shadow-[0_14px_45px_rgba(0,0,0,0.6)] group-hover:shadow-[0_20px_50px_rgba(229,9,20,0.3)]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 group-hover:bg-[#E50914] text-[#a3a3a3] group-hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 group-hover:border-transparent shadow">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="w-full text-center mt-3">
                <span className="block text-sm sm:text-lg font-medium text-[#808080] group-hover:text-white transition-colors tracking-wide">
                  Add Profile
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Manage Profiles / Done Action Button */}
        <div className="mt-12 sm:mt-16 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setIsManageMode((prev) => !prev);
              if (onManage && !isManageMode) onManage();
            }}
            className={`px-8 sm:px-10 py-2.5 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold transition-all duration-200 cursor-pointer rounded-[3px] border ${
              isManageMode
                ? 'bg-white text-black border-white hover:bg-[#E50914] hover:text-white hover:border-[#E50914] shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                : 'border-[#737373] text-[#8c8c8c] hover:border-white hover:text-white hover:bg-white/[0.05]'
            } active:scale-95`}
          >
            {isManageMode ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      </main>

      {/* Subtle Bottom Ambient Caption */}
      <footer className="relative z-10 pb-6 px-6 text-center text-xs text-[#525252] tracking-wider">
        <span>OUR UNIVERSE · PRIVATE MEMORY STREAM</span>
      </footer>

      {/* BUILT-IN AVATAR PICKER & PROFILE EDITOR MODAL */}
      {editingProfile && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeEditor}
        >
          <div
            className="relative w-full max-w-3xl bg-[#121215] border border-white/15 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.98)] text-white p-4 sm:p-8 md:p-10 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={closeEditor}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-[#E50914] text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 min-h-[44px] min-w-[44px]"
              aria-label="Cancel and close avatar picker"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-4 sm:pb-5 border-b border-white/10 shrink-0 pr-10">
              <h2 className="text-xl sm:text-4xl font-bold tracking-tight text-white">
                {isCreatingNew ? 'Add Profile' : 'Customize Profile Tile'}
              </h2>
              <p className="text-xs sm:text-sm text-[#a3a3a3] mt-1">
                Choose an elegant Netflix-style colored tile with a clean symbol.
              </p>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto dark-scrollbar pr-1 py-6 space-y-6">
              {/* Top Section: Selected Avatar Preview + Profile Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl overflow-hidden flex items-center justify-center ring-2 ring-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.35)] relative bg-[#18181c]"
                  >
                    <img
                      src={draftAvatarUrl || getProfileAvatarUrl(editingProfile)}
                      alt={draftName || 'Selected avatar preview'}
                      className="w-full h-full object-cover"
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-1.5 backdrop-blur-xs">
                        <Loader2 className="w-6 h-6 animate-spin text-[#E50914]" />
                        <span className="text-[10px] text-white font-medium">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-[#a3a3a3] font-medium tracking-wide">
                    Active Tile (1:1)
                  </span>

                  {/* Device Upload for Profile Avatar */}
                  <div className="w-full flex flex-col items-center gap-1.5 pt-1">
                    <label className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/15 min-h-[38px] group">
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E50914]" />
                          <span className="text-[11px]">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5 text-[#E50914] group-hover:scale-110 transition-transform" />
                          <span className="text-[11px]">Upload Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={isUploadingAvatar}
                        onChange={handleAvatarFileUpload}
                      />
                    </label>

                    {draftAvatarUrl && !draftAvatarId && (
                      <button
                        type="button"
                        onClick={() => {
                          const fallback = BUILT_IN_AVATARS[0];
                          setDraftAvatarUrl(fallback.url);
                          setDraftAvatarId(fallback.id);
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 py-1"
                        title="Reset to default avatar tile"
                      >
                        <RotateCcw className="w-3 h-3 text-[#E50914]" />
                        <span>Reset to Tile</span>
                      </button>
                    )}

                    {avatarUploadError && (
                      <p className="text-[11px] text-[#E50914] text-center max-w-[160px] leading-tight mt-0.5">
                        {avatarUploadError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  {formError && (
                    <div className="p-3 rounded-lg bg-[#E50914]/20 border border-[#E50914] text-xs text-white">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="profile-name-input" className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                      Profile Name
                    </label>
                    <input
                      id="profile-name-input"
                      type="text"
                      required
                      maxLength={32}
                      value={draftName}
                      onChange={(e) => {
                        setDraftName(e.target.value);
                        setFormError('');
                      }}
                      placeholder="e.g. My Girl 👑, Our Universe, Your Guy 🌙"
                      className="w-full bg-[#18181c] border border-white/20 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg py-3 px-4 text-sm sm:text-base text-white placeholder-[#737373] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-season-input" className="block text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                      Favorite Season / Tagline (optional)
                    </label>
                    <input
                      id="profile-season-input"
                      type="text"
                      maxLength={48}
                      value={draftSeason}
                      onChange={(e) => setDraftSeason(e.target.value)}
                      placeholder="e.g. Season 1: How We Met"
                      className="w-full bg-[#18181c] border border-white/20 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg py-2.5 px-4 text-xs sm:text-sm text-white placeholder-[#737373] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Built-in Avatar Picker Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Choose Avatar Tile
                    </h3>
                    <p className="text-xs text-[#a3a3a3]">
                      Clean, solid-color and gradient tiles with white symbols
                    </p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
                    {BUILT_IN_AVATAR_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                          activeCategory === cat.id
                            ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                            : 'bg-white/5 text-[#a3a3a3] hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-4 pt-1">
                  {filteredAvatars.map((avatar) => {
                    const isSelected =
                      draftAvatarId === avatar.id || draftAvatarUrl === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelectBuiltInAvatar(avatar)}
                        className={`group/tile flex flex-col items-center gap-2 text-center cursor-pointer focus:outline-none`}
                        aria-label={`Select avatar ${avatar.name}`}
                        aria-pressed={isSelected}
                      >
                        <div
                          className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 group-hover/tile:scale-105 bg-[#18181c] ${
                            isSelected
                              ? 'ring-3 ring-[#E50914] shadow-[0_0_25px_rgba(229,9,20,0.55)] scale-102'
                              : 'ring-1 ring-white/10 group-hover/tile:ring-white/40'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            loading="lazy"
                            className="w-full h-full object-cover select-none"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-xs truncate w-full transition-colors ${
                            isSelected
                              ? 'text-white font-semibold'
                              : 'text-[#808080] group-hover/tile:text-white'
                          }`}
                        >
                          {avatar.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save / Cancel Footer */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-6 py-2.5 border border-white/20 hover:border-white text-[#a3a3a3] hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#E50914] hover:bg-[#c11119] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-md shadow-lg shadow-red-900/40 transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
