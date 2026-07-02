import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

async function scrollThrough(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const timer = setInterval(() => {
        window.scrollTo(0, y);
        y += 400;
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          setTimeout(resolve, 400);
        }
      }, 110);
    });
  });
  await page.waitForTimeout(500);
}

const browser = await chromium.launch();

// Desktop
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/home-hero.png` });
await scrollThrough(page);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

for (const path of ["work", "about", "contact"]) {
  await page.goto(`${base}/${path}`, { waitUntil: "networkidle" });
  await scrollThrough(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${path}-full.png`, fullPage: true });
}
await ctx.close();

// Mobile home
const mob = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mp = await mob.newPage();
await mp.goto(base, { waitUntil: "networkidle" });
await mp.waitForTimeout(1200);
await mp.screenshot({ path: `${OUT}/home-mobile-hero.png` });
await mob.close();

await browser.close();
console.log("shots done");
