import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Heart,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Maximize2,
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
  getMemoryImageUrl,
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxFit, setLightboxFit] = useState<'contain' | 'cover'>('contain');

  const isVideo = memory ? hasValidVideo(memory) : false;
  const isLetter = memory ? isLetterItem(memory) : false;
  const photoEntries = memory ? getPhotoEntries(memory) : [];
  // Additional photos beyond the main backdrop/poster image
  const primaryImageUrl = memory ? getMemoryImageUrl(memory, 'landscape') : undefined;
  const additionalPhotos = photoEntries.filter(
    (p): p is typeof p & { url: string } => Boolean(p.url && p.url !== primaryImageUrl)
  );

  const allPhotos = useMemo(() => {
    const list: Array<{ url: string; caption?: string; title?: string }> = [];
    if (primaryImageUrl) {
      list.push({ url: primaryImageUrl, title: memory?.title, caption: memory?.subtitle || 'Main Artwork' });
    }
    additionalPhotos.forEach((p, idx) => {
      list.push({ url: p.url, caption: p.caption || `Photo ${idx + 1}`, title: memory?.title });
    });
    return list;
  }, [primaryImageUrl, additionalPhotos, memory?.title, memory?.subtitle]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null && prev < allPhotos.length - 1 ? prev + 1 : 0));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allPhotos.length - 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allPhotos.length]);

  if (!memory) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-[#000000]/90 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Netflix Modal Card */}
      <div
        className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-xl overflow-hidden netflix-modal-shadow border border-white/10 my-auto text-[#FFFFFF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#141414]/90 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center transition-all cursor-pointer border border-white/20 min-h-[40px] min-w-[40px] shadow-xl hover:scale-105"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Direct, Full-Clarity Image Display at Top */}
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-black">
          <VisualArt
            id={memory.id}
            category={memory.category}
            title={memory.title}
            imageUrl={primaryImageUrl}
            variant="landscape"
            focalPosition="top"
            fit="auto"
            fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
            className="w-full h-full cursor-pointer"
            onClick={() => primaryImageUrl && setLightboxIndex(0)}
          />

          {/* Full-view Zoom Button */}
          {primaryImageUrl && (
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 px-3 py-1.5 rounded-full bg-[#000000]/75 hover:bg-[#E50914] text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-[#808080]/40 min-h-[38px] text-xs font-semibold shadow-lg backdrop-blur-sm"
              title="View full-size photo in original proportions"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">View Full Photo</span>
            </button>
          )}

          {/* Gradient covering lower half on desktop, 70% on mobile */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 sm:h-1/2 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent z-10" />

          {/* Floating Title & Actions on Bottom Edge */}
          <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 z-20 flex items-end justify-between gap-4">
            <div className="space-y-1.5 sm:space-y-2.5 max-w-2xl w-full">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
                {memory.title}
              </h2>
              {memory.subtitle && (
                <p className="text-xs sm:text-sm text-[#B3B3B3] font-medium drop-shadow line-clamp-1 sm:line-clamp-2">
                  {memory.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                {/* Show Play Video ONLY when a genuine video source exists */}
                {isVideo && (
                  <button
                    onClick={() => onPlay(memory)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-white/80 text-black font-semibold text-xs sm:text-sm rounded shadow transition-transform active:scale-95 cursor-pointer min-h-[44px]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Video</span>
                  </button>
                )}

                {/* Read Letter Action for Letters & Secret Vault items */}
                {isLetter && onUnlockVault && (
                  <button
                    onClick={() => onUnlockVault(memory)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-white/80 text-black text-xs sm:text-sm font-semibold rounded shadow transition-colors active:scale-95 cursor-pointer min-h-[44px]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{memory.isSecret ? 'Read Confidential Letter' : 'Read Letter'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Admin edit controls remain in the metadata panel below. */}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-[#181818]">
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

              <p className="text-xs sm:text-sm text-[#FFFFFF] leading-relaxed break-words">
                {memory.synopsis}
              </p>

              <div className="pt-2 border-t border-[#141414]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#808080] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Full Story & Memory Details</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed whitespace-pre-line font-light break-words">
                  {memory.fullStory}
                </p>
              </div>

              {/* Readable Letter View if unlocked / non-secret letter content exists */}
              {!memory.isSecret && memory.letterContent && (
                <div className="mt-4 p-4 sm:p-6 rounded bg-[#141414] border border-[#808080]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E50914]">
                    <Mail className="w-4 h-4" />
                    <span>Personal Love Note</span>
                  </div>
                  <div className="font-serif-italic text-sm sm:text-base text-[#FFFFFF] leading-relaxed whitespace-pre-line break-words">
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
                {additionalPhotos.map((photo, idx) => {
                  const targetIndex = primaryImageUrl ? idx + 1 : idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(targetIndex)}
                      className="group bg-[#141414] rounded overflow-hidden border border-[#808080]/20 hover:border-[#808080]/60 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-[#000000] overflow-hidden">
                        <VisualArt
                          id={`${memory.id}-photo-${idx}`}
                          category={memory.category}
                          title={photo.caption || 'Memory Photo'}
                          imageUrl={photo.url}
                          variant="episode"
                          focalPosition="top"
                          fit="auto"
                          fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#000000]/80 text-[#FFFFFF] text-xs font-semibold border border-white/20 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5 text-[#E50914]" />
                            <span>View Full Size</span>
                          </span>
                        </div>
                      </div>
                      {photo.caption && (
                        <div className="p-3">
                          <p className="text-xs text-[#B3B3B3] line-clamp-2">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                              variant="episode"
                              focalPosition="top"
                              fit="auto"
                              fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                              className="w-full h-full"
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
                        imageUrl={item.posterUrl || item.backdropUrl}
                        fit="auto"
                        fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                        className="w-full h-full"
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

      {/* FULL PHOTO LIGHTBOX / VIEWER — Preserves Intrinsic Aspect Ratio */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-[#000000]/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size photo viewer"
        >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between gap-3 text-white z-10 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 pr-2">
              <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide truncate">
                {allPhotos[lightboxIndex].title || memory.title}
              </h3>
              {allPhotos[lightboxIndex].caption && (
                <p className="text-xs text-[#B3B3B3] truncate">
                  {allPhotos[lightboxIndex].caption}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#808080] font-mono px-2.5 py-1 bg-white/5 rounded border border-white/10">
                {lightboxIndex + 1} / {allPhotos.length}
              </span>

              {/* Fit mode toggle: Contain (fit whole image without crop) vs Cover (fill viewport) */}
              <button
                type="button"
                onClick={() => setLightboxFit((f) => (f === 'contain' ? 'cover' : 'contain'))}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer"
                title={lightboxFit === 'contain' ? 'Switch to Fill View' : 'Switch to Fit View (Uncropped)'}
              >
                <span>{lightboxFit === 'contain' ? 'Fit Screen (100% visible)' : 'Fill Screen'}</span>
              </button>

              {/* Close Lightbox */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-11 h-11 rounded-full bg-[#141414] hover:bg-[#E50914] text-white flex items-center justify-center transition-colors border border-white/20 min-h-[44px] min-w-[44px] cursor-pointer shadow-lg"
                aria-label="Close photo viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Full-Res Image Viewer */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allPhotos[lightboxIndex].url}
              alt={allPhotos[lightboxIndex].caption || memory.title}
              className={`max-h-[82vh] max-w-[94vw] rounded-md transition-all duration-300 ${
                lightboxFit === 'contain'
                  ? 'object-contain max-h-[82vh] max-w-[94vw]'
                  : 'object-cover w-full h-full'
              }`}
              style={{ margin: 'auto' }}
            />

            {/* Prev button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allPhotos.length - 1));
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#000000]/75 hover:bg-[#E50914] text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer min-h-[44px] min-w-[44px] shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Next button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev < allPhotos.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#000000]/75 hover:bg-[#E50914] text-white flex items-center justify-center border border-white/25 transition-all cursor-pointer min-h-[44px] min-w-[44px] shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Captions */}
          <div className="text-center text-xs text-[#808080] py-1" onClick={(e) => e.stopPropagation()}>
            Use keyboard arrow keys &larr; &rarr; to browse photos &middot; Press Esc to close
          </div>
        </div>
      )}
    </div>
  );
};

