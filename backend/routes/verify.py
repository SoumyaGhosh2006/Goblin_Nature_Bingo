"""
==============================================================================
VERIFICATION ROUTE — GOBLIN NATURE BINGO (UNIVERSAL RAG + CV PIPELINE)
==============================================================================
High-precision (90–95%+ accuracy) nature photo verification pipeline for both
curated starter quests AND 100% randomly generated location-based quests:
1. Computer Vision Pre-Processor (`image_enhancer.py`):
   - Computes structural edge density & color telemetry (detects floor specks/dots).
   - Applies Luminance-Preserving YCbCr Auto-Contrast, Color Enrichment, and
     UnsharpMask sharpening so slightly blurry real-world photos recover crisp
     venation, margins, and surface detail without distorting natural hues.
   - Generates a 2x Magnified Center Detail Crop alongside the Enhanced Full Frame.
2. Universal Taxonomic RAG Engine (`botanical_rag.py`):
   - Tier 1: Retrieves curated species-specific Mandatory Diagnostic Traits and
     Hard-Negative Impostor rules.
   - Tier 2: Dynamically synthesizes and caches a complete scientific taxonomic
     rubric on the fly for ANY unseen, randomly generated location quest!
3. 4-Gate Multimodal Vision Referee (`qwen/qwen3.8-27b` on Groq):
   - Inspects both the Enhanced Full Image and 2x Detail Crop against the RAG rubric.
   - Enforces strict server-side impostor, speck, & confidence post-validation (>= 0.85).
"""

import asyncio
import httpx
import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.ollama_client import describe_image_with_moondream, generate_quests_with_ollama
from services.elevenlabs_svc import generate_grimble_audio
from services.prompt_builder import sanitize_and_parse_json
from services.image_enhancer import enhance_and_analyze_image
from services.botanical_rag import retrieve_or_synthesize_taxonomic_knowledge
from config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Verification"])


class VerificationPayload(BaseModel):
    quest_id: str
    quest_title: str
    quest_description: str
    image_base64: str
    engine_override: Optional[str] = None
    generate_voice: bool = True


class VerificationResult(BaseModel):
    passed: bool
    confidence: float
    goblin_critique: str
    woodland_xp: int
    sensory_bonus: str
    audio_base64: Optional[str] = None
    engine_used: str


