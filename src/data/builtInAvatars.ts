export type BuiltInAvatarCategory =
  | 'illustrated'
  | 'anime'
  | 'cute'
  | 'cinematic'
  | 'abstract';

export interface BuiltInAvatarItem {
  id: string;
  name: string;
  category: BuiltInAvatarCategory;
  categoryLabel: string;
  url: string;
}

const svgToDataUri = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const BUILT_IN_AVATAR_CATEGORIES: { id: 'all' | BuiltInAvatarCategory; label: string }[] = [
  { id: 'all', label: 'All Avatars' },
  { id: 'illustrated', label: 'Illustrated' },
  { id: 'anime', label: 'Anime Portraits' },
  { id: 'cute', label: 'Cute Characters' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'abstract', label: 'Abstract Icons' },
];

export const BUILT_IN_AVATARS: BuiltInAvatarItem[] = [
  // =========================================================================
  // 1. ORIGINAL ILLUSTRATED CHARACTERS
  // =========================================================================
  {
    id: 'illus-crimson-muse',
    name: 'Crimson Muse',
    category: 'illustrated',
    categoryLabel: 'Illustrated',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E50914"/>
            <stop offset="100%" stop-color="#5c0308"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#bg1)"/>
        <circle cx="80" cy="40" r="65" fill="#ffffff" fill-opacity="0.07"/>
        <path d="M35 160 C35 118 125 118 125 160 Z" fill="#141414"/>
        <path d="M40 76 C40 42 120 42 120 76 C120 112 112 126 112 126 L48 126 C48 126 40 112 40 76 Z" fill="#1c1214"/>
        <circle cx="80" cy="80" r="28" fill="#f6c7b3"/>
        <path d="M50 74 C54 48 106 48 110 74 C98 62 68 62 50 74 Z" fill="#1c1214"/>
        <circle cx="70" cy="80" r="3.2" fill="#1a1a1a"/>
        <circle cx="90" cy="80" r="3.2" fill="#1a1a1a"/>
        <circle cx="71" cy="79" r="1" fill="#ffffff"/>
        <circle cx="91" cy="79" r="1" fill="#ffffff"/>
        <path d="M65 73 Q70 70 75 73" stroke="#1c1214" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M85 73 Q90 70 95 73" stroke="#1c1214" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M74 92 Q80 97 86 92" stroke="#E50914" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="52" cy="86" r="4" fill="#fbbf24"/>
        <circle cx="108" cy="86" r="4" fill="#fbbf24"/>
      </svg>
    `),
  },
  {
    id: 'illus-midnight-poet',
    name: 'Midnight Poet',
    category: 'illustrated',
    categoryLabel: 'Illustrated',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#bg2)"/>
        <circle cx="122" cy="34" r="14" fill="#fde047" fill-opacity="0.85"/>
        <circle cx="127" cy="31" r="12" fill="#172030"/>
        <path d="M32 160 C34 116 126 116 128 160 Z" fill="#E50914"/>
        <path d="M62 124 L80 144 L98 124 Z" fill="#141414"/>
        <circle cx="80" cy="80" r="28" fill="#eab69f"/>
        <path d="M50 72 C50 44 110 44 110 72 C106 58 88 54 74 58 C62 60 54 66 50 72 Z" fill="#111827"/>
        <rect x="61" y="74" width="15" height="11" rx="3" stroke="#ffffff" stroke-width="2.2" fill="none"/>
        <rect x="84" y="74" width="15" height="11" rx="3" stroke="#ffffff" stroke-width="2.2" fill="none"/>
        <line x1="76" y1="79" x2="84" y2="79" stroke="#ffffff" stroke-width="2.2"/>
        <circle cx="68.5" cy="79.5" r="2.2" fill="#111827"/>
        <circle cx="91.5" cy="79.5" r="2.2" fill="#111827"/>
        <path d="M74 94 Q80 98 86 94" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'illus-golden-dreamer',
    name: 'Golden Hour Dreamer',
    category: 'illustrated',
    categoryLabel: 'Illustrated',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#bg3)"/>
        <circle cx="80" cy="80" r="62" fill="#fde68a" fill-opacity="0.1"/>
        <path d="M36 160 C38 118 122 118 124 160 Z" fill="#fef3c7"/>
        <circle cx="52" cy="64" r="18" fill="#29150c"/>
        <circle cx="108" cy="64" r="18" fill="#29150c"/>
        <circle cx="80" cy="82" r="28" fill="#d99b78"/>
        <path d="M52 74 Q80 50 108 74 Q80 62 52 74 Z" fill="#29150c"/>
        <circle cx="70" cy="82" r="3" fill="#1c1917"/>
        <circle cx="90" cy="82" r="3" fill="#1c1917"/>
        <circle cx="64" cy="88" r="4.5" fill="#E50914" fill-opacity="0.35"/>
        <circle cx="96" cy="88" r="4.5" fill="#E50914" fill-opacity="0.35"/>
        <path d="M73 93 Q80 99 87 93" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'illus-velvet-voyager',
    name: 'Velvet Voyager',
    category: 'illustrated',
    categoryLabel: 'Illustrated',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#881337"/>
            <stop offset="100%" stop-color="#1f0912"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#bg4)"/>
        <path d="M34 160 C38 118 122 118 126 160 Z" fill="#181818"/>
        <circle cx="80" cy="80" r="29" fill="#f3c6b1"/>
        <path d="M46 66 C52 38 108 38 114 66 L108 72 C94 56 66 56 52 72 Z" fill="#E50914"/>
        <rect x="60" y="75" width="17" height="10" rx="2" fill="#141414"/>
        <rect x="83" y="75" width="17" height="10" rx="2" fill="#141414"/>
        <line x1="77" y1="79" x2="83" y2="79" stroke="#fbbf24" stroke-width="2.5"/>
        <path d="M73 94 Q80 99 87 94" stroke="#9f1239" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },

  // =========================================================================
  // 2. ANIME-INSPIRED PORTRAITS
  // =========================================================================
  {
    id: 'anime-starlight-heroine',
    name: 'Starlight Heroine',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="an1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#311042"/>
            <stop offset="100%" stop-color="#0f0718"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#an1)"/>
        <circle cx="32" cy="36" r="2" fill="#ffffff"/>
        <circle cx="132" cy="44" r="2.5" fill="#fde047"/>
        <path d="M38 160 C42 120 118 120 122 160 Z" fill="#E50914"/>
        <path d="M36 74 C36 34 124 34 124 74 L132 134 L106 118 L104 82 L56 82 L54 118 L28 134 Z" fill="#f43f5e"/>
        <path d="M54 78 L80 110 L106 78 C106 54 54 54 54 78 Z" fill="#ffe4d6"/>
        <path d="M46 68 L62 82 L68 64 L80 80 L92 64 L98 82 L114 68 C108 42 52 42 46 68 Z" fill="#e11d48"/>
        <ellipse cx="68" cy="84" rx="5.5" ry="6.5" fill="#1e1b4b"/>
        <ellipse cx="92" cy="84" rx="5.5" ry="6.5" fill="#1e1b4b"/>
        <circle cx="66.5" cy="81.5" r="2.2" fill="#ffffff"/>
        <circle cx="90.5" cy="81.5" r="2.2" fill="#ffffff"/>
        <circle cx="70" cy="86.5" r="1.2" fill="#f43f5e"/>
        <circle cx="94" cy="86.5" r="1.2" fill="#f43f5e"/>
        <path d="M76 97 Q80 101 84 97" stroke="#e11d48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'anime-moonlight-senpai',
    name: 'Moonlight Senpai',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="an2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e1b4b"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#an2)"/>
        <circle cx="122" cy="38" r="16" fill="#e2e8f0" fill-opacity="0.2"/>
        <path d="M35 160 C40 120 120 120 125 160 Z" fill="#181818"/>
        <path d="M68 122 L80 146 L92 122 Z" fill="#E50914"/>
        <path d="M54 76 L80 112 L106 76 C106 52 54 52 54 76 Z" fill="#fde6d8"/>
        <path d="M40 72 L52 46 L70 54 L84 38 L100 52 L118 48 L120 76 L104 66 L94 78 L80 62 L66 78 L54 66 Z" fill="#e2e8f0"/>
        <ellipse cx="68" cy="82" rx="5" ry="4.5" fill="#E50914"/>
        <ellipse cx="92" cy="82" rx="5" ry="4.5" fill="#E50914"/>
        <circle cx="67" cy="80.5" r="1.8" fill="#ffffff"/>
        <circle cx="91" cy="80.5" r="1.8" fill="#ffffff"/>
        <path d="M61 75 L73 77" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
        <path d="M99 75 L87 77" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
        <path d="M75 96 Q80 99 85 96" stroke="#94a3b8" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'anime-sakura-spirit',
    name: 'Sakura Spirit',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="an3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4c0519"/>
            <stop offset="100%" stop-color="#181818"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#an3)"/>
        <path d="M38 160 C42 122 118 122 122 160 Z" fill="#ffffff"/>
        <path d="M65 125 L80 150 L95 125 Z" fill="#E50914"/>
        <circle cx="44" cy="60" r="16" fill="#fda4af"/>
        <circle cx="116" cy="60" r="16" fill="#fda4af"/>
        <path d="M54 78 L80 110 L106 78 C106 54 54 54 54 78 Z" fill="#ffedd5"/>
        <path d="M48 74 C52 44 108 44 112 74 C96 60 64 60 48 74 Z" fill="#fda4af"/>
        <ellipse cx="68" cy="84" rx="5.2" ry="6" fill="#881337"/>
        <ellipse cx="92" cy="84" rx="5.2" ry="6" fill="#881337"/>
        <circle cx="66.5" cy="82" r="2" fill="#ffffff"/>
        <circle cx="90.5" cy="82" r="2" fill="#ffffff"/>
        <path d="M75 96 Q80 101 85 96" stroke="#e11d48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'anime-cyber-ronin',
    name: 'Crimson Ronin',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#111111"/>
        <circle cx="80" cy="80" r="54" fill="#E50914" fill-opacity="0.18"/>
        <path d="M32 160 C38 118 122 118 128 160 Z" fill="#1f1f1f"/>
        <path d="M54 78 L80 112 L106 78 C106 52 54 52 54 78 Z" fill="#f5d0c5"/>
        <path d="M42 66 L58 40 L80 50 L102 40 L118 66 L104 64 L80 54 L56 64 Z" fill="#181818"/>
        <rect x="54" y="76" width="52" height="11" rx="5.5" fill="#E50914"/>
        <line x1="62" y1="81.5" x2="98" y2="81.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M56 94 L104 94 L96 116 L64 116 Z" fill="#181818"/>
      </svg>
    `),
  },

  // =========================================================================
  // 3. CUTE CHARACTERS
  // =========================================================================
  {
    id: 'cute-cozy-bear',
    name: 'Cozy Mocha Bear',
    category: 'cute',
    categoryLabel: 'Cute Character',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#7f1d1d"/>
        <circle cx="46" cy="50" r="18" fill="#92400e"/>
        <circle cx="46" cy="50" r="10" fill="#fde68a"/>
        <circle cx="114" cy="50" r="18" fill="#92400e"/>
        <circle cx="114" cy="50" r="10" fill="#fde68a"/>
        <circle cx="80" cy="86" r="44" fill="#b45309"/>
        <ellipse cx="80" cy="94" rx="18" ry="14" fill="#fef3c7"/>
        <circle cx="64" cy="78" r="5" fill="#1c1917"/>
        <circle cx="96" cy="78" r="5" fill="#1c1917"/>
        <circle cx="62.5" cy="76.5" r="1.8" fill="#ffffff"/>
        <circle cx="94.5" cy="76.5" r="1.8" fill="#ffffff"/>
        <ellipse cx="80" cy="89" rx="6" ry="4.5" fill="#451a03"/>
        <path d="M74 96 Q80 101 86 96" stroke="#451a03" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="54" cy="88" r="6" fill="#E50914" fill-opacity="0.45"/>
        <circle cx="106" cy="88" r="6" fill="#E50914" fill-opacity="0.45"/>
      </svg>
    `),
  },
  {
    id: 'cute-star-bunny',
    name: 'Celestial Bunny',
    category: 'cute',
    categoryLabel: 'Cute Character',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#1e1b4b"/>
        <rect x="52" y="18" width="18" height="54" rx="9" fill="#ffffff"/>
        <rect x="56" y="24" width="10" height="42" rx="5" fill="#fda4af"/>
        <rect x="90" y="18" width="18" height="54" rx="9" fill="#ffffff"/>
        <rect x="94" y="24" width="10" height="42" rx="5" fill="#fda4af"/>
        <circle cx="80" cy="96" r="40" fill="#ffffff"/>
        <circle cx="65" cy="92" r="4.8" fill="#1e1b4b"/>
        <circle cx="95" cy="92" r="4.8" fill="#1e1b4b"/>
        <circle cx="63.5" cy="90.5" r="1.8" fill="#ffffff"/>
        <circle cx="93.5" cy="90.5" r="1.8" fill="#ffffff"/>
        <circle cx="55" cy="100" r="6" fill="#fb7185" fill-opacity="0.55"/>
        <circle cx="105" cy="100" r="6" fill="#fb7185" fill-opacity="0.55"/>
        <polygon points="80,96 75,102 85,102" fill="#f43f5e"/>
        <path d="M74 105 Q80 110 86 105" stroke="#1e1b4b" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'cute-velvet-kitty',
    name: 'Midnight Kitty',
    category: 'cute',
    categoryLabel: 'Cute Character',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#E50914"/>
        <polygon points="38,84 44,34 80,60" fill="#141414"/>
        <polygon points="44,74 48,44 72,62" fill="#fda4af"/>
        <polygon points="122,84 116,34 80,60" fill="#141414"/>
        <polygon points="116,74 112,44 88,62" fill="#fda4af"/>
        <circle cx="80" cy="92" r="42" fill="#141414"/>
        <ellipse cx="64" cy="88" rx="6.5" ry="7" fill="#fde047"/>
        <ellipse cx="96" cy="88" rx="6.5" ry="7" fill="#fde047"/>
        <ellipse cx="64" cy="88" rx="2.5" ry="5" fill="#141414"/>
        <ellipse cx="96" cy="88" rx="2.5" ry="5" fill="#141414"/>
        <polygon points="80,96 75,102 85,102" fill="#fda4af"/>
        <path d="M72 106 Q80 111 88 106" stroke="#ffffff" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'cute-love-penguin',
    name: 'Penguin Heart',
    category: 'cute',
    categoryLabel: 'Cute Character',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#0f172a"/>
        <ellipse cx="80" cy="92" rx="44" ry="48" fill="#1e293b"/>
        <ellipse cx="80" cy="98" rx="32" ry="36" fill="#ffffff"/>
        <circle cx="65" cy="78" r="5" fill="#0f172a"/>
        <circle cx="95" cy="78" r="5" fill="#0f172a"/>
        <circle cx="63.5" cy="76.5" r="1.8" fill="#ffffff"/>
        <circle cx="93.5" cy="76.5" r="1.8" fill="#ffffff"/>
        <polygon points="80,92 71,83 89,83" fill="#f59e0b"/>
        <circle cx="54" cy="86" r="5.5" fill="#E50914" fill-opacity="0.55"/>
        <circle cx="106" cy="86" r="5.5" fill="#E50914" fill-opacity="0.55"/>
        <path d="M48 122 C65 132 95 132 112 122" stroke="#E50914" stroke-width="9" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },

  // =========================================================================
  // 4. CINEMATIC CHARACTERS
  // =========================================================================
  {
    id: 'cinema-noir-detective',
    name: 'Noir Detective',
    category: 'cinematic',
    categoryLabel: 'Cinematic',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#141414"/>
        <circle cx="80" cy="80" r="60" fill="#E50914" fill-opacity="0.18"/>
        <path d="M28 160 L50 112 L110 112 L132 160 Z" fill="#262626"/>
        <polygon points="64,112 80,142 96,112" fill="#E50914"/>
        <circle cx="80" cy="84" r="24" fill="#d4d4d8"/>
        <ellipse cx="80" cy="62" rx="46" ry="9" fill="#0a0a0a"/>
        <path d="M50 62 L58 34 L80 38 L102 34 L110 62 Z" fill="#0a0a0a"/>
        <rect x="52" y="55" width="56" height="5" fill="#E50914"/>
        <rect x="60" y="74" width="16" height="9" rx="2" fill="#0a0a0a"/>
        <rect x="84" y="74" width="16" height="9" rx="2" fill="#0a0a0a"/>
      </svg>
    `),
  },
  {
    id: 'cinema-cosmic-voyager',
    name: 'Cosmic Voyager',
    category: 'cinematic',
    categoryLabel: 'Cinematic',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#090d16"/>
        <circle cx="30" cy="34" r="1.8" fill="#ffffff"/>
        <circle cx="134" cy="48" r="2" fill="#ffffff"/>
        <path d="M30 160 C34 120 126 120 130 160 Z" fill="#f8fafc"/>
        <rect x="64" y="132" width="32" height="16" rx="4" fill="#E50914"/>
        <circle cx="80" cy="82" r="38" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
        <rect x="50" y="64" width="60" height="36" rx="18" fill="#0f172a" stroke="#E50914" stroke-width="3"/>
        <path d="M58 74 Q80 66 102 74" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" stroke-opacity="0.65"/>
      </svg>
    `),
  },
  {
    id: 'cinema-auteur-director',
    name: 'Auteur Director',
    category: 'cinematic',
    categoryLabel: 'Cinematic',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#181818"/>
        <rect x="28" y="42" width="104" height="86" rx="8" fill="#0a0a0a" stroke="#ffffff" stroke-width="3"/>
        <path d="M28 42 L132 42 L132 62 L28 62 Z" fill="#E50914"/>
        <line x1="45" y1="42" x2="35" y2="62" stroke="#ffffff" stroke-width="4"/>
        <line x1="75" y1="42" x2="65" y2="62" stroke="#ffffff" stroke-width="4"/>
        <line x1="105" y1="42" x2="95" y2="62" stroke="#ffffff" stroke-width="4"/>
        <polygon points="70,78 70,108 98,93" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'cinema-matinee-star',
    name: 'Premiere Spotlight',
    category: 'cinematic',
    categoryLabel: 'Cinematic',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="cm4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E50914"/>
            <stop offset="100%" stop-color="#141414"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#cm4)"/>
        <polygon points="80,26 95,60 132,64 104,89 112,126 80,107 48,126 56,89 28,64 65,60" fill="#fde047" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="70" cy="76" r="3.5" fill="#141414"/>
        <circle cx="90" cy="76" r="3.5" fill="#141414"/>
        <path d="M73 88 Q80 94 87 88" stroke="#141414" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },

  // =========================================================================
  // 5. ABSTRACT & COSMIC ICONS
  // =========================================================================
  {
    id: 'abstract-nebula-heart',
    name: 'Nebula Heart',
    category: 'abstract',
    categoryLabel: 'Abstract Icon',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <radialGradient id="ab1" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#E50914"/>
            <stop offset="65%" stop-color="#4c0519"/>
            <stop offset="100%" stop-color="#09090b"/>
          </radialGradient>
        </defs>
        <rect width="160" height="160" fill="url(#ab1)"/>
        <circle cx="80" cy="80" r="56" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5" fill="none"/>
        <path d="M80 116 C80 116 42 92 42 65 C42 50 54 40 67 40 C75 40 80 46 80 46 C80 46 85 40 93 40 C106 40 118 50 118 65 C118 92 80 116 80 116 Z" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'abstract-twin-eclipse',
    name: 'Twin Eclipse',
    category: 'abstract',
    categoryLabel: 'Abstract Icon',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#0a0a0a"/>
        <circle cx="68" cy="80" r="38" fill="#E50914"/>
        <circle cx="94" cy="80" r="34" fill="#141414" stroke="#ffffff" stroke-width="3"/>
        <circle cx="42" cy="40" r="2" fill="#ffffff"/>
        <circle cx="124" cy="118" r="2.5" fill="#E50914"/>
      </svg>
    `),
  },
  {
    id: 'abstract-crimson-infinity',
    name: 'Forever Infinity',
    category: 'abstract',
    categoryLabel: 'Abstract Icon',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="ab3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#181818"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
        </defs>
        <rect width="160" height="160" fill="url(#ab3)"/>
        <path d="M54 62 C36 62 28 98 54 98 C72 98 88 62 106 62 C132 62 124 98 106 98 C88 98 72 62 54 62 Z" stroke="#E50914" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path d="M54 62 C36 62 28 98 54 98 C72 98 88 62 106 62 C132 62 124 98 106 98 C88 98 72 62 54 62 Z" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-opacity="0.6"/>
      </svg>
    `),
  },
  {
    id: 'abstract-golden-constellation',
    name: 'Starlight Constellation',
    category: 'abstract',
    categoryLabel: 'Abstract Icon',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" fill="#111827"/>
        <polyline points="38,108 64,56 96,92 124,44" stroke="#E50914" stroke-width="3" fill="none"/>
        <circle cx="38" cy="108" r="6" fill="#ffffff"/>
        <circle cx="64" cy="56" r="7" fill="#fde047"/>
        <circle cx="96" cy="92" r="6" fill="#ffffff"/>
        <circle cx="124" cy="44" r="8" fill="#E50914" stroke="#ffffff" stroke-width="2.5"/>
      </svg>
    `),
  },
];
