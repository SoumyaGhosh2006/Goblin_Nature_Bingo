"""
==============================================================================
OLLAMA CLIENT SERVICE — GOBLIN NATURE BINGO
==============================================================================
Asynchronous client communicating with the local Ollama instance
(running Google PaliGemma for vision or Gemma 2 for text generation).
"""

import httpx
import logging
from typing import Any, Dict
from config import settings
from services.prompt_builder import sanitize_and_parse_json

logger = logging.getLogger(__name__)

async def verify_image_with_ollama(
    prompt: str,
    image_base64: str,
    model_name: str | None = None
) -> Dict[str, Any]:
    """
    Sends the nature image and verification prompt to the local Ollama runner.
    """
    model = model_name or settings.ollama_vision_model
    # Strip data URL prefix if present for Ollama raw base64 requirement
    clean_base64 = image_base64.split(",")[-1] if "," in image_base64 else image_base64

    payload = {
        "model": model,
        "prompt": prompt,
        "images": [clean_base64],
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }

    fallback = {
        "passed": False,
        "confidence": 0.5,
        "goblin_critique": "Grimble's local lantern flickered! The local model could not process this image.",
        "woodland_xp": 0,
        "sensory_bonus": "Take a deep breath while the forest settles."
    }

    try:
        # Allow up to 45s for initial cold-start model weight paging from disk
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(f"{settings.ollama_host}/api/generate", json=payload)
            if resp.status_code == 200:
                raw_response = resp.json().get("response", "")
                return sanitize_and_parse_json(raw_response, fallback)
            logger.warning(f"Ollama returned HTTP {resp.status_code}: {resp.text}")
    except httpx.RequestError as exc:
        logger.error(f"Failed to connect to local Ollama runner at {settings.ollama_host}: {exc}")

    return fallback

async def generate_quests_with_ollama(prompt: str) -> Dict[str, Any]:
    """
    Invokes the local Gemma text model to generate fresh procedural quests.
    """
    payload = {
        "model": settings.ollama_chat_model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.8
        }
    }

    fallback = {"quests": []}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(f"{settings.ollama_host}/api/generate", json=payload)
            if resp.status_code == 200:
                raw_response = resp.json().get("response", "")
                return sanitize_and_parse_json(raw_response, fallback)
    except httpx.RequestError as exc:
        logger.error(f"Ollama quest generation connection error: {exc}")

    return fallback
