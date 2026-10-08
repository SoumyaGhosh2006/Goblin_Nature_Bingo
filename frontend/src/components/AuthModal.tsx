/**
 * ============================================================================
 * AUTHENTICATION MODAL COMPONENT — GOBLIN NATURE BINGO
 * ============================================================================
 * Multi-provider authentication interface supporting:
 * 1. Google 1-Click OAuth Identity
 * 2. Email & Password registration and login with input validation
 * 3. Frictionless anonymous guest play continuation
 * 4. Authenticated profile HUD with woodland stats and sign-out actions
 *
 * Implements tactile Supercell / Clash parchment and double-bezel styling.
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Compass
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logOutPlayer
} from '../services/firebase';
import { GrimbleAvatar } from './GrimbleAvatar';
import { NatureIcon } from './NatureIcons';

interface AuthModalProps {
  currentUser: User | null;
  currentNickname: string;
  woodlandXP: number;
  playerLevel: number;
  acorns: number;
  onClose: () => void;
  onAuthSuccess: (nickname: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  currentNickname,
  woodlandXP,
  playerLevel,
  acorns,
  onClose,
  onAuthSuccess
}) => {
  // Navigation tabs: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Input states for credential forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupNickname, setSignupNickname] = useState(currentNickname || '');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Translates Firebase error codes into friendly wilderness notifications.
   */
  const formatAuthError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address format. Please check your spelling.';
      case 'auth/user-not-found':
        return 'No forager account found with this email scroll.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password combination.';
      case 'auth/email-already-in-use':
        return 'This email scroll is already registered. Please sign in!';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters in length.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completion.';
      case 'auth/network-request-failed':
        return 'Wilderness signal lost! Check your internet connection.';
      default:
        return 'Authentication encountered a forest snag. Please try again!';
    }
  };

  /**
   * Handles Google OAuth 1-click cloud authentication.
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const user = await signInWithGoogle();
      if (user) {
        const resolvedName = user.displayName || user.email?.split('@')[0] || 'Adventurer';
        setSuccessMessage(`Welcome to the Wildwood, ${resolvedName}!`);
        onAuthSuccess(resolvedName);
        setTimeout(onClose, 1000);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setErrorMessage(formatAuthError(err.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles standard Email and Password authentication (Login / Signup).
   */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === 'signin') {
        const user = await signInWithEmail(email.trim(), password);
        if (user) {
          const resolvedName = user.displayName || signupNickname || user.email?.split('@')[0] || 'Adventurer';
          setSuccessMessage(`Welcome back, ${resolvedName}!`);
          onAuthSuccess(resolvedName);
          setTimeout(onClose, 1000);
        }
      } else {
        if (!signupNickname.trim()) {
          setErrorMessage('Please declare your adventurer nickname!');
          setIsLoading(false);
          return;
        }
        const user = await signUpWithEmail(email.trim(), password, signupNickname.trim());
        if (user) {
          setSuccessMessage(`Account forged for ${signupNickname}!`);
          onAuthSuccess(signupNickname.trim());
          setTimeout(onClose, 1000);
        }
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setErrorMessage(formatAuthError(err.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs the player out of Firebase and reverts to guest status.
   */
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logOutPlayer();
      setSuccessMessage('Logged out of wildwood. Playing as local guest.');
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn">
      {/* Outer Timber Bezel Shell */}
      <div className="relative w-full max-w-[370px] bg-timber border-4 border-timber-dark rounded-3xl p-4 shadow-2xl flex flex-col space-y-3">
        {/* Modal Close Trigger */}
        <button
          onClick={onClose}
          aria-label="Close Auth Modal"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-timber-light hover:bg-timber-dark text-parchment rounded-full border border-amber-900/60 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================================================================ */}
        {/* VIEW 1: AUTHENTICATED PROFILE SUMMARY (IF ALREADY SIGNED IN)     */}
        {/* ================================================================ */}
        {currentUser && !currentUser.isAnonymous ? (
          <div className="space-y-4 pt-1">
            {/* Header Identity Banner */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Player'}
                    className="w-18 h-18 rounded-full border-4 border-gold shadow-bevel-gold object-cover"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-full bg-forest border-4 border-gold flex items-center justify-center shadow-bevel-gold text-2xl font-black text-gold">
                    {(currentUser.displayName || currentNickname || 'A').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-action border-2 border-action-dark rounded-full p-1 text-white shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-parchment">
                  {currentUser.displayName || currentNickname}
                </h3>
                <p className="text-xs font-semibold text-parchment-dark/80">
                  {currentUser.email}
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-forest-light/60 border border-gold/40 rounded-full text-[10px] font-black uppercase text-gold tracking-wider">
                  Cloud Synchronized
                </span>
              </div>
            </div>

            {/* In-Game Wilderness Stats Card */}
            <div className="bg-parchment border-2 border-timber-light rounded-2xl p-3 grid grid-cols-3 gap-2 text-center shadow-inner">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-timber-light">Level</span>
                <span className="text-base font-black text-timber-dark">{playerLevel}</span>
              </div>
              <div className="flex flex-col items-center border-x border-timber-light/30">
                <span className="text-[10px] font-black uppercase text-timber-light">XP</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span className="text-base font-black text-amber-900">{woodlandXP}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-timber-light">Acorns</span>
                <div className="flex items-center space-x-1">
                  <NatureIcon name="acorn" size={14} />
                  <span className="text-base font-black text-amber-800">{acorns}</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onClose}
                className="w-full py-2.5 btn-3d-action flex items-center justify-center space-x-2 text-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Return to the Wilderness</span>
              </button>

              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full py-2.5 btn-3d-timber flex items-center justify-center space-x-2 text-xs border border-amber-900"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-parchment" />
                ) : (
                  <>
                    <LogOut className="w-4 h-4 text-parchment-dark" />
                    <span>Log Out of Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* VIEW 2: LOGIN / SIGNUP PORTAL FOR GUEST OR NEW PLAYERS          */
          /* ================================================================ */
          <div className="space-y-3">
            {/* Header Mascot & Title */}
            <div className="flex items-center space-x-3 pb-1 border-b border-timber-dark/60">
              <GrimbleAvatar size="md" showBadge={false} />
              <div>
                <h3 className="text-base font-black text-parchment tracking-wide">
                  Wildwood Guild Scroll
                </h3>
                <p className="text-[11px] font-semibold text-parchment-dark/90">
                  Save your finds, badges, and compete on Indian Leaderboards!
                </p>
              </div>
            </div>

            {/* Mode Tab Switcher: Sign In <-> Register */}
            <div className="flex bg-timber-dark/80 p-1 rounded-xl border border-timber-light/40">
              <button
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-gold text-timber-dark shadow-sm'
                    : 'text-parchment-dark hover:text-parchment'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                  activeTab === 'signup'
                    ? 'bg-gold text-timber-dark shadow-sm'
                    : 'text-parchment-dark hover:text-parchment'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Success Feedback Alerts */}
            {errorMessage && (
              <div className="flex items-center space-x-2 bg-red-950/80 border border-red-500/50 rounded-xl p-2 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-2 text-emerald-200 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Google 1-Click One-Tap Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              type="button"
              className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-black rounded-xl border-2 border-slate-300 shadow-md active:translate-y-[2px] transition-all flex items-center justify-center space-x-2.5 text-xs"
            >
              {/* Official Multi-colored Google SVG Glyph */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Visual Divider */}
            <div className="flex items-center my-2 space-x-2">
              <div className="flex-1 h-px bg-timber-light/60" />
              <span className="text-[10px] font-black uppercase text-parchment-dark/70 tracking-wider">
                or email scroll
              </span>
              <div className="flex-1 h-px bg-timber-light/60" />
            </div>

            {/* Email & Password Authentication Form */}
            <form onSubmit={handleEmailAuth} className="space-y-2.5">
              {/* Nickname Field (Register Mode Only) */}
              {activeTab === 'signup' && (
                <div>
                  <label className="text-[10px] font-black uppercase text-parchment-dark block mb-1">
                    Adventurer Nickname
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-timber-light absolute left-3 top-3" />
                    <input
                      type="text"
                      value={signupNickname}
                      onChange={(e) => setSignupNickname(e.target.value)}
                      placeholder="e.g. NeemSeeker_21"
                      required
                      maxLength={24}
                      className="w-full pl-9 pr-3 py-2 bg-parchment-light border-2 border-timber-light rounded-xl font-bold text-timber-dark text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-[10px] font-black uppercase text-parchment-dark block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-timber-light absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="forager@wildwood.in"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-parchment-light border-2 border-timber-light rounded-xl font-bold text-timber-dark text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Password with Eye Reveal Toggle */}
              <div>
                <label className="text-[10px] font-black uppercase text-parchment-dark block mb-1">
                  Secret Passcode
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-timber-light absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-9 py-2 bg-parchment-light border-2 border-timber-light rounded-xl font-bold text-timber-dark text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-timber-light hover:text-timber-dark"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 btn-3d-action flex items-center justify-center space-x-2 text-xs mt-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {activeTab === 'signin' ? 'Sign In to Wildwood' : 'Forge Forager Account'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Continue as Anonymous Guest Option */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-bold text-parchment-dark/70 hover:text-gold transition-colors underline decoration-dotted"
              >
                Continue hunting as local guest for now →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
