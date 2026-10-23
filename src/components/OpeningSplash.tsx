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

    // Do not fail over just because GitHub Pages is slow to start the MP4.
    // The CSS animation is used only when the browser reports a real video error.
  }, []);

  useEffect(() => {
    // Reduced-motion users skip the animated intro; on video failure, continue quickly.
    const fallbackDuration = prefersReducedMotion ? 0 : videoFailed ? 500 : durationMs;
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
          src={`${import.meta.env.BASE_URL}our-universe-intro.mp4?v=2`}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onEnded={handleFinish}
          onError={() => {
            setVideoReady(false);
            setVideoFailed(true);
          }}
        />
      )}

      <div className="splash-skip-hint">Tap or press Escape to skip</div>
    </div>
  );
};
