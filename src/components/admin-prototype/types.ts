export type AdminTab =
  | 'overview'
  | 'memories'
  | 'photos'
  | 'letters'
  | 'chapters'
  | 'site-content'
  | 'coupons'
  | 'settings'
  | 'preview';

export interface PrototypeMemory {
  id: string;
  title: string;
  category: 'our-story' | 'memories' | 'little-things' | 'places-list' | 'secret-vault';
  date: string;
  year: string;
  duration: string;
  matchScore: number;
  rating: string;
  synopsis: string;
  fullStory: string;
  location?: string;
  tags: string[];
  coverUrl?: string;
  isFeatured?: boolean;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface PrototypePhoto {
  id: string;
  title: string;
  caption?: string;
  category: 'trips' | 'celebrations' | 'candid' | 'milestones';
  url: string;
  date: string;
  location?: string;
  createdAt: string;
}

export interface PrototypeLetter {
  id: string;
  title: string;
  recipient: string;
  date: string;
  content: string;
  status: 'published' | 'draft';
  readTime: string;
  createdAt: string;
}

export interface PrototypeChapter {
  id: string;
  order: number;
  title: string;
  duration: string;
  date?: string;
  description: string;
  storyContent: string;
  coverUrl?: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface PrototypeSiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroCtaText: string;
  heroBackdropUrl: string;
  seriesHeading: string;
  moviesHeading: string;
  quirksHeading: string;
  placesHeading: string;
  partner1Name: string;
  partner2Name: string;
  anniversaryDate: string;
  milestoneQuote: string;
}

export interface PrototypeCoupon {
  id: string;
  title: string;
  description: string;
  terms: string;
  validUntil: string;
  status: 'active' | 'redeemed' | 'expired';
  category: 'romance' | 'adventure' | 'chill' | 'food';
  createdAt: string;
}

export interface PrototypeActivity {
  id: string;
  action: 'create' | 'update' | 'delete';
  targetType: 'Memory' | 'Photo' | 'Letter' | 'Chapter' | 'Coupon' | 'Content';
  targetTitle: string;
  timestamp: string;
  badgeColor?: string;
}

export interface PrototypeToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface PrototypeSettings {
  themeAccent: 'netflix-red' | 'crimson-glow' | 'ruby-rose';
  contentDensity: 'comfortable' | 'compact';
  dateFormat: 'MMM D, YYYY' | 'YYYY-MM-DD' | 'DD/MM/YYYY';
  autoSaveDrafts: boolean;
  enableSoundEffects: boolean;
}
