/**
 * ============================================================================
 * ROAMING BUMBLEBEE COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders large, adorable cartoon bumblebees that roam smoothly and randomly
 * across the entire app canvas (matching the user's reference design).
 * Features rapid wing-fluttering, natural flight bank/tilt angles, and dynamic
 * direction flipping (scaleX). Operates completely silently without audio.
 */

import React, { useState, useEffect } from 'react';

interface BeeState {
  x: number;            // Horizontal position percentage (8% to 82%)
  y: number;            // Vertical position percentage (10% to 82%)
  facingRight: boolean; // Flips sprite orientation towards destination
  tilt: number;         // Bank angle while traveling through air
  duration: number;     // Smooth flight interpolation duration (seconds)
}

interface RoamingBeeProps {
  soundEnabled?: boolean;
}

export const RoamingBee: React.FC<RoamingBeeProps> = () => {
  // Primary big cartoon bumblebee state
  const [bee, setBee] = useState<BeeState>({
    x: 65,
    y: 18,
    facingRight: false,
    tilt: -5,
    duration: 4.5
  });

  // Companion mini bumblebee state roaming independently
  const [companionBee, setCompanionBee] = useState<BeeState>({
    x: 20,
    y: 35,
    facingRight: true,
    tilt: 8,
    duration: 5.2
  });

  // Calculate random wandering waypoints across the screen (silent animation)
  useEffect(() => {
    const movePrimaryBee = () => {
      setBee(prev => {
        const nextX = Math.floor(8 + Math.random() * 74);
        const nextY = Math.floor(10 + Math.random() * 72);
        const facingRight = nextX > prev.x;
        const tilt = (nextY - prev.y) * 0.35;
        const duration = 3.5 + Math.random() * 2.5;

        return { x: nextX, y: nextY, facingRight, tilt, duration };
      });
    };

    const moveCompanion = () => {
      setCompanionBee(prev => {
        const nextX = Math.floor(12 + Math.random() * 68);
        const nextY = Math.floor(18 + Math.random() * 65);
        const facingRight = nextX > prev.x;
        const tilt = (nextY - prev.y) * 0.3;
        const duration = 4.0 + Math.random() * 2.5;

        return { x: nextX, y: nextY, facingRight, tilt, duration };
      });
    };

    const intervalOne = setInterval(movePrimaryBee, 4600);
    const intervalTwo = setInterval(moveCompanion, 5400);

    return () => {
      clearInterval(intervalOne);
      clearInterval(intervalTwo);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-40 overflow-hidden" aria-hidden="true">
      {/* 
        * =====================================================================
        * PRIMARY LARGE CARTOON BUMBLEBEE (ROAMING WHOLE CANVAS)
        * =====================================================================
        */}
      <div
        className="absolute w-[76px] h-[68px] drop-shadow-lg will-change-transform"
        style={{
          left: `${bee.x}%`,
          top: `${bee.y}%`,
          transform: `translate(-50%, -50%) rotate(${bee.tilt}deg) scaleX(${bee.facingRight ? -1 : 1})`,
          transition: `left ${bee.duration}s cubic-bezier(0.4, 0, 0.2, 1), top ${bee.duration}s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s ease-out`
        }}
      >
        <div className="w-full h-full animate-[hoverBob_2.2s_easeInOutSine_infinite]">
          <svg viewBox="0 0 80 72" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="beeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FED053" />
                <stop offset="100%" stopColor="#FDB813" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D9EEF8" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Fluttering Top Wing Pair */}
            <g className="origin-[38px_24px] animate-[wingFlutter_0.08s_linear_infinite]">
              <ellipse
                cx="44"
                cy="14"
                rx="14"
                ry="9"
                fill="url(#wingGrad)"
                stroke="#BCE0F3"
                strokeWidth="1.2"
                transform="rotate(-18 44 14)"
              />
              <ellipse
                cx="54"
                cy="17"
                rx="11"
                ry="7"
                fill="url(#wingGrad)"
                stroke="#BCE0F3"
                strokeWidth="1"
                transform="rotate(-8 54 17)"
              />
              <path d="M38 18 Q 45 13, 52 14" stroke="#A2D2EC" strokeWidth="0.8" fill="none" opacity="0.7" />
            </g>

            {/* Rear Stinger */}
            <path d="M12 38 L4 40 L12 42 Z" fill="#2A1708" />

            {/* Plump Golden Bee Body */}
            <ellipse
              cx="36"
              cy="40"
              rx="26"
              ry="20"
              fill="url(#beeGoldGrad)"
              stroke="#2A1708"
              strokeWidth="2.2"
            />

            {/* Velvet Dark Brown Stripes */}
            <path d="M22 23 C26 34, 26 46, 22 57" stroke="#2A1708" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M34 20 C38 33, 38 47, 34 60" stroke="#2A1708" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Curly Black Antennae */}
            <path d="M48 24 Q 52 14, 58 12 Q 62 10, 60 14" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="13" r="2.2" fill="#2A1708" />

            <path d="M54 26 Q 60 16, 66 16 Q 70 16, 68 20" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="19" r="2.2" fill="#2A1708" />

            {/* Rosy Blush Cheek */}
            <ellipse cx="56" cy="45" rx="5" ry="3.5" fill="#FF8B8B" opacity="0.85" />

            {/* Big Shiny Cartoon Eye with Catchlights */}
            <circle cx="51" cy="35" r="4.8" fill="#1C160C" />
            <circle cx="52.8" cy="33.2" r="1.8" fill="#FFFFFF" />
            <circle cx="49.8" cy="36.5" r="0.9" fill="#FFFFFF" />

            {/* Sweet Cheerful Smile */}
            <path d="M55 42 Q 59 47, 63 43" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Tucked Under-Legs */}
            <path d="M28 58 Q 29 64, 33 65" stroke="#2A1708" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M40 58 Q 41 64, 45 65" stroke="#2A1708" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* 
        * =====================================================================
        * COMPANION CUTE MINI BUMBLEBEE (ORBITING INDEPENDENTLY)
        * =====================================================================
        */}
      <div
        className="absolute w-[44px] h-[39px] drop-shadow-md will-change-transform opacity-90"
        style={{
          left: `${companionBee.x}%`,
          top: `${companionBee.y}%`,
          transform: `translate(-50%, -50%) rotate(${companionBee.tilt}deg) scaleX(${companionBee.facingRight ? -1 : 1})`,
          transition: `left ${companionBee.duration}s cubic-bezier(0.35, 0, 0.25, 1), top ${companionBee.duration}s cubic-bezier(0.35, 0, 0.25, 1), transform 0.5s ease-out`
        }}
      >
        <div className="w-full h-full animate-[hoverBob_1.8s_easeInOutSine_infinite]">
          <svg viewBox="0 0 80 72" className="w-full h-full overflow-visible">
            <g className="origin-[38px_24px] animate-[wingFlutter_0.07s_linear_infinite]">
              <ellipse cx="44" cy="14" rx="14" ry="9" fill="#E8F4FA" stroke="#BCE0F3" strokeWidth="1.2" transform="rotate(-18 44 14)" />
              <ellipse cx="54" cy="17" rx="11" ry="7" fill="#E8F4FA" stroke="#BCE0F3" strokeWidth="1" transform="rotate(-8 54 17)" />
            </g>
            <path d="M12 38 L4 40 L12 42 Z" fill="#2A1708" />
            <ellipse cx="36" cy="40" rx="26" ry="20" fill="#FDB813" stroke="#2A1708" strokeWidth="2.5" />
            <path d="M22 23 C26 34, 26 46, 22 57" stroke="#2A1708" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M34 20 C38 33, 38 47, 34 60" stroke="#2A1708" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M50 24 Q 56 14, 62 14" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="62" cy="14" r="2.2" fill="#2A1708" />
            <ellipse cx="56" cy="45" rx="5" ry="3.5" fill="#FF8B8B" />
            <circle cx="51" cy="35" r="4.8" fill="#1C160C" />
            <circle cx="53" cy="33" r="1.8" fill="#FFFFFF" />
            <path d="M55 42 Q 59 47, 63 43" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
