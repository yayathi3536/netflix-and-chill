// Generative ambient romantic audio using Web Audio API
// Soft, soothing acoustic/ambient chords (Cmaj7 - Am7 - Fmaj7 - G6)
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.scheduleChords();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleChords() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    // Ambient chord progressions (Frequencies in Hz)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
      [174.61, 261.63, 329.63, 392.00], // Fmaj7 (F3, C4, E4, G4)
      [196.00, 246.94, 293.66, 329.63], // G6 (G3, B3, D4, E4)
    ];

    let chordIdx = 0;

    const playNext = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIdx % chords.length];
      const now = this.ctx.currentTime;
      const duration = 5.5; // seconds per chord

      notes.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Soft warm low-pass filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 200, now);

        // Gentle attack, long sustain, soft release
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration + 0.5);
      });

      chordIdx++;
      this.timerId = window.setTimeout(playNext, (duration - 0.8) * 1000);
    };

    playNext();
  }
}

export const romanticAudio = new RomanticAudioEngine();
