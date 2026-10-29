import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
  Heart,
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';

export type AuthViewMode = 'signin' | 'signup' | 'reset' | 'update-password';

interface AuthScreenProps {
  initialMode?: AuthViewMode;
  onAuthSuccess: (user: User) => void;
  onPasswordUpdated?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  onPasswordUpdated,
}) => {
  const [mode, setMode] = useState<AuthViewMode>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode]);

  const switchMode = (nextMode: AuthViewMode) => {
    setMode(nextMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Please enter your password (at least 6 characters).');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await supabaseService.signInWithPassword(trimmedEmail, password);
      if (error) {
        setErrorMsg(error.message || 'Unable to sign in. Please check your email and password.');
      } else if (user) {
        onAuthSuccess(user);
      } else {
        setErrorMsg('Authentication failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();

    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please confirm your password.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, session, error } = await supabaseService.signUpWithPassword(
        trimmedEmail,
        password,
        trimmedName || undefined
      );
      if (error) {
        setErrorMsg(error.message || 'Registration failed. Please check your details and try again.');
      } else if (user && session) {
        onAuthSuccess(user);
      } else if (user) {
        setSuccessMsg(
          `Account created for ${trimmedEmail}! Please check your email inbox to confirm your account, then sign in.`
        );
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Please enter the email address associated with your account.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabaseService.resetPasswordForEmail(trimmedEmail);
      if (error) {
        setErrorMsg(error.message || 'Could not send password reset email. Please try again.');
      } else {
        setSuccessMsg(
          `Password reset instructions have been sent to ${trimmedEmail}. Check your inbox and follow the link.`
        );
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password || password.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await supabaseService.updateUserPassword(password);
      if (error) {
        setErrorMsg(error.message || 'Failed to update password.');
      } else {
        setSuccessMsg('Your password has been updated! Continuing to your profiles...');
        setTimeout(() => {
          if (onPasswordUpdated) onPasswordUpdated();
          if (user) onAuthSuccess(user);
        }, 900);
      }
    } catch (err) {
      setErrorMsg((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col justify-between relative overflow-hidden selection:bg-[#808080] selection:text-[#FFFFFF]">
      {/* Netflix-style atmospheric background canvas & multi-stop dark vignette */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center scale-105 animate-ken-burns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/90 via-[#000000]/75 to-[#000000]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Top Netflix Brand Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-6 sm:pt-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-bebas text-3xl sm:text-5xl tracking-widest text-[var(--nf-red)] font-black uppercase drop-shadow-[0_2px_10px_rgba(229,9,20,0.35)] select-none">
            OUR UNIVERSE
          </span>
        </div>

        {mode === 'signin' ? (
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className="px-4 py-1.5 rounded-[4px] bg-white hover:bg-white/80 text-black text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow"
          >
            Sign Up
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="px-4 py-1.5 rounded-[4px] bg-white hover:bg-white/80 text-black text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow"
          >
            Sign In
          </button>
        )}
      </header>

      {/* Main Centered Netflix Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px] bg-black/70 border border-white/10 rounded-md shadow-2xl px-6 sm:px-10 py-8 sm:py-10 space-y-5 backdrop-blur-xl">
          {/* Card Header */}
          <div className="space-y-2">
            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="inline-flex items-center gap-1.5 text-xs text-[#B3B3B3] hover:text-[#FFFFFF] mb-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#808080]" />
                <span>Back to Sign In</span>
              </button>
            )}
            <h1 className="text-3xl sm:text-[32px] font-bold text-[#FFFFFF] tracking-tight leading-tight">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Sign Up'}
              {mode === 'reset' && 'Forgot Password'}
              {mode === 'update-password' && 'Set New Password'}
            </h1>
            <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
              {mode === 'signin' && 'Enter your email and password to stream OUR UNIVERSE.'}
              {mode === 'signup' && 'Create your account to unlock your personal streaming profiles.'}
              {mode === 'reset' && 'We will send you an email with instructions on how to reset your password.'}
              {mode === 'update-password' && 'Enter and confirm your new account password below.'}
            </p>
          </div>

          {/* Environment notice if Supabase is not configured */}
          {!supabaseReady && (
            <div className="p-3.5 rounded-[4px] bg-[#181818] border border-[#808080]/60 text-xs text-[#B3B3B3] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#FFFFFF]">
                <AlertCircle className="w-4 h-4 text-[#808080] shrink-0" />
                <span>Supabase Auth Configuration Required</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Configure <code className="text-[#FFFFFF] bg-[#000000] px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-[#FFFFFF] bg-[#000000] px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your
                environment to enable authentication.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-[4px] bg-[#e87c03]/15 border border-[#808080] text-[#FFFFFF] text-xs sm:text-[13px] flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 text-[#808080] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div
              role="status"
              className="p-3.5 rounded-[4px] bg-[#181818] border border-[#FFFFFF]/40 text-[#FFFFFF] text-xs sm:text-[13px] flex items-start gap-2.5 animate-in fade-in duration-150"
            >
              <CheckCircle2 className="w-4 h-4 text-[#808080] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label htmlFor="auth-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#E50914] hover:bg-[#f6121d] disabled:opacity-50 text-white font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs text-[#B3B3B3]">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded-[2px] accent-[#808080] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-[#B3B3B3] hover:text-[#FFFFFF] hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-6 text-sm text-[#808080]">
                New to OUR UNIVERSE?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#FFFFFF] font-semibold hover:underline cursor-pointer ml-1"
                >
                  Sign up now.
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              <div>
                <label htmlFor="signup-name" className="sr-only">
                  Your Name (optional)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name (optional)"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password (6+ characters)"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white hover:bg-white/80 disabled:opacity-50 text-black font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Get Started</span>
                )}
              </button>

              <div className="pt-6 text-sm text-[#808080]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-[#FFFFFF] font-semibold hover:underline cursor-pointer ml-1"
                >
                  Sign in now.
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: PASSWORD RESET REQUEST */}
          {mode === 'reset' && (
            <form onSubmit={handleResetRequest} className="space-y-4" noValidate>
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white hover:bg-white/80 disabled:opacity-60 text-black font-semibold text-base rounded-[4px] shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Email Me</span>
                )}
              </button>
            </form>
          )}

          {/* MODE 4: UPDATE PASSWORD (FROM RECOVERY LINK) */}
          {mode === 'update-password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4" noValidate>
              <div>
                <label htmlFor="new-password" className="sr-only">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password (6+ characters)"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-11 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-new-password" className="sr-only">
                  Confirm New Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#808080] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="confirm-new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-neutral-900 border border-white/10 focus:border-white/40 focus:ring-1 focus:ring-white/20 rounded-md py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white hover:bg-white/80 disabled:opacity-60 text-black font-semibold text-base rounded-[4px] shadow-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Save New Password</span>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Netflix-style minimal dark footer */}
      <footer className="relative z-10 w-full bg-[#000000]/80 border-t border-[#FFFFFF]/10 py-6 px-6 sm:px-12 text-xs text-[#808080]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#808080] fill-[#808080]" />
            <span>OUR UNIVERSE · Personal Streaming Archive</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="hover:underline cursor-pointer"
            >
              Sign In
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="hover:underline cursor-pointer"
            >
              Create Account
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => switchMode('reset')}
              className="hover:underline cursor-pointer"
            >
              Password Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
