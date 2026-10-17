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
  AlertCircle,
  Upload,
} from 'lucide-react';
import { TRACKS, Track, getAssetUrl } from '../data/tracks';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function MusicPlayer({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState<'off' | 'all' | 'one'>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [activeTab, setActiveTab] = useState<'nowPlaying' | 'playlist'>('nowPlaying');
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize Audio element once with real browser listeners
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setAudioError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setAudioError(null);
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError(`Unable to play "${currentTrack?.title || 'track'}". Verify file format or connection.`);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial track assignment
    if (currentTrack) {
      audio.src = getAssetUrl(currentTrack.src);
      audio.load();
    }

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
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
    const resolvedUrl = getAssetUrl(currentTrack.src);
    audio.src = resolvedUrl;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play interrupted or blocked:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  // Volume & Mute handling
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Toggle Play / Pause using real HTML5 Audio API
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setAudioError(null);
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setAudioError(null);
          })
          .catch((err) => {
            console.warn('Playback error:', err);
            setIsLoading(false);
            setIsPlaying(false);
            setAudioError('Browser blocked playback. Tap Play again to start music.');
          });
      }
    }
  }, [isPlaying]);

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

  const handlePrevTrack = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  }, [currentTime, tracks.length]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSelectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setAudioError(null);
    setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.warn('Track play interrupted:', err);
      });
    }, 100);
  }, []);

  // Listen to external triggers (Hero banner soundtrack toggle, SoundtrackRow cards)
  useEffect(() => {
    const handleSelectTrackEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number; autoOpen?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        handleSelectTrack(customEvent.detail.index);
        if (customEvent.detail.autoOpen !== false) {
          setIsOpen(true);
        }
      }
    };

    const handleTogglePlayEvent = () => {
      togglePlay();
    };

    const handleOpenPlayerEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener('ouruniverse:playtrack', handleSelectTrackEvent);
    window.addEventListener('ouruniverse:toggleplay', handleTogglePlayEvent);
    window.addEventListener('ouruniverse:openplayer', handleOpenPlayerEvent);

    return () => {
      window.removeEventListener('ouruniverse:playtrack', handleSelectTrackEvent);
      window.removeEventListener('ouruniverse:toggleplay', handleTogglePlayEvent);
      window.removeEventListener('ouruniverse:openplayer', handleOpenPlayerEvent);
    };
  }, [togglePlay, handleSelectTrack]);

  // Broadcast player state to site (Hero volume indicator, Soundtrack row animations)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('ouruniverse:audiostate', {
        detail: {
          isPlaying,
          currentTrackIndex,
          track: currentTrack,
        },
      })
    );
  }, [isPlaying, currentTrackIndex, currentTrack]);

  // Custom user file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Custom Upload',
      src: fileUrl,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      duration: 'Custom',
      vibe: 'Personal Favorite',
    };

    setTracks((prev) => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setAudioError(null);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 150);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* PERSISTENT FLOATING COMPACT PLAYER (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none">
        {/* Floating Mini Bar - Strict Netflix Theme */}
        <div
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 pl-2 pr-4 py-2 bg-[#141414]/95 hover:bg-[#181818] border border-[#181818] hover:border-[#808080]/50 rounded-full shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          {/* Vinyl Disc / Artwork */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md shrink-0 border border-[#808080]/30">
            {currentTrack.coverUrl ? (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${
                  isPlaying ? 'animate-spin [animation-duration:8s]' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                <Music className="w-4 h-4 text-[#E50914]" />
              </div>
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFFFFF] shadow-xs" />
          </div>

          {/* Text Title & Artist */}
          <div className="hidden sm:flex flex-col max-w-[140px] overflow-hidden">
            <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider truncate">
              {currentTrack.artist}
            </span>
            <span className="text-xs text-[#FFFFFF] font-medium truncate">
              {currentTrack.title}
            </span>
          </div>

          {/* Mini Play / Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-8 h-8 rounded-full bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer shrink-0"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Equalizer bars when playing */}
          {isPlaying && (
            <div className="hidden sm:flex items-end gap-0.5 h-4 px-1">
              <span className="w-1 bg-[#E50914] rounded-full animate-pulse h-2.5" />
              <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.2s] h-4" />
              <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.4s] h-2" />
            </div>
          )}
        </div>
      </div>

      {/* EXPANDED FULL-FEATURED MUSIC PLAYER MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#141414] border border-[#181818] rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title & Close */}
            <div className="flex items-center justify-between border-b border-[#181818] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#E50914] flex items-center justify-center text-xs text-[#FFFFFF] font-black font-bebas">
                  N
                </div>
                <div>
                  <h2 className="font-bebas text-xl text-[#FFFFFF] font-bold tracking-wider uppercase">
                    Original Soundtrack
                  </h2>
                  <span className="text-[11px] text-[#B3B3B3]">
                    {tracks.length} Curated Tracks
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Tab Switcher */}
                <div className="flex bg-[#181818] rounded p-0.5 border border-[#808080]/30 text-xs mr-2">
                  <button
                    onClick={() => setActiveTab('nowPlaying')}
                    className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                      activeTab === 'nowPlaying'
                        ? 'bg-[#E50914] text-[#FFFFFF] font-bold'
                        : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
                    }`}
                  >
                    Playing
                  </button>
                  <button
                    onClick={() => setActiveTab('playlist')}
                    className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                      activeTab === 'playlist'
                        ? 'bg-[#E50914] text-[#FFFFFF] font-bold'
                        : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
                    }`}
                  >
                    Tracklist
                  </button>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded hover:bg-[#181818] text-[#808080] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  aria-label="Close player"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ERROR NOTIFICATION BANNER */}
            {audioError && (
              <div className="flex items-center gap-2 p-3 rounded bg-[#181818] border border-[#E50914] text-[#FFFFFF] text-xs">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
                <span className="flex-1">{audioError}</span>
              </div>
            )}

            {/* TAB: NOW PLAYING */}
            {activeTab === 'nowPlaying' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Album Art */}
                <div className="relative aspect-square max-w-[260px] mx-auto rounded overflow-hidden shadow-2xl border border-[#181818] group bg-[#000000]">
                  {currentTrack.coverUrl ? (
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                      <Music className="w-16 h-16 text-[#E50914]" />
                    </div>
                  )}

                  {/* Spinning Disc Badge in Corner */}
                  <div className="absolute bottom-3 right-3 bg-[#000000]/80 rounded p-2 border border-[#808080]/30 shadow">
                    <Disc3
                      className={`w-5 h-5 text-[#E50914] ${
                        isPlaying ? 'animate-spin [animation-duration:4s]' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-[#E50914] uppercase tracking-widest block">
                    {currentTrack.artist}
                  </span>
                  <h3 className="font-bebas text-2xl text-[#FFFFFF] font-bold tracking-wider uppercase truncate">
                    {currentTrack.title}
                  </h3>
                  {currentTrack.vibe && (
                    <p className="text-xs text-[#B3B3B3]">
                      {currentTrack.vibe}
                    </p>
                  )}
                </div>

                {/* Progress Bar & Timestamps */}
                <div className="space-y-1.5 pt-1">
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="relative w-full h-1.5 bg-[#181818] rounded cursor-pointer overflow-hidden group"
                  >
                    <div
                      className="h-full bg-[#E50914] rounded relative"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#808080] font-mono tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-between px-4 pt-2">
                  {/* Shuffle Button */}
                  <button
                    onClick={() => setIsShuffle((prev) => !prev)}
                    className={`p-2 rounded transition-colors cursor-pointer ${
                      isShuffle ? 'text-[#E50914] bg-[#E50914]/15' : 'text-[#808080] hover:text-[#FFFFFF]'
                    }`}
                    title={isShuffle ? 'Shuffle Enabled' : 'Shuffle Disabled'}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={handlePrevTrack}
                    className="p-2.5 rounded hover:bg-[#181818] text-[#FFFFFF] transition-transform active:scale-90 cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  {/* Main Play / Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white ml-1" />
                    )}
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextTrack}
                    className="p-2.5 rounded hover:bg-[#181818] text-[#FFFFFF] transition-transform active:scale-90 cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {/* Repeat Button */}
                  <button
                    onClick={() => {
                      setIsRepeat((prev) => (prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'));
                    }}
                    className={`p-2 rounded transition-colors cursor-pointer ${
                      isRepeat !== 'off' ? 'text-[#E50914] bg-[#E50914]/15' : 'text-[#808080] hover:text-[#FFFFFF]'
                    }`}
                    title={`Repeat: ${isRepeat}`}
                  >
                    {isRepeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </button>
                </div>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-3 px-4 pt-2 border-t border-[#181818]">
                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="text-[#808080] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-[#E50914]" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4 text-[#FFFFFF]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#FFFFFF]" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full accent-[#E50914] h-1 bg-[#181818] rounded cursor-pointer"
                  />
                  <span className="text-[10px] text-[#808080] font-mono w-8 text-right tabular-nums">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* TAB: PLAYLIST (All 7 Songs) */}
            {activeTab === 'playlist' && (
              <div className="space-y-3 max-h-[380px] overflow-y-auto dark-scrollbar pr-1 animate-in fade-in duration-150">
                {/* Admin-Only Upload Local Audio Button */}
                {isAdmin && (
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded border border-dashed border-[#808080]/40 hover:border-[#E50914] bg-[#181818] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                    <span>Upload &amp; Play Audio File (Admin)</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Song List */}
                <div className="divide-y divide-[#181818]">
                  {tracks.map((track, idx) => {
                    const isCurrent = currentTrackIndex === idx;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleSelectTrack(idx)}
                        className={`flex items-center justify-between p-2.5 rounded cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-[#181818] text-[#FFFFFF] border-l-2 border-[#E50914]'
                            : 'hover:bg-[#181818]/60 text-[#B3B3B3]'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-xs font-mono text-[#808080] w-4 text-center">
                            {idx + 1}
                          </span>
                          <div className="w-9 h-9 rounded overflow-hidden shrink-0 bg-[#000000]">
                            {track.coverUrl ? (
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                                <Music className="w-3.5 h-3.5 text-[#E50914]" />
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <h4
                              className={`text-xs font-bold truncate ${
                                isCurrent ? 'text-[#FFFFFF]' : 'text-[#B3B3B3]'
                              }`}
                            >
                              {track.title}
                            </h4>
                            <p className="text-[11px] text-[#808080] truncate">{track.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {isCurrent && isPlaying && (
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-1 bg-[#E50914] rounded-full animate-pulse h-2" />
                              <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.2s] h-3" />
                              <span className="w-1 bg-[#E50914] rounded-full animate-pulse [animation-delay:0.4s] h-1.5" />
                            </div>
                          )}
                          <span className="text-[11px] text-[#808080] font-mono tabular-nums">
                            {track.duration || '3:30'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
