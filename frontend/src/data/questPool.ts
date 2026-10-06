/**
 * ============================================================================
 * STARTER QUEST SEED POOL — GOBLIN NATURE BINGO
 * ============================================================================
 * Curated initial collection of 20 high-quality sensory outdoor quests.
 * Used for instant cold-start launch before AI or procedural generators fire.
 */

import type { QuestTileState } from '../types/game';

export const STARTER_QUEST_POOL: Omit<QuestTileState, 'index' | 'status'>[] = [
  {
    id: "battle_leaf",
    title: "Battle Leaf",
    description: "Find a leaf that survived a battle with a caterpillar or insect.",
    hint: "Look under shaded bush leaves where hungry critters graze away from the sun.",
    icon: "insect",
    xpReward: 35
  },
  {
    id: "ancient_velvet",
    title: "Ancient Velvet",
    description: "Find a patch of soft, velvety green moss growing on wood or rock.",
    hint: "Touch it with your fingertips! Feel the damp, cool carpet.",
    icon: "sprout",
    xpReward: 30
  },
  {
    id: "nature_marble",
    title: "Nature Marble",
    description: "Find a remarkably round acorn, pebble, or wild seed pod.",
    hint: "Roll it between your palms. Does it feel smooth or textured?",
    icon: "acorn",
    xpReward: 25
  },
  {
    id: "bark_armor",
    title: "Bark Armor",
    description: "Find tree bark featuring deep, rough grooves or geometric armor scales.",
    hint: "Look at mature hardwoods. Old oak and pine wear heavy battle armor.",
    icon: "wood",
    xpReward: 30
  },
  {
    id: "micro_forest",
    title: "Micro Forest",
    description: "Find a tiny patch of ground that looks like a miniature fantasy jungle.",
    hint: "Get your eyes down to ground level next to an old fallen branch.",
    icon: "mushroom",
    xpReward: 40
  },
  {
    id: "sunbeam_spot",
    title: "Sunbeam Spot",
    description: "Capture a distinct beam of sunlight piercing through foliage.",
    hint: "Look up towards the tree canopy where light filters through morning leaves.",
    icon: "sun",
    xpReward: 35
  },
  {
    id: "two_tone_stone",
    title: "Two-Tone Stone",
    description: "Find a single pebble or rock displaying two distinct colors or stripes.",
    hint: "Stream beds and gravel paths often hide metamorphic mineral stripes.",
    icon: "stone",
    xpReward: 30
  },
  {
    id: "curious_fungus",
    title: "Curious Fungus",
    description: "Find a wild mushroom, bracket fungus on a trunk, or colorful lichen.",
    hint: "Never touch or eat wild mushrooms; simply observe their bizarre architecture!",
    icon: "mushroom",
    xpReward: 45
  },
  {
    id: "ant_highway",
    title: "Ant Highway",
    description: "Locate a busy trail of insects marching purposefully on dirt or bark.",
    hint: "Follow the base of tall trees or cracks along a stone wall.",
    icon: "insect",
    xpReward: 35
  }
];

/**
 * Returns a ready-to-play initial 3x3 Bingo grid from the starter pool.
 */
export function getInitialSeedBoard(): QuestTileState[] {
  return STARTER_QUEST_POOL.slice(0, 9).map((quest, index) => ({
    ...quest,
    index,
    status: 'PENDING'
  }));
}
