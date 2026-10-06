/**
 * ============================================================================
 * VICTORY MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Full-screen celebration modal triggered when completing a 3-in-a-row line.
 * Fires confetti bursts, awards bonus Acorns, and presents game continuation.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Compass } from 'lucide-react';
import { NatureIcon } from './NatureIcons';

interface VictoryModalProps {
  onKeepHunting: () => void;
  onNewBoard: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  onKeepHunting,
  onNewBoard
}) => {
  // Fire celebratory leaf/gold confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FDB813', '#58CC02', '#4A2E18', '#FAF2DC']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-[340px] bg-parchment border-4 border-gold-dark rounded-3xl p-5 shadow-2xl flex flex-col items-center space-y-4 text-center">
        {/* Fanfare Banner */}
        <div className="relative">
          <div className="w-20 h-20 bg-gold border-3 border-gold-dark rounded-full flex items-center justify-center shadow-bevel-gold animate-bounce">
            <NatureIcon name="trophy" size={40} />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-gold animate-spin" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-timber-dark tracking-wide">BINGO!</h2>
          <p className="text-xs font-bold text-amber-900 mt-0.5">
            You completed a woodland trajectory!
          </p>
        </div>

        {/* Bonus Acorn Chest Reward */}
        <div className="w-full bg-timber border-2 border-timber-dark rounded-2xl p-3 flex items-center justify-center space-x-3 text-parchment">
          <NatureIcon name="acorn" size={28} />
          <div className="text-left">
            <span className="text-[10px] font-bold text-parchment-dark uppercase block">Loot Awarded</span>
            <span className="text-base font-black text-gold">+100 Acorn Coins!</span>
          </div>
        </div>

        {/* Action Choices */}
        <div className="w-full flex flex-col space-y-2 pt-1">
          <button
            onClick={onKeepHunting}
            className="w-full py-3 btn-3d-action flex items-center justify-center space-x-2 text-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Keep Foraging (9/9 Blackout)</span>
          </button>

          <button
            onClick={onNewBoard}
            className="w-full py-2.5 btn-3d-gold flex items-center justify-center space-x-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start Fresh Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
