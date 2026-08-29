#!/usr/bin/env python3
"""Resize and re-encode the generated photography into web-ready derivatives.

Produces responsive JPEG + WebP variants for each source image so the page can
serve the lightest acceptable file at every viewport.
"""
import os
from PIL import Image

SRC_DIR = "/home/ubuntu/testing2/assets/img"
OUT_DIR = "/home/ubuntu/testing2/assets/img"

# (source name, output base, target widths, quality)
IMAGES = [
    ("hero-main.jpg",       "hero",     [900, 1600], 82),
    ("proof-lift-day1.jpg", "proof-d1", [700, 1100], 82),
    ("proof-lift-day56.jpg","proof-d56",[700, 1100], 82),
    ("studio-room.jpg",     "studio",   [700, 1100], 82),
    ("process-detail.jpg",  "process",  [900, 1400], 82),
]


def encode(img: Image.Image, base: str, width: int, quality: int) -> None:
    ratio = width / img.width
    height = round(img.height * ratio)
    resized = img.resize((width, height), Image.LANCZOS)
    jpg_path = os.path.join(OUT_DIR, f"{base}-{width}.jpg")
    webp_path = os.path.join(OUT_DIR, f"{base}-{width}.webp")
    resized.save(jpg_path, "JPEG", quality=quality, optimize=True, progressive=True)
    resized.save(webp_path, "WEBP", quality=quality, method=6)
    jpg_kb = os.path.getsize(jpg_path) / 1024
    webp_kb = os.path.getsize(webp_path) / 1024
    print(f"{base}-{width}: {width}x{height}  jpg {jpg_kb:.0f} KB  webp {webp_kb:.0f} KB")


def main() -> None:
    for src_name, base, widths, quality in IMAGES:
        src_path = os.path.join(SRC_DIR, src_name)
        with Image.open(src_path) as im:
            img = im.convert("RGB")
            for width in widths:
                encode(img, base, width, quality)


if __name__ == "__main__":
    main()
