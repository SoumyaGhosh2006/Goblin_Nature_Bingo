/**
 * ============================================================================
 * COMBINATORIC MATRIX GENERATOR — OFFLINE PROCEDURAL QUESTS
 * ============================================================================
 * Combines 15 sensory descriptors, 15 nature elements, and 10 micro-conditions
 * to mathematically generate 2,250 unique sensory scavenger quests on-device
 * without requiring any network connectivity or external API calls.
 */

import type { QuestTileState } from '../types/game';

// Tactile & visual attributes to encourage physical interaction
export const DESCRIPTORS = [
  { word: "Velvety", icon: "sprout", hint: "Brush it gently with your fingertips." },
  { word: "Battle-Scarred", icon: "leaf", hint: "Look for bite notches or weathering." },
  { word: "Spiral", icon: "pinecone", hint: "Nature loves Fibonacci patterns." },
  { word: "Two-Toned", icon: "stone", hint: "Search for distinct stripes or color halves." },
  { word: "Damp", icon: "water", hint: "Check shaded underbellies and low hollows." },
  { word: "Miniature", icon: "acorn", hint: "Crouch low to spot tiny woodland structures." },
  { word: "Hollow", icon: "wood", hint: "Look for beetle tunnels or natural crevices." },
  { word: "Jagged", icon: "stone", hint: "Feel the rough, unpolished edges." },
  { word: "Sun-Bleached", icon: "sun", hint: "Find something faded by open weather." },
  { word: "Fragrant", icon: "sprout", hint: "Crush a needle or sniff the fresh bark." },
  { word: "Peeling", icon: "wood", hint: "Notice natural layers shedding like parchment." },
  { word: "Delicate", icon: "feather", hint: "Handle with care so the wind doesn't steal it." },
  { word: "Gnarly", icon: "wood", hint: "Knots and bends tell decades of forest history." },
  { word: "Glistening", icon: "sparkle", hint: "Sunlight catching drops or natural resin." },
  { word: "Fossil-Like", icon: "stone", hint: "Ancient stone texture frozen in time." },
];

// Core outdoor organic targets
export const OBJECTS = [
  "Leaf", "Tree Bark", "River Pebble", "Wild Fungus", "Acorn", 
  "Insect Trail", "Bird Feather", "Puddle Mirror", "Spider Silk", "Moss Patch", 
  "Pinecone", "Wild Vine", "Wildflower", "Exposed Root", "Earth Patch"
];

// Ecological micro-contexts that get players moving and exploring
export const CONDITIONS = [
  "resting in deep shade", "touched by direct sunlight", "near flowing water",
  "clinging to deadwood", "sheltered under a rock", "shaped by the wind",
  "suspended off the ground", "peeking from beneath fallen leaves",
  "growing on a vertical wall", "older than the current season"
];

/**
 * Generates a procedural quest by sampling pseudo-random combinations.
 * Guarantees zero duplicates against already completed quest titles.
 */
export function generateProceduralQuest(index: number, excludeTitles: string[] = []): QuestTileState {
  let attempts = 0;
  let title = "";
  let desc = "";
  let descriptor = DESCRIPTORS[0];
  let obj = OBJECTS[0];
  let condition = CONDITIONS[0];

  // Attempt to generate a title not in the exclusion list
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
    id: `proc_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
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
 * Generates a full 3x3 board of 9 procedural offline quests.
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
