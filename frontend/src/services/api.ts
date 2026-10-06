/**
 * ============================================================================
 * UNIFIED VERIFICATION API CLIENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Dispatches verification payloads to either the local FastAPI server
 * (via Cloudflare Tunnel), directly to the Groq Open-Weight API in Trail Mode,
 * or gracefully queues into IndexedDB if network is offline.
 */

import type { VerificationRequest, VerificationResponse } from '../types/game';
import { queuePendingVerification } from '../hooks/useIndexedDB';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

/**
 * Direct call to Groq Cloud API for open-weight Llama-3.2-Vision inference
 * when out on the trail and the home laptop is turned off.
 */
async function verifyWithGroqDirect(req: VerificationRequest): Promise<VerificationResponse> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are Grimble, a witty goblin naturalist refereeing a nature scavenger hunt.
The quest is: "${req.quest_title}" (${req.quest_description}).
Analyze the image. Does it match?
Return ONLY valid raw JSON with no markdown formatting:
{
  "passed": boolean,
  "confidence": number,
  "goblin_critique": string,
  "woodland_xp": number,
  "sensory_bonus": string
}`
            },
            {
              type: 'image_url',
              image_url: { url: req.image_base64 }
            }
          ]
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices[0]?.message?.content || '{}';

  // Sanitize potential code fences
  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    passed: Boolean(parsed.passed),
    confidence: Number(parsed.confidence || 0.8),
    goblin_critique: parsed.goblin_critique || "Grimble inspected your find with a squinting eye!",
    woodland_xp: parsed.passed ? Number(parsed.woodland_xp || 30) : 0,
    sensory_bonus: parsed.sensory_bonus || "Take three deep woodland breaths.",
    audio_base64: null,
    engine_used: 'groq:llama-3.2-11b-vision-preview'
  };
}

/**
 * Main verification dispatcher with automatic offline queue fallback.
 */
export async function verifyQuestSubmission(
  req: VerificationRequest,
  tileIndex: number,
  rawBlob: Blob,
  forceTrailMode: boolean = false
): Promise<VerificationResponse | { queued: true }> {
  // Cap client timeout at 12 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    if (forceTrailMode && GROQ_API_KEY) {
      const groqRes = await verifyWithGroqDirect(req);
      clearTimeout(timeoutId);
      return groqRes;
    }

    const response = await fetch(`${API_BASE}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend returned HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Network verification failed or timed out. Stashing in offline Pending Bag:', error);

    // Stash in IndexedDB pending queue
    await queuePendingVerification({
      id: `pending_${Date.now()}_${tileIndex}`,
      tileIndex,
      questId: req.quest_id,
      questTitle: req.quest_title,
      questDescription: req.quest_description,
      imageBlob: rawBlob,
      capturedAt: Date.now()
    });

    return { queued: true };
  }
}
