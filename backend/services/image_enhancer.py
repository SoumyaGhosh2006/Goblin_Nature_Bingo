"""
==============================================================================
COMPUTER VISION IMAGE PRE-PROCESSOR & ENHANCER — GOBLIN NATURE BINGO
==============================================================================
Enhances user-submitted nature photos before multimodal AI inspection:
1. Decodes base64 image and normalizes color space & dimensions.
2. Computes structural visual telemetry (edge density, color entropy, contrast)
   to detect featureless specks/dots on floors vs. genuine biological textures.
3. Applies Luminance-Preserving Auto-Contrast (YCbCr Y-channel), subtle Color
   Enrichment, and Unsharp Masking to recover leaf venation, drip-tips,
   serrated margins, and insect anatomy from slightly blurry camera shots
   without distorting natural RGB hues.
4. Builds a Side-by-Side Dual-Scale Naturalist Inspection Plate (784x448px):
   - Left Panel (448x448px): Full Frame (YCbCr contrast + UnsharpMask)
   - Right Panel (336x448px): 2x Magnified & Sharpened Center Detail Zoom
   This gives the vision model both macro and micro views in a single compact
   token-efficient image (~450 vision tokens vs ~4,800 for two separate large images).
"""

import base64
import io
import logging
from typing import Dict, Any
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageStat

logger = logging.getLogger(__name__)


