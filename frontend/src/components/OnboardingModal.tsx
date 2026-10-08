/**
 * ============================================================================
 * ONBOARDING MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Greets first-time adventurers with Grimble the Goblin Naturalist mascot.
 * Supports quick 1-click guest onboarding and cloud authentication pathways.
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { GrimbleAvatar } from './GrimbleAvatar';

interface OnboardingModalProps {
  onComplete: (nickname: string) => void;
  onOpenAuth: () => void;
}

const DEFAULT_NICKNAMES = [
  'NeemForager', 'PeepalSeeker', 'MonsoonMaw', 'BanyanClimber',
  'GirgitWatcher', 'DragonflyKnight', 'HibiscusScout', 'AntProwler'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onOpenAuth }) => {
  const [nickname, setNickname] = useState(() => {
    const randomPick = DEFAULT_NICKNAMES[Math.floor(Math.random() * DEFAULT_NICKNAMES.length)];
    return `${randomPick}_${Math.floor(Math.random() * 90 + 10)}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onComplete(nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-[350px] bg-parchment border-4 border-timber-dark rounded-3xl p-5 shadow-2xl flex flex-col space-y-3">
        {/* Big 3D Grimble Goblin Mascot Character */}
        <div className="text-center space-y-1 flex flex-col items-center">
          <div className="pb-1 transform hover:scale-105 transition-transform duration-300">
            <GrimbleAvatar size="xl" variant="full" showBadge={false} />
          </div>
          <h2 className="text-xl font-black text-timber-dark pt-1">Halt, Forager!</h2>
          <p className="text-xs font-semibold text-amber-900 px-2 leading-relaxed">
            I am <span className="font-black text-amber-950">Grimble</span>, your Naturalist Dungeon Master!
            What name do the wildwood critters call you?
          </p>
        </div>

        {/* Quick Guest Nickname Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-black uppercase text-timber tracking-wider block mb-1">
              Your Goblin Nickname:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              required
              className="w-full px-3 py-2 bg-parchment-light border-2 border-timber rounded-xl font-bold text-timber-dark text-xs focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 btn-3d-action flex items-center justify-center space-x-2 text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter the Wildwood (Guest)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider & Cloud Sign-In Button */}
        <div className="pt-1 border-t border-parchment-dark/70 flex flex-col items-center space-y-2">
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full py-2 bg-timber-dark/90 hover:bg-timber-dark text-parchment font-black rounded-xl border border-timber-light text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-gold" />
            <span>Sign In with Google / Email</span>
          </button>
          <span className="text-[10px] font-bold text-timber-light/80">
            Sync XP, badges, & climb the Indian Leaderboard
          </span>
        </div>
      </div>
    </div>
  );
};
