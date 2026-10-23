import React, { useState } from 'react';
import { Play, Plus, Check, Heart, ChevronDown, Lock, MapPin, Edit3, BookOpen, Mail } from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { hasValidVideo, isLetterItem } from '../utils/mediaHelpers';

interface MovieCardProps {
  memory: MemoryItem;
  rankNumber?: number;
  isPortrait?: boolean;
  onPlay: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onUnlockVault?: (memory: MemoryItem) => void;
  onEditMemory?: (memory: MemoryItem) => void;
  className?: string;
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
  onEditMemory,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isVideo = hasValidVideo(memory);
  const isLetter = isLetterItem(memory);

  const handleCardClick = () => {
    if (isLetter && onUnlockVault) {
      onUnlockVault(memory);
    } else {
      onOpenInfo(memory);
    }
  };

  // Portrait Poster Layout (for Top 10 series with numbers, or portrait collection cards)
  if (isPortrait) {
    return (
      <div
        className="group relative flex items-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-[1.04] z-10 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Outlined numeral if rankNumber is defined */}
        {rankNumber !== undefined && (
          <div className="relative text-8xl sm:text-9xl font-black select-none pointer-events-none -mr-4 sm:-mr-6 z-0 text-[#000000] drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] [-webkit-text-stroke:3px_#555555] group-hover:[-webkit-text-stroke:3px_#E50914] transition-all">
            {rankNumber}
          </div>
        )}

        {/* Poster Card */}
        <div className={`relative ${rankNumber !== undefined ? 'w-32 xs:w-36 sm:w-44' : 'w-36 xs:w-40 sm:w-48'} aspect-[2/3] rounded-md overflow-hidden bg-[#141414] netflix-card-shadow border border-white/10 z-10 group-hover:border-white/20 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-300`}>
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={memory.posterUrl || memory.backdropUrl}
            variant="poster"
            aspectRatio="3/4"
            focalPosition="top"
            fit="cover"
            fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
            className="w-full h-full"
          />

          {/* Top Netflix badge & Admin Edit */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
            <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center text-xs font-bold text-[#FFFFFF] shadow-md">
              N
            </span>
            {onEditMemory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditMemory(memory);
                }}
                className="w-7 h-7 rounded-full bg-[#000000]/85 hover:bg-[#E50914] border border-white/20 text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer shadow-md min-h-[28px] min-w-[28px]"
                title="Admin only: Change / Upload Image"
                aria-label="Edit memory image"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FFFFFF]" />
              </button>
            )}
          </div>

          {/* Bottom Title & Scrim */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/60 to-transparent flex flex-col justify-end p-2.5 sm:p-3 pt-8 z-20">
            <h3 className="text-sm font-semibold text-[#FFFFFF] leading-tight drop-shadow-md line-clamp-1">
              {memory.title}
            </h3>
            {memory.subtitle && (
              <span className="text-[10px] text-[#B3B3B3] mt-0.5 line-clamp-1">{memory.subtitle}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard Landscape Card (16:9 / 16:10) — Full Image Display with Ambient Glow
  return (
    <div
      className={`group relative rounded-md bg-[#141414] overflow-hidden netflix-card-shadow border border-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.035] hover:z-30 hover:border-white/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.9)] select-none ${
        className || 'shrink-0 w-60 sm:w-72 md:w-80'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Aspect Ratio Container — Direct Image Display with Full Image Visibility */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-[#141414]">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={memory.title}
          imageUrl={memory.posterUrl || memory.backdropUrl}
          variant="landscape"
          focalPosition="top"
          fit="auto"
          fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
          className="w-full h-full"
        />

        {/* Bottom Caption Bar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 pt-10 z-10">
          <h4 className="text-sm font-semibold text-white line-clamp-1">{memory.title}</h4>

          {isHovered && (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); isVideo ? onPlay(memory) : onOpenInfo(memory); }}
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200"
                aria-label={isVideo ? 'Play' : 'Open details'}
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleWatchlist(memory.id); }}
                className="w-8 h-8 rounded-full bg-neutral-800/80 border border-white/30 text-white flex items-center justify-center hover:bg-neutral-700"
                aria-label={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {memory.isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenInfo(memory); }}
                className="w-8 h-8 rounded-full bg-neutral-800/80 border border-white/30 text-white flex items-center justify-center hover:bg-neutral-700"
                aria-label="More info"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Netflix Red Progress Bar (For "Continue Watching") */}
        {memory.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#181818] z-30">
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
