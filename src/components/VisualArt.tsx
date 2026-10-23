import React, { useState } from 'react';
import { isVideoUrl } from '../utils/mediaHelpers';

interface VisualArtProps {
  id: string;
  category: string;
  fallbackGradient?: string;
  title: string;
  className?: string;
  imageUrl?: string;
  fit?: 'cover' | 'contain' | 'scale-down' | 'auto';
  aspectRatio?: '16/9' | '3/4' | '1/1' | 'auto';
  onClick?: () => void;
}

export const VisualArt: React.FC<VisualArtProps> = ({
  id,
  imageUrl,
  title,
  fallbackGradient = 'from-[#141414] via-[#181818] to-[#000000]',
  className = 'w-full h-full',
  fit = 'contain',
  aspectRatio,
  onClick,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [autoFit, setAutoFit] = useState<'cover' | 'contain'>('contain');

  const fitClass =
    fit === 'contain'
      ? 'object-contain'
      : fit === 'scale-down'
      ? 'object-scale-down'
      : fit === 'auto'
      ? (autoFit === 'contain' ? 'object-contain' : 'object-contain')
      : 'object-contain';

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fit !== 'auto') return;
    const image = event.currentTarget;
    // Preserve the complete uploaded image regardless of its aspect ratio.
    setAutoFit('contain');
  };

  const ratioClass =
    aspectRatio === '16/9'
      ? 'aspect-video'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  if (imageUrl && !imageFailed) {
    if (isVideoUrl(imageUrl)) {
      return (
        <video
          src={imageUrl}
          muted
          autoPlay
          loop
          playsInline
          onError={() => setImageFailed(true)}
          onClick={onClick}
          className={`${fitClass} ${ratioClass} ${className}`.trim()}
        />
      );
    }
    return (
      <img
        src={imageUrl}
        alt={title}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setImageFailed(true)}
        onLoad={handleImageLoad}
        onClick={onClick}
        className={`${fitClass} ${ratioClass} ${className}`.trim()}
      />
    );
  }

  // Strict Netflix palette fallback graphics
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${className}`}
    >
      {/* Netflix ambient lighting layer */}
      <div className="absolute inset-0 bg-[#000000]/60" />

      {/* Thematic Scene Silhouettes */}
      {id.includes('story') || id.includes('featured') ? (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-contain opacity-85 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="netflixSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141414" />
              <stop offset="50%" stopColor="#181818" />
              <stop offset="85%" stopColor="#000000" />
            </linearGradient>
            <radialGradient id="netflixGlow" cx="0.5" cy="0.65" r="0.4">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#141414" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="600" height="350" fill="url(#netflixSky)" />
          <circle cx="300" cy="220" r="140" fill="url(#netflixGlow)" />
          {/* Distant hills */}
          <path d="M0 260 Q150 200 300 240 T600 220 L600 350 L0 350 Z" fill="#141414" opacity="0.9" />
          <path d="M0 290 Q200 250 420 270 T600 260 L600 350 L0 350 Z" fill="#000000" />
          {/* Couple silhouette */}
          <g transform="translate(260, 215) scale(0.65)" fill="#FFFFFF" opacity="0.95">
            <circle cx="38" cy="22" r="9" />
            <path d="M28 34 C28 30, 48 30, 48 34 L45 68 L30 68 Z" />
            <circle cx="58" cy="25" r="8.5" />
            <path d="M50 36 C50 32, 68 32, 68 36 L66 68 L52 68 Z" />
            <path d="M43 45 Q49 52 55 45" stroke="#E50914" strokeWidth="3" fill="none" />
          </g>
          {/* Stars in white */}
          <circle cx="80" cy="60" r="1.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="160" cy="40" r="1.2" fill="#FFFFFF" opacity="0.7" />
          <circle cx="480" cy="50" r="1.6" fill="#FFFFFF" opacity="0.9" />
          <circle cx="520" cy="90" r="1" fill="#FFFFFF" opacity="0.6" />
        </svg>
      ) : id.includes('vault') ? (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-contain opacity-85 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g transform="translate(240, 110) scale(1.1)" opacity="0.9">
            <rect x="0" y="0" width="120" height="85" rx="4" fill="#181818" stroke="#808080" strokeWidth="1.5" />
            <path d="M0 0 L60 48 L120 0" stroke="#808080" strokeWidth="1.5" fill="none" />
            <circle cx="60" cy="48" r="16" fill="#E50914" />
            <text x="60" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif">N</text>
          </g>
        </svg>
      ) : (
        <svg
          viewBox="0 0 600 350"
          className="absolute inset-0 w-full h-full object-contain opacity-80 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Minimal constellation in white and red */}
          <circle cx="150" cy="90" r="2.2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="280" cy="70" r="1.8" fill="#FFFFFF" opacity="0.8" />
          <circle cx="450" cy="110" r="2.2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="340" cy="180" r="2.8" fill="#E50914" opacity="0.9" />
          <line x1="150" y1="90" x2="280" y2="70" stroke="#808080" strokeWidth="0.8" opacity="0.3" />
          <line x1="280" y1="70" x2="340" y2="180" stroke="#E50914" strokeWidth="0.8" opacity="0.4" />
          <line x1="340" y1="180" x2="450" y2="110" stroke="#808080" strokeWidth="0.8" opacity="0.3" />
        </svg>
      )}

      {/* Netflix pure black scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-95" />
    </div>
  );
};
