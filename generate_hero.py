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

# Context for the "us-" set (a product's journey through the United States); replaces CONTEXT for those prompts.
US_CONTEXT = (
    "These sit inside a rounded card on a website, and a white search box overlays the TOP ~20% of the image. "
    "Keep that top band simple and uncluttered (wall, ceiling, sky, soft background) with nothing important in "
    "it. The main subject sits in the lower two-thirds, slightly right of center.\n"
    "The set tells one story: a product's journey through the United States. Every scene must be clearly "
    "American in its architecture, stores, warehouses, light and details.\n"
    "Style: warm, natural documentary photography in the spirit of america.gov's photos. Real work in progress, "
    "never posed, nobody looking at the camera. Hands and objects lead the frame; any people are incidental, "
    "partly out of frame or seen from behind or the side, never the focus. Soft daylight, 35mm lens, medium "
    "depth of field, subtle film-like color, slightly muted. Must look like a real photograph, not an "
    "illustration or 3D render.\n"
    "Hard rules: no readable text anywhere (packaging, labels, signs, screens and papers are blank, abstract or "
    "out of focus), no logos, no brand names, no watermarks, no recognizable real products, stores or people."
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

US_PROMPTS = {
    "us-research": (
        "Overhead-angled documentary photograph of a long white worktable in a bright American office. Hands "
        "arrange a dozen competitor products bought from a US supermarket into neat rows: plain jars, pouches, "
        "small boxes and bottles in varied colors, all with blank or unreadable labels. Around them: crumpled "
        "store receipts, a handful of pastel sticky notes, a ballpoint pen, a paper shopping bag. One hand is "
        "placing a sticky note beside a jar. Soft window light from the left; the top of the frame is the plain "
        "edge of the table and a white wall. The mood is curious and methodical, a team studying the market."
    ),
    "us-voice": (
        "Documentary photograph inside a sunlit creative studio in Brooklyn: exposed brick, big industrial "
        "windows, a long corkboard wall. On the wall, two versions of the same product packaging are pinned side "
        "by side as large printouts with mood photos and color swatches around them; one version is circled with "
        "a loose red marker line. In the lower right, a designer seen from behind and slightly to the side, "
        "coffee mug in hand, steps back to compare them. All packaging text is blank or abstract shapes. The top "
        "of the frame is plain brick wall and window light. The mood is thoughtful: translating a brand for "
        "American shoppers."
    ),
    "us-buyer": (
        "Documentary photograph in a bright conference room at a US retail company headquarters. On a pale "
        "wooden table, a cardboard sample box has just been opened: crinkle paper spills out and four or five "
        "unbranded product samples (jars, a pouch, a small bottle) stand in a row in front of it, with a printed "
        "one-page sheet (unreadable) and a pen. In the lower right, two pairs of hands at the edge of the frame, "
        "one lifting a jar to look at it. Behind, soft-focus glass walls and a view of an American suburban "
        "office park. The top of the frame is a plain white ceiling and glass. The mood is the quiet tension of "
        "a buyer meeting."
    ),
    "us-order": (
        "Documentary photograph at the loading dock of a modern American distribution warehouse in early "
        "morning. A long row of tall, neatly shrink-wrapped pallets of plain brown cartons recedes in a line "
        "toward an open dock door, where a plain white unbranded trailer is backed in. In the lower right, a "
        "worker in a high-visibility vest, seen from the side, checks the pallets off on a tablet. Low golden "
        "light spills through the dock door across the concrete floor. The top of the frame is plain warehouse "
        "roof structure and soft light. No logos or markings on pallets, cartons or trailer. The mood: a big "
        "first order, real and on its way."
    ),
    "us-label": (
        "Close-up documentary photograph at a clean workbench in an American fulfillment center. Two gloved "
        "hands press a small white blank label onto the side of a plain product box, smoothing it with a thumb. "
        "Beside them: a roll of blank white labels on a dispenser, a small stack of identical boxes, a handheld "
        "barcode scanner, and a clipboard with an out-of-focus checklist. Soft overhead light; the background is "
        "a softly blurred warehouse with shelving. The top of the frame is plain, out-of-focus warehouse "
        "ceiling. All labels and papers are blank or unreadable. The mood is precise and careful: done right, "
        "by the rules."
    ),
    "us-port": (
        "Documentary photograph of a large American container port on the East Coast at dawn. Stacks of plain, "
        "unbranded shipping containers in muted reds, blues and greys fill the lower two-thirds of the frame, "
        "with tall ship-to-shore cranes rising on the right and a container ship docked beyond them. Small in "
        "the lower right, a port worker in a hard hat and high-visibility vest stands on the quay with a tablet, "
        "seen from behind, looking toward the ship. Soft pink and gold dawn light, a little haze over the water; "
        "the top of the frame is a calm, clear gradient sky. Containers and ship have no logos, names, numbers "
        "or readable markings. The mood is arrival."
    ),
    "us-warehouse": (
        "Documentary photograph looking down a tall, clean aisle of a modern American 3PL warehouse. Steel "
        "racking rises on both sides, neatly stocked with plain brown cartons and shrink-wrapped pallets. In the "
        "lower right, high up on an order-picker lift, a worker in a high-visibility vest, seen from behind, "
        "reaches for a carton. Morning light streams in from high clerestory windows at the far end, catching "
        "dust in the air. Polished concrete floor with yellow lane lines. The top of the frame is plain "
        "warehouse ceiling and soft light. No logos, signage or readable labels. The mood: calm, organized, "
        "large-scale."
    ),
    "us-doorstep": (
        "Documentary photograph of the front porch of a classic American house in a leafy suburb in early "
        "evening: painted wooden steps, a white porch railing, a potted plant, a doormat. A single plain kraft "
        "shipping box with no labels or markings sits on the top step, just delivered. Warm golden-hour light "
        "rakes across the porch, with soft long shadows; a hint of a tree-lined street in soft focus behind. No "
        "people. The top of the frame is the plain underside of the porch roof and soft sky. The mood is quiet "
        "satisfaction: it arrived."
    ),
}
PROMPTS.update(US_PROMPTS)


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
    context = US_CONTEXT if name in US_PROMPTS else CONTEXT
    prompt = f"{PROMPTS[name]}\n\nCONTEXT:\n{context}"
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
