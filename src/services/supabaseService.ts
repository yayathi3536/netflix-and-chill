import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MemoryItem, Episode, CouponItem, SiteContentMap } from '../types';
import { User, Session, AuthError } from '@supabase/supabase-js';

// DATABASE ROW TYPE MAPPING
interface MemoryRow {
  id: string;
  title: string;
  subtitle: string | null;
  category: 'our-story' | 'memories' | 'little-things' | 'places-list' | 'secret-vault';
  date: string;
  year: string;
  duration: string;
  match_score: number;
  rating: string;
  synopsis: string;
  full_story: string;
  location: string | null;
  tags: string[] | null;
  backdrop_url: string | null;
  poster_url: string | null;
  fallback_gradient: string;
  progress: number | null;
  is_top_10: number | null;
  is_favorite: boolean;
  is_in_watchlist: boolean;
  is_secret: boolean;
  secret_passcode: string | null;
  letter_content: string | null;
  list_status: 'visited' | 'bucket-list' | null;
  created_at: string;
}

interface ChapterRow {
  id: string;
  memory_id: string;
  episode_number: number;
  title: string;
  duration: string;
  date: string | null;
  description: string;
  thumbnail_url: string | null;
  gradient: string;
}

interface LoveNoteRow {
  id: string;
  memory_id: string;
  title: string;
  perk: string;
  terms: string;
  redeemed: boolean;
}

interface SiteContentRow {
  key: string;
  value: string;
  section?: string;
  updated_at?: string;
}

export class SupabaseSchemaMissingError extends Error {
  public code = 'PGRST205';
  constructor(message: string = 'The database tables have not been created yet in Supabase.') {
    super(message);
    this.name = 'SupabaseSchemaMissingError';
  }
}

export const isSchemaMissingError = (err: unknown): boolean => {
  if (!err) return false;
  if (err instanceof SupabaseSchemaMissingError) return true;
  const e = err as { code?: string; message?: string };
  return (
    e.code === 'PGRST205' ||
    (typeof e.message === 'string' &&
      (e.message.includes('schema cache') ||
        e.message.includes('Could not find the table') ||
        e.message.includes('relation "public.memories" does not exist') ||
        e.message.includes('relation "public.site_content" does not exist')))
  );
};

/**
 * Authorization is based only on server-controlled app_metadata.
 * Never trust user_metadata or a client-side email allowlist for admin privileges.
 */
export const checkIsAdmin = (user: User | null): boolean => {
  return Boolean(
    user &&
    (user.app_metadata?.is_admin === true || user.app_metadata?.role === 'admin')
  );
};

/** Existing admin accounts are approved automatically; other accounts require manual approval. */
export const checkIsApproved = (user: User | null): boolean => {
  return Boolean(
    user &&
    (checkIsAdmin(user) || user.app_metadata?.is_approved === true)
  );
};


class SupabaseService {
  // 1. MEMORIES FETCHING
  public async fetchMemories(): Promise<MemoryItem[]> {
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    // Fetch all memories
    const { data: memoryRows, error: memError } = await supabase
      .from('memories')
      .select('*')
      .order('is_top_10', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (memError) {
      if (isSchemaMissingError(memError)) {
        console.info('Notice: Supabase is connected, but table public.memories has not been created yet in the SQL Editor.');
        throw new SupabaseSchemaMissingError();
      }
      console.warn('Could not fetch memories from Supabase:', memError.message || memError);
      throw memError;
    }

    if (!memoryRows || memoryRows.length === 0) {
      return [];
    }

    // Fetch chapters / episodes
    const { data: chapterRows, error: chapError } = await supabase
      .from('story_chapters')
      .select('*')
      .order('episode_number', { ascending: true });

    if (chapError) {
      console.warn('Could not fetch story chapters:', chapError);
    }

    // Fetch love notes / coupons
    const { data: noteRows, error: noteError } = await supabase
      .from('love_notes')
      .select('*')
      .order('created_at', { ascending: true });

    if (noteError) {
      console.warn('Could not fetch love notes:', noteError);
    }

    // Resolve memory image URLs asynchronously while leaving third-party URLs intact.
    return Promise.all((memoryRows as MemoryRow[]).map(async (row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || undefined,
      category: row.category,
      date: row.date,
      year: row.year,
      duration: row.duration,
      matchScore: row.match_score,
      rating: row.rating,
      synopsis: row.synopsis,
      fullStory: row.full_story,
      location: row.location || undefined,
      tags: row.tags || [],
      backdropUrl: await this.resolvePhotoUrl(row.backdrop_url),
      posterUrl: await this.resolvePhotoUrl(row.poster_url),
      fallbackGradient: row.fallback_gradient,
      progress: row.progress !== null ? row.progress : undefined,
      isTop10: row.is_top_10 !== null ? row.is_top_10 : undefined,
      isFavorite: row.is_favorite,
      isInWatchlist: row.is_in_watchlist,
      isSecret: row.is_secret,
      secretPasscode: row.secret_passcode || undefined,
      letterContent: row.letter_content || undefined,
      listStatus: row.list_status || undefined,
      episodes: chaptersByMemory[row.id] || [],
      coupons: couponsByMemory[row.id] || [],
    })));
  }

