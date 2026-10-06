/**
 * ============================================================================
 * WEB AUDIO SYNTHESIZER SERVICE — GOBLIN NATURE BINGO
 * ============================================================================
 * Pure procedural audio synthesis using browser Web Audio API primitives.
 * Delivers zero-latency, zero-bandwidth sound effects for wildlife and UI:
 * - Birds chirping: Frequency-modulated harmonic sweeps simulating warblers.
 * - Wax stamp thud: Low-frequency damped impacts simulating heavy seal stamps.
 * - Wooden dice roll: Resonant multi-click burst simulating wooden game pieces.
 * Requires zero external audio downloads or MP3 files.
 */

// Shared AudioContext instance initialized lazily upon first user interaction
let audioCtx: AudioContext | null = null;

/**
 * Returns a running AudioContext, instantiating or resuming it if suspended
 * by browser mobile autoplay policies.
 */
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (err) {
    console.warn('Web Audio API not supported on this device:', err);
    return null;
  }
}

/**
 * Synthesizes a natural, cheerful bird chirp pattern.
 * Uses a double-frequency sweep (chirp-chirp) with harmonic overtone modulation
 * to mimic a wild woodland sparrow or warbler on the tree branch.
 * 
 * @param isEnabled - Master audio toggle flag. Skips playback if false.
 */
export function playBirdChirp(isEnabled: boolean = true): void {
  if (!isEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Helper to generate a single melodic chirp note with pitch bend
  const createNote = (startTime: number, startFreq: number, peakFreq: number, endFreq: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';

    // Pitch sweep curve: rapid rise, sustained crest, and gentle fall
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(peakFreq, startTime + duration * 0.4);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    // Amplitude envelope: instantaneous attack and smooth natural decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  // First chirp note
  createNote(now, 2600, 4200, 2900, 0.09);
  // Second rhythmic flutter note
  createNote(now + 0.11, 2900, 4800, 3100, 0.12);
  // Third gentle trailing note
  createNote(now + 0.25, 3300, 4100, 2800, 0.08);
}

/**
 * Synthesizes a heavy wooden wax stamp impact sound.
 * Combines a rapid low-pitch sine drop with a tactile transient impulse
 * to evoke physical wooden stamps pressing down on warm wax parchment.
 * 
 * @param isEnabled - Master audio toggle flag.
 */
export function playStampThud(isEnabled: boolean = true): void {
  if (!isEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';

  // Pitch dropping quickly from 180Hz to 40Hz to simulate heavy wood mass
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);

  // Sharp percussive volume envelope
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/**
 * Synthesizes a clicky wooden dice rattle when bribing Grimble or rerolling.
 * Fires a sequence of micro clicks with randomized resonant frequencies.
 * 
 * @param isEnabled - Master audio toggle flag.
 */
export function playDiceRoll(isEnabled: boolean = true): void {
  if (!isEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const clickCount = 4;

  for (let i = 0; i < clickCount; i++) {
    const delay = now + (i * 0.04) + (Math.random() * 0.02);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Randomized pitch for natural wooden bounce variance
    const freq = 800 + Math.random() * 600;
    osc.frequency.setValueAtTime(freq, delay);
    osc.frequency.exponentialRampToValueAtTime(200, delay + 0.03);

    gain.gain.setValueAtTime(0.2, delay);
    gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(delay);
    osc.stop(delay + 0.04);
  }
}
