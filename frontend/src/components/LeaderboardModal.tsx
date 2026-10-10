/**
 * ============================================================================
 * LEADERBOARD MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Parchment ranking table displaying top Hedge Foragers.
 * Supports auto-switching between live Cloud Firestore and mock rivals.
 */

import React, { useEffect, useState } from 'react';
import { Trophy, X, Crown, Loader2, Calendar, RotateCcw } from 'lucide-react';
import type { LeaderboardEntry } from '../types/game';
import { fetchLeaderboard, getMonthlyResetInfo } from '../services/firebase';

interface LeaderboardModalProps {
  currentPlayer: { nickname: string; level: number; xp: number };
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentPlayer,
  onClose
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resetInfo = getMonthlyResetInfo();

  useEffect(() => {
    let isMounted = true;
    fetchLeaderboard(currentPlayer).then(data => {
      if (isMounted) {
        setEntries(data);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [currentPlayer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-[350px] bg-parchment border-4 border-timber-dark rounded-3xl p-4 shadow-2xl flex flex-col space-y-3">
        {/* Header Title with Close Trigger */}
        <div className="flex items-center justify-between border-b-2 border-timber/20 pb-2">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-gold-dark" />
            <h3 className="text-base font-black text-timber-dark uppercase tracking-wide">
              Hedge Foragers
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-timber-light/20 rounded-full text-timber hover:bg-timber-light/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Monthly Season & 1st-of-Month Reset Schedule Banner */}
        <div className="bg-amber-950/10 border border-timber/25 rounded-2xl px-3 py-2 flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span className="text-[11px] font-black text-timber-dark uppercase tracking-wider">
                {resetInfo.seasonLabel} Season
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-700/30">
              {resetInfo.isFirstDayOfMonth
                ? 'Reset Today!'
                : `${resetInfo.daysUntilReset}d left`}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] font-bold text-timber-light">
            <RotateCcw className="w-3 h-3 text-amber-700 shrink-0" />
            <span>
              Resets on the 1st of every month (Next: {resetInfo.nextResetLabel})
            </span>
          </div>
        </div>

        {/* Rankings Parchment List */}
        <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-timber-light space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">Summoning Leaderboard...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-6 px-3 text-center bg-parchment-light border border-parchment-dark rounded-xl space-y-1">
              <p className="text-xs font-black text-timber-dark">
                Fresh Monthly Season Underway!
              </p>
              <p className="text-[11px] font-semibold text-timber-light">
                The leaderboard reset on the 1st of this month. Complete a quest to claim Rank #1!
              </p>
            </div>
          ) : (
            entries.map((forager, rank) => (
              <div
                key={forager.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${
                  forager.isCurrentPlayer
                    ? 'bg-gold/20 border-gold-dark ring-2 ring-gold'
                    : 'bg-parchment-light border-parchment-dark'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {/* Rank Crown / Number */}
                  <div className="w-6 flex justify-center text-sm font-black text-timber">
                    {rank === 0 ? <Crown className="w-4 h-4 text-amber-500" /> : `#${rank + 1}`}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-timber-dark leading-tight">
                      {forager.nickname} {forager.isCurrentPlayer && '(You)'}
                    </span>
                    <span className="text-[10px] font-bold text-timber-light">
                      Lvl {forager.level} Scout
                    </span>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="text-right">
                  <span className="text-xs font-black text-amber-900 block">
                    {forager.woodlandXP} XP
                  </span>
                  <span className="text-[9px] font-bold text-timber-light">
                    {forager.bingosCompleted} Bingos
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 btn-3d-timber text-xs flex items-center justify-center"
        >
          Back to Trail
        </button>
      </div>
    </div>
  );
};
