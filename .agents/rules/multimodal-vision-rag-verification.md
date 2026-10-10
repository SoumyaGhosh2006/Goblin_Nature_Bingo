---
description: Universal 90-95%+ accuracy multimodal vision verification using YCbCr + UnsharpMask Side-by-Side Inspection Plates, Two-Tier Dynamic Taxonomic RAG (openai/gpt-oss-120b + LRU Cache), and 4-Gate Vision Refereeing (qwen/qwen3.8-27b).
---

# Universal Multimodal Vision RAG + CV Verification Protocol

Whenever implementing or modifying image verification endpoints (`/api/verify`) or procedural quest generators (`/api/quests/generate`):

1. **Computer Vision Pre-Processing & Side-by-Side Inspection Plate (`services/image_enhancer.py`)**:
   - Enhance luminance contrast in `YCbCr` space (`Y` channel only) so natural botanical/floral RGB hues are never distorted, followed by `UnsharpMask(radius=1.6, percent=145, threshold=3)` to recover blurry venation, serrations, and insect legs.
   - Build a single **`784x448px` Side-by-Side Composite Inspection Plate** (`composite_plate_data_url`) combining the **Left Full Frame (`448x448px`)** and **Right 2x Magnified Center Detail Zoom (`332x448px`)**. This provides dual-scale macro + micro inspection while using ~5.5x fewer vision input tokens (~450 tokens vs ~4,800).
   - Extract structural CV edge telemetry (`active_edge_ratio`, `color_std`, `is_featureless_or_speck`) to flag blank walls or floor specks.

2. **Universal Two-Tier Taxonomic RAG Engine (`services/botanical_rag.py`)**:
   - **Tier 1 (Curated Biodiversity Index)**: Match known species using strict whole-word boundary regexes (`\b...\b`) so substrings (like `"ant"` in `"plant"` or `"fragrant"`) never false-match.
   - **Tier 2 (Dynamic Real-Time Taxonomic RAG Synthesizer + LRU Cache)**: For **any unseen, randomly generated location-based quest**, dynamically query `"openai/gpt-oss-120b"` (`reasoning_effort: "low"`) to synthesize `scientific_name`, `mandatory_diagnostic_traits`, and `hard_negative_impostors_to_reject` on the fly, caching the result in `_DYNAMIC_RAG_CACHE`.

3. **4-Gate Multimodal Vision Referee (`routes/verify.py` & `config.py`)**:
   - Automatically sanitize decommissioned `GROQ_MODEL` env values (such as `llama-3.2-11b-vision-preview`) to `"qwen/qwen3.8-27b"`.
   - Prefix `qwen/qwen3.8-27b` prompts with `/no_think` and set `max_tokens: 220` with a 429 retry backoff.
   - Enforce server-side post-validation across all quests: override `passed = False` and `woodland_xp = 0` whenever `is_impostor_or_fake == True`, `confidence < 0.85`, or `is_featureless_or_speck == True`.
