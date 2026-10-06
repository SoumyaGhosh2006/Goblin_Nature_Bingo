/**
 * ============================================================================
 * LIVING FOREST CANVAS & WILDLIFE BACKGROUND — GOBLIN NATURE BINGO
 * ============================================================================
 * Provides an atmospheric, animated woodland park environment behind cards:
 * 1. Gnarled Oak Branch: Heavy timber branch extending from top-left with moss tufts.
 * 2. Animated Bumblebees: Two vector bees flying along continuous fluid Lissajous paths.
 * 3. Dappled Sunlight Motes: Gentle glowing pollen particles drifting in woodland breeze.
 * Strictly configured with pointer-events-none to prevent touch or click interference.
 */

import React from 'react';

export const LivingForestBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 
        * =====================================================================
        * GNARLED OAK TREE BRANCH (TOP-LEFT CORNER CANOPY)
        * =====================================================================
        * Thick textured limb providing natural canopy depth and perch anchor.
        */}
      <svg
        className="absolute -top-2 -left-2 w-[320px] h-[140px] opacity-95 drop-shadow-lg"
        viewBox="0 0 320 140"
        fill="none"
      >
        {/* Main trunk root anchor coming from upper left */}
        <path
          d="M-20 -10 C30 20, 100 45, 180 40 C230 37, 280 25, 310 15 C280 35, 220 52, 170 54 C100 58, 20 45, -20 25 Z"
          fill="#4A2E18"
          stroke="#2A1708"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Secondary lower knot & bark ridges */}
        <path
          d="M60 42 C90 60, 130 65, 160 55 C125 58, 90 54, 60 42 Z"
          fill="#6A4325"
        />
        <path
          d="M120 48 C145 75, 175 85, 205 82 C180 80, 155 70, 135 52 Z"
          fill="#4A2E18"
          stroke="#2A1708"
          strokeWidth="1.5"
        />

        {/* Bark wood grain lines */}
        <path d="M20 12 C70 30, 140 46, 210 38" stroke="#2A1708" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M40 22 C90 38, 160 50, 240 32" stroke="#6A4325" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M10 2 C50 18, 120 35, 180 32" stroke="#DFCE9F" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />

        {/* Moss Cushions on top of the branch */}
        <path
          d="M70 28 C85 24, 105 24, 120 29 C110 27, 85 27, 70 28 Z"
          fill="#7DA333"
          stroke="#4C651E"
          strokeWidth="1.5"
        />
        <path
          d="M150 36 C165 32, 185 33, 195 38 C185 35, 165 35, 150 36 Z"
          fill="#94BA45"
          stroke="#4C651E"
          strokeWidth="1.5"
        />

        {/* Leaf Tufts hanging from sub-branches */}
        <g transform="translate(190, 75) rotate(25)">
          <path d="M0 0 C10 -8, 22 -6, 26 2 C22 10, 10 12, 0 0 Z" fill="#58CC02" stroke="#2F7E00" strokeWidth="1" />
          <path d="M0 0 L18 0" stroke="#2F7E00" strokeWidth="0.8" />
        </g>
        <g transform="translate(145, 68) rotate(40)">
          <path d="M0 0 C8 -6, 18 -4, 20 4 C16 10, 8 10, 0 0 Z" fill="#6FDE18" stroke="#2F7E00" strokeWidth="1" />
        </g>
        <g transform="translate(260, 22) rotate(-15)">
          <path d="M0 0 C12 -6, 22 -3, 24 5 C18 11, 8 9, 0 0 Z" fill="#58CC02" stroke="#2F7E00" strokeWidth="1" />
        </g>
      </svg>

      {/* 
        * =====================================================================
        * ANIMATED WILDLIFE: BUMBLEBEE 1 (UPPER-MID FLIGHT PATTERN)
        * =====================================================================
        * Follows smooth CSS bezier path with rapid wing flutter.
        */}
      <div className="absolute top-[18%] left-[10%] w-7 h-7 animate-[beeFlightOne_18s_easeInOutSine_infinite]">
        <svg viewBox="0 0 28 28" className="w-full h-full drop-shadow-sm overflow-visible">
          {/* Fluttering translucent wings */}
          <ellipse
            cx="11"
            cy="7"
            rx="5"
            ry="2.5"
            fill="#FAF2DC"
            opacity="0.8"
            stroke="#DFCE9F"
            strokeWidth="0.6"
            className="origin-[13px_11px] animate-[wingFlutter_0.09s_linear_infinite]"
          />
          <ellipse
            cx="17"
            cy="7"
            rx="5"
            ry="2.5"
            fill="#FAF2DC"
            opacity="0.8"
            stroke="#DFCE9F"
            strokeWidth="0.6"
            className="origin-[15px_11px] animate-[wingFlutter_0.09s_linear_infinite_0.04s]"
          />
          {/* Bee striped body */}
          <ellipse cx="14" cy="14" rx="6" ry="4.5" fill="#FDB813" stroke="#2A1708" strokeWidth="1" />
          {/* Dark stripes */}
          <path d="M12 10.5V17.5M15 10.2V17.8" stroke="#2A1708" strokeWidth="1.8" />
          {/* Stinger */}
          <path d="M7 14L5 14" stroke="#2A1708" strokeWidth="1.2" strokeLinecap="round" />
          {/* Head & tiny antenna */}
          <circle cx="19" cy="14" r="2.5" fill="#4A2E18" />
          <path d="M20 12L22 9.5M21 15L23 16.5" stroke="#2A1708" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 
        * =====================================================================
        * ANIMATED WILDLIFE: BUMBLEBEE 2 (LOWER CANOPY FLIGHT PATTERN)
        * =====================================================================
        * Drifts lower across the canvas on an alternating 24s loop.
        */}
      <div className="absolute top-[62%] right-[12%] w-6 h-6 animate-[beeFlightTwo_24s_easeInOutSine_infinite]">
        <svg viewBox="0 0 28 28" className="w-full h-full drop-shadow-sm overflow-visible">
          <ellipse
            cx="11"
            cy="7"
            rx="4.5"
            ry="2.2"
            fill="#FAF2DC"
            opacity="0.8"
            stroke="#DFCE9F"
            strokeWidth="0.6"
            className="origin-[13px_11px] animate-[wingFlutter_0.08s_linear_infinite]"
          />
          <ellipse
            cx="17"
            cy="7"
            rx="4.5"
            ry="2.2"
            fill="#FAF2DC"
            opacity="0.8"
            stroke="#DFCE9F"
            strokeWidth="0.6"
            className="origin-[15px_11px] animate-[wingFlutter_0.08s_linear_infinite_0.04s]"
          />
          <ellipse cx="14" cy="14" rx="5.5" ry="4" fill="#FDB813" stroke="#2A1708" strokeWidth="1" />
          <path d="M12 11V17M15 10.8V17.2" stroke="#2A1708" strokeWidth="1.6" />
          <path d="M7.5 14L6 14" stroke="#2A1708" strokeWidth="1" strokeLinecap="round" />
          <circle cx="18.5" cy="14" r="2.2" fill="#4A2E18" />
          <path d="M19.5 12.5L21.5 10M20 15L22 16" stroke="#2A1708" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* 
        * =====================================================================
        * DAPPLED SUNLIGHT & POLLEN PARTICLES
        * =====================================================================
        * Drifting upward luminous motes catching the forest canopy sunlight.
        */}
      <div className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-gold-light/40 blur-[1px] animate-[moteDrift_12s_linear_infinite]" />
      <div className="absolute top-[45%] right-[25%] w-2.5 h-2.5 rounded-full bg-gold-light/35 blur-[1px] animate-[moteDrift_16s_linear_infinite_3s]" />
      <div className="absolute top-[70%] left-[35%] w-1.5 h-1.5 rounded-full bg-gold-light/50 blur-[0.5px] animate-[moteDrift_14s_linear_infinite_7s]" />
      <div className="absolute top-[35%] right-[15%] w-2 h-2 rounded-full bg-action-light/30 blur-[1px] animate-[moteDrift_18s_linear_infinite_5s]" />
    </div>
  );
};
