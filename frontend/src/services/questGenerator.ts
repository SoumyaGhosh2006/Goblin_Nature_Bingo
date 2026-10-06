/**
 * ============================================================================
 * DUAL-ENGINE QUEST GENERATOR — GOBLIN NATURE BINGO
 * ============================================================================
 * Coordinates on-the-fly AI quest generation with the local backend/Groq,
 * seamlessly falling back to the 2,250-combination offline matrix if offline.
 */

import type { QuestTileState } from '../types/game';
import { generateProceduralBoard } from '../data/combinatoricMatrix';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generates 9 fresh quests avoiding previously seen titles.
 */
export async function fetchFreshBoard(excludeTitles: string[] = []): Promise<QuestTileState[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE}/api/quests/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        count: 9,
        exclude_quest_titles: excludeTitles
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.quests) && data.quests.length === 9) {
        return data.quests.map((q: any, index: number) => ({
          id: q.id || `ai_quest_${Date.now()}_${index}`,
          index,
          title: q.title,
          description: q.description,
          hint: q.hint,
          icon: q.icon || 'leaf',
          xpReward: q.xp_reward || 30,
          status: 'PENDING'
        }));
      }
    }
  } catch (err) {
    console.log('Online AI quest generation unavailable. Falling back to procedural matrix:', err);
  }

  // Resilient offline fallback using the combinatoric generator
  return generateProceduralBoard(excludeTitles);
}
