/**
 * ============================================================================
 * BOARD LOADING SPINNER & SPIRAL — GOBLIN NATURE BINGO
 * ============================================================================
 * Displayed when the user clicks "Generate New Board":
 * - The previous board disappears completely from the screen.
 * - This component renders in the board's screen area with a loading circle & spiral.
 * - Features concentric spinning circular tracks, an intricate golden botanical spiral,
 *   a pulsing naturalist compass core, and field scouting status indicators.
 * - Once generation completes, this loader disappears and the new board appears.
 */

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { BrassCornerFitting } from './BingoBoard';

export const BoardLoadingSpinner: React.FC = () => {
  return (
    <div className="relative w-full max-w-[370px] h-[420px] mx-auto p-3.5 journal-binder rounded-[26px] select-none flex flex-col items-center justify-center overflow-hidden shadow-2xl">
      {/* 1. Heavy Weathered Brass Corner Fittings on All 4 Corners */}
      <BrassCornerFitting position="top-left" />
      <BrassCornerFitting position="top-right" />
      <BrassCornerFitting position="bottom-left" />
      <BrassCornerFitting position="bottom-right" />

      {/* 2. Continuous Perimeter Saddle Stitching on Outer Leather Frame */}
      <div className="absolute inset-1.5 rounded-[22px] border-2 border-dashed border-[#D4AF37]/55 pointer-events-none z-10" />
      <div className="absolute inset-2.5 rounded-[18px] border border-black/25 pointer-events-none" />

      {/* 3. Inner Parchment Field Area Leaf */}
      <div className="relative w-full h-full deckled-paper-page rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
        {/* Soft radial background glow */}
        <div className="absolute w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none animate-pulse" />

        {/* ================================================================ */}
        {/* DUAL LOADING CIRCLE & SPIRAL ANIMATION                            */}
        {/* ================================================================ */}
        <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
          {/* A. Outer Circular Dashed Orbit (Spinning Clockwise) */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_4.5s_linear_infinite]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeDasharray="8 6 4 6"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>

          {/* B. Middle Glowing Loading Circle Track (Smooth Clockwise Arc) */}
          <svg className="absolute inset-1 w-[104px] h-[104px] animate-[spin_1.5s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="loadArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FED053" stopOpacity="1" />
                <stop offset="60%" stopColor="#58CC02" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#2F7E00" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="url(#loadArcGrad)"
              strokeWidth="3.5"
              strokeDasharray="95 140"
              strokeLinecap="round"
            />
          </svg>

          {/* C. Inner Counter-Rotating Botanical Loading Spiral */}
          <svg className="absolute inset-2 w-[96px] h-[96px] animate-[spinCounterClockwise_3.2s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5BE42" />
                <stop offset="50%" stopColor="#B87B00" />
                <stop offset="100%" stopColor="#4A2E18" />
              </linearGradient>
            </defs>
            {/* Elegant Fibonacci Nautilus Spiral Path */}
            <path
              d="M 50,50 
                 A 4,4 0 0,1 54,50 
                 A 8,8 0 0,1 46,50 
                 A 14,14 0 0,1 60,50 
                 A 20,20 0 0,1 40,50 
                 A 28,28 0 0,1 68,50 
                 A 36,36 0 0,1 32,50"
              fill="none"
              stroke="url(#spiralGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>

          {/* D. Center Naturalist Core Indicator */}
          <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-2 border-amber-900 shadow-md flex items-center justify-center animate-pulse">
            <Compass className="w-5 h-5 text-amber-950 animate-[spin_7s_linear_infinite]" />
          </div>

          {/* E. Floating ambient sparkle bits */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 animate-bounce" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-lime-500/80 blur-[0.5px] animate-pulse" />
        </div>

        {/* Loading Titles & Subtitle */}
        <div className="space-y-1 max-w-[270px] z-10">
          <h3 className="font-serif italic font-extrabold text-[15px] text-amber-950 tracking-tight flex items-center justify-center space-x-1">
            <span>Cataloging Fresh Board</span>
            <span className="inline-flex space-x-0.5 text-amber-800">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </h3>
          <p className="font-serif italic text-xs text-amber-900/80 leading-snug">
            Grimble is foraging the Indian undergrowth for 9 untamed botanical specimens.
          </p>
        </div>

        {/* Marginalia footer note */}
        <div className="mt-4 px-3 py-1 rounded-full bg-amber-900/10 border border-amber-900/20 text-[9px] font-mono font-bold text-amber-950 tracking-wider uppercase">
          ✦ Naturalist Field Study • In Progress ✦
        </div>
      </div>
    </div>
  );
};
