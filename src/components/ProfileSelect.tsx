import React from 'react';
import { LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { useBodyLock } from '../hooks/useBodyLock';
import { getProfileAvatarUrl } from '../data/builtInAvatars';

export default function ProfileSelect({
  profiles,
  onSelect,
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
  useBodyLock(true);

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#141414] text-white flex flex-col items-center justify-center px-4 select-none">
      {onSignOut && (
        <button
          type="button"
          onClick={onSignOut}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      )}

      <main className="w-full flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-8 sm:mb-12 text-center">
          Who's watching?
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile)}
              className="group relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 overflow-hidden rounded-[4px] bg-neutral-800 focus:outline-none"
              aria-label={`Select ${profile.name}`}
            >
              <img
                src={getProfileAvatarUrl(profile)}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => window.alert('Manage profiles coming soon')}
          className="mt-12 sm:mt-16 px-6 py-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-neutral-500 border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 transition-colors"
        >
          Manage Profiles
        </button>
      </main>
    </div>
  );
}
