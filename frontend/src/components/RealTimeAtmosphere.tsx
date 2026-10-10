/**
 * ============================================================================
 * REAL-TIME ATMOSPHERE & CELESTIAL CANOPY LAYER — GOBLIN NATURE BINGO
 * ============================================================================
 * Dynamically transforms the woodland environment based on the player's
 * real local device clock (new Date().getHours()):
 *
 * 1. Day Phase (06:00 – 17:00):
 *    - Crisp volumetric sunbeams filtering down and drifting golden pollen motes.
 * 2. Sunset / Twilight Phase (17:00 – 19:30):
 *    - Rich amber, violet, and crimson sunset gradient wash across the canopy.
 * 3. Night Phase (19:30 – 06:00):
 *    - Deep nocturnal moonlit wash, radiant glowing crescent moon, twinkling stars,
 *      and gently drifting, blinking firefly particles (soft yellow & lime green glowing dots).
 *    - Fireflies strictly appear ONLY during the Night phase!
 *
 * Includes a Dev-Only Time Override Toggle permitting instant previewing of
 * Day, Sunset, and Night lighting without modifying the device clock.
 */

import React, { useState, useEffect } from 'react';
import { audioManager } from '../services/audioManager';

export type TimePhase = 'DAY' | 'SUNSET' | 'NIGHT';
export type TimeOverride = 'AUTO' | TimePhase;

/**
 * Resolves current atmospheric phase against exact Indian Standard Time (IST) boundaries:
 * - Morning/Day: 07:00 – 17:00
 * - Evening:     17:00 – 19:00
 * - Night:       19:00 – 07:00
 */
export function resolveTimePhase(hour: number): TimePhase {
  if (hour >= 7 && hour < 17) return 'DAY';
  if (hour >= 17 && hour < 19) return 'SUNSET';
  return 'NIGHT';
}

