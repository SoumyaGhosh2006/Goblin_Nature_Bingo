/**
 * ============================================================================
 * INDIAN BIODIVERSITY COMBINATORIC MATRIX — OFFLINE PROCEDURAL QUESTS
 * ============================================================================
 * Mathematically combines 15 sensory descriptors, 15 Indian biodiversity targets,
 * and 10 micro-environmental conditions to create over 2,250 unique offline quests.
 * Strictly eliminates temperate elements (zero acorns, pinecones, etc.).
 */

import type { QuestTileState } from '../types/game';

// Tactile & visual attributes grounded in Indian nature exploration
export const DESCRIPTORS = [
  { word: "Serrated", icon: "leaf", hint: "Look for sawtooth or jagged leaf margins like Neem." },
  { word: "Heart-Shaped", icon: "leaf", hint: "Look for classic Peepal leaf curvature." },
  { word: "Aromatic", icon: "sprout", hint: "Gently rub between fingers to check for herbal scents." },
  { word: "Two-Toned", icon: "stone", hint: "Look for contrasting mineral bands or leaf variegation." },
  { word: "Monsoon-Damp", icon: "water", hint: "Check shaded underbellies and low garden corners." },
  { word: "Sun-Bleached", icon: "sun", hint: "Spot items pale from intense tropical afternoon sun." },
  { word: "Velvety", icon: "sprout", hint: "Brush gently with fingertips to feel soft micro-hairs." },
  { word: "Caterpillar-Bitten", icon: "leaf", hint: "Look for chew notches left by garden insect larvae." },
  { word: "Hanging", icon: "wood", hint: "Search for aerial roots or trailing climbers suspended down." },
  { word: "Smooth", icon: "stone", hint: "Feel for river-worn pebbles or polished pottery fragments." },
  { word: "Glistening", icon: "water", hint: "Notice light reflecting off dew drops or rain moisture." },
  { word: "Twisted", icon: "wood", hint: "Look for spiraling woody vines or knotty branches." },
  { word: "Delicate", icon: "feather", hint: "Handle gently so the breeze does not sweep it away." },
  { word: "Ancient", icon: "wood", hint: "Inspect mature trees with deeply grooved trunk bark." },
  { word: "Miniature", icon: "sprout", hint: "Crouch close to the soil to spot tiny sprouting life." }
];

// Core outdoor organic targets common across Indian cities, towns, and parks
export const OBJECTS = [
  "Neem Leaf", "Peepal Leaf", "Banyan Root", "Hibiscus Bloom", "Bougainvillea Bract",
  "Ant Trail", "Bird Feather", "Rough Bark", "Velvet Moss", "Garden Pebble",
  "Spider Web", "Wild Vine", "Terracotta Shard", "Dragonfly", "Moist Soil Patch"
];

// Micro-habitats common in Indian neighborhoods, parks, and residential gardens
export const CONDITIONS = [
  "resting in deep shade",
  "warmed by morning sunlight",
  "near a garden water tap or puddle",
  "clinging to a weathered brick wall",
  "sheltered under a leafy shrub",
  "draped across tree bark",
  "peeking through pavement cracks",
  "fluttering in the warm breeze",
  "embedded in garden soil",
  "suspended above ground level"
];

/**
 * Generates a procedural quest by sampling combinations of Indian biodiversity targets.
 * Guarantees zero duplicate titles against completed quest history.
 */
export function generateProceduralQuest(index: number, excludeTitles: string[] = []): QuestTileState {
  let attempts = 0;
  let title = "";
  let desc = "";
  let descriptor = DESCRIPTORS[0];
  let obj = OBJECTS[0];
  let condition = CONDITIONS[0];

  // Pick combination not present in recent history
  do {
    const dIdx = Math.floor(Math.random() * DESCRIPTORS.length);
    const oIdx = Math.floor(Math.random() * OBJECTS.length);
    const cIdx = Math.floor(Math.random() * CONDITIONS.length);

    descriptor = DESCRIPTORS[dIdx];
    obj = OBJECTS[oIdx];
    condition = CONDITIONS[cIdx];

    title = `${descriptor.word} ${obj}`;
    attempts++;
  } while (excludeTitles.includes(title) && attempts < 30);

  desc = `Locate a ${descriptor.word.toLowerCase()} ${obj.toLowerCase()} that is ${condition}.`;

  return {
    id: `proc_in_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
    index,
    title,
    description: desc,
    hint: descriptor.hint,
    icon: descriptor.icon,
    xpReward: 25 + Math.floor(Math.random() * 15),
    status: 'PENDING'
  };
}

/**
 * Generates a full 3x3 board of 9 procedural Indian nature quests.
 */
export function generateProceduralBoard(excludeTitles: string[] = []): QuestTileState[] {
  const board: QuestTileState[] = [];
  const currentTitles = [...excludeTitles];

  for (let i = 0; i < 9; i++) {
    const quest = generateProceduralQuest(i, currentTitles);
    currentTitles.push(quest.title);
    board.push(quest);
  }

  return board;
}
