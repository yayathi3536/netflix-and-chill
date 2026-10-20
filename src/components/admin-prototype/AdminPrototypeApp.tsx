import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  ArrowLeft,
  X,
  Bell,
  CheckCircle2,
  Calendar,
  MapPin,
  Film,
} from 'lucide-react';
import {
  AdminTab,
  PrototypeMemory,
  PrototypePhoto,
  PrototypeLetter,
  PrototypeChapter,
  PrototypeSiteContent,
  PrototypeCoupon,
  PrototypeActivity,
  PrototypeToast,
  PrototypeSettings,
} from './types';
import {
  INITIAL_MOCK_MEMORIES,
  INITIAL_MOCK_PHOTOS,
  INITIAL_MOCK_LETTERS,
  INITIAL_MOCK_CHAPTERS,
  INITIAL_MOCK_SITE_CONTENT,
  INITIAL_MOCK_COUPONS,
  INITIAL_MOCK_ACTIVITIES,
  DEFAULT_PROTOTYPE_SETTINGS,
} from './mockData';
import { Sidebar } from './Sidebar';
import { ToastContainer } from './ToastContainer';
import { ConfirmationModal } from './ConfirmationModal';
import { OverviewTab } from './OverviewTab';
import { MemoriesTab } from './MemoriesTab';
import { PhotoGalleryTab } from './PhotoGalleryTab';
import { LoveLettersTab } from './LoveLettersTab';
import { StoryChaptersTab } from './StoryChaptersTab';
import { SiteContentTab } from './SiteContentTab';
import { CouponsTab } from './CouponsTab';
import { SettingsTab } from './SettingsTab';
import { PreviewWebsiteTab } from './PreviewWebsiteTab';

interface AdminPrototypeAppProps {
  onExit: () => void;
}

