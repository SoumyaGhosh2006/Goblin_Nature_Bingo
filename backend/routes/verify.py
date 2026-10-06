"""
==============================================================================
VERIFICATION ROUTE — GOBLIN NATURE BINGO
==============================================================================
Handles incoming nature photo verification requests from the mobile frontend.
Routes inference between local Ollama and Groq, attaches optional voice,
and enforces strict JSON response formatting.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from services.prompt_builder import build_verification_prompt
from services.ollama_client import verify_image_with_ollama
from services.groq_client import verify_image_with_groq
from services.elevenlabs_svc import generate_grimble_audio
from config import settings

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
    Evaluates an outdoor scavenger find using an open-weight vision model.
    """
    prompt = build_verification_prompt(payload.quest_title, payload.quest_description)
    use_groq = payload.engine_override == "groq" or (not payload.engine_override and not settings.ollama_host)

    if use_groq:
        ai_result = await verify_image_with_groq(prompt, payload.image_base64)
        engine_label = f"groq:{settings.groq_model}"
    else:
        ai_result = await verify_image_with_ollama(prompt, payload.image_base64)
        engine_label = f"ollama:{settings.ollama_model}"

    # Generate optional voice critique (with graceful credit degradation)
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
