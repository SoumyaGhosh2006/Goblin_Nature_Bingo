"""
==============================================================================
PROMPT BUILDER & TWO-TIER JSON DEFENSE — GOBLIN NATURE BINGO
==============================================================================
Constructs Grimble's character prompts and provides bulletproof JSON defense
to guarantee that vision and text models return 100% parseable game responses.
"""

import re
import json
import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)

def build_verification_prompt(quest_title: str, quest_description: str) -> str:
    """
    Constructs the system prompt instructing open-weight vision models to evaluate
    the submitted nature photo against the specific quest objective.
    """
    return f"""You are Grimble, an eccentric, witty goblin naturalist refereeing an outdoor scavenger hunt.
The human player has submitted an image to complete the quest: "{quest_title}" ({quest_description}).

Evaluate the image carefully:
1. Does the photo genuinely show what was asked? (Allow reasonable amateur outdoor finds, but reject obvious indoor items or fakes).
2. If genuine, passed = true. Award 20-50 woodland_xp based on find quality.
3. If not matching, passed = false. Award 0 woodland_xp.
4. Write goblin_critique in Grimble's character: witty, slightly sassy, woodland-themed, but fair.
5. Provide a quick sensory_bonus prompt (e.g. touch, smell, or listen to something nearby).

CRITICAL: Return ONLY a raw JSON object with NO markdown formatting, NO code fences, and NO surrounding text:
{{
  "passed": boolean,
  "confidence": number,
  "goblin_critique": string,
  "woodland_xp": number,
  "sensory_bonus": string
}}"""

def build_quest_generation_prompt(count: int, exclude_titles: list[str], location_hint: str | None = None) -> str:
    """
    Constructs the prompt instructing the LLM to invent fresh sensory quests
    specifically tailored to Indian biodiversity, climate, and urban/park ecosystems.
    Guarantees no non-native temperate elements (no acorns, pinecones, chestnut, etc.).
    """
    exclusions_str = ", ".join([f'"{t}"' for t in exclude_titles]) if exclude_titles else "none"
    loc_context = f"The player is currently exploring nature around {location_hint}, India." if location_hint else "The player is exploring nature in India (urban parks, residential gardens, roadsides, campuses)."

    return f"""You are Grimble, an eccentric, playful goblin naturalist refereeing an outdoor nature scavenger hunt in India.
{loc_context}

Generate {count} unique, sensory, and achievable outdoor nature quests tailored to India's climate, flora, and fauna.
Do NOT repeat any of these previously completed quests: [{exclusions_str}].

CRITICAL BIODIVERSITY RULES:
1. NEVER generate quests for acorns, pinecones, birch, chestnut, or European/North American temperate items (these DO NOT exist in India).
2. Favor real, observable Indian nature:
   - Common Plants/Trees: Neem (serrated leaf), Peepal (heart-shaped leaf with long drip tip), Banyan (aerial prop root or broad leaf), Hibiscus (red flower), Bougainvillea (colorful paper bract), Marigold (Genda), Tulsi (Holy Basil / scented leaf), Coconut/Palm frond, Mango leaf, Ashoka tree leaf, Bamboo stalk.
   - Wildlife & Signs of Life: Marching ant trail (black garden ants or red tree ants), Garden lizard (Girgit) sunning on rock/wall, Pigeon/Crow/Myna bird feather, dragonfly hovering near water, caterpillar-chewed leaf pattern, snail shell or earthworm castings in moist soil, spiderweb in foliage.
   - Sensory & Soil: Monsoon moss on brick walls/tree trunk, rough Neem bark, terracotta earthenware fragment or smooth river stone, sunbeam filtering through green leaves, puddle water reflection.
3. Every quest must be physically findable in an Indian city, neighborhood park, campus, or garden.

Return ONLY a raw JSON object with NO markdown code fences:
{{
  "quests": [
    {{
      "id": "snake_case_string",
      "title": "2-3 Word Title",
      "description": "1-2 sentence sensory objective tailored to India",
      "hint": "Grimble's tactical goblin advice for Indian outdoors",
      "icon": "one of: leaf, sprout, wood, mushroom, sun, stone, insect, feather, water",
      "xp_reward": 25-45
    }}
  ]
}}"""

def sanitize_and_parse_json(raw_text: str, fallback_default: Dict[str, Any]) -> Dict[str, Any]:
    """
    Two-Tier JSON Defense: Strips markdown code fences (```json ... ```)
    and extracts JSON structures using regex if the raw string contains conversational padding.
    """
    # Tier 1: Direct trim & fence removal
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip(), flags=re.MULTILINE).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Tier 2: Regex extraction of the outermost curly-brace block
    match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError as err:
            logger.warning(f"Tier 2 regex JSON extraction failed: {err}")

    logger.error("JSON parsing completely failed. Returning safe fallback payload.")
    return fallback_default
