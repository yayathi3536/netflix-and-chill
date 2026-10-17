import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { getSupabaseConfigStatus } from '../services/supabaseClient';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guide' | 'sql' | 'github';
  isSchemaMissing?: boolean;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'guide',
  isSchemaMissing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'sql' | 'github'>(initialTab);
  const [copied, setCopied] = useState(false);
  const status = getSupabaseConfigStatus();

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(isSchemaMissing ? 'sql' : initialTab);
    }
  }, [isOpen, initialTab, isSchemaMissing]);

  if (!isOpen) return null;

  const sqlSnippet = `-- 1. RUN THIS IN SUPABASE SQL EDITOR TO CREATE TABLES & POLICIES
create extension if not exists "uuid-ossp";

create table if not exists public.memories (
  id text primary key,
  title text not null,
  subtitle text,
  category text not null check (category in ('our-story', 'memories', 'little-things', 'places-list', 'secret-vault')),
  date text not null,
  year text not null,
  duration text not null,
  match_score integer default 100,
  rating text default 'PG-Love',
  synopsis text not null,
  full_story text not null,
  location text,
  tags text[] default '{}'::text[],
  backdrop_url text,
  poster_url text,
  fallback_gradient text default 'from-[#141414] via-[#181818] to-[#000000]',
  progress integer,
  is_top_10 integer,
  is_favorite boolean default false,
  is_in_watchlist boolean default false,
  is_secret boolean default false,
  secret_passcode text,
  letter_content text,
  list_status text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.story_chapters (
  id text primary key,
  memory_id text references public.memories(id) on delete cascade not null,
  episode_number integer not null,
  title text not null,
  duration text not null,
  date text,
  description text not null,
  thumbnail_url text,
  gradient text default 'from-neutral-900 to-black',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.love_notes (
  id text primary key,
  memory_id text references public.memories(id) on delete cascade not null,
  title text not null,
  perk text not null,
  terms text not null,
  redeemed boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.memories enable row level security;
alter table public.story_chapters enable row level security;
alter table public.love_notes enable row level security;

-- Public read, Admin write
create policy "Public can read memories" on public.memories for select using (true);
create policy "Authenticated can modify memories" on public.memories for all to authenticated using (auth.role() = 'authenticated');

-- Storage Bucket for photos
insert into storage.buckets (id, name, public) values ('memory-photos', 'memory-photos', true) on conflict do nothing;
create policy "Public read photos" on storage.objects for select using (bucket_id = 'memory-photos');
create policy "Authenticated upload photos" on storage.objects for insert to authenticated with check (bucket_id = 'memory-photos');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white p-6 sm:p-8 space-y-6"
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white font-bold">
              Supabase Backend & Deployment Guide
            </h2>
            <p className="text-xs text-neutral-400">
              Complete setup instructions for database, storage, and GitHub Pages
            </p>
          </div>
        </div>

        {/* Environment Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div
            className={`p-3 rounded border flex items-start gap-2.5 ${
              status.configured
                ? 'bg-[#141414] border-[#E50914] text-[#FFFFFF]'
                : 'bg-[#141414] border-[#808080]/30 text-[#B3B3B3]'
            }`}
          >
            {status.configured ? (
              <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#808080] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-white">VITE_SUPABASE_URL</p>
              <p className="text-[11px] text-neutral-300 truncate">
                {status.url || 'Not set (using offline storage)'}
              </p>
            </div>
          </div>

          <div
            className={`p-3 rounded border flex items-start gap-2.5 ${
              status.hasKey
                ? 'bg-[#141414] border-[#E50914] text-[#FFFFFF]'
                : 'bg-[#141414] border-[#808080]/30 text-[#B3B3B3]'
            }`}
          >
            {status.hasKey ? (
              <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#808080] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-white">VITE_SUPABASE_ANON_KEY</p>
              <p className="text-[11px] text-neutral-300">
                {status.hasKey ? 'Configured & Valid' : 'Not set (publishable key required)'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'guide'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Setup Procedure
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'sql'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            SQL Migrations
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'github'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            GitHub Pages Deploy
          </button>
        </div>

        {/* TAB 1: GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-neutral-300">
            <ol className="space-y-3 list-decimal list-inside leading-relaxed">
              <li className="p-2.5 rounded bg-white/5 border border-white/5">
                <strong className="text-white">Create a Supabase Project:</strong> Visit{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E50914] underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and create a new free PostgreSQL project.
              </li>
              <li className="p-2.5 rounded bg-white/5 border border-white/5">
                <strong className="text-white">Run SQL Migration & Seed:</strong> Open the{' '}
                <strong>SQL Editor</strong> in Supabase. Paste the script from the "SQL Migrations"
                tab (or run <code className="bg-black/50 px-1 rounded">supabase/migrations/20261016_initial_schema.sql</code> and{' '}
                <code className="bg-black/50 px-1 rounded">supabase/seed.sql</code>).
              </li>
              <li className="p-2.5 rounded bg-white/5 border border-white/5">
                <strong className="text-white">Create Admin Account:</strong> Navigate to{' '}
                <strong>Authentication &gt; Users &gt; Add user</strong> and invite your admin email
                with a secure password.
              </li>
              <li className="p-2.5 rounded bg-white/5 border border-white/5">
                <strong className="text-white">Set Environment Variables:</strong> Go to{' '}
                <strong>Project Settings &gt; API</strong> and copy your Project URL and Anon key.
                Add them to your <code className="bg-black/50 px-1 rounded">.env</code> file:
                <pre className="mt-1.5 p-2 bg-black/60 rounded text-[11px] font-mono text-white overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}
                </pre>
              </li>
            </ol>
          </div>
        )}

        {/* TAB 2: SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            {isSchemaMissing && (
              <div className="p-3 rounded bg-[#181818] border border-[#E50914] text-[#B3B3B3] text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Missing Table: 'public.memories' (PGRST205)</p>
                  <p className="text-[11px] text-[#B3B3B3] leading-relaxed mt-0.5">
                    Your Supabase URL and key are connected, but the database tables have not been created yet. Click <strong>Copy SQL</strong> below, open your Supabase project's <strong>SQL Editor</strong>, paste this script, and click <strong>Run</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Schema & Storage Setup (Copy & paste into Supabase SQL Editor)</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#E50914]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/80 rounded-lg text-[11px] font-mono text-neutral-300 max-h-64 overflow-y-auto dark-scrollbar border border-white/10">
              {sqlSnippet}
            </pre>
            <p className="text-[11px] text-neutral-500">
              Full version-controlled migrations are saved in{' '}
              <code className="text-neutral-400">supabase/migrations/20261016_initial_schema.sql</code> and{' '}
              <code className="text-neutral-400">supabase/seed.sql</code>.
            </p>
          </div>
        )}

        {/* TAB 3: GITHUB PAGES */}
        {activeTab === 'github' && (
          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
            <p>
              This app is configured for GitHub Pages with Vite. When deploying to a repository subpath
              (e.g.{' '}
              <code className="bg-black/50 px-1 rounded text-white">
                https://username.github.io/our-universe/
              </code>
              ):
            </p>
            <div className="p-3 rounded bg-white/5 border border-white/5 space-y-1.5">
              <p className="font-semibold text-white">GitHub Actions Repository Secrets:</p>
              <ul className="list-disc list-inside text-[11px] text-neutral-300 space-y-0.5">
                <li>
                  <code className="text-white">VITE_SUPABASE_URL</code> (Repository Secret or Variable)
                </li>
                <li>
                  <code className="text-white">VITE_SUPABASE_ANON_KEY</code> (Repository Secret or Variable)
                </li>
                <li>
                  <code className="text-white">VITE_BASE_PATH</code> (Set to your repository name, e.g. <code className="text-white">/our-universe/</code>)
                </li>
              </ul>
            </div>
            <p className="text-[11px] text-neutral-500">
              Workflow file is prepared at <code className="text-neutral-400">.github/workflows/deploy.yml</code>.
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs rounded-md shadow transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
