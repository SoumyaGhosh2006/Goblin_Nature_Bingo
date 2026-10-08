/**
 * ============================================================================
 * GRIMBLE MASCOT MODAL — GOBLIN NATURE BINGO
 * ============================================================================
 * Full character showcase modal presenting Grimble the Goblin Naturalist
 * in high-resolution 3D, standing proudly on his mossy wildwood boulder.
 * Includes character lore, audio voice trigger, and tactical foraging tips.
 */

import React from 'react';
import { X, Volume2, Sparkles, BookOpen, Compass } from 'lucide-react';
import { GrimbleAvatar } from './GrimbleAvatar';

interface GrimbleMascotModalProps {
  dialogueText: string;
  hasAudio: boolean;
  onPlayAudio?: () => void;
  onClose: () => void;
}

export const GrimbleMascotModal: React.FC<GrimbleMascotModalProps> = ({
  dialogueText,
  hasAudio,
  onPlayAudio,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
      {/* Outer Timber Bezel Container */}
      <div className="relative w-full max-w-[360px] bg-timber border-4 border-timber-dark rounded-3xl p-4 shadow-2xl flex flex-col items-center space-y-3">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          aria-label="Close Grimble Showcase"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-timber-light hover:bg-timber-dark text-parchment rounded-full border border-amber-900 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Character Title Header */}
        <div className="text-center pt-1">
          <div className="flex items-center justify-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-gold" />
            <h2 className="text-xl font-black text-gold tracking-wide">
              Grimble the Naturalist
            </h2>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <span className="text-[11px] font-bold text-parchment-dark uppercase tracking-wider block">
            Wildwood Dungeon Master & Field Guide
          </span>
        </div>

        {/* Big 3D Goblin Model Render Standing on Mossy Rock */}
        <div className="relative w-48 h-48 flex items-center justify-center my-1 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
          <GrimbleAvatar size="hero" variant="full" showBadge={false} />
        </div>

        {/* Grimble's Advice Parchment Slab */}
        <div className="w-full bg-parchment border-2 border-timber-light rounded-2xl p-3 shadow-inner space-y-1.5 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-900 text-xs font-black uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Field Notes & Guidance</span>
          </div>
          <p className="text-xs font-bold text-timber-dark leading-snug">
            "{dialogueText}"
          </p>
        </div>

        {/* Modal Action Triggers */}
        <div className="w-full space-y-2 pt-1">
          {hasAudio && onPlayAudio && (
            <button
              onClick={onPlayAudio}
              className="w-full py-2.5 btn-3d-gold flex items-center justify-center space-x-2 text-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Grimble Speak (ElevenLabs)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 btn-3d-action flex items-center justify-center space-x-2 text-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Return to Wilderness Bingo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
