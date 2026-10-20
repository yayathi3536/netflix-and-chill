import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  Info,
  Heart,
  Calendar,
  Sparkles,
  MapPin,
  Film,
  Ticket,
  Eye,
  X,
  Volume2,
} from 'lucide-react';
import {
  PrototypeMemory,
  PrototypePhoto,
  PrototypeLetter,
  PrototypeChapter,
  PrototypeSiteContent,
  PrototypeCoupon,
} from './types';

interface PreviewWebsiteTabProps {
  siteContent: PrototypeSiteContent;
  memories: PrototypeMemory[];
  photos: PrototypePhoto[];
  letters: PrototypeLetter[];
  chapters: PrototypeChapter[];
  coupons: PrototypeCoupon[];
  onReturnToDashboard: () => void;
}

export const PreviewWebsiteTab: React.FC<PreviewWebsiteTabProps> = ({
  siteContent,
  memories,
  photos,
  letters,
  chapters,
  coupons,
  onReturnToDashboard,
}) => {
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<{
    title: string;
    subtitle?: string;
    content: string;
    image?: string;
    tag?: string;
    date?: string;
  } | null>(null);

  const featuredMemory = memories.find((m) => m.isFeatured) || memories[0];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Banner with Return Action */}
      <div className="sticky top-0 z-30 p-3 sm:p-4 rounded-xl bg-[#E50914] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 shrink-0" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold">Live Demonstration Preview</span> — Testing website layout with prototype in-memory state.
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-900 text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-[#E50914]" />
          <span>Return to Dashboard</span>
        </button>
      </div>

      {/* Mock Netflix Top Navigation */}
      <div className="px-6 py-4 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bebas text-2xl tracking-widest text-[#E50914] font-black">
            OUR UNIVERSE
          </span>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-neutral-300">
            <span className="text-white font-bold">Home</span>
            <span className="hover:text-white cursor-pointer">Series</span>
            <span className="hover:text-white cursor-pointer">Movies</span>
            <span className="hover:text-white cursor-pointer">Scrapbook</span>
            <span className="hover:text-white cursor-pointer">Vault</span>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
            {siteContent.partner1Name} & {siteContent.partner2Name}
          </span>
        </div>
      </div>

      {/* Hero Billboard */}
      <div className="relative rounded-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] bg-black border border-white/10 flex items-end p-6 sm:p-12 shadow-2xl">
        <img
          src={siteContent.heroBackdropUrl}
          alt={siteContent.heroTitle}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#E50914] block">
            {siteContent.heroSubtitle}
          </span>
          <h1 className="font-bebas text-4xl sm:text-6xl text-white font-black tracking-wide leading-none">
            {siteContent.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light line-clamp-3">
            {siteContent.heroTagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (featuredMemory) {
                  setSelectedPreviewItem({
                    title: featuredMemory.title,
                    subtitle: featuredMemory.synopsis,
                    content: featuredMemory.fullStory,
                    image: featuredMemory.coverUrl,
                    tag: 'Featured Billboard',
                    date: featuredMemory.date,
                  });
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>{siteContent.heroCtaText}</span>
            </button>
            <button
              onClick={() => {
                if (featuredMemory) {
                  setSelectedPreviewItem({
                    title: featuredMemory.title,
                    subtitle: featuredMemory.synopsis,
                    content: featuredMemory.fullStory,
                    image: featuredMemory.coverUrl,
                    tag: 'Memory Details',
                    date: featuredMemory.date,
                  });
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-white/20 hover:bg-white/30 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Original Series (Story Chapters) */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <span>{siteContent.seriesHeading}</span>
          <span className="text-xs text-[#E50914] font-semibold">({chapters.length} Episodes)</span>
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2 dark-scrollbar">
          {chapters.map((chap) => (
            <div
              key={chap.id}
              onClick={() =>
                setSelectedPreviewItem({
                  title: `Episode ${chap.order}: ${chap.title}`,
                  subtitle: chap.description,
                  content: chap.storyContent,
                  image: chap.coverUrl,
                  tag: `Episode ${chap.order} • ${chap.duration}`,
                  date: chap.date,
                })
              }
              className="group min-w-[220px] sm:min-w-[260px] rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all hover:scale-105 cursor-pointer shrink-0 shadow-lg flex flex-col"
            >
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                {chap.coverUrl ? (
                  <img
                    src={chap.coverUrl}
                    alt={chap.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900">
                    <Film className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E50914] text-white">
                  E{chap.order}
                </div>
              </div>

              <div className="p-3">
                <span className="block text-xs font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                  {chap.title}
                </span>
                <span className="block text-[11px] text-neutral-400 mt-0.5 truncate">
                  {chap.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Blockbuster Memories */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
          {siteContent.moviesHeading}
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2 dark-scrollbar">
          {memories.map((mem) => (
            <div
              key={mem.id}
              onClick={() =>
                setSelectedPreviewItem({
                  title: mem.title,
                  subtitle: mem.synopsis,
                  content: mem.fullStory,
                  image: mem.coverUrl,
                  tag: `${mem.matchScore}% Match • ${mem.rating}`,
                  date: mem.date,
                })
              }
              className="group min-w-[200px] sm:min-w-[240px] rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all hover:scale-105 cursor-pointer shrink-0 shadow-lg flex flex-col"
            >
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                {mem.coverUrl ? (
                  <img
                    src={mem.coverUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <Film className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-emerald-400">
                  {mem.matchScore}%
                </div>
              </div>

              <div className="p-3">
                <span className="block text-xs font-bold text-white group-hover:text-[#E50914] truncate">
                  {mem.title}
                </span>
                <span className="block text-[11px] text-neutral-400 truncate mt-0.5">
                  {mem.date} • {mem.location || 'Special Location'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Photo Gallery Highlights */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
          Photo Gallery Scrapbook
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={() =>
                setSelectedPreviewItem({
                  title: p.title,
                  subtitle: p.caption,
                  content: p.caption || 'Captured in our universe gallery.',
                  image: p.url,
                  tag: `${p.category} • ${p.date}`,
                  date: p.date,
                })
              }
              className="group relative aspect-square rounded-xl overflow-hidden bg-black border border-white/10 hover:border-white/30 cursor-pointer shadow-lg"
            >
              <img
                src={p.url}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[11px] text-white font-semibold truncate">
                  {p.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Love Letters & Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Love Letter Highlight */}
        {letters[0] && (
          <div
            onClick={() =>
              setSelectedPreviewItem({
                title: letters[0].title,
                subtitle: letters[0].recipient,
                content: letters[0].content,
                tag: 'Personal Love Letter',
                date: letters[0].date,
              })
            }
            className="p-5 rounded-xl bg-gradient-to-br from-[#1f1416] via-[#161616] to-[#121212] border border-pink-500/20 hover:border-pink-500/50 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs text-pink-400 font-semibold mb-2">
                <Heart className="w-3.5 h-3.5 fill-pink-400" />
                <span>Featured Love Letter</span>
              </div>
              <h3 className="text-base font-bold text-white">{letters[0].title}</h3>
              <p className="text-xs text-neutral-400 italic mt-0.5">{letters[0].recipient}</p>
              <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed font-light">
                {letters[0].content}
              </p>
            </div>
            <span className="mt-4 text-xs text-pink-300 font-semibold">
              Open Letter to Read →
            </span>
          </div>
        )}

        {/* Coupon Highlight */}
        {coupons[0] && (
          <div
            onClick={() =>
              setSelectedPreviewItem({
                title: coupons[0].title,
                subtitle: coupons[0].terms,
                content: coupons[0].description,
                tag: 'Active Date Voucher',
                date: `Valid: ${coupons[0].validUntil}`,
              })
            }
            className="p-5 rounded-xl bg-gradient-to-br from-[#1a1413] via-[#161616] to-[#121212] border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>Date Night Coupon</span>
              </div>
              <h3 className="text-base font-bold text-white">{coupons[0].title}</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                {coupons[0].description}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 italic">{coupons[0].terms}</p>
            </div>
            <span className="mt-4 text-xs text-amber-300 font-semibold">
              View Coupon Voucher →
            </span>
          </div>
        )}
      </div>

      {/* POPUP DETAIL MODAL */}
      {selectedPreviewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#161616] border border-white/15 rounded-2xl overflow-hidden shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPreviewItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedPreviewItem.image && (
              <div className="relative aspect-video max-h-64 w-full bg-black overflow-hidden">
                <img
                  src={selectedPreviewItem.image}
                  alt={selectedPreviewItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-3">
              {selectedPreviewItem.tag && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E50914]">
                  {selectedPreviewItem.tag}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {selectedPreviewItem.title}
              </h2>
              {selectedPreviewItem.subtitle && (
                <p className="text-xs text-neutral-400 italic">
                  {selectedPreviewItem.subtitle}
                </p>
              )}
              <div className="pt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-light">
                {selectedPreviewItem.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
