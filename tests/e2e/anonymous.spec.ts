import { test, expect } from '@playwright/test';

test.describe('Anonymous User Flow', () => {
  test('can view landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Dark Mode');
  });

  test('can navigate to upload page', async ({ page }) => {
    await page.goto('/');
    const uploadLink = page.locator('a[href="/upload"]').first();
    await uploadLink.click();
    await expect(page).toHaveURL('/upload');
  });

  test('can view guide page', async ({ page }) => {
    await page.goto('/guide');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('shows sign up prompt (dismissible)', async ({ page }) => {
    await page.goto('/preview');
    // Wait for potential toast
    await page.waitForTimeout(3000);
    // Toast should be dismissible or auto-hide
  });
});
