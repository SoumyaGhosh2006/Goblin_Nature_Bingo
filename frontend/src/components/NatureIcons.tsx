/**
 * ============================================================================
 * NATURE ICONS VECTOR REPOSITORY — GOBLIN NATURE BINGO
 * ============================================================================
 * Handcrafted vector SVG iconography providing resolution-independent,
 * tactile nature glyphs that permanently replace mobile system emojis.
 * Each glyph features two-tone woodland palette fills and crisp outlines.
 */

import React from 'react';

export type NatureIconType = 
  | 'acorn'
  | 'leaf'
  | 'sprout'
  | 'wood'
  | 'mushroom'
  | 'sun'
  | 'stone'
  | 'insect'
  | 'feather'
  | 'water'
  | 'pinecone'
  | 'trophy'
  | 'sparkle'
  | 'compass'
  | 'default';

interface NatureIconProps {
  name?: string;
  className?: string;
  size?: number;
}

/**
 * Normalizes any icon identifier or legacy emoji string into a known
 * vector icon key, ensuring seamless backward-compatibility.
 */
function resolveIconKey(rawName?: string): NatureIconType {
  if (!rawName) return 'leaf';
  const lower = rawName.toLowerCase();

  if (lower.includes('acorn')) return 'acorn';
  if (lower.includes('leaf')) return 'leaf';
  if (lower.includes('sprout') || lower.includes('moss') || lower.includes('fern')) return 'sprout';
  if (lower.includes('wood') || lower.includes('bark') || lower.includes('branch')) return 'wood';
  if (lower.includes('mushroom') || lower.includes('fungus')) return 'mushroom';
  if (lower.includes('sun') || lower.includes('light') || lower.includes('beam')) return 'sun';
  if (lower.includes('stone') || lower.includes('pebble') || lower.includes('rock')) return 'stone';
  if (lower.includes('insect') || lower.includes('ant') || lower.includes('caterpillar') || lower.includes('beetle')) return 'insect';
  if (lower.includes('feather') || lower.includes('bird')) return 'feather';
  if (lower.includes('water') || lower.includes('damp') || lower.includes('puddle') || lower.includes('dew')) return 'water';
  if (lower.includes('pinecone') || lower.includes('cone')) return 'pinecone';
  if (lower.includes('trophy') || lower.includes('prize') || lower.includes('crown')) return 'trophy';
  if (lower.includes('sparkle') || lower.includes('star') || lower.includes('shine')) return 'sparkle';
  if (lower.includes('compass')) return 'compass';

  return 'leaf';
}

