import React, { useState } from 'react';
import {
  Film,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Tag,
  Star,
} from 'lucide-react';
import { PrototypeMemory } from './types';

interface MemoriesTabProps {
  memories: PrototypeMemory[];
  onSaveMemory: (memory: PrototypeMemory) => void;
  onDeleteMemory: (id: string) => void;
  onRequestDelete: (id: string, title: string) => void;
  onPreviewMemory: (memory: PrototypeMemory) => void;
}

export const MemoriesTab: React.FC<MemoriesTabProps> = ({
  memories,
  onSaveMemory,
  onRequestDelete,
  onPreviewMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Add / Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: 'our-story' | 'memories' | 'little-things' | 'places-list' | 'secret-vault';
    date: string;
    duration: string;
    rating: string;
    synopsis: string;
    fullStory: string;
    location: string;
    tags: string;
    coverUrl: string;
    isFeatured: boolean;
    status: 'published' | 'draft';
  }>({
    title: '',
    category: 'memories',
    date: new Date().toISOString().slice(0, 10),
    duration: '2h 15m',
    rating: 'PG-Love',
    synopsis: '',
    fullStory: '',
    location: '',
    tags: 'Stargazing, Travel, Cozy',
    coverUrl: '',
    isFeatured: false,
    status: 'published',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [localFilePreview, setLocalFilePreview] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'our-story', label: 'Our Story (Series)' },
    { id: 'memories', label: 'Movies & Relives' },
    { id: 'little-things', label: 'Little Quirks' },
    { id: 'places-list', label: 'Bucket List Places' },
    { id: 'secret-vault', label: 'Secret Vault' },
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'memories',
      date: new Date().toISOString().slice(0, 10),
      duration: '2h 00m',
      rating: 'PG-Love',
      synopsis: '',
      fullStory: '',
      location: '',
      tags: '',
      coverUrl:
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
      isFeatured: false,
      status: 'published',
    });
    setFormErrors({});
    setLocalFilePreview(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (memory: PrototypeMemory) => {
    setEditingId(memory.id);
    setFormData({
      title: memory.title,
      category: memory.category,
      date: memory.date,
      duration: memory.duration,
      rating: memory.rating,
      synopsis: memory.synopsis,
      fullStory: memory.fullStory,
      location: memory.location || '',
      tags: memory.tags.join(', '),
      coverUrl: memory.coverUrl || '',
      isFeatured: !!memory.isFeatured,
      status: memory.status,
    });
    setFormErrors({});
    setLocalFilePreview(memory.coverUrl || null);
    setIsEditorOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLocalFilePreview(previewUrl);
      setFormData((prev) => ({ ...prev, coverUrl: previewUrl }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.synopsis.trim()) {
      errors.synopsis = 'A brief synopsis or summary is required';
    }
    if (!formData.fullStory.trim()) {
      errors.fullStory = 'The full story description is required';
    }
    if (!formData.date.trim()) {
      errors.date = 'Date is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, forceStatus?: 'published' | 'draft') => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const memoryItem: PrototypeMemory = {
      id: editingId || `mem-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date,
      year: formData.date.slice(0, 4) || '2024',
      duration: formData.duration || '2h 00m',
      matchScore: 99,
      rating: formData.rating || 'PG-Love',
      synopsis: formData.synopsis.trim(),
      fullStory: formData.fullStory.trim(),
      location: formData.location.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['Memories', 'Our Universe'],
      coverUrl: formData.coverUrl.trim() || undefined,
      isFeatured: formData.isFeatured,
      status: forceStatus || formData.status,
      createdAt: new Date().toISOString(),
    };

    onSaveMemory(memoryItem);
    setIsEditorOpen(false);
  };

  // Filtered List
  const filteredMemories = memories.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Memories Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Organize movies, series episodes, quirks, and secret vault milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Memory</span>
        </button>
      </div>

      {/* Filters & Search Controls */}
      <div className="p-4 rounded-xl bg-[#161616] border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, tags, or story details..."
              className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-black'
                    : 'bg-[#111111] text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto dark-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#E50914] text-white font-bold shadow-md shadow-[#E50914]/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Content List (Grid or Table) */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-white/15 bg-white/5 space-y-3">
          <Film className="w-12 h-12 mx-auto text-neutral-500" />
          <h3 className="text-base font-bold text-white">No memories found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search query or category filters, or create a new memory using the button above.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMemories.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all flex flex-col shadow-xl"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-video w-full bg-[#111111] overflow-hidden">
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-gradient-to-br from-neutral-900 to-black">
                    <Film className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Status & Featured Tags */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-black'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.isFeatured && (
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#E50914] text-white flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white">
                  {item.matchScore}% Match
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-neutral-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-[#E50914]" /> {item.date}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-[#E50914]" /> {item.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Memory Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.synopsis}
                  </p>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => onPreviewMemory(item)}
                    className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      title="Edit memory"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRequestDelete(item.id, item.title)}
                      className="p-1.5 text-neutral-400 hover:text-[#E50914] rounded-lg hover:bg-[#E50914]/10 transition-colors cursor-pointer"
                      title="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MEMORY MODAL FORM */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto dark-scrollbar flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161616] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 text-white my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="pb-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {editingId ? 'Edit Memory' : 'Create New Memory'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Saved strictly to in-memory prototype state (no live Supabase writes).
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex-1 overflow-y-auto dark-scrollbar pr-1 py-4 space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g. The Stargazing Midnight Drive"
                  className={`w-full bg-[#111111] border rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                    formErrors.title ? 'border-[#E50914]' : 'border-white/15 focus:border-[#E50914]'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-[#E50914] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.title}
                  </p>
                )}
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as PrototypeMemory['category'],
                      }))
                    }
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="our-story">Our Story (Original Series)</option>
                    <option value="memories">Movies & Relives</option>
                    <option value="little-things">Little Quirks & Habits</option>
                    <option value="places-list">Bucket List Places</option>
                    <option value="secret-vault">Secret Vault Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Date of Memory *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, date: e.target.value }));
                      if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: '' }));
                    }}
                    className={`w-full bg-[#111111] border rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none ${
                      formErrors.date ? 'border-[#E50914]' : 'border-white/15 focus:border-[#E50914]'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-[11px] text-[#E50914] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.date}
                    </p>
                  )}
                </div>
              </div>

              {/* Location & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Skyline Ridge Vista"
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="Roadtrip, Night, First Summer"
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Photo Selection (Local File preview or URL) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Cover Photo (Local file preview or image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-[#E50914] bg-[#111111] hover:bg-white/5 cursor-pointer text-xs text-neutral-300 transition-colors">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                    <span>Choose Local Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-neutral-500">or</span>
                  <input
                    type="url"
                    value={formData.coverUrl}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, coverUrl: e.target.value }));
                      setLocalFilePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>

                {/* Local image preview */}
                {localFilePreview && (
                  <div className="mt-2.5 relative aspect-video max-h-44 rounded-lg overflow-hidden border border-white/15 bg-black">
                    <img
                      src={localFilePreview}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLocalFilePreview(null);
                        setFormData((prev) => ({ ...prev, coverUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-[#E50914] text-white transition-colors"
                      title="Remove image preview"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Short Synopsis *
                </label>
                <input
                  type="text"
                  value={formData.synopsis}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, synopsis: e.target.value }));
                    if (formErrors.synopsis) setFormErrors((prev) => ({ ...prev, synopsis: '' }));
                  }}
                  placeholder="One sentence that captures this memory's magic"
                  className={`w-full bg-[#111111] border rounded-lg py-2 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none ${
                    formErrors.synopsis ? 'border-[#E50914]' : 'border-white/15 focus:border-[#E50914]'
                  }`}
                />
                {formErrors.synopsis && (
                  <p className="text-[11px] text-[#E50914] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.synopsis}
                  </p>
                )}
              </div>

              {/* Full Story */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Full Story Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.fullStory}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, fullStory: e.target.value }));
                    if (formErrors.fullStory)
                      setFormErrors((prev) => ({ ...prev, fullStory: '' }));
                  }}
                  placeholder="Tell the complete story from beginning to end..."
                  className={`w-full bg-[#111111] border rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none ${
                    formErrors.fullStory ? 'border-[#E50914]' : 'border-white/15 focus:border-[#E50914]'
                  }`}
                />
                {formErrors.fullStory && (
                  <p className="text-[11px] text-[#E50914] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.fullStory}
                  </p>
                )}
              </div>

              {/* Featured toggle & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="rounded text-[#E50914] focus:ring-[#E50914]"
                  />
                  <span className="text-xs text-white font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Featured Billboard Memory
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">Save as:</span>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: 'published' }))}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      formData.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: 'draft' }))}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      formData.status === 'draft'
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E50914]/30 cursor-pointer"
                  >
                    {editingId ? 'Save Changes' : 'Save Memory'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
