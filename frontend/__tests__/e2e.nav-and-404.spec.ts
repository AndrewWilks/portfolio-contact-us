import { test, expect } from '@playwright/test';

test.describe('Navigation and 404', () => {
  test('navigate to contact and show 404 on unknown route', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();

    await page.goto('/not-found-xyz');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to home' })).toBeVisible();
  });
});
