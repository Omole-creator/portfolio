import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const URL = "https://omoleportfolio.vercel.app";
const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/live-hero.png` });
// scroll to the work section to trigger reveals and confirm images
await page.locator("#work").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/live-work.png` });
await browser.close();
console.log("live shots done");
