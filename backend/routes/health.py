"""
==============================================================================
HEALTH CHECK ROUTE — GOBLIN NATURE BINGO
==============================================================================
Reports backend service health, active AI models, and local Ollama connectivity.
"""

from fastapi import APIRouter
import httpx
from config import settings

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
async def health_check():
    """
    Verifies service status and connectivity to the local Ollama runner.
    """
    ollama_online = False
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"{settings.ollama_host}/api/tags")
            ollama_online = (resp.status_code == 200)
    except Exception:
        ollama_online = False

    return {
        "status": "healthy",
        "active_vision_model": settings.ollama_vision_model,
        "active_chat_model": settings.ollama_chat_model,
        "ollama_online": ollama_online,
        "groq_fallback_configured": bool(settings.groq_api_key),
        "elevenlabs_configured": bool(settings.elevenlabs_api_key),
        "sentry_configured": bool(settings.sentry_dsn)
    }
