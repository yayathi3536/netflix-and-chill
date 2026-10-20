import React, { useState } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  Sparkles,
  Type,
  Layout,
  Users,
  Heart,
  RotateCcw,
} from 'lucide-react';
import { PrototypeSiteContent } from './types';

interface SiteContentTabProps {
  content: PrototypeSiteContent;
  onSaveContent: (content: PrototypeSiteContent) => void;
  onResetContent: () => void;
}

export const SiteContentTab: React.FC<SiteContentTabProps> = ({
  content,
  onSaveContent,
  onResetContent,
}) => {
  const [formData, setFormData] = useState<PrototypeSiteContent>({ ...content });
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'sections' | 'couple'>('hero');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof PrototypeSiteContent, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Site Content & Branding
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Customize headlines, section titles, and couple milestones across the prototype website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetContent}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
            title="Reset to default mock content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-[#E50914] text-white shadow'
              : 'bg-[#161616] text-neutral-400 hover:text-white'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Hero Billboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'sections'
              ? 'bg-[#E50914] text-white shadow'
              : 'bg-[#161616] text-neutral-400 hover:text-white'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Section Headings</span>
        </button>

        <button
          onClick={() => setActiveSubTab('couple')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'couple'
              ? 'bg-[#E50914] text-white shadow'
              : 'bg-[#161616] text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Couple & Anniversary</span>
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-[#161616] border border-white/10 space-y-6">
        {isSaved && (
          <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Site content updated in prototype memory successfully!</span>
          </div>
        )}

        {/* 1. HERO BILLBOARD */}
        {activeSubTab === 'hero' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-neutral-300">
              Configure the cinematic hero billboard that welcomes visitors on the home screen.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Hero Title <span className="text-neutral-500 font-mono text-[10px]">(heroTitle)</span>
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Hero Subtitle <span className="text-neutral-500 font-mono text-[10px]">(heroSubtitle)</span>
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Hero Tagline / Synopsis <span className="text-neutral-500 font-mono text-[10px]">(heroTagline)</span>
              </label>
              <textarea
                rows={3}
                value={formData.heroTagline}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg p-3 text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  CTA Button Label <span className="text-neutral-500 font-mono text-[10px]">(heroCtaText)</span>
                </label>
                <input
                  type="text"
                  value={formData.heroCtaText}
                  onChange={(e) => handleChange('heroCtaText', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Hero Backdrop Image URL <span className="text-neutral-500 font-mono text-[10px]">(heroBackdropUrl)</span>
                </label>
                <input
                  type="url"
                  value={formData.heroBackdropUrl}
                  onChange={(e) => handleChange('heroBackdropUrl', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SECTION HEADINGS */}
        {activeSubTab === 'sections' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-neutral-300">
              Customize the horizontal carousel category headings showcased on the homepage.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Our Story Series Row <span className="text-neutral-500 font-mono text-[10px]">(seriesHeading)</span>
                </label>
                <input
                  type="text"
                  value={formData.seriesHeading}
                  onChange={(e) => handleChange('seriesHeading', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Movies & Relives Row <span className="text-neutral-500 font-mono text-[10px]">(moviesHeading)</span>
                </label>
                <input
                  type="text"
                  value={formData.moviesHeading}
                  onChange={(e) => handleChange('moviesHeading', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Little Quirks Row <span className="text-neutral-500 font-mono text-[10px]">(quirksHeading)</span>
                </label>
                <input
                  type="text"
                  value={formData.quirksHeading}
                  onChange={(e) => handleChange('quirksHeading', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Bucket List Places Row <span className="text-neutral-500 font-mono text-[10px]">(placesHeading)</span>
                </label>
                <input
                  type="text"
                  value={formData.placesHeading}
                  onChange={(e) => handleChange('placesHeading', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. COUPLE & ANNIVERSARY */}
        {activeSubTab === 'couple' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-neutral-300">
              Personalize couple names and anniversary milestone date for branding and greetings.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Partner 1 Name <span className="text-neutral-500 font-mono text-[10px]">(partner1Name)</span>
                </label>
                <input
                  type="text"
                  value={formData.partner1Name}
                  onChange={(e) => handleChange('partner1Name', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Partner 2 Name <span className="text-neutral-500 font-mono text-[10px]">(partner2Name)</span>
                </label>
                <input
                  type="text"
                  value={formData.partner2Name}
                  onChange={(e) => handleChange('partner2Name', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Anniversary Date <span className="text-neutral-500 font-mono text-[10px]">(anniversaryDate)</span>
                </label>
                <input
                  type="text"
                  value={formData.anniversaryDate}
                  onChange={(e) => handleChange('anniversaryDate', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Milestone Dedication Quote <span className="text-neutral-500 font-mono text-[10px]">(milestoneQuote)</span>
                </label>
                <input
                  type="text"
                  value={formData.milestoneQuote}
                  onChange={(e) => handleChange('milestoneQuote', e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E50914]/30 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Site Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
