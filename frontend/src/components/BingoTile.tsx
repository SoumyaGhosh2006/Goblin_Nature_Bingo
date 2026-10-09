/**
 * ============================================================================
 * FIELD JOURNAL SPECIMEN TILE — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders an individual 3x3 Bingo grid tile as Grimble's field notebook card:
 * - Deckled torn paper card with warm tea/sepia wash styling.
 * - Pinned craft washi tape in opposing corners securing the study slip.
 * - Prominent hand-inked botanical/wildlife specimen illustration.
 * - Hand-lettered graphite specimen index number (#01–#09).
 * - Completed state: Stamped naturalist field seal in carmine ink with checkmark.
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

  // Specimen label index formatted as #01 through #09
  const specimenIndex = String(quest.index + 1).padStart(2, '0');

  return (
    <button
      onClick={onClick}
      disabled={isCompleted}
      className={`relative w-full aspect-square field-paper-tile rounded-xl flex flex-col items-center justify-between p-1.5 transition-all select-none cursor-pointer group
        ${isCompleted
          ? 'opacity-85 filter contrast-105'
          : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-inner'
        }
        ${isWinningLine ? 'ring-3 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse' : ''}
      `}
    >
      {/* Corner Washi Tape Strips (Physical Pinning Effect) */}
      <div className="washi-tape-tl" />
      <div className="washi-tape-bottom" />

      {/* Header: Specimen Index & XP Bounty Tag */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono px-0.5 pt-0.5 z-10">
        <span className="font-bold text-amber-900/70 tracking-tighter">
          #{specimenIndex}
        </span>
        {isQueued ? (
          <span className="flex items-center text-[8px] font-bold text-amber-900 bg-amber-200/80 rounded px-1">
            <Hourglass className="w-2.5 h-2.5 mr-0.5 animate-spin" /> In Bag
          </span>
        ) : (
          <span className="font-black text-amber-800 text-[8.5px] bg-amber-100/60 px-1 rounded-xs border border-amber-800/20">
            +{quest.xpReward} XP
          </span>
        )}
      </div>

      {/* Center: Handcrafted Ink-Wash Botanical & Wildlife Sketch */}
      <div className="relative my-auto flex items-center justify-center py-0.5 transform group-hover:scale-108 transition-transform duration-200">
        <NatureIcon name={quest.icon} size={38} />
      </div>

      {/* Footer: Hand-Lettered Quest Title */}
      <span className="w-full text-center font-serif font-black text-[11px] leading-tight text-amber-950 px-0.5 line-clamp-1 pb-0.5 z-10 tracking-tight">
        {quest.title}
      </span>

      {/* ============================================================== */}
      {/* VERIFIED SPECIMEN INK STAMP OVERLAY                           */}
      {/* ============================================================== */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="relative w-14 h-14 rounded-full border-2 border-red-700/90 flex flex-col items-center justify-center transform -rotate-12 bg-red-900/15 backdrop-blur-[0.5px] shadow-sm">
            <div className="w-11 h-11 rounded-full border border-dashed border-red-700/80 flex flex-col items-center justify-center">
              <Check className="w-5 h-5 text-red-700 stroke-[3.5]" />
              <span className="text-[6.5px] font-black tracking-widest text-red-800 uppercase leading-none mt-0.5">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}
    </button>
  );
};
