import React from 'react';

interface VisualArtProps {
  id: string;
  category: string;
  fallbackGradient?: string;
  title: string;
  className?: string;
  imageUrl?: string;
}

export const VisualArt: React.FC<VisualArtProps> = ({
  id,
  imageUrl,
  title,
  fallbackGradient = 'from-rose-950 via-red-950 to-neutral-950',
  className = 'w-full h-full',
}) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        referrerPolicy="no-referrer"
        className={`object-cover ${className}`}
      />
    );
  }

  // Domain-crafted cinematic artistic SVG scenes based on theme
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${className}`}
    >
      {/* Cinematic ambient grain and lighting layers */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_40%_rgba(255,255,255,0.08),transparent_70%]" />
      
      {/* Thematic Scene Silhouettes */}
      {id.includes('story') || id.includes('featured') ? (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c0519" />
              <stop offset="45%" stopColor="#881337" />
              <stop offset="80%" stopColor="#e11d48" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="sunGlow1" cx="0.5" cy="0.65" r="0.4">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#e11d48" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="600" height="350" fill="url(#skyGrad1)" opacity="0.6" />
          <circle cx="300" cy="220" r="140" fill="url(#sunGlow1)" />
          {/* Distant mountains / skyline */}
          <path d="M0 260 Q150 200 300 240 T600 220 L600 350 L0 350 Z" fill="#1c1917" opacity="0.8" />
          <path d="M0 290 Q200 250 420 270 T600 260 L600 350 L0 350 Z" fill="#0f0e0e" />
          {/* Couple silhouette sitting on cliff / rooftop holding hands */}
          <g transform="translate(260, 215) scale(0.65)" fill="#ffffff" opacity="0.95">
            {/* Person 1 */}
            <circle cx="38" cy="22" r="9" />
            <path d="M28 34 C28 30, 48 30, 48 34 L45 68 L30 68 Z" />
            {/* Person 2 leaning head */}
            <circle cx="58" cy="25" r="8.5" />
            <path d="M50 36 C50 32, 68 32, 68 36 L66 68 L52 68 Z" />
            {/* Intertwined hands */}
            <path d="M43 45 Q49 52 55 45" stroke="#ffffff" strokeWidth="3" fill="none" />
            {/* Subtle floating heart spark */}
            <path d="M49 10 C49 7, 45 4, 43 7 C41 4, 37 7, 37 10 C37 15, 43 19, 43 19 C43 19, 49 15, 49 10 Z" fill="#E50914" />
          </g>
          {/* Subtle stars */}
          <circle cx="80" cy="60" r="1.5" fill="#fff" opacity="0.6" />
          <circle cx="160" cy="40" r="1" fill="#fff" opacity="0.5" />
          <circle cx="480" cy="50" r="1.5" fill="#fff" opacity="0.7" />
          <circle cx="520" cy="90" r="1" fill="#fff" opacity="0.4" />
        </svg>
      ) : id.includes('ramen') || id.includes('coffee') ? (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="cafeGlow" cx="0.5" cy="0.4" r="0.5">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#b45309" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="160" r="180" fill="url(#cafeGlow)" />
          {/* Steaming cups and rain window glass */}
          <g transform="translate(240, 150) scale(0.9)" stroke="#fff" fill="none" strokeWidth="2" opacity="0.8">
            <path d="M20 50 L25 80 Q30 90 50 90 Q70 90 75 80 L80 50 Z" fill="rgba(255,255,255,0.1)" />
            <path d="M78 60 Q92 60 92 72 Q92 82 76 80" />
            {/* Steam curves */}
            <path d="M40 40 Q35 30 45 20 Q50 12 45 4" opacity="0.5" />
            <path d="M60 40 Q65 30 55 20 Q50 12 55 4" opacity="0.5" />
            {/* Second cup */}
            <path d="M85 58 L90 84 Q94 92 110 92 Q126 92 130 84 L135 58 Z" fill="rgba(255,255,255,0.08)" />
            <path d="M133 66 Q145 66 145 76 Q145 84 131 83" />
          </g>
          {/* Rain streaks */}
          <line x1="80" y1="20" x2="60" y2="80" stroke="#93c5fd" strokeWidth="1" opacity="0.25" />
          <line x1="180" y1="40" x2="160" y2="110" stroke="#93c5fd" strokeWidth="1" opacity="0.3" />
          <line x1="420" y1="30" x2="400" y2="90" stroke="#93c5fd" strokeWidth="1" opacity="0.2" />
        </svg>
      ) : id.includes('vault') ? (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g transform="translate(240, 110) scale(1.1)" opacity="0.9">
            {/* Wax sealed vintage love letter */}
            <rect x="0" y="0" width="120" height="85" rx="6" fill="#fef3c7" opacity="0.2" stroke="#fef3c7" strokeWidth="1.5" />
            <path d="M0 0 L60 48 L120 0" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity="0.8" />
            {/* Scarlet Wax seal with heart */}
            <circle cx="60" cy="48" r="16" fill="#E50914" />
            <path d="M60 43 C60 40, 56 37, 53 40 C50 37, 46 40, 46 43 C46 48, 53 53, 53 53 C53 53, 60 48, 60 43 Z" fill="#ffffff" transform="translate(7, 3) scale(0.85)" />
          </g>
        </svg>
      ) : (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-cover opacity-75 mix-blend-screen pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Ambient romantic constellations */}
          <circle cx="150" cy="90" r="2" fill="#fff" opacity="0.8" />
          <circle cx="280" cy="70" r="1.5" fill="#fff" opacity="0.6" />
          <circle cx="450" cy="110" r="2" fill="#fff" opacity="0.7" />
          <circle cx="340" cy="180" r="2.5" fill="#f43f5e" opacity="0.9" />
          <line x1="150" y1="90" x2="280" y2="70" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
          <line x1="280" y1="70" x2="340" y2="180" stroke="#f43f5e" strokeWidth="0.5" opacity="0.3" />
          <line x1="340" y1="180" x2="450" y2="110" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
          {/* Subtle heart in center */}
          <path d="M300 135 C300 120, 275 105, 255 125 C235 105, 210 120, 210 135 C210 160, 255 185, 255 185 C255 185, 300 160, 300 135 Z" fill="#E50914" opacity="0.25" transform="translate(45, 10)" />
        </svg>
      )}

      {/* Netflix subtle dark bottom scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />
    </div>
  );
};
