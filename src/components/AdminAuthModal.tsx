import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Database,
  Info,
  Copy,
  Check,
  Sparkles,
  Send,
} from 'lucide-react';
import { supabaseService, checkIsAdmin } from '../services/supabaseService';
import { storageService } from '../services/storage';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User | null) => void;
  onMigrationComplete?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onMigrationComplete,
}) => {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'sql'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { user, error } = await supabaseService.signInWithPassword(email, password);
      if (error) {
        setErrorMsg(error.message || 'Login failed. Please verify credentials.');
      } else if (user) {
        const isAdmin = checkIsAdmin(user);
        if (isAdmin) {
          setSuccessMsg(`Welcome, ${user.email}! Verified Administrator access granted.`);
        } else {
          setSuccessMsg(`Logged in as ${user.email}. (Standard viewer role)`);
        }
        onAuthSuccess(user);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { error } = await supabaseService.signInWithOtp(email);
      if (error) {
        setErrorMsg(error.message || 'Failed to send magic link.');
      } else {
        setSuccessMsg(`Magic link sent! Check your inbox at ${email} to sign in.`);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabaseService.signOut();
    onAuthSuccess(null);
    setIsLoading(false);
    setSuccessMsg('Logged out successfully.');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleMigrate = async () => {
    setIsLoading(true);
    setMigrationStatus('Syncing memories & texts to Supabase database...');
    try {
      const result = await storageService.migrateLocalStorageToSupabase();
      setMigrationStatus(
        `Migration complete! Synced ${result.succeeded} of ${result.total} items to Supabase.`
      );
      if (onMigrationComplete) onMigrationComplete();
    } catch (err) {
      setMigrationStatus(`Migration error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- OUR UNIVERSE — Complete Admin Control System & RLS Migration
create extension if not exists "uuid-ossp";

-- 1. SITE CONTENT TABLE
create table if not exists public.site_content (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  section text not null default 'general',
  label text,
  value text not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. MEMORIES TABLE
create table if not exists public.memories (
  id text primary key,
  title text not null,
  subtitle text,
  category text not null check (category in ('our-story', 'memories', 'little-things', 'places-list', 'secret-vault')),
  date text not null,
  year text not null,
  duration text not null,
  match_score integer default 100 check (match_score between 1 and 100),
  rating text default 'PG-Love',
  synopsis text not null,
  full_story text not null,
  location text,
  tags text[] default '{}'::text[],
  backdrop_url text,
  poster_url text,
  fallback_gradient text default 'from-[#141414] via-[#181818] to-[#000000]',
  progress integer check (progress between 0 and 100),
  is_top_10 integer,
  is_favorite boolean default false,
  is_in_watchlist boolean default false,
  is_secret boolean default false,
  secret_passcode text,
  letter_content text,
  list_status text check (list_status is null or list_status in ('visited', 'bucket-list')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. STORAGE BUCKET
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memory-photos', 'memory-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true;

-- 4. ROW LEVEL SECURITY (RLS)
alter table public.site_content enable row level security;
alter table public.memories enable row level security;

create policy "Public can read site content" on public.site_content for select using (true);
create policy "Admin can insert site content" on public.site_content for insert to authenticated with check (auth.role() = 'authenticated');
create policy "Admin can update site content" on public.site_content for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete site content" on public.site_content for delete to authenticated using (auth.role() = 'authenticated');

create policy "Public can read memories" on public.memories for select using (true);
create policy "Admin can insert memories" on public.memories for insert to authenticated with check (auth.role() = 'authenticated');
create policy "Admin can update memories" on public.memories for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete memories" on public.memories for delete to authenticated using (auth.role() = 'authenticated');

create policy "Public can view memory photos" on storage.objects for select using (bucket_id = 'memory-photos');
create policy "Admin can upload memory photos" on storage.objects for insert to authenticated with check (bucket_id = 'memory-photos');
create policy "Admin can delete memory photos" on storage.objects for delete to authenticated using (bucket_id = 'memory-photos');`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const supabaseReady = isSupabaseConfigured();
  const isAdminUser = checkIsAdmin(currentUser);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white p-4 sm:p-8 max-h-[92vh] overflow-y-auto dark-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 min-h-[44px] min-w-[44px]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white font-bold leading-none">
              Admin & Security Portal
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Role-Based Access Control & Supabase Database
            </p>
          </div>
        </div>

        {/* Supabase Status Check */}
        {!supabaseReady && (
          <div className="p-3 mb-4 rounded bg-[#181818] border border-[#808080]/30 text-[#B3B3B3] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#FFFFFF]">
              <AlertCircle className="w-4 h-4 text-[#E50914]" />
              <span>Supabase Environment Not Configured</span>
            </div>
            <p className="text-[11px] text-[#B3B3B3] leading-relaxed">
              Add <code className="bg-black/60 px-1 rounded text-[#FFFFFF]">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-black/60 px-1 rounded text-[#FFFFFF]">VITE_SUPABASE_ANON_KEY</code> to enable
              live cloud database storage and role-based editing.
            </p>
          </div>
        )}

        {/* LOGGED IN STATE */}
        {currentUser ? (
          <div className="space-y-5">
            <div
              className={`p-4 rounded border space-y-2 ${
                isAdminUser
                  ? 'bg-[#181818] border-[#E50914] text-[#FFFFFF]'
                  : 'bg-[#181818] border-[#808080]/40 text-[#B3B3B3]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#FFFFFF]">
                <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
                <span>
                  {isAdminUser ? 'Verified Administrator' : 'Viewer Account (Read-Only)'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white break-all">
                {currentUser.email}
              </p>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {isAdminUser
                  ? 'You have authorized permissions to modify billboard headlines, handwritten love letters, memories, and upload photos to Supabase Storage.'
                  : 'You are signed in as a viewer. Public visitors browse in read-only mode.'}
              </p>
            </div>

            {/* Cloud Sync Section */}
            {isAdminUser && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Cloud Synchronization</span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Seed/push all initial memories, story chapters, and letters into your Supabase database.
                </p>
                <button
                  disabled={isLoading || !supabaseReady}
                  onClick={handleMigrate}
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isLoading ? 'Processing...' : 'Migrate Memories to Supabase'}</span>
                </button>
                {migrationStatus && (
                  <p className="text-xs text-neutral-300 bg-black/40 p-2 rounded border border-white/10 mt-1">
                    {migrationStatus}
                  </p>
                )}
              </div>
            )}

            {/* Copy SQL Migration Script */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">RLS SQL Migration Script</span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-[#E50914] hover:text-[#b80710] cursor-pointer font-semibold"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E50914]" />
                      <span className="text-[#FFFFFF]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Run this SQL in your Supabase SQL Editor to initialize tables, storage, and public read / admin write policies.
              </p>
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from Admin</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN METHODS */
          <div className="space-y-4">
            {/* Method Toggle */}
            <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  authMethod === 'password'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  authMethod === 'otp'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Magic Link (Email)
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('sql')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-colors ${
                  authMethod === 'sql'
                    ? 'bg-white text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                SQL Setup
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded bg-[#181818] border border-[#E50914] text-[#FFFFFF] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded bg-[#181818] border border-[#E50914] text-[#FFFFFF] text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* PASSWORD LOGIN FORM */}
            {authMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !supabaseReady}
                  className="w-full py-2.5 bg-white hover:bg-white/80 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
                </button>
              </form>
            )}

            {/* MAGIC LINK FORM */}
            {authMethod === 'otp' && (
              <form onSubmit={handleOtpLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Your Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-black/60 border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 pl-9 pr-3 text-white placeholder-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400">
                  Supabase will send a secure, passwordless one-time login link directly to your email.
                </p>

                <button
                  type="submit"
                  disabled={isLoading || !supabaseReady}
                  className="w-full py-2.5 bg-white hover:bg-white/80 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isLoading ? 'Sending Link...' : 'Send Magic Link'}</span>
                </button>
              </form>
            )}

            {/* SQL SETUP TAB */}
            {authMethod === 'sql' && (
              <div className="space-y-3 text-xs">
                <p className="text-neutral-300 leading-relaxed">
                  Run the SQL migration in your <strong>Supabase Dashboard &gt; SQL Editor</strong> to create <code className="text-[#E50914]">site_content</code>, <code className="text-[#E50914]">memories</code>, and enforce Row-Level Security.
                </p>

                <button
                  onClick={handleCopySql}
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-[#E50914]" />
                      <span className="text-[#FFFFFF] font-bold">SQL Script Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#E50914]" />
                      <span>Copy Full Database & RLS Script</span>
                    </>
                  )}
                </button>

                <div className="p-3 bg-black/60 rounded-lg border border-white/10 text-[11px] text-neutral-400 space-y-1">
                  <div className="font-semibold text-white">How Row-Level Security Works:</div>
                  <div>• Public visitors can <strong>read (`SELECT`)</strong> all memories and letters.</div>
                  <div>• Only authenticated admins can <strong>create, edit, or delete</strong> records.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
