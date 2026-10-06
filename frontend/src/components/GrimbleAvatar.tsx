/**
 * ============================================================================
 * GRIMBLE THE GOBLIN AVATAR — VECTOR PORTRAIT WITH MICRO-ANIMATION
 * ============================================================================
 * Handcrafted SVG portrait of Grimble the Goblin Naturalist Dungeon Master:
 * - Characteristic pointed goblin ears and weathered explorer hat.
 * - Brass spectacles resting over inquisitive eyes.
 * - Micro-animation: CSS keyframe eyelid blink and subtle ear twitch,
 *   ensuring the character feels living and attentive rather than static.
 */

import React from 'react';

interface GrimbleAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
}

export const GrimbleAvatar: React.FC<GrimbleAvatarProps> = ({
  size = 'md',
  className = '',
  showBadge = true
}) => {
  // Dimensions tailored to mobile layout hierarchy
  const dimensions = {
    sm: { box: 'w-10 h-10', svgSize: 40 },
    md: { box: 'w-12 h-12', svgSize: 48 },
    lg: { box: 'w-16 h-16', svgSize: 64 },
  }[size];

  return (
    <div className={`relative shrink-0 select-none ${dimensions.box} ${className}`}>
      {/* Handcrafted Grimble SVG Vector */}
      <svg
        viewBox="0 0 64 64"
        width="100%"
        height="100%"
        fill="none"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {/* Left Pointy Goblin Ear with twitch animation */}
        <path
          d="M18 34C10 32 2 28 4 22C6 16 14 24 19 28Z"
          fill="#7DA333"
          stroke="#4C651E"
          strokeWidth="2"
          strokeLinejoin="round"
          className="origin-[18px_30px] animate-[earTwitch_6s_ease-in-out_infinite]"
        />
        {/* Left Inner Ear Shadow */}
        <path d="M15 31C10 29 6 26 7 23C8 20 12 25 16 28Z" fill="#658625" />

        {/* Right Pointy Goblin Ear with alternating twitch */}
        <path
          d="M46 34C54 32 62 28 60 22C58 16 50 24 45 28Z"
          fill="#7DA333"
          stroke="#4C651E"
          strokeWidth="2"
          strokeLinejoin="round"
          className="origin-[46px_30px] animate-[earTwitch_6s_ease-in-out_infinite_1.5s]"
        />
        {/* Right Inner Ear Shadow */}
        <path d="M49 31C54 29 58 26 57 23C56 20 52 25 48 28Z" fill="#658625" />

        {/* Goblin Head Base */}
        <ellipse cx="32" cy="38" rx="17" ry="15" fill="#7DA333" stroke="#4C651E" strokeWidth="2.5" />

        {/* Weathered Naturalist Explorer Hat */}
        <path d="M12 26C16 23 48 23 52 26C54 27.5 50 29 32 29C14 29 10 27.5 12 26Z" fill="#4A2E18" stroke="#2A1708" strokeWidth="2" />
        <path d="M20 25C20 15 24 11 32 11C40 11 44 15 44 25" fill="#6A4325" stroke="#2A1708" strokeWidth="2" />
        {/* Hat Hatband with Brass Buckle */}
        <path d="M19 23C23 21.5 41 21.5 45 23" stroke="#FDB813" strokeWidth="3" />
        <rect x="30" y="20.5" width="4" height="4" rx="1" fill="#FED053" stroke="#B87B00" strokeWidth="1" />
        {/* Tiny Foraged Oak Leaf in Hatband */}
        <path d="M41 22C44 17 49 18 47 22Z" fill="#58CC02" stroke="#2F7E00" strokeWidth="1" />

        {/* Round Brass Spectacles Bridge */}
        <path d="M30 35H34" stroke="#B87B00" strokeWidth="2" strokeLinecap="round" />

        {/* Left Spectacle Lens & Eye with Blinking Animation */}
        <circle cx="25" cy="35" r="5.5" fill="#FAF2DC" stroke="#B87B00" strokeWidth="2" />
        <g className="origin-[25px_35px] animate-[goblinBlink_4.5s_infinite]">
          {/* Pupil */}
          <circle cx="26" cy="35" r="2.2" fill="#2A1708" />
          <circle cx="27" cy="34" r="0.8" fill="#FFFFFF" />
        </g>
        {/* Eyelid overlay for blink motion */}
        <path
          d="M19.5 35C19.5 35 21 32 25 32C29 32 30.5 35 30.5 35"
          stroke="#4C651E"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Right Spectacle Lens & Eye with Blinking Animation */}
        <circle cx="39" cy="35" r="5.5" fill="#FAF2DC" stroke="#B87B00" strokeWidth="2" />
        <g className="origin-[39px_35px] animate-[goblinBlink_4.5s_infinite]">
          {/* Pupil */}
          <circle cx="38" cy="35" r="2.2" fill="#2A1708" />
          <circle cx="39" cy="34" r="0.8" fill="#FFFFFF" />
        </g>
        <path
          d="M33.5 35C33.5 35 35 32 39 32C43 32 44.5 35 44.5 35"
          stroke="#4C651E"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Broad Bulbous Goblin Nose */}
        <path d="M30 39C30 42 34 42 34 39" fill="#94BA45" stroke="#4C651E" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cheerful Mischievous Grin */}
        <path d="M25 45C28 48 36 48 39 45" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" />
        {/* Tiny protruding tooth */}
        <path d="M27 45.5L28 47.5L29 46" fill="#FFFFFF" stroke="#2A1708" strokeWidth="0.8" />
      </svg>

      {/* DM Ribbon Badge */}
      {showBadge && (
        <div className="absolute -bottom-1 -right-1 bg-gold border border-gold-dark rounded-full px-1.5 py-0.2 text-[8px] font-black text-timber-dark shadow-sm">
          DM
        </div>
      )}
    </div>
  );
};
