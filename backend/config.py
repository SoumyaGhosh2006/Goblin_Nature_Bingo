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

# Load local environment overrides from backend/.env regardless of cwd
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()

_DECOMMISSIONED_OR_TEXT_ONLY_GROQ_MODELS = {
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
    "llava-v1.5-7b-4096-preview",
    "llama-3.3-70b-versatile",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
}

_raw_groq_model = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b").strip()
if not _raw_groq_model or _raw_groq_model in _DECOMMISSIONED_OR_TEXT_ONLY_GROQ_MODELS:
    _resolved_groq_model = "qwen/qwen3.8-27b"
else:
    _resolved_groq_model = _raw_groq_model


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

    # Cloud open-weight multimodal vision & text model (Groq LPU)
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = _resolved_groq_model

    # Optional sponsor integrations
    elevenlabs_api_key: str = os.getenv("ELEVENLABS_API_KEY", "")
    elevenlabs_voice_id: str = os.getenv("ELEVENLABS_VOICE_ID", "N2lVS1w4EtoT3dr4eOWO")
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
