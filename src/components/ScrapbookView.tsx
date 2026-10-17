import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  X,
  Play,
  Film,
  Camera,
  Check,
  Plus,
  Heart,
} from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';

interface ScrapbookViewProps {
  memories: MemoryItem[];
  onPlayMemory: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenAddModal: () => void;
}

export const ScrapbookView: React.FC<ScrapbookViewProps> = ({
  memories,
  onPlayMemory,
  onOpenInfo,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenAddModal,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [lightboxMemory, setLightboxMemory] = useState<MemoryItem | null>(null);

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

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141414] rounded border border-[#808080]/30 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Stills' },
            { id: 'milestones', label: 'Milestones' },
            { id: 'dates', label: 'Locations & Dates' },
            { id: 'favorites', label: 'Favorites' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tab.id
                  ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-[#181818]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cinematic Stills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
        {filteredMemories.map((mem) => {
          return (
            <div
              key={mem.id}
              onClick={() => setLightboxMemory(mem)}
              className="group relative bg-[#141414] text-[#FFFFFF] rounded overflow-hidden shadow-xl border border-[#181818] hover:border-[#808080]/60 transition-all duration-300 hover:scale-[1.03] hover:z-20 cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#000000]">
                <VisualArt
                  id={mem.id}
                  category={mem.category}
                  title={mem.title}
                  imageUrl={mem.posterUrl || mem.backdropUrl}
                  fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Badge */}
                <div className="absolute top-2 left-2 z-20">
                  <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center font-bebas text-xs font-black text-[#FFFFFF] shadow">
                    N
                  </span>
                </div>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 bg-[#000000]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                  <div className="w-10 h-10 rounded-full bg-[#E50914] text-[#FFFFFF] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-3.5 space-y-1.5 bg-[#141414]">
                <div className="flex items-center justify-between text-[11px] text-[#808080]">
                  <span>{mem.date || 'Forever'}</span>
                  {mem.location && (
                    <span className="flex items-center gap-1 text-[#B3B3B3] truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 text-[#E50914]" />
                      <span className="truncate">{mem.location}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bebas text-lg text-[#FFFFFF] font-bold uppercase tracking-wide truncate group-hover:text-[#FFFFFF] transition-colors">
                  {mem.title}
                </h3>

                <p className="text-xs text-[#B3B3B3] line-clamp-2 leading-relaxed">
                  {mem.synopsis}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxMemory && (
        <div
          className="fixed inset-0 z-50 bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxMemory(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#141414] border border-[#181818] rounded overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxMemory(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-[#000000]/80 text-[#FFFFFF] hover:bg-[#000000] flex items-center justify-center border border-[#808080]/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Lightbox Media */}
            <div className="relative w-full md:w-3/5 aspect-4/3 md:aspect-auto bg-[#000000] overflow-hidden">
              <VisualArt
                id={lightboxMemory.id}
                category={lightboxMemory.category}
                title={lightboxMemory.title}
                imageUrl={lightboxMemory.posterUrl || lightboxMemory.backdropUrl}
                fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Lightbox Details Panel */}
            <div className="w-full md:w-2/5 p-6 flex flex-col justify-between space-y-4 bg-[#141414]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold tracking-wider uppercase">
                  <span>PRODUCTION STILL</span>
                </div>
                <h2 className="font-bebas text-2xl text-[#FFFFFF] font-black uppercase tracking-wide">
                  {lightboxMemory.title}
                </h2>
                {lightboxMemory.subtitle && (
                  <p className="text-xs text-[#B3B3B3]">
                    {lightboxMemory.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-[#808080]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lightboxMemory.date || 'Archived'}</span>
                  {lightboxMemory.location && (
                    <>
                      <span>·</span>
                      <span className="text-[#B3B3B3]">{lightboxMemory.location}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-[#B3B3B3] leading-relaxed pt-2 border-t border-[#181818]">
                  {lightboxMemory.fullStory || lightboxMemory.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#181818]">
                <button
                  onClick={() => {
                    const target = lightboxMemory;
                    setLightboxMemory(null);
                    onPlayMemory(target);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-xs rounded transition-transform active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Play Still</span>
                </button>

                <button
                  onClick={() => {
                    const target = lightboxMemory;
                    setLightboxMemory(null);
                    onOpenInfo(target);
                  }}
                  className="px-4 py-2.5 bg-[#181818] hover:bg-white/10 border border-[#808080]/30 text-[#FFFFFF] font-semibold text-xs rounded transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
