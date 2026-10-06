"""
==============================================================================
BACKEND CONFIGURATION — GOBLIN NATURE BINGO
==============================================================================
Centralizes environment settings and secrets for local Ollama inference,
Groq Cloud open-weight fallback, ElevenLabs TTS, and Sentry agent monitoring.
"""

import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment overrides if present
load_dotenv()

class Settings(BaseModel):
    """
    Application settings container populated from environment variables
    with zero-cost local development defaults and production fallbacks.
    """
    # Server runtime bindings (Render binds to dynamic PORT environment variable)
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")
    environment: str = os.getenv("ENVIRONMENT", "development")

    # Local Ollama runner settings (Moondream for vision + Gemma 2 for text/chat)
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
    ollama_vision_model: str = os.getenv("OLLAMA_VISION_MODEL", "moondream")
    ollama_chat_model: str = os.getenv("OLLAMA_CHAT_MODEL", "gemma2:2b")
    # Backwards compatibility alias for ollama_model
    ollama_model: str = os.getenv("OLLAMA_MODEL", "moondream")

    # Cloud open-weight fallback (Groq free tier)
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.2-11b-vision-preview")

    # Optional sponsor integrations
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    elevenlabs_voice_id: str = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
    sentry_dsn: str = os.getenv("SENTRY_DSN", "")

    # CORS origins: dynamically parsed from comma-separated env string
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://10.5.65.86:5173,*"
        ).split(",")
        if origin.strip()
    ]

settings = Settings()
