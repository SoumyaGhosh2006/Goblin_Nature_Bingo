"""
==============================================================================
OLLAMA CLIENT SERVICE — GOBLIN NATURE BINGO
==============================================================================
Asynchronous client communicating with local Ollama runner:
- Moondream: Open-weight vision encoder describing captured nature images.
- Gemma 2: Text LLM for local quest generation and referee evaluation fallback.
"""

import httpx
import logging
from typing import Any, Dict
from config import settings
from services.prompt_builder import sanitize_and_parse_json

logger = logging.getLogger(__name__)

async def describe_image_with_moondream(image_base64: str) -> str:
    """
    Sends photo to local Moondream vision model to describe the scene in detail.
    Returns plain English observations (e.g. green serrated leaf, brick moss, etc.).
    """
    clean_base64 = image_base64.split(",")[-1] if "," in image_base64 else image_base64

    payload = {
        "model": settings.ollama_vision_model,
        "prompt": "Describe what is in this image in detail. Are there plants, leaves, trees, flowers, insects, rocks, or soil?",
        "images": [clean_base64],
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            resp = await client.post(f"{settings.ollama_host}/api/generate", json=payload)
            if resp.status_code == 200:
                return resp.json().get("response", "").strip()
            logger.warning(f"Moondream returned HTTP {resp.status_code}: {resp.text}")
    except httpx.RequestError as exc:
        logger.error(f"Failed to connect to local Ollama at {settings.ollama_host}: {exc}")

    return ""

async def verify_image_with_ollama(
    prompt: str,
    image_base64: str,
    model_name: str | None = None
) -> Dict[str, Any]:
    """
    Legacy direct vision evaluation helper preserved for backwards compatibility.
    """
    model = model_name or settings.ollama_vision_model
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
        "goblin_critique": "Grimble's local lantern flickered! Try another snapshot.",
        "woodland_xp": 0,
        "sensory_bonus": "Take a deep breath while the forest settles."
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(f"{settings.ollama_host}/api/generate", json=payload)
            if resp.status_code == 200:
                raw_response = resp.json().get("response", "")
                return sanitize_and_parse_json(raw_response, fallback)
    except Exception as exc:
        logger.error(f"Ollama direct verify failed: {exc}")

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