export const NatureIcon: React.FC<NatureIconProps> = ({ name, className = "w-5 h-5", size = 20 }) => {
  const iconKey = resolveIconKey(name);

  switch (iconKey) {
    case 'acorn':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          {/* Acorn cap with cross-hatch texture */}
          <path d="M7 6C7 4.5 9 3 12 3C15 3 17 4.5 17 6C18.5 6 19.5 7.5 19 9C18.5 10.5 17 11 15 11L9 11C7 11 5.5 10.5 5 9C4.5 7.5 5.5 6 7 6Z" fill="#6A4325" stroke="#2A1708" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 3V1.5" stroke="#2A1708" strokeWidth="1.5" strokeLinecap="round" />
          {/* Smooth nut body */}
          <path d="M6 10C6 14 8.5 20.5 12 22C15.5 20.5 18 14 18 10L6 10Z" fill="#FDB813" stroke="#B87B00" strokeWidth="1.5" />
          <path d="M9 13C9 16 10 18.5 11 19.5" stroke="#FED053" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        </svg>
      );

    case 'leaf':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M3 21C3 21 5 15 9 11C13 7 19 4 21 3C21 3 20 10 16 15C12 20 6 21 3 21Z" fill="#58CC02" stroke="#2F7E00" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M3 21C8 16 13 12 21 3" stroke="#2F7E00" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 14L8 16M13 11L11 13M16 8L15 9.5" stroke="#6FDE18" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'sprout':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M12 22V10" stroke="#4A2E18" strokeWidth="2" strokeLinecap="round" />
          {/* Left curved leaf */}
          <path d="M12 14C8 14 5 11 5 7C9 7 12 10 12 14Z" fill="#7DA333" stroke="#4C651E" strokeWidth="1.5" />
          {/* Right fresh bud */}
          <path d="M12 10C12 6 15 3 19 3C19 7 16 10 12 10Z" fill="#94BA45" stroke="#4C651E" strokeWidth="1.5" />
          {/* Earth mound */}
          <path d="M4 22C7 20.5 17 20.5 20 22" stroke="#6A4325" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'wood':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <ellipse cx="6" cy="12" rx="3" ry="6" fill="#DFCE9F" stroke="#4A2E18" strokeWidth="1.5" />
          <path d="M6 6H18C19.65 6 21 8.68 21 12C21 15.31 19.65 18 18 18H6" fill="#6A4325" stroke="#2A1708" strokeWidth="1.5" />
          <ellipse cx="18" cy="12" rx="3" ry="6" fill="#DFCE9F" stroke="#4A2E18" strokeWidth="1.5" />
          <path d="M9 10C11 10 14 10.5 15 10M8 14C10.5 14 13.5 13.5 15.5 14" stroke="#4A2E18" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'mushroom':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          {/* Mushroom stem */}
          <path d="M9 14V20C9 21.1 10.3 22 12 22C13.7 22 15 21.1 15 20V14H9Z" fill="#F5E8C7" stroke="#6A4325" strokeWidth="1.5" />
          {/* Cap dome */}
          <path d="M3 14C3 8 7 3 12 3C17 3 21 8 21 14C21 15 19.5 15 18 15C15 15 13 14.5 12 14.5C11 14.5 9 15 6 15C4.5 15 3 15 3 14Z" fill="#E54B4B" stroke="#941E1E" strokeWidth="1.5" />
          {/* White spots */}
          <circle cx="8" cy="8" r="1.5" fill="#FAF2DC" />
          <circle cx="15" cy="7.5" r="1.8" fill="#FAF2DC" />
          <circle cx="12" cy="11" r="1.2" fill="#FAF2DC" />
        </svg>
      );

    case 'sun':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <circle cx="12" cy="12" r="5" fill="#FDB813" stroke="#B87B00" strokeWidth="1.5" />
          <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'stone':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M6 18C4 16 3 13 5 9C7 5 11 4 16 5C20 6 22 9 21 14C20 18 16 20 12 20C8 20 7 19 6 18Z" fill="#A89F91" stroke="#4A443B" strokeWidth="1.5" />
          <path d="M8 8C12 7 16 8.5 17 11" stroke="#D3CCC2" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M6 14C9 14.5 14 16 16 17" stroke="#4A443B" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'insect':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          {/* Legs */}
          <path d="M4 9L8 11M20 9L16 11M3 15L8 14M21 15L16 14M5 20L9 17M19 20L15 17" stroke="#2A1708" strokeWidth="1.5" strokeLinecap="round" />
          {/* Head & Antennae */}
          <circle cx="12" cy="6" r="2.5" fill="#6A4325" stroke="#2A1708" strokeWidth="1.2" />
          <path d="M10.5 4L8 2M13.5 4L16 2" stroke="#2A1708" strokeWidth="1.2" strokeLinecap="round" />
          {/* Thorax & Abdomen */}
          <ellipse cx="12" cy="11" rx="2.5" ry="3" fill="#B87B00" stroke="#2A1708" strokeWidth="1.2" />
          <ellipse cx="12" cy="17" rx="3.5" ry="4" fill="#6A4325" stroke="#2A1708" strokeWidth="1.2" />
        </svg>
      );

    case 'feather':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M20 4C20 4 14 6 10 11C6 16 4 20 4 20C4 20 8 18 13 14C18 10 20 4 20 4Z" fill="#F5E8C7" stroke="#6A4325" strokeWidth="1.5" />
          <path d="M20 4L4 20" stroke="#4A2E18" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13 11L10 9M16 8L13 6M10 14L8 12" stroke="#DFCE9F" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'water':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M12 3C12 3 6 11 6 15C6 18.3 8.7 21 12 21C15.3 21 18 18.3 18 15C18 11 12 3 12 3Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <path d="M10 14C10 16 11 18 12 18.5" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </svg>
      );

    case 'pinecone':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M12 3C8 6 7 12 8 17C9 20 11 21 12 21C13 21 15 20 16 17C17 12 16 6 12 3Z" fill="#6A4325" stroke="#2A1708" strokeWidth="1.5" />
          <path d="M9 8C11 9 13 9 15 8M8 12C11 13.5 13 13.5 16 12M9 16C11 17 13 17 15 16" stroke="#4A2E18" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'trophy':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M7 4H17V9C17 12 14.5 14 12 14C9.5 14 7 12 7 9V4Z" fill="#FDB813" stroke="#B87B00" strokeWidth="1.5" />
          <path d="M7 6H4C3 6 3 9 5 10C6.5 10.7 7 10 7 10M17 6H20C21 6 21 9 19 10C17.5 10.7 17 10 17 10" stroke="#B87B00" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 14V18M8 21H16" stroke="#B87B00" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8.5" r="1.5" fill="#FED053" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className={className}>
          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="#7DA333" stroke="#4C651E" strokeWidth="1.5" />
          <path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
