/**
 * ============================================================================
 * GOBLIN DIALOGUE COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Grimble the Goblin Naturalist's Field Journal Dialogue Drawer:
 * - Large, expressive 3D character bust holding up his magnifying glass
 * - Naturalist study paper note with pinned washi tape
 * - Dynamic field commentary in botanical serif lettering
 * - Voice playback trigger integrated with ElevenLabs TTS
 */

import React from 'react';
import { Volume2, Sparkles, Feather } from 'lucide-react';
import { GrimbleAvatar } from './GrimbleAvatar';
import { NatureIcon } from './NatureIcons';

interface GoblinDialogueProps {
  dialogueText: string;
  sensoryTask?: string;
  hasAudio: boolean;
  onPlayAudio?: () => void;
  onInspectGrimble?: () => void;
}

export const GoblinDialogue: React.FC<GoblinDialogueProps> = ({
  dialogueText,
  sensoryTask,
  hasAudio,
  onPlayAudio,
  onInspectGrimble
}) => {
  return (
    <div className="w-full max-w-[420px] mx-auto px-3 pb-2 pt-1 flex items-end space-x-2 z-20 select-none">
      {/* Prominent 3D Goblin Naturalist Character Mascot */}
      <div className="relative group shrink-0">
        <GrimbleAvatar
          size="lg"
          variant="bust"
          showBadge={true}
          onClick={onPlayAudio || onInspectGrimble}
          className="filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)] transform group-hover:scale-105 active:scale-95 transition-transform duration-200"
        />

        {/* Small Voice Available Indicator */}
        {hasAudio && (
          <div className="absolute -top-1.5 -left-1 bg-amber-400 text-amber-950 border border-amber-600 rounded-full p-1 shadow-md animate-bounce">
            <Volume2 className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Field Journal Study Note Slip */}
      <div className="relative flex-1 field-paper-tile rounded-2xl p-2.5 shadow-md border-2 border-[#8C6A48] mb-1">
        {/* Pinned Washi Tape Accent */}
        <div className="washi-tape-tr" />

        {/* Comic Pointer Tail */}
        <div className="absolute bottom-4 -left-2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-[#F5E8C7] border-b-6 border-b-transparent" />

        {/* Note Header Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-[#D4C49A]/70">
          <div className="flex items-center space-x-1.5">
            <Feather className="w-3 h-3 text-amber-900/80" />
            <span className="font-serif italic font-bold text-[10.5px] text-amber-950 tracking-tight">
              Grimble's Field Guide
            </span>
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
          </div>

          {/* Voice Speaker Trigger */}
          {hasAudio && onPlayAudio && (
            <button
              onClick={onPlayAudio}
              className="flex items-center space-x-1 px-2 py-0.5 bg-amber-200/60 hover:bg-amber-300/80 border border-amber-700/40 rounded-full text-amber-950 transition-colors"
              aria-label="Listen to Grimble"
            >
              <Volume2 className="w-3 h-3 text-amber-900" />
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-tight">
                Listen
              </span>
            </button>
          )}
        </div>

        {/* Dynamic Naturalist Commentary */}
        <p className="font-serif font-bold text-xs text-amber-950 leading-snug pt-1">
          "{dialogueText}"
        </p>

        {/* Sensory Grounding Bonus Task */}
        {sensoryTask && (
          <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-900 mt-1.5 bg-emerald-100/70 border border-emerald-700/30 rounded px-1.5 py-0.5 w-fit">
            <NatureIcon name="moss" size={13} className="w-3 h-3 shrink-0" />
            <span className="font-serif italic">Tactile Task: {sensoryTask}</span>
          </div>
        )}
      </div>
    </div>
  );
};
