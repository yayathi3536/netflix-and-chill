import React, { useState } from 'react';
import { LogOut, ShieldCheck, Pencil, Plus, Check, X } from 'lucide-react';
import { UserProfile } from '../types';
import {
  BUILT_IN_AVATARS,
  BUILT_IN_AVATAR_CATEGORIES,
  BuiltInAvatarCategory,
  BuiltInAvatarItem,
  getProfileAvatarUrl,
} from '../data/builtInAvatars';

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
  const [draftBg, setDraftBg] = useState('bg-[#808080]');
  const [activeCategory, setActiveCategory] = useState<'all' | BuiltInAvatarCategory>('all');
  const [formError, setFormError] = useState('');

  const openEditModal = (profile: UserProfile) => {
    setIsCreatingNew(false);
    setEditingProfile(profile);
    setDraftName(profile.name);
    setDraftSeason(profile.favoriteSeason || '');
    setDraftAvatarUrl(profile.avatarUrl || getProfileAvatarUrl(profile));
    setDraftAvatarId(profile.avatarId);
    setDraftEmoji(profile.avatarEmoji || '❤️');
    setDraftBg(profile.avatarBg || 'bg-[#808080]');
    setActiveCategory('all');
    setFormError('');
  };

  const openCreateModal = () => {
    const defaultAvatar = BUILT_IN_AVATARS[0];
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      name: '',
      role: 'together',
      avatarEmoji: '❤️',
      avatarBg: 'bg-[#808080]',
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
    setDraftBg('bg-[#808080]');
    setActiveCategory('all');
    setFormError('');
  };

  const closeEditor = () => {
    setEditingProfile(null);
    setIsCreatingNew(false);
    setFormError('');
  };

  const handleSelectBuiltInAvatar = (avatar: BuiltInAvatarItem) => {
    setDraftAvatarUrl(avatar.url);
    setDraftAvatarId(avatar.id);
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
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-between select-none">

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-4 sm:px-12 pt-4 sm:pt-6 flex justify-end items-center gap-3">
        <div className="flex items-center gap-2.5 sm:gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 truncate max-w-[220px]">
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#808080] shrink-0" />}
              <span className="truncate max-w-[220px] font-medium">{userEmail}</span>
            </div>
          )}

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-600 hover:border-white text-neutral-400 hover:text-white text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#808080]" />
              <span className="font-medium">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered "Who's watching?" Gateway */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white mb-2 sm:mb-3 text-center">
            {isManageMode ? 'Manage Profiles' : "Who's watching?"}
          </h1>
          
        </div>

        {/* Profile Cards Grid */}
        <div className="flex flex-wrap justify-center items-start gap-4 sm:gap-6 md:gap-8">
          {profiles.map((profile) => {
            const avatarSrc = getProfileAvatarUrl(profile);

            return (
              <div
                key={profile.id}
                className="group flex flex-col items-center w-20 sm:w-28 md:w-32"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
                  <button
                    type="button"
                    onClick={() => {
                      if (isManageMode) {
                        openEditModal(profile);
                      } else {
                        onSelect(profile);
                      }
                    }}
                    className="w-full h-full rounded-[4px] overflow-hidden bg-neutral-800 border-[3px] border-transparent group-hover:border-white transition-colors focus:outline-none focus-visible:border-white"
                    aria-label={
                      isManageMode
                        ? `Edit profile and avatar for ${profile.name}`
                        : `Select profile ${profile.name}`
                    }
                  >
                    {/* Illustrated Artwork */}
                    <img
                      src={avatarSrc}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />

                     {/* Manage Mode Pencil Overlay */}
                    {isManageMode && (
                      <div className="pointer-events-none absolute inset-0 rounded-[4px] bg-black/60 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/90 border border-white flex items-center justify-center">
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
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/85 hover:bg-[#808080] text-white border border-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-110"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Profile Name & Tagline */}
                <span className="mt-3 text-xs sm:text-sm md:text-base text-neutral-400 group-hover:text-white transition-colors truncate w-full text-center">{profile.name}</span>
              </div>
            );
          })}

          {/* Add Profile Card when in Manage Mode */}
          {isManageMode && (
            <button
              type="button"
              onClick={openCreateModal}
              className="group flex flex-col items-center w-20 sm:w-28 md:w-32 focus:outline-none"
              aria-label="Add Profile"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[4px] border-2 border-dashed border-neutral-600 group-hover:border-white flex items-center justify-center transition-colors bg-transparent">
                <div className="text-neutral-500 group-hover:text-white transition-colors">
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              <span className="mt-3 text-xs sm:text-sm md:text-base text-neutral-500 group-hover:text-white transition-colors">Add Profile</span>
            </button>
          )}
        </div>

        {/* Manage Profiles / Done Action Button */}
        <div className="mt-10 sm:mt-14 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              setIsManageMode((prev) => !prev);
              if (onManage && !isManageMode) onManage();
            }}
            className={`px-6 sm:px-8 py-2 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium border transition-colors ${
              isManageMode
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'border-neutral-600 text-neutral-400 hover:border-white hover:text-white'
            }`}
          >
            {isManageMode ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      </main>

      {/* Subtle Bottom Ambient Caption */}
      <footer className="relative z-10 pb-6 text-center text-xs text-neutral-600">OUR UNIVERSE</footer>

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
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-[#808080] text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 min-h-[44px] min-w-[44px]"
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
                    className="w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl overflow-hidden flex items-center justify-center ring-2 ring-[#808080] shadow-[0_0_30px_rgba(229,9,20,0.35)] relative bg-[#18181c]"
                  >
                    <img
                      src={draftAvatarUrl || getProfileAvatarUrl(editingProfile)}
                      alt={draftName || 'Selected avatar preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-[#a3a3a3] font-medium tracking-wide">
                    Active Tile (1:1)
                  </span>
                </div>

                <div className="flex-1 w-full space-y-4">
                  {formError && (
                    <div className="p-3 rounded-lg bg-[#808080]/20 border border-[#808080] text-xs text-white">
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
                      className="w-full bg-[#18181c] border border-white/20 focus:border-[#808080] focus:ring-1 focus:ring-[#808080] rounded-lg py-3 px-4 text-sm sm:text-base text-white placeholder-[#737373] focus:outline-none transition-all"
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
                      className="w-full bg-[#18181c] border border-white/20 focus:border-[#808080] focus:ring-1 focus:ring-[#808080] rounded-lg py-2.5 px-4 text-xs sm:text-sm text-white placeholder-[#737373] focus:outline-none transition-all"
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
                            ? 'bg-[#808080] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]'
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
                              ? 'ring-3 ring-[#808080] shadow-[0_0_25px_rgba(229,9,20,0.55)] scale-102'
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
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#808080] text-white flex items-center justify-center shadow-lg">
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
                  className="px-8 py-2.5 bg-white hover:bg-white/80 text-black text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-md shadow-lg shadow-red-900/40 transition-all cursor-pointer hover:scale-102 active:scale-98"
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
