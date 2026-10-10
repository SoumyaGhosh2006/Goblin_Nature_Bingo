"""
==============================================================================
UNIVERSAL BOTANICAL & ZOOLOGICAL RAG ENGINE — GOBLIN NATURE BINGO
==============================================================================
Two-Tier Retrieval-Augmented Generation (RAG) Engine:
- Tier 1 (Curated Biodiversity Index): Instant retrieval for 24 core Indian &
  urban nature targets with species-specific keywords (avoiding broad false-match
  words so random location quests never collide with unrelated entries).
- Tier 2 (Dynamic Real-Time Taxonomic RAG Synthesizer + LRU Cache):
  For ANY randomly generated location-based quest anywhere in the world that
  cannot be hardcoded in advance, dynamically synthesizes and caches a strict
  scientific morphological rubric (Scientific Name, 3-4 Mandatory Diagnostic
  Traits, and 3-4 Hard-Negative Lookalike Impostors to Reject) on the fly!
"""

import re
import logging
import httpx
from typing import Dict, Any, List
from config import settings
from services.prompt_builder import sanitize_and_parse_json

logger = logging.getLogger(__name__)

# In-memory cache for dynamically synthesized location-based quests
_DYNAMIC_RAG_CACHE: Dict[str, Dict[str, Any]] = {}


