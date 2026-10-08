/**
 * ============================================================================
 * LIVING FOREST CANVAS & WILDLIFE BACKGROUND — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders the user's pristine anime woodland park artwork as the game canvas:
 * 1. Background Artwork: High-resolution Ghibli-style sunlit woodland path.
 * 2. Branch-Perched Songbird: Fluffy blue songbird with ambient and tap chirping.
 * 3. Ambient Sunlight Motes: Gentle golden pollen drifting in the sunbeams.
 */

import React from 'react';
import forestBg from '../assets/forest_background.jpg';
import { BranchSongbird } from './BranchSongbird';

interface LivingForestBackgroundProps {
  soundEnabled?: boolean;
}

export const LivingForestBackground: React.FC<LivingForestBackgroundProps> = ({
  soundEnabled = true
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Pristine Woodland Park Background Artwork */}
      <img
        src={forestBg}
        alt="Enchanted Woodland Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle gentle darkening overlay to ensure card readability */}
      <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />

      {/* Branch-Perched Woodland Songbird (Top-Left Oak Branch) */}
      <BranchSongbird soundEnabled={soundEnabled} />

      {/* Dappled Sunlight Motes Drifting in Forest Sunbeams */}
      <div className="absolute top-[20%] left-[30%] w-2.5 h-2.5 rounded-full bg-gold-light/60 blur-[1px] animate-[moteDrift_7s_linear_infinite]" />
      <div className="absolute top-[35%] left-[55%] w-2 h-2 rounded-full bg-gold-light/50 blur-[1px] animate-[moteDrift_9s_linear_infinite_1.5s]" />
      <div className="absolute top-[50%] left-[25%] w-3 h-3 rounded-full bg-gold-light/45 blur-[1.5px] animate-[moteDrift_8s_linear_infinite_3s]" />
      <div className="absolute top-[65%] left-[68%] w-2 h-2 rounded-full bg-gold-light/55 blur-[1px] animate-[moteDrift_10s_linear_infinite_2s]" />
    </div>
  );
};
