/**
 * ============================================================================
 * FIELD JOURNAL BINDER BOARD — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders the 3x3 grid as Grimble's weathered leather naturalist field notebook:
 * - Stitched leather binder borders with brass corner brackets.
 * - Deckled, tea-stained journal page with handwritten graphite marginalia.
 * - Grid of pinned botanical specimen cards with washi tape strips.
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

export const BingoBoard: React.FC<BingoBoardProps> = ({
  tiles,
  completedLines,
  onSelectTile
}) => {
  return (
    <div className="relative w-full max-w-[370px] mx-auto p-3.5 journal-binder rounded-3xl select-none">
      {/* Weathered Brass Corner Brackets */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-500/80 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-500/80 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-500/80 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-500/80 rounded-br-sm pointer-events-none" />

      {/* Hand-Stitched Leather Seam Accents */}
      <div className="absolute inset-x-5 top-1.5 border-t border-dashed border-amber-900/40 pointer-events-none" />
      <div className="absolute inset-x-5 bottom-1.5 border-b border-dashed border-amber-900/40 pointer-events-none" />

      {/* Deckled Journal Paper Leaf Interior */}
      <div className="relative bg-[#FAF2DC] border-2 border-[#D4C49A] rounded-2xl p-2.5 shadow-inner">
        {/* Handwritten Field Notes Header */}
        <div className="flex items-center justify-between px-1 pb-1.5 mb-1 border-b border-[#E2D5B4]">
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-3 h-3 text-amber-900/70" />
            <span className="font-serif italic font-bold text-[10px] text-amber-950 tracking-tight">
              Grimble's Field Study • Plate IV
            </span>
          </div>
          <span className="font-mono text-[8px] text-amber-900/60 font-semibold uppercase">
            3×3 Grid
          </span>
        </div>

        {/* 3x3 Specimen Cards Grid */}
        <div className="grid grid-cols-3 gap-2">
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

        {/* Marginalia Footer Note */}
        <div className="pt-1.5 mt-1 text-center font-serif italic text-[8.5px] text-amber-900/70">
          "Observe closely, disturb nothing, preserve every finding."
        </div>
      </div>
    </div>
  );
};
