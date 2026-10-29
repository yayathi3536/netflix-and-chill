import React, { useState } from 'react';
import { Play, Plus, Check, BookOpen, ChevronDown } from 'lucide-react';
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
      className={`group relative nf-card rounded-[4px] bg-[#141414] overflow-hidden cursor-pointer select-none shrink-0 ${
        className ||
        (isPortrait
          ? 'w-[30vw] sm:w-40 md:w-44 lg:w-48 aspect-[2/3]'
          : 'w-[44vw] sm:w-60 md:w-72 lg:w-80 aspect-video')
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {isPortrait && rankNumber !== undefined && (
        <span
          className="absolute -left-1 bottom-0 font-bebas leading-none font-black text-transparent select-none z-0"
          style={{
            WebkitTextStroke: '3px #595959',
            fontSize: 'clamp(80px, 20vw, 140px)',
          }}
          aria-hidden="true"
        >
          {rankNumber}
        </span>
      )}

      <div
        className={`relative w-full h-full overflow-hidden bg-[#141414] ${
          isPortrait && rankNumber !== undefined ? 'ml-6' : ''
        }`}
      >
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={memory.title}
          imageUrl={memory.posterUrl || memory.backdropUrl}
          focal={isPortrait ? 'center 20%' : 'center 25%'}
          focalPosition="top"
          fit="cover"
          fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
          className="w-full h-full"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-200 opacity-100 sm:opacity-0 ${
            isHovered ? 'sm:opacity-100' : ''
          }`}
        >
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
            <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 mb-1.5 sm:mb-2">
              {memory.title}
            </h4>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isVideo ? onPlay(memory) : onOpenInfo(memory);
                }}
                className="btn-nf-icon bg-white text-black border-white hover:bg-white/80 !w-9 !h-9 sm:!w-10 sm:!h-10"
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
                className="btn-nf-icon !w-9 !h-9 sm:!w-10 sm:!h-10"
                aria-label="Add to My List"
              >
                {memory.isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInfo(memory);
                }}
                className="btn-nf-icon !w-9 !h-9 sm:!w-10 sm:!h-10"
                aria-label="More info"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {memory.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-700">
            <div className="h-full bg-[#E50914]" style={{ width: `${memory.progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};
