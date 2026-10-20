import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  Lock,
  X,
  AlertCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { PrototypeLetter } from './types';

interface LoveLettersTabProps {
  letters: PrototypeLetter[];
  onSaveLetter: (letter: PrototypeLetter) => void;
  onRequestDeleteLetter: (id: string, title: string) => void;
}

export const LoveLettersTab: React.FC<LoveLettersTabProps> = ({
  letters,
  onSaveLetter,
  onRequestDeleteLetter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [readingLetter, setReadingLetter] = useState<PrototypeLetter | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('To My Favorite Person in the Entire Universe');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingLetterId(null);
    setTitle('');
    setRecipient('To My Favorite Person in the Universe');
    setDate(new Date().toISOString().slice(0, 10));
    setContent('');
    setStatus('published');
    setFormError('');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (letter: PrototypeLetter) => {
    setEditingLetterId(letter.id);
    setTitle(letter.title);
    setRecipient(letter.recipient);
    setDate(letter.date);
    setContent(letter.content);
    setStatus(letter.status);
    setFormError('');
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Letter title is required');
      return;
    }
    if (!content.trim()) {
      setFormError('Letter body content cannot be empty');
      return;
    }

    const wordCount = content.trim().split(/\s+/).length;
    const estMinutes = Math.max(1, Math.round(wordCount / 120));

    const item: PrototypeLetter = {
      id: editingLetterId || `let-${Date.now()}`,
      title: title.trim(),
      recipient: recipient.trim() || 'To Someone Special',
      date,
      content: content.trim(),
      status,
      readTime: `${estMinutes} min read`,
      createdAt: new Date().toISOString(),
    };

    onSaveLetter(item);
    setIsEditorOpen(false);
  };

  const filteredLetters = letters.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || l.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Love Letters & Secret Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Pen heartfelt letters and private messages preserved in digital wax seal.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Letter</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[#161616] border border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters by title, recipient, or words inside..."
            className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

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

      {/* Letters Grid */}
      {filteredLetters.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-white/15 bg-white/5 space-y-3">
          <Heart className="w-12 h-12 mx-auto text-neutral-500" />
          <h3 className="text-base font-bold text-white">No letters found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Write your first personal letter or adjust your search filter.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Write a Letter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="group relative rounded-xl bg-gradient-to-br from-[#1a1314] via-[#161616] to-[#121212] border border-white/10 hover:border-pink-500/40 p-6 flex flex-col justify-between shadow-xl transition-all hover:scale-[1.01]"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-pink-400">
                      {letter.readTime}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      letter.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {letter.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                  {letter.title}
                </h3>
                <p className="text-xs text-neutral-400 italic mt-0.5">
                  {letter.recipient}
                </p>

                {/* Excerpt */}
                <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed font-light">
                  {letter.content}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E50914]" /> {letter.date}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReadingLetter(letter)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Read Letter</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(letter)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Edit letter"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRequestDeleteLetter(letter.id, letter.title)}
                    className="p-1.5 text-neutral-400 hover:text-[#E50914] rounded-lg hover:bg-[#E50914]/10 transition-colors cursor-pointer"
                    title="Delete letter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WRITE / EDIT LETTER MODAL */}
      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161616] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 text-white my-auto max-h-[92vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {editingLetterId ? 'Edit Love Letter' : 'Write a Love Letter'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Compose words that endure. Preserved in isolated prototype state.
            </p>

            {formError && (
              <div className="mt-3 p-3 rounded-lg bg-[#E50914]/15 border border-[#E50914] text-xs text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Letter Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setFormError('');
                  }}
                  placeholder="e.g. A Letter for 3:00 AM on a Tuesday"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Recipient Salutation
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="To My Favorite Person..."
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Letter Content *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Write your heartfelt message here..."
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none font-sans"
                />
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-xs text-neutral-300">Letter Status:</span>
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

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E50914]/30 cursor-pointer"
                >
                  {editingLetterId ? 'Save Changes' : 'Save Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CINEMATIC LETTER PREVIEW MODAL */}
      {readingLetter && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setReadingLetter(null)}
        >
          <div
            className="relative w-full max-w-xl bg-gradient-to-b from-[#211a19] via-[#1a1415] to-[#120f10] border border-pink-500/30 rounded-2xl shadow-2xl p-6 sm:p-10 text-white my-auto max-h-[88vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Wax Seal Aesthetic Badge */}
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E50914] border-2 border-amber-300/40 shadow-xl shadow-[#E50914]/30 flex items-center justify-center text-white mb-4">
              <Heart className="w-6 h-6 fill-white" />
            </div>

            <button
              onClick={() => setReadingLetter(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {readingLetter.title}
              </h2>
              <p className="text-xs text-pink-300/90 italic font-serif">
                {readingLetter.recipient}
              </p>
              <span className="text-[11px] text-neutral-400 block pt-1">
                {readingLetter.date} • {readingLetter.readTime}
              </span>
            </div>

            <div className="flex-1 font-serif text-sm sm:text-base leading-relaxed text-neutral-200 whitespace-pre-wrap px-2">
              {readingLetter.content}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => setReadingLetter(null)}
                className="px-6 py-2 rounded-full border border-pink-500/30 hover:bg-white/10 text-xs font-semibold tracking-wider text-pink-300 transition-colors"
              >
                Close Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
