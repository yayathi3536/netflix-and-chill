import React, { useCallback, useEffect, useRef, useState } from 'react';
import './OpeningSplash.css';

interface OpeningSplashProps {
  onComplete: () => void;
  durationMs?: number;
}

export const OpeningSplash: React.FC<OpeningSplashProps> = ({
  onComplete,
  durationMs = 6500,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const completedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFinished(true);
    window.setTimeout(onComplete, 480);
  }, [onComplete]);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    setPrefersReducedMotion(reduced);
    if (reduced) return;

    // If the asset is missing or cannot decode, fall back to the CSS animation.
    const assetCheck = window.setTimeout(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        setVideoFailed(true);
      }
    }, 1400);
    return () => window.clearTimeout(assetCheck);
  }, []);

  useEffect(() => {
    const fallbackDuration = prefersReducedMotion ? 450 : videoFailed ? 2600 : durationMs;
    const timer = window.setTimeout(handleFinish, fallbackDuration);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleFinish();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs, handleFinish, prefersReducedMotion, videoFailed]);

  useEffect(() => {
    if (prefersReducedMotion || videoFailed) {
      videoRef.current?.pause();
    }
  }, [prefersReducedMotion, videoFailed]);

  if (isFinished) return null;

  const showVideo = !prefersReducedMotion && !videoFailed;

  return (
    <div
      className={`opening-splash-root${isFinished ? ' is-exiting' : ''}`}
      onClick={handleFinish}
      role="banner"
      aria-label="OUR UNIVERSE opening splash screen. Click or press Escape to continue."
      tabIndex={0}
    >
      {showVideo && (
        <video
          ref={videoRef}
          className={`opening-splash-video${videoReady ? ' is-ready' : ''}`}
          src={`${import.meta.env.BASE_URL}our-universe-intro.mp4`}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onEnded={handleFinish}
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* CSS fallback is retained so a missing video never blocks the site. */}
      <div className={`opening-splash-css-fallback${videoReady && showVideo ? ' is-hidden' : ''}`} aria-hidden="true">
        <div className="opening-splash-vignette" />
        <div className="splash-core-glow" />
        <div className="splash-panels-container">
          {Array.from({ length: 11 }, (_, index) => (
            <div key={index} className={`splash-panel splash-panel-${index + 1}`} />
          ))}
        </div>
        <div className="splash-wordmark-container">
          <h1 className="splash-title">OUR UNIVERSE</h1>
          <div className="splash-kicker">
            <span>ORIGINAL MEMORIES</span>
            <span className="splash-kicker-dot">&bull;</span>
            <span>A STREAMING LOVE STORY</span>
          </div>
        </div>
      </div>

      <div className="splash-skip-hint">Tap or press Escape to skip</div>
    </div>
  );
};
