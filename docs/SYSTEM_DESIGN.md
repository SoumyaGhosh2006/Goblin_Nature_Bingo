# MASTER SYSTEM DESIGN & ARCHITECTURE — GOBLIN MODE: NATURE SCAVENGER BINGO
**Version:** 1.2.0  
**Project Codename:** `goblin_nature_bingo`  
**Hackathon Target:** Touch Grass Hacktoberfest DEV Challenge  
**Core Thesis:** Playful outdoor scavenger hunt powered by open-weight vision AI, built with a tactile Clash-of-Clans aesthetic, zero screen congestion, infinite quest freshness, and $0 infrastructure cost.

---

## 1. SYSTEM ARCHITECTURE & DATA FLOW

```
                                      ┌────────────────────────────────────────────────────────┐
                                      │                   PLAYER IN THE WILD                   │
                                      │              (Mobile Browser / PWA Client)             │
                                      └───────────────────────────┬────────────────────────────┘
                                                                  │
                                      ┌───────────────────────────┴────────────────────────────┐
                                      │                                                        │
                         [A. Board Generation / Reroll]                           [B. Snap Photo & Submit]
                                      │                                                        │
                                      ▼                                                        ▼
                         ┌─────────────────────────┐                              ┌─────────────────────────┐
                         │ Dynamic Quest Engine    │                              │ Canvas 1024px Downscale │
                         │ - Online: LLM Generator │                              │ JPEG Compress (<300KB)  │
                         │ - Offline: Combinatoric │                              └────────────┬────────────┘
                         │   Matrix (2,250 combos) │                                           │
                         └─────────────────────────┘                                           │
                                                                                               ▼
                         ┌─────────────────────────────────────────────────────────────────────┼───────────────────────┐
                         │                                                                     │                       │
           [Online / Laptop Reachable]                                            [Laptop Off / Direct Trail]      [No Signal]
                         │                                                                     │                       │
                         ▼                                                                     ▼                       ▼
             ┌───────────────────────┐                                             ┌───────────────────────┐ ┌───────────────────┐
             │ FastAPI via Tunnel    │                                             │ Direct Groq API       │ │ IndexedDB Pending │
             │ (Port 8000)           │                                             │ (Open-Weight Llama)   │ │ Foraging Bag      │
             └───────────┬───────────┘                                             └───────────┬───────────┘ └─────────┬─────────┘
                         │                                                                     │                       │
                         ▼                                                                     ▼                       │
             ┌───────────────────────┐                                             ┌───────────────────────┐           │
             │ Local Ollama Service  │                                             │ LPUs on Groq Cloud    │           │
             │ (Google PaliGemma or  │                                             │ Sub-second inference  │           │
             │  Llama-3.2-Vision)    │                                             └───────────┬───────────┘           │
             └───────────┬───────────┘                                                         │                       │
                         │                                                                     │                       │
                         ├─────────────────────────────────────────────────────────────────────┘                       │
                         │ [Raw Response Validation]                                                                   │
                         ▼                                                                                             │
             ┌───────────────────────┐                                                                                 │
             │ Strict JSON Defense   │                                                                                 │
             │ - Pydantic Validator  │                                                                                 │
             │ - Regex JSON Extractor│                                                                                 │
             └───────────┬───────────┘                                                                                 │
                         │                                                                                             │
                         ├───────────────────────┬───────────────────────┐                                             │
                         ▼                       ▼                       ▼                                             │
             ┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐                                 │
             │ Sentry Agent Tracing  │ │ ElevenLabs Voice  │ │ Return JSON Payload   │                                 │
             │ - Logs Token count    │ │ - Generates audio │ │ - passed: boolean     │                                 │
             │ - Logs Latency        │ │ - Graceful 0-cost │ │ - goblin_critique     │                                 │
             │ - Records Trace ID    │ │   bypass if out   │ │ - sensory_bonus       │                                 │
             └───────────────────────┘ └───────────────────┘ └───────────┬───────────┘                                 │
                                                                         │                                             │
                                                                         ▼                                             │
                                      ┌────────────────────────────────────────────────────────┐                       │
                                      │                 FRONTEND GAME ENGINE                   │                       │
                                      │  - Plays ElevenLabs voice (if available)               │                       │
                                      │  - Slams Wax Seal Stamp with haptic vibration          │◄──────────────────────┘
                                      │  - Checks Rows/Cols/Diags for BINGO                    │ (When synced)
                                      │  - Updates Acorns, Woodland XP & LocalStorage          │
                                      │  - Syncs to Cloud Firestore Leaderboard (if configured)│
                                      └────────────────────────────────────────────────────────┘
```