export const RealTimeAtmosphere: React.FC = () => {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(() => new Date().getMinutes());

  // Interactive Dev-Only Time Override state (defaults to AUTO or URL query param)
  const [timeOverride, setTimeOverride] = useState<TimeOverride>(() => {
    if (typeof window !== 'undefined') {
      const urlParam = new URLSearchParams(window.location.search).get('time')?.toUpperCase();
      if (urlParam === 'DAY' || urlParam === 'SUNSET' || urlParam === 'NIGHT') {
        return urlParam as TimePhase;
      }
      const saved = localStorage.getItem('goblin_time_override');
      if (saved === 'DAY' || saved === 'SUNSET' || saved === 'NIGHT') {
        return saved as TimePhase;
      }
    }
    return 'AUTO';
  });

  // Rapidly synchronize device clock every 10 seconds for instant Auto mode transitions
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 10000);

    return () => clearInterval(clockInterval);
  }, []);

  const handleSetOverride = (phase: TimeOverride) => {
    audioManager.playSfx('toggle_click');
    setTimeOverride(phase);
    if (phase === 'AUTO') {
      localStorage.removeItem('goblin_time_override');
    } else {
      localStorage.setItem('goblin_time_override', phase);
    }
  };

  // Determine active atmosphere state: either forced by dev override or device clock
  const effectivePhase: TimePhase = timeOverride === 'AUTO'
    ? resolveTimePhase(currentHour + currentMinute / 60)
    : timeOverride;

  // Notify companion systems when atmosphere phase shifts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('goblin_atmosphere_changed', { detail: effectivePhase }));
    }
  }, [effectivePhase]);

  // Formatted 12h clock string for naturalist field ledger
  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden" aria-hidden="true">
      {/* ================================================================== */}
      {/* DEV-ONLY TIME OVERRIDE INTERACTIVE CONTROL BAR                     */}
      {/* ================================================================== */}
      <div className="absolute top-[62px] inset-x-0 flex justify-center pointer-events-none z-40">
        <div className="pointer-events-auto flex items-center bg-black/85 backdrop-blur-md rounded-full px-2 py-0.5 border border-amber-500/50 shadow-xl space-x-1">
          <span className="text-[7.5px] font-mono font-bold text-amber-200/90 mr-0.5 uppercase tracking-wider">
            Dev Light:
          </span>
          <button
            onClick={() => handleSetOverride('AUTO')}
            title="Detect local device clock"
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold cursor-pointer transition-all ${
              timeOverride === 'AUTO'
                ? 'bg-amber-500 text-black shadow-xs font-black'
                : 'text-amber-100/70 hover:text-white'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => handleSetOverride('DAY')}
            title="Preview Day mode (sunbeams & pollen motes)"
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold cursor-pointer transition-all ${
              timeOverride === 'DAY'
                ? 'bg-amber-400 text-black shadow-xs font-black'
                : 'text-amber-100/70 hover:text-white'
            }`}
          >
            ☀️ Day
          </button>
          <button
            onClick={() => handleSetOverride('SUNSET')}
            title="Preview Sunset mode (amber/crimson wash)"
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold cursor-pointer transition-all ${
              timeOverride === 'SUNSET'
                ? 'bg-rose-500 text-white shadow-xs font-black'
                : 'text-amber-100/70 hover:text-white'
            }`}
          >
            🌅 Sunset
          </button>
          <button
            onClick={() => handleSetOverride('NIGHT')}
            title="Preview Night mode (moon, stars & fireflies)"
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold cursor-pointer transition-all ${
              timeOverride === 'NIGHT'
                ? 'bg-emerald-400 text-black shadow-xs font-black'
                : 'text-amber-100/70 hover:text-white'
            }`}
          >
            🌙 Night
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 1. ATMOSPHERIC COLOR WASH OVERLAY                                 */}
      {/* ================================================================== */}
      {effectivePhase === 'DAY' && (
        /* Day: Crisp sunbeam warmth */
        <div className="absolute inset-0 bg-amber-500/10 mix-blend-soft-light transition-opacity duration-700" />
      )}

      {effectivePhase === 'SUNSET' && (
        /* Sunset: Deep amber to violet twilight gradient */
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/35 via-rose-900/35 to-purple-950/50 mix-blend-multiply transition-opacity duration-700" />
      )}

      {effectivePhase === 'NIGHT' && (
        /* Night: Deep nocturnal indigo wash with silver moonlight glow */
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-indigo-950/60 to-emerald-950/50 mix-blend-multiply transition-opacity duration-700" />
      )}

      {/* ================================================================== */}
      {/* 2. DAY PHASE: VOLUMETRIC SUNBEAMS & GOLDEN POLLEN MOTES           */}
      {/* ================================================================== */}
      {effectivePhase === 'DAY' && (
        <>
          {/* Volumetric diagonal sunbeams filtering through the canopy */}
          <div className="absolute -top-12 right-2 w-36 h-[500px] bg-gradient-to-b from-amber-200/35 via-yellow-100/15 to-transparent transform -rotate-35 origin-top blur-[2px] pointer-events-none" />
          <div className="absolute -top-12 right-24 w-24 h-[440px] bg-gradient-to-b from-amber-100/30 via-yellow-200/12 to-transparent transform -rotate-35 origin-top blur-[2px] pointer-events-none" />
          <div className="absolute -top-12 right-48 w-16 h-[380px] bg-gradient-to-b from-amber-200/22 via-yellow-100/8 to-transparent transform -rotate-35 origin-top blur-[3px] pointer-events-none" />

          {/* Drifting Golden Pollen Motes shimmering in sunlight */}
          <div className="absolute top-[32%] left-[22%] w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-[moteDrift_4s_ease-in-out_infinite]" />
          <div className="absolute top-[48%] left-[58%] w-2 h-2 rounded-full bg-yellow-200 shadow-[0_0_10px_#fef08a] animate-[moteDrift_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[68%] left-[32%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-[moteDrift_3.8s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[22%] left-[78%] w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047] animate-[moteDrift_6s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[58%] left-[84%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a] animate-[moteDrift_4.5s_ease-in-out_infinite_1.5s]" />
        </>
      )}

      {/* ================================================================== */}
      {/* 3. SUNSET PHASE: SETTING SUN ORB & TWILIGHT GLOW                  */}
      {/* ================================================================== */}
      {effectivePhase === 'SUNSET' && (
        <>
          {/* Setting amber sun orb dipping near the treetops */}
          <div className="absolute top-[12%] right-[10%] w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-200 opacity-80 blur-[2px] shadow-[0_0_35px_rgba(245,158,11,0.6)]" />
          {/* Twilight horizon warm rose wash */}
          <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-rose-950/30 to-transparent pointer-events-none" />
        </>
      )}

      {/* ================================================================== */}
      {/* 4. NIGHT PHASE: CRESCENT MOON, TWINKLING STARS & FIREFLIES        */}
      {/* ================================================================== */}
      {effectivePhase === 'NIGHT' && (
        <>
          {/* Radiant Silver Crescent Moon & Twinkling Stars */}
          <div className="absolute top-[7%] right-[10%] flex flex-col items-center">
            {/* Handcrafted Glowing Crescent Moon with Lunar Craters */}
            <div className="relative w-14 h-14 filter drop-shadow-[0_0_16px_rgba(240,249,255,0.85)]">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path
                  d="M 24 4 C 13 4 5 13 5 24 C 5 33 11 39 20 40 C 13 36 10 27 12 18 C 14 11 19 6 24 4 Z"
                  fill="#FFFDF5"
                  stroke="#E2D4B7"
                  strokeWidth="0.8"
                />
                {/* Micro lunar crater textures */}
                <circle cx="12" cy="18" r="1.4" fill="#E8DEC5" opacity="0.6" />
                <circle cx="10" cy="25" r="1.8" fill="#E8DEC5" opacity="0.6" />
                <circle cx="14" cy="30" r="1.1" fill="#E8DEC5" opacity="0.5" />
              </svg>
            </div>

            {/* Twinkling Night Stars */}
            <div className="absolute -top-4 -left-16 w-1.5 h-1.5 bg-white rounded-full opacity-85 animate-ping" />
            <div className="absolute top-8 -left-28 w-1 h-1 bg-amber-100 rounded-full opacity-75 animate-pulse" />
            <div className="absolute top-2 -right-8 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-90 animate-pulse" />
            <div className="absolute top-14 -left-10 w-1 h-1 bg-white rounded-full opacity-65" />
            <div className="absolute top-16 -left-36 w-1 h-1 bg-amber-200 rounded-full opacity-80 animate-ping" />
            <div className="absolute top-24 -left-20 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" />
          </div>

          {/* Nocturnal Fireflies (STRICTLY HIDDEN OUTSIDE NIGHT PHASE) */}
          <div className="absolute inset-0">
            {/* Firefly 1: Mid-left drifting upward */}
            <div className="absolute top-[35%] left-[16%] flex items-center justify-center animate-[fireflyOne_8s_easeInOutSine_infinite]">
              <div className="w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_#bef264,0_0_16px_#a3e635] animate-[fireflyBlink_2.8s_infinite]" />
            </div>

            {/* Firefly 2: Upper center floating slowly */}
            <div className="absolute top-[22%] left-[52%] flex items-center justify-center animate-[fireflyTwo_10s_easeInOutSine_infinite]">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047,0_0_18px_#eab308] animate-[fireflyBlink_3.4s_infinite_0.8s]" />
            </div>

            {/* Firefly 3: Right canopy dancing near the branch */}
            <div className="absolute top-[48%] left-[78%] flex items-center justify-center animate-[fireflyThree_9s_easeInOutSine_infinite]">
              <div className="w-2 h-2 rounded-full bg-lime-200 shadow-[0_0_8px_#d9f99d,0_0_14px_#84cc16] animate-[fireflyBlink_2.4s_infinite_1.6s]" />
            </div>

            {/* Firefly 4: Lower left forest floor wanderer */}
            <div className="absolute top-[72%] left-[26%] flex items-center justify-center animate-[fireflyOne_11s_easeInOutSine_infinite_2s]">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a,0_0_16px_#f59e0b] animate-[fireflyBlink_3.8s_infinite_1.2s]" />
            </div>

            {/* Firefly 5: Lower right soft glowing traveler */}
            <div className="absolute top-[65%] left-[82%] flex items-center justify-center animate-[fireflyTwo_9.5s_easeInOutSine_infinite_1.5s]">
              <div className="w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_#bef264,0_0_14px_#65a30d] animate-[fireflyBlink_3.1s_infinite_2.2s]" />
            </div>

            {/* Firefly 6: Deep wood explorer */}
            <div className="absolute top-[40%] left-[40%] flex items-center justify-center animate-[fireflyThree_10.5s_easeInOutSine_infinite_3s]">
              <div className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635,0_0_14px_#4d7c0f] animate-[fireflyBlink_2.9s_infinite_0.4s]" />
            </div>
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* 5. NATURALIST FIELD TIME TAG                                      */}
      {/* ================================================================== */}
      <div className="absolute bottom-2 left-3 flex items-center space-x-1.5 px-2 py-0.5 bg-black/50 backdrop-blur-xs rounded-full border border-white/10 text-[9px] font-mono text-parchment-dark/90">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            effectivePhase === 'DAY'
              ? 'bg-amber-400'
              : effectivePhase === 'SUNSET'
              ? 'bg-rose-400'
              : 'bg-emerald-400 animate-pulse'
          }`}
        />
        <span>
          {effectivePhase === 'DAY' ? 'Daylight' : effectivePhase === 'SUNSET' ? 'Twilight' : 'Nocturnal'}
          {timeOverride !== 'AUTO' ? ' (Dev Lock)' : ''} • {formattedTime}
        </span>
      </div>
    </div>
  );
};
