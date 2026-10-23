import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Track } from '../data/tracks';

interface SoundtrackRowProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  onTogglePlay: () => void;
  onOpenPlayer: () => void;
}

export const SoundtrackRow: React.FC<SoundtrackRowProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onOpenPlayer,
}) => {
  return (
    <div className="my-8 sm:my-10 px-4 sm:px-6 lg:px-8">
      {/* Netflix Row Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold tracking-widest uppercase mb-0.5">
            <Music className="w-3.5 h-3.5" />
            <span>ORIGINAL SOUNDTRACK</span>
          </div>
          <h2 className="font-bebas text-2xl sm:text-3xl lg:text-4xl text-[#FFFFFF] font-black tracking-wider uppercase">
            Our Soundtrack
          </h2>
          <p className="text-xs text-[#B3B3B3] font-normal mt-0.5">
            The melodies that scored our quiet walks, road trips, and midnight drives.
          </p>
        </div>

        <button
          onClick={onOpenPlayer}
          className="text-xs text-[#B3B3B3] hover:text-[#FFFFFF] font-semibold transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider"
        >
          <span>Open Full Player</span>
          <span>&rarr;</span>
        </button>
      </div>

      {/* Horizontal Scrollable Track Cards */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 -mx-1 px-1">
        {tracks.map((track, idx) => {
          const isCurrent = currentTrackIndex === idx;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => {
                if (isCurrent) {
                  onTogglePlay();
                } else {
                  onSelectTrack(idx);
                }
              }}
              className={`group relative shrink-0 w-64 sm:w-72 rounded p-4 bg-[#141414] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'border-[#E50914] shadow-2xl bg-[#181818]'
                  : 'border-[#181818] hover:border-[#808080]/60 hover:scale-[1.02]'
              }`}
            >
              {/* Top album artwork and play state */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-16 h-16 rounded overflow-hidden shadow-md shrink-0 bg-[#000000]">
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-contain transition-transform duration-500 ${
                        isCurrentPlaying ? 'scale-105' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                      <Music className="w-6 h-6 text-[#E50914]" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div
                    className={`absolute inset-0 bg-[#000000]/60 flex items-center justify-center transition-opacity ${
                      isCurrentPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-5 h-5 fill-white text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="overflow-hidden flex-1">
                  <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider block truncate">
                    {track.artist}
                  </span>
                  <h3 className="font-bebas text-lg text-[#FFFFFF] font-bold leading-snug truncate uppercase tracking-wide group-hover:text-[#FFFFFF] transition-colors">
                    {track.title}
                  </h3>
                  <span className="text-[11px] text-[#808080] font-mono tabular-nums">
                    {track.duration || '3:30'}
                  </span>
                </div>
              </div>

              {/* Vibe & Live Equalizer */}
              <div className="pt-2 border-t border-[#181818] flex items-center justify-between text-[11px]">
                <span className="text-[#B3B3B3] truncate max-w-[170px]">
                  {track.vibe || 'Original Track'}
                </span>

                {isCurrentPlaying ? (
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 bg-[#E50914] rounded-full animate-pulse h-2.5" />
                    <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.2s] h-3.5" />
                    <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.4s] h-1.5" />
                  </div>
                ) : (
                  <span className="text-[10px] text-[#808080] font-medium">Click to Play</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
