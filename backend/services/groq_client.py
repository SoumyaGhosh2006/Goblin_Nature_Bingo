"""
==============================================================================
GROQ CLOUD CLIENT SERVICE — GOBLIN NATURE BINGO
==============================================================================
Asynchronous client communicating with the Groq Cloud endpoint running
open-weight Llama-3.2-Vision on ultra-fast LPUs with zero paid infrastructure.
"""

import httpx
import logging
from typing import Any, Dict
from config import settings
from services.prompt_builder import sanitize_and_parse_json

logger = logging.getLogger(__name__)

async def verify_image_with_groq(prompt: str, image_base64: str) -> Dict[str, Any]:
    """
    Evaluates an image using Groq's open-weight Llama-3.2-Vision model.
    """
    if not settings.groq_api_key:
        logger.warning("GROQ_API_KEY is not set. Bypassing Groq cloud fallback.")
        return {
            "passed": False,
            "confidence": 0.0,
            "goblin_critique": "Grimble needs a Groq API key to reach the cloud!",
            "woodland_xp": 0,
            "sensory_bonus": "Listen to the birds while keys are configured."
        }

    # Ensure valid data URL format for OpenAI-compatible payload
    formatted_image = image_base64 if image_base64.startswith("data:") else f"data:image/jpeg;base64,{image_base64}"

    payload = {
        "model": settings.groq_model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": formatted_image}}
                ]
            }
        ],
        "temperature": 0.2
    }

    fallback = {
        "passed": False,
        "confidence": 0.5,
        "goblin_critique": "Groq cloud connection timed out. Grimble is checking the trail!",
        "woodland_xp": 0,
        "sensory_bonus": "Look up at the canopy."
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                return sanitize_and_parse_json(content, fallback)
            logger.warning(f"Groq API returned HTTP {resp.status_code}: {resp.text}")
    except httpx.RequestError as exc:
        logger.error(f"Failed to connect to Groq Cloud endpoint: {exc}")

    return fallback
