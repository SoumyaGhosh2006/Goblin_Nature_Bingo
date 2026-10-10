/**
 * ============================================================================
 * NATURE ICONS VECTOR REPOSITORY — GOBLIN NATURE BINGO
 * ============================================================================
 * Renders handcrafted botanical vector sketches from the SpeciesIllustration
 * catalog for all Indian specimens, with fallbacks for HUD system icons.
 */

import React from 'react';
import { SpeciesIllustration, type SpeciesKey } from './SpeciesIllustrations';

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
  | 'trophy'
  | 'sparkle'
  | 'compass'
  | 'default';

interface NatureIconProps {
  name?: string;
  title?: string;
  className?: string;
  size?: number;
}

/**
 * Checks if rawName or rawTitle maps to one of our 10 authentic botanical ink-wash species.
 */
function resolveSpeciesKey(rawName?: string, rawTitle?: string): SpeciesKey | null {
  const combined = `${rawName || ''} ${rawTitle || ''}`.toLowerCase();
  if (!combined.trim()) return null;

  if (combined.includes('neem') || combined.includes('serrated')) return 'neem';
  if (combined.includes('peepal') || combined.includes('drip_tip') || combined.includes('drip tip') || combined.includes('cordate')) return 'peepal';
  if (combined.includes('banyan') || combined.includes('prop_root') || combined.includes('aerial root') || combined.includes('bark') || combined.includes('wood') || combined.includes('twisted') || combined.includes('vine')) return 'banyan';
  if (combined.includes('bougainvillea') || combined.includes('paper flower') || combined.includes('bract')) return 'bougainvillea';
  if (combined.includes('hibiscus') || combined.includes('scarlet') || combined.includes('flower') || combined.includes('bloom')) return 'hibiscus';
  if (combined.includes('girgit') || combined.includes('lizard') || combined.includes('reptile') || combined.includes('calotes')) return 'girgit';
  if (combined.includes('dragonfly') || combined.includes('pantala') || combined.includes('gossamer') || combined.includes('fly')) return 'dragonfly';
  if (combined.includes('ant') || combined.includes('weaver') || combined.includes('spider') || combined.includes('insect') || combined.includes('bug')) return 'weaver_ants';
  if (combined.includes('moss') || combined.includes('bryum') || combined.includes('sprout') || combined.includes('velvet') || combined.includes('damp')) return 'monsoon_moss';
  if (combined.includes('stone') || combined.includes('pebble') || combined.includes('quartz') || combined.includes('rock') || combined.includes('shard') || combined.includes('soil')) return 'quartz_stone';

  // If a tile title exists but did not match specific keywords, map cleanly by word length hash to one of the 10
  if (rawTitle) {
    const SPECIES_LIST: SpeciesKey[] = [
      'neem', 'peepal', 'banyan', 'bougainvillea', 'hibiscus',
      'girgit', 'dragonfly', 'weaver_ants', 'monsoon_moss', 'quartz_stone'
    ];
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash + combined.charCodeAt(i)) % SPECIES_LIST.length;
    }
    return SPECIES_LIST[hash];
  }

  return null;
}

/**
 * Normalizes system icon identifier into a known vector key for HUD elements.
 */
function resolveSystemIconKey(rawName?: string): NatureIconType {
  if (!rawName) return 'leaf';
  const lower = rawName.toLowerCase();

  if (lower.includes('acorn')) return 'acorn';
  if (lower.includes('trophy') || lower.includes('prize') || lower.includes('crown')) return 'trophy';
  if (lower.includes('sparkle') || lower.includes('star') || lower.includes('shine')) return 'sparkle';
  if (lower.includes('compass')) return 'compass';
  if (lower.includes('feather') || lower.includes('bird')) return 'feather';
  if (lower.includes('water') || lower.includes('dew')) return 'water';
  if (lower.includes('sun') || lower.includes('light')) return 'sun';

  return 'leaf';
}

export const NatureIcon: React.FC<NatureIconProps> = ({
  name = 'leaf',
  title,
  className = '',
  size = 32
}) => {
  // If the icon corresponds to one of the 10 Indian nature specimens, render botanical sketch
  const speciesKey = resolveSpeciesKey(name, title);
  if (speciesKey) {
    return (
      <SpeciesIllustration
        species={speciesKey}
        size={size}
        className={className}
      />
    );
  }

  const iconKey = resolveSystemIconKey(name);

  // Render system HUD glyphs
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`shrink-0 overflow-visible select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Acorn Currency Glyph */}
      {iconKey === 'acorn' && (
        <g id="icon-acorn">
          <path d="M16 3C16 3 17 6 15 8" stroke="#2A1708" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 11C7 9 10 7 16 7C22 7 25 9 25 11C25 14 22 15 16 15C10 15 7 14 7 11Z" fill="#6A4325" stroke="#2A1708" strokeWidth="2" />
          <path d="M9 14C9 14 9 24 16 29C23 24 23 14 23 14" fill="#FDB813" stroke="#2A1708" strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}

      {/* Trophy / Victory Glyph */}
      {iconKey === 'trophy' && (
        <g id="icon-trophy">
          <path d="M10 5H22V15C22 18.3 19.3 21 16 21C12.7 21 10 18.3 10 15V5Z" fill="#FDB813" stroke="#B87B00" strokeWidth="2" />
          <path d="M10 8H6C4.9 8 4 8.9 4 10V11C4 13.2 5.8 15 8 15H10" stroke="#B87B00" strokeWidth="2" />
          <path d="M22 8H26C27.1 8 28 8.9 28 10V11C28 13.2 26.2 15 24 15H22" stroke="#B87B00" strokeWidth="2" />
          <path d="M16 21V25M11 27H21" stroke="#B87B00" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* Sparkle / Magic Glyph */}
      {iconKey === 'sparkle' && (
        <g id="icon-sparkle">
          <path d="M16 3L18.5 11.5L27 14L18.5 16.5L16 25L13.5 16.5L5 14L13.5 11.5L16 3Z" fill="#FED053" stroke="#B87B00" strokeWidth="1.5" />
          <circle cx="24" cy="7" r="1.5" fill="#FED053" />
        </g>
      )}

      {/* Compass / Exploration Glyph */}
      {iconKey === 'compass' && (
        <g id="icon-compass">
          <circle cx="16" cy="16" r="12" fill="#FAF2DC" stroke="#4A2E18" strokeWidth="2" />
          <polygon points="16,6 19,15 16,13 13,15" fill="#E54B4B" stroke="#941E1E" strokeWidth="1" />
          <polygon points="16,26 19,17 16,19 13,17" fill="#4A2E18" stroke="#2A1708" strokeWidth="1" />
        </g>
      )}

      {/* Default Leaf Glyph */}
      {iconKey === 'leaf' && (
        <g id="icon-leaf">
          <path d="M7 25C7 25 10 13 22 7C22 7 25 19 15 25C11 27 7 25 7 25Z" fill="#7DA333" stroke="#4C651E" strokeWidth="2" />
          <path d="M7 25L18 14" stroke="#4C651E" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
