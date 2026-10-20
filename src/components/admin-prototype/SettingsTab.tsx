import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  LayoutGrid,
  Calendar,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { PrototypeSettings } from './types';

interface SettingsTabProps {
  settings: PrototypeSettings;
  onUpdateSettings: (settings: PrototypeSettings) => void;
  onResetAllData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [localSettings, setLocalSettings] = useState<PrototypeSettings>({ ...settings });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (newSettings: PrototypeSettings) => {
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Studio Preferences & Appearance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Customize interface density, theme accents, and display formats for this prototype session.
        </p>
      </div>

      {showSavedToast && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Studio settings updated successfully for this session.</span>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-300">
          <span className="font-semibold text-white block">Isolated Interface Preferences</span>
          <span className="text-neutral-400 leading-relaxed block mt-0.5">
            These options control the prototype's visual dashboard and demonstrate future customization. Real account credentials, Supabase database rules, and security roles are intentionally excluded to keep production safe.
          </span>
        </div>
      </div>

      {/* Theme Accent Section */}
      <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#E50914]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Cinematic Theme Accent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'netflix-red',
              label: 'Netflix Signature Red',
              color: '#E50914',
              desc: 'Classic cinema bold red',
            },
            {
              id: 'crimson-glow',
              label: 'Velvet Crimson',
              color: '#9f1239',
              desc: 'Deep warm romantic burgundy',
            },
            {
              id: 'ruby-rose',
              label: 'Midnight Ruby',
              color: '#e11d48',
              desc: 'Vibrant rosy red glow',
            },
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() =>
                handleSave({
                  ...localSettings,
                  themeAccent: theme.id as PrototypeSettings['themeAccent'],
                })
              }
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                localSettings.themeAccent === theme.id
                  ? 'border-[#E50914] bg-white/5 ring-1 ring-[#E50914]'
                  : 'border-white/10 bg-[#111111] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="w-4 h-4 rounded-full shadow-md shrink-0"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-xs font-bold text-white">{theme.label}</span>
              </div>
              <p className="text-[11px] text-neutral-400">{theme.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Layout & Density */}
      <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#E50914]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Layout Density & Format
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Card Density
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSave({ ...localSettings, contentDensity: 'comfortable' })
                }
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  localSettings.contentDensity === 'comfortable'
                    ? 'border-[#E50914] bg-[#E50914]/10 text-white'
                    : 'border-white/10 bg-[#111111] text-neutral-400'
                }`}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSave({ ...localSettings, contentDensity: 'compact' })
                }
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  localSettings.contentDensity === 'compact'
                    ? 'border-[#E50914] bg-[#E50914]/10 text-white'
                    : 'border-white/10 bg-[#111111] text-neutral-400'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Date Display Format
            </label>
            <select
              value={localSettings.dateFormat}
              onChange={(e) =>
                handleSave({
                  ...localSettings,
                  dateFormat: e.target.value as PrototypeSettings['dateFormat'],
                })
              }
              className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
            >
              <option value="MMM D, YYYY">MMM D, YYYY (e.g. Aug 14, 2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2024-08-14)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 14/08/2024)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reset Prototype Data */}
      <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Reset Prototype Demo State</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Re-initialize all memories, photos, letters, chapters, and coupons back to clean default demonstration values.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetAllData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:text-white hover:bg-red-500/20 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
