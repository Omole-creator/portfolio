import { test, expect } from "@playwright/test";

test.describe("Omole portfolio", () => {
  test("loads with the right title and a single h1", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Omole Usuangbon/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("customers");
  });

  test("has all main sections", async ({ page }) => {
    await page.goto("/");
    for (const id of ["about", "services", "work", "recognition", "contact"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("key action links point to the right places", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('a[href^="mailto:omoleusuangbon@gmail.com"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href*="calendly.com/omoleusuangbon"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href*="wa.me/2348132097317"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href*="linkedin.com/in/omole"]').first(),
    ).toBeVisible();
  });

  test("product live links are present", async ({ page }) => {
    await page.goto("/");
    for (const url of [
      "jobmingle-powerhouse.vercel.app",
      "jobmingleleads.vercel.app",
      "sales-obj.vercel.app",
    ]) {
      await expect(page.locator(`a[href*="${url}"]`).first()).toHaveCount(1);
    }
  });

  test("all content images have non-empty alt text", async ({ page }) => {
    await page.goto("/");
    const imgs = page.locator("main img");
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      expect(alt, `image ${i} should have alt text`).toBeTruthy();
    }
  });

  test("no horizontal scroll on a small phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
