/**
 * =====================================================================
 * OUR UNIVERSE — MUSIC TRACKS CONFIGURATION
 * =====================================================================
 *
 * Uses Vite's `import.meta.env.BASE_URL` so assets resolve seamlessly
 * in local development ('/') as well as subpath deployments (e.g. GitHub Pages '/repo-name/').
 *
 * All 7 soundtrack songs provided are mapped to their actual audio files in `public/music/`:
 * 1. girl in red — We Fell in Love in October (we_fell_in_love_in_october.mp3)
 * 2. Justin Bieber — Baby (baby.mp3)
 * 3. JVKE — her (her.mp3)
 * 4. PUBLIC — Make You Mine (make_you_mine.mp3)
 * 5. Gracie Abrams — That's So True (thats_so_true.mp3)
 * 6. Ed Sheeran — Perfect (perfect.mp3)
 * 7. Glass Animals — Heat Waves (heat_waves.mp3)
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string; // Path with Vite BASE_URL or remote HTTPS audio URL
  coverUrl?: string;
  duration?: string;
  vibe?: string;
}

/**
 * Resolves a public asset path against Vite's BASE_URL, safely avoiding double slashes.
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (/^(?:https?:|\/\/|blob:|data:)/i.test(path)) {
    return path;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  if (path.startsWith(cleanBase)) {
    return path;
  }
  if (cleanBase !== '/' && path.startsWith(baseUrl)) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export const TRACKS: Track[] = [
  {
    id: 'track-october',
    title: 'We Fell in Love in October',
    artist: 'girl in red',
    src: getAssetUrl('music/we_fell_in_love_in_october.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    duration: '3:04',
    vibe: 'Autumn Melancholy & First Sparks',
  },
  {
    id: 'track-baby',
    title: 'Baby',
    artist: 'Justin Bieber',
    src: getAssetUrl('music/baby.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    duration: '3:34',
    vibe: 'Sweet Nostalgia & Youthful Love',
  },
  {
    id: 'track-her',
    title: 'her',
    artist: 'JVKE',
    src: getAssetUrl('music/her.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
    duration: '2:57',
    vibe: 'Dreamy Celestial Piano',
  },
  {
    id: 'track-make-you-mine',
    title: 'Make You Mine',
    artist: 'PUBLIC',
    src: getAssetUrl('music/make_you_mine.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    duration: '3:50',
    vibe: 'Joyful Heartbeats & Dancing',
  },
  {
    id: 'track-thats-so-true',
    title: "That's So True",
    artist: 'Gracie Abrams',
    src: getAssetUrl('music/thats_so_true.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    duration: '2:45',
    vibe: 'Raw Confessions & Tender Late Nights',
  },
  {
    id: 'track-perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    src: getAssetUrl('music/perfect.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
    duration: '4:23',
    vibe: 'Barefoot Dancing in the Dark',
  },
  {
    id: 'track-heat-waves',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    src: getAssetUrl('music/heat_waves.mp3'),
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    duration: '3:58',
    vibe: 'Late Nights in the Middle of June',
  },
];
