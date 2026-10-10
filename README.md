# 🌿 Goblin Mode: Nature Scavenger Bingo

**Offline-First, Location-Aware Outdoor Field Journal & AI Botanical Scavenger Hunt**

[![Live Demo](https://img.shields.io/badge/Live_Demo-goblin--nature--bingo.vercel.app-16a34a?style=for-the-badge)](https://goblin-nature-bingo.vercel.app)
[![Backend API](https://img.shields.io/badge/Render_API-Online-amber?style=for-the-badge)](https://goblin-nature-bingo.onrender.com/api/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

---

## 📖 Overview

**Goblin Mode: Nature Scavenger Bingo** is an interactive, tactile outdoor scavenger hunt web application guided by **Grimble**, a voice-synthesized goblin naturalist who gets players off their screens and physically outside exploring parks, gardens, campuses, and neighborhood trails.

Built for the **Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass**, Goblin Mode combines a handcrafted leather-and-parchment field notebook UI with a **4-Gate Computer Vision + Universal Taxonomic RAG + Open-Weight Multimodal AI** pipeline:

1. **Tactile Naturalist Field Journal & Screen-Free Focus Mode**: A `3×3` deckled-paper Bingo grid featuring bespoke ink-and-watercolor SVG botanical illustrations. Selecting any quest tile enters **Focus Mode**, collapsing the UI into a single sensory outdoor mission so players put their phone away and explore the real world.
2. **Universal Taxonomic RAG + Side-by-Side Computer Vision Referee (`90–95%+` Precision)**: Enhances handheld outdoor photos in **YCbCr luminance space** with `UnsharpMask` edge recovery, builds a **`784×448px` Side-by-Side Dual-Scale Inspection Plate** (Full Frame + `2×` Magnified Center Zoom), dynamically synthesizes scientific diagnostic rubrics via **GPT-OSS 120B (`openai/gpt-oss-120b`)**, and grades morphology with **Qwen 3.8 27B (`qwen/qwen3.8-27b`)** or local **Ollama (`moondream` + `gemma2:2b`)**.
3. **Offline-First & Multi-Account Resilient**: Powered by client-side HTML5 Canvas normalization, `idb-keyval` IndexedDB persistence, a **2,250-combination** offline procedural quest matrix, per-UID account state isolation, real-time IST celestial phase shaders (Day / Sunset / Night fireflies), and a dual-channel Web Audio preemption controller.

---

## 🚀 Core Architecture & Pipelines

### 1. Computer Vision + Universal Taxonomic RAG Verification (`/api/verify`)
- **Stage 1 — CV Pre-Processor (`backend/services/image_enhancer.py`)**: Computes Laplacian edge density (`ImageFilter.FIND_EDGES`) to flag blank walls/floor specks, applies 45% blended YCbCr Y-channel auto-contrast (preserving true botanical hues), sharpens venation via `UnsharpMask(radius=1.6, percent=145, threshold=3)`, and composites a `784×448px` Side-by-Side Dual-Scale Inspection Plate (~450 vision tokens—a **5.5× token reduction**).
- **Stage 2 — Universal Two-Tier Taxonomic RAG (`backend/services/botanical_rag.py`)**: Matches 17+ curated Indian & urban species via whole-word boundary regexes (`\b...\b`) or dynamically synthesizes and caches (`_DYNAMIC_RAG_CACHE`) a scientific rubric (`scientific_name`, `mandatory_diagnostic_traits`, `hard_negative_impostors_to_reject`) on the fly via `openai/gpt-oss-120b` for any randomly generated location quest on Earth.
- **Stage 3 — 4-Gate Multimodal Referee (`backend/routes/verify.py`)**: Evaluates Subject Integrity, Mandatory Taxonomic Anatomy, Hard-Negative Impostors (e.g., rejecting *Epipremnum aureum* Money Plant vines submitted as *Ficus religiosa* Peepal leaves, or floor specks submitted as ants), and Optical Blur Tolerance, guarded by a strict server-side `confidence >= 0.85` post-validator.

### 2. 3-Tier Geolocation Quest Engine (`/api/quests/generate`)
- **Tier 1**: Local Ollama open-weight **Gemma 2 (`gemma2:2b`)**.
- **Tier 2**: Cloud Groq LPU open-weight **GPT-OSS 120B (`openai/gpt-oss-120b`)**.
- **Tier 3**: Deterministic **2,250-combination** client-side procedural matrix (`combinatoricMatrix.ts`) for 100% offline trail play.

---

## 🛠️ Tech Stack

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
