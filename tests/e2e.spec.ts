import { test, expect } from "@playwright/test";

test.describe("Omole portfolio", () => {
  test("home loads with the headline and a single h1", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Omole Usuangbon/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Growth and Systems");
  });

  test("nav links to the inner pages", async ({ page }) => {
    await page.goto("/");
    for (const href of ["/work", "/about", "/contact"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("home shows tools and proof", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Claude Code").first()).toBeVisible();
    await expect(page.getByText("return on ad spend").first()).toBeVisible();
  });

  test("work page shows the products with live links", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByText("JobMingle Powerhouse").first()).toBeVisible();
    for (const url of [
      "jobmingle-powerhouse.vercel.app",
      "jobmingleleads.vercel.app",
      "sales-obj.vercel.app",
      "jobmingle.co",
    ]) {
      await expect(page.locator(`a[href*="${url}"]`).first()).toHaveCount(1);
    }
  });

  test("contact page has the action links and faq", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.locator('a[href^="mailto:omoleusuangbon@gmail.com"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a[href*="calendly.com/omoleusuangbon"]').first(),
    ).toBeVisible();
    await expect(page.locator("details")).not.toHaveCount(0);
  });

  test("all content images have non-empty alt text", async ({ page }) => {
    await page.goto("/work");
    const imgs = page.locator("main img");
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      expect(await imgs.nth(i).getAttribute("alt")).toBeTruthy();
    }
  });

  test("no horizontal scroll on a small phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
