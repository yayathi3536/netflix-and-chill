import React, { useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
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
  isAudioPlaying,
  onToggleAudio,
  customTitle,
  customSubtitle,
  customSynopsis,
  customBackdropUrl,
  customBadge,
  customSeriesTag,
}) => {
  const displayTitle = customTitle || 'OUR UNIVERSE';
  const displaySubtitle = customSubtitle || memory.subtitle || 'Season 1 · Chapter Infinity';
  const displaySynopsis =
    customSynopsis ||
    memory.synopsis ||
    'A cinematic journey through our favorite memories, little moments, and the story we keep creating together.';
  const displayBackdrop = customBackdropUrl || memory.backdropUrl;
  const displayBadge = customBadge || 'A STORY MADE FOR US';
  const displaySeriesTag = customSeriesTag || 'SERIES';
  const hasHeroVideo = hasValidVideo(memory) || isVideoUrl(customBackdropUrl);
  const heroMemoryToPlay =
    customBackdropUrl && isVideoUrl(customBackdropUrl)
      ? { ...memory, videoUrl: customBackdropUrl }
      : memory;

  useEffect(() => {
    if (!displayBackdrop || isVideoUrl(displayBackdrop)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = displayBackdrop;
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [displayBackdrop]);

  return (
    <div className="relative w-full h-[55vh] sm:h-[70vh] min-h-[380px] sm:min-h-[500px] max-h-[800px] overflow-hidden select-none bg-black">
      <div className="absolute inset-0 w-full h-full overflow-hidden animate-ken-burns">
        <VisualArt
          id={memory.id}
          category={memory.category}
          title={displayTitle}
          imageUrl={displayBackdrop}
          focal="center 30%"
          focalPosition="center"
          fit="cover"
          fallbackGradient="from-[#141414] via-[#000000] to-[#000000]"
          className="w-full h-full"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-16 lg:pb-24">
        <div className="max-w-2xl space-y-2 sm:space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-white flex-wrap">
            <span className="bg-[#E50914] px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {displaySeriesTag}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-300 uppercase text-[10px]">
              {displayBadge}
            </span>
            <span className="text-neutral-400 hidden sm:inline">·</span>
            <span className="text-neutral-300 text-[10px] hidden sm:inline">
              {displaySubtitle}
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
            {displayTitle}
          </h1>

          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <span className="font-semibold text-white">{memory.matchScore || 99}% Match</span>
            {memory.year != null && (
              <>
                <span>·</span>
                <span>{memory.year}</span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl">
            {displaySynopsis}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => (hasHeroVideo ? onPlay(heroMemoryToPlay) : onOpenInfo(memory))}
              className="btn-nf-primary flex-1 sm:flex-none text-sm sm:text-base"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{hasHeroVideo ? 'Play' : 'Read Story'}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenInfo(memory)}
              className="btn-nf-secondary flex-1 sm:flex-none text-sm sm:text-base"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleAudio}
          className="hidden sm:flex absolute right-4 sm:right-8 bottom-16 sm:bottom-24 w-10 h-10 rounded-full border border-white/40 bg-black/60 text-white items-center justify-center hover:bg-black/80 transition-colors"
          aria-label="Toggle soundtrack"
          aria-pressed={isAudioPlaying}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
