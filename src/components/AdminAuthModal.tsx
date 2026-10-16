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
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { user, error } = await supabaseService.signInWithPassword(email, password);
      if (error) {
        setErrorMsg(error.message || 'Login failed. Please verify credentials.');
      } else if (user) {
        setSuccessMsg(`Welcome, ${user.email}! Admin access granted.`);
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
    setMigrationStatus('Syncing memories to Supabase database...');
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

  const supabaseReady = isSupabaseConfigured();

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white p-6 sm:p-8"
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bebas text-2xl tracking-wide text-white font-bold">
              Admin & Security Portal
            </h2>
            <p className="text-xs text-neutral-400">
              Supabase Authentication & Row Level Security
            </p>
          </div>
        </div>

        {/* Supabase Status Check */}
        {!supabaseReady && (
          <div className="p-3 mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Supabase Environment Not Configured</span>
            </div>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Add <code className="bg-black/40 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-black/40 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your
              environment to enable live authentication and cloud photo storage.
            </p>
          </div>
        )}

        {/* LOGGED IN STATE */}
        {currentUser ? (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Authenticated Administrator</span>
              </div>
              <p className="text-sm font-semibold text-white break-all">
                {currentUser.email}
              </p>
              <p className="text-[11px] text-neutral-300">
                You have authorized access to create, edit, delete memories, and upload high-res photos to Supabase Storage.
              </p>
            </div>

            {/* Sync / Migrate Button */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#ff4d5a]" />
                <span>Cloud Synchronization</span>
              </h4>
              <p className="text-[11px] text-neutral-400">
                Push all memories and story chapters into your Supabase database table.
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
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

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
                  placeholder="admin@ouruniverse.love"
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
              className="w-full py-2.5 bg-[#E50914] hover:bg-[#b80710] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
            </button>

            {/* Helper notes */}
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-neutral-400 space-y-1 leading-relaxed">
              <div className="flex items-center gap-1 text-white font-semibold">
                <Info className="w-3.5 h-3.5 text-[#ff4d5a]" />
                <span>Admin Setup Info</span>
              </div>
              <p>
                To create your admin credentials, go to your <strong>Supabase Dashboard &gt; Authentication &gt; Users &gt; Add user</strong>.
              </p>
              <p className="text-neutral-500">
                Protected by PostgreSQL Row Level Security (RLS). Visitors can view memories, but only authorized admins can edit or delete.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
