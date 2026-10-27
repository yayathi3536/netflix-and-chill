import React, { useState } from 'react';
import { Play, Plus, Check, ChevronDown, BookOpen } from 'lucide-react';
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
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  onUnlockVault,
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

  return (
    <div
      className={`group relative nf-card rounded-[4px] bg-[#141414] overflow-hidden cursor-pointer select-none ${
        className || 'shrink-0 w-60 sm:w-72 md:w-80'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={memory.title}
          imageUrl={memory.posterUrl || memory.backdropUrl}
          focalPosition="top"
          fit="auto"
          fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
          className="w-full h-full"
        />

        {/* Hover overlay only */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h4 className="text-sm font-semibold text-white line-clamp-1 mb-2">
              {memory.title}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isVideo ? onPlay(memory) : onOpenInfo(memory);
                }}
                className="btn-nf-icon bg-white text-black border-white hover:bg-white/80"
                aria-label={isVideo ? 'Play' : 'Read'}
              >
                {isVideo ? (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(memory.id);
                }}
                className="btn-nf-icon"
                aria-label="Add to My List"
              >
                {memory.isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInfo(memory);
                }}
                className="btn-nf-icon"
                aria-label="More info"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar — 2px, red */}
        {memory.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-700">
            <div className="h-full bg-[#E50914]" style={{ width: `${memory.progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};
