/**
 * ============================================================================
 * REAL-TIME ATMOSPHERE & CELESTIAL CANOPY LAYER — GOBLIN NATURE BINGO
 * ============================================================================
 * Dynamically transforms the woodland environment based on the player's
 * real local device clock (new Date().getHours()):
 *
 * 1. Day Phase (06:00 – 17:00):
 *    - Crisp sunbeams and drifting golden pollen motes.
 * 2. Sunset / Twilight Phase (17:00 – 19:30):
 *    - Rich amber, violet, and crimson sunset wash across the canopy.
 * 3. Night Phase (19:30 – 06:00):
 *    - Deep nocturnal moonlit wash, radiant crescent moon, twinkling stars,
 *      and gently drifting, blinking firefly particles (soft yellow glowing orbs).
 *    - Fireflies strictly appear ONLY during the Night phase!
 *
 * Sits seamlessly between the living background and the active journal canvas
 * with pointer-events-none to ensure zero interaction interference.
 */

import React, { useState, useEffect } from 'react';

export type TimePhase = 'DAY' | 'SUNSET' | 'NIGHT';

export function resolveTimePhase(hour: number): TimePhase {
  if (hour >= 6 && hour < 17) return 'DAY';
  if (hour >= 17 && hour < 19.5) return 'SUNSET';
  return 'NIGHT';
}

export const RealTimeAtmosphere: React.FC = () => {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(() => new Date().getMinutes());

  // Periodically refresh device clock every 30 seconds
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 30000);

    return () => clearInterval(clockInterval);
  }, []);

  const timePhase = resolveTimePhase(currentHour + currentMinute / 60);

  // Formatted 12h clock string for subtle naturalist timestamp
  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden" aria-hidden="true">
      {/* ================================================================== */}
      {/* 1. ATMOSPHERIC COLOR WASH OVERLAY                                 */}
      {/* ================================================================== */}
      {timePhase === 'DAY' && (
        /* Day: Crisp sunbeam wash with soft golden warmth */
        <div className="absolute inset-0 bg-amber-500/5 mix-blend-soft-light" />
      )}

      {timePhase === 'SUNSET' && (
        /* Sunset: Deep amber to violet twilight gradient */
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/25 via-rose-900/30 to-purple-950/45 mix-blend-multiply" />
      )}

      {timePhase === 'NIGHT' && (
        /* Night: Deep nocturnal indigo wash with silver moonlight glow */
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-indigo-950/50 to-emerald-950/40 mix-blend-multiply" />
      )}

      {/* ================================================================== */}
      {/* 2. CELESTIAL BODIES (SUN / MOON / STARS)                          */}
      {/* ================================================================== */}
      {timePhase === 'DAY' && (
        /* Subtle golden sun flare in top-right canopy */
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-radial from-amber-200/40 via-yellow-400/15 to-transparent blur-xl" />
      )}

      {timePhase === 'SUNSET' && (
        /* Setting amber sun orb dipping near the treetops */
        <div className="absolute top-[12%] right-[10%] w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-200 opacity-75 blur-[2px] shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
      )}

      {timePhase === 'NIGHT' && (
        /* Radiant Silver Crescent Moon & Twinkling Stars */
        <div className="absolute top-[8%] right-[12%] flex flex-col items-center">
          {/* Handcrafted Glowing Crescent Moon */}
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 40 40" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(240,249,255,0.7)]">
              <path
                d="M 24 4 C 13 4 5 13 5 24 C 5 33 11 39 20 40 C 13 36 10 27 12 18 C 14 11 19 6 24 4 Z"
                fill="#FAF2DC"
                stroke="#D4C49A"
                strokeWidth="0.8"
              />
            </svg>
          </div>

          {/* Twinkling Night Stars */}
          <div className="absolute -top-4 -left-16 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-ping" />
          <div className="absolute top-8 -left-28 w-1 h-1 bg-amber-100 rounded-full opacity-70 animate-pulse" />
          <div className="absolute top-2 -right-8 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-85 animate-pulse" />
          <div className="absolute top-14 -left-10 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-16 -left-36 w-1 h-1 bg-amber-200 rounded-full opacity-75 animate-ping" />
        </div>
      )}

      {/* ================================================================== */}
      {/* 3. FIREFLIES (STRICTLY NIGHT PHASE ONLY)                          */}
      {/* ================================================================== */}
      {timePhase === 'NIGHT' && (
        <div className="absolute inset-0">
          {/* Firefly 1: Mid-left drifting upward */}
          <div className="absolute top-[35%] left-[18%] flex items-center justify-center animate-[fireflyOne_8s_easeInOutSine_infinite]">
            <div className="w-2 h-2 rounded-full bg-lime-300 shadow-[0_0_8px_#bef264,0_0_14px_#a3e635] animate-[fireflyBlink_2.8s_infinite]" />
          </div>

          {/* Firefly 2: Upper center floating slowly */}
          <div className="absolute top-[22%] left-[54%] flex items-center justify-center animate-[fireflyTwo_10s_easeInOutSine_infinite]">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_#fde047,0_0_16px_#eab308] animate-[fireflyBlink_3.4s_infinite_0.8s]" />
          </div>

          {/* Firefly 3: Right canopy dancing near the branch */}
          <div className="absolute top-[48%] left-[78%] flex items-center justify-center animate-[fireflyThree_9s_easeInOutSine_infinite]">
            <div className="w-2 h-2 rounded-full bg-lime-200 shadow-[0_0_8px_#d9f99d,0_0_12px_#84cc16] animate-[fireflyBlink_2.4s_infinite_1.6s]" />
          </div>

          {/* Firefly 4: Lower left forest floor wanderer */}
          <div className="absolute top-[72%] left-[26%] flex items-center justify-center animate-[fireflyOne_11s_easeInOutSine_infinite_2s]">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde68a,0_0_14px_#f59e0b] animate-[fireflyBlink_3.8s_infinite_1.2s]" />
          </div>

          {/* Firefly 5: Lower right soft glowing traveler */}
          <div className="absolute top-[65%] left-[82%] flex items-center justify-center animate-[fireflyTwo_9.5s_easeInOutSine_infinite_1.5s]">
            <div className="w-2 h-2 rounded-full bg-lime-300 shadow-[0_0_8px_#bef264,0_0_12px_#65a30d] animate-[fireflyBlink_3.1s_infinite_2.2s]" />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 4. NATURALIST FIELD TIME TAG                                      */}
      {/* ================================================================== */}
      <div className="absolute bottom-2 left-3 flex items-center space-x-1.5 px-2 py-0.5 bg-black/40 backdrop-blur-xs rounded-full border border-white/10 text-[9px] font-mono text-parchment-dark/80">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            timePhase === 'DAY'
              ? 'bg-amber-400'
              : timePhase === 'SUNSET'
              ? 'bg-rose-400'
              : 'bg-emerald-400 animate-pulse'
          }`}
        />
        <span>
          {timePhase === 'DAY' ? 'Daylight' : timePhase === 'SUNSET' ? 'Twilight' : 'Nocturnal'} • {formattedTime}
        </span>
      </div>
    </div>
  );
};
