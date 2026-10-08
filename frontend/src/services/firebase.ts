/**
 * ============================================================================
 * FIREBASE SOCIAL & MULTI-PROVIDER AUTHENTICATION — GOBLIN NATURE BINGO
 * ============================================================================
 * Handles user authentication across Email/Password, Google OAuth, and
 * Anonymous Guest mode, alongside Cloud Firestore leaderboard persistence.
 * Offline wilderness trails gracefully fall back to local mock state.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
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
 * Fetches top 10 foragers from Cloud Firestore or offline mock storage.
 */
export async function fetchLeaderboard(currentPlayer: { nickname: string; level: number; xp: number }): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured || !db) {
    // Generate simulated rankings including the current local player
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
    // Query the top 10 players ranked by woodland experience points
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
 * Syncs the current player's score to the Cloud Firestore leaderboard collection.
 */
export async function syncPlayerScore(entry: LeaderboardEntry): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  try {
    // Update or insert player document under their unique player ID
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
