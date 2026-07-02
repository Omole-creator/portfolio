import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const URL = "https://omoleportfolio.vercel.app";
const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Mobile hero (check buttons on one row)
const mob = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mp = await mob.newPage();
await mp.goto(URL, { waitUntil: "domcontentloaded" });
await mp.waitForTimeout(2500);
await mp.screenshot({ path: `${OUT}/live-mobile-hero.png` });
await mob.close();

// Desktop tools strip
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 620));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/live-tools.png` });
await ctx.close();

await browser.close();
console.log("done");