---

## 2. SOCIAL & MULTI-USER ARCHITECTURE (FRIENDS LEADERBOARD)

1. **Client Isolation:** Every player's board, photo blobs, and current quest state live inside their own phone's `localStorage` and `IndexedDB`. No player can ever overwrite another player's progress.
2. **Guest-First Nickname Onboarding:** On first visit, player chooses a nickname (e.g. `MossySam`). No login barrier required to play outdoors.
3. **The "Hedge Foragers Leaderboard":**
   * Pinned to top timber shelf: `[ 🏆 Leaderboard ]`.
   * **Auto-Switching Architecture:**
     * **Mock Mode (Default):** Generates lively simulated woodland rivals (`TwigBiter_99`, `BrambleKing`) when Firebase keys are absent.
     * **Cloud Mode (Live):** Automatically connects to Firebase Cloud Firestore collection `leaderboard` as soon as Firebase environment variables are provided.
4. **Optional Google Sign-In:** Available in settings for players wanting permanent cloud profile linking.

---

## 3. PROJECT REPOSITORY STRUCTURE

```
goblin_nature_bingo/
├── GEMINI.md                 # Antigravity VS Code auto-loader rules
├── ENGINEERING_RULES.md      # Workflow & 30/70 Commenting Standard
├── FRONTEND_SPEC.md          # Complete Frontend UI/UX, Design Tokens & Component Rules
├── BACKEND_AI_SPEC.md        # Complete Backend, Ollama, Groq, Sentry & ElevenLabs Rules
├── SYSTEM_DESIGN.md          # Master Architecture, Data Flow, & 5-Day Roadmap (this file)
│
├── frontend/                 # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js    # Custom Clash-of-Clans color tokens & border utilities
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx           # Layout container & View state router (Resting vs Focus)
│   │   ├── components/
│   │   │   ├── HeaderHUD.tsx         # Pinned timber shelf: Level, Acorns, Sound, Leaderboard
│   │   │   ├── BingoBoard.tsx        # 3x3 Parchment slate with responsive grid
│   │   │   ├── BingoTile.tsx         # Tactile tile with wax seal stamps & 3D bevels
│   │   │   ├── FocusQuestCard.tsx    # Hero quest view with large prompt & hint
│   │   │   ├── CameraCapture.tsx     # Native camera trigger & downscaling canvas
│   │   │   ├── PhotoPreviewModal.tsx # Polaroid frame with 'Send to Grimble' vs 'Retake'
│   │   │   ├── GoblinDialogue.tsx    # Grimble avatar + comic speech bubble
│   │   │   ├── LeaderboardModal.tsx  # Friends ranking parchment with live/mock scores
│   │   │   ├── OnboardingModal.tsx   # Guest nickname picker on first launch
│   │   │   ├── PendingBagModal.tsx   # Offline queue management & sync trigger
│   │   │   └── VictoryModal.tsx      # BINGO celebration with canvas-confetti & chest
│   │   ├── hooks/
│   │   │   ├── useGameState.ts       # LocalStorage game state machine & XP rules
│   │   │   ├── useIndexedDB.ts       # Photo blob persistence & compression
│   │   │   ├── useLeaderboard.ts     # Auto-switching Mock/Firestore synchronization
│   │   │   └── useAudio.ts           # ElevenLabs playback & browser speech fallback
│   │   ├── services/
│   │   │   ├── api.ts                # FastAPI / Tunnel HTTP client
│   │   │   ├── groqDirect.ts         # Direct mobile fallback client for Trail Mode
│   │   │   ├── questGenerator.ts     # Online AI generator + Combinatoric Matrix engine
│   │   │   ├── firebase.ts           # Firebase App, Auth & Firestore initialization
│   │   │   └── queueService.ts       # Offline sync queue orchestrator
│   │   ├── types/
│   │   │   └── game.ts               # Shared TypeScript schemas
│   │   └── data/
│   │       ├── combinatoricMatrix.ts # 15 descriptors x 15 objects x 10 conditions
│   │       └── questPool.ts          # Starter seed pool of 20 sensory quests
│
└── backend/                  # Python 3.10+ FastAPI Microservice
    ├── requirements.txt
    ├── main.py               # FastAPI entry, CORS, Sentry init
    ├── config.py             # Settings (Ollama host, Groq key, ElevenLabs key, Sentry DSN)
    ├── routes/
    │   ├── verify.py         # POST /api/verify handler
    │   ├── quests.py         # POST /api/quests/generate handler
    │   └── health.py         # GET /api/health
    └── services/
        ├── ollama_client.py  # Async Ollama client (PaliGemma / Gemma 2)
        ├── groq_client.py    # Async Groq open-weight fallback client
        ├── elevenlabs_svc.py # TTS with credit-exhaustion safety wrapper
        └── prompt_builder.py # Two-tier JSON defense & Grimble system prompt
```

