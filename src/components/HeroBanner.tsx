import React from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';

interface HeroBannerProps {
  memory: MemoryItem;
  onPlay: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (memoryId: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  memory,
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  isAudioPlaying,
  onToggleAudio,
}) => {
  return (
    <div className="relative w-full h-[78vh] min-h-[520px] max-h-[820px] overflow-hidden select-none">
      {/* Background Media with Ken Burns cinematic zoom */}
      <div className="absolute inset-0 w-full h-full animate-ken-burns">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={memory.title}
          imageUrl={memory.backdropUrl}
          fallbackGradient={memory.fallbackGradient}
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* Cinematic Overlays: Left vignette and bottom scrim */}
      <div className="absolute inset-0 hero-gradient-overlay" />
      <div className="absolute inset-0 hero-bottom-scrim" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Top 10 / Milestone Ribbon */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white">
            <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center font-bebas text-sm">
              TOP
            </span>
            <span className="uppercase tracking-widest text-[11px] text-neutral-300">
              #1 in Our Hearts Today
            </span>
            <span className="text-neutral-500">·</span>
            <span className="flex items-center gap-1 text-[#ff4d5a] text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>Original Series</span>
            </span>
          </div>

          {/* Cinematic Title */}
          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wider text-white font-black leading-none drop-shadow-2xl">
            {memory.title}
          </h1>

          {/* Metadata String: Clean unboxed metadata with separators */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-300 font-medium">
            <span className="text-emerald-400 font-bold">{memory.matchScore}% Match</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{memory.year}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{memory.duration}</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span className="border border-white/30 px-1.5 py-0.2 rounded text-[10px] text-neutral-200">
              Ultra HD 4K
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-neutral-200/90 leading-relaxed font-normal line-clamp-3 max-w-xl text-balance drop-shadow">
            {memory.synopsis}
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => onPlay(memory)}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-neutral-200 text-black font-bold text-sm sm:text-base rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Relive Moment</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={() => onOpenInfo(memory)}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm sm:text-base rounded-md backdrop-blur-md transition-colors active:scale-95 cursor-pointer whitespace-nowrap border border-white/10"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            {/* Watchlist Quick Button */}
            <button
              onClick={() => onToggleWatchlist(memory.id)}
              className="p-2.5 sm:p-3 rounded-full bg-neutral-900/60 hover:bg-neutral-800 border border-white/20 text-white transition-all cursor-pointer hover:border-white active:scale-95"
              title={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              aria-label="Toggle Watchlist"
            >
              {memory.isInWatchlist ? (
                <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Plus className="w-5 h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Right Rating & Volume Indicator */}
        <div className="absolute right-4 sm:right-8 bottom-20 sm:bottom-24 flex items-center gap-3">
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-full border border-white/20 bg-neutral-900/60 text-white hover:bg-neutral-800 transition-colors"
            title="Toggle soundtrack"
            aria-label="Audio mute/unmute"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="bg-neutral-900/80 border-l-2 border-white px-3 py-1 text-xs font-semibold text-neutral-300 tracking-wider">
            {memory.rating}
          </div>
        </div>
      </div>
    </div>
  );
};
