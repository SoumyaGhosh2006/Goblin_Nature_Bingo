/**
 * ============================================================================
 * GOBLIN DIALOGUE COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Features Grimble the Goblin Naturalist Dungeon Master prominently:
 * - Large, expressive 3D character bust holding up his magnifying glass
 * - Comic-style parchment speech bubble with tactile borders and drop shadow
 * - Voice playback trigger integrated with ElevenLabs TTS Callum engine
 * - Sensory grounding mindfulness bonus challenge display
 */

import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
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

        {/* Small "Tap to Listen" Tooltip Hint */}
        {hasAudio && (
          <div className="absolute -top-1.5 -left-1 bg-gold text-timber-dark border border-gold-dark rounded-full p-1 shadow-bevel-gold animate-bounce">
            <Volume2 className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Speech Bubble Parchment Box with Beveled Border */}
      <div className="relative flex-1 bg-parchment border-2 border-timber-light rounded-2xl p-2.5 shadow-parchment-slab mb-1">
        {/* Comic Bubble Pointer pointing left toward Grimble */}
        <div className="absolute bottom-4 -left-2 w-0 h-0 border-t-6 border-t-transparent border-r-8 border-r-parchment border-b-6 border-b-transparent" />

        {/* Bubble Header Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-parchment-dark/60">
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
              Grimble the Naturalist
            </span>
            <Sparkles className="w-2.5 h-2.5 text-gold-dark" />
          </div>

          {/* Voice Speaker Trigger */}
          {hasAudio && onPlayAudio && (
            <button
              onClick={onPlayAudio}
              className="flex items-center space-x-1 px-1.5 py-0.5 bg-gold/30 hover:bg-gold/60 border border-gold-dark/40 rounded-full text-timber-dark transition-colors"
              aria-label="Listen to Grimble"
            >
              <Volume2 className="w-3 h-3 text-amber-900" />
              <span className="text-[9px] font-black uppercase tracking-tight text-amber-950">
                Voice
              </span>
            </button>
          )}
        </div>

        {/* Dynamic Commentary Text */}
        <p className="text-xs font-bold text-timber-dark leading-snug pt-1">
          "{dialogueText}"
        </p>

        {/* Sensory Grounding Bonus Micro-Challenge */}
        {sensoryTask && (
          <div className="flex items-center space-x-1 text-[10px] font-extrabold text-action-dark mt-1.5 bg-action/15 border border-action/30 rounded px-1.5 py-0.5 w-fit">
            <NatureIcon name="sprout" size={12} className="w-3 h-3 shrink-0" />
            <span>Task: {sensoryTask}</span>
          </div>
        )}
      </div>
    </div>
  );
};
