/**
 * ============================================================================
 * PERCHING WOODLAND SPARROW — GOBLIN NATURE BINGO
 * ============================================================================
 * Periodically swooping forest bird that perches on the oak tree branch:
 * 1. Swoops into view every 25-35 seconds from the woodland canopy.
 * 2. Lands on the branch and triggers synthesized Web Audio birdsong chirps.
 * 3. Exhibits living micro-motion: neck/head tilts, branch hopping, wing flutters.
 * 4. Stays for 6-7 seconds before taking flight back into the forest.
 * Operates with pointer-events-none to ensure zero interference with game cards.
 */

import React, { useEffect, useState, useRef } from 'react';
import { playBirdChirp } from '../services/soundFx';

interface PerchingBirdProps {
  soundEnabled: boolean;
}

type BirdPhase = 'OFF_SCREEN' | 'FLYING_IN' | 'PERCHED' | 'FLYING_AWAY';

export const PerchingBird: React.FC<PerchingBirdProps> = ({ soundEnabled }) => {
  const [phase, setPhase] = useState<BirdPhase>('OFF_SCREEN');
  const [hopStep, setHopStep] = useState(0);
  const [isFlapping, setIsFlapping] = useState(false);
  const [neckTilt, setNeckTilt] = useState(false);

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  useEffect(() => {
    // Initial arrival after a short delay (8 seconds) to delight player quickly
    const initialDelay = window.setTimeout(() => {
      setPhase('FLYING_IN');
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
    };
  }, []);

  // Handle phase transitions and perching behaviors
  useEffect(() => {
    let timer: number;

    if (phase === 'FLYING_IN') {
      // Takes 1.2s to swoop onto branch
      timer = window.setTimeout(() => {
        setPhase('PERCHED');
        // Sing celebratory chirp on branch landing
        playBirdChirp(soundRef.current);
      }, 1200);
    } else if (phase === 'PERCHED') {
      // Periodic micro-motion intervals while perched
      const hopInterval = window.setInterval(() => {
        setHopStep(prev => (prev === 0 ? 1 : 0));
        setNeckTilt(prev => !prev);
      }, 1800);

      const flapInterval = window.setInterval(() => {
        setIsFlapping(true);
        setTimeout(() => setIsFlapping(false), 400);
      }, 2600);

      // Perch duration: 6.5 seconds before departure
      timer = window.setTimeout(() => {
        clearInterval(hopInterval);
        clearInterval(flapInterval);
        setPhase('FLYING_AWAY');
      }, 6500);

      return () => {
        clearInterval(hopInterval);
        clearInterval(flapInterval);
        clearTimeout(timer);
      };
    } else if (phase === 'FLYING_AWAY') {
      // Swoops off-screen in 1.4s
      timer = window.setTimeout(() => {
        setPhase('OFF_SCREEN');
        // Schedule next visit cycle
        const delay = 25000 + Math.random() * 12000;
        window.setTimeout(() => {
          setPhase('FLYING_IN');
        }, delay);
      }, 1400);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'OFF_SCREEN') {
    return null;
  }

  // Calculate dynamic transform classes for flight path interpolation
  const getPhaseStyles = () => {
    switch (phase) {
      case 'FLYING_IN':
        return 'translate-x-[240px] -translate-y-[80px] scale-75 opacity-0 animate-[swoopIn_1.2s_cubic-bezier(0.25,1,0.5,1)_forwards]';
      case 'PERCHED':
        return 'translate-x-[155px] translate-y-[26px] scale-100 opacity-100 transition-transform duration-300';
      case 'FLYING_AWAY':
        return 'translate-x-[155px] translate-y-[26px] animate-[swoopOut_1.4s_cubic-bezier(0.5,0,0.75,0)_forwards]';
      default:
        return 'opacity-0';
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 z-10 pointer-events-none select-none transition-all ${getPhaseStyles()}`}
      style={{
        transform:
          phase === 'PERCHED'
            ? `translate(155px, ${26 + (hopStep ? -3 : 0)}px)`
            : undefined
      }}
    >
      {/* Handcrafted Woodland Sparrow Vector */}
      <svg
        viewBox="0 0 44 38"
        className="w-10 h-9 drop-shadow-md overflow-visible"
        fill="none"
      >
        {/* Tail Feathers */}
        <path
          d="M6 24L-2 30L-1 25L5 21"
          fill="#4A2E18"
          stroke="#2A1708"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Sparrow Body Plump Form */}
        <path
          d="M8 20C8 26 14 30 22 30C28 30 32 26 32 20C32 14 26 12 18 12C12 12 8 15 8 20Z"
          fill="#6A4325"
          stroke="#2A1708"
          strokeWidth="1.2"
        />

        {/* Warm Cream Breast Plumes */}
        <path
          d="M18 16C23 16 30 20 30 26C30 29 27 30 22 30C16 30 14 26 18 16Z"
          fill="#FAF2DC"
        />

        {/* Head & Beak Group with dynamic Neck Tilt */}
        <g
          className="transition-transform duration-300 origin-[26px_14px]"
          style={{ transform: neckTilt && phase === 'PERCHED' ? 'rotate(-12deg)' : 'rotate(0deg)' }}
        >
          {/* Head */}
          <circle cx="28" cy="13" r="6.5" fill="#6A4325" stroke="#2A1708" strokeWidth="1" />
          {/* Crown stripe */}
          <path d="M24 8C27 7 30 8 33 11" stroke="#4A2E18" strokeWidth="1.2" strokeLinecap="round" />
          {/* Little inquisitive dark eye with specular glint */}
          <circle cx="30" cy="12" r="1.5" fill="#2A1708" />
          <circle cx="30.5" cy="11.5" r="0.5" fill="#FFFFFF" />
          {/* Amber conical beak */}
          <path d="M34 12L39 14.5L34 16Z" fill="#FDB813" stroke="#B87B00" strokeWidth="0.8" />
        </g>

        {/* Sparrow Wing with Flapping Animation */}
        <g
          className="origin-[16px_17px] transition-transform duration-150"
          style={{
            transform:
              isFlapping || phase === 'FLYING_IN' || phase === 'FLYING_AWAY'
                ? 'rotate(-28deg) scaleY(1.2)'
                : 'rotate(0deg)'
          }}
        >
          <path
            d="M12 17C16 14 24 16 26 21C22 23 16 25 12 17Z"
            fill="#4A2E18"
            stroke="#2A1708"
            strokeWidth="1"
          />
          {/* Secondary feather barring */}
          <path d="M15 17L18 21M18 17L21 21" stroke="#DFCE9F" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* Little Claws grasping the oak branch */}
        <path d="M18 30L17 33M19 30L20 33M24 30L23 33M25 30L26 33" stroke="#2A1708" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
