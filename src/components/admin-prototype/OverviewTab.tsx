import React from 'react';
import {
  Film,
  Image as ImageIcon,
  Heart,
  BookOpen,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  PrototypeMemory,
  PrototypePhoto,
  PrototypeLetter,
  PrototypeChapter,
  PrototypeActivity,
  AdminTab,
} from './types';

interface OverviewTabProps {
  memories: PrototypeMemory[];
  photos: PrototypePhoto[];
  letters: PrototypeLetter[];
  chapters: PrototypeChapter[];
  activities: PrototypeActivity[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddMemory: () => void;
  onOpenAddPhoto: () => void;
  onOpenAddLetter: () => void;
  onOpenAddChapter: () => void;
  onSelectMemoryPreview: (memory: PrototypeMemory) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  memories,
  photos,
  letters,
  chapters,
  activities,
  onNavigateTab,
  onOpenAddMemory,
  onOpenAddPhoto,
  onOpenAddLetter,
  onOpenAddChapter,
  onSelectMemoryPreview,
}) => {
  const publishedMemoriesCount = memories.filter((m) => m.status === 'published').length;
  const draftMemoriesCount = memories.filter((m) => m.status === 'draft').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#181818] via-[#1a1214] to-[#121212] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#E50914] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Studio • Prototype Experience</span>
          </div>
          <h1 className="font-bebas text-3xl sm:text-5xl tracking-wide text-white font-bold leading-tight">
            Your Universe, Your Story.
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 mt-2 font-light leading-relaxed">
            Create, preserve, and manage your favorite memories, personal letters, and cinematic chapters in one private space.
          </p>

          {/* Quick Action Pill Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddMemory}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Memory</span>
            </button>
            <button
              onClick={onOpenAddPhoto}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-[#E50914]" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={onOpenAddLetter}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#E50914]" />
              <span>Write a Letter</span>
            </button>
            <button
              onClick={onOpenAddChapter}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/15 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#E50914]" />
              <span>Create Chapter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memories Card */}
        <div
          onClick={() => onNavigateTab('memories')}
          className="group relative p-5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#E50914]/50 transition-all hover:-translate-y-1 cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-[#E50914]">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-400 font-semibold group-hover:text-white flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white block tracking-tight">
              {memories.length}
            </span>
            <span className="text-xs text-neutral-400 font-medium block mt-0.5">
              Total Memories
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-emerald-400 font-medium">{publishedMemoriesCount} Published</span>
            <span>{draftMemoriesCount} Drafts</span>
          </div>
        </div>

        {/* Photos Card */}
        <div
          onClick={() => onNavigateTab('photos')}
          className="group relative p-5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#E50914]/50 transition-all hover:-translate-y-1 cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-400 font-semibold group-hover:text-white flex items-center gap-1">
              View Gallery <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white block tracking-tight">
              {photos.length}
            </span>
            <span className="text-xs text-neutral-400 font-medium block mt-0.5">
              Curated Photos
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-sky-400 font-medium">4 Categories</span>
            <span>Local file previews ready</span>
          </div>
        </div>

        {/* Letters Card */}
        <div
          onClick={() => onNavigateTab('letters')}
          className="group relative p-5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#E50914]/50 transition-all hover:-translate-y-1 cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-400 font-semibold group-hover:text-white flex items-center gap-1">
              Read Letters <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white block tracking-tight">
              {letters.length}
            </span>
            <span className="text-xs text-neutral-400 font-medium block mt-0.5">
              Love Letters
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-pink-400 font-medium">
              {letters.filter((l) => l.status === 'published').length} Active
            </span>
            <span>Private vault preserved</span>
          </div>
        </div>

        {/* Story Chapters Card */}
        <div
          onClick={() => onNavigateTab('chapters')}
          className="group relative p-5 rounded-xl bg-[#161616] border border-white/10 hover:border-[#E50914]/50 transition-all hover:-translate-y-1 cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-400 font-semibold group-hover:text-white flex items-center gap-1">
              Manage Series <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white block tracking-tight">
              {chapters.length}
            </span>
            <span className="text-xs text-neutral-400 font-medium block mt-0.5">
              Story Chapters
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-amber-400 font-medium">Timeline Order</span>
            <span>Episodic flow</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Activity + Recently Added Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recently Added Content Showcase */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Recent Memories Showcase
              </h2>
              <p className="text-xs text-neutral-400">
                Latest additions preserved inside this demonstration prototype
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('memories')}
              className="text-xs font-semibold text-[#E50914] hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all memories ({memories.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories.slice(0, 4).map((memory) => (
              <div
                key={memory.id}
                onClick={() => onSelectMemoryPreview(memory)}
                className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all hover:scale-[1.01] cursor-pointer flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#1f1f1f]">
                  {memory.coverUrl ? (
                    <img
                      src={memory.coverUrl}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-black text-neutral-500">
                      <Film className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E50914] text-white">
                    {memory.matchScore}% Match
                  </div>
                  {memory.isFeatured && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-1">
                      <Calendar className="w-3 h-3 text-[#E50914]" />
                      <span>{memory.date}</span>
                      <span>•</span>
                      <span className="capitalize">{memory.category.replace('-', ' ')}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors line-clamp-1">
                      {memory.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {memory.synopsis}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">{memory.location || 'Special Location'}</span>
                    <span className="text-[#E50914] font-semibold group-hover:underline">
                      Preview Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Content Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">Recent Activity</h2>
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <Clock className="w-3 h-3" /> Mock Timeline
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#161616] p-4 divide-y divide-white/5">
            {activities.map((act) => (
              <div key={act.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#E50914] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {act.targetTitle}
                    </span>
                    <span className="text-[10px] text-neutral-500 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                        act.badgeColor || 'text-neutral-300 bg-white/5 border-white/10'
                      }`}
                    >
                      {act.action} {act.targetType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Isolation Summary Card */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs text-neutral-300">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe Sandbox Environment</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              All interactions in this studio remain strictly in local component memory. Your live database, production secrets, and website records are untouched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
