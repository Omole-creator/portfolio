import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const URL = "https://omoleportfolio.vercel.app";
const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/live-home-hero.png` });
await browser.close();
console.log("live shot done");
