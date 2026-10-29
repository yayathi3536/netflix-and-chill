import React, { useState, useEffect } from 'react';
import {
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
  Plus,
  Shield,
  Video,
  Film,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';
import { supabaseService, checkIsAdmin } from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Drawer } from './Drawer';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryItem) => void;
  memoryToEdit?: MemoryItem | null;
  onDeleteMemory?: (id: string, photoUrl?: string) => void;
  currentUser?: User | null;
  onOpenAdminModal?: () => void;
}

const resizeImage = async (file: File, maxWidth = 1920): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.height / img.width;
      const width = Math.min(img.width, maxWidth);
      const height = Math.round(width * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/jpeg',
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  memoryToEdit,
  onDeleteMemory,
  currentUser,
  onOpenAdminModal,
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
  const [videoUrl, setVideoUrl] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState('');
  const [videoUploadSuccess, setVideoUploadSuccess] = useState('');

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
      setVideoUrl(memoryToEdit.videoUrl || '');
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
    setVideoUrl('');
    setIsSecret(false);
    setLetterContent('');
    setUploadError('');
    setUploadSuccess('');
    setIsUploadingVideo(false);
    setVideoUploadError('');
    setVideoUploadSuccess('');
  };

  if (!isOpen) return null;

  const isAdmin = checkIsAdmin(currentUser || null);

  // If a visitor or non-admin attempts to access this modal, show strict access-denied gate
  if (!isAdmin) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-neutral-500/50 my-auto text-white p-6 sm:p-8 text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-neutral-700/20 border border-neutral-500 text-neutral-300 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white font-bold leading-tight">
            Administrator Access Required
          </h3>
          <p className="text-xs text-[#B3B3B3] leading-relaxed">
            Only the verified administrator can add, edit, or delete titles in Our Universe. Public visitors browse in read-only mode.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded bg-[#141414] hover:bg-white/10 border border-neutral-500/30 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            {onOpenAdminModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminModal();
                }}
                className="flex-1 py-2 px-4 rounded bg-white hover:bg-white/80 text-xs font-semibold text-black transition-colors cursor-pointer"
              >
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let uploadFile = file;
    if (file.type.startsWith('image/') && file.size > 500_000) {
      try {
        const resized = await resizeImage(file, 1920);
        uploadFile = new File([resized], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      } catch {
        uploadFile = file;
      }
    }

    if (!isAdmin) {
      setUploadError('Unauthorized: Only the verified administrator can upload media.');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    // If Supabase is configured, upload directly to Supabase Storage bucket 'memory-photos'
    if (isSupabaseConfigured()) {
      try {
        const { url, error } = await supabaseService.uploadPhoto(uploadFile);
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
      reader.readAsDataURL(uploadFile);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAdmin) {
      setVideoUploadError('Unauthorized: Only the verified administrator can upload videos.');
      return;
    }

    setVideoUploadError('');
    setVideoUploadSuccess('');
    setIsUploadingVideo(true);

    if (isSupabaseConfigured()) {
      try {
        const { url, error } = await supabaseService.uploadVideo(file);
        if (error) {
          setVideoUploadError(`Upload failed: ${error.message}`);
        } else if (url) {
          setVideoUrl(url);
          setVideoUploadSuccess('Video successfully uploaded to Supabase Storage!');
        }
      } catch (err) {
        setVideoUploadError((err as Error).message);
      } finally {
        setIsUploadingVideo(false);
        e.target.value = '';
      }
    } else {
      try {
        const localBlob = URL.createObjectURL(file);
        setVideoUrl(localBlob);
        setVideoUploadSuccess('Video loaded in local preview mode.');
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoUrl(reader.result as string);
          setVideoUploadSuccess('Video loaded in local preview mode.');
        };
        reader.onerror = () => {
          setVideoUploadError('Failed to read local video file.');
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingVideo(false);
        e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Unauthorized: Only the verified administrator can add or edit titles.');
      return;
    }
    if (!title.trim() || !synopsis.trim()) return;

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const hasLetterField = isSecret || category === 'secret-vault';

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
      videoUrl: videoUrl.trim() || undefined,
      fallbackGradient: memoryToEdit?.fallbackGradient || 'from-[#141414] via-[#181818] to-[#000000]',
      isInWatchlist: memoryToEdit ? memoryToEdit.isInWatchlist : true,
      isFavorite: memoryToEdit ? memoryToEdit.isFavorite : true,
      isSecret,
      secretPasscode: isSecret ? (memoryToEdit?.secretPasscode || '1402') : undefined,
      letterContent: hasLetterField && letterContent.trim() ? letterContent.trim() : memoryToEdit?.letterContent,
      progress: category === 'memories' ? (memoryToEdit?.progress ?? 10) : undefined,
      episodes: memoryToEdit?.episodes,
      coupons: memoryToEdit?.coupons,
      photos: memoryToEdit?.photos,
      listStatus: memoryToEdit?.listStatus,
    };

    onAddMemory(memoryData);
    onClose();
  };

  const handleDelete = () => {
    if (!isAdmin) {
      alert('Unauthorized: Only the verified administrator can delete titles.');
      return;
    }
    if (memoryToEdit && onDeleteMemory) {
      if (window.confirm(`Are you sure you want to delete "${memoryToEdit.title}"?`)) {
        onDeleteMemory(memoryToEdit.id, memoryToEdit.backdropUrl);
        onClose();
      }
    }
  };

  const isSupabaseReady = isSupabaseConfigured();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={memoryToEdit ? 'Edit Memory' : 'Add Memory'}
      subtitle={isSupabaseReady ? 'Syncs to Supabase' : 'Local storage'}
      width="lg"
    >
      <div className="p-5 sm:p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-700 flex items-center justify-center shadow-lg shadow-black/30">
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
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-700/20 rounded transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Delete this memory"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}

        {/* Admin notice if Supabase is connected but user is guest */}
        {isSupabaseReady && !currentUser && (
          <div className="p-3 mb-4 rounded bg-[#181818] border border-neutral-500/30 text-[#B3B3B3] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-300 shrink-0" />
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white focus:outline-none"
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
                className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
              className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
              className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>

          {/* Real Photo Upload to Supabase Storage */}
          <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-neutral-300 font-semibold">
                Photo & Backdrop
              </label>
              <span className="text-[10px] text-neutral-400">
                Max 10MB · JPG, PNG, WEBP, GIF
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <label className="w-full flex-1 py-3 px-4 bg-[#181818] hover:bg-[#202020] text-white rounded-lg cursor-pointer flex items-center justify-center gap-2.5 border border-neutral-500/30 hover:border-neutral-500 transition-all min-h-[44px] shadow-sm group">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                    <span className="font-semibold text-xs text-neutral-200">Uploading to Storage...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-neutral-300 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-xs text-white">Upload from Device</span>
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

              {imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                  }}
                  className="w-full sm:w-auto px-3.5 py-3 rounded-lg bg-black/60 hover:bg-neutral-700/20 border border-white/15 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 shrink-0"
                  title="Remove selected image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            {uploadSuccess && (
              <p className="text-xs text-white flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>{uploadSuccess}</span>
              </p>
            )}

            {imageUrl && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="relative aspect-video w-full max-h-52 rounded-md overflow-hidden border border-white/10 bg-black">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 25%' }}
                  />
                </div>
                <p className="text-[10px] text-neutral-500 text-center mt-1.5">
                  Cropped to 16:9 · Netflix card format
                </p>
              </div>
            )}
          </div>

          {/* Real Video Clip Upload to Supabase Storage (Device Only) */}
          <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <label className="block text-neutral-300 font-semibold flex items-center gap-1.5">
                <Video className="w-4 h-4 text-neutral-300" />
                <span>Video Clip (optional)</span>
              </label>
              <span className="text-[10px] text-neutral-400">
                Max 150MB · MP4, WebM, OGG, MOV
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <label className="w-full flex-1 py-3 px-4 bg-[#181818] hover:bg-[#202020] text-white rounded-lg cursor-pointer flex items-center justify-center gap-2.5 border border-neutral-500/30 hover:border-neutral-500 transition-all min-h-[44px] shadow-sm group">
                {isUploadingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                    <span className="font-semibold text-xs text-neutral-200">Uploading Video to Storage...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-neutral-300 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-xs text-white">Upload Video from Device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v"
                  disabled={isUploadingVideo}
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {videoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setVideoUrl('');
                    setVideoUploadSuccess('');
                  }}
                  className="w-full sm:w-auto px-3.5 py-3 rounded-lg bg-black/60 hover:bg-neutral-700/20 border border-white/15 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 shrink-0"
                  title="Remove uploaded video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Video</span>
                </button>
              )}
            </div>

            {videoUploadError && (
              <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{videoUploadError}</span>
              </p>
            )}

            {videoUploadSuccess && !videoUploadError && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{videoUploadSuccess}</span>
              </p>
            )}

            {/* Video Player Preview */}
            {videoUrl && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Uploaded Video Preview</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">16:9 Playback</span>
                </div>

                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  />
                </div>
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
                className="w-4 h-4 accent-white rounded"
              />
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-300" />
                Password-Protect in Secret Vault
              </span>
            </label>

            {(isSecret || category === 'secret-vault') && (
              <div className="mt-3">
                <label className="block text-neutral-300 font-semibold mb-1">
                  Private Love Letter Text
                </label>
                <textarea
                  rows={3}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Write your private message or letter here..."
                  className="w-full bg-black/50 border border-white/15 focus:border-neutral-500 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none"
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
            {isSupabaseReady && !currentUser ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAdminModal) onOpenAdminModal();
                }}
                className="px-6 py-2 bg-white hover:bg-white/80 text-black font-semibold rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Sign-In to Save</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-white hover:bg-white/80 disabled:opacity-50 text-black font-semibold rounded-md shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                {memoryToEdit ? 'Save Changes' : 'Save Memory'}
              </button>
            )}
          </div>
        </form>
      </div>
    </Drawer>
  );
};
