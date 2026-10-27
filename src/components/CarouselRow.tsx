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
    <div className="relative group/row my-5 sm:my-7 lg:my-8">
      {/* Netflix Row Header */}
      <div className="flex items-baseline justify-between mb-3 px-4 sm:px-6 lg:px-[4%]">
        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          {title}
        </h2>
        <span className="text-xs text-neutral-400 font-medium">
          Explore All ›
        </span>
      </div>

      {/* Relative Carousel Container with Edge Fades */}
      <div className="relative">
        {/* Left Arrow Button (Desktop hover pad with gradient blur) */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-gradient-to-r from-[#000000]/95 via-[#000000]/70 to-transparent text-[#FFFFFF] hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105"
            aria-label="Scroll left"
          >
            <div className="w-9 h-9 rounded-full bg-[#141414]/80 border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-[#E50914] hover:border-transparent transition-colors">
              <div className="w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </div>
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 px-4 sm:px-6 lg:px-[4%]"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={isPortrait ? 'relative flex items-center shrink-0 group/top-ten' : 'contents'}
            >
              {isPortrait && (
                <span
                  className="font-bebas text-[120px] leading-none font-black text-transparent select-none -mr-6 transition-colors duration-200 group-hover/top-ten:[-webkit-text-stroke:3px_#fff]"
                  style={{ WebkitTextStroke: '3px #595959' }}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              )}
              <MovieCard
                memory={item}
                rankNumber={undefined}
                isPortrait={isPortrait}
                onPlay={onPlay}
                onOpenInfo={onOpenInfo}
                onToggleWatchlist={onToggleWatchlist}
                onToggleFavorite={onToggleFavorite}
                onUnlockVault={onUnlockVault}
                onEditMemory={onEditMemory}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button (Desktop hover pad with gradient blur) */}
        {showRightArrow && items.length > 2 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-gradient-to-l from-[#000000]/95 via-[#000000]/70 to-transparent text-[#FFFFFF] hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105"
            aria-label="Scroll right"
          >
            <div className="w-9 h-9 rounded-full bg-[#141414]/80 border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-[#E50914] hover:border-transparent transition-colors">
              <div className="w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
