/**
 * ============================================================================
 * FIREBASE SOCIAL LAYER — GOBLIN NATURE BINGO
 * ============================================================================
 * Handles friends leaderboard syncing with Firestore. Automatically falls
 * back to simulated rival foragers if Firebase environment keys are omitted.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import type { LeaderboardEntry } from '../types/game';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db: any = null;
if (isFirebaseConfigured) {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

// Simulated rival foragers for zero-config offline / mock play
const MOCK_FORAGERS: LeaderboardEntry[] = [
  { id: 'rival_1', nickname: 'TwigBiter_99', level: 5, woodlandXP: 520, bingosCompleted: 4, lastActive: '5m ago' },
  { id: 'rival_2', nickname: 'ElderFern', level: 4, woodlandXP: 410, bingosCompleted: 3, lastActive: '12m ago' },
  { id: 'rival_3', nickname: 'BrambleKing', level: 3, woodlandXP: 320, bingosCompleted: 2, lastActive: '1h ago' },
  { id: 'rival_4', nickname: 'AcornSprite', level: 2, woodlandXP: 180, bingosCompleted: 1, lastActive: '2h ago' },
  { id: 'rival_5', nickname: 'PebbleProwler', level: 1, woodlandXP: 95, bingosCompleted: 0, lastActive: '3h ago' }
];

/**
 * Fetches top 10 foragers from Cloud Firestore or mock storage.
 */
export async function fetchLeaderboard(currentPlayer: { nickname: string; level: number; xp: number }): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured || !db) {
    // Generate simulated rankings including current player
    const playerEntry: LeaderboardEntry = {
      id: 'current_player',
      nickname: currentPlayer.nickname || 'You',
      level: currentPlayer.level,
      woodlandXP: currentPlayer.xp,
      bingosCompleted: Math.floor(currentPlayer.xp / 100),
      lastActive: 'Just now',
      isCurrentPlayer: true
    };

    const combined = [...MOCK_FORAGERS, playerEntry];
    return combined.sort((a, b) => b.woodlandXP - a.woodlandXP);
  }

  try {
    const q = query(collection(db, 'leaderboard'), orderBy('woodlandXP', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    snapshot.forEach(docSnap => {
      entries.push({ id: docSnap.id, ...docSnap.data() } as LeaderboardEntry);
    });

    return entries;
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to mock foragers:', error);
    return MOCK_FORAGERS;
  } 
}

/**
 * Syncs the current player's score to the Cloud Firestore leaderboard.
 */
export async function syncPlayerScore(entry: LeaderboardEntry): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  try {
    const docRef = doc(db, 'leaderboard', entry.id);
    await setDoc(docRef, {
      nickname: entry.nickname,
      level: entry.level,
      woodlandXP: entry.woodlandXP,
      bingosCompleted: entry.bingosCompleted,
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Failed to sync player score to Firestore:', error);
  }
}
