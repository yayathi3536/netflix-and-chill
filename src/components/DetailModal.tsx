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
  Sparkles,
  ChevronRight,
  Upload,
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
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/80 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Backdrop */}
        <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-neutral-900">
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={memory.backdropUrl}
            fallbackGradient={memory.fallbackGradient}
            className="w-full h-full object-cover scale-105"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent" />

          {/* Floating Actions on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-3 max-w-lg">
              <h2 className="font-bebas text-3xl sm:text-5xl text-white font-black tracking-wide leading-none drop-shadow-md">
                {memory.title}
              </h2>
              {memory.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                  {memory.subtitle}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onPlay(memory)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-sm rounded-md shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Relive Moment</span>
                </button>

                <button
                  onClick={() => onToggleWatchlist(memory.id)}
                  className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/30 text-white transition-colors active:scale-90"
                  title={memory.isInWatchlist ? 'Remove from list' : 'Add to list'}
                >
                  {memory.isInWatchlist ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>

                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(memory.id)}
                    className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/30 text-white transition-colors active:scale-90"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        memory.isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-white'
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
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-md border border-white/20 transition-colors cursor-pointer active:scale-95"
                    title="Edit memory & photo"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Edit</span>
                  </button>
                )}

                {memory.isSecret && onUnlockVault && (
                  <button
                    onClick={() => onUnlockVault(memory)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold rounded-md shadow transition-colors active:scale-95"
                  >
                    <span>Read Secret Letter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/20 text-white transition-colors hidden sm:block"
              title="Toggle audio preview"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          {/* Main Info Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Story & Synopsis */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-300 font-medium">
                <span className="text-emerald-400 font-bold">{memory.matchScore}% Match</span>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span>{memory.year}</span>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span>{memory.duration}</span>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span className="border border-white/30 px-1 py-0.2 rounded text-[10px]">
                  Ultra HD
                </span>
              </div>

              <p className="text-sm text-neutral-200 leading-relaxed">
                {memory.synopsis}
              </p>

              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-1">
                  The Full Memory Story
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-light">
                  {memory.fullStory}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Metadata & Cast */}
            <div className="space-y-3 text-xs bg-white/5 p-4 rounded-lg border border-white/5">
              <div>
                <span className="text-neutral-400">Starring: </span>
                <span className="text-white font-medium">You & Me (Soulmates)</span>
              </div>
              <div>
                <span className="text-neutral-400">Category: </span>
                <span className="text-white capitalize">{memory.category.replace('-', ' ')}</span>
              </div>
              {memory.location && (
                <div className="flex items-center gap-1 text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-[#ff4d5a] shrink-0" />
                  <span>{memory.location}</span>
                </div>
              )}
              {memory.date && (
                <div className="flex items-center gap-1 text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{memory.date}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-neutral-400 block mb-1.5">Mood & Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-white/10 text-neutral-200 px-2 py-0.5 rounded"
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
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-bebas text-xl tracking-wide text-white font-bold">
                  Episodes & Chapters
                </h3>
                <span className="text-xs text-neutral-400">
                  {memory.episodes.length} Episodes
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {memory.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => onPlay(memory, ep)}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group"
                  >
                    <span className="font-bebas text-xl text-neutral-500 w-6 group-hover:text-white transition-colors">
                      {ep.episodeNumber}
                    </span>

                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-36 aspect-video shrink-0 rounded bg-neutral-800 overflow-hidden">
                      <div
                        className={`w-full h-full bg-gradient-to-br ${ep.gradient} flex items-center justify-center`}
                      >
                        <Play className="w-5 h-5 text-white/80 group-hover:scale-125 transition-transform" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#ff4d5a] transition-colors">
                          {ep.title}
                        </h4>
                        <span className="text-xs text-neutral-400">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
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
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="font-bebas text-xl tracking-wide text-white font-bold">
                More Memories Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedMemories.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated && onSelectRelated(item)}
                    className="bg-[#202020] rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-white/5 hover:border-white/20"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <VisualArt
                        id={item.id}
                        category={item.category}
                        title={item.title}
                        fallbackGradient={item.fallbackGradient}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <h5 className="font-semibold text-xs text-white truncate">
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        {item.matchScore}% Match
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
