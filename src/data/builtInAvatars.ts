export type BuiltInAvatarCategory =
  | 'illustrated'
  | 'anime'
  | 'cinematic'
  | 'cosmic'
  | 'artistic';

export interface BuiltInAvatarItem {
  id: string;
  name: string;
  category: BuiltInAvatarCategory;
  categoryLabel: string;
  description: string;
  url: string;
}

const svgToDataUri = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const BUILT_IN_AVATAR_CATEGORIES: { id: 'all' | BuiltInAvatarCategory; label: string }[] = [
  { id: 'all', label: 'All Curated' },
  { id: 'illustrated', label: 'Cinematic Illustrated' },
  { id: 'anime', label: 'Anime Portraits' },
  { id: 'cinematic', label: 'Film & Noir' },
  { id: 'cosmic', label: 'Cosmic & Celestial' },
  { id: 'artistic', label: 'Artistic Silhouettes' },
];

export const BUILT_IN_AVATARS: BuiltInAvatarItem[] = [
  // =========================================================================
  // 1. SIGNATURE CINEMATIC ILLUSTRATED PORTRAITS
  // =========================================================================
  {
    id: 'illus-cosmic-duo',
    name: 'Cosmic Lovers (The Duo)',
    category: 'illustrated',
    categoryLabel: 'Cinematic Illustrated',
    description: 'Two silhouettes under a glowing crimson nebula with shooting stars.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="nebula1" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.85"/>
            <stop offset="45%" stop-color="#450a12" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="#08080a"/>
          </radialGradient>
          <linearGradient id="rimLight1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#E50914" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#nebula1)"/>
        <!-- Star particles -->
        <circle cx="28" cy="35" r="1.5" fill="#ffffff" opacity="0.9"/>
        <circle cx="165" cy="42" r="1.2" fill="#ffffff" opacity="0.8"/>
        <circle cx="95" cy="24" r="1.8" fill="#ffd54f" opacity="0.95"/>
        <circle cx="45" cy="85" r="1.1" fill="#ffffff" opacity="0.6"/>
        <circle cx="178" cy="98" r="1.3" fill="#ffffff" opacity="0.7"/>
        <circle cx="135" cy="72" r="1.6" fill="#ffffff" opacity="0.85"/>
        <!-- Shooting Star -->
        <line x1="140" y1="18" x2="185" y2="35" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
        <line x1="120" y1="10" x2="185" y2="35" stroke="#E50914" stroke-width="0.8" opacity="0.6"/>
        <!-- Giant glowing celestial moon crescent -->
        <circle cx="100" cy="88" r="68" fill="#ffffff" opacity="0.04"/>
        <circle cx="100" cy="88" r="54" fill="#ffffff" opacity="0.06"/>
        <!-- Couple silhouette -->
        <!-- Hill base -->
        <path d="M0 200 Q100 152 200 200 Z" fill="#09090b"/>
        <path d="M0 200 Q100 155 200 200 Z" stroke="#E50914" stroke-width="1.5" fill="none" opacity="0.6"/>
        <!-- Partner Left (Her) -->
        <path d="M58 200 C58 152 74 135 84 125 C82 120 78 108 78 98 C78 84 89 74 98 74 C99 74 100 74 100 74 C96 82 96 92 98 98 C100 106 96 118 92 126 C102 136 114 154 116 200 Z" fill="#0d0d10"/>
        <!-- Partner Right (Him) with arm resting around her -->
        <path d="M96 200 C96 150 110 130 120 120 C118 114 116 104 116 94 C116 80 126 70 136 70 C146 70 154 80 154 94 C154 104 148 114 144 120 C154 130 166 150 166 200 Z" fill="#08080a"/>
        <!-- Warm glowing starlight lantern / heart between them -->
        <circle cx="106" cy="138" r="9" fill="#ffb703" opacity="0.85"/>
        <circle cx="106" cy="138" r="18" fill="#E50914" opacity="0.45"/>
        <path d="M106 133 C106 133 100 128 100 123 C100 120 102 118 104.5 118 C105.8 118 106 119.5 106 119.5 C106 119.5 106.2 118 107.5 118 C110 118 112 120 112 123 C112 128 106 133 106 133 Z" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'illus-starlight-muse',
    name: 'The Starlight Muse (Her)',
    category: 'illustrated',
    categoryLabel: 'Cinematic Illustrated',
    description: 'An elegant portrait of Her with starlit dark hair, gold highlights, and a starlight crown.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="museGlow" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#b91c1c"/>
            <stop offset="50%" stop-color="#450a0a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </radialGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="100%" stop-color="#fbcfe8"/>
          </linearGradient>
          <linearGradient id="hairGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#261014"/>
            <stop offset="60%" stop-color="#14070a"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#museGlow)"/>
        <!-- Star dust -->
        <circle cx="34" cy="42" r="1.3" fill="#ffffff" opacity="0.8"/>
        <circle cx="166" cy="38" r="1.5" fill="#fde047" opacity="0.9"/>
        <circle cx="175" cy="85" r="1.1" fill="#ffffff" opacity="0.6"/>
        <circle cx="28" cy="115" r="1.4" fill="#ffffff" opacity="0.7"/>
        <!-- Glowing Halo Ring behind head -->
        <circle cx="100" cy="88" r="56" stroke="#fde047" stroke-width="1.6" stroke-dasharray="3 3" fill="none" opacity="0.65"/>
        <circle cx="100" cy="88" r="64" stroke="#E50914" stroke-width="1.2" fill="none" opacity="0.4"/>
        <!-- Shoulders / Crimson Gown -->
        <path d="M40 200 C45 158 75 142 100 142 C125 142 155 158 160 200 Z" fill="#E50914"/>
        <path d="M60 200 C68 168 88 156 100 156 C112 156 132 168 140 200 Z" fill="#991b1b"/>
        <!-- Slender neck -->
        <path d="M88 120 L88 145 C94 148 106 148 112 145 L112 120 Z" fill="url(#skin)"/>
        <!-- Elegant jawline / face -->
        <path d="M66 84 C66 122 84 136 100 136 C116 136 134 122 134 84 C134 52 116 48 100 48 C84 48 66 52 66 84 Z" fill="url(#skin)"/>
        <!-- Flowing voluminous hair -->
        <path d="M64 80 C56 50 74 32 100 32 C126 32 144 50 136 80 C146 112 148 152 146 182 C140 184 136 172 134 154 C132 134 130 114 130 96 C118 70 82 70 70 96 C70 114 68 134 66 154 C64 172 60 184 54 182 C52 152 54 112 64 80 Z" fill="url(#hairGold)"/>
        <!-- Bangs & gentle waves -->
        <path d="M72 64 Q100 44 128 64 Q100 58 72 64 Z" fill="#1c090d"/>
        <!-- Gold Constellation Tiara / Crown -->
        <path d="M82 46 L90 38 L100 44 L110 38 L118 46" stroke="#fde047" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="100" cy="36" r="3" fill="#fde047"/>
        <circle cx="90" cy="38" r="1.8" fill="#ffffff"/>
        <circle cx="110" cy="38" r="1.8" fill="#ffffff"/>
        <!-- Eyes (gentle starlight, serene glance) -->
        <ellipse cx="86" cy="90" rx="4.5" ry="3.5" fill="#1f2937"/>
        <ellipse cx="114" cy="90" rx="4.5" ry="3.5" fill="#1f2937"/>
        <circle cx="85" cy="89" r="1.5" fill="#ffffff"/>
        <circle cx="113" cy="89" r="1.5" fill="#ffffff"/>
        <path d="M80 84 Q86 80 92 84" stroke="#374151" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M108 84 Q114 80 120 84" stroke="#374151" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Soft blush -->
        <circle cx="78" cy="98" r="6" fill="#f43f5e" opacity="0.35"/>
        <circle cx="122" cy="98" r="6" fill="#f43f5e" opacity="0.35"/>
        <!-- Lips -->
        <path d="M94 114 Q100 120 106 114 Q100 117 94 114 Z" fill="#E50914"/>
      </svg>
    `),
  },
  {
    id: 'illus-midnight-voyager',
    name: 'The Midnight Voyager (Him)',
    category: 'illustrated',
    categoryLabel: 'Cinematic Illustrated',
    description: 'A handsome, cinematic portrait of Him with midnight charcoal jacket and starlight rim light.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="himGlow" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#050508"/>
          </radialGradient>
          <linearGradient id="himSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="100%" stop-color="#fed7aa"/>
          </linearGradient>
          <linearGradient id="jacketCrimson" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="50%" stop-color="#27272a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#himGlow)"/>
        <!-- Star dust & Crescent Moon -->
        <circle cx="155" cy="40" r="16" fill="#fde047" opacity="0.8"/>
        <circle cx="160" cy="37" r="14" fill="#0f172a"/>
        <circle cx="38" cy="45" r="1.4" fill="#ffffff" opacity="0.9"/>
        <circle cx="52" cy="95" r="1.2" fill="#ffffff" opacity="0.7"/>
        <circle cx="170" cy="110" r="1.5" fill="#fde047" opacity="0.7"/>
        <!-- Shoulders / Dark jacket with sharp Netflix red lapel accent -->
        <path d="M30 200 C36 150 70 136 100 136 C130 136 164 150 170 200 Z" fill="url(#jacketCrimson)"/>
        <!-- Collar Red Piping -->
        <path d="M72 144 L100 176 L128 144" stroke="#E50914" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
        <path d="M85 142 L100 162 L115 142" fill="#ffffff" opacity="0.9"/>
        <!-- Neck -->
        <path d="M86 114 L86 142 C92 146 108 146 114 142 L114 114 Z" fill="url(#himSkin)"/>
        <!-- Defined Chiseled Jawline -->
        <path d="M68 76 C68 116 86 130 100 130 C114 130 132 116 132 76 C132 50 114 46 100 46 C86 46 68 50 68 76 Z" fill="url(#himSkin)"/>
        <!-- Textured dark modern hair with silver/crimson starlight highlights -->
        <path d="M64 74 C62 48 76 30 100 30 C118 30 136 40 136 68 C132 58 122 52 114 56 C106 50 94 48 86 54 C78 52 70 60 64 74 Z" fill="#18181b"/>
        <path d="M82 38 Q100 28 122 38 Q102 34 82 38 Z" fill="#52525b"/>
        <!-- Eyes (sharp, thoughtful, warm) -->
        <ellipse cx="85" cy="84" rx="4.8" ry="3.2" fill="#0f172a"/>
        <ellipse cx="115" cy="84" rx="4.8" ry="3.2" fill="#0f172a"/>
        <circle cx="84" cy="83" r="1.4" fill="#ffffff"/>
        <circle cx="114" cy="83" r="1.4" fill="#ffffff"/>
        <path d="M78 77 L92 78" stroke="#27272a" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M122 77 L108 78" stroke="#27272a" stroke-width="2.4" stroke-linecap="round"/>
        <!-- Confident smile -->
        <path d="M92 108 Q100 114 108 108" stroke="#831843" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },

  // =========================================================================
  // 2. ROMANTIC & COSMIC CELESTIAL
  // =========================================================================
  {
    id: 'cosmic-aurora-borealis',
    name: 'Aurora Serenade',
    category: 'cosmic',
    categoryLabel: 'Cosmic & Celestial',
    description: 'Emerald and crimson northern lights dancing across an obsidian sky.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="auroraSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="40%" stop-color="#450a0a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#auroraSky)"/>
        <!-- Aurora bands -->
        <path d="M0 60 Q60 20 120 70 T200 40 L200 90 Q140 50 80 100 T0 80 Z" fill="#10b981" opacity="0.45"/>
        <path d="M0 80 Q70 40 140 90 T200 60 L200 120 Q130 70 70 120 T0 100 Z" fill="#E50914" opacity="0.4"/>
        <circle cx="35" cy="25" r="1.5" fill="#ffffff"/>
        <circle cx="165" cy="30" r="1.8" fill="#ffffff"/>
        <circle cx="100" cy="18" r="2.2" fill="#fde047"/>
        <!-- Pine silhouette mountains -->
        <polygon points="20,180 35,140 50,180" fill="#09090b"/>
        <polygon points="45,180 60,130 75,180" fill="#050507"/>
        <polygon points="120,180 140,135 160,180" fill="#09090b"/>
        <polygon points="150,180 170,125 190,180" fill="#050507"/>
        <!-- Twin lovers holding hands on ridge -->
        <circle cx="95" cy="148" r="4" fill="#ffffff"/>
        <circle cx="106" cy="149" r="3.8" fill="#fde047"/>
        <path d="M92 180 L95 152 L98 180" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <path d="M103 180 L106 153 L109 180" stroke="#fde047" stroke-width="3" stroke-linecap="round"/>
        <line x1="97" y1="160" x2="104" y2="160" stroke="#E50914" stroke-width="2"/>
        <path d="M0 200 Q100 170 200 200 Z" fill="#09090b"/>
      </svg>
    `),
  },
  {
    id: 'cosmic-nebula-heart',
    name: 'Eternal Nebula Heart',
    category: 'cosmic',
    categoryLabel: 'Cosmic & Celestial',
    description: 'Swirling deep crimson and violet galaxy formed into an infinite heart.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="nebHeart" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#E50914"/>
            <stop offset="45%" stop-color="#701a75"/>
            <stop offset="85%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#050508"/>
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(#nebHeart)"/>
        <!-- Orbital Rings -->
        <ellipse cx="100" cy="100" rx="84" ry="32" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.3" fill="none" transform="rotate(-25 100 100)"/>
        <ellipse cx="100" cy="100" rx="72" ry="24" stroke="#fde047" stroke-width="1.4" stroke-opacity="0.4" fill="none" transform="rotate(35 100 100)"/>
        <!-- Star dust -->
        <circle cx="45" cy="40" r="1.5" fill="#ffffff"/>
        <circle cx="160" cy="50" r="1.8" fill="#ffffff"/>
        <circle cx="150" cy="155" r="1.2" fill="#ffffff"/>
        <circle cx="35" cy="160" r="1.4" fill="#ffffff"/>
        <!-- Glowing Sacred Heart Silhouette -->
        <path d="M100 148 C100 148 52 115 52 78 C52 56 68 42 86 42 C96 42 100 48 100 48 C100 48 104 42 114 42 C132 42 148 56 148 78 C148 115 100 148 100 148 Z" fill="#ffffff" opacity="0.95"/>
        <path d="M100 140 C100 140 60 110 60 80 C60 62 72 50 88 50 C96 50 100 56 100 56 C100 56 104 50 112 50 C128 50 140 62 140 80 C140 110 100 140 100 140 Z" fill="#E50914"/>
        <circle cx="100" cy="85" r="14" fill="#ffffff" opacity="0.75"/>
      </svg>
    `),
  },
  {
    id: 'cosmic-golden-constellation',
    name: 'Constellation Soulmates',
    category: 'cosmic',
    categoryLabel: 'Cosmic & Celestial',
    description: 'Golden starlight geometry connecting two destiny stars.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#09090d"/>
        <!-- Deep crimson ambient back-glow -->
        <circle cx="100" cy="100" r="70" fill="#E50914" opacity="0.25"/>
        <polyline points="40,140 70,70 110,120 150,55 170,105" stroke="#E50914" stroke-width="2.5" fill="none" opacity="0.85"/>
        <polyline points="40,140 90,150 140,145 170,105" stroke="#fde047" stroke-width="1.8" stroke-dasharray="4 4" fill="none" opacity="0.7"/>
        <circle cx="40" cy="140" r="6" fill="#ffffff"/>
        <circle cx="70" cy="70" r="8" fill="#fde047"/>
        <circle cx="110" cy="120" r="7" fill="#ffffff"/>
        <circle cx="150" cy="55" r="9" fill="#E50914"/>
        <circle cx="170" cy="105" r="6" fill="#fde047"/>
        <circle cx="90" cy="150" r="4.5" fill="#ffffff"/>
        <circle cx="140" cy="145" r="5" fill="#ffffff"/>
        <!-- Destiny rings -->
        <circle cx="150" cy="55" r="16" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.6"/>
        <circle cx="70" cy="70" r="14" stroke="#fde047" stroke-width="1.2" fill="none" opacity="0.6"/>
      </svg>
    `),
  },

  // =========================================================================
  // 3. ANIME-INSPIRED CINEMATIC PORTRAITS
  // =========================================================================
  {
    id: 'anime-sakura-dreamer',
    name: 'Sakura Starlight',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    description: 'A serene anime heroine surrounded by glowing crimson blossom petals.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="sakuraBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4c0519"/>
            <stop offset="60%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#sakuraBg)"/>
        <!-- Falling petals -->
        <circle cx="40" cy="45" r="3.5" fill="#fda4af" opacity="0.8"/>
        <circle cx="160" cy="65" r="4" fill="#fda4af" opacity="0.9"/>
        <circle cx="145" cy="145" r="3" fill="#f43f5e" opacity="0.7"/>
        <circle cx="55" cy="130" r="2.8" fill="#fda4af" opacity="0.75"/>
        <!-- Shoulders / Kimono -->
        <path d="M40 200 C45 155 75 145 100 145 C125 145 155 155 160 200 Z" fill="#ffffff"/>
        <path d="M75 145 L100 180 L125 145 Z" fill="#E50914"/>
        <!-- Head & flowing twintails -->
        <path d="M46 95 C38 60 52 40 80 40 L120 40 C148 40 162 60 154 95 C164 135 166 185 162 200 C154 185 150 150 144 120 C138 90 62 90 56 120 C50 150 46 185 38 200 C34 185 36 135 46 95 Z" fill="#fda4af"/>
        <!-- Face -->
        <path d="M68 80 L100 125 L132 80 C132 55 68 55 68 80 Z" fill="#fff1f2"/>
        <!-- Anime Bangs -->
        <path d="M64 74 L78 92 L86 70 L100 90 L114 70 L122 92 L136 74 C128 48 72 48 64 74 Z" fill="#fb7185"/>
        <!-- Anime Sparkling Eyes -->
        <ellipse cx="84" cy="94" rx="7" ry="8.5" fill="#9f1239"/>
        <ellipse cx="116" cy="94" rx="7" ry="8.5" fill="#9f1239"/>
        <circle cx="82" cy="90.5" r="2.8" fill="#ffffff"/>
        <circle cx="114" cy="90.5" r="2.8" fill="#ffffff"/>
        <circle cx="86" cy="97" r="1.4" fill="#fda4af"/>
        <circle cx="118" cy="97" r="1.4" fill="#fda4af"/>
        <circle cx="75" cy="106" r="4.5" fill="#f43f5e" opacity="0.4"/>
        <circle cx="125" cy="106" r="4.5" fill="#f43f5e" opacity="0.4"/>
        <path d="M96 112 Q100 116 104 112" stroke="#e11d48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'anime-crimson-ronin',
    name: 'Midnight Ronin',
    category: 'anime',
    categoryLabel: 'Anime Portrait',
    description: 'A focused midnight warrior with a crimson crest and starlit katana.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#09090b"/>
        <!-- Giant red moon backdrop -->
        <circle cx="100" cy="85" r="62" fill="#E50914" opacity="0.25"/>
        <!-- Armor shoulders -->
        <path d="M35 200 C40 150 72 138 100 138 C128 138 160 150 165 200 Z" fill="#18181b"/>
        <rect x="70" y="145" width="60" height="12" rx="3" fill="#E50914"/>
        <!-- Neck & Chin -->
        <path d="M88 115 L88 142 C94 146 106 146 112 142 L112 115 Z" fill="#fed7aa"/>
        <path d="M70 78 L100 126 L130 78 C130 52 70 52 70 78 Z" fill="#ffedd5"/>
        <!-- Spiky Ronin Hair -->
        <path d="M56 70 L72 40 L90 52 L108 34 L126 50 L144 42 L142 76 L130 68 L100 58 L70 68 Z" fill="#27272a"/>
        <!-- Crimson Headband -->
        <rect x="68" y="72" width="64" height="12" rx="3" fill="#E50914"/>
        <circle cx="100" cy="78" r="3.5" fill="#fde047"/>
        <!-- Eyes (intense, focused) -->
        <ellipse cx="85" cy="94" rx="6" ry="4" fill="#09090b"/>
        <ellipse cx="115" cy="94" rx="6" ry="4" fill="#09090b"/>
        <circle cx="84" cy="93" r="1.5" fill="#ffffff"/>
        <circle cx="114" cy="93" r="1.5" fill="#ffffff"/>
        <path d="M78 87 L92 89" stroke="#E50914" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M122 87 L108 89" stroke="#E50914" stroke-width="2.6" stroke-linecap="round"/>
      </svg>
    `),
  },

  // =========================================================================
  // 4. FILM & CINEMATIC NOIR
  // =========================================================================
  {
    id: 'cinema-auteur',
    name: 'The Auteur',
    category: 'cinematic',
    categoryLabel: 'Film & Noir',
    description: '35mm cinema clapper with warm projection glow and signature crimson accents.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="cinemaLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E50914" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#cinemaLight)"/>
        <!-- Film Reel Background Circle -->
        <circle cx="100" cy="100" r="74" stroke="#27272a" stroke-width="6" fill="#0c0c0e"/>
        <circle cx="100" cy="100" r="28" stroke="#E50914" stroke-width="4" fill="#18181b"/>
        <circle cx="100" cy="100" r="8" fill="#ffffff"/>
        <!-- Reel cutouts -->
        <circle cx="100" cy="56" r="14" fill="#09090b"/>
        <circle cx="100" cy="144" r="14" fill="#09090b"/>
        <circle cx="56" cy="100" r="14" fill="#09090b"/>
        <circle cx="144" cy="100" r="14" fill="#09090b"/>
        <!-- Clapperboard overlay in front -->
        <rect x="42" y="112" width="116" height="58" rx="6" fill="#18181b" stroke="#ffffff" stroke-width="2"/>
        <polygon points="42,112 158,112 158,92 42,92" fill="#E50914"/>
        <line x1="60" y1="92" x2="50" y2="112" stroke="#ffffff" stroke-width="4"/>
        <line x1="90" y1="92" x2="80" y2="112" stroke="#ffffff" stroke-width="4"/>
        <line x1="120" y1="92" x2="110" y2="112" stroke="#ffffff" stroke-width="4"/>
        <line x1="150" y1="92" x2="140" y2="112" stroke="#ffffff" stroke-width="4"/>
        <!-- Play heart in center -->
        <polygon points="94,130 94,152 114,141" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'cinema-golden-premiere',
    name: 'Premiere Night',
    category: 'cinematic',
    categoryLabel: 'Film & Noir',
    description: 'Golden theatre spotlight illuminating a gleaming premiere star.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="spotlight1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E50914"/>
            <stop offset="60%" stop-color="#7f1d1d"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#spotlight1)"/>
        <!-- Spotlight cones -->
        <polygon points="0,0 200,200 120,200 0,60" fill="#ffffff" opacity="0.08"/>
        <polygon points="200,0 0,200 60,200 200,40" fill="#fde047" opacity="0.08"/>
        <!-- Glowing Premiere Star -->
        <polygon points="100,35 118,78 164,82 128,114 139,158 100,134 61,158 72,114 36,82 82,78" fill="#fde047" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="100" cy="100" r="16" fill="#E50914"/>
        <circle cx="100" cy="100" r="8" fill="#ffffff"/>
      </svg>
    `),
  },

  // =========================================================================
  // 5. ARTISTIC SILHOUETTES & MINIMAL LUXURY
  // =========================================================================
  {
    id: 'art-golden-hour',
    name: 'Golden Hour Silhouette',
    category: 'artistic',
    categoryLabel: 'Artistic Silhouettes',
    description: 'A warm sunset horizon reflecting pure romance and memory warmth.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="40%" stop-color="#E50914"/>
            <stop offset="80%" stop-color="#450a0a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#sunsetSky)"/>
        <!-- Giant Setting Sun -->
        <circle cx="100" cy="115" r="48" fill="#fef08a" opacity="0.95"/>
        <circle cx="100" cy="115" r="64" fill="#fde047" opacity="0.25"/>
        <!-- Horizon wave -->
        <path d="M0 135 Q50 125 100 135 T200 135 L200 200 L0 200 Z" fill="#09090b"/>
        <!-- Two silhouettes leaning in against setting sun -->
        <circle cx="88" cy="108" r="8" fill="#09090b"/>
        <circle cx="112" cy="110" r="7.5" fill="#09090b"/>
        <path d="M78 145 C78 125 86 118 96 118 C98 126 102 126 104 118 C114 118 122 125 122 145 Z" fill="#09090b"/>
      </svg>
    `),
  },
  {
    id: 'art-crimson-infinity',
    name: 'Forever Infinity',
    category: 'artistic',
    categoryLabel: 'Artistic Silhouettes',
    description: 'The iconic infinity symbol glowing with signature Netflix red neon.',
    url: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#09090b"/>
        <circle cx="100" cy="100" r="70" fill="#E50914" opacity="0.18"/>
        <!-- Infinity Neon Tube -->
        <path d="M70 75 C45 75 35 125 70 125 C92 125 110 75 130 75 C165 75 155 125 130 125 C110 125 92 75 70 75 Z" stroke="#E50914" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M70 75 C45 75 35 125 70 125 C92 125 110 75 130 75 C165 75 155 125 130 125 C110 125 92 75 70 75 Z" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>
      </svg>
    `),
  },
];

