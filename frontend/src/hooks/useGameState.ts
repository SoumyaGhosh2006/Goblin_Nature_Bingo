/**
 * ============================================================================
 * GAME STATE MACHINE HOOK — GOBLIN NATURE BINGO
 * ============================================================================
 * Manages full client state, LocalStorage auto-saving, level calculations,
 * Bingo line completion math, and the Focus Mode view transitions.
 */

import { useState, useEffect, useCallback } from 'react';
import type { GameState, QuestTileState } from '../types/game';
import { getInitialSeedBoard } from '../data/questPool';
import { generateProceduralQuest } from '../data/combinatoricMatrix';

const STORAGE_KEY = 'goblin_nature_bingo_state_v1';

// All 8 possible 3-in-a-row winning lines on a 3x3 grid
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
      }
    }

    // Default state on brand new game launch
    return {
      playerNickname: '',
      playerLevel: 1,
      woodlandXP: 0,
      acorns: 50, // Starting purse of 50 Acorn coins
      currentBoardId: `board_${Date.now()}`,
      activeTileIndex: null, // null = Resting 3x3 Grid view
      freeRerollsRemaining: 1,
      completedLines: [],
      completedQuestHistory: [],
      tiles: getInitialSeedBoard()
    };
  });

  const [hasNewBingo, setHasNewBingo] = useState(false);

  // Sync to localStorage whenever state mutations occur
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  /**
   * Sets player guest nickname from onboarding.
   */
  const setNickname = useCallback((nickname: string) => {
    setGameState(prev => ({ ...prev, playerNickname: nickname }));
  }, []);

  /**
   * Selects a tile to open the Focus Quest Card (Mode 2), or null to close.
   */
  const setActiveTileIndex = useCallback((index: number | null) => {
    setGameState(prev => ({ ...prev, activeTileIndex: index }));
  }, []);

  /**
   * Checks for newly completed rows, columns, or diagonals.
   */
  const evaluateBingoLines = useCallback((tiles: QuestTileState[], currentCompleted: number[]) => {
    const newlyCompleted: number[] = [];

    WINNING_LINES.forEach((line, lineIndex) => {
      if (!currentCompleted.includes(lineIndex)) {
        const isLineComplete = line.every(idx => tiles[idx].status === 'COMPLETED');
        if (isLineComplete) {
          newlyCompleted.push(lineIndex);
        }
      }
    });

    return newlyCompleted;
  }, []);

  /**
   * Updates an individual tile after verification and checks win conditions.
   */
  const completeQuest = useCallback((
    tileIndex: number,
    xpAwarded: number,
    goblinCritique: string,
    sensoryBonus?: string
  ) => {
    setGameState(prev => {
      const updatedTiles = prev.tiles.map((tile, i) => {
        if (i === tileIndex) {
          return {
            ...tile,
            status: 'COMPLETED' as const,
            verifiedAt: new Date().toISOString(),
            goblinCritique,
            sensoryBonus
          };
        }
        return tile;
      });

      const newXP = prev.woodlandXP + xpAwarded;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newLines = evaluateBingoLines(updatedTiles, prev.completedLines);

      let addedAcorns = 0;
      if (newLines.length > 0) {
        addedAcorns = newLines.length * 100; // 100 bonus acorns per Bingo line!
        setHasNewBingo(true);
      }

      return {
        ...prev,
        woodlandXP: newXP,
        playerLevel: newLevel,
        acorns: prev.acorns + addedAcorns,
        completedLines: [...prev.completedLines, ...newLines],
        completedQuestHistory: [...prev.completedQuestHistory, prev.tiles[tileIndex].title],
        tiles: updatedTiles,
        activeTileIndex: null // Transition back to 3x3 board
      };
    });
  }, [evaluateBingoLines]);

  /**
   * Bribe Grimble to swap an uncompleted quest tile with a fresh procedural quest.
   */
  const rerollTile = useCallback((tileIndex: number): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setGameState(prev => {
      const isFree = prev.freeRerollsRemaining > 0;
      const cost = isFree ? 0 : 20;

      if (!isFree && prev.acorns < cost) {
        result = { success: false, message: "Not enough Acorns to bribe Grimble! (Costs 20 Acorns)" };
        return prev;
      }

      const newQuest = generateProceduralQuest(tileIndex, prev.completedQuestHistory);
      const updatedTiles = [...prev.tiles];
      updatedTiles[tileIndex] = newQuest;

      result = {
        success: true,
        message: isFree ? "Grimble swapped the quest for free!" : "Grimble pocketed 20 Acorns and gave you a new quest!"
      };

      return {
        ...prev,
        acorns: prev.acorns - cost,
        freeRerollsRemaining: Math.max(0, prev.freeRerollsRemaining - 1),
        tiles: updatedTiles
      };
    });

    return result;
  }, []);

  /**
   * Clears the board and generates a fresh 9-tile adventure.
   */
  const startNewBoard = useCallback((newTiles: QuestTileState[]) => {
    setGameState(prev => ({
      ...prev,
      currentBoardId: `board_${Date.now()}`,
      activeTileIndex: null,
      freeRerollsRemaining: 1,
      completedLines: [],
      tiles: newTiles
    }));
    setHasNewBingo(false);
  }, []);

  return {
    gameState,
    hasNewBingo,
    setHasNewBingo,
    setNickname,
    setActiveTileIndex,
    completeQuest,
    rerollTile,
    startNewBoard
  };
}
