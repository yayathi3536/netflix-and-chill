import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
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
  subtitle,
  items,
  isPortrait = false,
  onPlay,
  onOpenInfo,
  onToggleWatchlist,
  onToggleFavorite,
  onUnlockVault,
  onEditMemory,
  onEditSection,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/row my-6 sm:my-8 px-4 sm:px-6 lg:px-8">
      {/* Netflix Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="font-bebas text-2xl sm:text-3xl lg:text-4xl tracking-wider text-[#FFFFFF] font-black uppercase hover:text-[#B3B3B3] transition-colors">
            {title}
          </h2>
          {subtitle && (
            <span className="text-xs text-[#B3B3B3] font-normal hidden sm:inline">
              {subtitle}
            </span>
          )}
          {onEditSection && (
            <button
              onClick={onEditSection}
              className="p-1 rounded hover:bg-[#181818] text-[#808080] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title="Edit row title & subtitle"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
            </button>
          )}
        </div>
        <span className="text-xs text-[#808080] font-semibold tracking-wider uppercase">
          {items.length} {items.length === 1 ? 'Title' : 'Titles'}
        </span>
      </div>

      {/* Relative Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-[#000000]/80 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-7 h-7 stroke-[2.5] text-[#FFFFFF]" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 -mx-1"
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

        {/* Right Arrow Button */}
        {showRightArrow && items.length > 2 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-[#000000]/80 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-7 h-7 stroke-[2.5] text-[#FFFFFF]" />
          </button>
        )}
      </div>
    </div>
  );
};
