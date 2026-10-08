/**
 * ============================================================================
 * HEADER HUD COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Pinned timber shelf occupying ~12% of mobile screen height.
 * Displays player level shield, Acorn balance, player auth status,
 * audio toggle, and leaderboard trigger.
 */

import React from 'react';
import { Trophy, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { NatureIcon } from './NatureIcons';

interface HeaderHUDProps {
  playerLevel: number;
  woodlandXP: number;
  acorns: number;
  soundEnabled: boolean;
  isAuthenticated: boolean;
  photoURL?: string | null;
  playerNickname?: string;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenAuth: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  playerLevel,
  woodlandXP,
  acorns,
  soundEnabled,
  isAuthenticated,
  photoURL,
  playerNickname,
  onToggleSound,
  onOpenLeaderboard,
  onOpenAuth
}) => {
  return (
    <header className="w-full h-16 bg-timber border-b-4 border-timber-dark shadow-md flex items-center justify-between px-3 z-30 select-none">
      {/* Level Shield & XP Indicator */}
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gold border-2 border-gold-dark rounded-xl shadow-bevel-gold">
          <span className="text-xs font-black text-timber-dark">Lvl {playerLevel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-parchment-dark tracking-wide uppercase">
            Woodland XP
          </span>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-xs font-black text-parchment">{woodlandXP}</span>
          </div>
        </div>
      </div>

      {/* Currency Purse & Control Triggers */}
      <div className="flex items-center space-x-1.5">
        {/* Acorn Currency Purse */}
        <div className="flex items-center bg-timber-dark border border-timber-light rounded-full px-2.5 py-1 space-x-1 shadow-inner mr-0.5">
          <NatureIcon name="acorn" size={15} />
          <span className="text-xs font-black text-gold">{acorns}</span>
        </div>

        {/* User Account / Auth Modal Trigger */}
        <button
          onClick={onOpenAuth}
          aria-label="User Account and Auth"
          title={isAuthenticated ? `Logged in as ${playerNickname}` : "Sign In / Create Account"}
          className="relative w-9 h-9 flex items-center justify-center bg-timber-light border-2 border-amber-900 rounded-xl shadow-bevel-timber active:translate-y-[2px] active:shadow-none transition-transform"
        >
          {photoURL ? (
            <img
              src={photoURL}
              alt="Profile"
              className="w-full h-full rounded-[10px] object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-parchment" />
          )}

          {/* Cloud Synced / Authenticated Green Indicator */}
          {isAuthenticated ? (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-action opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-action border border-timber-dark" />
            </span>
          ) : (
            <span className="absolute -bottom-1 -right-1 bg-gold text-timber-dark text-[7px] font-black px-1 rounded-full border border-timber-dark">
              GUEST
            </span>
          )}
        </button>

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
