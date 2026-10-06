/**
 * ============================================================================
 * BINGO TILE COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Tactile parchment square on the 3x3 grid with physical 3D button bevels,
 * wax completion seals, and offline queue status indicators.
 */

import React from 'react';
import { Check, Hourglass } from 'lucide-react';
import type { QuestTileState } from '../types/game';
import { NatureIcon } from './NatureIcons';

interface BingoTileProps {
  quest: QuestTileState;
  onClick: () => void;
  isWinningLine?: boolean;
}

export const BingoTile: React.FC<BingoTileProps> = ({ quest, onClick, isWinningLine }) => {
  const isCompleted = quest.status === 'COMPLETED';
  const isQueued = quest.status === 'QUEUED';

  return (
    <button
      onClick={onClick}
      disabled={isCompleted}
      className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all select-none
        ${isCompleted
          ? 'bg-parchment-dark border-2 border-timber-light shadow-sm opacity-90'
          : 'bg-parchment border-2 border-timber shadow-bevel-timber active:translate-y-[2px] active:shadow-none'
        }
        ${isWinningLine ? 'ring-4 ring-gold animate-pulse' : ''}
      `}
    >
      {/* Top XP Badge or Queued Status */}
      <div className="w-full flex justify-between items-center text-[10px]">
        <div className="w-5 h-5 flex items-center justify-center">
          <NatureIcon name={quest.icon} size={18} />
        </div>
        {isQueued ? (
          <span className="flex items-center text-[9px] font-bold text-amber-700 bg-amber-100 rounded px-1">
            <Hourglass className="w-2.5 h-2.5 mr-0.5 animate-spin" /> Queued
          </span>
        ) : (
          <span className="font-extrabold text-timber-light text-[9px]">+{quest.xpReward} XP</span>
        )}
      </div>

      {/* Quest Title (Max 2-3 punchy words) */}
      <span className="text-center font-black text-[11px] leading-tight text-timber-dark px-0.5 line-clamp-2">
        {quest.title}
      </span>

      {/* Bottom Status Decoration */}
      <div className="w-full h-1" />

      {/* Stamped Wax Seal Overlay on Completion */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 bg-wax border-2 border-wax-dark rounded-full flex flex-col items-center justify-center shadow-bevel-wax transform -rotate-12 scale-105">
            <Check className="w-6 h-6 text-white stroke-[3]" />
            <span className="text-[7px] font-black text-white tracking-widest uppercase">FOUND</span>
          </div>
        </div>
      )}
    </button>
  );
};
