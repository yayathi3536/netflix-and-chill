import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Play,
  Film,
  Edit3,
  UploadCloud,
} from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { hasValidVideo } from '../utils/mediaHelpers';

interface ScrapbookViewProps {
  memories: MemoryItem[];
  onPlayMemory: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenAddModal?: () => void;
  isAdmin?: boolean;
  onEditMemory?: (memory: MemoryItem) => void;
}

export const ScrapbookView: React.FC<ScrapbookViewProps> = ({
  memories,
  onPlayMemory,
  onOpenInfo,
  onOpenAddModal,
  isAdmin = false,
  onEditMemory,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (m.isSecret) return false;
    if (selectedTag === 'all') return true;
    if (selectedTag === 'favorites') return m.isFavorite;
    if (selectedTag === 'dates') return m.category === 'places-list' || m.location;
    if (selectedTag === 'milestones') return m.category === 'our-story';
    return m.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 bg-[#000000]">
      {/* Netflix Archive Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#181818] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold tracking-widest uppercase mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>ORIGINAL GALLERY & ARCHIVE</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
            Memories & Stills Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
            Cinematic production stills, milestone snapshots, and authentic behind-the-scenes moments from our universe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin-Only Upload Photo Button */}
          {isAdmin && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-white hover:bg-white/80 text-black text-xs font-semibold shadow transition-all cursor-pointer uppercase tracking-wider"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Photo / Memory</span>
            </button>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#141414] rounded-lg border border-white/10 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Stills' },
              { id: 'milestones', label: 'Milestones' },
              { id: 'dates', label: 'Locations & Dates' },
              { id: 'favorites', label: 'Favorites' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  selectedTag === tab.id
                    ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow-md'
                    : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Full-Clarity Stills Grid (Images shown directly without asking to open) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 pt-2">
        {filteredMemories.map((mem) => {
          const isVideo = hasValidVideo(mem);

          return (
            <div
              key={mem.id}
              onClick={() => onOpenInfo(mem)}
              className="group relative bg-[#141414] text-[#FFFFFF] rounded-xl overflow-hidden shadow-lg shadow-black/30 border border-white/10 hover:border-[#E50914]/60 hover:shadow-xl hover:shadow-[#E50914]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
            >
              {/* Photo Area — Shown Directly with Full Photo Visibility */}
              <div className="relative isolate shrink-0 aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-[#080808]">
                <VisualArt
                  id={mem.id}
                  category={mem.category}
                  title={mem.title}
                  imageUrl={mem.posterUrl || mem.backdropUrl}
                  focalPosition="top"
                  fit="cover"
                  fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                  className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />

                {/* Top Badge & Admin-Only Image Upload/Change Control */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20">
                  <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center font-bebas text-xs font-black text-[#FFFFFF] shadow">
                    N
                  </span>

                  {isAdmin && onEditMemory && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMemory(mem);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#000000]/85 hover:bg-[#E50914] border border-[#808080]/40 text-[#FFFFFF] text-[11px] font-semibold transition-colors cursor-pointer shadow"
                      title="Admin only: Change or upload image"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Change Image</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Caption, Date, Location & Story */}
              <div className="relative z-10 min-w-0 p-4 sm:p-5 space-y-2 bg-gradient-to-b from-[#171717] to-[#101010] flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#808080]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{mem.date || 'Forever'}</span>
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 text-[#B3B3B3] truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 text-[#E50914]" />
                        <span className="truncate">{mem.location}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="min-w-0 break-words font-bebas text-xl text-[#FFFFFF] font-bold uppercase tracking-wide">
                    {mem.title}
                  </h3>

                  <p className="min-w-0 break-words whitespace-pre-wrap text-xs text-[#B3B3B3] leading-relaxed">
                    {mem.synopsis}
                  </p>
                </div>

                {isVideo && (
                  <div className="pt-3 border-t border-[#181818]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMemory(mem);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-white/80 text-black font-semibold text-xs rounded transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play Video</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

