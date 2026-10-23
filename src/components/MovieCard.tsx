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
        <div className={`relative ${rankNumber !== undefined ? 'w-32 xs:w-36 sm:w-44' : 'w-36 xs:w-40 sm:w-48'} aspect-[2/3] rounded-md overflow-hidden bg-[#141414] netflix-card-shadow border border-white/10 z-10 group-hover:border-[#E50914] group-hover:shadow-[0_12px_32px_rgba(229,9,20,0.3)] transition-all duration-300`}>
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

        {/* Top Indicators */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20">
          <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center text-xs font-bold text-[#FFFFFF] shadow">
            N
          </span>
          {memory.isSecret ? (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#E50914] text-[#FFFFFF] px-2 py-0.5 rounded shadow">
              <Lock className="w-2.5 h-2.5" />
              <span>Locked Letter</span>
            </span>
          ) : isLetter ? (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#181818]/90 text-[#FFFFFF] px-2 py-0.5 rounded border border-[#808080]/40">
              <Mail className="w-2.5 h-2.5 text-[#E50914]" />
              <span>Love Letter</span>
            </span>
          ) : memory.location ? (
            <span className="flex items-center gap-1 text-[10px] text-[#B3B3B3] bg-[#000000]/80 px-2 py-0.5 rounded border border-[#808080]/30">
              <MapPin className="w-2.5 h-2.5 text-[#E50914]" />
              <span className="truncate max-w-[120px]">{memory.location}</span>
            </span>
          ) : null}
        </div>

        {/* Bottom Caption Bar (Leaves image clear and unobstructed) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/65 to-transparent flex flex-col justify-end p-2.5 sm:p-3 pt-8">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#FFFFFF] line-clamp-1 drop-shadow">
              {memory.title}
            </h4>
          </div>
          {memory.subtitle && (
            <p className="text-[11px] text-[#B3B3B3] line-clamp-1">{memory.subtitle}</p>
          )}

          {/* Quick Buttons on Hover / Touch */}
          <div
            className={`flex items-center justify-between pt-1.5 sm:pt-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-90'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {/* Show Play button ONLY for genuine video content */}
              {isVideo ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(memory);
                  }}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000] flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer shrink-0"
                  title="Play Video"
                  aria-label="Play Video"
                >
                  <Play className="w-3.5 h-3.5 fill-[#000000] ml-0.5" />
                </button>
              ) : isLetter ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000] flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer shrink-0"
                  title="Read Letter"
                  aria-label="Read Letter"
                >
                  <Mail className="w-3.5 h-3.5 text-[#000000]" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInfo(memory);
                  }}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000] flex items-center justify-center shadow transition-transform active:scale-90 cursor-pointer shrink-0"
                  title="Read Story & Details"
                  aria-label="Read Story & Details"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#000000]" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(memory.id);
                }}
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#181818] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] flex items-center justify-center transition-colors active:scale-90 cursor-pointer shrink-0"
                title={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              >
                {memory.isInWatchlist ? (
                  <Check className="w-3.5 h-3.5 text-[#E50914] stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-[#FFFFFF]" />
                )}
              </button>

              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(memory.id);
                  }}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#181818] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] flex items-center justify-center transition-colors active:scale-90 cursor-pointer shrink-0"
                  title="Favorite"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      memory.isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-[#FFFFFF]'
                    }`}
                  />
                </button>
              )}

              {/* Admin-Only Change / Upload Image & Edit Button */}
              {onEditMemory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMemory(memory);
                  }}
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#181818] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] flex items-center justify-center transition-colors active:scale-90 cursor-pointer shrink-0"
                  title="Admin only: Change / Upload Image & Edit"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                </button>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-[#181818] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] flex items-center justify-center transition-colors active:scale-90 cursor-pointer shrink-0"
              title={isLetter ? 'Open Letter' : 'Story Details'}
            >
              <ChevronDown className="w-4 h-4 text-[#FFFFFF]" />
            </button>
          </div>

          {/* Clean Netflix Metadata in card */}
          <div className="flex items-center gap-2 text-[11px] text-[#B3B3B3] font-medium pt-1.5">
            <span className="text-[#FFFFFF] font-bold">{memory.matchScore || 98}% Match</span>
            <span aria-hidden="true" className="text-[#808080]">·</span>
            <span>{memory.year || '2024'}</span>
            <span aria-hidden="true" className="text-[#808080]">·</span>
            <span className="truncate">{memory.duration || 'Feature'}</span>
          </div>
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
