import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const URL = "https://omoleportfolio.vercel.app";
const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);

// Selected Work partway in (shows the slide/offset)
await page.evaluate(() => window.scrollTo(0, 1100));
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/live-work-slide.png` });

// What I Do settled
await page.evaluate(() => {
  const el = document.getElementById("services");
  if (el) window.scrollTo(0, el.offsetTop - 120);
});
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/live-services.png` });

await browser.close();
console.log("done");
