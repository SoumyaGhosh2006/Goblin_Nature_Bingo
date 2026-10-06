/**
 * ============================================================================
 * FOCUS QUEST CARD COMPONENT (MODE 2) — GOBLIN NATURE BINGO
 * ============================================================================
 * Hero view when a player selects an uncompleted quest tile.
 * Displays large sunlight-readable text, Grimble's advice, Bribe reroll,
 * a top mini-tracker, and the giant Camera Shutter button.
 */

import React from 'react';
import { ArrowLeft, Camera, Dices, Lightbulb } from 'lucide-react';
import type { QuestTileState } from '../types/game';
import { NatureIcon } from './NatureIcons';

interface FocusQuestCardProps {
  quest: QuestTileState;
  tiles: QuestTileState[];
  freeRerolls: number;
  onBack: () => void;
  onReroll: () => void;
  onTriggerCamera: () => void;
}

export const FocusQuestCard: React.FC<FocusQuestCardProps> = ({
  quest,
  tiles,
  freeRerolls,
  onBack,
  onReroll,
  onTriggerCamera
}) => {
  return (
    <div className="w-full max-w-[360px] mx-auto flex flex-col space-y-3 select-none">
      {/* Top Bar: Back Button & Compact 3x3 Mini-Tracker */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 px-3 py-1.5 bg-timber border-2 border-timber-dark rounded-xl text-xs font-bold text-parchment shadow-bevel-timber active:translate-y-[2px] active:shadow-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Board</span>
        </button>

        {/* 3x3 Mini-Tracker Matrix */}
        <div className="flex items-center bg-timber-dark p-1.5 rounded-xl border border-timber-light space-x-1">
          <div className="grid grid-cols-3 gap-1">
            {tiles.map((t, idx) => (
              <div
                key={t.id}
                className={`w-2.5 h-2.5 rounded-sm ${
                  idx === quest.index
                    ? 'bg-gold ring-1 ring-white animate-pulse'
                    : t.status === 'COMPLETED'
                    ? 'bg-action'
                    : 'bg-timber-light'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Parchment Hero Slab */}
      <div className="parchment-slab p-5 flex flex-col space-y-4">
        {/* Header Icon & Title */}
        <div className="flex items-center space-x-3 border-b-2 border-parchment-dark pb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-parchment-dark/60 rounded-xl border border-timber-light/40 shrink-0">
            <NatureIcon name={quest.icon} size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-timber-dark leading-tight">{quest.title}</h2>
            <span className="text-xs font-extrabold text-gold-dark">Reward: +{quest.xpReward} XP</span>
          </div>
        </div>

        {/* Objective Prompt */}
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-timber-light">Your Objective:</span>
          <p className="text-sm font-bold text-timber-dark leading-relaxed">
            {quest.description}
          </p>
        </div>

        {/* Grimble's Tactical Hint */}
        <div className="bg-parchment-dark/60 border border-timber-light/30 rounded-2xl p-3 flex space-x-2.5">
          <Lightbulb className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-timber italic">
            "{quest.hint}"
          </p>
        </div>

        {/* Action Controls: Bribe Reroll & Giant Camera Shutter */}
        <div className="pt-2 flex flex-col space-y-2.5">
          {/* Giant Shutter Button */}
          <button
            onClick={onTriggerCamera}
            className="w-full py-4 btn-3d-action flex items-center justify-center space-x-2 text-base shadow-bevel-green"
          >
            <Camera className="w-6 h-6 stroke-[2.5]" />
            <span className="tracking-wide">SNAP PROOF</span>
          </button>

          {/* Bribe Grimble Reroll Button */}
          <button
            onClick={onReroll}
            className="w-full py-2 bg-timber-light/20 border-2 border-timber/30 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold text-timber-dark hover:bg-timber-light/30 active:translate-y-[1px]"
          >
            <Dices className="w-4 h-4 text-timber" />
            <span>
              {freeRerolls > 0 ? 'Swap Quest (Free)' : 'Bribe Grimble (20 Acorns)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
