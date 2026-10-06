/**
 * ============================================================================
 * ONBOARDING MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Frictionless guest nickname picker shown on first launch.
 * Ensures zero login friction so players can start hunting outside immediately.
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GrimbleAvatar } from './GrimbleAvatar';

interface OnboardingModalProps {
  onComplete: (nickname: string) => void;
}

const DEFAULT_NICKNAMES = [
  'MossyScout', 'BrambleBiter', 'AcornKnight', 'TwigWhisperer',
  'FernSeeker', 'PebbleProwler', 'BarkWatcher', 'CaterpillarDuelist'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
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
      <div className="w-full max-w-[340px] bg-parchment border-4 border-timber-dark rounded-3xl p-5 shadow-2xl flex flex-col space-y-4">
        {/* Grimble Greeting Banner */}
        <div className="text-center space-y-1">
          <div className="flex justify-center pb-1">
            <GrimbleAvatar size="lg" showBadge={false} />
          </div>
          <h2 className="text-xl font-black text-timber-dark pt-1">Halt, Forager!</h2>
          <p className="text-xs font-semibold text-timber-light">
            What name do the woodland critters call you?
          </p>
        </div>

        {/* Nickname Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2.5 bg-parchment-light border-2 border-timber rounded-xl font-bold text-timber-dark focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 btn-3d-action flex items-center justify-center space-x-2 text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter the Wildwood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
