"""
==============================================================================
VOICE SYNTHESIS ROUTE — GOBLIN NATURE BINGO
==============================================================================
Exposes on-demand speech synthesis for Grimble the Goblin's dialogues.
Utilizes the cached ElevenLabs service layer to minimize API latency and quota.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.elevenlabs_svc import generate_grimble_audio

router = APIRouter(prefix="/api/voice", tags=["Voice"])

class SpeakPayload(BaseModel):
    text: str

class SpeakResponse(BaseModel):
    audio_base64: Optional[str] = None

@router.post("/speak", response_model=SpeakResponse)
async def speak_text(payload: SpeakPayload):
    """
    Synthesizes speech for the provided dialogue line, returning base64 audio data.
    """
    audio_b64 = await generate_grimble_audio(payload.text)
    return SpeakResponse(audio_base64=audio_b64)
