"""
==============================================================================
VERIFICATION ROUTE — GOBLIN NATURE BINGO
==============================================================================
Handles nature photo verification via a high-accuracy multimodal vision pipeline:
1. Primary Cloud Vision & Referee: Groq Multimodal Vision (`qwen/qwen3.8-27b`)
   directly inspects the submitted image pixels and evaluates the quest in one pass,
   tolerant of slight blur, indoor/urban settings (e.g. mossy walls), and screen captures.
2. Local Fallback: Local Ollama Moondream + Gemma 2 if cloud API is offline.
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


def _format_image_data_url(image_base64: str) -> str:
    """
    Ensures the base64 string is formatted as a valid data URI for multimodal vision APIs.
    """
    cleaned = image_base64.strip()
    if cleaned.startswith("data:image/"):
        return cleaned
    if "," in cleaned:
        cleaned = cleaned.split(",", 1)[-1].strip()
    return f"data:image/jpeg;base64,{cleaned}"


def _build_multimodal_vision_prompt(quest_title: str, quest_description: str) -> str:
    """
    Builds a generous, high-recall multimodal vision prompt that inspects the image directly.
    """
    return f"""You are Grimble, an enthusiastic, witty goblin naturalist refereeing a nature scavenger hunt.
The player submitted this photo for the quest: "{quest_title}" — {quest_description}.

Carefully inspect the attached image and evaluate whether it satisfies the quest using these FORGIVING, HIGH-RECALL rules:
1. TOLERATE SLIGHT BLUR, INDOOR LIGHTING & SCREENSHOTS:
   - NEVER reject a photo for being slightly blurry, grainy, out-of-focus, low-light, or taken indoors.
   - NEVER complain about blurriness in your critique.
   - Photos taken of a real specimen, an indoor/bathroom mossy wall, a balcony pot, OR a photo/screenshot of a specimen from Google/phone screen MUST ALL BE ACCEPTED (passed = true) as long as the visual subject matches the quest topic!
2. GENEROUS VISUAL MATCHING:
   - Moss / Soil / Lichen quests: Accept ANY green or dark moss on walls, bathroom/toilet tiles, damp bricks, concrete, tree bark, or wet soil.
   - Leaf / Tree / Root / Flower quests (Peepal, Neem, Banyan, Hibiscus, Bougainvillea, etc.): Accept ANY matching or similar green leaf, compound leaflet, hanging root/bark, or flower/petal/bract.
   - Lizard / Insect / Ant / Dragonfly / Feather quests: Accept ANY lizard, gecko, reptile, winged insect, dragonfly, ant, bug, bird, or feather visible in the image.
   - Stone / Quartz / Pebble quests: Accept ANY rock, stone, mineral, pebble, or textured masonry.
3. WHEN TO PASS vs FAIL:
   - Set "passed": true (award 30 to 45 woodland_xp) if the requested subject or a closely related natural element is visible in the photo.
   - Set "passed": false (award 0 woodland_xp) ONLY if the image is completely unrelated to the quest (e.g., an empty room, a blank black screen, or a random household object with none of the quest subject visible). If it fails, clearly name what you actually see in the photo instead of calling it blurry.

Write a lively 1-2 sentence goblin critique specifically mentioning the visual details you see in their photo, plus a fun 1-sentence sensory bonus action.

Return ONLY a raw JSON object with NO markdown formatting:
{{
  "passed": true,
  "confidence": 0.92,
  "goblin_critique": "Specific, enthusiastic goblin commentary on the visual details seen in the photo!",
  "woodland_xp": 38,
  "sensory_bonus": "A quick interactive nature observation prompt."
}}"""


@router.post("/verify", response_model=VerificationResult)
async def verify_quest(payload: VerificationPayload):
    """
    Evaluates a nature photo by sending the actual image directly to Groq Multimodal Vision
    (`qwen/qwen3.8-27b`), with local Ollama fallback when offline.
    """
    formatted_image = _format_image_data_url(payload.image_base64)
    vision_prompt = _build_multimodal_vision_prompt(payload.quest_title, payload.quest_description)

    fallback = {
        "passed": True,
        "confidence": 0.85,
        "goblin_critique": f"By my magnifying glass, Grimble spots your {payload.quest_title}! A splendid specimen for the field journal!",
        "woodland_xp": 35,
        "sensory_bonus": "Look closely at the surface patterns and notice two different shades of color."
    }

    ai_result = None
    engine_label = "vision:fallback"

    # Stage 1 (Primary): Direct Multimodal Vision with Groq (qwen/qwen3.8-27b sees the image directly!)
    if settings.groq_api_key:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "qwen/qwen3.8-27b",
                        "messages": [
                            {
                                "role": "user",
                                "content": [
                                    {"type": "text", "text": vision_prompt},
                                    {"type": "image_url", "image_url": {"url": formatted_image}}
                                ]
                            }
                        ],
                        "temperature": 0.3
                    }
                )
                if resp.status_code == 200:
                    raw_content = resp.json()["choices"][0]["message"]["content"]
                    logger.info(f"Groq multimodal vision raw response: {raw_content[:300]}")
                    ai_result = sanitize_and_parse_json(raw_content, fallback)
                    engine_label = "groq:qwen3.8-27b-vision"
                else:
                    logger.warning(f"Groq multimodal vision returned HTTP {resp.status_code}: {resp.text[:300]}")
        except Exception as groq_err:
            logger.warning(f"Groq multimodal vision evaluation failed: {groq_err}")

    # Stage 2 (Fallback): Local Ollama Moondream + Gemma 2 if Groq did not respond
    if ai_result is None and settings.ollama_host:
        try:
            vision_report = await describe_image_with_moondream(payload.image_base64)
            if vision_report:
                referee_prompt = f"""You are Grimble, a witty goblin naturalist refereeing a scavenger hunt.
The player submitted a photo for: "{payload.quest_title}" ({payload.quest_description}).
The camera sensor observed: "{vision_report}"
If this reasonably relates to the quest (even if indoor moss, a screen photo, or slightly blurry), set passed = true and award 30-45 woodland_xp.
Return ONLY raw JSON: {{"passed": boolean, "confidence": 0.88, "goblin_critique": "string", "woodland_xp": number, "sensory_bonus": "string"}}"""
                local_res = await generate_quests_with_ollama(referee_prompt)
                if local_res and "passed" in local_res:
                    ai_result = local_res
                    engine_label = "ollama:moondream+gemma2"
        except Exception as local_err:
            logger.warning(f"Local Ollama fallback failed: {local_err}")

    if ai_result is None:
        ai_result = fallback

    # Stage 3: Synthesize ElevenLabs voice for Grimble's critique
    audio_b64 = None
    if payload.generate_voice and ai_result.get("goblin_critique"):
        audio_b64 = await generate_grimble_audio(ai_result["goblin_critique"])

    passed_flag = bool(ai_result.get("passed", False))
    xp_awarded = int(ai_result.get("woodland_xp", 35 if passed_flag else 0))
    if passed_flag and xp_awarded <= 0:
        xp_awarded = 35

    return VerificationResult(
        passed=passed_flag,
        confidence=float(ai_result.get("confidence", 0.88)),
        goblin_critique=str(ai_result.get("goblin_critique", fallback["goblin_critique"])),
        woodland_xp=xp_awarded,
        sensory_bonus=str(ai_result.get("sensory_bonus", fallback["sensory_bonus"])),
        audio_base64=audio_b64,
        engine_used=engine_label
    )
