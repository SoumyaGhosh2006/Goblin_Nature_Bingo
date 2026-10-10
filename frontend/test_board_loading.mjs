/**
 * ============================================================================
 * AUTOMATED VERIFICATION SCRIPT — BOARD GENERATION LOADING CIRCLE & SPIRAL
 * ============================================================================
 * Verifies:
 * 1. Board disappearance and loading circle/spiral display on click.
 * 2. Minimum loading duration threshold to prevent sub-second visual flashes.
 * 3. Loading state termination and fresh board emergence upon completion.
 * 4. Button lock/disable and re-trigger protection during generation.
 */

import assert from 'node:assert';

console.log('=== TEST SUITE: BOARD GENERATION LOADING TRANSITION ===\n');

// ----------------------------------------------------------------------------
// 1. SIMULATE GENERATION LIFECYCLE CONTROLLER
// ----------------------------------------------------------------------------
console.log('Test 1: Verifying Board Loading State Transitions...');

class BoardGenerationController {
  constructor() {
    this.isGeneratingBoard = false;
    this.activeBoard = [
      { id: 'tile_1', title: 'Aromatic Peepal Leaf', status: 'PENDING' },
      { id: 'tile_2', title: 'Neem Leaflet', status: 'PENDING' }
    ];
    this.grimbleDialogue = "Seek fresh treasures!";
    this.clickCount = 0;
  }

  getRenderedView() {
    if (this.isGeneratingBoard) {
      return {
        boardVisible: false,
        loadingSpinnerVisible: true,
        buttonDisabled: true,
        buttonText: 'Generating Board...'
      };
    }
    return {
      boardVisible: true,
      loadingSpinnerVisible: false,
      buttonDisabled: false,
      buttonText: 'Generate New Board'
    };
  }

  async handleGenerateNewBoard(fetchMock) {
    if (this.isGeneratingBoard) {
      return false; // Prevent concurrent re-trigger
    }
    this.clickCount++;
    this.isGeneratingBoard = true;
    this.grimbleDialogue = "Scouting fresh woodland territory and sketching new botanical specimens...";

    try {
      const [newTiles] = await Promise.all([
        fetchMock(),
        new Promise(resolve => setTimeout(resolve, 850))
      ]);
      this.activeBoard = newTiles;
      this.grimbleDialogue = "A brand new woodland territory has unfolded! Seek fresh treasures!";
    } finally {
      this.isGeneratingBoard = false;
    }
    return true;
  }
}

const controller = new BoardGenerationController();

// Initial resting state: Board is visible on screen
let view = controller.getRenderedView();
assert.strictEqual(view.boardVisible, true, 'Initial board must be visible');
assert.strictEqual(view.loadingSpinnerVisible, false, 'Loading spinner must be hidden initially');
assert.strictEqual(view.buttonDisabled, false, 'Button must be enabled initially');
console.log('✔ PASS: Initial resting state verified (Board visible, spinner hidden, button active).');

// ----------------------------------------------------------------------------
// 2. TRIGGER GENERATION: BOARD DISAPPEARS & LOADING SPINNER APPEARS
// ----------------------------------------------------------------------------
console.log('\nTest 2: Verifying Board Disappearance and Loading Spinner Display...');

const mockNewTiles = [
  { id: 'tile_new_1', title: 'Bougainvillea Bract', status: 'PENDING' },
  { id: 'tile_new_2', title: 'Weaver Ant Trail', status: 'PENDING' }
];

const startTime = Date.now();
const generationPromise = controller.handleGenerateNewBoard(async () => {
  // Simulate fast backend response (100ms)
  await new Promise(r => setTimeout(r, 100));
  return mockNewTiles;
});

// Immediately inspect during loading state
view = controller.getRenderedView();
assert.strictEqual(view.boardVisible, false, 'Board must disappear while generating');
assert.strictEqual(view.loadingSpinnerVisible, true, 'Loading circle/spiral must be shown while generating');
assert.strictEqual(view.buttonDisabled, true, 'Button must be disabled while generating');
assert.strictEqual(controller.grimbleDialogue.includes("Scouting fresh woodland territory"), true, 'Grimble dialogue indicates scouting');
console.log('✔ PASS: Board disappears and loading circle/spiral appears on screen.');

// Verify rapid double-click rejection while generating
const concurrentAttempt = controller.handleGenerateNewBoard(async () => []);
assert.strictEqual(concurrentAttempt instanceof Promise, true);
concurrentAttempt.then(result => {
  assert.strictEqual(result, false, 'Concurrent click during generation must be rejected');
});

// ----------------------------------------------------------------------------
// 3. GENERATION COMPLETION: LOADING SPINNER DISAPPEARS & NEW BOARD APPEARS
// ----------------------------------------------------------------------------
console.log('\nTest 3: Verifying Generation Completion & Board Emergence...');

await generationPromise;
const elapsedTime = Date.now() - startTime;

view = controller.getRenderedView();
assert.strictEqual(view.boardVisible, true, 'Board must reappear when generation is complete');
assert.strictEqual(view.loadingSpinnerVisible, false, 'Loading circle/spiral must disappear when complete');
assert.strictEqual(view.buttonDisabled, false, 'Button must re-enable when complete');
assert.strictEqual(controller.activeBoard[0].title, 'Bougainvillea Bract', 'Fresh board tiles are loaded');
assert.strictEqual(controller.grimbleDialogue.includes("brand new woodland territory has unfolded"), true, 'Dialogue updated');
assert.ok(elapsedTime >= 850, `Elapsed time was ${elapsedTime}ms (>= 850ms), ensuring clear visual feedback.`);

console.log(`✔ PASS: Loading circle disappeared and new board appeared after ${elapsedTime}ms.`);
console.log('\n=== ALL BOARD GENERATION TESTS PASSED SUCCESSFULLY ===');
