# BACKEND & AI SYSTEM SPECIFICATION — GOBLIN MODE: NATURE SCAVENGER BINGO
**Version:** 1.2.0  
**Target Architecture:** Resilient Hybrid (Local Ollama with Google PaliGemma + Direct Mobile Groq Cloud Fallback + ElevenLabs Voice + Sentry Tracing + Dynamic Quest Generator + Offline Pending Bag)  
**Hackathon Tracks Targeted:** Core Open-Source "Touch Grass" + Gemma ($200) + ElevenLabs ($100) + Sentry ($100) + Entire ($100)

---

## 1. ARCHITECTURE OVERVIEW

The backend provides 100% field resilience at **$0.00 infrastructure cost** (zero paid cloud servers or credit card requirements).

```
                              ┌───────────────────────────────────────────┐
                              │           MOBILE FRONTEND (PWA)           │
                              └─────────────────────┬─────────────────────┘
                                                    │
                   ┌────────────────────────────────┼──────────────────────────────┐
                   │                                │                              │
          [MODE 1: LOCAL WIFI/TUNNEL]     [MODE 2: TRAIL CLOUD]          [MODE 3: NO SIGNAL]
                   │                                │                              │
                   ▼                                ▼                              ▼
        ┌───────────────────────┐        ┌───────────────────────┐      ┌─────────────────────┐
        │ Cloudflare Tunnel URL │        │ Direct Groq API       │      │ Offline Pending Bag │
        │ (HTTPS public link)   │        │ (HTTPS Endpoint)      │      │ (IndexedDB Queue)   │
        └──────────┬────────────┘        └──────────┬────────────┘      └──────────┬──────────┘
                   │                                │                              │
                   ▼                                ▼                              │
        ┌───────────────────────┐        ┌───────────────────────┐                 │
        │ Local FastAPI Backend │        │ Open-Weight Vision    │                 │
        │ - Vision Verification │        │ Llama-3.2-11b-Vision  │                 │
        │ - Quest Generator     │        │ (Sub-second on Groq)  │                 │
        │ - Sentry Tracing      │        └───────────────────────┘                 │
        │ - ElevenLabs Audio    │                                                  │
        └──────────┬────────────┘                                                  │
                   │                                                               │
                   ▼                                                               │
        ┌───────────────────────┐                                                  │
        │ Local Ollama Service  │                                                  │
        │ Google PaliGemma /    │                                                  │
        │ Gemma 2 (Port 11434)  │                                                  │
        └───────────────────────┘                                                  │
                   ▲                                                               │
                   └────────── (When user returns to signal / taps "Sync") ────────┘
```

---

## 2. PARTNER INTEGRATIONS & ZERO-COST GUARANTEES

### 2.1 Google Gemma (Sponsor Track: $200)
* **Model Choices in Ollama:**
  * **PaliGemma:** Google's open-weight vision-language model for evaluating user photos.
  * **Gemma 2 (2B / 9B):** Google's lightweight open-weight LLM for dynamic quest generation and Grimble personality roleplay.
* **Cost:** 100% Free. Open weights run locally on laptop hardware via Ollama.

### 2.2 ElevenLabs TTS (Sponsor Track: $100) — Graceful Credit Degradation
* **Role:** Gives Grimble the Goblin a voice when critiquing scavenger finds.
* **Credit Behavior:**
  * **If credits exist & API key is valid:** Returns audio (`audio_base64` or stream URL) to play Grimble's critique aloud.
  * **If credits run out (429 / 400 exhausted) or API key is absent:** **Graceful Fallback.** Returns `audio_url: null`. The frontend displays parchment text dialogue without crashing.
  * **Future Scope Hook:** Architecture reserves a clean hook for triggering pre-recorded static `.mp3` sound bites if offline or out of credits.

### 2.3 Sentry Agent Tracing (Sponsor Track: $100)
* **Role:** Traces AI model response latency, token throughput, and API errors.
* **Cost:** 100% Free Developer Tier (5,000 errors + 10,000 performance transactions/month).
* **Setup:** Configured in `main.py` via `sentry_sdk.init(...)`. Dashboards provide screenshots for the final DEV submission post.

### 2.4 Entire / DevRelay (Sponsor Track: $100)
* **Role:** Session documentation using DEV's native Liquid tags (`{% agent_session ... %}`) to embed development milestones directly in the hackathon write-up.
* **Cost:** 100% Free.

---

## 3. FASTAPI BACKEND SPECIFICATION

### 3.1 Tech Stack
* **Language:** Python 3.10+
* **Framework:** FastAPI + Uvicorn
* **Monitoring:** `sentry-sdk` (FastAPI and HTTP tracing)
* **AI Clients:** `httpx` (async client for Ollama and Groq), `elevenlabs` (official SDK)
* **Image Processing:** `Pillow` (size check & EXIF strip)
* **Validation:** `Pydantic v2`

