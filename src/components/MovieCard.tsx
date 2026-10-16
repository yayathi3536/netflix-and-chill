import React, { useState } from 'react';
import { Play, Plus, Check, Heart, ChevronDown, Lock, Unlock, MapPin } from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';

interface MovieCardProps {
  memory: MemoryItem;
  rankNumber?: number;
  isPortrait?: boolean;
  onPlay: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onUnlockVault?: (memory: MemoryItem) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  memory,
  rankNumber,
  isPortrait = false,
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  onToggleFavorite,
  onUnlockVault,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (memory.isSecret && onUnlockVault) {
      onUnlockVault(memory);
    } else {
      onOpenInfo(memory);
    }
  };

  // Top 10 Portrait Poster Layout
  if (isPortrait && rankNumber !== undefined) {
    return (
      <div
        className="group relative flex items-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Giant Netflix-style outlined numeral */}
        <div className="relative font-bebas text-8xl sm:text-9xl font-black select-none pointer-events-none -mr-4 sm:-mr-6 z-0 text-[#1f1f1f] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] [-webkit-text-stroke:3px_#404040] group-hover:[-webkit-text-stroke:3px_#E50914] transition-all">
          {rankNumber}
        </div>

        {/* Poster Card */}
        <div className="relative w-36 sm:w-44 h-52 sm:h-64 rounded-md overflow-hidden bg-[#181818] shadow-lg border border-white/5 z-10 group-hover:border-white/20 transition-all">
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={memory.posterUrl || memory.backdropUrl}
            fallbackGradient={memory.fallbackGradient}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Top badge */}
          <div className="absolute top-2 left-2 z-20">
            <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center font-bebas text-xs font-black text-white shadow">
              N
            </span>
          </div>

          {/* Bottom Title & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent flex flex-col justify-end p-3 z-20">
            <h3 className="font-bebas text-base sm:text-lg text-white font-bold leading-tight drop-shadow line-clamp-2">
              {memory.title}
            </h3>
            <span className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">{memory.subtitle}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Landscape Card (16:9)
  return (
    <div
      className="group relative shrink-0 w-64 sm:w-72 md:w-80 rounded-md bg-[#181818] overflow-hidden shadow-md border border-white/5 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 hover:border-white/20 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Aspect Ratio Container (16:9) */}
      <div className="relative aspect-video w-full overflow-hidden">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={memory.title}
          imageUrl={memory.backdropUrl}
          fallbackGradient={memory.fallbackGradient}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Top Indicators */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20">
          <span className="w-4 h-4 rounded bg-[#E50914] flex items-center justify-center font-bebas text-[10px] font-black text-white">
            U
          </span>
          {memory.isSecret ? (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#E50914]/90 text-white px-2 py-0.5 rounded shadow">
              <Lock className="w-2.5 h-2.5" />
              <span>Locked</span>
            </span>
          ) : memory.location ? (
            <span className="flex items-center gap-1 text-[10px] text-neutral-300 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
              <MapPin className="w-2.5 h-2.5 text-[#ff4d5a]" />
              <span className="truncate max-w-[120px]">{memory.location}</span>
            </span>
          ) : null}
        </div>

        {/* Hover Quick Action Layer */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#141414] via-black/60 to-transparent flex flex-col justify-end p-3 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-85'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm tracking-wide line-clamp-1 drop-shadow">
              {memory.title}
            </h4>
          </div>
          {memory.subtitle && (
            <p className="text-[11px] text-neutral-400 line-clamp-1">{memory.subtitle}</p>
          )}

          {/* Quick Buttons on Hover */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(memory);
                }}
                className="w-7 h-7 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow transition-transform active:scale-90"
                title="Play memory"
              >
                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(memory.id);
                }}
                className="w-7 h-7 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/30 text-white flex items-center justify-center transition-colors active:scale-90"
                title={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {memory.isInWatchlist ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>

              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(memory.id);
                  }}
                  className="w-7 h-7 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/30 text-white flex items-center justify-center transition-colors active:scale-90"
                  title="Love this"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      memory.isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-white'
                    }`}
                  />
                </button>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-7 h-7 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/30 text-white flex items-center justify-center transition-colors active:scale-90"
              title="Episode details"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Unboxed Metadata in card */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium pt-1">
            <span className="text-emerald-400 font-bold">{memory.matchScore}% Match</span>
            <span aria-hidden="true">·</span>
            <span>{memory.year}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{memory.duration}</span>
          </div>
        </div>

        {/* Progress Bar (For "Continue Watching") */}
        {memory.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 z-30">
            <div
              className="h-full bg-[#E50914]"
              style={{ width: `${memory.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
