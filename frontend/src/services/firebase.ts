/**
 * ============================================================================
 * FIREBASE SOCIAL & MULTI-PROVIDER AUTHENTICATION — GOBLIN NATURE BINGO
 * ============================================================================
 * Handles user authentication across Email/Password, Google OAuth, and
 * Anonymous Guest mode, alongside Cloud Firestore leaderboard persistence.
 * Offline wilderness trails gracefully fall back to local mock state.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { LeaderboardEntry } from '../types/game';

/**
 * Returns the canonical monthly season identifier (YYYY-MM).
 * Because every calendar month begins on the 1st at 00:00, this key
 * automatically rolls over on the 1st day of each month.
 */
export function getCurrentSeasonKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Computes metadata for the active monthly leaderboard season and next 1st-of-month reset.
 */
export function getMonthlyResetInfo(now: Date = new Date()): {
  seasonKey: string;
  seasonLabel: string;
  nextResetLabel: string;
  daysUntilReset: number;
  isFirstDayOfMonth: boolean;
} {
  const seasonKey = getCurrentSeasonKey(now);
  const seasonLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  const nextResetLabel = nextResetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const msRemaining = Math.max(0, nextResetDate.getTime() - now.getTime());
  const daysUntilReset = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return {
    seasonKey,
    seasonLabel,
    nextResetLabel,
    daysUntilReset,
    isFirstDayOfMonth: now.getDate() === 1
  };
}

// Configuration keys populated from Vite environment variables (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Verify if production credentials are affirmatively provided
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let db: any = null;
let auth: any = null;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured) {
  // Initialize the Firebase application singleton instance
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
}

// Simulated rival foragers for zero-config offline or wilderness trail play
const MOCK_FORAGERS: LeaderboardEntry[] = [
  { id: 'rival_1', nickname: 'TwigBiter_99', level: 5, woodlandXP: 520, bingosCompleted: 4, lastActive: '5m ago' },
  { id: 'rival_2', nickname: 'ElderFern', level: 4, woodlandXP: 410, bingosCompleted: 3, lastActive: '12m ago' },
  { id: 'rival_3', nickname: 'BrambleKing', level: 3, woodlandXP: 320, bingosCompleted: 2, lastActive: '1h ago' },
  { id: 'rival_4', nickname: 'AcornSprite', level: 2, woodlandXP: 180, bingosCompleted: 1, lastActive: '2h ago' },
  { id: 'rival_5', nickname: 'PebbleProwler', level: 1, woodlandXP: 95, bingosCompleted: 0, lastActive: '3h ago' }
];

/**
 * Signs in using Google OAuth popup for quick one-click cloud identity.
 */
export async function signInWithGoogle(): Promise<User | null> {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

/**
 * Registers a new account with email address and password.
 */
export async function signUpWithEmail(email: string, pass: string, nickname?: string): Promise<User | null> {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (nickname && cred.user) {
      await updateProfile(cred.user, { displayName: nickname });
    }
    return cred.user;
  } catch (error: any) {
    console.error('Email sign-up error:', error);
    throw error;
  }
}

/**
 * Authenticates an existing player via email and password credentials.
 */
export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    throw error;
  }
}

/**
 * Initializes anonymous guest authentication for friction-free onboarding.
 */
export async function initializeAnonymousPlayer(): Promise<User | null> {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error: any) {
    console.warn('Anonymous Firebase auth failed, proceeding with local profile:', error);
    return null;
  }
}

/**
 * Signs out the currently authenticated user from this browser session.
 */
export async function logOutPlayer(): Promise<void> {
  if (!isFirebaseConfigured || !auth) return;
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign-out error:', error);
  }
}

/**
 * Returns the currently active Firebase user or null if unauthenticated.
 */
export function getCurrentPlayer(): User | null {
  return auth?.currentUser ?? null;
}

/**
 * Listens for authentication state updates across player sessions.
 */
export function onPlayerAuthStateChanged(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Fetches top 10 foragers for the active monthly season from Cloud Firestore or offline mock storage.
 * Automatically purges stale entries from prior months on or after the 1st of each month.
 */
export async function fetchLeaderboard(currentPlayer: { nickname: string; level: number; xp: number }): Promise<LeaderboardEntry[]> {
  const currentSeason = getCurrentSeasonKey();

  if (!isFirebaseConfigured || !db) {
    // Generate simulated rankings including the current local player for the current monthly season
    const playerEntry: LeaderboardEntry = {
      id: 'current_player',
      nickname: currentPlayer.nickname || 'You',
      level: currentPlayer.level,
      woodlandXP: currentPlayer.xp,
      bingosCompleted: Math.floor(currentPlayer.xp / 100),
      lastActive: 'Just now',
      seasonKey: currentSeason,
      isCurrentPlayer: true
    };

    const seasonalMocks = MOCK_FORAGERS.map(r => ({ ...r, seasonKey: currentSeason }));
    const combined = [...seasonalMocks, playerEntry];
    return combined.sort((a, b) => b.woodlandXP - a.woodlandXP);
  }

  try {
    // Query top players ranked by woodland experience points
    const q = query(collection(db, 'leaderboard'), orderBy('woodlandXP', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    const activeEntries: LeaderboardEntry[] = [];
    const staleDocIds: string[] = [];

    const currentPlayerId = currentPlayer.nickname
      ? `player_${currentPlayer.nickname.toLowerCase()}`
      : '';

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      // Determine entry's monthly season from explicit seasonKey or ISO lastActive timestamp
      const entrySeason: string | undefined =
        data.seasonKey ||
        (typeof data.lastActive === 'string' && /^\d{4}-\d{2}/.test(data.lastActive)
          ? data.lastActive.slice(0, 7)
          : undefined);

      if (entrySeason && entrySeason !== currentSeason) {
        // Stale entry from a previous month — schedule automatic reset deletion
        staleDocIds.push(docSnap.id);
        return;
      }

      activeEntries.push({
        id: docSnap.id,
        ...data,
        seasonKey: currentSeason,
        isCurrentPlayer:
          docSnap.id === currentPlayerId ||
          (Boolean(currentPlayer.nickname) &&
            typeof data.nickname === 'string' &&
            data.nickname.toLowerCase() === currentPlayer.nickname.toLowerCase())
      } as LeaderboardEntry);
    });

    // Asynchronously purge previous month's leaderboard records so the 1st-of-month reset persists in Firestore
    if (staleDocIds.length > 0) {
      Promise.allSettled(
        staleDocIds.map(staleId => deleteDoc(doc(db, 'leaderboard', staleId)))
      ).catch(() => {});
    }

    return activeEntries.slice(0, 10);
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to mock foragers:', error);
    return MOCK_FORAGERS.map(r => ({ ...r, seasonKey: currentSeason }));
  }
}

/**
 * Syncs the current player's score to the Cloud Firestore leaderboard collection
 * stamped with the active monthly season key (YYYY-MM).
 */
export async function syncPlayerScore(entry: LeaderboardEntry): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  try {
    const currentSeason = getCurrentSeasonKey();
    // Update or insert player document under their unique player ID for the active month
    const docRef = doc(db, 'leaderboard', entry.id);
    await setDoc(docRef, {
      nickname: entry.nickname,
      level: entry.level,
      woodlandXP: entry.woodlandXP,
      bingosCompleted: entry.bingosCompleted,
      seasonKey: currentSeason,
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Failed to sync player score to Firestore:', error);
  }
}