  // 2. CREATE MEMORY
  public async createMemory(memory: MemoryItem): Promise<{ data: MemoryItem | null; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase client is not configured.') };
    }

    try {
      // Insert into memories table
      const row = {
        id: memory.id,
        title: memory.title,
        subtitle: memory.subtitle || null,
        category: memory.category,
        date: memory.date,
        year: memory.year,
        duration: memory.duration,
        match_score: memory.matchScore,
        rating: memory.rating,
        synopsis: memory.synopsis,
        full_story: memory.fullStory,
        location: memory.location || null,
        tags: memory.tags,
        backdrop_url: memory.backdropUrl || null,
        poster_url: memory.posterUrl || null,
        fallback_gradient: memory.fallbackGradient,
        progress: memory.progress !== undefined ? memory.progress : null,
        is_top_10: memory.isTop10 !== undefined ? memory.isTop10 : null,
        is_favorite: Boolean(memory.isFavorite),
        is_in_watchlist: Boolean(memory.isInWatchlist),
        is_secret: Boolean(memory.isSecret),
        secret_passcode: memory.secretPasscode || null,
        letter_content: memory.letterContent || null,
        list_status: memory.listStatus || null,
      };

      const { error: memError } = await supabase.from('memories').insert(row);
      if (memError) throw memError;

      // Insert any episodes
      if (memory.episodes && memory.episodes.length > 0) {
        const episodeRows = memory.episodes.map((ep) => ({
          id: ep.id,
          memory_id: memory.id,
          episode_number: ep.episodeNumber,
          title: ep.title,
          duration: ep.duration,
          date: ep.date || null,
          description: ep.description,
          thumbnail_url: ep.thumbnailUrl || null,
          gradient: ep.gradient,
        }));
        const { error: epError } = await supabase.from('story_chapters').insert(episodeRows);
        if (epError) console.warn('Could not insert episodes:', epError);
      }

      // Insert any coupons
      if (memory.coupons && memory.coupons.length > 0) {
        const couponRows = memory.coupons.map((c) => ({
          id: c.id,
          memory_id: memory.id,
          title: c.title,
          perk: c.perk,
          terms: c.terms,
          redeemed: c.redeemed,
        }));
        const { error: cpError } = await supabase.from('love_notes').insert(couponRows);
        if (cpError) console.warn('Could not insert coupons:', cpError);
      }

      return { data: memory, error: null };
    } catch (e) {
      if (isSchemaMissingError(e)) {
        return {
          data: null,
          error: new Error(
            'The database table "public.memories" has not been created yet. Please run the SQL migration script in your Supabase SQL Editor.'
          ),
        };
      }
      console.warn('Could not create memory in Supabase:', (e as Error).message || e);
      return { data: null, error: e as Error };
    }
  }

  // 3. UPDATE MEMORY
  public async updateMemory(id: string, updates: Partial<MemoryItem>): Promise<{ success: boolean; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: new Error('Supabase client is not configured.') };
    }

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.year !== undefined) dbUpdates.year = updates.year;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.matchScore !== undefined) dbUpdates.match_score = updates.matchScore;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.synopsis !== undefined) dbUpdates.synopsis = updates.synopsis;
      if (updates.fullStory !== undefined) dbUpdates.full_story = updates.fullStory;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.backdropUrl !== undefined) dbUpdates.backdrop_url = updates.backdropUrl;
      if (updates.posterUrl !== undefined) dbUpdates.poster_url = updates.posterUrl;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
      if (updates.isInWatchlist !== undefined) dbUpdates.is_in_watchlist = updates.isInWatchlist;
      if (updates.isSecret !== undefined) dbUpdates.is_secret = updates.isSecret;
      if (updates.letterContent !== undefined) dbUpdates.letter_content = updates.letterContent;
      if (updates.listStatus !== undefined) dbUpdates.list_status = updates.listStatus;

      const { error } = await supabase.from('memories').update(dbUpdates).eq('id', id);
      if (error) throw error;

      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: e as Error };
    }
  }

  // 4. DELETE MEMORY
  public async deleteMemory(id: string, photoUrl?: string): Promise<{ success: boolean; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: new Error('Supabase client is not configured.') };
    }

    try {
      // 1. Delete associated photo from storage if stored in memory-photos bucket
      if (photoUrl) {
        await this.deletePhoto(photoUrl);
      }

      // 2. Delete database record (cascades to story_chapters and love_notes)
      const { error } = await supabase.from('memories').delete().eq('id', id);
      if (error) throw error;

      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: e as Error };
    }
  }

  /**
   * Resolve legacy public or signed memory-photos URLs to a fresh, short-lived URL.
   * Only this bucket is signed; third-party image URLs remain unchanged.
   */
  public async resolvePhotoUrl(urlOrPath: string | null | undefined): Promise<string | undefined> {
    if (!urlOrPath) return undefined;
    if (!supabase || !isSupabaseConfigured()) return urlOrPath;

    try {
      let path: string | null = null;
      if (urlOrPath.startsWith('memories/')) {
        path = urlOrPath;
      } else if (urlOrPath.includes('/memory-photos/')) {
        const pathname = urlOrPath.startsWith('http')
          ? new URL(urlOrPath).pathname
          : urlOrPath.split('?')[0];
        const marker = '/memory-photos/';
        const markerIndex = pathname.indexOf(marker);
        if (markerIndex >= 0) {
          path = decodeURIComponent(pathname.slice(markerIndex + marker.length));
        }
      }

      if (!path) return urlOrPath;
      const { data, error } = await supabase.storage
        .from('memory-photos')
        .createSignedUrl(path, 60 * 60);
      if (error || !data?.signedUrl) {
        console.warn('Could not create a signed photo URL:', error?.message || 'No URL returned');
        return undefined;
      }
      return data.signedUrl;
    } catch (e) {
      console.warn('Could not resolve a photo URL:', e);
      return undefined;
    }
  }

  // 5. STORAGE: REAL PHOTO UPLOADS
  public async uploadPhoto(file: File): Promise<{ url: string | null; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { url: null, error: new Error('Supabase client is not configured.') };
    }

    // Validation: file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      return {
        url: null,
        error: new Error(`Invalid file type (${file.type}). Please select a JPG, PNG, WEBP, or GIF image.`),
      };
    }

    // Validation: max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        url: null,
        error: new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed is 10MB.`),
      };
    }

    try {
      // Sanitize file name
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
      const filePath = `memories/${Date.now()}_${cleanName}.${ext}`;

      const { data, error } = await supabase.storage
        .from('memory-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Return a short-lived signed URL for immediate preview. The stored URL is
      // resolved again on future fetches, so expiration never gets persisted as a dependency.
      const { data: urlData, error: urlError } = await supabase.storage
        .from('memory-photos')
        .createSignedUrl(data.path, 60 * 60);
      if (urlError || !urlData?.signedUrl) throw urlError || new Error('Could not create a signed image URL.');

      return { url: urlData.signedUrl, error: null };
    } catch (e) {
      console.error('Failed to upload image to Supabase storage:', e);
      return { url: null, error: e as Error };
    }
  }

  // 6. STORAGE: DELETE PHOTO
  public async deletePhoto(urlOrPath: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;

    try {
      let path = urlOrPath;
      if (urlOrPath.includes('/memory-photos/')) {
        const pathname = urlOrPath.startsWith('http')
          ? new URL(urlOrPath).pathname
          : urlOrPath.split('?')[0];
        const marker = '/memory-photos/';
        const markerIndex = pathname.indexOf(marker);
        path = markerIndex >= 0
          ? decodeURIComponent(pathname.slice(markerIndex + marker.length))
          : '';
      } else {
        path = urlOrPath.split('?')[0];
      }
      if (!path) return false;

      const { error } = await supabase.storage.from('memory-photos').remove([path]);
      if (error) {
        console.warn('Failed to delete photo from storage:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Error deleting photo:', e);
      return false;
    }
  }

  // 7. REDEEM COUPON
  public async redeemCoupon(couponId: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;

    try {
      // Try calling RPC function
      const { data, error } = await supabase.rpc('redeem_love_coupon', { p_coupon_id: couponId });
      if (!error && data === true) return true;

      // Direct update fallback
      const { error: updateError } = await supabase
        .from('love_notes')
        .update({ redeemed: true, redeemed_at: new Date().toISOString() })
        .eq('id', couponId);

      return !updateError;
    } catch (e) {
      console.error('Error redeeming coupon:', e);
      return false;
    }
  }

  // 8. WATCHLIST TOGGLE
  public async toggleWatchlist(memoryId: string, clientId: string, isInWatchlist: boolean): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured()) return false;

    try {
      if (isInWatchlist) {
        // Add
        const { error } = await supabase
          .from('watchlist_items')
          .insert({ memory_id: memoryId, client_id: clientId });
        return !error;
      } else {
        // Remove
        const { error } = await supabase
          .from('watchlist_items')
          .delete()
          .eq('memory_id', memoryId)
          .eq('client_id', clientId);
        return !error;
      }
    } catch (e) {
      console.warn('Error toggling watchlist in Supabase:', e);
      return false;
    }
  }

  // 9. AUTHENTICATION & ADMIN ROLES
  public async signInWithPassword(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: new AuthError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'),
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  public async signUpWithPassword(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: new AuthError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'),
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
        data: displayName ? { full_name: displayName, display_name: displayName } : undefined,
      },
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  public async resetPasswordForEmail(email: string): Promise<{ error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        error: new AuthError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'),
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });

    return { error };
  }

  public async updateUserPassword(newPassword: string): Promise<{ user: User | null; error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        user: null,
        error: new AuthError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'),
      };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return {
      user: data.user,
      error,
    };
  }

  public async signInWithOtp(email: string): Promise<{ error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return {
        error: new AuthError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'),
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
      },
    });

    return { error };
  }

  public async signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase || !isSupabaseConfigured()) return { error: null };
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  public async getCurrentSession(): Promise<Session | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!supabase || !isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  public onAuthStateChange(callback: (user: User | null, session: Session | null, event?: string) => void) {
    if (!supabase || !isSupabaseConfigured()) return () => {};
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null, session, event);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }

  // 10. SITE TEXTS & LETTERS (site_content)
  public async fetchSiteContent(): Promise<SiteContentMap> {
    if (!supabase || !isSupabaseConfigured()) return {};

    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, value');

      if (error) {
        if (isSchemaMissingError(error)) {
          return {};
        }
        console.warn('Could not fetch site_content from Supabase:', error.message);
        return {};
      }

      const map: SiteContentMap = {};
      (data as SiteContentRow[] || []).forEach((row) => {
        map[row.key] = row.value;
      });
      return map;
    } catch (e) {
      console.warn('Error reading site_content:', e);
      return {};
    }
  }

  public async updateSiteContent(
    key: string,
    value: string,
    section: string = 'general'
  ): Promise<{ success: boolean; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: new Error('Supabase client is not configured.') };
    }

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert(
          {
            key,
            value,
            section,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) throw error;
      return { success: true, error: null };
    } catch (e) {
      console.error('Failed to update site_content:', e);
      return { success: false, error: e as Error };
    }
  }

  public async batchUpdateSiteContent(
    entries: Record<string, { value: string; section?: string }>
  ): Promise<{ success: boolean; error: Error | null }> {
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: new Error('Supabase client is not configured.') };
    }

    try {
      const rows = Object.entries(entries).map(([key, item]) => ({
        key,
        value: item.value,
        section: item.section || 'general',
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('site_content')
        .upsert(rows, { onConflict: 'key' });

      if (error) throw error;
      return { success: true, error: null };
    } catch (e) {
      console.error('Failed to batch update site_content:', e);
      return { success: false, error: e as Error };
    }
  }
}

export const supabaseService = new SupabaseService();
