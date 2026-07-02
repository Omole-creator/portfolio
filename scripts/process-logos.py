"""Normalise the four recognition logos for a white-chip logo bar."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "logos"
OUT.mkdir(parents=True, exist_ok=True)


def trim(im: Image.Image) -> Image.Image:
    """Trim transparent / uniform border."""
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def save(im: Image.Image, name: str):
    im = trim(im)
    im.save(OUT / name)
    print("saved", name, im.size)


# Tony Elumelu Foundation: red/grey globe on white. Keep as-is on white chip.
tef = Image.open(ROOT / "logoa.jfif").convert("RGB")
tef.save(OUT / "tef.png")
print("saved tef.png", tef.size)

# TransactPay: gradient sphere, transparent. Shows on white.
save(Image.open(ROOT / "logob-removebg-preview.png"), "transactpay.png")

# African Impact Initiative: coloured, transparent. Shows on white.
save(Image.open(ROOT / "logod-removebg-preview.png"), "african-impact.png")

# Today Africa: light outline logo. Recolour its shape to navy ink so it
# reads on a white chip like the others.
ta = Image.open(ROOT / "logoc-removebg-preview.png").convert("RGBA")
navy = (11, 30, 57)
px = ta.load()
for y in range(ta.height):
    for x in range(ta.width):
        r, g, b, a = px[x, y]
        if a > 20:
            px[x, y] = (navy[0], navy[1], navy[2], a)
save(ta, "today-africa.png")
