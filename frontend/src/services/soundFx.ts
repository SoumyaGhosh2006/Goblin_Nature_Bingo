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

import { audioManager } from './audioManager';

/**
 * Bird chirp permanently muted per user request.
 */
export function playBirdChirp(_isEnabled: boolean = true, _volume?: number): void {
  return;
}

/**
 * Bee buzz permanently muted per user request.
 */
export function playBeeBuzz(_isEnabled: boolean = true, _volume?: number): void {
  return;
}

/**
 * Synthesizes a heavy wooden wax stamp impact sound via the centralized SFX channel.
 */
export function playStampThud(isEnabled: boolean = true): void {
  if (!isEnabled) return;
  audioManager.playSfx('stamp_thud');
}

/**
 * Synthesizes a clicky wooden dice rattle via the centralized SFX channel.
 */
export function playDiceRoll(isEnabled: boolean = true): void {
  if (!isEnabled) return;
  audioManager.playSfx('dice_roll');
}

