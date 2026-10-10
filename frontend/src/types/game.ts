/**
 * ============================================================================
 * GAME DATA TYPES & API CONTRACTS — GOBLIN NATURE BINGO
 * ============================================================================
 * Defines core state shapes, network payloads, and persistence models used
 * throughout the client-side game engine and verification pipeline.
 */

// Lifecycle states for an individual 3x3 Bingo grid tile
export type TileStatus = 'PENDING' | 'QUEUED' | 'VERIFYING' | 'COMPLETED';

/**
 * State representing a single quest tile on the 3x3 Bingo board.
 */
export interface QuestTileState {
  id: string;                 // Unique quest identifier (e.g., 'battle_leaf')
  index: number;              // Grid position (0 through 8)
  title: string;              // 2-3 word punchy display name
  description: string;        // Objective prompt for the player
  hint: string;               // Grimble's tactical outdoor advice
  icon: string;               // Visual emoji or icon key
  xpReward: number;           // Experience points awarded upon verification
  status: TileStatus;         // Current completion / queue state
  photoBlobId?: string;       // IndexedDB key for associated captured photo
  verifiedAt?: string;        // ISO timestamp of successful verification
  goblinCritique?: string;    // Humorous AI critique from Grimble
  sensoryBonus?: string;      // Mindfulness/sensory micro-challenge
}

/**
 * Global game state persisted across reloads in browser localStorage.
 */
export interface GameState {
  playerNickname: string;     // Guest username selected on onboarding
  playerLevel: number;        // Level based on total accumulated Woodland XP
  woodlandXP: number;         // Total experience points for the active monthly season
  acorns: number;             // Currency used for rerolling quests
  currentBoardId: string;     // UUID for tracking current 3x3 session
  activeTileIndex: number | null; // Currently selected quest for Focus Mode
  freeRerollsRemaining: number;   // Daily/board free rerolls before Acorn cost
  completedLines: number[];   // Indices of completed rows, cols, or diagonals
  completedQuestHistory: string[]; // Avoids AI generating duplicate quests
  tiles: QuestTileState[];    // The 9 active tiles on the current board
  leaderboardSeason?: string; // Active monthly season key (YYYY-MM), resets on the 1st of each month
}

/**
 * Payload sent to the backend / Groq vision verification endpoint.
 */
export interface VerificationRequest {
  quest_id: string;
  quest_title: string;
  quest_description: string;
  image_base64: string;       // Downscaled max 1024px JPEG data URL
  engine_override?: 'ollama' | 'groq';
  generate_voice?: boolean;
}

/**
 * Structured response returned by open-weight AI vision models.
 */
export interface VerificationResponse {
  passed: boolean;
  confidence: number;
  goblin_critique: string;
  woodland_xp: number;
  sensory_bonus: string;
  audio_base64: string | null;// ElevenLabs audio data or null if bypassed
  engine_used: string;
  trace_id?: string;
}

/**
 * Offline record stored in IndexedDB when on trails with zero cellular service.
 */
export interface PendingVerification {
  id: string;
  tileIndex: number;
  questId: string;
  questTitle: string;
  questDescription: string;
  imageBlob: Blob;
  capturedAt: number;
}

/**
 * Leaderboard record displayed on the "Hedge Foragers" ranking modal.
 */
export interface LeaderboardEntry {
  id: string;
  nickname: string;
  level: number;
  woodlandXP: number;
  bingosCompleted: number;
  lastActive: string;
  seasonKey?: string;         // Monthly season key (YYYY-MM), auto-reset on the 1st of every month
  isCurrentPlayer?: boolean;
}