### 3.2 Directory Structure
```
backend/
├── main.py                  # FastAPI app, Sentry init, CORS
├── config.py                # Settings (Ollama host, Groq key, ElevenLabs key, Sentry DSN)
├── routes/
│   ├── verify.py            # POST /api/verify
│   ├── quests.py            # POST /api/quests/generate (Dynamic generation)
│   └── health.py            # GET /api/health
├── services/
│   ├── ollama_client.py     # Local Ollama client (PaliGemma / Gemma 2)
│   ├── groq_client.py       # Cloud open-weight fallback client (Groq)
│   ├── elevenlabs_svc.py    # TTS with credit-exhaustion safety wrapper
│   └── prompt_builder.py    # Strict Grimble prompt + Two-tier JSON defense
└── requirements.txt
```

---

## 4. API ENDPOINTS & SCHEMAS

### 4.1 Verification Endpoint: `POST /api/verify`
* **Request Payload:**
  ```json
  {
    "quest_id": "battle_leaf",
    "quest_title": "The Battle Leaf",
    "quest_description": "A leaf with visible caterpillar or insect bite marks.",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "engine_override": null,
    "generate_voice": true
  }
  ```

* **Response Payload (Strict JSON):**
  ```json
  {
    "passed": true,
    "confidence": 0.94,
    "goblin_critique": "By the toadstools! That leaf clearly survived a heavy skirmish with an inchworm. Look at those jagged bite notches!",
    "woodland_xp": 35,
    "sensory_bonus": "Smell the torn edge—does it smell like fresh green sap or wet soil?",
    "audio_base64": "UklGRi...",
    "engine_used": "ollama:paligemma",
    "trace_id": "sentry-txn-12345"
  }
  ```

### 4.2 Dynamic Quest Generation: `POST /api/quests/generate`
* **Request Payload:**
  ```json
  {
    "count": 9,
    "exclude_quest_titles": ["The Battle Leaf", "Ancient Velvet", "Nature's Marble"]
  }
  ```
* **Response Payload:**
  ```json
  {
    "quests": [
      {
        "id": "dragon_root",
        "title": "Dragon Root",
        "description": "A tree root bursting from the soil that looks like a mythical claw or dragon foot.",
        "hint": "Check the eroded soil near ancient hardwoods or slope bases.",
        "icon": "🐉",
        "xp_reward": 30
      }
    ]
  }
  ```

---

## 5. PROMPT ENGINEERING & JSON DEFENSE SYSTEM

### 5.1 Verification Prompt
```text
You are Grimble, an eccentric, slightly grumpy goblin naturalist refereeing an outdoor nature scavenger hunt.
The human player has submitted an image to complete the quest: "{quest_title}" ({quest_description}).

Evaluate the image carefully:
1. Does the photo genuinely show what was asked? (Allow reasonable amateur finds, but reject obvious fakes or indoor items).
2. If genuine, passed = true. Award 20-50 woodland_xp based on quality.
3. If not matching, passed = false. Award 0 woodland_xp.
4. Write goblin_critique in Grimble's character: witty, woodland-themed, slightly sassy, but fair.
5. Provide a quick sensory_bonus prompt (touch, smell, or listen to something nearby).

CRITICAL: Return ONLY a raw JSON object with no markdown formatting:
{
  "passed": boolean,
  "confidence": number,
  "goblin_critique": string,
  "woodland_xp": number,
  "sensory_bonus": string
}
```

### 5.2 Dynamic Quest Generation Prompt
```text
You are Grimble, the goblin quest-master of the deep woods. Generate {count} unique, sensory, and playful outdoor nature scavenger quests.
Avoid repeating any of these previously completed quests: {exclude_quest_titles}.

Ensure the quests encourage players to touch, inspect, or listen to the outdoors.
Return ONLY a JSON object:
{
  "quests": [
    {
      "id": string (snake_case),
      "title": string (2-3 words),
      "description": string (1-2 sentences),
      "hint": string (Grimble's tactical woodland advice),
      "icon": string (single emoji),
      "xp_reward": number (20-40)
    }
  ]
}
```

---

## 6. REMOTE TUNNELING (CLOUDFLARE TUNNEL)
* Run command on Windows: `cloudflared tunnel --url http://localhost:8000`
* Gives an instant public HTTPS URL with zero port forwarding.

---

## 7. GROQ DIRECT TRAIL FALLBACK (WHEN LAPTOP IS OFF)
* Direct mobile calls to `https://api.groq.com/openai/v1/chat/completions` using `llama-3.2-11b-vision-preview` (free 30 RPM / 7,000 RPD).

---

## 8. OFFLINE "PENDING FORAGING BAG" (ZERO SIGNAL TRAIL MODE)
* Traps offline failures in IndexedDB under `pending_verifications`.
* Tile state switches to `QUEUED ⏳`.
* Single-click sync button `[ 🎒 Sync Foraging Bag ]` when signal returns.
