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
  }, []);

  // Explicitly request playback. If the browser blocks playback, show the
  // built-in CSS animation instead of leaving a black overlay on screen.
  useEffect(() => {
    if (prefersReducedMotion || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    playPromise?.catch(() => {
      setVideoFailed(true);
    });
  }, [prefersReducedMotion, videoFailed]);

  useEffect(() => {
    const timer = window.setTimeout(
      handleFinish,
      prefersReducedMotion ? 0 : durationMs,
    );

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
  }, [durationMs, handleFinish, prefersReducedMotion]);

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

      {(!showVideo || !videoReady) && (
        <div className="opening-splash-css-fallback" aria-hidden="true">
          <div className="splash-panels-container">
            {Array.from({ length: 11 }, (_, index) => (
              <div key={index} className={`splash-panel splash-panel-${index + 1}`} />
            ))}
          </div>
          <div className="splash-core-glow" />
          <div className="splash-wordmark-container">
            <h1 className="splash-title">OUR UNIVERSE</h1>
            <p className="splash-kicker">Every moment, our story</p>
          </div>
          <div className="opening-splash-vignette" />
        </div>
      )}

      <div className="splash-skip-hint">Tap or press Escape to skip</div>
    </div>
  );
};
