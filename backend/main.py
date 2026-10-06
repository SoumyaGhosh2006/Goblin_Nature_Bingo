"""
==============================================================================
MAIN APPLICATION ENTRY POINT — GOBLIN NATURE BINGO BACKEND
==============================================================================
Initializes FastAPI microservice, initializes Sentry AI agent tracing,
configures cross-origin resource sharing, and mounts API route modules.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes.verify import router as verify_router
from routes.quests import router as quests_router
from routes.health import router as health_router

# Initialize Sentry Agent Tracing if DSN is configured in environment
if settings.sentry_dsn:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
            environment="development"
        )
    except Exception as exc:
        print(f"Sentry SDK initialization skipped: {exc}")

app = FastAPI(
    title="Goblin Mode: Nature Scavenger Bingo Backend",
    version="1.2.0",
    description="Open-weight vision evaluation service for outdoor scavenger gameplay."
)

# Enable CORS for local Vite dev server and mobile phone Wi-Fi connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(health_router)
app.include_router(verify_router)
app.include_router(quests_router)

@app.get("/")
async def root():
    return {
        "game": "Goblin Mode: Nature Scavenger Bingo",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
