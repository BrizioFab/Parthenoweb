const { test, expect, devices } = require('@playwright/test');
const path = require('path');

test.use({ ...devices['iPhone 12'] });
test('carousel swipe works on mobile', async ({ page }) => {
  const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(file);

  const track = page.locator('.carousel-track');
  const firstCard = page.locator('.carousel-track .service-card').first();
  await expect(firstCard).toBeVisible();

  // Get initial transform
  const initialTransform = await track.evaluate(node => getComputedStyle(node).transform);


  // Simula swipe sinistra con mouse events (drag) su mobile emulato
  const trackBox = await track.boundingBox();
  const y = trackBox.y + trackBox.height / 2;
  const startX = trackBox.x + trackBox.width * 0.7;
  const endX = trackBox.x + trackBox.width * 0.2;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 10 });
  await page.mouse.up();

  // Wait for transition
  await page.waitForTimeout(600);
  const afterTransform = await track.evaluate(node => getComputedStyle(node).transform);

  expect(afterTransform).not.toBe(initialTransform);
});

// Testing Github
