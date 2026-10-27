import React, { useState } from 'react';
import { Film, Star, ChevronRight } from 'lucide-react';
import { MemoryItem } from '../types';

interface ConstellationSectionProps {
  milestones: MemoryItem[];
  onSelectMilestone: (memory: MemoryItem) => void;
}

export const ConstellationSection: React.FC<ConstellationSectionProps> = ({
  milestones,
  onSelectMilestone,
}) => {
  const [activeStar, setActiveStar] = useState<number>(0);

  // Take up to 5 milestone points
  const points = milestones.slice(0, 5);
  const current = points[activeStar] || points[0];

  return (
    <div className="relative my-8 sm:my-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#808080] font-bold uppercase tracking-widest">
          <Film className="w-3.5 h-3.5" />
          <span>ORIGINAL INTERACTIVE TIMELINE</span>
        </div>
        <h2 className="font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-black tracking-wider uppercase">
          Timeline of Our Universe
        </h2>
        <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-xl mx-auto font-normal px-2">
          Every chapter connected across time — explore the milestone pathway that built our story.
        </p>
      </div>

      {/* Interactive Constellation Map Canvas */}
      <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-3.5 sm:p-8 md:p-10 netflix-card-shadow">
        {/* SVG Connectors */}
        <div className="relative w-full h-40 sm:h-56">
          <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
            {/* Base line connections */}
            <polyline
              points="80,140 240,60 400,160 560,70 720,130"
              fill="none"
              stroke="#808080"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Active red path */}
            <line
              x1={80 + activeStar * 160}
              y1={activeStar === 1 || activeStar === 3 ? 65 : activeStar === 2 ? 160 : 135}
              x2={80 + Math.min(4, activeStar + 1) * 160}
              y2={activeStar === 0 || activeStar === 2 ? 65 : 130}
              stroke="#808080"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Interactive Nodes */}
          <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-10 md:px-16 pointer-events-none">
            {points.map((pt, idx) => {
              const isActive = activeStar === idx;
              return (
                <div
                  key={pt.id || idx}
                  onClick={() => setActiveStar(idx)}
                  className={`relative pointer-events-auto cursor-pointer transition-all duration-300 flex flex-col items-center group min-h-[44px] justify-center ${
                    idx === 1 || idx === 3 ? '-translate-y-7 sm:-translate-y-12' : 'translate-y-3 sm:translate-y-8'
                  }`}
                >
                  {/* Node icon */}
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#808080] text-[#FFFFFF] shadow-lg scale-110'
                        : 'bg-[#181818] border border-[#808080]/30 group-hover:border-[#808080] text-[#B3B3B3] group-hover:text-[#FFFFFF]'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isActive ? 'text-[#FFFFFF] fill-white' : 'text-[#808080] group-hover:text-[#FFFFFF]'
                      }`}
                    />
                  </div>

                  {/* Title Label */}
                  <span
                    className={`text-[9px] sm:text-xs font-bold mt-1.5 whitespace-nowrap transition-colors max-w-[58px] sm:max-w-[120px] truncate text-center uppercase tracking-wide ${
                      isActive ? 'text-[#FFFFFF] font-bold' : 'text-[#808080] group-hover:text-[#FFFFFF]'
                    }`}
                  >
                    {pt.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Details Card */}
        {current && (
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#181818] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="space-y-1 text-left w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs text-[#808080] font-bold uppercase tracking-wider">
                <span>Chapter #{activeStar + 1}</span>
                <span className="text-[#808080]">·</span>
                <span className="text-[#B3B3B3]">{current.date || current.year}</span>
              </div>
              <h3 className="font-bebas text-xl sm:text-2xl text-[#FFFFFF] font-bold uppercase tracking-wide">
                {current.title}
              </h3>
              <p className="text-xs text-[#B3B3B3] max-w-xl line-clamp-2">
                {current.synopsis}
              </p>
            </div>

            <button
              onClick={() => onSelectMilestone(current)}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded bg-white hover:bg-white/80 text-black font-semibold text-xs shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 uppercase tracking-wider flex items-center gap-1.5 min-h-[44px]"
            >
              <span>View Chapter Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
