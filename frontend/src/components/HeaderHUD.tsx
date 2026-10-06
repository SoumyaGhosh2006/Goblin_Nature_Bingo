/**
 * ============================================================================
 * HEADER HUD COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Pinned timber shelf occupying ~12% of mobile screen height.
 * Displays player level shield, Acorn balance, audio toggle, and leaderboard.
 */

import React from 'react';
import { Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { NatureIcon } from './NatureIcons';

interface HeaderHUDProps {
  playerLevel: number;
  woodlandXP: number;
  acorns: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  playerLevel,
  woodlandXP,
  acorns,
  soundEnabled,
  onToggleSound,
  onOpenLeaderboard
}) => {
  return (
    <header className="w-full h-16 bg-timber border-b-4 border-timber-dark shadow-md flex items-center justify-between px-3 z-30 select-none">
      {/* Level Shield & XP Indicator */}
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gold border-2 border-gold-dark rounded-xl shadow-bevel-gold">
          <span className="text-xs font-black text-timber-dark">Lvl {playerLevel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-parchment-dark tracking-wide uppercase">Woodland XP</span>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-xs font-black text-parchment">{woodlandXP}</span>
          </div>
        </div>
      </div>

      {/* Currency Purse & Control Triggers */}
      <div className="flex items-center space-x-2">
        {/* Acorn Currency Badge */}
        <div className="flex items-center bg-timber-dark border border-timber-light rounded-full px-2.5 py-1 space-x-1.5 shadow-inner">
          <NatureIcon name="acorn" size={16} />
          <span className="text-xs font-black text-gold">{acorns}</span>
        </div>

        {/* Leaderboard Trigger */}
        <button
          onClick={onOpenLeaderboard}
          aria-label="Open Leaderboard"
          className="w-9 h-9 flex items-center justify-center bg-gold border-2 border-gold-dark rounded-xl shadow-bevel-gold active:translate-y-[2px] active:shadow-none transition-transform"
        >
          <Trophy className="w-4 h-4 text-timber-dark" />
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={onToggleSound}
          aria-label="Toggle Sound"
          className="w-9 h-9 flex items-center justify-center bg-timber-light border-2 border-timber-dark rounded-xl shadow-bevel-timber active:translate-y-[2px] active:shadow-none transition-transform"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-parchment" />
          ) : (
            <VolumeX className="w-4 h-4 text-parchment-dark" />
          )}
        </button>
      </div>
    </header>
  );
};
