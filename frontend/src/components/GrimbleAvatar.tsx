/**
 * ============================================================================
 * GRIMBLE THE GOBLIN AVATAR — 3D CHARACTER MODEL & VECTOR FALLBACK
 * ============================================================================
 * Features Grimble the Goblin Naturalist in high-fidelity 3D Clash / Supercell style:
 * - Characteristic pointed goblin ears, round brass spectacles, weathered ranger hat.
 * - Supports bust portrait (winking through magnifying glass) & full mascot model.
 * - Fluid hover / active spring physics and organic floating bob animation.
 * - Golden DM (Dungeon Master) badge signifying Grimble's referee role.
 */

import React, { useState } from 'react';
import grimbleBustImg from '../assets/grimble_bust.png';
import grimbleFullImg from '../assets/grimble_mascot.png';

interface GrimbleAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'bust' | 'full';
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
  animated?: boolean;
}

export const GrimbleAvatar: React.FC<GrimbleAvatarProps> = ({
  size = 'md',
  variant = 'bust',
  className = '',
  showBadge = true,
  onClick,
  animated = true
}) => {
  const [imageError, setImageError] = useState(false);

  // Scaled dimensions adhering to mobile screen hierarchy
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
    hero: 'w-48 h-48 max-w-full'
  }[size];

  const characterSrc = variant === 'full' ? grimbleFullImg : grimbleBustImg;

  return (
    <div
      onClick={onClick}
      className={`relative shrink-0 select-none ${dimensions} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200' : ''
      } ${className}`}
    >
      {!imageError ? (
        /* High-Definition 3D Rendered Character Asset */
        <div className={`w-full h-full flex items-center justify-center ${animated ? 'hover:brightness-105' : ''}`}>
          <img
            src={characterSrc}
            alt="Grimble the Goblin Naturalist"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] transition-all duration-300"
            loading="eager"
          />
        </div>
      ) : (
        /* Handcrafted SVG Vector Fallback if image asset fails to load */
        <svg
          viewBox="0 0 64 64"
          width="100%"
          height="100%"
          fill="none"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* Pointy Left Ear */}
          <path
            d="M18 34C10 32 2 28 4 22C6 16 14 24 19 28Z"
            fill="#7DA333"
            stroke="#4C651E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Pointy Right Ear */}
          <path
            d="M46 34C54 32 62 28 60 22C58 16 50 24 45 28Z"
            fill="#7DA333"
            stroke="#4C651E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Head Base */}
          <ellipse cx="32" cy="38" rx="17" ry="15" fill="#7DA333" stroke="#4C651E" strokeWidth="2.5" />
          {/* Explorer Hat */}
          <path d="M12 26C16 23 48 23 52 26C54 27.5 50 29 32 29C14 29 10 27.5 12 26Z" fill="#4A2E18" stroke="#2A1708" strokeWidth="2" />
          <path d="M20 25C20 15 24 11 32 11C40 11 44 15 44 25" fill="#6A4325" stroke="#2A1708" strokeWidth="2" />
          {/* Hatband & Buckle */}
          <path d="M19 23C23 21.5 41 21.5 45 23" stroke="#FDB813" strokeWidth="3" />
          <rect x="30" y="20.5" width="4" height="4" rx="1" fill="#FED053" stroke="#B87B00" strokeWidth="1" />
          {/* Spectacles Bridge & Lenses */}
          <path d="M30 35H34" stroke="#B87B00" strokeWidth="2" strokeLinecap="round" />
          <circle cx="25" cy="35" r="5.5" fill="#FAF2DC" stroke="#B87B00" strokeWidth="2" />
          <circle cx="39" cy="35" r="5.5" fill="#FAF2DC" stroke="#B87B00" strokeWidth="2" />
          <circle cx="26" cy="35" r="2.2" fill="#2A1708" />
          <circle cx="38" cy="35" r="2.2" fill="#2A1708" />
          {/* Goblin Smile */}
          <path d="M25 45C28 48 36 48 39 45" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* DM (Dungeon Master) Ribbon Badge */}
      {showBadge && (
        <div className="absolute -bottom-1 -right-1 bg-gold border border-gold-dark rounded-full px-1.5 py-0.2 text-[8px] font-black text-timber-dark shadow-bevel-gold flex items-center space-x-0.5">
          <span>DM</span>
        </div>
      )}
    </div>
  );
};
