import { MemoryItem, UserProfile, NotificationItem, SiteContentMap } from '../types';
import { DEFAULT_MEMORIES, DEFAULT_PROFILES, DEFAULT_NOTIFICATIONS } from '../data/defaultData';
import { DEFAULT_SITE_CONTENT_MAP } from '../data/defaultSiteContent';
import { isSupabaseConfigured, getSupabaseConfigStatus } from './supabaseClient';
import { supabaseService, isSchemaMissingError } from './supabaseService';

const STORAGE_KEYS = {
  MEMORIES: 'our_universe_memories_v2',
  PROFILES: 'our_universe_profiles_v1',
  ACTIVE_PROFILE: 'our_universe_active_profile_v1',
  NOTIFICATIONS: 'our_universe_notifications_v1',
  CLIENT_ID: 'our_universe_client_id_v1',
  MUTED: 'our_universe_audio_muted_v1',
  SITE_CONTENT: 'our_universe_site_content_v1',
};


class UnifiedStorageService {
  // CLIENT ID FOR DEVICE / GUEST WATCHLIST TRACKING
  public getClientId(): string {
    let id = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
    if (!id) {
      id = 'client_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.CLIENT_ID, id);
    }
    return id;
  }

  public getStorageMode(): 'local' | 'supabase' {
    return isSupabaseConfigured() ? 'supabase' : 'local';
  }

  public getStatus() {
    return getSupabaseConfigStatus();
  }

  // 1. MEMORIES: ASYNCHRONOUS DATA LOADER
  public async loadMemories(): Promise<{
    memories: MemoryItem[];
    source: 'supabase' | 'local';
    error?: string;
    isSchemaMissing?: boolean;
  }> {
    if (isSupabaseConfigured()) {
      try {
        const remoteList = await supabaseService.fetchMemories();
        if (remoteList && remoteList.length > 0) {
          // Cache in local storage for instant offline / fast loading
          this.saveLocalMemories(remoteList);
          return { memories: remoteList, source: 'supabase' };
        }
        // If Supabase returned 0 items, check if we have local items or defaults
        const local = this.getLocalMemories();
        return {
          memories: local.length > 0 ? local : DEFAULT_MEMORIES,
          source: 'supabase',
          error: 'Connected to Supabase, but the memories table is empty. Click "Migrate / Seed to Supabase" to push your memories!',
        };
      } catch (err) {
        const isSchemaIssue = isSchemaMissingError(err);
        const fallback = this.getLocalMemories();
        return {
          memories: fallback.length > 0 ? fallback : DEFAULT_MEMORIES,
          source: 'local',
          isSchemaMissing: isSchemaIssue,
          error: isSchemaIssue
            ? 'SCHEMA_NOT_INITIALIZED'
            : (err as Error).message || 'Database connection error. Using local offline cache.',
        };
      }
    }

    // Local mode
    const list = this.getLocalMemories();
    return {
      memories: list.length > 0 ? list : DEFAULT_MEMORIES,
      source: 'local',
    };
  }

  // Synchronous getter for instant render before async completes
  public getInitialMemories(): MemoryItem[] {
    const local = this.getLocalMemories();
    if (local.length > 0) return local;
    this.saveLocalMemories(DEFAULT_MEMORIES);
    return DEFAULT_MEMORIES;
  }

