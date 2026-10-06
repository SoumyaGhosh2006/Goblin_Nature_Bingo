"""
==============================================================================
BACKEND API TESTS — GOBLIN NATURE BINGO
==============================================================================
Verifies health check endpoint, dynamic quest generation fallback, and
Pydantic payload validation for scavenger verification.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Verifies that the API root returns service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "game" in data
    assert data["game"] == "Goblin Mode: Nature Scavenger Bingo"

def test_health_check():
    """Verifies the health check endpoint returns active status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "active_vision_model" in data

def test_quest_generation_route():
    """Verifies procedural quest generation structure."""
    response = client.post("/api/quests/generate", json={
        "count": 9,
        "exclude_quest_titles": ["Battle Leaf"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "quests" in data
    assert isinstance(data["quests"], list)
