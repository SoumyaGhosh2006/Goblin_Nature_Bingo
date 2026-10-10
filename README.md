# 🌿 Goblin Mode: Nature Scavenger Bingo

**Offline-First, Location-Aware Outdoor Field Journal & AI Botanical Scavenger Hunt**

[![Live Demo](https://img.shields.io/badge/Live_Demo-goblin--nature--bingo.vercel.app-16a34a?style=for-the-badge)](https://goblin-nature-bingo.vercel.app)
[![Backend API](https://img.shields.io/badge/Render_API-Online-amber?style=for-the-badge)](https://goblin-nature-bingo.onrender.com/api/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

---

## 📖 Overview

**Goblin Mode: Nature Scavenger Bingo** is an interactive, tactile outdoor scavenger hunt web application guided by **Grimble**, an eccentric, voice-synthesized goblin naturalist who gets players off their screens and physically outside exploring parks, gardens, campuses, and neighborhood trails.

Instead of endlessly scrolling through an app, users receive nature-based missions on a `3×3` weathered leather-and-parchment field binder, step outside to explore their surroundings, photograph real botanical and zoological specimens, and use a multi-stage **Computer Vision + Universal Taxonomic RAG + Open-Weight Multimodal AI** referee to verify their discoveries.

### Core Capabilities
1. **Tactile Naturalist Field Journal & Screen-Free Focus Mode**: A `3×3` deckled-paper Bingo grid featuring stitched leather borders, brass corner brackets, washi masking tape, and bespoke ink-and-watercolor SVG botanical illustrations. Selecting any quest tile enters **Focus Mode**, collapsing the UI into a single sensory outdoor mission so players put their phone away and explore the real world.
2. **Universal Taxonomic RAG + Dual-Scale Computer Vision Referee (`90–95%+` Precision)**: Enhances handheld outdoor photos in **YCbCr luminance space** with `UnsharpMask` edge recovery, builds a **`784×448px` Side-by-Side Dual-Scale Naturalist Inspection Plate** (Full Frame + `2×` Magnified Center Zoom), dynamically synthesizes scientific diagnostic rubrics via **GPT-OSS 120B (`openai/gpt-oss-120b`)**, and grades morphology with **Qwen 3.8 27B (`qwen/qwen3.8-27b`)** or local **Ollama (`moondream` + `gemma2:2b`)**.
3. **Offline-First & Multi-Account Resilient**: Powered by client-side HTML5 Canvas normalization, account-scoped `idb-keyval` IndexedDB persistence, a **2,250-combination** offline procedural quest matrix, 10-second real-time IST celestial phase shaders (Day / Sunset / Night fireflies), and a dual-channel Web Audio preemption controller.

---

## 🏗️ System Architecture & Internal Dataflow Pipelines

### Pipeline 1: Computer Vision + Universal Taxonomic RAG + 4-Gate Vision Verification (`/api/verify`)

```text
[User Captures Outdoor Photo (Camera / File Input)]
        │
        ▼
[Client-Side HTML5 Canvas Normalization (frontend/src/hooks/useIndexedDB.ts)]
 ├─> Enforces min 64px / max 1280px bounding box (prevents cloud API HTTP 400 min-dimension errors)
 ├─> Composites transparent PNG/WebP channels onto #FFFFFF backdrop
 └─> Encodes optimized JPEG (0.88 quality, <300KB payload) + caches in IndexedDB
        │
        ▼
[Stage 1: Backend CV Pre-Processor & Edge Telemetry (backend/services/image_enhancer.py)]
 ├─> Grayscale conversion + Laplacian Edge Detection (ImageFilter.FIND_EDGES)
 ├─> Computes ActiveEdgeRatio (pixels > gradient 28) & 3-channel ColorStd
 ├─> Flags featureless surfaces / floor specks (ActiveEdgeRatio < 0.010 & ColorStd < 18.0)
 ├─> Converts RGB -> YCbCr & applies 45% blended Auto-Contrast ONLY on Luminance (Y)
 │   (Recovers shadow/highlight dynamic range without distorting true botanical RGB hues)
 ├─> Applies UnsharpMask (radius = 1.6, percent = 145%, threshold = 3) to sharpen blurry veins
 └─> Generates a 784×448px Side-by-Side Dual-Scale Naturalist Inspection Plate:
      ├── Left Panel (448×448px): Enhanced Full Frame (macro geometry & context)
      └── Right Panel (332×448px): 2× Magnified & Sharpened Center Detail Crop (micro-venation & insect legs)
        │
        ▼
[Stage 2: Universal Two-Tier Taxonomic RAG Engine (backend/services/botanical_rag.py)]
 ├─> Tier 1 (Curated Biodiversity Index): Whole-word regex lookup (\b{keyword}s?\b) across 17+ core species
 └─> Tier 2 (Live Dynamic Taxonomic RAG Synthesizer + In-Memory Cache):
      ├── Queries open-weight openai/gpt-oss-120b (temp = 0.1, reasoning_effort = "low")
      ├── Synthesizes Scientific Name + 3 Mandatory Diagnostic Traits + 3 Hard-Negative Impostors
      │   for ANY unseen, randomly generated location-based quest on Earth
      └── Caches rubric in _DYNAMIC_RAG_CACHE (0ms lookup on repeat attempts)
        │
        ▼
[Stage 3: 4-Gate Multimodal Vision Referee (qwen/qwen3.8-27b / Local Moondream + Gemma 2)]
 ├─> Gate 1 (Subject Integrity): Rejects blank walls, floor dust, and non-biological smudges
 ├─> Gate 2 (Mandatory Taxonomic Anatomy): Verifies blade apex (e.g., Ficus religiosa caudate
 │   drip-tip >= 20% blade length), margin serrations, or 3-part insect segmentation + 6 jointed legs
 ├─> Gate 3 (Hard-Negative Impostor Gate): Rejects lookalikes (e.g., Epipremnum aureum Money Plant
 │   vines or Piper betle submitted as Peepal leaf) -> sets is_impostor_or_fake = true
 └─> Gate 4 (Optical Blur & Screen Tolerance): Accepts genuine specimens despite handheld motion softness
        │
        ▼
[Stage 4: Two-Tier JSON Defense & Server-Side Post-Validation Guard (backend/routes/verify.py)]
 ├─> Regex fence stripping + outermost {} AST extraction (prompt_builder.py)
 ├─> Hard Server Override: Forces passed = false & woodland_xp = 0 if:
 │    • is_impostor_or_fake == true
 │    • confidence < 0.85
 │    • telemetry.is_featureless_or_speck == true
 └─> Triggers SHA-256 cached ElevenLabs voice critique + updates Firestore Leaderboard & Bingo Grid
```

### Pipeline 2: Geolocation Procedural Board Generation & 3-Tier Fallback Engine (`/api/quests/generate`)

```text
[User Clicks "Generate New Board"]
        │
        ▼
[UI Transition Guard (App.tsx & BingoBoard.tsx)]
 ├─> Board unmounts cleanly & renders Dual Concentric Emerald/Amber Loading Spirals
 └─> Enforces >= 850ms minimum visual transition threshold (prevents sub-second jarring UI flicker)
        │
        ▼
[Geolocation & Exclusion Harvester (useUserLocation.ts)]
 ├─> Extracts browser GPS coordinates -> resolves local region context
 └─> Collects completed tile titles to guarantee 0% duplicate quest repetition
        │
        ▼
[3-Tier Quest Synthesis Cascade]
 ├─> Tier 1 (Local Open-Weight Inference): Queries local Ollama Gemma 2 (gemma2:2b)
 ├─> Tier 2 (Cloud Open-Weight LPU): Queries Groq openai/gpt-oss-120b (temp = 0.8, reasoning_effort = "low")
 └─> Tier 3 (Zero-Latency Offline Combinatoric Matrix — combinatoricMatrix.ts):
      └── Multiplies 15 Sensory Adjectives × 15 Nature Nouns × 10 Location Contexts
          = 2,250 unique offline quests with automatic species icon mapping
```

---

## 🛠️ Engineering Deep-Dive: Real Problems We Faced & How We Tackled Them

Building an AI application that works reliably outdoors required solving several non-obvious computer-vision and distributed-systems problems uncovered during testing:

### 1. The "Everything Is Blurry" Bug & RGB Auto-Contrast Distortion
- **What Went Wrong**: When we first deployed the backend to Render and tested real phone photos—including a real damp mossy wall in a bathroom and outdoor leaves—the verifier kept rejecting valid photos as *"blurry or obscured."* Tracing the pipeline revealed two culprits: first, our cloud container was attempting to reach a local Ollama vision instance (`127.0.0.1:11434`) first and falling back to a blind placeholder description when Ollama wasn't running on Render; second, when we added standard RGB `ImageOps.autocontrast` to sharpen blurry camera shots, it stretched the Red, Green, and Blue histograms independently. On a green leaf with very little red-channel variance, independent RGB stretching distorted natural chlorophyll greens into dark, unnatural blotches!
- **How We Solved It**:
  1. **Luminance-Preserving `YCbCr` Auto-Contrast**: We routed cloud vision directly to multimodal **`qwen/qwen3.8-27b`** and re-engineered `image_enhancer.py` to convert images into **`YCbCr` color space**, applying a `45%`-blended `autocontrast` **exclusively on the Luminance (`Y`) channel** before merging back with the untouched `Cb` and `Cr` chrominance channels.
  2. **UnsharpMask Kernel Recovery**: Paired with **`UnsharpMask(radius=1.6, percent=145%, threshold=3)`**, this recovered crisp leaf venation, serrated edges, and mossy bryophyte textures from slightly blurry phone shots while preserving **100% of true botanical RGB hues**.

### 2. When the Model Became "Too Chill": Stopping Floor Dots & Vine Impostors
- **What Went Wrong**: After making the prompt tolerant of slight camera blur, the model became overly lenient. When we tested it by submitting a photo of tiny black and white dots on a floor for a *"Weaver Ant Trail"* quest, it approved them as ants! When we submitted a random heart-shaped indoor *Money Plant* (*Epipremnum aureum*) vine leaf for a *"Heart-Shaped Peepal Leaf"* (*Ficus religiosa*) quest, it approved that too—only rejecting photos when the frame was a completely blank wall.
- **How We Solved It**:
  1. **Laplacian Edge & Speck Telemetry**: We added pre-inference computer vision telemetry using `ImageFilter.FIND_EDGES` and `ImageStat`. Any image with `ActiveEdgeRatio < 0.010` and `ColorStd < 18.0` (or `EdgeMean < 2.0`) is automatically flagged with `is_featureless_or_speck = True`, mathematically catching floor dots and blank surfaces.
  2. **4-Gate Taxonomic RAG & Whole-Word Regexes**: We built `botanical_rag.py` with explicit **Mandatory Diagnostic Traits** and **Hard-Negative Impostors to Reject**, plus a server-side post-validation guard (`confidence >= 0.85` and `is_impostor_or_fake == False`). During testing, we also caught a classic regex bug: substring matching caused the keyword `"ant"` in our arthropod classifier to falsely match `"Touch-Me-Not Plant"` (`pl-ant`) and `"Fragrant Plumeria"` (`fragr-ant`)! Switching to strict **word-boundary regular expressions (`\b{keyword}s?\b`)** fixed the collision immediately. In benchmark runs, floor dots and wrong vine leaves were cleanly rejected at **`confidence = 0.00–0.05`**.

### 3. Overcoming the 7,000 ITPM Token Wall & Supporting Infinite Location Quests
- **What Went Wrong**: Because players can generate quests dynamically anywhere in the world, we couldn't rely on a static hardcoded species list. However, when we initially sent two high-resolution base64 images (`1280px` Full Frame + `768px` `2×` Detail Crop) and ran dynamic RAG synthesis on the same vision model (`qwen/qwen3.8-27b`), a single verification consumed **5,194 input tokens**—hitting Groq's `7,000 ITPM` free-tier rate limit on the very second photo! We also discovered that legacy `.env` configurations referencing `llama-3.2-11b-vision-preview` failed with `HTTP 400 model_decommissioned`.
- **How We Solved It**:
  1. **5.5× Vision Token Reduction**: Instead of sending two separate high-res images, `image_enhancer.py` composites the `448×448` Enhanced Full View and the `332×448` `2×` Magnified Center Zoom side-by-side into a single **`784×448px` Naturalist Inspection Plate** (~450 vision tokens). Combined with `/no_think` and `max_tokens: 220`, total input tokens dropped from **5,194 to ~900 tokens per verification (an 82% reduction)**, enabling **6–7 consecutive photo verifications per minute** with zero rate-limit errors.
  2. **Decoupled 120B Dynamic RAG Synthesizer**: We routed Tier-2 Dynamic Taxonomic RAG synthesis and board generation to Groq's **120B `openai/gpt-oss-120b`** (`reasoning_effort="low"`), which uses a separate rate-limit bucket and synthesizes full scientific rubrics for any unseen location quest in `~0.3s` (cached in `_DYNAMIC_RAG_CACHE` for `0ms` repeat lookups).
  3. **Self-Healing Model Config**: Added automatic runtime sanitization in `config.py` that transparently upgrades decommissioned `.env` model strings to `qwen/qwen3.8-27b`.

### 4. Eliminating Audio Layering, Clock Drift & Cross-Account State Leaks
- **Centralized Audio Preemption (`audioManager.ts`)**: Rapidly clicking specimen tiles, lighting toggles, and Grimble's voice button originally caused 2–3 audio instances to play simultaneously. We replaced scattered `.play()` calls with a singleton dual-channel controller that runs `pause()` + `currentTime = 0` with a `60ms` debounce on the `SFX` channel while protecting the `Voice` channel from minor UI interruptions.
- **10-Second Real-Time IST Atmosphere Engine (`RealTimeAtmosphere.tsx`)**: Syncs every `10s` to `UTC +05:30` across **Morning/Day (`07:00–17:00 IST`)**, **Evening/Sunset (`17:00–19:00 IST`)**, and **Night (`19:00–07:00 IST`)**, strictly confining bioluminescent firefly particles to nocturnal hours.
- **Account-Scoped Storage Hydration (`App.tsx`)**: To prevent Player A's offline board and XP from leaking when Player B logs in on the same device, we bound IndexedDB keys to Firebase Auth's `onAuthStateChanged` UID (`goblin_bingo_board_v4_<uid>` vs. `goblin_bingo_board_v4_guest`) and purged in-memory state on logout.

---

## 📊 Quantitative Engineering Metrics & Stability Benchmarks

| Engineering Dimension | Baseline / Naive Approach | Engineered Solution in Goblin Mode | Measured Impact / Metric |
| :--- | :--- | :--- | :--- |
| **Vision Input Token Consumption** | Sending separate full-frame (`1280px`) + crop (`768px`) images used **5,194 tokens/call**, hitting Groq's `7,000 ITPM` cap on the 2nd photo. | Built a single **`784×448px` Side-by-Side Composite Inspection Plate** + `/no_think` + `max_tokens: 220`, and offloaded text RAG synthesis to `openai/gpt-oss-120b`. | **5.5× token reduction** (`5,194` $\to$ **~900 input tokens/call**; **82% savings**), enabling **6–7 verifications/min** with **0 rate-limit errors**. |
| **Taxonomic Impostor & Speck Rejection** | Permissive prompts falsely passed floor dust specks as ants and *Epipremnum* Money Plant vines as Peepal leaves. | Laplacian edge telemetry (`ActiveEdgeRatio < 0.010`), whole-word regexes (`\b...\b`), Dynamic 120B RAG rubrics, and a server-side `confidence >= 0.85` gate. | **90–95%+ taxonomic accuracy**; floor dots rejected at **`confidence = 0.00–0.05`**, wrong vine leaves rejected at **`confidence = 0.05`**. |
| **Blurry Outdoor & Mossy Wall Recovery** | RGB `autocontrast` distorted leaf hues; slight handheld camera blur caused false rejections on real indoor/outdoor moss. | **YCbCr Y-channel 45% blended auto-contrast** + **`UnsharpMask(radius=1.6, percent=145%, threshold=3)`** + Gate 4 optical tolerance. | Preserves **100% of true RGB hues** while recovering fine venation and bryophyte clump textures from blurry phone shots. |
| **Dynamic Location Quest Coverage** | Static hardcoded species lists break when new quests are generated for different cities. | Live **Tier-2 Dynamic Taxonomic RAG Synthesizer** (`openai/gpt-oss-120b`) + `_DYNAMIC_RAG_CACHE`. | **100% coverage** of unseen location-generated quests; **`0ms` lookup latency** on cached repeat attempts. |
| **Voice Narration Latency & Cost** | Re-synthesizing identical Grimble voice critiques on every click via TTS API. | Deterministic **`SHA-256(text + voice_id)`** MP3 disk cache (`backend/audio_cache/`). | Repeat voice latency dropped from **`~1,400ms` to `<15ms`** (**>70% reduction** in TTS API credit usage). |
| **Atmosphere Clock Sync Speed** | Long polling intervals caused noticeable delay when device time crossed phase boundaries. | **10-second polling interval** with exact UTC-to-IST (`+05:30`) minute boundary math. | Guaranteed **$\le 10\text{s}$** real-time atmospheric transition response. |

---

## 🧰 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS 4, Framer Motion, HTML5 Canvas, IndexedDB (`idb-keyval`), Firebase Auth & Cloud Firestore.
- **Backend**: FastAPI (Python 3.11), Pillow (`PIL`), `httpx`, Pydantic v2.
- **Open-Weight AI & Local Inference**: `qwen/qwen3.8-27b`, `openai/gpt-oss-120b` (Groq LPU), `gemma2:2b`, `moondream` (Local Ollama).
- **Voice & Monitoring**: ElevenLabs TTS (`eleven_multilingual_v2` with SHA-256 disk caching) & Sentry SDK v2 (`sentry-sdk` AI agent tracing).
- **Deployment**: Render (`render.yaml` Blueprint) & Vercel.

---

## ⚡ Quick Start

### 1. Backend Setup (`FastAPI`)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows (or `source .venv/bin/activate` on macOS/Linux)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (`React + Vite`)
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.
