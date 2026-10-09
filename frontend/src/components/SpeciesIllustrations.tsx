/**
 * ============================================================================
 * HANDCRAFTED INK-WASH BOTANICAL & WILDLIFE VECTOR SKETCHES
 * ============================================================================
 * Bespoke scientific field-journal illustrations for 10 authentic Indian
 * species. Rendered with fine organic ink outlines, anatomical stippling,
 * botanical cross-hatching, and multi-stop watercolor wash gradient fills.
 *
 * Species Catalog:
 * 1. Neem (Azadirachta indica)
 * 2. Peepal (Ficus religiosa)
 * 3. Banyan (Ficus benghalensis)
 * 4. Bougainvillea (Bougainvillea spectabilis)
 * 5. Hibiscus (Hibiscus rosa-sinensis)
 * 6. Girgit (Calotes versicolor - Oriental Garden Lizard)
 * 7. Monsoon Dragonfly (Pantala flavescens)
 * 8. Weaver Ants (Oecophylla smaragdina)
 * 9. Monsoon Moss Cushion (Bryum)
 * 10. Riverbed Quartz Stone
 */

import React from 'react';

export type SpeciesKey =
  | 'neem'
  | 'peepal'
  | 'banyan'
  | 'bougainvillea'
  | 'hibiscus'
  | 'girgit'
  | 'dragonfly'
  | 'weaver_ants'
  | 'monsoon_moss'
  | 'quartz_stone';

export interface SpeciesTaxonomy {
  commonName: string;
  scientificName: string;
  habitat: 'canopy' | 'forest_floor' | 'garden' | 'wetland' | 'rocky';
  fieldNote: string;
}

export const SPECIES_REGISTRY: Record<SpeciesKey, SpeciesTaxonomy> = {
  neem: {
    commonName: 'Neem Leaflet Spray',
    scientificName: 'Azadirachta indica',
    habitat: 'canopy',
    fieldNote: 'Serrated sickle leaflets; bitter aromatic medicinal defense.'
  },
  peepal: {
    commonName: 'Sacred Peepal Leaf',
    scientificName: 'Ficus religiosa',
    habitat: 'canopy',
    fieldNote: 'Cordate heart shape with elegant rain-shedding drip tip.'
  },
  banyan: {
    commonName: 'Banyan Pillar Roots',
    scientificName: 'Ficus benghalensis',
    habitat: 'canopy',
    fieldNote: 'Woody pillar prop roots with fibrous hanging air tendrils.'
  },
  bougainvillea: {
    commonName: 'Paper Bougainvillea',
    scientificName: 'Bougainvillea spectabilis',
    habitat: 'garden',
    fieldNote: 'Papery magenta floral bracts with central starry cream florets.'
  },
  hibiscus: {
    commonName: 'Wild Scarlet Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    habitat: 'garden',
    fieldNote: 'Five flared ruffled petals with prominent golden pollen stamen.'
  },
  girgit: {
    commonName: 'Crested Garden Lizard',
    scientificName: 'Calotes versicolor',
    habitat: 'garden',
    fieldNote: 'Spiny dorsal crest and watchful golden iris on sunlit branches.'
  },
  dragonfly: {
    commonName: 'Monsoon Wanderer Dragonfly',
    scientificName: 'Pantala flavescens',
    habitat: 'wetland',
    fieldNote: 'Slender amber thorax and gossamer vein cell network.'
  },
  weaver_ants: {
    commonName: 'Weaver Ant Trail',
    scientificName: 'Oecophylla smaragdina',
    habitat: 'forest_floor',
    fieldNote: 'Tandem silk-weaving workers patrolling foraging territory.'
  },
  monsoon_moss: {
    commonName: 'Monsoon Velvet Moss',
    scientificName: 'Bryum argenteum',
    habitat: 'forest_floor',
    fieldNote: 'Dense moisture-trapping cushion with upright spore capsules.'
  },
  quartz_stone: {
    commonName: 'Riverbed Quartz Pebble',
    scientificName: 'Silica Mineraloid',
    habitat: 'rocky',
    fieldNote: 'Water-smoothed monsoon stone with micro crystal fracture veins.'
  }
};