/**
 * Returns a deterministic, high-quality illustrated avatar for any profile.
 * - If profile has a custom user-selected or uploaded avatarUrl, returns it.
 * - Otherwise maps the profile id or role to our signature illustrated artworks:
 *   - 'profile-together' / 'together' -> Cosmic Lovers (Duo)
 *   - 'profile-her' / 'partner1'      -> The Starlight Muse (Her)
 *   - 'profile-him' / 'partner2'      -> The Midnight Voyager (Him)
 *   - Other profiles                  -> Deterministic illustrated avatar based on ID
 */
export function getProfileAvatarUrl(profile: {
  id?: string;
  role?: string;
  avatarUrl?: string;
  avatarId?: string;
}): string {
  if (profile.avatarUrl && profile.avatarUrl.trim() !== '') {
    return profile.avatarUrl;
  }

  if (profile.avatarId) {
    const found = BUILT_IN_AVATARS.find((a) => a.id === profile.avatarId);
    if (found) return found.url;
  }

  const role = (profile.role || '').toLowerCase();
  const id = (profile.id || '').toLowerCase();

  if (role === 'together' || id.includes('together') || id.includes('universe')) {
    return BUILT_IN_AVATARS[0].url; // Cosmic Lovers Duo
  }
  if (role === 'partner1' || id.includes('her') || id.includes('girl')) {
    return BUILT_IN_AVATARS[1].url; // The Starlight Muse
  }
  if (role === 'partner2' || id.includes('him') || id.includes('guy')) {
    return BUILT_IN_AVATARS[2].url; // The Midnight Voyager
  }

  // Hash the id to choose a stable, non-random avatar
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % BUILT_IN_AVATARS.length;
  return BUILT_IN_AVATARS[index].url;
}
