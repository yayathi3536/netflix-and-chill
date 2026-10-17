import React from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

export default function ProfileSelect({
  profiles,
  onSelect,
  onManage,
  userEmail,
  isAdmin = false,
  onSignOut,
}: {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onManage?: () => void;
  userEmail?: string;
  isAdmin?: boolean;
  onSignOut?: () => void;
}) {
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
        <h1 className="text-3xl sm:text-5xl md:text-[54px] font-medium mb-8 sm:mb-12 text-center tracking-wide text-[#FFFFFF]">
          Who's watching?
        </h1>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className="group w-28 sm:w-36 md:w-40 flex flex-col items-center gap-3 transition-transform duration-200 hover:scale-105 cursor-pointer focus:outline-none"
              aria-label={`Select profile ${profile.name}`}
            >
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-[4px] ${
                  profile.avatarBg || 'bg-[#181818]'
                } ring-2 ring-transparent group-hover:ring-[#FFFFFF] group-focus-visible:ring-[#FFFFFF] overflow-hidden flex items-center justify-center transition-all duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.75)] relative`}
              >
                {/* Classic Netflix avatar radial sheen */}
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
            </button>
          ))}
        </div>

        {isAdmin && onManage && (
          <div className="mt-12 sm:mt-16">
            <button
              type="button"
              onClick={onManage}
              className="px-6 py-2 border border-[#808080] hover:border-[#FFFFFF] text-[#808080] hover:text-[#FFFFFF] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-200 cursor-pointer"
            >
              Manage Profiles
            </button>
          </div>
        )}
      </main>

      {/* Subtle Bottom Caption */}
      <footer className="relative z-10 pb-8 px-6 text-center text-xs text-[#808080]">
        <p>Select your profile to enter OUR UNIVERSE</p>
      </footer>
    </div>
  );
}