TAXONOMIC_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "peepal_leaf",
        "keywords": ["peepal", "ficus religiosa", "sacred fig", "drip tip", "drip-tip"],
        "scientific_name": "Ficus religiosa (Sacred Fig / Peepal)",
        "mandatory_diagnostic_traits": [
            "Distinct cordate (heart-shaped) or broadly ovate lamina with a truncate/cordate base.",
            "MANDATORY SIGNATURE TRAIT: A very long, slender, tail-like caudate drip-tip (acuminate apex) extending sharply at the tip (typically 20% to 35% of total blade length).",
            "Prominent pale yellow/cream central midrib with 5–8 pairs of straight pinnate lateral veins forming fine reticulate loops near the margin.",
            "Smooth, entire, slightly wavy (undulate) leaf margin — NEVER serrated or toothed."
        ],
        "hard_negative_impostors_to_reject": [
            "Money Plant / Golden Pothos (Epipremnum aureum): Fleshy climbing vine leaf with a short acute point (lacks the long tail-like caudate drip-tip of Peepal) or yellow/white variegation streaks.",
            "Betel Leaf (Piper betle) or Black Pepper vine: Has palmate/arcuate basal veins curving from the base toward the tip instead of straight pinnate lateral veins from a central midrib.",
            "Sweet Potato Vine, Morning Glory, or random garden climber vines lacking the long caudate tail and stiff leathery fig venation.",
            "Hibiscus, Mulberry, or toothed leaves (Peepal edges are strictly smooth/wavy, never toothed)."
        ]
    },
    {
        "id": "neem_leaf",
        "keywords": ["neem", "azadirachta", "serrated neem", "neem leaflet"],
        "scientific_name": "Azadirachta indica (Indian Neem)",
        "mandatory_diagnostic_traits": [
            "Pinnately compound leaf rachis or individual lanceolate leaflet with deeply, sharply serrated (saw-toothed) margins.",
            "MANDATORY SIGNATURE TRAIT: Asymmetric, falcate (sickle-shaped / curved) leaflet base where one side of the blade is noticeably wider than the other at the base.",
            "Pointed acuminate tip and distinct central midrib on a green glabrous blade."
        ],
        "hard_negative_impostors_to_reject": [
            "Smooth-edged (entire) leaves such as Mango, Banyan, Money Plant, or Peepal.",
            "Curry Leaf (Murraya koenigii): Small ovate leaflets with smooth or barely crenulate margins lacking deep saw-toothed serrations and lacking the curved sickle-shaped Neem profile.",
            "Broad simple heart-shaped or oval leaves."
        ]
    },
    {
        "id": "banyan_root",
        "keywords": ["banyan", "aerial root", "prop root", "ficus benghalensis"],
        "scientific_name": "Ficus benghalensis (Indian Banyan)",
        "mandatory_diagnostic_traits": [
            "Woody, reddish-brown to gray fibrous aerial prop roots hanging vertically in clusters or braided curtains from tree branches or coalescing around a massive trunk.",
            "Alternatively, if showing Banyan foliage: very thick, leathery, glossy ovate-elliptic leaf with a blunt/obtuse rounded apex (no long drip-tip) and stout petiole."
        ],
        "hard_negative_impostors_to_reject": [
            "Thin herbaceous green houseplant stems, money plant vines, ropes, strings, cables, or dead sticks lying on the ground."
        ]
    },
    {
        "id": "bougainvillea_bract",
        "keywords": ["bougainvillea", "paper flower", "magenta bract", "paper-thin"],
        "scientific_name": "Bougainvillea spectabilis / Bougainvillea glabra",
        "mandatory_diagnostic_traits": [
            "Paper-thin, brightly colored ovate-triangular bracts (magenta, pink, purple, crimson, orange, or white) with visible delicate papery venation.",
            "Bracts arranged in clusters of three surrounding tiny, narrow cream/white tubular central flowers."
        ],
        "hard_negative_impostors_to_reject": [
            "Roses, Marigolds, Hibiscus, Plumeria, or thick fleshy petals.",
            "Plain green leaves with no colored papery bracts."
        ]
    },
    {
        "id": "hibiscus_flower",
        "keywords": ["hibiscus", "gudhal", "rosa-sinensis", "stamen column"],
        "scientific_name": "Hibiscus rosa-sinensis (Shoe Flower / Gudhal)",
        "mandatory_diagnostic_traits": [
            "Five large, flared, overlapping obovate petals (commonly crimson red, pink, yellow, or orange) forming a trumpet/funnel shape.",
            "MANDATORY SIGNATURE TRAIT: A long, prominent central staminal column (stamen tube) protruding conspicuously out from the center of the flower, ringed with golden-yellow pollen anthers near the tip."
        ],
        "hard_negative_impostors_to_reject": [
            "Any flower lacking the long protruding central staminal tube (e.g., Roses, Marigolds, Vinca/Sadabahar, Ixora, or Bougainvillea).",
            "Plain green foliage with no blossom."
        ]
    },
    {
        "id": "garden_lizard",
        "keywords": ["lizard", "girgit", "calotes", "gecko"],
        "scientific_name": "Calotes versicolor (Oriental Garden Lizard / Girgit) or Hemidactylus (Gecko)",
        "mandatory_diagnostic_traits": [
            "Unmistakable live vertebrate reptile anatomy: distinct triangular/oval reptilian head with visible eye, scaly body trunk, four jointed legs with clawed toes/digits, and a long tapering tail.",
            "For Oriental Garden Lizard (Girgit): dorsal crest of small spines along the neck/back and scaly skin."
        ],
        "hard_negative_impostors_to_reject": [
            "Twigs, sticks, bark strips, wall cracks, peeling paint, stains, shadows, or stones.",
            "Blurry smudges or dots on a wall/floor where head, eyes, 4 limbs, and tail cannot be clearly identified."
        ]
    },
    {
        "id": "monsoon_dragonfly",
        "keywords": ["dragonfly", "damselfly", "pantala", "odonata", "gossamer lattice wing"],
        "scientific_name": "Pantala flavescens (Wandering Glider Dragonfly / Odonata)",
        "mandatory_diagnostic_traits": [
            "Four elongated, transparent membranous wings with intricate net-like cross-venation (held flat horizontally in dragonflies or folded above the body in damselflies).",
            "Large rounded compound eyes on the head, compact thorax, and a long, slender, multi-segmented rod-like abdomen."
        ],
        "hard_negative_impostors_to_reject": [
            "Houseflies, mosquitoes, cockroaches, beetles, ants, or spiders.",
            "Butterflies or moths (which have opaque scale-covered wings rather than transparent net-veined Odonata wings).",
            "Wall marks, cracks, twigs, or specks of dirt."
        ]
    },
    {
        "id": "weaver_ant",
        "keywords": ["weaver ant", "ant trail", "oecophylla", "garden ant", "marching ant"],
        "scientific_name": "Oecophylla smaragdina (Weaver Ant) / Formicidae",
        "mandatory_diagnostic_traits": [
            "MANDATORY INSECT ANATOMY: Must clearly show a real ant with three distinct body divisions (head, narrow elongated thorax/mesosoma, and oval gaster/abdomen connected by a constricted waist/petiole).",
            "Must show visible jointed legs (6 legs) and/or elbowed antennae protruding from the head."
        ],
        "hard_negative_impostors_to_reject": [
            "CRITICAL HARD REJECTION: Black dots, white dots, specks of dirt, dust particles, floor crumbs, tile speckles, holes, or random dark spots on a floor or wall where jointed legs, antennae, and 3-part insect body segmentation are NOT clearly visible!",
            "Never assume a tiny dark pixel blob or dot on a floor is an ant."
        ]
    },
    {
        "id": "monsoon_moss",
        "keywords": ["moss", "bryum", "bryophyte", "velvet moss", "mossy"],
        "scientific_name": "Bryophyta (Monsoon Velvet Moss Cushion)",
        "mandatory_diagnostic_traits": [
            "Dense, velvety green or olive-green non-vascular bryophyte mat/carpet composed of tiny, tightly packed micro-leafy shoots clinging to damp brick, concrete, stone, bathroom/outdoor wall, soil, or tree bark.",
            "Distinct organic plush/velvety clump texture."
        ],
        "hard_negative_impostors_to_reject": [
            "Plain dry paint, bare concrete/tile with no green moss mat, black mold/dirt stains without green bryophyte texture.",
            "Large vascular plants, grass lawns, creeping vines, or green fabric/plastic."
        ]
    },
    {
        "id": "riverbed_quartz",
        "keywords": ["quartz", "quartz pebble", "riverbed quartz", "river stone"],
        "scientific_name": "Milky / Crystalline Riverbed Quartz Pebble",
        "mandatory_diagnostic_traits": [
            "Natural mineral stone, pebble, or rock showing crystalline/vitreous luster, milky-white/translucent quartz mineral composition, or water-worn rounded stone contours with fracture veins."
        ],
        "hard_negative_impostors_to_reject": [
            "White dots on a floor, paper scraps, plastic pieces, chalk dust, plain ceramic floor tiles, or flat painted walls."
        ]
    },
    {
        "id": "bird_feather",
        "keywords": ["feather", "plumage", "quill"],
        "scientific_name": "Avian Contour or Flight Feather",
        "mandatory_diagnostic_traits": [
            "Central hollow shaft (rachis and basal calamus/quill) with bilateral rows of fine parallel barbs forming a flat vane and/or fluffy down at the base."
        ],
        "hard_negative_impostors_to_reject": [
            "Plant leaves, grass blades, sticks, paper strips, or white marks on the floor."
        ]
    },
    {
        "id": "tulsi_leaf",
        "keywords": ["tulsi", "holy basil", "ocimum"],
        "scientific_name": "Ocimum tenuiflorum (Holy Basil / Tulsi)",
        "mandatory_diagnostic_traits": [
            "Opposite decussate pairs of aromatic ovate-elliptic leaves with softly serrated/crenate margins and visible surface oil glands or fine hairs along the stem.",
            "Green (Rama Tulsi) or purplish-tinged (Krishna Tulsi) textured leaf blade, often with slender uprightraceme flower spikes."
        ],
        "hard_negative_impostors_to_reject": [
            "Smooth leathery leaves (Money Plant, Peepal, Banyan, Mango) lacking serrated edges and opposite stem pairing.",
            "Deeply sickle-shaped compound Neem leaflets."
        ]
    },
    {
        "id": "marigold_flower",
        "keywords": ["marigold", "genda", "tagetes"],
        "scientific_name": "Tagetes erecta / Tagetes patula (Indian Marigold / Genda)",
        "mandatory_diagnostic_traits": [
            "Dense pom-pom or ruffled composite flower head packed with dozens of layered, ruffled strap-like ray florets in vibrant saffron-orange, golden-yellow, or maroon-red."
        ],
        "hard_negative_impostors_to_reject": [
            "Single-layer 5-petal flowers (Hibiscus, Vinca, Plumeria) or papery Bougainvillea bracts.",
            "Plain green leaves without a Marigold flower head."
        ]
    },
    {
        "id": "mango_leaf",
        "keywords": ["mango leaf", "mangifera"],
        "scientific_name": "Mangifera indica (Mango Tree Leaf)",
        "mandatory_diagnostic_traits": [
            "Elongated, oblong-lanceolate (spear-shaped) leathery simple leaf tapering gradually to an acute tip.",
            "Smooth, slightly wavy (undulate) entire margins and a prominent pale central midrib with regular parallel lateral veins."
        ],
        "hard_negative_impostors_to_reject": [
            "Heart-shaped leaves (Peepal, Money Plant, Betel leaf) or serrated/toothed leaves (Neem, Hibiscus, Rose)."
        ]
    },
    {
        "id": "caterpillar_chewed_leaf",
        "keywords": ["caterpillar", "chewed leaf", "insect bite", "munched leaf"],
        "scientific_name": "Folivory / Herbivore-Perforated Plant Leaf",
        "mandatory_diagnostic_traits": [
            "A real plant leaf clearly showing irregular scalloped bite notches along the margin or chewed holes/fenestrations through the lamina caused by caterpillars or leaf-eating insects."
        ],
        "hard_negative_impostors_to_reject": [
            "An intact, undamaged leaf with no bite holes or chewed margins.",
            "Torn paper, artificial objects, or plain floors."
        ]
    },
    {
        "id": "snail_shell",
        "keywords": ["snail", "snail shell", "mollusk", "achatina"],
        "scientific_name": "Gastropoda (Land Snail / Coiled Calcified Shell)",
        "mandatory_diagnostic_traits": [
            "Distinct calcified spiral shell with concentric whorls (conical or planorbid spiral) and/or soft tentacled gastropod body."
        ],
        "hard_negative_impostors_to_reject": [
            "Plain stones/pebbles lacking spiral whorls, bottle caps, crumbs, or floor specks."
        ]
    },
    {
        "id": "spider_web",
        "keywords": ["spiderweb", "spider web", "cobweb", "orb web", "arachnid"],
        "scientific_name": "Araneae Silk Web / Arachnid Architecture",
        "mandatory_diagnostic_traits": [
            "Visible gossamer silk threads forming a radial orb web, sheet web, or tangled silk lattice anchored between plant stems, leaves, or corners (or a clearly visible 8-legged spider)."
        ],
        "hard_negative_impostors_to_reject": [
            "Wall cracks, cables, strings, scratches, or empty foliage with no silk filaments."
        ]
    }
]


