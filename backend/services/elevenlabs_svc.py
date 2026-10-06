"""
==============================================================================
ELEVENLABS TTS SERVICE — GOBLIN NATURE BINGO
==============================================================================
Provides Grimble with an authentic goblin voice using ElevenLabs TTS.
Implements graceful credit degradation: if free-tier credits run out or
the API key is absent, it silently returns None without crashing gameplay.
"""

import base64
import logging
from config import settings

logger = logging.getLogger(__name__)

async def generate_grimble_audio(text: str) -> str | None:
    """
    Synthesizes speech for Grimble's critique and returns base64 MP3 data.
    Gracefully returns None if credits are exhausted or key is unconfigured.
    """
    if not settings.elevenlabs_api_key or not text:
        return None

    try:
        from elevenlabs.client import ElevenLabs
        client = ElevenLabs(api_key=settings.elevenlabs_api_key)

        audio_generator = client.generate(
            text=text,
            voice=settings.elevenlabs_voice_id,
            model="eleven_turbo_v2_5"
        )

        audio_bytes = b"".join(audio_generator)
        return base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as exc:
        # Gracefully swallow quota limits (429), expired credits, or network errors
        logger.warning(f"ElevenLabs TTS bypassed cleanly (Credits or Key limit): {exc}")
        return None
