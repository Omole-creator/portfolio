"""Prepare the tool logos for the marquee: trim, and darken Resend so it
shows on a white chip. Output to public/images/tools/."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "tools"
OUT.mkdir(parents=True, exist_ok=True)

# source removebg file -> output name
MAP = {
    "1g-removebg-preview.png": "meta.png",
    "1e-removebg-preview.png": "claude.png",
    "1f-removebg-preview.png": "google-analytics.png",
    "1a-removebg-preview.png": "kit.png",
    "1b-removebg-preview.png": "resend.png",  # recolour to dark
    "1c-removebg-preview.png": "clickup.png",
    "1d-removebg-preview.png": "asana.png",
    "1h-removebg-preview.png": "slack.png",
    "1i-removebg-preview.png": "canva.png",
}


def trim(im):
    im = im.convert("RGBA")
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


for src, name in MAP.items():
    im = trim(Image.open(ROOT / src))
    if name == "resend.png":
        dark = (17, 17, 17)
        px = im.load()
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = px[x, y]
                if a > 20:
                    px[x, y] = (dark[0], dark[1], dark[2], a)
    im.save(OUT / name)
    print("saved", name, im.size)
