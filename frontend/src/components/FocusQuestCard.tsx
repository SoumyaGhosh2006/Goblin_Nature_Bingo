/**
 * ============================================================================
 * FOCUS QUEST CARD COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Grimble's Specimen Field Study Sheet (Mode 2 focus view):
 * - Handcrafted botanical ink-wash sketch in a naturalist study frame.
 * - Pinned craft washi tape and deckled paper styling.
 * - Species taxonomy details and Grimble's field advice.
 * - Giant "SNAP SPECIMEN PROOF" camera shutter button.
 */

import React from 'react';
import { ArrowLeft, Camera, Dices, Lightbulb, Search } from 'lucide-react';
import type { QuestTileState } from '../types/game';
import { NatureIcon } from './NatureIcons';
import { audioManager } from '../services/audioManager';

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
  const handleBack = () => {
    audioManager.playSfx('toggle_click');
    onBack();
  };

  const handleCamera = () => {
    audioManager.playSfx('toggle_click');
    onTriggerCamera();
  };

  return (
    <div className="w-full max-w-[370px] mx-auto flex flex-col space-y-3 select-none">
      {/* Top Bar: Return to Binder & Mini 3x3 Specimen Matrix */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 px-3 py-1.5 bg-[#4A2E18] border-2 border-[#2A1708] rounded-xl text-xs font-bold text-parchment shadow-md active:translate-y-[1px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Field Binder</span>
        </button>

        {/* 3x3 Mini-Tracker Matrix */}
        <div className="flex items-center bg-[#2A1708] p-1.5 rounded-xl border border-amber-900/60 space-x-1">
          <div className="grid grid-cols-3 gap-1">
            {tiles.map((t, idx) => (
              <div
                key={t.id}
                className={`w-2.5 h-2.5 rounded-xs ${
                  idx === quest.index
                    ? 'bg-amber-400 ring-1 ring-white animate-pulse'
                    : t.status === 'COMPLETED'
                    ? 'bg-emerald-500'
                    : 'bg-amber-950'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Specimen Field Study Page */}
      <div className="relative field-paper-tile rounded-2xl p-4 shadow-xl border-2 border-[#8C6A48] flex flex-col space-y-3">
        {/* Pinned Washi Tape Header */}
        <div className="washi-tape-tr" />
        <div className="washi-tape-tl" />

        {/* Specimen Header & Botanical Illustration Showcase */}
        <div className="flex items-center space-x-3 border-b border-[#D4C49A] pb-3 pt-1">
          <div className="w-16 h-16 flex items-center justify-center bg-[#FAF2DC] rounded-xl border-2 border-[#B89B72] shadow-inner shrink-0 p-1">
            <NatureIcon name={quest.icon} title={quest.title} size={50} />
          </div>
          <div>
            <div className="flex items-center space-x-1 text-amber-900/70 text-[10px] font-mono">
              <Search className="w-3 h-3 text-amber-700" />
              <span>Specimen Study #{String(quest.index + 1).padStart(2, '0')}</span>
            </div>
            <h2 className="text-lg font-serif font-black text-amber-950 leading-tight">
              {quest.title}
            </h2>
            <span className="text-xs font-extrabold text-amber-800">
              Field XP Reward: +{quest.xpReward} XP
            </span>
          </div>
        </div>

        {/* Objective Prompt */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/80">
            Field Objective:
          </span>
          <p className="text-xs font-serif font-bold text-amber-950 leading-relaxed bg-[#FAF2DC]/80 p-2.5 rounded-xl border border-[#D4C49A]/60">
            {quest.description}
          </p>
        </div>

        {/* Grimble's Tactical Naturalist Advice */}
        <div className="bg-amber-100/50 border border-amber-800/30 rounded-xl p-2.5 flex space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <p className="text-[11px] font-serif italic text-amber-900">
            "{quest.hint}"
          </p>
        </div>

        {/* Shutter Camera & Reroll Action Controls */}
        <div className="pt-1 flex flex-col space-y-2">
          {/* Snap Specimen Proof Shutter Button */}
          <button
            onClick={handleCamera}
            className="w-full py-3.5 btn-3d-action flex items-center justify-center space-x-2 text-sm shadow-bevel-green"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span className="tracking-wide uppercase font-black">Snap Specimen Proof</span>
          </button>

          {/* Swap Quest Option */}
          <button
            onClick={onReroll}
            className="w-full py-2 bg-amber-900/10 border border-amber-900/30 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold text-amber-950 hover:bg-amber-900/20 active:translate-y-[1px]"
          >
            <Dices className="w-3.5 h-3.5 text-amber-900" />
            <span>
              {freeRerolls > 0 ? 'Swap Specimen (Free)' : 'Consult Grimble (20 Acorns)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
