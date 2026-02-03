const { test, expect } = require('@playwright/test');
const path = require('path');

// Mobile-like viewport test
test('carousel initializes on mobile and autoplay advances', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
  // forward page console logs to test output for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto(file);

  const carousel = page.locator('.services-carousel');
  await expect(carousel).toBeVisible();

  const next = page.locator('.carousel-next');
  await expect(next).toBeVisible();

  // Poll for transform change (up to 8s) to account for autoplay timing
  const track = page.locator('.carousel-track');
  const initialTransform = await track.evaluate(node => getComputedStyle(node).transform || 'none');
  let changed = false;
  const start = Date.now();
  while (Date.now() - start < 8000) {
    const cur = await track.evaluate(node => getComputedStyle(node).transform || 'none');
    if (cur !== initialTransform) { changed = true; break; }
    await page.waitForTimeout(400);
  }
  expect(changed).toBe(true);
});