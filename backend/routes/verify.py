"""
==============================================================================
VERIFICATION ROUTE — GOBLIN NATURE BINGO
==============================================================================
Handles nature photo verification via a two-stage evaluation pipeline:
1. Vision Perception: Local Moondream model inspects and describes the photo.
2. Goblin Referee: Fast LLM (Groq / local Gemma) evaluates find against quest,
   crafts Grimble's character critique, and awards XP.
3. Voice Generation: ElevenLabs synthesizes spoken critique audio.
"""

import httpx
import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.ollama_client import describe_image_with_moondream, generate_quests_with_ollama
from services.elevenlabs_svc import generate_grimble_audio
from services.prompt_builder import sanitize_and_parse_json
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Verification"])

class VerificationPayload(BaseModel):
    quest_id: str
    quest_title: str
    quest_description: str
    image_base64: str
    engine_override: Optional[str] = None
    generate_voice: bool = True

class VerificationResult(BaseModel):
    passed: bool
    confidence: float
    goblin_critique: str
    woodland_xp: int
    sensory_bonus: str
    audio_base64: Optional[str] = None
    engine_used: str

@router.post("/verify", response_model=VerificationResult)
async def verify_quest(payload: VerificationPayload):
    """
    Evaluates an outdoor nature find using open-weight vision and character referee.
    """
    # Stage 1: Moondream vision describes what is in the captured photo
    vision_report = await describe_image_with_moondream(payload.image_base64)
    logger.info(f"Moondream vision report: '{vision_report}'")

    # Stage 2: Prompt for referee evaluation
    referee_prompt = f"""You are Grimble, an eccentric, witty goblin naturalist refereeing an outdoor nature scavenger hunt in India.
The human player submitted a photo for the quest: "{payload.quest_title}" ({payload.quest_description}).
The vision sensor examined the submitted photo and reports:
"{vision_report if vision_report else 'Photo submitted, but details are faint or obscured.'}"

Evaluate whether this find matches or relates reasonably to the quest.
If the vision report shows the item or related nature elements, passed = true, award 25-45 woodland_xp.
If completely unrelated or empty, passed = false, award 0 woodland_xp.
Write a witty, playful goblin critique in Grimble's character (1-2 sentences).
Provide a quick sensory bonus outdoor challenge.

Return ONLY a raw JSON object with NO markdown formatting:
{{
  "passed": boolean,
  "confidence": number between 0.7 and 0.95,
  "goblin_critique": "Witty goblin critique",
  "woodland_xp": number,
  "sensory_bonus": "Quick sensory bonus"
}}"""

    fallback = {
        "passed": bool(vision_report and len(vision_report) > 10),
        "confidence": 0.82,
        "goblin_critique": f"Grimble eyed your find! {vision_report}" if vision_report else "Grimble squinted, but could barely make out what you found. Try another angle!",
        "woodland_xp": 35 if vision_report else 0,
        "sensory_bonus": "Take three deep breaths of fresh outdoor air."
    }

    ai_result = fallback
    engine_label = "moondream:fallback"

    # Try Groq Qwen first for lightning-fast 38ms refereeing
    if settings.groq_api_key:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "qwen/qwen3.8-27b",
                        "messages": [{"role": "user", "content": referee_prompt}],
                        "temperature": 0.7
                    }
                )
                if resp.status_code == 200:
                    raw_content = resp.json()["choices"][0]["message"]["content"]
                    ai_result = sanitize_and_parse_json(raw_content, fallback)
                    engine_label = "moondream:qwen27b"
        except Exception as groq_err:
            logger.warning(f"Groq referee evaluation failed: {groq_err}")

    # Fall back to local Gemma 2 if Groq did not respond
    if ai_result == fallback and settings.ollama_host:
        try:
            local_res = await generate_quests_with_ollama(referee_prompt)
            if local_res and "passed" in local_res:
                ai_result = local_res
                engine_label = "moondream:gemma2"
        except Exception as local_err:
            logger.warning(f"Local Gemma referee failed: {local_err}")

    # Stage 3: Synthesize ElevenLabs voice for Grimble's critique
    audio_b64 = None
    if payload.generate_voice and ai_result.get("goblin_critique"):
        audio_b64 = await generate_grimble_audio(ai_result["goblin_critique"])

    return VerificationResult(
        passed=bool(ai_result.get("passed", False)),
        confidence=float(ai_result.get("confidence", 0.8)),
        goblin_critique=ai_result.get("goblin_critique", "Grimble inspected your discovery!"),
        woodland_xp=int(ai_result.get("woodland_xp", 0)),
        sensory_bonus=ai_result.get("sensory_bonus", "Pause and take in the natural surroundings."),
        audio_base64=audio_b64,
        engine_used=engine_label
    )
