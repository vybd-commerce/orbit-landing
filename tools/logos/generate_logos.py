#!/usr/bin/env python3
"""Placeholder brand logos for the "Already in the US" proof cards, made with
the same model as generate_hero.py. Stand-ins until the brands send their
real logos.

Usage:
  python tools/logos/generate_logos.py [name,name|all] [variants]
  python tools/logos/generate_logos.py --sheet      # rebuild the contact sheet only

Raw renders go to hero-images/logos/<id>-<n>.png, with a contact sheet.
"""
import io
import os
import sys
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image, ImageDraw, ImageFont

PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "dopl-507205")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
MODEL = os.environ.get("HERO_MODEL", "gemini-3-pro-image")
ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "hero-images" / "logos"

STYLE = (
    "A clean, modern brand logo on a pure white background: a simple geometric mark beside or above the "
    "wordmark. Solid black only, flat vector style, no gradients, no shadows, no mockup, no 3D, no texture, "
    "no frame or border. The wordmark is spelled exactly as given, letter for letter, with no other words, "
    "tagline, slogan or year. Centered, generous white margin on every side. It should look like a "
    "professional identity designed by a good studio, not clip art."
)

BRANDS = {
    "bayangrom": ("Bayangrom", "an art and apparel brand from India"),
    "emsworth": ("Emsworth", "a luxury terry cotton towels and bathrobes brand from India"),
    "sugat": ("Sugat Traders", "an Indian company making herbal powders and sustainable food packaging"),
    "ollobot": ("Ollobot", "a friendly companion robot company from China"),
    "karama": ("Karama", "a premium underwear brand from the USA"),
    "ouwr": ("Ouwr", "a Korean womenswear fashion label (K-fashion), minimal and editorial"),
    "cellre": ("Cellre", "a Korean skincare brand (K-beauty), clean and clinical"),
}


def prompt_for(key: str) -> str:
    name, about = BRANDS[key]
    return f'Logo for "{name}", {about}. The wordmark reads exactly "{name}".\n\n{STYLE}'


def generate(client, key: str, variants: int):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for n in range(1, variants + 1):
        path = OUT_DIR / f"{key}-{n}.png"
        try:
            resp = client.models.generate_content(
                model=MODEL,
                contents=prompt_for(key),
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                    image_config=types.ImageConfig(aspect_ratio="1:1"),
                ),
            )
        except Exception as e:
            print(f"[FAIL] {path.name}: {e}", file=sys.stderr)
            continue
        data = next(
            (p.inline_data.data for c in resp.candidates or [] for p in (c.content.parts if c.content else []) or []
             if p.inline_data and p.inline_data.data),
            None,
        )
        if not data:
            reason = resp.candidates[0].finish_reason if resp.candidates else None
            print(f"[NO IMAGE] {path.name}: finish_reason={reason}", file=sys.stderr)
            continue
        Image.open(io.BytesIO(data)).convert("RGB").save(path)
        print(f"[OK] {path}")


def sheet():
    files = sorted(p for p in OUT_DIR.glob("*.png") if p.name != "contact-sheet.png")
    groups: dict[str, list[Path]] = {}
    for f in files:
        groups.setdefault(f.stem.rsplit("-", 1)[0], []).append(f)
    t, pad, label = 320, 16, 30
    cols = max(len(v) for v in groups.values())
    out = Image.new("RGB", (pad + cols * (t + pad), pad + len(groups) * (t + label + pad)), (235, 236, 239))
    draw = ImageDraw.Draw(out)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
    except OSError:
        font = ImageFont.load_default()
    for r, paths in enumerate(groups.values()):
        for c, p in enumerate(paths):
            x, y = pad + c * (t + pad), pad + r * (t + label + pad)
            out.paste(Image.open(p).convert("RGB").resize((t, t)), (x, y))
            draw.text((x, y + t + 4), p.name, fill="black", font=font)
    dest = OUT_DIR / "contact-sheet.png"
    out.save(dest)
    print(f"[SHEET] {dest}")


def main():
    args = sys.argv[1:]
    if args[:1] == ["--sheet"]:
        return sheet()
    keys = list(BRANDS) if not args or args[0] == "all" else args[0].split(",")
    variants = int(args[1]) if len(args) > 1 else 3
    client = genai.Client(vertexai=True, project=PROJECT, location=LOCATION)
    for k in keys:
        generate(client, k, variants)
    sheet()


if __name__ == "__main__":
    main()
