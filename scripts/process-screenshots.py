"""
Redact and clean the product screenshots for the portfolio.

For each screenshot we:
  1. Blur every business-sensitive number (revenue, profit, expenses,
     commissions, lead/applicant counts, conversion %, chart data labels).
  2. Cover the "Activate Windows" watermark.
  3. Crop off the browser tabs / URL bar (top) and the Windows taskbar (bottom)
     plus the right-hand scrollbar.
  4. Export a web-optimized WebP (plus a PNG preview for review).

Coordinates are written in the *displayed* 2000x1125 space (what we reviewed
in chat) and scaled up to the real 2560x1440 image with SCALE.
"""

from pathlib import Path
from PIL import Image, ImageFilter

SRC = Path(__file__).resolve().parent.parent
OUT = SRC / "source-materials" / "redacted"
OUT.mkdir(parents=True, exist_ok=True)

SCALE = 2560 / 2000  # displayed -> original

# Crop box in displayed coords: drop top chrome, bottom taskbar, right scrollbar.
CROP = (0, 130, 1975, 1040)

# Per-image number regions to blur, in displayed coords [x1, y1, x2, y2].
REGIONS = {
    "Screenshot (280).png": [  # Leads dashboard - Overview
        [120, 300, 1870, 378],    # 6 KPI value cards
        [138, 492, 382, 550],     # Commission in range
        [300, 712, 792, 1032],    # Leads-by-source donut labels
        [1026, 712, 1098, 1036],  # Pipeline bar chart y-axis numbers
        [1626, 756, 1794, 884],   # "No Answer value: 0" tooltip
    ],
    "Screenshot (281).png": [  # Training outcomes report
        [328, 752, 1668, 818],    # Applicants / Enrolled / Conversion / Programs
        [1420, 1018, 1602, 1044], # Data Analysis applicants count
    ],
    "Screenshot (282).png": [  # Powerhouse - Financial Command Center
        [438, 422, 1832, 508],    # 4 KPI cards (revenue, commission, expenses, net profit)
        [952, 682, 1162, 934],    # Revenue breakdown values + percents
        [498, 778, 662, 838],     # Revenue donut center total
        [1712, 682, 1948, 1012],  # Expense breakdown values + percents
        [1268, 842, 1428, 902],   # Expense donut center total
    ],
    "Screenshot (283).png": [],   # Public sales page: marketing numbers kept
    "Screenshot (285).png": [],   # GluFloat public marketing hero: nothing sensitive
    "Screenshot (286).png": [],   # GluFloat public marketing section: nothing sensitive
    "Screenshot (287).png": [],   # WaterBrooks public marketing hero: nothing sensitive
    "Screenshot (288).png": [],   # WaterBrooks public marketing traction: public numbers kept
    "Screenshot (289).png": [],   # JobMingle public marketing hero: nothing sensitive
}

# "Activate Windows" watermark, present on all four (displayed coords).
WATERMARK = [1500, 918, 1975, 1040]


def redact(region, box):
    """Pixelate then blur a box so no text is legible."""
    x1, y1, x2, y2 = [int(round(v * SCALE)) for v in box]
    x1, y1 = max(0, x1), max(0, y1)
    x2 = min(region.width, x2)
    y2 = min(region.height, y2)
    if x2 <= x1 or y2 <= y1:
        return
    crop = region.crop((x1, y1, x2, y2))
    small = crop.resize(
        (max(1, crop.width // 22), max(1, crop.height // 22)), Image.BILINEAR
    )
    pixelated = small.resize(crop.size, Image.NEAREST)
    blurred = pixelated.filter(ImageFilter.GaussianBlur(9))
    region.paste(blurred, (x1, y1))


def main():
    for name, boxes in REGIONS.items():
        src = SRC / name
        if not src.exists():
            print(f"skip missing {name}")
            continue
        im = Image.open(src).convert("RGB")
        for box in boxes:
            redact(im, box)
        redact(im, WATERMARK)

        crop = tuple(int(round(v * SCALE)) for v in CROP)
        im = im.crop(crop)

        slug = {
            "Screenshot (280).png": "leads-overview",
            "Screenshot (281).png": "leads-report",
            "Screenshot (282).png": "powerhouse",
            "Screenshot (283).png": "sales-toolkit",
            "Screenshot (285).png": "glufloat-check",
            "Screenshot (286).png": "glufloat-joy",
            "Screenshot (287).png": "waterbrooks-hero",
            "Screenshot (288).png": "waterbrooks-traction",
            "Screenshot (289).png": "jobmingle-hero",
        }[name]
        im.save(OUT / f"{slug}.webp", "WEBP", quality=88, method=6)
        im.save(OUT / f"{slug}.png", "PNG")  # preview for review
        print(f"done {slug}  {im.size}")


if __name__ == "__main__":
    main()
