/**
 * ============================================================================
 * BRANCH-PERCHED SONGBIRD COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders the cute, fluffy blue-and-cream woodland songbird perched on the
 * big oak tree branch (top-left of the pristine anime background).
 * Exhibits lifelike visual micro-animations: gentle breathing, head tilts,
 * and tail twitches. Completely silent with zero audio playback.
 */

import React, { useState, useEffect } from 'react';

interface BranchSongbirdProps {
  soundEnabled?: boolean;
}

export const BranchSongbird: React.FC<BranchSongbirdProps> = () => {
  const [headTilt, setHeadTilt] = useState(false);
  const [tailFlick, setTailFlick] = useState(false);

  // Periodically trigger natural visual bird micro-behaviors (head tilts and tail twitches)
  useEffect(() => {
    const headInterval = setInterval(() => {
      setHeadTilt(prev => !prev);
    }, 3200);

    const tailInterval = setInterval(() => {
      setTailFlick(true);
      setTimeout(() => setTailFlick(false), 300);
    }, 4500);

    return () => {
      clearInterval(headInterval);
      clearInterval(tailInterval);
    };
  }, []);

  return (
    <div
      className="absolute top-[8%] left-[7%] sm:left-[10%] w-16 h-16 pointer-events-none select-none z-10 drop-shadow-md"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 70 70"
        className="w-full h-full overflow-visible"
      >
        {/* Shadow cast on the tree branch */}
        <ellipse cx="36" cy="62" rx="14" ry="4" fill="#1C160C" opacity="0.35" />

        {/* Tail feathers with periodic flick motion */}
        <g
          className="transition-transform duration-200 origin-[20px_50px]"
          style={{ transform: tailFlick ? 'rotate(-14deg)' : 'rotate(0deg)' }}
        >
          <path
            d="M20 46 C12 48, 6 54, 4 60 C8 58, 16 54, 22 50 Z"
            fill="#4A7BB0"
            stroke="#2B4D73"
            strokeWidth="1.2"
          />
          <path
            d="M22 48 C15 52, 9 58, 8 64 C12 61, 18 56, 24 51 Z"
            fill="#386494"
          />
        </g>

        {/* Chubby round body (Cream belly + soft blue mantle) */}
        <ellipse
          cx="38"
          cy="46"
          rx="18"
          ry="16"
          fill="#FAF2DC"
          stroke="#2B4D73"
          strokeWidth="1.5"
        />

        {/* Sky-blue back and wing cape */}
        <path
          d="M24 38 C28 32, 44 32, 54 42 C48 54, 32 58, 22 50 C21 44, 22 40, 24 38 Z"
          fill="#5B92D0"
          stroke="#2B4D73"
          strokeWidth="1.2"
        />

        {/* Wing feather detailing */}
        <path
          d="M28 42 C34 38, 44 40, 48 48 C42 52, 34 50, 28 42 Z"
          fill="#4A7BB0"
          stroke="#2B4D73"
          strokeWidth="1.2"
        />

        {/* Head group with dynamic animated tilt */}
        <g
          className="transition-transform duration-300 origin-[42px_32px]"
          style={{ transform: headTilt ? 'rotate(8deg)' : 'rotate(-4deg)' }}
        >
          {/* Fluffy blue head */}
          <circle
            cx="44"
            cy="28"
            r="14"
            fill="#5B92D0"
            stroke="#2B4D73"
            strokeWidth="1.5"
          />

          {/* Cream face patch */}
          <path
            d="M36 28 C36 22, 46 20, 52 26 C56 32, 50 38, 42 38 C37 38, 36 33, 36 28 Z"
            fill="#FAF2DC"
          />

          {/* Rosy blush cheeks */}
          <ellipse cx="48" cy="31" rx="3.5" ry="2" fill="#FFAAA6" opacity="0.85" />

          {/* Big cute cartoon eye with highlight glints */}
          <circle cx="45" cy="25" r="3.2" fill="#1C160C" />
          <circle cx="46" cy="24" r="1.2" fill="#FFFFFF" />
          <circle cx="44" cy="26" r="0.6" fill="#FFFFFF" />

          {/* Small orange beak */}
          <polygon
            points="54,26 62,29 54,32"
            fill="#FDB813"
            stroke="#B87B00"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>

        {/* Claws grasping the oak branch */}
        <path
          d="M33 60 L33 63 M36 60 L36 63.5 M39 60 L39 63"
          stroke="#8A5A36"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M44 60 L44 63 M47 60 L47 63.5 M50 60 L50 63"
          stroke="#8A5A36"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