def enhance_and_analyze_image(image_base64: str) -> Dict[str, Any]:
    """
    Processes a base64 image through an adaptive computer-vision enhancement pipeline.
    Returns:
      - composite_plate_data_url: 784x448 side-by-side Full Frame + 2x Detail Zoom
      - enhanced_full_data_url: Full image with Y-channel contrast & UnsharpMask sharpening
      - detail_crop_data_url: 2x magnified & sharpened central region for fine anatomy
      - telemetry: Structural metrics (edge_density, color_variance, is_featureless_or_speck)
    """
    raw_b64 = image_base64.strip()
    if "," in raw_b64:
        raw_b64 = raw_b64.split(",", 1)[-1].strip()

    try:
        img_bytes = base64.b64decode(raw_b64)
        img = Image.open(io.BytesIO(img_bytes))
    except Exception as exc:
        logger.warning(f"Image decode failed in enhancer: {exc}")
        fallback_url = image_base64 if image_base64.startswith("data:") else f"data:image/jpeg;base64,{raw_b64}"
        return {
            "composite_plate_data_url": fallback_url,
            "enhanced_full_data_url": fallback_url,
            "detail_crop_data_url": None,
            "telemetry": {
                "edge_density": 0.0,
                "color_variance": 0.0,
                "is_featureless_or_speck": True,
                "summary": "Warning: Image could not be decoded cleanly."
            }
        }

    # Handle RGBA/Palette transparency by compositing onto neutral white
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        alpha = img.convert("RGBA")
        bg = Image.new("RGBA", alpha.size, (255, 255, 255, 255))
        img = Image.alpha_composite(bg, alpha).convert("RGB")
    else:
        img = img.convert("RGB")

    # Normalize dimensions (min 128px, max 1024px)
    w, h = img.size
    if w < 128 or h < 128:
        scale = max(128 / max(w, 1), 128 / max(h, 1))
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    elif w > 1024 or h > 1024:
        img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

    w, h = img.size

    # -------------------------------------------------------------------------
    # STEP 1: Structural & Edge Telemetry (Detects Blank Walls / Floor Dots)
    # -------------------------------------------------------------------------
    gray = img.convert("L")
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_stat = ImageStat.Stat(edges)
    color_stat = ImageStat.Stat(img)

    edge_mean = float(edge_stat.mean[0])
    color_std = float(sum(color_stat.stddev) / 3.0)

    # Count fraction of pixels with meaningful edge gradient (> 28)
    edge_hist = edges.histogram()
    total_pixels = max(w * h, 1)
    active_edge_pixels = sum(edge_hist[28:])
    active_edge_ratio = active_edge_pixels / total_pixels

    # A random black/white dot on a plain floor has tiny active_edge_ratio (< 0.010)
    # and very low overall edge mean (< 2.0)
    is_featureless_or_speck = (active_edge_ratio < 0.010 and color_std < 18.0) or (edge_mean < 2.0)

    telemetry_summary = (
        f"Resolution: {w}x{h}px | EdgeMean: {edge_mean:.1f} | "
        f"ActiveEdgeRatio: {active_edge_ratio:.3f} | ColorStd: {color_std:.1f} | "
        f"LowDetailSpeckWarning: {is_featureless_or_speck}"
    )

    # -------------------------------------------------------------------------
    # STEP 2: Luminance-Preserving Contrast & Unsharp Masking
    # (Adjusts only Y-channel in YCbCr so green leaves/flowers keep true hues)
    # -------------------------------------------------------------------------
    ycbcr = img.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    y_auto = ImageOps.autocontrast(y, cutoff=1)
    y_blended = Image.blend(y, y_auto, alpha=0.45)
    enhanced = Image.merge("YCbCr", (y_blended, cb, cr)).convert("RGB")

    enhanced = ImageEnhance.Color(enhanced).enhance(1.08)
    enhanced = ImageEnhance.Contrast(enhanced).enhance(1.08)
    # UnsharpMask recovers fine leaf venation, serrated edges, and insect legs from slight blur
    enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=1.6, percent=145, threshold=3))

    # -------------------------------------------------------------------------
    # STEP 3: 2x High-Detail Center Crop for Fine Anatomical Verification
    # -------------------------------------------------------------------------
    crop_w, crop_h = int(w * 0.52), int(h * 0.52)
    left = (w - crop_w) // 2
    top = (h - crop_h) // 2
    center_crop = enhanced.crop((left, top, left + crop_w, top + crop_h))
    center_crop = center_crop.resize((448, 448), Image.Resampling.LANCZOS)
    center_crop = center_crop.filter(ImageFilter.UnsharpMask(radius=1.3, percent=125, threshold=2))

    # -------------------------------------------------------------------------
    # STEP 4: Side-by-Side Composite Inspection Plate (784x448px)
    # Left (448x448): Full Enhanced View | Right (332x448): 2x Center Zoom
    # -------------------------------------------------------------------------
    plate = Image.new("RGB", (784, 448), (245, 245, 240))
    full_thumb = ImageOps.contain(enhanced, (448, 448), Image.Resampling.LANCZOS)
    ft_x = (448 - full_thumb.width) // 2
    ft_y = (448 - full_thumb.height) // 2
    plate.paste(full_thumb, (ft_x, ft_y))

    zoom_panel = ImageOps.fit(center_crop, (332, 448), Image.Resampling.LANCZOS)
    plate.paste(zoom_panel, (452, 0))

    plate_buf = io.BytesIO()
    plate.save(plate_buf, format="JPEG", quality=86, optimize=True)
    plate_b64 = base64.b64encode(plate_buf.getvalue()).decode("utf-8")
    composite_url = f"data:image/jpeg;base64,{plate_b64}"

    # Also encode standalone full & crop URLs
    full_buf = io.BytesIO()
    full_thumb.save(full_buf, format="JPEG", quality=86, optimize=True)
    enhanced_full_b64 = base64.b64encode(full_buf.getvalue()).decode("utf-8")

    crop_buf = io.BytesIO()
    center_crop.save(crop_buf, format="JPEG", quality=86, optimize=True)
    detail_crop_b64 = base64.b64encode(crop_buf.getvalue()).decode("utf-8")

    return {
        "composite_plate_data_url": composite_url,
        "enhanced_full_data_url": f"data:image/jpeg;base64,{enhanced_full_b64}",
        "detail_crop_data_url": f"data:image/jpeg;base64,{detail_crop_b64}",
        "telemetry": {
            "edge_density": round(active_edge_ratio, 4),
            "edge_mean": round(edge_mean, 2),
            "color_variance": round(color_std, 2),
            "is_featureless_or_speck": is_featureless_or_speck,
            "summary": telemetry_summary
        }
    }