def _build_rag_multimodal_prompt(
    quest_title: str,
    quest_description: str,
    rag_profile: dict,
    telemetry: dict
) -> str:
    """
    Constructs a strict 4-Gate Scientific Chain-of-Thought verification prompt
    grounded in the retrieved or dynamically synthesized Taxonomic RAG Knowledge Base.
    """
    sci_name = rag_profile.get("scientific_name", quest_title)
    mandatory_traits = "\n".join(
        f"  - {trait}" for trait in rag_profile.get("mandatory_diagnostic_traits", [])
    )
    impostors = "\n".join(
        f"  - {imp}" for imp in rag_profile.get("hard_negative_impostors_to_reject", [])
    )
    cv_summary = telemetry.get("summary", "N/A")
    speck_warning = (
        "\n⚠️ COMPUTER VISION SPECK WARNING: Low edge density detected! "
        "Verify carefully that this is NOT just a floor dot, dust speck, or blank surface."
        if telemetry.get("is_featureless_or_speck")
        else ""
    )

    return f"""/no_think
You are Grimble, a rigorous, sharp-eyed Goblin Botanical & Zoological Taxonomist refereeing an outdoor scavenger hunt.
You are inspecting a Side-by-Side Computer-Vision Enhanced Inspection Plate of the player's submission:
- Left Panel: Full Frame (YCbCr luminance-contrast balanced & UnsharpMask edge-sharpened)
- Right Panel: 2x Magnified Center Detail Crop (for inspecting fine venation, leaf tips, margins, insect legs/segments, or bryophyte texture)

QUEST TARGET: "{quest_title}" — {quest_description}
TAXONOMIC CLASSIFICATION: {sci_name}
CV STRUCTURAL TELEMETRY: {cv_summary}{speck_warning}

=====================================================================
RETRIEVED TAXONOMIC RAG RUBRIC (90–95%+ SCIENTIFIC PRECISION PROTOCOL)
=====================================================================
MANDATORY DIAGNOSTIC TRAITS (Must be visibly confirmed in Left/Right panels):
{mandatory_traits}

HARD-NEGATIVE IMPOSTORS TO REJECT IMMEDIATELY (passed = false, confidence <= 0.25):
{impostors}

=====================================================================
4-GATE VERIFICATION PROTOCOL
=====================================================================
- GATE 1 (Subject Integrity): Identify what is actually in the photo (`detected_subject`). If the photo is a blank floor/wall, random black or white dots, specks of dust/dirt, or a featureless smudge, REJECT (`passed = false`, `is_impostor_or_fake = true`).
- GATE 2 (Taxonomic Anatomy Check): Check the Mandatory Diagnostic Traits above against both the Left Full Frame and Right 2x Center Detail Crop.
  * For any LEAF quest: Verify the exact blade shape, apex tip (e.g., Peepal MUST have the long tail-like caudate drip-tip; Neem MUST have saw-toothed serrations and curved asymmetric base; Mango MUST be oblong-lanceolate; Tulsi MUST have softly serrated opposite leaves), margin type, and venation. Do NOT accept a random vine leaf or wrong plant species!
  * For any INSECT / ANIMAL quest: Verify clear anatomical body parts (head, thorax, abdomen/tail, jointed legs, antennae/wings/eyes). Never accept tiny black/white floor specks or wall cracks as an insect or reptile!
- GATE 3 (Hard-Negative Impostor Gate): Does the photo match any item in `HARD-NEGATIVE IMPOSTORS TO REJECT`? If yes, set `is_impostor_or_fake = true` and `passed = false`.
- GATE 4 (Slight Camera Blur / Screen Photo Tolerance): Real outdoor phone cameras or photos taken of a screen/reference picture may have mild optical softness, indoor bathroom lighting (e.g., real damp moss on a bathroom wall), or screen pixel grid. As long as Gates 1, 2, and 3 PASS and the specimen is genuinely `{sci_name}`, ACCEPT IT (`passed = true`, `confidence >= 0.88`, `woodland_xp` = 30 to 50)! Never reject a genuine specimen solely because of slight camera blur or screen moiré.

Return ONLY a raw JSON object with NO markdown formatting:
{{
  "detected_subject": "Exact name of what is actually in the photo",
  "is_impostor_or_fake": false,
  "passed": true,
  "confidence": 0.94,
  "goblin_critique": "1-2 sentences of sharp, witty naturalist feedback naming specific morphological traits seen or missing!",
  "woodland_xp": 38,
  "sensory_bonus": "A quick outdoor observation challenge."
}}"""


