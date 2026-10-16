import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Heart,
  Lock,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryItem) => void;
  memoryToEdit?: MemoryItem | null;
  onDeleteMemory?: (id: string, photoUrl?: string) => void;
  currentUser?: User | null;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  memoryToEdit,
  onDeleteMemory,
  currentUser,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('memories');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    if (memoryToEdit) {
      setTitle(memoryToEdit.title);
      setSubtitle(memoryToEdit.subtitle || '');
      setCategory(memoryToEdit.category);
      setDate(memoryToEdit.date);
      setLocation(memoryToEdit.location || '');
      setSynopsis(memoryToEdit.synopsis);
      setFullStory(memoryToEdit.fullStory || '');
      setTagsString(memoryToEdit.tags?.join(', ') || '');
      setImageUrl(memoryToEdit.backdropUrl || memoryToEdit.posterUrl || '');
      setIsSecret(Boolean(memoryToEdit.isSecret));
      setLetterContent(memoryToEdit.letterContent || '');
    } else {
      resetForm();
    }
  }, [memoryToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setCategory('memories');
    setDate('');
    setLocation('');
    setSynopsis('');
    setFullStory('');
    setTagsString('');
    setImageUrl('');
    setIsSecret(false);
    setLetterContent('');
    setUploadError('');
    setUploadSuccess('');
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    // If Supabase is configured, upload directly to Supabase Storage bucket 'memory-photos'
    if (isSupabaseConfigured()) {
      try {
        const { url, error } = await supabaseService.uploadPhoto(file);
        if (error) {
          setUploadError(`Upload failed: ${error.message}`);
        } else if (url) {
          setImageUrl(url);
          setUploadSuccess('Photo successfully uploaded to Supabase Storage!');
        }
      } catch (err) {
        setUploadError((err as Error).message);
      } finally {
        setIsUploading(false);
      }
    } else {
      // Offline fallback: FileReader base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsUploading(false);
        setUploadSuccess('Image loaded in local offline preview mode.');
      };
      reader.onerror = () => {
        setUploadError('Failed to read local file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !synopsis.trim()) return;

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const memoryData: MemoryItem = {
      id: memoryToEdit ? memoryToEdit.id : `memory-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      category,
      date: date.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      year: new Date().getFullYear().toString(),
      duration: memoryToEdit?.duration || 'Timeless Memory',
      matchScore: memoryToEdit?.matchScore || 100,
      rating: memoryToEdit?.rating || 'PG-Love',
      synopsis: synopsis.trim(),
      fullStory: fullStory.trim() || synopsis.trim(),
      location: location.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Love', 'Special Moment'],
      backdropUrl: imageUrl || undefined,
      posterUrl: imageUrl || undefined,
      fallbackGradient: memoryToEdit?.fallbackGradient || 'from-rose-950 via-red-950 to-neutral-950',
      isInWatchlist: memoryToEdit ? memoryToEdit.isInWatchlist : true,
      isFavorite: memoryToEdit ? memoryToEdit.isFavorite : true,
      isSecret,
      secretPasscode: isSecret ? '1402' : undefined,
      letterContent: isSecret ? letterContent : undefined,
      progress: category === 'memories' ? (memoryToEdit?.progress ?? 10) : undefined,
      episodes: memoryToEdit?.episodes,
      coupons: memoryToEdit?.coupons,
    };

    onAddMemory(memoryData);
    onClose();
  };

  const handleDelete = () => {
    if (memoryToEdit && onDeleteMemory) {
      if (window.confirm(`Are you sure you want to delete "${memoryToEdit.title}"?`)) {
        onDeleteMemory(memoryToEdit.id, memoryToEdit.backdropUrl);
        onClose();
      }
    }
  };

  const isSupabaseReady = isSupabaseConfigured();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white font-bold">
                {memoryToEdit ? 'Edit Memory Details' : 'Add New Relationship Memory'}
              </h2>
              <p className="text-xs text-neutral-400">
                {isSupabaseReady
                  ? 'Real-time synchronization with Supabase Database & Cloud Storage'
                  : 'Local persistence mode (ready for Supabase migration)'}
              </p>
            </div>
          </div>

          {memoryToEdit && onDeleteMemory && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Delete this memory"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>

        {/* Admin notice if Supabase is connected but user is guest */}
        {isSupabaseReady && !currentUser && (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Tip: Sign in via Admin Access to save permanently to Supabase with Row Level Security.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Ice Cream in the Rain"
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Subtitle / Chapter (optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Season 3 · Episode 9"
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white focus:outline-none"
              >
                <option value="memories">Continue Watching: Our Memories</option>
                <option value="our-story">Original Series: Our Story</option>
                <option value="little-things">Little Things I Love About You</option>
                <option value="places-list">My List: Places & Experiences</option>
                <option value="secret-vault">Secret Vault: Love Letters</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Date / When
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 14, 2024"
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown Coffee Shop"
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="e.g. First Date, Cozy, Late Night"
                className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Short Synopsis (shown on card) *
            </label>
            <textarea
              required
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="What happened in this memory in 1-2 sentences..."
              className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Full Story */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Full Story & Intimate Details (optional)
            </label>
            <textarea
              rows={3}
              value={fullStory}
              onChange={(e) => setFullStory(e.target.value)}
              placeholder="Write the full memory story for when she clicks More Info..."
              className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Real Photo Upload to Supabase Storage */}
          <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-neutral-300 font-semibold">
                Photo & Backdrop (Cloud Upload)
              </label>
              <span className="text-[10px] text-neutral-400">
                Max 10MB · JPG, PNG, WEBP, GIF
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Permanent photo URL or cloud path"
                className="flex-1 bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none w-full"
              />

              <label className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer flex items-center justify-center gap-2 border border-white/10 shrink-0 transition-colors">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#ff4d5a]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-white" />
                    <span>Upload Device Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            {uploadSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadSuccess}</span>
              </p>
            )}

            {imageUrl && (
              <div className="relative aspect-video max-h-36 rounded-lg overflow-hidden border border-white/20 mt-2 bg-black">
                <img
                  src={imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Secret / Vault Toggle */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="w-4 h-4 accent-[#E50914] rounded"
              />
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#ff4d5a]" />
                Password-Protect in Secret Vault
              </span>
            </label>

            {isSecret && (
              <div className="mt-3">
                <label className="block text-neutral-300 font-semibold mb-1">
                  Private Love Letter Text
                </label>
                <textarea
                  rows={3}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Write your private message or letter here..."
                  className="w-full bg-black/50 border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold rounded-md shadow-lg transition-transform active:scale-95"
            >
              {memoryToEdit ? 'Save Changes' : 'Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
