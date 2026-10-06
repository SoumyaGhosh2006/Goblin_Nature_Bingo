/**
 * ============================================================================
 * GOBLIN DIALOGUE COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Grimble the Goblin's comic-style parchment speech bubble and avatar.
 * Occupies ~18% of mobile screen height at the bottom of the viewport.
 */

import React from 'react';
import { Volume2 } from 'lucide-react';
import { GrimbleAvatar } from './GrimbleAvatar';
import { NatureIcon } from './NatureIcons';

interface GoblinDialogueProps {
  dialogueText: string;
  sensoryTask?: string;
  hasAudio: boolean;
  onPlayAudio?: () => void;
}

export const GoblinDialogue: React.FC<GoblinDialogueProps> = ({
  dialogueText,
  sensoryTask,
  hasAudio,
  onPlayAudio
}) => {
  return (
    <div className="w-full max-w-[380px] mx-auto p-3 flex items-start space-x-2.5 z-20 select-none">
      {/* Animated Grimble Vector Portrait */}
      <GrimbleAvatar size="md" showBadge={true} />

      {/* Speech Bubble Parchment Box */}
      <div className="relative flex-1 bg-parchment border-2 border-timber-light rounded-2xl p-2.5 shadow-md">
        {/* Comic Bubble Pointer */}
        <div className="absolute top-3 -left-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-parchment border-b-8 border-b-transparent" />

        <div className="flex items-center justify-between pb-1 border-b border-parchment-dark/50">
          <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
            Grimble Naturalist
          </span>
          {hasAudio && onPlayAudio && (
            <button
              onClick={onPlayAudio}
              className="text-timber-dark hover:text-gold-dark transition-colors"
              aria-label="Listen to Grimble"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Commentary Text */}
        <p className="text-xs font-bold text-timber-dark leading-snug pt-1">
          "{dialogueText}"
        </p>

        {/* Sensory Grounding Bonus Micro-Challenge */}
        {sensoryTask && (
          <div className="flex items-center space-x-1 text-[10px] font-extrabold text-action-dark mt-1 bg-action/15 border border-action/30 rounded px-1.5 py-0.5 w-fit">
            <NatureIcon name="sprout" size={12} className="w-3 h-3 shrink-0" />
            <span>Task: {sensoryTask}</span>
          </div>
        )}
      </div>
    </div>
  );
};
