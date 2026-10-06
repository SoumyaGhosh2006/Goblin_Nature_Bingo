/**
 * ============================================================================
 * MAIN APPLICATION CONTAINER — GOBLIN NATURE BINGO
 * ============================================================================
 * Orchestrates the full mobile game lifecycle:
 * - 12% Top HUD Shelf (Level, Acorns, Leaderboard, Audio)
 * - 70% Active Canvas (Resting 3x3 Grid <-> Mode 2 Focus Quest Card)
 * - 18% Bottom Goblin Dialogue Drawer (Grimble the Naturalist)
 * - Native camera capture, 1024px canvas compression, and verification pipeline
 */

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { HeaderHUD } from './components/HeaderHUD';
import { BingoBoard } from './components/BingoBoard';
import { FocusQuestCard } from './components/FocusQuestCard';
import { PhotoPreviewModal } from './components/PhotoPreviewModal';
import { GoblinDialogue } from './components/GoblinDialogue';
import { VictoryModal } from './components/VictoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LivingForestBackground } from './components/LivingForestBackground';
import { PerchingBird } from './components/PerchingBird';
import { useGameState } from './hooks/useGameState';
import { compressImage, savePhotoBlob } from './hooks/useIndexedDB';
import { verifyQuestSubmission } from './services/api';
import { fetchFreshBoard } from './services/questGenerator';
import { syncPlayerScore } from './services/firebase';
import { playStampThud, playDiceRoll } from './services/soundFx';

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

  // Dialog & Modal View Controls
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [grimbleDialogue, setGrimbleDialogue] = useState(
    "Welcome to the wildwood, human! Tap any parchment card on the board to begin your hunt."
  );
  const [sensoryTask, setSensoryTask] = useState<string | undefined>();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Camera & Verification State
  const [capturedPhoto, setCapturedPhoto] = useState<{ blob: Blob; base64: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync player score to leaderboard when XP changes
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
      // Reset input value to allow recapturing same file if retried
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
        // Trigger tactile wood wax stamp thud sound
        playStampThud(soundEnabled);

        completeQuest(
          activeQuest.index,
          result.woodland_xp,
          result.goblin_critique,
          result.sensory_bonus
        );
        setGrimbleDialogue(result.goblin_critique);
        setSensoryTask(result.sensory_bonus);

        if (result.audio_base64 && soundEnabled) {
          const audio = new Audio(`data:audio/mp3;base64,${result.audio_base64}`);
          audio.play().catch(e => console.log('Audio autoplay blocked:', e));
          setAudioUrl(`data:audio/mp3;base64,${result.audio_base64}`);
        }
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
    // Play wooden dice rolling sound
    playDiceRoll(soundEnabled);
    const res = rerollTile(gameState.activeTileIndex);
    setGrimbleDialogue(res.message);
  };

  // Generate brand new board of 9 quests
  const handleGenerateNewBoard = async () => {
    const newTiles = await fetchFreshBoard(gameState.completedQuestHistory);
    startNewBoard(newTiles);
    setGrimbleDialogue("A brand new woodland territory has unfolded! Seek fresh treasures!");
    setSensoryTask(undefined);
  };

  const activeQuest = gameState.activeTileIndex !== null
    ? gameState.tiles[gameState.activeTileIndex]
    : null;

  return (
    <div className="relative flex flex-col h-screen w-full max-w-md mx-auto overflow-hidden bg-forest-dark justify-between font-sans">
      {/* Living Forest Park Background Canvas & Wildlife */}
      <LivingForestBackground />
      <PerchingBird soundEnabled={soundEnabled} />

      {/* Hidden Mobile Native Camera Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top 12%: Header HUD Shelf */}
      <HeaderHUD
        playerLevel={gameState.playerLevel}
        woodlandXP={gameState.woodlandXP}
        acorns={gameState.acorns}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
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
            <BingoBoard
              tiles={gameState.tiles}
              completedLines={gameState.completedLines}
              onSelectTile={setActiveTileIndex}
            />
            {/* Quick Refresh / New Board Trigger */}
            <button
              onClick={handleGenerateNewBoard}
              className="text-xs font-black text-parchment-dark hover:text-gold transition-colors flex items-center space-x-1.5 uppercase tracking-wider bg-timber/40 px-3 py-1.5 rounded-full border border-timber-light/30"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold" />
              <span>Generate New Board</span>
            </button>
          </div>
        )}
      </main>

      {/* Bottom 18%: Goblin Dialogue Drawer */}
      <GoblinDialogue
        dialogueText={grimbleDialogue}
        sensoryTask={sensoryTask}
        hasAudio={Boolean(audioUrl)}
        onPlayAudio={() => {
          if (audioUrl) {
            new Audio(audioUrl).play().catch(e => console.log('Audio playback error:', e));
          }
        }}
      />

      {/* MODALS */}
      {!gameState.playerNickname && (
        <OnboardingModal onComplete={setNickname} />
      )}

      {capturedPhoto && (
        <PhotoPreviewModal
          photoPreviewUrl={capturedPhoto.base64}
          isVerifying={isVerifying}
          onRetake={() => setCapturedPhoto(null)}
          onSubmit={handleSubmitPhoto}
        />
      )}

      {hasNewBingo && (
        <VictoryModal
          onKeepHunting={() => setHasNewBingo(false)}
          onNewBoard={handleGenerateNewBoard}
        />
      )}

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
    </div>
  );
}

export default App;
