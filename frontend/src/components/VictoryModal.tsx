/**
 * ============================================================================
 * VICTORY MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Full-screen celebration modal triggered when completing a 3-in-a-row line.
 * Features Grimble the Goblin celebrating on his mossy rock, fires confetti,
 * awards bonus Acorns, and presents game continuation.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Compass } from 'lucide-react';
import { NatureIcon } from './NatureIcons';
import { GrimbleAvatar } from './GrimbleAvatar';

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
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FDB813', '#58CC02', '#4A2E18', '#FAF2DC', '#94BA45']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-[340px] bg-parchment border-4 border-gold-dark rounded-3xl p-5 shadow-2xl flex flex-col items-center space-y-3 text-center">
        {/* Big 3D Grimble Mascot Celebrating */}
        <div className="relative">
          <GrimbleAvatar size="xl" variant="full" showBadge={false} />
          <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-gold animate-spin" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-timber-dark tracking-wide">BINGO!</h2>
          <p className="text-xs font-bold text-amber-900 mt-0.5">
            "By the ancient banyan roots, you did it!" cheered Grimble!
          </p>
        </div>

        {/* Bonus Acorn Chest Reward */}
        <div className="w-full bg-timber border-2 border-timber-dark rounded-2xl p-2.5 flex items-center justify-center space-x-3 text-parchment shadow-inner">
          <NatureIcon name="acorn" size={26} />
          <div className="text-left">
            <span className="text-[10px] font-bold text-parchment-dark uppercase block">Forager Bounty</span>
            <span className="text-sm font-black text-gold">+100 Acorn Coins Awarded!</span>
          </div>
        </div>

        {/* Action Choices */}
        <div className="w-full flex flex-col space-y-2 pt-1">
          <button
            onClick={onKeepHunting}
            className="w-full py-2.5 btn-3d-action flex items-center justify-center space-x-2 text-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Keep Foraging (Blackout Mode)</span>
          </button>

          <button
            onClick={onNewBoard}
            className="w-full py-2.5 btn-3d-gold flex items-center justify-center space-x-2 text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Forge New Wildwood Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
