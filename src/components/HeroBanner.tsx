import React from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, Edit3, BookOpen, Camera } from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { hasValidVideo, isVideoUrl } from '../utils/mediaHelpers';

interface HeroBannerProps {
  memory: MemoryItem;
  onPlay: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (memoryId: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isAdmin?: boolean;
  onEditHero?: () => void;
  onExploreMemories?: () => void;
  customTitle?: string;
  customSubtitle?: string;
  customSynopsis?: string;
  customBackdropUrl?: string;
  customBadge?: string;
  customSeriesTag?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  memory,
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  isAudioPlaying,
  onToggleAudio,
  isAdmin = false,
  onEditHero,
  onExploreMemories,
  customTitle,
  customSubtitle,
  customSynopsis,
  customBackdropUrl,
  customBadge,
  customSeriesTag,
}) => {
  const displayTitle = customTitle || "OUR UNIVERSE";
  const displaySubtitle = customSubtitle || memory.subtitle || "Season 1 · Chapter Infinity";
  const displaySynopsis =
    customSynopsis ||
    memory.synopsis ||
    "From an unexpected first conversation to building our whole universe together. A cinematic journey of late-night laughter, spontaneous road trips, and finding home in each other's arms.";
  const displayBackdrop = customBackdropUrl || memory.backdropUrl;
  const displayBadge = customBadge || '#1 in Our Hearts Today';
  const displaySeriesTag = customSeriesTag || 'SERIES';
  const hasHeroVideo = hasValidVideo(memory) || isVideoUrl(customBackdropUrl);
  const heroMemoryToPlay = customBackdropUrl && isVideoUrl(customBackdropUrl)
    ? { ...memory, videoUrl: customBackdropUrl }
    : memory;

  return (
    <div className="relative w-full h-[78vh] sm:h-[85vh] min-h-[480px] sm:min-h-[580px] max-h-[880px] overflow-hidden select-none bg-[#000000]">
      {/* Background Media with subtle Ken Burns cinematic movement */}
      <div className="absolute inset-0 w-full h-full animate-ken-burns">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={displayTitle}
          imageUrl={displayBackdrop}
          fallbackGradient="from-[#141414] via-[#000000] to-[#000000]"
          className="w-full h-full object-cover scale-105"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Strict Netflix Black Gradient Overlays */}
      <div className="absolute inset-0 hero-netflix-overlay" />
      <div className="absolute inset-0 hero-netflix-scrim" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 lg:pb-28">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Top Series & Milestone Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#FFFFFF] flex-wrap">
            <span className="bg-[#E50914] text-[#FFFFFF] font-black px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] uppercase tracking-widest">
              {displaySeriesTag}
            </span>
            <span className="text-[#808080]">·</span>
            <span className="uppercase text-[10px] sm:text-[11px] text-[#B3B3B3] font-semibold">
              {displayBadge}
            </span>
            <span className="text-[#808080] hidden sm:inline">·</span>
            <span className="text-[#B3B3B3] font-normal text-xs hidden sm:inline">
              {displaySubtitle}
            </span>
          </div>

          {/* Cinematic Title */}
          <h1 className="font-bebas text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#FFFFFF] font-black leading-none uppercase drop-shadow-2xl break-words">
            {displayTitle}
          </h1>

          {/* Clean Netflix Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#B3B3B3] font-medium">
            <span className="text-[#FFFFFF] font-bold">{memory.matchScore || 99}% Match</span>
            <span aria-hidden="true" className="text-[#808080]">·</span>
            <span>{memory.year || '2024'}</span>
            <span aria-hidden="true" className="text-[#808080]">·</span>
            <span className="border border-[#808080]/60 px-1.5 py-0.2 rounded text-[10px] text-[#FFFFFF]">
              {memory.rating || 'PG-13'}
            </span>
            <span aria-hidden="true" className="text-[#808080]">·</span>
            <span>{memory.duration || 'Forever'}</span>
            <span aria-hidden="true" className="text-[#808080] hidden xs:inline">·</span>
            <span className="border border-[#808080]/60 px-1.5 py-0.2 rounded text-[10px] font-bold text-[#FFFFFF] hidden xs:inline">
              Ultra HD 4K
            </span>
          </div>

          {/* Readable Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#B3B3B3] leading-relaxed font-normal line-clamp-3 sm:line-clamp-4 max-w-xl text-balance drop-shadow-md">
            {displaySynopsis}
          </p>

          {/* Strict Netflix Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
            {hasHeroVideo ? (
              <button
                onClick={() => onPlay(heroMemoryToPlay)}
                className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-xs sm:text-sm md:text-base rounded shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                <span>Play Video</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenInfo(memory)}
                className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-xs sm:text-sm md:text-base rounded shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>Read Our Story</span>
              </button>
            )}

            {/* Dark Grey Secondary Button with White Text */}
            <button
              onClick={() => onOpenInfo(memory)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#181818]/90 hover:bg-white/10 text-[#FFFFFF] font-semibold text-xs sm:text-sm md:text-base rounded-md border border-white/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFFFFF]" />
              <span>More Info</span>
            </button>

            {/* My List Quick Toggle */}
            <button
              onClick={() => onToggleWatchlist(memory.id)}
              className="w-11 h-11 rounded-md bg-[#181818]/90 hover:bg-white/10 border border-white/20 text-[#FFFFFF] transition-all cursor-pointer active:scale-95 flex items-center justify-center min-h-[44px] min-w-[44px]"
              title={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
              aria-label="Toggle My List"
            >
              {memory.isInWatchlist ? (
                <Check className="w-5 h-5 text-[#E50914]" />
              ) : (
                <Plus className="w-5 h-5 text-[#FFFFFF]" />
              )}
            </button>

            {/* Admin-Only Edit & Image Upload Trigger */}
            {isAdmin && onEditHero && (
              <button
                onClick={onEditHero}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#181818] hover:bg-white/10 text-[#FFFFFF] font-medium text-xs rounded-md border border-white/20 transition-all active:scale-95 cursor-pointer min-h-[44px]"
                title="Admin only: Change hero image & text"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="hidden sm:inline">Change Hero Content</span>
                <span className="sm:hidden">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Volume & Rating Pill */}
        <div className="absolute right-3 sm:right-8 top-24 sm:top-auto sm:bottom-28 flex items-center gap-2 sm:gap-3 z-20">
          <button
            onClick={onToggleAudio}
            className="w-10 h-10 rounded-full border border-white/20 bg-[#000000]/70 text-[#FFFFFF] hover:bg-[#181818] transition-all cursor-pointer flex items-center justify-center shadow-lg hover:scale-105"
            title="Toggle soundtrack"
            aria-label="Soundtrack audio"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 text-[#FFFFFF]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#808080]" />
            )}
          </button>
          <div className="hidden sm:flex items-center px-3 py-1 bg-[#141414]/90 rounded-md border-l-2 border-[#E50914] text-xs text-[#B3B3B3] font-semibold border border-white/10 shadow-sm">
            <span>{memory.rating || 'PG-13'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
