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

def build_quest_generation_prompt(count: int, exclude_titles: list[str]) -> str:
    """
    Constructs the prompt instructing the LLM to invent fresh sensory quests
    while explicitly excluding previously completed quest titles.
    """
    exclusions_str = ", ".join([f'"{t}"' for t in exclude_titles]) if exclude_titles else "none"
    return f"""You are Grimble, the goblin quest-master of the deep woods.
Generate {count} unique, sensory, and playful outdoor nature scavenger quests.
Do NOT repeat any of these previously completed quests: [{exclusions_str}].

Ensure every quest encourages players to touch, inspect, or listen to the outdoors.
Return ONLY a raw JSON object with NO markdown code fences:
{{
  "quests": [
    {{
      "id": "snake_case_string",
      "title": "2-3 Word Title",
      "description": "1-2 sentence objective prompt",
      "hint": "Grimble's tactical outdoor advice",
      "icon": "one of: leaf, sprout, wood, mushroom, sun, stone, insect, feather, water, pinecone",
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
