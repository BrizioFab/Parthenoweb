const { test, expect } = require('@playwright/test');
const path = require('path');

test('services section is present and cards are visible', async ({ page }) => {
  const file = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(file);

  const cards = page.locator('.service-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toBeVisible();
});
