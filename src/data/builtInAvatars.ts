export type BuiltInAvatarCategory = 'all' | 'smileys';

export interface BuiltInAvatarItem {
  id: string;
  name: string;
  category: 'smileys';
  colorName: string;
  bgColor: string;
  url: string;
}

const svgToDataUri = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// Netflix-style smiley face on a gradient tile
function createSmileySvg(
  id: string,
  colorTop: string,
  colorBottom: string,
  eyeColor = '#ffffff',
  mouthColor = '#ffffff'
): string {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="bg_${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colorTop}"/>
          <stop offset="100%" stop-color="${colorBottom}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg_${id})"/>
      <circle cx="70" cy="90" r="9" fill="${eyeColor}"/>
      <circle cx="130" cy="90" r="9" fill="${eyeColor}"/>
      <path
        d="M 65 125 Q 100 150 135 125"
        stroke="${mouthColor}"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
  `);
}

export const BUILT_IN_AVATARS: BuiltInAvatarItem[] = [
  {
    id: 'smiley-pink',
    name: 'Pink',
    category: 'smileys',
    colorName: 'Pink',
    bgColor: '#e91e8c',
    url: createSmileySvg('smiley-pink', '#e91e8c', '#b8146f'),
  },
  {
    id: 'smiley-red',
    name: 'Red',
    category: 'smileys',
    colorName: 'Red',
    bgColor: '#e0332e',
    url: createSmileySvg('smiley-red', '#e0332e', '#b82420'),
  },
  {
    id: 'smiley-yellow',
    name: 'Yellow',
    category: 'smileys',
    colorName: 'Yellow',
    bgColor: '#e6c840',
    url: createSmileySvg('smiley-yellow', '#e6c840', '#c7a832'),
  },
  {
    id: 'smiley-blue',
    name: 'Blue',
    category: 'smileys',
    colorName: 'Blue',
    bgColor: '#3b82f6',
    url: createSmileySvg('smiley-blue', '#3b82f6', '#2563eb'),
  },
  {
    id: 'smiley-purple',
    name: 'Purple',
    category: 'smileys',
    colorName: 'Purple',
    bgColor: '#8b5cf6',
    url: createSmileySvg('smiley-purple', '#8b5cf6', '#7c3aed'),
  },
  {
    id: 'smiley-green',
    name: 'Green',
    category: 'smileys',
    colorName: 'Green',
    bgColor: '#22c55e',
    url: createSmileySvg('smiley-green', '#22c55e', '#16a34a'),
  },
];

// For older callers that expect these exports
export const BUILT_IN_AVATAR_CATEGORIES: { id: 'all' | BuiltInAvatarCategory; label: string }[] = [
  { id: 'all', label: 'All Avatars' },
];

export type BuiltInAvatarCategoryType = BuiltInAvatarCategory;

/**
 * Return the correct tile URL for a profile.
 * - If avatarId matches a built-in smiley, return its URL.
 * - If avatarUrl is a real uploaded photo, keep it.
 * - Otherwise, fall back to the first smiley.
 */
export function getProfileAvatarUrl(profile: {
  id?: string;
  role?: string;
  avatarUrl?: string;
  avatarId?: string;
  name?: string;
}): string {
  // Keep genuine custom uploaded photos.
  if (
    profile.avatarUrl &&
    (profile.avatarUrl.startsWith('http://') ||
      profile.avatarUrl.startsWith('https://') ||
      profile.avatarUrl.startsWith('data:image/jpeg') ||
      profile.avatarUrl.startsWith('data:image/png') ||
      profile.avatarUrl.startsWith('data:image/webp'))
  ) {
    return profile.avatarUrl;
  }

  // Match a built-in smiley.
  if (profile.avatarId) {
    const found = BUILT_IN_AVATARS.find((avatar) => avatar.id === profile.avatarId);
    if (found) return found.url;
  }

  // Role-based defaults.
  const role = (profile.role || '').toLowerCase();
  if (role === 'together') return BUILT_IN_AVATARS[0].url;
  if (role === 'partner1') return BUILT_IN_AVATARS[1].url;
  if (role === 'partner2') return BUILT_IN_AVATARS[2].url;

  return BUILT_IN_AVATARS[0].url;
}
