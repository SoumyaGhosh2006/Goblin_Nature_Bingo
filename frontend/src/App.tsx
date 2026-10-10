/**
 * ============================================================================
 * MAIN APPLICATION CONTAINER — GOBLIN NATURE BINGO
 * ============================================================================
 * Orchestrates the full mobile game lifecycle:
 * - 12% Top HUD Shelf (Level, Acorns, Account/Auth, Leaderboard, Audio)
 * - 70% Active Canvas (Resting 3x3 Grid <-> Mode 2 Focus Quest Card)
 * - 18% Bottom Goblin Dialogue Drawer (Grimble with 3D Mascot & ElevenLabs TTS)
 * - Living Forest UI with pristine anime artwork, roaming bee & branch songbird
 * - India-tailored biodiversity quest generation powered by browser geolocation
 * - Full Google OAuth and Email/Password account modal & cloud synchronization
 */

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import type { User } from 'firebase/auth';
import { HeaderHUD } from './components/HeaderHUD';
import { BingoBoard } from './components/BingoBoard';
import { BoardLoadingSpinner } from './components/BoardLoadingSpinner';
import { FocusQuestCard } from './components/FocusQuestCard';
import { PhotoPreviewModal } from './components/PhotoPreviewModal';
import { GoblinDialogue } from './components/GoblinDialogue';
import { VictoryModal } from './components/VictoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { GrimbleMascotModal } from './components/GrimbleMascotModal';
import { LivingForestBackground } from './components/LivingForestBackground';
import { RealTimeAtmosphere } from './components/RealTimeAtmosphere';
import { RoamingBee } from './components/RoamingBee';
import { useGameState } from './hooks/useGameState';
import { useUserLocation } from './hooks/useUserLocation';
import { compressImage, savePhotoBlob } from './hooks/useIndexedDB';
import { verifyQuestSubmission, requestGrimbleSpeech } from './services/api';
import { fetchFreshBoard } from './services/questGenerator';
import {
  syncPlayerScore,
  onPlayerAuthStateChanged,
  getCurrentPlayer
} from './services/firebase';
import { playStampThud, playDiceRoll } from './services/soundFx';
import { audioManager } from './services/audioManager';
import { getInitialSeedBoard } from './data/questPool';

