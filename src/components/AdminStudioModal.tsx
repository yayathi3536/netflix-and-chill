import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Clapperboard,
  Clock3,
  Edit3,
  Film,
  Heart,
  LayoutDashboard,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';
import { Drawer } from './Drawer';

interface AdminStudioModalProps {
  memories: MemoryItem[];
  onClose: () => void;
  onAddMemory: () => void;
  onEditMemory: (memory: MemoryItem) => void;
}

const categoryLabels: Record<MemoryCategory, string> = {
  'our-story': 'Our Story',
  memories: 'Memories',
  'little-things': 'Little Things',
  'places-list': 'Places',
  'secret-vault': 'Secret Vault',
};

const categoryOptions: Array<{ value: 'all' | MemoryCategory; label: string }> = [
  { value: 'all', label: 'All titles' },
  { value: 'our-story', label: 'Our Story' },
  { value: 'memories', label: 'Memories' },
  { value: 'little-things', label: 'Little Things' },
  { value: 'places-list', label: 'Places' },
  { value: 'secret-vault', label: 'Secret Vault' },
];

export const AdminStudioModal: React.FC<AdminStudioModalProps> = ({
  memories,
  onClose,
  onAddMemory,
  onEditMemory,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | MemoryCategory>('all');

  const filteredMemories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return memories.filter((memory) => {
      const matchesCategory = category === 'all' || memory.category === category;
      const matchesQuery =
        !normalized ||
        [memory.title, memory.subtitle, memory.synopsis, memory.location, ...(memory.tags || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [memories, query, category]);

  const secretCount = memories.filter((memory) => memory.isSecret || memory.category === 'secret-vault').length;
  const favoriteCount = memories.filter((memory) => memory.isFavorite).length;
  const topTenCount = memories.filter((memory) => memory.isTop10).length;

  const openAdd = () => {
    onClose();
    onAddMemory();
  };

  const openEdit = (memory: MemoryItem) => {
    onClose();
    onEditMemory(memory);
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="OUR UNIVERSE STUDIO"
      subtitle="Private admin workspace · Manage your saved memories"
      width="lg"
    >
      <div className="min-h-0 text-white">
        <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#241014] via-[#111111] to-[#090909] px-5 py-6 sm:px-6 sm:py-7">
          <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-[#E50914]/20 blur-3xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E50914]/40 bg-[#E50914]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private admin workspace
            </div>
            <p className="max-w-2xl text-sm leading-6 text-white/60">
              Your real saved memories, organized in one cinematic control room. Changes open the existing editor and save through the connected app storage.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-red-950/30 transition hover:bg-white/80 min-h-[44px]"
            >
              <Plus className="h-4 w-4" />
              Add a title
            </button>
            <span className="inline-flex items-center gap-2 text-xs text-white/50">
              <Activity className="h-4 w-4 text-red-400" />
              Live database-backed list
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total titles" value={memories.length} icon={<Film className="h-4 w-4" />} />
            <StatCard label="Favorites" value={favoriteCount} icon={<Heart className="h-4 w-4" />} />
            <StatCard label="Top 10 picks" value={topTenCount} icon={<LayoutDashboard className="h-4 w-4" />} />
            <StatCard label="Secret vault" value={secretCount} icon={<ShieldCheck className="h-4 w-4" />} />
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-bold">Your library</h3>
              <p className="mt-1 text-xs text-white/45">
                {filteredMemories.length} {filteredMemories.length === 1 ? 'title' : 'titles'} shown
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block sm:min-w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, tags, places..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E50914]/60"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as 'all' | MemoryCategory)}
                className="rounded-lg border border-white/10 bg-[#141414] px-3 py-2.5 text-sm text-white outline-none focus:border-[#E50914]/60"
                aria-label="Filter by category"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredMemories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 px-5 py-14 text-center">
              <Clapperboard className="mx-auto h-8 w-8 text-white/25" />
              <p className="mt-3 font-semibold">{memories.length ? 'No matching titles' : 'Your library is ready for its first title'}</p>
              <p className="mt-1 text-sm text-white/45">Try another search or add a new memory to your collection.</p>
              <button onClick={openAdd} className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/80">
                Add a title
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredMemories.map((memory) => (
                <article
                  key={memory.id}
                  className="group flex min-w-0 gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition hover:border-[#E50914]/35 hover:bg-white/[0.045]"
                >
                  <div className="relative aspect-[3/4] w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#421116] to-[#111111]">
                    {memory.posterUrl || memory.backdropUrl ? (
                      <img
                        src={memory.posterUrl || memory.backdropUrl}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-7 w-7 text-white/20" />
                      </div>
                    )}
                    {memory.isTop10 ? (
                      <span className="absolute left-1.5 top-1.5 rounded bg-[#E50914] px-1.5 py-0.5 text-[9px] font-black">
                        TOP {memory.isTop10}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-300/80">
                          {categoryLabels[memory.category] || 'Memory'}
                        </span>
                        <h4 className="mt-1 line-clamp-2 font-bold leading-snug text-white">{memory.title}</h4>
                      </div>
                      <button
                        onClick={() => openEdit(memory)}
                        className="shrink-0 rounded-lg border border-white/10 p-2 text-white/50 transition hover:border-[#E50914]/50 hover:bg-[#E50914]/10 hover:text-white"
                        title={`Edit ${memory.title}`}
                        aria-label={`Edit ${memory.title}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">{memory.synopsis || memory.subtitle || 'No synopsis added yet.'}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[10px] text-white/40">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{memory.year || memory.date || 'Undated'}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{memory.duration || '—'}</span>
                      {memory.isFavorite ? <span className="inline-flex items-center gap-1 text-pink-300"><Heart className="h-3 w-3" />Favorite</span> : null}
                      {memory.isSecret || memory.category === 'secret-vault' ? <span className="inline-flex items-center gap-1 text-amber-200"><ShieldCheck className="h-3 w-3" />Private</span> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <footer className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <span>Edits use the existing authenticated memory editor.</span>
            <button onClick={onClose} className="inline-flex items-center gap-1 self-start font-semibold text-white/60 transition hover:text-white sm:self-auto">
              Back to OUR UNIVERSE <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </footer>
        </main>
      </div>
    </Drawer>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-transparent p-4">
    <div className="flex items-center justify-between gap-2 text-white/45">
      <span className="text-xs">{label}</span>
      <span className="text-[#E50914]">{icon}</span>
    </div>
    <div className="mt-3 text-2xl font-black tracking-tight">{value}</div>
  </div>
);
