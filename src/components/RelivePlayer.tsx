import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  SkipForward,
  MessageSquare,
} from 'lucide-react';
import { MemoryItem, Episode } from '../types';
import { VisualArt } from './VisualArt';
import { getVideoUrl } from '../utils/mediaHelpers';

interface RelivePlayerProps {
  memory: MemoryItem;
  episode?: Episode;
  onClose: () => void;
  onNextMemory?: () => void;
}

export const RelivePlayer: React.FC<RelivePlayerProps> = ({
  memory,
  episode,
  onClose,
  onNextMemory,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoUrl = getVideoUrl(memory, episode);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const hasPlayableVideoElement = Boolean(videoUrl && !videoError);

  useEffect(() => {
    setVideoError(false);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [memory.id, episode?.id, videoUrl]);

  useEffect(() => {
    if (hasPlayableVideoElement && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, hasPlayableVideoElement]);

  useEffect(() => {
    if (hasPlayableVideoElement) return;
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0; // loop
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, hasPlayableVideoElement]);

  // Autohide controls on idle
  useEffect(() => {
    let timeout: number;
    const handleMouseMove = () => {
      setShowControls(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.clearTimeout(timeout);
    };
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSubtitle = () => {
    if (!showCaptions) return null;
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
    if (percent < 25) {
      return episode?.description || memory.synopsis;
    } else if (percent < 60) {
      return memory.fullStory.slice(0, 160) + '...';
    } else if (percent < 90) {
      return `"${memory.title}" · starring the girl who stole my heart forever.`;
    } else {
      return 'Every memory with you is my favorite memory.';
    }
  };

  const seekTo = (newTime: number) => {
    const clamped = Math.max(0, Math.min(duration, newTime));
    setCurrentTime(clamped);
    if (hasPlayableVideoElement && videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Cinematic Main Viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        {hasPlayableVideoElement ? (
          <video
            ref={videoRef}
            src={videoUrl!}
            autoPlay
            playsInline
            muted={isMuted}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              if (e.currentTarget.duration && Number.isFinite(e.currentTarget.duration)) {
                setDuration(e.currentTarget.duration);
              }
            }}
            onEnded={() => {
              if (onNextMemory) {
                onNextMemory();
              } else {
                setIsPlaying(false);
              }
            }}
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain bg-[#000000]"
          />
        ) : (
          /* Memory Visual with Ken Burns movement */
          <div className="absolute inset-0 w-full h-full animate-ken-burns">
            <VisualArt
              id={memory.id}
              category={memory.category}
              title={memory.title}
              imageUrl={memory.backdropUrl}
              fallbackGradient="from-[#141414] via-[#181818] to-[#000000]"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%]" />

        {/* Subtitles Overlay */}
        {showCaptions && (
          <div className="absolute bottom-28 left-4 right-4 text-center z-30 pointer-events-none">
            <p className="inline-block px-5 py-2 rounded bg-[#000000]/80 text-sm sm:text-base md:text-lg text-[#FFFFFF] font-medium drop-shadow-lg max-w-2xl leading-relaxed">
              {getSubtitle()}
            </p>
          </div>
        )}

        {/* Top Header Controls */}
        <div
          className={`absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-40 bg-gradient-to-b from-[#000000]/90 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#181818] text-[#FFFFFF] transition-colors cursor-pointer"
              aria-label="Back to browse"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-[#FFFFFF] font-bold text-lg sm:text-xl tracking-wide flex items-center gap-2 font-bebas uppercase">
                <span>{memory.title}</span>
                <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              </h2>
              <p className="text-xs text-[#B3B3B3]">
                {episode ? episode.title : memory.subtitle || 'Streaming Our Story'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded transition-colors ${
                showCaptions ? 'text-[#E50914] bg-[#181818]' : 'text-[#808080] hover:text-[#FFFFFF]'
              }`}
              title="Toggle Captions"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-[#000000]/95 via-[#000000]/60 to-transparent transition-opacity duration-300 space-y-3 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Seekbar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#808080] font-mono">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 bg-[#181818] rounded overflow-hidden cursor-pointer relative group/bar"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seekTo(pos * duration);
              }}
            >
              <div
                className="h-full bg-[#E50914] relative transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFFFFF] rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-[#808080] font-mono">
              {formatTime(duration)}
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-[#FFFFFF] hover:bg-[#B3B3B3] text-[#000000] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                )}
              </button>

              {/* Rewind 10s */}
              <button
                onClick={() => seekTo(currentTime - 10)}
                className="p-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Fast Forward 10s */}
              <button
                onClick={() => seekTo(currentTime + 10)}
                className="p-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
                title="Forward 10s"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Audio Toggle */}
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('ouruniverse:toggleplay'));
                  setIsMuted(!isMuted);
                }}
                className="p-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
                title="Toggle soundtrack"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Next Memory Button */}
              {onNextMemory && (
                <button
                  onClick={onNextMemory}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#B3B3B3] hover:text-[#FFFFFF] px-3 py-1.5 rounded bg-[#181818] hover:bg-white/10 transition-colors uppercase tracking-wider"
                >
                  <span>Next Title</span>
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
