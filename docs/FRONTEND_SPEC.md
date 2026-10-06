# FRONTEND SPECIFICATION — GOBLIN MODE: NATURE SCAVENGER BINGO
**Version:** 1.2.0  
**Target Platform:** Mobile Web (PWA-ready Responsive SPA)  
**Primary Design Philosophy:** Tactical, Chunky Supercell/Clash-of-Clans aesthetic + Zero screen congestion + Sunlight readable + Infinite Quest Freshness + Friends Cloud Leaderboard.

---

## 1. TECH STACK & DEPENDENCIES

* **Framework:** React 18+ with Vite
* **Styling:** Tailwind CSS (configured with custom Clash-of-Clans design tokens)
* **Animation & Transitions:** Framer Motion (for layout morphing and 3D card flips)
* **Icons:** `lucide-react` (wrapped in custom chunky wood/gold badges)
* **Confetti/Celebration:** `canvas-confetti`
* **Local Persistence:** Browser `localStorage` (game state) + `IndexedDB` (photo storage via `idb-keyval` or native IndexedDB)
* **Cloud & Social (Free Tier):** Firebase Web SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`)
  * Auto-switching: runs with local mock foragers when Firebase env keys are missing; connects to real Firestore when configured.
* **Audio/Speech:** Web Audio API (chunky click sounds) + Browser `window.speechSynthesis` / ElevenLabs audio playback.

---

## 2. DESIGN LANGUAGE & ART STYLE RULES (CLASH OF CLANS VIBE)

Every element on the screen must feel like a physical, tangible woodland toy.

### 2.1 The "Juicy 3D Button" Rule
* Every button MUST have a dark bottom border/shadow creating a 3D isometric bevel:
  * Resting: `border-b-[4px] border-[#2A1708] shadow-md`
  * Active/Tapped: `active:translate-y-[2px] active:border-b-[2px] active:shadow-none`
* **NO FLAT BUTTONS.** Even secondary buttons must feel clicky and tactile.

### 2.2 Materiality & Surfaces
1. **Dark Carved Timber (`#4A2E18`):** Used for outer frames, board edges, and button anchor bases.
2. **Aged Parchment Slate (`#F5E8C7` to `#EBD8AA`):** Used for quest tiles and active quest cards. High contrast against dark text.
3. **Loot Gold (`#FDB813` with border `#B87B00`):** Used for XP badges, level shields, and completed Bingo stars.
4. **Supercell Action Green (`#58CC02` with border `#2F7E00`):** Used strictly for primary call-to-actions ("Snap Proof", "Claim Reward").
5. **Grimble Olive (`#7DA333`):** Goblin DM accents and dialogue borders.
6. **Reject Crimson Wax (`#E54B4B` with border `#941E1E`):** Used when photo verification fails or quest reroll cost.

### 2.3 Typography & Readability in Sunlight
* **Display/Headings:** Chunky display font (e.g., `Lilita One`, `Fredoka`, or fallback heavy rounded sans-serif `ui-rounded, system-ui, -apple-system`).
* **Body/Quest Text:** High-contrast dark charcoal (`#1C160C`) on warm parchment (`#F5E8C7`). Minimum font size: `14px` for body, `16px-20px` for quest titles.

---

## 3. SCREEN REAL ESTATE & RATIO ALLOCATION (ANTI-CONGESTION)

Based on standard mobile viewport (~390px × 844px), screen space is strictly zoned:

```
┌────────────────────────────────────────────────────────┐  ▲
│ [ZONE 1: TOP HUD]                                      │  │ 12% (~100px)
│ Level Shield | Acorns 🪙 | Active Streak | 🏆 Leader   │  │ Pinned Timber Shelf
├────────────────────────────────────────────────────────┤  ▼
│                                                        │  ▲
│ [ZONE 2: MAIN PLAY CANVAS]                             │  │ 70% (~590px)
│                                                        │  │
│  MODE A (Resting): 3x3 Bingo Parchment Grid            │  │ High margin
│  MODE B (Focus):   Top Mini-Tracker (15%) +            │  │ (16px horizontal)
│                    Active Focus Quest Card (55%)       │  │ Zero edge bleed
│                                                        │  │
├────────────────────────────────────────────────────────┤  ▼
│ [ZONE 3: GOBLIN DM DIALOGUE DRAWER]                   │  ▲ 18% (~150px)
│ Grimble Avatar + Dynamic Comic Speech Bubble           │  │ Thumb-accessible
└────────────────────────────────────────────────────────┘  ▼
```

* **Touch Targets:** All interactive tiles and buttons must have a minimum bounding box of **48px × 48px**.
* **Negative Space:** Minimum **12px gap** between bingo tiles; minimum **16px outer gutter** from screen edges.

---

## 4. DYNAMIC QUEST RANDOMNESS & INFINITE FRESHNESS

To ensure players never get bored by static repetitive quests, the frontend employs a dual-engine quest generator:

### 4.1 Engine A: Online Dynamic AI Quest Generation (Primary)
* Triggered when tapping **"New Board"** or **"Bribe Grimble (Reroll)"** while online.
* Calls the backend (or direct Groq API in Trail Mode) with temperature `0.8`.
* Passes the user's `completedQuestIds: string[]` to explicitly exclude previously found items.
* Returns 9 novel, witty, sensory woodland quests tailored to outdoor exploration.

### 4.2 Engine B: Offline Combinatoric Matrix Generator (2,250+ Combinations)
* Automatically activates if the device is offline or API fails.
* Mathematically combines:
  * **15 Sensory Descriptors:** (Velvety, battle-scarred, Fibonacci spiral, two-toned, damp, miniature, hollow, jagged, sun-bleached, fragrant, peeling, delicate, gnarly, glistening, fossil-like)
  * **15 Nature Objects:** (Leaf, tree bark, pebble, wild fungus, acorn/nut, insect path, bird feather, water puddle, spider web, moss cushion, pinecone, vine, wildflower, root system, soil patch)
  * **10 Conditions:** (In deep shade, touched by direct sunlight, near flowing water, resting on decaying wood, sheltered under a boulder, weathered by wind, perched off the ground, hidden under fallen foliage, growing on vertical surface, older than a season)
* **15 × 15 × 10 = 2,250 unique procedural variations**, ensuring no repeated boards on hikes!

---

## 5. USER ONBOARDING & CLOUD LEADERBOARD (FIREBASE)

### 5.1 Guest-First Frictionless Onboarding
* On first launch, the user is greeted with a rustic timber popup:
  > *"Halt, traveler! What name do the woodland critters call you?"*
* Input: Goblin Nickname (e.g. `MossySam`, `AcornHunter`) with auto-generated defaults.
* Instant play starts immediately. **Zero password screens or mandatory login walls.**

### 5.2 The "Hedge Foragers Leaderboard" Modal
* Accessible anytime via the **`[ 🏆 Leaderboard ]`** icon on the top timber HUD shelf.
* Displays a parchment leaderboard ranking:
  * Rank (🥇, 🥈, 🥉), Player Nickname, Level Shield, Woodland XP, and Completed Bingos count.
* **Auto-Switching Architecture:**
  * **Mock Mode (Default when no Firebase config present):** Populates with entertaining simulated rival foragers (e.g. `TwigBiter_99`, `BrambleKing`, `ElderFern`) that track alongside the player's XP.
  * **Cloud Mode (Active when Firebase keys provided):** Reads real-time scores from Cloud Firestore collection `leaderboard`.

### 5.3 Optional Google Sign-In
* Inside the settings modal: a clean "Link Google Account" button for players who want to preserve progress across different phones.

---

## 6. VIEW STATES & USER FLOW

The frontend operates in **3 Primary View Modes**:

```
[RESTING 3x3 BOARD] ──(Tap Tile)──> [FOCUS QUEST MODE] ──(Snap Camera)──> [CONFIRM PREVIEW]
        ▲                                                                        │
        │                                                                (Send to Grimble)
        │                                                                        ▼
[BINGO FANFARE MODAL] <──(All in Row)── [VERIFICATION EVAL] <────────────────────┘
```

### 6.1 Mode 1: Resting 3x3 Board
* Full 3x3 grid on a carved parchment slate.
* Each tile shows icon, 2-word title, and status (Uncompleted vs Stamped).
* Center tile is the **"Wildwood Freebie"** or standard quest.
* Tapping any incomplete tile transitions into **Focus Mode**.

### 6.2 Mode 2: Focus Quest Mode (Hybrid Split)
* **Top 15%:** Board shrinks to a compact 3x3 dot mini-tracker.
* **Center 55%:** The **Hero Quest Focus Card**:
  * Large objective text (e.g. *"Find a leaf that survived a battle with a caterpillar"*).
  * Grimble's Pro-Tip: *"Look near the base of bushes where insects graze!"*
  * Reroll Button: 🎲 *"Bribe Grimble"* (1 free reroll per board, then costs 20 Acorns).
  * Giant Shutter Button: **`[ 📸 SNAP PROOF ]`**.
* **Back Button:** Wooden "← Back to Board" pill.

### 6.3 Mode 3: Confirm & Retake Preview
* Polaroid frame with captured photo:
  * **`[ 🔄 RETAKE ]`** (Timber brown button)
  * **`[ 🚀 SEND TO GRIMBLE ]`** (Juicy green button)

### 6.4 Verification & Stamp Feedback
* **Loading State:** Grimble sniffs the pixels with a magnifying glass.
* **If PASSED:**
  * Heavy brass wax seal slams down with screen bounce (`scale: [1.3, 0.95, 1.0]`).
  * Haptic vibration (`navigator.vibrate([30, 50, 30])`) + audio thud.
  * Woodland XP awarded + real-time Firestore sync.
* **If REJECTED:**
  * Soft crimson "Try Again!" tag with humorous Goblin explanation.

---

## 7. BINGO WIN CONDITIONS & CELEBRATION

1. **Line Detection Algorithm:**
   * Checks 3 rows, 3 columns, and 2 diagonals.
   * If a new line is completed:
     * Golden trajectory beam animates across the 3 tiles.
     * **BINGO Victory Fanfare Modal**:
       * Canvas-confetti leaf/star burst.
       * Large wooden chest opens awarding **100 Bonus Acorns**.
       * Choice presented:
         * **`[ 🌲 KEEP FORAGING (9/9 BLACKOUT) ]`**
         * **`[ 🔄 NEW BOARD ]`** (Calls dynamic generator for 9 fresh quests)

---

## 8. OFFLINE STORAGE & DATA SCHEMA

### 8.1 `localStorage` (Game State)
```typescript
interface GameState {
  playerNickname: string;
  playerLevel: number;
  woodlandXP: number;
  acorns: number;
  currentBoardId: string;
  freeRerollsRemaining: number;
  activeTileIndex: number | null;
  completedQuestHistory: string[]; // for preventing duplicate AI generation
  tiles: QuestTileState[];
}

interface QuestTileState {
  id: string;
  index: number;
  title: string;
  description: string;
  hint: string;
  icon: string;
  xpReward: number;
  status: 'PENDING' | 'QUEUED' | 'VERIFYING' | 'COMPLETED';
  photoId?: string;
  verifiedAt?: string;
  goblinCritique?: string;
}
```

### 8.2 `IndexedDB` (Photo Storage & Pending Bag)
* Table `captured_photos`: key `photoId`, value compressed JPEG Blob (<300KB).
* Table `pending_verifications`: key `id`, value queued verification records for offline sync.
