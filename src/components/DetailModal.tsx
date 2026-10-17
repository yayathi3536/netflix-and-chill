import React, { useState } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Heart,
  Calendar,
  MapPin,
  ChevronRight,
  Edit3,
  BookOpen,
  Mail,
  UploadCloud,
} from 'lucide-react';
import { MemoryItem, Episode } from '../types';
import { VisualArt } from './VisualArt';
import { User } from '@supabase/supabase-js';
import {
  hasValidVideo,
  isLetterItem,
  getPhotoEntries,
} from '../utils/mediaHelpers';

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
  const [expandedEpisodeId, setExpandedEpisodeId] = useState<string | null>(null);

  if (!memory) return null;

  const isVideo = hasValidVideo(memory);
  const isLetter = isLetterItem(memory);
  const photoEntries = getPhotoEntries(memory);
  // Additional photos beyond the main backdrop/poster image
  const primaryImageUrl = memory.backdropUrl || memory.posterUrl;
  const additionalPhotos = photoEntries.filter((p) => p.url && p.url !== primaryImageUrl);

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

        {/* Direct, Full-Clarity Image Display at Top (No View Photo prompt needed) */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#000000]">
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={primaryImageUrl}
            fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
            className="w-full h-full object-cover"
          />

          {/* Subtle bottom gradient only at the very bottom edge for title legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent" />

          {/* Floating Title & Actions on Bottom Edge */}
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
            <div className="space-y-2.5 max-w-2xl">
              <h2 className="font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-black tracking-wider leading-none drop-shadow-lg uppercase">
                {memory.title}
              </h2>
              {memory.subtitle && (
                <p className="text-xs sm:text-sm text-[#B3B3B3] font-medium drop-shadow">
                  {memory.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Show Play Video ONLY when a genuine video source exists */}
                {isVideo && (
                  <button
                    onClick={() => onPlay(memory)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-sm rounded shadow transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Video</span>
                  </button>
                )}

                {/* Read Letter Action for Letters & Secret Vault items */}
                {isLetter && onUnlockVault && (
                  <button
                    onClick={() => onUnlockVault(memory)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] text-sm font-bold rounded shadow transition-colors active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{memory.isSecret ? 'Read Confidential Letter' : 'Read Letter'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* My List Button */}
                <button
                  onClick={() => onToggleWatchlist(memory.id)}
                  className="p-2.5 rounded-full bg-[#141414]/90 hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] transition-colors active:scale-90 cursor-pointer"
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
                    className="p-2.5 rounded-full bg-[#141414]/90 hover:bg-white/10 border border-[#808080]/40 text-[#FFFFFF] transition-colors active:scale-90 cursor-pointer"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        memory.isFavorite ? 'text-[#E50914] fill-[#E50914]' : 'text-[#FFFFFF]'
                      }`}
                    />
                  </button>
                )}

                {/* STRICTLY ADMIN-ONLY: Change / Upload Image & Edit Details */}
                {currentUser && onEditMemory && (
                  <button
                    onClick={() => {
                      onEditMemory(memory);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] text-xs font-bold rounded shadow transition-colors cursor-pointer active:scale-95"
                    title="Admin only: Change or upload image & edit details"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#FFFFFF]" />
                    <span>Change / Upload Image</span>
                  </button>
                )}
              </div>
            </div>
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
                <span>{memory.duration || 'Memory'}</span>
                <span aria-hidden="true" className="text-[#808080]">·</span>
                <span className="border border-[#808080]/50 px-1.5 py-0.5 rounded text-[10px] text-[#FFFFFF] uppercase">
                  {isVideo ? 'Video' : isLetter ? 'Letter' : 'Memory'}
                </span>
              </div>

              <p className="text-sm text-[#FFFFFF] leading-relaxed">
                {memory.synopsis}
              </p>

              <div className="pt-2 border-t border-[#141414]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#808080] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Full Story & Memory Details</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed whitespace-pre-line font-light">
                  {memory.fullStory}
                </p>
              </div>

              {/* Readable Letter View if unlocked / non-secret letter content exists */}
              {!memory.isSecret && memory.letterContent && (
                <div className="mt-4 p-5 sm:p-6 rounded bg-[#141414] border border-[#808080]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914]">
                    <Mail className="w-4 h-4" />
                    <span>Personal Love Note</span>
                  </div>
                  <div className="font-serif-italic text-sm sm:text-base text-[#FFFFFF] leading-relaxed whitespace-pre-line">
                    {memory.letterContent}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Metadata & Location */}
            <div className="space-y-3 text-xs bg-[#141414] p-4 rounded border border-[#808080]/20 h-fit">
              <div>
                <span className="text-[#808080]">Collection: </span>
                <span className="text-[#FFFFFF] font-medium">Our Universe Originals</span>
              </div>
              <div>
                <span className="text-[#808080]">Category: </span>
                <span className="text-[#FFFFFF] capitalize">{memory.category.replace('-', ' ')}</span>
              </div>
              {memory.location && (
                <div className="flex items-center gap-1.5 text-[#B3B3B3]">
                  <MapPin className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                  <span>{memory.location}</span>
                </div>
              )}
              {memory.date && (
                <div className="flex items-center gap-1.5 text-[#B3B3B3]">
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

              {currentUser && onEditMemory && (
                <div className="pt-3 border-t border-[#181818]">
                  <button
                    onClick={() => {
                      onEditMemory(memory);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#181818] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold rounded border border-[#808080]/40 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Edit Memory & Media</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Photos Shown Directly in Full Clarity (No click-to-open required) */}
          {!isLetter && additionalPhotos.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#141414]">
              <h3 className="font-bebas text-2xl tracking-wider text-[#FFFFFF] font-black uppercase">
                Memory Photos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {additionalPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bg-[#141414] rounded overflow-hidden border border-[#808080]/20"
                  >
                    <div className="relative aspect-video bg-[#000000] overflow-hidden">
                      <VisualArt
                        id={`${memory.id}-photo-${idx}`}
                        category={memory.category}
                        title={photo.caption}
                        imageUrl={photo.url}
                        fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {photo.caption && (
                      <div className="p-3">
                        <p className="text-xs text-[#B3B3B3]">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapters / Episodes List (if available) */}
          {memory.episodes && memory.episodes.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#141414]">
              <div className="flex items-center justify-between">
                <h3 className="font-bebas text-2xl tracking-wider text-[#FFFFFF] font-black uppercase">
                  Story Chapters & Episodes
                </h3>
                <span className="text-xs text-[#808080]">
                  {memory.episodes.length} {memory.episodes.length === 1 ? 'Chapter' : 'Chapters'}
                </span>
              </div>

              <div className="divide-y divide-[#141414]">
                {memory.episodes.map((ep) => {
                  const epIsVideo = hasValidVideo(memory, ep);
                  const isExpanded = expandedEpisodeId === ep.id;

                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        if (epIsVideo) {
                          onPlay(memory, ep);
                        } else {
                          setExpandedEpisodeId(isExpanded ? null : ep.id);
                        }
                      }}
                      className={`py-4 flex flex-col gap-3 hover:bg-[#141414] p-3 rounded transition-colors cursor-pointer group ${
                        isExpanded ? 'bg-[#141414] border border-[#808080]/30' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <span className="font-bebas text-2xl text-[#808080] w-6 group-hover:text-[#FFFFFF] transition-colors">
                          {ep.episodeNumber}
                        </span>

                        {/* Thumbnail */}
                        <div className="relative w-full sm:w-36 aspect-video shrink-0 rounded bg-[#000000] overflow-hidden border border-[#808080]/20">
                          {ep.thumbnailUrl ? (
                            <VisualArt
                              id={ep.id}
                              category={memory.category}
                              title={ep.title}
                              imageUrl={ep.thumbnailUrl}
                              fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#141414] flex items-center justify-center">
                              {epIsVideo ? (
                                <Play className="w-5 h-5 text-[#FFFFFF] group-hover:text-[#E50914] group-hover:scale-125 transition-all" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-[#B3B3B3] group-hover:text-[#E50914] group-hover:scale-110 transition-all" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-[#FFFFFF] group-hover:text-[#E50914] transition-colors">
                              {ep.title}
                            </h4>
                            <span className="text-xs text-[#808080] shrink-0">
                              {ep.date ? `${ep.date} · ` : ''}{ep.duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#B3B3B3] leading-relaxed">
                            {ep.description}
                          </p>
                          {epIsVideo && (
                            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#E50914] font-semibold">
                              <Play className="w-3 h-3 fill-[#E50914]" />
                              <span>Play Episode Video</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                        imageUrl={item.backdropUrl || item.posterUrl}
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

