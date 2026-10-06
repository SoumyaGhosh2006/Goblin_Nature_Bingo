"""
==============================================================================
QUEST GENERATION ROUTE — GOBLIN NATURE BINGO
==============================================================================
Generates dynamic procedural quests on the fly using open LLMs,
preventing repetitive boards and ensuring ~70%+ fresh content on every hike.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.prompt_builder import build_quest_generation_prompt
from services.ollama_client import generate_quests_with_ollama
from services.prompt_builder import sanitize_and_parse_json
from config import settings
import httpx

router = APIRouter(prefix="/api/quests", tags=["Quests"])

class QuestGeneratePayload(BaseModel):
    count: int = 9
    exclude_quest_titles: List[str] = []

class QuestItem(BaseModel):
    id: str
    title: str
    description: str
    hint: str
    icon: str
    xp_reward: int

class QuestGenerateResponse(BaseModel):
    quests: List[QuestItem]

@router.post("/generate", response_model=QuestGenerateResponse)
async def generate_quests(payload: QuestGeneratePayload):
    """
    Generates a set of unique outdoor quests avoiding previously completed titles.
    """
    prompt = build_quest_generation_prompt(payload.count, payload.exclude_quest_titles)

    # Attempt local Ollama generation first
    ai_result = await generate_quests_with_ollama(prompt)

    # If local generation produced no quests and Groq key is present, try Groq
    if not ai_result.get("quests") and settings.groq_api_key:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "qwen/qwen3.8-27b",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.8
                    }
                )
                if resp.status_code == 200:
                    content = resp.json()["choices"][0]["message"]["content"]
                    ai_result = sanitize_and_parse_json(content, {"quests": []})
        except Exception:
            pass

    raw_quests = ai_result.get("quests", [])
    valid_quests: List[QuestItem] = []

    for idx, q in enumerate(raw_quests):
        valid_quests.append(
            QuestItem(
                id=q.get("id", f"gen_quest_{idx}"),
                title=q.get("title", f"Wildwood Quest {idx + 1}"),
                description=q.get("description", "Inspect the forest floor closely."),
                hint=q.get("hint", "Look around shaded patches."),
                icon=q.get("icon", "leaf"),
                xp_reward=int(q.get("xp_reward", 30))
            )
        )

    return QuestGenerateResponse(quests=valid_quests)
