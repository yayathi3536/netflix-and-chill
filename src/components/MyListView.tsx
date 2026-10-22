import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Film, ListTodo, Loader2, Pencil, Plus, Sparkles, Trash2, Tv, X } from 'lucide-react';
import { MemoryItem, MyListCollection, MyListItem, MyListItemInput, MyListMediaType } from '../types';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { MovieCard } from './MovieCard';

interface Props {
  memories: MemoryItem[];
  isAdmin: boolean;
  onEditMemory: (memory: MemoryItem) => void;
  onPlayMemory: (memory: MemoryItem) => void;
  onOpenInfo: (memory: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUnlockVault: (memory: MemoryItem) => void;
}

const COLLECTIONS: { id: MyListCollection; label: string; hint: string }[] = [
  { id: 'bucket-list', label: 'Bucket List', hint: 'Dreams and adventures we still want to experience.' },
  { id: 'things-to-do', label: 'Things to Do Together', hint: 'Activities, date ideas, and little plans.' },
  { id: 'watchlist', label: 'Our Watchlist', hint: 'Movies and shows for our next watch night.' },
];
const STATUSES: Record<MyListCollection, { value: string; label: string }[]> = {
  'bucket-list': [{ value: 'planned', label: 'Planned' }, { value: 'completed', label: 'Completed' }],
  'things-to-do': [{ value: 'planned', label: 'Planned' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }],
  watchlist: [{ value: 'want-to-watch', label: 'Want to Watch' }, { value: 'watching', label: 'Watching' }, { value: 'watched', label: 'Watched' }],
};
interface FormState {
  collection: MyListCollection;
  title: string;
  description: string;
  notes: string;
  targetDate: string;
  status: string;
  mediaType: MyListMediaType;
}
const blankForm = (collection: MyListCollection): FormState => ({
  collection, title: '', description: '', notes: '', targetDate: '',
  status: STATUSES[collection][0].value, mediaType: 'movie',
});

export const MyListView: React.FC<Props> = (props) => {
  const { memories, isAdmin, onEditMemory, onPlayMemory, onOpenInfo, onToggleWatchlist, onToggleFavorite, onUnlockVault } = props;
  const [active, setActive] = useState<MyListCollection>('bucket-list');
  const [items, setItems] = useState<MyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MyListItem | null>(null);
  const [form, setForm] = useState<FormState>(blankForm('bucket-list'));
  const configured = isSupabaseConfigured();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await supabaseService.fetchMyListItems());
      setError(null);
    } catch (e) {
      setError((e as Error)?.message || 'Could not load My List from Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const visibleItems = useMemo(() => items.filter((item) => item.collection === active), [items, active]);
  const openAdd = () => { setEditing(null); setForm(blankForm(active)); setError(null); setFormOpen(true); };
  const openEdit = (item: MyListItem) => {
    setEditing(item);
    setForm({ collection: item.collection, title: item.title, description: item.description || '', notes: item.notes || '', targetDate: item.targetDate || '', status: item.status, mediaType: item.mediaType || 'movie' });
    setError(null);
    setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); setForm(blankForm(active)); };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdmin || !form.title.trim()) return;
    setSaving(true);
    setError(null);
    const input: MyListItemInput = {
      collection: form.collection,
      title: form.title.trim(),
      description: form.description.trim() || null,
      notes: form.notes.trim() || null,
      targetDate: form.targetDate || null,
      status: form.status,
      mediaType: form.collection === 'watchlist' ? form.mediaType : null,
      sortOrder: editing?.sortOrder ?? items.filter((item) => item.collection === form.collection).length,
    };
    try {
      if (editing) {
        const saved = await supabaseService.updateMyListItem(editing.id, input);
        setItems((old) => old.map((item) => item.id === saved.id ? saved : item));
      } else {
        const saved = await supabaseService.createMyListItem(input);
        setItems((old) => [...old, saved]);
      }
      setActive(form.collection);
      closeForm();
    } catch (e) {
      setError((e as Error)?.message || 'Save failed. Your unsaved form content is still here.');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (item: MyListItem, status: string) => {
    if (!isAdmin || status === item.status) return;
    setError(null);
    try {
      const saved = await supabaseService.updateMyListItem(item.id, { status });
      setItems((old) => old.map((row) => row.id === saved.id ? saved : row));
    } catch (e) {
      setError((e as Error)?.message || 'Could not update status in Supabase.');
    }
  };
  const remove = async (item: MyListItem) => {
    if (!isAdmin || !window.confirm(`Remove "${item.title}" from My List?`)) return;
    setError(null);
    try {
      await supabaseService.deleteMyListItem(item.id);
      setItems((old) => old.filter((row) => row.id !== item.id));
    } catch (e) {
      setError((e as Error)?.message || 'Could not remove the item from Supabase.');
    }
  };

  return (
    <section className="min-h-screen bg-black pt-24 sm:pt-28 pb-14 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        <header>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold tracking-widest uppercase"><Sparkles className="w-3.5 h-3.5" /> Personal Collections</div>
          <h1 className="mt-1 font-bebas text-4xl sm:text-6xl font-black tracking-wider uppercase">My List</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#B3B3B3]">Dreams to chase, plans to make, and stories to watch together.</p>
        </header>

        <nav aria-label="My List collections" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COLLECTIONS.map((collection) => {
            const count = items.filter((item) => item.collection === collection.id).length + (collection.id === 'bucket-list' ? memories.length : 0);
            const selected = active === collection.id;
            return <button key={collection.id} type="button" onClick={() => setActive(collection.id)} aria-pressed={selected} className={`rounded-lg border p-4 text-left min-h-[100px] transition-colors ${selected ? 'border-[#E50914] bg-[#1A0809]' : 'border-[#292929] bg-[#141414] hover:border-[#555]'}`}>
              <span className="block text-sm font-bold">{collection.label}</span><span className="mt-1 block text-xs leading-relaxed text-[#A3A3A3]">{collection.hint}</span><span className={`mt-2 block text-[11px] font-bold ${selected ? 'text-[#E50914]' : 'text-[#808080]'}`}>{count} {count === 1 ? 'item' : 'items'}</span>
            </button>;
          })}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252525] pb-4">
          <div><h2 className="font-bebas text-2xl sm:text-3xl uppercase tracking-wide">{COLLECTIONS.find((item) => item.id === active)?.label}</h2><p className="mt-1 text-xs text-[#A3A3A3]">{COLLECTIONS.find((item) => item.id === active)?.hint}</p></div>
          {isAdmin && <button type="button" disabled={!configured} onClick={openAdd} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-[#E50914] px-4 py-3 text-xs font-bold uppercase disabled:opacity-50"><Plus className="w-4 h-4" /> Add item</button>}
        </div>

        {error && <div role="alert" className="rounded border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}{!configured && <p className="mt-1 text-xs">Cloud persistence is required; no local-only save is used.</p>}</div>}
        {loading ? <div className="flex justify-center items-center gap-2 py-12 text-sm text-[#A3A3A3]"><Loader2 className="h-5 w-5 animate-spin text-[#E50914]" /> Loading saved collections…</div> : <>
          {active === 'bucket-list' && memories.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{memories.map((memory) => <MovieCard key={memory.id} memory={memory} className="w-full" onPlay={onPlayMemory} onOpenInfo={onOpenInfo} onToggleWatchlist={onToggleWatchlist} onToggleFavorite={onToggleFavorite} onUnlockVault={onUnlockVault} onEditMemory={isAdmin ? onEditMemory : undefined} />)}</div>}
          {visibleItems.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{visibleItems.map((item) => <article key={item.id} className="flex flex-col overflow-hidden rounded-lg border border-[#242424] bg-[#141414] hover:border-[#555]">
            <div className="h-1 bg-gradient-to-r from-[#E50914] via-red-700 to-transparent" />
            <div className="flex-1 space-y-3 p-5">
              <div className="flex items-start justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E50914]">{item.collection === 'watchlist' ? (item.mediaType === 'tv-show' ? <Tv className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />) : item.collection === 'things-to-do' ? <ListTodo className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}{item.collection === 'watchlist' ? (item.mediaType === 'tv-show' ? 'TV SHOW' : 'MOVIE') : item.collection === 'things-to-do' ? 'TOGETHER' : 'BUCKET LIST'}</span><span className="rounded-full border border-[#343434] px-2 py-1 text-[10px] text-[#D4D4D4]">{STATUSES[item.collection].find((status) => status.value === item.status)?.label || item.status}</span></div>
              <h3 className="font-bebas text-2xl uppercase tracking-wide leading-tight">{item.title}</h3>
              {item.description && <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#B3B3B3]">{item.description}</p>}
              {item.notes && <p className="whitespace-pre-wrap border-l-2 border-[#E50914]/70 pl-3 text-xs text-[#8E8E8E]">{item.notes}</p>}
              {item.targetDate && <p className="inline-flex items-center gap-1.5 text-xs text-[#A3A3A3]"><Calendar className="h-3.5 w-3.5 text-[#E50914]" />{new Date(item.targetDate + 'T12:00:00').toLocaleDateString()}</p>}
            </div>
            {isAdmin && <div className="flex flex-col gap-3 border-t border-[#252525] p-4">
              <label className="text-[10px] uppercase tracking-wider text-[#8E8E8E]">Status<select value={item.status} onChange={(event) => void updateStatus(item, event.target.value)} className="mt-1 block w-full rounded border border-[#343434] bg-[#080808] px-3 py-2 text-xs text-white">{STATUSES[item.collection].map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
              <div className="flex gap-2"><button type="button" onClick={() => openEdit(item)} className="flex-1 rounded border border-[#393939] px-3 py-2 text-xs hover:border-[#E50914]"><Pencil className="mr-1 inline h-3.5 w-3.5" />Edit</button><button type="button" onClick={() => void remove(item)} className="rounded border border-[#4B2525] px-3 py-2 text-xs text-red-300 hover:bg-red-950/40"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove</button></div>
            </div>}
          </article>)}</div>}
          {visibleItems.length === 0 && !(active === 'bucket-list' && memories.length > 0) && <div className="rounded-lg border border-dashed border-[#303030] bg-[#101010] px-6 py-14 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1D0A0B] text-[#E50914]"><Sparkles className="h-5 w-5" /></div><h3 className="font-bebas text-2xl uppercase tracking-wide">Nothing here yet</h3><p className="mx-auto mt-1 max-w-md text-sm text-[#A3A3A3]">{active === 'bucket-list' ? 'Add a dream or adventure you want to experience together.' : active === 'things-to-do' ? 'Save an activity or little plan for your next time together.' : 'Save a movie or show for your next watch night.'}</p>{isAdmin && configured && <button type="button" onClick={openAdd} className="mt-5 rounded bg-[#E50914] px-4 py-3 text-xs font-bold uppercase"><Plus className="mr-1 inline h-4 w-4" />Add the first item</button>}</div>}
        </>}
      </div>

      {formOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) closeForm(); }}>
        <form onSubmit={save} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#3A2022] bg-[#111] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#292929] p-5"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#E50914]">OUR UNIVERSE · MY LIST</p><h3 className="mt-1 font-bebas text-2xl uppercase">{editing ? 'Edit item' : 'Add to your collection'}</h3></div><button type="button" aria-label="Close form" disabled={saving} onClick={closeForm} className="rounded p-2 text-[#A3A3A3] hover:bg-white/10"><X className="h-5 w-5" /></button></div>
          <div className="space-y-4 p-5">
            <label className="block text-xs font-semibold text-[#D4D4D4]">Collection<select disabled={Boolean(editing)} value={form.collection} onChange={(event) => { const collection = event.target.value as MyListCollection; setForm((old) => ({ ...old, collection, status: STATUSES[collection][0].value })); }} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white">{COLLECTIONS.map((collection) => <option key={collection.id} value={collection.id}>{collection.label}</option>)}</select></label>
            <label className="block text-xs font-semibold text-[#D4D4D4]">Title *<input required maxLength={160} value={form.title} onChange={(event) => setForm((old) => ({ ...old, title: event.target.value }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white outline-none focus:border-[#E50914]" placeholder="Give this item a title" /></label>
            {form.collection === 'watchlist' && <label className="block text-xs font-semibold text-[#D4D4D4]">Media type<select value={form.mediaType} onChange={(event) => setForm((old) => ({ ...old, mediaType: event.target.value as MyListMediaType }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white"><option value="movie">Movie</option><option value="tv-show">TV Show</option></select></label>}
            <label className="block text-xs font-semibold text-[#D4D4D4]">Description<textarea rows={3} maxLength={2000} value={form.description} onChange={(event) => setForm((old) => ({ ...old, description: event.target.value }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white outline-none focus:border-[#E50914]" placeholder="Optional details" /></label>
            <label className="block text-xs font-semibold text-[#D4D4D4]">Notes<textarea rows={2} maxLength={2000} value={form.notes} onChange={(event) => setForm((old) => ({ ...old, notes: event.target.value }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white outline-none focus:border-[#E50914]" placeholder="Optional personal notes" /></label>
            <label className="block text-xs font-semibold text-[#D4D4D4]">Target date (optional)<input type="date" value={form.targetDate} onChange={(event) => setForm((old) => ({ ...old, targetDate: event.target.value }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white" /></label>
            <label className="block text-xs font-semibold text-[#D4D4D4]">Status<select value={form.status} onChange={(event) => setForm((old) => ({ ...old, status: event.target.value }))} className="mt-1 block w-full rounded border border-[#383838] bg-[#080808] p-3 text-sm text-white">{STATUSES[form.collection].map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#292929] p-5"><button type="button" disabled={saving} onClick={closeForm} className="rounded border border-[#383838] px-4 py-3 text-xs font-bold uppercase">Cancel</button><button type="submit" disabled={saving || !form.title.trim()} className="inline-flex items-center gap-2 rounded bg-[#E50914] px-4 py-3 text-xs font-bold uppercase disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? 'Save changes' : 'Save to My List'}</button></div>
        </form>
      </div>}
    </section>
  );
};
