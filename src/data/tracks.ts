/**
 * =====================================================================
 * OUR UNIVERSE — MUSIC TRACKS CONFIGURATION
 * =====================================================================
 *
 * HOW TO ADD YOUR OWN AUDIO FILES:
 * 1. Place your audio files (.mp3, .wav, .m4a, .ogg) in the `public/music/` folder:
 *    - `public/music/we_fell_in_love_in_october.mp3`
 *    - `public/music/baby.mp3`
 *    - `public/music/until_i_found_her.mp3`
 *    - `public/music/until_i_make_you_mine.mp3`
 *    - `public/music/you_are_an_idiot.mp3`
 *    - `public/music/perfect.mp3`
 *    - `public/music/heat_waves.mp3`
 *
 * 2. You can also upload any song file live via the "Play Local Audio File" button
 *    inside the floating Music Player drawer!
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string; // Path in /public/music/ or remote HTTPS audio URL
  coverUrl?: string;
  duration?: string; // human readable estimate
}

export const TRACKS: Track[] = [
  {
    id: 'track-october',
    title: 'We Fell in Love in October',
    artist: 'girl in red',
    src: '/music/we_fell_in_love_in_october.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
    duration: '3:04',
  },
  {
    id: 'track-baby',
    title: 'Baby',
    artist: 'Justin Bieber',
    src: '/music/baby.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80',
    duration: '3:34',
  },
  {
    id: 'track-found-her',
    title: 'Until I Found You / Her',
    artist: 'Stephen Sanchez',
    src: '/music/until_i_found_her.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80',
    duration: '2:57',
  },
  {
    id: 'track-make-you-mine',
    title: 'Until I Make You Mine',
    artist: 'Romantic Acoustics',
    src: '/music/until_i_make_you_mine.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    duration: '3:50',
  },
  {
    id: 'track-idiot',
    title: "You're an Idiot (Warn Her)",
    artist: 'Indie Pop',
    src: '/music/you_are_an_idiot.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80',
    duration: '2:45',
  },
  {
    id: 'track-perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    src: '/music/perfect.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=300&q=80',
    duration: '4:23',
  },
  {
    id: 'track-heat-waves',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    src: '/music/heat_waves.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    duration: '3:58',
  },
  {
    id: 'track-ambient-piano',
    title: 'A Thousand Years (Acoustic Ambient)',
    artist: 'Our Universe Soundscapes',
    src: '/music/track1_romantic_piano.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    duration: '0:28',
  },
  {
    id: 'track-starlight',
    title: 'Midnight Starlight Serenade',
    artist: 'Eternal Echoes',
    src: '/music/track2_starlight_serenade.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80',
    duration: '0:28',
  },
  {
    id: 'track-sunset',
    title: 'Warm Sunset Glow',
    artist: 'Love & Memories',
    src: '/music/track3_warm_sunset.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=300&q=80',
    duration: '0:28',
  },
];
