"""
==============================================================================
ELEVENLABS TTS SERVICE & CACHE LAYER — GOBLIN NATURE BINGO
==============================================================================
Synthesizes Grimble the Goblin's speech using ElevenLabs TTS API.
Includes disk-based audio caching (backend/audio_cache/) to preserve credits:
- Repeated dialogues (welcome message, hints, reroll banter) play with 0ms latency.
- Unique photo critiques are synthesized on-demand and cached for replay.
- Gracefully degrades to silent text if API credits expire or key is absent.
"""

import os
import base64
import hashlib
import logging
from config import settings

logger = logging.getLogger(__name__)

# Directory where pre-rendered and on-demand audio files are cached on disk
CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audio_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

def _get_cache_path(text: str, voice_id: str) -> str:
    """
    Computes a deterministic SHA-256 cache filename based on voice and text.
    Ensures identical lines reuse existing audio without calling the API.
    """
    cache_key = f"{voice_id}:{text.strip()}".encode("utf-8")
    hash_hex = hashlib.sha256(cache_key).hexdigest()
    return os.path.join(CACHE_DIR, f"{hash_hex}.b64")

async def generate_grimble_audio(text: str) -> str | None:
    """
    Synthesizes speech for Grimble's dialogue and returns base64-encoded MP3 data.
    First checks disk cache; if missed, queries ElevenLabs and saves to disk.
    """
    if not settings.elevenlabs_api_key or not text or not text.strip():
        return None

    voice_id = settings.elevenlabs_voice_id or "N2lVS1w4EtoT3dr4eOWO"
    cache_file = _get_cache_path(text, voice_id)

    # Cache hit: Return cached base64 audio instantly with zero API cost
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception as read_err:
            logger.warning(f"Failed to read cached audio file: {read_err}")

    # Cache miss: Synthesize new audio via ElevenLabs client
    try:
        from elevenlabs.client import ElevenLabs
        from elevenlabs import VoiceSettings

        client = ElevenLabs(api_key=settings.elevenlabs_api_key)

        # Configure raspy, expressive trickster goblin voice parameters
        audio_generator = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_turbo_v2_5",
            voice_settings=VoiceSettings(
                stability=0.35,
                similarity_boost=0.75,
                style=0.38,
                use_speaker_boost=True
            )
        )

        audio_bytes = b"".join(audio_generator)
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")

        # Persist to disk cache for future zero-credit replays
        try:
            with open(cache_file, "w", encoding="utf-8") as f:
                f.write(b64_audio)
        except Exception as write_err:
            logger.warning(f"Failed to save audio to cache: {write_err}")

        return b64_audio
    except Exception as exc:
        # Gracefully handle credit exhaustion (429) or temporary network drops
        logger.warning(f"ElevenLabs TTS bypassed cleanly (Credits or Key limit): {exc}")
        return None
