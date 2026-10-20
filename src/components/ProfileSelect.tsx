import React, { useState } from 'react';
import { LogOut, ShieldCheck, Pencil, Plus, Check, X } from 'lucide-react';
import { UserProfile } from '../types';
import {
  BUILT_IN_AVATARS,
  BUILT_IN_AVATAR_CATEGORIES,
  BuiltInAvatarCategory,
  BuiltInAvatarItem,
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
  const [draftBg, setDraftBg] = useState('bg-[#E50914]');
  const [activeCategory, setActiveCategory] = useState<'all' | BuiltInAvatarCategory>('all');
  const [formError, setFormError] = useState('');

  const openEditModal = (profile: UserProfile) => {
    setIsCreatingNew(false);
    setEditingProfile(profile);
    setDraftName(profile.name);
    setDraftSeason(profile.favoriteSeason || '');
    setDraftAvatarUrl(profile.avatarUrl);
    setDraftAvatarId(profile.avatarId);
    setDraftEmoji(profile.avatarEmoji || '❤️');
    setDraftBg(profile.avatarBg || 'bg-[#E50914]');
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

  const handleClearBuiltInAvatar = () => {
    setDraftAvatarUrl(undefined);
    setDraftAvatarId(undefined);
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
    <div className="min-h-screen bg-[#141414] text-[#FFFFFF] flex flex-col items-center justify-between relative overflow-hidden selection:bg-[#E50914] selection:text-[#FFFFFF]">
      {/* Top-to-bottom Netflix vignette */}
      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#000000]/90 via-[#141414] to-[#000000]"
        aria-hidden="true"
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl px-6 sm:px-12 pt-6 sm:pt-7 flex flex-wrap justify-between items-center gap-4">
        <div className="font-bebas text-3xl sm:text-4xl tracking-widest text-[#E50914] font-black uppercase select-none">
          OUR UNIVERSE
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#B3B3B3]">
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#E50914] shrink-0" />}
              <span className="truncate max-w-[220px]">{userEmail}</span>
            </div>
          )}

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-[#181818] hover:bg-[#FFFFFF]/10 border border-[#808080]/40 text-xs text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#E50914]" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Centered "Who's watching?" Gate */}
      <main className="relative z-10 flex-1 w-full max-w-5xl flex flex-col items-center justify-center px-6 py-12 animate-in fade-in duration-300">
        <h1 className="text-3xl sm:text-5xl md:text-[54px] font-medium mb-3 text-center tracking-wide text-[#FFFFFF]">
          {isManageMode ? 'Manage Profiles:' : "Who's watching?"}
        </h1>
        <p className="text-xs sm:text-sm text-[#808080] mb-8 sm:mb-12 text-center">
          {isManageMode
            ? 'Select a profile below to customize its ready-made avatar or name'
            : 'Choose your profile to enter OUR UNIVERSE'}
        </p>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="group w-28 sm:w-36 md:w-40 flex flex-col items-center gap-3"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
                <button
                  type="button"
                  onClick={() => {
                    if (isManageMode) {
                      openEditModal(profile);
                    } else {
                      onSelect(profile);
                    }
                  }}
                  className={`w-full h-full rounded-[4px] ${
                    profile.avatarBg || 'bg-[#181818]'
                  } ring-2 ring-transparent group-hover:ring-[#FFFFFF] focus-visible:ring-[#FFFFFF] overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.75)] relative cursor-pointer focus:outline-none`}
                  aria-label={
                    isManageMode
                      ? `Edit profile and avatar for ${profile.name}`
                      : `Select profile ${profile.name}`
                  }
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 select-none"
                    />
                  ) : (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_65%)]"
                        aria-hidden="true"
                      />
                      {profile.avatarEmoji ? (
                        <span
                          className="relative z-10 text-4xl sm:text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-200 select-none"
                          aria-hidden="true"
                        >
                          {profile.avatarEmoji}
                        </span>
                      ) : (
                        <span className="relative z-10 text-3xl sm:text-4xl font-bold text-[#FFFFFF]">
                          {profile.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </>
                  )}

                  {/* Netflix Manage Mode Pencil Overlay */}
                  {isManageMode && (
                    <div className="absolute inset-0 bg-[#000000]/60 flex items-center justify-center transition-opacity">
                      <div className="w-11 h-11 rounded-full border-2 border-[#FFFFFF] bg-[#000000]/70 flex items-center justify-center text-[#FFFFFF] shadow-lg">
                        <Pencil className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </button>

                {/* Quick Edit Avatar Corner Button when not in full manage mode */}
                {!isManageMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(profile);
                    }}
                    title={`Change avatar for ${profile.name}`}
                    aria-label={`Change avatar for ${profile.name}`}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-[#000000]/80 hover:bg-[#E50914] text-[#FFFFFF] border border-[#FFFFFF]/30 flex items-center justify-center transition-all duration-150 cursor-pointer shadow"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-center space-y-0.5 w-full">
                <span className="block text-sm sm:text-base md:text-lg text-[#808080] group-hover:text-[#FFFFFF] font-normal transition-colors duration-200 truncate">
                  {profile.name}
                </span>
                {profile.favoriteSeason && (
                  <span className="block text-[11px] text-[#808080]/80 group-hover:text-[#B3B3B3] transition-colors line-clamp-1">
                    {profile.favoriteSeason}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Add Profile Card when in Manage Mode */}
          {isManageMode && (
            <button
              type="button"
              onClick={openCreateModal}
              className="group w-28 sm:w-36 md:w-40 flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105 cursor-pointer focus:outline-none"
              aria-label="Add Profile"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-[4px] bg-[#181818]/70 hover:bg-[#181818] border-2 border-dashed border-[#808080]/60 group-hover:border-[#FFFFFF] flex items-center justify-center transition-all duration-200">
                <div className="w-12 h-12 rounded-full bg-[#141414] group-hover:bg-[#E50914] text-[#808080] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-sm sm:text-base md:text-lg text-[#808080] group-hover:text-[#FFFFFF] font-normal transition-colors">
                Add Profile
              </span>
            </button>
          )}
        </div>

        {/* Bottom Manage Profiles / Done Button */}
        <div className="mt-12 sm:mt-16 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setIsManageMode((prev) => !prev);
              if (onManage && !isManageMode) onManage();
            }}
            className={`px-7 py-2.5 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold transition-all duration-200 cursor-pointer rounded-[2px] ${
              isManageMode
                ? 'bg-[#FFFFFF] text-[#000000] hover:bg-[#E50914] hover:text-[#FFFFFF]'
                : 'border border-[#808080] hover:border-[#FFFFFF] text-[#808080] hover:text-[#FFFFFF]'
            }`}
          >
            {isManageMode ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      </main>

      {/* Subtle Bottom Caption */}
      <footer className="relative z-10 pb-8 px-6 text-center text-xs text-[#808080]">
        <p>Select your profile to enter OUR UNIVERSE</p>
      </footer>

      {/* BUILT-IN AVATAR PICKER & PROFILE EDITOR MODAL */}
      {editingProfile && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeEditor}
        >
          <div
            className="relative w-full max-w-3xl bg-[#141414] border border-[#FFFFFF]/15 rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-[#FFFFFF] p-6 sm:p-10 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={closeEditor}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#181818] hover:bg-[#FFFFFF]/15 text-[#B3B3B3] hover:text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer border border-[#FFFFFF]/10"
              aria-label="Cancel and close avatar picker"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-5 border-b border-[#FFFFFF]/10 shrink-0">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]">
                {isCreatingNew ? 'Add Profile' : 'Edit Profile & Avatar'}
              </h2>
              <p className="text-xs sm:text-sm text-[#B3B3B3] mt-1">
                Choose a ready-made avatar from our curated collection below.
              </p>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto dark-scrollbar pr-1 py-6 space-y-6">
              {/* Top Section: Selected Avatar Preview + Profile Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#FFFFFF]/10">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[4px] ${
                      draftBg || 'bg-[#181818]'
                    } ring-2 ring-[#E50914] overflow-hidden flex items-center justify-center shadow-xl relative`}
                  >
                    {draftAvatarUrl ? (
                      <img
                        src={draftAvatarUrl}
                        alt={draftName || 'Selected avatar preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl select-none">{draftEmoji}</span>
                    )}
                  </div>
                  {draftAvatarUrl && (
                    <button
                      type="button"
                      onClick={handleClearBuiltInAvatar}
                      className="text-[11px] text-[#B3B3B3] hover:text-[#FFFFFF] underline cursor-pointer"
                    >
                      Use Classic Emoji Icon
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full space-y-4">
                  {formError && (
                    <div className="p-3 rounded-[4px] bg-[#E50914]/15 border border-[#E50914] text-xs text-[#FFFFFF]">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="profile-name-input" className="block text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider mb-1.5">
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
                      placeholder="Enter profile name"
                      className="w-full bg-[#181818] border border-[#808080]/60 focus:border-[#FFFFFF] rounded-[4px] py-3 px-4 text-sm sm:text-base text-[#FFFFFF] placeholder-[#808080] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-season-input" className="block text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider mb-1.5">
                      Favorite Season / Tagline (optional)
                    </label>
                    <input
                      id="profile-season-input"
                      type="text"
                      maxLength={48}
                      value={draftSeason}
                      onChange={(e) => setDraftSeason(e.target.value)}
                      placeholder="e.g. Season 1: How We Met"
                      className="w-full bg-[#181818] border border-[#808080]/60 focus:border-[#FFFFFF] rounded-[4px] py-2.5 px-4 text-xs sm:text-sm text-[#FFFFFF] placeholder-[#808080] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Built-in Avatar Picker Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF]">
                      Choose an Avatar
                    </h3>
                    <p className="text-xs text-[#808080]">
                      Ready-made original characters, anime portraits, cute mascots &amp; cinematic icons
                    </p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {BUILT_IN_AVATAR_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer ${
                          activeCategory === cat.id
                            ? 'bg-[#E50914] text-[#FFFFFF] shadow'
                            : 'bg-[#181818] text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5 sm:gap-4 pt-1">
                  {filteredAvatars.map((avatar) => {
                    const isSelected =
                      draftAvatarId === avatar.id || draftAvatarUrl === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleSelectBuiltInAvatar(avatar)}
                        className={`group/tile flex flex-col items-center gap-1.5 text-center cursor-pointer focus:outline-none`}
                        aria-label={`Select avatar ${avatar.name}`}
                        aria-pressed={isSelected}
                      >
                        <div
                          className={`relative w-full aspect-square rounded-[4px] overflow-hidden transition-all duration-200 group-hover/tile:scale-105 ${
                            isSelected
                              ? 'ring-3 ring-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.45)]'
                              : 'ring-2 ring-transparent group-hover/tile:ring-[#FFFFFF]'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            loading="lazy"
                            className="w-full h-full object-cover select-none"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#E50914] text-[#FFFFFF] flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-[11px] truncate w-full transition-colors ${
                            isSelected
                              ? 'text-[#FFFFFF] font-semibold'
                              : 'text-[#808080] group-hover/tile:text-[#FFFFFF]'
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
              <div className="pt-5 border-t border-[#FFFFFF]/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="px-6 py-2.5 border border-[#808080] hover:border-[#FFFFFF] text-[#B3B3B3] hover:text-[#FFFFFF] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#E50914] hover:bg-[#c11119] text-[#FFFFFF] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-[2px] shadow-lg transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
