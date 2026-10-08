/**
 * ============================================================================
 * AUDIO SYNTHESIZER & SOUND FX SERVICE — GOBLIN NATURE BINGO
 * ============================================================================
 * Delivers tactical UI sounds for the game:
 * - Wax stamp impact thud: Low-frequency damped impacts for verified quests.
 * - Wooden dice roll: Resonant multi-click bursts for quest rerolls.
 *
 * NOTE: Wildlife sounds (bird chirping and bee buzzing) are completely disabled
 * per user request to ensure a calm, peaceful foraging experience.
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
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
 * Bird chirp permanently muted per user request.
 */
export function playBirdChirp(_isEnabled: boolean = true, _volume?: number): void {
  // Completely disabled
  return;
}

/**
 * Bee buzz permanently muted per user request.
 */
export function playBeeBuzz(_isEnabled: boolean = true, _volume?: number): void {
  // Completely disabled
  return;
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
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);

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
