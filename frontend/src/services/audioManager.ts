/**
 * ============================================================================
 * CENTRALIZED AUDIO MANAGER — GOBLIN NATURE BINGO
 * ============================================================================
 * Coordinates all in-game audio through a single shared controller with
 * dedicated, non-overlapping channels:
 *
 * 1. Channel.VOICE:
 *    - Dedicated to Grimble's field commentary and ElevenLabs TTS audio.
 *    - Single Audio instance.
 *    - Starting a new voice line immediately stops and resets any currently
 *      playing voice line (pause() + currentTime = 0).
 *    - Not interrupted by minor UI clicks.
 *    - Sequence tracking cancels stale out-of-order network responses.
 *
 * 2. Channel.SFX:
 *    - Dedicated to short tactical UI sounds (tile clicks, dev toggle clicks,
 *      dice rolls, wax stamp thuds).
 *    - Stopping & restarting: Any new SFX trigger immediately cuts off and
 *      resets the previous SFX sound (no overlapping or queuing).
 *    - Rapid clicks restart the sound instantly without layering.
 *
 * 3. Master Mute Control:
 *    - Muting immediately stops both channels.
 */

export type SfxType = 'tile_click' | 'toggle_click' | 'stamp_thud' | 'dice_roll';

class AudioManager {
  private voiceAudio: HTMLAudioElement | null = null;
  private voiceRequestId: number = 0;
  private isMuted: boolean = false;

  // Web Audio Context & state for the SFX channel
  private audioCtx: AudioContext | null = null;
  private activeSfxNodes: { stop: () => void }[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Lazy single voice audio element
      this.voiceAudio = new Audio();
      this.voiceAudio.preload = 'auto';
    }
  }

  /**
   * Initializes or resumes the shared Web Audio Context.
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  /**
   * Enables or disables global audio. Muting immediately stops all active channels.
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopVoice();
      this.stopAllSfx();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // ==========================================================================
  // VOICE CHANNEL (Grimble Commentary)
  // ==========================================================================

  /**
   * Allocates a new voice request ticket to avoid race conditions with async TTS.
   */
  public beginVoiceRequest(): number {
    return ++this.voiceRequestId;
  }

  /**
   * Plays a voice track on the dedicated Voice channel.
   * Cuts off any currently playing voice line cleanly before starting.
   * 
   * @param url - Audio source URL or data URL
   * @param requestId - Optional request ID to reject outdated network responses
   */
  public playVoice(url: string, requestId?: number): boolean {
    if (this.isMuted || !url) return false;

    // Discard stale voice responses if a newer request has already begun
    if (requestId !== undefined && requestId !== this.voiceRequestId) {
      return false;
    }

    if (!this.voiceAudio && typeof window !== 'undefined') {
      this.voiceAudio = new Audio();
    }

    if (!this.voiceAudio) return false;

    try {
      // Stop and reset current voice playback immediately
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
      this.voiceAudio.src = url;

      const playPromise = this.voiceAudio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Handled gracefully (e.g., mobile autoplay policy or interrupted by another line)
        });
      }
      return true;
    } catch (err) {
      console.warn('Voice playback error:', err);
      return false;
    }
  }

  /**
   * Stops and resets the Voice channel.
   */
  public stopVoice(): void {
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio.currentTime = 0;
    }
  }

  // ==========================================================================
  // UI / SFX CHANNEL (Non-Overlapping Short Tactical Sounds)
  // ==========================================================================

  /**
   * Stops all active sound generators on the SFX channel cleanly.
   */
  public stopAllSfx(): void {
    while (this.activeSfxNodes.length > 0) {
      const node = this.activeSfxNodes.pop();
      try {
        node?.stop();
      } catch {}
    }
  }

  /**
   * Plays a tactical sound effect on the SFX channel.
   * Cuts off any currently playing SFX before starting so rapid clicks
   * never layer on top of each other.
   * 
   * Does NOT interrupt the Voice channel.
   */
  public playSfx(type: SfxType): void {
    if (this.isMuted) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Cut off and reset currently playing SFX immediately
    this.stopAllSfx();

    const now = ctx.currentTime;

    switch (type) {
      case 'tile_click': {
        // Crisp parchment/wood card tap (transient impulse)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);

        this.activeSfxNodes.push({
          stop: () => {
            try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
          }
        });
        break;
      }

      case 'toggle_click': {
        // High-pitch crisp brass/wood toggle switch click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);

        this.activeSfxNodes.push({
          stop: () => {
            try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
          }
        });
        break;
      }

      case 'stamp_thud': {
        // Heavy wooden wax stamp impact thud
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

        this.activeSfxNodes.push({
          stop: () => {
            try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch {}
          }
        });
        break;
      }

      case 'dice_roll': {
        // Reroll dice rattle
        const clickCount = 4;
        const oscillators: OscillatorNode[] = [];
        const gains: GainNode[] = [];

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

          oscillators.push(osc);
          gains.push(gain);
        }

        this.activeSfxNodes.push({
          stop: () => {
            oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
            gains.forEach(g => { try { g.disconnect(); } catch {} });
          }
        });
        break;
      }
    }
  }
}

// Global Singleton Instance
export const audioManager = new AudioManager();
