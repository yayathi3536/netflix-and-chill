import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryItem } from '../types';
import { MovieCard } from './MovieCard';

interface CarouselRowProps {
  title: string;
  subtitle?: string;
  items: MemoryItem[];
  isPortrait?: boolean;
  onPlay: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onUnlockVault?: (memory: MemoryItem) => void;
  onEditMemory?: (memory: MemoryItem) => void;
  onEditSection?: () => void;
}

export const CarouselRow: React.FC<CarouselRowProps> = ({
  title,
  items,
  isPortrait = false,
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  onToggleFavorite,
  onUnlockVault,
  onEditMemory,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!rowRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;

    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items?.length) return null;

  return (
    <div className="relative group/row my-6 sm:my-8 lg:my-10">
      <div className="px-4 sm:px-6 lg:px-[4%] mb-2 sm:mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-gradient-to-r from-black/90 to-transparent text-white hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll left"
          >
            <div className="w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-3 px-4 sm:px-6 lg:px-[4%]"
        >
          {items.map((item, index) => (
            <MovieCard
              key={item.id}
              memory={item}
              rankNumber={isPortrait ? index + 1 : undefined}
              isPortrait={isPortrait}
              onPlay={onPlay}
              onOpenInfo={onOpenInfo}
              onToggleWatchlist={onToggleWatchlist}
              onToggleFavorite={onToggleFavorite}
              onUnlockVault={onUnlockVault}
              onEditMemory={onEditMemory}
            />
          ))}
        </div>

        {showRightArrow && items.length > 2 && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-gradient-to-l from-black/90 to-transparent text-white hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll right"
          >
            <div className="w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
