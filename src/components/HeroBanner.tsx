import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { useDominantColor } from '../hooks/useDominantColor';
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
  customTitle,
  customSubtitle,
  customSynopsis,
  customBackdropUrl,
  customBadge,
  customSeriesTag,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const displayTitle = customTitle || "OUR UNIVERSE";
  const displaySubtitle = customSubtitle || memory.subtitle || "Season 1 · Chapter Infinity";
  const displaySynopsis =
    customSynopsis ||
    memory.synopsis ||
    "From an unexpected first conversation to building our whole universe together. A cinematic journey of late-night laughter, spontaneous road trips, and finding home in each other's arms.";
  const displayBackdrop = customBackdropUrl || memory.backdropUrl;
  const dominantColor = useDominantColor(displayBackdrop);
  const displayBadge = customBadge || '#1 in Our Hearts Today';
  const displaySeriesTag = customSeriesTag || 'SERIES';
  const hasHeroVideo = hasValidVideo(memory) || isVideoUrl(customBackdropUrl);
  const heroMemoryToPlay = customBackdropUrl && isVideoUrl(customBackdropUrl)
    ? { ...memory, videoUrl: customBackdropUrl }
    : memory;

  return (
    <div className="relative w-full h-[55vh] min-h-[380px] max-h-[800px] overflow-hidden select-none bg-[#000000] sm:h-[70vh] sm:min-h-[500px]">
      {/* Background Media with subtle Ken Burns cinematic movement */}
      <div
        className={`absolute inset-0 w-full h-full overflow-hidden ${isHovering ? '' : 'animate-ken-burns'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
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

      {/* Subtle ambient glow sampled from the hero artwork */}
      {dominantColor && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
          style={{
            background: `radial-gradient(ellipse at 30% 60%, ${dominantColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 lg:pb-16">
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
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#FFFFFF] font-bold leading-tight drop-shadow-2xl break-words line-clamp-2">
            {displayTitle}
          </h1>

          {/* Clean Netflix Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
            <span className="font-semibold text-white">{memory.matchScore}% Match</span>
            <span>·</span>
            <span>{memory.year}</span>
          </div>

          {/* Readable Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#B3B3B3] leading-relaxed font-normal line-clamp-2 max-w-xl text-balance drop-shadow-md">
            {displaySynopsis}
          </p>

          {/* Equal-width mobile actions; compact auto-width buttons on desktop */}
          <div className="flex w-full flex-row items-center gap-3 pt-2 sm:w-auto">
            <button
              onClick={() => hasHeroVideo ? onPlay(heroMemoryToPlay) : onOpenInfo(memory)}
              className="btn-nf-primary text-base w-1/2 flex-1 sm:w-auto sm:flex-none"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{hasHeroVideo ? 'Play' : 'Read Story'}</span>
            </button>
            <button
              onClick={() => onOpenInfo(memory)}
              className="btn-nf-secondary text-base w-1/2 flex-1 sm:w-auto sm:flex-none"
            >
              <span>More Info</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
