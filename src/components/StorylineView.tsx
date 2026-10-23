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
} from 'lucide-react';
import { MemoryItem } from '../types';
import { VisualArt } from './VisualArt';
import { hasValidVideo, isLetterItem } from '../utils/mediaHelpers';

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

  // Move a chapter directly to any exact position. This works without drag-and-drop.
  const handleMoveToPosition = (e: React.ChangeEvent<HTMLSelectElement>, fromIndex: number) => {
    e.stopPropagation();
    const targetIndex = Number(e.target.value) - 1;
    if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= items.length || targetIndex === fromIndex) {
      return;
    }

    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(targetIndex, 0, moved);
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
          <button
            type="button"
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
              isReorderMode
                ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#181818] text-[#FFFFFF] hover:bg-white/10 border border-[#808080]/30'
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
              <strong>Reorder Mode Active:</strong> Drag the grip, use the arrows, or choose an exact position from each chapter's <strong>Move to position</strong> menu. Click <strong>Save Order</strong> when finished.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((ch, idx) => {
          const isDragging = draggedIndex === idx;
          const isOver = dragOverIndex === idx && draggedIndex !== idx;
          const isVideo = hasValidVideo(ch);
          const isLetter = isLetterItem(ch);

          return (
            <div
              key={ch.id}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
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

              {/* 16:9 Aspect Ratio Media Area */}
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
                    {/* Move Earlier / Up Button */}
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

                    {/* Move Later / Down Button */}
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

                    {/* Dedicated Grip Handle Icon */}
                    <div
                      draggable={isReorderMode}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(e, idx);
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-white cursor-grab active:cursor-grabbing border-l border-white/10 pl-1"
                      title="Grab this handle and drag the chapter to any position"
                      aria-label={`Drag Episode ${idx + 1} to reorder`}
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

                {/* Cover Image */}
                <VisualArt
                  id={ch.id}
                  category={ch.category}
                  title={ch.title}
                  imageUrl={ch.backdropUrl || ch.posterUrl}
                  fit="auto"
                  aspectRatio="16/9"
                  fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
                  className="w-full h-full object-contain transition-transform duration-500"
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

                {isReorderMode && (
                  <div className="pt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <label htmlFor={`story-position-${ch.id}`} className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 shrink-0">
                      Move to position
                    </label>
                    <select
                      id={`story-position-${ch.id}`}
                      value={idx + 1}
                      onChange={(e) => handleMoveToPosition(e, idx)}
                      disabled={isSaving}
                      className="min-w-0 flex-1 rounded-md border border-[#555] bg-[#080808] px-2 py-2 text-xs font-semibold text-white outline-none focus:border-[#E50914] disabled:opacity-50"
                      aria-label={`Move ${ch.title} to position`}
                    >
                      {items.map((option, optionIndex) => (
                        <option key={option.id} value={optionIndex + 1}>
                          {optionIndex + 1}. {option.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
    </div>
  );
};
