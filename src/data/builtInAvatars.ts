export type BuiltInAvatarCategory =
  | 'symbols'
  | 'cinematic'
  | 'colors';

export interface BuiltInAvatarItem {
  id: string;
  name: string;
  category: BuiltInAvatarCategory;
  categoryLabel: string;
  colorName: string;
  bgColor: string;
  iconName: string;
  url: string;
}

const svgToDataUri = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// Helper to create a premium Netflix-inspired colored tile with subtle gradient, top sheen, and crisp white symbol
function createTileSvg(id: string, colorTop: string, colorBottom: string, symbolSvg: string): string {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="bg_${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colorTop}"/>
          <stop offset="100%" stop-color="${colorBottom}"/>
        </linearGradient>
        <linearGradient id="sheen_${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.30"/>
        </linearGradient>
        <filter id="shadow_${id}" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <!-- Base Gradient -->
      <rect width="200" height="200" fill="url(#bg_${id})"/>
      <!-- Soft Top Specular Sheen -->
      <rect width="200" height="200" fill="url(#sheen_${id})"/>
      <!-- Crisp White Lucide-Style Symbol -->
      <g filter="url(#shadow_${id})">
        ${symbolSvg}
      </g>
    </svg>
  `);
}

// Crisp white SVG symbols matching Lucide designs
const SYMBOL_HEART = `
  <path d="M100 155 C100 155 45 120 45 78 C45 54 62 40 82 40 C94 40 100 48 100 48 C100 48 106 40 118 40 C138 40 155 54 155 78 C155 120 100 155 100 155 Z" fill="#ffffff"/>
`;

const SYMBOL_SPARKLES = `
  <path d="M100 36 Q100 100 36 100 Q100 100 100 164 Q100 100 164 100 Q100 100 100 36 Z" fill="#ffffff"/>
  <circle cx="146" cy="54" r="5" fill="#ffffff"/>
  <circle cx="56" cy="144" r="4" fill="#ffffff"/>
`;

const SYMBOL_MOON = `
  <path d="M125 44 C86 44 60 74 60 104 C60 142 90 166 126 166 C138 166 148 163 154 160 C118 152 100 126 100 104 C100 80 116 56 152 48 C144 45 135 44 125 44 Z" fill="#ffffff"/>
`;

const SYMBOL_STAR = `
  <polygon points="100,38 119,76 160,82 131,111 138,152 100,132 62,152 69,111 40,82 81,76" fill="#ffffff"/>
`;

const SYMBOL_FILM = `
  <rect x="44" y="52" width="112" height="96" rx="14" fill="none" stroke="#ffffff" stroke-width="10"/>
  <polygon points="88,80 88,120 126,100" fill="#ffffff"/>
`;

const SYMBOL_MUSIC = `
  <path d="M74 144 A16 13 0 1 1 58 131 L58 64 L142 48 L142 128 A16 13 0 1 1 126 115 L126 62 L74 72 Z" fill="#ffffff"/>
`;

const SYMBOL_CROWN = `
  <path d="M46 145 L46 88 L74 116 L100 66 L126 116 L154 88 L154 145 Z" fill="#ffffff"/>
  <circle cx="46" cy="78" r="5" fill="#ffffff"/>
  <circle cx="100" cy="56" r="6" fill="#ffffff"/>
  <circle cx="154" cy="78" r="5" fill="#ffffff"/>
`;

const SYMBOL_COMPASS = `
  <circle cx="100" cy="100" r="54" fill="none" stroke="#ffffff" stroke-width="8"/>
  <polygon points="100,52 116,94 100,88 84,94" fill="#ffffff"/>
  <polygon points="100,148 116,106 100,112 84,106" fill="#ffffff" opacity="0.6"/>
  <circle cx="100" cy="100" r="5" fill="#ffffff"/>
`;

const SYMBOL_SUN = `
  <circle cx="100" cy="100" r="28" fill="#ffffff"/>
  <line x1="100" y1="44" x2="100" y2="30" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="100" y1="156" x2="100" y2="170" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="44" y1="100" x2="30" y2="100" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="156" y1="100" x2="170" y2="100" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="60" y1="60" x2="50" y2="50" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="140" y1="140" x2="150" y2="150" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="60" y1="140" x2="50" y2="150" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  <line x1="140" y1="60" x2="150" y2="50" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
`;

export const BUILT_IN_AVATAR_CATEGORIES: { id: 'all' | BuiltInAvatarCategory; label: string }[] = [
  { id: 'all', label: 'All Tiles' },
  { id: 'symbols', label: 'Classic Symbols' },
  { id: 'cinematic', label: 'Cinema & Arts' },
  { id: 'colors', label: 'Rich Colors' },
];

export const BUILT_IN_AVATARS: BuiltInAvatarItem[] = [
  // =========================================================================
  // 1. SIGNATURE DEFAULT TILES
  // =========================================================================
  {
    id: 'tile-crimson-heart',
    name: 'Signature Crimson',
    category: 'symbols',
    categoryLabel: 'Classic Symbols',
    colorName: 'Netflix Crimson',
    bgColor: '#b91c1c',
    iconName: 'heart',
    url: createTileSvg('crimson-heart', '#b91c1c', '#60070e', SYMBOL_HEART),
  },
  {
    id: 'tile-royal-amethyst',
    name: 'Royal Amethyst',
    category: 'symbols',
    categoryLabel: 'Classic Symbols',
    colorName: 'Royal Violet',
    bgColor: '#701a75',
    iconName: 'sparkles',
    url: createTileSvg('royal-amethyst', '#701a75', '#3b0764', SYMBOL_SPARKLES),
  },
  {
    id: 'tile-midnight-sapphire',
    name: 'Midnight Sapphire',
    category: 'symbols',
    categoryLabel: 'Classic Symbols',
    colorName: 'Deep Navy',
    bgColor: '#1e3a8a',
    iconName: 'moon',
    url: createTileSvg('midnight-sapphire', '#1e3a8a', '#0f172a', SYMBOL_MOON),
  },

  // =========================================================================
  // 2. SOPHISTICATED PALETTE & SYMBOLS
  // =========================================================================
  {
    id: 'tile-deep-emerald',
    name: 'Emerald Star',
    category: 'colors',
    categoryLabel: 'Rich Colors',
    colorName: 'Forest Emerald',
    bgColor: '#047857',
    iconName: 'star',
    url: createTileSvg('deep-emerald', '#047857', '#022c22', SYMBOL_STAR),
  },
  {
    id: 'tile-muted-gold',
    name: 'Muted Gold',
    category: 'colors',
    categoryLabel: 'Rich Colors',
    colorName: 'Warm Amber',
    bgColor: '#b45309',
    iconName: 'sun',
    url: createTileSvg('muted-gold', '#d97706', '#451a03', SYMBOL_SUN),
  },
  {
    id: 'tile-deep-burgundy',
    name: 'Deep Burgundy',
    category: 'colors',
    categoryLabel: 'Rich Colors',
    colorName: 'Wine Burgundy',
    bgColor: '#881337',
    iconName: 'heart',
    url: createTileSvg('deep-burgundy', '#9f1239', '#4c0519', SYMBOL_HEART),
  },
  {
    id: 'tile-obsidian-noir',
    name: 'Obsidian Noir',
    category: 'cinematic',
    categoryLabel: 'Cinema & Arts',
    colorName: 'Charcoal Black',
    bgColor: '#27272a',
    iconName: 'film',
    url: createTileSvg('obsidian-noir', '#3f3f46', '#09090b', SYMBOL_FILM),
  },
  {
    id: 'tile-cobalt-sky',
    name: 'Royal Cobalt',
    category: 'colors',
    categoryLabel: 'Rich Colors',
    colorName: 'Cobalt Blue',
    bgColor: '#0284c7',
    iconName: 'compass',
    url: createTileSvg('cobalt-sky', '#0284c7', '#082f49', SYMBOL_COMPASS),
  },
  {
    id: 'tile-regal-crown',
    name: 'Regal Crown',
    category: 'cinematic',
    categoryLabel: 'Cinema & Arts',
    colorName: 'Plum Royale',
    bgColor: '#581c87',
    iconName: 'crown',
    url: createTileSvg('regal-crown', '#6b21a8', '#2e1065', SYMBOL_CROWN),
  },
  {
    id: 'tile-harmony-music',
    name: 'Midnight Melodies',
    category: 'cinematic',
    categoryLabel: 'Cinema & Arts',
    colorName: 'Deep Teal',
    bgColor: '#0f766e',
    iconName: 'music',
    url: createTileSvg('harmony-music', '#0f766e', '#042f2e', SYMBOL_MUSIC),
  },
  {
    id: 'tile-warm-terracotta',
    name: 'Warm Terracotta',
    category: 'colors',
    categoryLabel: 'Rich Colors',
    colorName: 'Burnt Sienna',
    bgColor: '#c2410c',
    iconName: 'star',
    url: createTileSvg('warm-terracotta', '#c2410c', '#431407', SYMBOL_STAR),
  },
  {
    id: 'tile-slate-voyager',
    name: 'Slate Moon',
    category: 'symbols',
    categoryLabel: 'Classic Symbols',
    colorName: 'Steel Slate',
    bgColor: '#334155',
    iconName: 'moon',
    url: createTileSvg('slate-voyager', '#475569', '#0f172a', SYMBOL_MOON),
  },
];

/**
 * Returns the clean, deterministic Netflix-style colored tile for any profile.
 * - Preserves genuine user-uploaded custom photos (e.g. http/https or custom data:image/png/jpeg).
 * - For profiles without a custom photo, deterministically assigns:
 *   - 'together' / 'profile-together' -> Signature Crimson Heart tile
 *   - 'partner1' / 'profile-her'      -> Royal Amethyst Sparkles tile
 *   - 'partner2' / 'profile-him'      -> Midnight Sapphire Moon tile
 *   - Other profiles                  -> Deterministic colored tile based on ID
 */
export function getProfileAvatarUrl(profile: {
  id?: string;
  role?: string;
  avatarUrl?: string;
  avatarId?: string;
  name?: string;
}): string {
  // If the user has a deliberately uploaded photo (e.g. from Supabase storage or external URL), preserve it!
  if (
    profile.avatarUrl &&
    profile.avatarUrl.trim() !== '' &&
    !profile.avatarUrl.includes('data:image/svg+xml') &&
    (profile.avatarUrl.startsWith('http://') ||
      profile.avatarUrl.startsWith('https://') ||
      profile.avatarUrl.startsWith('data:image/jpeg') ||
      profile.avatarUrl.startsWith('data:image/png') ||
      profile.avatarUrl.startsWith('data:image/webp'))
  ) {
    return profile.avatarUrl;
  }

  // If a specific tile ID was chosen in the avatar picker
  if (profile.avatarId) {
    const found = BUILT_IN_AVATARS.find((a) => a.id === profile.avatarId);
    if (found) return found.url;
  }

  // Check if current avatarUrl matches one of our tile SVGs
  if (profile.avatarUrl && profile.avatarUrl.startsWith('data:image/svg+xml')) {
    const matchingTile = BUILT_IN_AVATARS.find((a) => a.url === profile.avatarUrl);
    if (matchingTile) return matchingTile.url;
  }

  const role = (profile.role || '').toLowerCase();
  const id = (profile.id || '').toLowerCase();
  const name = (profile.name || '').toLowerCase();

  // 1. Signature Crimson Heart for "Our Universe" / together
  if (role === 'together' || id.includes('together') || id.includes('universe') || name.includes('universe')) {
    return BUILT_IN_AVATARS[0].url; // Signature Crimson Heart
  }

  // 2. Royal Amethyst Sparkles for "My Girl 👑" / partner1
  if (role === 'partner1' || id.includes('her') || id.includes('girl') || name.includes('girl')) {
    return BUILT_IN_AVATARS[1].url; // Royal Amethyst Sparkles
  }

  // 3. Midnight Sapphire Moon for "Your Guy 🌙" / partner2
  if (role === 'partner2' || id.includes('him') || id.includes('guy') || name.includes('guy')) {
    return BUILT_IN_AVATARS[2].url; // Midnight Sapphire Moon
  }

  // Deterministic fallback based on profile ID hash
  let hash = 0;
  const seed = id || name || 'profile';
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BUILT_IN_AVATARS.length;
  return BUILT_IN_AVATARS[index].url;
}
