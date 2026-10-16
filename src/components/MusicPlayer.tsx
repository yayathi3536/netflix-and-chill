import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Music,
  Disc3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Repeat1,
  Shuffle,
  ChevronDown,
  Sparkles,
  Heart,
  ListMusic,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { TRACKS, Track } from '../data/tracks';
import { romanticAudio } from '../utils/romanticAudio';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState<'off' | 'all' | 'one'>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [activeTab, setActiveTab] = useState<'nowPlaying' | 'playlist'>('nowPlaying');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isSynthesizedFallbackActive, setIsSynthesizedFallbackActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = () => {
      // If audio file doesn't load (e.g. custom local file not yet dropped or offline),
      // gracefully notify and offer synthesized romantic ambient fallback
      setAudioError(`Could not load "${currentTrack?.title || 'track'}". Tap play to hear ambient synthesized melody.`);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update track source when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    setAudioError(null);
    setCurrentTime(0);

    const audio = audioRef.current;
    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  // Volume & Mute handling
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (isSynthesizedFallbackActive) {
        romanticAudio.stop();
        setIsSynthesizedFallbackActive(false);
      }
      setIsPlaying(false);
    } else {
      setAudioError(null);
      // Try playing the real audio file
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsSynthesizedFallbackActive(false);
        })
        .catch(() => {
          // If browser blocked or file failed, fallback seamlessly to ambient synth
          try {
            romanticAudio.play();
            setIsSynthesizedFallbackActive(true);
            setIsPlaying(true);
            setAudioError(null);
          } catch {
            setAudioError('Autoplay blocked. Click again to play.');
            setIsPlaying(false);
          }
        });
    }
  };

  const handleNextTrack = useCallback(() => {
    if (isRepeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  }, [isRepeat, isShuffle, tracks.length]);

  const handlePrevTrack = () => {
    if (currentTime > 3 && audioRef.current) {
      // If already past 3s, restart current song
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setAudioError(null);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {
        romanticAudio.play();
        setIsSynthesizedFallbackActive(true);
      });
    }, 100);
  };

  // Custom user file upload handler (client-side drag & drop or file select)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Your Uploaded Song',
      src: fileUrl,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
      duration: 'Custom',
    };

    setTracks((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setAudioError(null);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      {/* 1. EXPANDED AUDIO FLYOUT PANEL */}
      {isOpen && (
        <div
          className="mb-3 w-[340px] sm:w-[380px] bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 text-white"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="p-4 pb-3 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-neutral-900/80 to-[#1f0d11]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914] to-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/30">
                <Music className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                  Romantic Soundtrack
                  <Sparkles className="w-3 h-3 text-rose-400" />
                </h4>
                <p className="text-[11px] text-neutral-400">Our Universe Background Music</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab(activeTab === 'nowPlaying' ? 'playlist' : 'nowPlaying')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeTab === 'playlist' ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Toggle Playlist"
              >
                <ListMusic className="w-4 h-4" />
                <span className="hidden sm:inline">Songs ({tracks.length})</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Minimize player"
                title="Minimize player"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error / Fallback Banner */}
          {audioError && (
            <div className="mx-4 mt-3 p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{audioError}</p>
                <button
                  onClick={togglePlay}
                  className="mt-1 text-[11px] font-semibold text-rose-300 hover:underline"
                >
                  Play Synthesized Melody Instead
                </button>
              </div>
            </div>
          )}

          {isSynthesizedFallbackActive && (
            <div className="mx-4 mt-3 px-3 py-1.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Playing procedural ambient piano & strings</span>
            </div>
          )}

          {/* MAIN TAB: NOW PLAYING */}
          {activeTab === 'nowPlaying' && (
            <div className="p-4 space-y-4">
              {/* Album Art & Title */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg group">
                  <img
                    src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80'}
                    alt={currentTrack?.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.1s] h-3"></span>
                        <span className="w-1 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.2s] h-4"></span>
                        <span className="w-1 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.3s] h-2"></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate tracking-wide">
                    {currentTrack?.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {currentTrack?.artist}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-medium">
                      <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                      Track {currentTrackIndex + 1} of {tracks.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="h-2 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-[#E50914] rounded-full relative transition-all"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration ? formatTime(duration) : currentTrack?.duration || '--:--'}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-lg transition-colors ${
                    isShuffle ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-400 hover:text-white'
                  }`}
                  title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevTrack}
                    className="p-2 text-neutral-300 hover:text-white transition-colors hover:scale-110 active:scale-95"
                    title="Previous track"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="p-2 text-neutral-300 hover:text-white transition-colors hover:scale-110 active:scale-95"
                    title="Next track"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (isRepeat === 'off') setIsRepeat('all');
                    else if (isRepeat === 'all') setIsRepeat('one');
                    else setIsRepeat('off');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isRepeat !== 'off' ? 'text-rose-400 bg-rose-500/10' : 'text-neutral-400 hover:text-white'
                  }`}
                  title={`Repeat: ${isRepeat}`}
                >
                  {isRepeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (isMuted && newVol > 0) setIsMuted(false);
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                />
                <span className="text-[11px] font-mono text-neutral-400 w-8 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* SECONDARY TAB: PLAYLIST & CUSTOM UPLOAD */}
          {activeTab === 'playlist' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-neutral-300">Playlist Tracks</span>
                <label className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1 font-medium hover:underline">
                  <Upload className="w-3 h-3" />
                  Play Local Audio File
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {tracks.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleSelectTrack(idx)}
                      className={`w-full p-2 rounded-xl text-left flex items-center gap-3 transition-colors ${
                        isCurrent
                          ? 'bg-rose-500/20 text-white ring-1 ring-rose-500/40'
                          : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-neutral-800 relative">
                        <img
                          src={track.coverUrl || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=100&q=80'}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-rose-400' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">{track.artist}</p>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                        {track.duration || '2:30'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 text-[11px] text-neutral-400 leading-relaxed">
                💡 <strong className="text-white">Custom Files:</strong> Place your audio in{' '}
                <code className="text-rose-300 bg-white/5 px-1 py-0.5 rounded">public/music/</code> and reference them in{' '}
                <code className="text-rose-300 bg-white/5 px-1 py-0.5 rounded">src/data/tracks.ts</code>.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FLOATING LAUNCHER BUTTON (Bottom Corner) */}
      <div className="flex items-center gap-2">
        {/* Quick Play/Pause Badge next to launcher */}
        {isPlaying && !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-rose-500/40 text-xs text-white shadow-xl hover:bg-black/90 transition-all cursor-pointer animate-in fade-in"
          >
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.1s] h-2"></span>
              <span className="w-0.5 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.2s] h-3"></span>
              <span className="w-0.5 bg-[#E50914] rounded-full animate-bounce [animation-delay:0.3s] h-1.5"></span>
            </div>
            <span className="max-w-[140px] truncate text-rose-200 font-medium">{currentTrack?.title}</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
            isPlaying
              ? 'bg-gradient-to-br from-[#E50914] to-rose-600 text-white ring-4 ring-rose-500/30 shadow-rose-900/60 scale-105'
              : 'bg-[#181818]/95 hover:bg-[#222222] text-neutral-200 border border-white/15 hover:border-white/30 hover:scale-105'
          }`}
          aria-label={isOpen ? 'Close music player' : 'Open music player'}
          title={isOpen ? 'Close music player' : 'Open music player'}
        >
          {/* Pulsing ring animation when actively playing */}
          {isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500 to-[#E50914] opacity-75 blur-sm animate-pulse -z-10"></span>
          )}

          {isPlaying ? (
            <Disc3 className="w-6 h-6 animate-spin [animation-duration:4s]" />
          ) : (
            <Music className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}

          {/* Status badge */}
          <span
            className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black ${
              isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
