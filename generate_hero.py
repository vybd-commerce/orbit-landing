#!/usr/bin/env python3
"""Generate hero carousel images with Nano Banana Pro on Vertex AI.

Usage:
  python generate_hero.py <prompt-name> [variants]      # e.g. battery-china 3
  python generate_hero.py a,b,c [variants]              # several prompts
  python generate_hero.py all [variants]                # every prompt
  python generate_hero.py --contact-sheet [a,b]         # rebuild contact sheet only
  add --sheet <file.png> to any form to name the contact sheet

Auth: Vertex AI via Application Default Credentials (gcloud auth application-default login).
Project/location overridable with GOOGLE_CLOUD_PROJECT / GOOGLE_CLOUD_LOCATION.
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
OUT_DIR = Path(__file__).parent / "hero-images"

CONTEXT = (
    "These sit inside a rounded card on a website. A white search box overlays the TOP ~20% of the image, "
    "so the top band of the frame must be simple and uncluttered (wall, ceiling, sky, soft background) with "
    "no important subject matter there. The main subject should sit in the lower two-thirds, slightly "
    "off-center to the right. Style reference: the photography on america.gov. Warm, natural, documentary "
    "photography; real people at work, not posed or looking at the camera; soft daylight; shallow-to-medium "
    "depth of field; shot on a 35mm lens; subtle film-like color, slightly muted, not saturated or glossy. "
    "It must look like a real photograph, not an illustration or 3D render.\n\n"
    "Hard rules for every image: no text, no logos, no brand names, no readable labels or packaging text, "
    "no watermarks, no recognizable real products or real people."
)

PROMPTS = {
    "battery-china": (
        "A documentary photograph inside a clean, modern lithium battery cell assembly facility in Shenzhen, "
        "China. In the lower right of the frame, a Chinese woman in her 30s, wearing a light blue anti-static "
        "smock, hairnet and blue nitrile gloves, carefully inspects a cylindrical battery cell held up to the "
        "light, focused and calm. Beside her, rows of identical cylindrical cells sit in grey plastic trays on "
        "a stainless-steel workbench, with a soft-focus automated assembly line and yellow safety markings in "
        "the background. Bright, even daylight from high windows mixed with soft overhead LED light; the upper "
        "part of the frame is a plain pale ceiling and wall. The mood is precise, competent and quietly proud. "
        "3:2 landscape, photorealistic, natural skin texture."
    ),
    "skincare-korea": (
        "A documentary photograph in a small, sunlit skincare brand studio in Seongsu-dong, Seoul, South Korea. "
        "In the lower right of the frame, a Korean woman founder in her early 30s, wearing a cream knit sweater "
        "and simple apron, fills small unlabeled frosted-glass serum bottles at a long pale-oak worktable, "
        "absorbed in the task. On the table: neat rows of blank amber and frosted bottles, a small digital "
        "scale, a stack of plain kraft shipping boxes and tissue paper, a ceramic cup of tea. Behind her, "
        "soft-focus white walls, open shelving with plants and more unlabeled bottles. Soft natural window "
        "light from the left, gentle shadows; the upper part of the frame is a plain white wall. The mood is "
        "calm, craft-focused and ambitious, a small brand ready to go global. 3:2 landscape, photorealistic, "
        "natural skin texture."
    ),
    "spices-india": (
        "A documentary photograph inside a small spice processing unit in Kerala, India. In the lower right of "
        "the frame, an Indian man in his 40s, wearing a white cotton shirt with sleeves rolled up, a hairnet and "
        "a cloth apron, scoops whole black peppercorns from an open jute sack into a stainless-steel tray on a "
        "weighing scale, focused on his work. Around him: open jute sacks of turmeric root, dried red chilies, "
        "cardamom pods and cinnamon bark, their rich colors catching the light; stainless-steel sorting tables in "
        "soft focus behind. Warm morning light streams through a high side window, with fine spice dust visible "
        "in the light beam; the upper part of the frame is a plain whitewashed wall and window. The mood is "
        "hardworking, rooted and quality-focused. 3:2 landscape, photorealistic, natural skin texture."
    ),
    "plates-bangladesh": (
        "A documentary photograph inside a sustainable tableware factory near Dhaka, Bangladesh. In the lower "
        "right of the frame, a Bangladeshi woman in her late 20s, wearing a muted green salwar kameez, a dupatta "
        "tied back, a hairnet and a work apron, lifts a tall stack of freshly molded, unbleached compostable "
        "plates made from plant fiber off a conveyor and checks the edge of the top plate. Behind her, in soft "
        "focus, more stacks of natural beige plates and bowls, molding presses and bales of raw palm-leaf and "
        "bagasse fiber. Soft, diffused daylight from translucent roof panels; the upper part of the frame is a "
        "plain pale roof and wall. The mood is purposeful, modern and proud. 3:2 landscape, photorealistic, "
        "natural skin texture."
    ),
    "french-brand": (
        "A documentary photograph in a small French brand's workshop and packing room in an old stone building "
        "in Lyon, France. In the lower right of the frame, a French man in his 30s, in a navy chore jacket and "
        "white t-shirt, tapes shut a plain kraft shipping box at a worn wooden packing table, while a colleague "
        "in the soft-focus background stacks finished boxes onto a shelf. On the table: a roll of brown paper "
        "tape, unlabeled glass jars wrapped in tissue paper, a laptop showing an abstract, unreadable sales "
        "chart. Soft afternoon light from tall old windows on the left; the upper part of the frame is pale "
        "stone wall and window light. The mood is small, crafted and determined, a brand ready for its next "
        "step. 3:2 landscape, photorealistic, natural skin texture."
    ),
    "retailer-order": (
        "A documentary photograph at the loading dock of a mid-sized export warehouse. In the lower right of the "
        "frame, a warehouse worker in his 30s, wearing a high-visibility orange vest, safety boots and work "
        "gloves, guides a forklift loading a shrink-wrapped pallet of plain unlabeled cartons into the open doors "
        "of a plain, unbranded steel shipping container. More pallets of unlabeled cartons wait in a neat row "
        "beside him. Clear, bright early-morning daylight; the upper part of the frame is open pale sky and the "
        "plain warehouse roofline. The mood is momentum, a big first order on its way. Shipping container is "
        "plain grey or dark red with no logos, numbers or markings. 3:2 landscape, photorealistic, natural skin "
        "texture."
    ),
    "port-dawn": (
        "A documentary photograph of a large container port on the US East Coast at dawn. Stacks of plain, "
        "unbranded shipping containers in muted reds, blues and greys fill the lower two-thirds of the frame, "
        "with tall ship-to-shore cranes rising on the right and a container ship docked beyond them. In the "
        "lower right, small in the frame, a port worker in a hard hat and high-visibility vest stands on the "
        "quay with a tablet, looking toward the ship. Soft pink and gold dawn light, a little haze over the "
        "water; the upper part of the frame is a calm, clear gradient sky. Containers and ship have no logos, "
        "names, numbers or readable markings. The mood is arrival and possibility. 3:2 landscape, "
        "photorealistic."
    ),
    "robots-china": (
        "A documentary photograph inside a robotics workshop in Shenzhen, China. In the lower right of the "
        "frame, a Chinese engineer in his late 20s, wearing a dark grey work jacket and safety glasses, adjusts "
        "the wrist joint of a compact white collaborative robot arm mounted on a test bench, watching it "
        "closely, a laptop with abstract unreadable graphs beside him. In the soft-focus background, other robot "
        "arms on benches, cable trays and tool walls. Clean, bright, cool-neutral light from overhead panels and "
        "a side window; the upper part of the frame is a plain pale wall and ceiling. The robot is generic and "
        "unbranded, with no logos or text. The mood is precise, inventive and world-class. 3:2 landscape, "
        "photorealistic, natural skin texture."
    ),
}


def crop_to_3_2(img: Image.Image) -> Image.Image:
    w, h = img.size
    if abs(w / h - 1.5) < 0.01:
        return img
    if w / h > 1.5:
        nw = round(h * 1.5)
        x = (w - nw) // 2
        return img.crop((x, 0, x + nw, h))
    nh = round(w / 1.5)
    y = (h - nh) // 2
    return img.crop((0, y, w, y + nh))


def generate(client: genai.Client, name: str, variants: int) -> list[Path]:
    prompt = f"{PROMPTS[name]}\n\nCONTEXT:\n{CONTEXT}"
    OUT_DIR.mkdir(exist_ok=True)
    saved = []
    for n in range(1, variants + 1):
        path = OUT_DIR / f"{name}-{n}.png"
        try:
            resp = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                    image_config=types.ImageConfig(aspect_ratio="3:2"),
                ),
            )
        except Exception as e:
            print(f"[FAIL] {path.name}: {e}", file=sys.stderr)
            continue
        img_bytes = None
        for cand in resp.candidates or []:
            for part in (cand.content.parts if cand.content else []) or []:
                if part.inline_data and part.inline_data.data:
                    img_bytes = part.inline_data.data
                    break
            if img_bytes:
                break
        if not img_bytes:
            reason = resp.candidates[0].finish_reason if resp.candidates else None
            block = getattr(resp.prompt_feedback, "block_reason", None) if resp.prompt_feedback else None
            text = resp.text if hasattr(resp, "text") else None
            print(f"[NO IMAGE] {path.name}: finish_reason={reason} block_reason={block} text={text!r}", file=sys.stderr)
            continue
        img = crop_to_3_2(Image.open(io.BytesIO(img_bytes)).convert("RGB"))
        img.save(path)
        print(f"[OK] {path} {img.size}")
        saved.append(path)
    return saved


def contact_sheet(names: list[str] | None = None, out_name: str = "contact-sheet.png") -> Path:
    files = sorted(
        p for p in OUT_DIR.glob("*.png")
        if not p.name.startswith("contact-sheet") and (names is None or p.stem.rsplit("-", 1)[0] in names)
    )
    if not files:
        raise SystemExit("no images to sheet")
    groups: dict[str, list[Path]] = {n: [] for n in names} if names else {}
    for f in files:
        groups.setdefault(f.stem.rsplit("-", 1)[0], []).append(f)
    tw, th, pad, label = 600, 400, 20, 36
    groups = {k: v for k, v in groups.items() if v}
    cols = max(len(v) for v in groups.values())
    W = pad + cols * (tw + pad)
    H = pad + len(groups) * (th + label + pad)
    sheet = Image.new("RGB", (W, H), "white")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    except OSError:
        font = ImageFont.load_default()
    for r, (_, paths) in enumerate(groups.items()):
        for c, p in enumerate(paths):
            x, y = pad + c * (tw + pad), pad + r * (th + label + pad)
            im = Image.open(p).convert("RGB")
            im.thumbnail((tw, th))
            sheet.paste(im, (x, y))
            # mark the ~20% search-box band
            draw.rectangle((x, y, x + im.width, y + int(im.height * 0.2)), outline=(255, 80, 80), width=2)
            draw.text((x, y + th + 6), p.name, fill="black", font=font)
    out = OUT_DIR / out_name
    sheet.save(out)
    print(f"[SHEET] {out}")
    return out


def main():
    args = sys.argv[1:]
    sheet = "contact-sheet.png"
    if "--sheet" in args:
        k = args.index("--sheet")
        sheet = args[k + 1]
        del args[k : k + 2]
    if args and args[0] == "--contact-sheet":
        names = args[1].split(",") if len(args) > 1 else None
        contact_sheet(names, sheet)
        return
    if not args:
        raise SystemExit(__doc__)
    names = list(PROMPTS) if args[0] == "all" else args[0].split(",")
    variants = int(args[1]) if len(args) > 1 else 3
    for n in names:
        if n not in PROMPTS:
            raise SystemExit(f"unknown prompt '{n}'. options: {', '.join(PROMPTS)}")
    client = genai.Client(vertexai=True, project=PROJECT, location=LOCATION)
    print(f"model={MODEL} project={PROJECT} location={LOCATION}")
    for n in names:
        generate(client, n, variants)
    contact_sheet(names, sheet)


if __name__ == "__main__":
    main()