export function App() {
  const {
    gameState,
    hasNewBingo,
    setHasNewBingo,
    setNickname,
    setActiveTileIndex,
    completeQuest,
    rerollTile,
    startNewBoard
  } = useGameState();

  // Geolocation hook detecting user's Indian region/city for quest localization
  const { locationHint } = useUserLocation();

  // Dialog & Modal View Controls
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGrimbleModal, setShowGrimbleModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentPlayer());

  const [grimbleDialogue, setGrimbleDialogue] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 17) {
      return "Sunlight pierces the canopy! Tap any specimen card in my field journal to begin your forage.";
    } else if (hour >= 17 && hour < 19) {
      return "Twilight descends upon the wildwood! The evening shadows lengthen—keep your eyes keen for hidden specimens.";
    } else {
      return "Night has enveloped the forest! The moon is high and fireflies dance—nocturnal treasures await your lens.";
    }
  });
  const [sensoryTask, setSensoryTask] = useState<string | undefined>();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Sync global audio mute state to centralized AudioManager
  useEffect(() => {
    audioManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Camera & Verification State
  const [capturedPhoto, setCapturedPhoto] = useState<{ blob: Blob; base64: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGeneratingBoard, setIsGeneratingBoard] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('loading') === '1' || params.get('generating') === '1';
    }
    return false;
  });
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Listen to Firebase authentication state changes across the browser session
  useEffect(() => {
    const unsubscribe = onPlayerAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && user.displayName && !gameState.playerNickname) {
        setNickname(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [setNickname, gameState.playerNickname]);

  // Auto-migrate legacy board if it contains temperate elements or procedural legacy quests
  useEffect(() => {
    const hasLegacyOrTemperate = gameState.tiles.some(t =>
      t.title.toLowerCase().includes('acorn') ||
      t.title.toLowerCase().includes('pinecone') ||
      t.title.toLowerCase().includes('twisted') ||
      t.title.toLowerCase().includes('sun-bleached') ||
      ['wood', 'leaf', 'insect', 'sun', 'stone', 'ant', 'moss'].includes(t.icon)
    );
    if (hasLegacyOrTemperate) {
      startNewBoard(getInitialSeedBoard());
    }
  }, []);

  // Listen to atmosphere phase shifts to provide contextual woodland banter
  useEffect(() => {
    const handleAtmosphere = (e: any) => {
      if (gameState.activeTileIndex !== null) return;
      const phase = e.detail;
      if (phase === 'DAY') {
        setGrimbleDialogue("Sunlight pierces the canopy! Tap any specimen card in my field journal to begin your forage.");
      } else if (phase === 'SUNSET') {
        setGrimbleDialogue("Twilight descends upon the wildwood! The evening shadows lengthen—keep your eyes keen for hidden specimens.");
      } else if (phase === 'NIGHT') {
        setGrimbleDialogue("Night has enveloped the forest! The moon is high and fireflies dance—nocturnal treasures await your lens.");
      }
    };
    window.addEventListener('goblin_atmosphere_changed', handleAtmosphere);
    return () => window.removeEventListener('goblin_atmosphere_changed', handleAtmosphere);
  }, [gameState.activeTileIndex]);

  // ElevenLabs Voice Pipeline: Auto-speaks every dialogue update via centralized Voice channel
  useEffect(() => {
    if (!soundEnabled || !grimbleDialogue) return;

    let isSubscribed = true;
    const voiceTicket = audioManager.beginVoiceRequest();

    requestGrimbleSpeech(grimbleDialogue).then(b64 => {
      if (!isSubscribed || !b64) return;
      const url = `data:audio/mp3;base64,${b64}`;
      setAudioUrl(url);

      audioManager.playVoice(url, voiceTicket);
    });

    return () => {
      isSubscribed = false;
    };
  }, [grimbleDialogue, soundEnabled]);

  // Sync player score to Cloud Firestore leaderboard when XP changes
  useEffect(() => {
    if (gameState.playerNickname) {
      syncPlayerScore({
        id: `player_${gameState.playerNickname.toLowerCase()}`,
        nickname: gameState.playerNickname,
        level: gameState.playerLevel,
        woodlandXP: gameState.woodlandXP,
        bingosCompleted: gameState.completedLines.length,
        lastActive: new Date().toISOString()
      });
    }
  }, [gameState.woodlandXP, gameState.playerLevel, gameState.playerNickname, gameState.completedLines]);

  // Update Grimble's advice whenever the active focus tile changes
  useEffect(() => {
    if (gameState.activeTileIndex !== null) {
      const quest = gameState.tiles[gameState.activeTileIndex];
      if (quest) {
        setGrimbleDialogue(`Hunt for ${quest.title}! ${quest.hint}`);
      }
    }
  }, [gameState.activeTileIndex]);

  // Trigger native mobile camera capture
  const handleTriggerCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Process captured image file via canvas downscaling
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setCapturedPhoto(compressed);
    } catch (err) {
      console.error('Failed to process camera photo:', err);
      setGrimbleDialogue("Blurry lens! Grimble could not make out that photo. Try again!");
    } finally {
      e.target.value = '';
    }
  };

  // Submit photo to open-weight AI vision model
  const handleSubmitPhoto = async () => {
    if (!capturedPhoto || gameState.activeTileIndex === null) return;

    const activeQuest = gameState.tiles[gameState.activeTileIndex];
    setIsVerifying(true);

    try {
      const photoId = `photo_${Date.now()}`;
      await savePhotoBlob(photoId, capturedPhoto.blob);

      const result = await verifyQuestSubmission(
        {
          quest_id: activeQuest.id,
          quest_title: activeQuest.title,
          quest_description: activeQuest.description,
          image_base64: capturedPhoto.base64,
          generate_voice: soundEnabled
        },
        activeQuest.index,
        capturedPhoto.blob
      );

      if ('queued' in result) {
        setGrimbleDialogue("No signal out in the brambles! Stashed in your foraging bag to review later.");
        setCapturedPhoto(null);
        setIsVerifying(false);
        setActiveTileIndex(null);
        return;
      }

      if (result.passed) {
        playStampThud(soundEnabled);
        completeQuest(
          activeQuest.index,
          result.woodland_xp,
          result.goblin_critique,
          result.sensory_bonus
        );
        setGrimbleDialogue(result.goblin_critique);
        setSensoryTask(result.sensory_bonus);
      } else {
        setGrimbleDialogue(result.goblin_critique);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setGrimbleDialogue("The forest spirits were silent. Check your connection or try another find!");
    } finally {
      setIsVerifying(false);
      setCapturedPhoto(null);
    }
  };

  // Bribe Grimble to swap the active quest
  const handleReroll = () => {
    if (gameState.activeTileIndex === null) return;
    playDiceRoll(soundEnabled);
    const res = rerollTile(gameState.activeTileIndex);
    setGrimbleDialogue(res.message);
  };

  // Generate brand new board of 9 quests tailored to Indian location with loading spiral transition
  const handleGenerateNewBoard = async () => {
    if (isGeneratingBoard) return;
    setIsGeneratingBoard(true);
    audioManager.playSfx('toggle_click');
    setGrimbleDialogue("Scouting fresh woodland territory and sketching new botanical specimens...");

    try {
      // Ensure at least 850ms so the user clearly sees the board disappear and the loading circle/spiral spin
      const [newTiles] = await Promise.all([
        fetchFreshBoard(gameState.completedQuestHistory, locationHint),
        new Promise(resolve => setTimeout(resolve, 850))
      ]);
      startNewBoard(newTiles);
      setGrimbleDialogue("A brand new woodland territory has unfolded! Seek fresh treasures!");
      setSensoryTask(undefined);
    } catch (err) {
      console.error('Failed to generate fresh board:', err);
      setGrimbleDialogue("The forest brambles were thick! Try generating again.");
    } finally {
      setIsGeneratingBoard(false);
    }
  };

  const activeQuest = gameState.activeTileIndex !== null
    ? gameState.tiles[gameState.activeTileIndex]
    : null;

  return (
    <div className="relative flex flex-col h-screen w-full max-w-md mx-auto overflow-hidden justify-between font-sans shadow-2xl">
      {/* Living Forest Park Background Canvas with Pristine Artwork, Bird, and Bee */}
      <LivingForestBackground soundEnabled={soundEnabled} />

      {/* Strict Device Real-Time Atmosphere & Celestial Canopy Layer (Day/Sunset/Night) */}
      <RealTimeAtmosphere />

      {/* Hidden Mobile Native Camera Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top 12%: Header HUD Shelf with Account/Auth Profile Trigger */}
      <HeaderHUD
        playerLevel={gameState.playerLevel}
        woodlandXP={gameState.woodlandXP}
        acorns={gameState.acorns}
        soundEnabled={soundEnabled}
        isAuthenticated={Boolean(currentUser && !currentUser.isAnonymous)}
        photoURL={currentUser?.photoURL}
        playerNickname={gameState.playerNickname || currentUser?.displayName || 'Adventurer'}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Center 70%: Active Canvas (Resting 3x3 Grid <-> Mode 2 Focus Quest Card) */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 overflow-y-auto">
        {activeQuest ? (
          <FocusQuestCard
            quest={activeQuest}
            tiles={gameState.tiles}
            freeRerolls={gameState.freeRerollsRemaining}
            onBack={() => setActiveTileIndex(null)}
            onReroll={handleReroll}
            onTriggerCamera={handleTriggerCamera}
          />
        ) : (
          <div className="w-full flex flex-col items-center space-y-3">
            {isGeneratingBoard ? (
              <BoardLoadingSpinner />
            ) : (
              <BingoBoard
                tiles={gameState.tiles}
                completedLines={gameState.completedLines}
                onSelectTile={setActiveTileIndex}
              />
            )}
            {/* Quick Refresh / New Board Trigger */}
            <button
              onClick={handleGenerateNewBoard}
              disabled={isGeneratingBoard}
              className={`text-xs font-black transition-all flex items-center space-x-1.5 uppercase tracking-wider px-3.5 py-1.5 rounded-full border backdrop-blur-xs ${
                isGeneratingBoard
                  ? 'bg-amber-950/75 text-amber-200/60 border-amber-800/40 cursor-not-allowed opacity-90'
                  : 'bg-timber/60 text-parchment-dark hover:text-gold border-timber-light/50 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-gold ${isGeneratingBoard ? 'animate-spin' : ''}`} />
              <span>{isGeneratingBoard ? 'Generating Board...' : 'Generate New Board'}</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom 18%: Goblin Dialogue Drawer with Big 3D Character & ElevenLabs Audio */}
      <GoblinDialogue
        dialogueText={grimbleDialogue}
        sensoryTask={sensoryTask}
        hasAudio={Boolean(audioUrl)}
        onPlayAudio={() => {
          if (audioUrl) {
            audioManager.playVoice(audioUrl);
          }
        }}
        onInspectGrimble={() => setShowGrimbleModal(true)}
      />

      {/* Highest App Layer: Roaming Cartoon Bumblebees flying across all cards and UI */}
      <RoamingBee soundEnabled={soundEnabled} />

      {/* ================================================================== */}
      {/* MODAL DIALOGS                                                      */}
      {/* ================================================================== */}

      {/* Onboarding Dialog for First-Time Launch */}
      {!gameState.playerNickname && (
        <OnboardingModal
          onComplete={setNickname}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* Camera Photo Preview & AI Submission Modal */}
      {capturedPhoto && (
        <PhotoPreviewModal
          photoPreviewUrl={capturedPhoto.base64}
          isVerifying={isVerifying}
          onRetake={() => setCapturedPhoto(null)}
          onSubmit={handleSubmitPhoto}
        />
      )}

      {/* 3-in-a-Row Bingo Line Completion Modal with 3D Mascot */}
      {hasNewBingo && (
        <VictoryModal
          onKeepHunting={() => setHasNewBingo(false)}
          onNewBoard={() => {
            setHasNewBingo(false);
            handleGenerateNewBoard();
          }}
        />
      )}

      {/* Multiplayer Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          currentPlayer={{
            nickname: gameState.playerNickname,
            level: gameState.playerLevel,
            xp: gameState.woodlandXP
          }}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* User Login & Signup Auth Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          currentNickname={gameState.playerNickname}
          woodlandXP={gameState.woodlandXP}
          playerLevel={gameState.playerLevel}
          acorns={gameState.acorns}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(name) => {
            setNickname(name);
          }}
        />
      )}

      {/* Big 3D Grimble Mascot Fullscreen Showcase */}
      {showGrimbleModal && (
        <GrimbleMascotModal
          dialogueText={grimbleDialogue}
          hasAudio={Boolean(audioUrl)}
          onPlayAudio={() => {
            if (audioUrl) {
              audioManager.playVoice(audioUrl);
            }
          }}
          onClose={() => setShowGrimbleModal(false)}
        />
      )}
    </div>
  );
}

export default App;
