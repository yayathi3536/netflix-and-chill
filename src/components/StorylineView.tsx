import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
  Calendar,
  Lock,
  Mail,
  Edit3,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { hasValidVideo, isLetterItem, getMemoryImageUrl } from '../utils/mediaHelpers';

interface StorylineViewProps {
  stories: MemoryItem[];
  onReorder: (newOrderedStories: MemoryItem[]) => Promise<{ success: boolean; error?: string }>;
  onSelectStory: (story: MemoryItem) => void;
  onPlayStory: (story: MemoryItem) => void;
  onToggleWatchlist: (id: string) => void;
  onUnlockVault?: (story: MemoryItem) => void;
  onEditStory?: (story: MemoryItem) => void;
  isAdmin?: boolean;
}

export const StorylineView: React.FC<StorylineViewProps> = ({
  stories,
  onReorder,
  onSelectStory,
  onPlayStory,
  onToggleWatchlist,
  onUnlockVault,
  onEditStory,
  isAdmin = false,
}) => {
  // Local working copy of stories
  const [items, setItems] = useState<MemoryItem[]>(stories);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [viewMode, setViewMode] = useState<'posters' | 'episodes'>('posters');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Synchronize when external stories change (and no unsaved changes exist)
  useEffect(() => {
    if (!hasChanges) {
      setItems(stories);
    }
  }, [stories, hasChanges]);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    // only reset if leaving the entire list or drop target
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...items];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, removed);

    setItems(updated);
    setHasChanges(true);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setSaveStatus(null);
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch & Keyboard accessibility: Move Up (Earlier)
  const handleMoveUp = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (index <= 0) return;
    const updated = [...items];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;

    setItems(updated);
    setHasChanges(true);
    setSaveStatus(null);
  };

  // Touch & Keyboard accessibility: Move Down (Later)
  const handleMoveDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (index >= items.length - 1) return;
    const updated = [...items];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;

    setItems(updated);
    setHasChanges(true);
    setSaveStatus(null);
  };

  // Save changes persistently
  const handleSaveOrder = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const result = await onReorder(items);
      if (result.success) {
        setHasChanges(false);
        setSaveStatus({
          type: 'success',
          message: 'Storyline order saved successfully across all devices!',
        });
        setTimeout(() => {
          setSaveStatus(null);
        }, 3500);
      } else {
        setSaveStatus({
          type: 'error',
          message: result.error || 'Failed to sync custom order to database. Changes are preserved locally.',
        });
      }
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: (err as Error).message || 'An unexpected error occurred while saving storyline order.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset order back to currently saved
  const handleResetOrder = () => {
    setItems(stories);
    setHasChanges(false);
    setSaveStatus(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-8 bg-[#000000]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#181818] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORIGINAL SERIES · CUSTOM STORYLINE</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-6xl text-[#FFFFFF] font-black tracking-wider uppercase">
            Episodes of Us
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-2xl mt-1.5">
            Every milestone chapter organized in your customized storytelling sequence. Drag or use arrows to arrange the flow of your journey.
          </p>
        </div>

        {/* Storyline Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher: Netflix Posters (Homepage Style) vs Episode Details */}
          <div className="flex items-center bg-[#141414] p-1 rounded-lg border border-white/10 min-h-[44px]">
            <button
              type="button"
              onClick={() => setViewMode('posters')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[34px] ${
                viewMode === 'posters'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-[#B3B3B3] hover:text-white hover:bg-white/5'
              }`}
              title="View as Netflix Poster Cards (Homepage Storyline reference)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Posters</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('episodes')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[34px] ${
                viewMode === 'episodes'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-[#B3B3B3] hover:text-white hover:bg-white/5'
              }`}
              title="View as Episode Cards with full synopsis"
            >
              <List className="w-3.5 h-3.5" />
              <span>Episodes</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
              isReorderMode
                ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#181818] text-[#FFFFFF] hover:bg-white/10 border border-white/10 hover:border-white/20'
            }`}
            title="Toggle drag-and-drop reordering controls"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isReorderMode ? 'Done Reordering' : 'Reorder Chapters'}</span>
          </button>

          {hasChanges && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveOrder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 min-h-[44px] shadow-lg shadow-[#E50914]/30"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Order</span>
                </>
              )}
            </button>
          )}

          {hasChanges && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleResetOrder}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#181818] hover:bg-white/10 text-[#B3B3B3] hover:text-white border border-[#808080]/30 text-xs transition-colors cursor-pointer min-h-[44px]"
              title="Reset unsaved changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Notification / Alert Banner */}
      {saveStatus && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            saveStatus.type === 'success'
              ? 'bg-[#141414] border border-[#E50914] text-white'
              : 'bg-[#181818] border border-[#E50914] text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
            )}
            <span>{saveStatus.message}</span>
          </div>

          {saveStatus.type === 'error' && (
            <button
              type="button"
              onClick={handleSaveOrder}
              className="px-3 py-1 bg-[#E50914] hover:bg-[#b80710] text-white rounded text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
            >
              Retry Save
            </button>
          )}
        </div>
      )}

      {/* Active Reordering Mode Notice Banner */}
      {isReorderMode && (
        <div className="p-3.5 rounded-xl bg-[#141414] border border-[#E50914]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <GripVertical className="w-4 h-4 text-[#E50914] shrink-0" />
            <span>
              <strong>Reorder Mode Active:</strong> Drag cards using the handle icon or tap the &uarr; / &darr; arrows to move chapters earlier or later. Click <strong>Save Order</strong> when finished.
            </span>
          </div>
          {hasChanges && (
            <span className="text-[11px] font-semibold text-[#E50914] uppercase tracking-wider shrink-0">
              Unsaved changes pending
            </span>
          )}
        </div>
      )}

      {/* Chapters Grid / List with Drag & Drop */}
      {viewMode === 'posters' ? (
        /* POSTER CARDS VIEW (Homepage Storyline reference style with complete portrait visibility) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((ch, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && draggedIndex !== idx;
            const isVideo = hasValidVideo(ch);
            const isLetter = isLetterItem(ch);

            return (
              <div
                key={ch.id}
                draggable={isReorderMode}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!isReorderMode) {
                    onSelectStory(ch);
                  }
                }}
                className={`group relative rounded-lg overflow-hidden bg-[#141414] border transition-all duration-300 shadow-xl flex flex-col justify-between ${
                  isDragging
                    ? 'opacity-40 scale-[0.97] border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.5)] cursor-grabbing z-30'
                    : isOver
                    ? 'border-2 border-[#E50914] scale-[1.03] shadow-[0_0_25px_rgba(229,9,20,0.4)] z-20'
                    : 'border-[#181818] hover:border-[#808080]/60 hover:scale-[1.03] hover:shadow-2xl'
                } ${isReorderMode ? 'cursor-grab select-none' : 'cursor-pointer'}`}
              >
                {/* Poster Media Container: aspect-[2/3] matching Netflix standard poster frame */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#000000]">
                  <VisualArt
                    id={ch.id}
                    category={ch.category}
                    title={ch.title}
                    imageUrl={getMemoryImageUrl(ch, 'poster')}
                    variant="poster"
                    aspectRatio="2/3"
                    focalPosition="top"
                    fit="auto"
                    fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                    className="w-full h-full"
                  />

                  {/* Top Badge: Netflix N & Episode number */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-[#E50914] flex items-center justify-center font-bebas text-xs font-black text-[#FFFFFF] shadow">
                      N
                    </span>
                    <span className="font-bebas text-xs px-2 py-0.5 rounded bg-black/80 text-white font-bold uppercase tracking-wider border border-white/20 shadow">
                      EP {idx + 1}
                    </span>
                    {ch.isSecret && (
                      <span className="p-1 rounded bg-black/80 text-white border border-white/20 shadow">
                        <Lock className="w-3 h-3 text-[#E50914]" />
                      </span>
                    )}
                  </div>

                  {/* Reorder Controls in Poster Mode */}
                  {isReorderMode && (
                    <div
                      className="absolute top-2.5 right-2.5 z-30 flex items-center gap-0.5 bg-[#000000]/90 backdrop-blur-sm p-1 rounded-lg border border-[#808080]/40 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => handleMoveUp(e, idx)}
                        className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move earlier"
                      >
                        <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={(e) => handleMoveDown(e, idx)}
                        className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Move later"
                      >
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <div className="w-7 h-7 flex items-center justify-center text-red-500 hover:text-white cursor-grab active:cursor-grabbing border-l border-white/10 pl-0.5">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}

                  {/* Admin Quick Edit Button when not reordering */}
                  {!isReorderMode && isAdmin && onEditStory && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStory(ch);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/80 hover:bg-[#E50914] text-white border border-white/30 flex items-center justify-center transition-colors shadow cursor-pointer"
                      title="Edit chapter content & artwork"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}

                  {/* Drop Target Top Indicator */}
                  {isOver && (
                    <div
                      className="absolute inset-x-0 top-0 h-1.5 bg-[#E50914] z-40 rounded-t shadow-[0_0_12px_#E50914] animate-pulse"
                      aria-hidden="true"
                    />
                  )}

                  {/* Bottom Cinematic Scrim with Chapter Meta */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/60 to-transparent p-3 pt-10 z-20 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-[10px] text-[#B3B3B3] font-semibold mb-1">
                      <span>{ch.date}</span>
                      <span className="text-white font-bold">{ch.matchScore}% Match</span>
                    </div>

                    <h3 className="font-bebas text-lg sm:text-xl text-[#FFFFFF] font-bold leading-tight drop-shadow uppercase tracking-wide line-clamp-2">
                      {ch.title}
                    </h3>

                    {ch.subtitle && (
                      <p className="text-[10px] text-[#B3B3B3] line-clamp-1 mt-0.5">
                        {ch.subtitle}
                      </p>
                    )}

                    {/* Quick Action Button on Hover */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                      {isVideo ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayStory(ch);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white text-black font-bold text-[11px] hover:bg-[#B3B3B3] transition-colors cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-black" />
                          <span>Play</span>
                        </button>
                      ) : isLetter && onUnlockVault ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnlockVault(ch);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E50914] text-white font-bold text-[11px] hover:bg-[#b80710] transition-colors cursor-pointer"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          <span>Letter</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#808080] font-semibold uppercase">
                          {ch.duration || 'Chapter'}
                        </span>
                      )}

                      {isReorderMode && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EPISODE DETAILS VIEW (Wide Cards with full synopsis and ambient photo backdrop) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((ch, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && draggedIndex !== idx;
            const isVideo = hasValidVideo(ch);
            const isLetter = isLetterItem(ch);

            return (
              <div
                key={ch.id}
                draggable={isReorderMode}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (!isReorderMode) {
                    onSelectStory(ch);
                  }
                }}
                className={`relative bg-[#141414] rounded-lg overflow-hidden border transition-all duration-200 flex flex-col justify-between shadow-xl ${
                  isDragging
                    ? 'opacity-40 scale-[0.98] border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.5)] cursor-grabbing z-30'
                    : isOver
                    ? 'border-2 border-[#E50914] scale-[1.02] shadow-[0_0_25px_rgba(229,9,20,0.4)] z-20'
                    : 'border-[#181818] hover:border-[#808080]/60'
                } ${isReorderMode ? 'cursor-grab select-none' : 'cursor-pointer hover:scale-[1.02]'}`}
              >
                {/* Drop Target Top Indicator */}
                {isOver && (
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 bg-[#E50914] z-40 rounded-t shadow-[0_0_12px_#E50914] animate-pulse"
                    aria-hidden="true"
                  />
                )}

                {/* Media Area — Preserves Complete Original Photo in 16:9 Cinematic Video Frame with ambient backdrop */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#000000]">
                  {/* Episode Badge (Reflects live reordered index!) */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className="font-bebas text-xs px-2.5 py-1 rounded bg-[#E50914] text-[#FFFFFF] font-black uppercase tracking-wider shadow">
                      Episode {idx + 1}
                    </span>
                    {ch.isSecret && (
                      <span className="p-1 rounded bg-black/70 text-white border border-white/20 shadow">
                        <Lock className="w-3 h-3 text-[#E50914]" />
                      </span>
                    )}
                  </div>

                  {/* Drag Handle & Reorder Arrow Controls (Top Right) */}
                  {isReorderMode && (
                    <div
                      className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 bg-[#000000]/90 backdrop-blur-sm p-1 rounded-lg border border-[#808080]/40 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => handleMoveUp(e, idx)}
                        className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer min-h-[32px] min-w-[32px]"
                        title="Move this chapter earlier in the storyline"
                        aria-label="Move episode earlier"
                      >
                        <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={(e) => handleMoveDown(e, idx)}
                        className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer min-h-[32px] min-w-[32px]"
                        title="Move this chapter later in the storyline"
                        aria-label="Move episode later"
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <div
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-white cursor-grab active:cursor-grabbing border-l border-white/10 pl-1"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Admin Quick Edit Button when not reordering */}
                  {!isReorderMode && isAdmin && onEditStory && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStory(ch);
                      }}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-[#E50914] text-white border border-white/30 flex items-center justify-center transition-colors shadow cursor-pointer"
                      title="Edit chapter content & artwork"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Cover Image using variant="episode" and focalPosition="center" */}
                  <VisualArt
                    id={ch.id}
                    category={ch.category}
                    title={ch.title}
                    imageUrl={getMemoryImageUrl(ch, 'landscape')}
                    variant="episode"
                    aspectRatio="16/9"
                    focalPosition="center"
                    fit="auto"
                    fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                    className="w-full h-full"
                  />
                </div>

                {/* Story Details Card Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#808080] font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#808080]" />
                        <span>{ch.date}</span>
                      </span>
                      <span className="text-[#FFFFFF] font-bold">{ch.matchScore}% Match</span>
                    </div>

                    <h3 className="font-bebas text-xl text-[#FFFFFF] font-bold leading-tight uppercase tracking-wide">
                      {ch.title}
                    </h3>

                    {ch.subtitle && (
                      <p className="text-[11px] text-[#B3B3B3] font-medium line-clamp-1">
                        {ch.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-[#B3B3B3] line-clamp-3 leading-relaxed pt-1">
                      {ch.synopsis}
                    </p>
                  </div>

                  {/* Quick Action Footers */}
                  <div className="pt-3 border-t border-[#181818] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {isVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayStory(ch);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-[#B3B3B3] transition-colors cursor-pointer min-h-[36px]"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Play</span>
                        </button>
                      )}

                      {isLetter && onUnlockVault && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnlockVault(ch);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E50914] text-white font-bold text-xs hover:bg-[#b80710] transition-colors cursor-pointer min-h-[36px]"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Read</span>
                        </button>
                      )}

                      <span className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">
                        {ch.duration}
                      </span>
                    </div>

                    {isReorderMode && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        #{idx + 1} of {items.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
