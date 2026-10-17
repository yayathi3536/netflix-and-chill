import React, { useState } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Heart,
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { MemoryItem, Episode } from '../types';
import { VisualArt } from './VisualArt';
import { User } from '@supabase/supabase-js';

interface DetailModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onPlay: (memory: MemoryItem, episode?: Episode) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onUnlockVault?: (memory: MemoryItem) => void;
  relatedMemories?: MemoryItem[];
  onSelectRelated?: (memory: MemoryItem) => void;
  currentUser?: User | null;
  onEditMemory?: (memory: MemoryItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  memory,
  onClose,
  onPlay,
  onToggleWatchlist,
  onToggleFavorite,
  onUnlockVault,
  relatedMemories = [],
  onSelectRelated,
  currentUser,
  onEditMemory,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-[#000000]/85 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Netflix Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-lg overflow-hidden shadow-2xl border border-[#808080]/30 my-auto text-[#FFFFFF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-[#141414]/90 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer border border-[#808080]/40"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Backdrop */}
        <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-[#000000]">
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={memory.backdropUrl}
            fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
            className="w-full h-full object-cover scale-105"
          />

          {/* Pure Black Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/90 via-transparent to-transparent" />

          {/* Floating Actions on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-3 max-w-lg">
              <h2 className="font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-black tracking-wider leading-none drop-shadow-md uppercase">
                {memory.title}
              </h2>
              {memory.subtitle && (
                <p className="text-xs sm:text-sm text-[#B3B3B3] font-medium">
                  {memory.subtitle}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                {/* Red Play Button */}
                <button
                  onClick={() => onPlay(memory)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-sm rounded shadow transition-transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play</span>
                </button>

                {/* My List Button */}
                <button
                  onClick={() => onToggleWatchlist(memory.id)}
                  className="p-2.5 rounded-full bg-[#141414] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] transition-colors active:scale-90 cursor-pointer"
                  title={memory.isInWatchlist ? 'Remove from My List' : 'Add to My List'}
                >
                  {memory.isInWatchlist ? (
                    <Check className="w-4 h-4 text-[#E50914] stroke-[2.5]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5] text-[#FFFFFF]" />
                  )}
                </button>

                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(memory.id)}
                    className="p-2.5 rounded-full bg-[#141414] hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] transition-colors active:scale-90 cursor-pointer"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        memory.isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-[#FFFFFF]'
                      }`}
                    />
                  </button>
                )}

                {currentUser && onEditMemory && (
                  <button
                    onClick={() => {
                      onEditMemory(memory);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#141414] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold rounded border border-[#808080]/40 transition-colors cursor-pointer active:scale-95"
                    title="Edit title"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Edit</span>
                  </button>
                )}

                {memory.isSecret && onUnlockVault && (
                  <button
                    onClick={() => onUnlockVault(memory)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] text-xs font-bold rounded shadow transition-colors active:scale-95 cursor-pointer"
                  >
                    <span>Read Confidential Note</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-[#141414]/90 hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] transition-colors hidden sm:block"
              title="Toggle audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 bg-[#181818]">
          {/* Main Info Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Story & Synopsis */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#B3B3B3] font-medium">
                <span className="text-[#FFFFFF] font-bold">{memory.matchScore || 98}% Match</span>
                <span aria-hidden="true" className="text-[#808080]">·</span>
                <span>{memory.year || '2024'}</span>
                <span aria-hidden="true" className="text-[#808080]">·</span>
                <span>{memory.duration || 'Feature'}</span>
                <span aria-hidden="true" className="text-[#808080]">·</span>
                <span className="border border-[#808080]/50 px-1 py-0.2 rounded text-[10px] text-[#FFFFFF]">
                  Ultra HD 4K
                </span>
              </div>

              <p className="text-sm text-[#FFFFFF] leading-relaxed">
                {memory.synopsis}
              </p>

              <div className="pt-2 border-t border-[#141414]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#808080] mb-1">
                  Full Story & Description
                </h4>
                <p className="text-xs text-[#B3B3B3] leading-relaxed whitespace-pre-line font-light">
                  {memory.fullStory}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Metadata & Cast */}
            <div className="space-y-3 text-xs bg-[#141414] p-4 rounded border border-[#808080]/20">
              <div>
                <span className="text-[#808080]">Cast: </span>
                <span className="text-[#FFFFFF] font-medium">Our Universe Originals</span>
              </div>
              <div>
                <span className="text-[#808080]">Category: </span>
                <span className="text-[#FFFFFF] capitalize">{memory.category.replace('-', ' ')}</span>
              </div>
              {memory.location && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                  <span>{memory.location}</span>
                </div>
              )}
              {memory.date && (
                <div className="flex items-center gap-1 text-[#B3B3B3]">
                  <Calendar className="w-3.5 h-3.5 text-[#808080] shrink-0" />
                  <span>{memory.date}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-[#808080] block mb-1.5 uppercase tracking-wider font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-[#181818] border border-[#808080]/30 text-[#B3B3B3] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List (if available) */}
          {memory.episodes && memory.episodes.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#141414]">
              <div className="flex items-center justify-between">
                <h3 className="font-bebas text-2xl tracking-wider text-[#FFFFFF] font-black uppercase">
                  Episodes
                </h3>
                <span className="text-xs text-[#808080]">
                  {memory.episodes.length} Episodes
                </span>
              </div>

              <div className="divide-y divide-[#141414]">
                {memory.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onPlay(memory, ep)}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-[#141414] p-2 rounded transition-colors cursor-pointer group"
                  >
                    <span className="font-bebas text-2xl text-[#808080] w-6 group-hover:text-[#FFFFFF] transition-colors">
                      {ep.episodeNumber}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-36 aspect-video shrink-0 rounded bg-[#000000] overflow-hidden border border-[#808080]/20">
                      <div className="w-full h-full bg-[#141414] flex items-center justify-center">
                        <Play className="w-5 h-5 text-[#FFFFFF] group-hover:text-[#E50914] group-hover:scale-125 transition-all" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#FFFFFF] group-hover:text-[#E50914] transition-colors">
                          {ep.title}
                        </h4>
                        <span className="text-xs text-[#808080]">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-[#B3B3B3] leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Like This (Recommendations) */}
          {relatedMemories.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#141414]">
              <h3 className="font-bebas text-2xl tracking-wider text-[#FFFFFF] font-black uppercase">
                More Titles Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedMemories.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated && onSelectRelated(item)}
                    className="bg-[#141414] rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-[#808080]/20 hover:border-[#808080]/60"
                  >
                    <div className="aspect-video relative overflow-hidden bg-[#000000]">
                      <VisualArt
                        id={item.id}
                        category={item.category}
                        title={item.title}
                        fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <h5 className="font-bold text-xs text-[#FFFFFF] truncate uppercase">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-[#B3B3B3] font-bold block mt-0.5">
                        {item.matchScore || 98}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
