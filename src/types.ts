export type MemoryCategory = 
  | 'our-story' 
  | 'memories' 
  | 'little-things' 
  | 'places-list' 
  | 'secret-vault';

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  gradient: string;
  date?: string;
}

export interface CouponItem {
  id: string;
  title: string;
  perk: string;
  terms: string;
  redeemed: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  subtitle?: string;
  category: MemoryCategory;
  date: string;
  year: string;
  duration: string;
  matchScore: number; // e.g. 99, 100
  rating: string; // e.g. 'TV-MA (Mostly Adorable)', 'PG-Love'
  synopsis: string;
  fullStory: string;
  location?: string;
  tags: string[];
  backdropUrl?: string;
  posterUrl?: string;
  videoUrl?: string;
  fallbackGradient: string;
  progress?: number; // 0 to 100 (for Continue Watching)
  isTop10?: number; // 1 to 10 (for Original Series rank)
  sortOrder?: number; // Custom manual storyline order
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  isSecret?: boolean;
  secretPasscode?: string;
  letterContent?: string;
  coupons?: CouponItem[];
  episodes?: Episode[];
  photos?: string[];
  listStatus?: 'visited' | 'bucket-list';
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'partner1' | 'partner2' | 'together';
  avatarEmoji: string;
  avatarBg: string;
  avatarUrl?: string;
  avatarId?: string;
  favoriteSeason?: string;
  ownerId?: string;
  ownerEmail?: string;
  isAdminOnly?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  memoryId?: string;
}

export type SiteContentSection = 'hero' | 'letter' | 'sections' | 'couple' | 'general';

export interface SiteContentItem {
  key: string;
  section: SiteContentSection;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'image' | 'date';
  updated_at?: string;
}

export type SiteContentMap = Record<string, string>;

export interface VisitorMessage {
  id: string;
  senderName: string;
  senderEmail?: string;
  message: string;
  relationship?: string;
  isRead: boolean;
  createdAt: string;
}

export interface StorageFileItem {
  name: string;
  id?: string;
  size?: number;
  createdAt?: string;
  url: string;
}