def _has_word(text: str, words: List[str]) -> bool:
    for w in words:
        if re.search(rf"\b{re.escape(w)}s?\b", text):
            return True
    return False


def _classify_domain_heuristics(quest_title: str, quest_description: str) -> Dict[str, Any]:
    """
    Deterministic domain-class fallback rules when generating rubrics for unseen
    procedural quests offline or without API latency.
    """
    text = f"{quest_title} {quest_description}".lower()

    if _has_word(text, ["ant", "beetle", "ladybug", "bug", "butterfly", "moth", "bee", "wasp", "insect", "grasshopper", "cricket", "spider"]):
        return {
            "id": f"dynamic_arthropod:{quest_title.lower()}",
            "scientific_name": f"{quest_title} (Arthropoda — Insecta / Arachnida)",
            "mandatory_diagnostic_traits": [
                f"Must clearly show a real, anatomically recognizable '{quest_title}' matching: {quest_description}.",
                "MANDATORY ARTHROPOD ANATOMY: Must visibly exhibit segmented body structure (head, thorax, abdomen), jointed legs, and/or wings/antennae appropriate to the exact species.",
                "In-focus biological detail in the 2x Center Detail Crop confirming it is a genuine living/natural specimen."
            ],
            "hard_negative_impostors_to_reject": [
                "CRITICAL HARD REJECTION: Black dots, white dots, dust specks, floor crumbs, tile marks, peeling paint, or tiny amorphous dark blobs where jointed legs and body segments are NOT clearly visible!",
                "An insect from a completely different order (e.g., submitting a housefly for a butterfly or beetle)."
            ]
        }

    if _has_word(text, ["leaf", "leaflet", "frond", "foliage", "sprout", "sapling", "fern", "mimosa", "plant"]):
        return {
            "id": f"dynamic_foliage:{quest_title.lower()}",
            "scientific_name": f"{quest_title} (Botanical Foliage Specimen)",
            "mandatory_diagnostic_traits": [
                f"Must show the exact botanical leaf/foliage type specified by '{quest_title}' ({quest_description}).",
                "MANDATORY BOTANICAL ANATOMY: Blade geometry (shape, base, and apex tip), margin type (smooth/entire vs. serrated/toothed vs. lobed vs. bipinnate compound), and venation pattern must strictly match the named plant species.",
                "Natural chlorophyll/epidermal surface texture and midrib/petiole structure must be clearly visible."
            ],
            "hard_negative_impostors_to_reject": [
                f"Random unrelated leaves or houseplants (such as Money Plant / Epipremnum vines) that do not possess the exact diagnostic blade shape, tip, margin, and venation of '{quest_title}'.",
                "Artificial plastic plants, drawings, or non-botanical objects."
            ]
        }

    if _has_word(text, ["flower", "bloom", "blossom", "petal", "bud", "floret", "champa", "plumeria"]):
        return {
            "id": f"dynamic_flower:{quest_title.lower()}",
            "scientific_name": f"{quest_title} (Angiosperm Floral Specimen)",
            "mandatory_diagnostic_traits": [
                f"Must clearly show the exact flower/blossom specified by '{quest_title}' ({quest_description}).",
                "MANDATORY FLORAL ANATOMY: Petal count, floral symmetry, color palette, and reproductive center (stamens/pistil/corolla tube) must match the target species."
            ],
            "hard_negative_impostors_to_reject": [
                f"Flowers of a completely different species or petal structure than '{quest_title}'.",
                "Plain green leaves with no flower/blossom present."
            ]
        }

    return {
        "id": f"dynamic_specimen:{quest_title.lower()}",
        "scientific_name": f"{quest_title} (Naturalist Field Specimen)",
        "mandatory_diagnostic_traits": [
            f"Must clearly and unambiguously display '{quest_title}' as described: {quest_description}.",
            "Fine, authentic natural structure and surface morphology must be clearly discernible in both the full frame and 2x detail crop."
        ],
        "hard_negative_impostors_to_reject": [
            "Random black or white dots, specks of dirt on a floor, blank walls, unrelated household objects, or lookalike substitutes that lack the defining traits of the quest target."
        ]
    }