  public getLocalMemories(): MemoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (stored) {
        const parsed = JSON.parse(stored) as MemoryItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read memories from localStorage', e);
    }
    return [];
  }

  private saveLocalMemories(list: MemoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save memories to localStorage', e);
    }
  }

  // 2. SAVE MEMORY (CREATE / UPDATE)
  public async saveMemory(item: MemoryItem): Promise<{ success: boolean; item: MemoryItem; error?: string }> {
    // 1. Update local cache immediately
    const list = this.getLocalMemories();
    const existingIndex = list.findIndex((m) => m.id === item.id);
    let updatedList: MemoryItem[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = item;
    } else {
      updatedList = [item, ...list];
    }
    this.saveLocalMemories(updatedList);

    // 2. If Supabase configured, push to database
    if (isSupabaseConfigured()) {
      if (existingIndex >= 0) {
        const { error } = await supabaseService.updateMemory(item.id, item);
        if (error) {
          return { success: false, item, error: error.message };
        }
      } else {
        const { error } = await supabaseService.createMemory(item);
        if (error) {
          return { success: false, item, error: error.message };
        }
      }
    }

    return { success: true, item };
  }

  // 3. DELETE MEMORY
  public async deleteMemory(id: string, photoUrl?: string): Promise<{ success: boolean; error?: string }> {
    // 1. Delete from local cache
    const list = this.getLocalMemories();
    const filtered = list.filter((m) => m.id !== id);
    this.saveLocalMemories(filtered);

    // 2. Delete from Supabase
    if (isSupabaseConfigured()) {
      const { success, error } = await supabaseService.deleteMemory(id, photoUrl);
      if (!success) {
        return { success: false, error: error?.message || 'Failed to delete from Supabase' };
      }
    }

    return { success: true };
  }

  // 3b. STORYLINE CUSTOM ORDERING
  public getStorylineOrder(): string[] | null {
    try {
      const stored = localStorage.getItem('our_universe_storyline_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read storyline order from localStorage:', e);
    }
    return null;
  }

  public saveLocalStorylineOrder(orderedIds: string[]): void {
    try {
      localStorage.setItem('our_universe_storyline_order', JSON.stringify(orderedIds));
    } catch (e) {
      console.error('Failed to save storyline order to localStorage:', e);
    }
  }

  public async saveStorylineOrder(
    orderedStories: MemoryItem[]
  ): Promise<{ success: boolean; error?: string }> {
    const orderedIds = orderedStories.map((s) => s.id);

    // 1. Save locally in dedicated key immediately
    this.saveLocalStorylineOrder(orderedIds);

    // 2. Update local memories cache with new rank (isTop10 & sortOrder)
    const list = this.getLocalMemories();
    const updatedMemories = list.map((m) => {
      const idx = orderedIds.indexOf(m.id);
      if (idx !== -1) {
        return { ...m, isTop10: idx + 1, sortOrder: idx + 1 };
      }
      return m;
    });
    this.saveLocalMemories(updatedMemories);

    // 3. Update local site content
    const siteContent = this.getLocalSiteContent();
    siteContent['storyline_custom_order'] = JSON.stringify(orderedIds);
    this.saveLocalSiteContent(siteContent);

    // 4. Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      const { success, error } = await supabaseService.saveStorylineOrder(orderedIds);
      if (!success) {
        return {
          success: false,
          error: error?.message || 'Failed to save custom storyline order to Supabase database',
        };
      }
    }

    return { success: true };
  }

  // 4. TOGGLE WATCHLIST
  public async toggleWatchlist(id: string): Promise<boolean> {
    const list = this.getLocalMemories();
    const item = list.find((m) => m.id === id);
    if (!item) return false;

    const newStatus = !item.isInWatchlist;
    item.isInWatchlist = newStatus;
    this.saveLocalMemories(list);

    if (isSupabaseConfigured()) {
      await supabaseService.toggleWatchlist(id, this.getClientId(), newStatus);
      await supabaseService.updateMemory(id, { isInWatchlist: newStatus });
    }

    return newStatus;
  }

  // 5. REDEEM COUPON
  public async redeemCoupon(vaultId: string, couponId: string): Promise<boolean> {
    // Update locally
    const list = this.getLocalMemories();
    const vault = list.find((m) => m.id === vaultId);
    if (vault && vault.coupons) {
      const coupon = vault.coupons.find((c) => c.id === couponId);
      if (coupon) {
        coupon.redeemed = true;
        this.saveLocalMemories(list);
      }
    }

    if (isSupabaseConfigured()) {
      await supabaseService.redeemCoupon(couponId);
    }

    return true;
  }

  // 6. UPDATE PROGRESS
  public async updateProgress(id: string, progress: number): Promise<void> {
    const list = this.getLocalMemories();
    const item = list.find((m) => m.id === id);
    if (!item) return;

    item.progress = Math.min(100, Math.max(0, progress));
    this.saveLocalMemories(list);

    if (isSupabaseConfigured()) {
      await supabaseService.updateMemory(id, { progress: item.progress });
    }
  }

  // 7. PROFILES & PREFERENCES
  public getProfiles(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read profiles', e);
    }
    this.saveProfilesList(DEFAULT_PROFILES);
    return DEFAULT_PROFILES;
  }

  public getAuthorizedProfiles(userId?: string, userEmail?: string, isAdmin: boolean = false): UserProfile[] {
    const allProfiles = this.getProfiles();
    const normalizedEmail = (userEmail || '').toLowerCase().trim();

    const filtered = allProfiles.filter((p) => {
      if (p.isAdminOnly && !isAdmin) return false;
      if (p.ownerId && !isAdmin && p.ownerId !== userId) return false;
      if (p.ownerEmail && !isAdmin && p.ownerEmail.toLowerCase().trim() !== normalizedEmail) return false;
      return true;
    });

    return filtered.length > 0 ? filtered : allProfiles.filter((p) => !p.isAdminOnly);
  }

  public getActiveProfile(): UserProfile {
    const profiles = this.getProfiles();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
    const found = profiles.find((p) => p.id === activeId);
    return found || profiles[0] || DEFAULT_PROFILES[0];
  }

  public setActiveProfile(profileId: string, userId?: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, profileId);
    if (userId) {
      try {
        sessionStorage.setItem(`our_universe_session_profile_${userId}`, profileId);
      } catch (e) {
        // Ignore sessionStorage errors in restricted frames
      }
    }
  }

  public getSelectedSessionProfileId(userId?: string): string | null {
    if (!userId) return null;
    try {
      return sessionStorage.getItem(`our_universe_session_profile_${userId}`);
    } catch (e) {
      return null;
    }
  }

  public clearSelectedSessionProfile(userId?: string): void {
    try {
      if (userId) {
        sessionStorage.removeItem(`our_universe_session_profile_${userId}`);
      } else {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('our_universe_session_profile_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }
  }

  public saveProfilesList(list: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save profiles', e);
    }
  }

  public saveProfile(updatedProfile: UserProfile): UserProfile[] {
    const current = this.getProfiles();
    const index = current.findIndex((p) => p.id === updatedProfile.id);
    let next: UserProfile[];
    if (index >= 0) {
      next = [...current];
      next[index] = { ...current[index], ...updatedProfile };
    } else {
      next = [...current, updatedProfile];
    }
    this.saveProfilesList(next);
    return next;
  }

  // 8. NOTIFICATIONS
  public getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read notifications', e);
    }
    return DEFAULT_NOTIFICATIONS;
  }

  public markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
  }

  // 9. EXPLICIT MIGRATION: MIGRATE LOCAL TO SUPABASE
  public async migrateLocalStorageToSupabase(): Promise<{ total: number; succeeded: number; failed: number; errors: string[] }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
    }

    const localList = this.getLocalMemories();
    const listToMigrate = localList.length > 0 ? localList : DEFAULT_MEMORIES;

    let succeeded = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of listToMigrate) {
      try {
        const { error } = await supabaseService.createMemory(item);
        if (error) {
          // If already exists, update it instead
          const { error: updateError } = await supabaseService.updateMemory(item.id, item);
          if (updateError) {
            failed++;
            errors.push(`${item.title}: ${updateError.message}`);
          } else {
            succeeded++;
          }
        } else {
          succeeded++;
        }
      } catch (e) {
        failed++;
        errors.push(`${item.title}: ${(e as Error).message}`);
      }
    }

    return { total: listToMigrate.length, succeeded, failed, errors };
  }

  // 10. BACKUP JSON EXPORT & IMPORT
  public exportData(): string {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      storageMode: this.getStorageMode(),
      memories: this.getLocalMemories(),
      profiles: this.getProfiles(),
    };
    return JSON.stringify(payload, null, 2);
  }

  public importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.memories)) {
        this.saveLocalMemories(parsed.memories);
        if (Array.isArray(parsed.profiles)) {
          this.saveProfilesList(parsed.profiles);
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON data', e);
    }
    return false;
  }

  public resetToDefaults(): void {
    this.saveLocalMemories(DEFAULT_MEMORIES);
    this.saveProfilesList(DEFAULT_PROFILES);
    this.saveLocalSiteContent(DEFAULT_SITE_CONTENT_MAP);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
  }

  // 11. SITE CONTENT (TEXTS, HEADINGS, LETTERS)
  public async loadSiteContent(): Promise<SiteContentMap> {
    if (isSupabaseConfigured()) {
      try {
        const remoteContent = await supabaseService.fetchSiteContent();
        if (remoteContent && Object.keys(remoteContent).length > 0) {
          const merged = { ...DEFAULT_SITE_CONTENT_MAP, ...this.getLocalSiteContent(), ...remoteContent };
          this.saveLocalSiteContent(merged);
          return merged;
        }
      } catch (e) {
        console.warn('Could not load remote site_content, using local fallback:', e);
      }
    }
    return this.getInitialSiteContent();
  }

  public getInitialSiteContent(): SiteContentMap {
    const local = this.getLocalSiteContent();
    return { ...DEFAULT_SITE_CONTENT_MAP, ...local };
  }

  public getLocalSiteContent(): SiteContentMap {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      if (stored) {
        const parsed = JSON.parse(stored) as SiteContentMap;
        if (parsed.anniversary_date && parsed.anniversary_date < '2025-06-15') {
          parsed.anniversary_date = '2025-06-15';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read site content from localStorage:', e);
    }
    return {};
  }

  private saveLocalSiteContent(content: SiteContentMap): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
    } catch (e) {
      console.error('Failed to save site content to localStorage:', e);
    }
  }

  public async saveSiteContentItem(
    key: string,
    value: string,
    section: string = 'general'
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Update local cache immediately
    const current = this.getLocalSiteContent();
    const updated = { ...current, [key]: value };
    this.saveLocalSiteContent(updated);

    // 2. If Supabase configured, push to database
    if (isSupabaseConfigured()) {
      const { success, error } = await supabaseService.updateSiteContent(key, value, section);
      if (!success) {
        return { success: false, error: error?.message || 'Failed to save to Supabase' };
      }
    }

    return { success: true };
  }

  public async saveSiteContentBatch(
    entries: Record<string, { value: string; section?: string }>
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Update local cache immediately
    const current = this.getLocalSiteContent();
    const updated = { ...current };
    Object.entries(entries).forEach(([k, item]) => {
      updated[k] = item.value;
    });
    this.saveLocalSiteContent(updated);

    // 2. If Supabase configured, push to database
    if (isSupabaseConfigured()) {
      const { success, error } = await supabaseService.batchUpdateSiteContent(entries);
      if (!success) {
        return { success: false, error: error?.message || 'Failed to batch save to Supabase' };
      }
    }

    return { success: true };
  }
}

export const storageService = new UnifiedStorageService();
