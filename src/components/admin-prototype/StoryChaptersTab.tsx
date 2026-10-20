import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Upload,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PrototypeChapter } from './types';

interface StoryChaptersTabProps {
  chapters: PrototypeChapter[];
  onSaveChapter: (chapter: PrototypeChapter) => void;
  onReorderChapters: (chapters: PrototypeChapter[]) => void;
  onRequestDeleteChapter: (id: string, title: string) => void;
}

export const StoryChaptersTab: React.FC<StoryChaptersTabProps> = ({
  chapters,
  onSaveChapter,
  onReorderChapters,
  onRequestDeleteChapter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewChapter, setPreviewChapter] = useState<PrototypeChapter | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('25 min');
  const [date, setDate] = useState('Summer 2024');
  const [description, setDescription] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setDuration('25 min');
    setDate('Season 2');
    setDescription('');
    setStoryContent('');
    setCoverUrl(
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80'
    );
    setStatus('published');
    setLocalPreview(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chapter: PrototypeChapter) => {
    setEditingId(chapter.id);
    setTitle(chapter.title);
    setDuration(chapter.duration);
    setDate(chapter.date || '');
    setDescription(chapter.description);
    setStoryContent(chapter.storyContent);
    setCoverUrl(chapter.coverUrl || '');
    setStatus(chapter.status);
    setLocalPreview(chapter.coverUrl || null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sortedChapters.length) return;

    const reordered = [...sortedChapters];
    const temp = reordered[index];
    reordered[index] = reordered[newIdx];
    reordered[newIdx] = temp;

    // Reassign order 1..N
    const updated = reordered.map((c, i) => ({ ...c, order: i + 1 }));
    onReorderChapters(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blob = URL.createObjectURL(file);
      setLocalPreview(blob);
      setCoverUrl(blob);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Chapter title is required');
      return;
    }
    if (!storyContent.trim()) {
      setErrorMsg('Story content cannot be empty');
      return;
    }

    const currentOrder = editingId
      ? chapters.find((c) => c.id === editingId)?.order || chapters.length
      : chapters.length + 1;

    const item: PrototypeChapter = {
      id: editingId || `chap-${Date.now()}`,
      order: currentOrder,
      title: title.trim(),
      duration: duration.trim() || '25 min',
      date: date.trim() || undefined,
      description: description.trim() || title.trim(),
      storyContent: storyContent.trim(),
      coverUrl: coverUrl.trim() || undefined,
      status,
      createdAt: new Date().toISOString(),
    };

    onSaveChapter(item);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Story Chapters Timeline
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Build an episodic sequential timeline of your relationship milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Chapter</span>
        </button>
      </div>

      {/* Chapters Sequence List */}
      <div className="space-y-4">
        {sortedChapters.map((chapter, idx) => (
          <div
            key={chapter.id}
            className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-xl"
          >
            {/* Order Badge & Reorder Arrows */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-white/10 cursor-pointer"
                  title="Move chapter earlier"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === sortedChapters.length - 1}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-white/10 cursor-pointer"
                  title="Move chapter later"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#E50914] text-white font-bebas text-2xl flex items-center justify-center shadow-lg shadow-[#E50914]/25 shrink-0 select-none">
                E{chapter.order}
              </div>
            </div>

            {/* Thumbnail */}
            <div
              onClick={() => setPreviewChapter(chapter)}
              className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-black shrink-0 cursor-pointer border border-white/10"
            >
              {chapter.coverUrl ? (
                <img
                  src={chapter.coverUrl}
                  alt={chapter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Chapter Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                    chapter.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {chapter.status}
                </span>
                {chapter.date && (
                  <span className="text-[11px] text-neutral-400">• {chapter.date}</span>
                )}
                <span className="text-[11px] text-neutral-400">• {chapter.duration}</span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                {chapter.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {chapter.description || chapter.storyContent}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setPreviewChapter(chapter)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleOpenEdit(chapter)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                title="Edit chapter"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRequestDeleteChapter(chapter.id, chapter.title)}
                className="p-2 text-neutral-400 hover:text-[#E50914] rounded-lg hover:bg-[#E50914]/10 cursor-pointer"
                title="Delete chapter"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT CHAPTER MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161616] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 text-white my-auto max-h-[92vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {editingId ? 'Edit Story Chapter' : 'Add Story Chapter'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Chapters render sequentially inside the OUR UNIVERSE original series timeline.
            </p>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-[#E50914]/15 border border-[#E50914] text-xs text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. The First Spark: How We Met"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Season / Period
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Spring 2022"
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Reading / Run Time
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 25 min"
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Chapter Cover Photo (Local file or URL)
                </label>
                <div className="space-y-2">
                  <label className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-[#E50914] bg-[#111111] hover:bg-white/5 cursor-pointer text-xs text-neutral-300 transition-colors">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                    <span>Choose Local Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => {
                      setCoverUrl(e.target.value);
                      setLocalPreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                {localPreview && (
                  <div className="mt-2.5 relative aspect-video max-h-40 rounded-lg overflow-hidden border border-white/15 bg-black">
                    <img
                      src={localPreview}
                      alt="Chapter preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Logline / Brief Summary
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A one-sentence summary for the episode card"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Full Story Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={storyContent}
                  onChange={(e) => {
                    setStoryContent(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Describe the memories and moments in this chapter..."
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-xs text-neutral-300">Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                      status === 'draft'
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E50914]/30 cursor-pointer"
                >
                  {editingId ? 'Save Chapter' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAPTER PREVIEW MODAL */}
      {previewChapter && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewChapter(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161616] border border-white/15 rounded-2xl overflow-hidden shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewChapter(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {previewChapter.coverUrl && (
              <div className="relative aspect-video max-h-64 w-full bg-black overflow-hidden">
                <img
                  src={previewChapter.coverUrl}
                  alt={previewChapter.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#E50914] font-bold uppercase tracking-widest">
                <span>Episode {previewChapter.order}</span>
                <span>•</span>
                <span>{previewChapter.duration}</span>
                {previewChapter.date && (
                  <>
                    <span>•</span>
                    <span>{previewChapter.date}</span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white tracking-wide">
                {previewChapter.title}
              </h2>

              <p className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                {previewChapter.storyContent}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
