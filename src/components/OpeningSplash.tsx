import React, { useEffect, useRef, useState, useCallback } from 'react';
import './OpeningSplash.css';

interface OpeningSplashProps {
  onComplete: () => void;
  durationMs?: number;
}

export const OpeningSplash: React.FC<OpeningSplashProps> = ({
  onComplete,
  durationMs = 2500,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const completedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFinished(true);
    // Slight tick to allow exit fade to cleanly hand off
    setTimeout(() => {
      onComplete();
    }, 60);
  }, [onComplete]);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    let effectiveDuration = durationMs;
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
          effectiveDuration = 450;
        }
      }
    } catch {
      // Ignore matchMedia errors in constrained environments
    }

    // 2. Primary fallback timer: guarantees splash NEVER gets stuck
    const timer = setTimeout(() => {
      handleFinish();
    }, effectiveDuration);

    // 3. Accessibility: allow skip via Escape or Space key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs, handleFinish]);

  if (isFinished) {
    return null;
  }

  return (
    <div
      className="opening-splash-root"
      onClick={handleFinish}
      role="banner"
      aria-label="OUR UNIVERSE opening splash screen. Click or press Escape to continue."
      tabIndex={0}
    >
      {/* Cinematic Edge Vignette */}
      <div className="opening-splash-vignette" />

      {/* Core Red Glow Field */}
      <div className="splash-core-glow" />

      {/* Staggered Vertical Light Panels */}
      <div className="splash-panels-container" aria-hidden="true">
        <div className="splash-panel splash-panel-1" />
        <div className="splash-panel splash-panel-2" />
        <div className="splash-panel splash-panel-3" />
        <div className="splash-panel splash-panel-4" />
        <div className="splash-panel splash-panel-5" />
        <div className="splash-panel splash-panel-6" />
        <div className="splash-panel splash-panel-7" />
        <div className="splash-panel splash-panel-8" />
        <div className="splash-panel splash-panel-9" />
        <div className="splash-panel splash-panel-10" />
        <div className="splash-panel splash-panel-11" />
      </div>

      {/* Center Cinematic Brand Wordmark */}
      <div className="splash-wordmark-container">
        <h1 className="splash-title">
          OUR UNIVERSE
        </h1>
        <div className="splash-kicker">
          <span>ORIGINAL MEMORIES</span>
          <span className="splash-kicker-dot">&bull;</span>
          <span>A STREAMING LOVE STORY</span>
        </div>
      </div>

      {/* Discreet accessibility tap-to-skip hint */}
      <div className="splash-skip-hint">
        Tap or press Escape to skip
      </div>
    </div>
  );
};
