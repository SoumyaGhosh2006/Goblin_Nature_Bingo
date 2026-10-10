/**
 * ============================================================================
 * INDIAN BIODIVERSITY STARTER QUEST SEED POOL — GOBLIN NATURE BINGO
 * ============================================================================
 * Curated collection of authentic outdoor quests tailored specifically to
 * Indian urban, suburban, and rural biodiversity (parks, gardens, roadsides).
 * Maps directly to our 10 handcrafted ink-wash botanical and wildlife species.
 */

import type { QuestTileState } from '../types/game';

export const STARTER_QUEST_POOL: Omit<QuestTileState, 'index' | 'status'>[] = [
  {
    id: "peepal_drip_tip",
    title: "Peepal Leaf",
    description: "Find a sacred Peepal leaf with its iconic cordate heart shape and graceful rain drip tip.",
    hint: "Look under old roadside trees or along brick walls where young saplings take root.",
    icon: "peepal",
    xpReward: 35
  },
  {
    id: "serrated_neem",
    title: "Neem Leaflet",
    description: "Find a jagged, serrated-edged Neem leaflet spray. Gently smell its distinct herbal aroma.",
    hint: "Neem trees shade many residential avenues and parks across India.",
    icon: "neem",
    xpReward: 30
  },
  {
    id: "banyan_prop_root",
    title: "Banyan Root",
    description: "Find a woody aerial prop root hanging from a majestic Banyan tree, or leathery canopy leaf.",
    hint: "Older parks and public temple grounds feature sprawling Banyan canopies with fibrous aerial tendrils.",
    icon: "banyan",
    xpReward: 40
  },
  {
    id: "bougainvillea_bloom",
    title: "Paper Flower",
    description: "Find a vibrant Bougainvillea flower cluster with delicate paper-thin magenta bracts.",
    hint: "Look along garden fences, compound boundary walls, and ornamental trellises.",
    icon: "bougainvillea",
    xpReward: 25
  },
  {
    id: "crimson_hibiscus",
    title: "Wild Hibiscus",
    description: "Find a flared scarlet or golden Hibiscus bloom with its long prominent pollen stamen column.",
    hint: "Common in home gardens and temple walkways throughout India.",
    icon: "hibiscus",
    xpReward: 35
  },
  {
    id: "sunbathing_girgit",
    title: "Garden Lizard",
    description: "Spot a crested garden lizard (Girgit) basking motionless in the sunlight on a dry stone or branch.",
    hint: "Scan sunny compound walls, fence posts, and dry hedges without making sudden movements.",
    icon: "girgit",
    xpReward: 45
  },
  {
    id: "monsoon_dragonfly",
    title: "Monsoon Dragonfly",
    description: "Locate a resting dragonfly with gossamer lattice wings perched near moist leaves or grass.",
    hint: "Scan garden pond borders, monsoon puddles, and tall grass tips where dragonflies hover.",
    icon: "dragonfly",
    xpReward: 40
  },
  {
    id: "ant_highway",
    title: "Weaver Ant Trail",
    description: "Locate a busy trail of weaver ants or black garden ants marching tandem along bark or stone.",
    hint: "Follow tree trunks, cracked garden pathways, or shady brick borders.",
    icon: "weaver_ants",
    xpReward: 35
  },
  {
    id: "brick_moss",
    title: "Monsoon Moss",
    description: "Find a soft, velvety carpet of emerald bryophyte moss clinging to a damp brick wall or tree base.",
    hint: "Touch it with your fingertips! Feel the damp, cool cushion in shaded crevices.",
    icon: "monsoon_moss",
    xpReward: 30
  },
  {
    id: "riverbed_quartz",
    title: "Quartz Pebble",
    description: "Find a smooth, water-rounded riverbed quartz stone with natural mineral fracture lines.",
    hint: "Check gravel park trails, potted plant drainage beds, and garden rockeries.",
    icon: "quartz_stone",
    xpReward: 30
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