---

## 4. FIVE-DAY SPRINT ROADMAP

```
┌────────────────────────────────────────────────────────────────────────┐
│                        5-DAY DEVELOPMENT SCHEDULE                      │
├───────┬─────────────────────────┬──────────────────────────────────────┤
│ Day   │ Primary Objective       │ Deliverables                         │
├───────┼─────────────────────────┼──────────────────────────────────────┤
│ Day 1 │ Frontend Foundation     │ Vite + React + Tailwind Setup.       │
│       │ & Clash UI Shell        │ Custom colors, timber frames, 3x3    │
│       │                         │ Bingo board & Focus Mode card.       │
├───────┼─────────────────────────┼──────────────────────────────────────┤
│ Day 2 │ Camera, Storage & Queue │ Native camera capture, canvas 1024px │
│       │                         │ downscale, LocalStorage game state,  │
│       │                         │ IndexedDB photo stash, Pending Bag.  │
├───────┼─────────────────────────┼──────────────────────────────────────┤
│ Day 3 │ Backend & AI Pipeline   │ FastAPI setup, Ollama (PaliGemma),   │
│       │                         │ Groq fallback client, Two-tier JSON  │
│       │                         │ defense, POST /api/verify working.   │
├───────┼─────────────────────────┼──────────────────────────────────────┤
│ Day 4 │ Dynamic Quests, Social  │ Dynamic quest generation, Firebase   │
│       │ & Sponsor Polish        │ Leaderboard modal, ElevenLabs voice, │
│       │                         │ Sentry tracing & confetti victory.   │
├───────┼─────────────────────────┼──────────────────────────────────────┤
│ Day 5 │ Field Test & Submission │ Take app to local park/trail, test   │
│       │                         │ live finds, record 60s demo video,   │
│       │                         │ embed DevRelay session in DEV post!  │
└───────┴─────────────────────────┴──────────────────────────────────────┘
```

---

## 5. STRICT IMPLEMENTATION RULES (FOR CODING AGENTS)

1. **Adhere to Specifications:** Implement strictly against `FRONTEND_SPEC.md`, `BACKEND_AI_SPEC.md`, and `ENGINEERING_RULES.md`.
2. **Comment Ratio:** Maintain the strict **30% Comments / 70% Code ratio** on all source files.
3. **Mobile First & Anti-Congestion:** Maintain the specified screen height ratios (12% HUD, 70% Canvas, 18% Dialogue). Minimum touch targets must remain 48px × 48px.
4. **Graceful Degradation:** The game must NEVER crash if ElevenLabs credits run out, if Firebase config is missing (falls back to mock leaderboard), or if cell reception drops. Every failure path has a clean fallback.
5. **Zero Cloud Costs:** Never introduce paid cloud compute or subscription resources requiring credit cards.