export const AdminPrototypeApp: React.FC<AdminPrototypeAppProps> = ({ onExit }) => {
  // Navigation & Layout State
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // In-Memory Prototype State
  const [memories, setMemories] = useState<PrototypeMemory[]>(INITIAL_MOCK_MEMORIES);
  const [photos, setPhotos] = useState<PrototypePhoto[]>(INITIAL_MOCK_PHOTOS);
  const [letters, setLetters] = useState<PrototypeLetter[]>(INITIAL_MOCK_LETTERS);
  const [chapters, setChapters] = useState<PrototypeChapter[]>(INITIAL_MOCK_CHAPTERS);
  const [siteContent, setSiteContent] = useState<PrototypeSiteContent>(INITIAL_MOCK_SITE_CONTENT);
  const [coupons, setCoupons] = useState<PrototypeCoupon[]>(INITIAL_MOCK_COUPONS);
  const [activities, setActivities] = useState<PrototypeActivity[]>(INITIAL_MOCK_ACTIVITIES);
  const [settings, setSettings] = useState<PrototypeSettings>(DEFAULT_PROTOTYPE_SETTINGS);

  // Modals & Overlays
  const [toasts, setToasts] = useState<PrototypeToast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [selectedMemoryPreview, setSelectedMemoryPreview] = useState<PrototypeMemory | null>(null);

  // Quick Action Triggers
  const [triggerAddMemory, setTriggerAddMemory] = useState(false);
  const [triggerAddPhoto, setTriggerAddPhoto] = useState(false);
  const [triggerAddLetter, setTriggerAddLetter] = useState(false);
  const [triggerAddChapter, setTriggerAddChapter] = useState(false);

  // Toast Helper
  const showToast = (type: PrototypeToast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (
    action: PrototypeActivity['action'],
    targetType: PrototypeActivity['targetType'],
    targetTitle: string
  ) => {
    const newAct: PrototypeActivity = {
      id: `act-${Date.now()}`,
      action,
      targetType,
      targetTitle,
      timestamp: 'Just now',
      badgeColor:
        action === 'create'
          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          : action === 'update'
          ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
          : 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 7)]);
  };

  // 1. MEMORY HANDLERS
  const handleSaveMemory = (memory: PrototypeMemory) => {
    const exists = memories.some((m) => m.id === memory.id);
    if (exists) {
      setMemories((prev) => prev.map((m) => (m.id === memory.id ? memory : m)));
      addActivity('update', 'Memory', memory.title);
      showToast(
        'success',
        'Memory Updated',
        `"${memory.title}" updated in prototype memory.`
      );
    } else {
      setMemories((prev) => [memory, ...prev]);
      addActivity('create', 'Memory', memory.title);
      showToast(
        'success',
        'Memory Saved to Prototype',
        `"${memory.title}" was saved to local in-memory prototype (no database changes).`
      );
    }
  };

  const handleDeleteMemory = (id: string) => {
    const target = memories.find((m) => m.id === id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      addActivity('delete', 'Memory', target.title);
      showToast('info', 'Memory Removed', `"${target.title}" was removed from the prototype.`);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // 2. PHOTO HANDLERS
  const handleSavePhoto = (photo: PrototypePhoto) => {
    const exists = photos.some((p) => p.id === photo.id);
    if (exists) {
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
      addActivity('update', 'Photo', photo.title);
      showToast('success', 'Photo Metadata Updated', `"${photo.title}" updated.`);
    } else {
      setPhotos((prev) => [photo, ...prev]);
      addActivity('create', 'Photo', photo.title);
      showToast(
        'success',
        'Photo Added to Prototype Gallery',
        `"${photo.title}" added to local preview.`
      );
    }
  };

  const handleDeletePhoto = (id: string) => {
    const target = photos.find((p) => p.id === id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addActivity('delete', 'Photo', target.title);
      showToast('info', 'Photo Removed', `"${target.title}" was removed from the prototype.`);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // 3. LETTER HANDLERS
  const handleSaveLetter = (letter: PrototypeLetter) => {
    const exists = letters.some((l) => l.id === letter.id);
    if (exists) {
      setLetters((prev) => prev.map((l) => (l.id === letter.id ? letter : l)));
      addActivity('update', 'Letter', letter.title);
      showToast('success', 'Letter Updated', `"${letter.title}" saved.`);
    } else {
      setLetters((prev) => [letter, ...prev]);
      addActivity('create', 'Letter', letter.title);
      showToast('success', 'Letter Created', `"${letter.title}" preserved in vault.`);
    }
  };

  const handleDeleteLetter = (id: string) => {
    const target = letters.find((l) => l.id === id);
    setLetters((prev) => prev.filter((l) => l.id !== id));
    if (target) {
      addActivity('delete', 'Letter', target.title);
      showToast('info', 'Letter Removed', `"${target.title}" was deleted.`);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // 4. CHAPTER HANDLERS
  const handleSaveChapter = (chapter: PrototypeChapter) => {
    const exists = chapters.some((c) => c.id === chapter.id);
    if (exists) {
      setChapters((prev) => prev.map((c) => (c.id === chapter.id ? chapter : c)));
      addActivity('update', 'Chapter', chapter.title);
      showToast('success', 'Chapter Updated', `"${chapter.title}" saved.`);
    } else {
      setChapters((prev) => [...prev, chapter]);
      addActivity('create', 'Chapter', chapter.title);
      showToast('success', 'Story Chapter Added', `Episode ${chapter.order} created.`);
    }
  };

  const handleReorderChapters = (reordered: PrototypeChapter[]) => {
    setChapters(reordered);
    showToast('info', 'Timeline Reordered', 'Chapter sequence updated successfully.');
  };

  const handleDeleteChapter = (id: string) => {
    const target = chapters.find((c) => c.id === id);
    const updated = chapters
      .filter((c) => c.id !== id)
      .map((c, i) => ({ ...c, order: i + 1 }));
    setChapters(updated);
    if (target) {
      addActivity('delete', 'Chapter', target.title);
      showToast('info', 'Chapter Removed', `"${target.title}" deleted.`);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // 5. SITE CONTENT HANDLERS
  const handleSaveSiteContent = (content: PrototypeSiteContent) => {
    setSiteContent(content);
    addActivity('update', 'Content', 'Site Content & Headings');
    showToast(
      'success',
      'Site Content Saved',
      'Hero billboard & category headings updated in prototype.'
    );
  };

  // 6. COUPON HANDLERS
  const handleSaveCoupon = (coupon: PrototypeCoupon) => {
    const exists = coupons.some((c) => c.id === coupon.id);
    if (exists) {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
      addActivity('update', 'Coupon', coupon.title);
      showToast('success', 'Coupon Updated', `"${coupon.title}" saved.`);
    } else {
      setCoupons((prev) => [coupon, ...prev]);
      addActivity('create', 'Coupon', coupon.title);
      showToast('success', 'New Coupon Created', `"${coupon.title}" voucher active.`);
    }
  };

  const handleToggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'redeemed' : 'active' }
          : c
      )
    );
    showToast('info', 'Coupon Status Toggled', 'Coupon status changed.');
  };

  const handleDeleteCoupon = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      addActivity('delete', 'Coupon', target.title);
      showToast('info', 'Coupon Removed', `"${target.title}" deleted.`);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // 7. RESET ALL PROTOTYPE DATA
  const handleResetAllPrototypeData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset All Prototype Demonstration Data?',
      message:
        'This will restore all memories, photos, letters, chapters, and coupons back to their initial demonstration values. Live databases are never touched.',
      onConfirm: () => {
        setMemories(INITIAL_MOCK_MEMORIES);
        setPhotos(INITIAL_MOCK_PHOTOS);
        setLetters(INITIAL_MOCK_LETTERS);
        setChapters(INITIAL_MOCK_CHAPTERS);
        setSiteContent(INITIAL_MOCK_SITE_CONTENT);
        setCoupons(INITIAL_MOCK_COUPONS);
        setActivities(INITIAL_MOCK_ACTIVITIES);
        setSettings(DEFAULT_PROTOTYPE_SETTINGS);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Prototype Reset', 'All demonstration fixtures restored.');
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col md:flex-row font-sans selection:bg-[#E50914] selection:text-white">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onExitPrototype={onExit}
        counts={{
          memories: memories.length,
          photos: photos.length,
          letters: letters.length,
          chapters: chapters.length,
          coupons: coupons.length,
        }}
      />

      {/* MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto dark-scrollbar">
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-20 px-4 sm:px-8 py-3.5 bg-[#121212]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#E50914]">
                OUR UNIVERSE
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-xs font-semibold text-neutral-300 capitalize">
                {currentTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Demonstration tag */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Isolated Prototype Mode</span>
            </div>

            {/* Quick Return to Live Site */}
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/30 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="hidden sm:inline">Return to Website</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <OverviewTab
              memories={memories}
              photos={photos}
              letters={letters}
              chapters={chapters}
              activities={activities}
              onNavigateTab={setCurrentTab}
              onOpenAddMemory={() => setCurrentTab('memories')}
              onOpenAddPhoto={() => setCurrentTab('photos')}
              onOpenAddLetter={() => setCurrentTab('letters')}
              onOpenAddChapter={() => setCurrentTab('chapters')}
              onSelectMemoryPreview={(mem) => setSelectedMemoryPreview(mem)}
            />
          )}

          {currentTab === 'memories' && (
            <MemoriesTab
              memories={memories}
              onSaveMemory={handleSaveMemory}
              onDeleteMemory={handleDeleteMemory}
              onRequestDelete={(id, title) =>
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete Memory?',
                  message: `Are you sure you want to remove "${title}"? This prototype action cannot be undone.`,
                  onConfirm: () => handleDeleteMemory(id),
                })
              }
              onPreviewMemory={(mem) => setSelectedMemoryPreview(mem)}
            />
          )}

          {currentTab === 'photos' && (
            <PhotoGalleryTab
              photos={photos}
              onSavePhoto={handleSavePhoto}
              onRequestDeletePhoto={(id, title) =>
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete Photo from Gallery?',
                  message: `Are you sure you want to remove "${title}"?`,
                  onConfirm: () => handleDeletePhoto(id),
                })
              }
            />
          )}

          {currentTab === 'letters' && (
            <LoveLettersTab
              letters={letters}
              onSaveLetter={handleSaveLetter}
              onRequestDeleteLetter={(id, title) =>
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete Love Letter?',
                  message: `Are you sure you want to delete "${title}"?`,
                  onConfirm: () => handleDeleteLetter(id),
                })
              }
            />
          )}

          {currentTab === 'chapters' && (
            <StoryChaptersTab
              chapters={chapters}
              onSaveChapter={handleSaveChapter}
              onReorderChapters={handleReorderChapters}
              onRequestDeleteChapter={(id, title) =>
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete Story Chapter?',
                  message: `Are you sure you want to remove "${title}" from the timeline?`,
                  onConfirm: () => handleDeleteChapter(id),
                })
              }
            />
          )}

          {currentTab === 'site-content' && (
            <SiteContentTab
              content={siteContent}
              onSaveContent={handleSaveSiteContent}
              onResetContent={() => {
                setSiteContent(INITIAL_MOCK_SITE_CONTENT);
                showToast('info', 'Reset', 'Site content reset to default demonstration copy.');
              }}
            />
          )}

          {currentTab === 'coupons' && (
            <CouponsTab
              coupons={coupons}
              onSaveCoupon={handleSaveCoupon}
              onToggleCouponStatus={handleToggleCoupon}
              onRequestDeleteCoupon={(id, title) =>
                setConfirmDialog({
                  isOpen: true,
                  title: 'Delete Love Coupon?',
                  message: `Are you sure you want to remove "${title}"?`,
                  onConfirm: () => handleDeleteCoupon(id),
                })
              }
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onUpdateSettings={setSettings}
              onResetAllData={handleResetAllPrototypeData}
            />
          )}

          {currentTab === 'preview' && (
            <PreviewWebsiteTab
              siteContent={siteContent}
              memories={memories}
              photos={photos}
              letters={letters}
              chapters={chapters}
              coupons={coupons}
              onReturnToDashboard={() => setCurrentTab('overview')}
            />
          )}
        </main>
      </div>

      {/* TOAST SYSTEM */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* CONFIRMATION DIALOG */}
      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* MEMORY PREVIEW MODAL */}
      {selectedMemoryPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMemoryPreview(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161616] border border-white/15 rounded-2xl overflow-hidden shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto dark-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMemoryPreview(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedMemoryPreview.coverUrl && (
              <div className="relative aspect-video max-h-64 w-full bg-black overflow-hidden">
                <img
                  src={selectedMemoryPreview.coverUrl}
                  alt={selectedMemoryPreview.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-[#E50914] text-white font-bold text-[10px]">
                  {selectedMemoryPreview.matchScore}% Match
                </span>
                <span className="capitalize">{selectedMemoryPreview.category.replace('-', ' ')}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E50914]" /> {selectedMemoryPreview.date}
                </span>
                {selectedMemoryPreview.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E50914]" /> {selectedMemoryPreview.location}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white tracking-wide">
                {selectedMemoryPreview.title}
              </h2>

              <p className="text-sm font-semibold text-neutral-300 italic">
                {selectedMemoryPreview.synopsis}
              </p>

              <div className="pt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed font-light whitespace-pre-wrap">
                {selectedMemoryPreview.fullStory}
              </div>

              {selectedMemoryPreview.tags.length > 0 && (
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                  {selectedMemoryPreview.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
