/**
 * ============================================================================
 * FIELD JOURNAL BINDER BOARD — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders the 3x3 grid as Grimble's weathered leather naturalist field notebook:
 * - Heavy stitched leather binder frame with continuous perimeter saddle stitching.
 * - Four ornate brass corner bracket plates with embossed screw rivets.
 * - Authentic deckled hand-torn paper page leaf with tea/sepia age staining.
 * - Handcrafted graphite marginalia: plate stamp, sketched arrow, taxonomy notes.
 * - Grid of 9 pinned botanical specimen cards with washi tape strips.
 */

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { QuestTileState } from '../types/game';
import { BingoTile } from './BingoTile';

interface BingoBoardProps {
  tiles: QuestTileState[];
  completedLines: number[];
  onSelectTile: (index: number) => void;
}

/**
 * Handcrafted Ornate Brass Corner Fitting with Inset Screw Rivets
 */
export const BrassCornerFitting: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position }) => {
  const positioning = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1 rotate-90',
    'bottom-right': 'bottom-1 right-1 rotate-180',
    'bottom-left': 'bottom-1 left-1 -rotate-90'
  }[position];

  return (
    <div className={`absolute ${positioning} w-7 h-7 pointer-events-none z-20`}>
      <svg viewBox="0 0 32 32" className="w-full h-full filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">
        <defs>
          <linearGradient id={`brassGrad_${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="30%" stopColor="#E5BE42" />
            <stop offset="70%" stopColor="#9C731A" />
            <stop offset="100%" stopColor="#5E430B" />
          </linearGradient>
          <radialGradient id={`rivetGrad_${position}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF7D1" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#3E2606" />
          </radialGradient>
        </defs>
        {/* L-bracket plate with antique ornamental scalloped corner */}
        <path
          d="M 2 2 L 30 2 L 30 9 C 24 9, 20 13, 20 20 L 20 30 L 9 30 C 9 24, 13 20, 2 20 Z"
          fill={`url(#brassGrad_${position})`}
          stroke="#2A1804"
          strokeWidth="1.2"
        />
        {/* Burnished interior highlight border */}
        <path
          d="M 4 4 L 28 4 L 28 8 C 22 8, 19 12, 18 19 L 18 28 L 8 28 C 8 22, 12 19, 4 19 Z"
          fill="none"
          stroke="#FFEAA0"
          strokeWidth="0.7"
          opacity="0.8"
        />
        {/* Screw rivet 1 */}
        <circle cx="24" cy="5.5" r="1.8" fill={`url(#rivetGrad_${position})`} stroke="#2E1C03" strokeWidth="0.6" />
        <line x1="22.8" y1="4.8" x2="25.2" y2="6.2" stroke="#2E1C03" strokeWidth="0.5" />
        {/* Screw rivet 2 */}
        <circle cx="5.5" cy="24" r="1.8" fill={`url(#rivetGrad_${position})`} stroke="#2E1C03" strokeWidth="0.6" />
        <line x1="4.3" y1="23.3" x2="6.7" y2="24.7" stroke="#2E1C03" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

export const BingoBoard: React.FC<BingoBoardProps> = ({
  tiles,
  completedLines,
  onSelectTile
}) => {
  return (
    <div className="relative w-full max-w-[370px] mx-auto p-3.5 journal-binder rounded-[26px] select-none animate-board-appear">
      {/* 1. Heavy Weathered Brass Corner Fittings on All 4 Corners */}
      <BrassCornerFitting position="top-left" />
      <BrassCornerFitting position="top-right" />
      <BrassCornerFitting position="bottom-left" />
      <BrassCornerFitting position="bottom-right" />

      {/* 2. Continuous Perimeter Saddle Stitching on Outer Leather Frame */}
      <div className="absolute inset-1.5 rounded-[22px] border-2 border-dashed border-[#D4AF37]/55 pointer-events-none z-10" />
      <div className="absolute inset-2.5 rounded-[18px] border border-black/25 pointer-events-none" />

      {/* 3. Authentic Deckled / Hand-Torn Paper Page Leaf Container */}
      <div className="relative deckled-paper-page rounded-xl p-2.5 shadow-md overflow-hidden">
        {/* Organic Hand-Torn Deckled Paper Border SVG Overlay */}
        <svg
          viewBox="0 0 340 370"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        >
          {/* Deckled Edge Frayed Fibers Perimeter */}
          <path
            d="M 4,4 Q 85,2 170,4 Q 255,2 336,4 Q 338,90 336,185 Q 338,280 336,366 Q 255,368 170,366 Q 85,368 4,366 Q 2,280 4,185 Q 2,90 4,4 Z"
            fill="none"
            stroke="#9E7D47"
            strokeWidth="2.5"
            strokeDasharray="4 2 2 3 5 2"
          />
        </svg>

        {/* Handwritten Field Notes Marginalia Header */}
        <div className="relative flex items-center justify-between px-1 pb-1.5 mb-1.5 border-b border-[#D8C498]/80 z-10">
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-900/80" />
            <span className="font-serif italic font-extrabold text-[10.5px] text-amber-950 tracking-tight">
              Grimble's Field Study • Pl. IV (Flora & Fauna)
            </span>
          </div>
          <span className="font-mono text-[8px] text-amber-900/70 font-bold uppercase bg-amber-200/50 px-1.5 py-0.5 rounded border border-amber-900/20">
            3×3 Grid
          </span>
        </div>

        {/* 3x3 Specimen Cards Grid (Pinned with Washi Tape) */}
        <div className="relative grid grid-cols-3 gap-2 z-10">
          {tiles.map((quest, index) => (
            <BingoTile
              key={quest.id}
              quest={quest}
              onClick={() => onSelectTile(index)}
              isWinningLine={completedLines.some(lineIdx => {
                const lines = [
                  [0, 1, 2], [3, 4, 5], [6, 7, 8],
                  [0, 3, 6], [1, 4, 7], [2, 5, 8],
                  [0, 4, 8], [2, 4, 6]
                ];
                return lines[lineIdx]?.includes(index);
              })}
            />
          ))}
        </div>

        {/* Marginalia Footer Note with Naturalist Advice */}
        <div className="relative pt-1.5 mt-1.5 flex items-center justify-between text-[8px] text-amber-900/75 border-t border-[#D8C498]/60 z-10 px-1">
          <span className="font-serif italic font-bold">
            "Disturb nothing, observe closely, record every finding."
          </span>
          <span className="font-mono text-[7.5px] text-amber-800 font-semibold tracking-tighter">
            9 Pinned Specimens
          </span>
        </div>
      </div>
    </div>
  );
};