def retrieve_taxonomic_knowledge(quest_title: str, quest_description: str) -> Dict[str, Any]:
    """
    Synchronous Tier-1 + Heuristic lookup for backward compatibility.
    """
    combined = f"{quest_title} {quest_description}".lower()

    best_entry = None
    best_score = 0

    for entry in TAXONOMIC_KNOWLEDGE_BASE:
        score = 0
        for kw in entry["keywords"]:
            if re.search(rf"\b{re.escape(kw)}s?\b", combined):
                score += len(kw) * 2
        if score > best_score:
            best_score = score
            best_entry = entry

    if best_entry:
        return best_entry

    cache_key = f"{quest_title.strip().lower()}::{quest_description.strip().lower()[:80]}"
    if cache_key in _DYNAMIC_RAG_CACHE:
        return _DYNAMIC_RAG_CACHE[cache_key]

    return _classify_domain_heuristics(quest_title, quest_description)


async def retrieve_or_synthesize_taxonomic_knowledge(
    quest_title: str,
    quest_description: str
) -> Dict[str, Any]:
    """
    Universal Async RAG Retriever:
    1. Checks Tier 1 Curated Biodiversity Index first (using whole-word boundaries).
    2. Checks `_DYNAMIC_RAG_CACHE` for previously synthesized random location quests.
    3. Dynamically synthesizes a rigorous, species-specific Taxonomic Verification
       Rubric via LLM knowledge retrieval for ANY unseen, randomly generated quest
       anywhere in the world, and caches it for instant reuse!
    """
    combined = f"{quest_title} {quest_description}".lower()

    # 1. Check Tier 1 Curated Index
    best_entry = None
    best_score = 0
    for entry in TAXONOMIC_KNOWLEDGE_BASE:
        score = 0
        for kw in entry["keywords"]:
            if re.search(rf"\b{re.escape(kw)}s?\b", combined):
                score += len(kw) * 2
        if score > best_score:
            best_score = score
            best_entry = entry

    if best_entry:
        return best_entry

    # 2. Check Dynamic In-Memory RAG Cache
    cache_key = f"{quest_title.strip().lower()}::{quest_description.strip().lower()[:80]}"
    if cache_key in _DYNAMIC_RAG_CACHE:
        return _DYNAMIC_RAG_CACHE[cache_key]

    # 3. Synthesize Dynamic Taxonomic Rubric on the fly for unseen random quests
    heuristic_fallback = _classify_domain_heuristics(quest_title, quest_description)

    if not settings.groq_api_key:
        _DYNAMIC_RAG_CACHE[cache_key] = heuristic_fallback
        return heuristic_fallback

    synth_prompt = f"""You are a Senior Botanical, Zoological & Geological Taxonomist building a strict computer-vision verification rubric for an outdoor nature scavenger hunt quest:
Quest Title: "{quest_title}"
Quest Description: "{quest_description}"

Synthesize the exact morphological verification rubric for this target so a vision referee can distinguish the genuine target from common lookalikes, impostor plants/insects, or floor specks.

Return ONLY a raw JSON object with NO markdown formatting:
{{
  "scientific_name": "Scientific / taxonomic name or precise natural phenomenon classification",
  "mandatory_diagnostic_traits": [
    "Trait 1: Exact macro shape, geometry, or body segmentation required",
    "Trait 2: Exact fine anatomical feature required (e.g., venation type, margin serration, drip-tip, petal structure, 6 jointed legs + antennae, surface texture)",
    "Trait 3: Secondary confirming trait visible in close-up"
  ],
  "hard_negative_impostors_to_reject": [
    "Impostor 1: Specific common lookalike species or wrong botanical/zoological family to reject (explain how to tell them apart)",
    "Impostor 2: Another lookalike or wrong plant/object to reject",
    "Impostor 3: Black/white floor dots, dust specks, wall stains, blank walls, or unrelated household items"
  ]
}}"""

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "openai/gpt-oss-120b",
                    "messages": [{"role": "user", "content": synth_prompt}],
                    "reasoning_effort": "low",
                    "temperature": 0.1,
                    "max_tokens": 1200
                }
            )
            if resp.status_code == 200:
                raw_json = resp.json()["choices"][0]["message"]["content"]
                parsed = sanitize_and_parse_json(raw_json, {})
                if (
                    parsed.get("scientific_name")
                    and isinstance(parsed.get("mandatory_diagnostic_traits"), list)
                    and len(parsed["mandatory_diagnostic_traits"]) >= 2
                ):
                    synthesized_profile = {
                        "id": f"dynamic_rag:{quest_title.lower()}",
                        "scientific_name": parsed["scientific_name"],
                        "mandatory_diagnostic_traits": parsed["mandatory_diagnostic_traits"],
                        "hard_negative_impostors_to_reject": parsed.get(
                            "hard_negative_impostors_to_reject",
                            heuristic_fallback["hard_negative_impostors_to_reject"]
                        )
                    }
                    _DYNAMIC_RAG_CACHE[cache_key] = synthesized_profile
                    logger.info(
                        f"Dynamically synthesized RAG rubric for random quest '{quest_title}' -> {synthesized_profile['scientific_name']}"
                    )
                    return synthesized_profile
    except Exception as exc:
        logger.warning(f"Dynamic RAG synthesis fallback for '{quest_title}': {exc}")

    _DYNAMIC_RAG_CACHE[cache_key] = heuristic_fallback
    return heuristic_fallback
