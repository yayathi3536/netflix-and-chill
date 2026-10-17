import React from 'react';
import { UserProfile } from '../types';

export default function ProfileSelect({
  profiles,
  onSelect,
  onManage,
}: {
  profiles: UserProfile[];
  onSelect: (profile: UserProfile) => void;
  onManage?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col items-center pt-16">
      <header className="w-full max-w-6xl px-6 flex justify-between items-center">
        <div className="font-bebas text-3xl tracking-widest text-[#E50914] font-black uppercase">OUR UNIVERSE</div>
        {onManage && (
          <button
            type="button"
            onClick={onManage}
            className="text-sm text-[#B3B3B3] hover:text-white transition-colors"
          >
            Manage Profiles
          </button>
        )}
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center">Who's watching?</h1>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className="group w-36 sm:w-40 flex flex-col items-center gap-3 rounded-lg border border-[#181818] bg-[#141414] p-4 transition-all duration-200 hover:border-[#E50914] hover:scale-[1.03]"
              aria-label={`Select profile ${profile.name}`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#181818] border border-transparent group-hover:border-[#E50914] overflow-hidden flex items-center justify-center transition-all duration-200 shadow-lg">
                {profile.avatarEmoji ? (
                  <span className="text-3xl sm:text-4xl" aria-hidden="true">{profile.avatarEmoji}</span>
                ) : (
                  <span className="text-xl text-[#B3B3B3]">{profile.name.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm text-[#FFFFFF] font-medium">{profile.name}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-[#808080]">
        Your selected profile is kept for this authenticated session.
      </footer>
    </div>
  );
}
