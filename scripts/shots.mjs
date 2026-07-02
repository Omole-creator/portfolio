import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const OUT = "source-materials/site-preview";
mkdirSync(OUT, { recursive: true });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollTo(0, y);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(timer);
          setTimeout(resolve, 400);
        }
      }, 120);
    });
  });
  await page.waitForTimeout(600);
}

const browser = await chromium.launch();

// Desktop
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const dp = await desktop.newPage();
await dp.goto("http://localhost:3000", { waitUntil: "networkidle" });
await scrollThrough(dp);
for (const id of ["about", "services", "work", "recognition", "contact"]) {
  await dp.locator(`#${id}`).scrollIntoViewIfNeeded();
  await dp.waitForTimeout(500);
  await dp.screenshot({ path: `${OUT}/section-${id}.png` });
}
await dp.evaluate(() => window.scrollTo(0, 0));
await dp.waitForTimeout(400);
await dp.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });
await desktop.close();

// Mobile
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mp = await mobile.newPage();
await mp.goto("http://localhost:3000", { waitUntil: "networkidle" });
await scrollThrough(mp);
await mp.evaluate(() => window.scrollTo(0, 0));
await mp.waitForTimeout(400);
await mp.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });
await mobile.close();

await browser.close();
console.log("shots done");
