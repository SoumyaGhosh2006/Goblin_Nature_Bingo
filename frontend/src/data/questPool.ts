/**
 * ============================================================================
 * INDIAN BIODIVERSITY STARTER QUEST SEED POOL — GOBLIN NATURE BINGO
 * ============================================================================
 * Curated collection of authentic outdoor quests tailored specifically to
 * Indian urban, suburban, and rural biodiversity (parks, gardens, roadsides).
 * Strictly excludes temperate non-native items (no acorns, pinecones, etc.).
 */

import type { QuestTileState } from '../types/game';

export const STARTER_QUEST_POOL: Omit<QuestTileState, 'index' | 'status'>[] = [
  {
    id: "peepal_drip_tip",
    title: "Peepal Leaf",
    description: "Find a sacred Peepal leaf with its iconic heart shape and long slender drip tip.",
    hint: "Look under old roadside trees or along brick walls where young saplings take root.",
    icon: "leaf",
    xpReward: 35
  },
  {
    id: "serrated_neem",
    title: "Neem Leaf",
    description: "Find a jagged, serrated-edged Neem leaf. Gently smell its distinct herbal aroma.",
    hint: "Neem trees shade many residential lanes and parks across India.",
    icon: "sprout",
    xpReward: 30
  },
  {
    id: "ant_highway",
    title: "Ant Highway",
    description: "Locate a busy trail of black garden ants or red tree ants marching purposefully.",
    hint: "Follow tree trunks, cracked garden pavements, or damp brick edges.",
    icon: "insect",
    xpReward: 35
  },
  {
    id: "bougainvillea_bloom",
    title: "Paper Flower",
    description: "Find a vibrant Bougainvillea flower cluster with delicate paper-thin bracts.",
    hint: "Look along garden fences, compound walls, and colorful ornamental bushes.",
    icon: "sprout",
    xpReward: 25
  },
  {
    id: "sunbathing_girgit",
    title: "Garden Lizard",
    description: "Spot a garden lizard (Girgit) basking motionless in the sunlight on a stone or branch.",
    hint: "Scan sunny boundary walls and dry shrubs without making sudden movements.",
    icon: "insect",
    xpReward: 45
  },
  {
    id: "urban_feather",
    title: "Bird Feather",
    description: "Find a fallen feather dropped by an Indian rock pigeon, glossy crow, or myna.",
    hint: "Check gravel paths, grassy park borders, and beneath shady tree perches.",
    icon: "feather",
    xpReward: 30
  },
  {
    id: "crimson_hibiscus",
    title: "Hibiscus Flower",
    description: "Find a vibrant red, pink, or yellow Hibiscus bloom with its prominent pollen column.",
    hint: "Common in home gardens and temple boundaries throughout India.",
    icon: "sprout",
    xpReward: 35
  },
  {
    id: "brick_moss",
    title: "Velvet Moss",
    description: "Find a soft, damp carpet of green moss clinging to an old brick wall or moist bark.",
    hint: "Touch it with your fingertips! Feel the damp, cool texture in shaded corners.",
    icon: "sprout",
    xpReward: 30
  },
  {
    id: "caterpillar_bite",
    title: "Munched Leaf",
    description: "Find a leaf that survived a feast, showing round notches bitten out by a caterpillar.",
    hint: "Inspect the undersides of tender shrub leaves away from direct noon heat.",
    icon: "leaf",
    xpReward: 35
  },
  {
    id: "banyan_root",
    title: "Banyan Root",
    description: "Find an aerial prop root hanging from a Banyan tree branch, or a broad leathery leaf.",
    hint: "Older parks and public avenues often feature sprawling Banyan canopies.",
    icon: "wood",
    xpReward: 40
  },
  {
    id: "sacred_tulsi",
    title: "Scented Tulsi",
    description: "Find a Holy Basil (Tulsi) plant or aromatic herbal leaf. Gently rub and inhale.",
    hint: "Found in courtyards, balcony planters, and traditional garden beds.",
    icon: "sprout",
    xpReward: 30
  },
  {
    id: "sunbeam_canopy",
    title: "Sunbeam Spot",
    description: "Capture a beam of warm sunlight filtering through lush tropical leaves.",
    hint: "Look up towards the leafy tree canopy where morning sun cuts through foliage.",
    icon: "sun",
    xpReward: 35
  }
];

/**
 * Returns a ready-to-play initial 3x3 Bingo grid from the Indian nature pool.
 */
export function getInitialSeedBoard(): QuestTileState[] {
  return STARTER_QUEST_POOL.slice(0, 9).map((quest, index) => ({
    ...quest,
    index,
    status: 'PENDING'
  }));
}
