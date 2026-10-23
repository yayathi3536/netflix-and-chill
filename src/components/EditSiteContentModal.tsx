import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Heart,
  Sparkles,
  Lock,
  Type,
  FileText,
  Sliders,
  Calendar,
  Users,
  Video,
} from 'lucide-react';
import { SiteContentMap, SiteContentSection } from '../types';
import { storageService } from '../services/storage';
import { supabaseService } from '../services/supabaseService';
import { DEFAULT_SITE_CONTENT_LIST, DEFAULT_SITE_CONTENT_MAP } from '../data/defaultSiteContent';
import { isVideoUrl } from '../utils/mediaHelpers';
import { Drawer } from './Drawer';

interface EditSiteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteContent: SiteContentMap;
  onUpdateSiteContent: (newContent: SiteContentMap) => void;
  initialSection?: SiteContentSection;
}

export const EditSiteContentModal: React.FC<EditSiteContentModalProps> = ({
  isOpen,
  onClose,
  siteContent,
  onUpdateSiteContent,
  initialSection = 'hero',
}) => {
  const [activeTab, setActiveTab] = useState<SiteContentSection>(initialSection);
  const [formData, setFormData] = useState<SiteContentMap>({ ...DEFAULT_SITE_CONTENT_MAP, ...siteContent });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [heroFit, setHeroFit] = useState<'cover' | 'contain'>('cover');

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...DEFAULT_SITE_CONTENT_MAP, ...siteContent });
      setActiveTab(initialSection);
      setStatusMsg(null);
    }
  }, [isOpen, siteContent, initialSection]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setStatusMsg(null);

    try {
      const { url, error, mediaType } = await supabaseService.uploadMedia(file);
      if (error) {
        setStatusMsg({ text: `Upload failed: ${error.message}`, type: 'error' });
      } else if (url) {
        handleChange(targetKey, url);
        setStatusMsg({
          text: `${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully to Supabase Storage!`,
          type: 'success',
        });
      }
    } catch (err) {
      setStatusMsg({ text: `Upload error: ${(err as Error).message}`, type: 'error' });
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      // Prepare batch update dictionary
      const entriesToUpdate: Record<string, { value: string; section?: string }> = {};
      DEFAULT_SITE_CONTENT_LIST.forEach((item) => {
        if (formData[item.key] !== undefined) {
          entriesToUpdate[item.key] = {
            value: formData[item.key],
            section: item.section,
          };
        }
      });

      const { success, error } = await storageService.saveSiteContentBatch(entriesToUpdate);
      if (success) {
        onUpdateSiteContent(formData);
        setStatusMsg({ text: 'All site content & letters successfully saved to Supabase!', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMsg({ text: `Save failed: ${error || 'Unknown error'}`, type: 'error' });
      }
    } catch (err) {
      setStatusMsg({ text: `Save error: ${(err as Error).message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Content & Letter Studio"
      subtitle="Customize site content, letters, media, and sections"
      width="lg"
    >
      <div className="flex min-h-0 flex-1 flex-col text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white font-bold leading-none">
                Admin Content & Letter Studio
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Customize billboard headlines, handwritten love letters, media, and secrets in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 min-h-[44px] min-w-[44px] shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>


        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-white/10 bg-[#141414] overflow-x-auto dark-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'border-[#E50914] text-white bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4 text-[#E50914]" />
            <span>Hero Billboard & Media</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('letter')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'letter'
                ? 'border-[#E50914] text-white bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-[#E50914]" />
            <span>Personal Love Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('couple')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'couple'
                ? 'border-[#E50914] text-white bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-white" />
            <span>Couple Info & Passcode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sections'
                ? 'border-[#E50914] text-white bg-white/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#B3B3B3]" />
            <span>Section Headings</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto dark-scrollbar p-4 sm:p-6 space-y-6">
          {/* Status Alert Banner */}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
                statusMsg.type === 'success'
                  ? 'bg-[#181818] border border-[#E50914] text-white'
                  : 'bg-[#181818] border border-[#E50914] text-white'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: HERO BILLBOARD & MEDIA */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-neutral-300">
                Configure the grand Netflix hero billboard showcased at the top of the homepage.
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Billboard Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  placeholder="The Story of Us"
                  className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-white placeholder-neutral-500 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Billboard Subtitle / Season
                  </label>
                  <input
                    type="text"
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    placeholder="Chapter Infinity: Our Forever Run"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Ribbon Badge
                  </label>
                  <input
                    type="text"
                    value={formData.hero_badge || ''}
                    onChange={(e) => handleChange('hero_badge', e.target.value)}
                    placeholder="#1 in Our Hearts Today"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Billboard Synopsis & Story Intro
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.hero_synopsis || ''}
                  onChange={(e) => handleChange('hero_synopsis', e.target.value)}
                  placeholder="From an unexpected first conversation to building our whole universe together..."
                  className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-white placeholder-neutral-500 text-xs leading-relaxed focus:outline-none"
                />
              </div>

              {/* Custom Hero Backdrop Photo or Video Upload (Device Only) */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3">
                <label className="block text-xs font-semibold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {isVideoUrl(formData.hero_backdrop_url) ? (
                      <Video className="w-4 h-4 text-[#E50914]" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-[#E50914]" />
                    )}
                    <span>Hero Backdrop Media (Custom Photo or Video from Device)</span>
                  </span>
                  {isUploadingPhoto && (
                    <span className="text-[11px] text-[#B3B3B3] font-normal">
                      Uploading to Supabase Storage...
                    </span>
                  )}
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <label className="w-full flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer border border-white/10 shrink-0 min-h-[44px]">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                    <span>Upload Media from Device</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'hero_backdrop_url')}
                      disabled={isUploadingPhoto}
                    />
                  </label>

                  {formData.hero_backdrop_url && (
                    <button
                      type="button"
                      onClick={() => handleChange('hero_backdrop_url', '')}
                      className="w-full sm:w-auto px-3.5 py-3 rounded-lg bg-black/60 hover:bg-[#E50914]/20 border border-white/15 text-[#E50914] hover:text-white text-xs font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 shrink-0"
                      title="Remove backdrop media"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove Media</span>
                    </button>
                  )}
                </div>

                {formData.hero_backdrop_url && (
                  <div className="space-y-2 mt-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-semibold text-white">Billboard 16:9 Preview:</span>
                      {!isVideoUrl(formData.hero_backdrop_url) && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHeroFit('cover')}
                            className={`cursor-pointer ${
                              heroFit === 'cover' ? 'text-white font-bold underline' : 'hover:text-white'
                            }`}
                          >
                            Cover (Fill Billboard)
                          </button>
                          <span>&middot;</span>
                          <button
                            type="button"
                            onClick={() => setHeroFit('contain')}
                            className={`cursor-pointer ${
                              heroFit === 'contain' ? 'text-white font-bold underline' : 'hover:text-white'
                            }`}
                          >
                            Contain (Full Photo)
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative aspect-video max-h-52 w-full rounded-lg overflow-hidden border border-white/20 bg-neutral-900 flex items-center justify-center">
                      {isVideoUrl(formData.hero_backdrop_url) ? (
                        <video
                          src={formData.hero_backdrop_url}
                          controls
                          className="w-full h-full object-contain"
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={formData.hero_backdrop_url}
                          alt="Hero Preview"
                          className={`max-h-full max-w-full ${
                            heroFit === 'contain' ? 'object-contain' : 'w-full h-full object-cover'
                          }`}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleChange('hero_backdrop_url', '')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 hover:bg-[#E50914] text-white text-xs border border-white/20 shadow transition-colors cursor-pointer"
                        title="Clear media"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL LOVE LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#181818] rounded border border-[#808080]/30 text-xs text-[#B3B3B3]">
                This personal handwritten letter is displayed inside the locked Secret Vault and can be read by your girlfriend whenever she unlocks it or taps to reveal.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.letter_title || ''}
                    onChange={(e) => handleChange('letter_title', e.target.value)}
                    placeholder="To My One and Only Sanctuary"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Letter Subheading
                  </label>
                  <input
                    type="text"
                    value={formData.letter_subtitle || ''}
                    onChange={(e) => handleChange('letter_subtitle', e.target.value)}
                    placeholder="Vault Unlocked · For Your Eyes Only"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Love Letter Body (Supports paragraphs & multi-line spacing)
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.letter_content || ''}
                  onChange={(e) => handleChange('letter_content', e.target.value)}
                  placeholder="Write your heart out..."
                  className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-3 px-3.5 text-white placeholder-neutral-500 text-xs leading-relaxed focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Signature / Sign-off
                </label>
                <input
                  type="text"
                  value={formData.letter_signoff || ''}
                  onChange={(e) => handleChange('letter_signoff', e.target.value)}
                  placeholder="Yours always & forever ❤️"
                  className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                />
              </div>

              {/* Live Preview Box */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#FFFFFF] mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Live Letter Preview (As seen by your partner)</span>
                </label>
                <div className="bg-[#181818] p-5 sm:p-6 rounded border border-[#808080]/30 text-[#B3B3B3] text-xs sm:text-sm leading-relaxed whitespace-pre-line font-light shadow-inner">
                  <h4 className="font-bebas text-xl text-[#FFFFFF] mb-2 uppercase tracking-wide">
                    {formData.letter_title || 'A Private Letter'}
                  </h4>
                  {formData.letter_content}
                  {formData.letter_signoff && (
                    <p className="mt-4 font-serif italic text-[#FFFFFF] font-normal">
                      {formData.letter_signoff}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COUPLE & PASSCODE */}
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-neutral-300">
                Personalize partner names and the secret vault 4-digit unlock passcode.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Partner 1 Name (Her)
                  </label>
                  <input
                    type="text"
                    value={formData.partner1_name || ''}
                    onChange={(e) => handleChange('partner1_name', e.target.value)}
                    placeholder="My Girl 👑"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Partner 2 Name (Him)
                  </label>
                  <input
                    type="text"
                    value={formData.partner2_name || ''}
                    onChange={(e) => handleChange('partner2_name', e.target.value)}
                    placeholder="Your Guy 🌙"
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Timeline Tracker Date</span>
                    </span>
                    <span className="text-[10px] text-[#E50914] font-medium">From 15 June 2025</span>
                  </label>
                  <input
                    type="date"
                    min="2025-06-15"
                    value={formData.anniversary_date && formData.anniversary_date >= '2025-06-15' ? formData.anniversary_date : '2025-06-15'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val && val < '2025-06-15') {
                        handleChange('anniversary_date', '2025-06-15');
                      } else {
                        handleChange('anniversary_date', val);
                      }
                    }}
                    className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white text-xs focus:outline-none"
                  />
                  <p className="text-[10px] text-[#808080] mt-1">
                    Earliest selectable date is 15 June 2025 (2025-06-15).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Secret Vault Passcode (PIN)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.secret_passcode || '1402'}
                    onChange={(e) => handleChange('secret_passcode', e.target.value)}
                    placeholder="1402"
                    className="w-full font-mono bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-white placeholder-neutral-500 text-xs focus:outline-none tracking-widest"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECTION HEADINGS */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-neutral-300">
                Rename the Netflix category row headings displayed across the site.
              </div>

              {/* Row 1: Continue Watching */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Continue Watching Row Title
                  </label>
                  <input
                    type="text"
                    value={formData.section_continue_title || ''}
                    onChange={(e) => handleChange('section_continue_title', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.section_continue_sub || ''}
                    onChange={(e) => handleChange('section_continue_sub', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-neutral-300"
                  />
                </div>
              </div>

              {/* Row 2: Our Story */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Our Story Series Title
                  </label>
                  <input
                    type="text"
                    value={formData.section_our_story_title || ''}
                    onChange={(e) => handleChange('section_our_story_title', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.section_our_story_sub || ''}
                    onChange={(e) => handleChange('section_our_story_sub', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-neutral-300"
                  />
                </div>
              </div>

              {/* Row 3: Little Things */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Little Things Title
                  </label>
                  <input
                    type="text"
                    value={formData.section_little_things_title || ''}
                    onChange={(e) => handleChange('section_little_things_title', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.section_little_things_sub || ''}
                    onChange={(e) => handleChange('section_little_things_sub', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-neutral-300"
                  />
                </div>
              </div>

              {/* Row 4: Places */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Places & Travel Board Title
                  </label>
                  <input
                    type="text"
                    value={formData.section_places_title || ''}
                    onChange={(e) => handleChange('section_places_title', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.section_places_sub || ''}
                    onChange={(e) => handleChange('section_places_sub', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-neutral-300"
                  />
                </div>
              </div>

              {/* Row 5: Secret Vault */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Secret Vault Row Title
                  </label>
                  <input
                    type="text"
                    value={formData.section_vault_title || ''}
                    onChange={(e) => handleChange('section_vault_title', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.section_vault_sub || ''}
                    onChange={(e) => handleChange('section_vault_sub', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded py-1.5 px-2.5 text-xs text-neutral-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="px-6 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Supabase...' : 'Save All Changes to Cloud'}</span>
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};