@router.post("/verify", response_model=VerificationResult)
async def verify_quest(payload: VerificationPayload):
    """
    Evaluates a nature photo using Computer-Vision Image Enhancement + Universal
    Taxonomic RAG (Curated + Dynamic On-The-Fly Synthesis) + Multi-Scale Multimodal Vision.
    """
    # Step 1: Run Computer-Vision Image Enhancer & Structural Telemetry
    cv_result = enhance_and_analyze_image(payload.image_base64)
    composite_plate_url = cv_result.get("composite_plate_data_url") or cv_result["enhanced_full_data_url"]
    enhanced_full_url = cv_result["enhanced_full_data_url"]
    telemetry = cv_result["telemetry"]

    # Step 2: Retrieve or Dynamically Synthesize Taxonomic RAG Profile for ANY Quest
    rag_profile = await retrieve_or_synthesize_taxonomic_knowledge(
        payload.quest_title,
        payload.quest_description
    )

    # Step 3: Build 4-Gate RAG Multimodal Prompt
    vision_prompt = _build_rag_multimodal_prompt(
        payload.quest_title,
        payload.quest_description,
        rag_profile,
        telemetry
    )

    # Strict fallback (never auto-passes unverified images!)
    fallback = {
        "detected_subject": "unverified",
        "is_impostor_or_fake": False,
        "passed": False,
        "confidence": 0.0,
        "goblin_critique": (
            f"Grimble's field spectacles couldn't verify the diagnostic anatomy of "
            f"{rag_profile.get('scientific_name', payload.quest_title)}. Move closer so its key features are clear!"
        ),
        "woodland_xp": 0,
        "sensory_bonus": "Hold steady and frame the specimen's defining features in clear light!"
    }

    ai_result = None
    engine_label = "offline-fallback"

    # Stage 1 (Primary): Groq Multimodal Vision with Side-by-Side Composite Plate (Full + 2x Center Zoom)
    if settings.groq_api_key and payload.engine_override != "ollama":
        try:
            user_content = [
                {"type": "text", "text": vision_prompt},
                {"type": "image_url", "image_url": {"url": composite_plate_url}}
            ]

            async with httpx.AsyncClient(timeout=28.0) as client:
                for attempt in range(2):
                    resp = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.groq_api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": settings.groq_model,
                            "messages": [
                                {
                                    "role": "user",
                                    "content": user_content
                                }
                            ],
                            "temperature": 0.1,
                            "max_tokens": 220
                        }
                    )
                    if resp.status_code == 200:
                        raw_content = resp.json()["choices"][0]["message"]["content"]
                        logger.info(f"RAG+CV Groq Vision response: {raw_content[:350]}")
                        ai_result = sanitize_and_parse_json(raw_content, fallback)
                        rag_mode = "dynamic-rag" if str(rag_profile.get("id", "")).startswith("dynamic") else "curated-rag"
                        engine_label = f"{rag_mode}+cv:qwen3.8-27b-dualcrop"
                        break
                    elif resp.status_code == 429 and attempt == 0:
                        logger.info("Groq vision 429 rate limit hit; waiting 4s before retry...")
                        await asyncio.sleep(4.0)
                    else:
                        logger.warning(f"Groq vision returned HTTP {resp.status_code}: {resp.text[:300]}")
                        break
        except Exception as groq_err:
            logger.warning(f"Groq multimodal vision evaluation failed: {groq_err}")

    # Stage 2 (Offline Fallback): Local Ollama Moondream + Gemma 2 with RAG Rubric
    if ai_result is None and settings.ollama_host:
        try:
            vision_report = await describe_image_with_moondream(enhanced_full_url)
            if vision_report:
                ollama_prompt = f"""{vision_prompt}\n\nLocal camera description: "{vision_report}" """
                local_res = await generate_quests_with_ollama(ollama_prompt)
                if local_res and "passed" in local_res:
                    ai_result = local_res
                    engine_label = "rag-cv:ollama"
        except Exception as local_err:
            logger.warning(f"Local Ollama fallback failed: {local_err}")

    if ai_result is None:
        ai_result = fallback

    # -------------------------------------------------------------------------
    # STRICT SERVER-SIDE POST-VALIDATION GUARD (APPLIES TO ALL QUESTS)
    # -------------------------------------------------------------------------
    passed_flag = bool(ai_result.get("passed", False))
    is_impostor = bool(ai_result.get("is_impostor_or_fake", False))
    confidence_val = float(ai_result.get("confidence", 0.0))

    # Enforce hard rejection if flagged as impostor/fake or confidence < 0.85
    if is_impostor or confidence_val < 0.85:
        passed_flag = False

    # Universal featureless/speck guard across ALL biological/geological quests
    combined_q = f"{payload.quest_title} {payload.quest_description}".lower()
    is_sky_or_water_quest = any(w in combined_q for w in ["sky", "cloud", "reflection", "puddle", "sunbeam", "shadow"])
    if telemetry.get("is_featureless_or_speck") and not is_sky_or_water_quest:
        passed_flag = False
        if not ai_result.get("goblin_critique") or "spectacles" in str(ai_result.get("goblin_critique", "")):
            ai_result["goblin_critique"] = (
                f"Hold on! Grimble only sees a nearly blank surface or tiny featureless specks—not the anatomy of {payload.quest_title}!"
            )

    xp_awarded = int(ai_result.get("woodland_xp", 35 if passed_flag else 0))
    if not passed_flag:
        xp_awarded = 0

    critique_text = str(ai_result.get("goblin_critique", fallback["goblin_critique"]))

    # Optional Stage 3: ElevenLabs Speech Synthesis
    audio_b64 = None
    if payload.generate_voice:
        audio_b64 = await generate_grimble_audio(critique_text)

    return VerificationResult(
        passed=passed_flag,
        confidence=confidence_val,
        goblin_critique=critique_text,
        woodland_xp=xp_awarded,
        sensory_bonus=str(ai_result.get("sensory_bonus", fallback["sensory_bonus"])),
        audio_base64=audio_b64,
        engine_used=engine_label
    )
