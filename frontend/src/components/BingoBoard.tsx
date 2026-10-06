/**
 * ============================================================================
 * BINGO BOARD COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders the 3x3 parchment board slate framed by carved timber brackets.
 * Maintains non-congested touch targets (min 48px) and sunlight-readable contrast.
 */

import React from 'react';
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
    <div className="relative w-full max-w-[360px] mx-auto p-3.5 bg-timber border-4 border-timber-dark rounded-3xl shadow-2xl select-none">
      {/* Golden Corner Decorative Rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-gold rounded-full border border-gold-dark shadow-sm" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border border-gold-dark shadow-sm" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-gold rounded-full border border-gold-dark shadow-sm" />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-gold rounded-full border border-gold-dark shadow-sm" />

      {/* Parchment Grid Interior */}
      <div className="bg-parchment-light border-2 border-parchment-dark rounded-2xl p-2.5 shadow-inner">
        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map((quest, index) => (
            <BingoTile
              key={quest.id}
              quest={quest}
              onClick={() => onSelectTile(index)}
              isWinningLine={completedLines.some(lineIdx => {
                // Check if this tile index belongs to any completed line
                const lines = [
                  [0,1,2],[3,4,5],[6,7,8],
                  [0,3,6],[1,4,7],[2,5,8],
                  [0,4,8],[2,4,6]
                ];
                return lines[lineIdx]?.includes(index);
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