interface SpeciesIllustrationProps {
  species: SpeciesKey;
  size?: number | string;
  className?: string;
  showTaxonomy?: boolean;
}

export const SpeciesIllustration: React.FC<SpeciesIllustrationProps> = ({
  species,
  size = 54,
  className = '',
  showTaxonomy = false
}) => {
  const taxonomy = SPECIES_REGISTRY[species] || SPECIES_REGISTRY.neem;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Handcrafted Ink & Watercolor SVG Specimen Artwork */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible drop-shadow-sm filter"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Watercolor Bleed Gradients */}
          <linearGradient id="neemWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9BC244" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#6C9A2A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#436815" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="peepalWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A8D558" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#6EAA2B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3B6F17" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="banyanWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A5A36" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#5E381C" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3D210E" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="bougWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F44E82" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#D8235E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9C1140" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="hibiscusWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F23E3E" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#D92121" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8F1010" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="girgitWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D6A838" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#8B9E3A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4C6826" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="dragonflyWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F3FA" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#A8D6EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#78B9DA" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="antWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E27329" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#B34C11" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#702B04" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="mossWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#85BA35" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#558C1B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2E5C0D" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="stoneWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5DFD3" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#B8AF9F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7E7567" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. NEEM (Azadirachta indica) — Compound Pinnate Leaflet Spray */}
        {/* ============================================================== */}
        {species === 'neem' && (
          <g id="neem-specimen">
            {/* Central rachis stem */}
            <path
              d="M18 84 Q 45 55, 82 18"
              stroke="#2A1B0E"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left leaflet pairs with serrations */}
            <path
              d="M32 68 C 18 64, 14 52, 22 46 C 30 52, 34 60, 36 64 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M22 52 L 29 59" stroke="#1C140A" strokeWidth="0.8" opacity="0.6" />
            <path
              d="M46 54 C 32 48, 28 36, 38 30 C 46 36, 48 46, 50 50 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M36 37 L 44 45" stroke="#1C140A" strokeWidth="0.8" opacity="0.6" />
            <path
              d="M60 40 C 48 34, 46 22, 54 16 C 62 22, 64 32, 64 36 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Right leaflet pairs */}
            <path
              d="M40 74 C 54 78, 62 70, 56 60 C 48 64, 44 70, 40 74 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M54 60 C 68 62, 74 52, 66 44 C 60 48, 56 54, 54 60 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Terminal leaflet */}
            <path
              d="M74 26 C 84 18, 88 12, 85 15 C 80 24, 76 28, 74 26 Z"
              fill="url(#neemWash)"
              stroke="#1C140A"
              strokeWidth="1.3"
            />
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. PEEPAL (Ficus religiosa) — Cordate Leaf with Drip Tip       */}
        {/* ============================================================== */}
        {species === 'peepal' && (
          <g id="peepal-specimen">
            {/* Petiole stalk */}
            <path d="M50 92 Q 49 78, 50 68" stroke="#332212" strokeWidth="2.4" strokeLinecap="round" />
            {/* Broad heart blade tapering into dramatic slender drip tip */}
            <path
              d="M50 68 C 22 68, 14 42, 30 26 C 42 14, 47 18, 50 4 C 53 18, 58 14, 70 26 C 86 42, 78 68, 50 68 Z"
              fill="url(#peepalWash)"
              stroke="#1F150B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Primary midrib extending right to the drip tip apex */}
            <path d="M50 68 Q 50 30, 50 6" stroke="#1F150B" strokeWidth="1.6" fill="none" />
            {/* Elegant secondary arched lateral veins */}
            <path d="M50 56 Q 36 50, 24 44" stroke="#1F150B" strokeWidth="1" opacity="0.75" />
            <path d="M50 56 Q 64 50, 76 44" stroke="#1F150B" strokeWidth="1" opacity="0.75" />
            <path d="M50 44 Q 38 38, 28 32" stroke="#1F150B" strokeWidth="1" opacity="0.75" />
            <path d="M50 44 Q 62 38, 72 32" stroke="#1F150B" strokeWidth="1" opacity="0.75" />
            <path d="M50 32 Q 42 26, 36 20" stroke="#1F150B" strokeWidth="0.9" opacity="0.7" />
            <path d="M50 32 Q 58 26, 64 20" stroke="#1F150B" strokeWidth="0.9" opacity="0.7" />
            {/* Delicate cross-veinlet stippling */}
            <circle cx="42" cy="46" r="0.6" fill="#1F150B" opacity="0.5" />
            <circle cx="58" cy="46" r="0.6" fill="#1F150B" opacity="0.5" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. BANYAN (Ficus benghalensis) — Woody Aerial Prop Roots      */}
        {/* ============================================================== */}
        {species === 'banyan' && (
          <g id="banyan-specimen">
            {/* Heavy parent canopy bough */}
            <path
              d="M12 24 Q 50 20, 88 26"
              stroke="#2B1A0D"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Main descending pillar root trunks */}
            <path
              d="M32 26 Q 30 52, 28 88"
              stroke="url(#banyanWash)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M66 25 Q 68 54, 70 88"
              stroke="url(#banyanWash)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Secondary twisting aerial roots and tendrils */}
            <path
              d="M48 24 Q 45 48, 52 74 Q 55 84, 52 88"
              stroke="#4A2F17"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M24 38 Q 20 60, 22 84"
              stroke="#5E381C"
              strokeWidth="2.2"
              fill="none"
            />
            <path
              d="M76 42 Q 80 62, 78 86"
              stroke="#5E381C"
              strokeWidth="2.2"
              fill="none"
            />
            {/* Hanging fibrous root tips */}
            <path d="M40 40 Q 38 65, 41 82" stroke="#7A4C24" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
            <path d="M58 45 Q 61 68, 59 84" stroke="#7A4C24" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
            {/* Botanical bark cross-hatch shading */}
            <path d="M29 44 L 35 46 M28 58 L 34 60 M67 40 L 73 42" stroke="#1C1006" strokeWidth="1" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. BOUGAINVILLEA — Papery Magenta Bracts with Cream Florets   */}
        {/* ============================================================== */}
        {species === 'bougainvillea' && (
          <g id="bougainvillea-specimen">
            {/* Slender stem with thorn */}
            <path d="M30 88 Q 42 70, 50 58" stroke="#332212" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 74 L 44 72" stroke="#332212" strokeWidth="1.8" strokeLinecap="round" />
            {/* Trio of paper-thin floral bracts */}
            <path
              d="M50 54 C 30 50, 20 32, 34 18 C 48 20, 52 38, 50 54 Z"
              fill="url(#bougWash)"
              stroke="#210811"
              strokeWidth="1.5"
            />
            <path
              d="M52 54 C 68 56, 82 42, 74 24 C 60 22, 54 36, 52 54 Z"
              fill="url(#bougWash)"
              stroke="#210811"
              strokeWidth="1.5"
            />
            <path
              d="M50 56 C 42 72, 60 82, 68 70 C 66 58, 58 54, 50 56 Z"
              fill="url(#bougWash)"
              stroke="#210811"
              strokeWidth="1.5"
            />
            {/* Delicate translucent bract venation */}
            <path d="M34 18 Q 42 34, 50 54" stroke="#5E0B25" strokeWidth="0.9" fill="none" />
            <path d="M74 24 Q 64 38, 52 54" stroke="#5E0B25" strokeWidth="0.9" fill="none" />
            {/* Central tubular cream starry florets */}
            <circle cx="50" cy="48" r="3.5" fill="#FAF2DC" stroke="#8A5A18" strokeWidth="1" />
            <polygon points="50,44 51.5,47 54,47 52,49 53,52 50,50 47,52 48,49 46,47 48.5,47" fill="#FDB813" />
            <circle cx="56" cy="46" r="2.8" fill="#FAF2DC" stroke="#8A5A18" strokeWidth="0.8" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 5. HIBISCUS (Rosa-sinensis) — Scarlet Petals & Stamen Column  */}
        {/* ============================================================== */}
        {species === 'hibiscus' && (
          <g id="hibiscus-specimen">
            <path d="M22 88 Q 36 72, 48 58" stroke="#2B1A0D" strokeWidth="2.2" strokeLinecap="round" />
            {/* Five ruffled flared scarlet petals */}
            <path
              d="M48 58 C 30 64, 16 50, 24 34 C 36 34, 44 46, 48 58 Z"
              fill="url(#hibiscusWash)"
              stroke="#240707"
              strokeWidth="1.5"
            />
            <path
              d="M48 58 C 42 40, 48 20, 64 22 C 72 34, 62 48, 48 58 Z"
              fill="url(#hibiscusWash)"
              stroke="#240707"
              strokeWidth="1.5"
            />
            <path
              d="M48 58 C 66 52, 82 58, 80 74 C 64 80, 54 68, 48 58 Z"
              fill="url(#hibiscusWash)"
              stroke="#240707"
              strokeWidth="1.5"
            />
            <path
              d="M48 58 C 36 74, 46 86, 60 84 C 58 72, 52 64, 48 58 Z"
              fill="url(#hibiscusWash)"
              stroke="#240707"
              strokeWidth="1.5"
            />
            {/* Protruding golden stamen column */}
            <path
              d="M48 58 Q 62 42, 78 26"
              stroke="#FDB813"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Golden pollen grains cluster */}
            <circle cx="78" cy="26" r="2.4" fill="#B87B00" />
            <circle cx="75" cy="23" r="1.5" fill="#FED053" />
            <circle cx="81" cy="28" r="1.5" fill="#FED053" />
            <circle cx="72" cy="30" r="1.4" fill="#FED053" />
            <circle cx="68" cy="34" r="1.4" fill="#FED053" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 6. GIRGIT (Calotes versicolor) — Crested Garden Lizard       */}
        {/* ============================================================== */}
        {species === 'girgit' && (
          <g id="girgit-specimen">
            {/* Weathered twig perch */}
            <path d="M12 76 Q 50 72, 88 78" stroke="#3D2614" strokeWidth="4.5" strokeLinecap="round" />
            {/* Long curling tail */}
            <path d="M26 62 Q 14 56, 12 40 Q 15 28, 24 34" stroke="#1F2A0E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            {/* Textured body and throat */}
            <ellipse cx="44" cy="58" rx="18" ry="10" transform="rotate(-18 44 58)" fill="url(#girgitWash)" stroke="#162007" strokeWidth="1.6" />
            {/* Triangular head with dorsal crest */}
            <path
              d="M58 48 C 64 42, 78 40, 82 46 C 76 54, 66 56, 58 54 Z"
              fill="url(#girgitWash)"
              stroke="#162007"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Spiny dorsal scales on neck and back */}
            <polygon points="56,44 58,40 60,45" fill="#D6A838" stroke="#162007" strokeWidth="0.8" />
            <polygon points="62,41 64,37 66,42" fill="#D6A838" stroke="#162007" strokeWidth="0.8" />
            <polygon points="68,39 70,35 72,40" fill="#D6A838" stroke="#162007" strokeWidth="0.8" />
            {/* Naturalist eye with black pupil */}
            <circle cx="72" cy="45" r="3.2" fill="#FAF2DC" stroke="#162007" strokeWidth="1" />
            <circle cx="73" cy="45" r="1.4" fill="#162007" />
            <circle cx="73.5" cy="44.2" r="0.5" fill="#FFFFFF" />
            {/* Claws gripping twig */}
            <path d="M38 66 L 36 74 M42 66 L 41 74 M54 62 L 53 73 M58 62 L 58 74" stroke="#162007" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 7. MONSOON DRAGONFLY — Amber Thorax & Gossamer Wing Lattice  */}
        {/* ============================================================== */}
        {species === 'dragonfly' && (
          <g id="dragonfly-specimen">
            {/* Slender segmented abdomen */}
            <path d="M50 32 L 50 86" stroke="#C97D1A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="86" r="1.2" fill="#241505" />
            {/* Segment rings */}
            <path d="M48 48 H 52 M48 56 H 52 M48 64 H 52 M48 72 H 52" stroke="#241505" strokeWidth="0.9" />
            {/* Thorax and head */}
            <ellipse cx="50" cy="28" rx="4.5" ry="6" fill="#8A520E" stroke="#241505" strokeWidth="1.5" />
            <circle cx="47" cy="22" r="3" fill="#3D6B26" stroke="#241505" strokeWidth="1" />
            <circle cx="53" cy="22" r="3" fill="#3D6B26" stroke="#241505" strokeWidth="1" />
            {/* Four gossamer wings with delicate cellular network */}
            {/* Left Forewing */}
            <ellipse cx="26" cy="26" rx="22" ry="6" transform="rotate(-15 26 26)" fill="url(#dragonflyWash)" stroke="#192833" strokeWidth="1.2" />
            <path d="M6 22 Q 26 26, 46 28" stroke="#192833" strokeWidth="0.8" />
            {/* Left Hindwing */}
            <ellipse cx="28" cy="38" rx="19" ry="6" transform="rotate(8 28 38)" fill="url(#dragonflyWash)" stroke="#192833" strokeWidth="1.2" />
            {/* Right Forewing */}
            <ellipse cx="74" cy="26" rx="22" ry="6" transform="rotate(15 74 26)" fill="url(#dragonflyWash)" stroke="#192833" strokeWidth="1.2" />
            <path d="M94 22 Q 74 26, 54 28" stroke="#192833" strokeWidth="0.8" />
            {/* Right Hindwing */}
            <ellipse cx="72" cy="38" rx="19" ry="6" transform="rotate(-8 72 38)" fill="url(#dragonflyWash)" stroke="#192833" strokeWidth="1.2" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 8. WEAVER ANTS (Oecophylla) — Tandem Marching Worker Trail    */}
        {/* ============================================================== */}
        {species === 'weaver_ants' && (
          <g id="weaver-ants-specimen">
            {/* Botanical pheromone branch trail */}
            <path d="M12 78 Q 45 50, 88 28" stroke="#422915" strokeWidth="2.8" strokeLinecap="round" />
            {/* Ant 1 (Lead Scout) */}
            <g transform="translate(62, 34) rotate(-32)">
              <ellipse cx="8" cy="0" rx="3.5" ry="2.2" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="0.9" />
              <ellipse cx="0" cy="0" rx="2.5" ry="1.8" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="0.9" />
              <ellipse cx="-7" cy="0" rx="5" ry="3.2" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="1" />
              <path d="M9 -1 L 14 -4 M9 1 L 14 4" stroke="#1C0A02" strokeWidth="0.8" />
              <path d="M0 -2 L -2 -6 M0 2 L -2 6 M-5 -3 L -7 -7 M-5 3 L -7 7" stroke="#1C0A02" strokeWidth="0.8" />
            </g>
            {/* Ant 2 (Trailing Worker carrying cut leaf) */}
            <g transform="translate(34, 52) rotate(-32)">
              <ellipse cx="8" cy="0" rx="3.2" ry="2" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="0.9" />
              <ellipse cx="0" cy="0" rx="2.4" ry="1.6" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="0.9" />
              <ellipse cx="-6" cy="0" rx="4.5" ry="3" fill="url(#antWash)" stroke="#1C0A02" strokeWidth="1" />
              <path d="M9 -1 L 13 -4 M9 1 L 13 4" stroke="#1C0A02" strokeWidth="0.8" />
              <path d="M0 -2 L -2 -5 M0 2 L -2 5" stroke="#1C0A02" strokeWidth="0.8" />
              {/* Green leaf disc held in mandibles */}
              <path d="M10 -2 C 16 -12, 22 -6, 14 2 Z" fill="#7DA333" stroke="#253D0A" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 9. MONSOON MOSS CUSHION — Velvety Bryophyte with Spore Urns   */}
        {/* ============================================================== */}
        {species === 'monsoon_moss' && (
          <g id="moss-specimen">
            {/* Velvet undulating moss base cushion */}
            <path
              d="M16 78 C 22 66, 34 68, 44 62 C 54 58, 64 64, 74 60 C 84 62, 88 74, 84 80 C 60 84, 40 82, 16 78 Z"
              fill="url(#mossWash)"
              stroke="#132405"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Microscopic upright setae (stalks) and capsule urns */}
            <path d="M30 66 Q 28 42, 34 32" stroke="#486B14" strokeWidth="1.2" fill="none" />
            <ellipse cx="35" cy="30" rx="2.5" ry="3.5" transform="rotate(18 35 30)" fill="#B5671B" stroke="#2E1B05" strokeWidth="0.9" />

            <path d="M48 60 Q 46 36, 52 24" stroke="#486B14" strokeWidth="1.2" fill="none" />
            <ellipse cx="53" cy="22" rx="2.5" ry="3.8" transform="rotate(22 53 22)" fill="#B5671B" stroke="#2E1B05" strokeWidth="0.9" />

            <path d="M66 62 Q 70 44, 68 34" stroke="#486B14" strokeWidth="1.2" fill="none" />
            <ellipse cx="67" cy="32" rx="2.4" ry="3.5" transform="rotate(-15 67 32)" fill="#B5671B" stroke="#2E1B05" strokeWidth="0.9" />

            {/* Dewdrop glistening on moss cushion */}
            <circle cx="58" cy="66" r="2.8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="58" cy="66" r="2.8" stroke="#4D7F8C" strokeWidth="0.8" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 10. RIVERBED QUARTZ STONE — Smooth Pebble with Fracture Veins */}
        {/* ============================================================== */}
        {species === 'quartz_stone' && (
          <g id="quartz-specimen">
            {/* Ground shadow */}
            <ellipse cx="50" cy="74" rx="36" ry="12" fill="#1C140A" opacity="0.25" />
            {/* Water-worn elliptical quartz boulder */}
            <path
              d="M20 54 C 20 34, 38 24, 60 26 C 78 28, 86 42, 82 60 C 78 72, 54 74, 34 70 C 22 66, 20 60, 20 54 Z"
              fill="url(#stoneWash)"
              stroke="#26221D"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Crystalline mineral fracture veins */}
            <path
              d="M36 34 Q 48 48, 64 52 Q 72 54, 78 50"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M44 44 Q 40 56, 46 64"
              stroke="#594F42"
              strokeWidth="1.2"
              fill="none"
              opacity="0.6"
            />
            {/* Subtle stippling dots */}
            <circle cx="34" cy="50" r="0.7" fill="#26221D" opacity="0.4" />
            <circle cx="52" cy="38" r="0.8" fill="#26221D" opacity="0.4" />
            <circle cx="68" cy="62" r="0.7" fill="#26221D" opacity="0.4" />
          </g>
        )}
      </svg>

      {/* Optional Taxonomy Label for Specimen Study View */}
      {showTaxonomy && (
        <div className="mt-1 text-center font-serif leading-tight">
          <span className="block text-[11px] font-bold text-amber-950 italic">
            {taxonomy.scientificName}
          </span>
          <span className="block text-[9px] font-semibold text-amber-900/80 uppercase tracking-wider">
            {taxonomy.commonName}
          </span>
        </div>
      )}
    </div>
  );
};
